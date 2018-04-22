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

/**
 * Converts a color from a colorspace based on an RGB color model to a
 * grayscale representation of its luminance. The coefficients represent the
 * measured intensity perception of typical trichromat humans, in
 * particular, human vision is most sensitive to green and least sensitive
 * to blue.
 * @param {pixels} pixels The pixels in a linear [r,g,b,a,...] array.
 * @param {number} width The image width.
 * @param {number} height The image height.
 * @param {boolean} fillRGBA Fill all RGBA values or return a single value per pixel.
 * @param {object} formula The conversion formula { red, green, blue }
 */
function grayscale(pixels, width, height, fillRGBA = false, formula = {
  red: 0.299,
  green: 0.587,
  blue: 0.114,
}) {
  const gray = new Uint8ClampedArray(fillRGBA ? pixels.length : pixels.length >> 2);
  const { red, green, blue } = formula;
  let p = 0;
  let w = 0;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const value = pixels[w] * red + pixels[w + 1] * green + pixels[w + 2] * blue;
      gray[p++] = value;

      if (fillRGBA) {
        gray[p++] = value;
        gray[p++] = value;
        gray[p++] = formula.alpha || pixels[w + 3] ;
      }

      w += 4;
    }
  }
  return gray;
};

export default grayscale;
