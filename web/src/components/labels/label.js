const React = require('react');
const {
  FormControls,
} = require('react-boostrap');

module.exports = React.createClass({
  render(){
    return (
      <FormControls.Static value={this.props.children} {...this.props} />
    );
  }
});
