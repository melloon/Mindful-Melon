let timerMinutes = 1;
let timerSeconds = timerMinutes * 60;
const countdownElement = document.getElementById('timer');

const timerInterval = setInterval(countdownTimer, 1000); //calls countdownTimer every second

function countdownTimer() {
    let minutes = Math.floor(timerSeconds/60);
    let seconds = timerSeconds % 60;

    if (seconds < 10) {
        seconds = '0' + seconds; //adding a leading zero
    }
    //countdownElement.innerHTML = minutes + ':' + seconds; //display time
    console.log(minutes + ':' + seconds);
    timerSeconds--;
    if (timerSeconds < 0){
        console.log("Time's up!");
        clearInterval(timerInterval); //stops the timer
        return;
    }
}