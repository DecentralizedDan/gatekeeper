/**
 * Binary conversion utilities for the Gatekeeper educational app
 */

export interface BinaryConversion {
  decimal: number;
  binary: string;
  bitCount: number;
  isSigned: boolean;
}

/**
 * Convert a decimal number to its binary representation
 * @param decimal - The decimal number to convert
 * @param bitCount - Number of bits to use (optional, will be calculated if not provided)
 * @returns BinaryConversion object with decimal, binary string, bit count, and signed flag
 */
export function decimalToBinary(
  decimal: number,
  bitCount?: number
): BinaryConversion {
  const isSigned = decimal < 0;
  const absDecimal = Math.abs(decimal);

  // Calculate required bit count if not provided
  if (!bitCount) {
    if (absDecimal === 0) {
      bitCount = 1;
    } else {
      bitCount = Math.floor(Math.log2(absDecimal)) + 1;
      // Add extra bit for signed numbers
      if (isSigned) {
        bitCount++;
      }
    }
  }

  let binary: string;

  if (isSigned) {
    // Handle signed numbers using two's complement
    if (decimal === -1) {
      binary = "1".repeat(bitCount);
    } else {
      const positiveBinary = absDecimal.toString(2).padStart(bitCount - 1, "0");
      const inverted = positiveBinary
        .split("")
        .map((bit) => (bit === "0" ? "1" : "0"))
        .join("");
      const invertedDecimal = parseInt(inverted, 2);
      const result = (invertedDecimal + 1).toString(2).padStart(bitCount, "0");
      binary = result;
    }
  } else {
    // Handle unsigned numbers
    binary = absDecimal.toString(2).padStart(bitCount, "0");
  }

  return {
    decimal,
    binary,
    bitCount,
    isSigned,
  };
}

/**
 * Convert a binary string to its decimal representation
 * @param binary - The binary string to convert
 * @param isSigned - Whether the binary represents a signed number
 * @returns The decimal number
 */
export function binaryToDecimal(
  binary: string,
  isSigned: boolean = false
): number {
  if (!binary || binary.length === 0) {
    return 0;
  }

  if (isSigned) {
    // Handle signed numbers using two's complement
    const firstBit = binary[0];
    if (firstBit === "1") {
      // Negative number - convert from two's complement
      const inverted = binary
        .split("")
        .map((bit) => (bit === "0" ? "1" : "0"))
        .join("");
      const invertedDecimal = parseInt(inverted, 2);
      return -(invertedDecimal + 1);
    } else {
      // Positive number
      return parseInt(binary, 2);
    }
  } else {
    // Unsigned number
    return parseInt(binary, 2);
  }
}

/**
 * Calculate the minimum number of bits needed to represent a decimal number
 * @param decimal - The decimal number
 * @param isSigned - Whether to consider signed representation
 * @returns The minimum number of bits required
 */
export function calculateBitCount(
  decimal: number,
  isSigned: boolean = false
): number {
  const absDecimal = Math.abs(decimal);

  if (absDecimal === 0) {
    return 1;
  }

  let bitCount = Math.floor(Math.log2(absDecimal)) + 1;

  if (isSigned) {
    bitCount++;
  }

  return bitCount;
}

/**
 * Validate if a binary string is valid
 * @param binary - The binary string to validate
 * @returns True if valid, false otherwise
 */
export function isValidBinary(binary: string): boolean {
  if (!binary || binary.length === 0) {
    return false;
  }

  return /^[01]+$/.test(binary);
}

/**
 * Get the learning progression sequence
 * @returns Array of numbers in order of difficulty
 */
export function getLearningSequence(): number[] {
  return [0, 1, 2, 4, 10, 100, 128, 256, -1, -10, -128];
}

/**
 * Get the current step information
 * @param currentIndex - Current step index (0-based)
 * @returns Object with current number and total steps
 */
export function getStepInfo(currentIndex: number): {
  currentNumber: number;
  totalSteps: number;
  stepNumber: number;
} {
  const sequence = getLearningSequence();
  const totalSteps = sequence.length;

  if (currentIndex < 0 || currentIndex >= totalSteps) {
    throw new Error(`Invalid step index: ${currentIndex}`);
  }

  const currentNumber = sequence[currentIndex];
  if (currentNumber === undefined) {
    throw new Error(`Invalid step index: ${currentIndex}`);
  }

  return {
    currentNumber,
    totalSteps,
    stepNumber: currentIndex + 1,
  };
}

/**
 * Check if the user's binary input matches the target decimal
 * @param userBinary - User's binary input
 * @param targetDecimal - Target decimal number
 * @returns True if correct, false otherwise
 */
export function checkAnswer(
  userBinary: string,
  targetDecimal: number
): boolean {
  if (!isValidBinary(userBinary)) {
    return false;
  }

  const isSigned = targetDecimal < 0;
  const calculatedDecimal = binaryToDecimal(userBinary, isSigned);

  return calculatedDecimal === targetDecimal;
}

/**
 * Format a binary string with spaces for readability
 * @param binary - The binary string to format
 * @param groupSize - Number of bits per group (default: 4)
 * @returns Formatted binary string
 */
export function formatBinary(binary: string, groupSize: number = 4): string {
  const groups = [];
  for (let i = 0; i < binary.length; i += groupSize) {
    groups.push(binary.slice(i, i + groupSize));
  }
  return groups.join(" ");
}

/**
 * Get a hint for the current number
 * @param decimal - The target decimal number
 * @returns A helpful hint string
 */
export function getHint(decimal: number): string {
  if (decimal === 0) {
    return "Zero in binary is just 0!";
  } else if (decimal === 1) {
    return "One in binary is just 1!";
  } else if (decimal === 2) {
    return "Two in binary is 10 (1×2¹ + 0×2⁰)";
  } else if (decimal === 4) {
    return "Four in binary is 100 (1×2² + 0×2¹ + 0×2⁰)";
  } else if (decimal === 10) {
    return "Ten in binary is 1010 (1×2³ + 0×2² + 1×2¹ + 0×2⁰)";
  } else if (decimal === 100) {
    return "100 in binary is 1100100 (1×2⁶ + 1×2⁵ + 0×2⁴ + 0×2³ + 1×2² + 0×2¹ + 0×2⁰)";
  } else if (decimal === 128) {
    return "128 in binary is 10000000 (1×2⁷ + 0×2⁶ + 0×2⁵ + 0×2⁴ + 0×2³ + 0×2² + 0×2¹ + 0×2⁰)";
  } else if (decimal === 256) {
    return "256 in binary is 100000000 (1×2⁸ + 0×2⁷ + 0×2⁶ + 0×2⁵ + 0×2⁴ + 0×2³ + 0×2² + 0×2¹ + 0×2⁰)";
  } else if (decimal === -1) {
    return "Negative one in 8-bit two's complement is 11111111";
  } else if (decimal === -10) {
    return "Negative ten in 8-bit two's complement is 11110110";
  } else if (decimal === -128) {
    return "Negative 128 in 8-bit two's complement is 10000000";
  }

  return "Try converting the number step by step using powers of 2!";
}
