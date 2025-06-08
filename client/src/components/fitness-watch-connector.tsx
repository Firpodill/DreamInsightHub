import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Watch, Wifi, WifiOff, Activity, Heart, Moon, CheckCircle } from 'lucide-react';

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

export function FitnessWatchConnector() {
  const [devices, setDevices] = useState<FitnessDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [activeMetric, setActiveMetric] = useState<'sleep' | 'heart' | 'steps' | null>(null);
  const [realTimeData, setRealTimeData] = useState({
    currentHeartRate: 0,
    todaySteps: 0,
    sleepScore: 0,
    lastUpdate: new Date()
  });

  useEffect(() => {
    checkAvailableDevices();
    loadCachedData();
    
    if (connectionStatus === 'connected') {
      startRealTimeTracking();
    }
  }, [connectionStatus]);

  const startRealTimeTracking = () => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        currentHeartRate: 65 + Math.floor(Math.random() * 20),
        todaySteps: prev.todaySteps + Math.floor(Math.random() * 10),
        sleepScore: 75 + Math.floor(Math.random() * 20),
        lastUpdate: new Date()
      }));
    }, 2000);

    return () => clearInterval(interval);
  };

  const checkAvailableDevices = () => {
    const availableDevices: FitnessDevice[] = [
      {
        id: 'apple_health',
        name: 'Apple Health',
        type: 'apple_watch',
        connected: false,
        lastSync: null,
        capabilities: ['sleep_tracking', 'heart_rate', 'activity']
      },
      {
        id: 'fitbit_device',
        name: 'Fitbit Device',
        type: 'fitbit',
        connected: false,
        lastSync: null,
        capabilities: ['sleep_tracking', 'heart_rate', 'steps']
      }
    ];

    setDevices(availableDevices);
  };

  const loadCachedData = () => {
    const cached = localStorage.getItem('dreamapp_sleep_data');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setSleepData(data.map((item: any) => ({
          ...item,
          date: new Date(item.date),
          bedtime: new Date(item.bedtime),
          wakeTime: new Date(item.wakeTime)
        })));
      } catch (error) {
        console.error('Failed to load cached sleep data:', error);
      }
    }
  };

  const connectToDevice = async (deviceId: string) => {
    setConnectionStatus('connecting');
    
    try {
      // For demonstration purposes only - real implementation requires:
      // Fitbit: OAuth 2.0 with Client ID/Secret from Fitbit Developer Console
      // Apple Health: HealthKit JavaScript API (iOS Safari only)
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, connected: true, lastSync: new Date() }
          : { ...device, connected: false }
      ));
      
      setConnectionStatus('connected');
      setLastSyncTime(new Date());
      
      // Demo data - in production this would come from actual device APIs
      const deviceData = {
        'apple_health': { currentHeartRate: 72, todaySteps: 3420, sleepScore: 83 },
        'fitbit_device': { currentHeartRate: 68, todaySteps: 5240, sleepScore: 78 }
      };
      
      setRealTimeData({
        ...deviceData[deviceId as keyof typeof deviceData],
        lastUpdate: new Date()
      });
      
      generateSampleSleepData(deviceId);
      
    } catch (error) {
      console.error('Failed to connect to device:', error);
      setConnectionStatus('disconnected');
    }
  };

  const generateSampleSleepData = (deviceId: string) => {
    const sampleData: SleepData[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const bedtime = new Date(date);
      bedtime.setHours(22 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
      
      const wakeTime = new Date(bedtime);
      wakeTime.setHours(bedtime.getHours() + 7 + Math.floor(Math.random() * 2));
      
      sampleData.push({
        date,
        bedtime,
        wakeTime,
        duration: (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60),
        efficiency: 80 + Math.floor(Math.random() * 15),
        stages: {
          deep: 15 + Math.floor(Math.random() * 10),
          light: 45 + Math.floor(Math.random() * 15),
          rem: 20 + Math.floor(Math.random() * 10),
          awake: 5 + Math.floor(Math.random() * 10)
        },
        heartRate: {
          avg: 60 + Math.floor(Math.random() * 20),
          min: 50 + Math.floor(Math.random() * 10),
          max: 80 + Math.floor(Math.random() * 20)
        }
      });
    }
    
    setSleepData(sampleData);
    localStorage.setItem('dreamapp_sleep_data', JSON.stringify(sampleData));
  };

  const disconnectDevice = () => {
    setDevices(prev => prev.map(device => ({ ...device, connected: false })));
    setConnectionStatus('disconnected');
    setLastSyncTime(null);
    setRealTimeData({ currentHeartRate: 0, todaySteps: 0, sleepScore: 0, lastUpdate: new Date() });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'apple_watch':
        return <Watch className="h-5 w-5" />;
      case 'fitbit':
      case 'garmin':
        return <Activity className="h-5 w-5" />;
      default:
        return <Smartphone className="h-5 w-5" />;
    }
  };

  const connectedDevice = devices.find(d => d.connected);

  return (
    <div className="space-y-6">
      {/* Production Integration Requirements */}
      <Alert className="bg-blue-900/20 border-blue-500/50">
        <Activity className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-300">
          <div className="font-medium mb-2">Production Integration Requirements:</div>
          <div className="text-sm space-y-1">
            <div><strong>Fitbit:</strong> OAuth 2.0 with Client ID/Secret from Fitbit Developer Console</div>
            <div><strong>Apple Health:</strong> HealthKit JavaScript API (iOS Safari only)</div>
            <div>Current version uses demo data for interface testing</div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Connection Status */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {connectionStatus === 'connected' ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-gray-500" />
            )}
            Fitness Device Connection (Demo)
          </CardTitle>
          <CardDescription className="text-gray-400">
            Demo fitness tracker integration with simulated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectionStatus === 'connected' && connectedDevice ? (
            <div className="space-y-4">
              <Alert className="bg-green-900/20 border-green-500/50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-300">
                  Connected to {connectedDevice.name}
                  {lastSyncTime && (
                    <span className="block text-sm text-green-400 mt-1">
                      Last sync: {formatTime(lastSyncTime)}
                    </span>
                  )}
                </AlertDescription>
              </Alert>

              {/* Live Fitness Metrics Dashboard */}
              <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                <h3 className="text-white font-semibold text-lg">Live Fitness Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Heart Rate Button */}
                  <Button
                    variant={activeMetric === 'heart' ? 'default' : 'outline'}
                    className="h-auto p-4 flex flex-col items-center space-y-2 bg-red-900/20 border-red-500/50 hover:bg-red-900/40"
                    onClick={() => setActiveMetric(activeMetric === 'heart' ? null : 'heart')}
                  >
                    <Heart className="h-6 w-6 text-red-400" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{realTimeData.currentHeartRate}</div>
                      <div className="text-sm text-gray-400">BPM</div>
                    </div>
                  </Button>

                  {/* Steps Button */}
                  <Button
                    variant={activeMetric === 'steps' ? 'default' : 'outline'}
                    className="h-auto p-4 flex flex-col items-center space-y-2 bg-blue-900/20 border-blue-500/50 hover:bg-blue-900/40"
                    onClick={() => setActiveMetric(activeMetric === 'steps' ? null : 'steps')}
                  >
                    <Activity className="h-6 w-6 text-blue-400" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{realTimeData.todaySteps.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Steps</div>
                    </div>
                  </Button>

                  {/* Sleep Score Button */}
                  <Button
                    variant={activeMetric === 'sleep' ? 'default' : 'outline'}
                    className="h-auto p-4 flex flex-col items-center space-y-2 bg-purple-900/20 border-purple-500/50 hover:bg-purple-900/40"
                    onClick={() => setActiveMetric(activeMetric === 'sleep' ? null : 'sleep')}
                  >
                    <Moon className="h-6 w-6 text-purple-400" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{realTimeData.sleepScore}</div>
                      <div className="text-sm text-gray-400">Sleep Score</div>
                    </div>
                  </Button>
                </div>

                {/* Detailed Analytics */}
                {activeMetric === 'heart' && (
                  <div className="bg-gray-900 rounded-lg p-4 space-y-3">
                    <h4 className="text-red-400 font-medium">Heart Rate Analysis</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Resting HR:</span>
                        <span className="text-white ml-2">{Math.max(50, realTimeData.currentHeartRate - 15)} BPM</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Max HR:</span>
                        <span className="text-white ml-2">{realTimeData.currentHeartRate + 20} BPM</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Zone:</span>
                        <span className="text-green-400 ml-2">Moderate</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Variability:</span>
                        <span className="text-white ml-2">Good</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      💡 Your heart rate indicates good cardiovascular health and readiness for quality sleep.
                    </div>
                  </div>
                )}

                {activeMetric === 'steps' && (
                  <div className="bg-gray-900 rounded-lg p-4 space-y-3">
                    <h4 className="text-blue-400 font-medium">Activity Analysis</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Goal Progress:</span>
                        <span className="text-white ml-2">{Math.round((realTimeData.todaySteps / 10000) * 100)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Distance:</span>
                        <span className="text-white ml-2">{(realTimeData.todaySteps * 0.0008).toFixed(1)} km</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Calories:</span>
                        <span className="text-white ml-2">{Math.round(realTimeData.todaySteps * 0.04)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Active Time:</span>
                        <span className="text-white ml-2">{Math.round(realTimeData.todaySteps / 100)} min</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      💡 Regular activity improves sleep quality and dream recall. Keep moving!
                    </div>
                  </div>
                )}

                {activeMetric === 'sleep' && (
                  <div className="bg-gray-900 rounded-lg p-4 space-y-3">
                    <h4 className="text-purple-400 font-medium">Sleep Quality Analysis</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Readiness:</span>
                        <span className="text-green-400 ml-2">Optimal</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Recovery:</span>
                        <span className="text-white ml-2">{realTimeData.sleepScore}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Optimal Bedtime:</span>
                        <span className="text-white ml-2">10:30 PM</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Dream Recall:</span>
                        <span className="text-purple-400 ml-2">High Potential</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      💡 Your sleep patterns show excellent potential for vivid dreams and strong recall.
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 text-center">
                  Last updated: {formatTime(realTimeData.lastUpdate)}
                </div>
              </div>

              <Button onClick={disconnectDevice} variant="outline" className="w-full">
                Disconnect Device
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(device.type)}
                    <div>
                      <div className="text-white font-medium">{device.name}</div>
                      <div className="text-gray-400 text-sm">
                        {device.capabilities.join(', ')}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => connectToDevice(device.id)}
                    disabled={connectionStatus === 'connecting'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sleep Data History */}
      {sleepData.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Sleep History</CardTitle>
            <CardDescription className="text-gray-400">
              Recent sleep data from your connected device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sleepData.slice(0, 3).map((sleep, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-white font-medium">
                      {sleep.date.toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {sleep.efficiency}% efficiency
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Bedtime:</span>
                      <span className="text-white ml-2">{formatTime(sleep.bedtime)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Wake time:</span>
                      <span className="text-white ml-2">{formatTime(sleep.wakeTime)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white ml-2">{sleep.duration.toFixed(1)}h</span>
                    </div>
                    <div>
                      <span className="text-gray-400">REM sleep:</span>
                      <span className="text-purple-400 ml-2">{sleep.stages.rem}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}