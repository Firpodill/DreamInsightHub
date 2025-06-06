import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic } from "lucide-react";
import { VoiceRecorder } from "./voice-recorder";
import { useAnalyzeDream } from "@/hooks/use-dreams";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import backgroundImage from "@assets/vecteezy_open-red-lips-with-speech-bubble-pop-art-background-on-dot_.jpg";

export function ChatInterface() {
  const [dreamText, setDreamText] = useState("");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const analyzeDream = useAnalyzeDream();

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

  // Update current transcript when speech recognition changes
  useEffect(() => {
    if (isTranscribing && transcript) {
      setCurrentTranscript(transcript);
    }
  }, [transcript, isTranscribing]);

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
            {isTranscribing ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-900 text-base leading-relaxed font-medium text-center">
                  {currentTranscript || "Listening..."}
                  <div className="mt-2 text-sm text-gray-600">
                    🎤 Recording... Click SPEAK again to stop
                  </div>
                </div>
              </div>
            ) : (
              <Textarea
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder=""
                className="w-full h-full bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500 text-base leading-relaxed font-medium text-center"
                disabled={isDecoding}
              />
            )}
          </div>
        </div>

        {/* Interactive button positioned over the lips in the image */}
        <div className="absolute bottom-[29%] left-[77%] w-[12%] h-[4%]">
          <button
            onClick={() => {
              if (isTranscribing) {
                setIsTranscribing(false);
                setIsVoiceRecording(false);
                stopListening();
                if (currentTranscript) {
                  setDreamText(currentTranscript);
                  setCurrentTranscript("");
                }
                resetTranscript();
              } else {
                setIsTranscribing(true);
                setIsVoiceRecording(true);
                setCurrentTranscript("");
                resetTranscript();
                startListening();
              }
            }}
            className={`w-full h-full bg-transparent hover:bg-black hover:bg-opacity-10 transition-all duration-300 focus:outline-none flex items-center justify-center ${isTranscribing ? 'animate-speak-pulse' : ''}`}
            disabled={isDecoding}
          >
            {/* SPEAK text in center of black mouth area */}
            <span className="text-white font-black text-lg tracking-wider drop-shadow-lg px-3 py-1 rounded flex items-center gap-2">
              <Mic 
                size={16} 
                className={isTranscribing ? "animate-mic-green-pulse" : "animate-mic-red-pulse"} 
              />
              <span>SPEAK</span>
            </span>
          </button>
        </div>

        {/* Decode Button positioned at bottom */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleDecodeClick}
            disabled={!dreamText.trim() || isDecoding}
            className="relative px-12 py-5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-black text-2xl tracking-widest border-4 border-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 hover:rotate-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
            style={{
              boxShadow: '8px 8px 0px #000, 12px 12px 20px rgba(0,0,0,0.3)',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            <span className="relative z-10">
              {isDecoding ? '🔮 DECODING...' : '🔮 DECODE MY DREAM NOW'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-400 opacity-20 rounded-lg animate-pulse"></div>
          </button>
        </div>
      </div>


    </div>
  );
}