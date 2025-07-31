import { AbstractSearchParams, ParamsObject } from "./paramsTypes";

/**
 * @param query - an object containing key-value pairs to be transformed into URL search parameters
 * @returns A URLSearchParams object containing the transformed search parameters
 */
export function transformObjectToParams(query: AbstractSearchParams) {
  const params = new URLSearchParams();

  for (const key in query) {
    const value = query[key];
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined) {
      params.append(key, value);
    }
  }

  return params;
}

/**
 * @param params - a URLSearchParams object to be transformed into an object
 * @returns An object containing the transformed search parameters
 */
export function transformParamsToObject<
  T extends object = AbstractSearchParams,
>(params: URLSearchParams) {
  const searchParams = Object.fromEntries(params.entries());
  return searchParams as T;
}
