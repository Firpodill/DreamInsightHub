import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, User } from 'lucide-react';
import { useAnalyzeDream, useGenerateImage } from '@/hooks/use-dreams';
import { VoiceRecorder } from './voice-recorder';

export function ChatInterface() {
  const [dreamText, setDreamText] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);

  const analyzeDream = useAnalyzeDream();
  const generateImage = useGenerateImage();

  const handleVoiceComplete = (transcript: string) => {
    setIsVoiceRecording(false);
    if (transcript.trim()) {
      setDreamText(prev => (prev + ' ' + transcript).trim());
    }
  };

  const handleDecodeDream = async () => {
    if (!dreamText.trim()) return;

    setIsDecoding(true);
    try {
      const result = await analyzeDream.mutateAsync(dreamText);
      
      if (result.dream?.id) {
        setTimeout(() => {
          generateImage.mutate(result.dream.id);
        }, 2000);
      }

      setDreamText('');
    } catch (error) {
      console.error('Failed to decode dream:', error);
    } finally {
      setIsDecoding(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8 pb-8">
      {/* Voice Interface - Red Lips */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsVoiceRecording(true)}
          className="relative group"
          disabled={isDecoding}
        >
          {/* Red Lips Shape */}
          <div className="relative w-80 h-32">
            <svg viewBox="0 0 320 128" className="w-full h-full">
              <defs>
                <linearGradient id="lipsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
              </defs>
              
              {/* Outer lip shape */}
              <path
                d="M 40 64 Q 80 20, 160 20 Q 240 20, 280 64 Q 240 108, 160 108 Q 80 108, 40 64 Z"
                fill="url(#lipsGradient)"
                stroke="#991b1b"
                strokeWidth="2"
                className="drop-shadow-lg"
              />
              
              {/* Inner mouth opening */}
              <ellipse
                cx="160"
                cy="64"
                rx="80"
                ry="20"
                fill="#1e293b"
                className="opacity-90"
              />
              
              {/* Microphone icon in center */}
              <foreignObject x="140" y="50" width="40" height="28">
                <div className="flex items-center justify-center w-full h-full">
                  <Mic className="w-6 h-6 text-white drop-shadow-md" />
                </div>
              </foreignObject>
            </svg>
            
            {/* PRESS text */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <span className="text-white font-bold text-sm tracking-widest drop-shadow-md">
                PRESS
              </span>
            </div>
            
            {/* SPEAK text */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <span className="text-white font-bold text-sm tracking-widest drop-shadow-md">
                SPEAK
              </span>
            </div>
          </div>
          
          {/* Hover effect */}
          <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-200"></div>
        </button>
      </div>

      {/* Dream Diary - Cloud Shape */}
      <div className="flex justify-center px-4">
        <div className="relative w-full max-w-sm">
          {/* Cloud SVG Background */}
          <svg viewBox="0 0 400 200" className="w-full h-48 absolute inset-0">
            <defs>
              <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="50%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>
            
            {/* Cloud shape */}
            <path
              d="M 80 120 Q 60 100, 80 80 Q 100 60, 130 70 Q 160 50, 200 70 Q 240 50, 270 70 Q 300 60, 320 80 Q 340 100, 320 120 Q 340 140, 320 160 Q 300 180, 270 170 Q 240 190, 200 170 Q 160 190, 130 170 Q 100 180, 80 160 Q 60 140, 80 120 Z"
              fill="url(#cloudGradient)"
              stroke="#94a3b8"
              strokeWidth="2"
              className="drop-shadow-lg"
            />
          </svg>
          
          {/* Text area inside cloud */}
          <div className="relative z-10 p-8 pt-6">
            <Textarea
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="Describe your dream here..."
              className="w-full h-24 bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-500 text-sm leading-relaxed"
              disabled={isDecoding}
            />
            
            {/* Dream Diary label */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <span className="text-gray-600 font-medium text-xs tracking-wider">
                DREAM DIARY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decode Button - Blue Circle with Jung's image */}
      <div className="flex justify-center">
        <button
          onClick={handleDecodeDream}
          disabled={!dreamText.trim() || isDecoding}
          className="relative group"
        >
          {/* Blue circular background */}
          <div className="w-32 h-32 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-xl relative overflow-hidden">
            {/* PRESS text around top arc */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
              <span className="text-white font-bold text-xs tracking-widest">
                PRESS
              </span>
            </div>
            
            {/* Jung's image placeholder - center circle */}
            <div className="w-16 h-16 bg-gradient-to-b from-cyan-200 to-cyan-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* DECODE text around bottom arc */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
              <span className="text-white font-bold text-xs tracking-widest">
                DECODE
              </span>
            </div>
            
            {/* Loading spinner overlay */}
            {isDecoding && (
              <div className="absolute inset-0 bg-blue-900/50 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {/* Disabled state overlay */}
          {(!dreamText.trim() || isDecoding) && (
            <div className="absolute inset-0 bg-gray-500/30 rounded-full"></div>
          )}
        </button>
      </div>

      <VoiceRecorder
        open={isVoiceRecording}
        onClose={() => setIsVoiceRecording(false)}
        onTranscriptionComplete={handleVoiceComplete}
      />
    </div>
  );
}