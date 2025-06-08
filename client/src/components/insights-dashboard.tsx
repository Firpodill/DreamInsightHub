import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Mountain, Key, Eye, TrendingUp, Crown, BarChart3 } from 'lucide-react';
import { useDreamInsights, useDreams } from '@/hooks/use-dreams';
import { ArchetypeVisualization } from './archetype-visualization';
import type { ArchetypeFrequency, RecentPattern } from '@/types/dream';

export function InsightsDashboard() {
  const { data: insights, isLoading } = useDreamInsights();
  const { data: dreams = [] } = useDreams();

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

  const getArchetypeColor = (archetype: string) => {
    const colors = {
      'Hero': 'bg-red-600',
      'Shadow': 'bg-gray-600',
      'Self': 'bg-yellow-500',
      'Anima': 'bg-pink-500',
      'Animus': 'bg-blue-500',
      'Wise Old Man': 'bg-purple-500',
      'Mother': 'bg-green-500',
      'Trickster': 'bg-orange-500',
      'default': 'bg-gray-400'
    };
    return colors[archetype as keyof typeof colors] || colors.default;
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
              <h2 className="text-xl font-semibold text-white mb-2">Your Dream Insights</h2>
              {todaysAnalysis ? (
                <div className="bg-gradient-to-r from-red-900/30 to-yellow-900/30 rounded-lg p-3 mt-3 border border-red-700/30">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm font-semibold text-white">Today's AI Analysis</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {todaysAnalysis.analysis}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {todaysAnalysis.archetypes?.slice(0, 3).map((archetype) => (
                      <Badge 
                        key={archetype} 
                        variant="secondary" 
                        className={`text-xs ${getArchetypeColor(archetype)} text-white border-0`}
                      >
                        {archetype}
                      </Badge>
                    ))}
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
                    <div key={item.archetype} className="flex items-center justify-between">
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
                      <Badge key={symbol.symbol} variant="outline" className="text-xs text-green-400 border-green-400">
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
    </div>
  );
}