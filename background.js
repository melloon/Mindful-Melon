
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

let timerSeconds = 60; // default
let timerInterval = null;
let paused = false;
let streak = 0;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ timerSeconds, paused });
});

// Start or restart timer; use totalSeconds if provided
function startTimer(totalSeconds) {
  
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    if (typeof totalSeconds === "number" && totalSeconds > 0) {
        timerSeconds = totalSeconds;
    } else if (timerSeconds <= 0) {
        timerSeconds = 60; // reset to default when timer is completed
    }

    paused = false;
    chrome.storage.local.set({ timerSeconds, paused });

    timerInterval = setInterval(() => {
        if (!paused && timerSeconds > 0) {
            timerSeconds--;
            chrome.storage.local.set({ timerSeconds });
        } else if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            streak++; // increment streak on restart after completion
            console.log(`Streak incremented to: ${streak}`);
        }
    }, 1000);
}

// function to pause the timer
function pauseTimer() {
    paused = true;
    chrome.storage.local.set({ paused });
}

function resumeTimer() {
    if (paused && timerSeconds > 0) {
        paused = false;
        chrome.storage.local.set({ paused });
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "start") {
        startTimer(message.totalSeconds);
        sendResponse({ status: "started" });
    } else if (message.action === "pause") {
        pauseTimer();
        sendResponse({ status: "paused" });
    } else if (message.action === "resume") {
        resumeTimer();
        sendResponse({ status: "resumed" });
    } else {
    sendResponse({ status: "unknown action" });
    }

    return true;
});
});