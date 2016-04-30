'use strict';

const fs = require('fs');
const Hapi = require('hapi');
const util = require('util');
const path = require('path');
const async = require('async');
const pjson = require('../package.json');
const Inert = require('inert');
const Vision = require('vision');
const h2o2 = require('h2o2');
const os = require('os');

const logger = require('./logger');
const utils = require('./utils');

const HapiSwagger = require('hapi-swagger');
const ROUTES = [
  ...require('../routes/status'),
  ...require('../routes/test'),
  ...require('../routes/racers'),
  ...require('../routes/events'),
  ...require('../routes/races'),
  ...require('../routes/brackets'),
  ...require('../routes/timer'),
];
const PLUGINS = [
  Inert,
  Vision,
  {
    register: HapiSwagger,
    options: {
      info: {
        title: pjson.name+' Documentation',
        version: pjson.vresion
      }
    }
  },
  {
    register: require('hapi-io'),
    options: {}
  },
  require('../plugins/timer'),
];

const LazyEvents = require('./lazyevents').LazyEvents;

const config = require('./config');

const ips = (()=>{
  const ifaces = os.networkInterfaces();
  const ips = Object.keys(ifaces).reduce(function (ips, ifname) {
    ifaces[ifname].forEach((iface)=>{
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      ips.push(iface.address);
    });
    return ips;
  }, []);
  return ips;
})();
logger.info('Available IP\'s', ips);

class Server extends LazyEvents{
  constructor(){
    super();
    this.hapi = new Hapi.Server();
  }

  handleError(req, e){
    logger.error(e);
    if(e.stack){
      logger.error(e.stack);
    }
  }

  handleLog(event, tags){
    if(tags.error){
      return logger.error(event);
    }
    return logger.info(event);
  }

  started(err){
    if(err){
      return logger.error(err.toString(), err);
    }
    logger.info(`${pjson.name} v${pjson.version} website started on http://${this.HOST}:${this.PORT}`);
  }

  handleRequest(request, next){
    logger.info('Inbound started: ', {'Correlation-Id': request.id, 'URL': request.url.href, 'Method': request.method});
    return next.continue();
  }

  handlePreRequest(request, reply){
    if (request.response.isBoom && request.response.output && (request.response.output.statusCode===404)) {
      let parts = request.url.path.split('/');
      const isIndexRoute = (parts[1]!=='api') && (utils.getExtension(parts[parts.length-1]) === '');
      const hot = config.get('hot');
      if(isIndexRoute){
        logger.info('Inbound completed: ', {statusCode: 200, 'Correlation-Id': request.id, 'URL': request.url.href, 'Method': request.method, 'Response': request.response.output});
        if(hot){
          const page = this.hapi.plugins.webpack.devMiddleware.fileSystem.readFileSync(`${this.webRoot}/index.html`);
          return reply(page).header('Correlation-Id', request.id).header('Content-Type', 'text/html');
        }
        return reply.view('index', request).header('Correlation-Id', request.id);
      }
    }
    logger.info('Inbound completed: ', {statusCode: request.response.statusCode, 'Correlation-Id': request.id, 'URL': request.url.href, 'Method': request.method, 'Response': request.response.payload});

    if(request.response.header && request.id){
      request.response.header('Correlation-Id', request.id);
    }
    if(request.response.isBoom){
      const error = request.response;
      return reply({
        statusCode: error.output.statusCode,
        data: error.data,
        output: error.output,
        stack: error.stack?error.stack.split('\n').map(s=>s.trim()):null,
        errorMessage: error.toString()
      });
    }
    return reply.continue();
  }

  getPackages(){
    let registerPackages = [];

    if(config.get('hot')){
      const Webpack = require('webpack');
      registerPackages.push({
        register: require('./hotplugin'),
        options: './configs/webpack.client.js',
      });
    }
    return registerPackages.concat(PLUGINS);
  }

  registerPackages(packages){
    this.hapi.register(packages, (err) => {
      if(err){
        logger.error(err);
      }

      this.hapi.views({
        engines: {
          html: {
            compile: (template, compileOptions)=>{
              return (context, renderOptions)=>{
                const UI_CONFIG = config.get('UI', {});
                const ctx = utils.extend(context, {UI_CONFIG});
                return template.replace(/{{([a-z0-9_.-]+)}}/gi, (match, token)=>{
                  return JSON.stringify(utils.valueFromObjectCI(ctx, token, false));
                });
              }
            }
          }
        },
        relativeTo: this.webRoot,
        path: './'
      });
    })
  }

  setupBaseRoute(){
    this.hapi.route([
      {
        method: 'GET',
        path: '/{param*}',
        handler: {
          directory: {
            path: this.webRoot
          }
        }
      },
    ].concat(ROUTES));
  }

  start(callback){
    const cb = callback || utils.noop;

    const UI_CONFIG = config.get('UI', {});
    const WEB_CONFIG = config.get('WEB', {});
    const {
      PORT = 9090,
      HOST = ips[0]||'localhost',
      WEB_ROOT = 'web/site/',
    } = WEB_CONFIG;

    this.HOST = HOST;
    this.PORT = PORT;
    this.webRoot = path.resolve(__dirname, '../', WEB_ROOT);

    this.hapi.on('request-error', (req, err)=>this.handleError(req, err));
    this.hapi.on('log', (event, tags)=>this.handleLog(event, tags));
    this.hapi.connection({host: HOST, port: PORT});
    this.hapi.ext('onRequest', (request, next)=>this.handleRequest(request, next))
    this.hapi.ext('onPreResponse', (request, reply)=>this.handlePreRequest(request, reply));
    this.registerPackages(this.getPackages());
    this.setupBaseRoute();
    logger.info(`Static content folder: ${this.webRoot}`);
    this.hapi.start((err)=>{
      if(err){
        this.emit('error', err);
        return cb(err);
      }
      this.emit('started');
      this.started();
      return cb(null, this);
    });
  }
}

let server = new Server();
server.Server = Server;

module.exports = server;
