const React = require('react');
const {
  Input,
} = require('react-bootstrap');

module.exports = React.createClass({
  getValue: function() {
      return this.refs.editor.getValue();
  },
  render(){
    return (
      <Input type="text" label={this.props.label} defaultValue={this.props.value} ref="editor" />
    );
  }
});
