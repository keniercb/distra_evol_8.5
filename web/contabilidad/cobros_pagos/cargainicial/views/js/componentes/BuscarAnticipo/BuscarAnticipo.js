Ext.namespace('Ext.BuscarAnticipo');
Ext.BuscarAnticipo.WindowBuscarAnticipo = Ext.extend(Ext.Window, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.50,
            closeAction: 'hide',
            closable: false,
            frame: true,
            resizable: false,
            // idioma: params.idioma,
            title: this.tipoDuo === 3 ? 'Buscar cobro anticipado' : 'Buscar pago anticipado',
            cargado: false
        });
        this.createButtons(this);
        this.createForm(this);
        this.initFunctions(this);
        Ext.BuscarAnticipo.WindowBuscarAnticipo.superclass.constructor.call(this);
        this.initEventos(this);
        this.initializeKeyMap(this);

    },
    createButtons: function (scope) {
        scope.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            iconCls: 'cancelar',
            tabIndex: 11,
            text: 'Cancelar',
            tooltip: scope.tipoDuo === 3 ? 'Cerrar ventana sin buscar el cobro anticipado' : 'Cerrar ventana sin buscar el pago anticipado',
        });
        scope.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            iconCls: 'aceptar',
            tabIndex: 12,
            text: 'Aceptar',
            // disabled: true,
            tooltip: scope.tipoDuo === 3 ? 'Buscar el cobro anticipado y cerrar ventana' : 'Buscar el pago anticipado y cerrar ventana',
        });
        scope.buttons = [scope.btnCancelar, scope.btnAceptar];
    },
    createForm: function (scope) {

        scope.stAddCuenta = new Ext.data.JsonStore({
            url: 'busquedaExistentes',
            root: 'cuentas',
            autoLoad: false,
            baseParams: {
                elemento: 'getCuentas',
                tipoDuo: scope.tipoDuo,
            },
            fields: [
                {name: 'idcuenta'},
                {name: 'text'},
            ],
            sortInfo: {
                field: 'idcuenta',
                direction: 'ASC'
            },
            listeners: {
                load: function () {
                    scope.cbcuentanormalBusqueda.enable();
                }
            }
        });

        scope.cbcuentanormalBusqueda = new Ext.form.ComboBox({
            store: scope.stAddCuenta,
            valueField: 'idcuenta',
            emptyText: 'Seleccione...',
            displayField: 'text',
            fieldLabel: 'Cuenta',
            anchor: '100%',
            triggerAction: 'all',
            mode: 'local',
            id: 'cbcuenta',
            name: 'cbcuenta',
            tabIndex: 4,
            disabled: true,
            // readOnly: true,
            // editable: false,
            allowBlank: true,
            forceSelection: true,
            enableKeyEvents: true,
            selectOnFocus: true,
            tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>'
        });

        scope.stEstado = new Ext.data.Store({
            url: 'busquedaExistentes',
            autoLoad: false,
            baseParams: {
                elemento: 'estadoAnticipo',
                tipoDuo: scope.tipoDuo,
            },
            reader: new Ext.data.JsonReader({
                root: 'estadoAnticipo',
            }, [{
                name: 'idestadodocfnz'
            }, {
                name: 'descripcion'
            }
            ]),
            listeners: {
                load: function () {
                    scope.cbEstado.enable();
                }
            }
        });

        scope.stNoComprobante = new Ext.data.Store({
            url: 'busquedaExistentes',
            autoLoad: false,
            baseParams: {
                elemento: 'numeroComprobante',
                tipoDuo: scope.tipoDuo,
            },
            reader: new Ext.data.JsonReader({
                root: 'numeroComprobante',
            }, [{
                name: 'numcomprobante'
            },{
                name: 'idcomprobante'
            }
            ]),
            listeners: {
                load: function () {
                    scope.noComprobante.enable();
                }
            }
        });

        scope.cbEstado = new Ext.form.ComboBox({
            store: scope.stEstado,
            valueField: 'idestadodocfnz',
            emptyText: 'Seleccione...',
            displayField: 'descripcion',
            fieldLabel: 'Estado',
            anchor: '100%',
            triggerAction: 'all',
            tabIndex: 7,
            mode: 'local',
            id: 'cbestado',
            name: 'cbestado',
            readOnly: true,
            editable: false,
            allowBlank: true,
            disabled: true,
            forceSelection: true,
            enableKeyEvents: true,
            selectOnFocus: true
        });

        scope.noComprobante = new Ext.form.ComboBox({
            id: 'noComprobante',
            name: 'nocomprobante',
            fieldLabel: 'No.Comprobante',
            tabIndex: 8,
            anchor: '100%',
            disabled: true,
            emptyText: 'Seleccione...',
            allowBlank: true,
            selectOnFocus: true,
            store: scope.stNoComprobante,
            displayField: 'numcomprobante',
            valueField: 'idcomprobante',
            mode: 'local',
            triggerAction: 'all',
            forceSelection: true,
            tpl: '<tpl for="."><div ext:qtip="{numcomprobante}" class="x-combo-list-item">{numcomprobante}</div></tpl>',
        });

        scope.stTipo = new Ext.data.Store({
            url: 'busquedaExistentes',
            autoLoad: false,
            baseParams: {
                elemento: 'tipoInstrumento',
                tipoDuo: scope.tipoDuo,
            },
            sortInfo: {
                field: "denominacion",
                direction: "ASC"
            },
            listeners: {
                load: function (store, records, opts) {
                    scope.cbTipoInstrumento.enable();
                }
            },
            reader: new Ext.data.JsonReader({
                root: 'tipoInstrumento',
                id: 'idtipodocumento',
            }, [{
                name: 'idtipodocumento'
            },
                {
                    name: 'denominacion'
                }
            ])
        });

        scope.stnumeroInstrumento = new Ext.data.Store({
            url: 'busquedaExistentes',
            autoLoad: false,
            baseParams: {
                elemento: 'numeroInstrumento',
                tipoDuo: scope.tipoDuo,
            },
            reader: new Ext.data.JsonReader({
                root: 'numeroInstrumento',
            }, [{
                name: 'numerodocumento'
            }
            ]),
            listeners: {
                load: function () {
                    scope.numeroinstrumento.enable();
                }
            }
        });

        scope.cbTipoInstrumento = new Ext.form.ComboBox({
            name: 'cbtipoinstrumento',
            emptyText: 'Seleccione...',
            hiddenName: 'idnommoneda',
            fieldLabel: 'Tipo de instrumento',
            selectOnFocus: true,
            disabled: true,
            store: scope.stTipo,
            tabIndex: 1,
            anchor: '100%',
            displayField: 'denominacion',
            valueField: 'idtipodocumento',
            mode: 'local',
            allowBlank: true,
            triggerAction: 'all',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                keypress: function (t, e) {
                },
            }
        });

        scope.numeroinstrumento = new Ext.form.ComboBox({
            name: 'numeroinstrumento',
            fieldLabel: 'No. instrumento',
            emptyText: 'Seleccione...',
            tabIndex: 2,
            anchor: '100%',
            allowBlank: true,
            disabled: true,
            selectOnFocus: true,
            store: scope.stnumeroInstrumento,
            displayField: 'numerodocumento',
            valueField: 'numerodocumento',
            mode: 'local',
            triggerAction: 'all',
            forceSelection: true,
            tpl: '<tpl for="."><div ext:qtip="{numerodocumento}" class="x-combo-list-item">{numerodocumento}</div></tpl>',
        });

        scope.stCliente = new Ext.data.Store({
            url: 'busquedaExistentes',
            autoLoad: false,
            baseParams: {
                elemento: 'clientesProeveedor',
                tipoDuo: scope.tipoDuo,
            },
            listeners: {
                load: function (st, recors) {
                    if (recors.length == 0) {
                        if (scope.tipoDuo === 3) {
                            mostrarMensaje(1, 'Los deudores no tienen la(s) cuenta(s) de cobro anticipado configurada(s).');
                        } else if (scope.tipoDuo === 4) {
                            mostrarMensaje(1, 'Los acreedores no tienen la(s) cuenta(s) de pago anticipado configurada(s).');
                        }
                    } else {
                        scope.cbCliente.enable();
                    }
                },
            },
            reader: new Ext.data.JsonReader({
                root: 'clientesProeveedor',
                id: 'idcliente'
            }, [{
                name: 'idcliente'
            }, {
                name: 'nombre'
            }
            ])
        });

        scope.cbCliente = new Ext.form.ComboBox({
            name: 'clientesProeveedor',
            emptyText: 'Seleccione...',
            hiddenName: 'clientesProeveedor',
            fieldLabel: scope.tipoDuo === 3 ? 'Deudor' : 'Acreedor',
            store: scope.stCliente,
            tabIndex: 3,
            disabled: true,
            resizable: true,
            forceSelection: true,
            anchor: '100%',
            displayField: 'nombre',
            valueField: 'idcliente',
            mode: 'local',
            allowBlank: true,
            triggerAction: 'all',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                select: function (field, record, index) {
                },
                beforequery: function (queryEvent) {
                    //intersecto la query para convertira en un regex para que considere la palabra completa y no el inicio
                    if (queryEvent.query) {
                        var len = queryEvent.query.length;
                        queryEvent.query = new RegExp(Ext.escapeRe(queryEvent.query), 'i');
                        queryEvent.query.length = len;//es nesesario hacer esto sino el  metodo que llama el combobox no pincha
                    }
                }
            }
        });

        scope.nfImporte = new Ext.form.NumberField({
            id: 'idnfImporte',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Importe',
            name: 'Importe',
            style: 'text-align: right',
            tabIndex: 5,
            allowDecimals: true,
            enableKeyEvents: false,
            allowBlank: true,
            maxLength: 24,
            emptyText: '0.00',
            anchor: '100%'
        });

        scope.stMoneda = new Ext.data.Store({
            url: 'cargarmonedas',
            autoLoad: false,
            sortInfo: {
                field: "codigoiso",
                direction: "ASC"
            }, //ASC|DESC
            listeners: {
                load: function (st, records, opt) {
                    scope.cbMoneda.enable();
                }
            },
            reader: new Ext.data.JsonReader({
                root: 'monedas',
                id: 'idmoneda'
            }, [{
                name: 'idmonedaentidad'
            }, {
                name: 'idmoneda'
            }, {
                name: 'codigoiso'
            }
            ])
        });

        scope.cbMoneda = new Ext.form.ComboBox({
            name: 'cbmoneda',
            emptyText: 'Seleccione...',
            hiddenName: 'idmonedaentidad',
            fieldLabel: 'Moneda',
            store: scope.stMoneda,
            anchor: '100%',
            tabIndex: 6,
            displayField: 'codigoiso',
            valueField: 'idmoneda',
            mode: 'local',
            readOnly: false,
            allowBlank: true,
            disabled: true,
            triggerAction: 'all',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{codigoiso}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                keypress: function (t, e) {
                },
                select: function (field, record, index) {
                }
            }
        });

        scope.dffechainicio = new Ext.form.DateField({
            name: 'finicio',
            anchor: '100%',
            tabIndex: 9,
            fieldLabel: 'Fecha inicio',
            format: 'd/m/Y',
            allowBlank: true,
            readOnly: true,
            listeners: {
                change: function (dateField, newValue, oldValue) {
                    scope.dffechafin.setMinValue(newValue);
                }
            }
        });

        scope.dffechafin = new Ext.form.DateField({
            name: 'ffin',
            anchor: '100%',
            fieldLabel: 'Fecha fin',
            format: 'd/m/Y',
            tabIndex: 10,
            readOnly: true,
            listeners: {
                change: function (dateField, newValue, oldValue) {
                    scope.dffechainicio.setMaxValue(newValue);
                }
            }
        });

        scope.formBuscarAnticipo = new Ext.FormPanel({
            frame: true,
            border: false,
            // width: 650,
            autoHeight: true,
            region: 'center',
            items: [{
                labelAlign: 'top',
                layout: 'column',
                autoHeight: true,
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .25,
                    items: [scope.cbTipoInstrumento]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .25,
                    items: [scope.numeroinstrumento]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .50,
                    items: [scope.cbCliente]
                }]
            }, {
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .50,
                    items: [scope.cbcuentanormalBusqueda]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .25,
                    items: [scope.nfImporte]
                }, {
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .25,
                    items: [scope.cbMoneda]
                }, /*{
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .25,
                        items: [cbnumeroContrato]
                    }*/]
            }, {
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .5,
                    items: [scope.cbEstado]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .5,
                    items: [scope.noComprobante]
                }]
            }, {
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .5,
                    items: [scope.dffechainicio]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .5,
                    items: [scope.dffechafin]
                }]
            }
            ]
        });

        scope.items = [scope.formBuscarAnticipo];
    },
    initFunctions: function (scope) {
        scope.busquedaEspecializada = function () {
            scope.store.baseParams = {
                start: 0,
                limit: 20,
                tipoDuo: scope.tipoDuo,
                filtro: Ext.encode({
                    tipoinstrumento: scope.cbTipoInstrumento.getValue(),
                    numeroinstrumento: scope.numeroinstrumento.getValue(),
                    idcliente: scope.cbCliente.getValue(),
                    idcuenta: scope.cbcuentanormalBusqueda.getValue(),
                    idmoneda: scope.cbMoneda.getValue(),
                    importe: scope.nfImporte.getValue(),
                    // numerocontrato: scope.cbnumeroContrato.getValue(),
                    fechainicio: scope.dffechainicio.getRawValue(),
                    fechafin: scope.dffechafin.getRawValue(),
                    idestado: scope.cbEstado.getValue(),
                    nocomprobante: scope.noComprobante.getValue()
                })
            };
            scope.store.load({
                callback: function (records, opt, success) {
                    if (records.length === 0) {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.');
                    }
                }
            });
        };

        scope.limpiarValores = function () {
            scope.cbTipoInstrumento.clearValue();
            scope.numeroinstrumento.clearValue();
            scope.cbCliente.clearValue();
            scope.cbcuentanormalBusqueda.clearValue();
            scope.cbMoneda.clearValue();
            scope.nfImporte.reset();
            scope.dffechainicio.reset();
            scope.dffechafin.reset();
            scope.cbEstado.clearValue();
            scope.noComprobante.clearValue();
        };

        scope.loadStores = function () {
            scope.loadMaskk();
            Ext.Ajax.request({
                url: 'busquedaExistentes',
                method: 'POST',
                params: {
                    elemento: 'todosLosElementos',
                    tipoDuo: scope.tipoDuo,
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codM == -1) {
                        mostrarMensaje(1, 'Los parametros pedidos son incorrectos');
                        mask.hide();
                    } else {
                        scope.stMoneda.loadData(responseData);
                        scope.stCliente.loadData(responseData);
                        scope.stnumeroInstrumento.loadData(responseData);
                        scope.stTipo.loadData(responseData);
                        scope.stNoComprobante.loadData(responseData);
                        scope.stEstado.loadData(responseData);
                        scope.stAddCuenta.loadData(responseData);
                        mask.hide();
                        scope.cbTipoInstrumento.focus(true, 100);
                    }
                }
            });

        };

        scope.loadMaskk = function () {
            mask = new Ext.LoadMask(scope.body, {
                msg: 'Cargando...'
            });
            mask.show();
        }

    },
    initEventos: function (scope) {
        scope.btnAceptar.on({
            click: function () {
                scope.hide();
                scope.busquedaEspecializada();
                scope.limpiarValores();
            }
        });
        scope.btnCancelar.on({
            click: function () {
                scope.hide();
                scope.limpiarValores();
            }
        });

        scope.on({
            show: function () {
                scope.cbTipoInstrumento.focus(true, 100);
                scope.keyMapAdd.enable();
            }
        });


    },
    initializeKeyMap: function (scope) {
        scope.keyMapAdd = new Ext.KeyMap(document, [
            {
                key: Ext.EventObject.ESC,//ESCAPE Cerrar ventana
                alt: false,
                fn: function () {
                    scope.hide();
                    scope.keyMapAdd.disable();
                }
            }
        ]);
    }
});
