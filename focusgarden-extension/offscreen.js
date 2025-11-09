// single audio instance
const audio = new Audio(chrome.runtime.getURL("lofi.mp3"));
audio.loop = true;

// listen for toggle messages
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "toggleMusic") {
    if (audio.paused) {
      audio.play().catch(err => console.log("Playback blocked:", err));
    } else {
      audio.pause();
    }
  }
});
