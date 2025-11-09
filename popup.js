
document.addEventListener("DOMContentLoaded", () => {
  
  const backupQuotes = [
    "Stay focused. You got this.",
    "Small steps every day lead to big results.",
    "Your attention is your power."
  ];

  function getRandomBackupQuote() {
    const randomIndex = Math.floor(Math.random() * backupQuotes.length);
    return backupQuotes[randomIndex];
  }

  fetch("https://zenquotes.io/api/random")
    .then(res => res.json())
    .then(data => {
      const quote = data[0].q;
      const author = data[0].a;
      document.getElementById("quote").innerText = `"${quote}" - ${author}`;
    })
    .catch(() => {
      document.getElementById("quote").innerText = getRandomBackupQuote();
    });

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

  const siteInput = document.getElementById("site-input");
  const addSiteBtn = document.getElementById("add-site-btn");
  const blockedSitesList = document.getElementById("blocked-sites-list");

  loadAndDisplayBlocklist();

  addSiteBtn.addEventListener("click", async () => {
    const site = siteInput.value;
    
    if (site) {
      // Get the current list from storage
      const result = await chrome.storage.local.get(["blockList"]);
      const blockList = result.blockList || []; // Use empty list if it doesn't exist yet
      
      // Cleans up the input
      const formattedSite = site.replace("https://", "").replace("http://", "").replace("www.", "").split('/')[0];

      // Add the site to the list ONLY if it's not already there
      if (formattedSite && !blockList.includes(formattedSite)) {
        blockList.push(formattedSite);
        
        // Save the new, updated list back to storage
        await chrome.storage.local.set({ blockList: blockList });
        
        // Clear the input box
        siteInput.value = "";
        loadAndDisplayBlocklist();
      }
    }
  });

  // This function loads the list from storage
  async function loadAndDisplayBlocklist() {
    const result = await chrome.storage.local.get(["blockList"]);
    const blockList = result.blockList || [];
    
    blockedSitesList.innerHTML = "";
    
    // Add each site to the HTML as a list item
    blockList.forEach(site => {
      const li = document.createElement("li");
      li.textContent = site;
      blockedSitesList.appendChild(li);
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("timerDisplay");
    const minutesInput = document.getElementById("minutesInput");

    // timer display update function
    function updateDisplay(timerSeconds) {
        if (!display) return; // safety guard
        let minutes = Math.floor(timerSeconds / 60);
        let seconds = timerSeconds % 60;
        display.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    // button listener functions
    document.getElementById("startButton").addEventListener("click", () => {
        const minutes = parseInt(minutesInput.value, 10);
        const totalSeconds = minutes * 60;
        chrome.runtime.sendMessage({ action: "start", totalSeconds });
    });

    document.getElementById("pauseButton").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "pause" });
    });

    document.getElementById("resumeButton").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "resume" });
    });

    // update display live
    chrome.storage.local.get("timerSeconds", (data) => {
        if (data.timerSeconds !== undefined) updateDisplay(data.timerSeconds);
    });

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "local" && changes.timerSeconds) {
        updateDisplay(changes.timerSeconds.newValue);
        }
    });
});

});
