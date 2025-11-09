/**
 * Background service worker for Signex Chrome Extension
 * Handles cross-tab communication and extension lifecycle
 */

// Extension installation and updates
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Signex: Extension installed/updated', details.reason);
  
  // Set default settings
  chrome.storage.sync.set({
    backendUrl: 'https://SignEX.meet.com',
    isEnabled: true,
    autoShowPanel: true
  });
  
  if (details.reason === 'install') {
    // Show welcome notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/icon48.png',
      title: 'Signex Translator Installed',
      message: 'Visit Google Meet and enable captions to start sign language translation!'
    });
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'updateBadge':
      // Update extension badge to show status
      chrome.action.setBadgeText({
        text: message.text || '',
        tabId: sender.tab?.id
      });
      chrome.action.setBadgeBackgroundColor({
        color: message.color || '#4285f4'
      });
      break;
      
    case 'showNotification':
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon48.png',
        title: message.title || 'Signex Translator',
        message: message.message
      });
      break;
      
    case 'logActivity':
      console.log('Signex Activity:', message.data);
      break;
  }
  
  sendResponse({ status: 'ok' });
});

// Handle tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('meet.google.com')) {
    console.log('Signex: Google Meet detected, content script should be active');
    
    // Update badge to show extension is active
    chrome.action.setBadgeText({
      text: 'ON',
      tabId: tabId
    });
    chrome.action.setBadgeBackgroundColor({
      color: '#34a853'
    });
  }
});

// Clean up badge when tab is closed or navigated away
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.action.setBadgeText({
    text: '',
    tabId: tabId
  });
});

// Handle extension icon click (if no popup is set)
chrome.action.onClicked.addListener((tab) => {
  if (tab.url?.includes('meet.google.com')) {
    // Send message to content script to toggle panel
    chrome.tabs.sendMessage(tab.id, { action: 'togglePanel' });
  }
});

// Periodic cleanup and health check
setInterval(() => {
  // Clean up any expired data or perform maintenance
  console.log('Signex: Background service worker health check');
}, 300000); // Every 5 minutes