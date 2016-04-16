const React = require('react');
const {
  Component
} = React;
const {
  LabeledInput,
  LabeledTextarea,
} = require('../../components/editors');
const {
  LabeledItem,
} = require('../../components/labeledlist');
const {
  Link,
} = require('react-router');
const {
  connect,
} = require('react-redux');
const store = require('../../reducers');
const {
  SmartForm
} = require('../../components/smartform');

class EditRacer extends Component{
  getEditForm(racer){
    const {
      id = false,
    } = racer;
    const action = id&&racer?'Edit':'Register';
    const fields = [
      {
        caption: 'Given Name:',
        field: 'givenName',
        type: 'text',
        required: true,
      },
      {
        caption: 'Family Name:',
        field: 'familyName',
        type: 'text',
        required: true,
      },
      {
        caption: 'Nick Name:',
        field: 'nickName',
        type: 'text',
      },
      {
        caption: 'Gender:',
        field: 'gender',
        type: 'text'
      },
      {
        caption: 'Date of Birth:',
        type: 'date',
        field: 'dob'
      },
      {
        caption: 'Home Track:',
        type: 'text',
        field: 'homeTrack'
      },
      {
        caption: 'Region:',
        type: 'number',
        field: 'region'
      },
      {
        caption: 'Car Design:',
        type: 'text',
        field: 'car.decoration'
      },
      {
        caption: 'Favorite thing about racing:',
        type: 'text',
        field: 'favorite'
      },
      {
        caption: 'Sponsor:',
        type: 'text',
        field: 'sponsor'
      },
      {
        caption: 'AA Number:',
        type: 'number',
        field: 'aa.number'
      },
      {
        caption: 'NDR Number:',
        type: 'number',
        field: 'ndr.number'
      },
      {
        caption: 'Interests:',
        type: 'text',
        field: 'interests',
        default: [],
        display: (value)=>value.join(', '),
        store: (value)=>value.split(',').map(s=>s.trim()).filter(s=>!!s),
      },
      {
        caption: 'Race Classes:',
        type: 'text',
        field: 'classes',
        default: [],
        display: (value)=>value.join(', '),
        store: (value)=>value.split(',').map(s=>s.trim()).filter(s=>!!s),
      },
    ];
    return (
      <SmartForm
        fields={fields}
        data={racer}
        title={`${action} Racer`}
        ref="form"
        onUpdate={(data, callback)=>this.props.onSave(data, callback)}
        onInsert={(data, callback)=>this.props.onSave(data, callback)}
        onSuccess={()=>this.context.router.push('/racers')}
        />
    );
  }

  render(){
    const id = this.props.id || false;
    const racers = this.props.racers.filter((racer)=>racer.id===id);
    const racer = racers.shift();
    return racer||(id===false)?this.getEditForm(racer||{}):<span>Loading...</span>;
  }
}

EditRacer.contextTypes = {
  router: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.params.id,
    racers: state.racers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSave: (racer, callback)=>{
      store.updateRecord({
        type: 'RACER',
        endpoint: 'racers',
        data: racer
      }, callback);
    },
    onRegister: (racer, callback)=>{
      store.addRecord({
        type: 'RACER',
        endpoint: 'racers',
        data: racer
      }, callback);
    },
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditRacer);
