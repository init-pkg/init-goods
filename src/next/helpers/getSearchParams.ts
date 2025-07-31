import { headers } from "next/headers";
import { URLSearchParams } from "url";

/**
 * - Async function that retrieves the search parameters from the current URL.
 * - It uses the `headers` function from Next.js to get the request headers,
 * and then parses the `x-url` header to extract the search parameters.
 * - The search parameters are returned as an object with string keys and
 * optional string values.
 * @template T - The type of the object to be returned. Defaults to an object with string keys and optional string values.
 */

interface ParamsObject {
  /**
   * Converts the search parameters to a URLSearchParams object.
   * @returns A URLSearchParams object containing the search parameters.
   */
  toParams(): URLSearchParams;
}

export async function getSearchParams<
  T extends object = Record<string, string | undefined>,
>(): Promise<ParamsObject & T> {
  const headersStore = await headers();
  const url = headersStore.get("x-url");
  if (!url) throw new Error("x-url header is not set. (use setUrlMiddleware)");
  const parsedUrl = new URL(url);
  const searchParams = Object.fromEntries(parsedUrl.searchParams.entries());

  return {
    ...searchParams,
    toParams: () => parsedUrl.searchParams,
  } as ParamsObject & T;
}
