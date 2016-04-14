const timer = require('../lib/timer');

const handleGetLastWinner = (req, reply)=>{
  return reply(timer.lastWinner());
};

const handleReset = (req, reply)=>{
  if(!timer.connected()){
    return reply(new Error('Timer not connected, must open timer before reset.'));
  }
  timer.reset();
  return reply('ok');
};

const handleOpenTimer = (req, reply)=>{
  timer.open();
  return reply('ok');
};

const handleCloseTimer = (req, reply)=>{
  timer.close();
  return reply('ok');
};

const handleConfigTimer = (req, reply)=>{
  if(timer.connected()){
    return reply(new Error('Timer currently connected, must disconnect before configuration.'));
  }
  timer.config(req.payload);
  return reply('ok');
};

const handleTimerStatus = (req, reply)=>{
  return reply({
    status: timer.status(),
    lastWinner: timer.lastWinner(),
  });
};

module.exports = [
  {
    method: 'GET',
    path: '/api/v1/timer/last',
    config: {
      tags: ['api'],
      handler: handleGetLastWinner
    }
  },
  {
    method: 'GET',
    path: '/api/v1/timer',
    config: {
      tags: ['api'],
      handler: handleTimerStatus
    }
  },
  {
    method: 'POST',
    path: '/api/v1/timer/reset',
    config: {
      tags: ['api'],
      handler: handleReset
    }
  },
  {
    method: 'POST',
    path: '/api/v1/timer/open',
    config: {
      tags: ['api'],
      handler: handleOpenTimer
    }
  },
  {
    method: 'POST',
    path: '/api/v1/timer/close',
    config: {
      tags: ['api'],
      handler: handleCloseTimer
    }
  },
  {
    method: 'POST',
    path: '/api/v1/timer',
    config: {
      tags: ['api'],
      handler: handleConfigTimer
    }
  },
];
