Ext.ns('Ext.aft');
Ext.aft.regNumerico.controller = {
    urlControladora: '/logistica/activos_fijos/utiles/index.php/gestregnumerico/',
    idioma: false,
    init: function (config) {
        Ext.apply(this, config);
        var parametros = config.datos;
		var actionPostClose = config.actionPostClose;

        parametros.urlControladora = this.urlControladora;

        var _this = this;
        Ext.Ajax.request({
            url: _this.urlControladora + 'cargaretiquetas',
            method: 'POST',
            callback: function (options, succes, response) {

                _this.idioma = Ext.decode(response.responseText);

                //  Cargar otros datos generales como los columnas que se van a mostrar.
                Ext.Ajax.request({
                    url: _this.urlControladora + 'cargardatosgenerales',
                    method: 'POST',
                    params: {
                        idtipomedio: (parametros.idnaturaleza) ? parametros.idnaturaleza : - 1,
                        idoperacion: (parametros.idoperacion) ? parametros.idoperacion : - 1,
                        idgruposubgrupo: (parametros.idgruposubgrupo) ? parametros.idgruposubgrupo : - 1,
                        idestructura: (parametros.idarearesp) ? parametros.idarearesp : - 1,
                        idestructurapadre: parametros.idestructurapadre                        
                    },
                    callback: function (opt, succ, resp) {
                        var data = Ext.decode(resp.responseText);
                        if (data.columnas.length > 0) {
                            Ext.apply(parametros, data);
                            parametros.tipoubicacion = 'activos';

                            var titulo = _this.idioma.lbTitleCmpRegNumerico.replace('_codigo', parametros.codprod);
                            titulo = titulo.replace('_descripcion', parametros.denominacion);

                            _this.crearCmp({
                                params: parametros,
                                _parent:_this._parent,
                                title: titulo,
                                actionPostClose: actionPostClose
                            });
                        } else {
                            mostrarMensaje(3, _this.idioma.lbNoExistenColumnasAMostrar);
                            Ext.getBody().unmask();
                        }
                    }
                });
            }
        });
    },
    crearCmp: function (obj_params) {

        var _this = this;
        var cmpRegNumerico = new Ext.aft.regNumerico.Ventana({
            idioma: _this.idioma,
            params: obj_params.params,
            title: obj_params.title,
            _parent: obj_params._parent,
            iddocinventario:(_this.datos.iddocinventario)? _this.datos.iddocinventario: null,
            listeners: {
                'close': function(){
                    obj_params.actionPostClose();
                }
            }
        });
        cmpRegNumerico.fireEvent = cmpRegNumerico.fireEvent.createSequence(function(e){
                    if(e == 'beforeshow'){
                        Ext.MessageBox.hide();
                    }
        });
        cmpRegNumerico.show();
    }
};