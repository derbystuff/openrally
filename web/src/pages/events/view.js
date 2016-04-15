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

class ViewEvent extends Component{
  render(){
    const id = this.props.id || false;
    const events = this.props.events.filter((event)=>event.id===id);
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
        <Link className="btn btn-warning" to={`/events/${id}/edit`}>Edit</Link>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.params.id,
    events: state.events,
  };
};

module.exports = connect(mapStateToProps)(ViewEvent);
