
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Mic, MicOff } from 'lucide-react';

interface AvatarProps {
  onUserDetected: () => void;
  isListening: boolean;
  onToggleListening: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ onUserDetected, isListening, onToggleListening }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const [isUserDetected, setIsUserDetected] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('idle');
  const detectionTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    startCamera();
    startUserDetection();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 },
        audio: false 
      });
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  };

  const startUserDetection = () => {
    const detectMotion = () => {
      if (!cameraRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const video = cameraRef.current;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0);
        
        // شبیه سازی تشخیص حضور کاربر
        const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const hasMotion = detectUserPresence(imageData);
          
          if (hasMotion && !isUserDetected) {
            setIsUserDetected(true);
            if (detectionTimeoutRef.current) {
              clearTimeout(detectionTimeoutRef.current);
            }
            
            detectionTimeoutRef.current = setTimeout(() => {
              setCurrentVideo('greeting');
              onUserDetected();
            }, 3000);
          } else if (!hasMotion && isUserDetected) {
            setIsUserDetected(false);
            setCurrentVideo('idle');
            if (detectionTimeoutRef.current) {
              clearTimeout(detectionTimeoutRef.current);
            }
          }
        }
      }

      setTimeout(detectMotion, 100);
    };

    detectMotion();
  };

  const detectUserPresence = (imageData: ImageData): boolean => {
    // شبیه سازی تشخیص حضور - در پیاده سازی واقعی باید از AI استفاده کرد
    const data = imageData.data;
    let totalBrightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    const avgBrightness = totalBrightness / (data.length / 4);
    return avgBrightness > 50; // threshold for detecting presence
  };

  const getVideoSource = () => {
    switch (currentVideo) {
      case 'greeting':
        return 'data:video/mp4;base64,'; // در پیاده سازی واقعی، URL ویدئوی آواتار
      case 'listening':
        return 'data:video/mp4;base64,'; // ویدئوی حالت گوش دادن
      default:
        return 'data:video/mp4;base64,'; // ویدئوی پیش فرض
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Card className="glass-effect p-6">
        <div className="relative">
          {/* آواتار اصلی */}
          <div className="relative w-80 h-80 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={getVideoSource()} type="video/mp4" />
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
            <div className={`px-4 py-2 rounded-full text-xs font-medium ${
              isUserDetected 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-600 text-gray-300'
            }`}>
              {isUserDetected ? 'کاربر شناسایی شد' : 'در حال انتظار...'}
            </div>
          </div>

          {/* نشانگر گوش دادن */}
          {isListening && (
            <div className="absolute top-4 right-4">
              <div className="pulse-animation bg-red-500 rounded-full p-2">
                <Mic className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* کنترل‌ها */}
        <div className="flex justify-center mt-6 space-x-4">
          <Button
            onClick={onToggleListening}
            variant={isListening ? "destructive" : "default"}
            size="lg"
            className="px-8"
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                توقف گفتگو
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                شروع گفتگو
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* دوربین مخفی برای تشخیص */}
      <div className="hidden">
        <video ref={cameraRef} autoPlay muted playsInline />
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Avatar;
