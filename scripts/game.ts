/**
 * Game logic and state management for the Gatekeeper educational app
 */

import {
  getStepInfo,
  checkAnswer,
  decimalToBinary,
  getHint,
} from "./binary.js";

export interface GameState {
  currentStep: number;
  targetNumber: number;
  userBinary: string;
  isCorrect: boolean | null;
  isEvaluated: boolean;
  totalSteps: number;
  stepNumber: number;
  hint: string;
}

export interface GameConfig {
  autoAdvance: boolean;
  showHints: boolean;
  soundEnabled: boolean;
}

export class GameManager {
  private state: GameState;
  private config: GameConfig;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
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
  private initializeState(): GameState {
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
  getState(): GameState {
    return { ...this.state };
  }

  /**
   * Get the current configuration
   */
  getConfig(): GameConfig {
    return { ...this.config };
  }

  /**
   * Update the user's binary input
   */
  updateBinary(binary: string): void {
    this.state.userBinary = binary;
    this.state.isEvaluated = false;
    this.state.isCorrect = null;
    this.emit("binaryUpdated", this.state);
  }

  /**
   * Toggle a specific bit in the binary input
   */
  toggleBit(index: number): void {
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
  evaluate(): boolean {
    const isCorrect = checkAnswer(
      this.state.userBinary,
      this.state.targetNumber
    );

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
  nextStep(): void {
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
  previousStep(): void {
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
  goToStep(stepIndex: number): void {
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
  resetStep(): void {
    const targetBinary = decimalToBinary(this.state.targetNumber);
    this.state.userBinary = "0".repeat(targetBinary.bitCount);
    this.state.isCorrect = null;
    this.state.isEvaluated = false;

    this.emit("stepReset", this.state);
  }

  /**
   * Reset the entire game
   */
  resetGame(): void {
    this.state = this.initializeState();
    this.emit("gameReset", this.state);
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<GameConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit("configUpdated", this.config);
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    return ((this.state.currentStep + 1) / this.state.totalSteps) * 100;
  }

  /**
   * Check if the game is complete
   */
  isGameComplete(): boolean {
    return (
      this.state.currentStep >= this.state.totalSteps - 1 &&
      this.state.isCorrect === true
    );
  }

  /**
   * Get statistics
   */
  getStats(): { completedSteps: number; totalSteps: number; progress: number } {
    return {
      completedSteps: this.state.currentStep + 1,
      totalSteps: this.state.totalSteps,
      progress: this.getProgress(),
    };
  }

  /**
   * Event listener management
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      return;
    }
    const callbacks = this.listeners.get(event)!;
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  private emit(event: string, data: any): void {
    if (!this.listeners.has(event)) {
      return;
    }
    this.listeners.get(event)!.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }
}

// Export a singleton instance
export const gameManager = new GameManager();
