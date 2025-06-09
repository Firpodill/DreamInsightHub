import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useDreamInsights } from '@/hooks/use-dreams';
import { SymbolDefinitionModal } from './symbol-definition-modal';
import { Crown, Sword, Heart, Sun, Moon, Star, Shield, Eye, Shuffle } from 'lucide-react';

interface ArchetypeData {
  name: string;
  description: string;
  icon: any;
  color: string;
  shadowAspect: string;
  individuationRole: string;
  frequency: number;
  dreamExamples: string[];
}

const archetypeDatabase: Record<string, ArchetypeData> = {
  "The Hero": {
    name: "The Hero",
    description: "Represents courage, determination, and the journey of overcoming obstacles.",
    icon: Sword,
    color: "#dc2626",
    shadowAspect: "Recklessness, martyrdom, or refusing help from others",
    individuationRole: "Drives personal growth through facing challenges",
    frequency: 0,
    dreamExamples: ["Fighting monsters", "Rescuing others", "Completing quests", "Battles"]
  },
  "The Ruler": {
    name: "The Ruler",
    description: "Embodies leadership, control, and responsibility for others.",
    icon: Crown,
    color: "#7c2d12",
    shadowAspect: "Tyranny, control obsession, or fear of losing power",
    individuationRole: "Develops healthy authority and responsibility",
    frequency: 0,
    dreamExamples: ["Leading groups", "Being in charge", "Making decisions", "Commanding"]
  },
  "The Lover": {
    name: "The Lover",
    description: "Represents passion, relationships, and emotional connections.",
    icon: Heart,
    color: "#be185d",
    shadowAspect: "Jealousy, obsession, or losing oneself in relationships",
    individuationRole: "Integrates emotional and relational aspects",
    frequency: 0,
    dreamExamples: ["Romantic encounters", "Deep connections", "Beauty", "Harmony"]
  },
  "The Sage": {
    name: "The Sage",
    description: "Embodies wisdom, knowledge, and the search for truth.",
    icon: Eye,
    color: "#1e40af",
    shadowAspect: "Arrogance, ivory tower mentality, or paralysis by analysis",
    individuationRole: "Develops wisdom and understanding",
    frequency: 0,
    dreamExamples: ["Learning", "Teaching", "Discovering truth", "Ancient wisdom"]
  },
  "The Innocent": {
    name: "The Innocent",
    description: "Represents purity, optimism, and trust in the world.",
    icon: Sun,
    color: "#eab308",
    shadowAspect: "Naivety, denial of reality, or vulnerability",
    individuationRole: "Maintains hope and positive outlook",
    frequency: 0,
    dreamExamples: ["Childhood memories", "Pure experiences", "Safety", "Wonder"]
  },
  "The Shadow": {
    name: "The Shadow",
    description: "Contains repressed or denied aspects of the personality.",
    icon: Moon,
    color: "#374151",
    shadowAspect: "The shadow itself - what we refuse to acknowledge",
    individuationRole: "Integration of rejected aspects for wholeness",
    frequency: 0,
    dreamExamples: ["Dark figures", "Hidden aspects", "Forbidden desires", "Fear"]
  },
  "The Anima/Animus": {
    name: "The Anima/Animus",
    description: "Represents the contra-sexual aspect within the psyche.",
    icon: Star,
    color: "#7c3aed",
    shadowAspect: "Projection onto others or possession by opposite gender traits",
    individuationRole: "Balances masculine and feminine energies",
    frequency: 0,
    dreamExamples: ["Opposite gender figures", "Inspiration", "Soul connections", "Inner guidance"]
  },
  "The Self": {
    name: "The Self",
    description: "The unified consciousness and archetypal center of the psyche.",
    icon: Shield,
    color: "#059669",
    shadowAspect: "Inflation or identification with the divine",
    individuationRole: "Represents the goal of individuation - wholeness",
    frequency: 0,
    dreamExamples: ["Mandala symbols", "Divine figures", "Perfect balance", "Unity"]
  },
  "The Trickster": {
    name: "The Trickster",
    description: "Represents transformation through humor, chaos, and boundary crossing.",
    icon: Star,
    color: "#f97316",
    shadowAspect: "Destructive chaos, malicious mischief, or avoiding responsibility",
    individuationRole: "Breaks rigid patterns and enables creative transformation",
    frequency: 0,
    dreamExamples: ["Pranks", "Shape-shifting", "Rule breaking", "Unexpected events"]
  },
  "The Mother": {
    name: "The Mother",
    description: "Represents nurturing, protection, fertility, and unconditional care.",
    icon: Heart,
    color: "#ec4899",
    shadowAspect: "Smothering, possessiveness, or emotional manipulation",
    individuationRole: "Develops capacity for care and nurturing",
    frequency: 0,
    dreamExamples: ["Maternal figures", "Caring for others", "Protection", "Birth"]
  },
  "The Father": {
    name: "The Father",
    description: "Embodies authority, structure, discipline, and guidance.",
    icon: Shield,
    color: "#1f2937",
    shadowAspect: "Authoritarianism, emotional distance, or harsh judgment",
    individuationRole: "Establishes structure and moral compass",
    frequency: 0,
    dreamExamples: ["Authority figures", "Rules and order", "Guidance", "Discipline"]
  },
  "The Shape Shifter": {
    name: "The Shape Shifter",
    description: "Represents transformation, adaptability, and the fluid nature of identity.",
    icon: Shuffle,
    color: "#8b5cf6",
    shadowAspect: "Deception, instability, or lack of authentic identity",
    individuationRole: "Teaches flexibility and integration of multiple aspects of self",
    frequency: 0,
    dreamExamples: ["Changing forms", "Multiple identities", "Transformation", "Illusion"]
  }
};

export function ArchetypeVisualization() {
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [modalArchetype, setModalArchetype] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const insights = useDreamInsights();
  const [archetypeData, setArchetypeData] = useState<ArchetypeData[]>([]);
  const [totalDreams, setTotalDreams] = useState(0);

  useEffect(() => {
    if (insights.data) {
      const data = insights.data;
      setTotalDreams(data.totalDreams);
      
      // Only show archetypes that actually appear in journal entries
      const processedArchetypes = data.archetypeFrequencies.map((apiArchetype: any) => {
        // Find matching archetype in database or create basic entry
        const dbArchetype = Object.values(archetypeDatabase).find(arch => {
          const apiName = arch.name.replace('The ', '').replace('/Animus', '');
          return apiArchetype.archetype === apiName || apiArchetype.archetype === arch.name;
        });

        if (dbArchetype) {
          return {
            ...dbArchetype,
            frequency: apiArchetype.frequency
          };
        } else {
          // Handle missing archetypes with basic data
          return {
            name: `The ${apiArchetype.archetype}`,
            description: `Represents the ${apiArchetype.archetype} archetype in your dreams.`,
            icon: Star,
            color: "#6b7280",
            shadowAspect: "Integration and understanding needed",
            individuationRole: "Part of your psychological development",
            frequency: apiArchetype.frequency,
            dreamExamples: ["Appears in your recent dreams"]
          };
        }
      }).sort((a, b) => b.frequency - a.frequency);
      
      setArchetypeData(processedArchetypes);
    }
  }, [insights.data]);

  const getMaxFrequency = () => {
    return Math.max(...archetypeData.map(a => a.frequency), 1);
  };

  const getArchetypeStrength = (frequency: number) => {
    const max = getMaxFrequency();
    return (frequency / max) * 100;
  };

  if (insights.isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-100"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-200"></div>
          </div>
          <p className="text-center text-gray-400 mt-4">Analyzing your dream archetypes...</p>
        </CardContent>
      </Card>
    );
  }

  if (totalDreams === 0) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Crown className="w-12 h-12 mx-auto text-yellow-400 opacity-50" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Dreams Analyzed Yet</h3>
          <p className="text-gray-400 text-sm">
            Record and analyze your dreams to see your personal archetype patterns emerge.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Crown className="w-5 h-5 mr-2 text-yellow-400" />
            Your Dream Archetype Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 text-sm mb-4">
            Based on analysis of {totalDreams} dream{totalDreams !== 1 ? 's' : ''}
          </p>
          
          {/* Top 3 Archetypes */}
          <div className="grid grid-cols-1 gap-3">
            {archetypeData.slice(0, 3).map((archetype, index) => (
              <div
                key={archetype.name}
                className="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors"
                style={{ 
                  borderColor: archetype.color + '40',
                  backgroundColor: archetype.color + '10'
                }}
                onClick={() => {
                  setModalArchetype(archetype.name);
                  setModalOpen(true);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: archetype.color + '20' }}
                  >
                    <archetype.icon 
                      className="w-5 h-5" 
                      style={{ color: archetype.color }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium text-sm">{archetype.name}</span>
                      {index === 0 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ 
                            borderColor: archetype.color,
                            color: archetype.color 
                          }}
                        >
                          Dominant
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {archetype.frequency.toFixed(1)}% of your dreams
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Progress 
                    value={getArchetypeStrength(archetype.frequency)} 
                    className="w-20 h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Archetypes Grid */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Complete Archetype Spectrum</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(archetypeDatabase).map((archetype) => {
              const activeArchetype = archetypeData.find(a => a.name === archetype.name);
              const frequency = activeArchetype?.frequency || 0;
              
              return (
                <div
                  key={archetype.name}
                  className="p-3 rounded-lg border cursor-pointer transition-all hover:scale-105"
                  style={{ 
                    borderColor: frequency > 0 ? archetype.color + '60' : '#374151',
                    backgroundColor: frequency > 0 ? archetype.color + '10' : '#1f2937',
                    opacity: frequency > 0 ? 1 : 0.6
                  }}
                  onClick={() => {
                    setModalArchetype(archetype.name);
                    setModalOpen(true);
                  }}
                >
                  <div className="text-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                      style={{ backgroundColor: archetype.color + '20' }}
                    >
                      <archetype.icon 
                        className="w-4 h-4" 
                        style={{ color: archetype.color }}
                      />
                    </div>
                    <div className="text-white text-xs font-medium mb-1">
                      {archetype.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {frequency > 0 
                        ? `${frequency.toFixed(1)}%`
                        : 'Not detected'
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Archetype Detail */}
      {selectedArchetype && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                {(() => {
                  const archetype = archetypeData.find(a => a.name === selectedArchetype);
                  return archetype ? (
                    <>
                      <archetype.icon 
                        className="w-6 h-6 mr-3" 
                        style={{ color: archetype.color }}
                      />
                      {archetype.name}
                    </>
                  ) : null;
                })()}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedArchetype(null)}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(() => {
              const archetype = archetypeData.find(a => a.name === selectedArchetype);
              if (!archetype) return null;
              
              return (
                <>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Description</h4>
                    <p className="text-gray-300 text-sm">{archetype.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Individuation Role</h4>
                    <p className="text-gray-300 text-sm">{archetype.individuationRole}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Shadow Aspects</h4>
                    <p className="text-gray-300 text-sm">{archetype.shadowAspect}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Common Dream Themes</h4>
                    <div className="flex flex-wrap gap-2">
                      {archetype.dreamExamples.map((example, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs"
                          style={{ 
                            borderColor: archetype.color + '60',
                            color: archetype.color 
                          }}
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Your Pattern</h4>
                    <div className="flex items-center space-x-3">
                      <Progress 
                        value={getArchetypeStrength(archetype.frequency)} 
                        className="flex-1"
                      />
                      <span className="text-gray-300 text-sm">
                        {archetype.frequency.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">
                      {archetype.frequency > 0.2 
                        ? "Highly active in your dreams"
                        : archetype.frequency > 0.1
                        ? "Moderately present"
                        : archetype.frequency > 0
                        ? "Occasionally appears"
                        : "Not yet detected in your dreams"
                      }
                    </p>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Symbol Definition Modal */}
      <SymbolDefinitionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        symbol={modalArchetype}
        type="archetype"
      />
    </div>
  );
}