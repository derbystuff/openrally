const React = require('react');

const RacerListItem = React.createClass({
  render(){
    return (
      <tr><td>Hello</td><td>Test 2</td></tr>
    );
  }
});

const RacersList = React.createClass({
  render(){
    return (
      <table>
        <tbody>
          <RacerListItem />
        </tbody>
      </table>
    );
  }
});

module.exports = React.createClass({
  render(){
    return (
      <div>
        <h1>Racers Listing</h1>
        <p>Not done yet.</p>
        <RacersList />
      </div>
    );
  }
});
