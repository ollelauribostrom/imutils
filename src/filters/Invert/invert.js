export function invert(imageData) {
  const blurred = new Uint8ClampedArray(imageData.length);
  for (let i = 0; i < imageData.length; i++) {
    blurred[i] = imageData[i] * imageData[i];
  }
  return blurred;
}
