import { NextRequest, NextResponse } from "next/server";

export const HEADER_LOCALE_NAME = "X-NEXT-INTL-LOCALE"; // TODO: foix this

export function applyBasePath(pathname: string, basePath: string) {
  return normalizeTrailingSlash(basePath + pathname);
}

export function normalizeTrailingSlash(pathname: string) {
  const trailingSlash = false;

  if (pathname !== "/") {
    const pathnameEndsWithSlash = pathname.endsWith("/");
    if (trailingSlash && !pathnameEndsWithSlash) {
      pathname += "/";
    } else if (!trailingSlash && pathnameEndsWithSlash) {
      pathname = pathname.slice(0, -1);
    }
  }

  pathname = pathname.trim().replace(/\/+/g, "/").trim();

  if (!trailingSlash && pathname !== "/") {
    pathname = pathname.trim().replace(/\/+$/g, "").trim();
  }

  return pathname;
}

export function redirect(
  req: NextRequest,
  url: string,
  redirectDomain?: string
) {
  const urlObj = new URL(url, req.url);

  urlObj.pathname = normalizeTrailingSlash(urlObj.pathname);

  if (redirectDomain) {
    urlObj.host = redirectDomain;

    if (req.headers.get("x-forwarded-host")) {
      urlObj.protocol =
        req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol;

      urlObj.port = req.headers.get("x-forwarded-port") ?? "";
    }
  }

  if (req.nextUrl.basePath) {
    urlObj.pathname = applyBasePath(urlObj.pathname, req.nextUrl.basePath);
  }

  return NextResponse.redirect(urlObj.toString());
}

export function rewrite(req: NextRequest, url: string, locale: string) {
  const urlObj = new URL(url, req.url);

  if (req.nextUrl.basePath) {
    urlObj.pathname = applyBasePath(urlObj.pathname, req.nextUrl.basePath);
  }

  const headers = new Headers(req.headers);
  headers.set(HEADER_LOCALE_NAME, locale);
  return NextResponse.rewrite(urlObj, { request: { headers } });
}
