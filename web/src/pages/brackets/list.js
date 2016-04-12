const React = require('react');
const {
  Link,
} = require('react-router');
const {
  connect,
} = require('react-redux');

class BracketListItem extends React.Component{
  render(){
    const {
      id,
      division,
      version,
      entrants,
      bracket,
    } = this.props;
    const brackets = ((bracket||[])[0]||[]).filter((bracket)=>(bracket!==null));
    const entrantCount = entrants?entrants:brackets.length;
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
          <Link className="btn btn-danger" to={`/brackets/${id}/edit`}>Delete</Link>
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
  render(){
    const brackets = this.props.brackets.map((bracket)=><BracketListItem key={bracket.id} {...bracket} />);
    return (
      <div>
        <h1>List Brackets</h1>
        <BracketsListTools />
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Division</th>
              <th>Version</th>
              <th># Entrants</th>
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
  return {
    brackets: state.brackets
  };
};

module.exports = connect(mapStateToProps)(BracketsList);
