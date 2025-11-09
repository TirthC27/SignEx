import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { ZEGO_CONFIG, generateUserID } from '../config/zegoConfig';

const VideoConference = ({ roomID, userName, onLeaveRoom }) => {
  const meetingRef = useRef(null);

  useEffect(() => {
    const initMeeting = async () => {
      // Generate a unique user ID
      const userID = generateUserID();
      
      // Generate Kit Token using configuration
      const { appID, serverSecret } = ZEGO_CONFIG;
      
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userID,
        userName
      );

      // Create instance object from Kit Token
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      
      // Start the call
      zp.joinRoom({
        container: meetingRef.current,
        sharedLinks: [
          {
            name: 'Personal link',
            url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        turnOnMicrophoneWhenJoining: ZEGO_CONFIG.turnOnMicrophoneWhenJoining,
        turnOnCameraWhenJoining: ZEGO_CONFIG.turnOnCameraWhenJoining,
        showMyCameraToggleButton: ZEGO_CONFIG.showMyCameraToggleButton,
        showMyMicrophoneToggleButton: ZEGO_CONFIG.showMyMicrophoneToggleButton,
        showAudioVideoSettingsButton: ZEGO_CONFIG.showAudioVideoSettingsButton,
        showScreenSharingButton: ZEGO_CONFIG.showScreenSharingButton,
        showTextChat: ZEGO_CONFIG.showTextChat,
        showUserList: ZEGO_CONFIG.showUserList,
        maxUsers: ZEGO_CONFIG.maxUsers,
        layout: ZEGO_CONFIG.layout,
        showLayoutButton: ZEGO_CONFIG.showLayoutButton,
        onLeaveRoom: () => {
          onLeaveRoom();
        },
      });
    };

    initMeeting();
  }, [roomID, userName, onLeaveRoom]);

  return (
    <div className="video-conference-container">
      <button className="leave-button" onClick={onLeaveRoom}>
        Leave Meeting
      </button>
      <div ref={meetingRef} style={{ width: '100vw', height: '100vh' }}></div>
    </div>
  );
};

export default VideoConference;
