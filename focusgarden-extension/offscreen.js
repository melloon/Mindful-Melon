// single audio instance
console.log
const audio = new Audio(chrome.runtime.getURL("lofi.mp3"));
audio.loop = true;

// listen for toggle messages
chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === "offscreen-toggle") {
    if (audio.paused) {
        await audio.play().catch(err => console.log("Playback blocked:", err));

        chrome.runtime.sendMessage({
            type: "music-state-changed",
            isPlaying: true
        });
        

    } else {
      audio.pause();
      
      chrome.runtime.sendMessage({
        type: "music-state-changed",
        isPlaying: false
      });
    }
}
return true;
});

