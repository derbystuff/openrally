'use strict';

var LevelDown = require('leveldown');
var LevelUp = require('levelup');
var fileconfig = require('./fileconfig');
var LazyEvents = require('./lazyevents').LazyEvents;

class Collection{
  constructor(name){
    this.name = name;
  }

  get(id, callback){
    return setImmediate(()=>{
      return callback(new Error('Not implemented'));
    });
  }

  insert(record, callback){
    return setImmediate(()=>{
      return callback(new Error('Not implemented'));
    });
  }

  update(id, updates, callback){
    return setImmediate(()=>{
      return callback(new Error('Not implemented'));
    });
  }

  delete(id, callback){
    return setImmediate(()=>{
      return callback(new Error('Not implemented'));
    });
  }

  list(options, callback){
    return setImmediate(()=>{
      return callback(new Error('Not implemented'));
    });
  }
}

class DB extends LazyEvents{
  constructor(){
    super();
    this._collections = {};
    fileconfig.on('ready', ()=>this.setup());
  }

  setup(){
    this.emit('ready', this);
  }

  collection(collectionName, callback){
    const collection = this._collections[collectionName] || (this._collections[collectionName] = new Collection(collectionName));
    setImmediate(()=>callback(null, collection));
  }
}

let db = new DB();
db.DB = DB;

module.exports = db;
