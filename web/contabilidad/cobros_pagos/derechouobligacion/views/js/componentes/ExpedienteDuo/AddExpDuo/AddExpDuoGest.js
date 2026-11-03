Ext.namespace('Ext.AddExpDuo');
Ext.AddExpDuo.Gest = Ext.extend(Ext.Window, {
    etiquetas: undefined,
    model: undefined,
    idexp: undefined,
    url: '/contabilidad/cobros_pagos/derechouobligacion/index.php/expduo/',
    constructor: function(params)
    {
        this.crearSetsAndGets();

        this.idexp = params.idexp;
        this.idduo = params.idderechouobligacion;
        this.fechaInicial = params.fechaInicial;
        this.fechaActual = params.fechaActual;
        this.fechaFin = params.fechaFin;

        var datos = params.datos;

        this.initializeView(datos);
        Ext.AddExpDuo.Gest.superclass.constructor.call(this);
        this.addEvents('addExpDuo');
    },
    initializeView: function (datos) {
        var model = new Ext.AddExpDuo.Model();
        var view = new Ext.AddExpDuo.View(model, {
            fechaInicial: this.fechaInicial,
            fechaActual: this.fechaActual,
            fechaFin: this.fechaFin
        });
        var controller = new Ext.AddExpDuo.Controller({
            view: view,
            fechaInicial: this.fechaInicial,
            fechaActual: this.fechaActual,
            fechaFin: this.fechaFin,
        });
        this.initializeFunctions(model, view, controller);
        this.initializeEvents(model, view, controller);
        var items = this.initializeItems(view);
        var titulo = 'Adicionar';
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
                    controller.cargarDatos(datos);
                    controller.createFormSteps(this.buttons);
                },
                close: function () {
                }
            }
        });
    },
    initializeItems: function (view) {

        this.createButtons();
        return view.getItemsView();
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
            // tooltip: scope.etiquetas.lbToolCancelar,
            text: 'Aceptar',
            iconCls: 'aceptar',
            scope: this
        });

        this.buttons = [this.btnCancelar, this.btnAceptar];
    },
    initializeEvents: function(model, view, controller) {
        var me = this;
        controller.on({
            addExpDuo: function (form) {
                me.loadMessageBox();
                form.getForm().submit({
                    method: "POST",
                    url: me.url + 'addMod',
                    clientValidation: false,
                    params: {
                        idexpediente: me.idexp,
                        idduo: me.idduo,
                    },
                    success: function (form, action) {
                        console.log(form, action);
                        me.hideMessageBox();
                        var responseData = Ext.decode(action.response.responseText);
                        if (responseData.codMsg === 1) {
                            me.fireEvent('addExpDuo');
                        }
                    },
                    failure: function (form, action) {
                        me.hideMessageBox();
                        var responseData = Ext.decode(action.response.responseText);
                        if (responseData.codMsg === 1) {
                            me.fireEvent('addExpDuo');
                        }
                        me.close();
                    }
                });
            }
        });

    },
    initializeFunctions: function (model, view, controller) {

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