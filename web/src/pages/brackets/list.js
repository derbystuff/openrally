const React = require('react');
const {
  Link,
} = require('react-router');
const {
  connect,
} = require('react-redux');

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

class BracketListItem extends React.Component{
  calcNumEntrants(bracket){
    const layout = bracket || [];
    return layout.reduce((accum, level, index)=>accum+calcNumEntrantsForLevel({layout, level, index}), 0);
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
    const entrantCount = entrants?entrants:this.calcNumEntrants(bracket);
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
