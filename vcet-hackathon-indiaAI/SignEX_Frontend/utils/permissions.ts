export const checkMicrophonePermission = async (): Promise<{
  granted: boolean;
  error?: string;
}> => {
  try {
    // Check if the browser supports the permissions API
    if ('permissions' in navigator) {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return { granted: result.state === 'granted' };
    }
    
    // Fallback: Try to access the microphone directly
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately after checking
      stream.getTracks().forEach(track => track.stop());
      return { granted: true };
    } catch (error) {
      return {
        granted: false,
        error: error instanceof Error ? error.message : 'Microphone access denied'
      };
    }
  } catch (error) {
    return {
      granted: false,
      error: 'Unable to check microphone permissions'
    };
  }
};

export const requestMicrophonePermission = async (): Promise<{
  granted: boolean;
  stream?: MediaStream;
  error?: string;
}> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    
    return { granted: true, stream };
  } catch (error) {
    let errorMessage = 'Failed to access microphone';
    
    if (error instanceof Error) {
      switch (error.name) {
        case 'NotAllowedError':
          errorMessage = 'Microphone access denied by user';
          break;
        case 'NotFoundError':
          errorMessage = 'No microphone found';
          break;
        case 'NotReadableError':
          errorMessage = 'Microphone is already in use';
          break;
        case 'OverconstrainedError':
          errorMessage = 'Microphone constraints cannot be satisfied';
          break;
        default:
          errorMessage = error.message;
      }
    }
    
    return { granted: false, error: errorMessage };
  }
};

export const isSpeechRecognitionSupported = (): boolean => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

export const getBrowserSpeechRecognition = () => {
  return window.SpeechRecognition || window.webkitSpeechRecognition;
};
