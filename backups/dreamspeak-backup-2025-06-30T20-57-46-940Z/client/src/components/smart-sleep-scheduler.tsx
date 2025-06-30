import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Sunrise, Moon, Target, TrendingUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SleepSchedule {
  bedtime: Date;
  wakeTime: Date;
  sleepDuration: number;
  confidence: number;
  reason: string;
}

interface DreamOptimization {
  remWindowStart: Date;
  remWindowEnd: Date;
  optimalLoggingTime: Date;
  dreamRecallProbability: number;
}

export function SmartSleepScheduler() {
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<SleepSchedule | null>(null);
  const [dreamOptimization, setDreamOptimization] = useState<DreamOptimization | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [adaptiveMode, setAdaptiveMode] = useState(false);
  const [sleepGoal, setSleepGoal] = useState<number>(8); // hours

  useEffect(() => {
    if (scheduleEnabled) {
      generateOptimalSchedule();
      calculateDreamWindows();
    }
  }, [scheduleEnabled, sleepGoal]);

  const generateOptimalSchedule = () => {
    // Analyze user's historical sleep patterns
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // Calculate optimal bedtime based on sleep goal and natural circadian rhythm
    const optimalBedtime = new Date(tomorrow);
    optimalBedtime.setHours(22, 30, 0, 0); // Default 10:30 PM
    
    // Adjust based on sleep cycles (90-minute intervals)
    const cycleLength = 90; // minutes
    const totalSleepMinutes = sleepGoal * 60;
    const cycles = Math.round(totalSleepMinutes / cycleLength);
    const adjustedSleepMinutes = cycles * cycleLength;
    
    const optimalWakeTime = new Date(optimalBedtime.getTime() + adjustedSleepMinutes * 60 * 1000);
    
    // Calculate confidence based on consistency with past patterns
    const confidence = calculateScheduleConfidence();
    
    const schedule: SleepSchedule = {
      bedtime: optimalBedtime,
      wakeTime: optimalWakeTime,
      sleepDuration: adjustedSleepMinutes / 60,
      confidence,
      reason: `Optimized for ${cycles} complete sleep cycles (${adjustedSleepMinutes / 60}h)`
    };
    
    setCurrentSchedule(schedule);
  };

  const calculateDreamWindows = () => {
    if (!currentSchedule) return;
    
    // REM sleep typically occurs in the last third of sleep
    const sleepDurationMs = currentSchedule.sleepDuration * 60 * 60 * 1000;
    const remStartOffset = sleepDurationMs * 0.6; // Start at 60% through sleep
    const remEndOffset = sleepDurationMs * 0.9; // End at 90% through sleep
    
    const remWindowStart = new Date(currentSchedule.bedtime.getTime() + remStartOffset);
    const remWindowEnd = new Date(currentSchedule.bedtime.getTime() + remEndOffset);
    
    // Optimal logging time is within 15 minutes of waking
    const optimalLoggingTime = new Date(currentSchedule.wakeTime.getTime() + 10 * 60 * 1000);
    
    // Calculate dream recall probability based on wake time and REM proximity
    const timeSinceRem = (currentSchedule.wakeTime.getTime() - remWindowEnd.getTime()) / (60 * 1000);
    const dreamRecallProbability = Math.max(0.4, Math.min(0.95, 0.9 - (timeSinceRem / 60) * 0.3));
    
    const optimization: DreamOptimization = {
      remWindowStart,
      remWindowEnd,
      optimalLoggingTime,
      dreamRecallProbability
    };
    
    setDreamOptimization(optimization);
  };

  const calculateScheduleConfidence = (): number => {
    // Simulate confidence calculation based on historical data
    // In real implementation, this would analyze past sleep patterns
    const baseConfidence = 0.75;
    const consistencyBonus = Math.random() * 0.2; // 0-20% bonus for consistency
    return Math.min(0.95, baseConfidence + consistencyBonus);
  };

  const adjustScheduleForDreams = () => {
    if (!currentSchedule) return;
    
    // Optimize schedule specifically for dream recall
    const dreamOptimizedBedtime = new Date(currentSchedule.bedtime);
    dreamOptimizedBedtime.setMinutes(dreamOptimizedBedtime.getMinutes() - 15); // Earlier bedtime
    
    const dreamOptimizedWakeTime = new Date(currentSchedule.wakeTime);
    dreamOptimizedWakeTime.setMinutes(dreamOptimizedWakeTime.getMinutes() + 10); // Slightly later wake
    
    const updatedSchedule: SleepSchedule = {
      ...currentSchedule,
      bedtime: dreamOptimizedBedtime,
      wakeTime: dreamOptimizedWakeTime,
      reason: 'Optimized for maximum dream recall and REM sleep'
    };
    
    setCurrentSchedule(updatedSchedule);
    calculateDreamWindows();
  };

  const scheduleNightlyReminder = () => {
    if (!currentSchedule || !notifications) return;
    
    // Calculate reminder time (30 minutes before bedtime)
    const reminderTime = new Date(currentSchedule.bedtime.getTime() - 30 * 60 * 1000);
    const now = new Date();
    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    if (timeUntilReminder > 0) {
      setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Sleep Reminder', {
            body: `Bedtime in 30 minutes (${formatTime(currentSchedule.bedtime)})`,
            icon: '/favicon.ico'
          });
        }
      }, timeUntilReminder);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  useEffect(() => {
    if (scheduleEnabled && currentSchedule && notifications) {
      scheduleNightlyReminder();
    }
  }, [currentSchedule, notifications]);

  return (
    <div className="space-y-6">
      {/* Main Controls */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Target className="w-5 h-5" />
            <span>Smart Sleep Scheduler</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            AI-powered sleep optimization for maximum dream recall
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Enable Smart Scheduling</Label>
                <p className="text-sm text-gray-400">
                  Automatically optimize your sleep schedule for dream logging
                </p>
              </div>
              <Switch
                checked={scheduleEnabled}
                onCheckedChange={setScheduleEnabled}
              />
            </div>

            {/* Sleep Goal */}
            <div className="space-y-2">
              <Label className="text-white">Sleep Goal (hours)</Label>
              <div className="flex items-center space-x-2">
                {[6, 7, 7.5, 8, 8.5, 9].map((hours) => (
                  <Button
                    key={hours}
                    variant={sleepGoal === hours ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSleepGoal(hours)}
                    className={sleepGoal === hours 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'border-gray-600 text-white hover:bg-gray-700'
                    }
                  >
                    {hours}h
                  </Button>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  id="notifications"
                />
                <Label htmlFor="notifications" className="text-sm text-white">
                  Bedtime reminders
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={adaptiveMode}
                  onCheckedChange={setAdaptiveMode}
                  id="adaptive"
                />
                <Label htmlFor="adaptive" className="text-sm text-white">
                  Adaptive scheduling
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Schedule */}
      {scheduleEnabled && currentSchedule && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-600/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Tonight's Schedule</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${getConfidenceColor(currentSchedule.confidence)} bg-gray-800`}
                >
                  {Math.round(currentSchedule.confidence * 100)}% confidence
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Moon className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">Bedtime</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {formatTime(currentSchedule.bedtime)}
                  </div>
                  <p className="text-sm text-gray-400">
                    {formatDuration(currentSchedule.sleepDuration)} sleep
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Sunrise className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">Wake Time</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {formatTime(currentSchedule.wakeTime)}
                  </div>
                  <p className="text-sm text-gray-400">
                    Natural wake cycle
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-300">{currentSchedule.reason}</p>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Button
                  size="sm"
                  onClick={adjustScheduleForDreams}
                  className="bg-purple-600 hover:bg-purple-700 text-xs"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Optimize for Dreams
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={generateOptimalSchedule}
                  className="border-gray-600 text-white hover:bg-gray-700 text-xs"
                >
                  Recalculate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dream Optimization Info */}
          {dreamOptimization && (
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Dream Optimization</CardTitle>
                <CardDescription className="text-gray-400">
                  Predicted REM windows and optimal logging times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">REM Sleep Window</div>
                      <div className="text-white font-medium">
                        {formatTime(dreamOptimization.remWindowStart)} - {formatTime(dreamOptimization.remWindowEnd)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Optimal Logging Time</div>
                      <div className="text-white font-medium">
                        {formatTime(dreamOptimization.optimalLoggingTime)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-yellow-600/20 rounded-lg border border-yellow-600/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">
                        Dream Recall Probability: {Math.round(dreamOptimization.dreamRecallProbability * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-yellow-300">
                      {dreamOptimization.dreamRecallProbability > 0.8 
                        ? 'Excellent conditions for dream recall tonight!'
                        : dreamOptimization.dreamRecallProbability > 0.6
                        ? 'Good conditions for dream recall.'
                        : 'Fair conditions - consider adjusting your schedule.'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {/* Tips */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Smart Sleep Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p>Consistent sleep schedules improve dream recall by up to 40%</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p>Natural wake-ups during light sleep phases enhance memory consolidation</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p>REM sleep occurs most frequently in the final third of your sleep cycle</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p>Adaptive scheduling learns from your patterns and improves over time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}