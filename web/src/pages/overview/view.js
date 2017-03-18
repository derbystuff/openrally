const React = require('react');
const {
  Component
} = React;

const {
  Row,
  Col,
} = require('react-bootstrap');

const TimerView = require('../timer/view');

class Page extends Component{
  render(){
    const videoOrigin = window.location.protocol+'//'+window.location.hostname+':8081';
    return (
      <Row className="show-grid">
        <Col xs={12} md={4}>
          <TimerView />
        </Col>
        <Col xs={12} md={8}>
          <iframe width="640px" height="480px" frameBorder="0" src={videoOrigin}>
          </iframe>
        </Col>
      </Row>
    );
  }
};

module.exports = Page;
