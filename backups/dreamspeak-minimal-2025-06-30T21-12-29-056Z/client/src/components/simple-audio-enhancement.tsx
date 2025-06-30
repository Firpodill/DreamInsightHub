import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, Brain, Waves, Moon } from 'lucide-react';

interface AudioTrack {
  id: string;
  name: string;
  description: string;
  type: 'binaural' | 'ambient' | 'nature';
  icon: any;
  benefits: string[];
}

const audioTracks: AudioTrack[] = [
  {
    id: 'theta_waves',
    name: 'Theta Waves (6Hz)',
    description: 'Deep relaxation and enhanced dream recall',
    type: 'binaural',
    icon: Brain,
    benefits: ['Enhanced dream recall', 'Deep relaxation', 'Memory consolidation']
  },
  {
    id: 'alpha_waves',
    name: 'Alpha Waves (10Hz)', 
    description: 'Meditative state and creative insights',
    type: 'binaural',
    icon: Waves,
    benefits: ['Meditative state', 'Creative insights', 'Stress reduction']
  },
  {
    id: 'delta_waves',
    name: 'Delta Waves (2Hz)',
    description: 'Deep sleep and healing frequencies',
    type: 'binaural',
    icon: Moon,
    benefits: ['Deep sleep induction', 'Healing', 'Growth hormone release']
  }
];

export function SimpleAudioEnhancement() {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);

  const playTrack = (track: AudioTrack) => {
    setCurrentTrack(currentTrack?.id === track.id ? null : track);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            Dream Audio Enhancement
          </CardTitle>
          <CardDescription className="text-gray-400">
            Binaural beats and ambient sounds to enhance dream experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {audioTracks.map((track) => (
              <div
                key={track.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  currentTrack?.id === track.id
                    ? 'bg-red-600/20 border-red-500'
                    : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                }`}
                onClick={() => setCurrentTrack(track)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-600/20">
                      <track.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{track.name}</h3>
                      <p className="text-sm text-gray-400">{track.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {track.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      playTrack(track);
                    }}
                    variant={currentTrack?.id === track.id ? "destructive" : "outline"}
                    size="sm"
                  >
                    {currentTrack?.id === track.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>

                {currentTrack?.id === track.id && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <h4 className="text-sm font-medium text-white mb-2">Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {track.benefits.map((benefit, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-gray-300">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}