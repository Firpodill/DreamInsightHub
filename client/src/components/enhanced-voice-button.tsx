import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Settings, X, Loader2 } from 'lucide-react';
import { useNaturalVoice } from '@/hooks/use-natural-voice';
import { useElevenLabsVoice } from '@/hooks/use-elevenlabs-voice';
import { useGlobalVoicePreference } from '@/hooks/use-voice-preference';
import { useGlobalAudioManager } from '@/hooks/use-global-audio-manager';
import { globalAudioManager } from '@/hooks/use-global-audio-stop';
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
  const [isLoading, setIsLoading] = useState(false);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [showVoiceHint, setShowVoiceHint] = useState(false);
  const [audioTimeout, setAudioTimeout] = useState<NodeJS.Timeout | null>(null);
  
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
      setIsLoading(false);
      if (audioTimeout) {
        clearTimeout(audioTimeout);
        setAudioTimeout(null);
      }
    };
    audioManager.registerAudio(stopAll);
    
    // Cleanup timeout on unmount
    return () => {
      if (audioTimeout) {
        clearTimeout(audioTimeout);
      }
    };
  }, [audioTimeout]);

  // Show voice hint on first render if not dismissed
  useEffect(() => {
    const hintDismissed = localStorage.getItem('voice-notifications-disabled');
    const hintAlreadyShown = sessionStorage.getItem('voice-hint-shown');
    
    if (!hintDismissed && !hintAlreadyShown) {
      const timer = setTimeout(() => {
        setShowVoiceHint(true);
        sessionStorage.setItem('voice-hint-shown', 'true');
      }, 3000);
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

  const stopAllAudio = () => {
    console.log('Stopping all audio playback');
    
    // Use global audio stop to prevent any new audio
    globalAudioManager.stopAll();
    
    // Stop voice synthesis hooks
    systemVoice.stop();
    elevenLabsVoice.stop();
    
    // Clear timeout
    if (audioTimeout) {
      clearTimeout(audioTimeout);
      setAudioTimeout(null);
    }
    
    // Force clear component states
    setIsPlaying(false);
    setIsLoading(false);
    audioManager.setPlaying(false);
  };

  const handleToggle = () => {
    const isCurrentlyBusy = isPlaying || isLoading || systemVoice.isPlaying || elevenLabsVoice.isPlaying || elevenLabsVoice.isLoading;
    
    if (isCurrentlyBusy) {
      stopAllAudio();
      return; // Early return to prevent any restart
    }
    
    // Start playing only if we're not busy
    if (!text.trim()) return;

    console.log('Starting audio playback with selected voice:', selectedVoice);
    
    // Allow audio to play again
    globalAudioManager.allowAudio();
    
    // Clear any existing states and timeouts first
    if (audioTimeout) {
      clearTimeout(audioTimeout);
      setAudioTimeout(null);
    }
    
    setIsPlaying(false);
    setIsLoading(false);
    
    audioManager.setPlaying(true);
    
    if (selectedVoice?.type === 'elevenlabs' && selectedVoice.elevenLabsVoice) {
      console.log('Using ElevenLabs voice:', selectedVoice.elevenLabsVoice.voice_id);
      // Disable fallback to prevent audio conflicts
      elevenLabsVoice.speak(text, selectedVoice.elevenLabsVoice.voice_id);
    } else if (selectedVoice?.type === 'system' && selectedVoice.voice) {
      console.log('Using system voice:', selectedVoice.voice.name);
      systemVoice.setVoice(selectedVoice.voice);
      systemVoice.speak(text);
    } else {
      console.log('Using default system voice');
      systemVoice.speak(text);
    }
    
    // Remove aggressive timeout that was causing cancellations
    // Let the audio play naturally without forced interruption
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

  // Set Chessie V3 as default only if no voice is selected
  useEffect(() => {
    if (elevenLabsVoice.availableVoices.length > 0 && !selectedVoice) {
      const chessieV3 = elevenLabsVoice.availableVoices.find(voice => 
        voice.voice_id === 'gXkRl8ChmS6D1XSSjct7'
      );
      
      if (chessieV3) {
        const voiceOption: VoiceOption = {
          id: `elevenlabs-${chessieV3.voice_id}`,
          name: 'Chessie V3 (Premium AI)',
          type: 'elevenlabs',
          elevenLabsVoice: chessieV3,
        };
        setSelectedVoice(voiceOption);
        console.log('Set Chessie V3 as initial default voice');
      }
    }
  }, [elevenLabsVoice.availableVoices, selectedVoice, setSelectedVoice]);

  const isCurrentlyLoading = isLoading || elevenLabsVoice.isLoading;
  const isCurrentlyPlaying = isPlaying || systemVoice.isPlaying || elevenLabsVoice.isPlaying;

  return (
    <div className="flex items-center space-x-1 relative group" data-voice-control>
      <Button
        variant="default"
        size={size}
        onClick={handleToggle}
        className={`!bg-black !text-white hover:!bg-gray-800 !border-black [&>*]:!text-white ${className}`}
        disabled={false}
        data-voice-control
      >
        {isCurrentlyLoading ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin text-white" />
        ) : isCurrentlyPlaying ? (
          <VolumeX className="w-4 h-4 mr-1 text-white" />
        ) : (
          <Volume2 className="w-4 h-4 mr-1 text-white" />
        )}
        <span className="text-white">
          {isCurrentlyLoading ? 'Loading...' : isCurrentlyPlaying ? 'Stop' : 'Listen'}
        </span>
      </Button>
      
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 border border-dashed border-black hover:border-gray-800 relative animate-pulse bg-black text-white hover:bg-gray-800"
          onClick={() => setShowVoiceSelector(true)}
          title="Choose Voice - Click to select from 37+ AI voices"
          data-voice-control
        >
          <Settings className="w-3 h-3 text-white" />
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