Ext.define('Facturacion.view.ProductoGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.fac_productogrid',
    selType: 'checkboxmodel',
    autoScroll: true,
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        me.selModel = {mode: 'MULTI'};
        me.frame = false;
        me.border = false;
        me.title = me.etiquetas.lbTitleProdServ;
        me.features = [
            {
                ftype: 'grouping',
                groupByText: 'Agrupar por esta columna'
            },
            {
                ftype: 'filters',
                menuFilterText: me.etiquetas.lbbusqueda,
                local: false
            }
        ];
        me.store = Ext.create('Ext.data.Store', {
            //storeId: 'fac_stProducto',
            remoteFilter: true,
            remoteSort: true,
            groupField: 'numerocontrato',
            fields: [
                {name: 'idindicadorcontrato'},
                {name: 'idindicador'},
                {name: 'idproducto', type: 'int'},
                {name: 'idservicio', type: 'int'},
                {name: 'idcontrato', type: 'int'},
                {name: 'denominacion', type: 'string'},
                {name: 'cantidad', type: 'float'},
                {name: 'unidadmedida'},
                {name: 'precio', type: 'float'},
                {name: 'preciodivisa', type: 'float'},
                {name: 'monto', type: 'float'},
                {name: 'tipo', type: 'float'},
                {name: 'numerocontrato'}
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'cargarProductosServicios'}, ModuleMgr.get('Facturacion')),
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success'
                }
            }
        });

        me.columns = [
            {
                text: me.etiquetas.lbDescripcion,
                dataIndex: 'denominacion',
                minWidth: 35,
                flex: 0.3,
                filter: {
                    type: 'string'
                },
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            },{
                text: me.etiquetas.lbNumberContrato,
                dataIndex: 'numerocontrato',
                minWidth: 35,
                flex: 0.1,
                filter: {
                    type: 'string'
                },
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbCantidad,
                minWidth: 50,
                flex: 0.1,
                dataIndex: 'cantidad',
                filter: {
                    type: 'numeric'
                },
                renderer: function (value, meta) {
                    if (value) {
                        value = me.formatNumber(value);
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbUnidadMedida,
                flex: 0.1,
                dataIndex: 'unidadmedida',
                filter: {
                    type: 'string'
                },
                renderer: function (value, meta) {
                    if (!Ext.isEmpty(value)) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: 'CUP',
                flex: 0.1,
                dataIndex: 'precio',
                filter: {
                    type: 'numeric'
                },
                renderer: function (value, meta) {
                    if (!Ext.isEmpty(value)) {
                        value = me.formatNumber(value);
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: 'CUC',
                flex: 0.1,
                dataIndex: 'preciodivisa',
                filter: {
                    type: 'numeric'
                },
                renderer: function (value, meta) {
                    if (!Ext.isEmpty(value)) {
                        value = me.formatNumber(value);
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: 'Tipo',
                dataIndex: 'tipo',
                width:50,
                renderer: this.rendererClasificacion
            }
        ];

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true
            }
        ];

        me.callParent();
    },
    formatNumber: function (value) {
        return Ext.util.Format.currency(value);
    },
    rendererClasificacion: function (value, metadata, record) {
        var icono = 'icondistra-',
            tipo = this.etiquetas.lbProd;
        if (value == 1) {
            icono += 'producto';
        } else {
            icono += 'servicio';
            tipo = this.etiquetas.lbServ;
        }
        metadata.innerCls = icono;
        metadata.tdAttr = 'data-qtip="' + tipo + '"';
    }
});
