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
