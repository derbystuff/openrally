const React = require('react');
const {
  connect,
} = require('react-redux');
const {
  LabeledDatePicker,
  LabeledInput,
  LabeledTextarea,
  LabeledSelect,
  LabeledCheckbox,
} = require('../../components/editors');
const {
  EntrantsList
} = require('../../components/entrants');
const {
  LabeledItem,
} = require('../../components/labeledlist');
const {
  Link,
} = require('react-router');
const store = require('../../reducers');

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
  constructor(props){
    super(props);
    this.state = {event: this.getEvent(props)};
  }

  getEvent(fromProps, newEventId){
    const props = fromProps || this.props;
    const id = props.id || false;
    const race = props.races.filter((race)=>race.id===id).shift();
    const eventId = newEventId || (this.state||{}).eventId || (race||{}).eventId || false;
    const event = props.events.filter((event)=>event.id===eventId).shift();
    return event;
  }

  componentWillReceiveProps(newProps){
    this.checkSetEvent(newProps);
  }

  checkSetEvent(fromProps, newEventId){
    this.setState({event: this.getEvent(Object.assign({}, this.props, fromProps), newEventId)})
  }

  getRaceData(){
    const id = this.props.id || false;

    return {
      id,
      eventId: this.refs.eventId.getValue(),
      date: this.refs.date.getValue(),
      title: this.refs.title.getValue(),
      type: this.refs.type.getValue(),
      class: this.refs.class.getValue(),
      consolation: this.refs.consolation.getValue(),
      entrants: this.refs.entrants.getEntrants(),
    }
  }

  saveChanges(e){
    e&&e.preventDefault();
    const id = this.props.id || false;
    const race = this.getRaceData();
    if(id && this.props.onSave){
      this.props.onSave(race, (err, record)=>{
        if(err){
          return;
        }
        this.context.router.push('/races');
      });
    }
    if(!id && this.props.onRegister){
      this.props.onRegister(race, (err, record)=>{
        if(err){
          return;
        }
        this.context.router.push('/races');
      });
    }

  }

  changeEvent(e){
    e&&e.preventDefault();
    this.checkSetEvent({}, this.refs.eventId.getValue());
  }

  editForm(options){
    const {
      id,
      race = {},
      racers = [],
      events = false,
    } = options;
    if(!events){
      return <span>Loading...</span>;
    }
    if(id&&(Object.keys(race).length===0)){
      return <span>Loading...</span>;
    }
    const event = this.state.event;
    const divisions = (event||{}).divisions||[];

    return (
      <form onSubmit={this.saveChanges}>
        <div className="form-group">
          <LabeledSelect label="Event:" value={race.eventId} items={events} ref="eventId" onChange={this.changeEvent.bind(this)} />
          <LabeledDatePicker label="Date:" value={race.date} ref="date" />
          <LabeledSelect label="Type:" value={race.type} items={raceTypes} ref="type" />
          <LabeledSelect label="Class:" value={race.class} items={raceClasses} ref="class" />
          <LabeledInput label="Title:" value={race.title} ref="title" />
          <LabeledCheckbox label="Consolation:" value={race.consolation} ref="consolation" />
          <EntrantsList entrants={race.entrants} racers={racers} divisions={divisions} ref="entrants" />
          <ul>
            <li>bracket</li>
            <ul>
              <li>id</li>
              <li>version</li>
              <li>heats</li>
              <li>layout</li>
            </ul>
          </ul>
        </div>
        <Link className="btn btn-primary" to={`/racers/${id}/edit`} onClick={this.saveChanges.bind(this)}>Save</Link>
      </form>
    );
  }

  render(){
    const id = this.props.id || false;
    const racers = this.props.racers;
    const events = this.props.events.map((event)=>{return {id: event.id, caption: event.title||(`${event.startDate}->${event.endDate}`), divisions: event.divisions}});
    const races = this.props.races.filter((race)=>race.id===id);
    const race = races.shift();
    const action = id&&race?'Edit':'New';
    return (
      <div>
        <h1>{action} race</h1>
        {this.editForm({id, race, events, racers})}
      </div>
    );
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
    onRegister: (race, callback)=>{
      store.addRecord({
        type: 'RACE',
        endpoint: 'races',
        data: race
      }, callback);
    },
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditRace);
