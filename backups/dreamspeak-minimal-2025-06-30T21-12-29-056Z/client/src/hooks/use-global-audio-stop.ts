// Global state to track if audio should be prevented
let globalAudioStopped = false;
let globalAudioInstances: HTMLAudioElement[] = [];

export const globalAudioManager = {
  stopAll: () => {
    console.log('Stopping all audio playback');
    
    // Stop all existing audio instances
    globalAudioInstances.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    // Clear the array
    globalAudioInstances = [];
    
    // Stop any audio elements in the DOM
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  },

  allowAudio: () => {
    globalAudioStopped = false;
  },

  canPlayAudio: () => {
    return !globalAudioStopped;
  },

  registerAudio: (audio: HTMLAudioElement) => {
    globalAudioInstances.push(audio);
  }
};