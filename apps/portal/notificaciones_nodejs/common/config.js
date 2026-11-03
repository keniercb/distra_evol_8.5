/**
 * Creado por Danilo Milan Araujo
 */

module.exports = (function(){
        var config = {};
        //---------Host local donde se encuentra el nodejs instalado---------
        config.host = '10.12.35.198';
        //---------Datos conexion base de datos embebida----
        //config.hostDB = '10.12.170.153';
        config.hostDB = '10.12.35.199';
        //config.hostDB = 'localhost';
        config.databaseDB = 'zeolides1';
        //config.databaseDB = 'zeolides-dev.xetid.cu';
        config.usernameDB = 'zeolides';
        config.portDB = 5432;
        config.passwordDB = 'zeolides*2012.,';
        //--------Datos conexion socket-oi-------
        config.port_socketIO = 9877;
        //--------Protocolo (1-http, 0-https)-------
        config.protocol = 1;
        //--------Puerto http (solo is config.protocol es 1)-------
        config.port_http = 5900;
        //--------Direccion de los pares de llaves para estableces conexion segura (solo is config.protocol es 0)
        config.key = '/var/www/html/Zeolides/mio/zeolides-2.3/config/certs/auth/development_privatekey.pem';
        config.cert = '/var/www/html/Zeolides/mio/zeolides-2.3/config/certs/auth/development_publickey.cer';
        return config;
})();
