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
const timer = require('./timer');
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
  timer,
});

let store = createStore(appData);

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
const get = (api, dispatchType)=>{
  fetch(api)
    .then((response)=>{
      if(response.status >= 400){
        throw new Error('Bad response from server');
      }
      return response.json();
    })
    .then((record)=>{
      store.dispatch({type: dispatchType, record});
    })
    .catch(()=>{
      store.dispatch({type: 'TIMER_ERROR'});
    });
};
getListing('/api/v1/brackets', 'INSERT_BRACKET');
getListing('/api/v1/events', 'INSERT_EVENT');
getListing('/api/v1/races', 'INSERT_RACE');
getListing('/api/v1/racers', 'INSERT_RACER');
get('/api/v1/timer', 'UPDATE_TIMER');

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
