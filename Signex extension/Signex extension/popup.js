/**
 * Popup script for Signex Chrome Extension
 * Handles UI interactions and settings management
 */

// DOM elements
const extensionStatus = document.getElementById('extension-status');
const meetStatus = document.getElementById('meet-status');
const enableToggle = document.getElementById('enable-toggle');
const togglePanelBtn = document.getElementById('toggle-panel');
const backendUrlInput = document.getElementById('backend-url');
const languageSelect = document.getElementById('language-select');
const autoPanelToggle = document.getElementById('auto-panel');
const audioRecordingToggle = document.getElementById('audio-recording');
const saveSettingsBtn = document.getElementById('save-settings');

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  updateStatus();
  setupEventListeners();
});

/**
 * Load settings from storage
 */
function loadSettings() {
  chrome.storage.sync.get([
    'backendUrl', 
    'isEnabled', 
    'autoShowPanel',
    'selectedLanguage',
    'audioRecordingEnabled'
  ], (result) => {
    backendUrlInput.value = result.backendUrl || 'https://your-django-domain.com';
    enableToggle.checked = result.isEnabled !== false;
    autoPanelToggle.checked = result.autoShowPanel !== false;
    languageSelect.value = result.selectedLanguage || 'auto';
    audioRecordingToggle.checked = result.audioRecordingEnabled === true;
  });
}

/**
 * Update status indicators
 */
async function updateStatus() {
  // Check if we're on a Google Meet tab
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    
    if (currentTab.url && currentTab.url.includes('meet.google.com')) {
      meetStatus.textContent = 'Active';
      meetStatus.className = 'status-value active';
      
      // Get status from content script
      chrome.tabs.sendMessage(currentTab.id, { action: 'getStatus' }, (response) => {
        if (response) {
          extensionStatus.textContent = response.isEnabled ? 'Enabled' : 'Disabled';
          extensionStatus.className = response.isEnabled ? 
            'status-value active' : 'status-value inactive';
          
          enableToggle.checked = response.isEnabled;
        }
      });
    } else {
      meetStatus.textContent = 'Not on Google Meet';
      meetStatus.className = 'status-value inactive';
      extensionStatus.textContent = 'Standby';
      extensionStatus.className = 'status-value';
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Enable/disable toggle
  enableToggle.addEventListener('change', async () => {
    const isEnabled = enableToggle.checked;
    
    // Save to storage
    chrome.storage.sync.set({ isEnabled });
    
    // Update content script
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    
    if (currentTab.url && currentTab.url.includes('meet.google.com')) {
      chrome.tabs.sendMessage(currentTab.id, { 
        action: 'toggleEnabled', 
        enabled: isEnabled 
      });
    }
    
    updateStatus();
    showToast(isEnabled ? 'Translation enabled' : 'Translation disabled');
  });
  
  // Toggle panel button
  togglePanelBtn.addEventListener('click', async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    
    if (currentTab.url && currentTab.url.includes('meet.google.com')) {
      chrome.tabs.sendMessage(currentTab.id, { action: 'togglePanel' }, (response) => {
        if (response && response.status === 'ok') {
          showToast('Sign language panel toggled');
        }
      });
    } else {
      showToast('Please open Google Meet first', 'error');
    }
  });
  
  // Save settings button
  saveSettingsBtn.addEventListener('click', () => {
    const backendUrl = backendUrlInput.value.trim();
    const autoShowPanel = autoPanelToggle.checked;
    const selectedLanguage = languageSelect.value;
    const audioRecordingEnabled = audioRecordingToggle.checked;
    
    // Validate URL
    if (backendUrl && !isValidUrl(backendUrl)) {
      showToast('Please enter a valid URL', 'error');
      return;
    }
    
    // Save settings
    chrome.storage.sync.set({
      backendUrl,
      autoShowPanel,
      selectedLanguage,
      audioRecordingEnabled
    }, () => {
      showToast('Settings saved successfully');
      
      // Update content script with new settings
      chrome.tabs.query({ url: 'https://meet.google.com/*' }, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { 
            action: 'updateSettings', 
            settings: {
              backendUrl,
              selectedLanguage,
              audioRecordingEnabled
            }
          });
        });
      });
    });
  });
  
  // Auto-save backend URL on change
  backendUrlInput.addEventListener('blur', () => {
    const backendUrl = backendUrlInput.value.trim();
    if (backendUrl && isValidUrl(backendUrl)) {
      chrome.storage.sync.set({ backendUrl });
    }
  });
}

/**
 * Validate URL format
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return string.startsWith('http://') || string.startsWith('https://');
  } catch (_) {
    return false;
  }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'error' ? '#d93025' : '#34a853'};
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 10000;
    animation: fadeInOut 3s ease-in-out;
  `;
  
  // Add animation CSS if not exists
  if (!document.querySelector('#toast-styles')) {
    const styles = document.createElement('style');
    styles.id = 'toast-styles';
    styles.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        15% { opacity: 1; transform: translateX(-50%) translateY(0); }
        85% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
      }
    `;
    document.head.appendChild(styles);
  }
  
  document.body.appendChild(toast);
  
  // Remove after animation
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}

// Refresh status every few seconds
setInterval(updateStatus, 3000);
