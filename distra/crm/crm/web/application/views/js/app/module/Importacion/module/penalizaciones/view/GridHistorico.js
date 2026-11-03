Ext.define('Penalizaciones.view.GridHistorico', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridhistorico',
    region: 'center',

    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        me.selModel = Ext.create('Ext.selection.RowModel');
        me.store = Ext.create('Ext.data.Store', {
            storeId: 'stHistorico',
            remoteSort: true,
            autoLoad: true,
            pageSize: 25,
            fields: [],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'historico'}, ModuleMgr.get('Penalizaciones')),
                actionMethods: {
                    read: 'POST'
                },
                extraParams: {
                    idpenalidad: me.idpenalidad
                },
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success'
                }
            }
        });

        me.columns = [
            {
                text: me.etiquetas.lbNumeroC,
                sortable: false,
                dataIndex: 'numero',
                minWidth: 70,
                width: 110,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbNombreC,
                dataIndex: 'contrato',
                minWidth: 200,
                width: 270,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbResponsable,
                width: 100,
                minWidth: 220,
                dataIndex: 'responsable',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
            }, {
                text: me.etiquetas.lbCliente,
                width: 100,
                minWidth: 270,
                dataIndex: 'cliente',
            },
            {
                text: me.etiquetas.lbEstado,
                sortable: false,
                width: 120,
                dataIndex: 'estado',
                renderer: function (value, meta) {
                    meta.innerCls = "icondistra-" + meta.record.data.iconoestado;
                    if (value) meta.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
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
        me.frame = false;
        me.margin = false;
        me.border = false;
        me.enableLocking = true;

        me.createToolbar();
        me.callParent();

    },
    createToolbar: function () {
        this.btnDetallesHist = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            action: 'detallesHistorico',
            selector: 'detallesHistorico',
            disabled: true,
            text: this.etiquetas.lbBtnDetail,
            tooltip: this.etiquetas.qtipDetail
        });

        this.tbar = [this.btnDetallesHist];
    }
});
