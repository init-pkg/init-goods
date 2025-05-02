import { middleware } from "../middlewares";

export const setUrlMiddleware = middleware(async (next, req, event) => {
  const requestUrl = req.nextUrl.href;
  req.headers.set("x-url", requestUrl);

  const pathname = req.nextUrl.pathname;
  req.headers.set("x-pathname", pathname);

  return await next(req, event);
});
