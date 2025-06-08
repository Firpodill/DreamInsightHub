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
        
        {/* Compact voice hint */}
        {showVoiceHint && (
          <div className="absolute -top-10 -right-4 z-50">
            <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs shadow-md relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-1 -right-1 w-4 h-4 bg-white text-blue-500 hover:bg-gray-100 rounded-full"
                onClick={dismissVoiceHint}
              >
                <X className="w-2 h-2" />
              </Button>
              <div className="pr-3">
                <div className="whitespace-nowrap">Voice options available</div>
              </div>
              {/* Small arrow pointing down */}
              <div className="absolute -bottom-1 right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-blue-500"></div>
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