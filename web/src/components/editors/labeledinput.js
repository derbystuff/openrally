const React = require('react');
const {
  Input,
} = require('react-bootstrap');

class LabeledInput extends React.Component{
  getValue(){
    return this.refs.editor.getValue();
  }

  render(){
    //<Input type="text" {...this.props} ref="editor" />
    const inputProps = Object.keys(this.props).reduce((obj, key)=>{
      if(key === 'label'){
        return obj;
      }
      if(key === 'value'){
        obj.defaultValue = this.props.value;
        return obj;
      }
      obj[key] = this.props[key];
      return obj;
    }, {});
    return (
      <div className="form-group">
        <label className="control-label">{this.props.label}</label>
        <input type="text" className="form-control" {...inputProps} ref="editor" />
      </div>
    );
  }
};

module.exports = LabeledInput;
