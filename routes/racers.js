const Builder = require('../lib/dbroutebuilder').Builder;
const Joi = require('joi');
/*
givenName = '',
familyName = '',
nickName = '',
gender = '',
dob = '',
homeTrack = '',
region = '',
favorite = '',
car = {},
sponsor = '',
ndr = {},
aa = {},
interests = [],
*/
const builder = new Builder({
  collection: 'racers',
  route: 'racers',
  orm: {
    givenName: Joi.string(),
    familyName: Joi.string(),
    nickName: Joi.string().allow('').optional(),
    gender: Joi.string().allow('').optional(),
    dob: Joi.date().optional().allow(''),
    homeTrack: Joi.string().allow('').optional(),
    region: Joi.number().optional().allow(''),
    favorite: Joi.string().allow('').optional(),
    sponsor: Joi.string().allow('').optional(),
    classes: Joi.array().items(Joi.string().allow('st', 'ss', 'ma', 'ul', 'sk', 'ad', 'test')).optional(),
    car: Joi.object().keys({
      decoration: Joi.string().allow('').optional(),
    }).optional(),
    ndr: Joi.object().keys({
      number: Joi.number().allow(''),
    }).optional(),
    aa:  Joi.object().keys({
      number: Joi.number().allow(''),
    }).optional(),
    interests: Joi.array().items(Joi.string().allow('')).optional(),
  }
});
const routes = builder.routes();

module.exports = routes;
