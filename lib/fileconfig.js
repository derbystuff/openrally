'use strict';

const LazyEvents = require('./lazyevents').LazyEvents;
const ENV = require('./env').ENV;
const path = require('path');
const fs = require('fs');
const logger = require('./logger');
const args = require('./cmdargs').args;
const {
  valueFromObjectCI,
} = require('./utils');

class FileConfig extends LazyEvents{
  constructor(options = {}){
    super();
    this.values = {};
    this.args = options.args;
    setImmediate(()=>this.loadSettings());
  }

  loadSettings(){
    const configFileName = this.args.configFile || path.resolve(__dirname, `../configs/${ENV}.config.js`);

    return fs.readFile(configFileName, (err, settings)=>{
      if(err && err.toString().match(/no such file or directory/)){
        logger.error(`Config file "${configFileName}" not found`);
        return this.emit('ready', this);
      }
      if(err){
        return this.emit('error', err);
      }
      try{
        this.values = JSON.parse(settings);
      }catch(e){
        return this.emit('error', err);
      }
      this.emit('ready', this);
    });
  }

  get(key, defaultValue){
    return valueFromObjectCI(this.values, key, defaultValue);
  }

  set(key, value){
    return this.config = setObjectValueCI(this.values, key, value);
  }
};

let fileconfig = new FileConfig({args});
fileconfig.FileConfig = FileConfig;

module.exports = fileconfig;
