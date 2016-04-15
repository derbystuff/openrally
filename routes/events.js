const Builder = require('../lib/dbroutebuilder').Builder;
const Joi = require('joi');
const builder = new Builder({
  collection: 'events',
  route: 'events',
  orm: {
    startDate: Joi.date(),
    endDate: Joi.date(),
    divisions: Joi.array().items(Joi.string().allow('ndr', 'aa', 'sk', 'adult', 'test')),
    title: Joi.string().optional().allow(''),
    description: Joi.string().optional().allow(''),
    location: Joi.string().optional().allow(''),
  }
});
const routes = builder.routes();

module.exports = routes;
