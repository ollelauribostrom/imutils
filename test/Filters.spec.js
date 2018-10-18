import { diff } from 'uint8clampedarray-utils';
import Filters from '../src/filters/Filters';

const filters = new Filters();

/*
TODO:
- Use pngjs-image to construct images to test each algorithm with and make sure that there
  is no output diff and possibly that they matches image snapshots
*/

describe('Tests for Filters', () => {
  beforeAll(async () => {
    await filters.build();
  });
  describe('BoxBlur', () => {
    it('correctly applies the box blur filter using JavaScript', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const result = await filters.apply('BoxBlur', imageData);
      expect(result.value).toEqual(new Uint8ClampedArray([1, 4, 9, 16]));
      expect(result.message).toEqual(expect.stringContaining('Applied box blur using JavaScript'));
      expect(imageData.data).toEqual(new Uint8ClampedArray([1, 2, 3, 4]));
    });
    it('correctly applies the box blur filter using WebAssembly', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const result = await filters.apply('BoxBlur', imageData, { useWasm: true });
      expect(result.value).toEqual(new Uint8ClampedArray([1, 4, 9, 16]));
      expect(result.message).toEqual(expect.stringContaining('Applied box blur using WebAssembly'));
      expect(imageData.data).toEqual(new Uint8ClampedArray([1, 2, 3, 4]));
    });
    it('outputs the same results from JavaScript and WebAssembly', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const jsResult = await filters.apply('BoxBlur', imageData);
      const wasmResult = await filters.apply('BoxBlur', imageData, { useWasm: true });
      await expect(diff(jsResult.value, wasmResult.value)).resolves.toEqual({
        diffCount: 0,
        diffPercentage: 0,
      });
    });
    it('produces correct error messages', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const filterSpy = jest.spyOn(filters.filters.BoxBlur, 'apply');
      const mockError = new Error('Error from filter');
      filterSpy.mockImplementation(() => { throw mockError; });
      const jsResult = await filters.apply('BoxBlur', imageData);
      const wasmResult = await filters.apply('BoxBlur', imageData, { useWasm: true });
      expect(jsResult.message).toEqual('Error while applying box blur using JavaScript');
      expect(wasmResult.message).toEqual('Error while applying box blur using WebAssembly');
      filterSpy.mockRestore();
    });
  });
  describe('Cooling', () => {
    it('correctly applies the cooling filter using JavaScript', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const result = await filters.apply('Cooling', imageData);
      expect(result.value).toEqual(new Uint8ClampedArray([1, 4, 9, 16]));
      expect(result.message).toEqual(expect.stringContaining('Applied a cooling filter using JavaScript'));
      expect(imageData.data).toEqual(new Uint8ClampedArray([1, 2, 3, 4]));
    });
    it('correctly applies the cooling filter using WebAssembly', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const result = await filters.apply('Cooling', imageData, { useWasm: true });
      expect(result.value).toEqual(new Uint8ClampedArray([1, 4, 9, 16]));
      expect(result.message).toEqual(expect.stringContaining('Applied a cooling filter using WebAssembly'));
      expect(imageData.data).toEqual(new Uint8ClampedArray([1, 2, 3, 4]));
    });
    it('outputs the same results from JavaScript and WebAssembly', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const jsResult = await filters.apply('Cooling', imageData);
      const wasmResult = await filters.apply('Cooling', imageData, { useWasm: true });
      await expect(diff(jsResult.value, wasmResult.value)).resolves.toEqual({
        diffCount: 0,
        diffPercentage: 0,
      });
    });
    it('produces correct error messages', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const filterSpy = jest.spyOn(filters.filters.Cooling, 'apply');
      const mockError = new Error('Error from filter');
      filterSpy.mockImplementation(() => { throw mockError; });
      const jsResult = await filters.apply('Cooling', imageData);
      const wasmResult = await filters.apply('Cooling', imageData, { useWasm: true });
      expect(jsResult.message).toEqual('Error while applying a cooling filter using JavaScript');
      expect(wasmResult.message).toEqual('Error while applying a cooling filter using WebAssembly');
      filterSpy.mockRestore();
    });
  });
  describe('GaussianBlur', () => {
    it('correctly applies the gaussian blur filter using JavaScript', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const result = await filters.apply('GaussianBlur', imageData);
      expect(result.value).toEqual(new Uint8ClampedArray([1, 4, 9, 16]));
      expect(result.message).toEqual(expect.stringContaining('Applied gaussian blur using JavaScript'));
      expect(imageData.data).toEqual(new Uint8ClampedArray([1, 2, 3, 4]));
    });
    it('correctly applies the gaussian blur filter using WebAssembly', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const result = await filters.apply('GaussianBlur', imageData, { useWasm: true });
      expect(result.value).toEqual(new Uint8ClampedArray([1, 4, 9, 16]));
      expect(result.message).toEqual(expect.stringContaining('Applied gaussian blur using WebAssembly'));
      expect(imageData.data).toEqual(new Uint8ClampedArray([1, 2, 3, 4]));
    });
    it('outputs the same results from JavaScript and WebAssembly', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const jsResult = await filters.apply('GaussianBlur', imageData);
      const wasmResult = await filters.apply('GaussianBlur', imageData, { useWasm: true });
      await expect(diff(jsResult.value, wasmResult.value)).resolves.toEqual({
        diffCount: 0,
        diffPercentage: 0,
      });
    });
    it('produces correct error messages', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const filterSpy = jest.spyOn(filters.filters.GaussianBlur, 'apply');
      const mockError = new Error('Error from filter');
      filterSpy.mockImplementation(() => { throw mockError; });
      const jsResult = await filters.apply('GaussianBlur', imageData);
      const wasmResult = await filters.apply('GaussianBlur', imageData, { useWasm: true });
      expect(jsResult.message).toEqual('Error while applying gaussian blur using JavaScript');
      expect(wasmResult.message).toEqual('Error while applying gaussian blur using WebAssembly');
      filterSpy.mockRestore();
    });
  });
  describe('Grayscale', () => {
    it('correctly applies the grayscale filter using JavaScript', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const result = await filters.apply('Grayscale', imageData);
      expect(result.value).toEqual(new Uint8ClampedArray([1, 4, 9, 16]));
      expect(result.message).toEqual(expect.stringContaining('Converted image to grayscale using JavaScript'));
      expect(imageData.data).toEqual(new Uint8ClampedArray([1, 2, 3, 4]));
    });
    it('correctly applies the grayscale filter using WebAssembly', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const result = await filters.apply('Grayscale', imageData, { useWasm: true });
      expect(result.value).toEqual(new Uint8ClampedArray([1, 4, 9, 16]));
      expect(result.message).toEqual(expect.stringContaining('Converted image to grayscale using WebAssembly'));
      expect(imageData.data).toEqual(new Uint8ClampedArray([1, 2, 3, 4]));
    });
    it('outputs the same results from JavaScript and WebAssembly', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const jsResult = await filters.apply('Grayscale', imageData);
      const wasmResult = await filters.apply('Grayscale', imageData, { useWasm: true });
      await expect(diff(jsResult.value, wasmResult.value)).resolves.toEqual({
        diffCount: 0,
        diffPercentage: 0,
      });
    });
    it('produces correct error messages', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const filterSpy = jest.spyOn(filters.filters.Grayscale, 'apply');
      const mockError = new Error('Error from filter');
      filterSpy.mockImplementation(() => { throw mockError; });
      const jsResult = await filters.apply('Grayscale', imageData);
      const wasmResult = await filters.apply('Grayscale', imageData, { useWasm: true });
      expect(jsResult.message).toEqual('Error while converting image to grayscale using JavaScript');
      expect(wasmResult.message).toEqual('Error while converting image to grayscale using WebAssembly');
      filterSpy.mockRestore();
    });
  });
  describe('Invert', () => {
    it('correctly applies the inversion filter using JavaScript', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const result = await filters.apply('Invert', imageData);
      expect(result.value).toEqual(new Uint8ClampedArray([1, 4, 9, 16]));
      expect(result.message).toEqual(expect.stringContaining('Inverted image using JavaScript'));
      expect(imageData.data).toEqual(new Uint8ClampedArray([1, 2, 3, 4]));
    });
    it('correctly applies the inversion filter using WebAssembly', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const result = await filters.apply('Invert', imageData, { useWasm: true });
      expect(result.value).toEqual(new Uint8ClampedArray([1, 4, 9, 16]));
      expect(result.message).toEqual(expect.stringContaining('Inverted image using WebAssembly'));
      expect(imageData.data).toEqual(new Uint8ClampedArray([1, 2, 3, 4]));
    });
    it('outputs the same results from JavaScript and WebAssembly', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const jsResult = await filters.apply('Invert', imageData);
      const wasmResult = await filters.apply('Invert', imageData, { useWasm: true });
      await expect(diff(jsResult.value, wasmResult.value)).resolves.toEqual({
        diffCount: 0,
        diffPercentage: 0,
      });
    });
    it('produces correct error messages', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const filterSpy = jest.spyOn(filters.filters.Invert, 'apply');
      const mockError = new Error('Error from filter');
      filterSpy.mockImplementation(() => { throw mockError; });
      const jsResult = await filters.apply('Invert', imageData);
      const wasmResult = await filters.apply('Invert', imageData, { useWasm: true });
      expect(jsResult.message).toEqual('Error while inverting image using JavaScript');
      expect(wasmResult.message).toEqual('Error while inverting image using WebAssembly');
      filterSpy.mockRestore();
    });
  });
  describe('Sharpen', () => {
    it('correctly applies the sharpening filter using JavaScript', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const result = await filters.apply('Sharpen', imageData);
      expect(result.value).toEqual(new Uint8ClampedArray([1, 4, 9, 16]));
      expect(result.message).toEqual(expect.stringContaining('Sharpened image using JavaScript'));
      expect(imageData.data).toEqual(new Uint8ClampedArray([1, 2, 3, 4]));
    });
    it('correctly applies the sharpening filter using WebAssembly', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const result = await filters.apply('Sharpen', imageData, { useWasm: true });
      expect(result.value).toEqual(new Uint8ClampedArray([1, 4, 9, 16]));
      expect(result.message).toEqual(expect.stringContaining('Sharpened image using WebAssembly'));
      expect(imageData.data).toEqual(new Uint8ClampedArray([1, 2, 3, 4]));
    });
    it('outputs the same results from JavaScript and WebAssembly', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const jsResult = await filters.apply('Sharpen', imageData);
      const wasmResult = await filters.apply('Sharpen', imageData, { useWasm: true });
      await expect(diff(jsResult.value, wasmResult.value)).resolves.toEqual({
        diffCount: 0,
        diffPercentage: 0,
      });
    });
    it('produces correct error messages', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const filterSpy = jest.spyOn(filters.filters.Sharpen, 'apply');
      const mockError = new Error('Error from filter');
      filterSpy.mockImplementation(() => { throw mockError; });
      const jsResult = await filters.apply('Sharpen', imageData);
      const wasmResult = await filters.apply('Sharpen', imageData, { useWasm: true });
      expect(jsResult.message).toEqual('Error while sharpening image using JavaScript');
      expect(wasmResult.message).toEqual('Error while sharpening image using WebAssembly');
      filterSpy.mockRestore();
    });
  });
  describe('Error handling', () => {
    it('rejects the promise when called with an unknown filter type', async () => {
      const imageData = { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) };
      const resultPromise = filters.apply('UNKNOWN', imageData, { useWasm: true });
      await expect(resultPromise).rejects.toThrowError('Filter not found');
    });
  });
});
