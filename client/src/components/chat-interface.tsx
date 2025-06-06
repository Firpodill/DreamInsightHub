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
          {/* Ultra-Realistic Lips Container */}
          <div className="relative w-80 h-36">
            <svg viewBox="0 0 320 144" className="w-full h-full filter drop-shadow-2xl">
              <defs>
                {/* Realistic lip base gradient */}
                <radialGradient id="ultraRealisticLip" cx="50%" cy="40%" r="80%">
                  <stop offset="0%" stopColor="#dc143c" />
                  <stop offset="25%" stopColor="#b91c3c" />
                  <stop offset="50%" stopColor="#a0253f" />
                  <stop offset="75%" stopColor="#8b1538" />
                  <stop offset="100%" stopColor="#6b1229" />
                </radialGradient>
                
                {/* Glossy overlay gradient */}
                <linearGradient id="glossyOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" opacity="0.6" />
                  <stop offset="15%" stopColor="#ffffff" opacity="0.4" />
                  <stop offset="30%" stopColor="#ffffff" opacity="0.1" />
                  <stop offset="70%" stopColor="transparent" />
                  <stop offset="85%" stopColor="#ffffff" opacity="0.2" />
                  <stop offset="100%" stopColor="#ffffff" opacity="0.4" />
                </linearGradient>
                
                {/* Inner lip gradient */}
                <radialGradient id="innerLipGradient" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#8b1538" />
                  <stop offset="50%" stopColor="#6b1229" />
                  <stop offset="100%" stopColor="#4a0e1c" />
                </radialGradient>
                
                {/* Mouth cavity gradient */}
                <radialGradient id="mouthCavity" cx="50%" cy="30%" r="80%">
                  <stop offset="0%" stopColor="#2d1b1b" />
                  <stop offset="40%" stopColor="#1a0f0f" />
                  <stop offset="80%" stopColor="#0f0808" />
                  <stop offset="100%" stopColor="#000000" />
                </radialGradient>
                
                {/* Teeth gradient */}
                <linearGradient id="teethGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#f8f9fa" />
                  <stop offset="70%" stopColor="#e9ecef" />
                  <stop offset="100%" stopColor="#dee2e6" />
                </linearGradient>
                
                {/* Texture pattern */}
                <pattern id="lipTexture" patternUnits="userSpaceOnUse" width="4" height="2">
                  <rect width="4" height="2" fill="none"/>
                  <path d="M0,1 Q2,0 4,1" stroke="#ffffff" strokeWidth="0.2" opacity="0.3" fill="none"/>
                </pattern>
                
                {/* Shine effect filter */}
                <filter id="shine" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
                  <feColorMatrix values="1 1 1 0 0  1 1 1 0 0  1 1 1 0 0  0 0 0 1 0"/>
                </filter>
              </defs>
              
              {/* Drop shadow */}
              <ellipse cx="160" cy="80" rx="120" ry="25" fill="#000000" opacity="0.3" filter="url(#shine)"/>
              
              {/* Main lip shape - more anatomically correct */}
              <path
                d="M 40 72 Q 60 35, 85 45 Q 110 25, 160 25 Q 210 25, 235 45 Q 260 35, 280 72 Q 270 95, 245 90 Q 220 110, 190 105 Q 175 112, 160 112 Q 145 112, 130 105 Q 100 110, 75 90 Q 50 95, 40 72 Z"
                fill="url(#ultraRealisticLip)"
                stroke="#6b1229"
                strokeWidth="1"
              />
              
              {/* Inner lip definition */}
              <path
                d="M 55 70 Q 75 55, 105 60 Q 130 50, 160 50 Q 190 50, 215 60 Q 245 55, 265 70 Q 245 80, 215 75 Q 190 85, 160 85 Q 130 85, 105 75 Q 75 80, 55 70 Z"
                fill="url(#innerLipGradient)"
              />
              
              {/* Mouth opening with realistic proportions */}
              <ellipse cx="160" cy="72" rx="80" ry="20" fill="url(#mouthCavity)"/>
              
              {/* Upper teeth */}
              <rect x="130" y="58" width="12" height="16" rx="2" fill="url(#teethGradient)" opacity="0.9"/>
              <rect x="144" y="56" width="14" height="18" rx="2" fill="url(#teethGradient)" opacity="0.95"/>
              <rect x="160" y="56" width="14" height="18" rx="2" fill="url(#teethGradient)"/>
              <rect x="176" y="56" width="14" height="18" rx="2" fill="url(#teethGradient)" opacity="0.95"/>
              <rect x="192" y="58" width="12" height="16" rx="2" fill="url(#teethGradient)" opacity="0.9"/>
              
              {/* Lower teeth */}
              <rect x="135" y="78" width="11" height="14" rx="1" fill="url(#teethGradient)" opacity="0.85"/>
              <rect x="148" y="76" width="12" height="16" rx="1" fill="url(#teethGradient)" opacity="0.9"/>
              <rect x="162" y="76" width="12" height="16" rx="1" fill="url(#teethGradient)" opacity="0.95"/>
              <rect x="176" y="76" width="12" height="16" rx="1" fill="url(#teethGradient)" opacity="0.9"/>
              <rect x="189" y="78" width="11" height="14" rx="1" fill="url(#teethGradient)" opacity="0.85"/>
              
              {/* Glossy highlight overlay */}
              <path
                d="M 40 72 Q 60 35, 85 45 Q 110 25, 160 25 Q 210 25, 235 45 Q 260 35, 280 72 Q 270 95, 245 90 Q 220 110, 190 105 Q 175 112, 160 112 Q 145 112, 130 105 Q 100 110, 75 90 Q 50 95, 40 72 Z"
                fill="url(#glossyOverlay)"
              />
              
              {/* Ultra-glossy shine spots */}
              <ellipse cx="120" cy="55" rx="15" ry="8" fill="#ffffff" opacity="0.8" transform="rotate(-15 120 55)"/>
              <ellipse cx="200" cy="55" rx="15" ry="8" fill="#ffffff" opacity="0.8" transform="rotate(15 200 55)"/>
              <ellipse cx="160" cy="95" rx="25" ry="6" fill="#ffffff" opacity="0.6"/>
              
              {/* Subtle texture overlay */}
              <path
                d="M 40 72 Q 60 35, 85 45 Q 110 25, 160 25 Q 210 25, 235 45 Q 260 35, 280 72 Q 270 95, 245 90 Q 220 110, 190 105 Q 175 112, 160 112 Q 145 112, 130 105 Q 100 110, 75 90 Q 50 95, 40 72 Z"
                fill="url(#lipTexture)"
                opacity="0.3"
              />
              
              {/* Microphone - positioned over mouth */}
              <circle cx="160" cy="72" r="18" fill="rgba(255,255,255,0.95)" stroke="#c0c0c0" strokeWidth="2"/>
              <circle cx="160" cy="72" r="14" fill="rgba(248,249,250,0.9)"/>
              <circle cx="160" cy="72" r="10" fill="rgba(240,242,245,0.8)"/>
              <foreignObject x="150" y="62" width="20" height="20">
                <div className="flex items-center justify-center w-full h-full">
                  <Mic className="w-5 h-5 text-gray-700" />
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