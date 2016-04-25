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
  SmartTable,
} = require('../../components/smarttable');

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

class ViewEvent extends Component{
  render(){
    const {
      id = false,
    } = this.props;
    const events = this.props.events.filter((event)=>event.id===id);
    const races = this.props.races.filter((race)=>race.eventId===id);
    const event = events.shift()||{};
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

    const entrants = races.reduce((racers, race)=>{
        const entrants = (race.entrants||[]).forEach((entrant)=>{
          const entry = racers[entrant.id] = racers[entrant.id] || Object.assign({races: []}, entrant);
          entry.races.push({
            id: race.id,
            title: race.title,
            paid: !!entrant.paid,
          });
        });
        return racers;
      },
      {});
    const participants = Object.keys(entrants).map((key)=>entrants[key]);

    const racesHeaders = [
      'ID',
      'Date',
      'Title',
      'Class',
      'Type',
    ];

    const racesRowmap = [
      (row)=>row.id,
      (row)=>formatDate(row.date),
      (row)=>row.title,
      (row)=>CLASS_LOOKUP[row.class],
      (row)=>row.consolation?`${TYPE_LOOKUP[row.type]} Consolation`:TYPE_LOOKUP[row.type],
    ];

    const participantsHeaders = [
      'ID',
      'Name',
      'Races',
    ];

    const participantsRowmap = [
      (row)=>row.id,
      (row)=>row.nickName?`${row.familyName}, ${row.givenName} (${row.nickName})`:`${row.familyName}, ${row.givenName}`,
      (row)=>row.races.map((r)=>{
        return <div key={r.id}>{r.title} {r.paid?'Paid':'NOT PAID'}</div>
      }),
    ];

    return (
      <div>
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
        <SmartTable
          headers={participantsHeaders}
          rowmap={participantsRowmap}
          data={participants}
          />

        <h2>Races</h2>
        <SmartTable
          headers={racesHeaders}
          rowmap={racesRowmap}
          data={races}
          />

        <Link className="btn btn-warning" to={`/events/${id}/edit`}>Edit</Link>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.params.id,
    events: state.events,
    races: state.races,
  };
};

module.exports = connect(mapStateToProps)(ViewEvent);
