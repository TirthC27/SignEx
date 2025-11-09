'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Hand, HandMetal, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface SignLanguageDetectorProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  videoStream?: MediaStream | null;
}

const SignLanguageDetector = ({ isEnabled, onToggle, videoStream }: SignLanguageDetectorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [framesProcessed, setFramesProcessed] = useState(0);
  const [lastFrameTime, setLastFrameTime] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // FastAPI backend URL - adjust as needed
  const BACKEND_URL = 'http://localhost:8000'; // Change this to your FastAPI server

  useEffect(() => {
    if (videoStream && videoRef.current) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play();
    }
  }, [videoStream]);

  const captureFrame = useCallback(() => {
    if (!canvasRef.current || !videoRef.current || !isEnabled) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return null;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.8);
    });
  }, [isEnabled]);

  const sendFrameToBackend = useCallback(async (frameBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('frame', frameBlob, 'frame.jpg');
      formData.append('timestamp', new Date().toISOString());

      const response = await fetch(`${BACKEND_URL}/process_frame`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Frame processed:', result);
        setConnectionStatus('connected');
        return result;
      } else {
        console.error('Backend error:', response.status);
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Failed to send frame:', error);
      setConnectionStatus('disconnected');
    }
  }, [BACKEND_URL]);

  const processFrame = useCallback(async () => {
    if (!isEnabled || isProcessing) return;

    setIsProcessing(true);
    try {
      const frameBlob = await captureFrame();
      if (frameBlob) {
        await sendFrameToBackend(frameBlob);
        setFramesProcessed(prev => prev + 1);
        setLastFrameTime(new Date());
      }
    } catch (error) {
      console.error('Frame processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isEnabled, isProcessing, captureFrame, sendFrameToBackend]);

  useEffect(() => {
    if (isEnabled && videoStream) {
      setConnectionStatus('connecting');
      setFramesProcessed(0);
      
      // Start frame capture at 10 FPS (100ms interval)
      intervalRef.current = setInterval(processFrame, 100);
      
      console.log('🎥 Sign Language Detection Started');
    } else {
      // Stop frame capture
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setConnectionStatus('disconnected');
      setIsProcessing(false);
      console.log('🛑 Sign Language Detection Stopped');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isEnabled, videoStream, processFrame]);

  if (!isEnabled) return null;

  return (
    <div className="fixed top-20 right-4 z-40 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 p-4 min-w-[280px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <HandMetal className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Sign Language</h3>
              <p className="text-xs text-gray-600">Real-time detection</p>
            </div>
          </div>
          
          <Button
            onClick={() => onToggle(false)}
            variant="outline"
            size="sm"
            className="p-2"
          >
            ×
          </Button>
        </div>

        {/* Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' && (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">Connected</span>
                </>
              )}
              {connectionStatus === 'connecting' && (
                <>
                  <Loader2 className="w-3 h-3 text-yellow-500 animate-spin" />
                  <span className="text-sm text-yellow-600 font-medium">Connecting</span>
                </>
              )}
              {connectionStatus === 'disconnected' && (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-600 font-medium">Disconnected</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Frames:</span>
            <span className="text-sm text-gray-800 font-medium">{framesProcessed}</span>
          </div>

          {lastFrameTime && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last frame:</span>
              <span className="text-xs text-gray-500">
                {lastFrameTime.toLocaleTimeString()}
              </span>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Processing frame...</span>
            </div>
          )}
        </div>

        {/* Debug Frame Display */}
        <div className="mt-4">
          <canvas
            ref={canvasRef}
            className="w-full h-20 bg-gray-100 rounded-lg object-cover"
            style={{ display: framesProcessed > 0 ? 'block' : 'none' }}
          />
          {framesProcessed === 0 && (
            <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-500">Waiting for frames...</span>
            </div>
          )}
        </div>

        {/* Backend Info */}
        <div className="mt-3 p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            Backend: <code className="bg-gray-200 px-1 rounded">{BACKEND_URL}</code>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Capturing at 10 FPS • JPEG format
          </p>
        </div>
      </div>

      {/* Hidden video element for frame capture */}
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        muted
        playsInline
        autoPlay
      />
    </div>
  );
};

export default SignLanguageDetector;
