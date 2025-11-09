/**
 * Content script for Google Meet caption capture and audio recording
 * Runs on meet.google.com pages and captures live captions + audio for Groq transcription
 */

// Multiple selectors to handle different Google Meet caption layouts
const CAPTION_SELECTORS = [
  '[data-self-name] span',
  '.a4cQT span', // Alternative Google Meet caption selector
  '.captions-text span',
  '[jsname="dsyhDe"] span',
  '.live-captions-container span'
];

let lastCaption = '';
let backendUrl = '';
let isEnabled = true;
let signLanguagePanel = null;
let audioRecorder = null;
let recordingChunks = [];
let isRecording = false;
let selectedLanguage = 'auto';

// Get settings from extension storage
chrome.storage.sync.get(['backendUrl', 'isEnabled', 'selectedLanguage'], function(result) {
  backendUrl = result.backendUrl || 'https://your-django-domain.com';
  isEnabled = result.isEnabled !== false;
  selectedLanguage = result.selectedLanguage || 'auto';
  console.log('Signex: Extension loaded with backend URL:', backendUrl);
});

/**
 * Initialize audio recording capabilities
 */
async function initializeAudioRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 16000
      } 
    });
    
    audioRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus'
    });
    
    audioRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordingChunks.push(event.data);
      }
    };
    
    audioRecorder.onstop = async () => {
      if (recordingChunks.length > 0) {
        const audioBlob = new Blob(recordingChunks, { type: 'audio/webm' });
        await sendAudioToBackend(audioBlob);
        recordingChunks = [];
      }
    };
    
    console.log('Signex: Audio recording initialized');
    return true;
  } catch (error) {
    console.error('Signex: Failed to initialize audio recording:', error);
    return false;
  }
}

/**
 * Start continuous audio recording in chunks
 */
function startAudioRecording() {
  if (!audioRecorder || isRecording) return;
  
  isRecording = true;
  recordingChunks = [];
  
  // Record in 10-second chunks for real-time processing
  const recordChunk = () => {
    if (!isRecording) return;
    
    audioRecorder.start();
    setTimeout(() => {
      if (audioRecorder && audioRecorder.state === 'recording') {
        audioRecorder.stop();
        setTimeout(recordChunk, 100); // Small gap between chunks
      }
    }, 10000); // 10-second chunks
  };
  
  recordChunk();
  console.log('Signex: Started audio recording');
}

/**
 * Stop audio recording
 */
function stopAudioRecording() {
  isRecording = false;
  if (audioRecorder && audioRecorder.state === 'recording') {
    audioRecorder.stop();
  }
  console.log('Signex: Stopped audio recording');
}

/**
 * Send audio to Django backend for Groq transcription
 */
async function sendAudioToBackend(audioBlob) {
  if (!backendUrl || !isEnabled) return;
  
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('language', selectedLanguage);
    formData.append('timestamp', Date.now().toString());
    
    const response = await fetch(`${backendUrl}/api/transcribe/`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Signex: Audio transcribed:', data.transcription);
      
      // Update sign language panel with transcription result
      if (data.signVideoUrl) {
        updateSignLanguagePanel(data.signVideoUrl, {
          transcription: data.transcription,
          language: data.language,
          confidence: data.confidence
        });
      }
      
      // Also show transcription in panel
      showTranscriptionInPanel(data.transcription, data.language, data.confidence);
      
    } else {
      console.warn('Signex: Audio transcription failed:', response.status);
    }
  } catch (error) {
    console.error('Signex: Audio backend error:', error);
  }
}

/**
 * Send caption text to Django backend
 */
async function sendCaptionToBackend(text) {
  if (!backendUrl || !isEnabled) return;
  
  try {
    const response = await fetch(`${backendUrl}/api/captions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        caption: text,
        timestamp: Date.now(),
        source: 'google-meet',
        language: selectedLanguage
      }),
      credentials: "include"
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Signex: Caption sent successfully:', text);
      
      // Update sign language panel if available
      if (data.signVideoUrl) {
        updateSignLanguagePanel(data.signVideoUrl, {
          caption: text,
          language: data.language,
          confidence: data.confidence
        });
      }
    } else {
      console.warn('Signex: Backend error:', response.status);
    }
  } catch (err) {
    console.error("Signex: Backend connection error:", err);
  }
}

/**
 * Create and update the floating sign language panel
 */
function createSignLanguagePanel() {
  if (signLanguagePanel) return;
  
  signLanguagePanel = document.createElement('div');
  signLanguagePanel.id = 'signex-panel';
  signLanguagePanel.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      height: 250px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9999;
      font-family: Arial, sans-serif;
      overflow: hidden;
      resize: both;
    ">
      <div style="
        background: #4285f4;
        color: white;
        padding: 8px 12px;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
      " id="signex-header">
        <span>🤟 Signex Translator</span>
        <div>
          <button id="signex-audio-toggle" style="
            background: none;
            border: 1px solid white;
            color: white;
            font-size: 12px;
            cursor: pointer;
            padding: 2px 6px;
            margin-right: 5px;
            border-radius: 3px;
          ">🎤 Audio</button>
          <button id="signex-close" style="
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
          ">×</button>
        </div>
      </div>
      <div style="display: flex; height: calc(100% - 44px);">
        <div id="signex-video" style="
          flex: 2;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 14px;
        ">
          Waiting for content...
        </div>
        <div id="signex-text" style="
          flex: 1;
          padding: 8px;
          border-left: 1px solid #ddd;
          overflow-y: auto;
          font-size: 12px;
          line-height: 1.3;
        ">
          <div style="font-weight: bold; margin-bottom: 5px;">Recent:</div>
          <div id="signex-recent-text">Enable captions or audio recording</div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(signLanguagePanel);
  
  // Make panel draggable
  makeDraggable();
  
  // Add close button functionality
  document.getElementById('signex-close').addEventListener('click', () => {
    signLanguagePanel.remove();
    signLanguagePanel = null;
    stopAudioRecording();
  });
  
  // Add audio recording toggle
  document.getElementById('signex-audio-toggle').addEventListener('click', toggleAudioRecording);
}

/**
 * Make the panel draggable
 */
function makeDraggable() {
  const header = document.getElementById('signex-header');
  let isDragging = false;
  let startX, startY, startLeft, startTop;
  
  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = signLanguagePanel.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startLeft = rect.left;
    startTop = rect.top;
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    signLanguagePanel.style.left = (startLeft + deltaX) + 'px';
    signLanguagePanel.style.top = (startTop + deltaY) + 'px';
    signLanguagePanel.style.right = 'auto';
    signLanguagePanel.style.bottom = 'auto';
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

/**
 * Toggle audio recording
 */
async function toggleAudioRecording() {
  const button = document.getElementById('signex-audio-toggle');
  
  if (!isRecording) {
    if (!audioRecorder) {
      const success = await initializeAudioRecording();
      if (!success) {
        button.textContent = '🎤 Error';
        return;
      }
    }
    startAudioRecording();
    button.textContent = '⏹ Stop';
    button.style.background = '#ea4335';
  } else {
    stopAudioRecording();
    button.textContent = '🎤 Audio';
    button.style.background = 'none';
  }
}

/**
 * Update the sign language panel with new content
 */
function updateSignLanguagePanel(videoUrl, metadata = {}) {
  if (!signLanguagePanel) createSignLanguagePanel();
  
  const videoContent = document.getElementById('signex-video');
  if (videoContent && videoUrl) {
    videoContent.innerHTML = `
      <video 
        src="${videoUrl}" 
        autoplay 
        loop 
        muted 
        style="width: 100%; height: 100%; object-fit: cover;"
        onload="this.play()"
      ></video>
    `;
  }
  
  // Update text panel with metadata
  if (metadata.transcription || metadata.caption) {
    showTranscriptionInPanel(
      metadata.transcription || metadata.caption,
      metadata.language,
      metadata.confidence
    );
  }
}

/**
 * Show transcription/caption in text panel
 */
function showTranscriptionInPanel(text, language, confidence) {
  if (!signLanguagePanel) return;
  
  const textPanel = document.getElementById('signex-recent-text');
  if (textPanel) {
    const timestamp = new Date().toLocaleTimeString();
    const languageName = getLanguageName(language);
    const confidenceBar = confidence ? `(${Math.round(confidence * 100)}%)` : '';
    
    textPanel.innerHTML = `
      <div style="margin-bottom: 8px; padding: 4px; background: #f5f5f5; border-radius: 3px;">
        <div style="font-size: 10px; color: #666;">${timestamp} • ${languageName} ${confidenceBar}</div>
        <div style="margin-top: 2px;">${text}</div>
      </div>
    ` + textPanel.innerHTML;
    
    // Keep only last 5 entries
    const entries = textPanel.children;
    while (entries.length > 5) {
      textPanel.removeChild(entries[entries.length - 1]);
    }
  }
}

/**
 * Get language name from code
 */
function getLanguageName(code) {
  const languages = {
    'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
    'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese',
    'ko': 'Korean', 'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi',
    'auto': 'Auto-detect'
  };
  return languages[code] || code;
}

/**
 * Extract captions from Google Meet
 */
function extractCaptions() {
  let captionText = '';
  
  // Try different selectors to find captions
  for (const selector of CAPTION_SELECTORS) {
    const captionElements = document.querySelectorAll(selector);
    if (captionElements.length > 0) {
      captionText = Array.from(captionElements)
        .map(el => el.textContent)
        .join(' ')
        .trim();
      break;
    }
  }
  
  // Also try to find captions in aria-live regions
  if (!captionText) {
    const liveRegions = document.querySelectorAll('[aria-live="polite"], [aria-live="assertive"]');
    for (const region of liveRegions) {
      if (region.textContent && region.textContent.length > 10) {
        captionText = region.textContent.trim();
        break;
      }
    }
  }
  
  return captionText;
}

/**
 * Process new captions
 */
function processCaptions() {
  const captionText = extractCaptions();
  
  if (captionText && captionText !== lastCaption && captionText.length > 0) {
    lastCaption = captionText;
    console.log('Signex: New caption detected:', captionText);
    sendCaptionToBackend(captionText);
  }
}

// Create mutation observer to watch for caption changes
const observer = new MutationObserver(() => {
  if (isEnabled) {
    processCaptions();
  }
});

// Start observing when the page loads
function startObserving() {
  // Wait for Meet to fully load
  setTimeout(() => {
    console.log('Signex: Starting caption monitoring...');
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    });
    
    // Also check periodically in case mutations are missed
    setInterval(processCaptions, 1000);
  }, 3000);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'toggleEnabled':
      isEnabled = message.enabled;
      if (!isEnabled) {
        stopAudioRecording();
      }
      sendResponse({ status: 'ok' });
      break;
    case 'updateBackendUrl':
      backendUrl = message.url;
      sendResponse({ status: 'ok' });
      break;
    case 'updateSettings':
      const settings = message.settings;
      backendUrl = settings.backendUrl;
      selectedLanguage = settings.selectedLanguage;
      if (!settings.audioRecordingEnabled && isRecording) {
        stopAudioRecording();
      }
      sendResponse({ status: 'ok' });
      break;
    case 'togglePanel':
      if (signLanguagePanel) {
        signLanguagePanel.remove();
        signLanguagePanel = null;
        stopAudioRecording();
      } else {
        createSignLanguagePanel();
      }
      sendResponse({ status: 'ok' });
      break;
    case 'getStatus':
      sendResponse({
        isEnabled,
        backendUrl,
        hasCaptions: !!lastCaption,
        isRecording
      });
      break;
  }
});

// Initialize
if (window.location.hostname === 'meet.google.com') {
  startObserving();
  
  // Show initial notification
  console.log('Signex: Extension active on Google Meet');
  
  // Create panel if auto-show is enabled
  chrome.storage.sync.get(['autoShowPanel'], (result) => {
    if (result.autoShowPanel !== false) {
      setTimeout(createSignLanguagePanel, 5000);
    }
  });
}