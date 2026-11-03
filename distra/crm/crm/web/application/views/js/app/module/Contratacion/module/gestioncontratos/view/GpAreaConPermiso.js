Ext.define('GestionContrato.view.GpAreaConPermiso', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gpareaconpermiso',
    height: 270,
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);

        me.store = Ext.create('GestionContrato.store.AreaConPermiso');

        me.columns = [{
            text: me.etiquetas.lbDenominacion,
            sortable: false,
            flex: 1,
            dataIndex:'area'
        }];

        me.tbar= [
            {
                text: me.etiquetas.lbBtnAdicionar,
                iconCls: 'icondistra-adicionar',
                tooltip: me.etiquetas.ttipBtnAdicionarAreaConPermiso,
                action: 'addareaconpermiso'
            },{
                text: me.etiquetas.lbBtnDel,
                iconCls: 'icondistra-eliminar',
                tooltip: me.etiquetas.ttipBtnEliminarAreaConPermiso,
                action: 'elimareaconpermiso',
                disabled: true
            }
        ];

        this.callParent();
    }
});