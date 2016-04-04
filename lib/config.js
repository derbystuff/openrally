'use strict';

const args = require('./cmdargs').parseArgs({
}, process.argv);
const {
  extend,
  valueFromObjectCI,
} = require('./utils');
const EventEmitter = require('./lazyevents').LazyEvents;

class Config extends EventEmitter{
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
    this.emit('ready');
  }

  get(key, defaultValue){
    return valueFromObjectCI(this.config, key, defaultValue);
  }

  set(key, value){
    return this.config = setObjectValueCI(this.config, key, value);
  }
};

let config = new Config({
  args: args
});

config.Config = Config;

module.exports = config;
