
console.log("Playlist offscreen script loaded.");


const songList = [
  "music/girl.mp3",
  "music/goodnight.mp3",
  "music/lofi.mp3",
  "music/morning.mp3",
  "music/rainy.mp3"

];

let currentSongIndex = 0;
const audio = new Audio();
audio.loop = false; // We turn this off so the 'ended' event will fire

// Function to play a song
function playSong(songIndex) {
  audio.src = chrome.runtime.getURL(songList[songIndex]);
  audio.play().catch(err => console.error("Playback error:", err));
  console.log("Now playing:", songList[songIndex]);

  chrome.runtime.sendMessage({ 
    type: "music-state-changed", 
    isPlaying: true 
  });
}

audio.addEventListener('ended', () => {
  // When a song finishes, play the next one
  console.log("Song ended, playing next.");
  currentSongIndex++;
  // If we've gone past the end of the list, loop back to the start
  if (currentSongIndex >= songList.length) {
    currentSongIndex = 0;
  }
  playSong(currentSongIndex);
});


chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === "offscreen-toggle") {
    if (audio.paused) {
      playSong(currentSongIndex); // Play the current song
    } else {
      audio.pause();
      // Report the state back to background.js
      chrome.runtime.sendMessage({ 
        type: "music-state-changed", 
        isPlaying: false 
      });
    }
  }
  return true;
});

