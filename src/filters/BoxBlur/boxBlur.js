/**
 * Box blur using 3 by 3 box
 * @param {imageData} imageData The imageData in a linear [r,g,b,a,...] array.
 * @param {number} width The image width.
 */
export function boxBlur(imageData, width) {
  const blurred = new Uint8ClampedArray(imageData.length);
  for (let i = 0; i < imageData.length; i++) {
    blurred[i] = (
      (imageData[(i - 4) - (i - (4 * width))] || imageData[i]) +
      (imageData[i - (4 * width)] || imageData[i]) +
      (imageData[(i + 4) - (i - (4 * width))] || imageData[i]) +
      (imageData[i - 4] || imageData[i]) +
      (imageData[i]) +
      (imageData[i + 4] || imageData[i]) +
      (imageData[(i - 4) + (i + (4 * width))] || imageData[i]) +
      (imageData[(i + (4 * width))] || imageData[i]) +
      (imageData[(i + 4) + (i + (4 * width))] || imageData[i])
    ) / 9;
  }
  return blurred;
}
