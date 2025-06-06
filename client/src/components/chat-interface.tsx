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
          className="relative group transition-transform hover:scale-105"
          disabled={isDecoding}
        >
          {/* Red Lips Shape - More realistic */}
          <div className="relative w-72 h-28">
            <svg viewBox="0 0 288 112" className="w-full h-full filter drop-shadow-xl">
              <defs>
                <linearGradient id="lipsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="30%" stopColor="#ee5a52" />
                  <stop offset="70%" stopColor="#e74c3c" />
                  <stop offset="100%" stopColor="#c0392b" />
                </linearGradient>
                <linearGradient id="lipsHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff9999" opacity="0.8" />
                  <stop offset="50%" stopColor="#ff6666" opacity="0.4" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              
              {/* Main lip shape - more curved and realistic */}
              <path
                d="M 24 56 Q 48 16, 72 24 Q 96 12, 144 12 Q 192 12, 216 24 Q 240 16, 264 56 Q 240 96, 216 88 Q 192 100, 144 100 Q 96 100, 72 88 Q 48 96, 24 56 Z"
                fill="url(#lipsGradient)"
                stroke="#a93226"
                strokeWidth="1.5"
              />
              
              {/* Top lip highlight */}
              <path
                d="M 36 48 Q 72 20, 144 18 Q 216 20, 252 48 Q 228 40, 144 36 Q 60 40, 36 48 Z"
                fill="url(#lipsHighlight)"
              />
              
              {/* Mouth opening - more natural shape */}
              <path
                d="M 60 56 Q 90 44, 144 44 Q 198 44, 228 56 Q 198 68, 144 68 Q 90 68, 60 56 Z"
                fill="#2c3e50"
              />
              
              {/* Inner shadow for depth */}
              <path
                d="M 66 58 Q 96 50, 144 50 Q 192 50, 222 58 Q 192 62, 144 62 Q 96 62, 66 58 Z"
                fill="#1a252f"
              />
              
              {/* Microphone icon in center */}
              <circle cx="144" cy="56" r="14" fill="rgba(255,255,255,0.9)" />
              <foreignObject x="134" y="46" width="20" height="20">
                <div className="flex items-center justify-center w-full h-full">
                  <Mic className="w-4 h-4 text-gray-700" />
                </div>
              </foreignObject>
            </svg>
            
            {/* PRESS text */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <span className="text-white font-bold text-lg tracking-[0.3em] drop-shadow-lg">
                PRESS
              </span>
            </div>
            
            {/* SPEAK text */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <span className="text-white font-bold text-lg tracking-[0.3em] drop-shadow-lg">
                SPEAK
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Dream Diary - Cloud Shape */}
      <div className="flex justify-center px-4">
        <div className="relative w-full max-w-sm">
          {/* Cloud SVG Background */}
          <svg viewBox="0 0 320 180" className="w-full h-44 absolute inset-0">
            <defs>
              <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
              <linearGradient id="cloudShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="80%" stopColor="#cbd5e1" opacity="0.3" />
                <stop offset="100%" stopColor="#94a3b8" opacity="0.5" />
              </linearGradient>
              <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
              </filter>
            </defs>
            
            {/* Cloud shadow */}
            <path
              d="M 40 95 Q 25 80, 40 65 Q 55 50, 80 55 Q 110 35, 160 55 Q 210 35, 240 55 Q 265 50, 280 65 Q 295 80, 280 95 Q 295 110, 280 125 Q 265 140, 240 135 Q 210 155, 160 135 Q 110 155, 80 135 Q 55 140, 40 125 Q 25 110, 40 95 Z"
              fill="url(#cloudShadow)"
              transform="translate(2, 6)"
              filter="url(#cloudBlur)"
            />
            
            {/* Main cloud shape */}
            <path
              d="M 40 90 Q 25 75, 40 60 Q 55 45, 80 50 Q 110 30, 160 50 Q 210 30, 240 50 Q 265 45, 280 60 Q 295 75, 280 90 Q 295 105, 280 120 Q 265 135, 240 130 Q 210 150, 160 130 Q 110 150, 80 130 Q 55 135, 40 120 Q 25 105, 40 90 Z"
              fill="url(#cloudGradient)"
              stroke="#cbd5e1"
              strokeWidth="1"
              filter="drop-shadow(0 4px 8px rgba(0,0,0,0.1))"
            />
            
            {/* Cloud highlights */}
            <ellipse cx="100" cy="70" rx="25" ry="15" fill="rgba(255,255,255,0.6)" />
            <ellipse cx="180" cy="65" rx="20" ry="12" fill="rgba(255,255,255,0.4)" />
            <ellipse cx="220" cy="80" rx="15" ry="10" fill="rgba(255,255,255,0.3)" />
          </svg>
          
          {/* Text area inside cloud */}
          <div className="relative z-10 p-6 pt-4">
            <Textarea
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="Describe your dream here..."
              className="w-full h-20 bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-500 text-sm leading-relaxed font-medium"
              disabled={isDecoding}
            />
            
            {/* Dream Diary label */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <span className="text-gray-600 font-bold text-xs tracking-[0.2em]">
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
          className="relative group transition-transform hover:scale-105"
        >
          {/* Blue circular background with enhanced styling */}
          <div className="w-36 h-36 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden border-4 border-blue-300">
            {/* Outer ring effect */}
            <div className="absolute inset-2 border-2 border-blue-400/30 rounded-full"></div>
            
            {/* PRESS text around top arc */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <span className="text-white font-bold text-sm tracking-[0.3em] drop-shadow-md">
                PRESS
              </span>
            </div>
            
            {/* Jung's image placeholder - center circle */}
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 via-cyan-200 to-cyan-300 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center shadow-inner">
                <User className="w-10 h-10 text-white drop-shadow-sm" />
              </div>
            </div>
            
            {/* DECODE text around bottom arc */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <span className="text-white font-bold text-sm tracking-[0.3em] drop-shadow-md">
                DECODE
              </span>
            </div>
            
            {/* Glowing effect when enabled */}
            {dreamText.trim() && !isDecoding && (
              <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-pulse"></div>
            )}
            
            {/* Loading spinner overlay */}
            {isDecoding && (
              <div className="absolute inset-0 bg-blue-900/70 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {/* Disabled state overlay */}
          {(!dreamText.trim() || isDecoding) && (
            <div className="absolute inset-0 bg-gray-600/40 rounded-full"></div>
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