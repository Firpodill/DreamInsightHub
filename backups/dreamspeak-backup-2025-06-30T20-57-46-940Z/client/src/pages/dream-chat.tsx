import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, BookOpen, Brain, Moon, User, Camera, Book, Clock } from 'lucide-react';
import { useLocation } from 'wouter';
import { ChatInterface } from '@/components/chat-interface';
import { DreamJournal } from '@/components/dream-journal';
import { InsightsDashboard } from '@/components/insights-dashboard';
import { DreamNotificationSystem } from '@/components/dream-notification-system';
import DreamAnalysis from '@/pages/dream-analysis';



export default function DreamChat() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [profileName, setProfileName] = useState(localStorage.getItem('profileName') || '');
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('profilePhoto') || '');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [tempName, setTempName] = useState(profileName);
  const [isMilitaryTime, setIsMilitaryTime] = useState(localStorage.getItem('militaryTime') === 'true');
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('chat');



  // Check for URL parameter to set initial tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['chat', 'journal', 'insights', 'analysis'].includes(tabParam)) {
      setActiveTab(tabParam);
      // Clear the URL parameter after setting the tab
      window.history.replaceState({}, '', '/');
    }
  }, []);



  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDay = (date: Date) => {
    return date.getDate().toString();
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: !isMilitaryTime 
    });
  };

  const toggleTimeFormat = () => {
    const newFormat = !isMilitaryTime;
    setIsMilitaryTime(newFormat);
    localStorage.setItem('militaryTime', newFormat.toString());
  };

  const handleSaveProfile = () => {
    setProfileName(tempName);
    localStorage.setItem('profileName', tempName);
    if (profilePhoto) {
      localStorage.setItem('profilePhoto', profilePhoto);
    }
    setIsProfileOpen(false);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle tab transitions with sound feedback
  const handleTabChange = (newTab: string) => {
    if (newTab !== activeTab) {
      // Play subtle sound feedback
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different frequencies for different tabs
        const frequencies = {
          chat: 220,
          journal: 180,
          insights: 270,
          analysis: 240,
          symbols: 150,
          vision: 200
        };
        
        const freq = frequencies[newTab as keyof typeof frequencies] || 200;
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(freq * 1.5, audioContext.currentTime + 0.1);
        
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
      } catch (error) {
        // Silently fail if Web Audio API is not supported
      }
      
      setActiveTab(newTab);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 text-white min-h-screen relative overflow-hidden">
      {/* Header */}
      <header className="text-center py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center animate-eyeball-spin relative" style={{
              background: 'radial-gradient(circle at center, #ffffff 20%, #e5e7eb 40%, #374151 70%, #111827 100%)',
              border: '2px solid #1f2937'
            }}>
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full relative flex items-center justify-center animate-eyeball-spin" style={{
                background: 'radial-gradient(circle at 30% 30%, #3b82f6, #1e40af, #0f172a)',
                border: '1px solid #1e40af'
              }}>
                <div className="w-1 h-1 rounded-full absolute top-0.5 left-0.5 animate-eyeball-spin" style={{
                  background: 'radial-gradient(circle at 30% 30%, #ffffff, #e5e7eb)',
                  boxShadow: '0 0 2px rgba(255, 255, 255, 0.8)'
                }}></div>
              </div>
              {/* Static day number overlay - counter-rotates to stay still */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-reverse-spin">
                <div className="text-xs font-bold text-white leading-none">
                  {formatDay(currentDate)}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <button 
                onClick={toggleTimeFormat}
                className="text-xs font-medium opacity-75 hover:opacity-100 transition-opacity text-left"
                title={`Switch to ${isMilitaryTime ? 'Standard' : 'Military'} Time`}
              >
                {formatTime(currentDate)}
              </button>
              <span className="text-xs sm:text-sm font-medium">TODAY</span>
              <span className="text-xs font-bold" style={{ color: '#E53E3E' }}>{formatDayName(currentDate)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs sm:text-sm font-medium px-2 py-1 rounded" style={{
              backgroundColor: profileName ? '#E53E3E' : 'transparent',
              color: profileName ? '#FFFFFF' : 'inherit'
            }}>
              {profileName || 'PROFILE'}
            </span>
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DialogTrigger asChild>
                <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-105" style={{
                  background: profilePhoto ? 'transparent' : 'linear-gradient(135deg, #e5e7eb, #9ca3af)',
                  border: '2px solid #FFFF00'
                }}>
                  {profilePhoto ? (
                    <img 
                      src={profilePhoto} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-600">
                <DialogHeader>
                  <DialogTitle className="text-white">Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-white">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="col-span-3 bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="photo" className="text-right text-white">
                      Photo
                    </Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('photo')?.click()}
                        className="border-slate-600 text-white hover:bg-slate-700"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Choose Photo
                      </Button>
                      {profilePhoto && (
                        <img 
                          src={profilePhoto} 
                          alt="Preview" 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsProfileOpen(false)}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveProfile}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="text-center mt-4 px-2">
          <div className="mb-2 mx-auto max-w-xs" style={{
            background: '#E53E3E',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '3px solid #000000',
            transform: 'rotate(-1deg)',
            boxShadow: '6px 6px 0px #000000',
            position: 'relative',
            zIndex: 10
          }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black" style={{
              color: '#FFFF00',
              WebkitTextStroke: '2px #000000',
              letterSpacing: '2px',
              fontFamily: 'Impact, Arial Black, sans-serif',
              textTransform: 'uppercase',
              filter: 'contrast(1.4) saturate(1.5)',
              lineHeight: '1',
              marginBottom: '4px'
            }}>DREAMSPEAK<span style={{ fontSize: '0.3em', verticalAlign: 'super', color: '#FFFF00', WebkitTextStroke: '0.5px #000000' }}>©</span></h1>
            <h2 className="text-xs sm:text-sm font-bold" style={{
              color: '#FFFF00',
              letterSpacing: '3px',
              fontFamily: 'Impact, Arial Black, sans-serif',
              textTransform: 'uppercase',
              lineHeight: '1'
            }}>JUNGIAN DREAM DECODER</h2>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="px-4 mb-2 -mt-1">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-700">
            <TabsTrigger value="chat" className="text-white data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-300 text-xs">
              <MessageCircle className="w-3 h-3 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-white data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-300 text-xs">
              <Brain className="w-3 h-3 mr-1" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-white data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-300 text-xs">
              <Brain className="w-3 h-3 mr-1" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="journal" className="text-white data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-300 text-xs">
              <BookOpen className="w-3 h-3 mr-1" />
              Journal Logs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="mt-6">
            <ChatInterface onDecodeComplete={() => setActiveTab('analysis')} />
          </TabsContent>
          
          <TabsContent value="journal" className="mt-6">
            <DreamJournal />
          </TabsContent>
          

          
          <TabsContent value="analysis" className="mt-6">
            <DreamAnalysis />
          </TabsContent>
          
          <TabsContent value="insights" className="mt-6">
            <InsightsDashboard />
          </TabsContent>
          

          



        </Tabs>
      </div>


    </div>
  );
}
