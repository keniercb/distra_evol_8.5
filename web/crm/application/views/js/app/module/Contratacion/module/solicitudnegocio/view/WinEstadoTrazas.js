Ext.define('SolicitudNegocio.view.WinEstadoTrazas', {
    extend: 'Ext.window.Window',
    alias: 'widget.winestadotrazas',
    margin: false,
    width: 800,
    height: 300,
    closable : true,
    closeAction: 'destroy',
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
            handler: function(){
                me.close();
            }
        }];

        me.items = Ext.create('SolicitudNegocio.view.GpEstadoTrazas');

        me.callParent();
    }
});
