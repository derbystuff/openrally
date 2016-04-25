const React = require('react');
const EntrantsListTools = require('./entrantslisttools');
const EntrantsListTable = require('./entrantslisttable');

class EntrantsList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      entrants: props.entrants || [],
      racers: props.racers,
      divisions: props.divisions || [],
    };
  }

  updatePaid(racerId, paid){
    const entrants = this.state.entrants.map((entrant)=>{
      if(entrant.id === racerId){
        return Object.assign({}, entrant, {paid});
      }
      return entrant;
    });
    this.setState({entrants});
  }

  getEntrants(){
    return this.state.entrants;
  }

  componentWillReceiveProps(newProps){
    let newState = {}, stateUpdate = false;
    if(newProps.entrants){
      newState.entrants = newProps.entrants || [];
      stateUpdate = true;
    }
    if(newProps.racers){
      newState.racers = newProps.racers;
      stateUpdate = true;
    }
    if(newProps.divisions){
      newState.divisions = newProps.divisions;
      stateUpdate = true;
    }
    if(stateUpdate){
      this.setState(newState);
    }
  }

  addEntrant(racer){
    const uniq = (a)=>{
      var seen = {};
      return a.filter(function(item){
        return seen.hasOwnProperty(item.id) ? false : (seen[item.id] = true);
      });
    };
    const divisions = this.state.divisions;
    const divisionNumber = divisions.reduce((num, division)=>{
      if(racer[division] && (racer[division].number !== void 0) && (num===false)){
        return racer[division].number;
      }
      return num;
    }, false);

    const entrant = {
      id: racer.id,
      givenName: racer.givenName,
      familyName: racer.familyName,
      nickName: racer.nickName,
      paid: racer.yearlyMembership || false,
      divisionNumber: divisionNumber===false?undefined:divisionNumber,
    };
    const entrants = uniq(this.state.entrants.concat([entrant]));
    return this.setState({
      entrants,
    });
  }

  render(){
    const data = this.state;
    const tools = <EntrantsListTools {...data} onAddEntrant={this.addEntrant.bind(this)} />
      const deleteHandler = (data)=>{
        const id = data.id;
        const entrants = this.state.entrants.filter((racer)=>racer.id!==id);
        return this.setState({
          entrants,
        });
      };
      const actions = {
        Delete: {
          handler: deleteHandler,
          className: 'danger'
        }
      };
    return (
      <div>
        <h2>{this.props.heading||'Entrants'}</h2>
        {tools}
        <EntrantsListTable {...data} actions={actions} editable={!!this.props.editable} onUpdatePaid={this.updatePaid.bind(this)} />
        {tools}
      </div>
    );
  }
};

module.exports = EntrantsList;
