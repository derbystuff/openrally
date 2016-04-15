const React = require('react');
const {
  Button
} = require('react-bootstrap');
const {
  Select,
} = require('../editors');

class EntrantsListTools extends React.Component{
  addEntrant(e){
    e&&e.preventDefault();
    if(this.props.onAddEntrant){
      const id = this.refs.entrant.getValue();
      const entrant = this.props.racers.filter((racer)=>racer.id===id).shift();
      if(entrant){
        this.props.onAddEntrant(entrant);
      }
    }
  }

  renderTools(){
    const racersList = (this.props.racers||[]).map((racer)=>{
      return {
        id: racer.id,
        caption: racer.nickName?`${racer.familyName}, ${racer.givenName} (${racer.nickName})`:`${racer.familyName}, ${racer.givenName}`,
      };
    });

    return (
      <div className="row">
        <div className="col-md-3">
          <Select items={racersList} ref="entrant" />
        </div>
        <div className="col-md-1">
          <Button onClick={this.addEntrant.bind(this)}>Add Entrant</Button>
        </div>
      </div>
    );
  }

  render(){
    return this.renderTools();
  }
};

module.exports = EntrantsListTools;
