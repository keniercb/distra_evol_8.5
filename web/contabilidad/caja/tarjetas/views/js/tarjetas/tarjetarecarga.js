Ext.namespace('Caja.Tarjetas');
Ext.QuickTips.init();

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function (options, success, response) {
        new Caja.Tarjetas.Viewport({
            idioma: Ext.decode(response.responseText),
            perfil: window.parent.perfil
        });
    }
});

Caja.Tarjetas.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function (params) {
        this.stProveedor = new Ext.data.Store({//PASARLE EL BEFORELOAD DEL ORIGINAL
            url: 'getProveedores',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data'
            }, [{
                name: 'nombre'
            }, {
                name: 'idclientesproveedores'
            }
            ]),
            // autoLoad: true
        });
        this.cbProveedor = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            allowBlank: false,
            store: this.stProveedor,
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            hiddenName: 'idclientesproveedores',
            typeAhead: true,
            anchor: '100%',
            mode: 'remote',
            pageSize: 20,
            minChars: 3,
            resizable: true,
            triggerAction: 'all',
            enableKeyEvents: true,
        });

        this.initGlobalsKeys();
        this.initFunctions();
        // this.initEventos();
        this.loadDataInit(params);

        // Caja.Tarjetas.Viewport.superclass.constructor.call(this, params);
    },
    initGlobalsKeys: function () {

        this.keyMapa = new Ext.KeyMap(document, [
            {
                key: "i",
                alt: true,
                scope: this,
                fn: function () {
                    this.panelTarjeta.btnAdicionar.fireEvent('click');
                }
            }, {
                key: "m",
                alt: true,
                scope: this,
                fn: function (n, e) {
                    e.preventDefault();
                    if (!this.panelTarjeta.btnModificar.disabled)
                        this.panelTarjeta.btnModificar.fireEvent('click');
                }
            }, {
                key: Ext.EventObject.DELETE,
                //alt: true,
                scope: this,
                fn: function () {
                    if (!this.panelTarjeta.btnEliminar.disabled)
                        this.panelTarjeta.btnEliminar.fireEvent('click');
                }
            }, {
                key: 'x',
                alt: true,
                scope: this,
                fn: function () {
                    if (!this.panelTarjeta.btnCancelar.disabled)
                        this.panelTarjeta.btnCancelar.fireEvent('click');
                }
            }, {
                key: 'r',
                alt: true,
                scope: this,
                fn: function () {
                    if (!this.panelTarjeta.btnVistaReporte.disabled)
                        this.panelTarjeta.btnVistaReporte.fireEvent('click');
                }
            }, {
                key: 'n',
                alt: true,
                scope: this,
                fn: function () {
                    if (!this.panelTarjeta.btnInventario.disabled)
                        this.panelTarjeta.btnInventario.fireEvent('click');
                }
            }, {
                key: "i",
                ctrl: true,
                scope: this,
                fn: function (n, e) {
                    e.preventDefault();
                    if (!this.panelRecarga.btnAdicionar.disabled)
                        this.panelRecarga.btnAdicionar.fireEvent('click');
                }
            }, {
                key: "m",
                ctrl: true,
                scope: this,
                fn: function () {
                    if (!this.panelRecarga.btnModificar.disabled)
                        this.panelRecarga.btnModificar.fireEvent('click');
                }
            }, {
                key: 'x',
                ctrl: true,
                scope: this,
                fn: function () {
                    if (!this.panelRecarga.btnCancelar.disabled)
                        this.panelRecarga.btnCancelar.fireEvent('click');
                }
            }, {
                key: "f",
                ctrl: true,
                scope: this,
                fn: function (n, e) {
                    e.preventDefault();
                    if (!this.panelRecarga.btnConfirmar.disabled)
                        this.panelRecarga.btnConfirmar.fireEvent('click');
                }
            }, {
                key: "t",
                ctrl: true,
                scope: this,
                stopEvent: true,
                fn: function (n, e) {
                    console.log(e);
                    e.preventDefault();
                    e.stopPropagation();
                    if (!this.panelRecarga.btnPostear.disabled)
                        this.panelRecarga.btnPostear.fireEvent('click');
                }
            }, {
                key: "h",
                alt: true,
                fn: function () {
                    this.btnAyuda.fireEvent('click');
                }
            }
        ]);

    },
    initFunctions: function () {
        var me = this;
        this.loadDataInit = function (params) {
            Ext.Msg.wait('Cargando...', 'Por favor espere...');
            Ext.Ajax.request({
                url: 'loadDataIni',
                method: 'POST',
                scope: this,
                callback: function (options, success, response) {
                    if (success) {
                        var response = Ext.decode(response.responseText);
                        fechaContable = response.dataFecha.fechacontable;
                        var arrFechaContable = fechaContable.split('/');
                        fechaContableDate = new Date(arrFechaContable[2], arrFechaContable[1] - 1, arrFechaContable[0]);
                        periodoActual = response.dataFecha.nombre;
                        fechaInicio = response.dataFecha.inicio;
                        fechaFin = response.dataFecha.fin;
                        ejercicioActual = response.ejercicio;
                        aperturadoCaja = response.aperturado;
                        Ext.Msg.hide();
                        me.loadWindowCaja(params);
                        me.dataCombustible = response.combustible;
                        // this.panelTarjeta.lfdPeriodo.setText('Fecha contable: ' + fechaContable);
                        // this.panelTarjeta.btnImportar.setVisible(aperturadoCaja == 0);
                    }
                }
            });
        };

        this.loadWindowCaja = function (params) {
            //Componete de wincaja-----------
            this.winCaja = new Caja.Componentes.WindowCaja({
                idCajaOld: this.idCaja
            });
            this.winCaja.show();

            this.winCaja.on({
                scope: this,
                loadData: function (data) {
                    this.idCaja = this.winCaja.idCaja;
                    this.crearComponentes(params);
                    Caja.Tarjetas.Viewport.superclass.constructor.call(this, params);
                    this.initEventos();
                    this.stProveedor.load();
                    this.panelTarjeta.tfCaja.setValue(this.winCaja.idCaja);
                    this.panelTarjeta.tfCaja.setRawValue(this.winCaja.nomCaja);
                    this.panelTarjeta.stTarjeta.baseParams.idCaja = this.winCaja.idCaja;
                    this.panelTarjeta.stTarjeta.baseParams.activo = 1;
                    this.panelTarjeta.stTarjeta.load();
                    this.panelTarjeta.cbEstado.setValue(1);
                    this.panelTarjeta.btnAdicionar.focus(true, true);
                }
            });
        };

        this.lMaskEspere = function () {
            this.lMask = new Ext.LoadMask(this.panelGeneral.body, {//body de la ventana
                msg: this.idioma.lbEspere,
                removeMask: false
            });
            this.lMask.show();
        };
        //Tarea para validar los botones de la ventana--------------------------------------------
        this.startTaskValidForm = function (form, accion, arrayButtons) {
            this.tarea = {
                run: function () {
                    if (accion === 'add') {
                        if (form.isValid()) {
                            Ext.each(arrayButtons, function (btn) {
                                btn.setDisabled(false);
                            });
                        } else {
                            Ext.each(arrayButtons, function (btn) {
                                btn.setDisabled(true);
                            });
                        }
                    } else {
                        if (form.isValid() && form.isDirty()) {
                            Ext.each(arrayButtons, function (btn) {
                                btn.setDisabled(false);
                            });
                        } else {
                            Ext.each(arrayButtons, function (btn) {
                                btn.setDisabled(true);
                            });
                        }
                    }
                },
                interval: 500
            };

            this.taskRunner.start(this.tarea);
        }
        this.crearComponentes = function (params) {
            this.TaskFormValidation = TaskFormValidation;
            this.flag = true;
            this.data = '';

            //Objeto para ejecutar una tarea
            //esto me sirve para validar el formulario en el modificar
            this.taskRunner = new Ext.util.TaskRunner();

            this.panelTarjeta = new Caja.Tarjetas.PanelTarjeta({
                idioma: params.idioma,
                perfil: params.perfil,
                scope: this,
                region: 'center',
            });

            this.panelRecarga = new Caja.Tarjetas.PanelRecarga({
                idioma: params.idioma,
                perfil: params.perfil,
                scope: this,
                region: 'south',
                split: true,
                height: Ext.lib.Dom.getViewHeight() * 0.4,
            });

            if (aperturadoCaja == 1) {

                this.panelGeneral = new Ext.Panel({
                    layout: 'border',
                    frame: false,
                    border: false,
                    items: [this.panelTarjeta, this.panelRecarga]
                });
            } else {
                this.panelGeneral = new Ext.Panel({
                    layout: 'border',
                    frame: false,
                    border: false,
                    items: [this.panelTarjeta]
                });
            }

            Ext.apply(this, params);
            Ext.apply(this, {
                layout: 'fit',
                idioma: params.idioma,
                items: [this.panelGeneral]
            });
            this.panelTarjeta.lfdPeriodo.setText('Fecha contable: ' + fechaContable);
            this.panelTarjeta.btnImportar.setVisible(aperturadoCaja == 0);
        };
        //---
        this.stopTaskValidForm = function () {
            if (!Ext.isEmpty(this.tarea)) {
                this.taskRunner.stop(this.tarea);
            }
        }
        //------------------------------------------------------------------------------------------
    },
    initEventos: function () {
        this.stProveedor.on({
            scope: this,
            load: function () {
                var respuesta = this.stProveedor.reader.jsonData;
                this.aperturaTarjeta = respuesta.aperturaTarjeta;
                // this.panelTarjeta.gpTarjeta.getColumnModel().setHidden(this.panelTarjeta.gpTarjeta.getColumnModel().getIndexById('idColumCuenta'), !this.aperturaTarjeta);
                this.panelTarjeta.gpTarjeta.getColumnModel().setHidden(this.panelTarjeta.gpTarjeta.getColumnModel().getIndexById('idColumSaldoContab'), !this.aperturaTarjeta);

                if (respuesta.proveedor.cobrospagos && this.flag) {
                    this.cbProveedor.setValue(respuesta.proveedor.idclientesproveedores);
                    this.cbProveedor.setRawValue(respuesta.proveedor.nombre);

                    var datos = [];
                    for (var i = 0; i < respuesta.proveedor.cobrospagos.length; i++) {
                        if (respuesta.proveedor.cobrospagos[i].idclasificacion == 4) { // 4 es pago anticipado
                            datos.push(respuesta.proveedor.cobrospagos[i].idcuenta);
                        }
                    }
                    this.data = Ext.decode(respuesta.proveedor.data_cuenta);
                    if (!(datos.length === 0)) {
                        this.panelTarjeta.stCuentaa.baseParams.arrayIdCuenta = Ext.encode(datos);
                        this.panelTarjeta.cbxCuentaProevedor.reload();
                        this.panelTarjeta.cbxCuentaProevedor.enable();
                    } else {
                        this.panelTarjeta.cbxCuentaProevedor.disable();
                    }
                } else {
                    this.flag = false;
                }
            }
        });

        this.cbProveedor.on({
            scope: this,
            select: function (cb, record, index) {
                this.panelTarjeta.cbxCuentaProevedor.clearValue();
                var datos = [];
                for (var i = 0; i < record.json.cobrospagos.length; i++) {
                    if (record.json.cobrospagos[i].idclasificacion == 4) { // 4 es pago anticipado
                        datos.push(record.json.cobrospagos[i].idcuenta);
                    }
                }
                this.data = undefined;
                if (!(datos.length === 0)) {
                    this.panelTarjeta.stCuentaa.baseParams.arrayIdCuenta = Ext.encode(datos);
                    this.panelTarjeta.cbxCuentaProevedor.reload();
                    this.panelTarjeta.cbxCuentaProevedor.enable();
                } else {
                    this.panelTarjeta.cbxCuentaProevedor.disable();
                }
            }
        });

        this.panelTarjeta.cbxCuentaProevedor.on(
            {
                scope: this,
                load: function () {

                    var tree = this.panelTarjeta.cbxCuentaProevedor.tree;
                    var data = this.data;
                    if (!tree.getLoader().isLoading() && data) {
                        Ext.each(data, function (item) {
                            if (tree.getNodeById(item)) {
                                tree.getNodeById(item).getUI().toggleCheck(true);
                            }
                        }, this)
                    }
                    if (this.flag && data) {
                        var temp = '';
                        for (var i = 0; i < this.panelTarjeta.stCuentaa.data.items.length; i++) {
                            if (data.includes(this.panelTarjeta.stCuentaa.data.items[i].json.idcuenta)) temp = temp + this.panelTarjeta.stCuentaa.data.items[i].json.concatcta + ', ';
                        }
                        temp = temp.slice(0, -2);
                        this.panelTarjeta.cbxCuentaProevedor.setRawValue(temp);
                        this.flag = false;
                    }
                },
                beforeload: function () {
                    this.panelTarjeta.cbxCuentaProevedor.getStore().removeAll();
                }
            });
    }
});