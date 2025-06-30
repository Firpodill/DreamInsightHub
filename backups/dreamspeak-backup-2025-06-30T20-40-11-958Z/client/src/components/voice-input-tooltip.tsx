import { useState, useEffect } from 'react';
import { X, Mic, Keyboard, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceInputTooltipProps {
  isVisible: boolean;
  onDismiss: () => void;
  onDontShowAgain: () => void;
}

export function VoiceInputTooltip({ isVisible, onDismiss, onDontShowAgain }: VoiceInputTooltipProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md mx-4 p-6 border-4 border-red-500 relative animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute top-2 right-2 h-8 w-8 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <Info className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-900">Voice Input Tips</h3>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Mic className="w-5 h-5 text-red-600 mr-2" />
              <span className="font-semibold text-gray-900">Voice Mode</span>
            </div>
            <p className="text-sm text-gray-700">
              Click the <span className="font-semibold bg-black text-white px-2 py-1 rounded">SPEAK</span> button to start voice recording. Speak your dream and click again to stop.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Keyboard className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold text-gray-900">Keyboard Mode</span>
            </div>
            <p className="text-sm text-gray-700">
              Click in the text area above the SPEAK button to type your dream manually instead of using voice.
            </p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">💡 Pro Tip:</span> You can switch between voice and keyboard at any time. Start with voice, then edit with keyboard, or vice versa!
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 mt-6">
          <Button
            onClick={onDismiss}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Got it, thanks!
          </Button>
          <Button
            onClick={onDontShowAgain}
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-800"
          >
            Don't show this again
          </Button>
        </div>
      </div>
    </div>
  );
}

// Hook to manage tooltip visibility
export function useVoiceInputTooltip() {
  const [showTooltip, setShowTooltip] = useState(false);
  const STORAGE_KEY = 'dreamspeak-voice-tooltip-dismissed';

  useEffect(() => {
    // Check if user has dismissed the tooltip before
    const hasBeenDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    
    if (!hasBeenDismissed) {
      // Show tooltip after a short delay when component mounts
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissTooltip = () => {
    setShowTooltip(false);
  };

  const dontShowAgain = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShowTooltip(false);
  };

  return {
    showTooltip,
    dismissTooltip,
    dontShowAgain
  };
}