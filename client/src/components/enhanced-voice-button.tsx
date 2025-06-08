import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Settings, X } from 'lucide-react';
import { useNaturalVoice } from '@/hooks/use-natural-voice';
import { useElevenLabsVoice } from '@/hooks/use-elevenlabs-voice';
import { useGlobalVoicePreference } from '@/hooks/use-voice-preference';
import { VoiceSelector } from './voice-selector';

interface EnhancedVoiceButtonProps {
  text: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

interface VoiceOption {
  id: string;
  name: string;
  type: 'system' | 'elevenlabs';
  voice?: SpeechSynthesisVoice;
  elevenLabsVoice?: any;
  preview?: string;
  category?: string;
}

export function EnhancedVoiceButton({ 
  text, 
  className = '', 
  variant = 'outline', 
  size = 'sm' 
}: EnhancedVoiceButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [showVoiceHint, setShowVoiceHint] = useState(false);
  
  const systemVoice = useNaturalVoice();
  const elevenLabsVoice = useElevenLabsVoice();
  const { selectedVoice, setSelectedVoice } = useGlobalVoicePreference();

  // Show voice hint on first render if not dismissed
  useEffect(() => {
    const hintDismissed = localStorage.getItem('voice-hint-dismissed');
    if (!hintDismissed) {
      const timer = setTimeout(() => setShowVoiceHint(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissVoiceHint = () => {
    setShowVoiceHint(false);
    localStorage.setItem('voice-hint-dismissed', 'true');
  };

  const handlePlay = async () => {
    if (!text.trim()) return;

    console.log('Playing with selected voice:', selectedVoice);
    setIsPlaying(true);
    
    try {
      if (selectedVoice?.type === 'elevenlabs' && selectedVoice.elevenLabsVoice) {
        console.log('Using ElevenLabs voice:', selectedVoice.elevenLabsVoice.voice_id);
        // Start playback immediately without awaiting
        elevenLabsVoice.speak(text, selectedVoice.elevenLabsVoice.voice_id);
      } else if (selectedVoice?.type === 'system' && selectedVoice.voice) {
        console.log('Using system voice:', selectedVoice.voice.name);
        systemVoice.setVoice(selectedVoice.voice);
        systemVoice.speak(text);
      } else {
        console.log('Using default system voice');
        systemVoice.speak(text);
      }
    } catch (error) {
      console.error('Voice playback failed:', error);
      setIsPlaying(false);
    }
    
    // Reset playing state after estimated duration
    const estimatedDuration = Math.max(text.length * 40, 2000); // More responsive estimate
    setTimeout(() => setIsPlaying(false), Math.min(estimatedDuration, 8000));
  };

  const handleStop = () => {
    systemVoice.stop();
    elevenLabsVoice.stop();
    setIsPlaying(false);
  };

  const handleVoiceSelect = (voiceOption: VoiceOption) => {
    setSelectedVoice(voiceOption);
    console.log('Voice selected:', voiceOption.name, voiceOption.type);
  };

  const isAnyPlaying = isPlaying || systemVoice.isPlaying || elevenLabsVoice.isPlaying;

  return (
    <div className="flex items-center space-x-1 relative group">
      <Button
        variant={variant}
        size={size}
        onClick={isAnyPlaying ? handleStop : handlePlay}
        className={className}
        disabled={elevenLabsVoice.isLoading}
      >
        {isAnyPlaying ? (
          <VolumeX className="w-4 h-4 mr-1" />
        ) : (
          <Volume2 className="w-4 h-4 mr-1" />
        )}
        {isAnyPlaying ? 'Stop' : 'Listen'}
      </Button>
      
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 border border-dashed border-gray-500 hover:border-gray-400 relative animate-pulse"
          onClick={() => setShowVoiceSelector(true)}
          title="Choose Voice - Click to select from 37+ AI voices"
        >
          <Settings className="w-3 h-3" />
        </Button>
        
        {/* Always visible hint */}
        <div className="absolute -top-8 -right-2 opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="flex items-center space-x-1">
            <span className="text-xs font-medium text-gray-600 bg-yellow-100 px-2 py-1 rounded shadow-sm border whitespace-nowrap">
              👆 Change Voice
            </span>
          </div>
        </div>

        {/* First-time prominent callout */}
        {showVoiceHint && (
          <div className="absolute -top-16 -right-8 z-50 animate-bounce">
            <div className="bg-red-600 text-white p-3 rounded-lg shadow-lg border-2 border-red-700 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 w-5 h-5 bg-white text-red-600 hover:bg-gray-100 rounded-full"
                onClick={dismissVoiceHint}
              >
                <X className="w-3 h-3" />
              </Button>
              <div className="pr-4">
                <div className="text-xs font-bold mb-1">🎙️ Voice Options!</div>
                <div className="text-xs">Click here for 38+ AI voices</div>
                <div className="text-xs opacity-90">Including Chessie V3!</div>
              </div>
              {/* Arrow pointing down */}
              <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-600"></div>
            </div>
          </div>
        )}
      </div>

      <VoiceSelector
        open={showVoiceSelector}
        onClose={() => setShowVoiceSelector(false)}
        onVoiceSelect={handleVoiceSelect}
        text={text}
      />
    </div>
  );
}