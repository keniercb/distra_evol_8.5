Ext.ns('Log.aft.submayor');
UCID.portal.cargarAcciones(window.parent.parent.parent.idFuncionalidad, function() {
    Log.aft.submayor.acciones = acciones_reportes;
    var idioma = LOG.util.UIManager.apply(Log.aft.submayor.Idioma, LOG.util.Idioma);
    idioma.lbEntidad = 'Entidad';

    var startView = function(grupos, naturalezas, estados, viewConfig, actividades){
        var VentanaInicial= new Log.aft.submayor.View({
            idioma: idioma,
            acciones : acciones_reportes,
            grupos: grupos,
            naturalezas: naturalezas,
            estados: estados,
            viewConfig: viewConfig,
            actividad : actividades
        });
        VentanaInicial.init();
        VentanaInicial.view();
    }

    var grupoPromesa = new Promise(function(fulfill, reject){
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getgrupossubgrupos',
            method: 'POST',
            callback: function (options, success, response) {
                Ext.Msg.hide();
                var response = LOG.util.UIManager.decodeAjaxResponse(response);
                var grupos = [];
                for (var i = 0; i < response.datos.length; i++) {
                    grupos[i] = [response.datos[i].idgruposubgrupo, response.datos[i].denominacion];
                }
                fulfill(grupos);
            },
            failure(){
                fulfill([]);
            }
        });
    });
    var naturalezaPromesa = new Promise(function(fulfill, reject){
        Ext.Ajax.request({
            url: '/configuracion/nomgenerales/index.php/nomencladoresgenerales/cargarnomencladorentidad?modelo=NomNaturaleza&idnom=idnaturaleza',
            method: 'POST',
            callback: function (options, success, response) {
                Ext.Msg.hide();
                var response = LOG.util.UIManager.decodeAjaxResponse(response);
                var naturalezas = [];
                for (var i = 0; i < response.datos.length; i++) {
                    naturalezas[i] = [response.datos[i].idnaturaleza, response.datos[i].denominacion];
                }
                fulfill(naturalezas);
            },
            failure(){
                fulfill([]);
            }
        });
    });
    var estadosPromesa = new Promise(function(fulfill, reject){
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getEstadosOperacion',
            method: 'POST',
            callback: function (options, success, response) {
                Ext.Msg.hide();
                var response = LOG.util.UIManager.decodeAjaxResponse(response);
                var estadosoperacion = [];
                for (var i = 0; i < response.datos.length; i++) {
                    estadosoperacion[i] = [i, response.datos[i]];
                }
                fulfill(estadosoperacion);
            },
            failure(){
                fulfill([]);
            }
        });
    })
    var actividades = new Promise(function(fulfill, reject){
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/cargarGrupoExplotacion',
            method: 'POST',
            callback: function (options, success, response) {
                Ext.Msg.hide();
                var response = LOG.util.UIManager.decodeAjaxResponse(response);
                var arractividades = response.datos;
                fulfill(arractividades);
            },
            failure(){
                fulfill([]);
            }
        });
    })
    var viewConfigPromesa = AFT.util.ViewConfigCacheModel.cargarConfiguracion(perfil.idusuario)

    Promise.all([grupoPromesa, naturalezaPromesa, estadosPromesa, viewConfigPromesa, actividades])
        .then(function(datos){
            var grupos = datos[0];
            var naturalezas = datos[1];
            var estados = datos[2];
            var configView = datos[3];
            var actividades = datos[4];
            startView(grupos, naturalezas, estados, configView, actividades);
        })
    
});




