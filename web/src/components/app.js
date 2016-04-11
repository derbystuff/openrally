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

const reducers = require('../reducers');

const history = browserHistory;

const Home = require('../pages/home');
const About = require('../pages/about');
const Contact = require('../pages/contact');
const Racers = require('../pages/racers/list');
const ViewRacer = require('../pages/racers/view');
const EditRacer = require('../pages/racers/edit');
const Races = require('../pages/races/list');
const ViewRace = require('../pages/races/view');
const EditRace = require('../pages/races/edit');
const ViewTimer = require('../pages/timer/view');

const ViewBracket = require('../pages/brackets/view');

const { Provider } = require('react-redux');
const store = require('../reducers');

const PageNotFound = require('../pages/notfound');

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

history.listen((location)=>store.dispatch({type: 'LOCATION_CHANGED', location}));

module.exports = React.createClass({
  render(){
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="racers" component={Racers} />
            <Route path="racers/register" component={EditRacer} />
            <Route path="racers/:id" component={ViewRacer} />
            <Route path="racers/:id/edit" component={EditRacer} />
            <Route path="races" component={Races} />
            <Route path="races/:id" component={ViewRace} />
            <Route path="races/:id/edit" component={EditRace} />
            <Route path="brackets" component={ViewBracket} />
            <Route path="timer" component={ViewTimer} />
            <Route path="about" component={About} />
            <Route path="contact" component={Contact} />
            <Route path="*" component={PageNotFound} />
          </Route>
        </Router>
      </Provider>
    );
  }
});
