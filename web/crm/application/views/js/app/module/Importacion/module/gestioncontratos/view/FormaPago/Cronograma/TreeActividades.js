Ext.define('GestionContratoImportacion.view.FormaPago.Cronograma.TreeActividades', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treeactividadesimportacion',
    region: 'center',
    autoScroll: true,
    border: false,
    frame: false,
    rootVisible: false,
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        me.selModel = {mode: 'MULTI'};
        me.frame = false;
        me.border = false;
        me.store = Ext.create('GestionContratoImportacion.store.Actividades', {
            root: {id: 0, denominacion: me.etiquetas.lbActividades}
        });
        me.columns = [
            Ext.create('Ext.tree.Column', {
                text: me.etiquetas.lbName,
                dataIndex: 'denominacion',
                flex: 0.6
            }), {
                text: me.etiquetas.lbFechaInicio,
                dataIndex: 'fechainicio',
                flex: 0.1
            },{
                text: me.etiquetas.lbFechaFin,
                dataIndex: 'fechafin',
                flex: 0.1
            }, {
                text: me.etiquetas.lbTotalAmount,
                dataIndex: 'monto',
                flex: 0.2
            }
        ];

        me.btnAdd = Ext.create('Ext.Button', {
            iconCls: 'icondistra-adicionar icon-medium',
            text: me.etiquetas.lbAdd,
            action: 'addhito',
            tooltip: me.etiquetas.lbAdd + ' ' + me.etiquetas.lbHitoPago.toLocaleLowerCase()
        });

        me.btnMod = Ext.create('Ext.Button', {
            iconCls: 'icondistra-modificar icon-medium',
            action: 'edithito',
            disabled: true,
            text: me.etiquetas.lbMod,
            tooltip: me.etiquetas.lbMod + ' ' + me.etiquetas.lbHitoPago.toLocaleLowerCase()
        });

        me.btnDel = Ext.create('Ext.Button', {
            iconCls: 'icondistra-eliminar icon-medium',
            action: 'delhito',
            disabled: true,
            text: me.etiquetas.lbDel,
            tooltip: me.etiquetas.lbDel + ' ' + me.etiquetas.lbHitoPago.toLocaleLowerCase() + ' <b>(DEL)</b>'
        });

        /*me.tbar = Ext.create('Ext.toolbar.Toolbar', {
         enableOverflow: true,
         items: [me.btnAdd, me.btnMod, me.btnDel]
         });*/


        me.callParent();
    }
});
