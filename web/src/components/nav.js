const React = require('react');
const {
  Link,
  IndexLink,
} = require('react-router');
const {
  Navbar,
  Nav,
  NavItem,
} = require('react-bootstrap');

const NavLink = React.createClass({
  render(){
    const className = this.context.router.isActive(this.props.to)?'active':'';
    return <li className={className}><Link {...this.props}/></li>;
  }
});

NavLink.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const IndexNavLink = React.createClass({
  render(){
    return <IndexLink {...this.props} activeClassName="active"/>;
  }
});

module.exports = React.createClass({
  render(){
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <IndexNavLink to="/">RaceMaster</IndexNavLink>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavLink to="/racers">Racers</NavLink>
          <NavLink to="/brackets">Brackets</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/races">Races</NavLink>
          <NavLink to="/heats">Heats</NavLink>
          <NavLink to="/timer">Timer</NavLink>
          <NavLink to="/overview">Overview</NavLink>
          {/*<NavLink to="/about">About</NavLink>*/}
          {/*<NavLink to="/contact">Contact</NavLink>*/}
        </Nav>
      </Navbar>
    );
  }
});
