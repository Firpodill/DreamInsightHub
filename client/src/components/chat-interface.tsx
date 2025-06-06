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
          {/* Vector Lips from EPS */}
          <div className="relative w-80 h-32">
            <svg viewBox="0 0 8000 3000" className="w-full h-full filter drop-shadow-lg">
              <defs>
                {/* Lip gradient from EPS */}
                <linearGradient id="epsLipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d52f34" />
                  <stop offset="30%" stopColor="#c42d32" />
                  <stop offset="60%" stopColor="#b02a30" />
                  <stop offset="100%" stopColor="#4d2d27" />
                </linearGradient>
                
                {/* Highlight overlay */}
                <radialGradient id="epsHighlight" cx="50%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#ffffff" opacity="0.6" />
                  <stop offset="50%" stopColor="#ffffff" opacity="0.2" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                
                {/* Shadow definition */}
                <linearGradient id="epsShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="70%" stopColor="#4d2d27" opacity="0.4" />
                  <stop offset="100%" stopColor="#4d2d27" opacity="0.7" />
                </linearGradient>
              </defs>
              
              {/* Main lip shape from EPS file - scaled and positioned */}
              <path
                d="M 1307,2864 C 1247,2766 1432,2644 1544,2451 C 1741,2108 2099,1740 2812,1749 C 2938,1684 3174,1653 3281,1625 C 3773,1529 4265,1377 4759,1210 C 4909,1182 5069,1181 5201,1211 C 5337,1241 5401,1328 5465,1415 C 5671,1498 5887,1574 6077,1675 C 6267,1776 6440,1928 6548,2122 C 6705,2420 7079,2949 6638,3129 C 6197,3309 5518,3480 5107,3653 C 4633,3848 4135,4013 3622,3998 C 3378,3993 3121,3970 2892,3847 C 2763,3773 2658,3636 2546,3507 C 2349,3249 1470,3135 1307,2864"
                fill="url(#epsLipGradient)"
                stroke="#4d2d27"
                strokeWidth="8"
                transform="scale(0.8, 0.6) translate(400, -200)"
              />
              
              {/* Teeth from EPS */}
              <path
                d="M 3725,2645 C 3655,2645 3589,2662 3531,2651 C 3445,2636 3339,2614 3266,2662 C 3226,2684 3199,2727 3199,2775 V 2815 H 3951 V 2775 C 3951,2714 3859,2653 3725,2645"
                fill="#ffffff"
                transform="scale(0.8, 0.6) translate(400, -200)"
              />
              
              <path
                d="M 4538,2645 C 4468,2645 4402,2662 4344,2651 C 4258,2636 4152,2614 4079,2662 C 4039,2684 4012,2727 4012,2775 V 2815 H 4764 V 2775 C 4764,2714 4672,2653 4538,2645"
                fill="#ffffff"
                transform="scale(0.8, 0.6) translate(400, -200)"
              />
              
              <path
                d="M 5351,2679 C 5281,2679 5215,2696 5157,2685 C 5071,2670 4965,2648 4892,2696 C 4852,2718 4825,2761 4825,2809 V 2849 H 5577 V 2809 C 5577,2748 5485,2687 5351,2679"
                fill="#ffffff"
                transform="scale(0.8, 0.6) translate(400, -200)"
              />
              
              <path
                d="M 2912,2679 C 2842,2679 2776,2696 2718,2685 C 2632,2670 2526,2648 2453,2696 C 2413,2718 2386,2761 2386,2809 V 2849 H 3138 V 2809 C 3138,2748 3046,2687 2912,2679"
                fill="#ffffff"
                transform="scale(0.8, 0.6) translate(400, -200)"
              />
              
              {/* Highlight overlay */}
              <path
                d="M 1307,2864 C 1247,2766 1432,2644 1544,2451 C 1741,2108 2099,1740 2812,1749 C 2938,1684 3174,1653 3281,1625 C 3773,1529 4265,1377 4759,1210 C 4909,1182 5069,1181 5201,1211 C 5337,1241 5401,1328 5465,1415 C 5671,1498 5887,1574 6077,1675 C 6267,1776 6440,1928 6548,2122 C 6705,2420 7079,2949 6638,3129 C 6197,3309 5518,3480 5107,3653 C 4633,3848 4135,4013 3622,3998 C 3378,3993 3121,3970 2892,3847 C 2763,3773 2658,3636 2546,3507 C 2349,3249 1470,3135 1307,2864"
                fill="url(#epsHighlight)"
                transform="scale(0.8, 0.6) translate(400, -200)"
              />
              
              {/* Shadow overlay */}
              <path
                d="M 1307,2864 C 1247,2766 1432,2644 1544,2451 C 1741,2108 2099,1740 2812,1749 C 2938,1684 3174,1653 3281,1625 C 3773,1529 4265,1377 4759,1210 C 4909,1182 5069,1181 5201,1211 C 5337,1241 5401,1328 5465,1415 C 5671,1498 5887,1574 6077,1675 C 6267,1776 6440,1928 6548,2122 C 6705,2420 7079,2949 6638,3129 C 6197,3309 5518,3480 5107,3653 C 4633,3848 4135,4013 3622,3998 C 3378,3993 3121,3970 2892,3847 C 2763,3773 2658,3636 2546,3507 C 2349,3249 1470,3135 1307,2864"
                fill="url(#epsShadow)"
                transform="scale(0.8, 0.6) translate(400, -200)"
              />
              
              {/* Microphone positioned in center */}
              <circle cx="4000" cy="1500" r="200" fill="rgba(255,255,255,0.95)" stroke="#ddd" strokeWidth="15"/>
              <circle cx="4000" cy="1500" r="150" fill="rgba(248,249,250,0.9)"/>
              <foreignObject x="3900" y="1400" width="200" height="200">
                <div className="flex items-center justify-center w-full h-full">
                  <Mic className="w-16 h-16 text-gray-600" />
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