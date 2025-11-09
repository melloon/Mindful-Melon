const display = document.getElementById("timerDisplay");

function updateDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rem = seconds % 60;
  display.textContent = `${minutes}:${rem.toString().padStart(2, "0")}`;
}

// --- Button listeners ---
document.getElementById("startButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "start" });
});

document.getElementById("pauseButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "pause" });
});

document.getElementById("resumeButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "resume" });
});

// --- Update timer display live ---
chrome.storage.local.get("timerSeconds", (data) => {
  if (data.timerSeconds !== undefined) updateDisplay(data.timerSeconds);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.timerSeconds) {
    updateDisplay(changes.timerSeconds.newValue);
  }
});
