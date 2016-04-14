const uuid = require('node-uuid').v4;

const timer = (state = {status: 'Offline'}, action) => {
  const timer = action.timer||action.record;
  switch(action.type){
    case('TIMER_ERROR'):
      return {status: 'Offline'};
    case('TIMER_REFRESH'):
    case('UPDATE_TIMER'):
      return Object.assign({}, timer);
    case('UPDATE_TIMER_STATUS'):
      return Object.assign({}, state, {status: action.status||action.state});
    case('UPDATE_TIMER_WINNER'):
      return Object.assign({}, state, {lastWinner: action.winner});
    default:
      return state;
  }
};

module.exports = timer;
