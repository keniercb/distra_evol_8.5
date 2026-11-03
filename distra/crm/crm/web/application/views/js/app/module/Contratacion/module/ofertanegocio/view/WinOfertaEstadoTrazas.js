Ext.define('OfertaNegocio.view.WinOfertaEstadoTrazas', {
    extend: 'Ext.window.Window',
    alias: 'widget.winofertaestadotrazas',
    margin: false,
    width: 850,
    height: 350,
    closable : true,
    closeAction: 'hide',
    modal: true,
    resizable : false,
    autoScroll: true,
    border: false,
    layout: 'fit',
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.buttons = [{
            text: me.etiquetas.lbBtnCerrar,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.qtipCerrar,
            action: 'cerrar',
            handler:function(){
                me.close();
            }
        }];

        me.items = Ext.create('OfertaNegocio.view.GpOfertaEstadoTrazas');

        me.callParent();
    }
});
