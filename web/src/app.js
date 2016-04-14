require('./styles/main.less');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/app');
require('./io');

ReactDOM.render(
  <App />,
  document.querySelector('.app')
);
