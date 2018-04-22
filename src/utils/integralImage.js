/**
 * Ported from HAAR.js
 * src: https://github.com/foo123/HAAR.js/
 */

// Compute grayscale image, integral image (SAT) and squares image (Viola-Jones)
function integralImage(image, width, height) {
  const imLen = image.length;
  const count = width * height;
  let sum = 0;
  let sum2 = 0;
  let i = 0;
  let j = 0;
  let k = 0;
  let y = 1;
  let g;
  const gray = new Uint8Array(count);
  const integral = new Float32Array(count);
  const squares = new Float32Array(count);
  const tilted = new Float32Array(count);
  
  // first row
  while (j < width) {
    // use fixed-point gray-scale transform, close to openCV transform
    // https://github.com/mtschirs/js-objectdetect/issues/3
    // 0,29901123046875  0,58697509765625  0,114013671875 with roundoff
    g = ((4899 * image[i] + 9617 * image[i + 1] + 1868 * image[i + 2]) + 8192) >>> 14;
    g &= 255;  
    sum += g;
    sum2 += (g*g);
    gray[j] = g;
    integral[j] = sum;
    squares[j] = sum2;
    tilted[j] = g;
    j++;
    i += 4;
  }

  // other rows
  j = width;
  i = (width<<2);
  sum = 0 ;
  sum2 = 0; 
  while (i<imLen) {
    // use fixed-point gray-scale transform, close to openCV transform
    // https://github.com/mtschirs/js-objectdetect/issues/3
    // 0,29901123046875  0,58697509765625  0,114013671875 with roundoff
    g = ((4899 * image[i] + 9617 * image[i + 1] + 1868 * image[i + 2]) + 8192) >>> 14;
    g &= 255;  
    sum += g;  
    sum2 += /*(*/(g*g); //&0xFFFFFFFF) >>> 0;
    gray[j] = g;
    integral[j] = integral[j-width] + sum;
    squares[j] = squares[j-width] + sum2;
    tilted[j] = tilted[j+1-width] + (g + gray[j-width]) + ((y>1) ? tilted[j-width-width] : 0) + ((k>0) ? tilted[j-1-width] : 0);
    k++;
    j++;
    i += 4;
    if (k >= width) {
      k = 0;
      y++;
      sum = 0;
      sum2 = 0;
    }
  }
  
  return { gray, integral, squares, tilted };
}

export default integralImage;
