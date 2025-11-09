
document.addEventListener("DOMContentLoaded", () => {
  
  // Good Vibes Music
  const btn = document.getElementById("toggleMusic");

  chrome.storage.local.get(["isMusicPlaying"], (result) => {
    if (result.isMusicPlaying) {
      btn.innerText = "🔇 Pause Music";
    } else {
      btn.innerText = "🎵 Chill Vibes";
    }
  });
  
  btn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "popup-toggle" });
    btn.innerText = btn.innerText === "🎵 Chill Vibes" ? "🔇 Pause Music" : "🎵 Chill Vibes";
  });

  // Code for Timer
  const startButton = document.getElementById("startButton");
  const minutesInput = document.getElementById("minutesInput");
  const timerDisplay = document.getElementById("timerDisplay");

  startButton.addEventListener("click", () => {
    // Input
    let durationInMinutes = parseInt(minutesInput.value);

    // START the alarm
    chrome.runtime.sendMessage({ 
      type: "start-timer", 
      duration: durationInMinutes 
    });

    // Positive Reinforcement
    timerDisplay.textContent = "Timer set! You got this.";
    startButton.disabled = true; // Prevent double-clicking
  });
});