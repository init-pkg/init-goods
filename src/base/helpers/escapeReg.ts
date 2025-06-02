/**
 * Escapes a string for use in a regular expression.
 * @param string - The string to escape.
 * @returns The escaped string.
 */
export function escapeRegExp(string: string) {
  return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
