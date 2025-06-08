import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react';
import { useAnalyzeDream } from '@/hooks/use-dreams';
import { useNaturalVoice } from '@/hooks/use-natural-voice';
import { useOfflineSync } from '@/hooks/use-offline-sync';

export default function SimpleDreamAnalyzer() {
  const [dreamText, setDreamText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const analyzeDream = useAnalyzeDream();
  const { speak, stop, isPlaying } = useNaturalVoice();
  const { isOnline, storeDreamOffline, offlineCount } = useOfflineSync();

  const handleAnalyze = async () => {
    if (!dreamText.trim()) return;
    
    try {
      const result = await analyzeDream.mutateAsync(dreamText);
      setAnalysis(result.analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const playAnalysis = () => {
    if (!analysis) return;
    
    const textToSpeak = `
      Dream Summary: ${analysis.summary}
      
      Jungian Interpretation: ${analysis.jungianInterpretation}
      
      Key Symbol: ${analysis.predominantSymbol?.name}. ${analysis.predominantSymbol?.meaning}
      
      Recommendations: ${analysis.recommendations}
    `;
    
    if (isPlaying) {
      stop();
    } else {
      speak(textToSpeak);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Dream Decoder
          </h1>
          <p className="text-xl text-purple-200">
            Unlock the secrets of your subconscious mind
          </p>
        </div>

        {/* Dream Input */}
        <Card className="mb-6 bg-white/10 backdrop-blur-sm border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="w-6 h-6 mr-2" />
              Tell me about your dream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="Describe your dream in detail... What did you see? How did you feel? What happened?"
              className="min-h-32 bg-white/20 border-purple-400/30 text-white placeholder:text-purple-200 resize-none"
              rows={6}
            />
            <Button
              onClick={handleAnalyze}
              disabled={!dreamText.trim() || analyzeDream.isPending}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {analyzeDream.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Decode My Dream
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <Card className="bg-white/10 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-6 h-6 mr-2" />
                  Your Dream Analysis
                </CardTitle>
                <Button
                  onClick={playAnalysis}
                  variant="outline"
                  size="sm"
                  className="border-purple-400/30 text-purple-200 hover:bg-purple-600/20"
                >
                  {isPlaying ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-2">Summary</h3>
                <p className="text-white">{analysis.summary}</p>
              </div>

              {/* Key Symbol */}
              {analysis.predominantSymbol && (
                <div>
                  <h3 className="text-lg font-semibold text-purple-200 mb-2">Key Symbol</h3>
                  <div className="bg-purple-600/20 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-300 mb-2">
                      {analysis.predominantSymbol.name}
                    </h4>
                    <p className="text-white mb-2">{analysis.predominantSymbol.meaning}</p>
                    <p className="text-purple-200 text-sm">
                      <strong>Jungian Significance:</strong> {analysis.predominantSymbol.jungianSignificance}
                    </p>
                  </div>
                </div>
              )}

              {/* Archetypes */}
              {analysis.archetypes && analysis.archetypes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-purple-200 mb-2">Archetypes Present</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.archetypes.map((archetype: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-blue-600/30 text-blue-200">
                        {archetype}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Jungian Interpretation */}
              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-2">Jungian Interpretation</h3>
                <p className="text-white">{analysis.jungianInterpretation}</p>
              </div>

              {/* Shadow Work */}
              {analysis.shadowWork && (
                <div>
                  <h3 className="text-lg font-semibold text-purple-200 mb-2">Shadow Work Insights</h3>
                  <p className="text-white">{analysis.shadowWork}</p>
                </div>
              )}

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-2">Recommendations</h3>
                <p className="text-white">{analysis.recommendations}</p>
              </div>

              {/* Emotional Tone */}
              {analysis.emotionalTone && (
                <div>
                  <h3 className="text-lg font-semibold text-purple-200 mb-2">Emotional Tone</h3>
                  <Badge className="bg-pink-600/30 text-pink-200">
                    {analysis.emotionalTone}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-purple-300 text-sm">
          <p>Powered by AI and Jungian psychology</p>
        </div>
      </div>
    </div>
  );
}