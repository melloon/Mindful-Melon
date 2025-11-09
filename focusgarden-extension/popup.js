// Backup quotes custom from Goofy Goobers
document.addEventListener("DOMContentLoaded", () => {
  const backupQuotes = [
    "Stay focused. You got this.",
    "Small steps every day lead to big results.",
    "Your attention is your power."
  
];

// Function to pick a random backup quote
  function getRandomBackupQuote() {
    const randomIndex = Math.floor(Math.random() * backupQuotes.length);
    return backupQuotes[randomIndex];
}

// Fetch a random quote from the API
  fetch("https://zenquotes.io/api/random")
    .then(res => res.json())
    .then(data => {
      const quote = data[0].q;
      const author = data[0].a;
      document.getElementById("quote").innerText = `"${quote}" - ${author}`;
  })
  // If the API fails, pick a random backup quote
    .catch(() => {
      document.getElementById("quote").innerText = getRandomBackupQuote();
  });

  const btn = document.getElementById("toggleMusic");
  chrome.storage.local.get(["isMusicPlaying"], (result) => {
    if (result.isMusicPlaying) {
      btn.innerText = "🔇 Pause Music";
    } else {
      btn.innerText = "🎵 Chill Vibes" ;
    }
  });
btn.addEventListener("click", () => {
  
  chrome.runtime.sendMessage({ type: "popup-toggle" });

  btn.innerText = btn.innerText === "🎵 Chill Vibes" ? "🔇 Pause Music" : "🎵 Chill Vibes";
  });
});
