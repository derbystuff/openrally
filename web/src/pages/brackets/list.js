const React = require('react');
const {
  Link,
} = require('react-router');
const {
  connect,
} = require('react-redux');
const fetch = require('isomorphic-fetch');
const {
  Button,
  Modal,
} = require('react-bootstrap');
const store = require('../../reducers');
const {
  calcNumEntrants,
} = require('../../lib/utils');
const {
  Page,
} = require('../../components/listtable');

class ConfirmDelete extends React.Component{
  cancel(e){
    e&&e.preventDefault();
    if(this.props.onCancel){
      this.props.onCancel();
    }
  }
  deleteBracket(e){
    e&&e.preventDefault();
    if(this.props.onDelete){
      this.props.onDelete(this.props.id);
    }
  }
  renderDialog(){
    const {
      id,
      division,
      version,
      entrants,
      bracket,
    } = this.props;
    const brackets = ((bracket||[])[0]||[]).filter((bracket)=>(bracket!==null));
    const entrantCount = entrants?entrants:calcNumEntrants(bracket);
    return (
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete the Bracket "{division} {version}" with {entrantCount} participants?
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.cancel.bind(this)}>Cancel</Button>
            <Button onClick={this.deleteBracket.bind(this)} bsStyle="danger">Delete</Button>
          </Modal.Footer>

        </Modal.Dialog>
      </div>
    );
  }
  render(){
    if(this.props.id){
      return this.renderDialog();
    }
    return <span />;
  }
};

class Listing extends React.Component{
  constructor(params){
    super(params);
    this.state = {bracket: {}};
  }

  cancelDelete(){
    this.setState({bracket: {}});
  }

  deleteBracket(id){
    fetch(`/api/v1/brackets/${id}`, {
      method: 'DELETE'
    })
    .then((response)=>{
      store.dispatch({type: 'DELETE_BRACKET', bracket: {id}});
      this.setState({bracket: {}});
    });
  }

  confirmDelete(bracket){
    this.setState({bracket});
  }

  render(){
    const headers = [
      'ID',
      'Division',
      'Version',
      '# Entrants',
    ];
    const rowmap = [
      (row)=>row.id,
      (row)=>row.division,
      (row)=>row.version,
      (row)=>calcNumEntrants(row.bracket)
    ];
    const deleteHandler = (data)=>{
      this.confirmDelete(data);
    };
    const actions = {
      View: '/brackets/${id}',
      Edit:{
        href: '/brackets/${id}/edit',
        className: 'warning'
      },
      Delete: {
        handler: deleteHandler,
        className: 'danger'
      }
    };
    return (
      <div>
        <ConfirmDelete {...this.state.bracket} onCancel={this.cancelDelete.bind(this)} onDelete={this.deleteBracket.bind(this)} />
        <Page newLink="/brackets/new" title="Brackets Listing" headers={headers} rowmap={rowmap} data={this.props.brackets} actions={actions}/>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    brackets: state.brackets
  };
};

module.exports = connect(mapStateToProps)(Listing);
