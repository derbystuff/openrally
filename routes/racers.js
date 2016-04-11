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
    nickName: Joi.string().optional(),
    gender: Joi.string().optional(),
    dob: Joi.date().optional(),
    homeTrack: Joi.string().optional(),
    region: Joi.number().optional(),
    favorite: Joi.string().optional(),
    sponsor: Joi.string().optional(),
    car: Joi.object().keys({
      decoration: Joi.string().optional(),
    }).optional(),
    ndr: Joi.object().keys({
      number: Joi.number(),
    }).optional(),
    aa:  Joi.object().keys({
      number: Joi.number(),
    }).optional(),
    interests: Joi.array().items(Joi.string()).optional(),
  }
});
const routes = builder.routes();

module.exports = routes;
