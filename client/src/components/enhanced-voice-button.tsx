import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Settings, X } from 'lucide-react';
import { useNaturalVoice } from '@/hooks/use-natural-voice';
import { useElevenLabsVoice } from '@/hooks/use-elevenlabs-voice';
import { useGlobalVoicePreference } from '@/hooks/use-voice-preference';
import { useGlobalAudioManager } from '@/hooks/use-global-audio-manager';
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
  const audioManager = useGlobalAudioManager(`voice-button-${text.substring(0, 20)}`);

  // Register stop functions with global audio manager
  useEffect(() => {
    const stopAll = () => {
      systemVoice.stop();
      elevenLabsVoice.stop();
      setIsPlaying(false);
    };
    audioManager.registerAudio(stopAll);
  }, []);

  // Show voice hint on first render if not dismissed - only once globally
  useEffect(() => {
    const hintDismissed = localStorage.getItem('voice-notifications-disabled');
    const hintAlreadyShown = localStorage.getItem('voice-hint-shown-session');
    
    if (!hintDismissed && !hintAlreadyShown) {
      const timer = setTimeout(() => {
        setShowVoiceHint(true);
        localStorage.setItem('voice-hint-shown-session', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissVoiceHint = () => {
    setShowVoiceHint(false);
  };

  const disableNotifications = () => {
    setShowVoiceHint(false);
    localStorage.setItem('voice-notifications-disabled', 'true');
  };

  const handlePlay = async () => {
    if (!text.trim()) return;

    console.log('Playing with selected voice:', selectedVoice);
    
    // Stop all other audio first
    audioManager.setPlaying(true);
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
      audioManager.setPlaying(false);
    }
    
    // Reset playing state after estimated duration
    const estimatedDuration = Math.max(text.length * 40, 2000); // More responsive estimate
    setTimeout(() => {
      setIsPlaying(false);
      audioManager.setPlaying(false);
    }, Math.min(estimatedDuration, 8000));
  };

  const handleStop = () => {
    systemVoice.stop();
    elevenLabsVoice.stop();
    setIsPlaying(false);
    audioManager.setPlaying(false);
  };

  const handleVoiceSelect = (voiceOption: VoiceOption) => {
    setSelectedVoice(voiceOption);
    console.log('Voice selected:', voiceOption.name, voiceOption.type);
  };

  const isAnyPlaying = isPlaying || systemVoice.isPlaying || elevenLabsVoice.isPlaying;

  return (
    <div className="flex items-center space-x-1 relative group" data-voice-control>
      <Button
        variant={variant}
        size={size}
        onClick={isAnyPlaying ? handleStop : handlePlay}
        className={className}
        disabled={elevenLabsVoice.isLoading}
        data-voice-control
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
          data-voice-control
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

      {/* Voice Discovery Popup */}
      {showVoiceHint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
            <div className="text-center">
              <div className="text-2xl mb-3">🎙️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Voice Options Available</h3>
              <p className="text-gray-600 text-sm mb-4">
                Click the settings wheel next to any Listen button to choose from 38+ AI voices, including your custom Chessie V3 voice.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={dismissVoiceHint}
                  className="flex-1"
                >
                  Got it
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={disableNotifications}
                  className="flex-1 text-gray-500"
                >
                  Don't show again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}