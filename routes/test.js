const Builder = require('../lib/dbroutebuilder').Builder;
const Joi = require('joi');
const builder = new Builder({
  collection: 'test',
  route: 'test',
});
const routes = builder.routes();

module.exports = routes;
