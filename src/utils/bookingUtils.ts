
import { BookingRequirements, BookingField } from '@/types/voice-chat';

export const detectCity = (text: string): boolean => {
  const cities = ['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'اهواز', 'کرج', 'قم'];
  return cities.some(city => text.includes(city));
};

export const detectDate = (text: string): boolean => {
  const dateKeywords = ['فردا', 'امروز', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه', 'یکشنبه', 'آذر', 'دی', 'بهمن'];
  return dateKeywords.some(keyword => text.includes(keyword)) || /\d+/.test(text);
};

export const detectPassengerCount = (text: string): boolean => {
  const countKeywords = ['یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'نفر', '۱', '۲', '۳', '۴', '۵', '۶'];
  return countKeywords.some(keyword => text.includes(keyword)) || /\d+/.test(text);
};

export const getBookingFields = (): BookingField[] => [
  { key: 'origin', question: 'از کدام شهر می‌خواهید سفر کنید؟' },
  { key: 'destination', question: 'به کدام شهر می‌خواهید سفر کنید؟' },
  { key: 'departureDate', question: 'تاریخ پرواز چه روزی باشد؟' },
  { key: 'passengers', question: 'چند نفر قرار است سفر کنید؟' },
  { key: 'passengerName', question: 'نام مسافر چیست؟' }
];

export const findNextRequiredField = (bookingInfo: Partial<BookingRequirements>): BookingField | null => {
  const fields = getBookingFields();
  
  for (const field of fields) {
    if (!bookingInfo[field.key]) {
      return field;
    }
  }
  
  return null;
};

export const createBookingSummary = (bookingInfo: Partial<BookingRequirements>): string => {
  return `عالی! اطلاعات شما کامل شد:
    مبدأ: ${bookingInfo.origin}
    مقصد: ${bookingInfo.destination}
    تاریخ: ${bookingInfo.departureDate}
    تعداد مسافر: ${bookingInfo.passengers}
    نام مسافر: ${bookingInfo.passengerName}
    
    اکنون فرم رزرو را برایتان باز می‌کنم.`;
};
