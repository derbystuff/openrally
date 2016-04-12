const uuid = require('node-uuid').v4;
const fetch = require('isomorphic-fetch');

class Racer{
  constructor(base, id){
    Object.keys(base).forEach((key)=>{
      if(key!=='type'){
        this[key] = base[key];
      }
    });
    if(id === void 0){
      id = uuid();
    }
    this.id = id.toString();
  }
};

const racer = (state, action) => {
  const racer = action.racer||action.record;
  switch(action.type){
    case('INSERT_RACER'):
      return new Racer(racer, racer.id);
    case('UPDATE_RACER'):
      return new Racer(racer, racer.id);
    default:
      return state;
  }
};

const racers = (state = [], action) => {
  const _racer = action.racer||action.record;
  switch(action.type){
    case('INSERT_RACER'):
      return [...state, racer(_racer, action)];
    case('DELETE_RACER'):
      return state.filter((racer)=>_racer.id!==_racer.id);
    case('UPDATE_RACER'):
      return state.map((racerInfo)=>racerInfo.id===_racer.id?racer(_racer, action):racerInfo);
    default:
      return state;
  }
};

module.exports = racers;
