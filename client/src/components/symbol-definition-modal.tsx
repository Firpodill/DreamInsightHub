import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Book, Search, User, Users, MapPin, ExternalLink, Volume2 } from 'lucide-react';
import { archetypeDefinitions, symbolDefinitions, getDefinition, getAllTerms, type Definition } from '@shared/definitions';
import { useDictionary } from '@/hooks/use-dictionary';

interface SymbolDefinitionModalProps {
  open: boolean;
  onClose: () => void;
  symbol: string;
  type: 'archetype' | 'symbol';
}

// Helper functions for place detection and map integration
function isLikelyPlace(term: string): boolean {
  const placeIndicators = [
    'mount', 'mountain', 'lake', 'river', 'city', 'town', 'street', 'avenue', 'road',
    'park', 'beach', 'forest', 'desert', 'valley', 'hill', 'island', 'bridge',
    'building', 'house', 'home', 'office', 'store', 'mall', 'restaurant', 'cafe',
    'shasta', 'francisco', 'angeles', 'york', 'chicago', 'boston', 'seattle',
    'california', 'texas', 'florida', 'nevada', 'oregon', 'washington'
  ];
  
  const lowerTerm = term.toLowerCase();
  return placeIndicators.some(indicator => 
    lowerTerm.includes(indicator) || indicator.includes(lowerTerm)
  );
}

function isLikelyPersonName(term: string): boolean {
  const namePatterns = [
    /^[A-Z][a-z]+$/,  // Capitalized single word
    /^[A-Z][a-z]+ [A-Z][a-z]+$/,  // First Last name pattern
  ];
  
  const commonNames = [
    'john', 'jane', 'michael', 'sarah', 'david', 'lisa', 'chris', 'emily',
    'james', 'mary', 'robert', 'patricia', 'william', 'jennifer', 'richard',
    'elizabeth', 'angie', 'angela', 'christopher', 'maria', 'daniel', 'susan'
  ];
  
  const lowerTerm = term.toLowerCase();
  
  return namePatterns.some(pattern => pattern.test(term)) || 
         commonNames.includes(lowerTerm);
}

function generateMapUrl(locationName: string): string {
  const encodedLocation = encodeURIComponent(locationName);
  return `https://www.google.com/maps/search/${encodedLocation}`;
}

export function SymbolDefinitionModal({ open, onClose, symbol, type }: SymbolDefinitionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const definitions = type === 'archetype' ? archetypeDefinitions : symbolDefinitions;
  const currentDefinition = definitions[symbol.toLowerCase()] || definitions[symbol] || getDefinition(symbol);
  
  const isPlace = isLikelyPlace(symbol);
  const isPerson = isLikelyPersonName(symbol);
  const mapUrl = isPlace ? generateMapUrl(symbol) : null;
  
  // Get real dictionary definition for common words
  const shouldUseDictionary = !isPlace && !isPerson && type !== 'archetype' && 
    !definitions[symbol.toLowerCase()] && symbol.length > 2 && /^[a-zA-Z]+$/.test(symbol);
  const dictionaryResult = useDictionary(shouldUseDictionary ? symbol : null);
  
  const filteredDefinitions = Object.entries(definitions).filter(([key, value]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    value.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    value.jungianMeaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (value.campbellMeaning && value.campbellMeaning.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            {currentDefinition ? `Definition: ${symbol}` : 'Dream Symbol Encyclopedia'}
          </DialogTitle>
          <DialogDescription>
            {currentDefinition 
              ? `Explore the Jungian psychological meaning of "${symbol}" and its role in dream interpretation.`
              : 'Browse and search through our comprehensive collection of dream symbols and archetypes with their psychological meanings.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search archetypes and symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Dictionary Definition */}
          {dictionaryResult.definition && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-sm bg-white">
                  Dictionary
                </Badge>
                <h3 className="text-xl font-bold text-gray-800 capitalize">{symbol}</h3>
                {dictionaryResult.phonetic && (
                  <span className="text-sm text-gray-500 italic">{dictionaryResult.phonetic}</span>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-700">Definition</h4>
                    {dictionaryResult.partOfSpeech && (
                      <Badge variant="outline" className="text-xs">
                        {dictionaryResult.partOfSpeech}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 leading-relaxed">{dictionaryResult.definition}</p>
                  {dictionaryResult.example && (
                    <div className="mt-3 p-3 bg-white/60 rounded border-l-4 border-green-400">
                      <p className="text-sm text-gray-600 italic">
                        <strong>Example:</strong> "{dictionaryResult.example}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Current Definition */}
          {currentDefinition && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={type === 'archetype' ? 'default' : 'secondary'} className="text-sm">
                  {type === 'archetype' ? 'Archetype' : dictionaryResult.definition ? 'Dream Symbol' : 'Symbol'}
                </Badge>
                <h3 className="text-xl font-bold text-gray-800 capitalize">{symbol}</h3>
              </div>
              
              <div className="space-y-4">
                {!dictionaryResult.definition && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">General Definition</h4>
                    <p className="text-gray-600 leading-relaxed">{currentDefinition.definition}</p>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Jungian Psychology</h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{currentDefinition.jungianMeaning}</p>
                  </div>
                  
                  {/* Map Integration for Places */}
                  {isPlace && mapUrl && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <h4 className="font-semibold text-green-800">Location Map</h4>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-700 text-sm">View this location on an interactive map:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => window.open(mapUrl, '_blank')}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <MapPin className="w-4 h-4" />
                            Google Maps
                          </Button>
                          <Button
                            onClick={() => window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(symbol)}`, '_blank')}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Wikipedia
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Person Name Enhancement */}
                  {isPerson && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-indigo-600" />
                        <h4 className="font-semibold text-indigo-800">Person Name</h4>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {symbol} is a person's name. This individual appears in your dream and may represent someone from your personal life, relationships, or social connections.
                      </p>
                    </div>
                  )}
                  
                  {currentDefinition.campbellMeaning && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-purple-600" />
                        <h4 className="font-semibold text-purple-800">Campbell's Mythology</h4>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{currentDefinition.campbellMeaning}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchTerm && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">
                Search Results ({filteredDefinitions.length} found)
              </h4>
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {filteredDefinitions.map(([key, definition]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={Object.keys(archetypeDefinitions).includes(key) ? 'default' : 'secondary'} className="text-xs">
                        {Object.keys(archetypeDefinitions).includes(key) ? 'Archetype' : 'Symbol'}
                      </Badge>
                      <h5 className="font-semibold text-gray-800 capitalize">{key}</h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{definition.definition}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-blue-700">Jung: </span>
                        <span className="text-xs text-gray-600">{definition.jungianMeaning}</span>
                      </div>
                      {definition.campbellMeaning && (
                        <div>
                          <span className="text-xs font-medium text-purple-700">Campbell: </span>
                          <span className="text-xs text-gray-600">{definition.campbellMeaning}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Available Terms (when no search) */}
          {!searchTerm && !currentDefinition && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Browse All Definitions</h4>
              <div className="grid gap-2 max-h-96 overflow-y-auto">
                {getAllTerms().map((term) => (
                  <div 
                    key={term}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => setSearchTerm(term)}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant={Object.keys(archetypeDefinitions).includes(term) ? 'default' : 'secondary'} className="text-xs">
                        {Object.keys(archetypeDefinitions).includes(term) ? 'Archetype' : 'Symbol'}
                      </Badge>
                      <span className="font-medium text-gray-800 capitalize">{term}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}