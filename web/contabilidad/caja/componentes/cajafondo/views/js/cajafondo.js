//--Componete Window Caja-Fondo
Ext.ns('Caja.CajaFondo');
Caja.CajaFondo.WindowCajaFondo = Ext.extend(Ext.Window, {
    ifuncionalidad: window.parent.idFuncionalidad,
    constructor: function (params) {

        Ext.apply(this, params);
        Ext.apply(this, {
            width: 300,
            autoHeight: true,
            tipoMov: params.tipoMov,
            showCbMov: params.showCbMov,
            showWinMod: params.showWinMod,
            modal: true,
            autoValidate: true,
            constrain: true,
            closable: false,
            layout: 'fit',
            closeAction: 'close',
            frame: true,
            resizable: false,
            title: 'Definir caja-fondo',
            idioma: params.idioma,
            perfil: params.perfil,
            id: 'windowCaja'
        });
        this.addEvents('loadData');
        this.createButtons();
        this.createForm();
        this.initFunctions();
        this.initEventos();
        this.cargarCajaFondo();

        Caja.CajaFondo.WindowCajaFondo.superclass.constructor.call(this);

        this.on('show', function () {
            this.lMask = new Ext.LoadMask(this.body, {
                msg: 'Cargando...'
            });
        });
    },
    initEventos: function () {

        this.btnCancelar.on({
            scope: this,
            click: function () {
                if (!this.showWinMod)
                    window.parent.Ext.getCmp('win' + this.ifuncionalidad).close();
            }
        });

        this.on({
            scope: this,
            loadData: function (data) {
                this.idCaja = data.idCaja;
                this.nomCaja = data.nomCaja;
                this.idFondo = data.idFondo;
                this.nomFondo = data.nomFondo;
                var indexFondo = this.stFondo.find('idfondo', data.idFondo);
                this.idMoneda = this.stFondo.getAt(indexFondo).data.idmoneda;
                this.idMonedaEntidad = this.stFondo.getAt(indexFondo).data.idmonedaentidad;
                this.idCajaFondo = this.stFondo.getAt(indexFondo).data.idcajafondo;
                this.saldoAprobado = this.stFondo.getAt(indexFondo).data.saldoaprobadomo;
                this.saldoActual = this.stFondo.getAt(indexFondo).data.saldofondo;
                this.tipoFondo = this.stFondo.getAt(indexFondo).data.tipofondo;
                this.nomMoneda = this.stFondo.getAt(indexFondo).data.codigoiso;
                this.idFormaPago = this.stFondo.getAt(indexFondo).data.idformapago;
                this.tipoMovimiento = this.tipoFondo != 6 ? this.tipoFondo : this.cbMovimiento.getValue();
            },
            show: function () {
                this.cbCaja.focus(true, true);
            }
        });

        this.cbCaja.on({
            scope: this,
            select: function (combo, record, index) {
                this.cbFondo.reset();
                this.lMask.show();
                this.stFondo.load({
                    scope: this,
                    params: {
                        idcaja: record.data.idcaja,
                        tipoMov: Ext.encode(this.tipoMov)
                    },
                    callback: function (records) {
                        if (this.stFondo.getCount() === 1) {
                            this.cbFondo.setValue(this.stFondo.data.items[0].data.idfondo);
                            this.cbFondo.setRawValue(this.stFondo.data.items[0].data.denominacion);
                            this.cbFondo.fireEvent('select', this.cbFondo, this.stFondo.data.items[0]);
                            this.cbFondo.disable();
                        } else {
                            this.cbFondo.enable();
                        }
                        this.lMask.hide();
                    }
                });
            }
        });

        this.cbFondo.on({
            scope: this,
            select: function (combo, record, index) {
                if (record.data.tipofondo != 6) {//6-Entrada/Salida
                    this.cbMovimiento.setValue(record.data.tipofondo);
                } else {
                    this.cbMovimiento.setValue(3);//Ingreso/Egreso
                }
                this.cbMovimiento.disable();
            }

        });

        this.btnAceptar.on({
            scope: this,
            click: function () {
                if (this.formCajaFondo.getForm().isValid()) {
                    this.idCaja = this.cbCaja.getValue();
                    this.nomCaja = this.cbCaja.getRawValue();
                    this.idFondo = this.cbFondo.getValue();
                    this.nomFondo = this.cbFondo.getRawValue();
                    var indexFondo = this.stFondo.find('idfondo', this.idFondo);
                    this.idMonedaEntidad = this.stFondo.getAt(indexFondo).data.idmonedaentidad;
                    this.idCajaFondo = this.stFondo.getAt(indexFondo).data.idcajafondo;
                    this.idFormaPago = this.stFondo.getAt(indexFondo).data.idformapago;
                    this.saldoAprobado = this.stFondo.getAt(indexFondo).data.saldoaprobadomo;
                    this.saldoActual = this.stFondo.getAt(indexFondo).data.saldofondo;

                    var data = {
                        idCaja: this.cbCaja.getValue(),
                        nomCaja: this.cbCaja.getRawValue(),
                        idFondo: this.cbFondo.getValue(),
                        nomFondo: this.cbFondo.getRawValue()
                    }

                    this.fireEvent('loadData', data);
                    this.close();
                }
            }
        });

    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            iconCls: 'cancelar',
            selectOnFocus: true,
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos.',
            scope: this,
            handler: function () {
                this.close();
            }
        });

        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana.',
        });
        this.buttons = [this.btnCancelar, this.btnAceptar];
    },
    createForm: function () {

        this.stCaja = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                root: 'cajas',
            }, [{
                name: 'denominacion'
            }, {
                name: 'idcaja'
            }])
        });

        this.stFondo = new Ext.data.Store({
            url: '/contabilidad/caja/componentes/cajafondo/index.php/cajafondo/cargarfondo',
            reader: new Ext.data.JsonReader({
                root: 'fondos',
            }, [{
                name: 'denominacion'
            }, {
                name: 'idfondo'
            }, {
                name: 'idtipofondo'
            }, {
                name: 'idcajafondo'
            }, {
                name: 'idmoneda'
            }, {
                name: 'idmonedaentidad'
            }, {
                name: 'codigoiso',
                mapping: 'NomMoneda.codigoiso'
            }, {
                name: 'tipofondo'
            }, {
                name: 'idformapago'
            }, {
                name: 'saldoaprobadomo'
            }, {
                name: 'saldofondo'
            }
            ]),
            sortInfo: {
                field: 'denominacion',
                direction: 'ASC'
            }
        });
        //---Tipo Movimiento----------------------------
        var dataMov = [{
            idtipomovimiento: 1,
            denominacion: 'Egreso'
        }, {
            idtipomovimiento: 2,
            denominacion: 'Ingreso'
        }, {
            idtipomovimiento: 3,
            denominacion: 'Ingreso/Egreso'
        }];

        this.stMovimiento = new Ext.data.Store({
            reader: new Ext.data.JsonReader({}, [{
                name: 'idtipomovimiento',
            }, {
                name: 'denominacion',
            }
            ])
        });
        this.stMovimiento.loadData(dataMov);
        //--------------------
        this.firstElement = this.cbCaja = new Ext.form.ComboBox({
            id: 'cbCaja',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            forceSelection: true,
            emptyText: 'Seleccione...',
            fieldLabel: 'Caja',
            store: this.stCaja,
            valueField: 'idcaja',
            displayField: 'denominacion',
            hiddenName: 'idcaja',
            mode: 'local',
            allowBlank: false,
            triggerAction: 'all',
            enableKeyEvents: true,
            anchor: '100%'
        });

        this.cbFondo = new Ext.form.ComboBox({
            id: 'cbFondo',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            forceSelection: true,
            emptyText: 'Seleccione...',
            fieldLabel: 'Fondo',
            store: this.stFondo,
            valueField: 'idfondo',
            displayField: 'denominacion',
            hiddenName: 'idfondo',
            mode: 'local',
            allowBlank: false,
            triggerAction: 'all',
            enableKeyEvents: true,
            anchor: '100%'
//            typeAhead: true,
//            disabled: true,
        });

        this.cbMovimiento = new Ext.form.ComboBox({
            id: 'cbMov',
            disabledClass: 'disabled-component',
            emptyText: 'Seleccione...',
            forceSelection: true,
            fieldLabel: 'Movimiento que realiza',
            store: this.stMovimiento,
            valueField: 'idtipomovimiento',
            displayField: 'denominacion',
            hiddenName: 'idtipomovimiento',
            typeAhead: true,
            enableKeyEvents: true,
            mode: 'local',
            allowBlank: false,
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            editable: false,
            anchor: '100%',
            disabled: true
        });

        this.formCajaFondo = new Ext.FormPanel({
            id: 'formCajaFondo',
            frame: true,
            labelAlign: 'top',
            width: 285,
            autoHeight: true,
            items: [{
                layout: 'column',
                autoHeight: true,
                anchor: '100%',
                items: [{
                    columnWidth: 1.0,
                    layout: 'form',
                    items: [this.cbCaja, this.cbFondo]
                }]
            }]
        });

        if (this.showCbMov)
            this.formCajaFondo.add(this.cbMovimiento);

        this.items = this.formCajaFondo;
    },
    initFunctions: function () {
        this.cargarCajaFondo = function (select) {
            Ext.Ajax.request({
                url: '/contabilidad/caja/componentes/cajafondo/index.php/cajafondo/loadDataCajaFondo',
                method: 'POST',
                scope: this,
                params: {
                    tipoMov: Ext.encode(this.tipoMov)
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    this.stCaja.loadData(responseData);
                    this.stFondo.loadData(responseData);
                    if (responseData.cajas.length === 0) {
                        mostrarMensaje(1, 'No existen fondos configurados para su usuario.');
                    }
                    if (responseData.cajas.length === 1) {
                        this.cbCaja.setValue(responseData.cajas[0].idcaja);
                        this.cbCaja.disable();
                        if (responseData.fondos) {
                            if (responseData.fondos.length === 1) {
                                this.cbFondo.setValue(responseData.fondos[0].idfondo);
                                this.cbFondo.disable();
                                var data = {
                                    idCaja: responseData.cajas[0].idcaja,
                                    nomCaja: responseData.cajas[0].denominacion,
                                    idFondo: responseData.fondos[0].idfondo,
                                    nomFondo: responseData.fondos[0].denominacion
                                };
                                if (!this.showWinMod && responseData.fondos[0].tipofondo != 6)//6-Ingreso/Egreso
                                    this.fireEvent('loadData', data);
                                else {
                                    this.cbMovimiento.setValue(3);//Ingreso/Egreso
                                    this.show();
                                }
                            } else {
                                this.show();
                            }
                        }
                        if (this.showWinMod) {
                            this.show();
                            this.cbFondo.fireEvent('select', this.cbFondo, this.stFondo.data.items[0]);
                        }
                    } else {
                        this.show()
                    }
                }
            });
        };
    }
});