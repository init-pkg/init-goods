import { RefObject, useEffect, useState } from "react";

/**
 * Hook that makes component rerender when ref data is changed
 * @param ref - observable ref
 * @returns `current` field of provided ref
 */
export function useRefState<T>(ref: RefObject<T>) {
  const [value, setValue] = useState(ref.current);

  useEffect(() => {
    const observer = () => setValue(ref.current);
    const interval = setInterval(observer, 100);
    return () => clearInterval(interval);
  }, [ref]);

  return value;
}
