import { RefCallback, RefObject, useRef } from "react";
import { multiRef } from "../helpers/refs";

/**
 * @description A custom hook that manages an array of refs.
 * @returns A tuple containing a ref object and a callback ref for element assignment.
 * @info - callback assigns the element to the ref array in ascending order.
 * @example ```tsx
 * const [refArray, callback] = useRefArray<HTMLDivElement>();
 *
 * // ... refArray will contains all following div's
 *
 * <div id="1" ref={callback}></div>
 * <div id="2" ref={callback}></div>
 * <div id="3" ref={callback}></div>
 * ```
 */
export function useRefArray<T extends HTMLElement = HTMLElement>(
  defaultRef: T[] = []
): readonly [RefObject<T[]>, RefCallback<T>] {
  const ref = useRef<T[]>(defaultRef);
  const callback = multiRef(ref);
  return [ref, callback];
}
