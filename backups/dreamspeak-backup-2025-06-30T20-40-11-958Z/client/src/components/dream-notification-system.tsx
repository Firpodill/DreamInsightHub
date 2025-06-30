import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing, Clock, Moon, Sun, Brain, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DreamNotification {
  id: string;
  type: 'optimal_logging' | 'rem_phase' | 'wake_reminder' | 'sleep_reminder';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  actionable: boolean;
}

interface NotificationSystemProps {
  sleepCycleData?: any;
  onNavigateToTab?: (tab: string) => void;
}

export function DreamNotificationSystem({ sleepCycleData, onNavigateToTab }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<DreamNotification[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkForNotifications();
    }, 60000);

    return () => clearInterval(timer);
  }, [sleepCycleData]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const createNotification = (notification: Omit<DreamNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: DreamNotification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    
    // Show browser notification if permission granted
    if (notificationPermission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.type
      });
    }

    return newNotification;
  };

  const checkForNotifications = () => {
    const now = new Date();
    
    // Check for optimal logging window (simulated - would integrate with real sleep data)
    if (sleepCycleData?.wakeTime) {
      const wakeTime = new Date(sleepCycleData.wakeTime);
      const timeSinceWake = (now.getTime() - wakeTime.getTime()) / (1000 * 60);
      
      if (timeSinceWake >= 0 && timeSinceWake <= 15) {
        const existingNotification = notifications.find(n => 
          n.type === 'optimal_logging' && 
          now.getTime() - n.timestamp.getTime() < 15 * 60 * 1000
        );
        
        if (!existingNotification) {
          createNotification({
            type: 'optimal_logging',
            title: 'Optimal Dream Logging Time!',
            message: 'Your dream recall is at its peak right now. Log your dreams for best results.',
            priority: 'high',
            actionable: true
          });
        }
      }
    }

    // Check for bedtime reminders (9-11 PM)
    const hour = now.getHours();
    if (hour >= 21 && hour <= 23) {
      const existingReminder = notifications.find(n => 
        n.type === 'sleep_reminder' && 
        now.toDateString() === n.timestamp.toDateString()
      );
      
      if (!existingReminder) {
        createNotification({
          type: 'sleep_reminder',
          title: 'Consider Starting Sleep Tracking',
          message: 'Track your sleep tonight for better dream analysis and optimal logging timing.',
          priority: 'medium',
          actionable: true
        });
      }
    }

    // Check for REM phase alerts (simulated - would use real sleep tracking)
    if (sleepCycleData?.isTracking && Math.random() < 0.1) { // 10% chance per check during tracking
      const existingRem = notifications.find(n => 
        n.type === 'rem_phase' && 
        now.getTime() - n.timestamp.getTime() < 30 * 60 * 1000
      );
      
      if (!existingRem) {
        createNotification({
          type: 'rem_phase',
          title: 'REM Sleep Detected',
          message: 'You are likely in REM sleep - prime time for vivid dreams.',
          priority: 'low',
          actionable: false
        });
      }
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationAction = (notification: DreamNotification) => {
    markAsRead(notification.id);
    
    switch (notification.type) {
      case 'optimal_logging':
        onNavigateToTab?.('journal');
        break;
      case 'sleep_reminder':
        onNavigateToTab?.('sleep');
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'optimal_logging': return <Zap className="w-4 h-4" />;
      case 'rem_phase': return <Brain className="w-4 h-4" />;
      case 'wake_reminder': return <Sun className="w-4 h-4" />;
      case 'sleep_reminder': return <Moon className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        className="relative text-white hover:bg-gray-700"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </Button>

      {/* Permission Request */}
      {notificationPermission === 'default' && (
        <div className="absolute top-12 right-0 z-50">
          <Card className="w-64 bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="text-sm text-white mb-2">
                Enable notifications for optimal dream logging alerts?
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={requestNotificationPermission}
                  className="bg-blue-600 hover:bg-blue-700 text-xs"
                >
                  Enable
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setNotificationPermission('denied')}
                  className="border-gray-600 text-white hover:bg-gray-700 text-xs"
                >
                  Skip
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 right-0 z-50 w-80 max-h-96 overflow-y-auto"
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                {/* Header */}
                <div className="p-3 border-b border-gray-700 flex items-center justify-between">
                  <h3 className="text-white font-medium">Notifications</h3>
                  {notifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllNotifications}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 border-b border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-700/50 ${
                          !notification.isRead ? 'bg-gray-700/30' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-1 rounded ${getPriorityColor(notification.priority)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium text-white truncate">
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-300 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {notification.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              {notification.actionable && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotificationAction(notification);
                                  }}
                                  className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1 h-6"
                                >
                                  Act
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}