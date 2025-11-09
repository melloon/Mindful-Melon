let timerSeconds = 60; // 1 minute default
let timerInterval = null;
let paused = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ timerSeconds, paused });
});

// Start the timer
function startTimer() {
  if (timerInterval || paused) return; // prevent multiple intervals
  timerInterval = setInterval(() => {
    if (!paused && timerSeconds > 0) {
      timerSeconds--;
      chrome.storage.local.set({ timerSeconds }); // save progress
    } else if (timerSeconds <= 0){
      clearInterval(timerInterval);
      timerInterval = null;
      console.log("Time's up!");
    }
  }, 1000);
}

//function to pause the timer
function pauseTimer() {
    paused = true;
    chrome.storage.local.set({ paused });
}

//function to resume the timer
function resumeTimer() {
    if (!timerInterval && timerSeconds > 0) {
        paused = false;
        chrome.storage.local.set({ paused });
        startTimer();
    } else if (paused) {
        paused = false;
        chrome.storage.local.set({ paused });
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start") {
    startTimer();
    sendResponse({ status: "started" });
  } else if (message.action === "pause") {
    pauseTimer();
    sendResponse({ status: "paused" });
  } else if (message.action === "resume") {
    resumeTimer();
    sendResponse({ status: "resumed" });
  }
});

