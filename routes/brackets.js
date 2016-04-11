const Builder = require('../lib/dbroutebuilder').Builder;
const Joi = require('joi');
/*
Bracket{
  
}
*/
const builder = new Builder({
  collection: 'brackets',
  route: 'brackets',
  orm: {
    division: Joi.string().allow('ndr', 'aa'),
    type: Joi.string().allow('double', 'single'),
    version: Joi.string(),
    bracket: Joi.object(),
  }
});
const routes = builder.routes();

module.exports = routes;
