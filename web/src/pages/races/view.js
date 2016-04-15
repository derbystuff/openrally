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
  LabeledList,
  LabeledItem,
} = require('../../components/labeledlist');
const {
  formatDate
} = require('../../lib/utils');
const {
  EntrantsListTable,
} = require('../../components/entrants');

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

class ViewRace extends Component{
  render(){
    const id = this.props.id || false;
    const races = this.props.races.filter((race)=>race.id===id);
    const race = races[0]||{};
    const events = this.props.events || [];
    const event = race&&race.id?events.filter((event)=>event.id===race.eventId).shift():false;
    const {
      date,
      type,
      class: raceClass,
      title,
    } = race;

    const entrants = race.entrants&&race.entrants.length?(
      <div>
        <h2>Entrants</h2>
        <EntrantsListTable entrants={race.entrants} />
      </div>
    ):'';

    return (
      <div>
        <h1>View Race</h1>

        <LabeledList>
          <LabeledItem label="ID:" value={id} />
          <LabeledItem label="Event:" value={event.title} hideIfNone={true} />
          <LabeledItem label="Date:" value={formatDate(date)} hideIfNone={true} />
          <LabeledItem label="Title:" value={title} hideIfNone={true} />
          <LabeledItem label="Class:" value={CLASS_LOOKUP[raceClass]} hideIfNone={true} />
          <LabeledItem label="Type:" value={TYPE_LOOKUP[type]} hideIfNone={true} />
        </LabeledList>
        {entrants}
        <Link className="btn btn-warning" to={`/races/${id}/edit`}>Edit</Link>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.params.id,
    races: state.races,
    events: state.events,
  };
};

module.exports = connect(mapStateToProps)(ViewRace);
