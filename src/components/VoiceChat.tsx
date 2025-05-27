
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Message, VoiceChatProps } from '@/types/voice-chat';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useBookingProcessor } from '@/hooks/useBookingProcessor';
import ChatMessage from './ChatMessage';

const VoiceChat: React.FC<VoiceChatProps> = ({ 
  isListening, 
  onToggleListening, 
  onBookingRequest 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'سلام! من دستیار هوش مصنوعی شما هستم. می‌توانم به شما در رزرو بلیط هواپیما کمک کنم. چطور می‌توانم کمکتان کنم؟',
      timestamp: new Date()
    }
  ]);
  
  const [isPlaying, setIsPlaying] = useState(true);

  const addMessage = (content: string, type: 'user' | 'assistant') => {
    const message: Message = {
      id: (Date.now() + Math.random()).toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const respondWithVoice = (text: string) => {
    setTimeout(() => {
      addMessage(text, 'assistant');
      speak(text);
    }, 1000);
  };

  const { waitingForInfo, handleSpecificInfo, processUserRequest } = useBookingProcessor({
    onRespond: respondWithVoice,
    onBookingComplete: onBookingRequest
  });

  const { speak } = useSpeechSynthesis(isPlaying);

  const handleUserSpeech = (speechText: string) => {
    console.log('User said:', speechText);
    addMessage(speechText, 'user');

    if (waitingForInfo) {
      handleSpecificInfo(speechText, waitingForInfo);
    } else {
      const response = processUserRequest(speechText);
      if (response) {
        respondWithVoice(response);
      }
    }
  };

  const handleSpeechError = (error: string) => {
    console.error('Speech recognition error:', error);
  };

  useSpeechRecognition({
    onResult: handleUserSpeech,
    onError: handleSpeechError,
    isListening
  });

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <Card className="glass-effect h-96 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold">گفتگو با دستیار</h3>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAudio}
            className="text-gray-400 hover:text-white"
          >
            {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            onClick={onToggleListening}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isListening && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">در حال گوش دادن...</span>
                </div>
              </div>
            </div>
          )}
          
          {waitingForInfo && (
            <div className="flex justify-start">
              <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm">منتظر پاسخ شما...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default VoiceChat;
