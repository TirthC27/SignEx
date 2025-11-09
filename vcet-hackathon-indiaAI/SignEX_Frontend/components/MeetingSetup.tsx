'use client';
import { useEffect, useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useParams } from 'next/navigation';
import { Share, Copy, Check } from 'lucide-react';

import Alert from './Alert';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import ErrorBoundary from './ErrorBoundary';

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#call-state
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

  if (!call) {
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );
  }

  // https://getstream.io/video/docs/react/ui-cookbook/replacing-call-controls/
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();
  const params = useParams();

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  // Generate meeting link and meeting ID
  const meetingId = call?.id || params?.id;
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}`;
  const meetingCode = meetingId?.toString().substring(0, 8).toUpperCase();

  const copyToClipboard = async (text: string, type: 'link' | 'code') => {
    try {
      await navigator.clipboard.writeText(text);
      setLinkCopied(true);
      toast({
        title: `${type === 'link' ? 'Meeting link' : 'Meeting code'} copied to clipboard`,
        description: type === 'link' ? 'Share this link with others to join the meeting' : 'Share this code with others to join the meeting',
      });
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
      />
    );

  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Left Side - Video Preview */}
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
              Get Ready to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Connect</span>
            </h1>
            
            {/* Video Preview Container */}
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-1 shadow-xl">
              <div className="bg-black rounded-lg overflow-hidden">
                <VideoPreview />
              </div>
              
              {/* Floating Status Indicators */}
              <div className="absolute top-4 right-4 flex gap-2">
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  isMicCamToggled ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {isMicCamToggled ? 'Camera Off' : 'Camera On'}
                </div>
              </div>
            </div>
            
            {/* Device Controls */}
            <div className="flex flex-col gap-4 mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMicCamToggled}
                  onChange={(e) => setIsMicCamToggled(e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm sm:text-base text-gray-700 font-medium">Join with mic and camera off</span>
              </label>
              <div className="flex justify-center">
                <DeviceSettings />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Meeting Info & Controls */}
        <div className="flex flex-col space-y-6">
          
          {/* Meeting Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Share className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Meeting Details</h2>
                <p className="text-gray-600">Share with participants</p>
              </div>
            </div>

            {/* Meeting Code Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Meeting Code</p>
                <div className="text-3xl font-bold text-gray-800 font-mono tracking-wider mb-4">
                  {meetingCode}
                </div>
                <Button
                  onClick={() => copyToClipboard(meetingCode, 'code')}
                  className="btn-outline px-6 py-2 rounded-xl"
                >
                  {linkCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  Copy Code
                </Button>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                onClick={() => setShowShareOptions(!showShareOptions)}
              >
                <Share size={20} className="mr-2" />
                More Share Options
              </Button>
              
              {showShareOptions && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-4 slide-in-up">
                  {/* Meeting Link */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={meetingLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(meetingLink, 'link')}
                        className="btn-primary px-4 py-2 rounded-lg"
                      >
                        {linkCopied ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Share either the link or code with others to invite them to join the meeting.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Join Button */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Button
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                call.join();
                setIsSetupComplete(true);
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Join Meeting
              </div>
            </Button>
            
            <p className="text-center text-gray-500 text-sm mt-4">
              Ready to start your meeting? Click above to join!
            </p>
          </div>
        </div>
      </div>
      </div>
    </ErrorBoundary>
  );
};

export default MeetingSetup;
