const timer = require('../lib/timer');
const logger = require('../lib/logger');

const EventHandler = (eventName, io)=>{
  timer.on(eventName, (data)=>{
    logger.info(`timer-${eventName}`, data);
    io.emit(`timer-${eventName}`, data);
  });
};

const Timer = {
  register: (server, options, next)=>{
    const io = server.plugins['hapi-io'].io;
    EventHandler('status', io);
    EventHandler('winner', io);
    EventHandler('error', io);
    next();
  }
};

Timer.register.attributes = {
  name: 'Timer',
  version: '1.0.0'
}

module.exports = Timer;
