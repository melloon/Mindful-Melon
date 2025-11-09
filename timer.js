const countdownElement = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');
const stopButton = document.getElementById('stopButton');


function countdownTimer() {
    chrome.storage.local.get("timerSeconds", (data) => {
    let timerSeconds = data.timerSeconds ?? 0;
    const minutes = Math.floor(timerSeconds/60);
    let seconds = timerSeconds % 60;

    if (seconds < 10) {
        seconds = '0' + seconds; //adding a leading zero
    }
    countdownElement.innerHTML = minutes + ':' + seconds; //display time
    console.log(minutes + ':' + seconds);
    });
}

countdownTimer();
setInterval(countdownTimer, 1000);