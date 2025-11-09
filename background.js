
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

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === "popup-toggle") {
    await ensureOffscreenDocument();
    chrome.runtime.sendMessage({ type: "offscreen-toggle" });
    sendResponse({ success: true });
  }

  if (msg.type === "music-state-changed") {
    console.log("Saving music state:", msg.isPlaying);
    await chrome.storage.local.set({ isMusicPlaying: msg.isPlaying });
  }
  
  return true; // keep port open for async response
});
// End of Music


// Notis
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

  if (changeInfo.status === 'complete' && tab.url) {
    
    const result = await chrome.storage.local.get(["blockList"]);
    const blockList = result.blockList || [];
    const hostname = new URL(tab.url).hostname;
    
    for (const siteToBlock of blockList) {
      if (hostname.includes(siteToBlock)) {
        
    
        // Native Chrome notification instead of like "youtube says"
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon48.png", // Or icon128.png
          title: "MindfulMelon", 
          message: "This site is distracting and will harm your plant's growth!"
        });
        
        break; 
      }
    }
  }
});