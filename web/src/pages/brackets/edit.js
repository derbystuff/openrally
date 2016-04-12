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

const data = [
  {
    top: {
      car: 101,
      phase1: 0.125
    },
    bottom: {
      car: 102,
      phase2: 0.225
    }
  },
  null,
  null,
  {
    top: {
      car: 102
    }
  },
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

class Participant extends Component{
  render(){
    const info = this.props.info;
    const entrant = this.props.picker?
        <ParticipantPicker participants={this.props.participants} selected={info.number} />:
        <span>{info.driver} ({info.number})</span>;
    return (
      <span>
        {this.props.heat}){' '}
        {entrant}
        <span className="right">
          <input type="text" className="phase-time" defaultValue={info.phase1||''} />
          <input type="text" className="phase-time"  defaultValue={info.phase2||''} />
        </span>
      </span>
    );
  }
};

class ParticipantPicker extends Component{
  render(){
    const options = this.props.participants.map((info, index)=>{
      return <option key={index} value={info.number}>{info.driver+' ('+info.number+')'}</option>;
    });
    const label = this.props.heat?<span>{this.props.heat}){' '}</span>:'';
    return (
      <span className="picker">
        {label}
        <select defaultValue={this.props.selected}>{options}</select>
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
    const phase = options.data[heat-1];
    const participants = options.participants;
    const isEntry = isEntryPoint(options);
    if(!phase){
      if(isEntry){
        return <ParticipantPicker participants={participants} heat={heat} />;
      }
      if(options.isFinal){
        return <span className="empty-driver">TBD</span>;
      }
      return <span className="empty-driver">{heat}) TBD</span>;
    }
    const driverInfo = phase[options.placement];
    if(!driverInfo){
      if(isEntry){
        return <ParticipantPicker participants={participants} heat={heat} />;
      }
      return <span className="empty-driver">{heat}) TBD</span>;
    }
    const carNumber = driverInfo.car;
    const car = getParticipant(carNumber, participants);
    if(!car){
      return <ParticipantPicker participants={participants} heat={heat} />;
    }
    if(options.isFinal){
      return {
        display: car.driver+' ('+car.number+')'
      };
    }
    const details = defaults(car, {
      phase1: driverInfo.phase1||'',
      phase2: driverInfo.phase2||''
    });
    return <Participant participants={participants} info={details} heat={heat} picker={isEntry} />;
  }

  getHeatWinnerText(top, bottom, participants){
    const wonBoth = (who)=>{
      return who.phase1 && who.phase2;
    };
    const getWinnerText = (participant, overall)=>{
      return `${participant.driver} (${participant.number}) Overall ${overall.toFixed(3)}`;
    };
    if(wonBoth(top)){
      return getWinnerText(getParticipant(top.car, participants), top.phase1+top.phase2);
    }
    if(wonBoth(bottom)){
      return getWinnerText(getParticipant(bottom.car, participants), bottom.phase1+bottom.phase2);
    }
    const overall = (top.phase1||top.phase2)-(bottom.phase1||bottom.phase2);
    if(overall<0){
      return getWinnerText(getParticipant(top.car, participants), -overall);
    }
    if(overall>0){
      return getWinnerText(getParticipant(bottom.car, participants), overall);
    }
    return 'TIE - Rerun it!';
  }

  getFiller(options){
    const heat = options.data[options.heat-1];
    if(heat&&heat.top&&heat.bottom){
      return this.getHeatWinnerText(heat.top, heat.bottom, options.participants);
    }
    return '';
  }

  render(){
    const id = this.props.params.id;
    const bracket = this.props.brackets.filter((bracket)=>bracket.id === id).shift();
    const layout = bracket?bracket.bracket||[]:[];
    const chart = bracket?<BracketChart
              className="bigger"
              layout={layout}
              data={data}
              bracket={bracket}
              participants={racers}
              getParticipant={this.getRacerInfo}
              getFiller={this.getFiller.bind(this)}
              />:<span>Loading ...</span>;
    return (
      <div>
        <h1>Edit Bracket {this.props.params.id}</h1>
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
