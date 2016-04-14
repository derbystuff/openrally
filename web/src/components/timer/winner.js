const React = require('react');
const {
  Component
} = React;

class Winner extends Component{
  getDisplayText(lastWinner){
    const {
      lane = false,
    } = lastWinner || {};
    return lane?<span>Winner Lane {lane}</span>:'';
  }

  render(){
    return (
      <div className="winner">
        {this.getDisplayText(this.props.lastWinner)}
      </div>
    );
  }
};

module.exports = Winner;
