/*
Lane Time:
LANE 2    02.616 SEC.

Reset:
R
*/

const SerialPort = require('serialport').SerialPort;
const LazyEvents = require('../lazyevents').LazyEvents;

class TwoTimerIII extends LazyEvents{
  constructor(options){
    super();
    const {
      port = '/dev/ttyUSB0',
      baud = 9600,
      stopBits = 1,
      dataBits = 8
    } = options || {};
    this.port = port;
    this.baud = baud;
    this.stopBits = stopBits;
    this.dataBits = dataBits;
    this._needsReset = false;
    this.emit('status', this.status());
  }

  connected(){
    return !!this._serialPort;
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
      parity: this.parity || 'none',
      rtscts: this.rtscts || false,
      xon: this.xon || false,
      xoff: this.xoff || false,
      xany: this.xany || false,
      flowControl: this.flowControl,
      bufferSize: this.bufferSize || 65536,
      parser: this.parser,
      platformOptions: this.platformOptions
    });
    this._needsReset = false;
    this._lastWinner = false;
    this._buffer = '';
    this._serialPort.on('data', (data)=>{
      this._buffer += data.toString();
      if(this._buffer.match(/\r\n/)){
        if(this.checkUpdateLastWinner(this._buffer.trim())){
          this._needsReset = true;
        }
        this._buffer = this._buffer.split('\r\n').pop();
      }
    });
    this._serialPort.on('open', ()=>this.reset());
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

module.exports = {
  TwoTimerIII,
};
