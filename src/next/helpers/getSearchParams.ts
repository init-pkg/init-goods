import { headers } from "next/headers";

export async function getSearchParams<
  T extends object = Record<string, string | undefined>,
>() {
  const headersStore = await headers();
  const url = headersStore.get("x-url");
  if (!url) throw new Error("x-url header is not set. (use setUrlMiddleware)");
  const parsedUrl = new URL(url);
  const searchParams = Object.fromEntries(parsedUrl.searchParams.entries());
  return searchParams as Partial<T>;
}
