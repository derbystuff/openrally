const React = require('react');
const {
  Component
} = React;

const fetch = require('isomorphic-fetch');
const {
  connect,
} = require('react-redux');
const {
  TimerOptions,
  Display,
} = require('../../components/timer');

class Page extends Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  
  reset(){
    fetch('/api/v1/timer/reset', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
  }

  getDisplay(status){
    if(status === 'offline'){
      return (
        <div className="timer-wrapper">
          <span className="offline">OFFLINE</span>
        </div>
      );
    }
    const timer = this.props.timer || {};
    return <Display {...timer} />
  }

  render(){
    const timer = this.props.timer || {};
    const status = (timer.status || 'Offline').toLowerCase();
    return (
      <div>
        <h1>Timer</h1>
        <TimerOptions {...timer} onReset={this.reset.bind(this)}/>
        {this.getDisplay(status)}
        <TimerOptions {...timer} onReset={this.reset.bind(this)}/>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    timer: state.timer,
  };
};

module.exports = connect(mapStateToProps)(Page);
