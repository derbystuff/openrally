const Builder = require('../lib/dbroutebuilder').Builder;
const Joi = require('joi');
const builder = new Builder({
  collection: 'racers',
  route: 'racers',
  orm: {
    firstName: Joi.string(),
    lastName: Joi.string(),
    homeTrack: Joi.string().optional(),
    region: Joi.number(),
    ndr: Joi.object().keys({
      number: Joi.number(),
    }).optional(),
    aa:  Joi.object().keys({
      number: Joi.number(),
    }).optional(),
  }
});
const routes = builder.routes();

module.exports = routes;
