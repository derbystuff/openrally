const Builder = require('../lib/dbroutebuilder').Builder;
const Joi = require('joi');
const builder = new Builder({
  collection: 'races',
  route: 'races',
  orm: {
    date: Joi.date(),
    division: Joi.string().allow('ndr', 'aa', 'sk', 'test'),
    concelation: Joi.boolean().default(false),
    type: Joi.string().allow('double', 'single'),
    classes: Joi.array().items(Joi.object().keys({
      class: Joi.string().allow('st', 'ss', 'ma', 'ul', 'sk', 'ad'),
      entrants: Joi.array().items(Joi.string()).optional(),
    })),
    heats: Joi.array().optional(),
    bracket: Joi.object().keys({
      id: Joi.string(),
      division: Joi.string().allow('ndr', 'aa', 'sk', 'test'),
      type: Joi.string().allow('double', 'single'),
      version: Joi.string(),
      bracket: Joi.array(),
    }).optional(),
  }
});
const routes = builder.routes();

module.exports = routes;
