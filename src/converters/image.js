export function toUint8ClampedArray(img) {
  return new Promise((resolve, reject) => {
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

export async function mapToUint8ClampedArray(images) {
  return Promise.all(images.map(async image => ({
    data: await toUint8ClampedArray(image.data),
    id: image.id
  })));
}
