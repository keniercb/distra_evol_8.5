/**
 * Created by ariam on 13/06/14.
 */

var utiles = require('./utiles'),
    lodash = require('lodash'),
    pg = require('pg'),
    async = require('async'),
    LineReader = require('line-reader'),
    AdmZip = require('adm-zip'),
    formidable = require('formidable'),
    Sequelize = require('sequelize'),
    //Conector = require('./conector-rep'),
    //ConexionNodos = require('./conexionNodos'),
    Ficheros = require('./ficheros'),
    Procesos = require('./procesos'),
    Objeto = require('./objects'),
    Crypto = require('./crypto');

pg.defaults.poolSize = 0;

module.exports = lodash.extend({
    utiles: utiles,
    pg: pg,
    Sequelize: Sequelize,
    LineReader: LineReader,
    AdmZip: AdmZip,
    async: async,
    formidable: formidable,
    //Conector: Conector,
    //ConexionNodos: ConexionNodos,
    Ficheros: Ficheros,
    Procesos: Procesos,
    Objeto: Objeto,
    Crypto:Crypto
}, {});
