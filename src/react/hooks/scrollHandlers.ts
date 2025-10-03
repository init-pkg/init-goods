import { useEffect } from "react";

export interface ScrollTresholdProps {
  treshold: number;
  operator?: "more" | "less" | "equal";
  scrollDirection?: "vertical" | "horizontal";
}

interface UseScrollTreshold {
  (handler: (isCrossed: boolean) => void, treshold: number): void;

  (handler: (isCrossed: boolean) => void, options: ScrollTresholdProps): void;
}

export const useScrollTreshold: UseScrollTreshold = (handler, options) => {
  const {
    treshold,
    operator = "more",
    scrollDirection = "vertical",
  }: ScrollTresholdProps = typeof options === "number"
    ? { treshold: options }
    : options;

  useEffect(() => {
    if (typeof window === "undefined") return;

    function handleScroll() {
      let isCrossed = false;

      const value =
        scrollDirection === "vertical" ? window.scrollY : window.scrollX;

      switch (operator) {
        case "more":
          isCrossed = value > treshold;
          break;
        case "less":
          isCrossed = value < treshold;
          break;
        case "equal":
          isCrossed = value === treshold;
          break;
      }

      handler(isCrossed);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handler, JSON.stringify(options)]);
};
