// Game logic and state management for Gatekeeper
import { getMinimumBitCount } from "./binary.js";

const progression = [
  0, 1, 2, 3, 4, 6, 7, 8, 10, 12, 13, 15, 16, 20, 22, 24, 27, 30, 32, -1, -2,
  -4, -10, -16, -31, -32,
];

const gameManager = {
  state: {
    checked: false,
    currentIndex: 0,
    isCorrect: false,
    isNegative: false,
    userBinary: [],
  },
  getCurrentNumber() {
    return progression[this.state.currentIndex];
  },
  getProgress() {
    return {
      current: this.state.currentIndex + 1,
      total: progression.length,
    };
  },
  getState() {
    return { ...this.state, target: this.getCurrentNumber() };
  },
  next() {
    if (this.state.currentIndex < progression.length - 1) {
      this.state.currentIndex++;
      this._initUserBinary();
      this.state.isCorrect = false;
      this.state.checked = false;
    }
  },
  reset() {
    this.state.currentIndex = 0;
    this._initUserBinary();
    this.state.isCorrect = false;
    this.state.checked = false;
  },
  toggleBit(index) {
    this.state.userBinary[index] = this.state.userBinary[index] === 0 ? 1 : 0;
    this.state.checked = false;
    this.state.isCorrect = false;
  },
  check() {
    const target = this.getCurrentNumber();
    const bitCount = getMinimumBitCount(target);
    let userValue;
    if (target >= 0) {
      userValue = parseInt(this.state.userBinary.join(""), 2);
    } else {
      // interpret as two's complement
      let binStr = this.state.userBinary.join("");
      // convert binary string to signed int
      if (binStr[0] === "1") {
        // negative
        userValue = parseInt(binStr, 2) - (1 << bitCount);
      } else {
        userValue = parseInt(binStr, 2);
      }
    }
    this.state.isCorrect = userValue === target;
    this.state.checked = true;
    return this.state.isCorrect;
  },
  _initUserBinary() {
    const target = this.getCurrentNumber();
    const bitCount = getMinimumBitCount(target);
    this.state.isNegative = target < 0;
    this.state.userBinary = Array(bitCount).fill(0);
  },
};

gameManager.reset();

export { gameManager, progression };
