import { Dream, InsertDream } from '@shared/schema';

interface OfflineDream extends InsertDream {
  tempId: string;
  timestamp: number;
  synced: boolean;
}

interface DreamBackup {
  version: string;
  exportDate: string;
  totalDreams: number;
  dreams: Dream[];
  metadata: {
    userId: number;
    appVersion: string;
  };
}

class OfflineStorageManager {
  private readonly STORAGE_KEY = 'dreamspeak_offline_dreams';
  private readonly BACKUP_KEY = 'dreamspeak_dream_backup';
  private readonly MAX_OFFLINE_DREAMS = 100;

  // Store dream offline when no internet connection
  storeDreamOffline(dream: InsertDream): string {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const offlineDream: OfflineDream = {
      ...dream,
      tempId,
      timestamp: Date.now(),
      synced: false
    };

    const existingDreams = this.getOfflineDreams();
    existingDreams.push(offlineDream);

    // Keep only the most recent dreams to prevent storage overflow
    if (existingDreams.length > this.MAX_OFFLINE_DREAMS) {
      existingDreams.splice(0, existingDreams.length - this.MAX_OFFLINE_DREAMS);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingDreams));
    return tempId;
  }

  // Get all offline dreams
  getOfflineDreams(): OfflineDream[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading offline dreams:', error);
      return [];
    }
  }

  // Get unsynced dreams for upload when back online
  getUnsyncedDreams(): OfflineDream[] {
    return this.getOfflineDreams().filter(dream => !dream.synced);
  }

  // Mark dream as synced after successful upload
  markDreamSynced(tempId: string, serverId?: number): void {
    const dreams = this.getOfflineDreams();
    const dreamIndex = dreams.findIndex(d => d.tempId === tempId);
    
    if (dreamIndex !== -1) {
      dreams[dreamIndex].synced = true;
      if (serverId) {
        (dreams[dreamIndex] as any).serverId = serverId;
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dreams));
    }
  }

  // Remove synced dreams after successful upload
  clearSyncedDreams(): void {
    const unsyncedDreams = this.getUnsyncedDreams();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(unsyncedDreams));
  }

  // Check if device is online
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Create full backup of all dreams
  createBackup(dreams: Dream[], userId: number = 1): string {
    const backup: DreamBackup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      totalDreams: dreams.length,
      dreams: dreams,
      metadata: {
        userId,
        appVersion: '1.0.0'
      }
    };

    // Store backup in localStorage as well
    localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
    
    return JSON.stringify(backup, null, 2);
  }

  // Export dreams as downloadable JSON file
  exportDreamsAsFile(dreams: Dream[], userId: number = 1): void {
    const backupData = this.createBackup(dreams, userId);
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dreamspeak_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  // Import dreams from backup file
  async importDreamsFromFile(file: File): Promise<Dream[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const backupData: DreamBackup = JSON.parse(event.target?.result as string);
          
          if (!backupData.dreams || !Array.isArray(backupData.dreams)) {
            throw new Error('Invalid backup file format');
          }
          
          resolve(backupData.dreams);
        } catch (error) {
          reject(new Error('Failed to parse backup file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read backup file'));
      reader.readAsText(file);
    });
  }

  // Get storage usage statistics
  getStorageStats(): { used: number; total: number; percentage: number } {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length;
        }
      }
      
      // Estimate 5MB as typical localStorage limit
      const estimatedLimit = 5 * 1024 * 1024;
      
      return {
        used: totalSize,
        total: estimatedLimit,
        percentage: Math.round((totalSize / estimatedLimit) * 100)
      };
    } catch (error) {
      return { used: 0, total: 0, percentage: 0 };
    }
  }

  // Clear all offline data (for troubleshooting)
  clearAllOfflineData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.BACKUP_KEY);
  }
}

export const offlineStorage = new OfflineStorageManager();