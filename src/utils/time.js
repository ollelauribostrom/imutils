const isNode = typeof process === 'object' && typeof require === 'function';
const perf = isNode ? require('perf_hooks').performance : performance;

export function timed(fn) {
  const start = perf.now();
  const value = fn();
  return {
    value,
    duration: perf.now() - start
  };
}

export function round(ms, numberOfDecimals) {
  return parseFloat(ms.toFixed(numberOfDecimals));
}
