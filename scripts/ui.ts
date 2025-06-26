/**
 * User interface interactions for the Gatekeeper educational app
 */

import { gameManager, GameState } from "./game.js";
import { formatBinary } from "./binary.js";

export class UI {
  private elements: {
    targetNumber: HTMLElement;
    binaryDisplay: HTMLElement;
    resultDisplay: HTMLElement;
    resultText: HTMLElement;
    evaluateBtn: HTMLButtonElement;
    nextBtn: HTMLButtonElement;
    progressFill: HTMLElement;
    progressText: HTMLElement;
  };

  constructor() {
    this.elements = this.initializeElements();
    this.bindEvents();
    this.setupGameListeners();
    this.updateUI(gameManager.getState());
  }

  /**
   * Initialize DOM element references
   */
  private initializeElements() {
    const resultTextElement = document.querySelector(
      "#result-display .result-text"
    );
    if (!resultTextElement) {
      throw new Error("Result text element not found");
    }

    return {
      targetNumber: document.getElementById("target-number")!,
      binaryDisplay: document.getElementById("binary-display")!,
      resultDisplay: document.getElementById("result-display")!,
      resultText: resultTextElement as HTMLElement,
      evaluateBtn: document.getElementById("evaluate-btn") as HTMLButtonElement,
      nextBtn: document.getElementById("next-btn") as HTMLButtonElement,
      progressFill: document.getElementById("progress-fill")!,
      progressText: document.getElementById("progress-text")!,
    };
  }

  /**
   * Bind event listeners
   */
  private bindEvents(): void {
    // Evaluate button
    this.elements.evaluateBtn.addEventListener("click", () => {
      this.handleEvaluate();
    });

    // Next button
    this.elements.nextBtn.addEventListener("click", () => {
      this.handleNext();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleKeyboard(e);
    });

    // Prevent context menu on binary digits
    this.elements.binaryDisplay.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  /**
   * Setup game state listeners
   */
  private setupGameListeners(): void {
    gameManager.on("stepChanged", (state: GameState) => {
      this.updateUI(state);
    });

    gameManager.on("evaluated", (state: GameState) => {
      this.updateResult(state);
    });

    gameManager.on("stepReset", (state: GameState) => {
      this.updateUI(state);
    });

    gameManager.on("gameComplete", () => {
      this.showGameComplete();
    });

    gameManager.on("binaryUpdated", (state: GameState) => {
      this.updateUI(state);
    });
  }

  /**
   * Update the entire UI based on game state
   */
  public updateUI(state: GameState): void {
    this.updateTargetNumber(state.targetNumber);
    this.updateBinaryDisplay(state.userBinary, state.targetNumber);
    this.updateResult(state);
    this.updateProgress(state);
    this.updateButtons(state);
  }

  /**
   * Update the target number display
   */
  private updateTargetNumber(number: number): void {
    this.elements.targetNumber.textContent = number.toString();

    // Add visual emphasis for negative numbers
    if (number < 0) {
      this.elements.targetNumber.classList.add("negative");
    } else {
      this.elements.targetNumber.classList.remove("negative");
    }
  }

  /**
   * Update the binary display
   */
  private updateBinaryDisplay(binary: string, targetNumber: number): void {
    if (!binary || binary.length === 0) {
      this.elements.binaryDisplay.innerHTML = "";
      return;
    }

    const isSigned = targetNumber < 0;
    const digits = binary.split("");
    const existingDigits = this.elements.binaryDisplay.children;

    // If we have the right number of existing digits, just update their values
    if (existingDigits.length === digits.length) {
      for (let i = 0; i < digits.length; i++) {
        const digitElement = existingDigits[i] as HTMLElement;
        const currentValue = digitElement.getAttribute("data-value") || "";
        const newValue = digits[i] || "0";

        if (currentValue !== newValue) {
          digitElement.setAttribute("data-value", newValue);
          digitElement.textContent = newValue;
          digitElement.setAttribute(
            "aria-label",
            `Binary digit ${i + 1}: ${newValue}`
          );
        }
      }
    } else {
      // Recreate all digits if the count changed
      this.elements.binaryDisplay.innerHTML = "";
      digits.forEach((digit, index) => {
        const digitElement = this.createBinaryDigit(digit, index, isSigned);
        this.elements.binaryDisplay.appendChild(digitElement);
      });
    }
  }

  /**
   * Create a binary digit element
   */
  private createBinaryDigit(
    value: string,
    index: number,
    isSigned: boolean
  ): HTMLElement {
    const digit = document.createElement("div");
    digit.className = "binary-digit";
    digit.setAttribute("data-value", value);
    digit.setAttribute("data-index", index.toString());
    digit.setAttribute("role", "button");
    digit.setAttribute("tabindex", "0");
    digit.setAttribute("aria-label", `Binary digit ${index + 1}: ${value}`);
    digit.textContent = value;

    // Add click handler
    digit.addEventListener("click", () => {
      this.handleDigitClick(index);
    });

    // Add keyboard handler
    digit.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.handleDigitClick(index);
      }
    });

    // Add visual feedback for signed numbers
    if (isSigned && index === 0) {
      digit.setAttribute("aria-label", `Sign bit (most significant): ${value}`);
      digit.classList.add("sign-bit");
    }

    return digit;
  }

  /**
   * Handle binary digit click
   */
  private handleDigitClick(index: number): void {
    const digit = this.elements.binaryDisplay.children[index] as HTMLElement;

    // Add toggle animation
    digit.classList.add("toggle");
    setTimeout(() => {
      digit.classList.remove("toggle");
    }, 200);

    // Update game state
    gameManager.toggleBit(index);
  }

  /**
   * Update the result display
   */
  private updateResult(state: GameState): void {
    const resultDisplay = this.elements.resultDisplay;
    const resultText = this.elements.resultText;

    if (!state.isEvaluated) {
      resultDisplay.className = "result-display";
      resultText.textContent = "Click Evaluate to check your answer";
      return;
    }

    if (state.isCorrect) {
      resultDisplay.className = "result-display correct";
      resultText.textContent = `Correct! ${formatBinary(state.userBinary)} = ${
        state.targetNumber
      }`;
    } else {
      resultDisplay.className = "result-display incorrect";
      const calculatedValue = this.calculateUserValue(
        state.userBinary,
        state.targetNumber
      );
      resultText.textContent = `Incorrect. ${formatBinary(
        state.userBinary
      )} = ${calculatedValue}, not ${state.targetNumber}`;
    }
  }

  /**
   * Calculate the decimal value of user's binary input
   */
  private calculateUserValue(binary: string, targetNumber: number): number {
    const isSigned = targetNumber < 0;
    let decimal = 0;

    if (isSigned) {
      // Handle signed numbers using two's complement
      const firstBit = binary[0];
      if (firstBit === "1") {
        // Negative number
        const inverted = binary
          .split("")
          .map((bit) => (bit === "0" ? "1" : "0"))
          .join("");
        const invertedDecimal = parseInt(inverted, 2);
        decimal = -(invertedDecimal + 1);
      } else {
        // Positive number
        decimal = parseInt(binary, 2);
      }
    } else {
      // Unsigned number
      decimal = parseInt(binary, 2);
    }

    return decimal;
  }

  /**
   * Update progress bar and text
   */
  private updateProgress(state: GameState): void {
    const progress = gameManager.getProgress();
    this.elements.progressFill.style.width = `${progress}%`;
    this.elements.progressText.textContent = `Step ${state.stepNumber} of ${state.totalSteps}`;
  }

  /**
   * Update button states
   */
  private updateButtons(state: GameState): void {
    // Evaluate button
    this.elements.evaluateBtn.disabled =
      state.isEvaluated && state.isCorrect === true;

    // Next button
    if (state.isCorrect === true) {
      this.elements.nextBtn.style.display = "inline-block";
    } else {
      this.elements.nextBtn.style.display = "none";
    }
  }

  /**
   * Handle evaluate button click
   */
  private handleEvaluate(): void {
    const state = gameManager.getState();
    if (state.isEvaluated && state.isCorrect === true) {
      return;
    }

    this.elements.evaluateBtn.disabled = true;
    gameManager.evaluate();

    // Re-enable button after a short delay
    setTimeout(() => {
      this.elements.evaluateBtn.disabled = false;
    }, 1000);
  }

  /**
   * Handle next button click
   */
  private handleNext(): void {
    gameManager.nextStep();
  }

  /**
   * Handle keyboard shortcuts
   */
  private handleKeyboard(e: KeyboardEvent): void {
    // Only handle shortcuts when not typing in input fields
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        this.handleEvaluate();
        break;
      case "ArrowRight":
        e.preventDefault();
        if (gameManager.getState().isCorrect === true) {
          this.handleNext();
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        gameManager.previousStep();
        break;
      case "r":
      case "R":
        e.preventDefault();
        gameManager.resetStep();
        break;
    }
  }

  /**
   * Show game completion message
   */
  private showGameComplete(): void {
    const resultDisplay = this.elements.resultDisplay;
    const resultText = this.elements.resultText;

    resultDisplay.className = "result-display correct";
    resultText.innerHTML = `
            🎉 Congratulations! You've completed all the binary counting challenges!<br>
            <small>You can restart the game or review any step.</small>
        `;

    this.elements.nextBtn.textContent = "Restart Game";
    this.elements.nextBtn.onclick = () => {
      gameManager.resetGame();
      this.elements.nextBtn.textContent = "Next Number";
      this.elements.nextBtn.onclick = () => this.handleNext();
    };
  }

  /**
   * Show a temporary message
   */
  showMessage(
    message: string,
    type: "info" | "success" | "error" = "info",
    duration: number = 3000
  ): void {
    const messageElement = document.createElement("div");
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;

    document.body.appendChild(messageElement);

    // Trigger animation
    setTimeout(() => {
      messageElement.classList.add("show");
    }, 10);

    // Remove after duration
    setTimeout(() => {
      messageElement.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(messageElement);
      }, 300);
    }, duration);
  }

  /**
   * Focus management
   */
  focusBinaryDigit(index: number): void {
    const digits = this.elements.binaryDisplay.children;
    if (index >= 0 && index < digits.length) {
      (digits[index] as HTMLElement).focus();
    }
  }

  /**
   * Accessibility: Announce result to screen readers
   */
  announceResult(message: string): void {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Initialize UI when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new UI();
});
