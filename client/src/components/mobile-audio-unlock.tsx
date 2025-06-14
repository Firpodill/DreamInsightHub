import { Button } from "@/components/ui/button";
import { Volume2, Smartphone } from "lucide-react";
import { useMobileAudio } from "@/hooks/use-mobile-audio";

export function MobileAudioUnlock() {
  const { isAudioUnlocked, unlockAudio, needsUnlock } = useMobileAudio();

  if (!needsUnlock || isAudioUnlocked) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5" />
          <div>
            <p className="font-semibold text-sm">Enable Audio for Mobile</p>
            <p className="text-xs opacity-90">Tap to unlock voice features on your device</p>
          </div>
        </div>
        <Button
          onClick={unlockAudio}
          variant="secondary"
          size="sm"
          className="bg-white text-purple-600 hover:bg-gray-100 flex items-center gap-2"
        >
          <Volume2 className="w-4 h-4" />
          Enable Audio
        </Button>
      </div>
    </div>
  );
}