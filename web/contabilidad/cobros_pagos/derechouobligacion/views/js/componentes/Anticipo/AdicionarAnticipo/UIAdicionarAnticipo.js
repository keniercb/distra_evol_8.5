Ext.namespace('Ext.UIAdicionarAnticipo');
Ext.UIAdicionarAnticipo= Ext.extend(Ext.Window, {
    lmask: undefined,
    url: '',
    etiquetas: undefined,
    tipoDuo: undefined,
    flujoNormal: undefined,
    tipoAccion: undefined,// 'add', 'mod'
    constructor: function (params) {
        this.url = params.url;
        this.etiquetas = params.etiquetas;
        this.tipoAccion = params.tipoAccion;
        this.tipoDuo = params.tipoDuo;
        this.flujoNormal = params.flujoNormal;
        var titulo = '';
        if (this.tipoAccion == 'add') {
            titulo = 'Adicionar ' + (this.tipoDuo == 3 ? ' cobro anticipado' : ' pago anticipado');
        } else if (this.tipoAccion == 'mod') {
            titulo = 'Modificar ' + (this.tipoDuo == 3 ? ' cobro anticipado' : ' pago anticipado');
        } else if (this.tipoAccion == 'ver') {
            titulo = 'Ver ' + (this.tipoDuo == 3 ? ' cobro anticipado' : ' pago anticipado');
        }
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.50,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            title: titulo,
            listeners: {
                scope: this,
                show: function () {
                },
                close: function () {
                }
            }
        });
        this.initializeStore();
        this.loadDataComponent();
        this.initializeClass();
        return Ext.UIAdicionarAnticipo.superclass.constructor.call(this);
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
    getForm: function () {
        return this.formUIAdicionarAnticipo;
    },
    getArrButtonsValidation: function () {
        return [this.btnGuardar];
    },
    getButtonConfirmar: function () {
        return this.btnConfirmar;
    },
    getButtonPostear: function () {
        return this.btnPostear;
    },
    initializeStore: function ()
    {

        this.recordContabilizarOperacion = Ext.data.Record.create([{
            name: 'idnomoperaciones'
        },
            {
                name: 'denominacion'
            }
        ]);

        this.stContabilizarOperacion = new Ext.data.Store({
            url: 'loadDataOperacion',
            reader: new Ext.data.JsonReader({
                id: 'idnomoperaciones'
            }, this.recordContabilizarOperacion)
        });

        this.recordCuentaOperacion = Ext.data.Record.create([{
            name: 'idcuenta'
        },
            {
                name: 'text'
            }
        ]);

        this.stCuentaOperacion = new Ext.data.Store({
            url: "/contabilidad/cobros_pagos/derechouobligacion/index.php/gestionarduofn/loadDataCuenta",
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, this.recordCuentaOperacion),
        });

        this.recordNumeroContrato = Ext.data.Record.create([{
            name: 'idcontrato'
        }, {
            name: 'numerocontrato'
        }, {
            name: 'nombrecontrato'
        }, {
            name: 'idclienteproveedor'
        }]);

        this.stNumeroContrato = new Ext.data.Store({
            url: '/contabilidad/cobros_pagos/derechouobligacion/index.php/gestionarduofn/loadContrato',
            reader: new Ext.data.JsonReader({
                id: 'idcontrato',
                totalProperty: 'cant',
                root: 'datos'
            }, this.recordNumeroContrato)
        });

        this.recordCuenta = Ext.data.Record.create([{
            name: 'idcuenta'
        },{
            name: 'idmoneda'
        }, {
            name: 'text', mapping: 'nombrecuenta'
        }]);

        this.stCuenta = new Ext.data.Store({
            url: 'cargararbolcuenta',
            reader: new Ext.data.JsonReader({
                    totalproperty: 'totalRecords',
                    id: 'id'
                },
                this.recordCuenta
                ),
            sortInfo: {
                field: "text",
                direction: "ASC"
            }
        });

        this.recordMoneda1 = Ext.data.Record.create([{
            name: 'idmonedaentidad'
        }, {
            name: 'idmoneda'
        }, {
            name: 'codigoiso'
        }
        ]);

        this.stMoneda1 = new Ext.data.Store({
            url: 'cargarmonedas',
            autoLoad: true,
            sortInfo: {
                field: "codigoiso",
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idmoneda'
            }, this.recordMoneda1)
        });

        this.recordCliente = Ext.data.Record.create([{
            name: 'idclientesproveedores'
        }, {
            name: 'nombre'
        }, {
            name: 'cobrospagos'
        }
        ]);

        this.stCliente = new Ext.data.Store({
            url: 'cargarclientes',
            sortInfo: {
                field: "nombre",
                direction: "ASC"
            },
            baseParams: {tipoDuo: this.tipoDuo},
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'idestructuracliente'
            }, this.recordCliente)
        });

        this.recordCliente = Ext.data.Record.create([{
            name: 'iddoc'
        },
            {
                name: 'denominacion'
            }
        ]);

        this.stTipo = new Ext.data.Store({
            url: 'cargartipoinstrumento',
            autoLoad: true,
            sortInfo: {
                field: "denominacion",
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'iddoc',
                totalproperty: 'totalRecords'
            }, this.recordCliente)
        });

    },
    loadDataComponent: function()
    {

    },
    initializeClass: function () {
        this.createButtons();
        this.createForm();
    },
    createButtons: function () {

        this.btnCerrar = new Ext.Button({
            scope: this,
            id: 'btnCerrar',
            iconCls: 'cancelar',
            tabIndex: 12,
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function (btn) {
                this.close();
            }
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            disabled: true,
            // hidden: this.tipoAccion === 'mod',
            iconCls: 'aplicar',
            // tabIndex: 11,
            text: 'Aplicar',
            tooltip: 'Guardar los datos',
        });

        this.btnGuardar = new Ext.Button({
            id: 'btnGuardar',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tabIndex: 14,
            disabled: true,
            tooltip: 'Guardar los datos y sin cerrar ventana',
        });

        this.btnNuevo = new Ext.Button({
            id: 'btnNuevoAnt',
            iconCls: 'nuevo',
            tabIndex: 13,
            text: 'Nuevo',
            tooltip: 'Limpiar los campos',
        });

        this.btnConfirmar = new Ext.Button({
            id: 'btnConfirmarAnt',
            iconCls: 'confirmar',
            text: 'Confirmar',
            disabled: true,
            hidden: (this.flujoNormal == 0),
            tooltip: 'Confirmar anticipo'
        });

        this.btnPostear = new Ext.Button({
            id: 'btnPostearAnt',
            iconCls: 'contabilidad',
            text: 'Postear',
            disabled: true,
            hidden: (this.flujoNormal == 0),
            tooltip: 'Postear anticipo'
        });

        if (this.tipoAccion === 'add') {
            this.buttons = [this.btnCerrar, this.btnNuevo, this.btnGuardar, this.btnConfirmar, this.btnPostear];
            // this.buttons = [this.btnCerrar, this.btnAplicar, this.btnGuardar];
        } else if (this.tipoAccion === 'mod') {
            this.buttons = [this.btnCerrar, this.btnGuardar, this.btnConfirmar, this.btnPostear];
        } else if (this.tipoAccion === 'ver') {
            this.buttons = [this.btnCerrar];
        }
    },
    createForm: function () {

        this.cbContabilizarOperacion = new Ext.form.ComboBox({
            editable: false,
            store: this.stContabilizarOperacion,
            allowBlank: false,
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            hiddenName: 'idnomoperaciones',
            disabledClass: 'disabled-component',
            id: 'cbContabilizarOperacion',
            selectOnFocus: true,
            tabIndex: 9,
            resizable: true,
            mode: 'local',
            triggerAction: 'all',
            fieldLabel: 'Operaci&oacute;n',
            anchor: '100%',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            enableKeyEvents: true,
        });

        this.cbCuentaOperacion = new Ext.contabilidad.util.linkedCombo({
            store: this.stCuentaOperacion,
            fieldLabel: 'Contrapartida',
            displayField: 'text',
            valueField: 'idcuenta',
            disabled: true,
            hideTbar: true,
            listHeight: 200,
            tabIndex: 10,
            anchor: '100%',
            mode: 'local',
            loaded: true,
            id: 'cbxCuenta',
            // hidden: (this.flujoNormal == 0)
        });

        this.cbMoneda = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            name: 'cbmoneda',
            emptyText: 'Seleccione...',
            hiddenName: 'idmonedaentidad',
            fieldLabel: 'Moneda',
            store: this.stMoneda1,
            anchor: '100%',
            tabIndex: 4,
            displayField: 'codigoiso',
            valueField: 'idmoneda',
            mode: 'local',
            readOnly: false,
            allowBlank: false,
            disabled: true,
            triggerAction: 'all',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{codigoiso}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            enableKeyEvents: true,
        });

        this.cbCliente = new Ext.form.ComboBox({
            name: 'cbcliente',
            emptyText: 'Seleccione...',
            hiddenName: this.tipoDuo === 3 ? 'idcliente' : 'idclientesproveedores',
            fieldLabel: this.tipoDuo === 3 ? 'Deudor' : 'Acreedor',
            store: this.stCliente,
            tabIndex: 3,
            pageSize: 10,
            minChars: 3,
            resizable: true,
            forceSelection: true,
            anchor: '100%',
            displayField: 'nombre',
            valueField: 'idclientesproveedores',
            mode: 'remote',
            allowBlank: false,
            triggerAction: 'all',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\.\-]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true,
        });

        this.cbTipoInstrumento = new Ext.form.ComboBox({
            name: 'cbtipoinstrumento',
            emptyText: 'Seleccione...',
            hiddenName: 'idnommoneda',
            fieldLabel: 'Tipo de instrumento',
            selectOnFocus: true,
            store: this.stTipo,
            tabIndex: 1,
            anchor: '100%',
            displayField: 'denominacion',
            valueField: 'iddoc',
            mode: 'local',
            allowBlank: false,
            triggerAction: 'all',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            enableKeyEvents: true,
        });

        this.cbcuentanormal = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            name: 'idcuenta',
            editable: false,
            emptyText: 'Seleccione...',
            fieldLabel: 'Cuenta',
            tabIndex: 4,
            disabled: false,
            hideTrigger: false,
            triggerAction: 'all',
            forceSelection: true,
            anchor: '100%',
            displayField: 'text',
            allowBlank: false,
            valueField: 'idcuenta',
            hiddenName: 'idcuenta',
            store: this.stCuenta,
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>',
            mode: 'local',
            enableKeyEvents: true,
        });

        this.cbnumeroContrato = new Ext.form.ComboBox({
            id: 'cbnumeroContrato',
            editable: false,
            forceSelection: true,
            allowBlank: true,
            resizable: true,
            tabIndex: 5,
            // emptyText: scope.etiquetas.lbSeleccione,
            fieldLabel: 'No. contrato',
            triggerAction: 'all',
            anchor: '100%',
            displayField: 'numerocontrato',
            valueField: 'idcontrato',
            store: this.stNumeroContrato,
            mode: 'local',
            tpl: '<tpl for="."><div ext:qtip="{numerocontrato}" class="x-combo-list-item">{numerocontrato}</div></tpl>',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            // enableKeyEvents: true
        });

        this.numeroinstrumento = new Ext.form.TextField({
            name: 'numeroinstrumento',
            fieldLabel: 'No. instrumento',
            maxLength: 16,
            tabIndex: 2,
            maxLengthText: "El tama&ntilde;o m&aacute;ximo permitido es de 16 carateres.",
            maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            anchor: '100%',
            allowBlank: false,
            enableKeyEvents: true,
        });

        this.tfimportecontable = new Ext.form.TextField({
            name: 'importecontable',
            fieldLabel: 'Importe contable',
            anchor: '100%',
            style: 'text-align: right',
            emptyText: '0.00',
            allowNegative: false,
            allowBlank: false,
            regex: /^((\d+(\.\d+)?)|((\d*\.)?\d+))$/,
            enableKeyEvents: true,
        });

        this.tfimporte = new Ext.form.TextField({
            name: 'importe',
            fieldLabel: 'Importe',
            anchor: '100%',
            tabIndex: 6,
            style: 'text-align: right',
            emptyText: '0.00',
            allowNegative: false,
            allowBlank: false,
            regex: /^((\d+(\.\d+)?)|((\d*\.)?\d+))$/,
            enableKeyEvents: true,
        });

        this.tfliquidadocontable = new Ext.form.TextField({
            name: 'liquidadocontable',
            fieldLabel: 'Liquidado contable',
            style: 'text-align: right',
            anchor: '100%',
            regex: /^((\d+(\.\d*)?)|((\d*\.)?\d+))$/,
            emptyText: '0.00',
            allowNegative: false,
            enableKeyEvents: true,
        });

        this.tfliquidado = new Ext.form.TextField({
            name: 'liquidado',
            fieldLabel: 'Liquidado original',
            anchor: '100%',
            // disabled: (this.flujoNormal == 1),
            disabled: true,
            tabIndex: 6,
            regex: /^((\d+(\.\d*)?)|((\d*\.)?\d+))$/,
            emptyText: '0.00',
            style: 'text-align: right',
            allowNegative: false,
            enableKeyEvents: true,
        });

        this.tfcomentario = new Ext.form.TextArea({
            name: 'comentario',
            labelAlign: 'top',
            fieldLabel: 'Comentario',
            maxLength: 255,
            maxLengthText: "El tama&ntilde;o m&aacute;ximo permitido es de 255 carateres.",
            maskRe: /^([a-zA-Z0-9-()./_, \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            anchor: '100%',
            tabIndex: 11,
            allowBlank: false,
            enableKeyEvents: true,
        });

        this.dffechaemision = new Ext.form.DateField({
            name: 'femision',
            anchor: '100%',
            tabIndex: 7,
            fieldLabel: 'Fecha emisi&oacute;n',
            format: 'd/m/Y',
            allowBlank: false,
            readOnly: true,
            enableKeyEvents: true,
        });

        this.dffecharecepcion = new Ext.form.DateField({
            name: 'frecepcion',
            anchor: '100%',
            fieldLabel: 'Fecha recepci&oacute;n',
            format: 'd/m/Y',
            allowBlank: false,
            tabIndex: 8,
            readOnly: true,
            enableKeyEvents: true,
        });


        this.formUIAdicionarAnticipo = new Ext.FormPanel({
            frame: true,
            layout: 'form',
            maskDisabled: false,
            autoHeight: true,
            labelWidth: 50,
            labelAlign: 'top',
            trackResetOnLoad: true,
            items: [{
                labelAlign: 'top',
                layout: 'column',
                autoHeight: true,
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .3,
                    items: [this.cbTipoInstrumento]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .2,
                    items: [this.numeroinstrumento]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .50,
                    items: [this.cbCliente]
                }]
            }, {
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .3,
                    items: [this.cbcuentanormal]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .2,
                    items: [this.cbnumeroContrato]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .25,
                    items: [this.cbMoneda]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .25,
                    items: [this.tfimporte]
                }, /*{
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    hidden: true,
                    columnWidth: .25,
                    items: [this.tfliquidado]
                }*/]
            }, {
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .5,
                    items: [this.dffechaemision]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .5,
                    items: [this.dffecharecepcion]
                }]
            }, {
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: 0.5,
                    items: [this.cbContabilizarOperacion]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: 0.5,
                    items: [this.cbCuentaOperacion]
                }]
            }, {
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: 1,
                    items: [this.tfcomentario]
                }]
            }
            ]
        });
        this.items = [this.formUIAdicionarAnticipo];
    }
    // getFormFields: function () {
    //     return [
    //         this.cbTipoInstrumento,
    //         this.numeroinstrumento,
    //         this.cbCliente,
    //         this.cbcuentanormal,
    //         this.cbMoneda,
    //         this.tfimporte,
    //         this.dffechaemision,
    //         this.dffecharecepcion,
    //         this.cbContabilizarOperacion,
    //         this.cbCuentaOperacion,
    //         this.tfcomentario
    //     ];
    // }
});
