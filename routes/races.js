const Builder = require('../lib/dbroutebuilder').Builder;
const Joi = require('joi');
const builder = new Builder({
  collection: 'races',
  route: 'races',
  orm: {
    date: Joi.date(),
    type: Joi.string().allow('ndr', 'aa')
  }
});
const routes = builder.routes();

module.exports = routes;
