import { scaleToFit } from '../src';

describe('Tests for size', () => {
  describe('scaleToFit', () => {
    it('scales the image to fit the provided maxWidth', () => {
      const image = { width: 20, height: 10 };
      scaleToFit(image, 10, 10);
      expect(image).toEqual({ width: 10, height: 5 });
    });
    it('scales the image to fit the provided maxHeight', () => {
      const image = { width: 10, height: 20 };
      scaleToFit(image, 10, 10);
      expect(image).toEqual({ width: 5, height: 10 });
    });
  });
});
