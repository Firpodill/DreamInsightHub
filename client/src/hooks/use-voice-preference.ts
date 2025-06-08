import { useState, useEffect, createContext, useContext } from 'react';

interface VoiceOption {
  id: string;
  name: string;
  type: 'system' | 'elevenlabs';
  voice?: SpeechSynthesisVoice;
  elevenLabsVoice?: any;
  preview?: string;
  category?: string;
}

interface VoicePreferenceContextType {
  selectedVoice: VoiceOption | null;
  setSelectedVoice: (voice: VoiceOption) => void;
}

const VoicePreferenceContext = createContext<VoicePreferenceContextType>({
  selectedVoice: null,
  setSelectedVoice: () => {}
});

export function useVoicePreference() {
  const context = useContext(VoicePreferenceContext);
  if (!context) {
    // If no context provider, use local state as fallback
    const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
    return { selectedVoice, setSelectedVoice };
  }
  return context;
}

// Global voice preference state
let globalSelectedVoice: VoiceOption | null = null;
const listeners: Set<(voice: VoiceOption | null) => void> = new Set();

export function useGlobalVoicePreference() {
  const [selectedVoice, setSelectedVoiceState] = useState<VoiceOption | null>(globalSelectedVoice);

  useEffect(() => {
    const listener = (voice: VoiceOption | null) => {
      setSelectedVoiceState(voice);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setSelectedVoice = (voice: VoiceOption) => {
    globalSelectedVoice = voice;
    listeners.forEach(listener => listener(voice));
    
    // Persist to localStorage (simple version)
    try {
      localStorage.setItem('dreamspeak-voice-id', voice.id);
      localStorage.setItem('dreamspeak-voice-name', voice.name);
      localStorage.setItem('dreamspeak-voice-type', voice.type);
    } catch (error) {
      console.error('Failed to save voice preference:', error);
    }
  };

  // Load from localStorage on first use
  useEffect(() => {
    if (globalSelectedVoice === null) {
      try {
        const savedId = localStorage.getItem('dreamspeak-voice-id');
        const savedName = localStorage.getItem('dreamspeak-voice-name');
        const savedType = localStorage.getItem('dreamspeak-voice-type');
        
        if (savedId && savedName && savedType) {
          // We'll reconstruct the voice when we have access to the voice lists
          console.log('Found saved voice preference:', savedName, savedType);
        }
      } catch (error) {
        console.error('Failed to load voice preference:', error);
      }
    }
  }, []);

  return { selectedVoice, setSelectedVoice };
}