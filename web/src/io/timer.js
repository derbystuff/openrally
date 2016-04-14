const store = require('../reducers');
const io = require('../lib/io');

io.on('timer-status', (status)=>{
  console.log('Status: ', status);
  store.dispatch({type: 'UPDATE_TIMER_STATUS', status});
  console.log(store.getState())
});
io.on('timer-winner', (winner)=>{
  console.log('Winner: ', winner);
  store.dispatch({type: 'UPDATE_TIMER_WINNER', winner});
});
io.on('timer-error', (error)=>{
  console.log('Error: ', error);
  store.dispatch({type: 'TIMER_ERROR', error});
});
