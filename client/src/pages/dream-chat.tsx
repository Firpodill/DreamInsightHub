import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, BookOpen, Brain, Moon, User } from 'lucide-react';
import { ChatInterface } from '@/components/chat-interface';
import { DreamJournal } from '@/components/dream-journal';
import { InsightsDashboard } from '@/components/insights-dashboard';

export default function DreamChat() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header with spacing */}
      <header className="relative z-30 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <Moon className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-white">TODAY</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-white">PROFILE</span>
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </header>

      <ChatInterface />
    </div>
  );
}
