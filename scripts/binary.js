// Binary conversion utilities for Gatekeeper

/**
 * Get the minimum number of bits needed to represent a number (unsigned or two's complement)
 */
export function getMinimumBitCount(number) {
  if (number >= 0) {
    return Math.max(1, number.toString(2).length);
  } else {
    // For negatives, find the smallest n such that -2^(n-1) <= number
    let n = 2;
    while (number < -(2 ** (n - 1))) {
      n++;
    }
    // Also ensure the value fits in two's complement
    while (number < -(2 ** (n - 1)) || number >= 2 ** (n - 1)) {
      n++;
    }
    return n;
  }
}

/**
 * Convert a positive number to a binary string with a given bit count
 */
export function toBinaryString(number, bitCount) {
  let bin = number.toString(2);
  while (bin.length < bitCount) {
    bin = "0" + bin;
  }
  return bin;
}

/**
 * Convert a negative number to two's complement binary string with a given bit count
 */
export function toTwosComplement(number, bitCount) {
  // number is negative
  let max = 2 ** bitCount;
  let val = max + number; // two's complement
  let bin = val.toString(2);
  while (bin.length < bitCount) {
    bin = "0" + bin;
  }
  return bin;
}
