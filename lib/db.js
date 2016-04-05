'use strict';

const LevelDown = require('leveldown');
const LevelUp = require('levelup');
const fileconfig = require('./fileconfig');
const LazyEvents = require('./lazyevents').LazyEvents;
const sift = require('sift');
const uuid = require('node-uuid').v4;
const path = require('path');
const {
  isNumeric,
} = require('./utils');

const buildCompareFunc = function(o){
  let keys = Object.keys(o), val, ord;
  let src = 'var cmp = '+(function(a, b){
    let v;
    if(!isNaN(parseFloat(a)) && isFinite(b)){
      v = a-b;
      if(v>0) return 1;
      if(v<0) return -1;
      return 0;
    }else{
      return (""+a).localeCompare(""+b);
    }
  }).toString()+'\r\n';
  keys.forEach(function(key){
    val = o[key];
    if(val>0){
      ord = 'a.'+key+', b.'+key;
    }else if(val<0){
      ord = 'b.'+key+', a.'+key;
    }
    src += 'v = cmp('+ord+');\r\n'+
      'if(v!=0) return v\r\n';
  });
  src+='return 0;';
  return new Function('a', 'b', src);
};

class Collection{
  constructor(collectionName, options){
    const provider = options.provider.db;
    this.collectionName = collectionName;
    this.provider = provider;
  }

  get(id, callback){
    this.provider.get(`${this.collectionName}:${id}`, (err, record)=>{
      if(err){
        return callback(err);
      }
      return callback(null, record);
    });
  }

  insert(record, callback){
    const id = record.id || uuid();
    record._created = new Date();
    record.id = id;
    this.provider.put(`${this.collectionName}:${id}`, record, (err)=>{
      if(err){
        return callback(err);
      }
      return callback(null, record);
    });
  }

  update(id, record, callback){
    this.provider.get(`${this.collectionName}:${id}`, (err, curr)=>{
      if(err){
        return callback(err);
      }
      if(record){
        record._created = curr._created;
        record._updated = new Date();
        record.id = id;
        this.provider.put(`${this.collectionName}:${id}`, record, (err)=>{
          if(err){
            return callback(err);
          }
          return callback(null, record);
        });
      }else{
        return callback(`Record with ID of ${id} does not exist!`);
      }
    });
  }

  delete(id, callback){
    this.provider.del(`${this.collectionName}:${id}`, (err)=>{
      if(err){
        return callback(err);
      }
      callback(null, true);
    });
  }

  list(options = {}, callback){
    let records = [];
    const offset = isNumeric(options.offset)?parseInt(options.offset):0;
    const limit = isNumeric(options.limit)?parseInt(options.limit):100;
    const filter = (function(filter){
      if(filter){
        return function(rec){
          return sift(filter, [rec.value]).length > 0;
        };
      }else{
        return function(){
          return true;
        };
      }
    })(options.filter);
    const sortFunc = !options.sort?false:buildCompareFunc(options.sort);

    this.provider.createReadStream({
      start: this.collectionName+':',
      end: this.collectionName+':\xFF'
    })
    .on('data', function(data){
      const ismatch = filter(data);
      if(ismatch){
        records.push(data.value);
      }
    })
    .on('error', callback)
    .on('close', function(){
      const count = records.length;
      if(sortFunc){
        records.sort(sortFunc);
      }
      records = records.slice(offset, offset+limit);
      setImmediate(()=>{
        const result = {length: count, count: records.length, limit: limit, offset: offset, root: 'response', response: records};
        return callback(null, result);
      });
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
    const location = path.resolve(__dirname, fileconfig.get('db.location', '../data'));
    this.db = LevelUp(location, {db: LevelDown, valueEncoding: 'json'});
    this.emit('ready', this);
  }

  collection(collectionName){
    const collection = this._collections[collectionName] || (this._collections[collectionName] = new Collection(collectionName, {provider: this}));
    return collection;
  }
}

let db = new DB();
db.DB = DB;
db.Collection = Collection;
db.buildCompareFunc = buildCompareFunc;

module.exports = db;
