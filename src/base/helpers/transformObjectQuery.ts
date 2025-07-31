/**
 *
 * @param query - an object containing key-value pairs to be transformed into URL search parameters
 * @returns A URLSearchParams object containing the transformed search parameters
 */

export function transformObjectQuery(
  query: Record<string, string | string[] | undefined>
) {
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
