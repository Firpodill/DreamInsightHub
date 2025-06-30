import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { offlineStorage } from '@/lib/offline-storage';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineDreams();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "Dreams will be saved locally and synced when you're back online.",
        variant: "default"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync offline dreams when back online
  const syncOfflineDreams = async () => {
    const unsyncedDreams = offlineStorage.getUnsyncedDreams();
    
    if (unsyncedDreams.length === 0) return;

    setSyncInProgress(true);
    let syncedCount = 0;

    try {
      for (const dream of unsyncedDreams) {
        try {
          const response = await apiRequest('POST', '/api/dreams/analyze', {
            text: dream.content,
            userId: dream.userId
          });

          if (response.ok) {
            const result = await response.json();
            offlineStorage.markDreamSynced(dream.tempId, result.dream?.id);
            syncedCount++;
          }
        } catch (error) {
          console.error('Failed to sync dream:', dream.tempId, error);
        }
      }

      if (syncedCount > 0) {
        offlineStorage.clearSyncedDreams();
        queryClient.invalidateQueries({ queryKey: ['/api/dreams'] });
        
        toast({
          title: "Dreams Synced",
          description: `Successfully synced ${syncedCount} offline dreams.`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Some dreams couldn't be synced. They'll retry next time you're online.",
        variant: "destructive"
      });
    } finally {
      setSyncInProgress(false);
    }
  };

  // Store dream offline
  const storeDreamOffline = useMutation({
    mutationFn: async (dreamText: string) => {
      const tempId = offlineStorage.storeDreamOffline({
        title: `Dream from ${new Date().toLocaleDateString()}`,
        content: dreamText,
        userId: 1
      });
      
      return { tempId, stored: true };
    },
    onSuccess: () => {
      toast({
        title: "Dream Saved Offline",
        description: "Your dream has been saved locally and will sync when you're back online.",
        variant: "default"
      });
    },
    onError: () => {
      toast({
        title: "Storage Error",
        description: "Failed to save dream offline. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    isOnline,
    syncInProgress,
    storeDreamOffline,
    syncOfflineDreams,
    offlineCount: offlineStorage.getUnsyncedDreams().length
  };
}