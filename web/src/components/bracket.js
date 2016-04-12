const React = require('react');
const {
  Component
} = React;
const classNames = require('classnames');

const classList = (component, defaults)=>{
  let result = defaults;
  const keys = (component.props.className||'').split(/[ \t]+/g);
  keys.forEach((key)=>{
    result[key]=true;
  });
  return classNames(result);
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

class Bracket extends Component{
  getParticipant(info){
    if(this.props.getParticipant){
      const control = this.props.getParticipant(defaults(info, {participants: this.props.participants, data: this.props.data, layout: this.props.layout}));
      return <span className="participant" key={info.key}>{control}</span>;
    }
    return <span className="participant">getParticipant property not defined</span>;
  }

  getRound(options){
    const {
          key,
          heats,
          level,
          isFinal,
          startHeat
        } = options;
    if(isFinal){
      return (
        <div className="round" key={key}>
          {this.getFinal({key, level, heat: startHeat, winner: (heats||[])[0]})}
        </div>
      );
    }
    let heatCounter = 0;
    const heatsControls = heats.map((info, key)=>{
      if(info===null){
        return [
          this.getHeatPlaceholder({
            key,
            level,
          }),
          <div className="spacer" key={key+"-spacer"}></div>
        ];
      }
      return [
        this.getHeat({
          info,
          level,
          key,
          heat: startHeat + heatCounter++,
        }),
        <div className="spacer" key={key+"-spacer"}></div>
      ];
    });
    return (
      <div className="round" key={key}>
        <div className="spacer"></div>
        {heatsControls}
      </div>
    );
  }

  getHeatPlaceholder(options){
    const {key} = options;
    if(this.props.getHeatPlaceholder){
      return this.props.getHeatPlaceholder(options);
    }
    return (
      <div className="heat" key={key}>
        <div className="placeholder-top">&nbsp;</div>
        <div className="placeholder-filler">&nbsp;</div>
        <div className="placeholder-bottom">&nbsp;</div>
      </div>
    );
  }

  getFiller(options){
    if(this.props.getFiller){
      return <div className="filler">{this.props.getFiller(defaults(options, {participants: this.props.participants, data: this.props.data, layout: this.props.layout}))}</div>;
    }
    return <div className="filler"></div>;
  }

  getHeat(options){
    const {
          info,
          key,
          level,
          heat
        } = options;
    const filler = this.getFiller({level, info, index: 0, heat, placement: 'filler', offset: key});
    return (
      <div className="heat" key={key}>
        <div className="participant-top">{this.getParticipant({level, info, index: 0, heat, placement: 'top', offset: key})}</div>
        {filler}
        <div className="participant-bottom">{this.getParticipant({level, info, index: 1, heat, placement: 'bottom', offset: key})}</div>
      </div>
    );
  }

  getFinal(options){
    const {
          winner,
          key,
          heat
        } = options;
    if(!heat){
      return;
    }
    return (
      <div className="heat">
        <div className="participant-filler"></div>
        <div className="participant-center">{this.getParticipant({level: key, heat, info: winner, index: 0, placement: 'winner', isFinal: true, offset: key})}</div>
        <div className="participant-filler"></div>
      </div>
    );
  }

  render(){
    let layout = this.props.layout || [];
    let heatNum = 1;
    const lastHeat = layout.length-1;
    const rounds = layout.map((heats, key)=>{
      const round = this.getRound({heats, startHeat: heatNum, key, level: key, isFinal: key===lastHeat});
      heatNum += (heats||[]).filter((heat)=>(heat !== null)&&(heat !== void 0)).length;
      return round;
    });
    const classNames = classList(this, {
      'bracket': true
    });
    return (
      <div className={classNames}>
        <div className="rounds">
          {rounds}
        </div>
      </div>
    )
  }
};

module.exports = Bracket;
