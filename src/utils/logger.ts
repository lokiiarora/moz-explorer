// Logger utility function to log messages to console in DEV mode
// This becomes a noop function is production mode
export function log(tag: string, ...args: unknown[]) {
  if (import.meta.env.DEV) {
    console.log(`[${tag}]`, ...args)
  }
}