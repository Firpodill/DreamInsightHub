import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Brain, Image as ImageIcon, Calendar } from 'lucide-react';
import { useDreams, useSearchDreams } from '@/hooks/use-dreams';
import { VoiceSearch } from '@/components/voice-search';
import type { Dream } from '@shared/schema';

export function DreamJournal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const { data: allDreams = [], isLoading } = useDreams();
  const { data: searchResults = [] } = useSearchDreams(searchQuery);

  const dreams = searchQuery.trim() ? searchResults : allDreams;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getArchetypeColor = (archetype: string) => {
    const colors = {
      'Hero': 'bg-primary/10 text-primary',
      'Shadow': 'bg-gray-600/10 text-gray-700',
      'Self': 'bg-yellow-500/10 text-yellow-700',
      'Anima': 'bg-pink-500/10 text-pink-700',
      'Animus': 'bg-blue-500/10 text-blue-700',
      'Wise Old Man': 'bg-purple-500/10 text-purple-700',
      'Mother': 'bg-green-500/10 text-green-700',
      'Trickster': 'bg-orange-500/10 text-orange-700',
      'default': 'bg-gray-100 text-gray-700'
    };
    return colors[archetype as keyof typeof colors] || colors.default;
  };

  const renderDreamEntry = (dream: Dream) => (
    <Card key={dream.id} className="overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium text-gray-800 line-clamp-1">{dream.title}</h3>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(dream.createdAt.toString())}
            </p>
          </div>
          <div className="flex flex-wrap gap-1 max-w-[120px]">
            {dream.archetypes?.slice(0, 2).map((archetype) => (
              <Badge 
                key={archetype} 
                variant="secondary" 
                className={`text-xs ${getArchetypeColor(archetype)}`}
              >
                {archetype}
              </Badge>
            ))}
            {dream.archetypes && dream.archetypes.length > 2 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500">
                +{dream.archetypes.length - 2}
              </Badge>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {dream.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <Brain className="w-3 h-3 mr-1" />
              {dream.analysis ? 'Analyzed' : 'Pending'}
            </span>
            <span className={`flex items-center ${dream.imageUrl ? 'text-green-600' : 'text-gray-300'}`}>
              <ImageIcon className="w-3 h-3 mr-1" />
              {dream.imageUrl ? 'Visualized' : 'No image'}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="text-primary text-sm font-medium h-auto p-0">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-4">
        <h2 className="font-serif text-xl font-semibold text-gray-800 mb-2">Dream Journal</h2>
        <p className="text-sm text-gray-600">Track your dream patterns and insights over time</p>
      </div>

      {/* Daily Jung Quote */}
      <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-300 italic mb-1">
            "Your vision becomes clear when you look into your heart. Who looks outside, dreams. Who looks inside, awakens."
          </p>
          <p className="text-xs text-gray-500">— Carl Jung</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search your dreams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-3 px-4 pl-10 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary/50"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        {/* Voice Search */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            Or try voice search with commands like "Find my dreams about flying"
          </p>
          <VoiceSearch 
            inline={true}
            onDreamSelect={(dream) => {
              setSelectedDream(dream);
              setSearchQuery(dream.content.substring(0, 50));
            }}
          />
        </div>
      </div>

      {/* Dream Entries */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-gray-500 mt-2">Loading dreams...</p>
          </div>
        ) : dreams.length === 0 ? (
          <div className="text-center py-8">
            {searchQuery.trim() ? (
              <div>
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No dreams found matching "{searchQuery}"</p>
                <p className="text-sm text-gray-400 mt-1">Try different keywords or check the spelling</p>
              </div>
            ) : (
              <div>
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No dreams recorded yet</p>
                <p className="text-sm text-gray-400 mt-1">Start by sharing a dream in the chat tab</p>
              </div>
            )}
          </div>
        ) : (
          dreams.map(renderDreamEntry)
        )}
      </div>

      {/* Quick Stats */}
      {dreams.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-6">
          <h3 className="font-medium text-gray-800 mb-3">Journal Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-primary">{allDreams.length}</div>
              <div className="text-xs text-gray-500">Total Dreams</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-primary">
                {allDreams.filter(d => d.analysis).length}
              </div>
              <div className="text-xs text-gray-500">Analyzed</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-primary">
                {allDreams.filter(d => d.imageUrl).length}
              </div>
              <div className="text-xs text-gray-500">Visualized</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
