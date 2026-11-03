Ext.ns('log.lb.cierreaft');

log.lb.cierreaft.View = Ext.extend(Log.lb.cierre.View, {
    usuarios: undefined,
    documentos: undefined,
    constructor: function(config) {

        this.dirController = '/logistica/activos_fijos/utiles/index.php/gestcierreaft';
        this.urlBusquedaGridPrincipal = 'cargarDocumentosPendiente';
        this.modoSeleccion = 1;
        this.autoShow = false;
        this.busquedaBasica = true;
        this.idayuda = 'idcierreaft';
        this.busquedaAvanzada = true;

        log.lb.cierreaft.View.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function() {
        log.lb.cierreaft.View.superclass.initDefaultColumns.call(this);
        var _this = this;

        this.insertGridColumn({
            header: 'Medios',
            width: 90,
            dataIndex: 'cant_medios',
            default: true
        }, 3);
    },
    initDefaultButtons: function() {
        log.lb.cierreaft.View.superclass.initDefaultButtons.call(this);
        var _this = this;
        Ext.apply(this.listaBotones.getItem(1), {
            handler: function() {
                //if (_this.getStorePrincipal().data.items.length > 0) {
                    mostrarMensaje(2, _this.idioma.msjExisten + ' ' + _this.getStorePrincipal().data.items.length + ' ' + _this.idioma.msjDocPendientes+' ' + _this.idioma.msjConfirmarDocPenP,
                        function(btn) {
                            if (btn == 'ok') {
                                Ext.getBody().mask(_this.idioma.msjLoadMask);
                                Ext.Ajax.request({
                                    url: _this.dirController + '/getRegNumQueDeprecian',
                                    method: 'POST',
                                    callback: function(opt, scs, resp) {
                                        Ext.getBody().unmask();
                                        var data = Ext.decode(resp.responseText);

                                        if (data.datos == "1" ) {
                                            mostrarMensaje(2, 'Existen medios que no han depreciado en el per&iacute;odo.')
                                        } else if(data.codMsg == 4){

                                        }else {
                                            Ext.getBody().mask(_this.idioma.msjLoadMask);
                                            Ext.Ajax.request({
                                                url: 'cierrePeriodo',
                                                method: 'POST',
                                                callback: function(opt, scs, resp) {
                                                    Ext.getBody().unmask();
                                                    var data = Ext.decode(resp.responseText);
                                                    
                                                    if (data.codigoMsg == 1) {
                                                        if(data.docsincomprobante){
                                                            mostrarMensaje(3, "Existen " + data.cantidad + " documentos sin comprobante.");
                                                        }
                                                        else {
                                                            _this.lblImporteTotal.setText(_this.idioma.lblPerido + data.datos.periodo.nombre + ', ' + _this.idioma.lblDesde + data.datos.periodo.inicio + _this.idioma.lblHasta + data.datos.periodo.fin + '. ' + _this.idioma.lblFechaContable + data.datos.fechaContable);
                                                            //mostrarMensaje(1, _this.idioma.msjOkCierreP(data.periodo));
                                                            var mensaje =  "<h4>"+ data.success.mensaje +": </br> </br>"+ data.success.detalles+"</h4>";
                                                           mostrarMensaje(3, mensaje);
                                                            _this.getStorePrincipal().reload();
                                                        }

                                                    } else if (data.codigoMsg == 3) {
                                                        mostrarMensaje(3, data.mensaje);
                                                    } else if (data.codigoMsg == 4) {
                                                        mostrarMensaje(3, data.mensaje);
                                                    } else {
                                                        mostrarMensaje(3, _this.idioma.msjNoCiereP);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        })

               /* } else {
                    mostrarMensaje(2, _this.idioma.msjConfirmarP, function(btn) {
                        if (btn == 'ok') {
                            Ext.getBody().mask(_this.idioma.msjLoadMask);
                            Ext.Ajax.request({
                                url: 'cierrePeriodo',
                                method: 'POST',
                                callback: function(opt, scs, resp) {
                                    Ext.getBody().unmask();

                                    var data = Ext.decode(resp.responseText);
                                    if (data.codigoMsg == 1) {
                                        if(data.docsincomprobante){
                                            mostrarMensaje(3, "Existen " + data.cantidad + " documentos sin comprobante.");
                                        }else{
                                            _this.lblImporteTotal.setText(_this.idioma.lblPerido + data.periodo.nombre + ', ' + _this.idioma.lblDesde + data.periodo.inicio + _this.idioma.lblHasta + data.periodo.fin + '. ' + _this.idioma.lblFechaContable + data.fechaContable);
                                            mostrarMensaje(1, _this.idioma.msjOkCierreP(data.periodo));
                                            _this.getStorePrincipal().reload();
                                        }
                                    } else if (data.codigoMsg == 4) {
                                        mostrarMensaje(4, data.mensaje);
                                    } else {
                                        mostrarMensaje(3, _this.idioma.msjNoCiereP);
                                    }
                                }

                            });

                        }

                    })
                }*/
            },
            controlFn: function (b, _caller) {

                if (_caller.grantedAction('btnCierrePeriodo')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }

        });
        Ext.apply(this.listaBotones.getItem(0), {
            controlFn: function (b, _caller) {

                if (_caller.grantedAction('btnCierreDiario') && incremento != 1) {
                    b.setVisible(true);

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
        Ext.apply(this.listaBotones.getItem(3), {
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT')) {
                    b.setVisible(
                                (cargaInicial == 0 && contIntegrada) 
                                || (cargaInicial == 0 && !contIntegrada && !existenDocsAprobados) ? true : false);
                } else {
                    b.setVisible(false);
                }
            }
        });
        
    },
    render: function (config) {
        var _this = this;
        var vista = log.lb.cierreaft.View.superclass.render.call(this);


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