Ext.namespace('Ext.ConfiguracionTV');
Ext.ConfiguracionTV.Controller = Ext.extend(Ext.Component, {
    url: undefined,
    perfil: undefined,
    etiquetas: undefined,
    fechaInicioPeriodo: undefined,
    fechaContablePeriodo: undefined,
    fechaFinPeriodo: undefined,
    model: undefined,
    view: undefined,
    constructor: function(params)
    {
        this.crearSetsAndGets();
        this.initializeFunctions();
        // this.setUrl(params.url);
        this.setPerfil(window.parent.perfil);
        this.setTipoDuo(params.tipoDuo);
        this.setEtiquetas(params.etiquetas);

        this.loadDataComponent();
        Ext.ConfiguracionTV.Controller.superclass.constructor.call(this);
    },
    loadDataComponent: function()
    {
        var model = this.crearModel({tipoDuo: this.getTipoDuo()});
        // model.cargarEtiquetas(undefined, function (options, success, response) {
        //     var etiquetas = Ext.decode(response.responseText);
        //     if (!etiquetas.codMsg && success) {
        //         this.setEtiquetas(etiquetas);
        //         this.initializeClass();
        //     }
        // }.bind(this));
        this.initializeClass();
    },
    initializeClass: function () {
        this.crearView();
        this.initializeFunctions();
        this.initializeDataIni();
        this.initializeEvents();
        // this.initializeKeyMap();
    },
    initializeEvents: function() {
        var model = this.getModel();
        var view = this.getView();

        view.cbContabilizarOperacion.on({
            scope: this,
            keypress: function (t, e) {
                if ((e.getKey() == 8) || (e.getKey() == 46)) // para el suprimir y borrar
                {
                    t.clearValue();
                }
            },
            select: function (combo, record, index) {
                view.cbCuentaOperacion.reset();
                view.cbCuentaOperacion.clearValue();
                view.cbCuentaOperacion.enable();
                var modelo = model.getStoreContabilizarOperacion().data.items[index].json.modelo;
                var idcuenta = [];
                if (modelo) {
                    view.cbCuentaOperacion.resumeEvents();
                    for (var i = 0; i < modelo.length; i++) {
                        if (modelo[i].cuentas) {
                            var temp = Ext.decode(modelo[i].cuentas);
                            idcuenta.push(temp.idcuenta);
                        }
                    }
                    if (idcuenta.length > 0) {
                        model.getStoreCuentaOperacion().baseParams.arrayIdCuenta = Ext.encode(idcuenta);
                        view.cbCuentaOperacion.load();
                    } else {
                        // mostrarMensaje(1, me.etiquetas.lbMsgIncorrectasOperaciones);
                    }
                } else {
                    // mostrarMensaje(1, me.etiquetas.lbMsgNoModelosOperaciones);
                    if (this.flujoNormal != 1) {
                        view.cbCuentaOperacion.disable();
                    } else {
                        // cbCuentaOperacion.getStore().removeAll();
                        view.cbCuentaOperacion.reset();
                        view.cbCuentaOperacion.suspendEvents();
                    }
                }
            }
        });

        view.cbCuentaOperacion.on({
            scope: this,
            select: function (cb, record) {
                // var index = stLiquidar.find('idcuenta', cb.getValue());
                // if (index != -1) {
                //     cb.reset();
                //     // mostrarMensaje(1, scope.etiquetas.lbMsgCuentaRepetida);
                // }
            },
            load: function (data) {
                var respondetext = Ext.decode(data.responseText);
                if (respondetext.datos.length == 1 && respondetext.datos[0].leaf) {
                    view.cbCuentaOperacion.setValue(respondetext.datos[0].idcuenta, respondetext.datos[0].text);
                }
            }
        });

        view.cbCliente.on({
            scope: this,
            select: function (field, record, index) {
                model.getStoreCuenta().removeAll();
                model.getStoreCuenta().loadData(record.data.cobrospagos);
                view.cbcuentanormal.reset();
                view.cbCuentaOperacion.reset();
                view.cbCuentaOperacion.disable();
                view.cbContabilizarOperacion.reset();
                if (record.data.cobrospagos.length == 1){
                    if (!/^696|699/.test(record.data.cobrospagos[0].nombrecuenta)) {
                        var cobrospagos = record.data.cobrospagos[0];
                        view.cbcuentanormal.setValue(cobrospagos.idcuenta);
                        // view.cbMoneda.setValue(record.data.cobrospagos[0].idmoneda);
                        view.cbcuentanormal.fireEvent('select', null, model.getStoreCuenta().getAt(model.getStoreCuenta().find('idmoneda', cobrospagos.idmoneda)));
                    }
                }
            }
        });

        view.cbTipoInstrumento.on({
            scope: this,
            keypress: function (t, e) {
                if ((e.getKey() == 8) || (e.getKey() == 46)) { // para el suprimir y borrar
                    t.clearValue();
                }
            },
            select: function (field, record, index) {

                if (view.cbcuentanormal.getValue()) {
                    view.cbCuentaOperacion.reset();
                    view.cbCuentaOperacion.disable();
                    view.cbContabilizarOperacion.reset();
                    Ext.Ajax.request({
                        scope: this,
                        url: 'loadDataOperacion',
                        params: {
                            idtipodoc: record.data.iddoc,
                            idmoneda: model.getStoreCuenta().getAt(model.getStoreCuenta().find('idcuenta', view.cbcuentanormal.getValue())).data.idmoneda,
                            concepto: this.tipoDuo == 3 ? 18 : 32,
                        },
                        callback: function(options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.operacion.length > 0) {
                                model.getStoreContabilizarOperacion().loadData(responseData.operacion);
                            } else {
                                mostrarMensaje(1, this.tipoDuo == 3 ? 'No existen operaciones de cobro para el documento seleccionado.' : 'No existen operaciones de pago para el documento seleccionado.');
                                model.getStoreContabilizarOperacion().removeAll();
                                view.cbContabilizarOperacion.reset();
                            }

                        }
                    });
                }
            }
        });

        view.cbcuentanormal.on({
            scope: this,
            keypress: function (t, e) {
                if ((e.getKey() == 8) || (e.getKey() == 46)) { // para el suprimir y borrar
                    t.clearValue();
                }
            },
            select: function (field, record, index) {


                // view.cbMoneda.setValue(record.json.idmoneda);

                if (view.cbTipoInstrumento.getValue()) {
                    view.cbCuentaOperacion.reset();
                    view.cbCuentaOperacion.disable();
                    view.cbContabilizarOperacion.reset();
                    Ext.Ajax.request({
                        scope: this,
                        url: 'loadDataOperacion',
                        params: {
                            idtipodoc: view.cbTipoInstrumento.getValue(),
                            idmoneda: record.json.idmoneda,
                            concepto: this.tipoDuo == 3 ? 18 : 32,
                        },
                        callback: function(options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.operacion.length > 0) {
                                model.getStoreContabilizarOperacion().loadData(responseData.operacion);
                            } else {
                                mostrarMensaje(1, this.tipoDuo == 3 ? 'No existen operaciones de cobro para el documento seleccionado.' : 'No existen operaciones de pago para el documento seleccionado.');
                                model.getStoreContabilizarOperacion().removeAll();
                                view.cbContabilizarOperacion.reset();
                            }
                        }
                    });
                }
            },
            beforeselect: function (combo, record, index) {
                if (/^696|699/.test(record.data.text)) {
                    mostrarMensaje(1, 'La cuenta ' + record.data.text + ' es incorrecta.');
                    return false;
                }
            }
        });

    },
    initializeFunctions: function() {
        var model = this.getModel();
        var view = this.getView();

        this.funcionesGenerales = function () {
            this.loadMessageBox = function (msg = 'Cargando...', title = 'Por favor espere...') {
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
            };

            this.hideMessageBox = function () {
                Ext.MessageBox.hide();
            };

            this.crearModel = function (params = {}) {
                this.setModel(new Ext.ConfiguracionTV.Model(params));
                return this.getModel();
            };

            this.crearView = function () {
                var params = {
                    etiquetas: this.getEtiquetas()
                };
                this.setView(new Ext.ConfiguracionTV.View(this.getModel(), params));
            };

            this.show = function () {
                view.show();
            };

            this.close = function () {
                view.close();
            };

            this.initializeDataIni = function () {
                var view = this.getView();
                var model = this.getModel();
                view.show();
                this.loadMessageBox();
                model.cargarDatos(undefined, function (options, success, response) {
                    var datos = Ext.decode(response.responseText);
                    if (datos) {
                        this.cargarDatosForm(datos);
                    }
                    this.hideMessageBox();
                    this.createFormSteps(view.formUI, view.buttons);
                }.bind(this));

            }.bind(this);
        };

        this.funcionesComponente = function () {
            this.createFormSteps = function (form, arrBtn) {
                if (arrBtn) {
                    this.formSteps = new Ext.FormSteps(form, arrBtn);
                } else {
                    return;
                }
                this.formSteps.on({
                    scope: this,
                    Crear: function (fnCrear, cerrarVentana) {

                        this.salvarConfiguracion();

                    },
                });
            };

            this.cargarDatosForm = function (datos) {
                this.idtvanticipo = datos.idtvanticipo;
                view.cbContabilizarOperacion.setValue(datos.idoperacion);
                view.cbContabilizarOperacion.setRawValue(datos.operacion);

                view.cbCuentaOperacion.enable();
                view.cbCuentaOperacion.setValue(datos.idcuentacontrapartida, datos.textcuentacontrapartida);
                // view.cbCuentaOperacion.setRawValue(datos.textcuentacontrapartida);

                view.cbCliente.setValue(datos.idclienteproveedor);
                view.cbCliente.setRawValue(datos.clienteprov);

                view.cbTipoInstrumento.setValue(datos.idtipoinstrumento);
                view.cbTipoInstrumento.setRawValue(datos.tipoinstrumento);

                var record = new model.recordCuenta({
                    idcuenta: datos.idcuenta,
                    text: datos.textcuenta,
                    idmoneda: datos.idmoneda,
                });
                model.getStoreCuenta().add(record);
                view.cbcuentanormal.setValue(datos.idcuenta);
                // view.cbcuentanormal.setRawValue(datos.textcuenta);
            };

            this.salvarConfiguracion = function () {
                var parametros = {
                    params: {
                        idtvanticipo: this.idtvanticipo,
                        idtipoinstrumento: view.cbTipoInstrumento.getValue(),
                        idclienteproveedor: view.cbCliente.getValue(),
                        idcuenta: view.cbcuentanormal.getValue(),
                        idoperacion: view.cbContabilizarOperacion.getValue(),
                        idcuentacontrapartida: view.cbCuentaOperacion.getValue(),
                    }
                };
                model.salvarConfiguracion(parametros, function (options, success, response) {
                    var resp = Ext.decode(response.responseText);
                    if (resp.cod === 1) {
                        mostrarMensaje(1, 'Guardado satisfactoriamente.')
                    } else {
                        mostrarMensaje(1, 'Algo salio mal.')
                    }
                    this.close();
                }.bind(this));
            };

        };

        this.funcionesGenerales.call(this);
        this.funcionesComponente.call(this);
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

        this.setPerfil = function (perfil) {
            this.perfil = perfil;
        };

        this.getPerfil = function () {
            return this.perfil;
        };

        this.setModel = function (model) {
            this.model = model;
        };

        this.getModel = function () {
            return this.model;
        };

        this.setView = function (view) {
            this.view = view;
        };

        this.getView = function () {
            return this.view;
        };

        this.setTipoDuo = function (tipoDuo) {
            this.tipoDuo = tipoDuo;
        };

        this.getTipoDuo = function () {
            return this.tipoDuo;
        };

    },
    initializeKeyMap: function () {
        this.map = new Ext.KeyMap(document);
        this.map.accessKey = function (key, handler, scope) {
            var h = function (n, e) {
                e.preventDefault();
                handler.call(scope || this, n, e);
            };
            this.on(key, h, scope);
        };

        //ADICIONAR
        this.map.accessKey({
            key: 'i',
            alt: true
        }, function () {
//            if ()
//                scope.btn.handler.call();
        }, Ext.getBody());

        //MODIFICAR
        this.map.accessKey({
            key: 'm',
            alt: true
        }, function () {

        }, Ext.getBody());

        //ELIMINAR
        this.map.accessKey({
            key: Ext.EventObject.DELETE
        }, function () {

        }, Ext.getBody());

        //CANCELAR
        this.map.accessKey({
            key: 'x',
            alt: true
        }, function () {

        }, Ext.getBody());

        //CANCELAR LIQUIDACION
        this.map.accessKey({
            key: 'x',
            ctrl: true
        }, function () {

        }, Ext.getBody());

        //CONFIRMAR
        this.map.accessKey({
            key: 'f',
            alt: true
        }, function () {

        }, Ext.getBody());

        //CONTABILIZAR
        this.map.accessKey({
            key: 't',
            alt: true
        }, function () {

        }, Ext.getBody());

        //LIQUIDAR
        this.map.accessKey({
            key: 'l',
            alt: true
        }, function () {

        }, Ext.getBody());

        //VER
        this.map.accessKey({
            key: 'v',
            alt: true
        }, function () {

        }, Ext.getBody());

        //GRAFICAR
        this.map.accessKey({
            key: 'g',
            alt: true
        }, function () {

        }, Ext.getBody());

        //BUSCAR
        this.map.accessKey({
            key: 'b',
            alt: true
        }, function () {

        }, Ext.getBody());

        //AYUDA
        this.map.accessKey({
            key: 'h',
            alt: true
        }, function () {

        }, Ext.getBody());

        //TAB
        this.map.accessKey({
            key: Ext.EventObject.TAB
        }, function () {
//            if (document.activeElement.tabIndex == 14)
//                scope.objWindowsDuo.cbAddTipoDoc.focus(true, 10);
//            else if (document.activeElement.tabIndex == 108)
//                scope.objWindowsDuo.cbBuscarTipoDoc.focus(true, 10);
//            else if (document.activeElement.tabIndex == 1)
//                scope.objWindowsDuo.btnAddConfirmar.focus();
//            else if (document.activeElement.tabIndex == 100)
//                scope.objWindowsDuo.btnBuscarAceptar.focus();
        }, Ext.getBody());
    }
});
