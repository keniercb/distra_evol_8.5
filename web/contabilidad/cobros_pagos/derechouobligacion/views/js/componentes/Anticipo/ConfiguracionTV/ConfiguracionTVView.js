Ext.namespace('Ext.ConfiguracionTV');
Ext.ConfiguracionTV.View = Ext.extend(Ext.Window, {
    etiquetas: undefined,
    model: undefined,
    viewport: undefined,
    constructor: function(model, params)
    {
        this.crearSetsAndGets();
        this.setModel(model);
        this.setEtiquetas(params.etiquetas);
        this.initializeView();
        Ext.ConfiguracionTV.View.superclass.constructor.call(this);
    },
    initializeView: function () {
        this.initializeFunctions();
        var items = this.initializeItems();
        var titulo = 'Configuracion';
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.50,
            closeAction: 'destroy',
            frame: true,
            // plugins: a,
            resizable: false,
            title: titulo,
            items: items,
            listeners: {
                scope: this,
                show: function () {
                },
                close: function () {
                }
            }
        });
    },
    initializeItems: function () {
        var model = this.getModel();
        this.createButtons();
        return [this.crearForm(model)];
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            // tooltip: scope.etiquetas.lbToolCancelar,
            text: 'Cancelar',
            iconCls: 'cancelar',
            scope: this,
            handler: function (btn) {
                this.close();
            }
        });

        this.btnAceptar = new Ext.Button({
            // tooltip: scope.etiquetas.lbToolAceptar,
            text: 'Aceptar',
            iconCls: 'Aceptar',
            disabled: true
        });

        this.buttons = [this.btnCancelar, this.btnAceptar];
    },
    initializeFunctions: function () {

        this.crearForm = function (model) {
            this.cbContabilizarOperacion = new Ext.form.ComboBox({
                editable: false,
                store: model.getStoreContabilizarOperacion(),
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
                store: model.getStoreCuentaOperacion(),
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

            this.cbCliente = new Ext.form.ComboBox({
                name: 'cbcliente',
                emptyText: 'Seleccione...',
                hiddenName: this.tipoDuo === 3 ? 'idcliente' : 'idclientesproveedores',
                fieldLabel: this.tipoDuo === 3 ? 'Deudor' : 'Acreedor',
                store: model.getStoreCliente(),
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
                store: model.getStoreTipo(),
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
                store: model.getStoreCuenta(),
                maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
                tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>',
                mode: 'local',
                enableKeyEvents: true,
            });

            this.formUI = new Ext.FormPanel({
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
                    },{
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .7,
                        items: [this.cbCliente]
                    }]
                }, {
                    labelAlign: 'top',
                    autoHeight: true,
                    layout: 'column',
                    items: [{
                        style: 'margin:0 0 0 5',
                        layout: 'form',
                        columnWidth: 1,
                        items: [this.cbcuentanormal]
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
                }
                ]
            });
            return this.formUI;
        };

    },
    crearSetsAndGets: function () {
        this.setModel = function (model) {
            this.model = model;
        };

        this.getModel = function () {
            return this.model;
        };

        this.setEtiquetas = function (etiquetas) {
            this.etiquetas = etiquetas;
        };

        this.getEtiquetas = function () {
            return this.etiquetas;
        };


    }
});