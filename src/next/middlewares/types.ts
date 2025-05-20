import { NextMiddlewareResult } from "next/dist/server/web/types";
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

/**
 * Type, that reperesents middleware function, that can be merged in stackMiddlewares
 */
export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

/**
 * Function, that constructs new middleware
 * @param next - response function
 * @param req - request object
 * @param event - fetch event
 */

export type MiddlewareContructor = (
  next: NextMiddleware,
  req: NextRequest,
  event: NextFetchEvent
) => Promise<NextMiddlewareResult> | NextMiddlewareResult;
