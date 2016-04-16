const moment = require('moment');

const reTrue = /^(true|t|yes|y|1)$/i;
const reFalse = /^(false|f|no|n|0)$/i;

const noop = function(){};

const isEntryPoint = (options)=>{
  const {
    level,
    offset,
    index,
    isFinal,
    layout
  } = options;
  if(level===0){
    return true;
  }
  const levelOffset = (offset*2)+index;
  const isEntry = (!isFinal)&&!layout[level-1][levelOffset];
  return isEntry;
};

const calcNumEntrantsForLevel = (options)=>{
  const {
    layout,
    level,
    index
  } = options;
  if(!level){
    return 0;
  }
  if(index === 0){
    return level.filter(heat=>!!heat).length*2;
  }
  return level.filter(heat=>!!heat).reduce((accum, heat, heatIndex)=>{
    let sum = 0;
    if(isEntryPoint({
      level: index,
      offset: heatIndex,
      index: 0,
      layout
    })){
      sum++;
    }
    if(isEntryPoint({
      level: index,
      offset: heatIndex,
      index: 1,
      layout
    })){
      sum++;
    }
    return accum + sum;
  }, 0);
};

const calcNumEntrants = (bracket)=>{
  const layout = bracket || [];
  return layout.reduce((accum, level, index)=>accum+calcNumEntrantsForLevel({layout, level, index}), 0);
};

const formatDate = (dt)=>{
  return moment((dt instanceof Date?dt.toISOString():dt || '').substr(0, 10)).format('LL');
};

const getObjectValue = (obj, key, def) => {
  let o = obj;
  let path = key.split('.');
  let segment;
  while(o && path.length){
    segment = path.shift();
    o = o[segment];
  }
  if(typeof(o) !== 'undefined'){
    return o;
  }
  return def;
};

const setObjectValue = (source, key, value) => {
  let res = Object.assign({}, source);
  let o = res;
  let path = key.split('.'), last, segment;
  while(o && path.length){
    segment = path.shift();
    last = o;
    o = o[segment];
    if(!o){
      o = last[segment] = {};
    }
  }
  last[segment] = value;
  return res;
};

const isTrue = (value) => {
  return !!reTrue.exec(''+value);
};

const isFalse = (value) => {
  return !!reFalse.exec(''+value);
};

const lowerFirstLetter = (string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

const upperFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const isDateTime = (value) => {
  if(value instanceof Date){
    return true;
  }
  if(typeof(value)==='string' && (!isNaN(Date.parse(value)))){
    return true;
  }
  return false;
};

const getTypedValueFrom = (value) => {
  if(isNumeric(value)){
    return +value;
  }
  if(isTrue(value)){
    return true;
  }
  if(isFalse(value)){
    return false;
  }
  if(isDateTime(value)){
    return new Date(Date.parse(value));
  }
  return value;
};

const getJoiErrorText = (data)=>{
  return data.details.map(detail=>{
    const tail = /"[^"]+" ([\s\S]+)/.exec(detail.message)[1];
    return `"${detail.path}" ${tail}`;
  });
};

module.exports = {
  isEntryPoint,
  calcNumEntrantsForLevel,
  calcNumEntrants,
  formatDate,
  setObjectValue,
  getObjectValue,
  noop,
  isTrue,
  isFalse,
  reTrue,
  reFalse,
  isNumeric,
  isDateTime,
  lowerFirstLetter,
  upperFirstLetter,
  getTypedValueFrom,
  getJoiErrorText,
};
