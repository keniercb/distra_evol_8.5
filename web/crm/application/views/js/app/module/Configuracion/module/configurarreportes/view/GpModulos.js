Ext.define('Reportes.view.GpModulos', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gpmodulos',
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.title = me.etiquetas.titleListModulos;
        me.store = Ext.create('Reportes.store.Modulos');

        me.columns = [
            {
                text: me.etiquetas.lbIdentificador,
                sortable: false,
                flex: 1,
                dataIndex: 'identificador'
            },{
                text: me.etiquetas.lbDenominacion,
                sortable: false,
                flex: 2,
                dataIndex: 'denominacion'
            }
        ];
       
        me.tbar= [
            {
                text: me.etiquetas.lbBtnAdd,
                iconCls: 'icondistra-adicionar',
                tooltip: me.etiquetas.qtipAdd.get(me.etiquetas.ttipBtnAdicionarModulo),
                action: 'addmodulo',
                keyMap: {
                    key: 'i',
                    alt: true,
                    event: 'click'
                }
            },{
                text: me.etiquetas.lbBtnMod,
                iconCls: 'icondistra-modificar',
                tooltip: me.etiquetas.qtipMod.get(me.etiquetas.ttipBtnModificarModulo),
                action: 'modmodulo',
                disabled: true,
                 keyMap: {
                    key: 'm',
                    alt: true,
                    event: 'click'
                }
            },
            {
                text: me.etiquetas.lbBtnDel,
                iconCls: 'icondistra-eliminar',
                tooltip:  me.etiquetas.qtipDel.get(me.etiquetas.ttipBtnEliminarModulo),
                action: 'elimmodulo',
                disabled: true,
                keyMap: {
                    key: Ext.EventObject.DELETE,
                    event: 'click'
                }
            }
        ];

        me.callParent();
    }
});
