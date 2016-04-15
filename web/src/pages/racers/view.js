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
  LabeledList,
  LabeledItem,
} = require('../../components/labeledlist');

const CLASS_LOOKUP = {
  st: 'Stock',
  ss: 'Super Stock',
  ma: 'Masters',
  ul: 'Ultimate Speed',
  sk: 'Super Kids',
  ad: 'Adult',
  test: 'Test',
};

class ViewRacer extends Component{
  render(){
    const id = this.props.id || false;
    const racers = this.props.racers.filter((racer)=>racer.id===id);
    const racer = racers.shift()||{};
    const {
      givenName = '',
      familyName = '',
      nickName = '',
      gender = '',
      dob = '',
      homeTrack = '',
      region = '',
      favorite = '',
      car = {},
      sponsor = '',
      ndr = {},
      aa = {},
      interests = [],
      classes = [],
    } = racer;
    const dobStr = dob.toLocaleString().split(',').shift();
    const ndrNumber = ndr.number || 'Unknown';
    const aaNumber = aa.number || 'Unknown';
    return (
      <div>
        <h1>View Racer</h1>

        <LabeledList>
          <LabeledItem label="ID:" value={id} />
          <LabeledItem label="Given Name:" value={givenName} />
          <LabeledItem label="Family Name:" value={familyName} />
          <LabeledItem label="Nick Name:" value={nickName} hideIfNone={true} />
          <LabeledItem label="Gender:" value={gender} hideIfNone={true} />
          <LabeledItem label="Date of Birth:" value={dobStr} hideIfNone={true} />
          <LabeledItem label="Home Track:" value={homeTrack} hideIfNone={true} />
          <LabeledItem label="Region:" value={region} hideIfNone={true} />
          <LabeledItem label="Car Design:" value={car.design} hideIfNone={true} />
          <LabeledItem label="Favorite thing about racing:" value={favorite} hideIfNone={true} />
          <LabeledItem label="Sponsor:" value={sponsor} hideIfNone={true} />
          <LabeledItem label="NDR Number:" value={ndrNumber} hideIfNone={true} />
          <LabeledItem label="AA Number:" value={aaNumber} hideIfNone={true} />
          <LabeledItem label="Interests:" value={interests.join(', ')} hideIfNone={true} />
          <LabeledItem label="Classes:" value={classes.map((classShort)=>CLASS_LOOKUP[classShort]).join(', ')} hideIfNone={true} />
        </LabeledList>
        <Link className="btn btn-warning" to={`/racers/${id}/edit`}>Edit</Link>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.params.id,
    racers: state.racers,
  };
};

module.exports = connect(mapStateToProps)(ViewRacer);
