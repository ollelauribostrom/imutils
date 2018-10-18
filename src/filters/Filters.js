import Filter from './Filter';
import { timed } from '../utils/time';
import { generateSuccessMessage, generateErrorMessage } from '../utils/messages';

export default class Filters {
  constructor() {
    this.filters = {};
  }
  async build() {
    this.filters.BoxBlur = new Filter({
      exported: 'boxBlur',
      path: {
        wasm: 'src/filters/BoxBlur/boxBlur.wasm',
        js: './BoxBlur/boxBlur.js'
      }
    });
    this.filters.Cooling = new Filter({
      exported: 'cooling',
      path: {
        wasm: 'src/filters/Cooling/cooling.wasm',
        js: './Cooling/cooling.js'
      }
    });
    this.filters.GaussianBlur = new Filter({
      exported: 'gaussianBlur',
      path: {
        wasm: 'src/filters/GaussianBlur/gaussianBlur.wasm',
        js: './GaussianBlur/gaussianBlur.js'
      }
    });
    this.filters.Grayscale = new Filter({
      exported: 'grayscale',
      path: {
        wasm: 'src/filters/Grayscale/grayscale.wasm',
        js: './Grayscale/grayscale.js'
      }
    });
    this.filters.Invert = new Filter({
      exported: 'invert',
      path: {
        wasm: 'src/filters/Invert/invert.wasm',
        js: './Invert/invert.js'
      }
    });
    this.filters.Sharpen = new Filter({
      exported: 'sharpen',
      path: {
        wasm: 'src/filters/Sharpen/sharpen.wasm',
        js: './Sharpen/sharpen.js'
      }
    });
    return Promise.all(Object.keys(this.filters).map(filter => this.filters[filter].build()));
  }
  async apply(type, imageData, config = {}) {
    const filter = this.filters[type];
    if (!filter) {
      throw new Error('Filter not found');
    }
    try {
      const fn = filter.apply.bind(filter, imageData, config);
      const result = timed(fn);
      const language = config.useWasm ? 'WebAssembly' : 'JavaScript';
      result.message = generateSuccessMessage(type, language, result.duration);
      return result;
    } catch (error) {
      const result = {};
      const language = config.useWasm ? 'WebAssembly' : 'JavaScript';
      result.error = error;
      result.message = generateErrorMessage(type, language);
      return result;
    }
  }
}
