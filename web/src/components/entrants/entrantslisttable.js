const React = require('react');
const {
  SmartTable,
} = require('../smarttable');

class EntrantsListTable extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      entrants: props.entrants
    };
  }

  componentWillReceiveProps(newProps){
    let newState = {}, stateUpdate = false;
    if(newProps.entrants){
      newState.entrants = newProps.entrants;
      stateUpdate = true;
    }
    if(stateUpdate){
      this.setState(newState);
    }
  }

  renderTable(){
    const {
      entrants = [],
    } = this.state || {};
    if(!entrants){
      return <span>Loading...</span>;
    }
    const headers = [
      'ID',
      'Car Number',
      'Driver Name',
      'Division Number',
    ];
    const rowmap = [
      (row)=>row.id,
      (row)=>row.carNumber,
      (row)=>row.nickName?`${row.familyName}, ${row.givenName} (${row.nickName})`:`${row.familyName}, ${row.givenName}`,
      (row)=>row.divisionNumber,
    ];
    const actions = this.props.actions;
    return <SmartTable headers={headers} rowmap={rowmap} data={entrants} actions={actions} />;
  }

  render(){
    return this.renderTable();
  }
};

module.exports = EntrantsListTable;
