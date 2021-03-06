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
      // https://github.com/WebAssembly/design/issues/1231
      // https://becominghuman.ai/passing-and-returning-webassembly-array-parameters-a0f572c65d97
      const output = [];
      const size = imageData.data.length;
      const adress = this.wasm.exports.create_buffer(size);
      const wasmArray = new Uint8ClampedArray(this.wasm.memory.buffer, adress, size);
      wasmArray.set(imageData.data);
      const result = this.wasm.exports[this.exported](
        adress,
        imageData.width,
        imageData.height,
        size
      );
      for (let i = 0; i < size; i += 1) {
        output.push(this.wasm.memory.U8[result / Uint8Array.BYTES_PER_ELEMENT + i]);
      }
      this.wasm.exports.destroy_buffer(adress);
      return Uint8ClampedArray.from(output);
    }
    return this.js[this.exported](imageData.data, imageData.width, imageData.height);
  }
}
