const path = require('path');
const fs = require('fs');
const compiler = require('webassembly/cli/compiler');

const files = fs.readdirSync(path.resolve('./src/filters'));
const folders = files.filter(file => fs.lstatSync(path.join('./src/filters/', file)).isDirectory());
const filters = folders.map((folder) => {
  const name = folder.charAt(0).toLowerCase() + folder.slice(1);
  return {
    name,
    out: path.join('./src/filters', folder, `${name}.wasm`),
    src: path.join('./src/filters', folder, `${name}.c`),
  };
});

function compile(filter) {
  return new Promise((resolve, reject) => {
    compiler.main([
      '-o',
      filter.out,
      filter.src,
    ], (err) => {
      if (err) {
        throw reject(err);
      }
      resolve();
    });
  });
}

Promise.all(filters.map(compile))
  .then(() => {
    console.log('\n');
    console.log(`Compiled ${filters.length} filters`);
    filters.forEach(filter => console.log(`Filter: ${filter.name} -> ${filter.out}`));
  })
  .catch((err) => { throw err; });
