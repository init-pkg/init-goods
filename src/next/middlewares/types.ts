import { NextMiddlewareResult } from "next/dist/server/web/types";
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

export type MiddlewareContructor = (
  next: NextMiddleware,
  req: NextRequest,
  event: NextFetchEvent
) => Promise<NextMiddlewareResult> | NextMiddlewareResult;
