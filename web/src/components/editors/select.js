const React = require('react');

class Select extends React.Component{
  getValue(){
    return this.refs.editor.value;
  }

  render(){
    const inputProps = Object.keys(this.props).reduce((obj, key)=>{
      if(key === 'label'){
        return obj;
      }
      if(key === 'value'){
        obj.defaultValue = this.props.value;
        return obj;
      }
      if(key === 'items'){
        return obj;
      }
      obj[key] = this.props[key];
      return obj;
    }, {});
    const options = this.props.items.map((option)=>{
      const isString = typeof(option)==='string';
      const id = isString?option:option.id||option.caption;
      const caption = isString?option:option.caption;
      return <option key={id} value={id}>{caption}</option>;
    });
    return (
      <select type="date" className="form-control" {...inputProps} ref="editor">
        {options}
      </select>
    );
  }
};

module.exports = Select;
