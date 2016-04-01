const {
  createStore,
  combineReducers,
} = require('redux');

class Racer{
  constructor(base){
    Object.keys(base).forEach((key)=>{
      if(key!=='type'){
        this[key] = base[key];
      }
    });
  }
};

const racers = (state = [], action) => {
  switch(action.type){
    case('INSERT'):
      return state.concat([new Racer(action.racer)]);
    case('DELETE'):
      return state.filter((racer)=>racer.id!==action.racer.id);
    case('UPDATE'):
      return state.map((racer)=>racer.id===action.racer.id?new Racer(action.racer):racer);
    default:
      return state;
  }
};

let store = createStore(racers);

store.dispatch({type:'INSERT', racer: {
  id: 0,
  firstName: 'Julian',
  lastName: 'Darling',
  ndrNumber: 252
}});

console.log(store.getState())

module.exports = store;
