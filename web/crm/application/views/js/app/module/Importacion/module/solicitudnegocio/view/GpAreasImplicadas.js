Ext.define('SolicitudNegocioImportacion.view.GpAreasImplicadas', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gpareasimplicadasimportacion',
    height: 270,
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);

        me.store = Ext.create('SolicitudNegocioImportacion.store.AreasImplicadas');

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
                tooltip: me.etiquetas.ttipBtnAdicionarAreaImp,
                action: 'addareaimplicada'
            },{
                text: me.etiquetas.lbBtnDel,
                iconCls: 'icondistra-eliminar',
                tooltip: me.etiquetas.ttipBtnEliminarAreaImp,
                action: 'elimareaimplicada',
                disabled: true
            }
        ];

        this.callParent();
    }
});