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
  Copy
} from 'lucide-react';
import { useDreams, useGenerateImage } from '@/hooks/use-dreams';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  const { data: dreams = [] } = useDreams();
  const generateImage = useGenerateImage();

  // Load boards from localStorage
  useEffect(() => {
    const savedBoards = localStorage.getItem('dreamVisionBoards');
    if (savedBoards) {
      const parsedBoards = JSON.parse(savedBoards).map((board: any) => ({
        ...board,
        createdAt: new Date(board.createdAt),
        updatedAt: new Date(board.updatedAt)
      }));
      setBoards(parsedBoards);
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

  // Voice playback for dream text
  const playDreamText = (dreamText: string) => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(dreamText);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
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

  // Export vision board as image
  const handleExport = async () => {
    if (!currentBoard) return;
    
    try {
      // Create a canvas to render the vision board
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        alert('Canvas not supported in this browser');
        return;
      }
      
      canvas.width = 1200;
      canvas.height = 800;
      
      // Fill background
      ctx.fillStyle = currentBoard.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add title
      ctx.fillStyle = '#000000';
      ctx.font = '24px Arial';
      ctx.fillText(currentBoard.title, 20, 40);
      
      // Convert to blob and download
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
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  // Share vision board
  const handleShare = () => {
    setShareDialogOpen(true);
  };

  // Send share via email/text
  const sendShare = (method: 'email' | 'sms') => {
    if (!currentBoard || !shareEmail.trim()) return;
    
    const shareText = `Check out my dream vision board: "${currentBoard.title}"\n\n${shareMessage || currentBoard.description}\n\nCreated with DreamSpeak - Jungian Dream Decoder`;
    
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
        addItemToBoard({
          type: 'image',
          content: `Dream: ${dream.title || 'Untitled'}`,
          imageUrl: result.imageUrl,
          position: { x: Math.random() * 300, y: Math.random() * 200 },
          size: { width: 200, height: 200 },
          rotation: 0,
          zIndex: currentBoard.items.length + 1
        });
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
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
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save size={16} className="mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 size={16} className="mr-1" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download size={16} className="mr-1" />
            Export
          </Button>
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
              className={`absolute cursor-move border-2 ${
                selectedItem?.id === item.id ? 'border-blue-500' : 'border-transparent'
              }`}
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