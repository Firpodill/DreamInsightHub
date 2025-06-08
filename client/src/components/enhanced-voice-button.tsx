import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { useNaturalVoice } from '@/hooks/use-natural-voice';
import { useElevenLabsVoice } from '@/hooks/use-elevenlabs-voice';
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
}

export function EnhancedVoiceButton({ 
  text, 
  className = '', 
  variant = 'outline', 
  size = 'sm' 
}: EnhancedVoiceButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  
  const systemVoice = useNaturalVoice();
  const elevenLabsVoice = useElevenLabsVoice();

  const handlePlay = async () => {
    if (!text.trim()) return;

    setIsPlaying(true);
    
    try {
      if (selectedVoice?.type === 'elevenlabs' && selectedVoice.elevenLabsVoice) {
        // Use ElevenLabs voice
        await elevenLabsVoice.speak(text, selectedVoice.elevenLabsVoice.voice_id);
      } else if (selectedVoice?.type === 'system' && selectedVoice.voice) {
        // Use system voice
        systemVoice.setVoice(selectedVoice.voice);
        systemVoice.speak(text);
      } else {
        // Default to system voice
        systemVoice.speak(text);
      }
    } catch (error) {
      console.error('Voice playback failed:', error);
    }
    
    // Reset playing state after estimated duration
    const estimatedDuration = text.length * 50; // Rough estimate
    setTimeout(() => setIsPlaying(false), Math.min(estimatedDuration, 10000));
  };

  const handleStop = () => {
    systemVoice.stop();
    elevenLabsVoice.stop();
    setIsPlaying(false);
  };

  const handleVoiceSelect = (voiceOption: VoiceOption) => {
    setSelectedVoice(voiceOption);
  };

  const isAnyPlaying = isPlaying || systemVoice.isPlaying || elevenLabsVoice.isPlaying;

  return (
    <>
      <div className="flex items-center space-x-1">
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
        
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
          onClick={() => setShowVoiceSelector(true)}
          title="Choose voice"
        >
          <Settings className="w-3 h-3" />
        </Button>
      </div>

      <VoiceSelector
        open={showVoiceSelector}
        onClose={() => setShowVoiceSelector(false)}
        onVoiceSelect={handleVoiceSelect}
        text={text}
      />
    </>
  );
}