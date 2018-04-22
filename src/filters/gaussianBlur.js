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

/**
 * Computes gaussian blur. Adapted from
 * https://github.com/kig/canvasfilters.
 * @param {pixels} pixels The pixels in a linear [r,g,b,a,...] array.
 * @param {number} width The image width.
 * @param {number} height The image height.
 * @param {number} blurDiameter Gaussian blur diameter, must be greater than 1.
 * @return {array} The edge pixels in a linear [r,g,b,a,...] array.
 */
function gaussianBlur(pixels, width, height, blurDiameter) {
  const diameter = Math.abs(blurDiameter);
  if (diameter <= 1) {
    throw new Error('Diameter should be greater than 1.');
  }
  const radius = diameter / 2;
  const len = Math.ceil(diameter) + (1 - (Math.ceil(diameter) % 2));
  const weights = new Float32Array(len);
  const rho = (radius + 0.5) / 3;
  const rhoSq = rho * rho;
  const gaussianFactor = 1 / Math.sqrt(2 * Math.PI * rhoSq);
  const rhoFactor = -1 / (2 * rho * rho);
  let wsum = 0;
  const middle = Math.floor(len / 2);
  for (let i = 0; i < len; i++) {
    const x = i - middle;
    const gx = gaussianFactor * Math.exp(x * x * rhoFactor);
    weights[i] = gx;
    wsum += gx;
  }
  for (let j = 0; j < weights.length; j++) {
    weights[j] /= wsum;
  }
  return separableConvolve(pixels, width, height, weights, weights, false);
};

export default gaussianBlur;
