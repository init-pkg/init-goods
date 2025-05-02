import { NextMiddleware, NextResponse } from "next/server";
import { MiddlewareContructor, MiddlewareFactory } from "./types";

/**
 * Merges all next middlewares
 * @param functions - your middlewares
 */

export function stackMiddlewares(
  functions: MiddlewareFactory[] = []
): NextMiddleware {
  let next: NextMiddleware = () => {
    return NextResponse.next();
  };

  functions.reverse().forEach((f) => {
    next = f(next);
  });

  return next;
}

/**
 * constructs new middleware
 * @param constructor - callback, that contains middleware logic
 * @returns middleware as `MiddlewareFactory`
 */
export function middleware(
  constructor: MiddlewareContructor
): MiddlewareFactory {
  return (next) => async (req, event) => await constructor(next, req, event);
}
