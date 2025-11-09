
async function ensureOffscreenDocument() {
  const exists = await chrome.offscreen.hasDocument();
  if (!exists) {
    console.warn("Offscreen API unavailable; skipping offscreen audio setup.");
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

function showNotification(hostname) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "Images/icon128.png", // Path to your extension icon
    title: "🌱 FocusGarden Reminder",
    message: `The site "${hostname}" is distracting and will harm your plant's growth! Get back to work!`,
    priority: 2
  });
}

// === Watch tab updates and trigger notification if site is blocked ===
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const result = await chrome.storage.local.get(["blockList"]);
    const blockList = result.blockList || [];

    const hostname = new URL(tab.url).hostname;

    for (const siteToBlock of blockList) {
      if (hostname.includes(siteToBlock)) {
        showNotification(hostname);
        break;
      }
    }
  }

  console.log('Context:', chrome.runtime.getManifest().manifest_version);
console.log('Notifications available:', !!chrome.notifications);
});