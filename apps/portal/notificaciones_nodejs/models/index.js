/**
 * Created by FILIO
 */
var fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    lodash = require('lodash'),
    comun = require('../common'),
    db = {}

//var config    = require('config').database;  // we use node-config to handle environments
//var database =  'zeolides-dev.xetid.cu';
var database = Config.databaseDB;
var username = Config.usernameDB;
var host = Config.hostDB;
var port = Config.portDB;
var password = Config.passwordDB;
var sequelize = new Sequelize(database, username, password, {
    dialect: 'postgres',
    host: host,
    port: port,
    language: 'es',
    //sync: { force: true },
    omitNull: true,
    maxConcurrentQueries: 0/*,
     logging: function(log){
     console.log(" ")
     console.log("---------------->>>>> NO SE QUE SHIT IMPRIME ESTA SHIT")
     console.log(log)
     console.log(" ")
     }*/,
    pool: { maxConnections: 10, maxIdleTime: 30},
    define: {
        syncOnAssociation: true,
        timestamps: false,
        noExists: true,
        classMethods: {

            /**
             * Crea e inserta varios de elementos
             *
             * @param {Array} objetos --- Lista de objetos que seran creados y guadrados
             * @param {Object} transaccion --- Objeto para el control de las transacciones
             * @param {Function} fnRes --- Funcion donde se almacena la respuesta de la accion
             * @param {Function} fnErr --- Funcion donde se almacena el error en caso de ocurrir
             */
            insertarVariosElementos: function (objetos, transaccion, fnRes, fnErr) {
                this.bulkCreate(this.obtenerObjetos(objetos), {transaction: transaccion, hooks: true})
                    .success(fnRes)
                    .error(fnErr)
            },

            /**
             * Trata de actualizar los datos de un objeto si no puede trata de insertarlo
             *
             * @param {Object} objeto --- Lista de objetos que seran creados y guadrados
             * @param {Object} transaccion --- Objeto para el control de las transacciones
             * @param {Function} fnRes --- Funcion donde se almacena la respuesta de la accion
             * @param {Function} fnErr --- Funcion donde se almacena el error en caso de ocurrir
             */
            insertarActualizarElemento: function (objeto, transaccion, fnRes, fnErr) {
                var _me = this,
                    _obj = _me.obtenerObjeto(objeto),
                    _sql = _me.obtenerConsultaInsertarActualizar(_obj);
                _me.consulta(_sql, transaccion, fnRes, fnErr);
            },

            insertarActualizarVariosElementos: function (objetos, transaccion, fnRes, fnErr) {
                var _me = this,
                    _sqls = [];
                objetos.forEach(function (objeto) {
                    _sqls.push(_me.obtenerConsultaInsertarActualizar(objeto));
                });

                _me.consultasMultiples(_sqls, transaccion, fnRes, fnErr);
            },

            consulta: function (sql, transaccion, fnRes, fnErr) {
                comun.Objeto.esVacio(transaccion) || !transaccion ? sequelize.query(sql).success(fnRes).error(fnErr) :
                    sequelize.query(sql, {}, {transaction: transaccion}).success(fnRes).error(fnErr)
            },
            /*
             * Ejecutar una consulta SQL
             * @params consulta String -- Consulta SQL a ser ejecutada
             * @params params Array -- Arreglo de parametros para las consultas parametrizadas
             * @params fSuccess Function -- Funcion a ser ejecutada cuando se obtengan los resultados de las consulta
             * @params fError Function -- Funcion a ser ejecutada cuando ocurre un error al ejecutar la consulta
             */
            consultaSelect: function (consulta, params, fSuccess, fError) {
                sequelize.query(consulta, null, {raw: true}, params)
                    .success(function (rows) {
                        if (typeof fSuccess === 'function') {
                            fSuccess(rows);
                        }
                    })
                    .error(function (err) {
                        if (err.code == 'ETIMEDOUT') {
                            dbActiva = false;
                        }
                        if (typeof fError === 'function') {
                            fError(err);
                        }
                    });
            },

            consultasMultiples: function (sqls, transaccion, fnRes, fnErr) {
                var _me = this,
                    _qc = new comun.Sequelize.Utils.QueryChainer;

                sqls.forEach(function (sql) {
                    _qc.add(comun.Objeto.esVacio(transaccion) || !transaccion ? sequelize.query(sql) :
                        sequelize.query(sql, {}, {transaction: transaccion}))
                });

                _qc.runSerially()
                    .success(fnRes)
                    .error(fnErr)
            },

            obtenerConsultaInsertarActualizar: function (objeto) {
                var _me = this,
                    tablaEsquema = _me.options.schema + '.' + _me.options.tableName,
                    atributos = [],
                    valores = [],
                    atributosValores = [],
                    atributosValoresWhere = [],
                    setValores,
                    whereValores;

                for (var i in objeto) {
                    atributos.push(i);
                    valores.push("'" + objeto[i] + "'");
                    atributosValoresWhere.push(tablaEsquema + "." + i + "='" + objeto[i] + "'");
                    atributosValores.push(i + "='" + objeto[i] + "'");
                }

                setValores = atributosValores.join(',');
                whereValores = atributosValoresWhere.join(' AND ');
                atributos = atributos.join(',');
                valores = valores.join(',');

                return "WITH elemento AS " +
                    "(UPDATE " + tablaEsquema + " SET " + setValores + " " +
                    "WHERE EXISTS (SELECT * FROM " + tablaEsquema + " WHERE " + whereValores + ") " +
                    "AND (" + whereValores + ") RETURNING *) " +
                    "INSERT INTO " + tablaEsquema + " (" + atributos + ") SELECT " + valores + " WHERE not EXISTS (SELECT * FROM elemento);"
            },

            /**
             * Elimina varios de elementos
             *
             * @param {Array} objetos --- Lista de elementos que seran eliminados si no se pasa ningun objeto se eliminan todos
             * @param {Object} transaccion --- Objeto para el control de las transacciones
             * @param {Function} fnRes --- Funcion donde se almacena la respuesta de la accion
             * @param {Function} fnErr --- Funcion donde se almacena el error en caso de ocurrir
             */
            eliminarVariosElementos: function (objetos, transaccion, fnRes, fnErr) {
                var _me = this,
                    _qc = new comun.Sequelize.Utils.QueryChainer;

                objetos.forEach(function (e) {
                    _qc.add(_me.destroy(e, {transaction: transaccion, hooks: true, schema: _me.options.schema}))
                });

                _qc.run()
                    .success(fnRes)
                    .error(fnErr)
            },

            /**
             * Elimina un elemento segun condicion
             *
             * @param {Object} condicion --- Objeto con las llaves o condiciones del elemento a eliminar
             * @param {Object} transaccion --- Objeto para el control de las transacciones
             * @param {Function} fnRes --- Funcion donde se almacena la respuesta de la accion
             * @param {Function} fnErr --- Funcion donde se almacena el error en caso de ocurrir
             */
            eliminarElemento: function (condicion, transaccion, fnRes, fnErr) {
                var _me = this;

                _me.destroy(condicion, {transaction: transaccion, hooks: true, schema: _me.options.schema})
                    .success(fnRes)
                    .error(fnErr)
            },

            /**
             * Modifica varios elementos
             *
             * @param {Array} objetos --- Lista de objetos que seran modificados, presenta la estructura:
             *                            {
             *                              datos:{
             *                                  atributo1: valor1
             *                                  atributo2: valor2
             *                              },
             *                              where: {Array}/{Object} condiciones
             *                            }
             * @param {Object} transaccion --- Objeto para el control de las transacciones
             * @param {Function} fnRes --- Funcion donde se almacena la respuesta de la accion
             * @param {Function} fnErr --- Funcion donde se almacena el error en caso de ocurrir
             */
            modificarVariosElementos: function (objetos, transaccion, fnRes, fnErr) {
                var _me = this,
                    _qc = new comun.Sequelize.Utils.QueryChainer;

                objetos.forEach(function (e) {
                    _qc.add(_me.update(e.datos, e.condicion, {transaction: transaccion, schema: _me.options.schema}))
                });

                _qc.run()
                    .success(fnRes)
                    .error(fnErr)
            },

            /**
             * Modifica un elemento elemento
             *
             * @param {Object} objeto --- Objeto con los datos del elemento a modificar, presenta la estructura:
             *                            {
             *                              datos:{
             *                                  atributo1: valor1
             *                                  atributo2: valor2
             *                              },
             *                              where: {Array}/{Object} condiciones
             *                            }
             * @param {Object} transaccion --- Objeto para el control de las transacciones
             * @param {Function} fnRes --- Funcion donde se almacena la respuesta de la accion
             * @param {Function} fnErr --- Funcion donde se almacena el error en caso de ocurrir
             */
            modificarElemento: function (objeto, transaccion, fnRes, fnErr) {
                var _me = this;
                _me.update(objeto.datos, objeto.condicion, {transaction: transaccion, schema: _me.options.schema}, _me)
                    .success(fnRes)
                    .error(fnErr)
            },
            /*
             * Buscar elemento por una condicion(opcional)
             */
            buscar: function (where, cb, cbError) {
                this.findAll({where: where || {}}, { raw: true }).success(function (rows) {
                    if (typeof cb === 'function') {
                        cb(rows);
                    }
                }).error(function (err) {
                        if (err.code == 'ETIMEDOUT') {
                            dbActiva = false;
                        }
                        if (typeof cbError === 'function') {
                            cbError(err);
                        }
                    });
            },
            buscarTodos : function(cb, cbError){
                  this.buscar(null, cb, cbError);
            },
            /**
             * Busca un elemento con que cumpla con las condiciones especificadas
             *
             * @param {Object/Array} condicion --- Objeto o arreglo de condiciones
             * @param {Array} atributos --- Lista de atributos a devolver de cada elemento
             * @param {Array} modelos --- Lista de modelos a incluir
             * @param {Object} atributosModelos --- Objeto de atributos de cada modelo incluido con la estructura:
             *                 {
             *                      nombreTabla1:["llave_principal(obligatorio)","atributo1","atributo2","atributo..."],
             *                      nombreTabla2:["llave_principal(obligatorio)","atributo2","atributo..."]
             *                 }
             * @param {Function} fnRes --- Funcion donde se almacena la respuesta de la accion
             * @param {Function} fnErr --- Funcion donde se almacena el error en caso de ocurrir
             */
            buscarElemento: function (condicion, atributos, modelos, atributosModelos, fnRes, fnErr) {
                this.find({
                        where: condicion,
                        attributes: atributos,
                        include: modelos,
                        includeAttributes: atributosModelos
                    },
                    {raw: true})
                    .success(fnRes)
                    .error(fnErr);
            },
            /*
             * Busca el primer elememto que cumpla con las condiciones (where)
             * @params {Object} where --- Objeto de condiciones ejemplo {id : valor}
             * @param {Function} fnRes --- Funcion donde se almacena la respuesta de la accion
             * @param {Function} fnErr --- Funcion donde se almacena el error en caso de ocurrir
             */
            buscarPrimero: function (where, fnRes, fnErr) {
                this.buscarElemento(where, [], [], {}, fnRes, fnErr);
                //this.find({ where: where }).success(function (result) {
                //    if (typeof fnRes === 'function') {
                //        fnRes(result);
                //    }
                //}).error(function (err) {
                //        if (err.code == 'ETIMEDOUT') {
                //            dbActiva = false;
                //        }
                //        if (typeof fnErr === 'function') {
                //            fnErr(err);
                //        }
                //    });
            },

            /**
             * Busca varios elementos que cumplan con las condiciones especificadas
             *
             * @param {Object/Array} condicion --- Objeto o arreglo de condiciones
             * @param {Array} atributos --- Lista de atributos a devolver de cada elemento
             * @param {Array} modelos --- Lista de modelos a incluir
             * @param {Object} atributosModelos --- Objeto de atributos de cada modelo incluido con la estructura:
             *                 {
             *                      nombreTabla1:["llave_principal(obligatorio)","atributo1","atributo2","atributo..."],
             *                      nombreTabla2:["llave_principal(obligatorio)","atributo2","atributo..."]
             *                 }
             * @param {Function} fnRes --- Funcion donde se almacena la respuesta de la accion
             * @param {Function} fnErr --- Funcion donde se almacena el error en caso de ocurrir
             */
            buscarVariosElementos: function (condicion, atributos, modelos, atributosModelos, fnRes, fnErr) {
                this.findAll({
                        where: condicion,
                        attributes: atributos,
                        include: modelos,
                        includeAttributes: atributosModelos
                    },
                    {raw: true})
                    .success(fnRes)
                    .error(fnErr);
            },

            /**
             * Ejecutar consulta en una base datos externa a traves de un cliente
             *
             *  @param {String} sql --- Texto con la consulta a ejecutar
             *  @param {Object} cliente --- Objeto cliente de conexion al nodo origen
             *  @param {Object} transaccion --- Objeto para el control de las transacciones
             *  @param {Function} fnRes --- Funcion donde se almacena la respuesta de la accion
             *  @param {Function} fnErr --- Funcion donde se almacena, si existe, el error
             */
            consultaCliente: function (sql, cliente, transaccion, fnRes, fnErr) {
                comun.Objeto.esVacio(transaccion) || !transaccion ? cliente.sequelize.query(sql).success(fnRes).error(fnErr) :
                    cliente.sequelize.query(sql, {}, {transaction: transaccion}).success(fnRes).error(fnErr)
            },

            /**
             * Ejecuta varias consultas en una base datos externa a traves de un cliente
             *
             *  @param {Array} sqls --- Lista de consultas a ejecutar
             *  @param {Object} cliente --- Objeto cliente de conexion al nodo origen
             *  @param {Object} transaccion --- Objeto para el control de las transacciones
             *  @param {Function} fnRes --- Funcion donde se almacena la respuesta de la accion
             *  @param {Function} fnErr --- Funcion donde se almacena, si existe, el error
             */
            consultasMultiplesCliente: function (sqls, cliente, transaccion, fnRes, fnErr) {
                var _qc = new cliente.Sequelize.Utils.QueryChainer;

                sqls.forEach(function (sql) {
                    _qc.add(comun.Objeto.esVacio(transaccion) || !transaccion ? cliente.sequelize.query(sql) :
                        cliente.sequelize.query(sql, {}, {transaction: transaccion}))
                });

                _qc.run()
                    .success(fnRes)
                    .error(fnErr)
            },

            /**
             * Ejecuta varias consultas en una base datos externa a traves de un cliente
             *
             *  @param {Array} objetos --- Arreglo de objetos con los datos de la consulta a realizar con la estructura:
             *                             [
             *                                  {
             *                                      condicion: {Object} ?, //condiciones que debe cumplir
             *                                      atributos: {Array} ?, //arreglo de atributos del objeto a ser devueltos
             *                                      modelos: {Array} ?, //arreglo de modelos a incluir
             *                                      atributosModelos: {Object} ?  //Objeto de atributos de cada modelo incluido con la estructura:
             *                                                                  {
             *                                                                      nombreTabla1:["llave_principal(obligatorio)","atributo1","atributo2","atributo..."],
             *                                                                      nombreTabla2:["llave_principal(obligatorio)","atributo2","atributo..."]
             *                                                                  }
             *                                  }
             *                             ]
             *  @param {Function} fnRes --- Funcion donde se almacena la respuesta de la accion
             *  @param {Function} fnErr --- Funcion donde se almacena, si existe, el error
             */
            buscarMultiple: function (objetos, fnRes, fnErr) {
                var _me = this,
                    _qc = new comun.Sequelize.Utils.QueryChainer;

                objetos.forEach(function (o) {
                    _qc.add(_me.findAll({
                            where: o.condicion || {},
                            attributes: o.atributos || [],
                            include: o.modelos || [],
                            includeAttributes: o.atributosModelos || {}
                        },
                        {raw: true}))
                });

                _qc.run()
                    .success(fnRes)
                    .error(fnErr)
            },

            /**
             * Busca los elementos que cumplan con una condicion específica devolviendo la primera instancia que se encuentre de los mismos
             *
             *  @param {Array} objetos --- Arreglo de objetos con los datos de la consulta a realizar con la estructura:
             *                             [
             *                                  {
             *                                      condicion: {Object} ?, //condiciones que debe cumplir
             *                                      atributos: {Array} ?, //arreglo de atributos del objeto a ser devueltos
             *                                      modelos: {Array} ?, //arreglo de modelos a incluir
             *                                      atributosModelos: {Object} ?  //Objeto de atributos de cada modelo incluido con la estructura:
             *                                                                  {
             *                                                                      nombreTabla1:["llave_principal(obligatorio)","atributo1","atributo2","atributo..."],
             *                                                                      nombreTabla2:["llave_principal(obligatorio)","atributo2","atributo..."]
             *                                                                  }
             *                                  }
             *                             ]
             *  @param {Function} fnRes --- Funcion donde se almacena la respuesta de la accion
             *  @param {Function} fnErr --- Funcion donde se almacena, si existe, el error
             */
            buscarMultipleSimple: function (objetos, fnRes, fnErr) {
                var _me = this,
                    _qc = new comun.Sequelize.Utils.QueryChainer;

                objetos.forEach(function (o) {
                    _qc.add(_me.find({
                            where: o.condicion || {},
                            attributes: o.atributos || [],
                            include: o.modelos || [],
                            includeAttributes: o.atributosModelos || {}
                        },
                        {raw: true}))
                });

                _qc.run()
                    .success(fnRes)
                    .error(fnErr)
            },
            /*
             * Obtener un objeto con solo los campos reales
             * @params {Object} datos --- Objeto de datos
             * @return {Object} --- Objeto de datos con solo los atributos de la tabla
             */
            obtenerObjeto: function (datos) {
                var obj = {};
                for (prop in this.rawAttributes) {
                    if (this.rawAttributes.hasOwnProperty(prop)) {
                        if(datos[prop] != null){
                            obj[prop] = datos[prop];
                        }
                    }
                }
                return obj;
            },
            /*
             * Obtener un arreglo de objetos con solo los campos reales
             * @params {Array} datosNodos --- Arreglo de Objetos de datos
             * @return {Array} --- Arreglo de objeto de datos con solo los atributos de la tabla
             */
            obtenerObjetos: function (datosNodos, defaults) {
                var me = this;
                var objs = [];
                datosNodos.forEach(function (datosNodo) {
                    var obj = me.obtenerObjeto(datosNodo);
                    if (defaults) {
                        for (var prop in defaults) {
                            if (defaults.hasOwnProperty(prop)) {
                                obj[prop] = defaults[prop];
                            }
                        }
                    }
                    objs.push(obj);
                });
                return objs;
            }
        },
        instanceMethods: {
            eliminar: function () {
                this.destroy();
            }
        }
    }
});

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file))
        db[model.name] = model
    })

Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        var models = {}
        for (var name in db) {
            if (name != modelName) {
                models[name] = db[name]
            }
        }
        db[modelName].associate(models)
    }
})

module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db)