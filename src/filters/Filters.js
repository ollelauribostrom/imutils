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
        js: './BoxBlur/boxBlur.js',
      },
    });
    for(const filter in this.filters) {
      await this.filters[filter].build();
    }
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
      result.error = error;
      result.message = generateErrorMessage(type);
      return result;
    }
  }
}
