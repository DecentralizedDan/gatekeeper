// UI interactions for Gatekeeper
import { gameManager, progression } from "./game.js";

const targetNumberEl = document.getElementById("target-number");
const progressTextEl = document.getElementById("progress-text");
const signedBitEl = document.getElementById("signed-bit-explanation");
const binaryDisplayEl = document.getElementById("binary-display");
const resultDisplayEl = document.getElementById("result-display");
const resultTextEl = resultDisplayEl.querySelector(".result-text");
const checkButton = document.getElementById("check-button");
const toggleSound = document.getElementById("toggle-sound");

function render() {
  const state = gameManager.getState();
  // Target number
  targetNumberEl.textContent = state.target;
  if (state.target < 0) {
    targetNumberEl.classList.add("negative");
    signedBitEl.style.display = "";
  } else {
    targetNumberEl.classList.remove("negative");
    signedBitEl.style.display = "none";
  }
  // Progress
  const progress = gameManager.getProgress();
  progressTextEl.textContent = `Question ${progress.current} of ${progress.total}`;
  // Binary digits
  renderBinaryDigits(state);
  // Result
  resultTextEl.textContent =
    "Click binary digits to toggle between 0 and 1, then press Check";
  resultDisplayEl.className = "result-display";
  // Button
  checkButton.textContent = "Check";
}

function renderBinaryDigits(state) {
  binaryDisplayEl.innerHTML = "";
  const bitCount = state.userBinary.length;
  for (let i = 0; i < bitCount; i++) {
    const digit = document.createElement("div");
    digit.className = "binary-digit";
    digit.textContent = state.userBinary[i];
    digit.setAttribute("tabindex", "0");
    if (state.isNegative && i === 0) {
      digit.classList.add("sign-bit");
    }
    digit.addEventListener("click", () => {
      gameManager.toggleBit(i);
      playToggleSound();
      digit.classList.add("toggle");
      setTimeout(() => digit.classList.remove("toggle"), 100);
      renderBinaryDigits(gameManager.getState());
    });
    digit.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        gameManager.toggleBit(i);
        playToggleSound();
        digit.classList.add("toggle");
        setTimeout(() => digit.classList.remove("toggle"), 100);
        renderBinaryDigits(gameManager.getState());
      }
    });
    binaryDisplayEl.appendChild(digit);
  }
}

function playToggleSound() {
  if (toggleSound) {
    toggleSound.currentTime = 0;
    toggleSound.play();
  }
}

// Initial render
render();

// Expose render for other modules
window.gatekeeperRender = render;
