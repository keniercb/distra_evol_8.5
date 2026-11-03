Ext.namespace('Ext.ExpDuo');
Ext.ExpDuo.View = Ext.extend(Ext.Component, {
    model: undefined,
    constructor: function(model, params)
    {
        this.crearSetsAndGets();
        this.setModel(model);
        this.initializeView();
        Ext.ExpDuo.View.superclass.constructor.call(this);
    },
    getItemsView: function () {
        return this.panelgeneral;
    },
    PanelGeneral: function (items) {
        this.panelgeneral = new Ext.Panel({
            layout: 'border',
            border: false,
            items: items,
            height: 500,
            // tbar: tbar
        });
    },
    initializeView: function () {
        this.initializeFunctions();
        var items = this.initializeItems();
        // var tbar = this.toolBarPanelGeneral(this.getModel());
        this.PanelGeneral(items);
    },
    initializeItems: function () {
        return [this.crearGridExpdiente()];
    },
    initializeFunctions: function () {
        var model = this.getModel();

        this.crearGridExpdiente = function () {
            this.actVerExp = new Ext.grid.RowActions({
                // id: 'idRowaction',
                widthSlope: 60,
                header: "Ref doc.",
                align: 'center',
                actions: [
                    {
                        id: 'vistadocumento',
                        tooltip: 'Ver documento',
                        // qtipIndex: 'numcomprobante',
                        iconCls: 'vistareporte',
                        marginLeft: 5,
                        width: 60,
                        height: 16,
                        // hideIndex: 'refdoc',
                        // textIndex: 'refdoc',
                    },
                ]
            });

            var columns = [
                {
                    header: 'Tipo Documento',
                    dataIndex: 'idtipodoc',
                    width: 100,
                    hidden: false,
                    align: 'left',
                    renderer: function (value, metaData, record) {
                        if (value == 1) {
                            return 'Conciliacion';
                        } else if (value == 2) {
                            return 'Reclamacion';
                        } else if (value == 3) {
                            return 'Demanda';
                        } else {
                            return '';
                        }
                    }
                },
                {
                    id: 'iddescripcion',
                    header: 'Descripcion',
                    dataIndex: 'descripcion',
                    width: 100,
                    hidden: false,
                    align: 'left',
                },
                {
                    header: 'Fecha',
                    dataIndex: 'fecha',
                    width: 100,
                    hidden: false,
                    align: 'left',
                },
                {
                    header: 'Fecha vencimiento',
                    dataIndex: 'fechavencimiento',
                    width: 100,
                    hidden: false,
                    align: 'left',
                },
                {
                    header: 'Usuario',
                    dataIndex: 'nombreusuario',
                    width: 100,
                    hidden: false,
                    align: 'left',
                },
                this.actVerExp
            ];

            var btnAdd = new Ext.Button({
                text: 'Adicionar',
                disabled: true,
                iconCls: 'adicionar',
            });

            this.setBtnAdd(btnAdd);

            var btnMod = new Ext.Button({
                text: 'Modificar',
                disabled: true,
                iconCls: 'modificar',
            });

            this.setBtnMod(btnMod);

            var btnDel = new Ext.Button({
                text: 'Eliminar',
                disabled: true,
                iconCls: 'eliminar',
            });

            this.setBtnDel(btnDel);

            var grid = new Ext.grid.GridPanel({
                // title: 'Expedientes',
                region: 'center',
                frame: true,
                autoExpandColumn: 'iddescripcion',
                // view: new Ext.grid.GroupingView({
                //     // forceFit: true,
                //     groupTextTpl: "{[values.rs[0].data.clienteproveedor]}"
                // }),
                columns: columns,
                store: model.getStoreExpDuo(),
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect: true
                }),
                plugins: this.actVerExp,
                loadMask: true,
                // height: 500,
                tbar: [btnAdd, btnMod, btnDel]
            });
            this.setGridExp(grid);
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

        this.setGridExp = function (grid) {
            this.gridExp = grid;
        };

        this.getGridExp = function () {
            return this.gridExp;
        };

        this.setBtnAdd = function (btn) {
            this.btnAdd = btn;
        };

        this.getBtnAdd = function () {
            return this.btnAdd;
        };

        this.setBtnMod = function (btn) {
            this.btnMod = btn;
        };

        this.getBtnMod = function () {
            return this.btnMod;
        };

        this.setBtnDel = function (btn) {
            this.btnDel = btn;
        };

        this.getBtnDel = function () {
            return this.btnDel;
        };

    }
});