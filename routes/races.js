const Builder = require('../lib/dbroutebuilder').Builder;
const Joi = require('joi');
const builder = new Builder({
  collection: 'races',
  route: 'races',
  orm: {
    eventId: Joi.string(),
    date: Joi.date(),
    title: Joi.string().optional().allow(''),
    consolation: Joi.boolean().default(false),
    type: Joi.string().allow('double', 'single'),
    class: Joi.string().allow('st', 'ss', 'ma', 'ul', 'sk', 'ad', 'test'),
    entrants: Joi.array().items(Joi.object().keys({
      id: Joi.string(),
      givenName: Joi.string(),
      familyName: Joi.string(),
      nickName: Joi.string().optional().allow(''),
      divisionNumber: Joi.number().optional().allow(null),
      carNumber: Joi.number().optional().allow(null),
    })).optional().allow(null),
    bracket: Joi.object().keys({
      id: Joi.string().allow(''),
      version: Joi.string().optional().allow(''),
      heats: Joi.array().optional().allow(null),
      layout: Joi.array().optional().allow(null),
    }).optional().allow(null)
  }
});
const routes = builder.routes();

module.exports = routes;
