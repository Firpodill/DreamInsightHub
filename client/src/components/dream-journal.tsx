import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Brain, Image as ImageIcon, Calendar, ChevronLeft, ChevronRight, Volume2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useDreams, useSearchDreams } from '@/hooks/use-dreams';
import { useNaturalVoice } from '@/hooks/use-natural-voice';
import { useLocation } from 'wouter';
import { SymbolDefinitionModal } from '@/components/symbol-definition-modal';
import { EnhancedVoiceButton } from '@/components/enhanced-voice-button';
import type { Dream } from '@shared/schema';

export function DreamJournal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [visionBoards, setVisionBoards] = useState<any[]>([]);
  const [isDreamTextExpanded, setIsDreamTextExpanded] = useState(false);
  const [symbolModalOpen, setSymbolModalOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [symbolType, setSymbolType] = useState<'archetype' | 'symbol'>('archetype');
  const { data: allDreams = [], isLoading } = useDreams();
  const { data: searchResults = [] } = useSearchDreams(searchQuery);
  const { speak, stop, isPlaying } = useNaturalVoice();
  const [, setLocation] = useLocation();

  const dreams = searchQuery.trim() ? searchResults : allDreams;

  // Load vision boards
  useEffect(() => {
    const boards = JSON.parse(localStorage.getItem('dreamVisionBoards') || '[]');
    setVisionBoards(boards);
  }, []);

  // Voice playback for dream text using natural voice
  const playDreamText = (dreamText: string) => {
    if (isPlaying) {
      stop();
    } else {
      speak(dreamText);
    }
  };

  const formatDate = (dateString: string, format: 'relative' | 'full' = 'relative') => {
    const date = new Date(dateString);
    
    if (format === 'full') {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      });
    }
    
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

  // Calendar helper functions
  const getDreamsByDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return allDreams.filter(dream => {
      const dreamDate = new Date(dream.createdAt).toISOString().split('T')[0];
      return dreamDate === dateString;
    });
  };

  const getVisionBoardsByDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return visionBoards.filter(board => {
      const boardDate = new Date(board.createdAt).toISOString().split('T')[0];
      return boardDate === dateString;
    });
  };

  const getDreamCountForDate = (date: Date) => {
    const dreams = getDreamsByDate(date);
    const boards = getVisionBoardsByDate(date);
    return dreams.length + boards.length;
  };

  const getMonthName = (monthIndex: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };



  const openSymbolModal = (symbol: string, type: 'archetype' | 'symbol') => {
    setSelectedSymbol(symbol);
    setSymbolType(type);
    setSymbolModalOpen(true);
  };

  const renderCalendarMonth = (monthIndex: number) => {
    const daysInMonth = getDaysInMonth(selectedYear, monthIndex);
    const firstDay = getFirstDayOfMonth(selectedYear, monthIndex);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-1"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, monthIndex, day);
      const dreamCount = getDreamCountForDate(date);
      const isSelected = selectedDate && 
        selectedDate.getFullYear() === selectedYear &&
        selectedDate.getMonth() === monthIndex &&
        selectedDate.getDate() === day;

      days.push(
        <button
          key={day}
          onClick={() => {
            setSelectedDate(date);
            setViewMode('list');
          }}
          className={`
            p-1 text-xs rounded transition-all relative
            ${dreamCount > 0 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }
            ${isSelected ? 'ring-2 ring-yellow-400' : ''}
          `}
        >
          {day}
          {dreamCount > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full text-black text-xs flex items-center justify-center font-bold">
              {dreamCount > 9 ? '9+' : dreamCount}
            </div>
          )}
        </button>
      );
    }

    return (
      <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
        <h3 className="text-sm font-bold mb-2 text-center text-white">
          {getMonthName(monthIndex)}
        </h3>
        <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
          <div className="text-gray-400 font-semibold">S</div>
          <div className="text-gray-400 font-semibold">M</div>
          <div className="text-gray-400 font-semibold">T</div>
          <div className="text-gray-400 font-semibold">W</div>
          <div className="text-gray-400 font-semibold">T</div>
          <div className="text-gray-400 font-semibold">F</div>
          <div className="text-gray-400 font-semibold">S</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  // Filter dreams and vision boards by selected date if in calendar mode
  const filteredDreams = selectedDate && viewMode === 'list' 
    ? getDreamsByDate(selectedDate)
    : dreams;

  const filteredVisionBoards = selectedDate && viewMode === 'list'
    ? getVisionBoardsByDate(selectedDate)
    : [];

  // Create render function for vision boards
  const renderVisionBoardEntry = (board: any) => (
    <Card key={`vision-${board.id}`} className="overflow-hidden border border-purple-200 hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50 to-pink-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <ImageIcon className="w-4 h-4 text-purple-600 mr-2" />
              <h3 className="font-medium text-gray-800 line-clamp-1">{board.title}</h3>
            </div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(board.createdAt)}
            </p>
          </div>
          {board.items?.[0]?.imageUrl && (
            <img 
              src={board.items[0].imageUrl} 
              alt="Vision board preview"
              className="w-16 h-16 object-cover rounded-lg ml-3 border border-purple-200"
            />
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {board.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <ImageIcon className="w-3 h-3 mr-1" />
              Vision Board
            </span>
            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
              {board.items?.length || 0} items
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-purple-600 text-sm font-medium h-auto p-0"
            onClick={() => {
              localStorage.setItem('currentVisionBoardId', board.id);
              setLocation('/vision-board');
            }}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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
            {dream.archetypes?.slice(0, 2).map((archetype, index) => (
              <Badge 
                key={`${dream.id}-entry-archetype-${index}`}
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

        {/* Generated Image */}
        {dream.imageUrl && (
          <div className="mb-3">
            <img 
              src={dream.imageUrl} 
              alt="AI-generated dream visualization"
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}

        {/* Analysis Preview */}
        {dream.analysis && (
          <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg p-3 mb-3 border border-red-200">
            <div className="flex items-center mb-1">
              <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
              <span className="text-sm font-bold text-gray-800">Analysis</span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">{dream.analysis}</p>
          </div>
        )}
        
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
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <EnhancedVoiceButton 
              text={dream.content}
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium h-auto p-0"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDream(dream);
              }}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 space-y-4">
      {/* Dream Details Modal */}
      {selectedDream && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{selectedDream.title}</h2>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(selectedDream.createdAt.toString(), 'full')}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedDream(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Generated Image */}
              {selectedDream.imageUrl && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 tracking-wide">
                    DREAMSCAPE
                  </h3>

                  <img 
                    src={selectedDream.imageUrl} 
                    alt="AI-generated dream visualization"
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {/* AI Analysis */}
              {selectedDream.analysis && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">AI Analysis</h3>
                  <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg p-4 border border-red-200">
                    <p className="text-gray-700 leading-relaxed">{selectedDream.analysis}</p>
                  </div>
                </div>
              )}

              {/* Dream Content - Collapsible */}
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setIsDreamTextExpanded(!isDreamTextExpanded)}
                  className="flex items-center w-full justify-between p-0 h-auto font-medium text-gray-800 hover:bg-transparent"
                >
                  <span>Original Dream Text</span>
                  {isDreamTextExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
                {isDreamTextExpanded && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600 leading-relaxed">{selectedDream.content}</p>
                  </div>
                )}
              </div>

              {/* Archetypes */}
              {selectedDream.archetypes && selectedDream.archetypes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">Archetypes</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDream.archetypes.map((archetype, index) => (
                      <Badge 
                        key={`${selectedDream.id}-archetype-${index}`}
                        variant="secondary" 
                        className={`${getArchetypeColor(archetype)} text-white cursor-pointer hover:opacity-80 transition-opacity`}
                        onClick={() => openSymbolModal(archetype, 'archetype')}
                      >
                        {archetype}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Symbols */}
              {selectedDream.symbols && selectedDream.symbols.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">Symbols</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDream.symbols.map((symbol, index) => (
                      <Badge 
                        key={`${selectedDream.id}-symbol-${index}`}
                        variant="outline" 
                        className="border-purple-300 text-purple-700 cursor-pointer hover:bg-purple-50 transition-colors"
                        onClick={() => openSymbolModal(symbol, 'symbol')}
                      >
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => playDreamText(selectedDream.content)}
                  className="flex-1"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {isPlaying ? 'Stop' : 'Listen'}
                </Button>
                <Button 
                  onClick={() => setSelectedDream(null)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Date Filter */}
      {selectedDate && viewMode === 'list' && (
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2 bg-yellow-100 rounded-lg p-2">
            <span className="text-sm font-medium text-gray-700">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedDate(null);
                setViewMode('calendar');
              }}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              Back to Calendar
            </Button>
          </div>
        </div>
      )}

      {/* Search Bar - Always Visible */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search your dreams, themes, symbols, or archetypes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Auto-switch to list view when searching
              if (e.target.value.trim() && viewMode === 'calendar') {
                setViewMode('list');
              }
            }}
            className="py-3 px-4 pl-10 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary/50"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {searchQuery.trim() && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Found {dreams.length} result{dreams.length !== 1 ? 's' : ''} for "{searchQuery}"</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setViewMode('calendar');
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear search
            </Button>
          </div>
        )}
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="space-y-4">
          {/* Year Navigation */}
          <div className="flex items-center justify-center space-x-4 bg-gray-900 rounded-lg p-3 border border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedYear(selectedYear - 1)}
              className="text-white hover:bg-gray-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-xl font-bold text-white">{selectedYear}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedYear(selectedYear + 1)}
              className="text-white hover:bg-gray-700"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Yearly Calendar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }, (_, monthIndex) => (
              <div key={`month-${monthIndex}`}>
                {renderCalendarMonth(monthIndex)}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
            <h4 className="text-sm font-bold text-white mb-2">Legend</h4>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-600 rounded"></div>
                <span className="text-gray-300">Days with dreams</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-800 rounded"></div>
                <span className="text-gray-300">No dreams</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-300">Dream count badge</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dream Entries and Vision Boards List */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-gray-500 mt-2">Loading dreams...</p>
            </div>
          ) : filteredDreams.length === 0 && filteredVisionBoards.length === 0 ? (
            <div className="text-center py-8">
              {selectedDate ? (
                <div>
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No dreams or vision boards recorded on this date</p>
                  <p className="text-sm text-gray-400 mt-1">Try selecting a different date from the calendar</p>
                </div>
              ) : searchQuery.trim() ? (
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
            <>
              {/* Vision Boards */}
              {filteredVisionBoards.map((board) => renderVisionBoardEntry(board))}
              {/* Dreams */}
              {filteredDreams.map((dream) => renderDreamEntry(dream))}
            </>
          )}
        </div>
      )}

      {/* Quick Stats */}
      {(dreams.length > 0 || visionBoards.length > 0) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-6">
          <h3 className="font-medium text-gray-800 mb-3">Journal Stats</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-primary">{allDreams.length}</div>
              <div className="text-xs text-gray-500">Dreams</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-purple-600">{visionBoards.length}</div>
              <div className="text-xs text-gray-500">Vision Boards</div>
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
