import { useState, useEffect } from 'react';

interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice: SpeechSynthesisVoice | null;
}

interface UseNaturalVoiceReturn {
  speak: (text: string) => void;
  stop: () => void;
  isPlaying: boolean;
  availableVoices: SpeechSynthesisVoice[];
  currentVoice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice) => void;
}

export function useNaturalVoice(): UseNaturalVoiceReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    rate: 0.85,
    pitch: 1.05,
    volume: 0.9,
    voice: null
  });

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Select the best available voice
      const bestVoice = selectBestVoice(voices);
      if (bestVoice) {
        setVoiceSettings(prev => ({ ...prev, voice: bestVoice }));
      }
    };

    // Load voices immediately if available
    loadVoices();
    
    // Also listen for voices changed event (some browsers load voices async)
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const selectBestVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    // Priority order for natural-sounding voices
    const priorities = [
      // High-quality neural voices
      (voice: SpeechSynthesisVoice) => voice.name.includes('Neural') && voice.lang.startsWith('en'),
      (voice: SpeechSynthesisVoice) => voice.name.includes('Enhanced') && voice.lang.startsWith('en'),
      (voice: SpeechSynthesisVoice) => voice.name.includes('Premium') && voice.lang.startsWith('en'),
      
      // Platform-specific high-quality voices
      (voice: SpeechSynthesisVoice) => voice.name.includes('Samantha') && voice.lang.startsWith('en'), // macOS
      (voice: SpeechSynthesisVoice) => voice.name.includes('Siri') && voice.lang.startsWith('en'), // iOS
      (voice: SpeechSynthesisVoice) => voice.name.includes('Zira') && voice.lang.startsWith('en'), // Windows
      (voice: SpeechSynthesisVoice) => voice.name.includes('David') && voice.lang.startsWith('en'), // Windows
      
      // Google voices (usually good quality)
      (voice: SpeechSynthesisVoice) => voice.name.includes('Google') && voice.lang.startsWith('en'),
      
      // Female voices tend to sound more natural for reading
      (voice: SpeechSynthesisVoice) => voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female'),
      
      // Any English voice as fallback
      (voice: SpeechSynthesisVoice) => voice.lang.startsWith('en'),
    ];

    for (const priority of priorities) {
      const voice = voices.find(priority);
      if (voice) return voice;
    }

    return voices[0] || null;
  };

  const speak = (text: string) => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Clean up the text for better speech
    const cleanText = text
      .replace(/\n+/g, '. ') // Replace line breaks with pauses
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Add space after punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    if (voiceSettings.voice) {
      utterance.voice = voiceSettings.voice;
    }
    
    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = voiceSettings.volume;
    
    // Add natural pauses for better comprehension
    utterance.addEventListener('boundary', (event) => {
      if (event.name === 'sentence') {
        // Slight pause between sentences
        speechSynthesis.pause();
        setTimeout(() => speechSynthesis.resume(), 200);
      }
    });
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const setVoice = (voice: SpeechSynthesisVoice) => {
    setVoiceSettings(prev => ({ ...prev, voice }));
  };

  return {
    speak,
    stop,
    isPlaying,
    availableVoices,
    currentVoice: voiceSettings.voice,
    setVoice
  };
}