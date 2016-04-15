const moment = require('moment');

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

module.exports = {
  isEntryPoint,
  calcNumEntrantsForLevel,
  calcNumEntrants,
  formatDate,
};
