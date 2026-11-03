Ext.define('Seguimiento.view.WindowSeleccionarContrato',{
    extend:'Ext.ux.CustomWindow',
    alias:'widget.s_windowseleccioncontrato',
    layout:'fit',
    resizable:true,
    width:1000,
    height:500,
    initComponent: function(){
        var me=this;
        me.etiquetas = LangMgr.getLang(this);
        me.title=me.etiquetas.lbSeleccionarContrato;
        me.items=[
            Ext.create('Seguimiento.view.ContratosGrid',{
                detallado:true,
                storeId:'s_stSeleccionContratos',
            })
        ];
        me.callParent();
    }
})