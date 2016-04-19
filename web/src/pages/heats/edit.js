const React = require('react');
const {
  connect,
} = require('react-redux');
const {
  SmartForm
} = require('../../components/smartform');

class EditHeat  extends React.Component{
  getEditForm(heat){
    const {
      id = false,
    } = heat;
    const action = id&&heat?'Edit':'Create';
    const fields = [

    ];
    return (
      <SmartForm
        fields={fields}
        data={heat}
        title={`${action} Heat`}
        ref="form"
        onUpdate={(data, callback)=>this.props.onSave(data, callback)}
        onInsert={(data, callback)=>this.props.onInsert(data, callback)}
        onSuccess={()=>this.context.router.push('/heats')}
        />
    );
  }

  render(){
    const id = this.props.id || false;
    const heats = this.props.heats.filter((racer)=>racer.id===id);
    const heat = heats.shift();
    return heat||(id===false)?this.getEditForm(heat||{}):<span>Loading...</span>;
  }
};

EditHeat.contextTypes = {
  router: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.params.id,
    heats: state.heats,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSave: (event, callback)=>{
      store.updateRecord({
        type: 'HEAT',
        endpoint: 'heats',
        data: event
      }, callback);
    },
    onInsert: (event, callback)=>{
      store.addRecord({
        type: 'HEAT',
        endpoint: 'heats',
        data: event
      }, callback);
    },
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditHeat);
