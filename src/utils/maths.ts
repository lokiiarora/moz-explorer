// This is a utility function that clamps a value between a minimum and maximum value
export function minMax(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}