export function sharpen(imageData) {
  const blurred = new Uint8ClampedArray(imageData.length);
  for (let i = 0; i < imageData.length; i += 1) {
    blurred[i] = imageData[i] * imageData[i];
  }
  return blurred;
}
