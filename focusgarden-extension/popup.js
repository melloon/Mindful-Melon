// 1. Backup quotes you and your teammate can add to
const backupQuotes = [
  "Stay focused. You got this.",
  "Small steps every day lead to big results.",
  "Your attention is your power."
  
];

// 2. Function to pick a random backup quote
function getRandomBackupQuote() {
  const randomIndex = Math.floor(Math.random() * backupQuotes.length);
  return backupQuotes[randomIndex];
}

// 3. Fetch a random quote from the API
fetch("https://zenquotes.io/api/random")
  .then(res => res.json())
  .then(data => {
    const quote = data[0].q;
    const author = data[0].a;
    document.getElementById("quote").innerText = `"${quote}" - ${author}`;
  })
  // 4. If the API fails, pick a random backup quote
  .catch(() => {
    document.getElementById("quote").innerText = getRandomBackupQuote();
  });

  const audio = document.getElementById("lofi");
        const btn = document.getElementById("toggleMusic");

            btn.addEventListener("click", () => {
                if (audio.paused) {
                    audio.play().catch(err => {
                        console.log("Audio play blocked until user interacts.", err);
                    });
                    btn.innerText = "Pause Music";
                } else {
                    audio.pause();
                    btn.innerText = "Chill Vibes";
                }
            });
