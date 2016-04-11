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
    division: Joi.string().allow('ndr', 'aa', 'sk', 'test'),
    type: Joi.string().allow('double', 'single'),
    count: Joi.number().optional(),
    version: Joi.string(),
    bracket: Joi.array().items(
      Joi.array().items(
        Joi.array().items().allow(null),
      ).allow(null)
    ).allow(null).optional(),
  }
});
const routes = builder.routes();

module.exports = routes;
