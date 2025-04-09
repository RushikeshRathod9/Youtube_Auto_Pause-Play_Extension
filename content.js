// YouTube Auto Pause/Play - Content Script
// Controls video playback on YouTube pages

// Register this tab when the content script loads
chrome.runtime.sendMessage({ action: "register" }, (response) => {
    console.log("YouTube Auto Pause/Play extension activated");
  });
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "pause") {
      pauseAllVideos();
    } else if (message.action === "play") {
      playAllVideos();
    }
  });
  
  // Function to pause all videos on the page (including main player and shorts)
  function pauseAllVideos() {
    // Main video player
    const videoElements = document.querySelectorAll('video');
    
    videoElements.forEach(video => {
      if (!video.paused && video.readyState > 2) { // Only if video is playing and loaded
        video.pause();
      }
    });
    
    // Try to pause using YouTube's HTML5 player API if available
    if (document.querySelector('.html5-video-player')) {
      const players = document.querySelectorAll('.html5-video-player');
      players.forEach(player => {
        if (player && player.pauseVideo && typeof player.pauseVideo === 'function') {
          try {
            player.pauseVideo();
          } catch (e) {
            console.log("Could not pause using YouTube API");
          }
        }
      });
    }
  }
  
  // Function to play all videos that were previously playing
  function playAllVideos() {
    // Get all video elements
    const videoElements = document.querySelectorAll('video');
    
    // Only play the video if it was previously playing
    // This is a simplification - ideally we would track which videos were playing
    // For most YouTube use cases, there's usually just one video playing at a time
    videoElements.forEach(video => {
      if (video.paused && video.readyState > 2) {
        video.play();
      }
    });
    
    // Try to play using YouTube's HTML5 player API if available
    if (document.querySelector('.html5-video-player')) {
      const players = document.querySelectorAll('.html5-video-player');
      players.forEach(player => {
        if (player && player.playVideo && typeof player.playVideo === 'function') {
          try {
            player.playVideo();
          } catch (e) {
            console.log("Could not play using YouTube API");
          }
        }
      });
    }
  }
  
  // Handle page unload events
  window.addEventListener('beforeunload', () => {
    chrome.runtime.sendMessage({ action: "unregister" });
  });