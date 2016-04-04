'use strict';

const async = require('async');
const logger = require('./logger');
const server = require('./server');
const config = require('./config');

const LazyEvents = require('./lazyevents').LazyEvents;

class Setup extends LazyEvents{
  constructor(){
    super();
    config.on('ready', this.setupServer);
  }
  setupServer(){
    server.start();
  }
}

new Setup();
