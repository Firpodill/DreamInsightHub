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
      await analyzeDream.mutateAsync({
        content: dreamText,
        userId: 1
      });
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
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Speech Bubble */}
        <div className="relative mb-8">
          <svg viewBox="0 0 400 200" className="w-80 h-40">
            <defs>
              <filter id="bubbleShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="4" dy="4" stdDeviation="6" floodColor="#00000030"/>
              </filter>
            </defs>
            
            {/* Speech bubble shape */}
            <path
              d="M 60 50 Q 60 30, 80 30 L 350 30 Q 370 30, 370 50 L 370 120 Q 370 140, 350 140 L 150 140 L 120 170 L 140 140 L 80 140 Q 60 140, 60 120 Z"
              fill="white"
              stroke="#000000"
              strokeWidth="4"
              filter="url(#bubbleShadow)"
            />
            
            {/* Halftone dots for pop art effect */}
            <pattern id="halftone" patternUnits="userSpaceOnUse" width="8" height="8">
              <circle cx="4" cy="4" r="1.5" fill="#ffd700" opacity="0.3"/>
            </pattern>
            <rect x="70" y="40" width="290" height="90" fill="url(#halftone)"/>
          </svg>
          
          {/* Text area inside bubble */}
          <div className="absolute inset-0 flex items-center justify-center px-12 py-8">
            <Textarea
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="Your dream will appear here..."
              className="w-full h-24 bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400 text-lg leading-relaxed font-medium text-center"
              disabled={isDecoding}
            />
          </div>
        </div>

        {/* Pop Art Lips */}
        <div className="relative mb-12">
          <button
            onClick={() => setIsVoiceRecording(true)}
            className="relative group transition-all duration-300 hover:scale-105 focus:outline-none"
            disabled={isDecoding}
          >
            <svg viewBox="0 0 200 100" className="w-48 h-24">
              <defs>
                <filter id="lipsShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="3" dy="3" stdDeviation="4" floodColor="#00000040"/>
                </filter>
                
                {/* Halftone pattern for lips */}
                <pattern id="lipHalftone" patternUnits="userSpaceOnUse" width="4" height="4">
                  <circle cx="2" cy="2" r="0.8" fill="#ff1744" opacity="0.6"/>
                </pattern>
              </defs>
              
              {/* Lip outline */}
              <path
                d="M 30 50 Q 50 20, 75 30 Q 90 15, 100 15 Q 110 15, 125 30 Q 150 20, 170 50 Q 150 75, 125 70 Q 110 85, 100 85 Q 90 85, 75 70 Q 50 75, 30 50 Z"
                fill="#ff5252"
                stroke="#000000"
                strokeWidth="3"
                filter="url(#lipsShadow)"
              />
              
              {/* Halftone overlay */}
              <path
                d="M 30 50 Q 50 20, 75 30 Q 90 15, 100 15 Q 110 15, 125 30 Q 150 20, 170 50 Q 150 75, 125 70 Q 110 85, 100 85 Q 90 85, 75 70 Q 50 75, 30 50 Z"
                fill="url(#lipHalftone)"
              />
              
              {/* Mouth opening */}
              <ellipse cx="100" cy="50" rx="35" ry="8" fill="#000000"/>
              
              {/* Teeth */}
              <rect x="80" y="46" width="6" height="8" rx="1" fill="white" opacity="0.9"/>
              <rect x="88" y="45" width="7" height="10" rx="1" fill="white"/>
              <rect x="97" y="45" width="7" height="10" rx="1" fill="white"/>
              <rect x="106" y="45" width="7" height="10" rx="1" fill="white"/>
              <rect x="115" y="46" width="6" height="8" rx="1" fill="white" opacity="0.9"/>
              
              {/* Highlight */}
              <ellipse cx="80" cy="35" rx="12" ry="4" fill="white" opacity="0.7" transform="rotate(-15 80 35)"/>
              <ellipse cx="120" cy="35" rx="12" ry="4" fill="white" opacity="0.7" transform="rotate(15 120 35)"/>
            </svg>
            
            {/* SPEAK text */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <span className="text-black font-black text-lg tracking-wider drop-shadow-sm">
                SPEAK
              </span>
            </div>
          </button>
        </div>

        {/* Decode Button */}
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