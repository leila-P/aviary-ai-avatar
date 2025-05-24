import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VoiceChatProps {
  isListening: boolean;
  onToggleListening: () => void;
  onBookingRequest: () => void;
}

interface BookingRequirements {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: string;
  passengerName: string;
}

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
  const [bookingInfo, setBookingInfo] = useState<Partial<BookingRequirements>>({});
  const [waitingForInfo, setWaitingForInfo] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // بررسی پشتیبانی از Speech Recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fa-IR';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          handleUserSpeech(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.start();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const handleUserSpeech = (speechText: string) => {
    console.log('User said:', speechText);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: speechText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // اگر منتظر اطلاعات خاصی هستیم
    if (waitingForInfo) {
      handleSpecificInfo(speechText, waitingForInfo);
    } else {
      processUserRequest(speechText);
    }
  };

  const handleSpecificInfo = (speechText: string, infoType: string) => {
    const lowerInput = speechText.toLowerCase();
    
    switch (infoType) {
      case 'origin':
        if (detectCity(lowerInput)) {
          setBookingInfo(prev => ({ ...prev, origin: speechText }));
          setWaitingForInfo(null);
          askForNextRequiredInfo();
        } else {
          askAgainForInfo('origin', 'لطفاً نام شهر مبدأ را واضح‌تر بگویید. مثل تهران، اصفهان، شیراز');
        }
        break;
      case 'destination':
        if (detectCity(lowerInput)) {
          setBookingInfo(prev => ({ ...prev, destination: speechText }));
          setWaitingForInfo(null);
          askForNextRequiredInfo();
        } else {
          askAgainForInfo('destination', 'لطفاً نام شهر مقصد را واضح‌تر بگویید.');
        }
        break;
      case 'departureDate':
        if (detectDate(lowerInput)) {
          setBookingInfo(prev => ({ ...prev, departureDate: speechText }));
          setWaitingForInfo(null);
          askForNextRequiredInfo();
        } else {
          askAgainForInfo('departureDate', 'لطفاً تاریخ پرواز را مشخص کنید. مثل فردا، دوشنبه، یا ۱۵ آذر');
        }
        break;
      case 'passengers':
        if (detectPassengerCount(lowerInput)) {
          setBookingInfo(prev => ({ ...prev, passengers: speechText }));
          setWaitingForInfo(null);
          askForNextRequiredInfo();
        } else {
          askAgainForInfo('passengers', 'لطفاً تعداد مسافران را مشخص کنید. مثل یک نفر، دو نفر');
        }
        break;
      case 'passengerName':
        setBookingInfo(prev => ({ ...prev, passengerName: speechText }));
        setWaitingForInfo(null);
        completeBookingProcess();
        break;
    }
  };

  const detectCity = (text: string): boolean => {
    const cities = ['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'اهواز', 'کرج', 'قم'];
    return cities.some(city => text.includes(city));
  };

  const detectDate = (text: string): boolean => {
    const dateKeywords = ['فردا', 'امروز', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه', 'یکشنبه', 'آذر', 'دی', 'بهمن'];
    return dateKeywords.some(keyword => text.includes(keyword)) || /\d+/.test(text);
  };

  const detectPassengerCount = (text: string): boolean => {
    const countKeywords = ['یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'نفر', '۱', '۲', '۳', '۴', '۵', '۶'];
    return countKeywords.some(keyword => text.includes(keyword)) || /\d+/.test(text);
  };

  const askForNextRequiredInfo = () => {
    const requiredFields = [
      { key: 'origin', question: 'از کدام شهر می‌خواهید سفر کنید؟' },
      { key: 'destination', question: 'به کدام شهر می‌خواهید سفر کنید؟' },
      { key: 'departureDate', question: 'تاریخ پرواز چه روزی باشد؟' },
      { key: 'passengers', question: 'چند نفر قرار است سفر کنید؟' },
      { key: 'passengerName', question: 'نام مسافر چیست؟' }
    ];

    for (const field of requiredFields) {
      if (!bookingInfo[field.key as keyof BookingRequirements]) {
        setWaitingForInfo(field.key);
        respondWithVoice(field.question);
        return;
      }
    }

    completeBookingProcess();
  };

  const askAgainForInfo = (infoType: string, message: string) => {
    setWaitingForInfo(infoType);
    respondWithVoice(message);
  };

  const completeBookingProcess = () => {
    const summary = `عالی! اطلاعات شما کامل شد:
    مبدأ: ${bookingInfo.origin}
    مقصد: ${bookingInfo.destination}
    تاریخ: ${bookingInfo.departureDate}
    تعداد مسافر: ${bookingInfo.passengers}
    نام مسافر: ${bookingInfo.passengerName}
    
    اکنون فرم رزرو را برایتان باز می‌کنم.`;

    respondWithVoice(summary);
    
    setTimeout(() => {
      onBookingRequest();
    }, 3000);
  };

  const processUserRequest = (userInput: string) => {
    let response = '';
    
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('بلیط') || lowerInput.includes('رزرو') || lowerInput.includes('پرواز')) {
      response = 'عالی! می‌خواهید بلیط هواپیما رزرو کنید. برای شروع، ';
      setBookingInfo({});
      setTimeout(() => {
        askForNextRequiredInfo();
      }, 1500);
    } else if (lowerInput.includes('سلام') || lowerInput.includes('درود')) {
      response = 'سلام و درود! خوش آمدید. چطور می‌توانم به شما کمک کنم؟ آیا می‌خواهید بلیط هواپیما رزرو کنید؟';
    } else if (lowerInput.includes('کمک')) {
      response = 'البته! من می‌توانم به شما در رزرو بلیط هواپیما کمک کنم. برای شروع نیاز دارم که اطلاعات پرواز شما را بدانم. آیا آماده‌اید؟';
    } else {
      response = 'متوجه نشدم. می‌توانید سوال خود را واضح‌تر بپرسید؟ یا اگر می‌خواهید بلیط رزرو کنید، همین الان شروع کنیم.';
    }

    if (response) {
      respondWithVoice(response);
    }
  };

  const respondWithVoice = (text: string) => {
    const assistantMessage: Message = {
      id: (Date.now() + Math.random()).toString(),
      type: 'assistant',
      content: text,
      timestamp: new Date()
    };

    setTimeout(() => {
      setMessages(prev => [...prev, assistantMessage]);
      speakResponse(text);
    }, 1000);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fa-IR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      synthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

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
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
                dir="rtl"
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString('fa-IR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
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
