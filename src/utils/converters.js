export function toImage(imageData) {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

export function toArray(img) {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const image = new Image();
    const ctx = canvas.getContext('2d');
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
    };
    image.src = img;
  });
}

export async function mapToArray(images) {
  return Promise.all(images.map(image => toArray(image.data)));
}
