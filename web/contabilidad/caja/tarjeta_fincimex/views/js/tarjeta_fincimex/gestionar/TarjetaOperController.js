Ext.namespace('Ext.GestionarTarjetaOper');
Ext.GestionarTarjetaOper.Controller = Ext.extend(Ext.Component, {
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
            {
                url: params.url + 'ajaxCalls/TarjetaOperAjaxCalls',
                id: 'TarjetaOperAjaxCalls',
            },
            {
                url: params.url + 'gestionar/TarjetaOperModel',
                id: 'TarjetaOperModel',
            },
            {
                url: params.url + 'gestionar/TarjetaOperView',
                id: 'TarjetaOperView',
            },
            {
                url: "/contabilidad/comun/componentes/RowActionColumn/Ext.grid.RowActions",
                id: 'RowActions',
                async: false
            },
            {
                url: "/contabilidad/cobros_pagos/cargainicial/views/js/componentes/CmpAction/cmpaction",
                id: 'cmpaction',
                async: false
            },
            {
                url: params.url + 'ventanas/configuracion/ConfController',
                id: 'TajertaOperConfController',
            },
            {
                url: params.url + 'ventanas/sincronizar/SyncController',
                id: 'TajertaOperSyncController',
            },
            {
                url: params.url + 'ventanas/adicionarrecarga/AddRecargaController',
                id: 'TajertaOperAddRecargaController',
            },
            {
                url: params.url + 'ventanas/adicionaranticipo/AddAnticipoController',
                id: 'TajertaOperAddAnticipoController',
            },
            {
                url: params.url + 'ventanas/adicionarliquidacion/AddLiquidacionController',
                id: 'TajertaOperAddLiquidacionController',
            },
            {
                url: params.url + 'ventanas/adicionarcancelacionliq/AddCancelacionLiqController',
                id: 'TajertaOperAddCancelacionLiqController',
            }
        ], function () {
            this.loadDataComponent();
        }.bind(this));

        Ext.GestionarTarjetaOper.Controller.superclass.constructor.call(this);
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
    crearTarjetaOperAjaxCalls: function()
    {
        return this.ajaxsRequest = new Ext.GestionarTarjetaOper.AjaxCalls();
    },
    loadDataComponent: function()
    {
        var ajax = this.crearTarjetaOperAjaxCalls();
        ajax.cargarEtiquetas(undefined, function (options, success, response) {
            var etiquetas = Ext.decode(response.responseText);
            if (!etiquetas.codMsg && success) {
                this.setEtiquetas(etiquetas);
                this.initializeClass();
                this.loadWindowCaja();
            }
        }.bind(this));
    },
    crearModelTarjetaOper: function () {
        this.setTOModel(new Ext.GestionarTarjetaOper.Model());
    },
    crearViewTarjetaOper: function () {
        this.crearModelTarjetaOper();
        var params = {
            etiquetas: this.getEtiquetas()
        };
        this.setTOView(new Ext.GestionarTarjetaOper.View(this.getTOModel(), params));
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
                var stAntLiq = this.getTOView().getGridAntLiq().getStore();
                stAntLiq.baseParams.idcaja = caja.idCaja;
                stAntLiq.load();
            }
        });
        wincaja.show();
    },
    initializeClass: function () {
        this.crearViewTarjetaOper();
        this.initializeDataIni();
        this.initializeEventsPanelGeneral();
        this.initializeEventsRecarga();
        this.initializeEventsAnticipoLiquidacion();
        // this.initializeEvents();
        this.initializeFunctionsRecarga();
        this.initializeFunctionsAnticipoLiquidacion();
        // this.initializeFunctions();
        // this.initializeKeyMap();
    },
    initializeDataIni: function () {
        var ajax = this.getTarjetaOperAjaxCalls();
        var view = this.getTOView();
        var model = this.getTOModel();

        ajax.buscarFechaContable(undefined, function (options, success, response) {
            var fechacon = Ext.decode(response.responseText);
            if (!fechacon.codMsg && success) {
                view.getLabelFechaContable().setText('Fecha contable: ' + fechacon.fecha);
                this.setFechasPeriodoContable(fechacon.fechai, fechacon.fecha, fechacon.fechafin);
            }
        }.bind(this));

        model.getStoreProveedor().load({
            scope: this,
            callback: function (records, opts, success) {
                if (success) {
                    var respuesta = model.getStoreProveedor().reader.jsonData;
                    // this.aperturaTarjeta = respuesta.aperturaTarjeta;
                    // this.panelTarjeta.gpTarjeta.getColumnModel().setHidden(
                    //     this.panelTarjeta.gpTarjeta.getColumnModel().getIndexById('idColumSaldoContab'),
                    //      !this.aperturaTarjeta);

                    if (respuesta.proveedor.cobrospagos) {
                        view.getCbProveedor().setValue(respuesta.proveedor.idclientesproveedores);
                        // view.getCbProveedor().setRawValue(respuesta.proveedor.nombre);

                        var datos = [];
                        for (var i = 0; i < respuesta.proveedor.cobrospagos.length; i++) {
                            if (respuesta.proveedor.cobrospagos[i].idclasificacion == 4) { // 4 es pago anticipado
                                datos.push(respuesta.proveedor.cobrospagos[i].idcuenta);
                            }
                        }
                        this.data = Ext.decode(respuesta.proveedor.data_cuenta);
                        if (!(datos.length === 0)) {
                            // model.getStoreCuentaProveedor().baseParams.arrayIdCuenta = Ext.encode(datos);
                            view.getCbxCuentaProveedor().reload(null, null, {arrayIdCuenta: Ext.encode(datos)}, function () {
                                var tree = view.getCbxCuentaProveedor().tree;
                                var data = Ext.decode(respuesta.proveedor.data_cuenta);
                                if (!tree.getLoader().isLoading() && data) {
                                    Ext.each(data, function (item) {
                                        if (tree.getNodeById(item)) {
                                            tree.getNodeById(item).getUI().toggleCheck(true);
                                        }
                                    }, this)
                                }
                                if (data) {
                                    var temp = '';
                                    for (var i = 0; i < model.getStoreCuentaProveedor().data.items.length; i++) {
                                        if (data.includes(model.getStoreCuentaProveedor().data.items[i].json.idcuenta))
                                            temp = temp + model.getStoreCuentaProveedor().data.items[i].json.concatcta + ', ';
                                    }
                                    temp = temp.slice(0, -2);
                                    // view.getCbxCuentaProveedor().setRawValue(temp);
                                }
                            });
                            view.getCbxCuentaProveedor().enable();
                        } else {
                            view.getCbxCuentaProveedor().disable();
                        }
                    }
                }
            }
        });

    },
    initializeEventsPanelGeneral: function() {
        var view = this.getTOView();
        var model = this.getTOModel();
        var ajax = this.getTarjetaOperAjaxCalls();

        view.getBtnConfigurar().setHandler(function (btn) {
            var conf = new Ext.GestionarTarjetaOperConf.Controller({
                url: this.getUrl(),
                etiquetas: this.getEtiquetas(),
                loadMessageBox: this.loadMessageBox,
                ajaxCalls: this.getTarjetaOperAjaxCalls()
            });


        }, this);

        view.getBtnSynchro().setHandler(function (btn) {
            var sync = new Ext.GestionarTarjetaOperSync.Controller({
                url: this.getUrl(),
                etiquetas: this.getEtiquetas(),
                idCaja: this.getIdCaja(),
                loadMessageBox: this.loadMessageBox,
                ajaxCalls: this.getTarjetaOperAjaxCalls()
            });


        }, this);

        view.getCbProveedor().on({
            scope: this,
            select: function (cb, record, index) {
                view.getCbxCuentaProveedor().clearValue();
                var datos = [];
                for (var i = 0; i < record.json.cobrospagos.length; i++) {
                    if (record.json.cobrospagos[i].idclasificacion == 4) { // 4 es pago anticipado
                        datos.push(record.json.cobrospagos[i].idcuenta);
                    }
                }
                // this.data = undefined;
                if (!(datos.length === 0)) {
                    model.getStoreCuentaProveedor().baseParams.arrayIdCuenta = Ext.encode(datos);
                    view.getCbxCuentaProveedor().reload();
                    view.getCbxCuentaProveedor().enable();
                } else {
                    view.getCbxCuentaProveedor().disable();
                }
            }
        });

        view.getCbxCuentaProveedor().on(
            {
                scope: this,
                beforeload: function () {
                    view.getCbxCuentaProveedor().getStore().removeAll();
                },
                blur: function (store, record, options) {
                    this.loadMessageBox();
                    var params = {
                        scope: this,
                        params: {
                            idProveedor: view.getCbProveedor().getValue(),
                            arrCuentas: Ext.encode(view.getCbxCuentaProveedor().getValue())
                        },
                    };
                    var fn = function (options, success, response) {
                        if (success) {
                            // response = Ext.decode(response.responseText);
                        }
                        this.hideMessageBox();
                    };
                    ajax.guardarProveedor(params, fn);
                }
            });

        view.getBtnCaja().setHandler(function (btn) {
            this.loadWindowCaja(this.getIdCaja());
        }, this);

    },
    initializeEventsRecarga: function () {
        var view = this.getTOView();
        var ajax = this.getTarjetaOperAjaxCalls();

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

    },
    initializeEventsAnticipoLiquidacion: function() {
        var view = this.getTOView();
        var ajax = this.getTarjetaOperAjaxCalls();

        view.getGridAnticipoBtnAdicionar().setHandler(function (btn) {
            this.ventanaAddAnticipo('add');
        }, this);

        view.getGridAnticipoBtnModificar().setHandler(function (btn) {
            this.ventanaAddAnticipo('mod');
        }, this);

        // view.getGridAnticipoBtnVer().setHandler(function (btn) {
        //     this.ventanaAddAnticipo('ver');
        // }, this);

        view.getGridAnticipoBtnCancelar().setHandler(function (btn) {
            this.cancelarAnticipo(view.getGridAntLiq().getSelectionModel());

        }, this);

        view.getGridAnticipoBtnConfirmar().setHandler(function (btn) {
            this.confirmarAnticipo(view.getGridAntLiq().getSelectionModel());

        }, this);

        view.getGridAnticipoBtnPostear().setHandler(function (btn) {
            this.postearAnticipo(view.getGridAntLiq().getSelectionModel());

        }, this);

        view.getGridAnticipoBtnLiquidacion().setHandler(function (btn) {
            this.ventanaAddLiquidacion('add');
        }, this);

        view.getGridAnticipoBtnCancelarLiquidaciones().setHandler(function (btn) {
            this.ventanaAddCancelarLiq('add');
        }, this);

        view.getGridAntLiq().getSelectionModel().on({
            scope: this,
            selectionChange: function (selModel) {
                var record = selModel.getSelected();
                if (record) {
                    var estado = record.get('estado');
                    var idanticipo = record.get('idanticipo');
                    var idliquidacion = record.get('idliquidacion');
                }
                if (idanticipo) {//cuando es anticipo
                    if (estado == 0) {//creado
                        this.estadoCreadoAnticipoLiquidacion();
                    } else if (estado == 1) {//confirmado
                        this.estadoConfirmadoAnticipoLiquidacion();
                    } else if (estado == 2) {//posteado
                        this.estadoPosteadoAnticipoLiquidacion();
                    } else if (estado == 3) {//cancelado
                        this.estadoCanceladoAnticipoLiquidacion();
                    } else {
                        this.estadoOtroAnticipoLiquidacion();
                    }
                } else if (idliquidacion) {//cuando es liq
                    if (estado == 0) {
                        view.getGridAnticipoBtnModificar().disable();
                        view.getGridAnticipoBtnConfirmar().disable();
                        view.getGridAnticipoBtnPostear().disable();
                        view.getGridAnticipoBtnCancelar().disable();
                    } else {
                        this.estadoOtroAnticipoLiquidacion();
                    }
                } else {
                    this.estadoOtroAnticipoLiquidacion();
                }

            }
        });
    },
    initializeEvents: function() {

    },
    initializeFunctionsRecarga: function() {
        var view = this.getTOView();
        var ajax = this.getTarjetaOperAjaxCalls();

        this.estadoCreadoRecarga = function () {
            view.getGridRecargaBtnModificar().enable();
            view.getGridRecargaBtnConfirmar().enable();
            view.getGridRecargaBtnPostear().disable();
            view.getGridRecargaBtnCancelar().enable();
            view.getGridRecargaBtnVer().enable();
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
            view.getGridRecargaBtnVer().disable();
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
                ajaxCalls: this.getTarjetaOperAjaxCalls()
            };
            if (modo === 'add') {
                Ext.apply(params, {
                    modo: modo
                });
            } else if (modo === 'mod') {
                var selmodel = view.getGridRecarga().getSelectionModel();
                Ext.apply(params, {
                    modo: modo,
                    idrecargafincimex: selmodel.getSelected().get('idrecargafincimex')
                });
            } else if (modo === 'ver') {
                var selmodel = view.getGridRecarga().getSelectionModel();
                Ext.apply(params, {
                    modo: modo,
                    idrecargafincimex: selmodel.getSelected().get('idrecargafincimex')
                });
            }

            var sync = new Ext.GestionarTarjetaAddRecarga.Controller(params);

            sync.on({
                scope: this,
                close: function () {
                    view.getGridRecarga().getStore().load();
                },
                confirmar: function (id, callback) {
                    this.confirmarRecargaFincimex(id, false, callback);
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
            });
        };

        this.cancelarRecarga = function (sm) {
            var msg = 'Esta seguro que desea cancelar?';
            mostrarMensaje(2, msg, function (btnPress) {
                if (btnPress === 'ok') {

                    var objWinCancelar = new Caja.WindowCancelar({
                        // selections: selections,
                        // fecha: me.smRecarga.getSelected().data.fecha
                    });
                    objWinCancelar.show();
                    // objWinCancelar.cbmotivo.getValue(),
                    // objWinCancelar.dffechacancelacion.getRawValue(),
                    objWinCancelar.btnAceptar.on({
                        scope: this,
                        click: function () {
                            var estado = sm.getSelected().get('estado');
                            if (estado == 0 || estado == 1) {
                                this.cancelarRecargaFincimex(
                                    sm.getSelected().get('idrecargafincimex'),
                                    objWinCancelar.cbmotivo.getValue(),
                                    objWinCancelar.dffechacancelacion.getRawValue()
                                );
                            } else if (estado == 2) {
                                this.fLoadDataComprobante(
                                    sm.getSelected().get('idrecargafincimex'),
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

        this.cancelarRecargaFincimex = function (idRecargaFincimex, idmotivo, fecha, idComprobante, numComprobante, fechaComprobante, recargarGrid = true, fnCallback) {
            this.loadMessageBox();
            var params = {
                scope: this,
                params: {
                    idoperaciontarjeta: idRecargaFincimex,
                    idmotivo: idmotivo,
                    fecha: fecha,
                    idComprobante: idComprobante,
                    numeroComprobante: numComprobante,
                    fechaComprobante: fechaComprobante
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
            ajax.cancelarRecargaFincimex(params, fn);
        };

        this.confirmarRecarga = function (sm) {
            var msg = 'Esta seguro que desea confirmar?';
            mostrarMensaje(2, msg, function (btnPress) {
                if (btnPress === 'ok') {
                    var estado = sm.getSelected().get('estado');
                    if (estado == 0) {
                        this.confirmarRecargaFincimex(sm.getSelected().get('idrecargafincimex'));
                    }
                }
            }.bind(this));
        };

        this.confirmarRecargaFincimex = function (idRecargaFincimex, recargarGrid = true, fnCallback) {
            this.loadMessageBox();
            var params = {
                scope: this,
                params: {
                    idoperaciontarjeta: idRecargaFincimex
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
            ajax.confirmarRecargaFincimex(params, fn);
        };

        this.postearRecarga = function (sm) {
            var msg = 'Esta seguro que desea postear?';
            mostrarMensaje(2, msg, function (btnPress) {
                if (btnPress === 'ok') {
                    var estado = sm.getSelected().get('estado');
                    if (estado == 1) {
                        this.fLoadDataComprobante(
                            sm.getSelected().get('idrecargafincimex'),
                            1
                        );
                    }
                }
            }.bind(this));
        };

        this.fLoadDataComprobante = function (idRecargaFincimex, tipoCont, idmotivo, fecha, recargarGrid = true, fnCallback = undefined) {
            if (!Ext.Msg.isVisible()) {
                this.loadMessageBox();
            }
            Ext.Ajax.request({
                url: 'loadDataComprobante',
                method: 'POST',
                scope: this,
                params: {
                    idoperaciontarjeta: idRecargaFincimex,
                    tipoContabilizacion: tipoCont,// 1-postear 2-cancelar
                    idProveedor: view.getCbProveedor().getValue()
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData == '-1') {
                        // mostrarMensaje(1, this.idioma.lbNoOperacionRecarga);
                        mostrarMensaje(1, 'No existen operaciones operaciones contables configuradas.');
                        Ext.MessageBox.hide();
                    } else if (responseData == '-2') {
                        // mostrarMensaje(1, this.idioma.lbNoCtaPagoAntcipado);
                        mostrarMensaje(1, 'El proveedor seleccionado no tiene cuenta de pago anticipado configurada.');
                        Ext.MessageBox.hide();
                    } else
                        this.fShowComprobante(idRecargaFincimex, responseData, tipoCont, idmotivo, fecha, recargarGrid, fnCallback);
                }
            });
        };

        //Construir y mostrar el comprobante
        this.fShowComprobante = function (idRecargaFincimex, respData, tipoCont, idmotivo, fecha, recargarGrid, fnCallback) {
            var idSubsistema = 14;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = respData.descripcion;
            var detalle = respData.detalle;

            // Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                // Ext.Msg.wait(this.idioma.lbGuardandoComprobante, this.idioma.lbEspere);
                this.loadMessageBox();
                if (tipoCont === 1)//Si esta Posteando
                    this.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, idRecargaFincimex, recargarGrid, fnCallback);
                else {
                    this.cancelarRecargaFincimex(idRecargaFincimex, idmotivo, fecha, idComprobante, numComprobante, fechaComprobante);
                }
            }.bind(this)).onClose(function () {
                // me.scope.keyMapa.enable();
            });
        };

        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, idRecargaFincimex, recargarGrid, fnCallback) {
            // Ext.Msg.wait(this.idioma.lbPosteando, this.idioma.lbEspere);
            this.loadMessageBox();

            // var arrayId = [params.idmovimiento];

            Ext.Ajax.request({
                method: "POST",
                url: 'postearrecarga',
                scope: this,
                params: {
                    // arrayId: Ext.encode(arrayId),
                    idoperaciontarjeta: idRecargaFincimex,
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
    initializeFunctionsAnticipoLiquidacion: function() {
        var view = this.getTOView();
        var ajax = this.getTarjetaOperAjaxCalls();

        this.estadoCreadoAnticipoLiquidacion = function () {
            view.getGridAnticipoBtnModificar().enable();
            view.getGridAnticipoBtnConfirmar().enable();
            view.getGridAnticipoBtnPostear().disable();
            view.getGridAnticipoBtnCancelar().enable();
            // view.getGridAnticipoBtnVer().enable();
        };

        this.estadoConfirmadoAnticipoLiquidacion = function () {
            view.getGridAnticipoBtnModificar().disable();
            view.getGridAnticipoBtnConfirmar().disable();
            view.getGridAnticipoBtnPostear().enable();
            view.getGridAnticipoBtnCancelar().enable();
            // view.getGridAnticipoBtnVer().enable();
        };

        this.estadoPosteadoAnticipoLiquidacion = function () {
            view.getGridAnticipoBtnModificar().disable();
            view.getGridAnticipoBtnConfirmar().disable();
            view.getGridAnticipoBtnPostear().disable();
            view.getGridAnticipoBtnCancelar().enable();
            // view.getGridAnticipoBtnVer().enable();
        };

        this.estadoCanceladoAnticipoLiquidacion = function () {
            view.getGridAnticipoBtnModificar().disable();
            view.getGridAnticipoBtnConfirmar().disable();
            view.getGridAnticipoBtnPostear().disable();
            view.getGridAnticipoBtnCancelar().disable();
            // view.getGridAnticipoBtnVer().disable();
        };

        this.estadoOtroAnticipoLiquidacion = function () {
            view.getGridAnticipoBtnModificar().disable();
            view.getGridAnticipoBtnConfirmar().disable();
            view.getGridAnticipoBtnPostear().disable();
            view.getGridAnticipoBtnCancelar().disable();
            // view.getGridAnticipoBtnVer().disable();
        };

        this.ventanaAddAnticipo = function (modo) {
            var params = {
                url: this.getUrl(),
                etiquetas: this.getEtiquetas(),
                idCaja: this.getIdCaja(),
                loadMessageBox: this.loadMessageBox,
                fechaInicio: this.getPeriodoConFechaInicial(),
                fechaActual: this.getPeriodoConFechaActual(),
                fechaFin: this.getPeriodoConFechaFin(),
                ajaxCalls: this.getTarjetaOperAjaxCalls()
            };
            if (modo === 'add') {
                Ext.apply(params, {
                    modo: modo
                });
            } else if (modo === 'mod') {
                var selmodel = view.getGridAntLiq().getSelectionModel();
                Ext.apply(params, {
                    modo: modo,
                    idanticipofincimex: selmodel.getSelected().get('idantliqfincimex')
                });
            } else if (modo === 'ver') {
                var selmodel = view.getGridAntLiq().getSelectionModel();
                Ext.apply(params, {
                    modo: modo,
                    idanticipofincimex: selmodel.getSelected().get('idantliqfincimex')
                });
            }

            var ant = new Ext.GestionarTarjetaAddAnt.Controller(params);

            ant.on({
                scope: this,
                close: function () {
                    view.getGridAntLiq().getStore().load();
                },
                confirmar: function (id, callback) {
                    this.confirmarAnticipoFincimex(id, false, callback);
                },
                postear: function (id, callback) {
                    this.fLoadDataComprobanteAnticipo(
                        id,
                        1,
                        undefined,
                        undefined,
                        false,
                        callback
                    );
                },
            });
        };

        this.ventanaAddLiquidacion = function (modo) {
            var params = {
                url: this.getUrl(),
                etiquetas: this.getEtiquetas(),
                idCaja: this.getIdCaja(),
                loadMessageBox: this.loadMessageBox,
                fechaInicio: this.getPeriodoConFechaInicial(),
                fechaActual: this.getPeriodoConFechaActual(),
                fechaFin: this.getPeriodoConFechaFin(),
                ajaxCalls: this.getTarjetaOperAjaxCalls()
            };
            if (modo === 'add') {
                Ext.apply(params, {
                    modo: modo
                });
            } else if (modo === 'ver') {
                // var selmodel = view.getGridAntLiq().getSelectionModel();
                // Ext.apply(params, {
                //     modo: modo,
                //     idanticipofincimex: selmodel.getSelected().get('idantliqfincimex')
                // });
            }

            var liq = new Ext.GestionarTarjetaAddLiq.Controller(params);

            liq.on({
                scope: this,
                close: function () {
                    view.getGridAntLiq().getStore().load();
                },
                loadDataComprobanteLiquidacion: function (params, fn) {
                    this.fLoadDataComprobanteLiquidacion(undefined, params, undefined, undefined, true, fn);
                }
            });
        };

        this.ventanaAddCancelarLiq = function (modo) {
            var params = {
                url: this.getUrl(),
                etiquetas: this.getEtiquetas(),
                idCaja: this.getIdCaja(),
                loadMessageBox: this.loadMessageBox,
                fechaInicio: this.getPeriodoConFechaInicial(),
                fechaActual: this.getPeriodoConFechaActual(),
                fechaFin: this.getPeriodoConFechaFin(),
                ajaxCalls: this.getTarjetaOperAjaxCalls()
            };
            if (modo === 'add') {
                Ext.apply(params, {
                    modo: modo
                });
            } else if (modo === 'ver') {
                // var selmodel = view.getGridAntLiq().getSelectionModel();
                // Ext.apply(params, {
                //     modo: modo,
                //     idanticipofincimex: selmodel.getSelected().get('idantliqfincimex')
                // });
            }

            var liq = new Ext.GestionarTarjetaAddCanLiq.Controller(params);

            liq.on({
                scope: this,
                close: function () {
                    view.getGridAntLiq().getStore().load();
                },
                loadDataComprobanteCancelarLiquidacion: function (params, fn) {
                    // this.fLoadDataComprobanteLiquidacion(undefined, params, undefined, undefined, true, fn);
                    var objWinCancelar = new Caja.WindowCancelar({
                        // selections: selections,
                        // fecha: me.smRecarga.getSelected().data.fecha
                    });
                    objWinCancelar.show();
                    objWinCancelar.btnAceptar.on({
                        scope: this,
                        click: function () {
                            this.fLoadDataComprobanteCancelarLiquidacion(
                                params,
                                objWinCancelar.cbmotivo.getValue(),
                                objWinCancelar.dffechacancelacion.getRawValue(),
                                fn
                            );
                        }
                    });
                }
            });
        };

        this.cancelarAnticipo = function (sm) {
            var msg = 'Esta seguro que desea cancelar?';
            mostrarMensaje(2, msg, function (btnPress) {
                if (btnPress === 'ok') {

                    var objWinCancelar = new Caja.WindowCancelar({
                        // selections: selections,
                        // fecha: me.smRecarga.getSelected().data.fecha
                    });
                    objWinCancelar.show();
                    objWinCancelar.btnAceptar.on({
                        scope: this,
                        click: function () {
                            if (sm.getSelected().get('idanticipo')) {
                                var estado = sm.getSelected().get('estado');
                                if (estado == 0 || estado == 1) {
                                    this.cancelarAnticipoFincimex(
                                        sm.getSelected().get('idantliqfincimex'),
                                        objWinCancelar.cbmotivo.getValue(),
                                        objWinCancelar.dffechacancelacion.getRawValue()
                                    );
                                } else if (estado == 2) {
                                    this.fLoadDataComprobanteAnticipo(
                                        sm.getSelected().get('idantliqfincimex'),
                                        2,
                                        objWinCancelar.cbmotivo.getValue(),
                                        objWinCancelar.dffechacancelacion.getRawValue()
                                    );
                                }
                            } else if (sm.getSelected().get('idliquidacion')) {
                                var estado = sm.getSelected().get('estado');
                                if (estado == 0 ) {
                                    this.fLoadDataComprobanteCancelarLiquidacion(
                                        sm.getSelected().get('idantliqfincimex'),
                                        objWinCancelar.cbmotivo.getValue(),
                                        objWinCancelar.dffechacancelacion.getRawValue()
                                    );
                                }
                            }
                        }
                    });
                }
            }.bind(this));
        };

        this.cancelarAnticipoFincimex = function (idAntLiqFincimex, idmotivo, fecha, idComprobante, numComprobante, fechaComprobante, recargarGrid = true, fnCallback) {
            this.loadMessageBox();
            var params = {
                scope: this,
                params: {
                    idoperaciontarjeta: idAntLiqFincimex,
                    idmotivo: idmotivo,
                    fecha: fecha,
                    idComprobante: idComprobante,
                    numeroComprobante: numComprobante,
                    fechaComprobante: fechaComprobante
                }
            };
            var fn = function (options, success, response) {
                if (success) {
                    responde = Ext.decode(response.responseText);
                    if (recargarGrid) {
                        view.getGridAntLiq().getStore().load();
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
            ajax.cancelarAnticipoFincimex(params, fn);
        };

        this.confirmarAnticipo = function (sm) {
            var msg = 'Esta seguro que desea confirmar?';
            mostrarMensaje(2, msg, function (btnPress) {
                if (btnPress === 'ok') {
                    var estado = sm.getSelected().get('estado');
                    if (estado == 0) {
                        this.confirmarAnticipoFincimex(sm.getSelected().get('idantliqfincimex'));
                    }
                }
            }.bind(this));
        };

        this.confirmarAnticipoFincimex = function (idAntLiqFincimex, recargarGrid = true, fnCallback) {
            this.loadMessageBox();
            var params = {
                scope: this,
                params: {
                    idoperaciontarjeta: idAntLiqFincimex
                },
            };
            var fn = function (options, success, response) {
                if (success) {
                    responde = Ext.decode(response.responseText);
                    if (recargarGrid) {
                        view.getGridAntLiq().getStore().load();
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
            ajax.confirmarAnticipoFincimex(params, fn);
        };

        this.postearAnticipo = function (sm) {
            var msg = 'Esta seguro que desea postear?';
            mostrarMensaje(2, msg, function (btnPress) {
                if (btnPress === 'ok') {
                    var estado = sm.getSelected().get('estado');
                    if (estado == 1) {
                        this.fLoadDataComprobanteAnticipo(
                            sm.getSelected().get('idantliqfincimex'),
                            1
                        );
                    }
                }
            }.bind(this));
        };

        this.fLoadDataComprobanteAnticipo = function (idAntLiqFincimex, tipoCont, idmotivo, fecha, recargarGrid = true, fnCallback = undefined) {
            if (!Ext.Msg.isVisible()) {
                this.loadMessageBox();
            }
            Ext.Ajax.request({
                url: 'loadDataComprobanteAnticipo',
                method: 'POST',
                scope: this,
                params: {
                    idoperaciontarjeta: idAntLiqFincimex,
                    tipoContabilizacion: tipoCont// 1-postear 2-cancelar
                    // idProveedor: view.getCbProveedor().getValue()
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData == '-1') {
                        // mostrarMensaje(1, this.idioma.lbNoOperacionRecarga);
                        mostrarMensaje(1, 'No existen operaciones operaciones contables configuradas.');
                        Ext.MessageBox.hide();
                    }/* else if (responseData == '-2') {
                        // mostrarMensaje(1, this.idioma.lbNoCtaPagoAntcipado);
                        mostrarMensaje(1, 'El proveedor seleccionado no tiene cuenta de pago anticipado configurada.');
                        Ext.MessageBox.hide();
                    }*/ else
                        this.fShowComprobanteAnticipo(idAntLiqFincimex, responseData, tipoCont, idmotivo, fecha, recargarGrid, fnCallback);
                }
            });
        };

        this.fLoadDataComprobanteLiquidacion = function (idAntLiqFincimex, params, idmotivo, fecha, recargarGrid = true, fnCallback = undefined) {
            if (!Ext.Msg.isVisible()) {
                this.loadMessageBox();
            }
            Ext.apply(params, {
                idoperaciontarjeta: idAntLiqFincimex
            });
            Ext.Ajax.request({
                url: 'loadDataComprobanteLiquidacion',
                method: 'POST',
                scope: this,
                params: params,
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData == '-1') {
                        // mostrarMensaje(1, this.idioma.lbNoOperacionRecarga);
                        mostrarMensaje(1, 'No existen operaciones operaciones contables configuradas.');
                        Ext.MessageBox.hide();
                    }/* else if (responseData == '-2') {
                        // mostrarMensaje(1, this.idioma.lbNoCtaPagoAntcipado);
                        mostrarMensaje(1, 'El proveedor seleccionado no tiene cuenta de pago anticipado configurada.');
                        Ext.MessageBox.hide();
                    }*/ else
                        this.fShowComprobanteLiquidacion(params, responseData, params.tipoContabilizacion, idmotivo, fecha, recargarGrid, fnCallback);
                }
            });
        };

        this.fLoadDataComprobanteCancelarLiquidacion = function (params, idmotivo, fecha, fn) {
            if (!Ext.Msg.isVisible()) {
                this.loadMessageBox();
            }
            Ext.Ajax.request({
                url: 'loadDataComprobanteCancelarLiquidacion',
                method: 'POST',
                scope: this,
                params: params,
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData == '-1') {
                        // mostrarMensaje(1, this.idioma.lbNoOperacionRecarga);
                        mostrarMensaje(1, 'No existen operaciones operaciones contables configuradas.');
                        Ext.MessageBox.hide();
                    }/* else if (responseData == '-2') {
                        // mostrarMensaje(1, this.idioma.lbNoCtaPagoAntcipado);
                        mostrarMensaje(1, 'El proveedor seleccionado no tiene cuenta de pago anticipado configurada.');
                        Ext.MessageBox.hide();
                    }*/ else
                        this.fShowComprobanteCancelarLiquidacion(params, responseData, idmotivo, fecha, fn);
                }
            });
        };

        //Construir y mostrar el comprobante
        this.fShowComprobanteAnticipo = function (idAntLiqFincimex, respData, tipoCont, idmotivo, fecha, recargarGrid, fnCallback) {
            var idSubsistema = 14;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = respData.descripcion;
            var detalle = respData.detalle;

            // Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                // Ext.Msg.wait(this.idioma.lbGuardandoComprobante, this.idioma.lbEspere);
                this.loadMessageBox();
                if (tipoCont === 1)//Si esta Posteando
                    this.fGuardarComprobanteAnticipo(idComprobante, numComprobante, fechaComprobante, idAntLiqFincimex, recargarGrid, fnCallback);
                else {
                    this.cancelarAnticipoFincimex(idAntLiqFincimex, idmotivo, fecha, idComprobante, numComprobante, fechaComprobante);
                }
            }.bind(this)).onClose(function () {
                // me.scope.keyMapa.enable();
            });
        };

        this.fShowComprobanteLiquidacion = function (params, respData, tipoCont, idmotivo, fecha, recargarGrid, fnCallback) {
            var idSubsistema = 14;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = respData.descripcion;
            var detalle = respData.detalle;

            // Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                // Ext.Msg.wait(this.idioma.lbGuardandoComprobante, this.idioma.lbEspere);
                this.loadMessageBox();
                if (tipoCont === 3)//Si esta liquidando
                    this.fGuardarComprobanteLiquidacion(idComprobante, numComprobante, fechaComprobante, params, recargarGrid, fnCallback);

            }.bind(this)).onClose(function () {
                // me.scope.keyMapa.enable();
            });
        };

        this.fShowComprobanteCancelarLiquidacion = function (params, respData, idmotivo, fecha, fn) {
            var idSubsistema = 14;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = respData.descripcion;
            var detalle = respData.detalle;

            // Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                // Ext.Msg.wait(this.idioma.lbGuardandoComprobante, this.idioma.lbEspere);
                this.loadMessageBox();
                this.cancelarLiquidacionFincimex(params, idmotivo, fecha, idComprobante, numComprobante, fechaComprobante, true, fn);
            }.bind(this)).onClose(function () {
                // me.scope.keyMapa.enable();
            });
        };

        this.fGuardarComprobanteAnticipo = function (idComprobante, numeroComprobante, fechaComprobante, idAntLiqFincimex, recargarGrid, fnCallback) {
            // Ext.Msg.wait(this.idioma.lbPosteando, this.idioma.lbEspere);
            this.loadMessageBox();

            // var arrayId = [params.idmovimiento];

            Ext.Ajax.request({
                method: "POST",
                url: 'postearAnticipo',
                scope: this,
                params: {
                    // arrayId: Ext.encode(arrayId),
                    idoperaciontarjeta: idAntLiqFincimex,
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == '1') {
                        if (recargarGrid) {
                            view.getGridAntLiq().getStore().load();
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

        this.fGuardarComprobanteLiquidacion = function (idComprobante, numeroComprobante, fechaComprobante, params, recargarGrid, fnCallback) {
            // Ext.Msg.wait(this.idioma.lbPosteando, this.idioma.lbEspere);
            this.loadMessageBox();

            // var arrayId = [params.idmovimiento];
            Ext.apply(params, {
                idComprobante: idComprobante,
                numeroComprobante: numeroComprobante,
                fechaComprobante: fechaComprobante
            });
            Ext.Ajax.request({
                method: "POST",
                url: 'postearLiquidacion',
                scope: this,
                params: params,
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == '1') {
                        if (recargarGrid) {
                            view.getGridAntLiq().getStore().load();
                        }
                        if (typeof fnCallback === 'function') {
                            fnCallback.call();
                        }
                        Ext.MessageBox.hide();
                        // mostrarMensaje(1, this.idioma.lbMsgPosteo + ' ' + numeroComprobante + '.');
                        mostrarMensaje(1, 'Liquidado satisfactoriamente en el comprobante número' + ' ' + numeroComprobante + '.');
                    }
                }.bind(this)
            });
        };

        this.cancelarLiquidacionFincimex = function (params, idmotivo, fecha, idComprobante, numeroComprobante, fechaComprobante, recargarGrid = true, fnCallback) {
            // Ext.Msg.wait(this.idioma.lbPosteando, this.idioma.lbEspere);
            this.loadMessageBox();

            Ext.apply(params, {
                idmotivo: idmotivo,
                fecha: fecha,
                idComprobante: idComprobante,
                numeroComprobante: numeroComprobante,
                fechaComprobante: fechaComprobante
            });

            Ext.Ajax.request({
                method: "POST",
                url: 'cancelarLiquidacionFincimex',
                scope: this,
                params: params,
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == '1') {
                        if (recargarGrid) {
                            view.getGridAntLiq().getStore().load();
                        }
                        if (typeof fnCallback === 'function') {
                            fnCallback.call();
                        }
                        Ext.MessageBox.hide();
                        // mostrarMensaje(1, this.idioma.lbMsgPosteo + ' ' + numeroComprobante + '.');
                        mostrarMensaje(1, 'Cancelada la liquidacion satisfactoriamente en el comprobante número' + ' ' + numeroComprobante + '.');
                    }
                }.bind(this)
            });
        };

    },
    initializeFunctions: function() {

    },
    crearSetsAndGets: function () {

        this.getTarjetaOperAjaxCalls = function () {
            return this.ajaxsRequest;
        };

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
