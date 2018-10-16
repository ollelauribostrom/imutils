import webassembly from 'webassembly';

export default class Filter {
  constructor({ exported, path }) {
    this.exported = exported;
    this.path = path;
  }
  async build() {
    this.wasm = await webassembly.load(this.path.wasm);
    this.js = require(this.path.js);
  }
  apply(imageData, config) {
    if (config.useWasm) {
      const output = [];
      const size = imageData.length;
      const adress = this.wasm.exports.create_buffer(size);
      this.wasm.memory.U8.set(imageData, adress);
      const result = this.wasm.exports[this.exported](adress, size);
      for (let i = 0; i < size; i++) {
        output.push(this.wasm.memory.U8[result / Uint8Array.BYTES_PER_ELEMENT + i]);
      }
      this.wasm.exports.destroy_buffer(adress);
      return output;
    }
    return this.js[this.exported](imageData);
  }
}
