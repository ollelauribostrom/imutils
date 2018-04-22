/**
 * Scale image to fit within maxWidth & maxHeight
 * @param {HTMLImageElement} img 
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 */
function scaleToFit(img, maxWidth, maxHeight) {
  if (img.width > maxWidth) {
    const scale = (maxWidth / img.width);
    img.width = img.width * scale;
    img.height = img.height * scale;
  }

  if (img.height > maxHeight) {
    const scale = (maxHeight / img.height);
    img.width = img.width * scale;
    img.height = img.height * scale;
  }

  return img;
}

export default scaleToFit;
