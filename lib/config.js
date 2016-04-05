'use strict';

const args = require('./cmdargs').args;
const {
  extend,
  valueFromObjectCI,
} = require('./utils');
const db = require('./db');
const fileconfig = require('./fileconfig');
const LazyEvents = require('./lazyevents').LazyEvents;
const ENV = require('./env').ENV;

class Config extends LazyEvents{
  constructor(options){
    super();
    const {
      args = {},
      config = {},
    } = options;
    this.args = args;
    this.baseConfig = config;
    this.config = extend(true, {}, args, config);
    this.events = {};
    this._loaded = {};
    fileconfig.on('ready', (fileConfig)=>this.loadFileSettings(fileConfig));
    fileconfig.on('error', (err)=>this.emit('error', err));
    db.on('ready', (db)=>this.loadDBSettings(db));
    db.on('error', (err)=>this.emit('error', err));
  }

  loadFileSettings(config){
    this._loaded.file = true;
    this.config = extend(true, {}, this.config, config.values);
    this.checkReady();
  }

  loadDBSettings(db){
    const collection = db.collection('config');
    collection.list({}, (err, results)=>{
      if(err){
        return this.emit('error', err);
      }
      this._loaded.db = true;
      this.checkReady();
    });
  }

  checkReady(){
    if(this._loaded.db && this._loaded.file && (!this._ready)){
      this._ready = true;
      this.emit('ready');
    }
  }

  get(key, defaultValue){
    return valueFromObjectCI(this.config, key, defaultValue);
  }

  set(key, value){
    return this.config = setObjectValueCI(this.config, key, value);
  }
};

let config = new Config({
  args,
});
config.Config = Config;

module.exports = config;
