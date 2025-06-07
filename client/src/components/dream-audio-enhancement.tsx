import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Volume2, VolumeX, Brain, Waves, Moon, Star, CloudRain, Wind } from 'lucide-react';
// Removed framer-motion to reduce bundle size

interface AudioTrack {
  id: string;
  name: string;
  description: string;
  frequency: number;
  type: 'binaural' | 'ambient' | 'nature';
  icon: any;
  benefits: string[];
  duration: number; // in seconds
}

const audioTracks: AudioTrack[] = [
  {
    id: 'theta_waves',
    name: 'Theta Waves (6Hz)',
    description: 'Deep relaxation and enhanced dream recall',
    frequency: 6,
    type: 'binaural',
    icon: Brain,
    benefits: ['Enhanced dream recall', 'Deep relaxation', 'Memory consolidation'],
    duration: 1800 // 30 minutes
  },
  {
    id: 'alpha_waves',
    name: 'Alpha Waves (10Hz)',
    description: 'Meditative state and creative insights',
    frequency: 10,
    type: 'binaural',
    icon: Waves,
    benefits: ['Meditative state', 'Creative insights', 'Stress reduction'],
    duration: 1200 // 20 minutes
  },
  {
    id: 'delta_waves',
    name: 'Delta Waves (2Hz)',
    description: 'Deep sleep and healing frequencies',
    frequency: 2,
    type: 'binaural',
    icon: Moon,
    benefits: ['Deep sleep induction', 'Healing', 'Growth hormone release'],
    duration: 2400 // 40 minutes
  },
  {
    id: 'lucid_frequency',
    name: 'Lucid Dream (40Hz)',
    description: 'Gamma waves for lucid dreaming',
    frequency: 40,
    type: 'binaural',
    icon: Star,
    benefits: ['Lucid dreaming', 'Heightened awareness', 'Cognitive enhancement'],
    duration: 900 // 15 minutes
  },
  {
    id: 'rain_forest',
    name: 'Rainforest Ambience',
    description: 'Natural sounds for peaceful sleep',
    frequency: 0,
    type: 'nature',
    icon: CloudRain,
    benefits: ['Natural relaxation', 'Stress relief', 'Sleep quality'],
    duration: 3600 // 60 minutes
  },
  {
    id: 'ocean_waves',
    name: 'Ocean Waves',
    description: 'Rhythmic waves for deep relaxation',
    frequency: 0,
    type: 'ambient',
    icon: Waves,
    benefits: ['Rhythmic relaxation', 'Mental clarity', 'Emotional balance'],
    duration: 2700 // 45 minutes
  },
  {
    id: 'mountain_wind',
    name: 'Mountain Wind',
    description: 'Gentle winds for peaceful mind',
    frequency: 0,
    type: 'nature',
    icon: Wind,
    benefits: ['Mental peace', 'Focus enhancement', 'Anxiety reduction'],
    duration: 2100 // 35 minutes
  }
];

export function DreamAudioEnhancement() {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([0.5]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [autoStop, setAutoStop] = useState(true);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopAudio();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const createBinauralBeat = (frequency: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    
    // Create two oscillators for binaural effect
    const leftOscillator = audioContext.createOscillator();
    const rightOscillator = audioContext.createOscillator();
    
    // Create gain nodes for volume control
    const leftGain = audioContext.createGain();
    const rightGain = audioContext.createGain();
    const masterGain = audioContext.createGain();
    
    // Create stereo panner for left/right separation
    const leftPanner = audioContext.createStereoPanner();
    const rightPanner = audioContext.createStereoPanner();
    
    leftPanner.pan.value = -1; // Full left
    rightPanner.pan.value = 1;  // Full right
    
    // Set frequencies (base frequency + binaural difference)
    const baseFrequency = 200; // Base carrier frequency
    leftOscillator.frequency.value = baseFrequency;
    rightOscillator.frequency.value = baseFrequency + frequency;
    
    // Set waveform to sine for pure tones
    leftOscillator.type = 'sine';
    rightOscillator.type = 'sine';
    
    // Connect the audio graph
    leftOscillator.connect(leftGain);
    rightOscillator.connect(rightGain);
    
    leftGain.connect(leftPanner);
    rightGain.connect(rightPanner);
    
    leftPanner.connect(masterGain);
    rightPanner.connect(masterGain);
    
    masterGain.connect(audioContext.destination);
    
    // Set initial volume
    const currentVolume = isMuted ? 0 : volume[0] * 0.1; // Keep volume low for comfort
    leftGain.gain.value = currentVolume;
    rightGain.gain.value = currentVolume;
    masterGain.gain.value = 1;
    
    gainNodeRef.current = masterGain;
    
    // Start oscillators
    leftOscillator.start();
    rightOscillator.start();
    
    // Store references for cleanup
    oscillatorRef.current = leftOscillator;
    
    return { leftOscillator, rightOscillator, masterGain };
  };

  const playAmbientSound = (trackId: string) => {
    // In a real implementation, this would load and play actual audio files
    // For now, we'll create synthetic ambient sounds using Web Audio API
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    
    // Create filtered noise for ambient sounds
    const bufferSize = audioContext.sampleRate * 2;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Generate different types of noise based on track
    for (let i = 0; i < bufferSize; i++) {
      if (trackId === 'rain_forest') {
        // Pink noise for rain-like sound
        output[i] = (Math.random() * 2 - 1) * Math.pow(Math.random(), 0.5);
      } else if (trackId === 'ocean_waves') {
        // Filtered noise with wave-like patterns
        const wave = Math.sin(i * 0.01) * 0.3;
        output[i] = (Math.random() * 2 - 1) * 0.3 + wave;
      } else {
        // White noise for wind
        output[i] = Math.random() * 2 - 1;
      }
    }
    
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    
    // Apply filtering based on sound type
    const filter = audioContext.createBiquadFilter();
    if (trackId === 'rain_forest') {
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
    } else if (trackId === 'ocean_waves') {
      filter.type = 'bandpass';
      filter.frequency.value = 300;
      filter.Q.value = 0.5;
    } else {
      filter.type = 'highpass';
      filter.frequency.value = 200;
    }
    
    const gainNode = audioContext.createGain();
    gainNode.gain.value = isMuted ? 0 : volume[0] * 0.2;
    
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    noiseSource.start();
    
    gainNodeRef.current = gainNode;
    oscillatorRef.current = noiseSource as any;
  };

  const playTrack = (track: AudioTrack) => {
    stopAudio();
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
    
    if (track.type === 'binaural') {
      createBinauralBeat(track.frequency);
    } else {
      playAmbientSound(track.id);
    }
    
    // Start timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1;
        if (autoStop && newTime >= track.duration) {
          stopAudio();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  const stopAudio = () => {
    // Stop all oscillators and audio sources
    if (oscillatorRef.current) {
      try {
        if ('stop' in oscillatorRef.current) {
          oscillatorRef.current.stop();
        } else {
          (oscillatorRef.current as any).disconnect();
        }
      } catch (error) {
        // Ignore errors when stopping
      }
    }
    
    // Disconnect gain node
    if (gainNodeRef.current) {
      try {
        gainNodeRef.current.disconnect();
      } catch (error) {
        // Ignore errors when disconnecting
      }
    }
    
    // Close audio context if it exists
    if (audioContextRef.current) {
      try {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      } catch (error) {
        // Ignore errors when closing
      }
      audioContextRef.current = null;
    }
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Reset refs
    oscillatorRef.current = null;
    gainNodeRef.current = null;
    
    // Update state
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopAudio();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };

  const updateVolume = (newVolume: number[]) => {
    setVolume(newVolume);
    if (gainNodeRef.current && !isMuted) {
      gainNodeRef.current.gain.value = newVolume[0] * (currentTrack?.type === 'binaural' ? 0.1 : 0.2);
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newMuted ? 0 : volume[0] * (currentTrack?.type === 'binaural' ? 0.1 : 0.2);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredTracks = selectedCategory === 'all' 
    ? audioTracks 
    : audioTracks.filter(track => track.type === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Brain className="w-5 h-5" />
            <span>Dream Audio Enhancement</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Binaural beats and ambient soundscapes to enhance dream recall
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Category Filter */}
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm text-gray-400">Category:</span>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Tracks</SelectItem>
                <SelectItem value="binaural">Binaural Beats</SelectItem>
                <SelectItem value="ambient">Ambient Sounds</SelectItem>
                <SelectItem value="nature">Nature Sounds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Track List */}
          <div className="grid grid-cols-1 gap-3">
            {filteredTracks.map((track) => (
              <div
                key={track.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  currentTrack?.id === track.id
                    ? 'bg-red-600/20 border-red-500'
                    : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                }`}
                onClick={() => playTrack(track)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded ${
                      track.type === 'binaural' ? 'bg-purple-600' :
                      track.type === 'ambient' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      <track.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{track.name}</h4>
                      <p className="text-sm text-gray-400">{track.description}</p>
                      {track.frequency > 0 && (
                        <Badge variant="secondary" className="text-xs mt-1 bg-gray-700">
                          {track.frequency}Hz
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatTime(track.duration)}
                  </div>
                </div>
                
                {/* Benefits */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {track.benefits.map((benefit) => (
                    <Badge key={benefit} variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audio Player */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-600/50">
              <CardHeader>
                <CardTitle className="text-white">Now Playing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Track Info */}
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded ${
                      currentTrack.type === 'binaural' ? 'bg-purple-600' :
                      currentTrack.type === 'ambient' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      <currentTrack.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{currentTrack.name}</h3>
                      <p className="text-sm text-gray-300">{currentTrack.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(currentTrack.duration)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePlayPause}
                        className="text-white hover:bg-gray-700"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={stopAudio}
                        className="text-white hover:bg-gray-700"
                        disabled={!isPlaying}
                      >
                        Stop
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          stopAudio();
                          setCurrentTrack(null);
                        }}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white text-xs"
                      >
                        Turn Off Audio
                      </Button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="text-white hover:bg-gray-700"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <div className="w-20">
                        <Slider
                          value={volume}
                          onValueChange={updateVolume}
                          max={1}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Information */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">How Audio Enhancement Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-300">
            <div>
              <h4 className="text-white font-medium mb-2">Binaural Beats</h4>
              <p>Different frequencies played in each ear create a perceived "beat" frequency that can influence brainwave patterns and enhance dream recall.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Best Practices</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Use headphones for binaural beats to achieve the stereo effect</li>
                <li>Start with lower volumes and adjust to comfort</li>
                <li>Listen for 15-30 minutes before sleep or during meditation</li>
                <li>Combine with relaxation techniques for best results</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}