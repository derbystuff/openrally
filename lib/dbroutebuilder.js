const db = require('../lib/db');
const Joi = require('joi');
const logger = require('../lib/logger');
const {
  extend,
  exclude,
} = require('./utils');
const DEFAULT_ROUTES = [
  {
    method: 'list',
    path: '/api/v1/${options.route}',
  },
  {
    method: 'get',
    path: '/api/v1/${options.route}/{id}',
  },
  {
    method: 'insert',
    path: '/api/v1/${options.route}',
  },
  {
    method: 'update',
    path: '/api/v1/${options.route}/{id}',
  },
  {
    method: 'delete',
    path: '/api/v1/${options.route}/{id}',
  },
];

const getValueFromTemplate = (str, args)=>{
  const fargnames = Object.keys(args);
  const fargs = fargnames.map((key)=>args[key]);
  const source = 'return `'+str+'`';
  const f = new Function(fargnames, source);
  const value = f(...fargs);
  return value;
};

const getSchema = (orm) => {
  const fullOrm = {
    _created: Joi.date().optional(),
    _updated: Joi.date().optional(),
    ...orm
  };
  return orm?Joi.object().keys(fullOrm):Joi.any().required();
};

const handlerBuilders = {
  list(options){
    return {
      method: 'GET',
      path: getValueFromTemplate(options.path, {options}),
      config: {
        tags: ['api'],
        handler: (req, reply)=>{
          db.collection(options.collection).list(req.params.query, (err, records)=>{
            if(err){
              logger.error(err);
              return reply(err);
            }
            return reply(records);
          });
        }
      }
    };
  },

  get(options){
    return {
      method: 'GET',
      path: getValueFromTemplate(options.path, {options}),
      config: {
        tags: ['api'],
        validate: {
          params: {
            id: Joi.string().required()
          }
        },
        handler: (req, reply)=>{
          db.collection(options.collection).get(req.params.id, (err, record)=>{
            if(err){
              logger.error(err);
              return reply(err);
            }
            return reply(record);
          });
        }
      }
    };
  },

  update(options){
    const schema = getSchema(options.orm);
    return {
      method: 'PUT',
      path: getValueFromTemplate(options.path, {options}),
      config: {
        tags: ['api'],
        validate: {
          params: {
            id: Joi.string().required()
          },
          payload: options.orm?Joi.object().keys(options.orm):Joi.any().required(),
        },
        handler: (req, reply)=>{
          Joi.validate(req.payload, schema, {allowUnknown: true, convert: true, presence: 'required'}, (err, value)=>{
            if(err){
              return reply(err);
            }
            logger.info('update', value);
            db.collection(options.collection).update(req.params.id, req.payload, (err, record)=>{
              if(err){
                logger.error(err);
                return reply(err);
              }
              return reply(record);
            });
          });
        }
      }
    };
  },

  insert(options){
    const schema = getSchema(options.orm);
    return {
      method: 'POST',
      path: getValueFromTemplate(options.path, {options}),
      config: {
        tags: ['api'],
        validate: {
          payload: schema,
        },
        handler: (req, reply)=>{
          Joi.validate(req.payload, schema, {allowUnknown: true, convert: true, presence: 'required'}, (err, value)=>{
            if(err){
              return reply(err);
            }
            db.collection(options.collection).insert(value, (err, record)=>{
              if(err){
                logger.error(err);
                return reply(err);
              }
              return reply(record);
            });
          });
        }
      }
    };
  },

  delete(options){
    return {
      method: 'DELETE',
      path: getValueFromTemplate(options.path, {options}),
      config: {
        tags: ['api'],
        validate: {
          params: {
            id: Joi.string().required()
          },
        },
        handler: (req, reply)=>{
          db.collection(options.collection).delete(req.params.id, (err, deleted)=>{
            if(err){
              logger.error(err);
              return reply(err);
            }
            return reply(deleted);
          });
        }
      }
    };
  }
};

class Builder{
  constructor(options){
    this.options = options;
    this._routes = [];
    (options.routes || DEFAULT_ROUTES).map((route)=>this.addRoute(route));
  }

  addRoute(options){
    this._routes.push(handlerBuilders[options.method](extend(true, {}, options, exclude(this.options, 'routes'))));
  }

  routes(){
    return this._routes
  }
}

module.exports = {Builder};
