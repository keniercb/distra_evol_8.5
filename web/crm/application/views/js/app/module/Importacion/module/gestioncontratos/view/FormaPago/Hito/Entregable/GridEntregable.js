Ext.define('GestionContratoImportacion.view.FormaPago.Hito.Entregable.GridEntregable', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.GridEntregableimportacion',
    region: 'center',
    selType: 'checkboxmodel',
    layout: 'column',
    columnWidth: 1,
    height: 200,
    autoScroll: true,

    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.selModel = {mode: 'MULTI'};
        me.frame = false;
        me.border = false;
        me.viewConfig = {
            getRowClass: function (record, rowIndex, rowParams, store) {
                return record.data.idcontrato != record.data.idpadre ? "" : "contractcolor";
            }
        };
        me.store = Ext.create('Ext.data.Store', {
            storeId: 'simpsonsStore',
            fields: ['numero', 'descripcion', 'moneda'],
            data: me.dataMedioPago,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'items'
                }
            }
        });
        me.columns = [
            {
                text: me.etiquetas.lbDescripcion,
                dataIndex: 'descripcion',
                minWidth: 35,
                flex: 0.3,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbTipoEntregable,
                minWidth: 100,
                flex: 0.1,
                dataIndex: 'tipoentregable',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbResponsable,
                minWidth: 50,
                flex: 0.2,
                hidden: true,
                dataIndex: 'responsable',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbAreaResponsable,
                minWidth: 60,
                flex: 0.2,
                dataIndex: 'arearesponsable',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbMoneda,
                minWidth: 40,
                flex: 0.1,
                dataIndex: 'moneda',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbMonto,
                align: 'right',
                minWidth: 40,
                flex: 0.1,
                dataIndex: 'monto',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }
        ];

        me.btnAdd = Ext.create('Ext.Button', {
            iconCls: 'icondistra-adicionar icon-medium',
            text: me.etiquetas.lbAdd,
            action: 'addentregable',
            tooltip: me.etiquetas.lbAdd + ' ' + me.etiquetas.lbEntregable.toLocaleLowerCase()
        });

        me.btnMod = Ext.create('Ext.Button', {
            iconCls: 'icondistra-modificar icon-medium',
            action: 'editentregable',
            disabled: true,
            text: me.etiquetas.lbMod,
            tooltip: me.etiquetas.lbMod + ' ' + me.etiquetas.lbEntregable.toLocaleLowerCase()
        });

        me.btnDel = Ext.create('Ext.Button', {
            iconCls: 'icondistra-eliminar icon-medium',
            action: 'delentregable',
            disabled: true,
            text: me.etiquetas.lbDel,
            tooltip: me.etiquetas.lbDel + ' ' + me.etiquetas.lbEntregable.toLocaleLowerCase()
        });

        me.btnVerDetalles = Ext.create('Ext.Button', {
            iconCls: 'icondistra-ver icon-medium',
            action: 'verdetallesentregable',
            disabled: true,
            text: me.etiquetas.lbVerDetalles,
            tooltip: me.etiquetas.lbVerDetalles + ' ' + me.etiquetas.lbEntregable.toLocaleLowerCase()
        });

        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: true,
            items: [me.btnAdd, me.btnMod, me.btnDel, me.btnVerDetalles]
        });


        me.callParent();
    }
});
