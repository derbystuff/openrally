'use strict';

const LazyEvents = require('./lazyevents').LazyEvents;
const ENV = require('./env');
const path = require('path');
const fs = require('fs');

class FileConfig extends LazyEvents{
  constructor(options){
    super();
    this.values = {};
    setImmediate(()=>this.loadSettings());
  }

  loadSettings(){
    return fs.readFile(path.resolve(__dirname, `../config/${ENV}.config.js`), (err, settings)=>{
      if(err){
        return this.emit('error', err);
      }
      this.emit('ready', this);
    });
  }
};

let fileconfig = new FileConfig();
fileconfig.FileConfig = FileConfig;

module.exports = fileconfig;
