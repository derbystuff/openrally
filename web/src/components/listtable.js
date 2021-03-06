const React = require('react');
const {
  Link,
} = require('react-router');
const {
  Button,
} = require('react-bootstrap');
const {
  connect,
} = require('react-redux');
const {
  SmartTable,
} = require('./smarttable');
const reToken = /\$\{([^}]+)\}/gi;
/*
class Item extends React.Component{
  getActionHandler(options){
    const {
      caption,
      settings,
      data,
    } = options;
    const id = caption;
    const isLink = (typeof(settings)==='string')||(!!settings.href);
    const extClass = settings.className||'default';
    if(isLink){
      const href = ((typeof(settings)==='string')?settings:settings.href).replace(reToken, (full, token)=>data[token]);
      return <Link key={id} className={`btn btn-${extClass}`} to={href}>{caption}</Link>
    }
    const handler = typeof(settings)==='function'?settings:settings.handler;
    const clickHandler = (e)=>{
      e&&e.preventDefault();
      handler(data);
    };
    return <Button key={id} bsStyle={extClass} onClick={clickHandler}>{caption}</Button>;
  }

  render(){
    const data = this.props.data;
    const id = data.id;
    const cells = this.props.map.map((f, index)=><td key={index}>{f(data)}</td>);
    const actions = Object.keys(this.props.actions||{}).map((caption)=>this.getActionHandler({caption, settings: this.props.actions[caption], data}));
    return (
      <tr>
        {cells}
        <td>
          {actions}
        </td>
      </tr>
    );
  }
};
//*/
class Tools extends React.Component{
  getNewButton(){
    if(!this.props.newLink){
      return;
    }
    return <Link className="btn" to={this.props.newLink}>{this.props.newButtonCaption||'New'}</Link>;
  }

  render(){
    return (
      <div>
        {this.getNewButton()}
      </div>
    );
  }
};
/*
class Table extends React.Component{
  render(){
    const {
      items,
      actions,
    } = this.props;
    const headings = (this.props.headers||[]).map((caption, index)=><th key={caption}>{caption}</th>).concat([
      <th key="actions">Actions</th>
    ]);
    const rows = (this.props.data||[]).map((row, index)=><Item key={row.id||index} map={this.props.rowmap||[]} data={row} actions={actions} />);
    return (
        <table className="table">
          <thead>
            <tr>
              {headings}
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
          <tfoot>
            <tr>
              {headings}
            </tr>
          </tfoot>
        </table>
    );
  }
};
//*/

class Page extends React.Component{
  render(){
    const {
      title,
    } = this.props;
    return (
      <div>
        <h1>{title}</h1>
        <Tools {...this.props} />
        <SmartTable {...this.props} />
        <Tools {...this.props} />
      </div>
    );
  }
};

module.exports = {
  Page,
  Table: SmartTable,
  Tools
};

/*
const mapStateToProps = (state) => {
  return state;
};

module.exports = connect(mapStateToProps)(Page);
*/
