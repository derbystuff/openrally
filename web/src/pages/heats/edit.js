const React = require('react');

module.exports = React.createClass({
  render(){
    return (
      <div>
        <h1>Edit Heat {this.props.params.id}</h1>
      </div>
    );
  }
});