import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Play, Square, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SpeechToVideo = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

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
          setTranscribedText(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "خطا در تشخیص گفتار",
          description: "لطفاً دوباره تلاش کنید",
          variant: "destructive"
        });
        setIsListening(false);
      };

      recognitionRef.current.addEventListener('end', () => {
        setIsListening(false);
      });
    } else {
      toast({
        title: "عدم پشتیبانی",
        description: "مرورگر شما از تشخیص گفتار پشتیبانی نمی‌کند",
        variant: "destructive"
      });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const generateVideo = async () => {
    if (!transcribedText.trim()) {
      toast({
        title: "متن خالی",
        description: "لطفاً ابتدا متنی را ضبط کنید یا وارد کنید",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingVideo(true);
    
    try {
      // این قسمت نیاز به API Key دارد که باید از کاربر دریافت شود
      // در حال حاضر یک شبیه‌سازی انجام می‌دهیم
      
      // شبیه‌سازی فراخوانی HeyGen API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // URL نمونه برای ویدئو (در پیاده‌سازی واقعی از HeyGen API دریافت می‌شود)
      const mockVideoUrl = "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4";
      setVideoUrl(mockVideoUrl);
      
      toast({
        title: "ویدئو آماده شد",
        description: "ویدئو با موفقیت تولید شد",
      });
    } catch (error) {
      console.error('Error generating video:', error);
      toast({
        title: "خطا در تولید ویدئو",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const playVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const clearText = () => {
    setTranscribedText('');
    setVideoUrl(null);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* هدر */}
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-2">تبدیل گفتار به ویدئو</h1>
          <p className="text-lg opacity-80">سوال خود را بگویید و آن را به ویدئو تبدیل کنید</p>
        </div>

        {/* کارت ضبط صدا و متن */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-center text-white">ضبط و ویرایش متن</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* دکمه‌های کنترل */}
            <div className="flex justify-center space-x-4 space-x-reverse">
              <Button
                onClick={toggleListening}
                variant={isListening ? "destructive" : "default"}
                size="lg"
                className="flex items-center space-x-2 space-x-reverse"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span>{isListening ? 'توقف ضبط' : 'شروع ضبط'}</span>
              </Button>
              
              <Button
                onClick={clearText}
                variant="outline"
                size="lg"
              >
                پاک کردن
              </Button>
            </div>

            {/* نمایش وضعیت ضبط */}
            {isListening && (
              <div className="flex justify-center">
                <div className="flex items-center space-x-2 space-x-reverse text-red-400">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span>در حال ضبط...</span>
                </div>
              </div>
            )}

            {/* متن ضبط شده */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                متن ضبط شده / ویرایش متن:
              </label>
              <Textarea
                value={transcribedText}
                onChange={(e) => setTranscribedText(e.target.value)}
                placeholder="متن شما اینجا نمایش داده می‌شود..."
                className="min-h-32 bg-gray-800 border-gray-600 text-white"
                dir="rtl"
              />
            </div>

            {/* دکمه تولید ویدئو */}
            <div className="flex justify-center">
              <Button
                onClick={generateVideo}
                disabled={isGeneratingVideo || !transcribedText.trim()}
                size="lg"
                className="flex items-center space-x-2 space-x-reverse"
              >
                {isGeneratingVideo ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>در حال تولید ویدئو...</span>
                  </>
                ) : (
                  <span>تولید ویدئو</span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* کارت نمایش ویدئو */}
        {videoUrl && (
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-center text-white">ویدئو تولید شده</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-64 object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  controls
                />
              </div>
              
              <div className="flex justify-center">
                <Button
                  onClick={playVideo}
                  size="lg"
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  {isPlaying ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span>{isPlaying ? 'توقف' : 'پخش'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* راهنمای استفاده */}
        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="text-white space-y-2">
              <h3 className="font-semibold mb-2">راهنمای استفاده:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm opacity-80" dir="rtl">
                <li>روی دکمه "شروع ضبط" کلیک کنید</li>
                <li>سوال یا متن خود را بگویید</li>
                <li>روی "توقف ضبط" کلیک کنید</li>
                <li>در صورت نیاز متن را ویرایش کنید</li>
                <li>روی "تولید ویدئو" کلیک کنید</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpeechToVideo;
