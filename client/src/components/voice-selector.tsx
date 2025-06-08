import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Volume2, Play, Pause, Settings } from 'lucide-react';
import { useNaturalVoice } from '@/hooks/use-natural-voice';
import { useElevenLabsVoice } from '@/hooks/use-elevenlabs-voice';

interface VoiceOption {
  id: string;
  name: string;
  type: 'system' | 'elevenlabs';
  voice?: SpeechSynthesisVoice;
  elevenLabsVoice?: any;
  preview?: string;
  category?: string;
}

interface VoiceSelectorProps {
  open: boolean;
  onClose: () => void;
  onVoiceSelect: (voiceOption: VoiceOption) => void;
  text: string;
}

export function VoiceSelector({ open, onClose, onVoiceSelect, text }: VoiceSelectorProps) {
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);
  
  const systemVoice = useNaturalVoice();
  const elevenLabsVoice = useElevenLabsVoice();
  
  const [voiceOptions, setVoiceOptions] = useState<VoiceOption[]>([]);

  useEffect(() => {
    const options: VoiceOption[] = [];

    // Add system voices
    systemVoice.availableVoices.forEach((voice, index) => {
      options.push({
        id: `system-${index}`,
        name: voice.name,
        type: 'system',
        voice,
        category: voice.lang.startsWith('en') ? 'English System' : 'Other Languages'
      });
    });

    // Add ElevenLabs voices
    elevenLabsVoice.availableVoices.forEach((voice) => {
      options.push({
        id: `elevenlabs-${voice.voice_id}`,
        name: `${voice.name} (Premium AI)`,
        type: 'elevenlabs',
        elevenLabsVoice: voice,
        preview: voice.preview_url,
        category: 'ElevenLabs Premium AI'
      });
    });

    console.log(`Loaded ${elevenLabsVoice.availableVoices.length} ElevenLabs voices and ${systemVoice.availableVoices.length} system voices`);

    setVoiceOptions(options);
    
    // Set Chessie V3 as default selection if available
    if (!selectedVoice && options.length > 0) {
      const chessieV3Voice = options.find(option => 
        option.type === 'elevenlabs' && option.name === 'Chessie V3'
      );
      if (chessieV3Voice) {
        setSelectedVoice(chessieV3Voice);
      }
    }
  }, [systemVoice.availableVoices, elevenLabsVoice.availableVoices]);

  const handlePreview = async (voiceOption: VoiceOption) => {
    setPreviewPlaying(voiceOption.id);
    
    const previewText = "This is how your dream analysis will sound with this voice.";
    
    try {
      if (voiceOption.type === 'system' && voiceOption.voice) {
        systemVoice.setVoice(voiceOption.voice);
        systemVoice.speak(previewText);
      } else if (voiceOption.type === 'elevenlabs' && voiceOption.elevenLabsVoice) {
        await elevenLabsVoice.speak(previewText, voiceOption.elevenLabsVoice.voice_id);
      }
    } catch (error) {
      console.error('Preview failed:', error);
    }
    
    setTimeout(() => setPreviewPlaying(null), 3000);
  };

  const handleSelect = (voiceOption: VoiceOption) => {
    setSelectedVoice(voiceOption);
    onVoiceSelect(voiceOption);
    onClose();
  };

  const groupedVoices = voiceOptions.reduce((groups, voice) => {
    const category = voice.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(voice);
    return groups;
  }, {} as Record<string, VoiceOption[]>);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Volume2 className="w-5 h-5 mr-2" />
              Choose Your Voice
            </div>
            <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">
              {voiceOptions.length}+ Available
            </Badge>
          </DialogTitle>
          <p className="text-gray-400 text-sm mt-2">
            Select from premium AI voices and system voices. Click any voice to preview it.
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {elevenLabsVoice.error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
              <p className="text-red-300 text-sm">{elevenLabsVoice.error}</p>
            </div>
          )}
          
          {/* Show ElevenLabs voices first */}
          {Object.entries(groupedVoices)
            .sort(([a], [b]) => a.includes('ElevenLabs') ? -1 : b.includes('ElevenLabs') ? 1 : 0)
            .map(([category, voices]) => (
            <div key={category}>
              <h3 className="text-white font-medium mb-3 flex items-center">
                {category}
                {category.includes('ElevenLabs') && (
                  <Badge variant="outline" className="ml-2 text-xs border-purple-400 text-purple-400">
                    Premium AI
                  </Badge>
                )}
                <span className="ml-2 text-sm text-gray-400">({voices.length} voices)</span>
              </h3>
              
              <div className="grid grid-cols-1 gap-2">
                {voices.map((voiceOption) => (
                  <Button
                    key={voiceOption.id}
                    variant="outline"
                    className="justify-between h-auto p-4 bg-gray-800 border-gray-600 hover:bg-gray-700 text-left"
                    onClick={() => handleSelect(voiceOption)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="text-white font-medium">{voiceOption.name}</div>
                        {voiceOption.type === 'elevenlabs' && (
                          <Badge variant="outline" className="text-xs border-purple-400 text-purple-400">
                            AI
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(voiceOption);
                      }}
                    >
                      {previewPlaying === voiceOption.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </Button>
                ))}
              </div>
            </div>
          ))}
          
          {elevenLabsVoice.isLoading && (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2 text-gray-400">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading custom voices...</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}