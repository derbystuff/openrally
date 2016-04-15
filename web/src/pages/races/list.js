const React = require('react');
const {
  Link,
} = require('react-router');
const {
  Page,
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

class Listing extends React.Component{
  render(){
    const headers = [
      'ID',
      'Date',
      'Title',
      'Class',
      'Type',
    ];
    const rowmap = [
      (row)=>row.id,
      (row)=>formatDate(row.date),
      (row)=>row.title,
      (row)=>CLASS_LOOKUP[row.class],
      (row)=>row.consolation?`${TYPE_LOOKUP[row.type]} Consolation`:TYPE_LOOKUP[row.type],
    ];
    const actions = {
      View: '/races/${id}',
      Edit:{
        href: '/races/${id}/edit',
        className: 'warning'
      },
    };
    return (
      <Page newLink="/races/new" title="Races Listing" headers={headers} rowmap={rowmap} data={this.props.races} actions={actions}/>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    races: state.races
  };
};

module.exports = connect(mapStateToProps)(Listing);
