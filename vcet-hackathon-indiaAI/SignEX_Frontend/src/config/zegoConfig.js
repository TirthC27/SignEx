// ZegoCloud Configuration
// Replace these values with your actual ZegoCloud credentials
// Get them from: https://console.zegocloud.com/

export const ZEGO_CONFIG = {
  // Your App ID from ZegoCloud Console
  appID: 648470151, // Replace with your actual App ID
  
  // Your Server Secret from ZegoCloud Console  
  serverSecret: "96a87421fafac6f2fd0230c9236cc82f", // Replace with your actual Server Secret
  
  // Meeting configuration
  maxUsers: 50,
  turnOnMicrophoneWhenJoining: true,
  turnOnCameraWhenJoining: true,
  
  // UI configuration
  showMyCameraToggleButton: true,
  showMyMicrophoneToggleButton: true,
  showAudioVideoSettingsButton: true,
  showScreenSharingButton: true,
  showTextChat: true,
  showUserList: true,
  showLayoutButton: true,
  
  // Layout options: "Auto", "Gallery", "Sidebar"
  layout: "Auto"
};

// Generate a unique user ID
export const generateUserID = () => {
  return Math.floor(Math.random() * 10000) + "";
};

// Generate a random room ID
export const generateRoomID = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
