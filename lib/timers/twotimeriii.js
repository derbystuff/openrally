/*
Lane Time:
LANE 2    02.616 SEC.

Reset:
R
*/

const SerialPort = require('serialport').SerialPort;
const LazyEvents = require('../lazyevents').LazyEvents;
const logger = require('../logger');

class TwoTimerIII extends LazyEvents{
  constructor(options){
    super();
    const {
      port = '/dev/ttyUSB0',
      baud = 9600,
      dataBits = 8,
      parity = 'none',
      stopBits = 1,
    } = options || {};
    this.port = port;
    this.baud = baud;
    this.stopBits = stopBits;
    this.dataBits = dataBits;
    this.parity = parity;
    this._needsReset = false;
    this.emit('status', this.status());
  }

  config(settings){
    const connected = this.connected();
    if(connected){
      this.close();
    }
    const {
      port = this.port,
      baud = this.baud,
      stopBits = this.stopBits,
      dataBits = this.dataBits,
      parity = this.parity,
    } = settings || {};
    this.port = port;
    this.baud = baud;
    this.stopBits = stopBits;
    this.dataBits = dataBits;
    this.parity = parity;
    if(connected){
      return this.open();
    }
    return this.status();
  };

  connected(){
    if(!this._serialPort){
      return false;
    }
    const open = this._serialPort.isOpen();
    if(!open){
      this._serialPort = null;
    }
    return open;
  }

  status(){
    if(!this.connected()){
      return 'Offline';
    }
    return this._needsReset?'Holding':'Ready';
  }

  open(){
    if(this.connected()){
      return this;
    }
    this._serialPort = new SerialPort(this.port, {
      baudRate: this.baud,
      dataBits: this.dataBits,
      stopBits: this.stopBits,
      parity: this.parity,
    });
    this._needsReset = false;
    this._lastWinner = false;
    this._buffer = '';
    this._serialPort.on('error', (err)=>{
      logger.error(err);
      this.emit('error', err);
    });
    this._serialPort.on('data', (data)=>{
      try{
        this._buffer += data.toString();
      }catch(e){
        return this.emit('error', e);
      }
      if(this._buffer.match(/\r\n/)){
        if(this.checkUpdateLastWinner(this._buffer.trim())){
          this._needsReset = true;
        }
        this._buffer = this._buffer.split('\r\n').pop();
      }
    });
    this._serialPort.on('open', ()=>{
      this.emit('opened', this);
      this.emit('status', this.status());
      this.reset();
    });
    return this;
  }

  checkUpdateLastWinner(buffer){
    const lines = buffer.split('\r\n');
    const reWinner = /LANE[ \t]+(\d+)[ \t]+([\d\.]+)/;
    const winner = lines.reduce((winner, line)=>{
      const match = line.match(reWinner);
      if(match){
        return match;
      }
      return winner;
    }, false);
    if(winner){
      this._lastWinner = {
        lane: parseInt(winner[1]),
        time: parseFloat(winner[2]),
        line: winner.input
      };
      this.emit('winner', this._lastWinner);
      return true;
    }
    return false;
  }

  lastWinner(){
    return this._lastWinner;
  }

  buffer(){
    return this._buffer;
  }

  close(){
    if(!this.connected()){
      return this;
    }
    this._serialPort.close((err)=>{
      if(err){
        this.emit('error', err);
        return this._serialPort = null;
      }
      this._serialPort = null;
      return this.emit('status', this.status());
    });
    return this;
  }

  reset(){
    if(!this.connected()){
      this.open();
    }
    this._needsReset = false;
    this._serialPort.write('R');
    this.emit('status', this.status());
  }
};

module.exports = TwoTimerIII;
