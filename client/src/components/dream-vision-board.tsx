import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Download, 
  Plus, 
  Trash2, 
  Move, 
  RotateCw, 
  Sparkles,
  Image as ImageIcon,
  Save,
  Share2,
  Grid,
  Layers,
  Volume2,
  Mail,
  MessageSquare,
  Copy,
  Mic,
  MicOff,
  Play,
  Pause
} from 'lucide-react';
import { useDreams, useGenerateImage } from '@/hooks/use-dreams';
import { useNaturalVoice } from '@/hooks/use-natural-voice';
import type { Dream } from '@shared/schema';

interface VisionBoardItem {
  id: string;
  type: 'image' | 'text' | 'symbol';
  content: string;
  imageUrl?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  zIndex: number;
  style?: {
    color?: string;
    fontSize?: number;
    fontWeight?: string;
    backgroundColor?: string;
    borderRadius?: number;
  };
}

interface VisionBoard {
  id: string;
  title: string;
  description: string;
  items: VisionBoardItem[];
  background: string;
  audioRecording?: string; // Base64 encoded audio
  audioDescription?: string; // User's description of the audio
  isVoiceCloned?: boolean; // Whether audio was generated using voice cloning
  createdAt: Date;
  updatedAt: Date;
}

export function DreamVisionBoard() {
  const [boards, setBoards] = useState<VisionBoard[]>([]);
  const [currentBoard, setCurrentBoard] = useState<VisionBoard | null>(null);
  const [selectedItem, setSelectedItem] = useState<VisionBoardItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showNewBoardDialog, setShowNewBoardDialog] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [shareOptionsOpen, setShareOptionsOpen] = useState(false);
  const [exportOptionsOpen, setExportOptionsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioPlayback, setAudioPlayback] = useState<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceCloneDialogOpen, setVoiceCloneDialogOpen] = useState(false);
  const [voiceCloneText, setVoiceCloneText] = useState('');
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [userHasVoiceClone, setUserHasVoiceClone] = useState(false);
  const [defaultVoiceDialogOpen, setDefaultVoiceDialogOpen] = useState(false);
  const [defaultVoiceText, setDefaultVoiceText] = useState('');
  const [selectedVoiceGender, setSelectedVoiceGender] = useState<'female' | 'male'>('female');
  const [selectedVoiceOption, setSelectedVoiceOption] = useState<string>('auto');

  const { data: dreams = [] } = useDreams();
  const generateImage = useGenerateImage();
  const { speak, stop, isPlaying } = useNaturalVoice();

  // Load boards from localStorage and auto-select specific board if requested
  useEffect(() => {
    const savedBoards = localStorage.getItem('dreamVisionBoards');
    if (savedBoards) {
      const parsedBoards = JSON.parse(savedBoards).map((board: any) => ({
        ...board,
        createdAt: new Date(board.createdAt),
        updatedAt: new Date(board.updatedAt)
      }));
      setBoards(parsedBoards);
      
      // Check if user navigated to a specific board from calendar
      const requestedBoardId = localStorage.getItem('currentVisionBoardId');
      if (requestedBoardId) {
        const requestedBoard = parsedBoards.find((board: any) => board.id === requestedBoardId);
        if (requestedBoard) {
          setCurrentBoard(requestedBoard);
        }
        localStorage.removeItem('currentVisionBoardId');
      }
    }
  }, []);

  // Save boards to localStorage
  const saveBoards = (updatedBoards: VisionBoard[]) => {
    setBoards(updatedBoards);
    localStorage.setItem('dreamVisionBoards', JSON.stringify(updatedBoards));
  };

  const deleteBoard = (boardId: string) => {
    const updatedBoards = boards.filter(board => board.id !== boardId);
    saveBoards(updatedBoards);
    if (currentBoard?.id === boardId) {
      setCurrentBoard(null);
    }
  };

  // Voice playback for dream text using natural voice
  const playDreamText = (dreamText: string) => {
    if (isPlaying) {
      stop();
    } else {
      speak(dreamText);
    }
  };

  // Audio recording functions
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };
      
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          if (currentBoard) {
            const updatedBoard = {
              ...currentBoard,
              audioRecording: base64Audio,
              updatedAt: new Date()
            };
            setCurrentBoard(updatedBoard);
            const updatedBoards = boards.map(board => 
              board.id === currentBoard.id ? updatedBoard : board
            );
            saveBoards(updatedBoards);
          }
        };
        reader.readAsDataURL(audioBlob);
        setAudioChunks([]);
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting audio recording:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const playAudioRecording = () => {
    if (!currentBoard?.audioRecording) return;
    
    if (isPlayingAudio && audioPlayback) {
      audioPlayback.pause();
      setIsPlayingAudio(false);
      return;
    }
    
    const audio = new Audio(currentBoard.audioRecording);
    audio.onended = () => setIsPlayingAudio(false);
    audio.play();
    setAudioPlayback(audio);
    setIsPlayingAudio(true);
  };

  const deleteAudioRecording = () => {
    if (currentBoard) {
      const updatedBoard = {
        ...currentBoard,
        audioRecording: undefined,
        audioDescription: undefined,
        updatedAt: new Date()
      };
      setCurrentBoard(updatedBoard);
      const updatedBoards = boards.map(board => 
        board.id === currentBoard.id ? updatedBoard : board
      );
      saveBoards(updatedBoards);
    }
    if (audioPlayback) {
      audioPlayback.pause();
      setIsPlayingAudio(false);
    }
  };

  // Voice cloning functions
  const generateVoiceClone = async (text: string) => {
    setIsGeneratingVoice(true);
    try {
      // Simulate API call to voice cloning service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real implementation, this would call an AI voice cloning API
      const mockVoiceCloneAudio = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvnMfCzmQXt+XhAcJHYP';
      
      if (currentBoard) {
        const updatedBoard = {
          ...currentBoard,
          audioRecording: mockVoiceCloneAudio,
          audioDescription: text,
          isVoiceCloned: true,
          updatedAt: new Date()
        };
        setCurrentBoard(updatedBoard);
        const updatedBoards = boards.map(board => 
          board.id === currentBoard.id ? updatedBoard : board
        );
        saveBoards(updatedBoards);
      }
      
      alert('Voice clone generated successfully!');
    } catch (error) {
      console.error('Voice cloning failed:', error);
      alert('Voice cloning failed. Please try again.');
    } finally {
      setIsGeneratingVoice(false);
      setVoiceCloneDialogOpen(false);
      setVoiceCloneText('');
    }
  };

  const purchaseVoiceCloning = () => {
    // Simulate purchasing voice cloning feature
    const confirmed = confirm('Purchase Voice Cloning feature for $9.99/month?\n\nThis premium feature allows you to clone your voice for personalized audio messages on your vision boards.');
    if (confirmed) {
      localStorage.setItem('userHasVoiceClone', 'true');
      setUserHasVoiceClone(true);
      alert('Voice Cloning feature activated! You can now create personalized audio messages.');
    }
  };

  // Get available voice options for better quality
  const getVoiceOptions = () => {
    const voices = speechSynthesis.getVoices();
    const femaleVoices = [
      { name: 'auto', display: 'Auto Select Female', voice: null },
      ...voices.filter(voice => 
        voice.lang.startsWith('en') && (
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('susan') ||
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('victoria') ||
          voice.name.toLowerCase().includes('hazel') ||
          voice.name.toLowerCase().includes('allison') ||
          voice.name.toLowerCase().includes('ava') ||
          voice.name.toLowerCase().includes('serena')
        )
      ).map(voice => ({ name: voice.name, display: voice.name, voice }))
    ];

    const maleVoices = [
      { name: 'auto', display: 'Auto Select Male', voice: null },
      ...voices.filter(voice => 
        voice.lang.startsWith('en') && (
          voice.name.toLowerCase().includes('david') ||
          voice.name.toLowerCase().includes('mark') ||
          voice.name.toLowerCase().includes('daniel') ||
          voice.name.toLowerCase().includes('james') ||
          voice.name.toLowerCase().includes('tom') ||
          voice.name.toLowerCase().includes('alex') ||
          voice.name.toLowerCase().includes('aaron') ||
          voice.name.toLowerCase().includes('nathan') ||
          voice.name.toLowerCase().includes('ryan')
        )
      ).map(voice => ({ name: voice.name, display: voice.name, voice }))
    ];

    return { femaleVoices, maleVoices };
  };

  // Generate default voice audio with specific voice selection
  const generateDefaultVoice = async (text: string, gender: 'female' | 'male', voiceOption: string = 'auto') => {
    setIsGeneratingVoice(true);
    try {
      // Ensure voices are loaded
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) {
        await new Promise(resolve => {
          speechSynthesis.addEventListener('voiceschanged', resolve, { once: true });
        });
      }

      const availableVoices = speechSynthesis.getVoices();
      const utterance = new SpeechSynthesisUtterance(text);
      
      let selectedVoice = null;
      
      if (voiceOption !== 'auto') {
        // Use specific selected voice
        selectedVoice = availableVoices.find(voice => voice.name === voiceOption);
      }
      
      if (!selectedVoice) {
        // Auto-select best voice for gender
        if (gender === 'female') {
          const femalePreferences = [
            'Samantha', 'Karen', 'Susan', 'Zira', 'Victoria', 'Hazel', 'Allison', 'Ava', 'Serena'
          ];
          for (const preference of femalePreferences) {
            selectedVoice = availableVoices.find(voice => 
              voice.lang.startsWith('en') && voice.name.toLowerCase().includes(preference.toLowerCase())
            );
            if (selectedVoice) break;
          }
        } else {
          const malePreferences = [
            'David', 'Mark', 'Daniel', 'James', 'Tom', 'Alex', 'Aaron', 'Nathan', 'Ryan'
          ];
          for (const preference of malePreferences) {
            selectedVoice = availableVoices.find(voice => 
              voice.lang.startsWith('en') && voice.name.toLowerCase().includes(preference.toLowerCase())
            );
            if (selectedVoice) break;
          }
        }
      }
      
      // Fallback to any English voice
      if (!selectedVoice) {
        selectedVoice = availableVoices.find(voice => voice.lang.startsWith('en'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Optimize voice parameters for natural sound
      utterance.rate = gender === 'female' ? 0.85 : 0.8;
      utterance.pitch = gender === 'female' ? 1.15 : 0.85;
      utterance.volume = 0.95;
      
      // Record audio using MediaRecorder
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(destination.stream, { mimeType: 'audio/webm' });
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          if (currentBoard) {
            const updatedBoard = {
              ...currentBoard,
              audioRecording: base64Audio,
              audioDescription: text,
              isVoiceCloned: false,
              updatedAt: new Date()
            };
            setCurrentBoard(updatedBoard);
            const updatedBoards = boards.map(board => 
              board.id === currentBoard.id ? updatedBoard : board
            );
            saveBoards(updatedBoards);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      
      utterance.onstart = () => {
        console.log(`Speech started with voice: ${selectedVoice?.name || 'default'}`);
      };
      
      utterance.onend = () => {
        setTimeout(() => {
          mediaRecorder.stop();
          audioContext.close();
        }, 500);
        
        setIsGeneratingVoice(false);
        setDefaultVoiceDialogOpen(false);
        setDefaultVoiceText('');
        alert(`Voice generated successfully with ${selectedVoice?.name || 'default voice'}!`);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        mediaRecorder.stop();
        audioContext.close();
        setIsGeneratingVoice(false);
        setDefaultVoiceDialogOpen(false);
        setDefaultVoiceText('');
        alert('Voice generation failed. Please try again.');
      };

      speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('Default voice generation failed:', error);
      setIsGeneratingVoice(false);
      setDefaultVoiceDialogOpen(false);
      setDefaultVoiceText('');
      alert('Voice generation failed. Please try recording manually instead.');
    }
  };

  // Save vision board
  const handleSave = () => {
    if (!currentBoard) return;
    
    const updatedBoard = {
      ...currentBoard,
      updatedAt: new Date()
    };
    
    const updatedBoards = boards.map(board => 
      board.id === currentBoard.id ? updatedBoard : board
    );
    
    saveBoards(updatedBoards);
    setCurrentBoard(updatedBoard);
    
    // Show success feedback
    alert('Vision board saved successfully!');
  };

  // Multiple export options
  const exportAsImage = async () => {
    if (!currentBoard) return;
    
    try {
      const canvas = await createVisionBoardCanvas(currentBoard);
      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Failed to create image');
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentBoard.title.replace(/\s+/g, '_')}_vision_board.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error('Image export failed:', error);
      alert('Image export failed. Please try again.');
    }
  };

  const exportAsVideo = async () => {
    if (!currentBoard) return;
    
    try {
      const canvas = await createVisionBoardCanvas(currentBoard);
      await createVideoWithAudio(canvas, currentBoard);
    } catch (error) {
      console.error('Video export failed:', error);
      alert('Video export failed. Please try again.');
    }
  };

  const exportAsAudio = async () => {
    if (!currentBoard?.audioRecording) {
      alert('No audio recording found for this vision board.');
      return;
    }
    
    try {
      const audioBlob = await fetch(currentBoard.audioRecording).then(r => r.blob());
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentBoard.title.replace(/\s+/g, '_')}_audio.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Audio export failed:', error);
      alert('Audio export failed. Please try again.');
    }
  };

  const exportAsText = () => {
    if (!currentBoard) return;
    
    const textContent = `${currentBoard.title}\n\n${currentBoard.description}\n\nCreated with DreamSpeak - Jungian Dream Decoder`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentBoard.title.replace(/\s+/g, '_')}_vision_board.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Create canvas helper function
  const createVisionBoardCanvas = async (board: VisionBoard): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas not supported');
    }
    
    canvas.width = 1200;
    canvas.height = 800;
    
    // Fill background
    ctx.fillStyle = board.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(board.title, 40, 60);
    
    // Add description
    ctx.fillStyle = '#333333';
    ctx.font = '18px Arial';
    const words = board.description.split(' ');
    let line = '';
    let y = 100;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 1120 && i > 0) {
        ctx.fillText(line, 40, y);
        line = words[i] + ' ';
        y += 25;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 40, y);
    
    // Render vision board items
    board.items.forEach(item => {
      ctx.save();
      ctx.translate(item.position.x + item.size.width/2, item.position.y + item.size.height/2);
      ctx.rotate(item.rotation * Math.PI / 180);
      
      if (item.type === 'text') {
        ctx.fillStyle = item.style?.color || '#000000';
        ctx.font = `${item.style?.fontSize || 16}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(item.content, 0, 0);
      } else if (item.type === 'symbol') {
        ctx.fillStyle = item.style?.color || '#000000';
        ctx.font = `${item.style?.fontSize || 24}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(item.content, 0, 0);
      }
      
      ctx.restore();
    });
    
    return canvas;
  };

  // Legacy export function for backwards compatibility
  const handleExport = async () => {
    setExportOptionsOpen(true);
  };

  // Enhanced video creation with proper audio duration handling
  const createVideoWithAudio = async (canvas: HTMLCanvasElement, board: VisionBoard) => {
    try {
      if (!board.audioRecording) {
        // No audio available, just export as image
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${board.title.replace(/\s+/g, '_')}_vision_board.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
        return;
      }

      // Create audio element to get actual duration
      const audioElement = new Audio(board.audioRecording);
      
      await new Promise((resolve, reject) => {
        audioElement.onloadedmetadata = resolve;
        audioElement.onerror = reject;
        audioElement.load();
      });

      const audioDuration = Math.max(audioElement.duration * 1000, 3000); // Minimum 3 seconds
      
      // Create video stream from canvas
      const stream = canvas.captureStream(30); // Higher frame rate for smoother video
      const videoTrack = stream.getVideoTracks()[0];
      
      // Create audio context and stream
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(audioElement);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
      const audioTrack = destination.stream.getAudioTracks()[0];
      
      // Combine streams
      const combinedStream = new MediaStream([videoTrack, audioTrack]);
      
      // Use MP4 codec for better compatibility and smaller file size
      const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=h264,aac') 
        ? 'video/mp4;codecs=h264,aac'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : 'video/webm';
      
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 1000000, // 1 Mbps for good quality with small size
        audioBitsPerSecond: 128000   // 128 kbps for good audio quality
      });
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${board.title.replace(/\s+/g, '_')}_complete_vision.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Cleanup
        videoTrack.stop();
        audioTrack.stop();
        audioContext.close();
      };
      
      // Start recording and play audio
      mediaRecorder.start();
      audioElement.play();
      
      // Stop recording when audio ends
      setTimeout(() => {
        mediaRecorder.stop();
      }, audioDuration + 500); // Add small buffer
      
    } catch (error) {
      console.error('Video creation failed:', error);
      alert('Video creation failed. Exporting as image instead.');
      
      // Fallback to image export
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${board.title.replace(/\s+/g, '_')}_vision_board.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  };

  // Multiple sharing options
  const shareImageOnly = async (method: 'email' | 'sms') => {
    if (!currentBoard || !shareEmail.trim()) return;
    
    const shareText = `Check out my dream vision board: "${currentBoard.title}"\n\n${shareMessage || currentBoard.description}\n\nCreated with DreamSpeak - Jungian Dream Decoder`;
    
    if (method === 'email') {
      const subject = `Dream Vision Board: ${currentBoard.title}`;
      const mailtoUrl = `mailto:${shareEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
      
      // Download image for manual attachment
      await exportAsImage();
      alert('Image downloaded! Attach it to your email.');
      window.open(mailtoUrl);
    } else {
      const smsUrl = `sms:${shareEmail}?body=${encodeURIComponent(shareText)}`;
      window.open(smsUrl);
    }
    
    setShareDialogOpen(false);
    setShareEmail('');
    setShareMessage('');
  };

  const shareVideoWithAudio = async (method: 'email' | 'sms') => {
    if (!currentBoard || !shareEmail.trim()) return;
    
    let shareText = `Check out my dream vision board: "${currentBoard.title}"\n\n${shareMessage || currentBoard.description}`;
    
    if (currentBoard.audioRecording) {
      shareText += `\n\n🎬 This vision board includes audio! A video file (.mp4) will be downloaded for sharing.`;
    }
    
    shareText += `\n\nCreated with DreamSpeak - Jungian Dream Decoder`;
    
    if (method === 'email') {
      const subject = `Dream Vision Board: ${currentBoard.title}`;
      const mailtoUrl = `mailto:${shareEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
      
      if (currentBoard.audioRecording) {
        await exportAsVideo();
        alert('Video file downloaded! Attach it to your email.');
      }
      
      window.open(mailtoUrl);
    } else {
      const smsUrl = `sms:${shareEmail}?body=${encodeURIComponent(shareText)}`;
      window.open(smsUrl);
    }
    
    setShareDialogOpen(false);
    setShareEmail('');
    setShareMessage('');
  };

  const shareTextOnly = (method: 'email' | 'sms') => {
    if (!currentBoard || !shareEmail.trim()) return;
    
    const shareText = `Dream Vision Board: "${currentBoard.title}"\n\n${shareMessage || currentBoard.description}\n\nCreated with DreamSpeak - Jungian Dream Decoder`;
    
    if (method === 'email') {
      const subject = `Dream Vision Board: ${currentBoard.title}`;
      const mailtoUrl = `mailto:${shareEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
      window.open(mailtoUrl);
    } else {
      const smsUrl = `sms:${shareEmail}?body=${encodeURIComponent(shareText)}`;
      window.open(smsUrl);
    }
    
    setShareDialogOpen(false);
    setShareEmail('');
    setShareMessage('');
  };

  // Share vision board with options
  const handleShare = () => {
    setShareOptionsOpen(true);
  };

  // Send share via email/text with media attachment
  const sendShare = async (method: 'email' | 'sms') => {
    if (!currentBoard || !shareEmail.trim()) return;
    
    let shareText = `Check out my dream vision board: "${currentBoard.title}"\n\n${shareMessage || currentBoard.description}`;
    
    if (currentBoard.audioRecording) {
      shareText += `\n\n🎬 This vision board includes audio! A video file (.mp4) will be downloaded for sharing.`;
    }
    
    shareText += `\n\nCreated with DreamSpeak - Jungian Dream Decoder`;
    
    if (method === 'email') {
      const subject = `Dream Vision Board: ${currentBoard.title}`;
      let mailtoUrl = `mailto:${shareEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
      
      // Create and download video file for sharing
      if (currentBoard.audioRecording) {
        try {
          // Create video file for sharing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = 1200;
            canvas.height = 800;
            
            // Render vision board to canvas
            ctx.fillStyle = currentBoard.background;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 32px Arial';
            ctx.fillText(currentBoard.title, 40, 60);
            
            ctx.fillStyle = '#333333';
            ctx.font = '18px Arial';
            const words = currentBoard.description.split(' ');
            let line = '';
            let y = 100;
            for (let i = 0; i < words.length; i++) {
              const testLine = line + words[i] + ' ';
              const metrics = ctx.measureText(testLine);
              if (metrics.width > 1120 && i > 0) {
                ctx.fillText(line, 40, y);
                line = words[i] + ' ';
                y += 25;
              } else {
                line = testLine;
              }
            }
            ctx.fillText(line, 40, y);
            
            await createVideoWithAudio(canvas, currentBoard);
            alert('Video file downloaded! Attach it to your email or message.');
          }
        } catch (error) {
          console.error('Error creating video file:', error);
          alert('Could not create video. Sharing text only.');
        }
      }
      
      window.open(mailtoUrl);
    } else {
      const smsUrl = `sms:${shareEmail}?body=${encodeURIComponent(shareText)}`;
      window.open(smsUrl);
    }
    
    setShareDialogOpen(false);
    setShareEmail('');
    setShareMessage('');
  };

  // Copy share link to clipboard
  const copyToClipboard = async () => {
    if (!currentBoard) return;
    
    const shareText = `My dream vision board: "${currentBoard.title}"\n\n${currentBoard.description}\n\nCreated with DreamSpeak - Jungian Dream Decoder`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Vision board details copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Copy failed. Please try again.');
    }
  };

  const createNewBoard = () => {
    if (!newBoardTitle.trim()) return;

    const newBoard: VisionBoard = {
      id: Date.now().toString(),
      title: newBoardTitle,
      description: newBoardDescription,
      items: [],
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedBoards = [...boards, newBoard];
    saveBoards(updatedBoards);
    setCurrentBoard(newBoard);
    setNewBoardTitle('');
    setNewBoardDescription('');
    setShowNewBoardDialog(false);
  };

  const generateImageFromDream = async (dream: Dream) => {
    if (!currentBoard) return;

    try {
      const prompt = `Dream visualization: ${dream.content.substring(0, 200)}. Surreal, artistic, dreamlike quality.`;
      setGenerationPrompt(prompt);
      
      const result = await generateImage.mutateAsync({
        prompt: prompt,
        dreamId: dream.id
      });

      if (result.imageUrl) {
        const newItem: VisionBoardItem = {
          id: Date.now().toString(),
          type: 'image',
          content: `Dream: ${dream.title || 'Untitled'}`,
          imageUrl: result.imageUrl,
          position: { x: Math.random() * 250, y: Math.random() * 150 },
          size: { width: 300, height: 300 },
          rotation: 0,
          zIndex: currentBoard.items.length + 1
        };
        
        addItemToBoard(newItem);
        
        // Auto-generate comprehensive audio narration combining dream and vision board
        const fullNarrationText = createFullNarrationText(dream, currentBoard);
        setDefaultVoiceText(fullNarrationText);
        setDefaultVoiceDialogOpen(true);
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  // Create comprehensive narration text combining dream content and vision board
  const createFullNarrationText = (dream?: Dream, board?: VisionBoard): string => {
    let narration = '';
    
    if (dream && board) {
      narration = `Dream Vision Board: ${board.title}. 

Original Dream: ${dream.content}

Vision Board Reflection: ${board.description}

This vision board captures the essence and symbolism from my dream, creating a visual manifestation of the subconscious imagery and archetypal elements that emerged during sleep.`;
    } else if (board) {
      narration = `Vision Board: ${board.title}. 

${board.description}

This vision board represents my dreams, aspirations, and the symbolic imagery that resonates with my subconscious mind.`;
    } else if (dream) {
      narration = `Dream Narration: ${dream.title || 'My Dream'}.

${dream.content}`;
    }
    
    return narration;
  };

  // Enhanced voice generation that includes dream context
  const generateComprehensiveAudio = async (dream?: Dream) => {
    if (!currentBoard) return;
    
    const fullText = createFullNarrationText(dream, currentBoard);
    setDefaultVoiceText(fullText);
    setDefaultVoiceDialogOpen(true);
  };

  const generateImageFromPrompt = async () => {
    if (!currentBoard || !generationPrompt.trim()) return;

    try {
      const result = await generateImage.mutateAsync({
        prompt: generationPrompt,
        dreamId: undefined
      });

      if (result.imageUrl) {
        addItemToBoard({
          type: 'image',
          content: generationPrompt,
          imageUrl: result.imageUrl,
          position: { x: Math.random() * 300, y: Math.random() * 200 },
          size: { width: 200, height: 200 },
          rotation: 0,
          zIndex: currentBoard.items.length + 1
        });
      }
      setGenerationPrompt('');
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  const addItemToBoard = (itemData: Omit<VisionBoardItem, 'id'>) => {
    if (!currentBoard) return;

    const newItem: VisionBoardItem = {
      id: Date.now().toString(),
      ...itemData
    };

    const updatedBoard = {
      ...currentBoard,
      items: [...currentBoard.items, newItem],
      updatedAt: new Date()
    };

    const updatedBoards = boards.map(board => 
      board.id === currentBoard.id ? updatedBoard : board
    );

    saveBoards(updatedBoards);
    setCurrentBoard(updatedBoard);
  };

  const updateItem = (itemId: string, updates: Partial<VisionBoardItem>) => {
    if (!currentBoard) return;

    const updatedItems = currentBoard.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    const updatedBoard = {
      ...currentBoard,
      items: updatedItems,
      updatedAt: new Date()
    };

    const updatedBoards = boards.map(board => 
      board.id === currentBoard.id ? updatedBoard : board
    );

    saveBoards(updatedBoards);
    setCurrentBoard(updatedBoard);
  };

  const deleteItem = (itemId: string) => {
    if (!currentBoard) return;

    const updatedItems = currentBoard.items.filter(item => item.id !== itemId);
    const updatedBoard = {
      ...currentBoard,
      items: updatedItems,
      updatedAt: new Date()
    };

    const updatedBoards = boards.map(board => 
      board.id === currentBoard.id ? updatedBoard : board
    );

    saveBoards(updatedBoards);
    setCurrentBoard(updatedBoard);
  };

  const handleMouseDown = (e: React.MouseEvent, item: VisionBoardItem) => {
    e.preventDefault();
    setSelectedItem(item);
    setIsDragging(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedItem) return;

    const container = e.currentTarget.getBoundingClientRect();
    const newPosition = {
      x: e.clientX - container.left - dragOffset.x,
      y: e.clientY - container.top - dragOffset.y
    };

    updateItem(selectedItem.id, { position: newPosition });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setSelectedItem(null);
  };

  if (!currentBoard) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <Palette className="w-16 h-16 mx-auto mb-4 text-purple-500" />
          <h2 className="text-2xl font-bold mb-2">Dream Vision Boards</h2>
          <p className="text-gray-600 mb-6">
            Create visual collages of your dreams with AI-generated imagery
          </p>
        </div>

        {/* New Board Button */}
        <div className="text-center">
          <Dialog open={showNewBoardDialog} onOpenChange={setShowNewBoardDialog}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                <Plus size={20} className="mr-2" />
                Create New Vision Board
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Vision Board</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    placeholder="My Dream Vision Board"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newBoardDescription}
                    onChange={(e) => setNewBoardDescription(e.target.value)}
                    placeholder="Describe your vision board theme..."
                  />
                </div>
                <Button onClick={createNewBoard} className="w-full">
                  Create Board
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Existing Boards */}
        {boards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <Card 
                key={board.id} 
                className="relative cursor-pointer hover:shadow-lg transition-shadow group"
              >
                <CardContent className="p-4" onClick={() => setCurrentBoard(board)}>
                  <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-3 flex items-center justify-center">
                    {board.items?.[0]?.imageUrl ? (
                      <img 
                        src={board.items[0].imageUrl} 
                        alt="Board preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Grid className="w-8 h-8 text-white opacity-50" />
                    )}
                  </div>
                  <h3 className="font-semibold">{board.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{board.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {board.items.length} items
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {board.updatedAt.toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBoard(board.id);
                  }}
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentBoard(null)}
            size="sm"
          >
            ← Back
          </Button>
          <div>
            <h1 className="text-xl font-bold">{currentBoard.title}</h1>
            <p className="text-sm text-gray-600">{currentBoard.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Audio Recording Controls */}
          <div className="flex items-center gap-1 mr-2">
            {currentBoard?.audioRecording ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={playAudioRecording}
                  className={currentBoard.isVoiceCloned ? "bg-purple-50 border-purple-200" : ""}
                >
                  {isPlayingAudio ? <Pause size={14} className="mr-1" /> : <Play size={14} className="mr-1" />}
                  {currentBoard.isVoiceCloned ? "AI Voice" : "Audio"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={deleteAudioRecording}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={isRecording ? stopAudioRecording : startAudioRecording}
                  className={isRecording ? "bg-red-50 border-red-200" : ""}
                >
                  {isRecording ? <MicOff size={14} className="mr-1" /> : <Mic size={14} className="mr-1" />}
                  {isRecording ? "Stop" : "Record"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Auto-populate with comprehensive narration including dream content
                    const associatedDream = dreams.find(dream => 
                      currentBoard?.items.some(item => 
                        item.content.includes(dream.title || '') || 
                        item.content.includes('Dream:')
                      )
                    );
                    const fullText = createFullNarrationText(associatedDream, currentBoard);
                    setDefaultVoiceText(fullText || currentBoard?.description || '');
                    setDefaultVoiceDialogOpen(true);
                  }}
                  className="bg-blue-50 border-blue-200 text-blue-700"
                >
                  <Volume2 size={14} className="mr-1" />
                  Default Voice
                </Button>
                {userHasVoiceClone ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Auto-populate AI voice with comprehensive narration
                      const associatedDream = dreams.find(dream => 
                        currentBoard?.items.some(item => 
                          item.content.includes(dream.title || '') || 
                          item.content.includes('Dream:')
                        )
                      );
                      const fullText = createFullNarrationText(associatedDream, currentBoard);
                      setVoiceCloneText(fullText || currentBoard?.description || '');
                      setVoiceCloneDialogOpen(true);
                    }}
                    className="bg-purple-50 border-purple-200 text-purple-700"
                  >
                    <Volume2 size={14} className="mr-1" />
                    AI Voice
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={purchaseVoiceCloning}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700"
                  >
                    <Volume2 size={14} className="mr-1" />
                    Upgrade
                  </Button>
                )}
              </>
            )}
          </div>
          
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save size={16} className="mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 size={16} className="mr-1" />
            Share Options
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download size={16} className="mr-1" />
            Export Options
          </Button>
          {currentBoard?.audioRecording && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={async () => {
                if (!currentBoard) return;
                const canvas = await createVisionBoardCanvas(currentBoard);
                await createVideoWithAudio(canvas, currentBoard);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Play size={16} className="mr-1" />
              Create Complete File
            </Button>
          )}
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Vision Board</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email or Phone Number</label>
              <Input
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                placeholder="friend@example.com or +1234567890"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Personal Message (Optional)</label>
              <Textarea
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                placeholder="Add a personal note..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => sendShare('email')}
                disabled={!shareEmail.trim()}
                className="flex-1"
              >
                <Mail size={16} className="mr-2" />
                Send Email
              </Button>
              <Button 
                onClick={() => sendShare('sms')}
                disabled={!shareEmail.trim()}
                variant="outline"
                className="flex-1"
              >
                <MessageSquare size={16} className="mr-2" />
                Send Text
              </Button>
              <Button 
                onClick={copyToClipboard}
                variant="outline"
              >
                <Copy size={16} className="mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Default Voice Dialog */}
      <Dialog open={defaultVoiceDialogOpen} onOpenChange={setDefaultVoiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Default Voice Audio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Voice Gender</label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={selectedVoiceGender === 'female' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedVoiceGender('female')}
                >
                  Female Voice
                </Button>
                <Button
                  variant={selectedVoiceGender === 'male' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedVoiceGender('male')}
                >
                  Male Voice
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Text to Speak</label>
              <Textarea
                value={defaultVoiceText}
                onChange={(e) => setDefaultVoiceText(e.target.value)}
                placeholder="Enter the text you want the voice to speak..."
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Voice Selection</label>
              <select
                value={selectedVoiceOption}
                onChange={(e) => setSelectedVoiceOption(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              >
                {selectedVoiceGender === 'female' ? 
                  getVoiceOptions().femaleVoices.map(voice => (
                    <option key={voice.name} value={voice.name}>
                      {voice.display}
                    </option>
                  )) :
                  getVoiceOptions().maleVoices.map(voice => (
                    <option key={voice.name} value={voice.name}>
                      {voice.display}
                    </option>
                  ))
                }
              </select>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => generateDefaultVoice(defaultVoiceText, selectedVoiceGender, selectedVoiceOption)}
                disabled={!defaultVoiceText.trim() || isGeneratingVoice}
                className="flex-1"
              >
                {isGeneratingVoice ? 'Generating...' : 'Generate Voice'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setDefaultVoiceDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Free default voices use your browser's built-in text-to-speech engine. Quality may vary by device.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Voice Cloning Dialog */}
      <Dialog open={voiceCloneDialogOpen} onOpenChange={setVoiceCloneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Voice Cloning (Premium)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-700">
                Using your personalized AI voice clone to generate natural-sounding audio.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Text to Speak</label>
              <Textarea
                value={voiceCloneText}
                onChange={(e) => setVoiceCloneText(e.target.value)}
                placeholder="Enter the text you want your AI voice to speak..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => generateVoiceClone(voiceCloneText)}
                disabled={!voiceCloneText.trim() || isGeneratingVoice}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isGeneratingVoice ? 'Generating AI Voice...' : 'Generate AI Voice'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setVoiceCloneDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              AI voice cloning creates high-quality, personalized audio using advanced machine learning.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Options Dialog */}
      <Dialog open={exportOptionsOpen} onOpenChange={setExportOptionsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Vision Board</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Choose your preferred export format:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => {
                  exportAsImage();
                  setExportOptionsOpen(false);
                }}
                className="flex flex-col items-center p-6 h-auto"
                variant="outline"
              >
                <ImageIcon size={24} className="mb-2" />
                <span className="font-medium">Image (PNG)</span>
                <span className="text-xs text-gray-500">Vision board as image</span>
              </Button>
              
              <Button 
                onClick={() => {
                  exportAsVideo();
                  setExportOptionsOpen(false);
                }}
                className="flex flex-col items-center p-6 h-auto"
                variant="outline"
                disabled={!currentBoard?.audioRecording}
              >
                <Play size={24} className="mb-2" />
                <span className="font-medium">Video (MP4)</span>
                <span className="text-xs text-gray-500">
                  {currentBoard?.audioRecording ? 'Image + Audio' : 'No audio available'}
                </span>
              </Button>
              
              <Button 
                onClick={() => {
                  exportAsAudio();
                  setExportOptionsOpen(false);
                }}
                className="flex flex-col items-center p-6 h-auto"
                variant="outline"
                disabled={!currentBoard?.audioRecording}
              >
                <Volume2 size={24} className="mb-2" />
                <span className="font-medium">Audio (WAV)</span>
                <span className="text-xs text-gray-500">
                  {currentBoard?.audioRecording ? 'Audio only' : 'No audio available'}
                </span>
              </Button>
              
              <Button 
                onClick={() => {
                  exportAsText();
                  setExportOptionsOpen(false);
                }}
                className="flex flex-col items-center p-6 h-auto"
                variant="outline"
              >
                <MessageSquare size={24} className="mb-2" />
                <span className="font-medium">Text (TXT)</span>
                <span className="text-xs text-gray-500">Title + Description</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Options Dialog */}
      <Dialog open={shareOptionsOpen} onOpenChange={setShareOptionsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Vision Board</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Choose your sharing format:
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  setShareOptionsOpen(false);
                  setShareDialogOpen(true);
                }}
                className="w-full flex items-center justify-between p-4 h-auto"
                variant="outline"
              >
                <div className="flex items-center">
                  <ImageIcon size={20} className="mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Image + Text</div>
                    <div className="text-xs text-gray-500">Share vision board image with description</div>
                  </div>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Recommended</span>
              </Button>
              
              <Button 
                onClick={() => {
                  setShareOptionsOpen(false);
                  setShareDialogOpen(true);
                }}
                className="w-full flex items-center justify-between p-4 h-auto"
                variant="outline"
                disabled={!currentBoard?.audioRecording}
              >
                <div className="flex items-center">
                  <Play size={20} className="mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Video + Audio</div>
                    <div className="text-xs text-gray-500">
                      {currentBoard?.audioRecording ? 'Share complete experience as video' : 'No audio available'}
                    </div>
                  </div>
                </div>
                {currentBoard?.audioRecording && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Premium</span>
                )}
              </Button>
              
              <Button 
                onClick={() => {
                  const shareText = `Dream Vision Board: "${currentBoard?.title}"\n\n${currentBoard?.description}\n\nCreated with DreamSpeak - Jungian Dream Decoder`;
                  navigator.clipboard.writeText(shareText);
                  alert('Vision board text copied to clipboard!');
                  setShareOptionsOpen(false);
                }}
                className="w-full flex items-center justify-between p-4 h-auto"
                variant="outline"
              >
                <div className="flex items-center">
                  <Copy size={20} className="mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Text Only</div>
                    <div className="text-xs text-gray-500">Copy title and description to clipboard</div>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Quick</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-r overflow-y-auto">
          <Tabs defaultValue="dreams" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dreams">Dreams</TabsTrigger>
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="elements">Elements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dreams" className="p-4 space-y-3">
              <h3 className="font-semibold">Your Dreams</h3>
              {dreams.map((dream) => (
                <Card key={dream.id} className="cursor-pointer">
                  <CardContent className="p-3">
                    <p className="text-sm mb-2">{dream.content.substring(0, 100)}...</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => playDreamText(dream.content)}
                        className="flex-1"
                      >
                        <Volume2 size={14} className="mr-1" />
                        {isPlaying ? 'Stop' : 'Listen'}
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => generateImageFromDream(dream)}
                        disabled={generateImage.isPending}
                      >
                        <Sparkles size={14} className="mr-1" />
                        Generate Vision
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="generate" className="p-4 space-y-3">
              <h3 className="font-semibold">AI Image Generation</h3>
              <Textarea
                value={generationPrompt}
                onChange={(e) => setGenerationPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="min-h-[100px]"
              />
              <Button 
                onClick={generateImageFromPrompt}
                disabled={generateImage.isPending || !generationPrompt.trim()}
                className="w-full"
              >
                {generateImage.isPending ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </TabsContent>
            
            <TabsContent value="elements" className="p-4 space-y-3">
              <h3 className="font-semibold">Add Elements</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => addItemToBoard({
                    type: 'text',
                    content: 'Dream Text',
                    position: { x: 100, y: 100 },
                    size: { width: 150, height: 40 },
                    rotation: 0,
                    zIndex: currentBoard.items.length + 1,
                    style: { fontSize: 16, color: '#000000' }
                  })}
                >
                  Add Text
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => addItemToBoard({
                    type: 'symbol',
                    content: '✦',
                    position: { x: 150, y: 150 },
                    size: { width: 50, height: 50 },
                    rotation: 0,
                    zIndex: currentBoard.items.length + 1,
                    style: { fontSize: 32, color: '#9333ea' }
                  })}
                >
                  Add Symbol
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas */}
        <div 
          className="flex-1 relative overflow-hidden"
          style={{ background: currentBoard.background }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {currentBoard.items.map((item) => (
            <div
              key={item.id}
              className={`absolute cursor-move ${
                selectedItem?.id === item.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              } ${item.type === 'image' ? 'shadow-lg' : 'border-2 border-transparent'}`}
              style={{
                left: item.position.x,
                top: item.position.y,
                width: item.size.width,
                height: item.size.height,
                transform: `rotate(${item.rotation}deg)`,
                zIndex: item.zIndex
              }}
              onMouseDown={(e) => handleMouseDown(e, item)}
            >
              {item.type === 'image' && item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.content}
                  className="w-full h-full object-cover rounded"
                  draggable={false}
                />
              )}
              
              {item.type === 'text' && (
                <div
                  className="w-full h-full flex items-center justify-center text-center p-2"
                  style={{
                    fontSize: item.style?.fontSize || 16,
                    color: item.style?.color || '#000000',
                    fontWeight: item.style?.fontWeight || 'normal',
                    backgroundColor: item.style?.backgroundColor || 'transparent',
                    borderRadius: item.style?.borderRadius || 0
                  }}
                >
                  {item.content}
                </div>
              )}
              
              {item.type === 'symbol' && (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    fontSize: item.style?.fontSize || 32,
                    color: item.style?.color || '#9333ea'
                  }}
                >
                  {item.content}
                </div>
              )}
              
              {selectedItem?.id === item.id && (
                <div className="absolute -top-8 right-0 flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0"
                    onClick={() => updateItem(item.id, { rotation: item.rotation + 15 })}
                  >
                    <RotateCw size={12} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0 text-red-600"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}