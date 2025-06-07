import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Book, Search } from 'lucide-react';

interface SymbolDefinitionModalProps {
  open: boolean;
  onClose: () => void;
  symbol: string;
  type: 'archetype' | 'symbol';
}

const archetypeDefinitions: Record<string, { definition: string; jungianMeaning: string }> = {
  'Hero': {
    definition: 'The protagonist who embarks on a transformative journey, facing challenges and overcoming obstacles.',
    jungianMeaning: 'Represents the ego\'s journey toward individuation and self-realization through trials and growth.'
  },
  'Shadow': {
    definition: 'The hidden, repressed, or denied aspects of the personality that the conscious mind rejects.',
    jungianMeaning: 'Contains both negative traits and undeveloped positive potential that must be integrated for wholeness.'
  },
  'Anima': {
    definition: 'The feminine aspect within the male psyche, representing emotion, intuition, and the unconscious.',
    jungianMeaning: 'The bridge between conscious and unconscious, guiding men toward psychological completeness.'
  },
  'Animus': {
    definition: 'The masculine aspect within the female psyche, representing logic, reason, and spiritual guidance.',
    jungianMeaning: 'Provides women with access to rational thinking and spiritual wisdom for psychological integration.'
  },
  'Self': {
    definition: 'The unified totality of the psyche, encompassing both conscious and unconscious elements.',
    jungianMeaning: 'The ultimate goal of individuation - achieving harmony between all aspects of personality.'
  },
  'Wise Old Man': {
    definition: 'The archetype of wisdom, knowledge, and spiritual guidance, often appearing as a mentor figure.',
    jungianMeaning: 'Represents the accumulated wisdom of humanity and guidance toward higher understanding.'
  },
  'Wise Old Woman': {
    definition: 'The feminine embodiment of wisdom, intuitive knowledge, and nurturing guidance.',
    jungianMeaning: 'Offers deep intuitive wisdom and connection to the collective feminine unconscious.'
  },
  'Great Mother': {
    definition: 'The archetypal mother figure representing nurturing, protection, fertility, and unconditional love.',
    jungianMeaning: 'Embodies both the nourishing and devouring aspects of the maternal principle.'
  },
  'Trickster': {
    definition: 'The playful, chaotic force that disrupts order and brings about transformation through humor and cunning.',
    jungianMeaning: 'Facilitates psychological change by breaking down rigid patterns and introducing new perspectives.'
  }
};

const symbolDefinitions: Record<string, { definition: string; jungianMeaning: string }> = {
  'water': {
    definition: 'The universal symbol of life, purification, renewal, and the flow of emotions.',
    jungianMeaning: 'Represents the unconscious mind, emotional depths, and the cleansing process of psychological transformation.'
  },
  'ocean': {
    definition: 'Vast body of water representing the infinite, the unknown, and emotional depths.',
    jungianMeaning: 'Symbolizes the collective unconscious and the vast reservoir of human experience and wisdom.'
  },
  'forest': {
    definition: 'Dense woodland representing mystery, the unknown, and the journey into the unconscious.',
    jungianMeaning: 'The threshold between conscious and unconscious realms where shadow work and self-discovery occur.'
  },
  'key': {
    definition: 'An instrument that unlocks doors, representing access, secrets, and solutions.',
    jungianMeaning: 'Symbolizes the potential for unlocking unconscious wisdom and accessing deeper levels of self-understanding.'
  },
  'golden key': {
    definition: 'A precious key representing valuable wisdom, spiritual insight, and transformative power.',
    jungianMeaning: 'The sacred tool for unlocking the mysteries of the Self and achieving individuation.'
  },
  'wise woman': {
    definition: 'An elderly female figure embodying wisdom, guidance, and intuitive knowledge.',
    jungianMeaning: 'Represents the anima in its wise aspect, offering guidance toward psychological wholeness.'
  },
  'library': {
    definition: 'A repository of knowledge, books, and accumulated human wisdom.',
    jungianMeaning: 'Symbolizes the collective knowledge of the unconscious and the search for meaning and understanding.'
  },
  'books': {
    definition: 'Containers of knowledge, stories, and wisdom passed down through generations.',
    jungianMeaning: 'Represent the accumulated wisdom of the collective unconscious and potential for learning.'
  }
};

export function SymbolDefinitionModal({ open, onClose, symbol, type }: SymbolDefinitionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const definitions = type === 'archetype' ? archetypeDefinitions : symbolDefinitions;
  const currentDefinition = definitions[symbol.toLowerCase()] || definitions[symbol];
  
  const filteredDefinitions = Object.entries(definitions).filter(([key, value]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    value.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Book className="w-6 h-6 mr-2 text-purple-400" />
            {type === 'archetype' ? 'Archetype' : 'Symbol'} Encyclopedia
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {currentDefinition && (
            <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-600/30">
              <h3 className="text-lg font-semibold text-purple-300 mb-3 capitalize">
                {symbol}
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-300 mb-1">Definition:</h4>
                  <p className="text-gray-400 text-sm">{currentDefinition.definition}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-300 mb-1">Jungian Significance:</h4>
                  <p className="text-gray-400 text-sm">{currentDefinition.jungianMeaning}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${type}s...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {filteredDefinitions.map(([key, definition]) => (
                <div key={key} className="p-3 bg-gray-800 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-400 capitalize">
                      {key}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-xs mb-2">{definition.definition}</p>
                  <p className="text-gray-500 text-xs italic">{definition.jungianMeaning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}