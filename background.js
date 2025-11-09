/* // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmyf0kIpOGmjuGnCyzZwrSF6IZD6jV9Xs",
  authDomain: "mindful-melon.firebaseapp.com",
  projectId: "mindful-melon",
  storageBucket: "mindful-melon.firebasestorage.app",
  messagingSenderId: "939076341150",
  appId: "1:939076341150:web:ce7c2586fffc6425f81a8f",
  measurementId: "G-RRGNHB2N4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); */

let timerSeconds = 60; // 1 minute
let timerInterval = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ timerSeconds });
});

// Start the timer
function startTimer() {
  if (timerInterval) return; // prevent multiple intervals
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      chrome.storage.local.set({ timerSeconds }); // save progress
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      console.log("Time's up!");
    }
  }, 1000);
}

// Start the timer automatically on install or popup open
startTimer();
