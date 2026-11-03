
/**
 * Creado por Danilo Milán Araujo
 */
require('./common/global');
var fs = require("fs"),
    options = {};
if(!Config.protocol) {
    options = {
        key: fs.readFileSync(Config.key),
        cert: fs.readFileSync(Config.cert),
        requestCert: true
    }
}
var util = require('util'),
    io = require('socket.io'),
    urlM = require('url'),
    http = require('http'),
    socket = io.listen(Config.port_socketIO, options),
    controller = require('./.'),
    domain = require('domain'),
    controllers = require('./controllers');
/*
 * Servidor tcp(socket-io)
 */
socket.on('connection', function (client) {
    try {


        client.on('disconnect', function () {
            controllers.BsnNotificacion.quitarDestinatario(client);
            controllers.BsnNotificacion.desconectarCliente(socket.sockets);
        });

        client.on('subscribe', function (data) {
            controllers.BsnNotificacion.unirASala(client, data);
            controllers.BsnNotificacion.comenzarMonitoreo(socket.sockets);
        });

    }
    catch (exc) {
        client.emit('console', exc);
    }
});


console.log('server activo');