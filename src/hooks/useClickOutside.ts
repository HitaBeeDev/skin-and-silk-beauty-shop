import { useEffect } from "react";

type SupportedEvent = MouseEvent | TouchEvent;

export function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: (event: SupportedEvent) => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    function handleEvent(event: SupportedEvent): void {
      const element = ref.current;

      if (!element || element.contains(event.target as Node)) return;

      handler(event);
    }

    document.addEventListener("mousedown", handleEvent);
    document.addEventListener("touchstart", handleEvent);

    return () => {
      document.removeEventListener("mousedown", handleEvent);
      document.removeEventListener("touchstart", handleEvent);
    };
  }, [enabled, handler, ref]);
}

export default useClickOutside;
