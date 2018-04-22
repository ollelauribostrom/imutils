/**
 * Ported from HAAR.js
 * src: https://github.com/foo123/HAAR.js/
 */

class Feature {
  constructor(x, y, w, h, i) {
    this.index = 0;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.area = 0;
    this.data(x, y, w, h, i)
  }

  data(x, y, w, h, i) {
    if (x && (x instanceof Feature)) {
      this.copy(x);
    } else if (x && (x instanceof Object)) {
      this.x = x.x || 0;
      this.y = x.y || 0;
      this.width = x.width || 0;
      this.height = x.height || 0;
      this.index = x.index || 0;
      this.area = x.area || 0;
      this.isInside = x.isInside || false;
    } else {
      this.x = x || 0;
      this.y = y || 0;
      this.width = w || 0;
      this.height = h || 0;
      this.index = i || 0;
      this.area = 0;
      this.isInside = false;
    }
    
    return this;
  }

  add(f) { 
    this.x += f.x; 
    this.y += f.y; 
    this.width += f.width; 
    this.height += f.height; 
    return this; 
  }
  
  scale(s) { 
    this.x *= s; 
    this.y *= s; 
    this.width *= s; 
    this.height *= s; 
    return this; 
  }
  
  round() { 
    this.x = ~~(this.x+0.5); 
    this.y = ~~(this.y+0.5); 
    this.width = ~~(this.width+0.5); 
    this.height = ~~(this.height+0.5); 
    return this; 
  }
  
  computeArea() { 
    this.area = this.width*this.height; 
    return this.area; 
  } 
  
  inside(f) { 
    return !!( 
      (this.x >= f.x) && 
      (this.y >= f.y) && 
      (this.x+this.width <= f.x+f.width) && 
      (this.y+this.height <= f.y+f.height)
    ); 
  }
  
  contains(f) { 
    return f.inside(this); 
  }
  
  equal(f) { 
    return !!(
      (f.x === this.x) && 
      (f.y === this.y) && 
      (f.width === this.width) && 
      (f.height === this.height)
    ); 
  }
  
  almostEqual(f) {
    const d1 = Math.max(f.width, this.width) * 0.2;
    const d2 = Math.max(f.height, this.height) * 0.2;
    return !!( 
      Math.abs(this.x-f.x) <= d1 && 
      Math.abs(this.y-f.y) <= d2 && 
      Math.abs(this.width-f.width) <= d1 && 
      Math.abs(this.height-f.height) <= d2 
    ); 
  }
  
  clone() {
    const f = new Feature();
    f.x = this.x; 
    f.y = this.y; 
    f.width = this.width; 
    f.height = this.height; 
    f.index = this.index; 
    f.area = this.area; 
    f.isInside = this.isInside;
    return f;
  }
  
  copy(f) {
    if ( f && (f instanceof Feature) ) {
      this.x = f.x; 
      this.y = f.y; 
      this.width = f.width; 
      this.height = f.height; 
      this.index = f.index; 
      this.area = f.area; 
      this.isInside = f.isInside;
    }
    return this;
  }
  
  toString() {
    return ['[ x:', this.x, 'y:', this.y, 'width:', this.width, 'height:', this.height, ']'].join(' ');
  }
}

export default Feature;
