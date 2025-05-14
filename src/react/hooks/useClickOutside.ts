import { RefObject, useEffect } from "react";

/**
 * Calls event callback when click event occured outside a ref
 * @param ref - safezone ref
 * @param callback - event callback
 */
export function useClickOutside(
  ref: RefObject<Element>,
  callback: (event: MouseEvent) => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref.current, callback]);
}
