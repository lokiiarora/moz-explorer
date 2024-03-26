import { useEffect } from "react";

// Utility hook that serves as a generic way to register keyboard shortcuts
export function useKeyboardShortcut(
  validator: (e: KeyboardEvent) => boolean,
  callback: (e: KeyboardEvent) => void,
  deps: React.DependencyList = [],
) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (validator(e)) {
        e.preventDefault();
        e.stopImmediatePropagation()
        callback(e);
      }
    };
    window.addEventListener("keydown", handle);
    return () => {
      window.removeEventListener("keydown", handle);
    };
  }, deps);
}