import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  preview_url?: string;
  settings?: {
    stability: number;
    similarity_boost: number;
  };
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

interface UseElevenLabsVoiceReturn {
  speak: (text: string, voiceId?: string, settings?: VoiceSettings) => Promise<void>;
  stop: () => void;
  isPlaying: boolean;
  isLoading: boolean;
  availableVoices: ElevenLabsVoice[];
  currentVoice: ElevenLabsVoice | null;
  setVoice: (voice: ElevenLabsVoice) => void;
  error: string | null;
}

export function useElevenLabsVoice(): UseElevenLabsVoiceReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<ElevenLabsVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<ElevenLabsVoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Load available voices on mount
  useEffect(() => {
    const loadVoices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/elevenlabs/voices', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const voices = await response.json();
        console.log('ElevenLabs API response:', voices);
        
        if (Array.isArray(voices)) {
          console.log(`Setting ${voices.length} ElevenLabs voices`);
          setAvailableVoices(voices);
          // Set default voice to first available
          if (voices.length > 0 && !currentVoice) {
            setCurrentVoice(voices[0]);
          }
        } else {
          console.error('ElevenLabs voices response is not an array:', voices);
          setError('Invalid response format from ElevenLabs API');
        }
      } catch (err) {
        console.error('Failed to load ElevenLabs voices:', err);
        setError('Failed to load voices. Please check your API key.');
      } finally {
        setIsLoading(false);
      }
    };

    loadVoices();
  }, [currentVoice]);

  const speak = useCallback(async (
    text: string, 
    voiceId?: string, 
    settings?: VoiceSettings
  ): Promise<void> => {
    if (!text.trim()) return;

    try {
      setIsPlaying(true);
      setError(null);
      
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const selectedVoiceId = voiceId || currentVoice?.voice_id;
      if (!selectedVoiceId) {
        throw new Error('No voice selected');
      }

      // Default voice settings for natural speech
      const voiceSettings = {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.0,
        use_speaker_boost: true,
        ...settings,
      };

      // Make request to synthesize speech
      const response = await fetch('/api/elevenlabs/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice_id: selectedVoiceId,
          voice_settings: voiceSettings,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to synthesize speech: ${response.status}`);
      }

      // Create audio blob and play
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setCurrentAudio(audio);

      // Handle audio events
      audio.onloadeddata = () => {
        audio.play().catch(err => {
          console.error('Audio play error:', err);
          setError('Failed to play audio');
          setIsPlaying(false);
        });
      };

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setError('Audio playback error');
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

    } catch (err) {
      console.error('Speech synthesis error:', err);
      setError(err instanceof Error ? err.message : 'Speech synthesis failed');
      setIsPlaying(false);
    }
  }, [currentVoice, currentAudio]);

  const stop = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  }, [currentAudio]);

  const setVoice = useCallback((voice: ElevenLabsVoice) => {
    setCurrentVoice(voice);
    setError(null);
  }, []);

  return {
    speak,
    stop,
    isPlaying,
    isLoading,
    availableVoices,
    currentVoice,
    setVoice,
    error,
  };
}