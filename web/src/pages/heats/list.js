const React = require('react');
const {
  Link,
} = require('react-router');

module.exports = React.createClass({
  render(){
    return (
      <div>
        <h1>List Heats</h1>
        <ul>
          <li>
            <Link to="/heats/0">View Heat</Link>
          </li>
          <li>
            <Link to="/heats/0/edit">Edit Heat</Link>
          </li>
          <li>
            <Link to="/heats/new">New Heat</Link>
          </li>
        </ul>
      </div>
    );
  }
});
