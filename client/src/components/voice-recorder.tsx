import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, Square, Pause, Play } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

interface VoiceRecorderProps {
  open: boolean;
  onClose: () => void;
  onTranscriptionComplete: (text: string) => void;
}

export function VoiceRecorder({ open, onClose, onTranscriptionComplete }: VoiceRecorderProps) {
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    lang: 'en-US'
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isListening, isPaused]);

  useEffect(() => {
    if (open && isSupported) {
      resetTranscript();
      setDuration(0);
      setIsPaused(false);
      startListening();
    } else if (!open) {
      stopListening();
    }
  }, [open, isSupported, resetTranscript, startListening, stopListening]);

  const handleStop = () => {
    stopListening();
    if (transcript.trim()) {
      onTranscriptionComplete(transcript);
    }
    onClose();
  };

  const handlePause = () => {
    if (isPaused) {
      startListening();
    } else {
      stopListening();
    }
    setIsPaused(!isPaused);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSupported) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-sm mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Mic className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Voice Recording Unavailable</h3>
            <p className="text-sm text-gray-600">
              Your browser doesn't support voice recording. Please type your dream instead.
            </p>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <div className="text-center p-6 voice-recording">
          <div className="relative">
            <div className={`w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full mx-auto mb-4 flex items-center justify-center ${isListening && !isPaused ? 'animate-pulse' : ''}`}>
              <Mic className="w-8 h-8 text-white" />
            </div>
            {isListening && !isPaused && (
              <div className="absolute -inset-4 border-2 border-primary border-opacity-30 rounded-full animate-ping"></div>
            )}
          </div>
          
          <h3 className="font-medium text-gray-800 mb-2">
            {isPaused ? 'Recording Paused' : 'Recording Your Dream'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Speak naturally about your dream experience
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {transcript && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
              <p className="text-sm text-gray-700 text-left">{transcript}</p>
            </div>
          )}
          
          {/* Audio Waveform Simulation */}
          <div className="flex justify-center items-end space-x-1 mb-6 h-8">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-primary rounded-full ${isListening && !isPaused ? 'animate-bounce' : ''}`}
                style={{
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
          
          <div className="flex space-x-4 justify-center mb-4">
            <Button
              onClick={handleStop}
              variant="destructive"
              size="lg"
              className="w-12 h-12 rounded-full"
            >
              <Square className="w-5 h-5" />
            </Button>
            <Button
              onClick={handlePause}
              variant="secondary"
              size="lg"
              className="w-12 h-12 rounded-full"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            {formatDuration(duration)} / 05:00
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
