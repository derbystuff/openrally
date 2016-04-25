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

  configFileName(){
    return this.args.configFile || path.resolve(__dirname, `../configs/${ENV}.config.js`);
  }

  loadSettings(){
    const configFileName = this.configFileName();

    return fs.readFile(configFileName, (err, settings)=>{
      if(err && err.toString().match(/no such file or directory/)){
        logger.error(`Config file "${configFileName}" not found`);
        return this.emit('ready', this);
      }
      if(err){
        return this.emit('error', err);
      }
      try{
        const f = new Function('', `return ${settings};`);
        this.values = f();
      }catch(e){
        return this.emit('error', e);
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
