
import React, { useState } from 'react';
import Avatar from '@/components/Avatar';
import VoiceChat from '@/components/VoiceChat';
import BookingForm from '@/components/BookingForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [userDetected, setUserDetected] = useState(false);

  const handleUserDetected = () => {
    setUserDetected(true);
    toast({
      title: "خوش آمدید!",
      description: "آیا می‌خواهید بلیط هواپیما رزرو کنید؟",
      duration: 5000,
    });
  };

  const handleToggleListening = () => {
    setIsListening(!isListening);
  };

  const handleBookingRequest = () => {
    setShowBookingForm(true);
    setIsListening(false);
  };

  const handleBookingSubmit = (bookingData: any) => {
    console.log('Booking submitted:', bookingData);
    
    // شبیه سازی ارسال به بک‌اند
    toast({
      title: "رزرو موفق!",
      description: "درخواست رزرو شما با موفقیت ثبت شد. کد رهگیری: FL" + Math.random().toString(36).substring(7).toUpperCase(),
      duration: 8000,
    });
    
    setShowBookingForm(false);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* الپترال‌های شناور */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="floating-orb absolute top-40 right-32 w-24 h-24 bg-purple-500/20 rounded-full blur-xl" style={{ animationDelay: '-2s' }}></div>
        <div className="floating-orb absolute bottom-32 left-1/3 w-40 h-40 bg-cyan-500/20 rounded-full blur-xl" style={{ animationDelay: '-4s' }}></div>
        <div className="floating-orb absolute bottom-20 right-20 w-28 h-28 bg-pink-500/20 rounded-full blur-xl" style={{ animationDelay: '-1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* هدر */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
            دستیار هوش مصنوعی پرواز
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            با استفاده از آواتار هوش مصنوعی، راحت‌ترین روش رزرو بلیط هواپیما را تجربه کنید
          </p>
        </header>

        {/* محتوای اصلی */}
        <div className="max-w-7xl mx-auto">
          {!showBookingForm ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* آواتار */}
              <div className="flex justify-center">
                <Avatar
                  onUserDetected={handleUserDetected}
                  isListening={isListening}
                  onToggleListening={handleToggleListening}
                />
              </div>

              {/* چت */}
              <div className="space-y-6">
                <VoiceChat
                  isListening={isListening}
                  onToggleListening={handleToggleListening}
                  onBookingRequest={handleBookingRequest}
                />

                {/* اطلاعات اضافی */}
                <Card className="glass-effect p-6">
                  <h3 className="text-lg font-semibold mb-4 text-blue-400">
                    قابلیت‌های دستیار هوش مصنوعی
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      گفتگوی صوتی طبیعی به زبان فارسی
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      تشخیص خودکار حضور کاربر
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      راهنمایی کامل در فرآیند رزرو
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      مقایسه قیمت‌ها و پیشنهاد بهترین گزینه‌ها
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      پشتیبانی ۲۴ ساعته
                    </li>
                  </ul>
                </Card>

                {userDetected && !isListening && (
                  <Card className="glass-effect p-6 border border-blue-500/50">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2 text-blue-400">
                        آماده شروع هستید؟
                      </h3>
                      <p className="text-gray-300 mb-4">
                        برای شروع گفتگو با دستیار هوش مصنوعی، روی دکمه زیر کلیک کنید
                      </p>
                      <Button
                        onClick={handleToggleListening}
                        className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                        size="lg"
                      >
                        شروع گفتگو
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <BookingForm
                onBookingSubmit={handleBookingSubmit}
                isVisible={showBookingForm}
              />
              
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowBookingForm(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  بازگشت به دستیار
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* فوتر */}
      <footer className="relative z-10 border-t border-gray-800 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; ۲۰۲۴ دستیار هوش مصنوعی پرواز. تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
