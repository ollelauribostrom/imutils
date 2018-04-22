/*
 * Based on tracking.js
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

import { separableConvolve } from '../utils/convolve';
import grayscale from './grayscale';

/**
 * Compute image edges using Sobel operator. Computes the vertical and
 * horizontal gradients of the image and combines the computed images to
 * find edges in the image. The way we implement the Sobel filter here is by
 * first grayscaling the image, then taking the horizontal and vertical
 * gradients and finally combining the gradient images to make up the final
 * image. Adapted from https://github.com/kig/canvasfilters.
 * @param {pixels} pixels The pixels in a linear [r,g,b,a,...] array.
 * @param {number} width The image width.
 * @param {number} height The image height.
 * @return {array} The edge pixels in a linear [r,g,b,a,...] array.
 */
function sobel(pixels, width, height) {
  pixels = grayscale(pixels, width, height, true);
  const output = new Float32Array(width * height * 4);
  const sobelSignVector = new Float32Array([-1, 0, 1]);
  const sobelScaleVector = new Float32Array([1, 2, 1]);
  const vertical = separableConvolve(pixels, width, height, sobelSignVector, sobelScaleVector);
  const horizontal = separableConvolve(pixels, width, height, sobelScaleVector, sobelSignVector);

  for (let i = 0; i < output.length; i += 4) {
    const v = vertical[i];
    const h = horizontal[i];
    const p = Math.sqrt(h * h + v * v);
    output[i] = p;
    output[i + 1] = p;
    output[i + 2] = p;
    output[i + 3] = 255;
  }

  return output;
};

export default sobel;
