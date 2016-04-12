const React = require('react');
const {
  Component
} = React;
const {
  LabeledInput,
  LabeledTextarea,
} = require('../../components/editors');
const {
  LabeledItem,
} = require('../../components/labeledlist');
const {
  Link,
} = require('react-router');
const {
  connect,
} = require('react-redux');
const store = require('../../reducers');

class EditRacer extends Component{
  getRacerInfo(){
    const id = this.props.id || false;
    const interests = (this.refs.interests.getValue()||'').split(',').map(s=>s.trim()).filter(s=>!!s);
    return {
      id,
      givenName: this.refs.givenName.getValue(),
      familyName: this.refs.familyName.getValue(),
      nickName: this.refs.nickName.getValue(),
      gender: this.refs.gender.getValue(),
      dob: this.refs.dob.getValue(),
      homeTrack: this.refs.homeTrack.getValue(),
      region: this.refs.region.getValue(),
      favorite: this.refs.favorite.getValue(),
      car: {
        decoration: this.refs.carDesign.getValue(),
      },
      sponsor: this.refs.sponsor.getValue(),
      ndr: {
        number: this.refs.ndrNumber.getValue(),
      },
      aa: {
        number: this.refs.aaNumber.getValue(),
      },
      interests: interests,
    };
  }

  saveChanges(e){
    if(e){
      e.preventDefault();
      e.stopPropagation();
    }
    const id = this.props.id || false;
    if(id && this.props.onSave){
      this.props.onSave(this.getRacerInfo(), (err, record)=>{
        if(err){
          return;
        }
        this.context.router.push('/racers');
      });
    }
    if(!id && this.props.onRegister){
      this.props.onRegister(this.getRacerInfo(), (err, record)=>{
        if(err){
          return;
        }
        this.context.router.push('/racers');
      });
    }
  }

  render(){
    const id = this.props.id || false;
    const racers = this.props.racers.filter((racer)=>racer.id===id);
    const racer = racers.shift()||{};
    const {
      givenName = '',
      familyName = '',
      nickName = '',
      homeTrack = '',
      region = '',
      favorite = '',
      gender = '',
      dob = '',
      car = {},
      sponsor = '',
      ndr = {},
      aa = {},
      interests = [],
    } = racer;
    const dobStr = dob.toLocaleString().split(',').shift();
    const ndrNumber = ndr.number;
    const aaNumber = aa.number;
    const action = id&&racer?'Edit':'Register';
    return (
      <form onSubmit={this.saveChanges}>
        <h1>{action} Racer</h1>
        <div className="form-group">
          <LabeledInput label="Given Name:" value={givenName} ref="givenName" />
          <LabeledInput label="Family Name:" value={familyName} ref="familyName" />
          <LabeledInput label="Nick Name:" value={nickName} ref="nickName" />
          <LabeledInput label="Gender:" value={gender} ref="gender" />
          <LabeledInput label="Date of Birth:" value={dobStr} ref="dob" />
          <LabeledInput label="Home Track:" value={homeTrack} ref="homeTrack" />
          <LabeledInput label="Region:" value={region} ref="region" />
          <LabeledInput label="Car Design:" value={car.decoration} ref="carDesign" />
          <LabeledTextarea label="Favorite thing about racing:" value={favorite} ref="favorite" />
          <LabeledInput label="Sponsor:" value={sponsor} ref="sponsor" />
          <LabeledInput label="NDR Number:" value={ndrNumber} ref="ndrNumber" />
          <LabeledInput label="AA Number:" value={aaNumber} ref="aaNumber" />
          <LabeledTextarea label="Interests:" value={interests.join(', ')} ref="interests" />
        </div>
        <Link className="btn btn-primary" to={`/racers/${id}/edit`} onClick={this.saveChanges.bind(this)}>Save</Link>
      </form>
    );
  }
}

EditRacer.contextTypes = {
  router: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.params.id,
    racers: state.racers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSave: (racer, callback)=>{
      store.updateRecord({
        type: 'RACER',
        endpoint: 'racers',
        data: racer
      }, callback);
    },
    onRegister: (racer, callback)=>{
      store.addRecord({
        type: 'RACER',
        endpoint: 'racers',
        data: racer
      }, callback);
    },
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditRacer);
