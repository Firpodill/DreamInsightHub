import { useState, useEffect } from 'react';

interface DictionaryDefinition {
  word: string;
  phonetic?: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
}

interface DictionaryResult {
  definition: string | null;
  partOfSpeech: string | null;
  example: string | null;
  phonetic: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useDictionary(word: string | null): DictionaryResult {
  const [result, setResult] = useState<DictionaryResult>({
    definition: null,
    partOfSpeech: null,
    example: null,
    phonetic: null,
    isLoading: false,
    error: null
  });

  useEffect(() => {
    if (!word || word.length < 2) {
      setResult({
        definition: null,
        partOfSpeech: null,
        example: null,
        phonetic: null,
        isLoading: false,
        error: null
      });
      return;
    }

    const fetchDefinition = async () => {
      setResult(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        // Use the free Dictionary API
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`);
        
        if (!response.ok) {
          throw new Error('Word not found in dictionary');
        }
        
        const data: DictionaryDefinition[] = await response.json();
        
        if (data && data.length > 0) {
          const entry = data[0];
          const firstMeaning = entry.meanings[0];
          const firstDefinition = firstMeaning?.definitions[0];
          
          setResult({
            definition: firstDefinition?.definition || null,
            partOfSpeech: firstMeaning?.partOfSpeech || null,
            example: firstDefinition?.example || null,
            phonetic: entry.phonetic || null,
            isLoading: false,
            error: null
          });
        } else {
          throw new Error('No definitions found');
        }
      } catch (error) {
        setResult(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch definition'
        }));
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchDefinition, 300);
    return () => clearTimeout(timeoutId);
  }, [word]);

  return result;
}