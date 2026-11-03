/**
 * Creado por Danilo Milán Araujo
 */
require('buffer');
var fun = require('./fArray');
module.exports = (function(){
    /*
     * Obtener cantidad de clientes conectados al servidor
     * @params salas Object --- Objeto que almacena todos los datos de los clientes conectados
     * return Integer --- Cantidad de clientes
     */
    this.obtenerCantidadConectados = function (salas) {
        var cantidad = 0;
        for (var idcliente in salas) {
            if (salas.hasOwnProperty(idcliente)) {
                cantidad++;
            }
        }
        return cantidad;
    };
    /*
     * Verificar si hay clientes conectados al servidor
     * @params salas Object --- Objeto que almacena todos los datos de los clientes conectados
     * return bool --- True si hay clientes conectados, False en caso contrario
     */
    this.hayClientesConectados = function (salas) {
        return this.obtenerCantidadConectados(salas) == 0;
    };

    /*
     * Obtener todos las salas
     * return Array --- Arreglo de las salas
     */
    obtenerSalas = function () {
        var rooms = [];
        for (var idcliente in salas) {
            if (salas.hasOwnProperty(idcliente)) {
                var room = salas[idcliente];
                if(rooms.indexOf(room) == -1){
                    rooms.push(room);
                }
            }
        }
        return rooms;
    };
    /*
     * Agregar los valores de un objeto a otro(agregar a obj los valores de config)
     * @params obj Object --- Objeto al que se le agregarán los valores(pasado por referencia)
     * @params config Object --- Objeto con los nuevos valores
     * return void
     */
    this.sincronizarObjetos = function (obj, config) {
        for (var i in config) {
            if (config.hasOwnProperty(i)) {
                obj[i] = config[i];
            }
        }
    };


    /*
     * Obtener una cadena con la conexion a una BD
     * @params config Object --- Datos de conexion de un nodo
     * @return String --- Cadena de conexion
     */
    this.stringConexion = function (config) {
        return config.servidor ? "postgres://" + config.usuario + ":" + config.contrasenna + "@" + config.servidor + ":" + config.puerto + "/" + config.basedatos : null;
    };
    /*
     * Obtener una arreglo con los valores de una propiedad
     * @params datos Array --- Arreglo de objetos
     * @params String --- propiedad a ser obtenida
     * @return Array --- Arraglo con los valores de la propiedad dada de todos los objetos del arreglo
     */
    this.obtenerPropiedadObj = function(datos, propiedad){
        var result = [];
        datos.forEach(function(obj){
            result.push(obj[propiedad]);
        });
        return result;
    };
    /*
     * Obtener una arreglo con los objetos
     * @params objeto Object --- objetos
     * @return Array --- Arraglo de objetos
     */
    this.objectToArray = function(objeto){
        var result = [];
        for (var prop in objeto) {
            if (objeto.hasOwnProperty(prop)) {
                result.push(objeto[prop]);
            }
        }
        return result;
    };
    /*
     * Obtener Json respuesta http
     */
    this.obtenerJsonEnvio = function(callbackFullName){
        var callback = callbackFullName.split('.');
        var callbackName = callback[callback.length -1];
        return callbackName + '({0})';
    };

    /*
     * Encodear String utf8 a base64
     */
    this.encodearBase64 = function(c){
        var b = new Buffer(c);
        return b.toString('base64');
    };
    /*
     * Desencodear String base64 a utf8
     */
    this.desencodearBase64 = function(c){
        var b = new Buffer(c, 'base64');
        return b.toString('utf8');
    };
})();