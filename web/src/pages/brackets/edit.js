const React = require('react');
const {
  Component
} = React;
const {
  connect,
} = require('react-redux');
const store = require('../../reducers');
const {
  SmartForm,
} = require('../../components/smartform');

const {
  BracketPreview,
} = require('../../components/bracket');

const getLayoutFromString = (str)=>{
  const f = new Function('', 'return '+str+';');
  return f();
};

const raceTypes = [
  {
    id: '',
    caption: 'Custom'
  },
  {
    id: 'double',
    caption: 'Double'
  },
  {
    id: 'single',
    caption: 'Single'
  },
];

class Participant extends Component{
  render(){
    return (
      <span>{this.props.heat}) Participant</span>
    );
  }
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

class BracketView extends Component{
  getRacerInfo(options){
    const heat = options.heat;
    const phase = options.data[heat-1];
    const participants = options.participants;
    const isEntry = isEntryPoint(options);
    if(isEntry){
      return <Participant participants={participants} heat={heat} />;
    }
    if(options.isFinal){
      return <span className="empty-driver">TBD</span>;
    }
    return <span className="empty-driver">{heat}) TBD</span>;
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

  getEditView(options){
    const {
      id,
      layout,
      bracket,
      participants = [],
      data = [],
    } = options;
    if((id!==false)&&(!bracket)){
      return <span>Loading ...</span>;
    }
    return (
      <BracketPreview
        className="bigger"
        layout={layout}
        bracket={bracket}
        participants={participants}
        data={data}
        />
    );
  }

  render(){
    const id = this.props.id;
    const bracket = this.props.brackets.filter((bracket)=>bracket.id === id).shift();
    const layout = bracket?bracket.bracket||[]:[];
    return bracket?this.getEditView({layout, bracket, ...this.props}):<span>Loading...</span>;
  }
};

class Page extends Component{
  constructor(props){
    super(props);
    this.state = {layout: false};
  }

  getView(){
    const {
      id = false,
      brackets,
    } = this.props;
    const bracket = brackets.filter((bracket)=>bracket.id === id).shift();
    const layout = this.state.layout||(bracket?bracket.bracket||[]:[]);
    const action = id&&bracket?'Edit':'Create';
    if((id!==false)&&(!bracket)){
      return <span>Loading...</span>;
    }
    const fields = [
      {
        caption: 'Name:',
        field: 'name',
        type: 'text',
      },
      {
        caption: 'Division:',
        field: 'division',
        type: 'text',
        required: true,
      },
      {
        caption: 'Type:',
        type: 'select',
        field: 'type',
        items: raceTypes,
        required: true,
      },
      {
        caption: 'Version:',
        field: 'version',
        type: 'text',
        required: true,
      },
      {
        caption: 'Layout:',
        type: 'textarea',
        field: 'bracket',
        default: [],
        display: (value)=>JSON.stringify(value, null, '  '),
        store: (value)=>getLayoutFromString(value),
        onChange: (e, ref)=>{
          try{
            this.setState({layout: getLayoutFromString(ref.getValue())})
          }catch(e){}
        }
      },
    ];
    return (
      <div>
        <SmartForm
          fields={fields}
          data={bracket}
          title={`${action} Bracket`}
          ref="form"
          onUpdate={(data, callback)=>this.props.onSave(data, callback)}
          onInsert={(data, callback)=>this.props.onInsert(data, callback)}
          onSuccess={()=>this.context.router.push('/brackets')}
          />
        <h2>Preview</h2>
        <BracketView id={id} layout={layout} {...this.props} />
      </div>
    );
  }

  render(){
    return this.getView();
  }
}

Page.contextTypes = {
  router: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.params.id,
    brackets: state.brackets,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSave: (event, callback)=>{
      store.updateRecord({
        type: 'BRACKET',
        endpoint: 'brackets',
        data: event
      }, callback);
    },
    onInsert: (event, callback)=>{
      store.addRecord({
        type: 'BRACKET',
        endpoint: 'brackets',
        data: event
      }, callback);
    },
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Page);
