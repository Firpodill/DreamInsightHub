import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic } from "lucide-react";
import { VoiceRecorder } from "./voice-recorder";
import { useAnalyzeDream } from "@/hooks/use-dreams";

export function ChatInterface() {
  const [dreamText, setDreamText] = useState("");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const analyzeDream = useAnalyzeDream();

  const handleDecodeClick = async () => {
    if (!dreamText.trim()) return;
    
    try {
      setIsDecoding(true);
      await analyzeDream.mutateAsync(dreamText);
    } catch (error) {
      console.error("Error analyzing dream:", error);
    } finally {
      setIsDecoding(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-400 relative overflow-hidden">
      {/* Polka dot pattern */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `radial-gradient(circle, #ff6b6b 2px, transparent 2px)`,
          backgroundSize: '30px 30px'
        }}
      />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        
        {/* Speech Bubble - positioned exactly like reference (upper left) */}
        <div className="absolute top-16 left-8">
          <svg viewBox="0 0 400 300" className="w-72 h-54">
            <defs>
              {/* Yellow halftone pattern exactly like reference */}
              <pattern id="yellowDots" patternUnits="userSpaceOnUse" width="6" height="6">
                <circle cx="3" cy="3" r="1" fill="#ffc107" opacity="0.6"/>
              </pattern>
              
              <filter id="cloudShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="4" dy="4" stdDeviation="2" floodColor="#00000025"/>
              </filter>
            </defs>
            
            {/* Exact cloud shape from reference image */}
            <path
              d="M 90 120 Q 70 100, 90 80 Q 110 60, 140 70 Q 170 50, 210 60 Q 250 45, 290 60 Q 320 50, 340 70 Q 360 90, 340 110 Q 360 130, 340 150 Q 320 170, 290 160 Q 250 175, 210 165 Q 190 180, 170 170 L 150 210 L 160 170 Q 140 180, 110 170 Q 90 160, 70 140 Q 50 120, 70 100 Q 90 140, 90 120"
              fill="white"
              stroke="#000000"
              strokeWidth="6"
              filter="url(#cloudShadow)"
            />
            
            {/* Halftone areas exactly like reference */}
            <ellipse cx="130" cy="100" rx="20" ry="15" fill="url(#yellowDots)" opacity="0.7"/>
            <ellipse cx="270" cy="120" rx="25" ry="18" fill="url(#yellowDots)" opacity="0.5"/>
          </svg>
          
          {/* Text area */}
          <div className="absolute inset-0 flex items-center justify-center px-10 py-6">
            <Textarea
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="Your dream..."
              className="w-full h-12 bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-400 text-sm leading-relaxed font-medium text-center"
              disabled={isDecoding}
            />
          </div>
        </div>

        {/* Large Lips - exact replica of reference image */}
        <div className="flex justify-center items-end min-h-screen pb-32">
          <button
            onClick={() => setIsVoiceRecording(true)}
            className="relative group transition-all duration-300 hover:scale-105 focus:outline-none"
            disabled={isDecoding}
          >
            <svg viewBox="0 0 600 300" className="w-[500px] h-64">
              <defs>
                {/* Red halftone pattern exactly matching reference */}
                <pattern id="redDotPattern" patternUnits="userSpaceOnUse" width="3" height="3">
                  <circle cx="1.5" cy="1.5" r="0.8" fill="#dc2626" opacity="0.8"/>
                </pattern>
                
                <filter id="lipDropShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="4" dy="4" stdDeviation="3" floodColor="#00000040"/>
                </filter>
              </defs>
              
              {/* Main lip ellipse exactly like reference - very wide and horizontal */}
              <ellipse 
                cx="300" 
                cy="150" 
                rx="280" 
                ry="120" 
                fill="url(#redDotPattern)"
                stroke="#000000"
                strokeWidth="6"
                filter="url(#lipDropShadow)"
              />
              
              {/* Black mouth opening - wide horizontal ellipse like reference */}
              <ellipse cx="300" cy="150" rx="200" ry="40" fill="#000000"/>
              
              {/* White teeth exactly like reference */}
              <rect x="220" y="135" width="16" height="30" rx="3" fill="white"/>
              <rect x="242" y="132" width="18" height="36" rx="3" fill="white"/>
              <rect x="266" y="130" width="20" height="40" rx="3" fill="white"/>
              <rect x="292" y="130" width="20" height="40" rx="3" fill="white"/>
              <rect x="318" y="130" width="20" height="40" rx="3" fill="white"/>
              <rect x="344" y="132" width="18" height="36" rx="3" fill="white"/>
              <rect x="368" y="135" width="16" height="30" rx="3" fill="white"/>
              
              {/* Black line details exactly like reference */}
              <path d="M 60 100 Q 150 85, 300 95 Q 450 85, 540 100" stroke="#000000" strokeWidth="5" fill="none"/>
              <path d="M 80 200 Q 190 215, 300 205 Q 410 215, 520 200" stroke="#000000" strokeWidth="5" fill="none"/>
              <path d="M 40 150 Q 120 135, 200 150" stroke="#000000" strokeWidth="4" fill="none"/>
              <path d="M 400 150 Q 480 135, 560 150" stroke="#000000" strokeWidth="4" fill="none"/>
              
              {/* White highlights exactly like reference */}
              <ellipse cx="180" cy="80" rx="40" ry="15" fill="white" opacity="0.9" transform="rotate(-15 180 80)"/>
              <ellipse cx="420" cy="80" rx="40" ry="15" fill="white" opacity="0.9" transform="rotate(15 420 80)"/>
            </svg>
            
            {/* SPEAK text */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <span className="text-black font-black text-2xl tracking-wider">
                SPEAK
              </span>
            </div>
          </button>
        </div>

        {/* Decode Button - positioned below lips */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleDecodeClick}
            disabled={!dreamText.trim() || isDecoding}
            className="px-8 py-4 bg-black text-white font-black text-xl tracking-wider border-4 border-black hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            style={{
              boxShadow: '6px 6px 0px #ff6b6b'
            }}
          >
            {isDecoding ? 'DECODING...' : 'DECODE MY DREAM NOW'}
          </button>
        </div>
      </div>

      {/* Voice Recorder Modal */}
      <VoiceRecorder
        open={isVoiceRecording}
        onClose={() => setIsVoiceRecording(false)}
        onTranscriptionComplete={(text) => {
          setDreamText(text);
          setIsVoiceRecording(false);
        }}
      />
    </div>
  );
}