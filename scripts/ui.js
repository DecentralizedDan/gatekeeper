/**
 * User interface interactions for the Gatekeeper educational app
 */
import { gameManager } from "./game.js";
import { formatBinary } from "./binary.js";
export class UI {
    constructor() {
        this.elements = this.initializeElements();
        this.bindEvents();
        this.setupGameListeners();
        this.updateUI(gameManager.getState());
    }
    /**
     * Initialize DOM element references
     */
    initializeElements() {
        const resultTextElement = document.querySelector("#result-display .result-text");
        if (!resultTextElement) {
            throw new Error("Result text element not found");
        }
        return {
            targetNumber: document.getElementById("target-number"),
            binaryDisplay: document.getElementById("binary-display"),
            resultDisplay: document.getElementById("result-display"),
            resultText: resultTextElement,
            evaluateBtn: document.getElementById("evaluate-btn"),
            nextBtn: document.getElementById("next-btn"),
            progressFill: document.getElementById("progress-fill"),
            progressText: document.getElementById("progress-text"),
        };
    }
    /**
     * Bind event listeners
     */
    bindEvents() {
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
    setupGameListeners() {
        gameManager.on("stepChanged", (state) => {
            this.updateUI(state);
        });
        gameManager.on("evaluated", (state) => {
            this.updateResult(state);
        });
        gameManager.on("stepReset", (state) => {
            this.updateUI(state);
        });
        gameManager.on("gameComplete", () => {
            this.showGameComplete();
        });
        gameManager.on("binaryUpdated", (state) => {
            this.updateUI(state);
        });
    }
    /**
     * Update the entire UI based on game state
     */
    updateUI(state) {
        this.updateTargetNumber(state.targetNumber);
        this.updateBinaryDisplay(state.userBinary, state.targetNumber);
        this.updateResult(state);
        this.updateProgress(state);
        this.updateButtons(state);
    }
    /**
     * Update the target number display
     */
    updateTargetNumber(number) {
        this.elements.targetNumber.textContent = number.toString();
        // Add visual emphasis for negative numbers
        if (number < 0) {
            this.elements.targetNumber.classList.add("negative");
        }
        else {
            this.elements.targetNumber.classList.remove("negative");
        }
    }
    /**
     * Update the binary display
     */
    updateBinaryDisplay(binary, targetNumber) {
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
                const digitElement = existingDigits[i];
                const currentValue = digitElement.getAttribute("data-value") || "";
                const newValue = digits[i] || "0";
                if (currentValue !== newValue) {
                    digitElement.setAttribute("data-value", newValue);
                    digitElement.textContent = newValue;
                    digitElement.setAttribute("aria-label", `Binary digit ${i + 1}: ${newValue}`);
                }
            }
        }
        else {
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
    createBinaryDigit(value, index, isSigned) {
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
    handleDigitClick(index) {
        const digit = this.elements.binaryDisplay.children[index];
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
    updateResult(state) {
        const resultDisplay = this.elements.resultDisplay;
        const resultText = this.elements.resultText;
        if (!state.isEvaluated) {
            resultDisplay.className = "result-display";
            resultText.textContent = "Click Evaluate to check your answer";
            return;
        }
        if (state.isCorrect) {
            resultDisplay.className = "result-display correct";
            resultText.textContent = `Correct! ${formatBinary(state.userBinary)} = ${state.targetNumber}`;
        }
        else {
            resultDisplay.className = "result-display incorrect";
            const calculatedValue = this.calculateUserValue(state.userBinary, state.targetNumber);
            resultText.textContent = `Incorrect. ${formatBinary(state.userBinary)} = ${calculatedValue}, not ${state.targetNumber}`;
        }
    }
    /**
     * Calculate the decimal value of user's binary input
     */
    calculateUserValue(binary, targetNumber) {
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
            }
            else {
                // Positive number
                decimal = parseInt(binary, 2);
            }
        }
        else {
            // Unsigned number
            decimal = parseInt(binary, 2);
        }
        return decimal;
    }
    /**
     * Update progress bar and text
     */
    updateProgress(state) {
        const progress = gameManager.getProgress();
        this.elements.progressFill.style.width = `${progress}%`;
        this.elements.progressText.textContent = `Step ${state.stepNumber} of ${state.totalSteps}`;
    }
    /**
     * Update button states
     */
    updateButtons(state) {
        // Evaluate button
        this.elements.evaluateBtn.disabled =
            state.isEvaluated && state.isCorrect === true;
        // Next button
        if (state.isCorrect === true) {
            this.elements.nextBtn.style.display = "inline-block";
        }
        else {
            this.elements.nextBtn.style.display = "none";
        }
    }
    /**
     * Handle evaluate button click
     */
    handleEvaluate() {
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
    handleNext() {
        gameManager.nextStep();
    }
    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(e) {
        // Only handle shortcuts when not typing in input fields
        if (e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement) {
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
    showGameComplete() {
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
    showMessage(message, type = "info", duration = 3000) {
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
    focusBinaryDigit(index) {
        const digits = this.elements.binaryDisplay.children;
        if (index >= 0 && index < digits.length) {
            digits[index].focus();
        }
    }
    /**
     * Accessibility: Announce result to screen readers
     */
    announceResult(message) {
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
//# sourceMappingURL=ui.js.map