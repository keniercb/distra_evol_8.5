Ext.namespace('Ext.ClassAdicionarAnticipo');
Ext.ClassAdicionarAnticipo = Ext.extend(Ext.Component, {
    lmask: undefined,
    countStores: 0,
    loadadedStores: 0,
    WindowAdd: undefined,
    idAnticipoVentana: undefined,
    url: '',
    etiquetas: undefined,
    tipoDuo: undefined,
    flujoNormal: undefined,
    iddoc: undefined,
    idant: undefined,
    fechaContable: undefined,
    fechaPeriodoFin: undefined,
    fechaPeriodoInicio: undefined,
    tipoAccion: undefined,// add o mod
    cuentasUsadas: [],
    constructor: function(params)
    {
        Ext.apply(this, params);
        this.params = params;
        this.addEvents('recargar', 'confirmar', 'postear');
        this.initializeClass();

        Ext.ClassAdicionarAnticipo.superclass.constructor.call(this);
        return this;
    },
    loadMessageBox: function (msg = 'Cargando...', title = 'Por favor espere...') {
        Ext.MessageBox.show({
            title: title,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });//manera de ocultarlo Ext.MessageBox.hide();
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
    loadMask: function (message) {
        if (!(this.lmask instanceof Ext.LoadMask && message === undefined)) {
            this.lmask = new Ext.LoadMask(this.WindowAdd.body, {
                msg: message ? message : 'Cargando...'
            });
        }
        this.lmask.show();
    },
    hideMask: function () {
        if (this.lmask instanceof Ext.LoadMask) {
            this.lmask.hide();
        }
    },
    addStoresCount: function(store, fucionAEjecutar)
    {
        this.countStores++;
        store.on('load', function () {
            this.loadadedStores++;
            if (this.countStores === this.loadadedStores) {
                fucionAEjecutar();
            }
        }, this);
    },
    showWindow: function()
    {
        this.WindowAdd.show();
    },
    closeWindow: function()
    {
        this.WindowAdd.close();
    },
    getWindow: function()
    {
        return this.WindowAdd;
    },
    getAnticipo: function()
    {
        return this.idAnticipoVentana;
    },
    setAnticipo: function(id)
    {
        this.idAnticipoVentana = id;
    },
    resetAnticipo: function()
    {
        this.idAnticipoVentana = undefined;
    },
    resetAnticipo: function()
    {
        this.idAnticipoVentana = undefined;
    },
    createFormSteps: function (arrBtn = undefined) {
        if (arrBtn) {
            this.formSteps = new Ext.FormSteps(this.getWindow().getForm(), arrBtn);
        } else {
            return;
        }
        this.formSteps.on({
            scope: this,
            Nuevo: function (fnNuevo) {
                this.desabilitarCamposForm(false);
                this.limpiarCampos();
                fnNuevo.call();
            },
            Crear: function (fnCrear, cerrarVentana) {
                if (this.tipoAccion === 'add') {
                    var fn = function (id) {
                        this.desabilitarCamposForm(true);
                        fnCrear.call(undefined, id);
                    }.bind(this);
                    this.adicionarAnt(cerrarVentana, fn);
                } else if (this.tipoAccion === 'mod') {
                    var fn = function () {
                        this.desabilitarCamposForm(true);
                        fnCrear.call(undefined, this.getAnticipo());
                    }.bind(this);
                    this.modificarAnt(cerrarVentana, fn);
                }
            },
            Confirmar: function (fnConfirmar, idAnt) {
                this.fireEvent('confirmar', idAnt, fnConfirmar);
            },
            Postear: function (fnPostear, idAnt) {
                var fn = fnPostear;
                if (this.tipoAccion == 'mod') {
                    fn = fnPostear.createSequence(function () {
                        this.closeWindow();
                    }, this);
                }
                this.fireEvent('postear', idAnt, fn);
            },
        });
    },
    initializeClass: function () {
        this.WindowAdd = new Ext.UIAdicionarAnticipo(this.params);
        this.initializeModo();
        // this.initializeKeyMap(this);
    },
    initializeCond: function () {
        this.WindowAdd.dffechaemision.setValue(this.fechaContable);
        this.WindowAdd.dffechaemision.setMaxValue(this.fechaContable);
        this.WindowAdd.dffecharecepcion.setValue(this.fechaContable);
        this.WindowAdd.dffecharecepcion.setMinValue(this.WindowAdd.dffechaemision.getValue());
        this.WindowAdd.dffecharecepcion.setMaxValue(this.fechaPeriodoFin);
    },
    loadDataCheckCuenta: function () {
        Ext.Ajax.request({
            scope: this,
            url: 'loaddatacheckcuenta',
            params: {tipoDuo: this.tipoDuo},
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                this.cuentasUsadas = responseData;
                this.hideMessageBox();
            }
        });
    },
    initializeModo: function () {
        if (this.tipoAccion === 'add') {
            this.addMode();
        } else if (this.tipoAccion === 'mod') {
            this.initializeEvents();
            this.initializeFunctions();
            this.modMode();
        } else if (this.tipoAccion === 'ver') {
            this.verMode();
        }
    },
    addMode: function () {
        this.loadMessageBox();
        Ext.Ajax.request({
            scope: this,
            url: 'existeoperacioncont',
            params: {tipoDuo: this.tipoDuo},
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.success == 1) {
                    this.loadDataCheckCuenta();
                    this.initializeCond();
                    this.initializeEvents();
                    this.initializeFunctions();
                    this.showWindow();
                    this.createFormSteps(this.getWindow().buttons);
                } else {
                    mostrarMensaje(1, this.tipoDuo == 3 ? 'Debe adicionar una operaci&oacute;n contable de Reconocimiento de cobro para poder adicionar el cobro anticipado.' : 'Debe adicionar una operaci&oacute;n contable de Reconocimiento de pago para poder adicionar el pago anticipado.');
                }
                // this.hideMessageBox();
            }
        });
    },
    modMode: function () {
        this.loadMessageBox();
        Ext.Ajax.request({
            scope: this,
            url: 'cargaranticipoporid',
            params: {
                id: this.iddoc,
                tipoDuo: this.tipoDuo
            },
            callback: function (options, success, response) {
                this.loadDataCheckCuenta();
                var responseData = Ext.decode(response.responseText);
                var win = this.getWindow();
                this.setAnticipo(this.idant);

                this.initializeCond();
                this.initializeEvents();
                this.initializeFunctions();

                win.stNumeroContrato.baseParams.idclienteproveedor = responseData.datos.idcliente;
                var cliente = (this.tipoDuo == 3) ? 1 : 0;
                win.stNumeroContrato.baseParams.cliente = cliente;
                win.stNumeroContrato.load({
                    callback: function () {
                        if (responseData.datos.idcontrato) {
                            win.cbnumeroContrato.setValue(responseData.datos.idcontrato);
                        }
                    }
                });

                win.cbCliente.store.loadData(responseData.datos.clientes);
                win.cbCliente.setValue(responseData.datos.idcliente);
                win.cbcuentanormal.store.loadData(responseData.datos.cobrospagos);
                win.cbcuentanormal.setValue(responseData.datos.idcuenta);
                win.cbMoneda.setValue(responseData.datos.idmoneda);
                win.cbTipoInstrumento.setValue(responseData.datos.idtipoinstrumento);
                win.cbTipoInstrumento.fireEvent('select', null, this.recordAnt, null);

                win.stContabilizarOperacion.on('load', function () {
                    win.cbContabilizarOperacion.setValue(this.recordAnt.get('idoperacion'));
                    win.cbContabilizarOperacion.fireEvent('select', null, null, win.stContabilizarOperacion.indexOfId(this.recordAnt.get('idoperacion')));
                    if (this.flujoNormal == 1) {
                        win.cbCuentaOperacion.setValue(responseData.datos.idcuentapartida);
                    }
                }, this);
                win.stCuentaOperacion.on('load', function (store, records, opt) {
                    win.cbCuentaOperacion.setValue(responseData.datos.idcuentapartida, responseData.datos.cuentapartida);
                    this.createFormSteps(this.getWindow().buttons);
                    win.hideMask();
                }, this);

                win.numeroinstrumento.setValue(responseData.datos.numero);
                win.tfimportecontable.setValue(this.convertirsaldo(responseData.datos.importemb));
                win.tfimporte.setValue(this.convertirsaldo(responseData.datos.importemo));
                win.tfliquidadocontable.setValue(this.convertirsaldo(responseData.datos.liquidadomb));
                win.tfliquidado.setValue(this.convertirsaldo(responseData.datos.liquidadomo));
                win.tfcomentario.setValue(responseData.datos.comentario);
                win.dffechaemision.setValue(responseData.datos.fechaemi);
                win.dffechaemision.setMaxValue(responseData.datos.fecharecep);
                win.dffecharecepcion.setValue(responseData.datos.fecharecep);
                win.dffecharecepcion.setMinValue(responseData.datos.fechaemi);

                this.showWindow();
                win.loadMask();
                this.hideMessageBox();
            }
        });
    },
    verMode: function () {

        this.loadMessageBox();
        Ext.Ajax.request({
            scope: this,
            url: 'cargaranticipoporid',
            params: {
                id: this.iddoc,
                tipoDuo: this.tipoDuo
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                var win = this.getWindow();
                // this.setAnticipo(this.idant);

                // this.initializeCond();
                this.initializeEvents();
                this.initializeFunctions();

                win.stNumeroContrato.baseParams.idclienteproveedor = responseData.datos.idcliente;
                var cliente = (this.tipoDuo == 3) ? 1 : 0;
                win.stNumeroContrato.baseParams.cliente = cliente;
                win.stNumeroContrato.load({
                    callback: function () {
                        if (responseData.datos.idcontrato) {
                            win.cbnumeroContrato.setValue(responseData.datos.idcontrato);
                        }
                    }
                });

                win.cbCliente.store.loadData(responseData.datos.clientes);
                win.cbCliente.setValue(responseData.datos.idcliente);
                if (responseData.datos.cobrospagos) {
                    win.cbcuentanormal.store.loadData(responseData.datos.cobrospagos);
                }
                win.cbcuentanormal.setValue(responseData.datos.idcuenta);
                win.cbMoneda.setValue(responseData.datos.idmoneda);
                win.cbTipoInstrumento.setValue(responseData.datos.idtipoinstrumento);
                win.cbTipoInstrumento.fireEvent('select', null, this.recordAnt, null);

                win.stContabilizarOperacion.on('load', function () {
                    win.cbContabilizarOperacion.setValue(this.recordAnt.get('idoperacion'));
                    win.cbContabilizarOperacion.fireEvent('select', null, null, win.stContabilizarOperacion.indexOfId(this.recordAnt.get('idoperacion')));
                    if (this.flujoNormal == 1) {
                        win.cbCuentaOperacion.setValue(responseData.datos.idcuentapartida);
                    }
                }, this);
                win.stCuentaOperacion.on('load', function (store, records, opt) {
                    win.cbCuentaOperacion.setValue(responseData.datos.idcuentapartida, responseData.datos.cuentapartida);
                    // this.createFormSteps(this.getWindow().buttons);
                    win.cbCuentaOperacion.disable();
                    win.hideMask();
                }, this);

                win.numeroinstrumento.setValue(responseData.datos.numero);
                win.tfimportecontable.setValue(this.convertirsaldo(responseData.datos.importemb));
                win.tfimporte.setValue(this.convertirsaldo(responseData.datos.importemo));
                win.tfliquidadocontable.setValue(this.convertirsaldo(responseData.datos.liquidadomb));
                win.tfliquidado.setValue(this.convertirsaldo(responseData.datos.liquidadomo));
                win.tfcomentario.setValue(responseData.datos.comentario);
                win.dffechaemision.setValue(responseData.datos.fechaemi);
                win.dffechaemision.setMaxValue(responseData.datos.fecharecep);
                win.dffecharecepcion.setValue(responseData.datos.fecharecep);
                win.dffecharecepcion.setMinValue(responseData.datos.fechaemi);

                this.showWindow();
                win.loadMask();
                this.hideMessageBox();

                win.formUIAdicionarAnticipo.cascade(function () {
                    this.disabledClass = 'disabled-component';
                });

                win.formUIAdicionarAnticipo.disable();
                // win.formUIAdicionarAnticipo.el.mask();
                // this.desabilitarCamposForm(true);
                // win.formUIAdicionarAnticipo.addClass('disabled-component');
            }
        });
    },
    initializeEvents: function()
    {

        this.WindowAdd.on({
            scope: this,
            close: function () {
                this.fireEvent('recargar');
            },
            show: function () {
                this.WindowAdd.cbTipoInstrumento.focus(true, 100);
                this.WindowAdd.formUIAdicionarAnticipo.getForm().isValid();
            }
        });

        this.WindowAdd.cbContabilizarOperacion.on({
            scope: this,
            keypress: function (t, e) {
                if ((e.getKey() == 8) || (e.getKey() == 46)) // para el suprimir y borrar
                {
                    t.clearValue();
                }
            },
            select: function (combo, record, index) {
                if (this.flujoNormal == 1) {
                    this.WindowAdd.cbCuentaOperacion.reset();
                    this.WindowAdd.cbCuentaOperacion.enable();
                    var modelo = this.WindowAdd.stContabilizarOperacion.data.items[index].json.modelo;
                    var idcuenta = [];
                    if (modelo) {
                        this.WindowAdd.cbCuentaOperacion.resumeEvents();
                        for (var i = 0; i < modelo.length; i++) {
                            if (modelo[i].cuentas) {
                                var temp = Ext.decode(modelo[i].cuentas);
                                idcuenta.push(temp.idcuenta);
                            }
                        }
                        if (idcuenta.length > 0) {
                            this.WindowAdd.stCuentaOperacion.baseParams.arrayIdCuenta = Ext.encode(idcuenta);
                            this.WindowAdd.cbCuentaOperacion.load();
                        } else {
                            // mostrarMensaje(1, me.etiquetas.lbMsgIncorrectasOperaciones);
                        }
                    } else {
                        // mostrarMensaje(1, me.etiquetas.lbMsgNoModelosOperaciones);
                        if (this.flujoNormal != 1) {
                            this.WindowAdd.cbCuentaOperacion.disable();
                        } else {
                            // cbCuentaOperacion.getStore().removeAll();
                            this.WindowAdd.cbCuentaOperacion.reset();
                            this.WindowAdd.cbCuentaOperacion.suspendEvents();
                        }
                    }
                }
            }
        });

        this.WindowAdd.cbCuentaOperacion.on({
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
                    this.WindowAdd.cbCuentaOperacion.setValue(respondetext.datos[0].idcuenta, respondetext.datos[0].text);
                }
            }
        });

        this.WindowAdd.cbMoneda.on({
            scope: this,
            keypress: function (t, e) {
                if ((e.getKey() == 8) || (e.getKey() == 46)) { // para el suprimir y borrar
                    t.clearValue();
                }
                if (e.getKey() === e.ENTER) {
                    this.WindowAdd.tfimporte.focus(true, 10);
                }
            },
            select: function (field, record, index) {


            }
        });

        this.WindowAdd.cbCliente.on({
            scope: this,
            select: function (field, record, index) {
                var win = this.getWindow();
                win.stCuenta.removeAll();
                win.stCuenta.loadData(record.data.cobrospagos);
                win.cbcuentanormal.reset();
                win.cbCuentaOperacion.reset();
                win.cbCuentaOperacion.disable();
                win.cbContabilizarOperacion.reset();
                if (record.data.cobrospagos.length == 1){
                    if (!/^696|699/.test(record.data.cobrospagos[0].nombrecuenta)) {
                        var cobrospagos = record.data.cobrospagos[0];
                        win.cbcuentanormal.setValue(cobrospagos.idcuenta);
                        win.cbMoneda.setValue(record.data.cobrospagos[0].idmoneda);
                        win.cbcuentanormal.fireEvent('select', null, win.stCuenta.getAt(win.stCuenta.find('idmoneda', cobrospagos.idmoneda)));
                    }
                }
                win.stNumeroContrato

                win.stNumeroContrato.removeAll();
                win.stNumeroContrato.baseParams.idclienteproveedor = field.getValue();
                var cliente = (this.tipoDuo == 3) ? 1 : 0;
                win.stNumeroContrato.baseParams.cliente = cliente;
                win.stNumeroContrato.load();
            }
        });

        this.WindowAdd.cbTipoInstrumento.on({
            scope: this,
            keypress: function (t, e) {
                if ((e.getKey() == 8) || (e.getKey() == 46)) { // para el suprimir y borrar
                    t.clearValue();
                }
                if (e.getKey() === e.ENTER) {
                    this.WindowAdd.numeroinstrumento.focus(true, 10);
                }
            },
            select: function (field, record, index) {



                if (this.WindowAdd.cbcuentanormal.getValue()) {
                    this.WindowAdd.cbCuentaOperacion.reset();
                    this.WindowAdd.cbCuentaOperacion.disable();
                    this.WindowAdd.cbContabilizarOperacion.reset();
                    Ext.Ajax.request({
                        scope: this,
                        url: 'loadDataOperacion',
                        params: {
                            idtipodoc: record.data.iddoc,
                            idmoneda: this.WindowAdd.cbMoneda.getValue(),
                            concepto: this.tipoDuo == 3 ? 18 : 32,
                        },
                        callback: function(options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.operacion.length > 0) {
                                this.WindowAdd.stContabilizarOperacion.loadData(responseData.operacion);
                            } else {
                                mostrarMensaje(1, this.tipoDuo == 3 ? 'No existen operaciones de cobro para el documento seleccionado.' : 'No existen operaciones de pago para el documento seleccionado.');
                                this.WindowAdd.stContabilizarOperacion.removeAll();
                                this.WindowAdd.cbContabilizarOperacion.reset();
                            }

                        }
                    });
                }
            }
        });

        this.WindowAdd.cbcuentanormal.on({
            scope: this,
            keypress: function (t, e) {
                if ((e.getKey() == 8) || (e.getKey() == 46)) { // para el suprimir y borrar
                    t.clearValue();
                }
                if (e.getKey() === e.ENTER) {
                    this.WindowAdd.tfliquidado.focus(true, 10);
                }
            },
            select: function (field, record, index) {


                this.WindowAdd.cbMoneda.setValue(record.json.idmoneda);
                // cbMoneda.setValue(record.get('idmoneda'));

                if (this.WindowAdd.cbTipoInstrumento.getValue()) {
                    this.WindowAdd.cbCuentaOperacion.reset();
                    this.WindowAdd.cbCuentaOperacion.disable();
                    this.WindowAdd.cbContabilizarOperacion.reset();
                    Ext.Ajax.request({
                        scope: this,
                        url: 'loadDataOperacion',
                        params: {
                            idtipodoc: this.WindowAdd.cbTipoInstrumento.getValue(),
                            idmoneda: this.WindowAdd.cbMoneda.getValue(),
                            concepto: this.tipoDuo == 3 ? 18 : 32,
                        },
                        callback: function(options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.operacion.length > 0) {
                                this.WindowAdd.stContabilizarOperacion.loadData(responseData.operacion);
                            } else {
                                mostrarMensaje(1, this.tipoDuo == 3 ? 'No existen operaciones de cobro para el documento seleccionado.' : 'No existen operaciones de pago para el documento seleccionado.');
                                this.WindowAdd.stContabilizarOperacion.removeAll();
                                this.WindowAdd.cbContabilizarOperacion.reset();
                            }
                        }
                    });
                }
            },
            beforeselect: function (combo, record, index) {
                if (this.cuentasUsadas.includes(record.data.idcuenta)) {
                    var msg = this.tipoDuo == 3 ? 'cobro anticipado.' : 'pago anticipado.';
                    mostrarMensaje(1, 'La cuenta ' + record.data.text + ' esta en uso en ' + msg);
                    return false;
                } else if (/^696|699/.test(record.data.text)) {
                    var msg = this.tipoDuo == 3 ? ' no es una cuenta de pago anticipado. Por favor rectifique la misma en el proveedor.'
                        : ' no es una cuenta de cobro anticipado. Por favor rectifique la misma en el cliente.';
                    mostrarMensaje(1, 'La cuenta ' + record.data.text + msg);
                    return false;
                }
            }
        });

        this.WindowAdd.numeroinstrumento.on({
            scope: this,
            keypress: function (t, e) {
                if (e.getKey() === e.ENTER) {
                    this.WindowAdd.cbCliente.focus(true, 10);
                }
            },
            keyup: function (field, event) {


            }
        });

        this.WindowAdd.tfimportecontable.on({
            scope: this,
            blur: function (tf) {
                this.chequearC();
                tf.setValue(this.convertirsaldo(tf.getValue()));
            },
            keypress: function (tf, e) {
                if (e.getKey() === e.ENTER) {
                    this.WindowAdd.dffechaemision.focus(true, 10);
                }
            },
            keyup: function (field, event) {


            }
        });

        this.WindowAdd.tfimporte.on({
            scope: this,
            blur: function (tf) {
                this.chequear();
                tf.setValue(this.convertirsaldo(tf.getValue()));
            },
            keypress: function (tf, e) {
                if (e.getKey() === e.ENTER) {
                    //tfimportecontable.focus(true, 10);
                    this.WindowAdd.tfliquidado.focus(true, 10);
                }
            },
            keyup: function (field, event) {


            }
        });

        this.WindowAdd.tfliquidadocontable.on({
            scope: this,
            blur: function (tf) {
                this.chequearC();
                tf.setValue(this.convertirsaldo(tf.getValue()));
            },
            keypress: function (tf, e) {
                if (e.getKey() === e.ENTER) {
                    this.WindowAdd.dffecharecepcion.focus(true, 10);
                }
            },
            keyup: function (field, event) {


            }
        });

        this.WindowAdd.tfliquidado.on({
            scope: this,
            blur: function (tf) {
                this.chequear();
                tf.setValue(this.convertirsaldo(tf.getValue()));
            },
            keypress: function (tf, e) {
                if (e.getKey() === e.ENTER) {
                    //tfliquidadocontable.focus(true, 10);
                    this.WindowAdd.dffechaemision.focus(true, 10);
                }
            },
            keyup: function (field, event) {


            }
        });

        this.WindowAdd.tfcomentario.on({
            scope: this,
            keypress: function (tf, e) {
                // if (e.getKey() == e.ENTER && panel.getForm().isValid()) {
                //     this.WindowAdd.btnGuardar.handler.call();
                // }
            },
            keyup: function (field, event) {


            }
        });

        this.WindowAdd.dffechaemision.on({
            scope: this,
            keypress: function (tf, e) {
                if (e.getKey() === e.ENTER) {
                    //cbcuentanormal.focus(true, 10);
                    this.WindowAdd.dffecharecepcion.focus(true, 10);
                }
            },
            keyup: function (field, event) {


            },
            change: function (field, newValue, oldValue) {

                var dateparts = this.fechaPeriodoInicio.split("/");
                if (newValue >= new Date(dateparts[2], dateparts[1] -1, dateparts[0])) {
                    this.WindowAdd.dffecharecepcion.setMinValue(newValue);
                } else {
                    this.WindowAdd.dffecharecepcion.setMinValue(this.fechaPeriodoInicio);
                }
            }
        });

        this.WindowAdd.dffecharecepcion.on({
            scope: this,
            keypress: function (tf, e) {
                if (e.getKey() === e.ENTER) {
                    this.WindowAdd.tfcomentario.focus(true, 10);
                }
            },
            keyup: function (field, event) {


            },
            change: function (field, newValue, oldValue) {


                this.WindowAdd.dffechaemision.setMaxValue(newValue);
            },

        });

        this.WindowAdd.stCuentaOperacion.on({
            scope: this,
            load: function (store, records, opt) {
                this.WindowAdd.cbCuentaOperacion.setValue(records[0].get('idcuenta'));
            }
        });

        this.WindowAdd.stCliente.on({
            scope: this,
            load: function (st, recors) {
                if (recors.length == 0)
                    mostrarMensaje(1, this.tipoDuo == 3 ? 'Los deudores no tienen la(s) cuenta(s) de cobro anticipado configurada(s).' : 'Los acreedores no tienen la(s) cuenta(s) de pago anticipado configurada(s).');
            },
        });

    },
    initializeFunctions: function()
    {

        this.chequearC = function () {
            if (parseFloat(tfimportecontable.getValue()) <= parseFloat(tfliquidadocontable.getValue())) {
                this.WindowAdd.tfimportecontable.markInvalid('El importe contable debe ser mayor que el liquidado contable.');
                this.WindowAdd.tfliquidadocontable.markInvalid('El importe contable debe ser mayor que el liquidado contable.');
            } else {
                this.WindowAdd.tfimportecontable.clearInvalid();
                this.WindowAdd.tfliquidadocontable.clearInvalid();
            }
        };

        this.chequear = function () {
            if (parseFloat(this.WindowAdd.tfimporte.getValue()) <= parseFloat(this.WindowAdd.tfliquidado.getValue())) {
                this.WindowAdd.tfimporte.markInvalid('El importe original debe ser mayor que el liquidado original.');
                this.WindowAdd.tfliquidado.markInvalid('El importe original debe ser mayor que el liquidado original.');
            } else {
                this.WindowAdd.tfimporte.clearInvalid();
                this.WindowAdd.tfliquidado.clearInvalid();
            }
        };

        this.convertirsaldo = function (v) {
            if (v == '')
                return '0.00';
            v = (Math.round((v - 0) * 100)) / 100;
            v = (v < 0) ? v * (-1) : v;
            if (isNaN(v))
                return '0.00';
            return v.toFixed(2);
        };

        this.limpiarCampos = function () {
            var win = this.getWindow();
            win.tfimporte.reset();
            win.tfliquidado.reset();
            win.tfimportecontable.reset();
            win.tfliquidadocontable.reset();
            win.cbcuentanormal.reset();
            win.cbMoneda.reset();
            win.cbCliente.reset();
            win.numeroinstrumento.reset();
            win.tfcomentario.reset();
            this.initializeCond();
            win.cbTipoInstrumento.reset();
            win.cbCuentaOperacion.reset();
            win.cbCuentaOperacion.disable();
            win.cbContabilizarOperacion.reset();
            win.stContabilizarOperacion.removeAll();
            win.cbnumeroContrato.reset();
            win.cbnumeroContrato.store.removeAll();
        };

        this.desabilitarCamposForm = function (flag) {
            var win = this.getWindow();
            win.tfimporte.setDisabled(flag);
            // win.tfliquidado.reset();
            // win.tfimportecontable.setDisabled();
            // win.tfliquidadocontable.setDisabled();
            win.cbcuentanormal.setDisabled(flag);
            // win.cbMoneda.reset();
            win.cbCliente.setDisabled(flag);
            win.numeroinstrumento.setDisabled(flag);
            win.tfcomentario.setDisabled(flag);
            win.dffechaemision.setDisabled(flag);
            win.dffecharecepcion.setDisabled(flag);
            win.cbTipoInstrumento.setDisabled(flag);
            // win.cbCuentaOperacion.setDisabled(flag);
            win.cbCuentaOperacion.setDisabled(flag);
            win.cbContabilizarOperacion.setDisabled(flag);
            win.cbnumeroContrato.setDisabled(flag);
        };

        this.adicionarAnt = function (ocultarVentana = true, funcionCallBack = undefined) {
            var win = this.getWindow();
            Ext.Msg.wait(this.tipoDuo == 3 ? 'Guardando datos del Cobro anticipado.' : 'Guardando datos del Pago anticipado.', 'Por favor espere...');
            Ext.Ajax.request({
                scope: this,
                url: 'adicionarcypa',
                params: {
                    importe: win.tfimporte.getValue(),
                    importecont: win.tfimporte.getValue(),
                    liquidado: win.tfliquidado.getValue(),
                    liquidadocontable: win.tfliquidado.getValue(),
                    idcuenta: win.cbcuentanormal.getValue(),
                    idoperacion: win.cbContabilizarOperacion.getValue(),
                    idcuentaoperacion: win.cbCuentaOperacion.getValue(),
                    idmoneda: win.cbMoneda.getValue(),
                    idcliente: win.cbCliente.getValue(),
                    numero: win.numeroinstrumento.getValue(),
                    comentario: win.tfcomentario.getValue(),
                    fechaemi: win.dffecharecepcion.getValue().format('d/m/Y'), //y en cargaInicialModel al cargar se intercambian las fechas
                    fecharecep: win.dffechaemision.getValue().format('d/m/Y'), //Al reves pq se inserta en Instrumento registrado = 2
                    tipoinstrumento: win.cbTipoInstrumento.getValue(),
                    idcontrato: win.cbnumeroContrato.getValue(),
                    numerocontrato: win.cbnumeroContrato.getRawValue(),
                    flujoNormal: this.flujoNormal,
                    tipoDuo: this.tipoDuo
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.v == 1) {
                        // this.limpiarCampos();
                        Ext.Msg.hide();
                        mostrarMensaje(1, this.tipoDuo == 3 ? "El cobro anticipado ha sido adicionado satisfactoriamente." : "El pago anticipado ha sido adicionado satisfactoriamente.");
                        if (ocultarVentana) {
                            // this.fireEvent('add');
                            this.closeWindow();
                        } else {
                            // this.setAnticipo(responseData.i);
                            // this.controladorDeEstadosAnt(1);
                            // this.desabilitarCamposForm(true);
                            if (typeof funcionCallBack === 'function') {
                                funcionCallBack.call(undefined, responseData.i);
                            }
                        }
                    } else if (responseData.v == -1) {
                        mostrarMensaje(1, "La tasa correspondiente a la moneda seleccionada no se encuentra configurada en el sistema.");
                        Ext.Msg.hide();
                    } else {
                        Ext.Msg.hide();
                    }
                }
            });
        };

        this.modificarAnt = function (ocultarVentana = true, funcionCallBack = undefined) {
            var win = this.getWindow();
            Ext.Msg.wait(this.tipoDuo == 3 ? 'Guardando datos del Cobro anticipado.' : 'Guardando datos del Pago anticipado.', 'Por favor espere...');
            Ext.Ajax.request({
                scope: this,
                url: 'modificarcypa',
                params: {
                    id: this.idant,
                    iddocumento: this.iddoc,
                    importe: win.tfimporte.getValue(),
                    importecont: win.tfimportecontable.getValue(),
                    liquidadocontable: win.tfliquidadocontable.getValue(),
                    liquidado: win.tfliquidado.getValue(),
                    idcuenta: win.cbcuentanormal.getValue(),
                    idmoneda: win.cbMoneda.getValue(),
                    idcliente: win.cbCliente.getValue(),
                    numero: win.numeroinstrumento.getValue(),
                    comentario: win.tfcomentario.getValue(),
                    fecharecep: win.dffechaemision.getValue().format('d/m/Y'), //Al reves pq se inserta en Instrumento registrado = 2
                    fechaemi: win.dffecharecepcion.getValue().format('d/m/Y'), //y en cargaInicialModel al cargar se intercambian las fechas
                    tipoinstrumento: win.cbTipoInstrumento.getValue(),
                    idoperacion: win.cbContabilizarOperacion.getValue(),
                    idcuentaoperacion: win.cbCuentaOperacion.getValue(),
                    idcontrato: win.cbnumeroContrato.getValue(),
                    numerocontrato: win.cbnumeroContrato.getRawValue(),
                    tipoDuo: this.tipoDuo,
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.v == 1) {
                        Ext.Msg.hide();
                        mostrarMensaje(1, this.tipoDuo == 3 ? 'El cobro anticipado ha sido modificado satisfactoriamente.' : 'El pago anticipado ha sido modificado satisfactoriamente.');
                        if (ocultarVentana) {
                            this.closeWindow();
                        } else {
                            if (typeof funcionCallBack === 'function') {
                                funcionCallBack.call();
                            }
                        }
                    } else {
                        Ext.Msg.hide();
                    }
                }
            });
        };

    },
    initializeKeyMap: function(scope)
    {
                //para las teclas de acceso rapido
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
