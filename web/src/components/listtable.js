const React = require('react');
const {
  Link,
} = require('react-router');
const {
  connect,
} = require('react-redux');

class Item extends React.Component{
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

class Tools extends React.Component{
  render(){
    return (
      <div>
        <Link className="btn" to="/brackets/new">New</Link>
      </div>
    );
  }
};

class Table extends React.Component{
  render(){
    const {
      items,
    } = this.props;
    const headings = [
      <th>ID</th>
      <th>Division</th>
      <th>Version</th>
      <th># Entrants</th>
      <th>Actions</th>
    ];
    const rows =
    return (
        <table className="table">
          <thead>
            <tr>
              {headings}
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
          <tfoot>
            <tr>
              {headings}
            </tr>
          </tfoot>
        </table>
    );
  }
};

/*
<Page
  cells={
    {
      ID: fn `${id}`,
    }
  }
/>
*/

class Page extends React.Component{
  render(){
    const {
      title,
    } = this.props;
    return (
      <div>
        <h1>{title}</h1>
        <Tools {...this.props} />
        <Table {...this.props} />
        <Tools {...this.props} />
      </div>
    );
  }
};

module.exports = Page;

/*
const mapStateToProps = (state) => {
  return state;
};

module.exports = connect(mapStateToProps)(Page);
*/
