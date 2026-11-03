Ext.namespace('Ext.ClassLiquidarPorCliente');
Ext.ClassLiquidarPorCliente = Ext.extend(Ext.Component, {
    lmask: undefined,
    url: '',
    WindowLiq: undefined,
    params: undefined,
    tipoContabilizacion: undefined,
    sumaControl: 0,
    constructor: function(params)
    {
        Ext.apply(this, params);
        this.addEvents('closeWinLiquidarAll');
        this.params = params;
        // perfil = window.parent.perfil;

        this.loadMessageBox();
        this.initializeClass();

        Ext.ClassLiquidarPorCliente.superclass.constructor.call(this);
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
            this.lmask = new Ext.LoadMask(this.body, {
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
    createWindowComponent: function()
    {
        this.WindowLiq = new Ext.UILiquidarPorCliente(this.params);
    },

    getWindow: function()
    {
        return this.WindowLiq;
    },
    showWindow: function()
    {
        this.WindowLiq.show();
    },
    closeLiquidar: function()
    {
        this.WindowLiq.close();
    },
    initializeClass: function () {

        this.createWindowComponent();
        if (this.tipoContabilizacion == 1) {
            this.initializeEventsLiquidar.call(this.getWindow(), this);
        } else if (this.tipoContabilizacion == 2) {
            this.initializeEventsCancelacion.call(this.getWindow(), this);
        }
        this.initializeFunctions.call(this.getWindow(), this);
        this.initializeDataIni.call(this.getWindow(), this);
    },
    initializeDataIni: function (cmp) {
        if (cmp.parametros) {
            this.cbAddClienteProveedor.setValue(cmp.parametros.idcliente);
            var storeLiq = this.gridPanelObligaciones.getStore();
            storeLiq.baseParams.idclienteproveedor = cmp.parametros.idcliente;
            storeLiq.baseParams.trabajador = (cmp.parametros.idtipoderechouobligacion == 3);
            if (this.tipoContabilizacion == 1) {
                storeLiq.load({
                    scope: this,
                    callback: function (records, opt, success) {
                        if (records.length == 0) {
                            cmp.hideMessageBox();
                            mostrarMensaje(1, 'El ' + (this.tipoDuo === 1 ? 'Cliente' : 'Proveedor') + ' no tiene obligaciones para liquidar.');
                            cmp.fireEvent('closeWinLiquidarAll');
                        } else {
                            this.stLiquidarOperacion.load();
                            cmp.showWindow();
                            this.setearValorVisible();
                        }
                    }
                });
            } else if (this.tipoContabilizacion == 2) {
                storeLiq.baseParams.numeroFact = cmp.parametros.numero;
                storeLiq.load({
                    scope: this,
                    callback: function (records, opt, success) {
                        if (records.length == 0) {
                            cmp.hideMessageBox();
                            mostrarMensaje(1, 'La liquidación que desea cancelar no se realizó por la funcionalidad de Liquidación directa.');
                        } else {
                            cmp.showWindow();
                            this.searchField.setValue(cmp.parametros.numero);
                            this.searchField.triggers[0].show();
                            this.searchField.hasSearch = true;
                            this.setearValorVisible();
                        }
                    }
                });
            }
        } else {
            if (this.tipoContabilizacion == 1) {
                this.stLiquidarOperacion.load();
            }
            cmp.showWindow();
        }
    },
    initializeEventsComun: function (cmp) {

        this.on({
            scope: this,
            beforeshow: function () {
                cmp.hideMessageBox();
            },
            show: function () {
                this.formUILiquidarPorCliente.getForm().isValid();
            },
            close: function () {
                cmp.fireEvent('closeWinLiquidarAll');
            }
        });
        this.btnAceptar.setHandler(function () {
            this.fLiquidar();
        }, this);

        this.stAddClienteProveedor.on({
            scope: this,
            load: function (combo, record, index) {
                if (record.length == 0) {
                    var mensaje = '';
                    if (this.tipoContabilizacion == 1) {
                        if (this.tipoDuo == 1) {
                            mensaje = 'No existen clientes con obligaciones pendientes a liquidar.';
                        }
                        else {
                            mensaje = 'No existen proveedores con obligaciones pendientes a liquidar.';
                        }
                    } else {
                        if (this.tipoDuo == 1) {
                            mensaje = 'No existen clientes con liquidaciones que se puedan cancelar.';
                        }
                        else {
                            mensaje = 'No existen proveedores con liquidaciones que se puedan cancelar.';
                        }
                    }
                    mostrarMensaje(1, mensaje);
                }
            },
            beforeload: function (combo, record, index) {
                // Ext.Msg.wait('Cargando...', 'Por favor espere...');
            }
        });

        this.cbAddClienteProveedor.on({
            scope: this,
            select: function (combo, record, index) {
                var storeLiq = this.gridPanelObligaciones.getStore();
                storeLiq.baseParams.idclienteproveedor = record.get ? record.get('idcliente') : record;
                if (this.tipoContabilizacion == 1) {
                    storeLiq.baseParams.subordinadas = this.ckbAddSubordinadas.getValue();
                }
                storeLiq.load();
                this.btnAddLiquidacion.enable();
            }
        });

        this.ckbAddClienteProv.on('check', function () {
            this.btnAddLiquidacion.disable();
            if (this.ckbAddClienteProv.getValue() === true) {
                this.ckbAddTrabajador.setValue(false);
                this.stAddClienteProveedor.baseParams.esClienteProv = this.ckbAddClienteProv.getValue();
                this.cbAddClienteProveedor.clearValue();
                this.stAddClienteProveedor.removeAll();
                this.stAddClienteProveedor.load({
                    params: {
                        start: 0,
                        limit: 10
                    }
                });
                var storeLiq = this.gridPanelObligaciones.getStore();
                storeLiq.baseParams.trabajador = this.ckbAddTrabajador.getValue();
                storeLiq.removeAll();
            } else if (this.ckbAddClienteProv.getValue() === false && this.ckbAddTrabajador.getValue() === false) {
                this.ckbAddTrabajador.setValue(true);
            }
        }, this);

        this.ckbAddTrabajador.on('check', function () {
            this.btnAddLiquidacion.disable();
            if (this.ckbAddTrabajador.getValue() === true) {
                this.ckbAddClienteProv.setValue(false);
                this.stAddClienteProveedor.baseParams.esClienteProv = this.ckbAddClienteProv.getValue();
                this.cbAddClienteProveedor.clearValue();
                this.stAddClienteProveedor.removeAll();
                this.stAddClienteProveedor.load({
                    params: {
                        start: 0,
                        limit: 10
                    }
                });
                var storeLiq = this.gridPanelObligaciones.getStore();
                storeLiq.baseParams.trabajador = this.ckbAddTrabajador.getValue();
                storeLiq.removeAll();
                storeLiq.baseParams.idclienteproveedor = '';
                storeLiq.load();
            } else if (this.ckbAddClienteProv.getValue() === false && this.ckbAddTrabajador.getValue() === false) {
                this.ckbAddClienteProv.setValue(true);
            }
        }, this);

    },
    initializeEventsLiquidar: function (cmp) {

        cmp.initializeEventsComun.call(this, cmp);

        this.stLiquidarOperacion.on('load', function (store, records, opt) {
            if (records.length <= 0){
                mostrarMensaje(1, cmp.etiquetas.lbMsgNoOperaciones);
            } else if (records.length === 1) {
                this.cbLiquidarOperacion.setValue(records[0].get('idnomoperaciones'));
                this.cbLiquidarOperacion.fireEvent('select', null, records[0], 0);
                this.cbLiquidarOperacion.disable();
            } else {
                this.cbLiquidarOperacion.enable();
            }
        }, this);

        this.cbLiquidarOperacion.on('select', function (combo, record, index) {
            this.cbLiquidarCuenta.reset();
            var modelo = this.stLiquidarOperacion.data.items[index].json.modelo;
            var idcuenta = [];
            if (modelo) {
                for (var i = 0; i < modelo.length; i++) {
                    if (modelo[i].cuentas) {
                        var temp = Ext.decode(modelo[i].cuentas);
                        idcuenta.push(temp.idcuenta);
                    }

                }
                if (idcuenta.length > 0) {
                    this.stLiquidarCuenta.baseParams.arrayIdCuenta = Ext.encode(idcuenta);
                    this.cbLiquidarCuenta.load();
                    // this.cbLiquidarCuenta.enable();
                } else {
                    mostrarMensaje(1, "Por favor configure correctamente el modelo de la operaci&oacute;n");
                }
            } else {
                mostrarMensaje(1, "La operaci&oacute;n asignada no tiene ningun modelo asociado");
                // this.cbLiquidarCuenta.disable();
            }
        }, this);

        this.cbLiquidarCuenta.on({
            scope: this,
            load: function (data) {
                var respondetext = Ext.decode(data.responseText);
                if (respondetext.datos.length == 1) {
                    this.cbLiquidarCuenta.setValue(respondetext.datos[0].idcuenta, respondetext.datos[0].text);
                    this.cbLiquidarCuenta.fireEvent('select', this.cbLiquidarCuenta, {data: respondetext.datos[0]}, 0);
                }
                this.cbLiquidarCuenta.enable();
                this.formUILiquidarPorCliente.getForm().isValid();
            },
            select: function (combo, record, index) {
                // if (!(/^699/.test(record.data.concatcta) || /^696\./.test(record.data.concatcta))) {
                //     this.stLiquidar.baseParams.idmoneda = record.data.idmoneda;
                // } else {
                //     this.stLiquidar.baseParams.idmoneda = undefined;
                // }
                // this.fSelectClienteProveedor();
            }
        });

        this.ckbAddSubordinadas.on({
            scope: this,
            check: function (checkbox, newValue, oldValue) {
                this.fSelectClienteProveedor();
            }
        });

        this.smObligaciones.on({
            scope: this,
            selectionchange: function (selModel) {
                this.actualizarResto(selModel);
            }
        });

        this.gridPanelObligaciones.on({
            scope: this,
            afteredit: function (e) {
                if (e.value > parseFloat(e.record.get('importependiente'))) {
                    var importe = parseFloat(e.record.get('importependiente'));
                    e.record.set('importealiquidar', importe);
                    e.record.commit();
                    mostrarMensaje(1, 'El importe a liquidar no puede ser mayor que el importe pendiente');
                }
                this.actualizarResto(this.smObligaciones);
            },
            render: function () {
                if (this.gridPanelObligaciones.hasListener('rowmousedown')) {
                    this.gridPanelObligaciones.events['rowmousedown'].clearListeners();
                }
            }
        });

        this.nfImporteIns.on({
            scope: this,
            keyup: function (nf, e) {
                this.fsetDiff();
            }
        });

        this.stLiquidar.on({
            scope: this,
            load: function (store, records, opcions) {
                // if (records.length == 0 && this.stLiquidar.baseParams.idmoneda) {
                //     var modena = this.stLiquidarCuenta.getAt(this.stLiquidarCuenta.find('idcuenta', this.cbLiquidarCuenta.getValue()));
                //     mostrarMensaje(1, 'No existen obligaciones con la moneda ' + modena.json.codigoiso);
                // }
                this.btnAddLiquidacion.enable();
            }
        });

        this.btnAddLiquidacion.on({
            scope: this,
            click: function () {
                var storeLiq = this.gridPanelObligaciones.getStore();
                var add = new Ext.ClassLiquidarPorCliente.AddLiq.Controller({
                    loadMessageBox: cmp.loadMessageBox,
                    tipoDuo: cmp.tipoDuo,
                    etiquetas: cmp.etiquetas,
                    parametrosBase: storeLiq.baseParams,
                    records: this.smObligaciones.getSelections()
                });

                add.on({
                    scope: this,
                    adicionar: function (records) {
                        var storeLiq = this.gridPanelObligaciones.getStore();
                        storeLiq.removeAll();
                        storeLiq.add(records);
                        this.smObligaciones.selectAll()
                        this.actualizarResto(this.smObligaciones);
                    }
                });
            }
        });

    },
    initializeEventsCancelacion: function (cmp) {

        cmp.initializeEventsComun.call(this, cmp);

        this.dateFieldInicio.on({
            scope: this,
            change: function (field, newVal, oldVal) {
                this.dateFieldFin.setMinValue(newVal);
                var storeLiq = this.gridPanelObligaciones.getStore();
                storeLiq.baseParams.fechainicio = newVal.toLocaleDateString();
            },
            render: function (field) {
                var storeLiq = this.gridPanelObligaciones.getStore();
                if (!cmp.parametros) {
                    storeLiq.baseParams.fechainicio = this.desde;
                } else {
                    field.reset();
                }
            }
        });

        this.dateFieldFin.on({
            scope: this,
            change: function (field, newVal, oldVal) {
                this.dateFieldInicio.setMaxValue(newVal);
                var storeLiq = this.gridPanelObligaciones.getStore();
                storeLiq.baseParams.fechafin = newVal.toLocaleDateString();
            },
            render: function (field) {
                var storeLiq = this.gridPanelObligaciones.getStore();
                if (!cmp.parametros) {
                    storeLiq.baseParams.fechafin = this.fechaContable;
                } else {
                    field.reset();
                }
            }
        });

        this.btnBuscar.setHandler(function () {
            if (this.cbAddClienteProveedor.getValue()) {
                this.gridPanelObligaciones.getStore().load();
            } else {
                mostrarMensaje(1, 'Seleccione un ' + this.cbAddClienteProveedor.initialConfig.fieldLabel);
            }
        }, this);


        this.smLiquidaciones.on({
            scope: this,
            selectionchange: function (selModel) {
                var arrRecords = selModel.getSelections();
                var total = 0;
                arrRecords.forEach(function (element, index, arr) {
                    total += element.get('importealiquidar');
                }, this);
                this.nfImporteACancelar.setValue(parseFloat(total.toFixed(2)));
            }
        });

    },
    initializeFunctions: function(cmp)
    {
        this.fLiquidar = function()
        {
            var data = this.gridPanelObligaciones.getSelectionModel().getSelections();
            // var TotalLiq = 0;
            var arrayIdDuo = [];
            var arrayCuentas = [];
            for (var i = 0; i < data.length; i++) {
                // TotalLiq += data[i].get('importealiquidar');
                arrayCuentas.push({
                    idcuenta: cmp.tipoContabilizacion == 1 ? this.cbLiquidarCuenta.getValue() : data[i].get('idcuenta'),
                    importemo: data[i].get('importealiquidar'),
                    idliquidacion: data[i].get('idliquidacion'),
                });
                arrayIdDuo.push({
                    arrayCuentas: arrayCuentas,
                    importeliquidar: data[i].get('importealiquidar'),
                    idderechouobligacion: data[i].get('idderechouobligacion'),
                    numinst: data[i].get('noinst') ? data[i].get('noinst') : undefined
                });
                arrayCuentas = [];
            }

            var parametros = {
                tipoDuo: this.tipoDuo,
                fecha: this.dateFieldLiq ? this.dateFieldLiq.getValue() : this.fechaContable,
                arrayIdDuo: Ext.encode(arrayIdDuo),
                idoperacion: this.cbLiquidarOperacion ? this.cbLiquidarOperacion.getValue() : '',
                tipoContabilizacion: cmp.tipoContabilizacion,
                comentario: this.tfComentario.getValue(),
                numeroInst: this.tfNumeroInst ? this.tfNumeroInst.getValue() : '',
            };
            cmp.fireEvent('LiquidarAll', parametros);
        };

        this.fSelectClienteProveedor = function () {
            if (this.cbAddClienteProveedor.getValue()) {
                this.cbAddClienteProveedor.fireEvent('select', this.cbAddClienteProveedor, this.stAddClienteProveedor.getAt(this.stAddClienteProveedor.find('idcliente', this.cbAddClienteProveedor.getValue())) ? this.stAddClienteProveedor.getAt(this.stAddClienteProveedor.find('idcliente', this.cbAddClienteProveedor.getValue())) : this.cbAddClienteProveedor.getValue());
            }
        };

        this.setearValorVisible = function () {
            this.cbAddClienteProveedor.setRawValue(cmp.parametros.nombrecliente);
            this.ckbAddClienteProv.suspendEvents();
            this.ckbAddTrabajador.suspendEvents();
            this.ckbAddClienteProv.setValue((cmp.parametros.idtipoderechouobligacion == 1 || cmp.parametros.idtipoderechouobligacion == 2));//1 cliente prov, 2- parrafo fiscal, 3 trabajador
            this.ckbAddTrabajador.setValue((cmp.parametros.idtipoderechouobligacion == 3));
            this.ckbAddClienteProv.resumeEvents();
            this.ckbAddTrabajador.resumeEvents();
        };

        this.actualizarResto = function (selModel) {
            var arrRecords = selModel.getSelections();
            var total = 0;
            arrRecords.forEach(function (element, index, arr) {
                total += element.get('importealiquidar');
            }, this);
            cmp.sumaControl = parseFloat(total.toFixed(2));
            this.labelTotal.setText(formatoMoneda(cmp.sumaControl));
            this.fsetDiff();
        };

        this.fsetDiff = function () {
            this.nfImporteDiff.setValue(parseFloat((this.nfImporteIns.getValue() - cmp.sumaControl).toFixed(2)));
        };
    }
});