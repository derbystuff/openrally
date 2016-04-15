const store = require('../reducers');
const io = require('../lib/io');

io.on('timer-status', (status)=>{
  store.dispatch({type: 'UPDATE_TIMER_STATUS', status});
});
io.on('timer-winner', (winner)=>{
  store.dispatch({type: 'UPDATE_TIMER_WINNER', winner});
});
io.on('timer-error', (error)=>{
  store.dispatch({type: 'TIMER_ERROR', error});
});
