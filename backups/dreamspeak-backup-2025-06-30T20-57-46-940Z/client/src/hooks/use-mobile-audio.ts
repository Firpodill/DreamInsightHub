import { useState, useEffect, useCallback } from 'react';

interface MobileAudioManager {
  isAudioUnlocked: boolean;
  unlockAudio: () => Promise<void>;
  needsUnlock: boolean;
}

export function useMobileAudio(): MobileAudioManager {
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);

  useEffect(() => {
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isMobile) {
      setNeedsUnlock(true);
      
      // Test if audio is already unlocked
      const testAudio = new Audio();
      testAudio.volume = 0;
      testAudio.play()
        .then(() => {
          setIsAudioUnlocked(true);
          setNeedsUnlock(false);
        })
        .catch(() => {
          setIsAudioUnlocked(false);
          setNeedsUnlock(true);
        });
    } else {
      setIsAudioUnlocked(true);
      setNeedsUnlock(false);
    }
  }, []);

  const unlockAudio = useCallback(async () => {
    try {
      // Create a silent audio context and play it to unlock audio
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create silent audio buffer
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);

      // Also try with HTML audio element
      const audio = new Audio();
      audio.volume = 0;
      audio.muted = true;
      
      // Use a data URL for a silent audio file
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmBw';
      
      await audio.play();
      
      setIsAudioUnlocked(true);
      setNeedsUnlock(false);
      
      console.log('Mobile audio unlocked successfully');
    } catch (error) {
      console.error('Failed to unlock mobile audio:', error);
      // Still mark as unlocked to prevent repeated attempts
      setIsAudioUnlocked(true);
      setNeedsUnlock(false);
    }
  }, []);

  return {
    isAudioUnlocked,
    unlockAudio,
    needsUnlock
  };
}