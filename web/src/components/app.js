const React = require('react');
const Nav = require('./nav');
const {
  Router,
  Route,
  Link,
  IndexRoute,
  hashHistory,
  browserHistory,
} = require('react-router');

const history = hashHistory;

/*
*/

const Home = React.createClass({
  render(){
    return (
      <div className="container">
        <div className="starter-template">
          <h1>Bootstrap starter template</h1>
          <p className="lead">Use this document as a way to quickly start any new project.<br/> All you get is this text and a mostly barebones HTML document.</p>
        </div>
      </div>
    );
  }
});

const About = React.createClass({
  render(){
    return (
      <div>
        <h1>About</h1>
      </div>
    );
  }
});

const NoMatch = React.createClass({
  render(){
    return (
      <h1>Page not found!</h1>
    );
  }
});

const App = React.createClass({
  render(){
    return (
      <div>
        <Nav />
        <div className="page-container">
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = React.createClass({
  render(){
    return (
      <div>
        <Router history={browserHistory}>
          <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="/about" component={About} />
            <Route path="*" component={NoMatch} />
          </Route>
        </Router>
      </div>
    );
  }
});
