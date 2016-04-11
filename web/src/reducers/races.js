const uuid = require('node-uuid').v4;

class Race{
  constructor(base, id){
    Object.keys(base).forEach((key) => {
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

const race = (state, action) => {
  const race = action.race||action.record;
  switch(action.type){
    case('INSERT_RACE'):
      return new Race(race);
    case('UPDATE_RACE'):
      return new Race(race, race.id);
    default:
      return state;
  }
};

const races = (state = [], action) => {
  const _race = action.race||action.record;
  switch(action.type){
    case('INSERT_RACE'):
      return [...state, race(_race, action)];
      case('DELETE_RACE'):
        return state.filter((race)=>_race.id!==race.id);
      case('UPDATE_RACE'):
        return state.map((raceInfo)=>raceInfo.id===_race.id?racer(_race, action):raceInfo);
      default:
        return state;
  }
};

module.exports = races;
