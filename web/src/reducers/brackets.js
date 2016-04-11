const uuid = require('node-uuid').v4;

class Bracket{
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

const bracket = (state, action) => {
  const bracket = action.bracket||action.record;
  switch(action.type){
    case('INSERT_BRACKET'):
      return new Bracket(bracket, bracket.id);
    case('UPDATE_BRACKET'):
      return new Bracket(bracket, bracket.id);
    default:
      return state;
  }
};

const brackets = (state = [], action) => {
  const _bracket = action.bracket||action.record;
  switch(action.type){
    case('INSERT_BRACKET'):
      return [...state, bracket(_bracket, action)];
      case('DELETE_BRACKET'):
        return state.filter((bracket)=>_bracket.id!==bracket.id);
      case('UPDATE_BRACKET'):
        return state.map((bracketInfo)=>bracketInfo.id===_bracket.id?bracket(_bracket, action):bracketInfo);
      default:
        return state;
  }
};

module.exports = brackets;
