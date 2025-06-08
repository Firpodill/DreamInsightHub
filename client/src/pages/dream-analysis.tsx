import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Brain, Heart, Star, Lightbulb, Palette, Sparkles, Archive } from 'lucide-react';
import { useAnalyzeDream, useGenerateImage, useUpdateDream } from '@/hooks/use-dreams';
import { SymbolDefinitionModal } from '@/components/symbol-definition-modal';
import { DreamMemoryCapsule } from '@/components/dream-memory-capsule';
import { EnhancedVoiceButton } from '@/components/enhanced-voice-button';

// Archetype color mapping from Complete Archetype Spectrum
const archetypeColors: Record<string, string> = {
  "The Hero": "#dc2626",
  "Hero": "#dc2626",
  "The Ruler": "#7c2d12", 
  "Ruler": "#7c2d12",
  "The Lover": "#be185d",
  "Lover": "#be185d", 
  "The Sage": "#1e40af",
  "Sage": "#1e40af",
  "The Shadow": "#6b7280",
  "Shadow": "#6b7280",
  "The Innocent": "#eab308",
  "Innocent": "#eab308",
  "The Anima": "#8b5cf6",
  "Anima": "#8b5cf6",
  "The Animus": "#8b5cf6",
  "Animus": "#8b5cf6",
  "The Self": "#22d3ee",
  "Self": "#22d3ee",
  "The Trickster": "#f97316",
  "Trickster": "#f97316",
  "The Mother": "#ec4899",
  "Mother": "#ec4899",
  "The Wise Old Man": "#1e40af",
  "Wise Old Man": "#1e40af",
  "The Wise Old Woman": "#1e40af",
  "Wise Old Woman": "#1e40af"
};

const getArchetypeColor = (archetype: string): string => {
  return archetypeColors[archetype] || "#6b7280";
};

export default function DreamAnalysis() {
  const [location, navigate] = useLocation();
  const [dreamText, setDreamText] = useState('');
  const [showVisionBoardOption, setShowVisionBoardOption] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [modalType, setModalType] = useState<'archetype' | 'symbol'>('symbol');
  const analyzeDream = useAnalyzeDream();
  const generateImage = useGenerateImage();
  const updateDream = useUpdateDream();

  useEffect(() => {
    // Get dream text from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const dreamFromUrl = urlParams.get('dream');
    const dreamFromStorage = localStorage.getItem('currentDreamText');
    const shouldAutoAnalyze = localStorage.getItem('shouldAutoAnalyze') === 'true';
    
    const text = dreamFromUrl || dreamFromStorage || '';
    setDreamText(text);
    
    if (text && (!analyzeDream.data && !analyzeDream.isPending)) {
      // Auto-analyze if coming from decode button or if no previous analysis
      analyzeDream.mutate(text);
    } else if (text && shouldAutoAnalyze) {
      // Force new analysis if explicitly requested from decode button
      analyzeDream.mutate(text);
    }
    
    // Clean up the auto-analyze flag
    if (shouldAutoAnalyze) {
      localStorage.removeItem('shouldAutoAnalyze');
    }
  }, []);

  // Show vision board option after analysis completes
  useEffect(() => {
    if (analyzeDream.data && !analyzeDream.isPending) {
      setShowVisionBoardOption(true);
    }
  }, [analyzeDream.data, analyzeDream.isPending]);

  const handleGenerateVisionBoard = async () => {
    if (!dreamText || !analyzeDream.data?.analysis) return;

    try {
      const symbols = analyzeDream.data.analysis.symbols?.join(', ') || '';
      const archetypes = analyzeDream.data.analysis.archetypes?.join(', ') || '';
      const prompt = `Pop art comic book style collage composition inspired by dream symbols like ${symbols} and archetypes of ${archetypes}. Multiple panels and elements arranged in a dynamic collage layout, bold colors, halftone patterns, thick black outlines, Ben-Day dots, vintage comic aesthetic with dramatic lighting. Retro superhero comic book collage art style with overlapping panels and mixed compositions. NO TEXT OR WORDS in the image.`;
      
      const result = await generateImage.mutateAsync({ prompt });
      
      if (result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        
        // Save the image URL to the dream record so it appears in Journal Log
        if (analyzeDream.data.dream?.id) {
          await updateDream.mutateAsync({
            dreamId: analyzeDream.data.dream.id,
            updates: { imageUrl: result.imageUrl }
          });
        }
      }
    } catch (error) {
      console.error('Failed to generate dream image:', error);
    }
  };

  const analysis = analyzeDream.data?.analysis;



  return (
    <div className="max-w-md mx-auto bg-black text-white min-h-screen relative overflow-hidden">
      {/* Header */}
      <header className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="text-sm font-bold px-3 py-1 rounded" style={{
              backgroundColor: '#E53E3E',
              color: '#FFFF00',
              border: '2px solid #000000',
              transform: 'rotate(-1deg)',
              boxShadow: '3px 3px 0px rgba(0,0,0,0.5)'
            }}>
              DREAM DECODED
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 space-y-6">


        {/* Loading State */}
        {analyzeDream.isPending && (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-200"></div>
              </div>
              <p className="text-center text-gray-400 mt-4">Analyzing your dream...</p>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysis && (
          <>
            {/* Summary */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Dream Summary
                  </div>
                  <EnhancedVoiceButton 
                    text={analysis.summary}
                    variant="outline"
                    size="sm"
                    className="text-gray-300 border-gray-600 hover:bg-gray-800"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {analysis.summary}
                </p>
              </CardContent>
            </Card>

            {/* Jungian Interpretation */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Jungian Interpretation
                  </div>
                  <EnhancedVoiceButton 
                    text={analysis.jungianInterpretation}
                    variant="outline"
                    size="sm"
                    className="text-gray-300 border-gray-600 hover:bg-gray-800"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {analysis.jungianInterpretation}
                </p>
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Individuation Stage:</h4>
                  <span className="text-yellow-400 text-sm">
                    {analysis.individuationStage}
                  </span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Emotional Tone:</h4>
                  <span className="text-blue-400 text-sm">
                    {analysis.emotionalTone}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Archetypes & Symbols */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Archetypes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(analysis.archetypes || []).map((archetype: string, index: number) => {
                      const color = getArchetypeColor(archetype);
                      return (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs cursor-pointer transition-colors"
                          style={{
                            color: color,
                            borderColor: color,
                            backgroundColor: `${color}10`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${color}20`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = `${color}10`;
                          }}
                          onClick={() => {
                            setSelectedSymbol(archetype);
                            setModalType('archetype');
                            setModalOpen(true);
                          }}
                        >
                          {archetype}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Symbols</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(analysis.symbols || []).map((symbol: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-green-400 border-green-400 text-xs cursor-pointer hover:bg-green-400/20 transition-colors"
                        onClick={() => {
                          setSelectedSymbol(symbol);
                          setModalType('symbol');
                          setModalOpen(true);
                        }}
                      >
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shadow Work */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Shadow Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {analysis.shadowWork}
                </p>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {analysis.recommendations}
                </p>
              </CardContent>
            </Card>

            {/* Dream Image Generation Option */}
            {showVisionBoardOption && (
              <Card className="bg-red-900 border-red-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Generate Dream Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white text-sm mb-4">
                    Transform your dream analysis into a visual representation with AI-generated imagery
                  </p>
                  
                  {!generatedImage ? (
                    <Button 
                      onClick={handleGenerateVisionBoard}
                      disabled={generateImage.isPending}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      {generateImage.isPending ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          Generating Dream Image...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Dream Image
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <img 
                          src={generatedImage} 
                          alt="Generated dream vision board"
                          className="w-full rounded-lg shadow-lg"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={async () => {
                            try {
                              // For mobile devices, try to use the Web Share API first
                              if (navigator.share && navigator.canShare) {
                                const response = await fetch(generatedImage!);
                                const blob = await response.blob();
                                const file = new File([blob], `dream-image-${new Date().toISOString().split('T')[0]}.png`, { type: 'image/png' });
                                
                                if (navigator.canShare({ files: [file] })) {
                                  await navigator.share({
                                    files: [file],
                                    title: 'Dream Visualization',
                                    text: 'AI-generated dream image'
                                  });
                                  return;
                                }
                              }
                              
                              // Fallback to traditional download
                              const response = await fetch(generatedImage!, {
                                mode: 'cors',
                                credentials: 'omit'
                              });
                              
                              if (!response.ok) {
                                throw new Error('Failed to fetch image');
                              }
                              
                              const blob = await response.blob();
                              const url = URL.createObjectURL(blob);
                              
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `dream-image-${new Date().toISOString().split('T')[0]}.png`;
                              link.style.display = 'none';
                              
                              document.body.appendChild(link);
                              link.click();
                              
                              setTimeout(() => {
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url);
                              }, 100);
                              
                            } catch (error) {
                              console.error('Failed to save image:', error);
                              // Fallback: open image in new tab
                              window.open(generatedImage!, '_blank');
                            }
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Palette className="w-4 h-4 mr-2" />
                          Save Image
                        </Button>
                        <Button 
                          onClick={handleGenerateVisionBoard}
                          disabled={generateImage.isPending}
                          variant="outline"
                          className="border-red-600 text-white hover:bg-red-800"
                        >
                          <Sparkles className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Error State */}
        {analyzeDream.isError && (
          <Card className="bg-red-900 border-red-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-red-200 mb-4">
                  OpenAI API quota exceeded. Please provide a new API key to enable dream analysis.
                </p>
                <p className="text-red-300 text-sm">
                  The analysis page layout is ready - it just needs API access to generate the Jungian interpretation.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Symbol Definition Modal */}
        <SymbolDefinitionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          symbol={selectedSymbol}
          type={modalType}
        />
      </div>
    </div>
  );
}