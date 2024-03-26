
interface CustomNavigator extends Navigator {
  msMaxTouchPoints: number;
}

// Utility function to figure out if the device is touch based
// This is a bad practice and should be avoided
// but in this project's case we use it to show a different ordering in help section
export function isTouchBasedDevice(): boolean {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     ((navigator as unknown as CustomNavigator).msMaxTouchPoints > 0));
}