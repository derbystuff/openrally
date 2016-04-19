const React = require('react');
const {
  Component,
} = React;
const BracketChart = require('./bracket');

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

class BracketPreview extends Component{
  constructor(props){
    super(props);
    this.state = Object.assign({}, props);
  }

  getRacerInfo(options){
    const heat = options.heat;
    const participants = options.participants;
    const isEntry = isEntryPoint(options);
    if(isEntry){
      return <Participant participants={participants} heat={heat} />;
    }
    if(options.isFinal){
      return <span className="empty-driver">Final</span>;
    }
    return <span className="empty-driver">{heat}) TBD</span>;
  }

  componentWillReceiveProps(newProps){
    this.setState(newProps);
  }

  render(){
    const {
      id = false,
      brackets,
      participants = [],
      data = [],
    } = this.state;
    const bracket = this.state.bracket||brackets.filter((bracket)=>bracket.id === id).shift();
    const layout = this.state.layout||(bracket?bracket.bracket||[]:[]);
    return <BracketChart
              className="bigger"
              layout={layout}
              data={data}
              bracket={bracket}
              participants={participants}
              getParticipant={this.getRacerInfo}
              />;
  }
};

module.exports = BracketPreview;
