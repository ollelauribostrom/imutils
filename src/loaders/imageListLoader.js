import imageLoader from './imageLoader';

/**
 * Asynchronously load a list of images
 * @param {files} fileList 
 * @param {boolean || function} skip 
 * @return {Promise}
 */
async function imageListLoader(fileList, skip) {
  const filePromises = Array.prototype.map.call(fileList, async file => imageLoader(file, skip));
  const images = await Promise.all(filePromises);
  return images.filter(image => image);
}

export default imageListLoader;
