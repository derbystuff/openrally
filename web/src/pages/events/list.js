const React = require('react');
const {
  Link,
} = require('react-router');

module.exports = React.createClass({
  render(){
    return (
      <div>
        <h1>Events Listing</h1>
        <p>Not done yet.</p>
        <ul>
          <li>
            <Link to="/events/0">View Event</Link>
          </li>
          <li>
            <Link to="/events/0/edit">Edit Event</Link>
          </li>
          <li>
            <Link to="/events/new">New Event</Link>
          </li>
        </ul>
      </div>
    );
  }
});
