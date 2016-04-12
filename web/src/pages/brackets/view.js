const React = require('react');
const {
  Component
} = React;
const {
  connect,
} = require('react-redux');

const BracketChart = require('../../components/bracket');

const layout = [ //layout
  [ //level
    [null, null], //heat
    null,
    [null, null],
    [null, null],
    null,
    null,
    null,
    null,
  ],
  [
    [null, null],
    [null, null],
    null,
    null,
  ],
  [
    [null, null],
    null,
  ],
  [
    [],
  ],
  [
  ]
];

// END SETUP

const racers = (()=>{
    let participants = [];
    let i;
    for(i = 0; i<10; i++){
      participants.push({
          driver: 'Participant '+i,
          number: 101+i
        });
    }
    return participants;
  })();

class ParticipantPicker extends Component{
  render(){
    const {
      heat
    } = this.props;
    return (
      <span>
        {heat}) Participant
      </span>
    );
  }
};

const isNumeric = (n)=>{
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const defaults = (...args)=>{
  let res = {};
  args.forEach((item)=>{
    res = Object.keys(item).reduce((p, key)=>{
      p[key] = item[key];
      return p;
    }, res);
  });
  return res;
};

const isEntryPoint = (options)=>{
  if(options.level===0){
    return true;
  }
  const offset = (options.offset*2)+options.index;
  const isEntry = (!options.isFinal)&&!options.layout[options.level-1][offset];
  return isEntry;
};

const getParticipant = (carNumber, participants)=>{
  const cars = participants.filter((entry)=>{
    return entry.number === carNumber;
  });
  return cars.shift();
};

class Bracket extends Component{
  getRacerInfo(options){
    const heat = options.heat;
    const participants = options.participants;
    const isEntry = isEntryPoint(options);
    if(isEntry){
      return <ParticipantPicker participants={participants} heat={heat} />;
    }
    if(options.isFinal){
      return <span className="empty-driver">Final</span>;
    }
    return <span className="empty-driver">{heat}) TBD</span>;
  }

  render(){
    const id = this.props.params.id;
    const bracket = this.props.brackets.filter((bracket)=>bracket.id === id).shift();
    const layout = bracket?bracket.bracket||[]:[];
    const chart = bracket?<BracketChart
              className="bigger"
              layout={layout}
              data={[]}
              bracket={bracket}
              participants={racers}
              getParticipant={this.getRacerInfo}
              />:<span>Loading ...</span>;
    return (
      <div>
        <h1>View Bracket {this.props.params.id}</h1>
        {chart}
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

module.exports = connect(mapStateToProps)(Bracket);
