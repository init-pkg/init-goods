import { middleware } from "../middlewares";

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
