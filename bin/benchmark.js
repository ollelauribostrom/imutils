const path = require('path');
const fs = require('fs');
const getPixels = require('get-pixels');
const { Benchmark } = require('../dist');

const OUTPUT_PATH = 'benchmark/results.json';
const BENCHMARKS = [];
let NUMBER_OF_IMAGES = 0;
const NUMBER_OF_RUNS = 1;
const TASKS = [
  { id: 1, name: 'BoxBlur', config: {} },
  { id: 2, name: 'BoxBlur', config: { useWasm: true } },
];

function asyncGetPixel(imagePath) {
  return new Promise((resolve, reject) => {
    getPixels(imagePath, (err, pixels) => {
      if (err) {
        return reject(err);
      }
      return resolve({
        width: pixels.shape[0],
        height: pixels.shape[1],
        data: new Uint8ClampedArray(pixels.data),
      });
    });
  });
}

function getImages() {
  const files = fs.readdirSync(path.resolve('./benchmark'));
  const images = files.filter(file => path.extname(file) === '.jpg' || path.extname(file) === '.png');
  const imagePaths = images.map(image => path.join('./benchmark', image));
  return Promise.all(imagePaths.map(imagePath => asyncGetPixel(imagePath)));
}

function getSummary(r) {
  const results = [].concat(...r);
  return TASKS.map((task) => {
    const taskResults = results.filter(result => result.id === task.id);
    const duration = taskResults.reduce((total, result) => total + result.duration, 0);
    const average = duration / taskResults.length;
    return { ...task, duration, average };
  });
}

function printSummary(summary) {
  console.log('\n');
  console.log('************************************');
  console.log('* BENCHMARK SUMMARY ****************');
  console.log('************************************');
  console.log('\n');
  console.log(`-> Ran ${TASKS.length} tasks`);
  console.log(`-> Ran ${NUMBER_OF_RUNS} runs`);
  console.log(`-> Used ${NUMBER_OF_IMAGES} images`);
  console.log('-> Full report written to /benchmark/results.json');
  console.log('\n');
  console.log('SUMMARY:');
  console.log(JSON.stringify(summary, null, 2));
}

function writeToFile(summary, runs) {
  const data = { numberOfRuns: NUMBER_OF_RUNS, summary, runs };
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
}

getImages()
  .then((imageArray) => {
    NUMBER_OF_IMAGES = imageArray.length;
    for (let i = 0; i < NUMBER_OF_RUNS; i += 1) {
      BENCHMARKS.push(new Benchmark(TASKS, imageArray, () => {}));
    }
    return Promise.all(BENCHMARKS.map(b => b.run()));
  })
  .then((results) => {
    const summary = getSummary(results);
    printSummary(summary);
    writeToFile(summary, results);
  })
  .catch(err => console.log(err));
