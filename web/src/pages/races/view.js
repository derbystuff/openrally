const React = require('react');

module.exports = React.createClass({
  render(){
    return (
      <div>
        <h1>View Race {this.props.params.id}</h1>
      </div>
    );
  }
});
