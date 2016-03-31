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
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </Nav>
      </Navbar>
    );
  }
});
      /*
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <IndexNavLink className="navbar-brand" to="/">Project name</IndexNavLink>
          </div>
          <div id="navbar" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li><NavLink to="/about">About</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});
//*/
