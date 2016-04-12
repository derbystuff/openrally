const React = require('react');
const {
  connect,
} = require('react-redux');

const heatData = [
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

class Heat extends React.Component{
  render(){
    const {
      driver,
      car,
      phase1 = <span> &nbsp;</span>,
      phase2 = <span> </span>,
      overall = <span> </span>
    } = this.props.data || {};
    const participant = car||driver?<span>{driver} ({car})</span>:'';
    const heat = this.props.lane===1?(
      <td rowSpan={2}>
        Heat {this.props.heat}
      </td>
    ):null;
    return (
      <tr>
        {heat}
        <td>
          {participant}
        </td>
        <td>
          {phase1}
        </td>
        <td>
          {phase2}
        </td>
        <td>
          {overall}
        </td>
      </tr>
    )
  }
};

class HeatView extends React.Component{
  render(){
    const heats = heatData.reduce((rows, record, index)=>{
      const heat = index + 1;
      if(record){
        const {
          top = {},
          bottom = {}
        } = record;
        const overall = top&&bottom?(top.phase1||top.phase2)-(bottom.phase1||bottom.phase2):'';
        const topData = {
          ...top,
          overall: overall&&(overall<0)?(-overall).toFixed(3):''
        };
        const bottomData = {
          ...bottom,
          overall: overall&&(overall>0)?overall.toFixed(3):''
        };
        return [...rows, <Heat heat={heat} data={topData} lane={1} key={index+'a'} />, <Heat heat={heat} data={bottomData} lane={2} key={index+'b'} />]
      }
      return [...rows, <Heat heat={heat} lane={1} key={index+'a'} />, <Heat heat={heat} lane={2} key={index+'b'} />]
    }, []);
    return (
      <div>
        <h1>View Heat {this.props.params.id}</h1>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Participants</th>
                <th>Phase 1</th>
                <th>Phase 2</th>
                <th>Overall</th>
              </tr>
            </thead>
            <tbody>
              {heats}
            </tbody>
          </table>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.params.id,
  };
};

module.exports = connect(mapStateToProps)(HeatView);
