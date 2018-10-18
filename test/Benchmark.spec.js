import { Benchmark } from '../src';

describe('Tests for Benchmark', () => {
  it('runs the provided benchmark tasks', async () => {
    const images = [{ width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 4]) }];
    const tasks = [
      { id: 1, name: 'BoxBlur', config: {} },
      { id: 2, name: 'BoxBlur', config: { useWasm: true } },
      { id: 3, name: 'Cooling', config: {} },
      { id: 4, name: 'Cooling', config: { useWasm: true } }
    ];
    const onProgress = jest.fn();
    const benchmark = new Benchmark(tasks, images, onProgress);
    const [r1, r2, r3, r4] = await benchmark.run();
    expect(r1.name).toEqual('BoxBlur');
    expect(r1.id).toEqual(1);
    expect(r1.duration).toBeDefined();
    expect(r1.average).toBeDefined();
    expect(r2.name).toEqual('BoxBlur');
    expect(r2.id).toEqual(2);
    expect(r2.duration).toBeDefined();
    expect(r2.average).toBeDefined();
    expect(r3.name).toEqual('Cooling');
    expect(r3.id).toEqual(3);
    expect(r3.duration).toBeDefined();
    expect(r3.average).toBeDefined();
    expect(r4.name).toEqual('Cooling');
    expect(r4.id).toEqual(4);
    expect(r4.duration).toBeDefined();
    expect(r4.average).toBeDefined();
    expect(onProgress).toHaveBeenCalledTimes(4);
  });
});
