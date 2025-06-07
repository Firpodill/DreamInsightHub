import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Book, Search, User, Users } from 'lucide-react';
import { archetypeDefinitions, symbolDefinitions, getDefinition, getAllTerms, type Definition } from '@shared/definitions';

interface SymbolDefinitionModalProps {
  open: boolean;
  onClose: () => void;
  symbol: string;
  type: 'archetype' | 'symbol';
}

export function SymbolDefinitionModal({ open, onClose, symbol, type }: SymbolDefinitionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const definitions = type === 'archetype' ? archetypeDefinitions : symbolDefinitions;
  const currentDefinition = definitions[symbol.toLowerCase()] || definitions[symbol] || getDefinition(symbol);
  
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

          {/* Current Definition */}
          {currentDefinition && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={type === 'archetype' ? 'default' : 'secondary'} className="text-sm">
                  {type === 'archetype' ? 'Archetype' : 'Symbol'}
                </Badge>
                <h3 className="text-xl font-bold text-gray-800 capitalize">{symbol}</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">General Definition</h4>
                  <p className="text-gray-600 leading-relaxed">{currentDefinition.definition}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Jungian Psychology</h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{currentDefinition.jungianMeaning}</p>
                  </div>
                  
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