const React = require('react');
const {
  SmartTable,
} = require('../smarttable');
const {
  Checkbox,
} = require('../editors');

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

  updatePaid(racerId, paid){
    if(this.props.onUpdatePaid){
      this.props.onUpdatePaid(racerId, paid);
    }
  }

  renderTable(){
    const {
      entrants = [],
    } = this.state || {};
    const editable = !!this.props.editable;
    if(!entrants){
      return <span>Loading...</span>;
    }
    const headers = [
      'ID',
      'Paid',
      'Car Number',
      'Driver Name',
      'Division Number',
    ];

    const rowmap = [
      (row)=>row.id,
      (row)=>editable?(<Checkbox onClick={(e, ref)=>this.updatePaid(row.id, ref.checked)} checked={row.paid}>Paid</Checkbox>):(row.paid?'Yes':'No'),
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
