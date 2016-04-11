const Builder = require('../lib/dbroutebuilder').Builder;
const Joi = require('joi');
const builder = new Builder({
  collection: 'races',
  route: 'races',
  orm: {
    date: Joi.date(),
    division: Joi.string().allow('ndr', 'aa'),
    type: Joi.string().allow('double', 'single'),
    class: Joi.string().allow('st', 'ss', 'ma', 'ul', 'sk', 'ad'),
    entrants: Joi.array().items(Joi.string()).optional(),
    heats: Joi.array().optional(),
    bracket: Joi.object().optional(),
  }
});
const routes = builder.routes();

module.exports = routes;
