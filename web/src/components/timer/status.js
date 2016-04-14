const React = require('react');
const {
  Component
} = React;

class Status extends Component{
  getDisplayText(){
    const status = this.props.status;
    return status?<span>{status}</span>:'';
  }

  render(){
    return (
      <div className="status">
        {this.getDisplayText()}
      </div>
    );
  }
};


module.exports = Status;
