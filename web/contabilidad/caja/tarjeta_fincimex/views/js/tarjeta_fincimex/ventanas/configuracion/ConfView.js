Ext.namespace('Ext.GestionarTarjetaOperConf');
Ext.GestionarTarjetaOperConf.View = Ext.extend(Ext.Window, {
    lmask: undefined,
    etiquetas: undefined,
    constructor: function (params) {
        this.etiquetas = params.etiquetas;
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.40,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            title: 'Configuración',
            listeners: {
                scope: this,
                show: function () {

                },
                close: function () {
                }
            }
        });
        this.initializeClass();
        Ext.GestionarTarjetaOperConf.View.superclass.constructor.call(this);
    },
    loadMask: function (message = 'Cargando...') {
        this.lmask = new Ext.LoadMask(this.body, {
            msg: message
        });
        this.lmask.show();
    },
    crearFormSteps: function()
    {
        return this.formSteps = new Ext.FormSteps(this.getForm(), this.buttons);
    },
    initializeClass: function () {
        this.createButtons();
        this.setWindowItems();
    },
    setForm: function (form) {
        this.formConf = form;
    },
    getForm: function () {
        return this.formConf
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            tooltip: 'Cerrar ventana sin guardar datos',
            text: 'Cancelar',
            iconCls: 'cancelar',
            scope: this,
            handler: function (btn) {
                this.close();
            }
        });

        this.btnPrueba = new Ext.Button({
            tooltip: 'Probar conexión',
            text: 'Probar',
            iconCls: 'aplicar',
        });

        this.btnAceptar = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana'
        });

        this.buttons = [this.btnCancelar, this.btnPrueba, this.btnAceptar];
    },
    createForm: function () {

        this.tfHost = new Ext.form.TextField({
            name: 'host',
            fieldLabel: 'IP',
            allowBlank: false,
            // blankText: this.etiquetas.lbBlankText,
            anchor: '100%',
            maxLength: 15,
            // editable: false,
            // disabled: true,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            // enableKeyEvents: false
        });
        this.nfPuerto = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Puerto',
            name: 'puerto',
            // style: 'text-align: right',
            allowDecimals: false,
            // enableKeyEvents: false,
            allowBlank: false,
            maxLength: 6,
            // maskRe: undefined,
            // regex: undefined,
            // maxLengthText: undefined,
            // regexText: undefined,
            // emptyText: '0.00',
            anchor: '100%'
        });
        this.tfBdNombre = new Ext.form.TextField({
            // id: 'idtf$Nombre$',
            name: 'bdname',
            fieldLabel: 'Base de datos',
            allowBlank: false,
            // blankText: this.etiquetas.lbBlankText,
            anchor: '100%',
            maxLength: 100,
            // editable: false,
            // disabled: true,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            // enableKeyEvents: false
        });
        this.tfUsuario = new Ext.form.TextField({
            // id: 'idtf$Nombre$',
            name: 'user',
            fieldLabel: 'Usuario',
            allowBlank: false,
            // blankText: this.etiquetas.lbBlankText,
            anchor: '100%',
            maxLength: 100,
            // editable: false,
            // disabled: true,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            // enableKeyEvents: false
        });
        this.tfPassWord = new Ext.form.TextField({
            // id: 'idtf$Nombre$',
            name: 'pass',
            fieldLabel: 'Contraseña',
            allowBlank: false,
            // blankText: this.etiquetas.lbBlankText,
            anchor: '100%',
            // maxLength: 100,
            // editable: false,
            // disabled: true,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            inputType: 'password',
            // enableKeyEvents: false
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
                    items: [this.tfHost]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .2,
                    items: [this.nfPuerto]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .3,
                    items: [this.tfBdNombre]
                }]
            }, {
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [
                    {
                        style: 'margin:0 0 0 5',
                        layout: 'form',
                        columnWidth: .5,
                        items: [this.tfUsuario]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .5,
                        items: [this.tfPassWord]
                    }
                ]
            }
            ]
        });
        this.setForm(form);
        return form;
    },
    setWindowItems: function () {
        this.items = [this.createForm()];
    }
});
