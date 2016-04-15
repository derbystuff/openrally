const React = require('react');
const {
  connect,
} = require('react-redux');
const {
  LabeledDatePicker,
  LabeledInput,
  LabeledTextarea,
} = require('../../components/editors');
const {
  LabeledItem,
} = require('../../components/labeledlist');
const {
  Link,
} = require('react-router');
const store = require('../../reducers');

class EditEvent extends React.Component{
  getEventData(){
    const id = this.props.id || false;
    const divisions = (this.refs.divisions.getValue()||'').split(',').map(s=>s.trim().toLowerCase()).filter(s=>!!s);

    return {
      id,
      startDate: this.refs.startDate.getValue(),
      endDate: this.refs.endDate.getValue(),
      title: this.refs.title.getValue(),
      description: this.refs.description.getValue(),
      location: this.refs.location.getValue(),
      divisions,
    }
  }

  saveChanges(e){
    e&&e.preventDefault();
    const id = this.props.id || false;
    if(id && this.props.onSave){
      this.props.onSave(this.getEventData(), (err, record)=>{
        if(err){
          return;
        }
        this.context.router.push('/events');
      });
    }
    if(!id && this.props.onRegister){
      this.props.onRegister(this.getEventData(), (err, record)=>{
        if(err){
          return;
        }
        this.context.router.push('/events');
      });
    }

  }

  editForm(options){
    const {
      id,
      event = {}
    } = options;
    if(id&&(Object.keys(event).length===0)){
      return <span>Loading...</span>;
    }
    return (
      <form onSubmit={this.saveChanges}>
        <div className="form-group">
          <LabeledDatePicker label="Start Date:" value={event.startDate} ref="startDate" />
          <LabeledDatePicker label="End Date:" value={event.endDate} ref="endDate" />
          <LabeledInput label="Title:" value={event.title} ref="title" />
          <LabeledTextarea label="Description:" value={event.description} ref="description" />
          <LabeledInput label="Divisions:" value={(event.divisions||[]).join(',')} ref="divisions" />
          <LabeledTextarea label="Location:" value={event.location} ref="location" />
        </div>
        <Link className="btn btn-primary" to={`/racers/${id}/edit`} onClick={this.saveChanges.bind(this)}>Save</Link>
      </form>
    );
  }

  render(){
    const id = this.props.id || false;
    const events = this.props.events.filter((event)=>event.id===id);
    const event = events.shift();
    const action = id&&event?'Edit':'New';
    return (
      <div>
        <h1>{action} Event</h1>
        {this.editForm({id, event})}
      </div>
    );
  }
};

EditEvent.contextTypes = {
  router: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.params.id,
    events: state.events,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSave: (event, callback)=>{
      store.updateRecord({
        type: 'EVENT',
        endpoint: 'events',
        data: event
      }, callback);
    },
    onRegister: (event, callback)=>{
      store.addRecord({
        type: 'EVENT',
        endpoint: 'events',
        data: event
      }, callback);
    },
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditEvent);
