import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Send, Brain, User, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useChatMessages, useAnalyzeDream, useSendMessage, useGenerateImage } from '@/hooks/use-dreams';
import { VoiceRecorder } from './voice-recorder';
import type { ChatMessage } from '@shared/schema';

export function ChatInterface() {
  const [inputValue, setInputValue] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useChatMessages();
  const analyzeDream = useAnalyzeDream();
  const sendMessage = useSendMessage();
  const generateImage = useGenerateImage();

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    setInputValue('');
    setIsTyping(true);

    try {
      // Send user message
      await sendMessage.mutateAsync({
        role: 'user',
        content,
        messageType: 'text'
      });

      // Analyze the dream
      const result = await analyzeDream.mutateAsync(content);
      
      // Generate image after analysis
      if (result.dream?.id) {
        setTimeout(() => {
          generateImage.mutate(result.dream.id);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleVoiceComplete = (transcript: string) => {
    setIsVoiceRecording(false);
    if (transcript.trim()) {
      handleSendMessage(transcript);
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
    <div className="flex flex-col h-full">
      {/* Welcome Message */}
      {messages.length === 0 && !isLoading && (
        <div className="flex justify-center mb-6 p-4">
          <Card className="p-4 max-w-xs text-center border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-gray-600 mb-2">Welcome to your dream sanctuary</p>
            <p className="text-xs text-gray-500">Share your dreams and discover their deeper meanings through Jungian analysis</p>
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
        {(isTyping || analyzeDream.isPending || generateImage.isPending) && (
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

      {/* Chat Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <Button
            type="button"
            onClick={() => setIsVoiceRecording(true)}
            className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <Mic className="w-5 h-5 text-white" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Describe your dream..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="py-3 px-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-transparent"
              disabled={analyzeDream.isPending}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || analyzeDream.isPending}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 h-auto bg-transparent hover:bg-transparent text-primary"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Speak or type your dreams • All conversations are private
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
