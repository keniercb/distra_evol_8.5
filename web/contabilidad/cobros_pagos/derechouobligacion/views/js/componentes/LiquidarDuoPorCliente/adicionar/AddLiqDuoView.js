Ext.namespace('Ext.ClassLiquidarPorCliente.AddLiq');
Ext.ClassLiquidarPorCliente.AddLiq.View = Ext.extend(Ext.Window, {
    lmask: undefined,
    etiquetas: undefined,
    constructor: function (model, params) {
        this.setModel(model);
        this.etiquetas = params.etiquetas;
        this.tipoDuo = params.tipoDuo;
        this.baseParams = params.baseParams;
        Ext.apply(this, {
            id: 'window1234',
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
        Ext.ClassLiquidarPorCliente.AddLiq.View.superclass.constructor.call(this);
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

        this.ckbAddSubordinadas = new Ext.form.Checkbox({
            id: 'ckbAddSubordinadas',
            boxLabel: 'Subordinadas',
            hideLabel: true,
            name: 'subordinada'
        });

        this.btnAddADatos = new Ext.Button({
            // tooltip: scope.etiquetas.lbToolAceptar,
            text: 'Adicionar',
            iconCls: 'siguiente',
            disabled: true
        });

        var selModel = new Ext.grid.RowSelectionModel();

        var columns = [
            {
                id: 'iddocumento',
                header: 'Documento',
                dataIndex: 'denominacion',
                width: 50,
                hidden: true,
                align: 'left',
            },{
                // header: 'Documento',
                dataIndex: 'clienteproveedor',
                width: 100,
                hidden: true,
                hideable: false,
                // align: 'left',
            }, {
                id: 'idnumerodocumento',
                header: 'No. documento',
                dataIndex: 'numero',
                width: 100,
                align: 'left',
            }, {
                header: 'No. operacion',
                dataIndex: 'noperacionenzona',
                width: 70,
                align: 'left',
                hidden: true,
            }, {
                header: 'No. SGCOFLOT',
                dataIndex: 'referenciaext',
                width: 70,
                align: 'left',
                hidden: true,
            }, {
                id: 'idfechaemision',
                header: 'Fecha emisión',
                dataIndex: 'fechaemision',
                //hidden: true,
                sortable: false,
                width: 95,
                align: 'left',
            }, {
                id: 'idmoneda',
                header: 'Moneda',
                dataIndex: 'codigoiso',
                hidden: true,
                width: 100,
                align: 'left',
            }, {
                id: 'idcuenta',
                header: this.etiquetas.lbCuenta,
                dataIndex: 'concatcta',
                width: 100,
                align: 'left',
            },
            {
                id: 'idimportependiente',
                header: 'Pendiente',
                dataIndex: 'importependiente',
                width: 80,
                align: 'right',
                renderer: formatoMonedaABS
            }
        ];

        this.filters = new Ext.grid.GridFilters({
            filtersText: 'Búsqueda',
            local: false,
            filters: [
                {type: 'string', dataIndex: 'numero'},
                {type: 'date', dataIndex: 'fechaemision'},
                {type: 'string', dataIndex: 'concatcta'},
                {type: 'string', dataIndex: 'noperacionenzona'},
                {type: 'string', dataIndex: 'referenciaext'}
            ]
        });

        return this.gridBuscarObligaciones = new Ext.grid.GridPanel({
            title: 'Obligaciones pendientes',
            clicksToEdit: 2,
            region: 'center',
            frame: true,
            autoExpandColumn: 'idnumerodocumento',
            view: new Ext.grid.GroupingView({
                // forceFit: true,
                groupTextTpl: "{[values.rs[0].data.clienteproveedor]}"
            }),
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

        this.nfImporte = new Ext.form.NumberField({
            defaultValue: 0,
            allowBlank: false,
            allowNegative: false,
            // validator: function (value) {
            //     if (value > 0)
            //         return true;
            //     return 'El importe no puede ser 0.';
            // }
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
                id: 'iddocumento',
                header: 'Documento',
                dataIndex: 'denominacion',
                width: 100,
                hidden: true,
                align: 'left',
            },{
                // header: 'Documento',
                dataIndex: 'clienteproveedor',
                width: 100,
                hidden: true,
                hideable: false,
                // align: 'left',
            }, {
                id: 'idnumerodocumento',
                header: 'No. documento',
                dataIndex: 'numero',
                width: 100,
                align: 'left',
            }, {
                header: 'No. operacion',
                dataIndex: 'noperacionenzona',
                width: 70,
                align: 'left',
                hidden: true,
            }, {
                header: 'No. externo',
                dataIndex: 'referenciaext',
                width: 70,
                align: 'left',
                hidden: true,
            }, {
                id: 'idfechaemision',
                header: 'Fecha emisión',
                dataIndex: 'fechaemision',
                //hidden: true,
                sortable: false,
                width: 95,
                align: 'left',
            }, {
                id: 'idmoneda',
                header: 'Moneda',
                dataIndex: 'codigoiso',
                hidden: true,
                width: 100,
                align: 'left',
            }, {
                id: 'idcuenta',
                header: this.etiquetas.lbCuenta,
                dataIndex: 'concatcta',
                width: 80,
                align: 'left',
            },
            {
                id: 'idimportependiente',
                header: 'Pendiente',
                dataIndex: 'importependiente',
                width: 80,
                align: 'right',
                renderer: formatoMonedaABS
            }, {
                header: 'A liquidar',
                dataIndex: 'importealiquidar',
                width: 80,
                align: 'right',
                editor: this.nfImporte,
                renderer: formatoMonedaABS
            }
        ];

        return this.gridPanelObligaciones = new Ext.grid.EditorGridPanel({
            title: 'Obligaciones a liquidar',
            clicksToEdit: 2,
            width: Ext.lib.Dom.getViewWidth() * 0.40,
            region: 'east',
            frame: true,
            autoExpandColumn: 'idnumerodocumento',
            view: new Ext.grid.GroupingView({
                // forceFit: true,
                groupTextTpl: "{[values.rs[0].data.clienteproveedor]}"
            }),
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
