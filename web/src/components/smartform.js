const React = require('react');
const {
  LabeledInput,
  LabeledTextarea,
  LabeledDatePicker,
  LabeledSelect,
  LabeledCheckbox,
} = require('./editors');
const {
  LabeledItem,
} = require('./labeledlist');
const {
  getObjectValue,
  setObjectValue,
  isTrue,
  getJoiErrorText,
} = require('../lib/utils');

class FormErrors extends React.Component{
  componentDidMount(){
    document.body.scrollTop = this.refs.errors.scrollTop;
  }

  componentWillReceiveProps(){
    document.body.scrollTop = this.refs.errors.scrollTop;
  }

  render(){
    const {
      errors
    } = this.props;
    const errorMessages = errors.map((error, index)=><p key={index}>{error}</p>);
    return (
      <div className="form-errors bg-danger" ref="errors">
        {errorMessages}
      </div>
    );
  }
};

class SmartForm extends React.Component{
  constructor(params){
    super(params);
    this.state = {errors: false};
  }
  getFieldReference(fieldName){
    const ref = fieldName.replace(/[^\w]+/g, '_');
    return ref;
  }

  getEditors(fields, data){
    return fields.map((info)=>{
      const {
        field,
        type,
        caption,
        display,
        render,
        store,
        default: defaultValue,
        ...otherFields,
      } = info;
      const required = !!info.required;
      const value = (()=>{
        try{
          return display?display(getObjectValue(data, field, defaultValue)):getObjectValue(data, field, defaultValue);
        }catch(e){
          console.error(field, defaultValue, info);
          console.error(e);
          return defaultValue;
        }
      })();
      const ref = this.getFieldReference(field);
      const other = Object.keys(otherFields).reduce((other, key)=>{
        if(key === 'onChange'){
          const handler = otherFields[key];
          other[key] = (e)=>{
            const fieldRef = this.refs[ref];
            return handler(e, fieldRef);
          };
          return other;
        }
        other[key] = otherFields[key];
        return other;
      }, {});
      switch(type.toLowerCase()){
        case('custom'):
          return render(ref, ref, value);
        case('checkbox'):
          return <LabeledCheckbox key={ref} label={caption || `${field}:`} value={value} ref={ref} required={required} {...other} />
        case('select'):
          return <LabeledSelect key={ref} label={caption || `${field}:`} value={value} ref={ref} required={required} {...other} />
        case('textarea'):
          return <LabeledTextarea key={ref} label={caption || `${field}:`} value={value} ref={ref} required={required} {...other} />
        case('date'):
          return <LabeledDatePicker key={ref} label={caption || `${field}:`} value={value} ref={ref} required={required} {...other} />
        case('number'):
          return <LabeledInput type={type} key={ref} label={caption || `${field}:`} value={value} ref={ref} required={required} {...other} />
        case('text'):
        default:
          return <LabeledInput key={ref} label={caption || `${field}:`} value={value} ref={ref} required={required} {...other} />
      }
    });
  }

  getFormData(fields){
    const {
      id = false
    } = this.props.data || {};
    return (fields||this.props.fields).reduce((obj, info)=>{
      const {
        field,
        type,
        caption,
        display,
        store,
        getValue=false,
        default: defaultValue,
        ...other
      } = info;
      const required = !!info.required;
      const ref = this.refs[this.getFieldReference(field)];
      const rawValue = getValue?getValue(ref):ref.getValue();
      if(((rawValue==='')||
          (rawValue===null)||
          (rawValue===NaN)||
          ((Object.prototype.toString.call(rawValue) === '[object Date]') && (isNaN(rawValue.getTime())))||
          (rawValue===void 0))&&
        (!isTrue(this.props.includeEmpty))){
        return obj;
      }
      const value = store?store(rawValue):rawValue;
      return setObjectValue(obj, field, value);
    }, {id});
  }

  handleDone(err, response){
    if(err){
      return this.setState({errors: err});
    }
    if(response&&response.data&&response.data.isJoi){
      return this.setState({errors: getJoiErrorText(response.data)})
    }
    if(this.props.onSuccess){
      this.props.onSuccess(response);
    }
  }

  handleSubmit(e){
    e&&e.preventDefault();
    const data = this.getFormData();
    const id = data.id;
    if(this.props.onSubmit){
      this.props.onSubmit(data);
    }
    if((id !== false) && this.props.onUpdate){
      return this.props.onUpdate(data, this.handleDone.bind(this));
    }
    if((id === false) && this.props.onCreate){
      return this.props.onUpdate(data, this.handleDone.bind(this));
    }
  }

  componentWillReceiveProps(newProps){
    if(newProps.errors){
      return this.setState({errors: newProps.errors});
    }
  }

  render(){
    const {
      children,
      data,
      fields,
    } = this.props;
    const title = this.props.title || (data.id?'Edit':'New');
    const {
      errors = propErrors,
    } = this.state;
    const editors = this.getEditors(fields, data);
    const submitErrors = errors?<FormErrors errors={errors} />:'';
    return (
      <div>
        {submitErrors}
        <form onSubmit={this.handleSubmit.bind(this)}>
          <h1>{title}</h1>
          <div className="form-group">
            {editors}
          </div>
          {children}
          <input type="submit" className="btn btn-primary" value="Save" />
        </form>
      </div>
    );
  }
};

module.exports = {
  SmartForm
};
