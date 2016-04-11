const React = require('react');
const {
  Link,
} = require('react-router');
const {
  connect,
} = require('react-redux');

const RacerListItem = React.createClass({
  render(){
    const {
      id,
      givenName,
      familyName,
      ndr = {},
      aa = {},
    } = this.props.racer;
    const ndrNumber = ndr.number || '';
    const aaNumber = aa.number || '';
    const name = `${familyName}, ${givenName}`;
    return (
      <tr>
        <th>{id}</th>
        <td>{name}</td>
        <td>{ndrNumber}</td>
        <td>{aaNumber}</td>
        <td>
          <Link className="btn" to={`/racers/${id}`}>View</Link>
          <Link className="btn btn-warning" to={`/racers/${id}/edit`}>Edit</Link>
        </td>
      </tr>
    );
  }
});

const RacerListTools = React.createClass({
  render(){
    return (
      <div>
        <Link className="btn" to="/racers/register">Register Racer</Link>
      </div>
    );
  }
});

const RacersList = React.createClass({
  render(){
    const racers = this.props.racers.map((racer)=><RacerListItem key={racer.id} racer={racer} />);
    return (
      <div>
        <RacerListTools />
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>NDR Number</th>
              <th>AA Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {racers}
          </tbody>
        </table>
        <RacerListTools />
      </div>
    );
  }
});

const mapStateToProps = (state) => {
  return {
    racers: state.racers
  };
};

const RacersListBound = connect(mapStateToProps)(RacersList);

module.exports = React.createClass({
  render(){
    return (
      <div>
        <h1>Racers Listing</h1>
        <p>Not done yet.</p>
        <RacersListBound />
      </div>
    );
  }
});
