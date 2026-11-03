Ext.namespace('Ext.CICancelacion');
Ext.CICancelacion.View = Ext.extend(Ext.Window, {
    lmask: undefined,
    etiquetas: undefined,
    constructor: function (model, params) {
        this.setModel(model);
        this.etiquetas = params.etiquetas;
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            layout: 'fit',
            width: Ext.lib.Dom.getViewWidth() * 0.5,
            // height: Ext.lib.Dom.getViewWidth() * 0.6,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            title: 'Cancelar Carga Inicial',
            listeners: {
                scope: this,
                show: function () {

                },
                close: function () {
                }
            }
        });
        this.initializeClass();
        Ext.CICancelacion.View.superclass.constructor.call(this);
        this.addEvents({
            'FormStepsCreado': true
        });
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
    crearFormSteps: function()
    {
        this.setFormSteps(new Ext.FormSteps(this.getForm(), this.buttons));
        this.fireEvent('FormStepsCreado', this.getFormSteps());
        return this.getFormSteps();
    },
    initializeClass: function () {
        this.createButtons();
        this.setWindowItems(this.getModel());
        this.initializeGets();
    },
    setModel: function (model) {
        this.model = model;
    },
    getModel: function () {
        return this.model;
    },
    setForm: function (form) {
        this.formConf = form;
    },
    getForm: function () {
        return this.formConf
    },
    setFormSteps: function (formSteps) {
        this.formSteps = formSteps;
    },
    getFormSteps: function () {
        return this.formSteps
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            id:'Cancelar',
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
    createForm: function (model) {

        this.cbCuenta = new Ext.contabilidad.util.linkedCombo({
            store: model.getStoreCuenta(),
            fieldLabel: 'Contrapartida',
            displayField: 'text',
            valueField: 'idcuenta',
            // disabled: true,
            hideTbar: true,
            hideBbar: true,
            listHeight: 200,
            tabIndex: 11,
            anchor: '100%',
            mode: 'local',
            loaded: true,
            disabled: true,
            id: 'cbxCuenta'
        });


        this.cbOperacion = new Ext.form.ComboBox({
            editable: false,
            store: model.getStoreOperacion(),
            allowBlank: false,
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            hiddenName: 'idnomoperaciones',
            disabledClass: 'disabled-component',
            id: 'cbLiquidarOperacion',
            selectOnFocus: true,
            resizable: true,
            //typeAhead : true,
            mode: 'local',
            disabled: true,
            triggerAction: 'all',
            tabIndex: 10,
            fieldLabel: 'Operaci&oacute;n',
            anchor: '100%',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            enableKeyEvents: true,
        });

        var form = new Ext.FormPanel({
            frame: true,
            layout: 'form',
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
                    columnWidth: .5,
                    items: [this.cbOperacion]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .5,
                    items: [this.cbCuenta]
                }]
            }
            ]
        });
        this.setForm(form);
        return form;
    },
    setWindowItems: function (model) {
        this.items = [this.createForm(model)];
    },
    initializeGets: function () {
        this.getCbCuenta = function () {
            return this.cbCuenta;
        };
        this.getCbOperacion = function () {
            return this.cbOperacion;
        };
    }
});
