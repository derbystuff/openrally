const React = require('react');
const {
  Component
} = React;
const {
  Button,
} = require('react-bootstrap');
const fetch = require('isomorphic-fetch');
const {
  connect,
} = require('react-redux');
const store = require('../../reducers');

class TimerOptions extends Component{
  reset(e){
    e&&e.preventDefault();
    if(this.props.onReset){
      this.props.onReset();
    }
  }
  refresh(e){
    e&&e.preventDefault();
    fetch('/api/v1/timer', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then((response)=>{
        if(response.status >= 400){
          throw new Error('Bad response from server');
        }
        return response.json();
      })
      .then((record)=>{
        store.dispatch({type: 'TIMER_REFRESH', record});
        if(this.props.onRefresh){
          this.props.onRefresh(record);
        }
      })
      .catch(()=>{
        store.dispatch({type: 'TIMER_ERROR'});
      });
  }
  open(){
    fetch('/api/v1/timer/open', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
  }
  close(){
    fetch('/api/v1/timer/close', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
  }
  render(){
    const status = (this.props.status||'Offline').toLowerCase();
    const action = (status === 'offline')?
            <Button onClick={this.open.bind(this)}>Connect</Button>:
            <Button onClick={this.close.bind(this)}>Disconnect</Button>;
    return (
      <div>
        {action}
        <Button onClick={this.reset.bind(this)}>Reset</Button>
        <Button onClick={this.refresh.bind(this)}>Refresh</Button>
      </div>
    );
  }
};

module.exports = TimerOptions;
