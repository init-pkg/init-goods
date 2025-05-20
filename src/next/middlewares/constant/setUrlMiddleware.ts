import { middleware } from "../middlewares";
import { NextResponse } from "next/server";
/**
 * - Middleware to set the request URL and pathname in the headers.
 * - This middleware sets the `x-url` and `x-pathname` headers in the request
 * and response objects.
 * - It uses the `next` function to get the response and then sets the headers
 */
export const setUrlMiddleware = middleware(async (next, req, event) => {
  const res = await next(req, event);

  const requestUrl = req.nextUrl.href;
  req.headers.set("x-url", requestUrl);
  res?.headers.set("x-url", requestUrl);

  const pathname = req.nextUrl.pathname;
  req.headers.set("x-pathname", pathname);
  res?.headers.set("x-pathname", pathname);

  return res;
});
