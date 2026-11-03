/**
 * Created by ariam on 15/06/14.
 */

var Sequelize = require('sequelize');

module.exports = (function () {
    var Conector = function (objetoConexion) {
        this.Sequelize = Sequelize;
        this.sequelize = new Sequelize(objetoConexion.basedatos, objetoConexion.usuario, objetoConexion.contrasenna, {
            dialect: 'postgres',
            host: objetoConexion.servidor,
            port: objetoConexion.puerto,
            language: 'es'
        })
    };

    Conector.prototype.errorExtract = function(err, result){
        var _self = this,
            error = "";
        /*console.log(err);
        console.log("Error: error: password authentication failed for user \"" + _self.sequelize.config.username + "\"");
        console.log(err==="Error: error: password authentication failed for user \"" + _self.sequelize.config.username + "\"");
*/
        if(err==="Error: Error: Failed to find PostgresSQL server. Please double check your settings."){
            error = "No se pudo encontrar el servidor PostgresSQL. Por favor revise los parámetros de conexión.";
        }
        else if(err==="Error: error: password authentication failed for user \"" + _self.sequelize.config.username + "\""){
            error = "Autenticación de contraseña falló para el usuario '" + _self.sequelize.config.username + "'.";
        }
        else if(err==="Error: error: role \"" + _self.sequelize.config.username + "\" is not permitted to log in"){
            error = "Al usuario '" + _self.sequelize.config.username + "' no se le permite conectarse.";
        }
        else if(err==="Error: error: permission denied for relation pg_authid"){
            error = "El usuario '" + _self.sequelize.config.username + "' no presenta los privilegios necesarios para realizar esta operación.";
        }
        else if(err==="Error: Error: Failed to authenticate for PostgresSQL. Please double check your settings."){
            error = "No se ha podido autenticar para PostgreSQL. Por favor revise los parámetros de conexión.";
        }
        else if(err==="Error: error: database " + _self.sequelize.config.database + " does not exist"){
            error = "La base de datos " + _self.sequelize.config.database + " no existe.";
        }
        else {
            error = err;
        }
        result(error);
     };

    Conector.prototype.testConnection = function (asRoot, success, error) {
        var _self = this;
        if(asRoot) {
            this.sequelize
                .validateCatalogAcces()
                .complete(function (err, res) {
                    if (!!err) {
                        console.log("\n\n!!!ERRROR");
                        _self.errorExtract(err.toString(),error);
                        console.log("\n\n");
                         /*console.log(err);

                        //error(err)*/
                    }
                    else {
                        if (!res) {
                            error("El usuario '" + _self.sequelize.config.username + "' no presenta los privilegios necesarios para realizar esta operación.")
                        } else {
                            console.log("\n\n!!!RESPUESTA");
                            console.log(res);
                            console.log("\n\n");
                            success("Conexión establecida con éxito.", res);
                        }

                    }
                });
        }
        else {
            this.sequelize
                .authenticate()
                .complete(function (err) {
                    if (!!err) {
                        error(err)
                    }
                    else {
                        success("Conexión establecida con éxito.");
                    }
                })
        }
    };

    return Conector
})();