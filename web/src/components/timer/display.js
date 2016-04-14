const React = require('react');
const {
  Component
} = React;
const Timer = require('./timer');
const Winner = require('./winner');
const Status = require('./status');

class Display extends Component{
  render(){
    const status = (this.props.status || 'Offline').toLowerCase();
    return (
      <div className={`timer-wrapper ${status}`}>
        <Timer {...this.props} />
        <Winner {...this.props} />
        <Status {...this.props} />
      </div>
    );
  }
};

module.exports = Display;
