let timerSeconds = 60; // 1 minute
let timerInterval = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ timerSeconds });
});

// Start the timer
function startTimer() {
  if (timerInterval) return; // prevent multiple intervals
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      chrome.storage.local.set({ timerSeconds }); // save progress
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      console.log("Time's up!");
    }
  }, 1000);
}

// Start the timer automatically on install or popup open
startTimer();
