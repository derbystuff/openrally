const React = require('react');
const {
  Component
} = React;
const {
  Button,
} = require('react-bootstrap');

class TimerReset extends Component{
  reset(e){
    e.preventDefault();
  }
  render(){
    return (
      <Button onClick={this.reset}>Reset</Button>
    );
  }
};

class Timer extends Component{
  render(){
    const timerValue = 0.000;
    return (
      <div className="timer">
        {timerValue.toFixed(3)}
      </div>
    );
  }
};

class Winner extends Component{
  getDisplayText(){
    const lane = 1;
    const winner = {
      givenName: 'Julian',
      familyName: 'Darling',
      carNumber: 101
    };
    return lane?<span>Lane {lane} - {winner.givenName} {winner.familyName} ({winner.carNumber})</span>:'';
  }

  render(){
    return (
      <div className="winner">
        {this.getDisplayText()}
      </div>
    );
  }
};

class Display extends Component{
  render(){
    const timerValue = 0.000;
    return (
      <div className="timer-wrapper">
        <Timer />
        <Winner />
      </div>
    );
  }
};

module.exports = class extends Component{
  render(){
    return (
      <div>
        <h1>Timer</h1>
        <div>
          <Display />
        </div>
        <TimerReset />
      </div>
    );
  }
};
