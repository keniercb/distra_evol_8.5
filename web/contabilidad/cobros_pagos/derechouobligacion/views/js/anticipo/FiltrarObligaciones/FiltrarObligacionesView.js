Ext.namespace('Ext.ClassLiquidarPorCliente.AddLiq');
Ext.ClassFiltrarObligaciones.View = Ext.extend(Ext.Window, {
    lmask: undefined,
    etiquetas: undefined,
    constructor: function (model, params) {
        this.setModel(model);
        this.etiquetas = params.etiquetas;
        this.tipoDuo = params.tipo;
        this.baseParams = params.baseParams;
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            layout: 'fit',
            width: Ext.lib.Dom.getViewWidth() * 0.80,
            // height: Ext.lib.Dom.getViewWidth() * 0.6,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            closable: false,
            // title: 'lol',
            listeners: {
                scope: this,
                show: function () {

                },
                close: function () {
                }
            }
        });
        this.initializeClass();
        Ext.ClassFiltrarObligaciones.View.superclass.constructor.call(this);
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
            // disabled: true
        });

        this.buttons = [this.btnCancelar, this.btnAceptar];
    },
    crearGridBuscar: function (model) {

        var me = this;

        this.btnAddADatos = new Ext.Button({
            // tooltip: scope.etiquetas.lbToolAceptar,
            text: 'Adicionar',
            iconCls: 'siguiente',
            disabled: true
        });

        var selModel = new Ext.grid.RowSelectionModel();

        var columns = [
            {
                header: "Documento",
                dataIndex: 'tipodoc',
                id: 'tipodoc',
                width: 65,
                align: 'center'
            }, {
                id: 'ndocumentos',
                header: 'No. documento',
                align: 'right',
                dataIndex: 'ndocumentos',
                width: 100
            }, {
                header: 'No. operacion',
                align: 'left',
                dataIndex: 'noperacionenzona',
                width: 80,
                hidden: true
            }, {
                id: 'fecha',
                header: 'Fecha',
                align: 'left',
                dataIndex: 'fecha',
                width: 80
            }, {
                id: 'ipendientes',
                header: 'Importe pendiente',
                dataIndex: 'ipendientes',
                align: 'right',
                width: 120,
                renderer: formatoMonedaABS
            }, {
                id: 'comentarios',
                header: 'Comentario',
                dataIndex: 'comentarios',
                width: 200,
                hidden: true
            }, {
                id: 'concatcta',
                header: 'Cuenta',
                dataIndex: 'concatcta',
                width: 180
            }
        ];

        this.filters = new Ext.grid.GridFilters({
            filtersText: 'Búsqueda',
            local: false,
            filters: [
                {type: 'string', dataIndex: 'ndocumentos'},
                {type: 'date', dataIndex: 'fecha'},
                // {type: 'string', dataIndex: 'concatcta'},
                {type: 'string', dataIndex: 'noperacionenzona'}
            ]
        });

        return this.gridBuscarObligaciones = new Ext.grid.GridPanel({
            title: 'Obligaciones pendientes',
            clicksToEdit: 2,
            region: 'center',
            frame: true,
            // autoExpandColumn: 'comentario',
            columns: columns,
            store: model.getStoreGridBuscarLiquidar(),
            sm: selModel,
            plugins: this.filters,
            loadMask: true,
            // height: 500,
            tbar: ['->', this.btnAddADatos],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                clearFilter: true,
                autoHeight: true,
                store: model.getStoreGridBuscarLiquidar(),
                // displayInfo: true,
                listeners: {
                    'beforechange': function () {
                        model.getStoreGridBuscarLiquidar().baseParams = me.baseParams;
                    }
                }
            })
        });

    },
    crearGridDatos: function (model) {

        var me = this;

        this.tfImpLiquidar = new Ext.form.NumberField({
            name: 'ipagar',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            allowNegative: false,
            value: '0.00',
            allowDecimals: true,
            forcePrecision: true,
            decimalPrecision: 2,
            enableKeyEvents: true
        });

        this.btnEliminar = new Ext.Button({
            // tooltip: scope.etiquetas.lbToolAceptar,
            text: 'Eliminar',
            iconCls: 'eliminar',
            disabled: true
        });

        var selModel = new Ext.grid.RowSelectionModel();

        var columns = [
            {
                header: "Documento",
                dataIndex: 'tipodoc',
                id: 'tipodoc',
                width: 65,
                align: 'center'
            }, {
                id: 'ndocumentos',
                header: 'No. documento',
                align: 'right',
                dataIndex: 'ndocumentos',
                width: 100
            }, {
                header: 'No. operacion',
                align: 'left',
                dataIndex: 'noperacionenzona',
                width: 80,
                hidden: true
            }, {
                id: 'fecha',
                header: 'Fecha',
                align: 'left',
                dataIndex: 'fecha',
                width: 80
            }, {
                id: 'ipendientes',
                header: 'Importe pendiente',
                dataIndex: 'ipendientes',
                align: 'right',
                width: 120,
                renderer: formatoMonedaABS
            }, {
                header: "Importe a liquidar",
                dataIndex: 'ipagar',
                id: 'ipagar',
                width: 120,
                align: 'right',
                editor: this.tfImpLiquidar,
                renderer: formatoMonedaABS
            }, {
                id: 'comentarios',
                header: 'Comentario',
                dataIndex: 'comentarios',
                width: 200,
                hidden: true
            }, {
                id: 'concatcta',
                header: 'Cuenta',
                dataIndex: 'concatcta',
                width: 180
            }
        ];

        return this.gridPanelObligaciones = new Ext.grid.EditorGridPanel({
            title: 'Obligaciones a liquidar',
            clicksToEdit: 2,
            width: Ext.lib.Dom.getViewWidth() * 0.40,
            region: 'east',
            frame: true,
            // autoExpandColumn: 'comentarios',
            columns: columns,
            store: model.getStoreGridLiquidar(),
            sm: selModel,
            tbar: [this.btnEliminar],
            bbar: ['->', new Ext.Toolbar.TextItem('Total:'), this.labelTotal = new Ext.form.Label({
                text: '0.00'
            })]
        });

    },
    setWindowItems: function (model) {
        var panelcontenedor = new Ext.Panel({
            id: 'panelcontenedor123',
            // region: 'south',
            height: 400,
            layout: 'border',
            items: [this.crearGridBuscar(model), this.crearGridDatos(model)]
        });
        this.items = [/*this.createForm(model),*/ panelcontenedor];
    },
    initializeGets: function () {
        this.getGridDatos = function () {
            return this.gridPanelObligaciones;
        };
        this.getGridBuscar = function () {
            return this.gridBuscarObligaciones;
        };
        this.getBtnAddADatos = function () {
            return this.btnAddADatos;
        };
        this.getBtnEliminarDatos = function () {
            return this.btnEliminar;
        };
        this.getBtnAceptar = function () {
            return this.btnAceptar;
        };
        this.getLabelTotal = function () {
            return this.labelTotal;
        };
    }
});
