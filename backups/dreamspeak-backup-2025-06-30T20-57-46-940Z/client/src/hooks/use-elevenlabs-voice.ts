import { useState, useEffect, useCallback, useRef } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { globalAudioManager } from './use-global-audio-stop';

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
  speak: (text: string, voiceId?: string, fallbackCallback?: () => void, settings?: VoiceSettings) => Promise<void>;
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
  const [isStopping, setIsStopping] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentRequestIdRef = useRef<string | null>(null);


  // Load available voices on mount
  useEffect(() => {
    const loadVoices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/elevenlabs/voices?t=${Date.now()}`, {
          credentials: 'include',
          cache: 'no-cache'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const voices = await response.json();
        console.log('ElevenLabs API response:', voices);
        
        if (Array.isArray(voices)) {
          console.log(`Setting ${voices.length} ElevenLabs voices`);
          setAvailableVoices(voices);
          // Set default voice to Chessie V3 or first available
          if (voices.length > 0 && !currentVoice) {
            const chessieV3Voice = voices.find(voice => voice.name === 'Chessie V3');
            setCurrentVoice(chessieV3Voice || voices[0]);
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
  }, []);

  const speak = useCallback(async (
    text: string, 
    voiceId?: string, 
    fallbackCallback?: () => void,
    settings?: VoiceSettings
  ): Promise<void> => {
    if (!text.trim()) return;

    try {
      // Reset global audio stop to allow new audio
      globalAudioManager.allowAudio();
      
      setIsLoading(true);
      setIsPlaying(false);
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

      // Create abort controller for this request
      const controller = new AbortController();
      abortControllerRef.current = controller;

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
        signal: controller.signal,
      });

      if (!response.ok) {
        // If it's a 401 error and we have a fallback, use it
        if (response.status === 401 && fallbackCallback) {
          console.log('ElevenLabs API authentication failed, using fallback');
          setIsLoading(false);
          setIsPlaying(false);
          fallbackCallback();
          return;
        }
        throw new Error(`Failed to synthesize speech: ${response.status}`);
      }

      setIsLoading(false);

      // Simplified check - only verify if globally stopped
      if (!globalAudioManager.canPlayAudio()) {
        console.log('Global audio stop is active - not playing audio');
        setIsLoading(false);
        return;
      }

      // Create audio blob and play immediately
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Register this audio with global stop manager
      globalAudioManager.registerAudio(audio);
      
      setCurrentAudio(audio);

      // Preload and play as soon as possible
      audio.preload = 'auto';
      audio.load();

      // Handle audio events with mobile compatibility
      const playAudio = () => {
        // iOS requires user interaction for audio playback
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
          // On mobile, ensure audio can start
          audio.muted = false;
          audio.volume = 1.0;
        }
        
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Audio playback started successfully');
              setIsPlaying(true);
            })
            .catch(err => {
              console.error('Audio play error:', err);
              // On mobile, if ElevenLabs fails, try system voice fallback
              if (isMobile && fallbackCallback) {
                console.log('Mobile audio failed, trying system fallback');
                fallbackCallback();
              } else {
                setError('Audio playback not supported on this device');
              }
              setIsPlaying(false);
            });
        }
      };

      // Try to play immediately, or wait for canplay event
      if (audio.readyState >= 2) { // HAVE_CURRENT_DATA
        playAudio();
      } else {
        audio.oncanplay = playAudio;
      }

      audio.onplay = () => {
        setIsPlaying(true);
      };

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setError('Audio playback error');
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
      };

    } catch (err) {
      // Don't show error if request was aborted intentionally
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Speech synthesis aborted');
        setIsPlaying(false);
        setIsLoading(false);
        return;
      }
      
      console.error('Speech synthesis error:', err);
      
      // If we have a fallback and this looks like an API error, use it
      if (fallbackCallback && err instanceof Error && 
          (err.message.includes('401') || err.message.includes('Failed to synthesize'))) {
        console.log('ElevenLabs failed, using fallback');
        setIsLoading(false);
        setIsPlaying(false);
        fallbackCallback();
        return;
      }
      
      setError(err instanceof Error ? err.message : 'Speech synthesis failed');
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [currentVoice, currentAudio]);

  const stop = useCallback(() => {
    // Cancel current request by clearing the request ID
    currentRequestIdRef.current = null;
    
    // Abort any ongoing network request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Stop current audio if exists
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setIsLoading(false);
    }
    
    // Also stop all audio elements globally as a fallback
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    // Force state reset
    setIsPlaying(false);
    setIsLoading(false);
    setIsStopping(true);
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