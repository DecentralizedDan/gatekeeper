// Main entry for Gatekeeper
import "./ui.js";
import { gameManager, progression } from "./game.js";

const checkButton = document.getElementById("check-button");
const resultDisplayEl = document.getElementById("result-display");
const resultTextEl = resultDisplayEl.querySelector(".result-text");
const completionModal = document.getElementById("completion-modal");
const restartButton = document.getElementById("restart-button");

function updateUIAfterCheck() {
  const state = gameManager.getState();
  if (!state.checked) return;
  if (state.isCorrect) {
    resultDisplayEl.className = "result-display correct";
    resultTextEl.textContent = "Correct!";
    setTimeout(() => {
      if (state.currentIndex === progression.length - 1) {
        // Show completion modal
        completionModal.style.display = "";
      } else {
        gameManager.next();
        // Reset button text and update UI
        checkButton.textContent = "Check";
        window.gatekeeperRender();
      }
    }, 800);
  } else {
    resultDisplayEl.className = "result-display incorrect";
    // Show what the user's binary represents
    const userValue = getUserValue(state);
    resultTextEl.textContent = `Incorrect. Your binary = ${userValue}, not ${state.target}`;
    checkButton.textContent = "Try Again";
  }
}

function getUserValue(state) {
  const bitCount = state.userBinary.length;
  const binStr = state.userBinary.join("");
  if (state.target >= 0) {
    return parseInt(binStr, 2);
  } else {
    // two's complement
    if (binStr[0] === "1") {
      return parseInt(binStr, 2) - (1 << bitCount);
    } else {
      return parseInt(binStr, 2);
    }
  }
}

checkButton.addEventListener("click", () => {
  gameManager.check();
  updateUIAfterCheck();
});

restartButton.addEventListener("click", () => {
  completionModal.style.display = "none";
  gameManager.reset();
  window.gatekeeperRender();
});
