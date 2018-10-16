/**
 * Box blur using 3 by 3 box
 * @param {pixels} pixels The pixels in a linear [r,g,b,a,...] array.
 * @param {number} width The image width.
 */
export function boxBlur(imageData) {
  const output = [];
  for (let i = 0; i < imageData.length; i += 1) {
    output.push(imageData[i] * imageData[i]);
  }
  return output;
}
