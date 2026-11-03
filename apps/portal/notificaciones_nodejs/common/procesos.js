/**
 * Creado por Danilo Milán Araujo
 */
var child_process = require('child_process');
var exec = child_process.exec;
var spawn = child_process.spawn;


module.exports = (function() {
    this.child = null;
    /*
     * Ejecutar un comando del sistema
     * @params comando String --- Comando a ser ejecutado
     * @params cb Function --- Callback a ser ejecutado si ejecuta satisfactoriamente el comando
     * @params cbError Function --- Callback a ser ejecutado si se produce algún error al ejecutar el comando
     * @return Object --- Objeto correspondiente al proceso ejecutado
     */
    this.ejecutarComando = function(comando, cb, cbError){
        this.child = exec(comando, function(err, stdout, stderr) {
            if (err) {cbError(err);return;}
            cb(stdout, stderr);
        });
        return this.child;
    };
    /*
     * Verifica si un proceso se está ejecutando
     * @params pid Integer --- Pid del proceso a verificar
     * @return bool --- True si se está ejecutando, False en caso contrario
     */
    this.verificarExistenciaProceso = function(pid){
        var r = false;
        try{
            r = process.kill(pid, 0);
        }catch (e){
            r = false;
        }
        return r;
    };
    /*
     * Ejecutar un comando del sistema
     * @params pid Integer --- Pid del proceso a matar
     * @params cb Function --- Callback a ser ejecutado si se mata el proceso satisfactoriamente
     * @params cbError Function --- Callback a ser ejecutado si se produce algún error al matar el proceso
     * @return Object --- Objeto correspondiente al proceso ejecutado
     */
    this.matarProceso = function(pid, cb, cbError){
        var me = this;
        var comando = 'kill '+ pid;
        this.ejecutarComando(comando, function(o, e){
            me.child = null;
            cb(o, e);
            console.log('Se ejecutó el comando satisfactoriamente');
        },function(err){
            cbError(err);
            console.log('Error al matar el proceso :'+err);
        });
    };
    this.terminar = function(){
      if(this.child){
          this.matarProceso(this.child.pid);
      }
    };
    this.prueba = function(){
        var me = this;
        var comando = 'gedit';
        //this.prueba1();
        this.prueba2();
        //var comando = '/etc/init.d/apache2 restart';

    };
    this.prueba2 = function(){

    };
    /*
     * Ejecutar un programa
     * @params comando String --- Comando del programa a ser ejecutado
     * @params cbExit Function --- Callback a ser ejecutado cuando se termina la ejecucion del programa ejecutado
     * @params cbData Function --- Callback a ser ejecutado cuando haya entrada y salida de datos del programa
     * @return Object --- Objeto correspondiente al proceso ejecutado
     */
    this.ejecutarPrograma = function(comando, cbExit, cbData){
        var me = this;
        this.child = spawn(comando);
        console.log(me.child.pid);
        this.child.stdout.on('data', function(data) {
            cbData(data);
        });
        this.child.on('exit', function(code) {
            cbExit(code);
           
        });
        return this.child;
    };
    /*
     * Activar el sincronizador de una configuracion
     * @params params Object --- Objeto con los datos de la configuracion
     * @return void
     */
    this.activarProcesoSincronizador = function(params){
        var aliasConfiguracion = params.configuracion.alias;
        var config = models.sequelize.config;
        var driver = 'QPSQL';
        var paramConexion = driver + "&-;" + config.host + "&-;" + config.port + "&-;" + config.username + "&-;" +
            config.password + "&-;" + config.database + "&-;" + aliasConfiguracion;
        var paramConexionBase64 = new Buffer(paramConexion).toString('base64');
        var comando = '';

        if (params.importada) {
            comando = "cd /opt/XDSincro/ && >XDS_FLD_" + aliasConfiguracion + ".log ./XDSincronizadorFLD " + paramConexionBase64 +
                "2>XDS_FLD_" + aliasConfiguracion + ".log & >/dev/null & pidof XDSincronizadorFLD";
        } else {
            if (params.fueraLinea) {
                comando = "cd /opt/XDSincro/ && >XDS_FLO_" + aliasConfiguracion + ".log ./XDSincronizadorFLO " + paramConexionBase64 +
                    "2>XDS_FLO_" + aliasConfiguracion + ".log & >/dev/null & pidof XDSincronizadorFLO";
            } else {
                comando = "cd /opt/XDSincro/ && >XDS_" + aliasConfiguracion + ".log ./XDSincronizador " + paramConexionBase64 +
                    "2>XDS_" + aliasConfiguracion + ".log & >/dev/null & pidof XDSincronizador";
            }
        }
        if(comando == ''){
            return;
        }
        //console.log(comando);return;
        var child = this.ejecutarComando(comando, function(salida, salerr){
            console.log('--------ejecuto salisfa-----------');
            console.log(salida);
            console.log(salerr);
            console.log(child.pid);
            console.log('--------fin ejecuto-----------');
        }, function(err){
            console.log('----Error-----');
            console.log(err);
            console.log('----Error-----');
        });
    };
    /*
     * Detener el sincronizador de una configuracion
     * @params params Object --- Objeto con los datos de la configuracion
     * @return void
     */
    this.detenerProcesoSincronizador = function(params){
        this.matarProceso(params.sincronizacion.pid, function(o, e){
            console.log('proceso terminado');
        }, function(err){
            console.log('---error al terminar el proceso ---');
            console.log(err);
        });
    };

    return this;
})();