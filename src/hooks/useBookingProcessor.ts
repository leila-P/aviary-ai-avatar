
import { useState, useCallback } from 'react';
import { BookingRequirements } from '@/types/voice-chat';
import { 
  detectCity, 
  detectDate, 
  detectPassengerCount, 
  findNextRequiredField,
  createBookingSummary 
} from '@/utils/bookingUtils';

interface UseBookingProcessorProps {
  onRespond: (message: string) => void;
  onBookingComplete: () => void;
}

export const useBookingProcessor = ({ onRespond, onBookingComplete }: UseBookingProcessorProps) => {
  const [bookingInfo, setBookingInfo] = useState<Partial<BookingRequirements>>({});
  const [waitingForInfo, setWaitingForInfo] = useState<string | null>(null);

  const handleSpecificInfo = useCallback((speechText: string, infoType: string) => {
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
  }, [bookingInfo]);

  const askForNextRequiredInfo = useCallback(() => {
    const nextField = findNextRequiredField(bookingInfo);
    
    if (nextField) {
      setWaitingForInfo(nextField.key);
      onRespond(nextField.question);
    } else {
      completeBookingProcess();
    }
  }, [bookingInfo, onRespond]);

  const askAgainForInfo = useCallback((infoType: string, message: string) => {
    setWaitingForInfo(infoType);
    onRespond(message);
  }, [onRespond]);

  const completeBookingProcess = useCallback(() => {
    const summary = createBookingSummary(bookingInfo);
    onRespond(summary);
    
    setTimeout(() => {
      onBookingComplete();
    }, 3000);
  }, [bookingInfo, onRespond, onBookingComplete]);

  const processUserRequest = useCallback((userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('بلیط') || lowerInput.includes('رزرو') || lowerInput.includes('پرواز')) {
      setBookingInfo({});
      setTimeout(() => {
        askForNextRequiredInfo();
      }, 1500);
      return 'عالی! می‌خواهید بلیط هواپیما رزرو کنید. برای شروع، ';
    } else if (lowerInput.includes('سلام') || lowerInput.includes('درود')) {
      return 'سلام و درود! خوش آمدید. چطور می‌توانم به شما کمک کنم؟ آیا می‌خواهید بلیط هواپیما رزرو کنید؟';
    } else if (lowerInput.includes('کمک')) {
      return 'البته! من می‌توانم به شما در رزرو بلیط هواپیما کمک کنم. برای شروع نیاز دارم که اطلاعات پرواز شما را بدانم. آیا آماده‌اید؟';
    } else {
      return 'متوجه نشدم. می‌توانید سوال خود را واضح‌تر بپرسید؟ یا اگر می‌خواهید بلیط رزرو کنید، همین الان شروع کنیم.';
    }
  }, [askForNextRequiredInfo]);

  return {
    bookingInfo,
    waitingForInfo,
    handleSpecificInfo,
    processUserRequest,
    askForNextRequiredInfo
  };
};
