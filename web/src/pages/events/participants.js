const React = require('react');
const {
  Component
} = React;
const {
  connect,
} = require('react-redux');

const {
  Link,
} = require('react-router');
const {
  Checkbox,
} = require('../../components/editors');
const {
  LabeledList,
  LabeledItem,
} = require('../../components/labeledlist');
const {
  formatDate,
  getJoiErrorText,
} = require('../../lib/utils');
const {
  SmartTable,
} = require('../../components/smarttable');
const {
  EntrantsListTools,
} = require('../../components/entrants');
const {
  Button,
  Modal,
} = require('react-bootstrap');
const store = require('../../reducers');
const async = require('async');

const CLASS_LOOKUP = {
  st: 'Stock',
  ss: 'Super Stock',
  ma: 'Masters',
  ul: 'Ultimate Speed',
  sk: 'Super Kids',
  ad: 'Adult',
  test: 'Test',
};

const TYPE_LOOKUP = {
  double: 'Double',
  single: 'Single',
};

class EditEntrantRacesDialog extends React.Component{
  constructor(props){
    super(props);
    this.state = {races: (props.entrant||{}).races};
  }

  componentWillReceiveProps(newProps){
    if(newProps.entrant){
      this.setState({races: (newProps.entrant||{}).races});
    }
  }

  cancel(e){
    e&&e.preventDefault();
    if(this.props.onCancel){
      this.props.onCancel();
    }
  }

  saveChanges(e){
    e&&e.preventDefault();
    if(this.props.onSave){
      this.props.onSave(this.props.entrant, this.getEntrantsRaces());
    }
  }

  enteredInRace(id){
    const {
      races,
    } = this.state;
    return (races||[]).filter((race)=>race.id===id).length > 0;
  }

  paidForRace(id){
    const {
      races,
    } = this.state;
    return (races||[]).filter((race)=>(race.id===id)&&(race.paid)).length > 0;
  }

  enterInRace(race){
    const races = (this.state.races||[]).concat({
      id: race.id,
      title: race.title,
      date: race.date,
      paid: false
    });
    this.setState({races});
  }

  checkEntered(race, entered){
    if(entered){
      return this.enterInRace(race);
    }
    const id = race.id;
    const races = this.state.races.filter((race)=>race.id!==id);
    return this.setState({races});
  }

  checkPaid(race, paid){
    const id = race.id;
    const races = this.state.races.map((race)=>{
      if(race.id === id){
        return Object.assign({}, race, {paid});
      }
      return race;
    });
    this.setState({races});
  }

  getEntrantsRaces(){
    return this.state.races || [];
  }

  renderDialog(){
    const {
      entrant,
      races,
    } = this.props;

    const racesHeaders = [
      'Date',
      'Title',
      'Class',
      'Entered',
      'Paid',
    ];

    const racesRowmap = [
      (row)=>formatDate(row.date),
      (row)=>row.title,
      (row)=>CLASS_LOOKUP[row.class],
      (row)=><Checkbox onClick={(e, ref)=>this.checkEntered(row, ref.checked)} checked={this.enteredInRace(row.id)} ref={'entered_'+row.id}>Entered</Checkbox>,
      (row)=>this.enteredInRace(row.id)?<Checkbox onClick={(e, ref)=>this.checkPaid(row, ref.checked)} checked={this.paidForRace(row.id)} ref={'paid_'+row.id}>Paid</Checkbox>:'',
    ];

    const entrantName = entrant.nickName?`${entrant.familyName}, ${entrant.givenName} (${entrant.nickName})`:`${entrant.familyName}, ${entrant.givenName}`;
    return (
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Edit: {entrantName}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <SmartTable
              headers={racesHeaders}
              rowmap={racesRowmap}
              data={races}
              ref="table"
              />
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.cancel.bind(this)}>Cancel</Button>
            <Button onClick={this.saveChanges.bind(this)} bsStyle="primary">Update</Button>
          </Modal.Footer>

        </Modal.Dialog>
      </div>
    );
  }
  render(){
    const {
      entrant = {},
      action,
    } = this.props;
    const {
      id,
    } = entrant;
    if(id && action==='edit'){
      return this.renderDialog();
    }
    return <span />;
  }
};

class ConfirmDelete extends React.Component{
  cancel(e){
    e&&e.preventDefault();
    if(this.props.onCancel){
      this.props.onCancel();
    }
  }
  deleteBracket(e){
    e&&e.preventDefault();
    if(this.props.onDelete){
      this.props.onDelete(this.props.entrant);
    }
  }
  renderDialog(){
    const {
      entrant,
    } = this.props;
    const entrantName = entrant.nickName?`${entrant.familyName}, ${entrant.givenName} (${entrant.nickName})`:`${entrant.familyName}, ${entrant.givenName}`;
    return (
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete "{entrantName}"?
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.cancel.bind(this)}>Cancel</Button>
            <Button onClick={this.deleteBracket.bind(this)} bsStyle="danger">Delete</Button>
          </Modal.Footer>

        </Modal.Dialog>
      </div>
    );
  }
  render(){
    const {
      entrant = {},
      action,
    } = this.props;
    const {
      id,
    } = entrant;
    if(id && action==='delete'){
      return this.renderDialog();
    }
    return <span />;
  }
};

class RaceEntry extends Component{
  render(){
    const {
      racer,
      race,
      races
    } = this.props;
    return (
      <div>{formatDate(race.date)} {race.title}{race.paid?' - Paid':''}</div>
    );
  }
};

class RaceEntries extends Component{
  render(){
    const {
      racer,
      races,
    } = this.props;
    const entries = racer.races.map((r)=><RaceEntry key={r.id} races={races} race={r} racer={racer} />);
    return (
      <div>
        {entries}
      </div>
    );
  }
};

class FormErrors extends React.Component{
  componentDidMount(){
    document.body.scrollTop = this.refs.errors.scrollTop;
  }

  componentWillReceiveProps(){
    document.body.scrollTop = this.refs.errors.scrollTop;
  }

  render(){
    const {
      errors = [],
    } = this.props;
    const errorMessages = errors.reduce((errors, item)=>{
      (item.errors||[]).forEach((error)=>{
        if(errors.indexOf(error)===-1){
          errors.push(error);
        }
      });
      return errors;
    }, []).map((error, index)=><p key={index}>{error}</p>);
    return (
      <div className="form-errors bg-danger" ref="errors">
        {errorMessages}
      </div>
    );
  }
};

class EditParticipants extends Component{
  constructor(props){
    super(props);
    this.state = Object.assign({entrants: this.getEntrantsFromEvent(props.event, props)}, props);
  }

  getEntrantsFromEvent(event, state){
    const {
      id,
      racers,
    } = state || this.state;
    const races = ((state || this.state).races||[]).filter((race)=>race.eventId===id);
    const baseEntrants = Object.keys((state || this.state).entrants||{}).reduce((obj, key)=>{
      obj[key] = Object.assign({}, (state || this.state).entrants[key], {races: []});
      return obj;
    }, {});
    const entrants = races.reduce((racers, race)=>{
        const entrants = (race.entrants||[]).forEach((entrant)=>{
          const entry = racers[entrant.id] = racers[entrant.id] || Object.assign({}, entrant, {races: []});
          entry.races.push({
            id: race.id,
            title: race.title,
            date: race.date,
            paid: !!entrant.paid,
          });
        });
        return racers;
      },
      baseEntrants);
    return entrants;
  }

  getEvent(){
    const {
      id = false,
      racers,
    } = this.state;
    const events = this.state.events.filter((event)=>event.id===id);
    const event = events.shift()||{};
    return event;
  }

  componentWillReceiveProps(newProps){
    this.setState(Object.assign({entrants: this.getEntrantsFromEvent(this.getEvent())}, newProps));
  }

  addEntrant(entrant){
    const entrants = this.state.entrants;
    if(!entrants[entrant.id]){
      this.editEntrantRaces(entrant);
    }
  }

  handleSubmit(e){
    e&&e.preventDefault();
    const {
      id = false,
      racers,
      entrants = {},
    } = this.state;
    const event = this.getEvent();
    const divisions = event.divisions;
    const getDivisionNumber = (racer)=>{
      const divisionNumber = divisions.reduce((num, division)=>{
        if(racer[division] && (racer[division].number !== void 0) && (num===false)){
          return racer[division].number;
        }
        return num;
      }, '');
      return divisionNumber;
    };
    const makeRaceEntrant = (race, entrant)=>{
      return {
        divisionNumber: entrant.divisionNumber || getDivisionNumber(entrant),
        givenName: entrant.givenName,
        familyName: entrant.familyName,
        nickName: entrant.nickName,
        id: entrant.id,
        paid: entrant.races.reduce((paid, eRace)=>{
            if(eRace.id === race.id){
              return !!eRace.paid;
            }
            return paid;
          }, false)
      };
    };
    const racerInRace = (racer, race)=>{
      const {
        id
      } = race;
      const entered = racer.races.reduce((entered, race)=>{
        if(race.id === id){
          return true;
        }
        return entered;
      }, false);
      return entered;
    };
    const entrantsForRace = (race)=>{
      const list = Object.keys(entrants).map((key)=>entrants[key]);
      const filtered = list.filter((racer)=>racerInRace(racer, race));
      return filtered.map((racer)=>makeRaceEntrant(race, racer));
    };
    const races = this.state.races.filter((race)=>race.eventId===id);
    //TODO: For each race:
    // * Get the entrants for that race
    // * Create a race update Object
    // * Call the store and update the race
    // * Check the results for errors
    // * If no errors then navigate away
    // * If errors then show "Something went wrong" and stay
    let errors = [];
    const racesToSave = races.map((race)=>{
      const {
        _created,
        _updated,
        ...raceInfo,
      } = race;
      return Object.assign({}, raceInfo, {entrants: entrantsForRace(race)});
    });
    async.each(racesToSave, (race, next)=>{
      this.props.onSave(race, (err, response)=>{
        if(err){
          errors.push(err);
          return next();
        }
        if(response&&response.data&&response.data.isJoi){
          errors.push({race, errors: getJoiErrorText(response.data)});
          return next();
        }
        next();
      });
    }, (err)=>{
      if(errors.length){
        this.setState({errors});
        return;
      }
      this.context.router.push('/events');
    });
  }

  cancelDialog(){
    this.setState({entrant: {}});
  }

  saveEdit(entrant, races){
    if(races.length === 0){
      return alert('Entrant must be entered in at least one race.');
    }
    const entrants = this.state.entrants;
    const newEntrantEntry = {
      [entrant.id]: Object.assign(entrant, {races: races})
    };
    this.setState({entrants: Object.assign(entrants, newEntrantEntry), entrant: {}});
  }

  editEntrantRaces(entrant){
    this.setState({entrant, action: 'edit'});
  }

  confirmDelete(entrant){
    this.setState({entrant, action: 'delete'});
  }

  deleteEntrant(entrant){
    const entrants = this.state.entrants;
    const newEntrants = Object.keys(entrants).reduce((res, key)=>{
      if(key!==entrant.id){
        res[key] = entrants[key];
      }
      return res;
    }, {});
    this.setState({entrants: newEntrants, entrant: {}});
  }

  render(){
    const {
      id = false,
      racers,
      entrants = {},
    } = this.state;
    const races = this.state.races.filter((race)=>race.eventId===id);
    const event = this.getEvent();
    const {
      startDate,
      endDate,
      title,
      description,
      divisions,
      location
    } = event;
    const strStartDate = formatDate(startDate);
    const strEndDate = formatDate(endDate);
    const participants = Object.keys(entrants).map((key)=>entrants[key]);

    const participantsHeaders = [
      'ID',
      'Name',
      'Races',
    ];

    const participantsRowmap = [
      (row)=>row.id,
      (row)=>row.nickName?`${row.familyName}, ${row.givenName} (${row.nickName})`:`${row.familyName}, ${row.givenName}`,
      (row)=><RaceEntries racer={row} races={races} />,
    ];

    const editHandler = (data)=>{
      this.editEntrantRaces(data);
    };

    const deleteHandler = (data)=>{
      this.confirmDelete(data);
    };

    const participantsActions = {
      Edit: {
        handler: editHandler,
        className: 'warning'
      },
      Delete: {
        handler: deleteHandler,
        className: 'danger'
      },
    };

    const entrantsTools = <EntrantsListTools racers={racers} onAddEntrant={this.addEntrant.bind(this)} />

    return (
      <div>
        <FormErrors errors={this.state.errors} />
        <EditEntrantRacesDialog entrant={this.state.entrant} action={this.state.action} races={races} onCancel={this.cancelDialog.bind(this)} onSave={this.saveEdit.bind(this)} />
        <ConfirmDelete entrant={this.state.entrant} action={this.state.action} onCancel={this.cancelDialog.bind(this)} onDelete={this.deleteEntrant.bind(this)} />
        <h1>View Event</h1>

        <LabeledList>
          <LabeledItem label="ID:" value={id} />
          <LabeledItem label="Start Date:" value={strStartDate} hideIfNone={true} />
          <LabeledItem label="End Date:" value={strEndDate} hideIfNone={true} />
          <LabeledItem label="Title:" value={title} hideIfNone={true} />
          <LabeledItem label="Description:" value={description} hideIfNone={true} />
          <LabeledItem label="Divisions:" value={(divisions||[]).join(', ').toUpperCase()} hideIfNone={true} />
          <LabeledItem label="Location:" value={location} hideIfNone={true} />
        </LabeledList>

        <h2>Participants</h2>
        <form onSubmit={this.handleSubmit.bind(this)}>
          {entrantsTools}
          <SmartTable
            headers={participantsHeaders}
            rowmap={participantsRowmap}
            data={participants}
            actions={participantsActions}
            />
          {entrantsTools}

          <input type="submit" className="btn btn-primary" value="Save" />
          <Link className="btn btn-warning" to={`/events/${id}/edit`}>Edit</Link>
        </form>
      </div>
    );
  }
};

EditParticipants.contextTypes = {
  router: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.params.id,
    events: state.events,
    races: state.races,
    racers: state.racers,
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
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditParticipants);
