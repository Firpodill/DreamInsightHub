import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Mountain, Key, Eye, TrendingUp, Target } from 'lucide-react';
import { useDreamInsights } from '@/hooks/use-dreams';
import type { ArchetypeFrequency, RecentPattern } from '@/types/dream';

export function InsightsDashboard() {
  const { data: insights, isLoading } = useDreamInsights();

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
      'Hero': 'bg-primary',
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

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-r from-yellow-500/10 to-primary/10 rounded-2xl p-4">
          <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-5 bg-gray-200 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="p-4 text-center py-8">
        <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No insights available yet</p>
        <p className="text-sm text-gray-400 mt-1">Record some dreams to generate insights</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-primary/10 rounded-2xl p-4">
        <h2 className="font-serif text-xl font-semibold text-gray-800 mb-2">Your Insights</h2>
        <p className="text-sm text-gray-600">Discover patterns in your unconscious mind</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-primary/10 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div className="text-lg font-semibold text-gray-800">{insights.totalDreams}</div>
            <div className="text-xs text-gray-500">Dreams Recorded</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-green-500/10 rounded-full mx-auto mb-2 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-lg font-semibold text-gray-800">{insights.dreamStreak}</div>
            <div className="text-xs text-gray-500">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Archetype Chart */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-800 mb-4">Archetype Frequency</h3>
          <div className="space-y-3">
            {insights.archetypeFrequencies.slice(0, 5).map((item: ArchetypeFrequency) => (
              <div key={item.archetype} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${getArchetypeColor(item.archetype)} rounded`}></div>
                  <span className="text-sm font-medium">{item.archetype}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={item.frequency} className="w-20 h-2" />
                  <span className="text-sm text-gray-600 w-8">{item.frequency}%</span>
                </div>
              </div>
            ))}
            {insights.archetypeFrequencies.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No archetype data available yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Individuation Progress */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-800 mb-4">Individuation Journey</h3>
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div 
                className="absolute inset-0 w-24 h-24 border-4 border-primary rounded-full transition-all duration-300"
                style={{
                  borderTopColor: 'transparent',
                  transform: `rotate(${(insights.individuationProgress / 100) * 360 - 90}deg)`
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {insights.individuationProgress}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">Integration Level</p>
            <p className="text-xs text-gray-500">
              {insights.individuationProgress >= 70 
                ? "Strong progress in understanding your unconscious patterns"
                : insights.individuationProgress >= 40
                ? "Making steady progress on your individuation journey"
                : "Beginning to explore your unconscious patterns"
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Patterns */}
      {insights.recentPatterns.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-4">Recent Patterns</h3>
            <div className="space-y-3">
              {insights.recentPatterns.map((pattern: RecentPattern, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-xl">
                  <div className="text-primary mt-1">
                    {getPatternIcon(pattern.icon)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">{pattern.title}</h4>
                    <p className="text-xs text-gray-600">{pattern.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symbol Insights */}
      {insights.symbolFrequencies.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-4">Recurring Symbols</h3>
            <div className="flex flex-wrap gap-2">
              {insights.symbolFrequencies.slice(0, 10).map((symbol) => (
                <Badge key={symbol.symbol} variant="secondary" className="text-xs">
                  {symbol.symbol} ({symbol.count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
