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

// Chessie V3 is the preferred default voice

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

  // Load from localStorage on first use or set default to Chessie V3
  useEffect(() => {
    if (globalSelectedVoice === null) {
      try {
        // Clear any non-Chessie preferences and force Chessie V3
        localStorage.removeItem('dreamspeak-voice-id');
        localStorage.removeItem('dreamspeak-voice-name');
        localStorage.removeItem('dreamspeak-voice-type');
        
        const savedId = localStorage.getItem('dreamspeak-voice-id');
        const savedName = localStorage.getItem('dreamspeak-voice-name');
        const savedType = localStorage.getItem('dreamspeak-voice-type');
        
        if (savedId && savedName && savedType) {
          // Use saved preference
          console.log('Found saved voice preference:', savedName, savedType);
          const savedVoice: VoiceOption = {
            id: savedId,
            name: savedName,
            type: savedType as 'system' | 'elevenlabs'
          };
          
          if (savedType === 'elevenlabs') {
            savedVoice.elevenLabsVoice = { voice_id: savedId.replace('elevenlabs-', '') };
          }
          
          globalSelectedVoice = savedVoice;
          setSelectedVoiceState(savedVoice);
        } else {
          // Set Chessie V3 as default only if no preference is saved
          console.log('Setting default voice to Chessie V3');
          const defaultVoice: VoiceOption = {
            id: 'elevenlabs-gXkRl8ChmS6D1XSSjct7',
            name: 'Chessie V3 (Premium AI)',
            type: 'elevenlabs',
            elevenLabsVoice: { voice_id: 'gXkRl8ChmS6D1XSSjct7' }
          };
          setSelectedVoice(defaultVoice);
        }
      } catch (error) {
        console.error('Failed to load voice preference:', error);
      }
    }
  }, []);

  return { selectedVoice, setSelectedVoice };
}