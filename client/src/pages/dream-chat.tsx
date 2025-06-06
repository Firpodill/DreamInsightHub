import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, BookOpen, Brain, Moon, User } from 'lucide-react';
import { ChatInterface } from '@/components/chat-interface';
import { DreamJournal } from '@/components/dream-journal';
import { InsightsDashboard } from '@/components/insights-dashboard';

export default function DreamChat() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="max-w-md mx-auto bg-white text-gray-900 min-h-screen relative overflow-hidden shadow-2xl">
      {/* Mystical Header */}
      <header className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white p-6 sticky top-0 z-50 shadow-2xl">
        {/* Starry background effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-4 right-8 w-1 h-1 bg-blue-200 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-6 left-12 w-0.5 h-0.5 bg-purple-200 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-3 right-16 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/40 animate-float">
                <Moon className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                DreamWeaver
              </h1>
              <p className="text-sm text-blue-200 font-medium">Jung's Wisdom</p>
            </div>
          </div>
          <button className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20">
            <User className="w-6 h-6 text-white" />
          </button>
        </div>
        
        {/* Glowing bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
      </header>

      {/* Enhanced Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-[calc(100vh-96px)]">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-slate-50 to-purple-50 border-b border-purple-100 rounded-none h-auto shadow-sm">
          <TabsTrigger 
            value="chat" 
            className="flex items-center space-x-2 py-4 px-4 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700 data-[state=active]:bg-white/80 rounded-none transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Dream</span>
          </TabsTrigger>
          <TabsTrigger 
            value="journal"
            className="flex items-center space-x-2 py-4 px-4 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700 data-[state=active]:bg-white/80 rounded-none transition-all duration-200"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Journal</span>
          </TabsTrigger>
          <TabsTrigger 
            value="insights"
            className="flex items-center space-x-2 py-4 px-4 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700 data-[state=active]:bg-white/80 rounded-none transition-all duration-200"
          >
            <Brain className="w-4 h-4" />
            <span className="text-sm font-medium">Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col m-0">
          <ChatInterface />
        </TabsContent>

        <TabsContent value="journal" className="flex-1 overflow-y-auto m-0">
          <DreamJournal />
        </TabsContent>

        <TabsContent value="insights" className="flex-1 overflow-y-auto m-0">
          <InsightsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
