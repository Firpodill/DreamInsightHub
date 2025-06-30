import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  Upload, 
  HardDrive, 
  Cloud, 
  AlertCircle, 
  CheckCircle,
  Wifi,
  WifiOff 
} from 'lucide-react';
import { offlineStorage } from '@/lib/offline-storage';
import { useOfflineSync } from '@/hooks/use-offline-sync';
import { useToast } from '@/hooks/use-toast';
import { Dream } from '@shared/schema';

export function BackupManager() {
  const [importFile, setImportFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { isOnline, syncInProgress, offlineCount } = useOfflineSync();

  // Get all dreams for backup
  const { data: dreams = [] } = useQuery<Dream[]>({
    queryKey: ['/api/dreams'],
    enabled: isOnline
  });

  const storageStats = offlineStorage.getStorageStats();

  const handleExportBackup = () => {
    try {
      offlineStorage.exportDreamsAsFile(dreams, 1);
      toast({
        title: "Backup Created",
        description: `Successfully exported ${dreams.length} dreams to your downloads folder.`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to create backup file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImportBackup = async () => {
    if (!importFile) return;

    try {
      const importedDreams = await offlineStorage.importDreamsFromFile(importFile);
      
      toast({
        title: "Backup Loaded",
        description: `Found ${importedDreams.length} dreams in backup file. Note: Import functionality requires server integration.`,
        variant: "default"
      });
      
      setImportFile(null);
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Invalid backup file format. Please select a valid DreamSpeak backup file.",
        variant: "destructive"
      });
    }
  };

  const handleClearOfflineData = () => {
    if (confirm('Are you sure you want to clear all offline data? This cannot be undone.')) {
      offlineStorage.clearAllOfflineData();
      toast({
        title: "Offline Data Cleared",
        description: "All offline dreams and backups have been removed.",
        variant: "default"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5 text-green-400" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-red-400" />
                Offline
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">
                {isOnline 
                  ? "Dreams will be saved to the cloud immediately" 
                  : "Dreams are being saved locally and will sync when you're back online"
                }
              </p>
              {offlineCount > 0 && (
                <Badge variant="outline" className="mt-2 text-yellow-400 border-yellow-400">
                  {offlineCount} dreams pending sync
                </Badge>
              )}
            </div>
            {syncInProgress && (
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Syncing...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Storage Statistics */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Local Storage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Storage Used</span>
                <span className="text-white">{storageStats.percentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    storageStats.percentage > 80 ? 'bg-red-500' : 
                    storageStats.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(storageStats.percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {Math.round(storageStats.used / 1024)} KB used of ~5 MB available
              </p>
            </div>
            
            {storageStats.percentage > 80 && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-red-300 text-sm">
                  Storage nearly full. Consider clearing old offline data.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Backup Export */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Dreams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300 text-sm">
            Create a backup file containing all your dreams and analyses. 
            This file can be imported later to restore your data.
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{dreams.length} dreams ready for backup</p>
              <p className="text-gray-400 text-xs">Includes dream text, analyses, and timestamps</p>
            </div>
            <Button 
              onClick={handleExportBackup}
              className="bg-green-600 hover:bg-green-700"
              disabled={dreams.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup Import */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Dreams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300 text-sm">
            Restore dreams from a previously exported backup file.
          </p>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="backup-file" className="text-gray-300">
                Select Backup File
              </Label>
              <Input
                id="backup-file"
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="bg-gray-800 border-gray-600 text-white mt-1"
              />
            </div>
            
            <Button 
              onClick={handleImportBackup}
              disabled={!importFile}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300 text-sm">
            Clear local storage if you're experiencing sync issues or need to free up space.
          </p>
          
          <Button 
            onClick={handleClearOfflineData}
            variant="destructive"
            size="sm"
          >
            Clear Offline Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}