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