Ext.namespace('Ext.GestionarTarjetaObligacion');
Ext.GestionarTarjetaObligacion.Controller = Ext.extend(Ext.Component, {
    url: undefined,
    perfil: undefined,
    etiquetas: undefined,
    fechaInicioPeriodo: undefined,
    fechaContablePeriodo: undefined,
    fechaFinPeriodo: undefined,
    idCaja: undefined,
    nombreCaja: undefined,
    ajaxsRequest: undefined,
    TOView: undefined,
    TOModel: undefined,
    winCaja: undefined,
    constructor: function(params)
    {
        this.crearSetsAndGets();
        this.setUrl(params.url);
        this.perfil = window.parent.perfil;

        requireJS.loadJsArray([
            // {
            //     url: "/contabilidad/comun/componentes/RowActionColumn/Ext.grid.RowActions",
            //     id: 'RowActions',
            //     async: false
            // },
            {
                url: "/contabilidad/cobros_pagos/cargainicial/views/js/componentes/CmpAction/cmpaction",
                id: 'cmpaction',
                async: false
            },
            {
                url: params.url + 'ventanas/adicionarrecarga/AddRecargaController',
                id: 'TajertaObligacionAddRecargaController',
            },
        ], function () {
            this.loadDataComponent();
        }.bind(this));

        Ext.GestionarTarjetaObligacion.Controller.superclass.constructor.call(this);
    },
    loadMessageBox: function (msg = 'Cargando...', title = 'Por favor espere...') {
        Ext.MessageBox.show({
            title: title,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    },
    hideMessageBox: function () {
        Ext.MessageBox.hide();
    },
    loadDataComponent: function()
    {
        var model = this.crearModelTarjetaObligacion();
        model.cargarEtiquetas(undefined, function (options, success, response) {
            var etiquetas = Ext.decode(response.responseText);
            if (!etiquetas.codMsg && success) {
                this.setEtiquetas(etiquetas);
                this.initializeClass();
                this.loadWindowCaja();
            }
        }.bind(this));
    },
    crearModelTarjetaObligacion: function () {
        this.setTOModel(new Ext.GestionarTarjetaObligacion.Model());
        return this.getTOModel();
    },
    crearViewTarjetaObligacion: function () {
        var params = {
            etiquetas: this.getEtiquetas()
        };
        this.setTOView(new Ext.GestionarTarjetaObligacion.View(this.getTOModel(), params));
    },
    crearWindowCaja: function (idCajaOld) {
        return this.winCaja = new Caja.Componentes.WindowCaja({
            idCajaOld: idCajaOld
        });
    },
    loadWindowCaja: function (idCajaOld) {
        var wincaja = this.crearWindowCaja(idCajaOld);
        wincaja.on({
            scope: this,
            loadData: function (data) {
                var caja = this.getWindowCaja();
                var view = this.getTOView();
                // var model = this.getTOModel();
                this.setCaja(caja.idCaja, caja.nomCaja);
                view.getTfCaja().setValue(caja.nomCaja);
                // this.panelTarjeta.tfCaja.setValue(this.winCaja.idCaja);
                // this.panelTarjeta.tfCaja.setRawValue(this.winCaja.nomCaja);
                // this.panelTarjeta.stTarjeta.baseParams.idCaja = this.winCaja.idCaja;
                // this.panelTarjeta.stTarjeta.baseParams.activo = 1;
                // this.panelTarjeta.stTarjeta.load();
                // this.panelTarjeta.cbEstado.setValue(1);
                // this.panelTarjeta.btnAdicionar.focus(true, true);

                var stRecarga = this.getTOView().getGridRecarga().getStore();
                stRecarga.baseParams.idcaja = caja.idCaja;
                stRecarga.load();
            }
        });
        wincaja.show();
    },
    initializeClass: function () {
        this.crearViewTarjetaObligacion();
        this.initializeDataIni();
        this.initializeEventsPanelGeneral();
        this.initializeEventsRecarga();
        // this.initializeEvents();
        this.initializeFunctionsRecarga();
        // this.initializeFunctions();
        // this.initializeKeyMap();
    },
    initializeDataIni: function () {
        var view = this.getTOView();
        var model = this.getTOModel();

        model.buscarFechaContable(undefined, function (options, success, response) {
            var fechacon = Ext.decode(response.responseText);
            if (!fechacon.codMsg && success) {
                view.getLabelFechaContable().setText('Fecha contable: ' + fechacon.fecha);
                this.setFechasPeriodoContable(fechacon.fechai, fechacon.fecha, fechacon.fechafin);
                fechaContable = fechacon.fecha;
                fechaFin = fechacon.fechafin;
                fechaInicio = fechacon.fechai;
            }
        }.bind(this));

        model.getStoreProveedor().load({
            scope: this,
            callback: function (records, opts, success) {
                if (success) {
                    var respuesta = model.getStoreProveedor().reader.jsonData;
                    view.getCbProveedor().setValue(respuesta.proveedor.idclientesproveedores);
                    // this.aperturaTarjeta = respuesta.aperturaTarjeta;
                    // this.panelTarjeta.gpTarjeta.getColumnModel().setHidden(
                    //     this.panelTarjeta.gpTarjeta.getColumnModel().getIndexById('idColumSaldoContab'),
                    //      !this.aperturaTarjeta);

                }
            }
        });

    },
    initializeEventsPanelGeneral: function() {
        var view = this.getTOView();
        var model = this.getTOModel();

        // view.getCbProveedor().on({
        //     scope: this,
        //     select: function (cb, record, index) {
        //         view.getCbxCuentaProveedor().clearValue();
        //         var datos = [];
        //         for (var i = 0; i < record.json.cobrospagos.length; i++) {
        //             if (record.json.cobrospagos[i].idclasificacion == 4) { // 4 es pago anticipado
        //                 datos.push(record.json.cobrospagos[i].idcuenta);
        //             }
        //         }
        //         // this.data = undefined;
        //         if (!(datos.length === 0)) {
        //             model.getStoreCuentaProveedor().baseParams.arrayIdCuenta = Ext.encode(datos);
        //             view.getCbxCuentaProveedor().reload();
        //             view.getCbxCuentaProveedor().enable();
        //         } else {
        //             view.getCbxCuentaProveedor().disable();
        //         }
        //     }
        // });

        // view.getCbxCuentaProveedor().on(
        //     {
        //         scope: this,
        //         beforeload: function () {
        //             view.getCbxCuentaProveedor().getStore().removeAll();
        //         },
        //         blur: function (store, record, options) {
        //             this.loadMessageBox();
        //             var params = {
        //                 scope: this,
        //                 params: {
        //                     idProveedor: view.getCbProveedor().getValue(),
        //                     arrCuentas: Ext.encode(view.getCbxCuentaProveedor().getValue())
        //                 },
        //             };
        //             var fn = function (options, success, response) {
        //                 if (success) {
        //                     // response = Ext.decode(response.responseText);
        //                 }
        //                 this.hideMessageBox();
        //             };
        //             ajax.guardarProveedor(params, fn);
        //         }
        //     });

        view.getBtnCaja().setHandler(function (btn) {
            this.loadWindowCaja(this.getIdCaja());
        }, this);

    },
    initializeEventsRecarga: function () {
        var view = this.getTOView();
        var model = this.getTOModel();

        view.getGridRecargaBtnAdicionar().setHandler(function (btn) {
            this.ventanaAddRecarga('add');
        }, this);

        view.getGridRecargaBtnModificar().setHandler(function (btn) {
            this.ventanaAddRecarga('mod');
        }, this);

        view.getGridRecargaBtnVer().setHandler(function (btn) {
            this.ventanaAddRecarga('ver');
        }, this);

        view.getGridRecargaBtnCancelar().setHandler(function (btn) {
            this.cancelarRecarga(view.getGridRecarga().getSelectionModel());

        }, this);

        view.getGridRecargaBtnConfirmar().setHandler(function (btn) {
            this.confirmarRecarga(view.getGridRecarga().getSelectionModel());

        }, this);

        view.getGridRecargaBtnPostear().setHandler(function (btn) {
            this.postearRecarga(view.getGridRecarga().getSelectionModel());

        }, this);

        view.getGridRecarga().getSelectionModel().on({
            scope: this,
            selectionChange: function (selModel) {
                var record = selModel.getSelected();
                if (record) {
                    var estado = record.get('estado');
                }
                if (estado == 0) {//creado
                    this.estadoCreadoRecarga();
                } else if (estado == 1) {//confirmado
                    this.estadoConfirmadoRecarga();
                } else if (estado == 2) {//posteado
                    this.estadoPosteadoRecarga();
                } else if (estado == 3) {//cancelado
                    this.estadoCanceladoRecarga();
                } else {
                    this.estadoOtroRecarga();
                }
            }
        });

        view.getGridRecarga().on({
            scope: this,
            rowdblclick: function (grid, rowIndex, event) {
                var record = grid.getStore().getAt(rowIndex);
                if (record.get('estado') == 0) {
                    this.ventanaAddRecarga('mod');
                } else if (!view.getGridRecargaBtnVer().disabled) {
                    this.ventanaAddRecarga('ver');
                }
            }
        });

    },
    initializeEvents: function() {

    },
    initializeFunctionsRecarga: function() {
        var view = this.getTOView();
        var model = this.getTOModel();

        this.estadoCreadoRecarga = function () {
            view.getGridRecargaBtnModificar().enable();
            view.getGridRecargaBtnConfirmar().enable();
            view.getGridRecargaBtnPostear().disable();
            view.getGridRecargaBtnCancelar().enable();
            view.getGridRecargaBtnVer().disable();
        };

        this.estadoConfirmadoRecarga = function () {
            view.getGridRecargaBtnModificar().disable();
            view.getGridRecargaBtnConfirmar().disable();
            view.getGridRecargaBtnPostear().enable();
            view.getGridRecargaBtnCancelar().enable();
            view.getGridRecargaBtnVer().enable();
        };

        this.estadoPosteadoRecarga = function () {
            view.getGridRecargaBtnModificar().disable();
            view.getGridRecargaBtnConfirmar().disable();
            view.getGridRecargaBtnPostear().disable();
            view.getGridRecargaBtnCancelar().enable();
            view.getGridRecargaBtnVer().enable();
        };

        this.estadoCanceladoRecarga = function () {
            view.getGridRecargaBtnModificar().disable();
            view.getGridRecargaBtnConfirmar().disable();
            view.getGridRecargaBtnPostear().disable();
            view.getGridRecargaBtnCancelar().disable();
            view.getGridRecargaBtnVer().enable();
        };

        this.estadoOtroRecarga = function () {
            view.getGridRecargaBtnModificar().disable();
            view.getGridRecargaBtnConfirmar().disable();
            view.getGridRecargaBtnPostear().disable();
            view.getGridRecargaBtnCancelar().disable();
            view.getGridRecargaBtnVer().disable();
        };

        this.ventanaAddRecarga = function (modo) {
            var params = {
                url: this.getUrl(),
                etiquetas: this.getEtiquetas(),
                idCaja: this.getIdCaja(),
                idProveedor: view.getCbProveedor().getValue(),
                loadMessageBox: this.loadMessageBox,
                fechaInicio: this.getPeriodoConFechaInicial(),
                fechaActual: this.getPeriodoConFechaActual(),
                fechaFin: this.getPeriodoConFechaFin(),
                // ajaxCalls: this.getTarjetaOperAjaxCalls()
            };
            if (modo === 'add') {
                Ext.apply(params, {
                    modo: modo
                });
            } else if (modo === 'mod') {
                var selmodel = view.getGridRecarga().getSelectionModel();
                Ext.apply(params, {
                    modo: modo,
                    idtarjetaobligacion: selmodel.getSelected().get('idtarjetaobligacion')
                });
            } else if (modo === 'ver') {
                var selmodel = view.getGridRecarga().getSelectionModel();
                Ext.apply(params, {
                    modo: modo,
                    idtarjetaobligacion: selmodel.getSelected().get('idtarjetaobligacion'),
                    estado: selmodel.getSelected().get('estado')
                });
            }

            var sync = new Ext.GestionarTarjetaAddRecarga.Controller(params);

            sync.on({
                scope: this,
                close: function () {
                    view.getGridRecarga().getStore().load();
                },
                confirmar: function (id, callback) {
                    this.confirmarRecargaObligacion(id, false, callback);
                },
                postear: function (id, callback) {
                    this.fLoadDataComprobante(
                        id,
                        1,
                        undefined,
                        undefined,
                        false,
                        callback
                    );
                },
                cancelarRecargaEspecifica: function (id, idrecargaobligacion, estado, callback) {
                    if (estado == 2) {
                        this.fLoadDataComprobante(
                            id,
                            2,
                            undefined,
                            undefined,
                            false,
                            callback,
                            [idrecargaobligacion]
                        );
                    } else if (estado == 1) {
                        this.cancelarRecargaObligacion(
                            id,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            callback,
                            [idrecargaobligacion]
                        );
                    }
                }
            });
        };

        this.cancelarRecarga = function (sm) {
            var msg = 'Esta seguro que desea cancelar?';
            mostrarMensaje(2, msg, function (btnPress) {
                if (btnPress === 'ok') {

                    var objWinCancelar = new Caja.WindowCancelar({
                        // selections: selections,
                        fecha: view.getGridRecarga().getSelectionModel().getSelected().data.fechacontable
                    });
                    objWinCancelar.show();
                    // objWinCancelar.cbmotivo.getValue(),
                    // objWinCancelar.dffechacancelacion.getRawValue(),
                    objWinCancelar.btnAceptar.on({
                        scope: this,
                        click: function () {
                            var estado = sm.getSelected().get('estado');
                            if (estado == 0 || estado == 1) {
                                this.cancelarRecargaObligacion(
                                    sm.getSelected().get('idtarjetaobligacion'),
                                    objWinCancelar.cbmotivo.getValue(),
                                    objWinCancelar.dffechacancelacion.getRawValue()
                                );
                            } else if (estado == 2) {
                                this.fLoadDataComprobante(
                                    sm.getSelected().get('idtarjetaobligacion'),
                                    2,
                                    objWinCancelar.cbmotivo.getValue(),
                                    objWinCancelar.dffechacancelacion.getRawValue()
                                );
                            }
                        }
                    });
                }
            }.bind(this));
        };

        this.cancelarRecargaObligacion = function (idtarjetaobligacion, idmotivo, fecha, idComprobante, numComprobante, fechaComprobante, recargarGrid = true, fnCallback, arridrecargaobligacion = []) {
            this.loadMessageBox();
            var params = {
                scope: this,
                params: {
                    idtarjetaobligacion: idtarjetaobligacion,
                    idmotivo: idmotivo,
                    fecha: fecha,
                    idComprobante: idComprobante,
                    numeroComprobante: numComprobante,
                    fechaComprobante: fechaComprobante,
                    arridrecargaobligacion: Ext.encode(arridrecargaobligacion)
                }
            };
            var fn = function (options, success, response) {
                if (success) {
                    responde = Ext.decode(response.responseText);
                    if (recargarGrid) {
                        view.getGridRecarga().getStore().load();
                    }
                    if (typeof fnCallback === 'function') {
                        fnCallback.call();
                    }
                    if (responde.codMg == 1) {
                        mostrarMensaje(1, 'La opeacion ha sido cancelada satisfactoriamente.');
                    }
                }
                this.hideMessageBox();
            };
            model.cancelarRecargaObligacion(params, fn);
        };

        this.confirmarRecarga = function (sm) {
            var msg = 'Esta seguro que desea confirmar?';
            mostrarMensaje(2, msg, function (btnPress) {
                if (btnPress === 'ok') {
                    var estado = sm.getSelected().get('estado');
                    if (estado == 0) {
                        this.confirmarRecargaObligacion(sm.getSelected().get('idtarjetaobligacion'));
                    }
                }
            }.bind(this));
        };

        this.confirmarRecargaObligacion = function (idtarjetaobligacion, recargarGrid = true, fnCallback) {
            this.loadMessageBox();
            var params = {
                scope: this,
                params: {
                    idtarjetaobligacion: idtarjetaobligacion
                },
            };
            var fn = function (options, success, response) {
                if (success) {
                    responde = Ext.decode(response.responseText);
                    if (recargarGrid) {
                        view.getGridRecarga().getStore().load();
                    }
                    if (typeof fnCallback === 'function') {
                        fnCallback.call();
                    }
                    if (responde.codMg == 1) {
                        mostrarMensaje(1, 'La opeacion ha sido confirmada satisfactoriamente.');
                    }
                }
                this.hideMessageBox();
            };
            model.confirmarRecargaObligacion(params, fn);
        };

        this.postearRecarga = function (sm) {
            var msg = 'Esta seguro que desea postear?';
            mostrarMensaje(2, msg, function (btnPress) {
                if (btnPress === 'ok') {
                    var estado = sm.getSelected().get('estado');
                    if (estado == 1) {
                        this.fLoadDataComprobante(
                            sm.getSelected().get('idtarjetaobligacion'),
                            1
                        );
                    }
                }
            }.bind(this));
        };

        this.fLoadDataComprobante = function (idtarjetaobligacion, tipoCont, idmotivo, fecha, recargarGrid = true, fnCallback = undefined, arridrecargaobligacion = []) {
            if (!Ext.Msg.isVisible()) {
                this.loadMessageBox();
            }
            Ext.Ajax.request({
                url: 'loadDataComprobante',
                method: 'POST',
                scope: this,
                params: {
                    idtarjetaobligacion: idtarjetaobligacion,
                    tipoContabilizacion: tipoCont,// 1-postear 2-cancelar
                    arridrecargaobligacion: Ext.encode(arridrecargaobligacion)
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == -1 || responseData.codMg == -2) {
                        // mostrarMensaje(1, this.idioma.lbNoOperacionRecarga);
                        mostrarMensaje(1, responseData.msg);
                        Ext.MessageBox.hide();
                    } else
                        this.fShowComprobante(idtarjetaobligacion, responseData, tipoCont, idmotivo, fecha, recargarGrid, fnCallback, arridrecargaobligacion);
                }
            });
        };

        //Construir y mostrar el comprobante
        this.fShowComprobante = function (idtarjetaobligacion, respData, tipoCont, idmotivo, fecha, recargarGrid, fnCallback, arridrecargaobligacion) {
            var idSubsistema = 14;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = respData.descripcion;
            var detalle = respData.detalle;

            // Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                // Ext.Msg.wait(this.idioma.lbGuardandoComprobante, this.idioma.lbEspere);
                this.loadMessageBox();
                if (tipoCont === 1)//Si esta Posteando
                    this.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, idtarjetaobligacion, recargarGrid, fnCallback);
                else {
                    this.cancelarRecargaObligacion(idtarjetaobligacion, idmotivo, fecha, idComprobante, numComprobante, fechaComprobante, recargarGrid, fnCallback, arridrecargaobligacion);
                }
            }.bind(this)).onClose(function () {
                // me.scope.keyMapa.enable();
            });
        };

        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, idtarjetaobligacion, recargarGrid, fnCallback) {
            // Ext.Msg.wait(this.idioma.lbPosteando, this.idioma.lbEspere);
            this.loadMessageBox();

            // var arrayId = [params.idmovimiento];

            Ext.Ajax.request({
                method: "POST",
                url: 'postearrecarga',
                scope: this,
                params: {
                    // arrayId: Ext.encode(arrayId),
                    idtarjetaobligacion: idtarjetaobligacion,
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == '1') {
                        if (recargarGrid) {
                            view.getGridRecarga().getStore().load();
                        }
                        if (typeof fnCallback === 'function') {
                            fnCallback.call();
                        }
                        Ext.MessageBox.hide();
                        // mostrarMensaje(1, this.idioma.lbMsgPosteo + ' ' + numeroComprobante + '.');
                        mostrarMensaje(1, 'Posteado satisfactoriamente en el comprobante número' + ' ' + numeroComprobante + '.');
                    }
                }.bind(this)
            });
        };

    },
    initializeFunctions: function() {

    },
    crearSetsAndGets: function () {

        this.setFechasPeriodoContable = function (fechaInicial, fechaActual, fechaFin) {
            this.fechaInicioPeriodo = fechaInicial;
            this.fechaContablePeriodo = fechaActual;
            this.fechaFinPeriodo = fechaFin;
        };

        this.getPeriodoConFechaInicial = function () {
            return this.fechaInicioPeriodo;
        };

        this.getPeriodoConFechaActual = function () {
            return this.fechaContablePeriodo;
        };

        this.getPeriodoConFechaFin = function () {
            return this.fechaFinPeriodo;
        };

        this.setEtiquetas = function (etiquetas) {
            this.etiquetas = etiquetas;
        };

        this.getEtiquetas = function () {
            return this.etiquetas;
        };

        this.setUrl = function (url) {
            this.url = url;
        };

        this.getUrl = function () {
            return this.url;
        };

        this.setTOView = function (view) {
            this.TOView = view;
        };

        this.getTOView = function (view) {
            return this.TOView;
        };

        this.setTOModel = function (model) {
            this.TOModel = model;
        };

        this.getTOModel = function () {
            return this.TOModel;
        };

        this.getWindowCaja = function () {
            return this.winCaja;
        };

        this.setCaja = function (idCaja, nombreCaja) {
            this.idCaja = idCaja;
            this.nombreCaja = nombreCaja;
        };

        this.getIdCaja = function () {
            return this.idCaja;
        };

        this.getNombreCaja = function () {
            return this.nombreCaja;
        };

    }
});
