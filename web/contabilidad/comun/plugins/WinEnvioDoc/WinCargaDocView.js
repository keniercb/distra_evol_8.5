Ext.namespace('Ext.WinCargarDoc');
Ext.WinCargarDoc.View = Ext.extend(Ext.Window, {
    etiquetas: undefined,
    model: undefined,
    constructor: function(model, params)
    {
        this.crearSetsAndGets();
        this.setModel(model);
        this.setEtiquetas(params.etiquetas);
        this.initializeView();
        Ext.WinCargarDoc.View.superclass.constructor.call(this);
    },
    initializeView: function () {
        this.initializeFunctions();
        var items = this.initializeItems();
        var titulo = 'Ventana';
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.50,
            closeAction: 'hide',
            frame: true,
            layout: 'fit',
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
        return [this.crearGrid(model)];
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            // tooltip: scope.etiquetas.lbToolCancelar,
            text: 'Cancelar',
            iconCls: 'cancelar',
            scope: this,
            handler: function (btn) {
                this.hide();
            }
        });

        this.btnAceptar = new Ext.Button({
            // tooltip: scope.etiquetas.lbToolAceptar,
            text: 'Aceptar',
            iconCls: 'Aceptar',
            // disabled: true
        });

        this.buttons = [this.btnCancelar, this.btnAceptar];
    },
    initializeFunctions: function () {

        this.crearGrid = function (model) {
            var selModel = new Ext.grid.RowSelectionModel();
            var columns = [
                {
                    header: 'Fecha',
                    dataIndex: 'fechasistema',
                    width: 50,
                    hidden: false,
                    align: 'left',
                },
                {
                    id: 'expandirddd',
                    header: 'Descripcion',
                    dataIndex: 'descripcion',
                    width: 100,
                    hidden: false,
                    align: 'left',
                },
                {
                    header: 'Origen',
                    dataIndex: 'origen',
                    width: 150,
                    hidden: false,
                    align: 'left',
                },
            ];
            var grid = new Ext.grid.GridPanel({
                title: 'Supergrid',
                // region: 'center',
                frame: true,
                height: 400,
                autoExpandColumn: 'expandirddd',
                // view: new Ext.grid.GroupingView({
                //     // forceFit: true,
                //     groupTextTpl: "{[values.rs[0].data.clienteproveedor]}"
                // }),
                columns: columns,
                store: model.getStore(),
                sm: selModel,
                // plugins: this.filters,
                loadMask: true,
                // height: 500,
                // tbar: [],
                // bbar: new Ext.Cont.PagingToolbar({
                //     pageSize: 20,
                //     clearFilter: true,
                //     autoHeight: true,
                //     store: model.getStore(),
                //     // displayInfo: true,
                //     listeners: {
                //         'beforechange': function () {
                //             model.getStore().baseParams = me.baseParams;
                //         }
                //     }
                // })
            });
            return grid;
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