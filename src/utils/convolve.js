/*
 * Ported from tracking.js
 * Software License Agreement (BSD License)
 * Copyright (c) 2014, Eduardo A. Lundgren Melo.
 * All rights reserved.
 * 
 * Redistribution and use of this software in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above
 * copyright notice, this list of conditions and the
 * following disclaimer.
 * 
 * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the
 * following disclaimer in the documentation and/or other
 * materials provided with the distribution.
 *
 * The name of Eduardo A. Lundgren Melo may not be used to endorse or promote products
 * derived from this software without specific prior
 * written permission of Eduardo A. Lundgren Melo.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Fast horizontal separable convolution. A point spread function (PSF) is
 * said to be separable if it can be broken into two one-dimensional
 * signals: a vertical and a horizontal projection. The convolution is
 * performed by sliding the kernel over the image, generally starting at the
 * top left corner, so as to move the kernel through all the positions where
 * the kernel fits entirely within the boundaries of the image. Adapted from
 * https://github.com/kig/canvasfilters.
 * @param {pixels} pixels The pixels in a linear [r,g,b,a,...] array.
 * @param {number} width The image width.
 * @param {number} height The image height.
 * @param {array} weightsVector The weighting vector, e.g [-1,0,1].
 * @param {number} opaque
 * @return {array} The convoluted pixels in a linear [r,g,b,a,...] array.
 */
export function horizontalConvolve(pixels, width, height, weightsVector, opaque) {
  const side = weightsVector.length;
  const halfSide = Math.floor(side / 2);
  const output = new Float32Array(width * height * 4);
  const alphaFac = opaque ? 1 : 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sy = y;
      const sx = x;
      const offset = (y * width + x) * 4;
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let cx = 0; cx < side; cx++) {
        const scy = sy;
        const scx = Math.min(width - 1, Math.max(0, sx + cx - halfSide));
        const poffset = (scy * width + scx) * 4;
        const wt = weightsVector[cx];
        r += pixels[poffset] * wt;
        g += pixels[poffset + 1] * wt;
        b += pixels[poffset + 2] * wt;
        a += pixels[poffset + 3] * wt;
      }
      output[offset] = r;
      output[offset + 1] = g;
      output[offset + 2] = b;
      output[offset + 3] = a + alphaFac * (255 - a);
    }
  }
  return output;
};

/**
 * Fast vertical separable convolution. A point spread function (PSF) is
 * said to be separable if it can be broken into two one-dimensional
 * signals: a vertical and a horizontal projection. The convolution is
 * performed by sliding the kernel over the image, generally starting at the
 * top left corner, so as to move the kernel through all the positions where
 * the kernel fits entirely within the boundaries of the image. Adapted from
 * https://github.com/kig/canvasfilters.
 * @param {pixels} pixels The pixels in a linear [r,g,b,a,...] array.
 * @param {number} width The image width.
 * @param {number} height The image height.
 * @param {array} weightsVector The weighting vector, e.g [-1,0,1].
 * @param {number} opaque
 * @return {array} The convoluted pixels in a linear [r,g,b,a,...] array.
 */
export function verticalConvolve(pixels, width, height, weightsVector, opaque) {
  const side = weightsVector.length;
  const halfSide = Math.floor(side / 2);
  const output = new Float32Array(width * height * 4);
  const alphaFac = opaque ? 1 : 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sy = y;
      const sx = x;
      const offset = (y * width + x) * 4;
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let cy = 0; cy < side; cy++) {
        const scy = Math.min(height - 1, Math.max(0, sy + cy - halfSide));
        const scx = sx;
        const poffset = (scy * width + scx) * 4;
        const wt = weightsVector[cy];
        r += pixels[poffset] * wt;
        g += pixels[poffset + 1] * wt;
        b += pixels[poffset + 2] * wt;
        a += pixels[poffset + 3] * wt;
      }
      output[offset] = r;
      output[offset + 1] = g;
      output[offset + 2] = b;
      output[offset + 3] = a + alphaFac * (255 - a);
    }
  }
  return output;
};

/**
 * Fast separable convolution. A point spread function (PSF) is said to be
 * separable if it can be broken into two one-dimensional signals: a
 * vertical and a horizontal projection. The convolution is performed by
 * sliding the kernel over the image, generally starting at the top left
 * corner, so as to move the kernel through all the positions where the
 * kernel fits entirely within the boundaries of the image. Adapted from
 * https://github.com/kig/canvasfilters.
 * @param {pixels} pixels The pixels in a linear [r,g,b,a,...] array.
 * @param {number} width The image width.
 * @param {number} height The image height.
 * @param {array} horizWeights The horizontal weighting vector, e.g [-1,0,1].
 * @param {array} vertWeights The vertical vector, e.g [-1,0,1].
 * @param {number} opaque
 * @return {array} The convoluted pixels in a linear [r,g,b,a,...] array.
 */
export function separableConvolve(pixels, width, height, horizWeights, vertWeights, opaque) {
  const vertical = verticalConvolve(pixels, width, height, vertWeights, opaque);
  return horizontalConvolve(vertical, width, height, horizWeights, opaque);
};
