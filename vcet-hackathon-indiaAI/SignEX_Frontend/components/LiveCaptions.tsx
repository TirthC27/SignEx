'use client';

import { useState, useEffect, useRef } from 'react';
import { Captions, Volume2, VolumeX, Settings, X } from 'lucide-react';
import { Button } from './ui/button';
import { requestMicrophonePermission, isSpeechRecognitionSupported, getBrowserSpeechRecognition } from '@/utils/permissions';

interface CaptionLine {
  id: string;
  text: string;
  timestamp: number;
  speaker?: string;
  confidence?: number;
}

interface LiveCaptionsProps {
  isEnabled: boolean;
  onToggle: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const LiveCaptions = ({ isEnabled, onToggle }: LiveCaptionsProps) => {
  const [captions, setCaptions] = useState<CaptionLine[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showBackground, setShowBackground] = useState(true);
  const [currentText, setCurrentText] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const captionsContainerRef = useRef<HTMLDivElement>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initializeSpeechRecognition = async () => {
      if (!isEnabled) return;

      // Check for speech recognition support
      if (!isSpeechRecognitionSupported()) {
        const errorMsg = 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari for live captions.';
        console.warn(errorMsg);
        setError(errorMsg);
        setCaptions([{
          id: '1',
          text: errorMsg,
          timestamp: Date.now(),
          speaker: 'System'
        }]);
        return;
      }

      // Request microphone permission first
      const permissionResult = await requestMicrophonePermission();
      if (!permissionResult.granted) {
        const errorMsg = permissionResult.error || 'Microphone access is required for live captions';
        setError(errorMsg);
        setCaptions([{
          id: Date.now().toString(),
          text: errorMsg,
          timestamp: Date.now(),
          speaker: 'System'
        }]);
        return;
      }

      // Stop the permission stream as we'll use recognition's own audio
      if (permissionResult.stream) {
        permissionResult.stream.getTracks().forEach(track => track.stop());
      }

      try {
        const SpeechRecognition = getBrowserSpeechRecognition();
        
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setError(null);
          console.log('Speech recognition started');
        };

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence || 0.5;

            if (event.results[i].isFinal) {
              if (transcript.trim()) {
                const newCaption: CaptionLine = {
                  id: Date.now().toString(),
                  text: transcript.trim(),
                  timestamp: Date.now(),
                  speaker: 'Speaker',
                  confidence: confidence
                };

                setCaptions(prev => {
                  const updated = [...prev, newCaption];
                  return updated.slice(-10); // Keep only last 10 captions
                });
              }
              setCurrentText('');
            } else {
              interimTranscript += transcript;
              setCurrentText(interimTranscript);
            }
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          // Handle specific errors
          switch (event.error) {
            case 'not-allowed':
              setCaptions(prev => [...prev, {
                id: Date.now().toString(),
                text: 'Microphone access denied. Please allow microphone permissions and try again.',
                timestamp: Date.now(),
                speaker: 'System'
              }]);
              break;
            case 'network':
              setCaptions(prev => [...prev, {
                id: Date.now().toString(),
                text: 'Network error. Please check your internet connection.',
                timestamp: Date.now(),
                speaker: 'System'
              }]);
              break;
            case 'no-speech':
              // Auto-restart for no-speech
              if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
              }
              restartTimeoutRef.current = setTimeout(() => {
                if (isEnabled && recognitionRef.current) {
                  try {
                    recognitionRef.current.start();
                  } catch (error) {
                    console.log('Failed to restart recognition:', error);
                    setError('Failed to restart speech recognition');
                  }
                }
              }, 1000);
              break;
            default:
              console.log('Recognition error:', event.error);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          // Auto-restart if captions are still enabled
          if (isEnabled) {
            setTimeout(() => {
              if (recognitionRef.current && isEnabled) {
                try {
                  recognitionRef.current.start();
                } catch (error) {
                  console.log('Failed to restart recognition:', error);
                }
              }
            }, 500);
          }
        };

        // Start recognition
        recognitionRef.current.start();
        
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error);
        setCaptions([{
          id: '1',
          text: 'Failed to access microphone. Please allow microphone permissions and refresh the page.',
          timestamp: Date.now(),
          speaker: 'System'
        }]);
      }
    };

    if (isEnabled) {
      initializeSpeechRecognition();
    }

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Error stopping recognition:', error);
        }
      }
    };
  }, [isEnabled]);

  // Auto-scroll to bottom when new captions appear
  useEffect(() => {
    if (captionsContainerRef.current) {
      captionsContainerRef.current.scrollTop = captionsContainerRef.current.scrollHeight;
    }
  }, [captions, currentText]);

  const clearCaptions = () => {
    setCaptions([]);
    setCurrentText('');
  };

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-24 left-2 right-2 sm:left-4 sm:right-4 z-40 pointer-events-none">
      <div className="max-w-4xl mx-auto">
        {/* Caption Display */}
        <div 
          className={`
            min-h-[80px] sm:min-h-[120px] max-h-[150px] sm:max-h-[200px] overflow-y-auto rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 pointer-events-auto
            ${showBackground 
              ? 'bg-black/80 backdrop-blur-md border border-white/20' 
              : 'bg-transparent'
            }
          `}
          ref={captionsContainerRef}
        >
          {/* Previous Captions */}
          {captions.map((caption, index) => (
            <div 
              key={caption.id}
              className={`mb-2 slide-in-up ${index === captions.length - 1 ? 'opacity-100' : 'opacity-70'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-2">
                {caption.speaker && (
                  <span 
                    className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 shrink-0"
                  >
                    {caption.speaker}
                  </span>
                )}
                <p 
                  className="text-white leading-relaxed"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {caption.text}
                </p>
              </div>
            </div>
          ))}

          {/* Current/Interim Text */}
          {currentText && (
            <div className="mb-2 opacity-80">
              <div className="flex items-start gap-2">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/20 text-green-300 shrink-0">
                  Live
                </span>
                <p 
                  className="text-white/90 leading-relaxed italic"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {currentText}
                </p>
              </div>
            </div>
          )}

          {/* Listening Indicator */}
          {isListening && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Listening...</span>
            </div>
          )}

          {/* No Speech Placeholder */}
          {captions.length === 0 && !currentText && !isListening && (
            <div className="text-center text-white/60 py-8">
              <Captions className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p style={{ fontSize: `${fontSize}px` }}>
                Waiting for speech...
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 pointer-events-auto">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onToggle}
              className="bg-white/90 hover:bg-white text-gray-800 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl shadow-lg transition-all duration-200 text-sm"
            >
              <X className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Close</span>
            </Button>
            
            <Button
              onClick={clearCaptions}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-sm"
            >
              Clear
            </Button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Settings */}
            <div className="relative">
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 p-2 rounded-xl"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {showSettings && (
                <div className="absolute bottom-12 right-0 bg-white rounded-xl shadow-xl p-4 min-w-[200px] slide-in-up">
                  <h3 className="font-semibold text-gray-800 mb-3">Caption Settings</h3>
                  
                  {/* Font Size */}
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-1">Font Size</label>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">{fontSize}px</span>
                  </div>

                  {/* Background Toggle */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600">Background</label>
                    <button
                      onClick={() => setShowBackground(!showBackground)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        showBackground ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        showBackground ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Indicator */}
            <div className={`p-2 rounded-xl ${isListening ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
              {isListening ? (
                <Volume2 className="w-4 h-4 text-green-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCaptions;
