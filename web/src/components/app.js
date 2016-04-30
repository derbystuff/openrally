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
const ListBrackets = require('../pages/brackets/list');
const EditBracket = require('../pages/brackets/edit');

const ViewHeat = require('../pages/heats/view');
const ListHeats = require('../pages/heats/list');
const EditHeat = require('../pages/heats/edit');

const ViewEvent = require('../pages/events/view');
const ListEvents = require('../pages/events/list');
const EditEvent = require('../pages/events/edit');
const EventParticipants = require('../pages/events/participants');

const Overview = require('../pages/overview/view');

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
            <Route path="races/new" component={EditRace} />
            <Route path="races/:id" component={ViewRace} />
            <Route path="races/:id/edit" component={EditRace} />
            <Route path="brackets" component={ListBrackets} />
            <Route path="brackets/new" component={EditBracket} />
            <Route path="brackets/:id/edit" component={EditBracket} />
            <Route path="brackets/:id" component={ViewBracket} />
            <Route path="heats" component={ListHeats} />
            <Route path="heats/new" component={EditHeat} />
            <Route path="heats/:id/edit" component={EditHeat} />
            <Route path="heats/:id" component={ViewHeat} />
            <Route path="events" component={ListEvents} />
            <Route path="events/new" component={EditEvent} />
            <Route path="events/:id/edit" component={EditEvent} />
            <Route path="events/:id/participants" component={EventParticipants} />
            <Route path="events/:id" component={ViewEvent} />
            <Route path="timer" component={ViewTimer} />
            <Route path="about" component={About} />
            <Route path="contact" component={Contact} />
            <Route path="overview" component={Overview} />
            <Route path="*" component={PageNotFound} />
          </Route>
        </Router>
      </Provider>
    );
  }
});
