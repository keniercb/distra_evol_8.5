/**
 * Creado por Danilo Milán Araujo
 */
var utiles =  require('./utiles');
var async = require('async');
var pg = require('pg');
module.exports = (function() {
    /*
     * Monitorear el estado de un conjunto de nodos
     * @params cliente_sio Object --- Instancia del Socket-io del cliente conectado
     * @params config Object --- Objeto con parámetros a utilizar (salas)
     * @params nodos Array --- Arreglo de objetos(nodos) que son los nodos a ser monitoreados
     * @return void --- Dispara los eventos (nodoDesconectado y nodoConectado) a todos los clientes donde estén estos nodos
     */
    this.monitorearConexionNodos = function(cliente_sio, nodos){
        var me = this;
        async.each(nodos, function(nodo, cb){
            var data = {};
            data.nodo = {
                idnodo: nodo.idnodo,
                alias : nodo.alias,
                estado: nodo.estado
            };
            var salasNodos = utiles.obtenerSalaPorArreglo('nodos', [nodo.idnodo], salas);
            me.comprobarConexionNodo(nodo, function(){
                salasNodos.forEach(function(sala){
                    cliente_sio.in(sala).emit('nodoConectado', JSON.stringify(data));
                });
            }, function(err){
                data.error = err;
                salasNodos.forEach(function(sala){
                    cliente_sio.in(sala).emit('nodoDesconectado', JSON.stringify(data));
                });
            });
        }, function(err){
            console.log('error async'+ err);
        });
    };
   /*
    *  Comprobar conexion de un nodo
    *  @params {Object} datos --- Datos del nodo
    *  @params {Function} cbConectado --- Callback a ejecutar cuando el nodo está conectado
    *  @params {Function} cbDesconectado --- Callback a ejecutar cuando el nodo está desconectado
    *  @return void
    */
    this.comprobarConexionNodo = function(datosNodo, cbConectado, cbDesconectado){
        var conString = utiles.stringConexion(datosNodo);
        var clientPg = new pg.Client(conString);
        clientPg.connect(function(err) {
            if (err) {
                cbDesconectado(err);
            }else{
                clientPg.end();
                cbConectado();
            }
        });
    };

    /*
     *  Comprobar conexion de un nodo y obtener el cliente de la misma
     *  @params Object datos --- Datos del nodo
     *  @params function cbConectado --- Callback a ejecutar cuando el nodo está conectado
     *  @params function cbDesconectado --- Callback a ejecutar cuando el nodo está desconectado
     *  @return void
     */
    this.comprobarConexionNodoGetClient = function(datos, cbConectado, cbDesconectado){
        var conString = utiles.stringConexion(datos);
        var clientPg = new pg.Client(conString);
        clientPg.connect(function(err) {
            if (err) {
                cbDesconectado(err);
            }
            else{
                cbConectado(clientPg);
            }
        });
    };
    /*
     * Comprobar la conexion de un conjunto de nodos y obtener los desconectados
     * @params cliente_sio Object --- Instancia del Socket-io del cliente conectado
     * @params nodos Array --- Arreglo de objetos(nodos) que son los nodos a ser comprobados
     * @return void --- Dispara el evento (nodosDesconectadosImportados) al cliente enviando un objeto {conectado : true/false} y otros datos utilizados
     */
    this.obtenerNodosDesconectados = function(nodos, cb){
        var me = this;
        var nodosConectados = [];
        var nodosDesconectados = [];
       async.each(nodos, function(nodo, callback){
             me.comprobarConexionNodo(nodo,function(){
                nodosConectados.push(nodo);
                callback();
            },function(){
                nodosDesconectados.push(nodo);
                callback();
            });
        }, function(err){
            if(err){
                console.log('error async de comprobacion de conexion de nodos '+ err);
            }else{
                cb(nodosDesconectados, nodosConectados);
            }
        });
    };

    /*
     *  Conectar nodo y ejecutar una consulta
     *  @params Object datos --- Datos del nodo
     *  @params String query --- Consulta SQL
     *  @params Array params --- Arreglo de parametros cuando la consulta es parametrizada
     *  @params function cb --- Callback a ejecutar cuando se ejecute la consulta
     *  @params function cbError --- Callback a ejecutar cuando ocurra un error el ejecutar la consulta
     *  @return void
     */
    this.consultaNodo = function(datosNodo, query, params, cb, cbError){
        var conString = utiles.stringConexion(datosNodo);
        var clientPg = new pg.Client(conString);
        clientPg.connect(function(err) {
            if (err) {
                console.log('Error en la conexion');
                if (typeof cbError === 'function') {
                    cbError(err);
                }
            }else{
                clientPg.query (query, params, function(err, result) {
                    if(err) {
                        if (typeof cbError === 'function') {
                            cbError(err);
                        }
                    }else{
                        if (typeof cb === 'function') {
                            cb(result.rows);
                        }
                        clientPg.end();
                    }
                });
            }
        });

    }


    return this;
})();