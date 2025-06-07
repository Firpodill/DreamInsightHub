import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Brain, Keyboard, Info } from "lucide-react";
import { VoiceRecorder } from "./voice-recorder";
import { useAnalyzeDream } from "@/hooks/use-dreams";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useLocation } from "wouter";
import backgroundImage from "@assets/vecteezy_open-red-lips-with-speech-bubble-pop-art-background-on-dot_.jpg";

export function ChatInterface() {
  const [dreamText, setDreamText] = useState("");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('voice'); // Default to voice mode
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [location, navigate] = useLocation();
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
    
    // Save dream text to localStorage for the analysis page
    localStorage.setItem('currentDreamText', dreamText);
    
    // Navigate to analysis page
    navigate('/analysis');
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
          <div className="w-full h-full flex items-center justify-center p-6 relative overflow-hidden text-bubble-container">
            {/* Enhanced fade overlay for smooth text containment */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white via-white/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/70 to-transparent"></div>
              <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-white via-white/60 to-transparent"></div>
              <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-white via-white/60 to-transparent"></div>
            </div>
            
            {inputMode === 'voice' && isTranscribing ? (
              <div className="w-full h-full flex items-center justify-center speech-bubble-text">
                <div className="text-gray-900 text-base leading-relaxed font-medium text-center max-w-full max-h-full overflow-y-auto scrollbar-hide">
                  <div className="break-words px-2">{currentTranscript || "Listening..."}</div>
                  <div className="mt-2 text-sm text-gray-600 px-2">
                    🎤 Recording... Click SPEAK again to stop
                  </div>
                </div>
              </div>
            ) : (
              <Textarea
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder={inputMode === 'text' ? "Type your dream here..." : ""}
                className="w-full h-full bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500 text-base leading-relaxed font-medium text-center speech-bubble-text scrollbar-hide"
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  overflowY: 'auto',
                  paddingLeft: '8px',
                  paddingRight: '8px'
                }}
                disabled={isDecoding || (inputMode === 'voice' && !isTranscribing)}
                readOnly={inputMode === 'voice' && !isTranscribing}
              />
            )}
          </div>
        </div>

        {/* Help tooltip */}
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={() => setShowHelpTooltip(!showHelpTooltip)}
            className="bg-black bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
          >
            <Info size={16} className="text-white" />
          </button>
          
          {showHelpTooltip && (
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs p-3 rounded-lg shadow-lg whitespace-nowrap z-50">
              <div className="text-center">
                <div className="font-semibold mb-1">Input Mode Toggle</div>
                <div>Current mode: <span className="text-yellow-300">{inputMode === 'voice' ? 'Voice (Default)' : 'Type Mode'}</span></div>
                <div>Single click: Use current mode</div>
                <div>Double click: Switch modes <span className="text-yellow-300">(Type Mode)</span></div>
                <div className="mt-1 text-yellow-300">🎤 Voice → ⌨️ Type</div>
              </div>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black bg-opacity-90 rotate-45"></div>
            </div>
          )}
        </div>

        {/* Interactive button positioned over the lips in the image */}
        <div className="absolute bottom-[29%] left-[77%] w-[12%] h-[4%]">
          <button
            onClick={() => {
              if (inputMode === 'voice') {
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
              } else {
                // In text mode, toggle between voice and text
                setInputMode('voice');
              }
            }}
            onDoubleClick={() => {
              // Double-click to toggle modes
              setInputMode(inputMode === 'voice' ? 'text' : 'voice');
              if (isTranscribing) {
                setIsTranscribing(false);
                setIsVoiceRecording(false);
                stopListening();
                resetTranscript();
              }
            }}
            className={`w-full h-full bg-transparent hover:bg-black hover:bg-opacity-10 transition-all duration-300 focus:outline-none flex items-center justify-center ${isTranscribing ? 'animate-speak-pulse' : ''}`}
            disabled={isDecoding}
          >
            {/* Mode toggle display */}
            <span className="text-white font-black text-lg tracking-wider drop-shadow-lg px-3 py-1 rounded flex items-center gap-2">
              {inputMode === 'voice' ? (
                <>
                  <Mic 
                    size={16} 
                    className={isTranscribing ? "animate-mic-green-pulse" : "animate-mic-red-pulse"} 
                  />
                  <span>SPEAK</span>
                </>
              ) : (
                <>
                  <Keyboard 
                    size={16} 
                    className="text-blue-400" 
                  />
                  <span>TYPE</span>
                </>
              )}
            </span>
          </button>
        </div>

        {/* Decode Button positioned at bottom */}
        <div className="absolute left-1/2 transform -translate-x-1/2" style={{ bottom: '-10px' }}>
          <div className="relative">
            <button
              onClick={handleDecodeClick}
              disabled={!dreamText.trim() || isDecoding}
              className="w-40 h-40 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
                boxShadow: '4px 4px 0px #ff6b6b, inset 0 0 20px rgba(0,0,0,0.5)',
                border: '4px solid white',
                animation: 'spiral-border 3s linear infinite'
              }}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <Brain size={28} style={{ 
                  color: '#ffffff',
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                }} />
                <div 
                  style={{ 
                    position: 'relative',
                    zIndex: 10
                  }}>
                  <span style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    color: '#000000',
                    fontSize: '15px',
                    fontWeight: '900',
                    lineHeight: '1.0',
                    letterSpacing: '0.8px',
                    transform: 'translate(2px, 2px)',
                    opacity: 0.8
                  }}>DECODE<br />DREAM<br />NOW</span>
                  <span style={{
                    position: 'relative',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: '900',
                    lineHeight: '1.0',
                    letterSpacing: '0.8px',
                    display: 'block',
                    textAlign: 'center',
                    animation: 'pulse-glow 2s ease-in-out infinite'
                  }}>DECODE<br />DREAM<br />NOW</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}