export function pxToCalc(
  pixelValue: number,
  baseFontSize = 14,
  viewportWidth = 1200
) {
  const emValue = ((pixelValue / baseFontSize) * (3 / 10)).toFixed(3);
  const vwValue = ((pixelValue / viewportWidth) * 100 * (7 / 10)).toFixed(3);
  const calcValue = `calc(${emValue}em + ${vwValue}vw)`;
  return calcValue;
}
