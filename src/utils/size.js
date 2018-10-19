export function scaleToFit(img, maxWidth, maxHeight) {
  if (img.width > maxWidth) {
    const scale = maxWidth / img.width;
    img.width = img.width * scale; // eslint-disable-line operator-assignment, no-param-reassign
    img.height = img.height * scale; // eslint-disable-line operator-assignment, no-param-reassign
  }

  if (img.height > maxHeight) {
    const scale = maxHeight / img.height;
    img.width = img.width * scale; // eslint-disable-line operator-assignment, no-param-reassign
    img.height = img.height * scale; // eslint-disable-line operator-assignment, no-param-reassign
  }

  return img;
}
