import { useState, useEffect, useCallback } from 'react';

interface AudioInstance {
  id: string;
  stop: () => void;
  isPlaying: boolean;
}

class GlobalAudioManager {
  private static instance: GlobalAudioManager;
  private audioInstances: Map<string, AudioInstance> = new Map();
  private listeners: Set<() => void> = new Set();

  static getInstance(): GlobalAudioManager {
    if (!GlobalAudioManager.instance) {
      GlobalAudioManager.instance = new GlobalAudioManager();
    }
    return GlobalAudioManager.instance;
  }

  registerAudio(id: string, stopFn: () => void): void {
    this.audioInstances.set(id, {
      id,
      stop: stopFn,
      isPlaying: false
    });
    this.notifyListeners();
  }

  unregisterAudio(id: string): void {
    this.audioInstances.delete(id);
    this.notifyListeners();
  }

  setPlaying(id: string, isPlaying: boolean): void {
    const instance = this.audioInstances.get(id);
    if (instance) {
      instance.isPlaying = isPlaying;
      this.notifyListeners();
    }
  }

  stopAllExcept(excludeId?: string): void {
    this.audioInstances.forEach((instance, id) => {
      if (id !== excludeId && instance.isPlaying) {
        instance.stop();
        instance.isPlaying = false;
      }
    });
    this.notifyListeners();
  }

  stopAll(): void {
    this.audioInstances.forEach((instance) => {
      if (instance.isPlaying) {
        instance.stop();
        instance.isPlaying = false;
      }
    });
    this.notifyListeners();
  }

  isAnyPlaying(): boolean {
    return Array.from(this.audioInstances.values()).some(instance => instance.isPlaying);
  }

  addListener(listener: () => void): void {
    this.listeners.add(listener);
  }

  removeListener(listener: () => void): void {
    this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export function useGlobalAudioManager(audioId: string) {
  const [, forceUpdate] = useState({});
  const manager = GlobalAudioManager.getInstance();

  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    manager.addListener(triggerUpdate);
    return () => {
      manager.removeListener(triggerUpdate);
      manager.unregisterAudio(audioId);
    };
  }, [audioId, manager, triggerUpdate]);

  const registerAudio = useCallback((stopFn: () => void) => {
    manager.registerAudio(audioId, stopFn);
  }, [audioId, manager]);

  const setPlaying = useCallback((isPlaying: boolean) => {
    if (isPlaying) {
      manager.stopAllExcept(audioId);
    }
    manager.setPlaying(audioId, isPlaying);
  }, [audioId, manager]);

  const stopAll = useCallback(() => {
    manager.stopAll();
  }, [manager]);

  return {
    registerAudio,
    setPlaying,
    stopAll,
    isAnyPlaying: manager.isAnyPlaying()
  };
}

// Global click handler to stop all audio when clicking outside audio controls
export function useGlobalClickHandler() {
  const manager = GlobalAudioManager.getInstance();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't stop audio if clicking on voice-related controls
      if (target.closest('[data-voice-control]') || 
          target.closest('.voice-selector') ||
          target.closest('[role="dialog"]') ||
          target.tagName === 'BUTTON' && (
            target.textContent?.includes('Listen') ||
            target.textContent?.includes('Stop') ||
            target.querySelector('[class*="volume"]')
          )) {
        return;
      }
      
      // Stop all audio for clicks outside voice controls
      manager.stopAll();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        manager.stopAll();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Stop audio on Escape key
      if (event.key === 'Escape') {
        manager.stopAll();
      }
    };

    // Stop audio on page clicks (except voice controls)
    document.addEventListener('click', handleClick);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [manager]);
}