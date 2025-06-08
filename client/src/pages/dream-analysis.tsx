import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Brain, Heart, Star, Lightbulb, Palette, Sparkles, Archive } from 'lucide-react';
import { useAnalyzeDream, useGenerateImage, useUpdateDream } from '@/hooks/use-dreams';
import { SymbolDefinitionModal } from '@/components/symbol-definition-modal';
import { DreamMemoryCapsule } from '@/components/dream-memory-capsule';

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
    
    const text = dreamFromUrl || dreamFromStorage || '';
    setDreamText(text);
    
    if (text && !analyzeDream.data && !analyzeDream.isPending) {
      // Try to analyze, but if it fails, we'll show a demo
      analyzeDream.mutate(text);
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
      const prompt = `Pop art comic book style illustration inspired by dream symbols like ${symbols} and archetypes of ${archetypes}. Bold colors, halftone patterns, thick black outlines, vintage comic aesthetic with Ben-Day dots and dramatic lighting. Retro superhero comic book art style.`;
      
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
              DREAM DECODED
            </div>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Dream Text */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Your Dream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm leading-relaxed">
              {dreamText || 'No dream text available'}
            </p>
          </CardContent>
        </Card>

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
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Dream Summary
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
                <CardTitle className="text-white flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Jungian Interpretation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {analysis.jungianInterpretation}
                </p>
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Individuation Stage:</h4>
                  <div className="inline-block px-3 py-1 text-xs rounded-full border border-yellow-400 text-yellow-400 bg-yellow-400/10">
                    {analysis.individuationStage}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Emotional Tone:</h4>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {analysis.emotionalTone}
                  </Badge>
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
                    {(analysis.archetypes || []).map((archetype: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-red-400 border-red-400 text-xs cursor-pointer hover:bg-red-400/20 transition-colors"
                        onClick={() => {
                          setSelectedSymbol(archetype);
                          setModalType('archetype');
                          setModalOpen(true);
                        }}
                      >
                        {archetype}
                      </Badge>
                    ))}
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
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = generatedImage!;
                            link.download = `dream-image-${new Date().toISOString().split('T')[0]}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Palette className="w-4 h-4 mr-2" />
                          Download Image
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