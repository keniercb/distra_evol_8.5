Ext.define('GestionContrato.view.WinContratoEstadoTrazas', {
    extend: 'Ext.window.Window',
    alias: 'widget.wincontratoestadotrazas',
    margin: false,
    width: 850,
    height: 350,
    closable : true,
    //closeAction: 'hide',
    modal: true,
    resizable : false,
    autoScroll: true,
    border: false,
    layout: 'fit',
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.buttons = [{
            text: me.etiquetas.lbCerrar,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.lbCerrar,
            action: 'cerrar',
            handler:function(){
                me.close();
            }
        }];
        me.items = [Ext.create('GestionContrato.view.GridContratoEstadoTrazas')];
        me.callParent();
    }
});
