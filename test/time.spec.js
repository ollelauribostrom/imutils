import { time } from '../src';

describe('Tests for time', () => {
  describe('timed', () => {
    it('executes and times the provided function', () => {
      const square = n => n * n;
      const fn = square.bind(null, 2);
      const result = time.timed(fn);
      expect(result.duration).toBeDefined();
      expect(result.value).toEqual(4);
    });
  });
  describe('round', () => {
    it('correctly rounds a number to the given decimal place', () => {
      expect(time.round(0.12345, 2)).toEqual(0.12);
      expect(time.round(1.99995, 4)).toEqual(1.9999);
    });
  });
});
