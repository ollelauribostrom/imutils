/**
 * Box blur using 3 by 3 box
 * @param {pixels} pixels The pixels in a linear [r,g,b,a,...] array.
 * @param {number} width The image width.
 */
function boxBlur(pixels, width) {
  const blurred = new Uint8ClampedArray(pixels.length);
  for (let i = 0; i < pixels.length; i++) {
    blurred[i] = (pixels[i] 
        + (pixels[i - 4] || pixels[i])
        + (pixels[i + 4] || pixels[i]) 
        + (pixels[i - 4 * width] || pixels[i])
        + (pixels[i + 4 * width] || pixels[i]) 
        + (pixels[i - 4 * width - 4] || pixels[i])
        + (pixels[i + 4 * width + 4] || pixels[i])
        + (pixels[i + 4 * width - 4] || pixels[i])
        + (pixels[i - 4 * width + 4] || pixels[i])
        ) / 9;
  }
  return blurred;
}

export default boxBlur;
