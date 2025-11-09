
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

chrome.runtime.onInstalled.addListener(async () => {
  const defaults = {
    warnings: 0,
    sessionWarnings: 0,
    sessionCount: 0,
    inSession: false,
    lastSessionCompleted: false,
    melonDead: false,
  };

  const current = await chrome.storage.local.get(Object.keys(defaults));
  const toSet = {};
  for (const key in defaults) {
    if (typeof current[key] === "undefined") toSet[key] = defaults[key];
  }
  if (Object.keys(toSet).length) await chrome.storage.local.set(toSet);

  const { warnings } = await chrome.storage.local.get(["warnings"]);
  updateIcon(warnings || 0);
});



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
// End of Music





// This code runs every single time a tab is updated in any way.
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