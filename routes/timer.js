const timer = require('../lib/timer');
const config = require('../lib/config');
const logger = require('../lib/logger');

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
  config.set('TIMER', req.payload, (err, config)=>{
    if(err){
      logger.error(err);
      return reply(err);
    }
    logger.info(config);
    timer.config(config);
    return reply(config);
  });
};

const handleGetConfigTimer = (req, reply)=>{
  return reply(config.get('TIMER'));
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
    method: 'GET',
    path: '/api/v1/timer/config',
    config: {
      tags: ['api'],
      handler: handleGetConfigTimer
    }
  },
  {
    method: 'PUT',
    path: '/api/v1/timer/config',
    config: {
      tags: ['api'],
      handler: handleConfigTimer
    }
  },
];
