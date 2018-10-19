export function isImage(file, types = []) {
  return (
    file.type === 'image/png' ||
    file.type === 'image/jpeg' ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif' ||
    types.includes(file.type)
  );
}

export function isFunction(x) {
  // eslint-disable-next-line eqeqeq
  return Object.prototype.toString.call(x) == '[object Function]';
}

export async function imageLoader(file, skip) {
  return new Promise((resolve, reject) => {
    if (!isImage(file)) {
      if (skip) {
        if (isFunction(skip)) {
          skip(file);
        }
        resolve();
      } else {
        reject(new Error('Not an image'));
      }
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export async function imageListLoader(fileList, skip) {
  const filePromises = Array.prototype.map.call(fileList, async file => imageLoader(file, skip));
  const images = await Promise.all(filePromises);
  return images.filter(image => image);
}
