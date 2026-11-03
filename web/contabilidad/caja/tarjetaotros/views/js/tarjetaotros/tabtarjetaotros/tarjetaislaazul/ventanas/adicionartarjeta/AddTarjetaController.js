Ext.namespace('Ext.AddTarjetaIslaAzul');
Ext.AddTarjetaIslaAzul.Controller = Ext.extend(Ext.Component, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.AddTarjetaIslaAzul.Controller.superclass.constructor.call(this);
        this.initComponentt(params);
        this.addEvents({
            'close': true,
        });
    },
    initComponentt: function (params) {
        var model = new Ext.AddTarjetaIslaAzul.Model();
        var view = new Ext.AddTarjetaIslaAzul.View(model, params);
        this.tmodel = model;
        this.tview = view;
        this.initializeEvents(model, view);
        this.initializeFunctions(model, view);
        this.loadDataComponent(model, view);
    },
    loadDataComponent: function(model, view)
    {

    },
    initializeFunctions: function (model, view) {
        var me = this;

        this.loadModData = function (select) {
            this.select = select;
            console.log(select);
            view.loadMask();
            if (select.data.enuso) {
                view.getNfNumer().disable();
            }
            view.getForm().getForm().loadRecord(select);
            view.hideMask();
            view.crearFormSteps();
        };

        this.saveTarjeta = function (aplicar) {
            var me = this;
            var msgSuccess = me.action == 'add' ? this.idioma.lbAddTarjetaSatisfact : this.idioma.lbModTarjetaSatisfact;
            Ext.Msg.wait(this.idioma.lbGuardando, this.idioma.lbEspere);

            Ext.Ajax.request({
                url: 'savetarjeta',
                params: {
                    idcaja: me.idcaja,
                    idtarjeta: me.action == 'mod' ? this.select.data.idtarjeta : -1,
                    numero: view.getNfNumer().getValue(),
                    fechavence: view.getDfFechaVence().getRawValue(),
                    activo: view.getCkActivo().getValue() ? 1 : 0,
                    enuso: me.action == 'mod' ? (this.select.data.enuso ? 1 : 0) : 0,
                    tipo: 2,
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codMg == '1') {
                        mostrarMensaje(1, msgSuccess);
                    } else if (respuesta.codMg == '-1') {
                        mostrarMensaje(1, me.idioma.lbNumTarjetaExist);
                    }
                    Ext.MessageBox.hide();
                }
            });
        };

        // this.limpiarCampos = function () {
        //     view.getForm().getForm().reset();
        // };

        this.show = function () {
            view.show();
            view.crearFormSteps();
        };

        this.limpiarCamposForm = function () {
            view.getDfFechaVence().setValue('');
            view.getNfNumer().setValue('');
            view.getCkActivo().setValue(true);
        };

    },
    initializeEvents: function (model, view) {
        var me = this;

        view.getBtnAceptar().on({
            scope: this,
            click: function () {
                this.saveTarjeta(true);
            }
        });
        view.getBtnCancelar().on({
            scope: this,
            click: function () {
                this.fireEvent('close');
                view.close();
            }
        });

        view.getCbxCuenta().on({
            scope: this,
            select: function (cb, record) {
                view.loadMask();
                this.buscarSaldoCuenta(view.getCbxCuenta().getValue());
                view.getCbMoneda().setValue(record.data.idmoneda);
            }
        });

        view.on({
            scope: this,
            show: function () {
                // view.crearFormSteps();
            },
            FormStepsCreado: function (formsteps) {
                formsteps.on({
                    scope: this,
                    Nuevo: function (fnCallback) {
                        this.limpiarCamposForm();
                        fnCallback.call();
                    },
                    crear: function (fnCallback) {
                        fnCallback.call();
                    }
                });
            }
        });


    },
});