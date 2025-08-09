import { Ref, RefObject } from "react";

/**
 * helper function that puts given value into all provided refs
 * @param refs - refs that you want to assign the value to
 * @info refs can be object, callback or forwarded
 */
export function assignToRef<T>(
  value: T,
  ...refs: Array<Ref<T> | undefined>
): void {
  refs.forEach((ref) => {
    if (!ref) return;
    switch (typeof ref) {
      case "object":
        ref.current = value;
        break;
      case "function":
        ref(value);
        break;
    }
  });
}

/**
 *
 * Merges multiple refs in one jsx node
 * @param refs - refs that you want to merge
 * @example ```tsx
 * <div ref={refs(ref1, ref2)}></div>
 * ```
 */
export function refs<T extends object | null>(
  ...refs: Ref<T>[]
): (node: T) => void {
  return (node) => {
    assignToRef(node, ...refs);
  };
}

/**
 * Takes an array ref (e.g., useRef<HTMLElement[]>([]))
 * and returns a callback ref you can attach to a DOM element.
 * It automatically adds or removes that element from the array.
 */
export function multiRef<T extends HTMLElement>(arrayRef: RefObject<T[]>) {
  return (node: T | null) => {
    if (node) {
      // Mount: add node if not already in the array
      if (!arrayRef.current?.includes(node)) {
        arrayRef.current?.push(node);
      }
    } else {
      // Unmount: remove node (React sets ref to null)
      if (arrayRef.current)
        (arrayRef as unknown as { current: T[] }).current =
          arrayRef.current?.filter((el) => el !== node);
    }
  };
}
