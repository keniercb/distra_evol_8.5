Ext.define('SolicitudPago.view.WindowSeleccionarContrato',{
    extend:'Ext.ux.CustomWindow',
    alias:'widget.sp_windowseleccionarcontrato',
    layout:'fit', resizable:true,
    width:1000,
    height:500,
    initComponent: function(){
        var me=this;
        me.etiquetas = LangMgr.getLang(this);
        me.title=me.etiquetas.lbSeleccionarContrato;
        me.items=[
            Ext.create('SolicitudPago.view.ContratoGrid',{
                detallado:true, storeId:'sp_stSeleccionarContratos',
            })
        ];
        me.callParent();
    }
})