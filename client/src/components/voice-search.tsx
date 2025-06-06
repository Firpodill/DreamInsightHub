import { useState } from 'react';
import { Search, Mic, X, Clock, Hash } from 'lucide-react';
import { useVoiceSearch } from '@/hooks/use-voice-search';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Dream } from '@shared/schema';

interface VoiceSearchProps {
  onDreamSelect?: (dream: Dream) => void;
  onClose?: () => void;
}

export function VoiceSearch({ onDreamSelect, onClose }: VoiceSearchProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const {
    isListening,
    searchQuery,
    searchResults,
    isSearching,
    startVoiceSearch,
    stopVoiceSearch,
    clearSearch,
    lastCommand
  } = useVoiceSearch();

  const handleClose = () => {
    setIsVisible(false);
    stopVoiceSearch();
    clearSearch();
    onClose?.();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => {
            setIsVisible(true);
            startVoiceSearch();
          }}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg"
        >
          <Search size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search size={20} />
            <div>
              <h3 className="font-bold text-lg">Voice Dream Search</h3>
              <p className="text-red-100 text-sm">
                Say "Find my dreams about..." or "Show me dreams from last week"
              </p>
            </div>
          </div>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-red-700"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Voice Status */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic 
                size={16} 
                className={`${isListening ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} 
              />
              <span className="text-sm font-medium">
                {isListening ? 'Listening...' : 'Click mic to start voice search'}
              </span>
            </div>
            
            <div className="flex gap-2">
              {!isListening ? (
                <Button
                  onClick={startVoiceSearch}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Mic size={14} className="mr-1" />
                  Start
                </Button>
              ) : (
                <Button
                  onClick={stopVoiceSearch}
                  size="sm"
                  variant="outline"
                >
                  Stop
                </Button>
              )}
              
              {(searchQuery || lastCommand) && (
                <Button
                  onClick={clearSearch}
                  size="sm"
                  variant="outline"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Command Recognition */}
          {lastCommand && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
              <div className="text-blue-700 font-medium">Heard:</div>
              <div className="text-blue-600">"{lastCommand}"</div>
            </div>
          )}

          {/* Search Query */}
          {searchQuery && (
            <div className="mt-2 flex items-center gap-2">
              <Search size={14} className="text-gray-500" />
              <span className="text-sm">
                Searching for: <Badge variant="secondary">{searchQuery}</Badge>
              </span>
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="p-4 overflow-y-auto max-h-96">
          {isSearching && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Searching dreams...</p>
            </div>
          )}

          {!isSearching && searchResults.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No dreams found for "{searchQuery}"</p>
              <p className="text-gray-400 text-sm mt-1">
                Try different keywords or time periods
              </p>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Hash size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Found {searchResults.length} dream{searchResults.length !== 1 ? 's' : ''}
                </span>
              </div>

              {searchResults.map((dream: Dream) => (
                <div
                  key={dream.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    onDreamSelect?.(dream);
                    handleClose();
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDate(dream.createdAt)}
                      </span>
                    </div>
                    {dream.title && (
                      <Badge variant="outline" className="text-xs">
                        {dream.title}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-800 leading-relaxed">
                    {truncateText(dream.content)}
                  </p>
                  
                  {dream.symbols && dream.symbols.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {dream.symbols.slice(0, 3).map((symbol: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {symbol}
                        </Badge>
                      ))}
                      {dream.symbols.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{dream.symbols.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {dream.archetypes && dream.archetypes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dream.archetypes.slice(0, 2).map((archetype: string, index: number) => (
                        <Badge key={index} variant="default" className="text-xs bg-red-100 text-red-700">
                          {archetype}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!searchQuery && !isListening && (
            <div className="text-center py-8">
              <Mic size={48} className="text-gray-300 mx-auto mb-4" />
              <h4 className="font-medium text-gray-700 mb-2">Voice Commands</h4>
              <div className="text-sm text-gray-500 space-y-1">
                <div>"Find my dreams about flying"</div>
                <div>"Show me dreams from last week"</div>
                <div>"Search for dreams about water"</div>
                <div>"Find dreams with nightmares"</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}