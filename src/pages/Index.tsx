
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
  const [conversationStarted, setConversationStarted] = useState(false);

  const handleUserDetected = () => {
    setUserDetected(true);
    setConversationStarted(true);
    toast({
      title: "خوش آمدید!",
      description: "آیا می‌خواهید بلیط هواپیما رزرو کنید؟",
      duration: 5000,
    });
  };

  const handleToggleListening = () => {
    setIsListening(!isListening);
    if (!conversationStarted) {
      setConversationStarted(true);
    }
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

      <div className="relative z-10">
        {!showBookingForm ? (
          <>
            {!conversationStarted ? (
              // ویدئوی معرفی تمام عرض
              <div className="w-full h-screen relative">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  {/* استفاده از ویدئوی نمونه - در پیاده سازی واقعی URL ویدئوی شما را قرار دهید */}
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                  {/* Fallback content */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-cyan-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-white/20 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/40"></div>
                      </div>
                      <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        دستیار هوش مصنوعی پرواز
                      </h1>
                      <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        با استفاده از آواتار هوش مصنوعی، راحت‌ترین روش رزرو بلیط هواپیما را تجربه کنید
                      </p>
                    </div>
                  </div>
                </video>
                
                {/* دکمه شروع گفتگو */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                  <Button
                    onClick={handleToggleListening}
                    className="bg-blue-600 hover:bg-blue-700 px-12 py-4 text-lg font-semibold shadow-2xl"
                    size="lg"
                  >
                    شروع گفتگو
                  </Button>
                </div>

                {/* آواتار مخفی برای تشخیص کاربر */}
                <div className="absolute top-0 left-0 opacity-0 pointer-events-none">
                  <Avatar
                    onUserDetected={handleUserDetected}
                    isListening={isListening}
                    onToggleListening={handleToggleListening}
                  />
                </div>
              </div>
            ) : (
              // حالت گفتگو
              <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-7xl mx-auto">
                  {/* آواتار با ویدئوی گفتگو */}
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-md mx-auto">
                      <Card className="glass-effect p-6">
                        <div className="relative">
                          {/* ویدئوی گفتگو */}
                          <div className="relative w-80 h-80 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                              <video
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                              >
                                {/* ویدئوی گفتگو */}
                                <source src="data:video/mp4;base64," type="video/mp4" />
                                {/* Fallback avatar */}
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/40"></div>
                                  </div>
                                </div>
                              </video>
                            </div>
                          </div>

                          {/* وضعیت آواتار */}
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                            <div className="px-4 py-2 rounded-full text-xs font-medium bg-green-500 text-white">
                              آماده گفتگو
                            </div>
                          </div>

                          {/* نشانگر گوش دادن */}
                          {isListening && (
                            <div className="absolute top-4 right-4">
                              <div className="pulse-animation bg-red-500 rounded-full p-2">
                                <div className="w-4 h-4 bg-white rounded-full"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* چت */}
                  <div className="space-y-6">
                    <VoiceChat
                      isListening={isListening}
                      onToggleListening={handleToggleListening}
                      onBookingRequest={handleBookingRequest}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="container mx-auto px-4 py-8">
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
          </div>
        )}
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
