import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink, Book, MapPin, User, X } from 'lucide-react';
import { useDictionary } from '@/hooks/use-dictionary';
import { archetypeDefinitions, symbolDefinitions } from '@shared/definitions';

interface SymbolDefinitionModalProps {
  open: boolean;
  onClose: () => void;
  symbol: string;
  type: 'archetype' | 'symbol';
}

function isLikelyPlace(term: string): boolean {
  const placeIndicators = [
    'Lake', 'Mount', 'Mountain', 'River', 'City', 'Town', 'Beach', 'Park', 'Street', 'Avenue',
    'Road', 'Highway', 'Bridge', 'Island', 'Bay', 'Valley', 'Hill', 'Forest', 'Desert',
    'Ocean', 'Sea', 'Canyon', 'Creek', 'Falls', 'Springs', 'Plaza', 'Square', 'Market',
    'Center', 'Station', 'Airport', 'Hospital', 'School', 'University', 'College', 'Library',
    'Museum', 'Theater', 'Stadium', 'Arena', 'Mall', 'Store', 'Restaurant', 'Hotel', 'Motel'
  ];
  
  return placeIndicators.some(indicator => 
    term.toLowerCase().includes(indicator.toLowerCase()) ||
    /^[A-Z][a-z]+ [A-Z][a-z]+/.test(term) // Capitalized multi-word patterns
  );
}

function isLikelyPersonName(term: string): boolean {
  return /^[A-Z][a-z]+ [A-Z][a-z]+$/.test(term) || // First Last format
         /^[A-Z][a-z]+$/.test(term) && term.length > 2; // Single capitalized name
}

function generateMapUrl(locationName: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(locationName)}`;
}

export function SymbolDefinitionModal({ open, onClose, symbol, type }: SymbolDefinitionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const isPlace = isLikelyPlace(symbol);
  const isPerson = isLikelyPersonName(symbol);
  const mapUrl = isPlace ? generateMapUrl(symbol) : null;
  
  // Check if it's a famous person who needs biographical information
  const famousPeople = [
    'Willie Nelson', 'Elvis Presley', 'Johnny Cash', 'Dolly Parton', 'Bob Dylan', 'Madonna', 'Prince',
    'Michael Jackson', 'Beatles', 'Rolling Stones', 'Taylor Swift', 'Beyonce', 'Jay-Z', 'Kanye West',
    'Lady Gaga', 'Adele', 'Ed Sheeran', 'Bruno Mars', 'Justin Bieber', 'Ariana Grande',
    'Tom Hanks', 'Brad Pitt', 'Leonardo DiCaprio', 'Meryl Streep', 'Jennifer Lawrence', 'Will Smith',
    'Denzel Washington', 'Morgan Freeman', 'Robert De Niro', 'Al Pacino', 'Scarlett Johansson',
    'Barack Obama', 'Donald Trump', 'Joe Biden', 'Hillary Clinton', 'Bill Gates', 'Elon Musk',
    'Steve Jobs', 'Mark Zuckerberg', 'Jeff Bezos', 'Warren Buffett', 'Oprah Winfrey',
    'Albert Einstein', 'Isaac Newton', 'Marie Curie', 'Charles Darwin', 'Stephen Hawking',
    'Martin Luther King', 'Gandhi', 'Nelson Mandela', 'John F Kennedy', 'Abraham Lincoln'
  ];
  const isFamousPerson = famousPeople.some(name => 
    name.toLowerCase() === symbol.toLowerCase() || 
    symbol.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(symbol.toLowerCase())
  );
  
  // Get real dictionary definition for regular words (not places or famous people)
  const shouldUseDictionary = !isPlace && !isFamousPerson && 
    symbol.length > 2 && /^[a-zA-Z\s]+$/.test(symbol) && 
    !symbol.match(/^[A-Z][a-z]+ [A-Z][a-z]+$/); // Skip full names
  const dictionaryResult = useDictionary(shouldUseDictionary ? symbol : null);
  
  // Get archetype/symbol definitions for actual psychological symbols
  const definitions = type === 'archetype' ? archetypeDefinitions : symbolDefinitions;
  const archetypeDefinition = definitions[symbol.toLowerCase()] || definitions[symbol];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white border-purple-500/30">
        <DialogHeader className="border-b border-purple-500/30 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Book className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Dream Symbol Encyclopedia
                </DialogTitle>
                <p className="text-purple-200 text-sm mt-1">
                  Browse and search through our comprehensive collection of dream symbols and archetypes with their
                  psychological meanings.
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-purple-300 hover:text-white hover:bg-purple-600/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
            <Input
              placeholder="Search archetypes and symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-purple-500/30 text-white placeholder:text-purple-300"
            />
          </div>

          {/* Dictionary Definition Section - if available */}
          {dictionaryResult.definition && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-sm bg-white text-black">
                  Dictionary Definition
                </Badge>
                <h3 className="text-xl font-bold text-gray-800 capitalize">{symbol}</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Definition</h4>
                  <p className="text-gray-600 leading-relaxed">{dictionaryResult.definition}</p>
                </div>
                
                {dictionaryResult.phonetic && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Pronunciation</h4>
                    <p className="text-gray-600 font-mono">{dictionaryResult.phonetic}</p>
                  </div>
                )}
                
                {dictionaryResult.partOfSpeech && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Part of Speech</h4>
                    <Badge variant="secondary" className="text-black">{dictionaryResult.partOfSpeech}</Badge>
                  </div>
                )}
                
                {dictionaryResult.example && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Example</h4>
                    <p className="text-gray-600 italic">"{dictionaryResult.example}"</p>
                  </div>
                )}
                

              </div>
            </div>
          )}

          {/* Famous Person Information */}
          {isFamousPerson && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-sm bg-white text-black">
                  Famous Person
                </Badge>
                <h3 className="text-xl font-bold text-gray-800 capitalize">{symbol}</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Find biographical information and details about "{symbol}":
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(symbol)}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <ExternalLink className="w-4 h-4" />
                  Wikipedia
                </Button>
                <Button
                  onClick={() => window.open(`https://www.britannica.com/search?query=${encodeURIComponent(symbol)}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <Book className="w-4 h-4" />
                  Britannica
                </Button>
                <Button
                  onClick={() => window.open(`https://www.imdb.com/find?q=${encodeURIComponent(symbol)}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <Search className="w-4 h-4" />
                  IMDB
                </Button>
                <Button
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(symbol + " biography facts")}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <Search className="w-4 h-4" />
                  Google Search
                </Button>
              </div>
            </div>
          )}

          {/* Geographic Location Information */}
          {isPlace && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-sm bg-white text-black">
                  Geographic Location
                </Badge>
                <h3 className="text-xl font-bold text-gray-800 capitalize">{symbol}</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Find authentic definitions and information about "{symbol}":
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => window.open(mapUrl || `https://www.google.com/maps/search/${encodeURIComponent(symbol)}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <MapPin className="w-4 h-4" />
                  Google Maps
                </Button>
                <Button
                  onClick={() => window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(symbol)}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <ExternalLink className="w-4 h-4" />
                  Wikipedia
                </Button>
                <Button
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(symbol + " location facts")}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <Search className="w-4 h-4" />
                  Location Info
                </Button>
                <Button
                  onClick={() => window.open(`https://www.google.com/maps/@?api=1&map_action=map&query=${encodeURIComponent(symbol)}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <MapPin className="w-4 h-4" />
                  Street View
                </Button>
              </div>
            </div>
          )}

          {/* Regular word search - ALWAYS show this for non-famous, non-place words */}
          {!isFamousPerson && !isPlace && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-sm bg-white text-black">
                  Search Real Information
                </Badge>
                <h3 className="text-xl font-bold text-gray-800 capitalize">{symbol}</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Find authentic definitions and information about "{symbol}":
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => window.open(`https://www.merriam-webster.com/dictionary/${encodeURIComponent(symbol)}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <Book className="w-4 h-4" />
                  Merriam-Webster
                </Button>
                <Button
                  onClick={() => window.open(`https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(symbol)}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <Book className="w-4 h-4" />
                  Cambridge
                </Button>
                <Button
                  onClick={() => window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(symbol)}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <ExternalLink className="w-4 h-4" />
                  Wikipedia
                </Button>
                <Button
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent("define " + symbol)}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <Search className="w-4 h-4" />
                  Google Define
                </Button>
                <Button
                  onClick={() => window.open(`https://www.britannica.com/search?query=${encodeURIComponent(symbol)}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <Book className="w-4 h-4" />
                  Britannica
                </Button>
                <Button
                  onClick={() => window.open(`https://www.etymonline.com/search?q=${encodeURIComponent(symbol)}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <ExternalLink className="w-4 h-4" />
                  Etymology
                </Button>
              </div>
            </div>
          )}

          {/* Jungian Archetype/Symbol Definition - ONLY for actual archetypes */}
          {archetypeDefinition && type === 'archetype' && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-sm bg-white text-black">
                  {type === 'archetype' ? 'Archetype' : 'Symbol'}
                </Badge>
                <h3 className="text-xl font-bold text-gray-800 capitalize">{symbol}</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Definition</h4>
                  <p className="text-gray-600 leading-relaxed">{archetypeDefinition.definition}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Jungian Psychology</h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{archetypeDefinition.jungianMeaning}</p>
                  </div>
                  
                  {archetypeDefinition.campbellMeaning && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Book className="w-4 h-4 text-purple-600" />
                        <h4 className="font-semibold text-purple-800">Campbell's Mythology</h4>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{archetypeDefinition.campbellMeaning}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Person Name Search - for regular names */}
          {isPerson && !isFamousPerson && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-sm bg-white text-black">
                  Person Name
                </Badge>
                <h3 className="text-xl font-bold text-gray-800 capitalize">{symbol}</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Find authentic definitions and information about "{symbol}":
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(symbol + " name meaning origin")}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <Search className="w-4 h-4" />
                  Name Origin
                </Button>
                <Button
                  onClick={() => window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(symbol)}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <ExternalLink className="w-4 h-4" />
                  Wikipedia
                </Button>
                <Button
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(symbol)}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <Search className="w-4 h-4" />
                  Google Search
                </Button>
                <Button
                  onClick={() => window.open(`https://www.behindthename.com/name/${encodeURIComponent(symbol.toLowerCase())}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <User className="w-4 h-4" />
                  Name Database
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}