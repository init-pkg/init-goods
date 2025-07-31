/**
 * A type that describes search params object in abstract form.
 */
export type AbstractSearchParams = Record<
  string,
  string | string[] | undefined
>;

/**
 * A type that describes search params in classic object form.
 * @template T - The type of the object to be returned. Defaults to an object with string keys and optional string values.
 */
export type ParamsObject<T extends object = AbstractSearchParams> = T & {
  /**
   * Converts the search parameters to a URLSearchParams object.
   * @returns A URLSearchParams object containing the search parameters.
   */
  toParams(): URLSearchParams;
};
