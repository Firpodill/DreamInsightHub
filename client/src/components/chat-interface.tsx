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
    <div className="flex flex-col space-y-6 pb-8">
      {/* Voice Interface - Realistic Red Lips */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsVoiceRecording(true)}
          className="relative group transition-all duration-300 hover:scale-105 focus:outline-none"
          disabled={isDecoding}
        >
          {/* Clean Professional Lips */}
          <div className="relative w-80 h-28">
            <svg viewBox="0 0 320 112" className="w-full h-full filter drop-shadow-lg">
              <defs>
                {/* Clean red gradient */}
                <linearGradient id="cleanLipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff5757" />
                  <stop offset="30%" stopColor="#ee5a52" />
                  <stop offset="70%" stopColor="#c44569" />
                  <stop offset="100%" stopColor="#8b2635" />
                </linearGradient>
                
                {/* Top highlight */}
                <linearGradient id="topShine" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" opacity="0.8" />
                  <stop offset="50%" stopColor="#ffffff" opacity="0.3" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                
                {/* Bottom shadow */}
                <linearGradient id="bottomShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="60%" stopColor="#6b1229" opacity="0.3" />
                  <stop offset="100%" stopColor="#6b1229" opacity="0.6" />
                </linearGradient>

                {/* Mouth interior */}
                <radialGradient id="mouthDark" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#1a0606" />
                  <stop offset="70%" stopColor="#0d0303" />
                  <stop offset="100%" stopColor="#000000" />
                </radialGradient>
              </defs>
              
              {/* Shadow */}
              <ellipse cx="160" cy="60" rx="110" ry="18" fill="#000000" opacity="0.25" transform="translate(0, 6)"/>
              
              {/* Main lip shape - classic beautiful lips */}
              <path
                d="M 40 56 Q 65 20, 95 28 Q 125 12, 160 12 Q 195 12, 225 28 Q 255 20, 280 56 Q 270 78, 240 75 Q 210 88, 185 85 Q 172 90, 160 90 Q 148 90, 135 85 Q 110 88, 80 75 Q 50 78, 40 56 Z"
                fill="url(#cleanLipGrad)"
                stroke="#8b2635"
                strokeWidth="1"
              />
              
              {/* Top lip highlight */}
              <path
                d="M 50 52 Q 80 28, 115 35 Q 137 22, 160 22 Q 183 22, 205 35 Q 240 28, 270 52 Q 240 42, 205 38 Q 183 32, 160 32 Q 137 32, 115 38 Q 80 42, 50 52 Z"
                fill="url(#topShine)"
              />
              
              {/* Cupid's bow */}
              <path
                d="M 145 24 Q 152 18, 160 20 Q 168 18, 175 24 Q 168 28, 160 26 Q 152 28, 145 24 Z"
                fill="#ff8895"
                opacity="0.9"
              />
              
              {/* Bottom lip highlight */}
              <ellipse
                cx="160"
                cy="70"
                rx="70"
                ry="10"
                fill="url(#topShine)"
                opacity="0.6"
              />
              
              {/* Shadow overlay */}
              <path
                d="M 40 56 Q 65 20, 95 28 Q 125 12, 160 12 Q 195 12, 225 28 Q 255 20, 280 56 Q 270 78, 240 75 Q 210 88, 185 85 Q 172 90, 160 90 Q 148 90, 135 85 Q 110 88, 80 75 Q 50 78, 40 56 Z"
                fill="url(#bottomShadow)"
              />
              
              {/* Mouth opening */}
              <ellipse
                cx="160"
                cy="56"
                rx="60"
                ry="12"
                fill="url(#mouthDark)"
              />
              
              {/* Subtle teeth */}
              <ellipse
                cx="160"
                cy="52"
                rx="45"
                ry="4"
                fill="#f8f9fa"
                opacity="0.7"
              />
              
              {/* Glossy highlights */}
              <ellipse
                cx="130"
                cy="40"
                rx="18"
                ry="6"
                fill="#ffffff"
                opacity="0.7"
                transform="rotate(-15 130 40)"
              />
              
              <ellipse
                cx="190"
                cy="40"
                rx="18"
                ry="6"
                fill="#ffffff"
                opacity="0.7"
                transform="rotate(15 190 40)"
              />
              
              <ellipse
                cx="160"
                cy="75"
                rx="25"
                ry="4"
                fill="#ffffff"
                opacity="0.5"
              />
              
              {/* Microphone */}
              <circle cx="160" cy="56" r="15" fill="rgba(255,255,255,0.95)" stroke="#ddd" strokeWidth="1"/>
              <circle cx="160" cy="56" r="11" fill="rgba(248,249,250,0.9)"/>
              <foreignObject x="151" y="47" width="18" height="18">
                <div className="flex items-center justify-center w-full h-full">
                  <Mic className="w-3.5 h-3.5 text-gray-600" />
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
              placeholder=""
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