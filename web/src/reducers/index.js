const {
  createStore,
  combineReducers,
} = require('redux');
const uuid = require('node-uuid').v4;
const Chance = require('chance');
const chance = new Chance();
const racers = require('./racers');
const events = require('./events');
const races = require('./races');
const brackets = require('./brackets');
const fetch = require('isomorphic-fetch');
const noop = ()=>{};

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
  events,
  racers,
  brackets,
});

let store = createStore(appData);

/*
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

console.log(store.getState());
*/
const getListing = (api, dispatchType)=>{
  fetch(api)
    .then((response)=>{
      if(response.status >= 400){
        throw new Error('Bad response from server');
      }
      return response.json();
    })
    .then((response)=>{
      const records = response[response.root];
      records.forEach((record)=>store.dispatch({type: dispatchType, record}));
    });
};
getListing('/api/v1/brackets', 'INSERT_BRACKET');
getListing('/api/v1/events', 'INSERT_EVENT');
getListing('/api/v1/races', 'INSERT_RACE');
getListing('/api/v1/racers', 'INSERT_RACER');

store.addRecord = (options, callback)=>{
  const endpoint = options.endpoint;
  const type = options.type.toUpperCase();
  const raw = options.data;
  const id = raw.id;
  const record = Object.keys(raw).reduce((obj, key)=>{
    if(key !== 'id'){
      obj[key] = raw[key];
    }
    return obj;
  }, {});
  fetch(`/api/v1/${endpoint}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(record)
  })
  .then((response)=>{
    if(response.status >= 400){
      return (callback||noop)(new Error('Bad response from server'));
    }
    return response.json();
  })
  .then((record)=>{
    store.dispatch({type: `INSERT_${type}`, record});
    setImmediate(()=>(callback||noop)(null, record));
  });
};

store.updateRecord = (options, callback)=>{
  const endpoint = options.endpoint;
  const type = options.type.toUpperCase();
  const raw = options.data;
  const id = raw.id;
  const record = Object.keys(raw).reduce((obj, key)=>{
    if(key !== 'id'){
      obj[key] = raw[key];
    }
    return obj;
  }, {});
  fetch(`/api/v1/${endpoint}/${id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(record)
  })
  .then((response)=>{
    if(response.status >= 400){
      return (callback||noop)(new Error('Bad response from server'));
    }
    return response.json();
  })
  .then((record)=>{
    store.dispatch({type: `UPDATE_${type}`, record});
    console.log(record);
    setImmediate(()=>(callback||noop)(null, record));
  });
};

module.exports = store;
