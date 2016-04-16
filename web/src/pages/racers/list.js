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

const CLASS_LOOKUP = {
  st: 'Stock',
  ss: 'Super Stock',
  ma: 'Masters',
  ul: 'Ultimate Speed',
  sk: 'Super Kids',
  ad: 'Adult',
  test: 'Test',
};

class Listing extends React.Component{
  render(){
    const headers = [
      'ID',
      'Name',
      'Classes',
      'NDR Number',
      'AA Number',
    ];
    const rowmap = [
      (row)=>row.id,
      (row)=>row.nickName?`${row.familyName}, ${row.givenName} (${row.nickName})`:`${row.familyName}, ${row.givenName}`,
      (row)=>row.classes.map((classShort)=>CLASS_LOOKUP[classShort]).join(', '),
      (row)=>(row.ndr||{}).number || '',
      (row)=>(row.aa||{}).number || '',
    ];
    const actions = {
      View: '/racers/${id}',
      Edit:{
        href: '/racers/${id}/edit',
        className: 'warning'
      },
    };
    return (
      <Page newLink="/racers/register" newButtonCaption="Register" title="Racers Listing" headers={headers} rowmap={rowmap} data={this.props.racers} actions={actions}/>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    racers: state.racers
  };
};

module.exports = connect(mapStateToProps)(Listing);
