import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, BookOpen, Brain, Moon, User } from 'lucide-react';
import { ChatInterface } from '@/components/chat-interface';
import { DreamJournal } from '@/components/dream-journal';
import { InsightsDashboard } from '@/components/insights-dashboard';

export default function DreamChat() {
  return (
    <div className="max-w-md mx-auto bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 text-white min-h-screen relative overflow-hidden">
      {/* Header */}
      <header className="text-center py-8 px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <Moon className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-sm font-medium">TODAY</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">PROFILE</span>
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-5xl font-black mb-2" style={{
            background: '#E53E3E',
            color: '#FFFF00',
            WebkitTextStroke: '3px #000000',
            textShadow: '6px 6px 0px #000000',
            letterSpacing: '4px',
            fontFamily: 'Impact, Arial Black, sans-serif',
            transform: 'scale(1.1) rotate(-1deg)',
            transformOrigin: 'center',
            textTransform: 'uppercase',
            filter: 'contrast(1.4) saturate(1.5)',
            padding: '8px 16px',
            borderRadius: '12px',
            border: '4px solid #000000'
          }}>DREAMSPEAK</h1>
          <h2 className="text-lg font-semibold mb-4">JUNGIAN DREAM DECODER</h2>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6">
        <ChatInterface />
      </div>
    </div>
  );
}
