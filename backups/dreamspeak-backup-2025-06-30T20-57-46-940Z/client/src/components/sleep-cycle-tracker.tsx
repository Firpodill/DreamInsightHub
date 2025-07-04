import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Moon, Sun, Zap, Eye, Brain, Bell, Watch } from 'lucide-react';
// Removed framer-motion to reduce bundle size
import { FitnessWatchConnector } from './fitness-watch-connector';
import { SmartSleepScheduler } from './smart-sleep-scheduler';
import { DreamFitnessCorrelation } from './dream-fitness-correlation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SleepCycle {
  id: string;
  bedtime: Date;
  wakeTime?: Date;
  sleepDuration?: number;
  cycles: SleepStage[];
  dreamQuality: number;
  remPhases: number;
}

interface SleepStage {
  stage: 'light' | 'deep' | 'rem' | 'awake';
  duration: number;
  startTime: Date;
}

export function SleepCycleTracker() {
  const [currentCycle, setCurrentCycle] = useState<SleepCycle | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [sleepHistory, setSleepHistory] = useState<SleepCycle[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [optimalLoggingWindow, setOptimalLoggingWindow] = useState<boolean>(false);
  const [showFitnessConnector, setShowFitnessConnector] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkOptimalLoggingWindow();
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [currentCycle]);

  const checkOptimalLoggingWindow = () => {
    if (!currentCycle || !currentCycle.wakeTime) return;
    
    const now = new Date();
    const wakeTime = new Date(currentCycle.wakeTime);
    const timeSinceWake = (now.getTime() - wakeTime.getTime()) / (1000 * 60); // minutes
    
    // Optimal dream logging window: 0-15 minutes after waking
    setOptimalLoggingWindow(timeSinceWake >= 0 && timeSinceWake <= 15);
  };

  const startSleepTracking = () => {
    const newCycle: SleepCycle = {
      id: Date.now().toString(),
      bedtime: new Date(),
      cycles: [],
      dreamQuality: 0,
      remPhases: 0
    };
    setCurrentCycle(newCycle);
    setIsTracking(true);
    
    // Simulate sleep cycle progression
    simulateSleepCycles(newCycle);
  };

  const simulateSleepCycles = (cycle: SleepCycle) => {
    // Typical sleep cycle: 90-110 minutes per cycle
    // Light sleep (20-25 min) -> Deep sleep (20-25 min) -> REM (20-25 min)
    const cyclePattern = ['light', 'deep', 'rem'] as const;
    let currentStageIndex = 0;
    let stageStartTime = new Date(cycle.bedtime);
    
    const progressSleep = () => {
      if (!isTracking) return;
      
      const stageDuration = 20 + Math.random() * 10; // 20-30 minutes per stage
      const stage = cyclePattern[currentStageIndex];
      
      const sleepStage: SleepStage = {
        stage,
        duration: stageDuration,
        startTime: new Date(stageStartTime)
      };
      
      setCurrentCycle(prev => prev ? {
        ...prev,
        cycles: [...prev.cycles, sleepStage],
        remPhases: stage === 'rem' ? prev.remPhases + 1 : prev.remPhases
      } : null);
      
      currentStageIndex = (currentStageIndex + 1) % cyclePattern.length;
      stageStartTime = new Date(stageStartTime.getTime() + stageDuration * 60000);
      
      // Continue for about 8 hours of sleep
      if (stageStartTime.getTime() - cycle.bedtime.getTime() < 8 * 60 * 60 * 1000) {
        setTimeout(progressSleep, stageDuration * 60000 / 60); // Speed up simulation
      }
    };
    
    progressSleep();
  };

  const endSleepTracking = () => {
    if (!currentCycle) return;
    
    const wakeTime = new Date();
    const sleepDuration = (wakeTime.getTime() - currentCycle.bedtime.getTime()) / (1000 * 60 * 60);
    
    const completedCycle: SleepCycle = {
      ...currentCycle,
      wakeTime,
      sleepDuration,
      dreamQuality: Math.floor(Math.random() * 5) + 1 // Simulate quality rating
    };
    
    setSleepHistory(prev => [completedCycle, ...prev.slice(0, 6)]);
    setCurrentCycle(completedCycle);
    setIsTracking(false);
    
    // Check if it's optimal time for dream logging
    setTimeout(checkOptimalLoggingWindow, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getSleepStageIcon = (stage: string) => {
    switch (stage) {
      case 'light': return <Eye className="w-4 h-4" />;
      case 'deep': return <Moon className="w-4 h-4" />;
      case 'rem': return <Brain className="w-4 h-4" />;
      default: return <Sun className="w-4 h-4" />;
    }
  };

  const getSleepStageColor = (stage: string) => {
    switch (stage) {
      case 'light': return 'bg-blue-500';
      case 'deep': return 'bg-purple-600';
      case 'rem': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getCurrentSleepStage = () => {
    if (!currentCycle || !isTracking || currentCycle.cycles.length === 0) return null;
    return currentCycle.cycles[currentCycle.cycles.length - 1];
  };

  return (
    <div className="space-y-6">
      {/* Optimal Logging Alert */}
      {optimalLoggingWindow && (
        <div className="p-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg border border-yellow-500">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-white animate-pulse" />
            <div>
              <h4 className="text-white font-bold">Optimal Dream Logging Time!</h4>
              <p className="text-yellow-100 text-sm">
                Your dream recall is at its peak. Log your dreams now for best results.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sleep Tracking Controls */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Clock className="w-5 h-5" />
            <span>Sleep Cycle Tracker</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Connect your fitness watch or use manual tracking for optimal dream logging timing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Fitness Watch Integration Option */}
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <Watch className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm">Fitness Watch Integration</span>
                {connectedDevice && (
                  <Badge variant="secondary" className="bg-green-600 text-xs">Connected</Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFitnessConnector(!showFitnessConnector)}
                className="border-gray-600 text-white hover:bg-gray-700 text-xs"
              >
                {connectedDevice ? 'Manage' : 'Connect Watch'}
              </Button>
            </div>

            {!isTracking ? (
              <div className="space-y-2">
                <Button
                  onClick={startSleepTracking}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Start Manual Sleep Tracking
                </Button>
                <p className="text-xs text-gray-400 text-center">
                  Or connect your fitness watch above for automatic tracking
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white">Tracking sleep...</span>
                  </div>
                  <Button
                    onClick={endSleepTracking}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Wake Up
                  </Button>
                </div>
                
                {getCurrentSleepStage() && (
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {getSleepStageIcon(getCurrentSleepStage()!.stage)}
                      <span className="text-white capitalize">
                        {getCurrentSleepStage()!.stage} Sleep
                      </span>
                      <Badge variant="secondary" className="bg-gray-700">
                        {currentCycle?.remPhases || 0} REM cycles
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400">
                      Sleep duration: {currentCycle?.sleepDuration ? 
                        formatDuration(currentCycle.sleepDuration) : 
                        formatDuration((currentTime.getTime() - currentCycle!.bedtime.getTime()) / (1000 * 60 * 60))
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Cycle Visualization */}
      {currentCycle && currentCycle.cycles.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Sleep Cycle Visualization</CardTitle>
            <CardDescription className="text-gray-400">
              Your current sleep pattern and REM phases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {currentCycle.cycles.map((stage, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${getSleepStageColor(stage.stage)}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-white capitalize">{stage.stage} Sleep</span>
                        <span className="text-gray-400">{formatDuration(stage.duration / 60)}</span>
                      </div>
                      <Progress 
                        value={stage.duration} 
                        max={30} 
                        className="h-2 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {currentCycle.remPhases > 0 && (
                <div className="mt-4 p-3 bg-yellow-600/20 rounded-lg border border-yellow-600/30">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">
                      {currentCycle.remPhases} REM phases detected
                    </span>
                  </div>
                  <p className="text-sm text-yellow-300 mt-1">
                    Higher chance of vivid dreams during REM sleep
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sleep History */}
      {sleepHistory.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Sleep History</CardTitle>
            <CardDescription className="text-gray-400">
              Track your sleep patterns over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sleepHistory.slice(0, 5).map((cycle) => (
                <div key={cycle.id} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white text-sm">
                      {cycle.bedtime.toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-gray-700">
                        {cycle.remPhases} REM
                      </Badge>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full mr-1 ${
                              i < cycle.dreamQuality ? 'bg-yellow-400' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>
                      {formatTime(cycle.bedtime)} - {cycle.wakeTime ? formatTime(cycle.wakeTime) : 'Active'}
                    </span>
                    <span>
                      {cycle.sleepDuration ? formatDuration(cycle.sleepDuration) : 'Tracking...'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comprehensive Sleep & Fitness Dashboard */}
      {showFitnessConnector && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Watch className="h-5 w-5 text-blue-400" />
              Sleep & Fitness Analytics Dashboard
            </CardTitle>
            <CardDescription className="text-gray-400">
              Complete integration of sleep tracking, fitness metrics, and dream correlations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="devices" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger value="devices" className="text-gray-300">Devices</TabsTrigger>
                <TabsTrigger value="scheduler" className="text-gray-300">Scheduler</TabsTrigger>
                <TabsTrigger value="analytics" className="text-gray-300">Analytics</TabsTrigger>
                <TabsTrigger value="insights" className="text-gray-300">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="devices" className="space-y-4">
                <FitnessWatchConnector />
              </TabsContent>

              <TabsContent value="scheduler" className="space-y-4">
                <SmartSleepScheduler />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <DreamFitnessCorrelation />
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-400" />
                      AI-Powered Sleep Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="text-white font-medium">Sleep Quality Factors</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Sleep Duration:</span>
                              <span className="text-blue-400">Optimal (7-9h)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">REM Percentage:</span>
                              <span className="text-purple-400">Good (20-25%)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Sleep Consistency:</span>
                              <span className="text-green-400">Excellent</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Recovery Score:</span>
                              <span className="text-yellow-400">85%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="text-white font-medium">Dream Enhancement Tips</h4>
                          <div className="space-y-2 text-xs text-gray-300">
                            <div className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-blue-400 rounded-full mt-2"></div>
                              <p>Your current sleep pattern is optimal for dream recall</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-purple-400 rounded-full mt-2"></div>
                              <p>REM cycles align well with your natural circadian rhythm</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-green-400 rounded-full mt-2"></div>
                              <p>Consider lucid dreaming techniques during 4-6 AM window</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2"></div>
                              <p>Your fitness metrics suggest high dream vividness potential</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-700 pt-4">
                        <h4 className="text-white font-medium mb-3">Weekly Sleep Summary</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-gray-800 rounded-lg p-3">
                            <div className="text-2xl font-bold text-blue-400">7.8h</div>
                            <div className="text-xs text-gray-400">Avg Sleep</div>
                          </div>
                          <div className="bg-gray-800 rounded-lg p-3">
                            <div className="text-2xl font-bold text-purple-400">4.2</div>
                            <div className="text-xs text-gray-400">REM Cycles</div>
                          </div>
                          <div className="bg-gray-800 rounded-lg p-3">
                            <div className="text-2xl font-bold text-green-400">88%</div>
                            <div className="text-xs text-gray-400">Efficiency</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Sleep Tips */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Dream Recall Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <p>Log dreams immediately upon waking for best recall (0-15 minutes)</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <p>REM sleep (usually 4-6 AM) produces the most vivid dreams</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <p>Keep your phone nearby but avoid bright screens when logging</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <p>Natural wake-ups (without alarms) often yield better dream recall</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}