const electron = require('electron');
const path = require('path');

const fs = require('fs');
// const { app: app_remote } = require('@electron/remote');
const app_remote = null;

class Store {
  constructor(options) {
    const userDataPath = (electron.app || app_remote).getPath('userData');

    this.path = path.join(userDataPath, options.configName + '.json');
    this.data = parseDataFile(this.path, options.defaults);
    console.log('Config path: ' + this.path);
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (err) {
    return defaults;
  }
}

module.exports = Store;
