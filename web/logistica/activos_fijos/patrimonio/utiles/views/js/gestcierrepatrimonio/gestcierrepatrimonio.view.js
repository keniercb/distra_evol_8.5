Ext.ns('log.lb.gestcierrepatrimonio');

log.lb.gestcierrepatrimonio.View = Ext.extend(Log.lb.cierre.View, {
    usuarios: undefined,
    documentos: undefined,
    constructor: function(config) {

        this.dirController = '/logistica/activos_fijos/patrimonio/utiles/index.php/gestcierrepatrimonio';
        this.urlBusquedaGridPrincipal = 'cargarDocumentosPendiente';
        this.modoSeleccion = 1;
        this.autoShow = false;
        this.busquedaBasica = true;
        this.idayuda = '';
        this.busquedaAvanzada = true;

        log.lb.gestcierrepatrimonio.View.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function() {
        log.lb.gestcierrepatrimonio.View.superclass.initDefaultColumns.call(this);
        var _this = this;

        this.insertGridColumn({
            header: 'Medios',
            width: 90,
            dataIndex: 'cant_medios',
            default: true
        }, 3);

        this.insertGridColumn({
            dataIndex: 'fechacontable',
            header: 'Fecha',
            agrupador:true
        }, 0);
    },
    initDefaultButtons: function() {        
        log.lb.gestcierrepatrimonio.View.superclass.initDefaultButtons.call(this);
        var _this = this;
         Ext.apply(this.listaBotones.getItem(3), {
            hidden :true,           
            
        });
        Ext.apply(this.listaBotones.getItem(0), {
            handler: function () {
                _this.modelo.cierreDiario(function (d) {

                   if(d.finPeriodo)
                        _this.listaBotones.getItem(0).disable();
                    else
                       _this.listaBotones.getItem(0).enable();

                    if(d.finEjercicio) {
                        _this.listaBotones.getItem(0).disable();
                        _this.listaBotones.getItem(1).disable();
                    } else {
                        _this.listaBotones.getItem(0).enable();
                        _this.listaBotones.getItem(1).enable();
                    }
                    _this.modelo.cargaDatosFecha({
                        url: _this.dirController + '/cargaDatosFecha'
                    }, function (a, res, s) {
                        _this.lblImporteTotal.setText(_this.idioma.lblPerido + res.periodo.nombre + ', ' + _this.idioma.lblDesde + res.periodo.inicio + _this.idioma.lblHasta + res.periodo.fin + '. ' + _this.idioma.lblFechaContable + res.fechaContable);
                    });
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('btnCierreDiario') && incremento != 1) {
                    b.setVisible(true);
                    if(!finPeriodo || !finEjercicio)
                        b.enable();
                    else b.disable();
                } else {
                    b.setVisible(false);
                }

            }

        });
        Ext.apply(this.listaBotones.getItem(1), {
            handler: function() {
                mostrarMensaje(2, _this.idioma.msjExisten + ' ' + _this.getStorePrincipal().data.items.length + ' ' + _this.idioma.msjDocPendientes+' ' + _this.idioma.msjConfirmarDocPenP,
                    function(btn) {
                        if (btn == 'ok') {
                            Ext.getBody().mask(_this.idioma.msjLoadMask);
                            Ext.Ajax.request({
                                url: 'cierrePeriodo',
                                method: 'POST',
                                callback: function (opt, scs, resp) {
                                    Ext.getBody().unmask();
                                    var data = Ext.decode(resp.responseText);
                                    if (data.codigoMsg == 1) {
                                        if(data.finEjercicio) {
                                            _this.listaBotones.getItem(0).disable();
                                            _this.listaBotones.getItem(1).disable();
                                        } else {
                                            _this.listaBotones.getItem(0).enable();
                                            _this.listaBotones.getItem(1).enable();
                                        }
                                        _this.modelo.cargaDatosFecha({
                                            url: _this.dirController + '/cargaDatosFecha'
                                        }, function (a, res, s) {
                                            _this.lblImporteTotal.setText(_this.idioma.lblPerido + res.periodo.nombre + ', ' + _this.idioma.lblDesde + res.periodo.inicio + _this.idioma.lblHasta + res.periodo.fin + '. ' + _this.idioma.lblFechaContable + res.fechaContable);
                                        });
                                        mostrarMensaje(1, _this.idioma.msjOkCierreP(data.periodo));
                                    } else if (data.codigoMsg == 2) {
                                        mostrarMensaje(3, 'Debe realizar el cierre de ejercicio.');
                                    } else {
                                        mostrarMensaje(3, _this.idioma.msjNoCiereP);
                                    }
                                }
                            });
                        }
                    })
            },
            controlFn: function (b, _caller) {

                if (_caller.grantedAction('btnCierrePeriodo')) {
                    b.setVisible(true);
                    if(!finEjercicio)
                        b.enable();
                    else b.disable();
                } else {
                    b.setVisible(false);
                }

            }

        });        
        Ext.apply(this.listaBotones.getItem(2), {
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('btnCierreEjercicio')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }
            }

        });
       
        
    },
    render: function (config) {
        var _this = this;
        var vista = log.lb.gestcierrepatrimonio.View.superclass.render.call(this);


        _this.gridFilter.btnFiltar.handler = function () {

            if (_this.gridFilter.btnFiltar.disabled) {
                return;
            }

            if (_this.gridFilter.tfBusqueda.isValid()) {
                var params = {};
                Ext.apply(params, _this.gridFilter.store.limitParams);
                _this.gridFilter.store.filtrado = true;
                _this.gridFilter.store.baseParams.criterio = _this.gridFilter.tfBusqueda.getValue();
                _this.gridFilter.store.reload({
                    params: params,
                    callback:function () {
                       if(_this.gridFilter.store.getCount() == 0)
                           mostrarMensaje(1, "No existen datos con el criterio de b\xfasqueda especificado.");
                    }
                });
            }
        };

        return vista;
    }
});