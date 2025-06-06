import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, BookOpen, Brain, Moon, User } from 'lucide-react';
import { ChatInterface } from '@/components/chat-interface';
import { DreamJournal } from '@/components/dream-journal';
import { InsightsDashboard } from '@/components/insights-dashboard';

export default function DreamChat() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="max-w-md mx-auto bg-white text-gray-900 min-h-screen relative overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/90 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-blue-400/50">
              <Moon className="w-4 h-4 text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold">DreamWeaver</h1>
              <p className="text-xs text-purple-200">Jung's Wisdom</p>
            </div>
          </div>
          <button className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors">
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-[calc(100vh-72px)]">
        <TabsList className="grid w-full grid-cols-3 bg-white border-b border-gray-200 rounded-none h-auto">
          <TabsTrigger 
            value="chat" 
            className="flex items-center space-x-2 py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Chat</span>
          </TabsTrigger>
          <TabsTrigger 
            value="journal"
            className="flex items-center space-x-2 py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Journal</span>
          </TabsTrigger>
          <TabsTrigger 
            value="insights"
            className="flex items-center space-x-2 py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
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
