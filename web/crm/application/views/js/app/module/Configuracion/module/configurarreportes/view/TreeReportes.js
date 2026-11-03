Ext.define('Reportes.view.TreeReportes', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treereportes',
    loadMask: true,
    autoScroll: true,
    useArrows: true,
    rootVisible: true,
    selModel: {
        selType: 'treemodel',
        pruneRemoved: true
    },
    columnLines: true,
    rowLines: true,
    viewConfig: {
        bubbleEvents: ['refresh'],
        loadMask: true
    },
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.title = me.etiquetas.titleListReportes;

        me.store = Ext.create('Reportes.store.Reportes');

        me.root = {
            idreporte: 'root',
            denominacion: me.etiquetas.lbRootDenominacion,
            expanded: true
        };

        me.columns = [{
            xtype: 'treecolumn',
            text: me.etiquetas.lbDenominacion,
            flex: 2,
            sortable: true,
            dataIndex: 'denominacion'
        }, {
            header: me.etiquetas.lbAgrupador,
            dataIndex: 'agrupador',
            width: 60,
            menuDisabled: true,
            align: 'center',
            renderer: function (value, meta, record) {
                if (!record.isRoot()) {
                    if (value == 1)
                        return 'Si';
                    return 'No';
                }
            }
        }, {
            header: me.etiquetas.lbTipoContenido,
            dataIndex: 'tipocontenido',
            align: 'center',
            width: 180,
            renderer: function (value) {
                switch (value) {
                    case 1:
                        return me.etiquetas.reportContentTypeServerFile;
                    case 2:
                        return me.etiquetas.reportContentTypeJasperFile;
                    case 3:
                        return me.etiquetas.reportContentTypeComponent;
                    case 4:
                        return me.etiquetas.reportContentTypeReportServerFile;
                }
            }
        }];

        me.tbar = [
            {
                text: me.etiquetas.lbBtnAdd,
                iconCls: 'icondistra-adicionar',
                tooltip: me.etiquetas.qtipAdd.get(me.etiquetas.ttipBtnAdicionarReporte),
                action: 'addreporte',
                disabled: true,
                keyMap: {
                    key: 'i',
                    ctrl: true,
                    event: 'click'
                }
            }, {
                text: me.etiquetas.lbBtnMod,
                iconCls: 'icondistra-modificar',
                tooltip: me.etiquetas.qtipMod.get(me.etiquetas.ttipBtnModificarReporte),
                action: 'modreporte',
                disabled: true,
                keyMap: {
                    key: 'm',
                    ctrl: true,
                    event: 'click'
                }
            },
            {
                text: me.etiquetas.lbBtnDel,
                iconCls: 'icondistra-eliminar',
                tooltip: me.etiquetas.qtipDel.get(me.etiquetas.ttipBtnEliminarReporte),
                action: 'elimreporte',
                disabled: true,
                keyMap: {
                    key: Ext.EventObject.DELETE,
                    ctrl: true,
                    event: 'click'
                }
            }, '|', {
                text: me.etiquetas.lbBtnFiltros,
                iconCls: 'icondistra-editar',
                tooltip: me.etiquetas.ttipBtnFiltrosReporte,
                action: 'filtrosreporte',
                disabled: true,
                keyMap: {
                    key: 'f',
                    alt: true,
                    event: 'click'
                }
            }
        ];

        me.callParent();
    }
});
