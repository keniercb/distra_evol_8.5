

Log.aft.submayor_v2.model = function(){
    
    var model = {
        state: undefined,
        _preLoad: function(){
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
            var viewConfigPromesa = AFT.util.ViewConfigCacheModel.cargarConfiguracion(perfil.idusuario)
            
            this.state = Promise.all([grupoPromesa, naturalezaPromesa, estadosPromesa, viewConfigPromesa])
                .then(function(datos){
                    var grupos = datos[0];
                    var naturalezas = datos[1];
                    var estados = datos[2];
                    var configView = datos[3]
                    return {
                        grupos, naturalezas, estados, configView
                    };
                });
        },
        getGruposExplotacion: function(){
            return new Promise(function(fulfill, reject){
                var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando datos iniciales..."});
                myMask.show();
                Ext.Ajax.request({
                    url: 'cargarGrupoExplotacion',
                    method: 'POST',
                    callback: function(opt, scs, resp) {
                        myMask.hide();
                        var rd = Ext.decode(resp.responseText);
                        fulfill(rd.datos)
                    },
                    failure(){
                        fulfill([]);
                    }
                }); 
            })
        }
    }
    model._preLoad();
    return model;

}

