'use client';
import { useState, useEffect } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList, Captions, HandMetal, Globe } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import EndCallButton from './EndCallButton';
import LiveCaptions from './LiveCaptions';
import ErrorBoundary from './ErrorBoundary';
import ConnectionStatus from './ConnectionStatus';
import SignLanguageDetector from './SignLanguageDetector';
import WireframeCard from './WireframeCard';
import { cn } from '@/lib/utils';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const call = useCall();
  const [isCaptionsEnabled, setIsCaptionsEnabled] = useState(false);
  const [isSignLangEnabled, setIsSignLangEnabled] = useState(false);
  const [isWireframeEnabled, setIsWireframeEnabled] = useState(false);
  const [isRightIframeEnabled, setIsRightIframeEnabled] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(320); // Default width
  const [isResizing, setIsResizing] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  // Get video stream for sign language detection - MUST be before early return
  useEffect(() => {
    const getVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 }, 
          audio: false 
        });
        setVideoStream(stream);
      } catch (error) {
        console.error('Failed to get video stream:', error);
      }
    };

    if (isSignLangEnabled && !videoStream) {
      getVideoStream();
    }

    return () => {
      if (videoStream && !isSignLangEnabled) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
    };
  }, [isSignLangEnabled, videoStream]);

  // Handle right panel resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - e.clientX;
        const minWidth = 200;
        const maxWidth = 800;
        setRightPanelWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <ErrorBoundary>
      <ConnectionStatus />
      <section className="relative h-screen w-full overflow-hidden bg-gray-50">
      {/* Main Video Area */}
      <div className="relative flex size-full items-center justify-center p-2 sm:p-4">
        <div className="flex size-full max-w-[1400px] items-center">
          <div className="relative w-full h-full bg-black rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">
            <CallLayout />
            
            {/* Meeting Info Overlay */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex justify-between items-start z-10">
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl px-2 sm:px-4 py-1.5 sm:py-2 shadow-lg">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-800 font-semibold text-xs sm:text-sm">Live Meeting</span>
                </div>
              </div>
              
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl px-2 sm:px-4 py-1.5 sm:py-2 shadow-lg">
                <span className="text-gray-800 font-mono text-xs sm:text-sm">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Participants Panel / Right Iframe */}
        {showParticipants && (
          <div 
            className="h-[calc(100vh-2rem)] ml-4 hidden lg:block relative"
            style={{ width: `${rightPanelWidth}px` }}
          >
            {/* Resize Handle */}
            <div
              className="absolute left-0 top-0 w-1 h-full bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors duration-200 z-10"
              onMouseDown={() => setIsResizing(true)}
            />
            
            <div className="bg-white rounded-2xl shadow-xl h-full overflow-hidden">
              {isRightIframeEnabled ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-800">SignEX Training</span>
                      <span className="text-xs text-gray-500">({rightPanelWidth}px)</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowParticipants(false);
                        setIsRightIframeEnabled(false);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex-1 relative">
                    <iframe
                      src="http://localhost:8000/templates/Training.html"
                      title="SignEX Training Right Panel"
                      className="w-full h-full border-0"
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-camera allow-microphone"
                      allow="camera; microphone; autoplay"
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : (
                <CallParticipantsList onClose={() => setShowParticipants(false)} />
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Modern Control Bar */}
      <div className="fixed bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] sm:w-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 p-2 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4 justify-center sm:justify-start overflow-x-auto">
            {/* Main Call Controls */}
            <div className="flex items-center">
              <ErrorBoundary fallback={({ resetError }) => (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={resetError}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Retry Controls
                  </button>
                </div>
              )}>
                <CallControls onLeave={() => router.push(`/`)} />
              </ErrorBoundary>
            </div>
            
            {/* Divider - Hidden on mobile */}
            <div className="w-px h-6 sm:h-8 bg-gray-300 hidden sm:block"></div>
            
            {/* Additional Controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
              {/* Layout Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger 
                  className="cursor-pointer rounded-lg sm:rounded-xl bg-gray-100 hover:bg-gray-200 px-2 sm:px-4 py-2 sm:py-3 transition-colors duration-200 shadow-sm"
                  aria-label="Change video layout"
                >
                  <LayoutList size={16} className="text-gray-700 sm:w-5 sm:h-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 shadow-xl rounded-xl p-2">
                  {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                    <div key={index}>
                      <DropdownMenuItem
                        onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
                        className="hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer text-gray-700"
                      >
                        {item}
                      </DropdownMenuItem>
                      {index < 2 && <DropdownMenuSeparator className="my-1 bg-gray-200" />}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Call Stats - Hidden on small screens */}
              <div className="rounded-lg sm:rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200 shadow-sm hidden md:block">
                <CallStatsButton />
              </div>

              {/* Participants/Right Iframe Toggle */}
              <button 
                onClick={() => {
                  setShowParticipants((prev) => !prev);
                  setIsRightIframeEnabled((prev) => !prev);
                }}
                aria-label={showParticipants ? "Hide participants" : "Show participants"}
                aria-pressed={showParticipants}
                className={cn(
                  "cursor-pointer rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 shadow-sm flex items-center gap-1 sm:gap-2",
                  showParticipants 
                    ? "bg-blue-500 hover:bg-blue-600 text-white" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                )}
              >
                <Users size={16} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Participants</span>
              </button>
              
              {/* Captions Button */}
              <button 
                onClick={() => setIsCaptionsEnabled(!isCaptionsEnabled)}
                aria-label={isCaptionsEnabled ? "Disable live captions" : "Enable live captions"}
                aria-pressed={isCaptionsEnabled}
                className={cn(
                  "cursor-pointer rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 shadow-sm flex items-center gap-1 sm:gap-2",
                  isCaptionsEnabled 
                    ? "bg-indigo-500 hover:bg-indigo-600 text-white" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                )}
              >
                <Captions size={16} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Captions</span>
              </button>

              {/* Sign Language Button */}
              <button 
                onClick={() => setIsSignLangEnabled(!isSignLangEnabled)}
                aria-label={isSignLangEnabled ? "Disable sign language detection" : "Enable sign language detection"}
                aria-pressed={isSignLangEnabled}
                className={cn(
                  "cursor-pointer rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 shadow-sm flex items-center gap-1 sm:gap-2",
                  isSignLangEnabled 
                    ? "bg-purple-500 hover:bg-purple-600 text-white" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                )}
              >
                <HandMetal size={16} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Sign Lang</span>
              </button>

              {/* Wireframe Card Button */}
              <button 
                onClick={() => setIsWireframeEnabled(!isWireframeEnabled)}
                aria-label={isWireframeEnabled ? "Hide wireframe card" : "Show wireframe card"}
                aria-pressed={isWireframeEnabled}
                className={cn(
                  "cursor-pointer rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 shadow-sm flex items-center gap-1 sm:gap-2",
                  isWireframeEnabled 
                    ? "bg-green-500 hover:bg-green-600 text-white" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                )}
              >
                <LayoutList size={16} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Wireframe</span>
              </button>
            </div>
            
            {/* End Call Button */}
            {!isPersonalRoom && (
              <>
                <div className="w-px h-8 bg-gray-300"></div>
                <EndCallButton />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Live Captions Overlay */}
      <ErrorBoundary>
        <LiveCaptions 
          isEnabled={isCaptionsEnabled}
          onToggle={() => setIsCaptionsEnabled(false)}
        />
      </ErrorBoundary>

      {/* Sign Language Detector */}
      <ErrorBoundary>
        <SignLanguageDetector
          isEnabled={isSignLangEnabled}
          onToggle={setIsSignLangEnabled}
          videoStream={videoStream}
        />
      </ErrorBoundary>

      {/* Wireframe Card */}
      <ErrorBoundary>
        {isWireframeEnabled && (
          <div className="fixed top-20 left-4 z-40 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 p-4 max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Wireframe Card</h3>
                <button
                  onClick={() => setIsWireframeEnabled(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  ×
                </button>
              </div>
              <WireframeCard />
            </div>
          </div>
        )}
      </ErrorBoundary>
      </section>
    </ErrorBoundary>
  );
};

export default MeetingRoom;
