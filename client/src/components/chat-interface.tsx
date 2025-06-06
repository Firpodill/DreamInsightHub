import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic } from "lucide-react";
import { VoiceRecorder } from "./voice-recorder";
import { useAnalyzeDream } from "@/hooks/use-dreams";
import backgroundImage from "@assets/vecteezy_open-red-lips-with-speech-bubble-pop-art-background-on-dot_.jpg";

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
    <div 
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      {/* Interactive overlay */}
      <div className="relative z-10 min-h-screen">
        
        {/* Text area positioned over the speech bubble in the image */}
        <div className="absolute top-[12%] left-[5%] w-[40%] h-[35%]">
          <div className="w-full h-full flex items-center justify-center p-6">
            <Textarea
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder=""
              className="w-full h-full bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500 text-base leading-relaxed font-medium text-center"
              disabled={isDecoding}
            />
          </div>
        </div>

        {/* Interactive button positioned over the lips in the image */}
        <div className="absolute bottom-[28%] left-[77%] w-[12%] h-[4%]">
          <button
            onClick={() => setIsVoiceRecording(true)}
            className="w-full h-full bg-transparent hover:bg-black hover:bg-opacity-10 transition-all duration-300 focus:outline-none flex items-center justify-center"
            disabled={isDecoding}
          >
            {/* SPEAK text in center of black mouth area */}
            <span className="text-white font-black text-lg tracking-wider drop-shadow-lg bg-black bg-opacity-70 px-3 py-1 rounded">
              SPEAK
            </span>
          </button>
        </div>

        {/* Decode Button positioned at bottom */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
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