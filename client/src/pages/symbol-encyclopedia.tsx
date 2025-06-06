import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Eye, Moon, Droplets, Trees, House, Bird } from 'lucide-react';

interface DreamSymbol {
  name: string;
  category: string;
  jungianMeaning: string;
  psychologicalContext: string;
  shadowAspects: string;
  individuationPhase: string;
  commonVariations: string[];
  icon: any;
}

const dreamSymbols: DreamSymbol[] = [
  {
    name: "Water",
    category: "Elements",
    jungianMeaning: "Represents the unconscious mind, emotions, and the flow of psychic energy. Water symbolizes the collective unconscious and the source of life.",
    psychologicalContext: "Often appears during emotional transitions or when the dreamer needs to connect with their deeper feelings and intuition.",
    shadowAspects: "Turbulent water may represent overwhelming emotions or repressed feelings threatening to surface.",
    individuationPhase: "Associated with the integration of emotions and the feminine principle (anima/animus).",
    commonVariations: ["Ocean", "River", "Rain", "Swimming", "Drowning", "Flood"],
    icon: Droplets
  },
  {
    name: "House",
    category: "Architecture",
    jungianMeaning: "Represents the Self and the psyche's structure. Different rooms symbolize different aspects of consciousness and the unconscious.",
    psychologicalContext: "House dreams often occur during life transitions or when exploring different aspects of personality.",
    shadowAspects: "Dark basements or hidden rooms may represent repressed memories or shadow aspects of the self.",
    individuationPhase: "Central to understanding the architecture of one's psyche and the journey toward wholeness.",
    commonVariations: ["Basement", "Attic", "Childhood home", "Unknown rooms", "Mansion", "Ruins"],
    icon: House
  },
  {
    name: "Tree",
    category: "Nature",
    jungianMeaning: "Symbolizes growth, connection between earth and sky, and the Tree of Life. Represents the axis mundi connecting conscious and unconscious.",
    psychologicalContext: "Appears during periods of personal growth or when seeking spiritual connection and grounding.",
    shadowAspects: "Dead or diseased trees may represent stagnation, lost connections to nature, or spiritual drought.",
    individuationPhase: "Represents the growth process and the connection between different levels of consciousness.",
    commonVariations: ["Forest", "Climbing tree", "Fruit tree", "Dead tree", "Tree of life", "Falling tree"],
    icon: Trees
  },
  {
    name: "Eyes",
    category: "Body",
    jungianMeaning: "Represents consciousness, perception, and the window to the soul. Eyes symbolize awareness and the capacity for insight.",
    psychologicalContext: "Eye dreams often relate to gaining new perspectives or becoming aware of previously hidden truths.",
    shadowAspects: "Closed or damaged eyes may represent denial, willful blindness, or fear of seeing reality.",
    individuationPhase: "Associated with developing conscious awareness and the ability to 'see' one's true nature.",
    commonVariations: ["Third eye", "Blindness", "Many eyes", "Animal eyes", "Staring eyes", "Eye contact"],
    icon: Eye
  },
  {
    name: "Moon",
    category: "Celestial",
    jungianMeaning: "Represents the feminine principle, cycles, intuition, and the unconscious. Symbolizes the anima and the mother archetype.",
    psychologicalContext: "Moon dreams often appear during times of emotional change or when exploring feminine aspects of the psyche.",
    shadowAspects: "Dark moon or lunar eclipse may represent hidden feminine power or suppressed intuitive abilities.",
    individuationPhase: "Important for integrating the anima/animus and understanding cyclical nature of growth.",
    commonVariations: ["Full moon", "New moon", "Eclipse", "Moon phases", "Blood moon", "Multiple moons"],
    icon: Moon
  },
  {
    name: "Bird",
    category: "Animals",
    jungianMeaning: "Represents spiritual transcendence, freedom, and messages from the unconscious. Birds symbolize the soul and higher consciousness.",
    psychologicalContext: "Bird dreams often occur during spiritual awakening or when seeking freedom from limitations.",
    shadowAspects: "Caged or injured birds may represent suppressed spiritual nature or lost sense of freedom.",
    individuationPhase: "Associated with spiritual development and the transcendence of ego limitations.",
    commonVariations: ["Flying", "Caged bird", "Eagle", "Owl", "Dove", "Crow", "Flock of birds"],
    icon: Bird
  },
  {
    name: "Snake",
    category: "Animals",
    jungianMeaning: "Represents transformation, healing, and primal wisdom. The ouroboros symbolizes the cycle of death and rebirth, while the serpent represents kundalini energy.",
    psychologicalContext: "Snake dreams often appear during major life transitions or when confronting fears and transformative experiences.",
    shadowAspects: "Venomous or threatening snakes may represent toxic influences, betrayal, or fear of change.",
    individuationPhase: "Central to transformation and the shedding of old patterns to embrace new growth.",
    commonVariations: ["Python", "Cobra", "Snake bite", "Shedding skin", "Multiple snakes", "Snake charmer"],
    icon: Trees
  },
  {
    name: "Fire",
    category: "Elements",
    jungianMeaning: "Represents passion, transformation, purification, and the divine spark. Fire symbolizes the libido and creative energy.",
    psychologicalContext: "Fire dreams often occur during periods of intense emotion, creative inspiration, or spiritual awakening.",
    shadowAspects: "Destructive fire may represent uncontrolled passion, anger, or the burning away of illusions.",
    individuationPhase: "Associated with purification and the burning away of ego attachments.",
    commonVariations: ["Candle", "Wildfire", "Fireplace", "Being burned", "Phoenix", "Sacred fire"],
    icon: Sun
  },
  {
    name: "Bridge",
    category: "Architecture",
    jungianMeaning: "Represents transition, connection between opposites, and the path of transformation. Bridges symbolize the transcendent function.",
    psychologicalContext: "Bridge dreams appear during life transitions or when seeking to reconcile conflicting aspects of the psyche.",
    shadowAspects: "Broken or dangerous bridges may represent fear of change or difficulty in making transitions.",
    individuationPhase: "Critical for integrating opposites and moving between different stages of development.",
    commonVariations: ["Crossing bridge", "Broken bridge", "Building bridge", "Drawbridge", "Rope bridge", "Golden bridge"],
    icon: House
  },
  {
    name: "Mirror",
    category: "Objects",
    jungianMeaning: "Represents self-reflection, truth, and the confrontation with one's true nature. Mirrors symbolize the process of self-examination.",
    psychologicalContext: "Mirror dreams occur when the psyche is ready to examine itself honestly or confront hidden aspects.",
    shadowAspects: "Broken or distorted mirrors may represent fragmented self-image or fear of self-knowledge.",
    individuationPhase: "Essential for developing self-awareness and confronting the shadow.",
    commonVariations: ["Broken mirror", "Magic mirror", "Mirror image", "No reflection", "Multiple mirrors", "Foggy mirror"],
    icon: Eye
  },
  {
    name: "Mountain",
    category: "Landscape",
    jungianMeaning: "Represents spiritual ascension, challenges to overcome, and the axis mundi connecting earth and heaven.",
    psychologicalContext: "Mountain dreams appear when facing significant challenges or seeking spiritual elevation.",
    shadowAspects: "Impassable mountains may represent insurmountable obstacles or fear of spiritual growth.",
    individuationPhase: "Symbolizes the journey toward self-realization and overcoming ego limitations.",
    commonVariations: ["Climbing mountain", "Mountain peak", "Avalanche", "Cave in mountain", "Sacred mountain", "Mountain path"],
    icon: Trees
  },
  {
    name: "Ocean",
    category: "Elements",
    jungianMeaning: "Represents the collective unconscious, vast emotional depths, and the source of all life. The ocean symbolizes the Great Mother.",
    psychologicalContext: "Ocean dreams occur when exploring deep emotions or connecting with universal themes.",
    shadowAspects: "Stormy seas or drowning may represent being overwhelmed by unconscious contents.",
    individuationPhase: "Important for understanding one's connection to the collective unconscious.",
    commonVariations: ["Calm sea", "Storm", "Waves", "Underwater", "Island", "Shore"],
    icon: Droplets
  },
  {
    name: "Key",
    category: "Objects",
    jungianMeaning: "Represents access to hidden knowledge, unlocking potential, and the solution to mysteries. Keys symbolize initiation and discovery.",
    psychologicalContext: "Key dreams appear when the dreamer is ready to unlock new understanding or access hidden aspects of the psyche.",
    shadowAspects: "Lost keys may represent feeling locked out of one's own potential or fear of discovery.",
    individuationPhase: "Associated with gaining access to deeper levels of consciousness.",
    commonVariations: ["Lost key", "Golden key", "Many keys", "Skeleton key", "Broken key", "Key ring"],
    icon: House
  },
  {
    name: "Cat",
    category: "Animals",
    jungianMeaning: "Represents feminine intuition, independence, mystery, and connection to the unconscious. Cats symbolize the anima and psychic abilities.",
    psychologicalContext: "Cat dreams often relate to developing intuition or embracing independent feminine qualities.",
    shadowAspects: "Aggressive or black cats may represent neglected feminine aspects or fear of independence.",
    individuationPhase: "Important for integrating feminine wisdom and intuitive abilities.",
    commonVariations: ["Black cat", "White cat", "Cat attacking", "Kitten", "Wild cat", "Cat eyes"],
    icon: Eye
  },
  {
    name: "Door",
    category: "Architecture",
    jungianMeaning: "Represents opportunities, transitions, and thresholds between consciousness states. Doors symbolize new possibilities and choices.",
    psychologicalContext: "Door dreams appear when facing decisions or preparing for new phases in life.",
    shadowAspects: "Locked or blocked doors may represent missed opportunities or fear of change.",
    individuationPhase: "Critical for recognizing and embracing new opportunities for growth.",
    commonVariations: ["Locked door", "Open door", "Secret door", "Revolving door", "Door knocker", "Many doors"],
    icon: House
  },
  {
    name: "Star",
    category: "Celestial",
    jungianMeaning: "Represents guidance, hope, destiny, and connection to the divine. Stars symbolize the Self and higher aspirations.",
    psychologicalContext: "Star dreams appear when seeking guidance or during times of spiritual awakening.",
    shadowAspects: "Falling stars may represent lost hope or disconnection from higher purpose.",
    individuationPhase: "Associated with recognizing one's true destiny and divine nature.",
    commonVariations: ["Shooting star", "North star", "Constellation", "Star map", "Bright star", "Star formation"],
    icon: Sun
  },
  {
    name: "Wolf",
    category: "Animals",
    jungianMeaning: "Represents instinctual wisdom, loyalty, and the wild nature of the psyche. Wolves symbolize the untamed aspects of the self.",
    psychologicalContext: "Wolf dreams often appear when reconnecting with primal instincts or natural wisdom.",
    shadowAspects: "Threatening wolves may represent fear of one's own wild nature or aggressive instincts.",
    individuationPhase: "Important for integrating instinctual wisdom and natural rhythms.",
    commonVariations: ["Wolf pack", "Lone wolf", "Wolf howling", "White wolf", "Wolf eyes", "Wolf transformation"],
    icon: Eye
  },
  {
    name: "Garden",
    category: "Nature",
    jungianMeaning: "Represents cultivation of the soul, growth potential, and the paradise within. Gardens symbolize the conscious development of natural gifts.",
    psychologicalContext: "Garden dreams appear when cultivating personal growth or creating harmony in life.",
    shadowAspects: "Neglected or dead gardens may represent unused potential or spiritual stagnation.",
    individuationPhase: "Associated with conscious cultivation of one's gifts and potential.",
    commonVariations: ["Rose garden", "Vegetable garden", "Overgrown garden", "Secret garden", "Garden path", "Garden gate"],
    icon: Trees
  },
  {
    name: "Clock",
    category: "Objects",
    jungianMeaning: "Represents time consciousness, mortality, and the cyclical nature of existence. Clocks symbolize the temporal aspect of individuation.",
    psychologicalContext: "Clock dreams often relate to timing in life decisions or awareness of life's finite nature.",
    shadowAspects: "Stopped clocks may represent feeling stuck in time or fear of aging and death.",
    individuationPhase: "Important for understanding the timing of psychological development.",
    commonVariations: ["Broken clock", "Grandfather clock", "Alarm clock", "Clock striking", "No time", "Time running out"],
    icon: Sun
  },
  {
    name: "Butterfly",
    category: "Animals",
    jungianMeaning: "Represents transformation, rebirth, and the soul's journey. The butterfly symbolizes the process of metamorphosis and spiritual evolution.",
    psychologicalContext: "Butterfly dreams appear during major life transformations or spiritual awakenings.",
    shadowAspects: "Dead butterflies may represent interrupted transformation or fear of change.",
    individuationPhase: "Central symbol of the individuation process and psychological metamorphosis.",
    commonVariations: ["Caterpillar", "Cocoon", "Emerging butterfly", "Butterfly collection", "Colorful butterfly", "Butterfly wings"],
    icon: Bird
  },
  {
    name: "Sword",
    category: "Objects",
    jungianMeaning: "Represents discrimination, truth, and the masculine principle. Swords symbolize the ability to cut through illusion and defend truth.",
    psychologicalContext: "Sword dreams appear when needing to make clear distinctions or defend one's values.",
    shadowAspects: "Broken swords may represent loss of power or inability to discriminate truth from falsehood.",
    individuationPhase: "Associated with developing discernment and the courage to defend one's authentic self.",
    commonVariations: ["Double-edged sword", "Broken sword", "Sheathed sword", "Sword fight", "Magic sword", "Sword in stone"],
    icon: Eye
  },
  {
    name: "Crown",
    category: "Objects",
    jungianMeaning: "Represents sovereignty, authority, and the realization of the Self. Crowns symbolize spiritual kingship and achieved wholeness.",
    psychologicalContext: "Crown dreams appear when approaching self-mastery or recognizing one's inherent nobility.",
    shadowAspects: "Heavy or burdensome crowns may represent the weight of responsibility or false authority.",
    individuationPhase: "Symbolizes the achievement of psychological sovereignty and self-realization.",
    commonVariations: ["Golden crown", "Broken crown", "Crown of thorns", "Crown jewels", "Placing crown", "Crown falling"],
    icon: Sun
  },
  {
    name: "Cave",
    category: "Landscape",
    jungianMeaning: "Represents the womb of rebirth, hidden knowledge, and the descent into the unconscious. Caves symbolize the place of inner transformation.",
    psychologicalContext: "Cave dreams appear when exploring deep unconscious contents or preparing for inner transformation.",
    shadowAspects: "Dark or scary caves may represent fear of the unconscious or resistance to inner exploration.",
    individuationPhase: "Important for the descent into the unconscious and the retrieval of hidden wisdom.",
    commonVariations: ["Crystal cave", "Dark cave", "Cave painting", "Cave entrance", "Underground cave", "Cave dwelling"],
    icon: Moon
  },
  {
    name: "Phoenix",
    category: "Mythical",
    jungianMeaning: "Represents rebirth, resurrection, and the triumph over destruction. The phoenix symbolizes the eternal nature of the Self.",
    psychologicalContext: "Phoenix dreams appear after major losses or when emerging from difficult transformations.",
    shadowAspects: "The burning phase represents the necessary destruction of old patterns before renewal.",
    individuationPhase: "Symbolizes the cyclical nature of psychological death and rebirth in the individuation process.",
    commonVariations: ["Phoenix rising", "Phoenix burning", "Phoenix egg", "Phoenix feather", "Phoenix nest", "Phoenix song"],
    icon: Bird
  }
];

const categories = ["All", "Elements", "Architecture", "Nature", "Body", "Celestial", "Animals"];

export default function SymbolEncyclopedia() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSymbol, setSelectedSymbol] = useState<DreamSymbol | null>(null);

  const filteredSymbols = dreamSymbols.filter(symbol => {
    const matchesSearch = symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         symbol.jungianMeaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         symbol.commonVariations.some(variation => 
                           variation.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = selectedCategory === 'All' || symbol.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-md mx-auto bg-black text-white min-h-screen relative overflow-hidden">
      {/* Header */}
      <header className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="text-center">
            <div className="text-sm font-bold px-3 py-1 rounded" style={{
              backgroundColor: '#E53E3E',
              color: '#FFFF00',
              border: '2px solid #000000',
              transform: 'rotate(-1deg)',
              boxShadow: '3px 3px 0px rgba(0,0,0,0.5)'
            }}>
              SYMBOL GUIDE
            </div>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search symbols..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer text-xs ${
                selectedCategory === category
                  ? 'bg-red-600 text-white border-red-600'
                  : 'text-gray-300 border-gray-600 hover:border-red-400'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {selectedSymbol ? (
          /* Symbol Detail View */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold flex items-center">
                <selectedSymbol.icon className="w-8 h-8 mr-3 text-yellow-400" />
                {selectedSymbol.name}
              </h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSymbol(null)}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                Back to List
              </Button>
            </div>

            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {selectedSymbol.category}
            </Badge>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Jungian Meaning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {selectedSymbol.jungianMeaning}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Psychological Context</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {selectedSymbol.psychologicalContext}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Shadow Aspects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {selectedSymbol.shadowAspects}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Individuation Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {selectedSymbol.individuationPhase}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Common Variations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedSymbol.commonVariations.map((variation, index) => (
                    <Badge key={index} variant="outline" className="text-green-400 border-green-400 text-xs">
                      {variation}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Symbol List View */
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Dream Symbol Encyclopedia</h2>
              <p className="text-gray-400 text-sm">
                Explore Jungian interpretations of common dream symbols
              </p>
            </div>

            {filteredSymbols.length === 0 ? (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400">No symbols found matching your search.</p>
                </CardContent>
              </Card>
            ) : (
              filteredSymbols.map((symbol, index) => (
                <Card
                  key={index}
                  className="bg-gray-900 border-gray-700 cursor-pointer hover:border-red-400 transition-colors"
                  onClick={() => setSelectedSymbol(symbol)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <symbol.icon className="w-6 h-6 mr-3 text-yellow-400" />
                        <div>
                          <CardTitle className="text-white text-lg">{symbol.name}</CardTitle>
                          <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs mt-1">
                            {symbol.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {symbol.jungianMeaning}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {symbol.commonVariations.slice(0, 3).map((variation, i) => (
                        <Badge key={i} variant="outline" className="text-green-400 border-green-400 text-xs">
                          {variation}
                        </Badge>
                      ))}
                      {symbol.commonVariations.length > 3 && (
                        <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs">
                          +{symbol.commonVariations.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}