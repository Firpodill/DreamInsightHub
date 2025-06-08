import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Mountain, Key, Eye, TrendingUp, Crown, BarChart3 } from 'lucide-react';
import { useDreamInsights, useDreams } from '@/hooks/use-dreams';
import { ArchetypeVisualization } from './archetype-visualization';
import { EnhancedVoiceButton } from './enhanced-voice-button';
import { SymbolDefinitionModal } from './symbol-definition-modal';
import { useState } from 'react';
import type { ArchetypeFrequency, RecentPattern } from '@/types/dream';

export function InsightsDashboard() {
  const { data: insights, isLoading } = useDreamInsights();
  const { data: dreams = [] } = useDreams();
  const [symbolModalOpen, setSymbolModalOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [symbolType, setSymbolType] = useState<'archetype' | 'symbol'>('archetype');

  // Archetype color mapping from Complete Archetype Spectrum
  const archetypeColors: Record<string, string> = {
    "The Hero": "#dc2626",
    "Hero": "#dc2626",
    "The Ruler": "#7c2d12", 
    "Ruler": "#7c2d12",
    "The Lover": "#be185d",
    "Lover": "#be185d", 
    "The Sage": "#1e40af",
    "Sage": "#1e40af",
    "The Shadow": "#6b7280",
    "Shadow": "#6b7280",
    "The Innocent": "#eab308",
    "Innocent": "#eab308",
    "The Anima": "#8b5cf6",
    "Anima": "#8b5cf6",
    "The Animus": "#8b5cf6",
    "Animus": "#8b5cf6",
    "The Self": "#22d3ee",
    "Self": "#22d3ee",
    "The Trickster": "#f97316",
    "Trickster": "#f97316",
    "The Mother": "#ec4899",
    "Mother": "#ec4899",
    "The Wise Old Man": "#1e40af",
    "Wise Old Man": "#1e40af",
    "The Wise Old Woman": "#1e40af",
    "Wise Old Woman": "#1e40af"
  };

  const getArchetypeColor = (archetype: string): string => {
    return archetypeColors[archetype] || "#6b7280";
  };

  const getPatternIcon = (iconName: string) => {
    const icons = {
      mountain: Mountain,
      key: Key,
      eye: Eye,
      default: Brain
    };
    const IconComponent = icons[iconName as keyof typeof icons] || icons.default;
    return <IconComponent className="w-4 h-4" />;
  };



  // Get today's dream analysis
  const getTodaysAnalysis = () => {
    const today = new Date();
    const todayStr = today.toDateString();
    
    const todaysDreams = dreams.filter(dream => {
      const dreamDate = new Date(dream.createdAt);
      return dreamDate.toDateString() === todayStr && dream.analysis;
    });
    
    return todaysDreams.length > 0 ? todaysDreams[todaysDreams.length - 1] : null;
  };

  const todaysAnalysis = getTodaysAnalysis();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <div className="h-6 bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-gray-900 border-gray-700 animate-pulse">
            <CardContent className="p-4">
              <div className="h-5 bg-gray-700 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded w-4/5"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-center py-8">
        <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-300">No insights available yet</p>
        <p className="text-sm text-gray-400 mt-1">Record some dreams to generate insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-gray-700">
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="archetypes" className="text-white data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Crown className="w-4 h-4 mr-2" />
            Archetypes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="space-y-4">
            {/* Header with Today's Analysis */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-white">Your Dream Insights</h2>
                {todaysAnalysis?.analysis && typeof todaysAnalysis.analysis === 'string' && (
                  <EnhancedVoiceButton 
                    text={todaysAnalysis.analysis}
                    variant="outline"
                    size="sm"
                    className="text-gray-300 border-gray-600 hover:bg-gray-800"
                  />
                )}
              </div>
              {todaysAnalysis ? (
                <div className="bg-gradient-to-r from-red-900/30 to-yellow-900/30 rounded-lg p-3 mt-3 border border-red-700/30">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm font-semibold text-white">Today's Jungian Dream Analysis</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {todaysAnalysis.analysis}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {todaysAnalysis.archetypes?.slice(0, 3).map((archetype) => {
                      const color = getArchetypeColor(archetype);
                      return (
                        <Badge 
                          key={archetype} 
                          className="text-xs border-0 cursor-pointer hover:opacity-80 transition-opacity px-3 py-1 rounded-full font-medium"
                          style={{
                            color: color,
                            backgroundColor: `${color}30`,
                            border: `1px solid ${color}60`
                          }}
                          onClick={() => {
                            setSelectedSymbol(archetype);
                            setSymbolType('archetype');
                            setSymbolModalOpen(true);
                          }}
                        >
                          {archetype}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Discover patterns in your unconscious mind</p>
              )}
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-lg font-semibold text-white">{insights.totalDreams}</div>
                  <div className="text-xs text-gray-400">Dreams Recorded</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-lg font-semibold text-white">{insights.dreamStreak}</div>
                  <div className="text-xs text-gray-400">Day Streak</div>
                </CardContent>
              </Card>
            </div>

            {/* Archetype Chart */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-medium text-white mb-4">Archetype Frequency</h3>
                <div className="space-y-3">
                  {insights.archetypeFrequencies.slice(0, 5).map((item: ArchetypeFrequency) => (
                    <div 
                      key={item.archetype} 
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-800/50 rounded p-2 transition-colors"
                      onClick={() => {
                        setSelectedSymbol(item.archetype);
                        setSymbolType('archetype');
                        setSymbolModalOpen(true);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 ${getArchetypeColor(item.archetype)} rounded`}></div>
                        <span className="text-sm font-medium text-white">{item.archetype}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={item.frequency} className="w-20 h-2" />
                        <span className="text-sm text-gray-400 w-8">{item.frequency}%</span>
                      </div>
                    </div>
                  ))}
                  {insights.archetypeFrequencies.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      No archetypes detected yet. Record more dreams for analysis.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Patterns */}
            {insights.recentPatterns.length > 0 && (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="font-medium text-white mb-4">Recent Patterns</h3>
                  <div className="space-y-3">
                    {insights.recentPatterns.map((pattern: RecentPattern, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-purple-900/20 rounded-xl border border-purple-700/30">
                        <div className="text-purple-400 mt-1">
                          {getPatternIcon(pattern.icon)}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">{pattern.title}</h4>
                          <p className="text-xs text-gray-400">{pattern.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Symbol Insights */}
            {insights.symbolFrequencies.length > 0 && (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="font-medium text-white mb-4">Recurring Symbols</h3>
                  <div className="flex flex-wrap gap-2">
                    {insights.symbolFrequencies.slice(0, 10).map((symbol) => (
                      <Badge 
                        key={symbol.symbol} 
                        variant="outline" 
                        className="text-xs text-green-400 border-green-400 cursor-pointer hover:bg-green-400/20 transition-colors"
                        onClick={() => {
                          setSelectedSymbol(symbol.symbol);
                          setSymbolType('symbol');
                          setSymbolModalOpen(true);
                        }}
                      >
                        {symbol.symbol} ({symbol.count})
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="archetypes" className="mt-6">
          <ArchetypeVisualization />
        </TabsContent>
      </Tabs>

      {/* Symbol Definition Modal */}
      <SymbolDefinitionModal 
        open={symbolModalOpen}
        onClose={() => setSymbolModalOpen(false)}
        symbol={selectedSymbol}
        type={symbolType}
      />
    </div>
  );
}