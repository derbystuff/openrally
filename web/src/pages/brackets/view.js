const React = require('react');
const {
  Component
} = React;
const {
  connect,
} = require('react-redux');
const {
  Link,
} = require('react-router');

const {
  BracketPreview,
} = require('../../components/bracket');

const isEntryPoint = (options)=>{
  if(options.level===0){
    return true;
  }
  const offset = (options.offset*2)+options.index;
  const isEntry = (!options.isFinal)&&!options.layout[options.level-1][offset];
  return isEntry;
};

class Participant extends Component{
  render(){
    return (
      <span>{this.props.heat}) Participant</span>
    );
  }
};

class Page extends Component{
  render(){
    const {
      id,
    } = this.props;
    return (
      <div>
        <h1>View Bracket {id}</h1>
        <BracketPreview {...this.props} />
        <Link className="btn btn-warning" to={`/brackets/${id}/edit`}>Edit</Link>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.params.id,
    brackets: state.brackets,
  };
};

module.exports = connect(mapStateToProps)(Page);
