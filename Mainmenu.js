document.addEventListener("DOMContentLoaded", () => {
  
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
});