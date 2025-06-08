import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Watch, Wifi, WifiOff, Activity, Heart, Moon, CheckCircle } from 'lucide-react';
// Removed framer-motion to reduce bundle size

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
    // Check for available fitness APIs
    checkAvailableAPIs();
    loadCachedData();
    
    // Start real-time data simulation when connected
    if (connectionStatus === 'connected') {
      startRealTimeTracking();
    }
  }, [connectionStatus]);

  const startRealTimeTracking = () => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        currentHeartRate: 65 + Math.floor(Math.random() * 20), // 65-85 bpm
        todaySteps: prev.todaySteps + Math.floor(Math.random() * 10), // Incremental steps
        sleepScore: 75 + Math.floor(Math.random() * 20), // 75-95 score
        lastUpdate: new Date()
      }));
    }, 2000);

    return () => clearInterval(interval);
  };

  const checkAvailableAPIs = () => {
    const availableDevices: FitnessDevice[] = [];

    // Check for Apple HealthKit (Safari/iOS)
    if (typeof (window as any).webkit !== 'undefined') {
      availableDevices.push({
        id: 'apple_health',
        name: 'Apple Health',
        type: 'apple_watch',
        connected: false,
        lastSync: null,
        capabilities: ['sleep_tracking', 'heart_rate', 'activity']
      });
    }

    // Check for Web Bluetooth (Fitbit, Garmin)
    if ('bluetooth' in navigator) {
      availableDevices.push({
        id: 'fitbit_device',
        name: 'Fitbit Device',
        type: 'fitbit',
        connected: false,
        lastSync: null,
        capabilities: ['sleep_tracking', 'heart_rate', 'steps']
      });

      availableDevices.push({
        id: 'garmin_device',
        name: 'Garmin Device',
        type: 'garmin',
        connected: false,
        lastSync: null,
        capabilities: ['sleep_tracking', 'heart_rate', 'activity']
      });
    }

    // Check for generic fitness APIs
    if ('permissions' in navigator && 'query' in navigator.permissions) {
      availableDevices.push({
        id: 'generic_fitness',
        name: 'Generic Fitness Tracker',
        type: 'generic',
        connected: false,
        lastSync: null,
        capabilities: ['sleep_tracking', 'activity']
      });
    }

    setDevices(availableDevices);
  };

  const loadCachedData = () => {
    const cached = localStorage.getItem('fitness_sleep_data');
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

  const connectToAppleHealth = async () => {
    setConnectionStatus('connecting');
    
    try {
      // Request permission for Apple HealthKit
      if (typeof (window as any).webkit !== 'undefined') {
        // This would use HealthKit JavaScript API in a real implementation
        // For now, we'll simulate the connection
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate successful connection
        setDevices(prev => prev.map(device => 
          device.id === 'apple_health' 
            ? { ...device, connected: true, lastSync: new Date() }
            : device
        ));
        
        setConnectionStatus('connected');
        setLastSyncTime(new Date());
        
        // Simulate fetching sleep data
        fetchAppleHealthData();
      }
    } catch (error) {
      console.error('Failed to connect to Apple Health:', error);
      setConnectionStatus('disconnected');
    }
  };

  const connectToFitbit = async () => {
    setConnectionStatus('connecting');
    
    try {
      // Use Fitbit Web API with OAuth
      const clientId = 'YOUR_FITBIT_CLIENT_ID'; // Would be set in environment
      const redirectUri = encodeURIComponent(window.location.origin + '/fitbit-callback');
      const scope = 'sleep heartrate activity';
      
      const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
      
      // In a real implementation, this would open OAuth flow
      // For demo, we'll simulate successful connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDevices(prev => prev.map(device => 
        device.id === 'fitbit_device' 
          ? { ...device, connected: true, lastSync: new Date() }
          : device
      ));
      
      setConnectionStatus('connected');
      setLastSyncTime(new Date());
      
      // Simulate fetching sleep data
      fetchFitbitData();
    } catch (error) {
      console.error('Failed to connect to Fitbit:', error);
      setConnectionStatus('disconnected');
    }
  };

  const connectToGarmin = async () => {
    setConnectionStatus('connecting');
    
    try {
      // Use Garmin Connect IQ API
      // This would require proper Garmin developer credentials
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDevices(prev => prev.map(device => 
        device.id === 'garmin_device' 
          ? { ...device, connected: true, lastSync: new Date() }
          : device
      ));
      
      setConnectionStatus('connected');
      setLastSyncTime(new Date());
      
      // Simulate fetching sleep data
      fetchGarminData();
    } catch (error) {
      console.error('Failed to connect to Garmin:', error);
      setConnectionStatus('disconnected');
    }
  };

  const fetchAppleHealthData = async () => {
    // Simulate Apple Health sleep data
    const mockData: SleepData = {
      date: new Date(),
      bedtime: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
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
    
    setSleepData(prev => [mockData, ...prev.slice(0, 6)]);
    localStorage.setItem('fitness_sleep_data', JSON.stringify([mockData, ...sleepData.slice(0, 6)]));
  };

  const fetchFitbitData = async () => {
    // Simulate Fitbit sleep data
    const mockData: SleepData = {
      date: new Date(),
      bedtime: new Date(Date.now() - 7.8 * 60 * 60 * 1000),
      wakeTime: new Date(),
      duration: 7.3,
      efficiency: 82,
      stages: {
        deep: 1.5,
        light: 4.8,
        rem: 1.0,
        awake: 0.5
      },
      heartRate: {
        avg: 62,
        min: 48,
        max: 75
      }
    };
    
    setSleepData(prev => [mockData, ...prev.slice(0, 6)]);
    localStorage.setItem('fitness_sleep_data', JSON.stringify([mockData, ...sleepData.slice(0, 6)]));
  };

  const fetchGarminData = async () => {
    // Simulate Garmin sleep data
    const mockData: SleepData = {
      date: new Date(),
      bedtime: new Date(Date.now() - 8.2 * 60 * 60 * 1000),
      wakeTime: new Date(),
      duration: 7.9,
      efficiency: 91,
      stages: {
        deep: 2.1,
        light: 4.0,
        rem: 1.8,
        awake: 0.2
      },
      heartRate: {
        avg: 55,
        min: 42,
        max: 68
      }
    };
    
    setSleepData(prev => [mockData, ...prev.slice(0, 6)]);
    localStorage.setItem('fitness_sleep_data', JSON.stringify([mockData, ...sleepData.slice(0, 6)]));
  };

  const syncData = async () => {
    setIsScanning(true);
    
    const connectedDevice = devices.find(d => d.connected);
    if (connectedDevice) {
      switch (connectedDevice.type) {
        case 'apple_watch':
          await fetchAppleHealthData();
          break;
        case 'fitbit':
          await fetchFitbitData();
          break;
        case 'garmin':
          await fetchGarminData();
          break;
      }
      
      setLastSyncTime(new Date());
      setDevices(prev => prev.map(device => 
        device.connected 
          ? { ...device, lastSync: new Date() }
          : device
      ));
    }
    
    setIsScanning(false);
  };

  const disconnectDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, connected: false, lastSync: null }
        : device
    ));
    
    if (devices.find(d => d.id === deviceId)?.connected) {
      setConnectionStatus('disconnected');
      setLastSyncTime(null);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'apple_watch': return '⌚';
      case 'fitbit': return '🏃';
      case 'garmin': return '🏃‍♂️';
      case 'samsung': return '📱';
      default: return '⌚';
    }
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const connectedDevice = devices.find(d => d.connected);

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Watch className="w-5 h-5" />
            <span>Fitness Watch Connection</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Connect your fitness tracker for accurate sleep data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectionStatus === 'connected' && connectedDevice && (
              <Alert className="bg-green-900/20 border-green-600">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  Connected to {connectedDevice.name}
                  {lastSyncTime && (
                    <span className="block text-sm text-green-400 mt-1">
                      Last sync: {lastSyncTime.toLocaleTimeString()}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Available Devices */}
            <div className="grid grid-cols-1 gap-3">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`p-3 rounded-lg border ${
                    device.connected 
                      ? 'bg-green-900/20 border-green-600' 
                      : 'bg-gray-800 border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getDeviceIcon(device.type)}</span>
                      <div>
                        <h4 className="text-white font-medium">{device.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          {device.connected ? (
                            <div className="flex items-center space-x-1">
                              <Wifi className="w-3 h-3 text-green-400" />
                              <span className="text-green-400">Connected</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <WifiOff className="w-3 h-3 text-gray-500" />
                              <span>Not connected</span>
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
                            onClick={syncData}
                            disabled={isScanning}
                            className="bg-blue-600 hover:bg-blue-700 text-xs"
                          >
                            {isScanning ? 'Syncing...' : 'Sync'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => disconnectDevice(device.id)}
                            className="border-gray-600 text-white hover:bg-gray-700 text-xs"
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => {
                            switch (device.type) {
                              case 'apple_watch':
                                connectToAppleHealth();
                                break;
                              case 'fitbit':
                                connectToFitbit();
                                break;
                              case 'garmin':
                                connectToGarmin();
                                break;
                            }
                          }}
                          disabled={connectionStatus === 'connecting'}
                          className="bg-red-600 hover:bg-red-700 text-xs"
                        >
                          {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Device Capabilities */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {device.capabilities.map((capability) => (
                      <Badge key={capability} variant="secondary" className="text-xs bg-gray-700">
                        {capability.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Metrics Dashboard */}
      {connectionStatus === 'connected' && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Live Fitness Metrics</CardTitle>
            <CardDescription className="text-gray-400">
              Real-time data from your connected device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <Button
                onClick={() => setActiveMetric(activeMetric === 'heart' ? null : 'heart')}
                className={`flex flex-col items-center p-4 h-auto ${
                  activeMetric === 'heart' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <Heart className="w-6 h-6 mb-2 text-red-400" />
                <div className="text-xs text-gray-300">Heart Rate</div>
                <div className="text-lg font-bold text-white">{realTimeData.currentHeartRate}</div>
                <div className="text-xs text-gray-400">bpm</div>
              </Button>

              <Button
                onClick={() => setActiveMetric(activeMetric === 'steps' ? null : 'steps')}
                className={`flex flex-col items-center p-4 h-auto ${
                  activeMetric === 'steps' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <Activity className="w-6 h-6 mb-2 text-blue-400" />
                <div className="text-xs text-gray-300">Steps Today</div>
                <div className="text-lg font-bold text-white">{realTimeData.todaySteps.toLocaleString()}</div>
                <div className="text-xs text-gray-400">steps</div>
              </Button>

              <Button
                onClick={() => setActiveMetric(activeMetric === 'sleep' ? null : 'sleep')}
                className={`flex flex-col items-center p-4 h-auto ${
                  activeMetric === 'sleep' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <Moon className="w-6 h-6 mb-2 text-purple-400" />
                <div className="text-xs text-gray-300">Sleep Score</div>
                <div className="text-lg font-bold text-white">{realTimeData.sleepScore}</div>
                <div className="text-xs text-gray-400">score</div>
              </Button>
            </div>

            {/* Detailed Metric View */}
            {activeMetric === 'heart' && (
              <div className="p-4 bg-red-900/20 border border-red-600 rounded-lg">
                <h4 className="text-white font-medium mb-3">Heart Rate Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current:</span>
                    <span className="text-red-400 font-medium">{realTimeData.currentHeartRate} bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Resting HR:</span>
                    <span className="text-white">62 bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max HR (24h):</span>
                    <span className="text-white">89 bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Zone:</span>
                    <span className="text-green-400">Resting</span>
                  </div>
                  <div className="mt-3 p-2 bg-gray-800 rounded text-xs text-gray-300">
                    💡 Your heart rate is within normal resting range. Stay hydrated and consider meditation before sleep.
                  </div>
                </div>
              </div>
            )}

            {activeMetric === 'steps' && (
              <div className="p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
                <h4 className="text-white font-medium mb-3">Activity Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Steps Today:</span>
                    <span className="text-blue-400 font-medium">{realTimeData.todaySteps.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Goal Progress:</span>
                    <span className="text-white">{Math.round((realTimeData.todaySteps / 10000) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Distance:</span>
                    <span className="text-white">{(realTimeData.todaySteps * 0.0008).toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Calories:</span>
                    <span className="text-white">{Math.round(realTimeData.todaySteps * 0.04)} kcal</span>
                  </div>
                  <div className="mt-3 p-2 bg-gray-800 rounded text-xs text-gray-300">
                    🚶 Physical activity improves sleep quality. Aim for 10,000 steps daily for optimal rest.
                  </div>
                </div>
              </div>
            )}

            {activeMetric === 'sleep' && (
              <div className="p-4 bg-purple-900/20 border border-purple-600 rounded-lg">
                <h4 className="text-white font-medium mb-3">Sleep Quality Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sleep Score:</span>
                    <span className="text-purple-400 font-medium">{realTimeData.sleepScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quality:</span>
                    <span className="text-white">
                      {realTimeData.sleepScore >= 85 ? 'Excellent' : 
                       realTimeData.sleepScore >= 70 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dream Readiness:</span>
                    <span className="text-green-400">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Optimal Bedtime:</span>
                    <span className="text-white">10:30 PM</span>
                  </div>
                  <div className="mt-3 p-2 bg-gray-800 rounded text-xs text-gray-300">
                    🌙 Your sleep patterns indicate good dream recall potential. Consider keeping a dream journal nearby.
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500 text-center">
              Last updated: {realTimeData.lastUpdate.toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Sleep Data */}
      {sleepData.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Sleep History</CardTitle>
            <CardDescription className="text-gray-400">
              Historical sleep metrics from your connected device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sleepData.slice(0, 3).map((data, index) => (
                <div key={index} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white font-medium">
                      {data.date.toLocaleDateString()}
                    </div>
                    <Badge variant="secondary" className="bg-blue-600">
                      {data.efficiency}% efficiency
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Sleep Duration</div>
                      <div className="text-white font-medium">{formatDuration(data.duration)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Heart Rate</div>
                      <div className="text-white font-medium">{data.heartRate.avg} bpm avg</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-gray-400 text-sm mb-2">Sleep Stages</div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-blue-400">{formatDuration(data.stages.light)}</div>
                        <div className="text-gray-500">Light</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400">{formatDuration(data.stages.deep)}</div>
                        <div className="text-gray-500">Deep</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-400">{formatDuration(data.stages.rem)}</div>
                        <div className="text-gray-500">REM</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">{formatDuration(data.stages.awake)}</div>
                        <div className="text-gray-500">Awake</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Setup Instructions */}
      {devices.length === 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">No Devices Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-400 space-y-2 text-sm">
              <p>To connect your fitness tracker:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Ensure your device supports web APIs (Apple Health, Fitbit Web API, etc.)</li>
                <li>Enable Bluetooth and location permissions</li>
                <li>Make sure your fitness app is properly configured</li>
                <li>Some features may require HTTPS connection</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}