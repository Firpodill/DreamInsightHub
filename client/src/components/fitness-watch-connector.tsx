import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Moon, Smartphone, Battery, Clock } from 'lucide-react';

interface FitnessDevice {
  id: string;
  name: string;
  type: 'apple_watch' | 'fitbit' | 'garmin' | 'samsung' | 'generic';
  connected: boolean;
  lastSync: Date | null;
  batteryLevel?: number;
  capabilities: string[];
}

interface SleepData {
  date: Date;
  bedtime: Date;
  wakeTime: Date;
  duration: number;
  efficiency: number;
  stages: {
    deep: number;
    light: number;
    rem: number;
    awake: number;
  };
  heartRate: {
    avg: number;
    min: number;
    max: number;
  };
}

interface RealTimeData {
  currentHeartRate: number;
  todaySteps: number;
  sleepScore: number;
  lastUpdate: Date;
}

export function FitnessWatchConnector() {
  const [devices, setDevices] = useState<FitnessDevice[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'heartRate' | 'steps' | 'sleep' | null>(null);

  useEffect(() => {
    const demoDevice: FitnessDevice = {
      id: 'demo_watch',
      name: 'Demo Fitness Watch',
      type: 'generic',
      connected: false,
      lastSync: null,
      batteryLevel: 85,
      capabilities: ['sleep_tracking', 'heart_rate', 'steps']
    };
    setDevices([demoDevice]);
  }, []);

  useEffect(() => {
    if (realTimeData) {
      const interval = setInterval(() => {
        setRealTimeData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            currentHeartRate: Math.max(60, Math.min(100, prev.currentHeartRate + Math.floor(Math.random() * 6) - 3)),
            todaySteps: prev.todaySteps + Math.floor(Math.random() * 5),
            lastUpdate: new Date()
          };
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [realTimeData]);

  const connectToWatch = async () => {
    setConnectionStatus('connecting');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDevices(prev => prev.map(device => 
        device.id === 'demo_watch' 
          ? { ...device, connected: true, lastSync: new Date() }
          : device
      ));
      
      setConnectionStatus('connected');
      
      setRealTimeData({
        currentHeartRate: 72,
        todaySteps: 4250,
        sleepScore: 85,
        lastUpdate: new Date()
      });
      
      const mockSleepData: SleepData = {
        date: new Date(),
        bedtime: new Date(Date.now() - 8 * 60 * 60 * 1000),
        wakeTime: new Date(),
        duration: 7.5,
        efficiency: 87,
        stages: {
          deep: 1.8,
          light: 4.2,
          rem: 1.5,
          awake: 0.3
        },
        heartRate: {
          avg: 58,
          min: 45,
          max: 72
        }
      };
      
      setSleepData([mockSleepData]);
      
    } catch (error) {
      console.error('Failed to connect to watch:', error);
      setConnectionStatus('disconnected');
    }
  };

  const disconnectWatch = () => {
    setDevices(prev => prev.map(device => ({
      ...device,
      connected: false,
      lastSync: null
    })));
    setConnectionStatus('disconnected');
    setRealTimeData(null);
    setSelectedMetric(null);
  };

  const syncWatchData = async () => {
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setDevices(prev => prev.map(device => 
      device.connected 
        ? { ...device, lastSync: new Date() }
        : device
    ));
    setIsScanning(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const connectedDevice = devices.find(d => d.connected);

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Smartphone className="w-5 h-5" />
            Fitness Watch Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{device.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={device.connected ? "default" : "secondary"} className="text-xs">
                        {device.connected ? 'Connected' : 'Disconnected'}
                      </Badge>
                      {device.batteryLevel && (
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Battery className="w-3 h-3" />
                          {device.batteryLevel}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {device.connected ? (
                    <>
                      <Button
                        size="sm"
                        onClick={syncWatchData}
                        disabled={isScanning}
                        className="bg-blue-600 hover:bg-blue-700 text-xs"
                      >
                        {isScanning ? 'Syncing...' : 'Sync'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={disconnectWatch}
                        className="border-gray-600 text-white hover:bg-gray-700 text-xs"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={connectToWatch}
                      disabled={connectionStatus === 'connecting'}
                      className="bg-red-600 hover:bg-red-700 text-xs"
                    >
                      {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {device.capabilities.map((capability) => (
                  <Badge key={capability} variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {capability.replace('_', ' ')}
                  </Badge>
                ))}
              </div>

              {device.lastSync && (
                <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last sync: {formatTime(device.lastSync)}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {realTimeData && connectedDevice && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Live Fitness Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Button
                variant={selectedMetric === 'heartRate' ? 'default' : 'outline'}
                onClick={() => setSelectedMetric(selectedMetric === 'heartRate' ? null : 'heartRate')}
                className="h-20 flex flex-col items-center justify-center gap-2"
              >
                <Heart className="w-6 h-6 text-red-500" />
                <div className="text-center">
                  <div className="text-lg font-bold">{realTimeData.currentHeartRate}</div>
                  <div className="text-xs text-gray-400">BPM</div>
                </div>
              </Button>

              <Button
                variant={selectedMetric === 'steps' ? 'default' : 'outline'}
                onClick={() => setSelectedMetric(selectedMetric === 'steps' ? null : 'steps')}
                className="h-20 flex flex-col items-center justify-center gap-2"
              >
                <Activity className="w-6 h-6 text-green-500" />
                <div className="text-center">
                  <div className="text-lg font-bold">{realTimeData.todaySteps.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Steps</div>
                </div>
              </Button>

              <Button
                variant={selectedMetric === 'sleep' ? 'default' : 'outline'}
                onClick={() => setSelectedMetric(selectedMetric === 'sleep' ? null : 'sleep')}
                className="h-20 flex flex-col items-center justify-center gap-2"
              >
                <Moon className="w-6 h-6 text-blue-500" />
                <div className="text-center">
                  <div className="text-lg font-bold">{realTimeData.sleepScore}</div>
                  <div className="text-xs text-gray-400">Score</div>
                </div>
              </Button>
            </div>

            {selectedMetric && (
              <div className="bg-gray-800 rounded-lg p-4">
                {selectedMetric === 'heartRate' && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Heart Rate Analysis</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Current:</span>
                        <span className="text-red-400 ml-2 font-medium">{realTimeData.currentHeartRate} BPM</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Resting:</span>
                        <span className="text-green-400 ml-2 font-medium">58 BPM</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Max Today:</span>
                        <span className="text-orange-400 ml-2 font-medium">145 BPM</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Zone:</span>
                        <span className="text-blue-400 ml-2 font-medium">Fat Burn</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMetric === 'steps' && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Activity Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Steps:</span>
                        <span className="text-green-400 ml-2 font-medium">{realTimeData.todaySteps.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Goal:</span>
                        <span className="text-blue-400 ml-2 font-medium">10,000</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Distance:</span>
                        <span className="text-purple-400 ml-2 font-medium">2.1 miles</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Calories:</span>
                        <span className="text-orange-400 ml-2 font-medium">189 kcal</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMetric === 'sleep' && sleepData.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Last Night's Sleep</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-blue-400 ml-2 font-medium">{sleepData[0].duration}h</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Efficiency:</span>
                        <span className="text-green-400 ml-2 font-medium">{sleepData[0].efficiency}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Deep Sleep:</span>
                        <span className="text-purple-400 ml-2 font-medium">{sleepData[0].stages.deep}h</span>
                      </div>
                      <div>
                        <span className="text-gray-400">REM Sleep:</span>
                        <span className="text-indigo-400 ml-2 font-medium">{sleepData[0].stages.rem}h</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="text-xs text-gray-400 mt-4 text-center">
              Last updated: {formatTime(realTimeData.lastUpdate)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}