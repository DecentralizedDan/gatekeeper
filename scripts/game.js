/**
 * Game logic and state management for the Gatekeeper educational app
 */
import { getStepInfo, checkAnswer, decimalToBinary, getHint, } from "./binary.js";
export class GameManager {
    constructor() {
        this.listeners = new Map();
        this.config = {
            autoAdvance: true,
            showHints: true,
            soundEnabled: true,
        };
        this.state = this.initializeState();
    }
    /**
     * Initialize the game state
     */
    initializeState() {
        const stepInfo = getStepInfo(0);
        const targetBinary = decimalToBinary(stepInfo.currentNumber);
        return {
            currentStep: 0,
            targetNumber: stepInfo.currentNumber,
            userBinary: "0".repeat(targetBinary.bitCount),
            isCorrect: null,
            isEvaluated: false,
            totalSteps: stepInfo.totalSteps,
            stepNumber: stepInfo.stepNumber,
            hint: getHint(stepInfo.currentNumber),
        };
    }
    /**
     * Get the current game state
     */
    getState() {
        return { ...this.state };
    }
    /**
     * Get the current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Update the user's binary input
     */
    updateBinary(binary) {
        this.state.userBinary = binary;
        this.state.isEvaluated = false;
        this.state.isCorrect = null;
        this.emit("binaryUpdated", this.state);
    }
    /**
     * Toggle a specific bit in the binary input
     */
    toggleBit(index) {
        if (index < 0 || index >= this.state.userBinary.length) {
            return;
        }
        const binaryArray = this.state.userBinary.split("");
        binaryArray[index] = binaryArray[index] === "0" ? "1" : "0";
        const newBinary = binaryArray.join("");
        this.updateBinary(newBinary);
    }
    /**
     * Evaluate the current binary input
     */
    evaluate() {
        const isCorrect = checkAnswer(this.state.userBinary, this.state.targetNumber);
        this.state.isCorrect = isCorrect;
        this.state.isEvaluated = true;
        this.emit("evaluated", { ...this.state, isCorrect });
        // Auto-advance if enabled and correct
        if (this.config.autoAdvance && isCorrect) {
            setTimeout(() => this.nextStep(), 1000);
        }
        return isCorrect;
    }
    /**
     * Move to the next step
     */
    nextStep() {
        if (this.state.currentStep >= this.state.totalSteps - 1) {
            this.emit("gameComplete", this.state);
            return;
        }
        this.state.currentStep++;
        const stepInfo = getStepInfo(this.state.currentStep);
        const targetBinary = decimalToBinary(stepInfo.currentNumber);
        this.state.targetNumber = stepInfo.currentNumber;
        this.state.userBinary = "0".repeat(targetBinary.bitCount);
        this.state.isCorrect = null;
        this.state.isEvaluated = false;
        this.state.stepNumber = stepInfo.stepNumber;
        this.state.hint = getHint(stepInfo.currentNumber);
        this.emit("stepChanged", this.state);
    }
    /**
     * Move to the previous step
     */
    previousStep() {
        if (this.state.currentStep <= 0) {
            return;
        }
        this.state.currentStep--;
        const stepInfo = getStepInfo(this.state.currentStep);
        const targetBinary = decimalToBinary(stepInfo.currentNumber);
        this.state.targetNumber = stepInfo.currentNumber;
        this.state.userBinary = "0".repeat(targetBinary.bitCount);
        this.state.isCorrect = null;
        this.state.isEvaluated = false;
        this.state.stepNumber = stepInfo.stepNumber;
        this.state.hint = getHint(stepInfo.currentNumber);
        this.emit("stepChanged", this.state);
    }
    /**
     * Jump to a specific step
     */
    goToStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.state.totalSteps) {
            return;
        }
        this.state.currentStep = stepIndex;
        const stepInfo = getStepInfo(stepIndex);
        const targetBinary = decimalToBinary(stepInfo.currentNumber);
        this.state.targetNumber = stepInfo.currentNumber;
        this.state.userBinary = "0".repeat(targetBinary.bitCount);
        this.state.isCorrect = null;
        this.state.isEvaluated = false;
        this.state.stepNumber = stepInfo.stepNumber;
        this.state.hint = getHint(stepInfo.currentNumber);
        this.emit("stepChanged", this.state);
    }
    /**
     * Reset the current step
     */
    resetStep() {
        const targetBinary = decimalToBinary(this.state.targetNumber);
        this.state.userBinary = "0".repeat(targetBinary.bitCount);
        this.state.isCorrect = null;
        this.state.isEvaluated = false;
        this.emit("stepReset", this.state);
    }
    /**
     * Reset the entire game
     */
    resetGame() {
        this.state = this.initializeState();
        this.emit("gameReset", this.state);
    }
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.emit("configUpdated", this.config);
    }
    /**
     * Get progress percentage
     */
    getProgress() {
        return ((this.state.currentStep + 1) / this.state.totalSteps) * 100;
    }
    /**
     * Check if the game is complete
     */
    isGameComplete() {
        return (this.state.currentStep >= this.state.totalSteps - 1 &&
            this.state.isCorrect === true);
    }
    /**
     * Get statistics
     */
    getStats() {
        return {
            completedSteps: this.state.currentStep + 1,
            totalSteps: this.state.totalSteps,
            progress: this.getProgress(),
        };
    }
    /**
     * Event listener management
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    off(event, callback) {
        if (!this.listeners.has(event)) {
            return;
        }
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }
    emit(event, data) {
        if (!this.listeners.has(event)) {
            return;
        }
        this.listeners.get(event).forEach((callback) => {
            try {
                callback(data);
            }
            catch (error) {
                console.error(`Error in event listener for ${event}:`, error);
            }
        });
    }
}
// Export a singleton instance
export const gameManager = new GameManager();
//# sourceMappingURL=game.js.map