const {
  createStore,
  combineReducers,
} = require('redux');
const uuid = require('node-uuid').v4;
const Chance = require('chance');
const chance = new Chance();
const racers = require('./racers');
const races = require('./races');
const brackets = require('./brackets');
const fetch = require('isomorphic-fetch');

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
  brackets,
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

console.log(store.getState());

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
getListing('/api/v1/races', 'INSERT_RACE');
getListing('/api/v1/racers', 'INSERT_RACER');

module.exports = store;
