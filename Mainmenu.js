
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("toggleMusic");

  // Check storage for music state
  chrome.storage.local.get(["isMusicPlaying"], (result) => {
    if (result.isMusicPlaying) {
      btn.innerText = "🔇 Pause Music";
    } else {
      btn.innerText = "🎵 Chill Vibes";
    }
  });
  
  // Add click listener
  btn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "popup-toggle" });
    btn.innerText = btn.innerText === "🎵 Chill Vibes" ? "🔇 Pause Music" : "🎵 Chill Vibes";
  });
});