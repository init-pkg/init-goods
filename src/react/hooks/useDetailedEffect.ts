import {
  DependencyList,
  EffectCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

export interface DetailedEffectOptions {
  /**
   * skips first render of app
   * #### Does not works in strict mode
   * But still works correctly in production build
   */
  skipFirstRender?: boolean;
  /**
   * stringifies all object deps, that prevent unnecessary rerenders
   */
  stringifyDeps?: boolean;
}
/**
 * @function `useDeatiledEffect` same as useEffect with extra options
 * @param options - effect options. Applies only on first render and stays unchanged
 */
export function useDetailedEffect(
  effect: EffectCallback,
  deps: DependencyList,
  options?: DetailedEffectOptions
) {
  const isFirstRender = useRef(true);

  const { stringifyDeps, skipFirstRender = false } = useMemo(
    () => Object.freeze(options || {}),
    []
  );

  const processedDeps = useMemo(() => {
    if (stringifyDeps) {
      return deps.map((d) => (typeof d === "object" ? JSON.stringify(d) : d));
    }
    return deps;
  }, [...deps, stringifyDeps]);

  useEffect(() => {
    if (isFirstRender.current && skipFirstRender) {
      isFirstRender.current = false;
      return;
    }
    effect();
  }, [...processedDeps]);
}
