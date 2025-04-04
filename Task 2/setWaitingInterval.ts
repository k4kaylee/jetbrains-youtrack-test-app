const map = new Map<number, number>();

// Issue: Global variable
// Consider using a more structured approach.
let waitingIntervalId = 0;

// Issue: unclear naming. The function doesn't "get", it also removes the last element of given array.
// Should be rename to something like popLastUntilOneLeft
function getLastUntilOneLeft(arr: number[]): number {
  if (arr.length > 1) {
    const item = arr.pop();

    // Issue: The item is removed before checking its type.
    // If an error is thrown, the array is still modified.
    if (typeof item !== "number") {
      throw new Error("Invalid item type");
    }

    return item;
  }

  // Issue: Type check ommited. The function does not validate the last remaining element.
  // Suggestion: Perform a type check before returning.
  return arr[0];
}

/**
 * This function mimics the behavior of setInterval with one key difference:
 * if the callback function takes too long to execute or if the browser throttles,
 * subsequent calls to the callback function will not occur.
 *
 * Additionally, it accepts an array of timeouts to define an increasing delay pattern.
 * For example, given the array [16, 8, 4, 2], the delays will be applied in reverse order: 2, 4, 8, 16, 16, 16...
 */

// Unclear naming: The function's purpose is not immediately obvious.
// Suggestion: Rename to setExponentialBackoffInterval for better clarity.
export function setWaitingInterval(
  handler: Function,
  timeouts: number[],
  ...args: any[]
): number {
  waitingIntervalId += 1;

  // Missing validation. What if timeouts[] is empty?
  // Suggestion: Add a check to ensure timeouts.length > 0 before proceeding.

  function internalHandler(...argsInternal: any[]): void {
    handler(argsInternal);
    map.set(
      waitingIntervalId,
      window.setTimeout(internalHandler, getLastUntilOneLeft(timeouts), ...args)
    );
  }

  map.set(
    waitingIntervalId,
    window.setTimeout(internalHandler, getLastUntilOneLeft(timeouts), ...args)
  );

  // Potential memory leak: Timeout IDs are stored in map but clearWaitingInterval does not remove the intrval ID's
  // Also, what if clearWaitingInterval is never called?

  // Suggestion: Implement cleanup logic in clearWaitingInterval.
  return waitingIntervalId;
}

export function clearWaitingInterval(intervalId: number): void {
  const realTimeoutId = map.get(intervalId);

  if (typeof realTimeoutId === "number") {
    clearTimeout(realTimeoutId);

    // Missing cleanup here: The interval ID should be removed from map to prevent memory leaks.
    map.delete(intervalId);
  }
}