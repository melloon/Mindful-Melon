let timerSeconds = 60; // default
let timerInterval = null;
let paused = false;

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
