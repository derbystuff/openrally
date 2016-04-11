const {
  createStore,
  combineReducers,
} = require('redux');
const uuid = require('node-uuid').v4;
const Chance = require('chance');
const chance = new Chance();

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

class Race{
  constructor(base, id){
    Object.keys(base).forEach((key)=>{
      if(key!=='type'){
        this[key] = base[key];
      }
    });
    if(id === void 0){
      id = (new Date()).getTime();
    }
    this.id = id.toString();
  }
};

const racer = (state, action) => {
  switch(action.type){
    case('INSERT_RACER'):
      return new Racer(action.racer, action.racer.id);
    case('UPDATE_RACER'):
      return new Racer(action.racer, action.racer.id);
    default:
      return state;
  }
};

const racers = (state = [], action) => {
  switch(action.type){
    case('INSERT_RACER'):
      return [...state, racer(action.racer, action)];
    case('DELETE_RACER'):
      return state.filter((racer)=>racer.id!==action.racer.id);
    case('UPDATE_RACER'):
      return state.map((racerInfo)=>racerInfo.id===action.racer.id?racer(action.racer, action):racerInfo);
    default:
      return state;
  }
};

const race = (state, action) => {
  switch(action.type){
    case('INSERT_RACE'):
      return new Race(action.racer);
    case('UPDATE_RACE'):
      return new Race(action.racer, action.race.id);
    default:
      return state;
  }
};

const races = (state = [], action) => {
  switch(action.type){
    case('INSERT_RACE'):
      return [...state, race(action.race, action)];
      case('DELETE_RACE'):
        return state.filter((race)=>racer.id!==action.race.id);
      case('UPDATE_RACE'):
        return state.map((raceInfo)=>raceInfo.id===action.race.id?racer(action.race, action):raceInfo);
      default:
        return state;
  }
}

const location = (state = {hash: '', pathname: '/', query: {}, search: ''}, action) => {
  switch(action.type){
    case('LOCATION_CHANGED'):
      return action.location;
    default:
      return state;
  };
};

const appData = combineReducers({
  location,
  races,
  racers,
});

let store = createStore(appData);

store.dispatch({type:'INSERT_RACER', racer: {
  id: 252,
  givenName: 'Julian',
  familyName: 'Darling',
  gender: 'Male',
  region: 4,
  dob: new Date(Date.parse('09/19/2002')),
  ndr: {
    number: 252,
  }
}});

for(let i = 0; i<50; i++){
  const [
    givenName,
    familyName
  ] = chance.name().split(' ');
  store.dispatch({type:'INSERT_RACER', racer: {
    givenName,
    familyName,
    region: 4,
    dob: chance.birthday({type: 'child'}),
    gender: chance.gender(),
    ndr: {
      number: 253+i,
    },
    aa: {
      number: 1000+i,
    }
  }});
}

console.log(store.getState())

module.exports = store;
