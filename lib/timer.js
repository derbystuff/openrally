const config = require('./config');
const LazyEvents = require('./lazyevents').LazyEvents;
const logger = require('./logger');

class TimerWrapper{
  constructor(options){
    this._ready = false;
    config.on('ready', ()=>this.init());
  }

  init(){
    this._ready = true;
    const TIMER_CONFIG = config.get('TIMER', {});
    const {
      DRIVER,
      CONFIG
    } = TIMER_CONFIG;
    const Timer = require('./timers/'+DRIVER);
    logger.info(DRIVER, CONFIG);
    this.settings = TIMER_CONFIG;
    this._timer = new Timer(CONFIG);
  }

  timer(callback){
    if(this._ready){
      return callback(null, this._timer);
    }
    return setTimeout(()=>this.timer(callback), 100);
  }

  on(eventName, listener){
    this.timer((err, timer)=>timer.on(eventName, listener));
  }

  once(eventName, listener){
    this.timer((err, timer)=>timer.once(eventName, listener));
  }

  removeAllListeners(eventName){
    this.timer((err, timer)=>timer.removeAllListeners(eventName));
  }

  removeListener(eventName, listener){
    this.timer((err, timer)=>timer.removeListener(eventName, listener));
  }

  connected(){
    if(!this._timer){
      return false;
    }
    return this._timer.connected();
  }

  status(){
    if(!this._timer){
      return 'Init';
    }
    return this._timer.status();
  }

  open(){
    if(!this._timer){
      return false;
    }
    logger.info('Opening:', this.settings);
    return this._timer.open();
  }

  lastWinner(){
    if(!this._timer){
      return false;
    }
    return this._timer.lastWinner();
  }

  close(){
    if(!this._timer){
      return false;
    }
    return this._timer.close();
  }

  reset(){
    if(!this._timer){
      return false;
    }
    return this._timer.reset();
  }

  config(settings){
    if(!this._timer){
      return false;
    }
    this.settings = settings;
    return this._timer.config(settings);
  }
};

const timer = new TimerWrapper();

module.exports = timer;
