Ext.namespace('Ext.ExpDuo');
Ext.ExpDuo.Gest = Ext.extend(Ext.Window, {
    etiquetas: undefined,
    model: undefined,
    constructor: function(params)
    {
        this.crearSetsAndGets();
        this.idderechouobligacion = params.idderechouobligacion;
        this.idestadoduo = params.idestadoduo;//1 se puede gestionar, 0 no se puede
        this.fechaInicial = params.fechaInicial;
        this.fechaActual = params.fechaActual;
        // this.fechaFin = '30/08/2022';

        this.initializeView();
        Ext.ExpDuo.Gest.superclass.constructor.call(this);
    },
    initializeView: function () {
        this.initializeFunctions();
        var model = new Ext.ExpDuo.Model();
        var view = new Ext.ExpDuo.View(model);
        var controller = new Ext.ExpDuo.Controller({
            view: view,
            idderechouobligacion: this.idderechouobligacion,
            idestadoduo: this.idestadoduo,
            fechaInicial: this.fechaInicial,
            fechaActual: this.fechaActual,
            fechaFin: this.fechaFin,
        });
        var items = this.initializeItems(view);
        var titulo = 'Expedientes';
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
                    controller.loadMessageBox();
                    model.getStoreExpDuo().load({
                        params: {
                            idDuo: this.idderechouobligacion
                        },
                        callback: function () {
                            controller.hideMessageBox();
                        }
                    });
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
            text: 'Salir',
            iconCls: 'cancelar',
            scope: this,
            handler: function (btn) {
                this.close();
            }
        });

        this.buttons = [this.btnCancelar];
    },
    initializeFunctions: function () {


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