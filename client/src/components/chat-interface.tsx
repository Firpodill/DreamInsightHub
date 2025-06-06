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
      {/* Voice Interface - Realistic Red Lips */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsVoiceRecording(true)}
          className="relative group transition-all duration-300 hover:scale-105 focus:outline-none"
          disabled={isDecoding}
        >
          {/* Lips Container */}
          <div className="relative w-80 h-32">
            <svg viewBox="0 0 320 128" className="w-full h-full filter drop-shadow-2xl">
              <defs>
                {/* Main lip gradient */}
                <radialGradient id="lipsMainGradient" cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ff4757" />
                  <stop offset="30%" stopColor="#ff3838" />
                  <stop offset="60%" stopColor="#e55039" />
                  <stop offset="90%" stopColor="#c44569" />
                  <stop offset="100%" stopColor="#8b2635" />
                </radialGradient>
                
                {/* Top lip highlight gradient */}
                <linearGradient id="topLipHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b7a" opacity="0.9" />
                  <stop offset="50%" stopColor="#ff4757" opacity="0.6" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                
                {/* Bottom lip highlight */}
                <radialGradient id="bottomLipHighlight" cx="50%" cy="70%" r="60%">
                  <stop offset="0%" stopColor="#ff6b7a" opacity="0.8" />
                  <stop offset="70%" stopColor="transparent" />
                </radialGradient>
                
                {/* Inner mouth gradient */}
                <radialGradient id="mouthGradient" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#1a1a2e" />
                  <stop offset="50%" stopColor="#16213e" />
                  <stop offset="100%" stopColor="#0f0f23" />
                </radialGradient>
                
                {/* Soft glow filter */}
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Outer lip shadow */}
              <path
                d="M 32 64 Q 56 24, 80 32 Q 120 16, 160 16 Q 200 16, 240 32 Q 264 24, 288 64 Q 264 104, 240 96 Q 200 112, 160 112 Q 120 112, 80 96 Q 56 104, 32 64 Z"
                fill="#8b2635"
                opacity="0.4"
                transform="translate(2, 3)"
                filter="url(#softGlow)"
              />
              
              {/* Main lip shape */}
              <path
                d="M 30 64 Q 54 22, 78 30 Q 118 14, 160 14 Q 202 14, 242 30 Q 266 22, 290 64 Q 266 106, 242 98 Q 202 114, 160 114 Q 118 114, 78 98 Q 54 106, 30 64 Z"
                fill="url(#lipsMainGradient)"
                stroke="#a0253f"
                strokeWidth="2"
              />
              
              {/* Top lip definition and highlight */}
              <path
                d="M 40 56 Q 78 26, 120 32 Q 140 24, 160 24 Q 180 24, 200 32 Q 242 26, 280 56 Q 242 48, 200 44 Q 180 40, 160 40 Q 140 40, 120 44 Q 78 48, 40 56 Z"
                fill="url(#topLipHighlight)"
              />
              
              {/* Bottom lip highlight */}
              <ellipse
                cx="160"
                cy="85"
                rx="90"
                ry="18"
                fill="url(#bottomLipHighlight)"
              />
              
              {/* Cupid's bow detail */}
              <path
                d="M 140 30 Q 150 26, 160 28 Q 170 26, 180 30 Q 170 34, 160 32 Q 150 34, 140 30 Z"
                fill="#ff6b7a"
                opacity="0.7"
              />
              
              {/* Inner mouth opening */}
              <ellipse
                cx="160"
                cy="64"
                rx="75"
                ry="18"
                fill="url(#mouthGradient)"
              />
              
              {/* Inner mouth depth */}
              <ellipse
                cx="160"
                cy="66"
                rx="65"
                ry="12"
                fill="#0a0a18"
                opacity="0.8"
              />
              
              {/* Teeth highlight */}
              <ellipse
                cx="160"
                cy="58"
                rx="60"
                ry="4"
                fill="#f8f9fa"
                opacity="0.3"
              />
              
              {/* Microphone with better styling */}
              <circle cx="160" cy="64" r="16" fill="rgba(255,255,255,0.95)" stroke="#ddd" strokeWidth="1"/>
              <circle cx="160" cy="64" r="12" fill="rgba(248,249,250,0.9)"/>
              <foreignObject x="150" y="54" width="20" height="20">
                <div className="flex items-center justify-center w-full h-full">
                  <Mic className="w-4 h-4 text-gray-600" />
                </div>
              </foreignObject>
            </svg>
            
            {/* PRESS text with better positioning */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <span className="text-white font-black text-xl tracking-[0.4em] drop-shadow-xl text-shadow-lg">
                PRESS
              </span>
            </div>
            
            {/* SPEAK text with better positioning */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <span className="text-white font-black text-xl tracking-[0.4em] drop-shadow-xl text-shadow-lg">
                SPEAK
              </span>
            </div>
            
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-full pointer-events-none"></div>
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