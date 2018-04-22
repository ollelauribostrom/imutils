/**
 * Ported from HAAR.js
 * src: https://github.com/foo123/HAAR.js/
 */

import classifiers from '../classifiers';
import Feature from '../utils/Feature';
import integralImage from '../utils/integralImage';
import integralCanny from '../utils/integralCanny';
import merge from '../utils/merge';

function detect(classifier, imageData, {
  increment = 0.5,
  baseScale = 1.0,
  scaleInc = 1.25,
  minNeighbors = 1,
  ratio = 0.5,
  doCannny = false,
  cannyLow = 20,
  cannyHigh = 100,
  inArea = null,
} = {}) {
  if (typeof classifier !== 'string') {
    throw new Error('Object classifier not valid, should be in string format');
  }

  if (!classifiers[classifier]) {
    throw new Error('Classifier not found');
  }

  if (!imageData) {
    throw new Error('Please provide pixels & width & height');
  }

  const haarClassifier = classifiers[classifier];
  const { data, width, height } = imageData;
  const maxScale = Math.min(width / haarClassifier.size1, height / haarClassifier.size2);
  const selection = inArea ? inArea : new Feature(0, 0, width, height);
  const scaledSelection = selection.clone().scale(ratio).round();
  const { gray, integral, squares, tilted } = integralImage(data, width, height);
  const canny = integralCanny(gray, Math.round(width * ratio), Math.round(height * ratio));
  let rects = [];
  let scale = baseScale;

  while (scale <= maxScale) {
    rects = rects.concat(detectSingleStep({
      haarClassifier,
      scaledSelection,
      increment,
      scale,
      canny,
      integral,
      squares,
      tilted,
      doCannny,
      cannyLow,
      cannyHigh,
    })); 
    scale *= scaleInc;
  }
  
  // merge any features found
  for (let i = 0; i < rects.length; i++) {
    rects[i] = new Feature(rects[i]);
  }

  return merge(rects, minNeighbors, ratio, selection);
}

function detectSingleStep({
  haarClassifier,
  scaledSelection,
  increment,
  scale,
  canny,
  integral,
  squares,
  tilted,
  doCanny,
  cannyLow,
  cannyHigh,
  index = 0
}) {
  const output = [];
  const haarStages = haarClassifier.stages
  const width = scaledSelection.width;
  const height = scaledSelection.height;
  const imArea = width * height;
  const imArea1 = imArea - 1;
  const sizex = haarClassifier.size1;
  const sizey = haarClassifier.size2;
  const startx = scaledSelection.x;
  const starty = scaledSelection.y;
  const sl = haarStages.length;
  const bx1 = 0;
  const bx2 = width - 1;
  const by1 = 0;
  const by2 = imArea - width;
  const xsize = ~~(scale * sizex); 
  const xstep = ~~(xsize * increment); 
  const ysize = ~~(scale * sizey); 
  const ystep = ~~(ysize * increment);
  const tyw = ysize * width; 
  const tys = ystep * width; 
  const startty = starty * tys; 
  const xl = width - xsize; 
  const yl = height - ysize;
  const swh = xsize * ysize; 
  const inv_area = 1.0 / swh;
  let edges_density;
  let kr, r, x1, y1, x2, y2, x3, y3, x4, y4, rw, rh, yw, yh;

  for (let y = starty, ty = startty; y < yl; y += ystep, ty += tys) {
    for (let x = startx; x < xl; x += xstep) {
      let p0 = x - 1 + ty-width;
      let p1 = p0 + xsize;
      let p2 = p0 + tyw;
      let p3 = p2 + xsize;
      
      // clamp
      p0 = (p0 < 0) ? 0 : (p0 > imArea1) ? imArea1 : p0;
      p1 = (p1 < 0) ? 0 : (p1 > imArea1) ? imArea1 : p1;
      p2 = (p2 < 0) ? 0 : (p2 > imArea1) ? imArea1 : p2;
      p3 = (p3 < 0) ? 0 : (p3 > imArea1) ? imArea1 : p3;
      
      if (doCanny) {
        // avoid overflow
        edges_density = inv_area * (canny[p3] - canny[p2] - canny[p1] + canny[p0]);
        if (edges_density < cannyLow || edges_density > cannyHigh) continue;
      }
      
      // pre-compute some values for speed
      // avoid overflow
      const total_x = inv_area * (integral[p3] - integral[p2] - integral[p1] + integral[p0]);
      const total_x2 = inv_area * (squares[p3] - squares[p2] - squares[p1] + squares[p0]);
      let vnorm = total_x2 - total_x * total_x;
      vnorm = (vnorm > 1) ? Math.sqrt(vnorm) : /*vnorm*/  1 ;  
      
      let pass = true;
      for (let s = 0; s < sl; s++) {
        // Viola-Jones HAAR-Stage evaluator
        const stage = haarStages[s];
        const threshold = stage.thres;
        const trees = stage.trees;
        let sum = 0;
        
        for (let t = 0; t < trees.length; t++) { 
          //
          // inline the tree and leaf evaluators to avoid function calls per-loop (faster)
          //
          
          // Viola-Jones HAAR-Tree evaluator
          const features = trees[t].feats; 
          let cur_node_ind = 0;
          while (true) {
            let feature = features[cur_node_ind]; 
            
            // Viola-Jones HAAR-Leaf evaluator
            let rects = feature.rects; 
            let nb_rects = rects.length; 
            let thresholdf = feature.thres; 
            let rect_sum = 0;
            
            if (feature.tilt) {
              // tilted rectangle feature, Lienhart et al. extension
              for (kr = 0; kr < nb_rects; kr++) {
                r = rects[kr];
                
                // this produces better/larger features, possible rounding effects??
                x1 = x + ~~(scale * r[0]);
                y1 = (y - 1 + ~~(scale * r[1])) * width;
                x2 = x + ~~(scale * (r[0] + r[2]));
                y2 = (y - 1 + ~~(scale * (r[1] + r[2]))) * width;
                x3 = x + ~~(scale * (r[0] - r[3]));
                y3 = (y - 1 + ~~(scale * (r[1] + r[3]))) * width;
                x4 = x + ~~(scale * (r[0] + r[2] - r[3]));
                y4 = (y - 1 + ~~(scale * (r[1] + r[2] + r[3]))) * width;
                
                // clamp
                x1 = (x1 < bx1) ? bx1 : (x1 > bx2) ? bx2 : x1;
                x2 = (x2 < bx1) ? bx1 : (x2 > bx2) ? bx2 : x2;
                x3 = (x3 < bx1) ? bx1 : (x3 > bx2) ? bx2 : x3;
                x4 = (x4 < bx1) ? bx1 : (x4 > bx2) ? bx2 : x4;
                y1 = (y1 < by1) ? by1 : (y1 > by2) ? by2 : y1;
                y2 = (y2 < by1) ? by1 : (y2 > by2) ? by2 : y2;
                y3 = (y3 < by1) ? by1 : (y3 > by2) ? by2 : y3;
                y4 = (y4 < by1) ? by1 : (y4 > by2) ? by2 : y4;
                
                // RSAT(x-h+w, y+w+h-1) + RSAT(x, y-1) - RSAT(x-h, y+h-1) - RSAT(x+w, y+w-1)
                //        x4     y4            x1  y1          x3   y3            x2   y2
                rect_sum+= r[4] * (tilted[x4 + y4] - tilted[x3 + y3] - tilted[x2 + y2] + tilted[x1 + y1]);
              }
            } else {
              // orthogonal rectangle feature, Viola-Jones original
              for (kr = 0; kr < nb_rects; kr++) {
                r = rects[kr];
                
                // this produces better/larger features, possible rounding effects??
                x1 = x - 1 + ~~(scale * r[0]); 
                x2 = x - 1 + ~~(scale * (r[0] + r[2]));
                y1 = (width) * (y-1 + ~~(scale * r[1])); 
                y2 = (width) * (y-1 + ~~(scale * (r[1] + r[3])));
                
                // clamp
                x1 = (x1 < bx1) ? bx1 : (x1 > bx2) ? bx2 : x1;
                x2 = (x2 < bx1) ? bx1 : (x2 > bx2) ? bx2 : x2;
                y1 = (y1 < by1) ? by1 : (y1 > by2) ? by2 : y1;
                y2 = (y2 < by1) ? by1 : (y2 > by2) ? by2 : y2;
                
                // SAT(x-1, y-1) + SAT(x+w-1, y+h-1) - SAT(x-1, y+h-1) - SAT(x+w-1, y-1)
                //      x1   y1         x2      y2          x1   y1            x2    y1
                rect_sum += r[4] * (integral[x2 + y2]  - integral[x1 + y2] - integral[x2 + y1] + integral[x1 + y1]);
              }
            }
            
            let where = (rect_sum * inv_area < thresholdf * vnorm) ? 0 : 1;
            // END Viola-Jones HAAR-Leaf evaluator
            
            if (where) {
              if (feature.has_r) {
                sum += feature.r_val;
                break;
              } else {
                cur_node_ind = feature.r_node; 
              }
            } else {
              if (feature.has_l) {
                sum += feature.l_val;
                break;
              } else {
                cur_node_ind = feature.l_node;
              }
            }
          }
          // END Viola-Jones HAAR-Tree evaluator
        }
        pass = (sum > threshold) ? true : false;
        // END Viola-Jones HAAR-Stage evaluator
        if (!pass) {
          break
        };
      }
      
      if (pass) {
        output.push({
          index,
          x,
          y,
          width: xsize,
          height: ysize
        });
      }
    }
  }
  
  // return any features found in this step
  return output;
}

export default detect;
