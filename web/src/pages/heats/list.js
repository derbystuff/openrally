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

class Listing extends React.Component{
  render(){
    const headers = [
      'ID',
      'Race',
      'Division',
      'Type',
      'Class',
    ];
    const rowmap = [
      (row)=>row.id,
      (row)=>row.date,
      (row)=>row.division,
      (row)=>row.concelation?`${row.type} Concelation`:row.type,
      (row)=>row.class,
    ];
    const actions = {
      View: '/heats/${id}',
      Edit:{
        href: '/heats/${id}/edit',
        className: 'warning'
      },
    };
    return (
      <Page newLink="/heats/new" title="Heats Listing" headers={headers} rowmap={rowmap} data={this.props.races} actions={actions}/>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    heats: state.heats
  };
};

module.exports = connect(mapStateToProps)(Listing);
