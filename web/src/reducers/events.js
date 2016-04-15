const uuid = require('node-uuid').v4;

class Event{
  constructor(base, id){
    Object.keys(base).forEach((key) => {
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

const event = (state, action) => {
  const event = action.event||action.record;
  switch(action.type){
    case('INSERT_EVENT'):
      return new Event(event, event.id);
    case('UPDATE_EVENT'):
      return new Event(event, event.id);
    default:
      return state;
  }
};

const events = (state = [], action) => {
  const _event = action.event||action.record;
  switch(action.type){
    case('INSERT_EVENT'):
      return [...state, event(_event, action)];
      case('DELETE_EVENT'):
        return state.filter((event)=>_event.id!==event.id);
      case('UPDATE_EVENT'):
        return state.map((eventInfo)=>eventInfo.id===_event.id?event(_event, action):eventInfo);
      default:
        return state;
  }
};

module.exports = events;
