import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Send, Brain, User, Sparkles, Image as ImageIcon, Wand2 } from 'lucide-react';
import { useChatMessages, useAnalyzeDream, useSendMessage, useGenerateImage } from '@/hooks/use-dreams';
import { VoiceRecorder } from './voice-recorder';
import { Textarea } from '@/components/ui/textarea';
import type { ChatMessage } from '@shared/schema';

export function ChatInterface() {
  const [inputValue, setInputValue] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [dreamText, setDreamText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useChatMessages();
  const analyzeDream = useAnalyzeDream();
  const generateImage = useGenerateImage();

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAddText = (content: string) => {
    if (!content.trim()) return;
    
    setInputValue('');
    setDreamText(prev => (prev + ' ' + content).trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddText(inputValue);
  };

  const handleVoiceComplete = (transcript: string) => {
    setIsVoiceRecording(false);
    if (transcript.trim()) {
      handleAddText(transcript);
    }
  };

  const handleDecodeDream = async () => {
    if (!dreamText.trim()) return;

    setIsDecoding(true);
    try {
      // Analyze the complete dream text
      const result = await analyzeDream.mutateAsync(dreamText);
      
      // Generate image after analysis
      if (result.dream?.id) {
        setTimeout(() => {
          generateImage.mutate(result.dream.id);
        }, 2000);
      }

      // Clear the dream text after analysis
      setDreamText('');
    } catch (error) {
      console.error('Failed to decode dream:', error);
    } finally {
      setIsDecoding(false);
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    const isAnalysis = message.messageType === 'analysis';
    const isImage = message.messageType === 'image';

    return (
      <div key={message.id} className={`flex items-start space-x-3 ${isUser ? 'justify-end' : ''}`}>
        {!isUser && (
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
        )}
        
        <div className={`max-w-xs ${isUser ? 'order-first' : ''}`}>
          <div className={`rounded-2xl shadow-sm p-4 ${
            isUser 
              ? 'bg-gradient-to-r from-primary to-primary-dark text-white rounded-tr-sm' 
              : 'bg-white rounded-tl-sm'
          }`}>
            {isAnalysis && message.metadata && (
              <div className="mb-3">
                <h4 className="font-medium text-gray-800 mb-2 font-serif">Jungian Analysis</h4>
                <p className="text-sm text-gray-700 mb-3">{message.content}</p>
                
                {message.metadata.archetypes && message.metadata.archetypes.length > 0 && (
                  <div className="bg-purple-50 rounded-lg p-3 mb-3">
                    <h5 className="text-xs font-medium text-primary mb-2">Key Archetypes Detected:</h5>
                    <div className="flex flex-wrap gap-1">
                      {message.metadata.archetypes.map((archetype: string) => (
                        <Badge key={archetype} variant="default" className="text-xs">
                          {archetype}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {isImage && message.metadata?.imageUrl ? (
              <div>
                <p className="text-sm text-gray-700 mb-3">{message.content}</p>
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl overflow-hidden relative">
                  <img 
                    src={message.metadata.imageUrl} 
                    alt="Dream visualization" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">AI-generated dream visualization</p>
              </div>
            ) : !isAnalysis ? (
              <p className="text-sm">{message.content}</p>
            ) : null}
            
            <p className={`text-xs mt-2 ${isUser ? 'text-purple-200' : 'text-gray-400'}`}>
              {isUser ? 'You' : 'Jung AI'} • {new Date(message.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>

        {isUser && (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-50/30 to-blue-50/30">
      {/* Welcome Message */}
      {messages.length === 0 && !isLoading && (
        <div className="flex justify-center mb-6 p-6">
          <Card className="p-6 max-w-xs text-center border border-purple-200 bg-gradient-to-br from-white to-purple-50 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl shadow-purple-500/30 animate-float">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-gray-800 mb-2">Welcome to your dream sanctuary</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Share your dreams and discover their deeper meanings through Jungian analysis</p>
          </Card>
        </div>
      )}

      {/* Dream Text Area */}
      {dreamText && (
        <div className="mx-4 mb-4">
          <Card className="p-5 bg-gradient-to-br from-purple-100/80 via-blue-50/80 to-indigo-100/80 border border-purple-300 shadow-lg backdrop-blur-sm">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-serif font-semibold text-gray-800 text-base">Your Dream Entry</h4>
              <Button 
                onClick={handleDecodeDream}
                disabled={!dreamText.trim() || isDecoding}
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white font-medium px-6 py-3 shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
                size="sm"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                {isDecoding ? 'Decoding...' : 'Decode My Dream'}
              </Button>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 max-h-40 overflow-y-auto border border-purple-200 shadow-inner">
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{dreamText}</p>
            </div>
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-purple-600 font-medium">{dreamText.length} characters</p>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {isLoading ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : (
          messages.map(renderMessage)
        )}

        {/* Typing Indicator */}
        {(isDecoding || generateImage.isPending) && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm p-4">
              <div className="flex space-x-1 mb-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-xs text-gray-400">
                {generateImage.isPending ? 'Creating dream visualization...' : 'Analyzing dream symbols...'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Input Area */}
      <div className="sticky bottom-0 bg-gradient-to-t from-white via-purple-50/50 to-transparent border-t border-purple-200 p-4 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <Button
            type="button"
            onClick={() => setIsVoiceRecording(true)}
            className="w-14 h-14 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/30 active:scale-95 transition-all duration-300 border-2 border-white/20"
          >
            <Mic className="w-6 h-6 text-white drop-shadow-sm" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Add to your dream story..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="py-4 px-5 border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-500 font-medium shadow-sm"
              disabled={isDecoding}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isDecoding}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 h-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-xl shadow-lg transition-all duration-200"
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </div>
        </form>
        
        <p className="text-sm text-purple-600 mt-3 text-center font-medium">
          ✨ Speak or type to build your dream • Press "Decode My Dream" when ready
        </p>
      </div>

      <VoiceRecorder
        open={isVoiceRecording}
        onClose={() => setIsVoiceRecording(false)}
        onTranscriptionComplete={handleVoiceComplete}
      />
    </div>
  );
}