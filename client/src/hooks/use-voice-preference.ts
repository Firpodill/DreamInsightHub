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

// Force clear any Chessie preferences immediately
try {
  const savedName = localStorage.getItem('dreamspeak-voice-name');
  if (savedName && savedName.includes('Chessie')) {
    localStorage.removeItem('dreamspeak-voice-id');
    localStorage.removeItem('dreamspeak-voice-name');
    localStorage.removeItem('dreamspeak-voice-type');
    globalSelectedVoice = null;
  }
} catch (error) {
  console.error('Failed to clear Chessie preferences:', error);
}

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

  // Load from localStorage on first use or set default to Aria
  useEffect(() => {
    if (globalSelectedVoice === null) {
      try {
        const savedId = localStorage.getItem('dreamspeak-voice-id');
        const savedName = localStorage.getItem('dreamspeak-voice-name');
        const savedType = localStorage.getItem('dreamspeak-voice-type');
        
        // Clear any Chessie V3 preferences and force Aria as default
        if (savedName && savedName.includes('Chessie')) {
          console.log('Clearing Chessie voice preference, switching to Aria');
          localStorage.removeItem('dreamspeak-voice-id');
          localStorage.removeItem('dreamspeak-voice-name');
          localStorage.removeItem('dreamspeak-voice-type');
        }
        
        // Always set Aria as default for now
        console.log('Setting default voice to Aria');
        const defaultVoice: VoiceOption = {
          id: 'elevenlabs-9BWtsMINqrJLrRacOk9x',
          name: 'Aria (Premium AI)',
          type: 'elevenlabs',
          elevenLabsVoice: { voice_id: '9BWtsMINqrJLrRacOk9x' }
        };
        setSelectedVoice(defaultVoice);
      } catch (error) {
        console.error('Failed to load voice preference:', error);
      }
    }
  }, []);

  return { selectedVoice, setSelectedVoice };
}