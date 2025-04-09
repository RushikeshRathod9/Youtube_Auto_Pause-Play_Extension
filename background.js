// YouTube Auto Pause/Play - Background Script
// Tracks tab states and sends messages to content script

// Keep track of the YouTube tabs
let youtubeTabs = {};

// Monitor tab switching
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    // Get information about the newly activated tab
    const currentTab = await chrome.tabs.get(activeInfo.tabId);
    
    // Check all tracked YouTube tabs
    for (let tabId in youtubeTabs) {
      tabId = parseInt(tabId);
      
      // Skip if this is the tab we just switched to
      if (tabId === activeInfo.tabId) {
        // We switched to this YouTube tab, so tell it to play
        chrome.tabs.sendMessage(tabId, { action: "play" });
      } else {
        // We switched away from this YouTube tab, so tell it to pause
        chrome.tabs.sendMessage(tabId, { action: "pause" });
      }
    }
  } catch (error) {
    console.error("Error handling tab switch:", error);
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "register") {
    // Register this tab as a YouTube tab
    youtubeTabs[sender.tab.id] = true;
    sendResponse({ status: "registered" });
  } else if (message.action === "unregister") {
    // Unregister this tab
    delete youtubeTabs[sender.tab.id];
    sendResponse({ status: "unregistered" });
  }
  
  return true; // Keep the message channel open for async responses
});

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (youtubeTabs[tabId]) {
    delete youtubeTabs[tabId];
  }
});