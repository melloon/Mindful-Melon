document.addEventListener("DOMContentLoaded", async () => {
    const waterBtn = document.getElementById("waterButton");
    const petBtn = document.getElementById("petButton");

    // Add melon image to garden if missing
    let melonImg = document.getElementById("melon-img");
    if (!melonImg) {
        melonImg = document.createElement("img");
        melonImg.id = "melon-img";
        melonImg.src = "Images/HappyMelonswing.png";
        melonImg.style.width = "575px";
        melonImg.style.position = "absolute";
        melonImg.style.left = "50%";
        melonImg.style.transform = "translateX(-50%)";
        melonImg.style.top = "-30px";
        document.body.appendChild(melonImg);
    }

    // ------- Refresh melon state -------
    async function refreshState() {
        const s = await chrome.storage.local.get([
            "warnings",
            "melonDead",
            "inSession",
            "lastSessionCompleted"
        ]);
        const { warnings = 0, melonDead, inSession, lastSessionCompleted } = s;

        // Choose melon image by health
        if (melonDead || warnings >= 4) melonImg.src = "Images/DeadMelonswing.png";
        else if (warnings === 3) melonImg.src = "Images/DecayingMelonswing.PNG";
        else if (warnings === 2) melonImg.src = "Images/SickMelonswing.PNG";
        else melonImg.src = "Images/HappyMelonswing.png";

        // Water only allowed if last session completed and melon alive
        if (melonDead || inSession || !lastSessionCompleted) {
            waterBtn.style.opacity = 0.5;
            waterBtn.style.pointerEvents = "none";
        } else {
            waterBtn.style.opacity = 1;
            waterBtn.style.pointerEvents = "auto";
        }

        // Pet always allowed if melon alive
        if (melonDead) {
            petBtn.style.opacity = 0.5;
            petBtn.style.pointerEvents = "none";
        } else {
            petBtn.style.opacity = 1;
            petBtn.style.pointerEvents = "auto";
        }
    }

    // --- Pet Button ---
    petBtn.addEventListener("click", async () => {
        const { melonDead } = await chrome.storage.local.get("melonDead");
        if (melonDead) return;

        // Temporarily switch to "petted" image (replace filename when you add it)
        const original = melonImg.src;
        melonImg.src = "Images/Untitled147_20251108195530swing.png"; // <- new image you'll add

        setTimeout(() => {
            refreshState();
        }, 800);
    });

    // --- Water Button ---
    waterBtn.addEventListener("click", async () => {
        const { melonDead, lastSessionCompleted } = await chrome.storage.local.get([
            "melonDead",
            "lastSessionCompleted"
        ]);
        if (melonDead) return;
        if (!lastSessionCompleted) {
            alert("You can only water the melon after finishing a study session!");
            return;
        }

        // Temporarily switch to "watered" image (replace filename when you add it)
        melonImg.src = "Images/Untitled147_20251108172805swing.png"; // <- new image you'll add

        setTimeout(async () => {
            await chrome.storage.local.set({ lastSessionCompleted: false });
            refreshState();
        }, 1000);
    });

    // --- Listen for updates from background.js ---
    chrome.runtime.onMessage.addListener((msg) => {
        if (
            ["warnings-updated", "melon-dead", "session-finished", "session-started"].includes(
                msg.type
            )
        ) {
            refreshState();
        }
    });

    // Initial setup
    refreshState();
});