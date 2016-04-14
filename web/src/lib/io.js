const io = require('socket.io-client');
const client = io(window.location.origin);
module.exports = client;
