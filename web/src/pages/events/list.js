const React = require('react');
const {
  Link,
} = require('react-router');
const {
  Page,
  Table,
  Tools
} = require('../../components/listtable');
const {
  connect,
} = require('react-redux');
const {
  calcNumEntrants,
} = require('../../lib/utils');
const {
  formatDate
} = require('../../lib/utils');

class Listing extends React.Component{
  render(){
    const headers = [
      'ID',
      'Start Date',
      'End Date',
      'Division',
    ];
    const rowmap = [
      (row)=>row.id,
      (row)=>formatDate(row.startDate),
      (row)=>formatDate(row.endDate),
      (row)=>row.divisions.map((s)=>s.toUpperCase()).join(', ')
    ];
    const actions = {
      View: '/events/${id}',
      Edit:{
        href: '/events/${id}/edit',
        className: 'warning'
      },
    };
    return (
      <Page title="Events Listing" newLink="/events/new" headers={headers} rowmap={rowmap} data={this.props.events} actions={actions}/>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    events: state.events
  };
};

module.exports = connect(mapStateToProps)(Listing);
