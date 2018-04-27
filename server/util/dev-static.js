
const webpack = require('webpack');
const path = require('path');
const MemoryFs = require('memory-fs');
const fs = new MemoryFs();
const serverRender = require('./server-render');


// const proxy = require('http-proxy-middleware');

const requireFromString = require('require-from-string');
const getTemplate = require('./getBody');

let serverBundle = null;
let createStoreMap = null;
const serverConfig = require('../../build/webpack.config.server');
const outputErrors = (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson();
  if (stats.hasErrors()) {
    console.error(info.errors);
  }
  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }
};

let serverComplier = webpack(serverConfig);
serverComplier.outputFileSystem = fs;
serverComplier.watch({}, (err, stats) => {
  outputErrors(err, stats);

});



module.exports = (url) => {
  return new Promise((resolve, reject) => {
    getTemplate('/public/server.ejs')
      .then(template => {
        const contents = fs.readFileSync(path.resolve(serverConfig.output.path, serverConfig.output.filename), 'utf8');
        const app = requireFromString(contents, serverConfig.output.filename);
        serverRender(app, template, url)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
      })
      .catch(err => {
        reject(err);
      });
  });
};
