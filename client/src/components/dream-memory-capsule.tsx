import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Archive, 
  Search, 
  Calendar, 
  Clock, 
  Brain, 
  Star, 
  Filter,
  Eye,
  Volume2,
  Download,
  Share2,
  Tag,
  Layers,
  BarChart3,
  Sparkles,
  Moon,
  Sun,
  Heart,
  Zap,
  Trophy,
  Globe
} from 'lucide-react';
import { useDreams } from '@/hooks/use-dreams';
import { useNaturalVoice } from '@/hooks/use-natural-voice';
import type { Dream } from '@shared/schema';

interface DreamCapsule {
  id: string;
  name: string;
  description: string;
  dreams: Dream[];
  tags: string[];
  createdAt: Date;
  lastAccessed: Date;
  isStarred: boolean;
  color: string;
  analytics: {
    totalDreams: number;
    averageIntensity: number;
    commonArchetypes: string[];
    emotionalTrends: string[];
    timePatterns: string[];
  };
}

interface MemoryFilter {
  dateRange: 'all' | 'week' | 'month' | 'year';
  emotionalTone: 'all' | 'positive' | 'negative' | 'neutral';
  archetypes: string[];
  intensity: number[];
  searchQuery: string;
}

export function DreamMemoryCapsule() {
  const [capsules, setCapsules] = useState<DreamCapsule[]>([]);
  const [selectedCapsule, setSelectedCapsule] = useState<DreamCapsule | null>(null);
  const [isCreatingCapsule, setIsCreatingCapsule] = useState(false);
  const [newCapsuleName, setNewCapsuleName] = useState('');
  const [newCapsuleDescription, setNewCapsuleDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#8B5CF6');
  const [filter, setFilter] = useState<MemoryFilter>({
    dateRange: 'all',
    emotionalTone: 'all',
    archetypes: [],
    intensity: [1, 10],
    searchQuery: ''
  });
  const [viewMode, setViewMode] = useState<'grid' | 'timeline' | 'analytics'>('grid');
  
  const { data: dreams = [] } = useDreams();
  const { speak, stop, isPlaying } = useNaturalVoice();

  // Load capsules from localStorage
  useEffect(() => {
    const savedCapsules = localStorage.getItem('dreamMemoryCapsules');
    if (savedCapsules) {
      setCapsules(JSON.parse(savedCapsules).map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        lastAccessed: new Date(c.lastAccessed)
      })));
    }
  }, []);

  // Save capsules to localStorage
  useEffect(() => {
    if (capsules.length > 0) {
      localStorage.setItem('dreamMemoryCapsules', JSON.stringify(capsules));
    }
  }, [capsules]);

  const capsuleColors = [
    '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', 
    '#EF4444', '#3B82F6', '#8B5A2B', '#6366F1'
  ];

  const createCapsule = () => {
    if (!newCapsuleName.trim()) return;

    const newCapsule: DreamCapsule = {
      id: Date.now().toString(),
      name: newCapsuleName,
      description: newCapsuleDescription,
      dreams: [],
      tags: [],
      createdAt: new Date(),
      lastAccessed: new Date(),
      isStarred: false,
      color: selectedColor,
      analytics: {
        totalDreams: 0,
        averageIntensity: 0,
        commonArchetypes: [],
        emotionalTrends: [],
        timePatterns: []
      }
    };

    setCapsules(prev => [...prev, newCapsule]);
    setNewCapsuleName('');
    setNewCapsuleDescription('');
    setIsCreatingCapsule(false);
  };

  const addDreamToCapsule = (capsuleId: string, dream: Dream) => {
    setCapsules(prev => prev.map(capsule => {
      if (capsule.id === capsuleId) {
        const updatedDreams = [...capsule.dreams, dream];
        return {
          ...capsule,
          dreams: updatedDreams,
          lastAccessed: new Date(),
          analytics: calculateAnalytics(updatedDreams)
        };
      }
      return capsule;
    }));
  };

  const calculateAnalytics = (dreams: Dream[]) => {
    if (dreams.length === 0) {
      return {
        totalDreams: 0,
        averageIntensity: 0,
        commonArchetypes: [],
        emotionalTrends: [],
        timePatterns: []
      };
    }

    const archetypes: { [key: string]: number } = {};
    const emotions: { [key: string]: number } = {};
    const timePatterns: { [key: string]: number } = {};

    dreams.forEach(dream => {
      if (dream.analysis) {
        let parsedAnalysis;
        try {
          parsedAnalysis = typeof dream.analysis === 'string' 
            ? JSON.parse(dream.analysis) 
            : dream.analysis;
        } catch {
          return; // Skip if analysis can't be parsed
        }

        // Count archetypes
        if (Array.isArray(parsedAnalysis.archetypes)) {
          parsedAnalysis.archetypes.forEach((archetype: string) => {
            archetypes[archetype] = (archetypes[archetype] || 0) + 1;
          });
        }

        // Count emotions
        if (typeof parsedAnalysis.emotionalTone === 'string') {
          emotions[parsedAnalysis.emotionalTone] = (emotions[parsedAnalysis.emotionalTone] || 0) + 1;
        }

        // Time patterns
        const hour = new Date(dream.createdAt).getHours();
        const timeSlot = hour < 6 ? 'Early Morning' : 
                      hour < 12 ? 'Morning' :
                      hour < 18 ? 'Afternoon' : 'Evening';
        timePatterns[timeSlot] = (timePatterns[timeSlot] || 0) + 1;
      }
    });

    return {
      totalDreams: dreams.length,
      averageIntensity: 7.5, // Could be calculated from dream content analysis
      commonArchetypes: Object.entries(archetypes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([archetype]) => archetype),
      emotionalTrends: Object.entries(emotions)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([emotion]) => emotion),
      timePatterns: Object.entries(timePatterns)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([pattern]) => pattern)
    };
  };

  const toggleStarCapsule = (capsuleId: string) => {
    setCapsules(prev => prev.map(capsule => 
      capsule.id === capsuleId 
        ? { ...capsule, isStarred: !capsule.isStarred }
        : capsule
    ));
  };

  const exportCapsule = (capsule: DreamCapsule) => {
    const exportData = {
      ...capsule,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dream-capsule-${capsule.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const playCapsulesummary = (capsule: DreamCapsule) => {
    const summaryText = `
      Memory Capsule: ${capsule.name}. 
      Description: ${capsule.description}. 
      Contains ${capsule.analytics.totalDreams} dreams. 
      Common archetypes: ${capsule.analytics.commonArchetypes.join(', ')}. 
      Emotional trends: ${capsule.analytics.emotionalTrends.join(', ')}.
    `;
    
    if (isPlaying) {
      stop();
    } else {
      speak(summaryText);
    }
  };

  const filteredDreams = dreams.filter(dream => {
    if (filter.searchQuery && !dream.content.toLowerCase().includes(filter.searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filter.dateRange !== 'all') {
      const dreamDate = new Date(dream.createdAt);
      const now = new Date();
      const daysDiff = (now.getTime() - dreamDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (filter.dateRange === 'week' && daysDiff > 7) return false;
      if (filter.dateRange === 'month' && daysDiff > 30) return false;
      if (filter.dateRange === 'year' && daysDiff > 365) return false;
    }
    
    return true;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Archive className="w-8 h-8 mr-3" />
              Dream Memory Capsules
            </h1>
            <p className="text-purple-200">
              Preserve and organize your dream experiences into meaningful collections
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="text-white"
              >
                <Layers className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('timeline')}
                className="text-white"
              >
                <Clock className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'analytics' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('analytics')}
                className="text-white"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
            
            <Dialog open={isCreatingCapsule} onOpenChange={setIsCreatingCapsule}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Archive className="w-4 h-4 mr-2" />
                  Create Capsule
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Memory Capsule</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Capsule name..."
                    value={newCapsuleName}
                    onChange={(e) => setNewCapsuleName(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <Input
                    placeholder="Description (optional)..."
                    value={newCapsuleDescription}
                    onChange={(e) => setNewCapsuleDescription(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  
                  <div>
                    <label className="text-white text-sm mb-2 block">Capsule Color</label>
                    <div className="flex space-x-2">
                      {capsuleColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            selectedColor === color ? 'border-white' : 'border-gray-600'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreatingCapsule(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createCapsule} className="bg-purple-600 hover:bg-purple-700">
                      Create
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white/10 backdrop-blur-sm border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-purple-200" />
                <Input
                  placeholder="Search dreams..."
                  value={filter.searchQuery}
                  onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-48 bg-white/20 border-purple-400/30 text-white"
                />
              </div>
              
              <Select
                value={filter.dateRange}
                onValueChange={(value) => setFilter(prev => ({ ...prev, dateRange: value as any }))}
              >
                <SelectTrigger className="w-32 bg-white/20 border-purple-400/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filter.emotionalTone}
                onValueChange={(value) => setFilter(prev => ({ ...prev, emotionalTone: value as any }))}
              >
                <SelectTrigger className="w-32 bg-white/20 border-purple-400/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Emotions</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capsules.map(capsule => (
              <Card
                key={capsule.id}
                className="bg-white/10 backdrop-blur-sm border-purple-500/30 hover:bg-white/15 transition-all cursor-pointer"
                onClick={() => setSelectedCapsule(capsule)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: capsule.color }}
                      />
                      <div>
                        <CardTitle className="text-white text-lg">{capsule.name}</CardTitle>
                        <p className="text-purple-200 text-sm">{capsule.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStarCapsule(capsule.id);
                        }}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        <Star className={`w-4 h-4 ${capsule.isStarred ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-200">Dreams</span>
                      <Badge variant="secondary">{capsule.analytics.totalDreams}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-purple-200 text-sm">Common Archetypes</span>
                      <div className="flex flex-wrap gap-1">
                        {capsule.analytics.commonArchetypes.slice(0, 3).map(archetype => (
                          <Badge key={archetype} variant="outline" className="text-xs">
                            {archetype}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-purple-300">
                      <span>Created {formatDate(capsule.createdAt)}</span>
                      <span>Last accessed {formatDate(capsule.lastAccessed)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          playCapsulesummary(capsule);
                        }}
                        className="flex-1"
                      >
                        <Volume2 className="w-3 h-3 mr-1" />
                        Play
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          exportCapsule(capsule);
                        }}
                        className="flex-1"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dreams Available for Adding to Capsules */}
        {capsules.length > 0 && (
          <Card className="mt-8 bg-white/10 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Available Dreams</CardTitle>
              <p className="text-purple-200">Click a dream to add it to a capsule</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDreams.slice(0, 6).map(dream => (
                  <Card key={dream.id} className="bg-gray-800 border-gray-600">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="text-white font-medium">{dream.title}</h4>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {dream.content.slice(0, 100)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {formatDate(new Date(dream.createdAt))}
                          </span>
                          <Select
                            onValueChange={(capsuleId) => addDreamToCapsule(capsuleId, dream)}
                          >
                            <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Add to..." />
                            </SelectTrigger>
                            <SelectContent>
                              {capsules.map(capsule => (
                                <SelectItem key={capsule.id} value={capsule.id}>
                                  {capsule.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Capsule Detail Modal */}
        {selectedCapsule && (
          <Dialog open={!!selectedCapsule} onOpenChange={() => setSelectedCapsule(null)}>
            <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: selectedCapsule.color }}
                  />
                  {selectedCapsule.name}
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="dreams" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                  <TabsTrigger value="dreams" className="text-white">Dreams</TabsTrigger>
                  <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
                  <TabsTrigger value="timeline" className="text-white">Timeline</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dreams" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                    {selectedCapsule.dreams.map(dream => (
                      <Card key={dream.id} className="bg-gray-800 border-gray-600">
                        <CardContent className="p-4">
                          <h4 className="text-white font-medium mb-2">{dream.title}</h4>
                          <p className="text-gray-300 text-sm mb-2">
                            {dream.content.slice(0, 200)}...
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{formatDate(new Date(dream.createdAt))}</span>
                            {dream.analysis && Array.isArray(dream.analysis.archetypes) && (
                              <div className="flex space-x-2">
                                {dream.analysis.archetypes.slice(0, 3).map((archetype: string) => (
                                  <Badge key={archetype} variant="outline" className="text-xs">
                                    {archetype}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-gray-800 border-gray-600">
                      <CardContent className="p-4">
                        <h4 className="text-white font-medium mb-2">Overview</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Dreams</span>
                            <span className="text-white">{selectedCapsule.analytics.totalDreams}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Average Intensity</span>
                            <span className="text-white">{selectedCapsule.analytics.averageIntensity}/10</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800 border-gray-600">
                      <CardContent className="p-4">
                        <h4 className="text-white font-medium mb-2">Common Archetypes</h4>
                        <div className="space-y-1">
                          {selectedCapsule.analytics.commonArchetypes.map(archetype => (
                            <Badge key={archetype} variant="secondary" className="mr-2 mb-1">
                              {archetype}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="timeline" className="space-y-4">
                  <div className="space-y-4">
                    {selectedCapsule.dreams
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((dream, index) => (
                      <div key={dream.id} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <Card className="flex-1 bg-gray-800 border-gray-600">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-white font-medium">{dream.title}</h5>
                              <span className="text-xs text-gray-400">
                                {formatDate(new Date(dream.createdAt))}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm">
                              {dream.content.slice(0, 150)}...
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}