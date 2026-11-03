/**
 * Creado por Danilo Milan Araujo
 * Requerir modulos para toda la aplicacion
 * Declarar variables globales para tener acceso desde cualquier parte de la aplicacion
 */
require('date-utils');
require('./overrides');
module.exports = (function(){
    Config = require('./config');
    salas = {};
    configTiempo = {};
    dbActiva = false;
})();