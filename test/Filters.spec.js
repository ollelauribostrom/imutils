import Filters from '../src/filters/Filters';

describe('Tests for Filters', () => {
  describe('BoxBlur', () => {
    describe('JS', () => {
      it('works', async () => {
        const filters = new Filters();
        const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
        await filters.build();
        const result = await filters.apply('BoxBlur', imageData);
        expect(result.value).toEqual([1, 4, 9, 16]);
        expect(result.message).toEqual(expect.stringContaining('Applied box blur using JavaScript'));
      });
    });
    describe('WASM', () => {
      it('works', async () => {
        const filters = new Filters();
        const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
        await filters.build();
        const result = await filters.apply('BoxBlur', imageData, { useWasm: true });
        expect(result.value).toEqual([1, 4, 9, 16]);
        expect(result.message).toEqual(expect.stringContaining('Applied box blur using WebAssembly'));
      });
    });
  });
});
