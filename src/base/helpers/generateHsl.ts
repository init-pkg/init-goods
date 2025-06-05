/**
 * - Generates a set of HSL color values based on a given hue and saturation (HSL).
 * - The lightness values are generated in increments of 10% from 95% to 5%.
 * @remarks This function is useful for creating a palette of colors that can be used in tailwindcss colors.
 */
export function generateHSLColors(hue: number, saturation: number) {
  const result: Record<number, string> = {};

  result[50] = `hsl(${hue}, ${saturation}%, 95%)`;

  for (let i = 1; i <= 9; i++) {
    result[100 * i] = `hsl(${hue}, ${saturation}%, ${90 - 10 * (i - 1)}%)`;
  }

  return result;
}
