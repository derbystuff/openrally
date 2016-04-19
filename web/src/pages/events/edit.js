const React = require('react');
const {
  connect,
} = require('react-redux');
const store = require('../../reducers');
const {
  SmartForm
} = require('../../components/smartform');

class EditEvent  extends React.Component{
  getEditForm(event){
    const {
      id = false,
    } = event;
    const action = id&&event?'Edit':'Create';
    const fields = [
      {
        caption: 'Start Date:',
        type: 'date',
        field: 'startDate',
        required: true,
      },
      {
        caption: 'End Date:',
        type: 'date',
        field: 'endDate',
        required: true,
      },
      {
        caption: 'Title:',
        field: 'title',
        type: 'text',
        required: true,
      },
      {
        caption: 'Description:',
        field: 'description',
        type: 'textarea',
      },
      {
        caption: 'Divisions:',
        field: 'divisions',
        type: 'text',
        required: true,
        default: [],
        display: (value)=>value.join(', '),
        store: (value)=>value.split(',').map(s=>s.trim()).filter(s=>!!s),
      },
      {
        caption: 'Location:',
        field: 'location',
        type: 'textarea',
      },
    ];
    return (
      <SmartForm
        fields={fields}
        data={event}
        title={`${action} Event`}
        ref="form"
        onUpdate={(data, callback)=>this.props.onSave(data, callback)}
        onInsert={(data, callback)=>this.props.onInsert(data, callback)}
        onSuccess={()=>this.context.router.push('/events')}
        />
    );
  }

  render(){
    const id = this.props.id || false;
    const events = this.props.events.filter((racer)=>racer.id===id);
    const event = events.shift();
    return event||(id===false)?this.getEditForm(event||{}):<span>Loading...</span>;
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
    onInsert: (event, callback)=>{
      store.addRecord({
        type: 'EVENT',
        endpoint: 'events',
        data: event
      }, callback);
    },
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditEvent);
