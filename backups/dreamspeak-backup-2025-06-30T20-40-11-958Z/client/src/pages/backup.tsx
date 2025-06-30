import { BackupManager } from '@/components/backup-manager';

export default function BackupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
            Dream Backup & Storage
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your dream data with offline storage and backup capabilities
          </p>
        </div>
        
        <BackupManager />
      </div>
    </div>
  );
}