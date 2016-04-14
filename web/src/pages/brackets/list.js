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

const isEntryPoint = (options)=>{
  const {
    level,
    offset,
    index,
    isFinal,
    layout
  } = options;
  if(level===0){
    return true;
  }
  const levelOffset = (offset*2)+index;
  const isEntry = (!isFinal)&&!layout[level-1][levelOffset];
  return isEntry;
};

const calcNumEntrantsForLevel = (options)=>{
  const {
    layout,
    level,
    index
  } = options;
  if(!level){
    return 0;
  }
  if(index === 0){
    return level.filter(heat=>!!heat).length*2;
  }
  return level.filter(heat=>!!heat).reduce((accum, heat, heatIndex)=>{
    let sum = 0;
    if(isEntryPoint({
      level: index,
      offset: heatIndex,
      index: 0,
      layout
    })){
      sum++;
    }
    if(isEntryPoint({
      level: index,
      offset: heatIndex,
      index: 1,
      layout
    })){
      sum++;
    }
    return accum + sum;
  }, 0);
};

const calcNumEntrants = (bracket)=>{
  const layout = bracket || [];
  return layout.reduce((accum, level, index)=>accum+calcNumEntrantsForLevel({layout, level, index}), 0);
};

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

class BracketListItem extends React.Component{
  confirmDelete(e){
    e&&e.preventDefault();
    if(this.props.onConfirmDelete){
      this.props.onConfirmDelete(this.props);
    }
  }

  render(){
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
      <tr>
        <td>
          {id}
        </td>
        <td>
          {division}
        </td>
        <td>
          {version}
        </td>
        <td>
          {entrantCount}
        </td>
        <td>
          <Link className="btn" to={`/brackets/${id}`}>View</Link>
          <Link className="btn btn-warning" to={`/brackets/${id}/edit`}>Edit</Link>
          <a href="#" className="btn btn-danger" onClick={this.confirmDelete.bind(this)}>Delete</a>
        </td>
      </tr>
    );
  }
};

class BracketsListTools extends React.Component{
  render(){
    return (
      <div>
        <Link className="btn" to="/brackets/new">New Bracket</Link>
      </div>
    );
  }
};

class BracketsList extends React.Component{
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
    const brackets = this.props.brackets.map((bracket)=><BracketListItem key={bracket.id} {...bracket} onConfirmDelete={this.confirmDelete.bind(this)} />);
    return (
      <div>
        <ConfirmDelete {...this.state.bracket} onCancel={this.cancelDelete.bind(this)} onDelete={this.deleteBracket.bind(this)} />
        <h1>List Brackets</h1>
        <BracketsListTools />
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Division</th>
              <th>Version</th>
              <th># Participants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brackets}
          </tbody>
          <tfoot>
            <tr>
              <th>ID</th>
              <th>Division</th>
              <th>Version</th>
              <th># Entrants</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
        <BracketsListTools />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return state;
};

module.exports = connect(mapStateToProps)(BracketsList);
