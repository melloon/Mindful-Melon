
async function ensureOffscreenDocument() {
  const exists = await chrome.offscreen.hasDocument();
  if (!exists) {
    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Play lofi audio in background"
    });
  }
}

// Combining Music and Timer
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  
  // Lofi
  if (msg.type === "popup-toggle") {
    await ensureOffscreenDocument();
    chrome.runtime.sendMessage({ type: "offscreen-toggle" });
    sendResponse({ success: true });
  }

  // Your Music State Reporting
  if (msg.type === "music-state-changed") {
    console.log("Saving music state:", msg.isPlaying);
    await chrome.storage.local.set({ isMusicPlaying: msg.isPlaying });
    sendResponse({ success: true });
  }

  // Timer Start
  if (msg.type === "start-timer") {
    console.log("Starting timer for", msg.duration, "minutes");
    
    // Creating a Chrome Alarm cleaner
    chrome.alarms.create("study-timer", {
      delayInMinutes: msg.duration
    });
    
    sendResponse({ success: true });
  }
  
  return true; // keep port open for async response
});


// Site blocker
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const result = await chrome.storage.local.get(["blockList"]);
    const blockList = result.blockList || [];
    const hostname = new URL(tab.url).hostname;

    console.log("Checking page:", hostname, "Against list:", blockList);
    
    for (const siteToBlock of blockList) {
      if (hostname.includes(siteToBlock)) {
        
        // Cleaner chrome.notifications system
        chrome.notifications.create({
          type: "basic",
          iconUrl: "Images/HappyMelon.png", // Team Icon
          title: "Mindful Melon",
          message: "This site is distracting and will harm your plant's growth!"
        });
        
        break; 
      }
    }
  }
});


// Fixing Timer Again
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "study-timer") {
    console.log("Timer finished!");
    
    // Noti for when the timer is done
    chrome.notifications.create({
      type: "basic",
      iconUrl: "Images/HappyMelon.png",
      title: "Mindful Melon",
      message: "Study session complete! Time to take a break."
    });
    
    // Clear the alarm
    chrome.alarms.clear("study-timer");
  }
});
