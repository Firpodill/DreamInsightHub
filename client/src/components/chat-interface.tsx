import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Brain, Keyboard, Info, Volume2 } from "lucide-react";
import { VoiceRecorder } from "./voice-recorder";
import { useAnalyzeDream } from "@/hooks/use-dreams";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useLocation } from "wouter";
import { VoiceInputTooltip, useVoiceInputTooltip } from "./voice-input-tooltip";
import backgroundImage from "@assets/vecteezy_open-red-lips-with-speech-bubble-pop-art-background-on-dot_.jpg";

interface ChatInterfaceProps {
  onDecodeComplete?: () => void;
}

export function ChatInterface({ onDecodeComplete }: ChatInterfaceProps = {}) {
  const [dreamText, setDreamText] = useState("");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('voice'); // Default to voice mode
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [statusFading, setStatusFading] = useState(false);
  const [location, navigate] = useLocation();
  const analyzeDream = useAnalyzeDream();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { showTooltip, dismissTooltip, dontShowAgain } = useVoiceInputTooltip();

  // Force mobile keyboard when switching to text mode
  useEffect(() => {
    if (inputMode === 'text' && textareaRef.current) {
      const timer = setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [inputMode]);

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
      // Trigger fade out when user starts speaking
      if (transcript.trim() && !statusFading) {
        setStatusFading(true);
      }
    }
    // Reset status fading when not transcribing
    if (!isTranscribing) {
      setStatusFading(false);
    }
  }, [transcript, isTranscribing, statusFading]);

  // Auto-scroll voice transcript container to bottom when new text is added
  useEffect(() => {
    if (isTranscribing && currentTranscript) {
      const transcriptContainer = document.querySelector('.voice-transcript-container');
      if (transcriptContainer) {
        transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
      }
    }
  }, [currentTranscript, isTranscribing]);

  const handleDecodeClick = async () => {
    if (!dreamText.trim()) return;
    
    // Save dream text to localStorage for the analysis page
    localStorage.setItem('currentDreamText', dreamText);
    localStorage.setItem('shouldAutoAnalyze', 'true');
    
    // Immediately switch to Analysis tab to start analysis
    if (onDecodeComplete) {
      onDecodeComplete();
    } else {
      // Fallback to navigation if no callback provided
      navigate('/analysis');
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
          <div className="w-full h-full flex items-center justify-center p-6 relative overflow-hidden text-bubble-container">
            {/* Enhanced fade overlay for smooth text containment */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white via-white/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/70 to-transparent"></div>
              <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-white via-white/60 to-transparent"></div>
              <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-white via-white/60 to-transparent"></div>
            </div>
            
            {inputMode === 'voice' && isTranscribing ? (
              <div className="w-full h-full flex flex-col relative">
                <div className="voice-transcript-container speech-bubble-text text-gray-900 text-base leading-relaxed font-medium text-center overflow-y-auto scrollbar-hide flex-1 flex items-center justify-center px-2">
                  <div className="break-words">
                    {currentTranscript || "Listening..."}
                  </div>
                </div>
                {!currentTranscript && (
                  <div className={`absolute top-4 left-4 text-xs text-gray-800 bg-white/90 px-2 py-1 rounded border ${statusFading ? 'recording-status-fade' : 'recording-status-pulse'}`} style={{ zIndex: 30 }}>
                    🎤 Click SPEAK to STOP
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="w-full h-full flex flex-col relative"
                onClick={() => {
                  // When user taps in text mode, force mobile keyboard to appear
                  if (inputMode === 'text' && textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.click();
                    // Force cursor position to trigger keyboard on iOS
                    textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
                  }
                }}
              >
                <Textarea
                  ref={textareaRef}
                  value={dreamText}
                  onChange={(e) => {
                    setDreamText(e.target.value);
                    // Trigger fade out when user starts typing
                    if (e.target.value.trim() && !statusFading) {
                      setStatusFading(true);
                    }
                  }}
                  placeholder={inputMode === 'text' ? "Type your dream here..." : ""}
                  className="w-full h-full bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500 text-base leading-relaxed font-medium text-center speech-bubble-text scrollbar-hide"
                  style={{
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto',
                    overflowY: 'auto',
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    scrollBehavior: 'smooth',
                    WebkitUserSelect: 'text',
                    userSelect: 'text'
                  }}
                  disabled={isDecoding || (inputMode === 'voice' && !isTranscribing)}
                  readOnly={inputMode === 'voice' && !isTranscribing}
                  autoFocus={inputMode === 'text'}
                  inputMode="text"
                  enterKeyHint="done"
                  onInput={(e) => {
                    // Auto-scroll to bottom as user types
                    const textarea = e.target as HTMLTextAreaElement;
                    textarea.scrollTop = textarea.scrollHeight;
                  }}
                  onTouchStart={() => {
                    // Force focus on mobile touch to trigger keyboard
                    if (inputMode === 'text' && textareaRef.current) {
                      textareaRef.current.focus();
                    }
                  }}
                  onFocus={() => {
                    // Ensure mobile keyboard appears by scrolling element into view
                    if (textareaRef.current) {
                      setTimeout(() => {
                        textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    }
                  }}
                />
                {inputMode === 'text' && !dreamText.trim() && (
                  <div className={`absolute top-4 left-4 text-xs text-gray-800 bg-white/90 px-2 py-1 rounded border ${statusFading ? 'recording-status-fade' : 'recording-status-pulse'}`} style={{ zIndex: 30 }}>
                    ⌨️ Start typing...
                  </div>
                )}
              </div>
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
              const newMode = inputMode === 'voice' ? 'text' : 'voice';
              setInputMode(newMode);
              if (isTranscribing) {
                setIsTranscribing(false);
                setIsVoiceRecording(false);
                stopListening();
                resetTranscript();
              }
              
              // When switching to text mode, force mobile keyboard to appear
              if (newMode === 'text') {
                setTimeout(() => {
                  if (textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.click();
                    // Force selection to ensure keyboard appears on iOS
                    textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
                  }
                }, 150);
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

      {/* Voice Input Tooltip */}
      <VoiceInputTooltip
        isVisible={showTooltip}
        onDismiss={dismissTooltip}
        onDontShowAgain={dontShowAgain}
      />
    </div>
  );
}