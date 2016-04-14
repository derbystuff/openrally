const React = require('react');
const {
  Component
} = React;

class Timer extends Component{
  render(){
    const timerValue = (this.props.lastWinner||{}).time||0.0;
    return (
      <div className="timer">
        {timerValue.toFixed(3)}
      </div>
    );
  }
};

module.exports = Timer;
