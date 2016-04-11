const React = require('react');
const {
  Link,
} = require('react-router');

module.exports = React.createClass({
  render(){
    return (
      <div>
        <h1>Races Listing</h1>
        <p>Not done yet.</p>
        <ul>
          <li>
            <Link to="/races/0">View Race</Link>
          </li>
          <li>
            <Link to="/races/0/edit">Edit Race</Link>
          </li>
          <li>
            <Link to="/races/new">New Race</Link>
          </li>
        </ul>
      </div>
    );
  }
});
