import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, BookOpen, Brain, Moon, User, Camera } from 'lucide-react';
import { ChatInterface } from '@/components/chat-interface';
import { DreamJournal } from '@/components/dream-journal';
import { InsightsDashboard } from '@/components/insights-dashboard';

export default function DreamChat() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [profileName, setProfileName] = useState(localStorage.getItem('profileName') || '');
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('profilePhoto') || '');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [tempName, setTempName] = useState(profileName);
  const [isMilitaryTime, setIsMilitaryTime] = useState(localStorage.getItem('militaryTime') === 'true');

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

  return (
    <div className="max-w-md mx-auto bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 text-white min-h-screen relative overflow-hidden">
      {/* Header */}
      <header className="text-center py-8 px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center animate-eyeball-spin relative" style={{
              background: 'radial-gradient(circle at center, #ffffff 20%, #e5e7eb 40%, #374151 70%, #111827 100%)',
              border: '2px solid #1f2937'
            }}>
              <div className="w-6 h-6 rounded-full relative flex items-center justify-center" style={{
                background: 'radial-gradient(circle at 30% 30%, #3b82f6, #1e40af, #0f172a)',
                border: '1px solid #1e40af'
              }}>
                <div className="text-xs font-bold text-white leading-none absolute inset-0 flex items-center justify-center">
                  {formatDay(currentDate)}
                </div>
                <div className="w-1 h-1 rounded-full absolute top-0.5 left-0.5" style={{
                  background: 'radial-gradient(circle at 30% 30%, #ffffff, #e5e7eb)',
                  boxShadow: '0 0 2px rgba(255, 255, 255, 0.8)'
                }}></div>
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
              <span className="text-sm font-medium">TODAY</span>
              <span className="text-xs font-bold" style={{ color: '#E53E3E' }}>{formatDayName(currentDate)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium px-2 py-1 rounded" style={{
              backgroundColor: profileName ? '#E53E3E' : 'transparent',
              color: profileName ? '#FFFFFF' : 'inherit'
            }}>
              {profileName || 'PROFILE'}
            </span>
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DialogTrigger asChild>
                <button className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105" style={{
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
                    <User className="w-6 h-6 text-gray-600" />
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
        
        <div className="text-center">
          <div className="-mb-8" style={{
            background: '#E53E3E',
            padding: '16px 24px',
            borderRadius: '12px',
            border: '4px solid #000000',
            transform: 'rotate(-1deg)',
            boxShadow: '8px 8px 0px #000000',
            position: 'relative',
            zIndex: 10
          }}>
            <h1 className="text-5xl font-black" style={{
              color: '#FFFF00',
              WebkitTextStroke: '3px #000000',
              letterSpacing: '4px',
              fontFamily: 'Impact, Arial Black, sans-serif',
              textTransform: 'uppercase',
              filter: 'contrast(1.4) saturate(1.5)',
              lineHeight: '1',
              marginBottom: '4px'
            }}>DREAMSPEAK<span style={{ fontSize: '0.3em', verticalAlign: 'super', color: '#FFFF00', WebkitTextStroke: '0.5px #000000' }}>©</span></h1>
            <h2 className="text-sm font-bold" style={{
              color: '#FFFF00',
              letterSpacing: '6px',
              fontFamily: 'Impact, Arial Black, sans-serif',
              textTransform: 'uppercase',
              lineHeight: '1'
            }}>JUNGIAN DREAM DECODER</h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6">
        <ChatInterface />
      </div>
    </div>
  );
}
