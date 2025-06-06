import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Brain, Image as ImageIcon, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDreams, useSearchDreams } from '@/hooks/use-dreams';
import type { Dream } from '@shared/schema';

export function DreamJournal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

  // Calendar helper functions
  const getDreamsByDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return allDreams.filter(dream => {
      const dreamDate = new Date(dream.createdAt).toISOString().split('T')[0];
      return dreamDate === dateString;
    });
  };

  const getDreamCountForDate = (date: Date) => {
    return getDreamsByDate(date).length;
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

  // Filter dreams by selected date if in calendar mode
  const filteredDreams = selectedDate && viewMode === 'list' 
    ? getDreamsByDate(selectedDate)
    : dreams;

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
      <div className="flex items-center justify-between mb-4">
        <Button
          variant={viewMode === 'calendar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('calendar')}
          className="text-xs"
        >
          <Calendar className="w-3 h-3 mr-1" />
          Calendar
        </Button>
        
        {selectedDate && viewMode === 'list' && (
          <div className="flex items-center space-x-2">
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
                setViewMode('list');
              }}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              Clear Filter
            </Button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      {viewMode === 'list' && (
        <div className="space-y-3 mb-4">
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
        </div>
      )}

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
            {Array.from({ length: 12 }, (_, monthIndex) => renderCalendarMonth(monthIndex))}
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

      {/* Dream Entries List */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-gray-500 mt-2">Loading dreams...</p>
            </div>
          ) : filteredDreams.length === 0 ? (
            <div className="text-center py-8">
              {selectedDate ? (
                <div>
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No dreams recorded on this date</p>
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
            filteredDreams.map(renderDreamEntry)
          )}
        </div>
      )}

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
