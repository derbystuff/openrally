const React = require('react');
const {
  Link,
} = require('react-router');

module.exports = React.createClass({
  render(){
    return (
      <div>
        <h1>List Brackets</h1>
        <ul>
          <li>
            <Link to="/brackets/0">View Bracket</Link>
          </li>
          <li>
            <Link to="/brackets/0/edit">Edit Bracket</Link>
          </li>
          <li>
            <Link to="/brackets/new">New Bracket</Link>
          </li>
        </ul>
      </div>
    );
  }
});
