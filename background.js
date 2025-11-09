
const ICONS = {
  happy:    { "16": "Images/HappyMelon.png" },
  sick:     { "16": "Images/SickMelon.PNG" },
  decaying: { "16": "Images/DecayingMelon.PNG" },
  dead:     { "16": "Images/DeadMelon.PNG" }
};

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

chrome.runtime.onInstalled.addListener(async () => {
  const defaults = {
    blockList: [],
    warnings: 0,
    sessionWarnings: 0,
    sessionCount: 0,
    inSession: false,
    lastSessionCompleted: false,
    melonDead: false,
    isMusicPlaying: false
  };

  function updateIcon(warnings) {
  if (warnings >= 4) chrome.action.setIcon({ path: ICONS.dead });
  else if (warnings === 3) chrome.action.setIcon({ path: ICONS.decaying });
  else if (warnings === 2) chrome.action.setIcon({ path: ICONS.sick });
  else chrome.action.setIcon({ path: ICONS.happy });
}


  const current = await chrome.storage.local.get(Object.keys(defaults));
  const toSet = {};
  for (const key in defaults) {
    if (typeof current[key] === "undefined") toSet[key] = defaults[key];
  }
  if (Object.keys(toSet).length) await chrome.storage.local.set(toSet);

  const { warnings } = await chrome.storage.local.get(["warnings"]);
  updateIcon(warnings || 0);
});



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

function showAlert() {
  alert("This site is distracting and will harm your plant's growth! Get back to work!");
}

// This code runs every single time a tab is updated in any way.
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

  if (changeInfo.status === 'complete' && tab.url) {
    
    // Get the blocklist from storage, the one you saved from the popup.
    const result = await chrome.storage.local.get(["blockList"]);
    const blockList = result.blockList || [];
    
    const hostname = new URL(tab.url).hostname;
    
    // Loop through every site in your blocklist.
    for (const siteToBlock of blockList) {
      // Check if the current website's hostname includes the one from your list.
  
      if (hostname.includes(siteToBlock)) {
        
        // If we find a match, inject and run our showAlert function on that tab.
        chrome.scripting.executeScript({
          target: { tabId: tabId }, 
          function: showAlert       
        });
        
        // Once we find a match, we can stop checking the rest of the list.
        break; 
      }
    }
  }
});