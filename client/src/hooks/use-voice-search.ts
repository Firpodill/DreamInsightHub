import { useState, useEffect } from 'react';
import { useSpeechRecognition } from './use-speech-recognition';
import { useSearchDreams } from './use-dreams';

interface VoiceSearchOptions {
  activationPhrase?: string;
  autoActivate?: boolean;
}

interface VoiceSearchReturn {
  isListening: boolean;
  searchQuery: string;
  searchResults: any[];
  isSearching: boolean;
  startVoiceSearch: () => void;
  stopVoiceSearch: () => void;
  clearSearch: () => void;
  error: string | null;
  lastCommand: string;
}

export function useVoiceSearch(options: VoiceSearchOptions = {}): VoiceSearchReturn {
  const { activationPhrase = "find my dreams", autoActivate = false } = options;
  
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [processedQuery, setProcessedQuery] = useState('');

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    lang: 'en-US'
  });

  const { data: searchResults = [], isLoading: isSearching } = useSearchDreams(processedQuery);

  // Process voice commands and extract search queries
  useEffect(() => {
    if (!transcript) return;

    const lowerTranscript = transcript.toLowerCase();
    setLastCommand(transcript);

    // Check for activation phrases
    if (lowerTranscript.includes(activationPhrase) || 
        lowerTranscript.includes('search for') ||
        lowerTranscript.includes('show me') ||
        lowerTranscript.includes('find dreams')) {
      
      setIsVoiceSearchActive(true);
      
      // Extract search query from various command patterns
      let query = '';
      
      if (lowerTranscript.includes('find my dreams about')) {
        query = lowerTranscript.split('find my dreams about')[1]?.trim() || '';
      } else if (lowerTranscript.includes('search for dreams about')) {
        query = lowerTranscript.split('search for dreams about')[1]?.trim() || '';
      } else if (lowerTranscript.includes('show me dreams about')) {
        query = lowerTranscript.split('show me dreams about')[1]?.trim() || '';
      } else if (lowerTranscript.includes('find dreams with')) {
        query = lowerTranscript.split('find dreams with')[1]?.trim() || '';
      } else if (lowerTranscript.includes('dreams about')) {
        query = lowerTranscript.split('dreams about')[1]?.trim() || '';
      } else if (lowerTranscript.includes('find')) {
        // Fallback: everything after "find"
        query = lowerTranscript.split('find')[1]?.trim() || '';
      }

      // Clean up query
      query = query
        .replace(/\b(dreams?|dream)\b/g, '') // Remove "dream" or "dreams"
        .replace(/\b(about|with|containing|that have)\b/g, '') // Remove prepositions
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();

      if (query) {
        setSearchQuery(query);
        setProcessedQuery(query);
      }
    }

    // Handle time-based queries
    if (lowerTranscript.includes('last week') || lowerTranscript.includes('this week')) {
      const timeQuery = lowerTranscript.includes('last week') ? 'last week' : 'this week';
      setSearchQuery(timeQuery);
      setProcessedQuery(timeQuery);
    }

    if (lowerTranscript.includes('last month') || lowerTranscript.includes('this month')) {
      const timeQuery = lowerTranscript.includes('last month') ? 'last month' : 'this month';
      setSearchQuery(timeQuery);
      setProcessedQuery(timeQuery);
    }

  }, [transcript, activationPhrase]);

  const startVoiceSearch = () => {
    setIsVoiceSearchActive(true);
    resetTranscript();
    startListening();
  };

  const stopVoiceSearch = () => {
    setIsVoiceSearchActive(false);
    stopListening();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setProcessedQuery('');
    setLastCommand('');
    resetTranscript();
  };

  return {
    isListening: isListening && isVoiceSearchActive,
    searchQuery,
    searchResults,
    isSearching,
    startVoiceSearch,
    stopVoiceSearch,
    clearSearch,
    error: speechError,
    lastCommand
  };
}