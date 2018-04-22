import shortid from 'shortid';
import isFunction from '../utils/isFunction';
import isImage from '../utils/isImage';

/**
 * Asynchronously an load image
 * @param {file} file 
 * @param {boolean || function} skip
 * @return {Promise} 
 */
async function imageLoader(file, skip) {
  return new Promise((resolve, reject) => {
    if (!isImage(file)) {
      if (skip) {
        if (isFunction(skip)) {
          skip(file);
        }
        resolve();
      } else {
        reject('Not an image');
      }
    }
    const reader = new FileReader();
    reader.onload = () => resolve({ data: reader.result, id: shortid.generate() });
    reader.readAsDataURL(file);
  });
}

export default imageLoader;
