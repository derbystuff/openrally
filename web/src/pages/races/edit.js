const React = require('react');
const {
  connect,
} = require('react-redux');
const {
  EntrantsList
} = require('../../components/entrants');
const store = require('../../reducers');
const {
  SmartForm
} = require('../../components/smartform');

const raceTypes = [
  {
    id: 'double',
    caption: 'Double'
  },
  {
    id: 'single',
    caption: 'Single'
  },
];
const raceClasses = [
  {
    id: 'st',
    caption: 'Stock'
  },
  {
    id: 'ss',
    caption: 'Super Stock'
  },
  {
    id: 'ma',
    caption: 'Masters'
  },
  {
    id: 'ul',
    caption: 'Ultimate Speed'
  },
  {
    id: 'sk',
    caption: 'Super Kids'
  },
  {
    id: 'ad',
    caption: 'Adult'
  },
  {
    id: 'test',
    caption: 'Test'
  },
];

class EditRace extends React.Component{
  getEditForm(options){
    const {
      race,
      events,
      racers,
    } = options;
    const {
      id = false
    } = race || {};
    const divisions = (event||{}).divisions||[];
    const action = id&&race?'Edit':'New';
    const fields = [
      {
        caption: 'Event:',
        type: 'select',
        field: 'eventId',
        items: events,
        required: true,
      },
      {
        caption: 'Date:',
        type: 'date',
        field: 'date',
        required: true,
      },
      {
        caption: 'Type:',
        type: 'select',
        field: 'type',
        items: raceTypes,
        required: true,
      },
      {
        caption: 'Class:',
        type: 'select',
        field: 'class',
        items: raceClasses,
        required: true,
      },
      {
        caption: 'Title:',
        field: 'title',
        type: 'text',
        required: true,
      },
      {
        caption: 'Consolation:',
        field: 'consolation',
        type: 'checkbox',
      },
      {
        caption: 'Entrants',
        field: 'entrants',
        type: 'custom',
        render: (key, ref, value)=>{
          return <EntrantsList key={key} entrants={value} racers={racers} divisions={divisions} ref={ref} editable={true} />;
        },
        getValue: (ref)=>{
          return ref.getEntrants();
        }
      }
    ];
    return (
      <SmartForm
        fields={fields}
        data={race}
        title={`${action} Race`}
        ref="form"
        onUpdate={(data, callback)=>this.props.onSave(data, callback)}
        onInsert={(data, callback)=>this.props.onInsert(data, callback)}
        onSuccess={()=>this.context.router.push('/races')}
        />
    );
  }
  render(){
    const id = this.props.id || false;
    const racers = this.props.racers;
    const events = this.props.events.map((event)=>{return {id: event.id, caption: event.title||(`${event.startDate}->${event.endDate}`), divisions: event.divisions}});
    const races = this.props.races.filter((race)=>race.id===id);
    const race = races.shift();
    return (race||(id===false))&&(events)?this.getEditForm({race, events, racers}):<span>Loading...</span>;
  }
};

EditRace.contextTypes = {
  router: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.params.id,
    races: state.races,
    racers: state.racers,
    events: state.events,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSave: (race, callback)=>{
      store.updateRecord({
        type: 'RACE',
        endpoint: 'races',
        data: race
      }, callback);
    },
    onInsert: (race, callback)=>{
      console.log('race', race)
      store.addRecord({
        type: 'RACE',
        endpoint: 'races',
        data: race
      }, callback);
    },
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditRace);
