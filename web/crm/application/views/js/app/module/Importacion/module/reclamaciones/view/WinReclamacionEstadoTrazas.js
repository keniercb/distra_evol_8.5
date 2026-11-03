Ext.define('Reclamaciones.view.WinReclamacionEstadoTrazas', {
    extend: 'Ext.window.Window',
    alias: 'widget.winreclamacionestadotrazas',
    margin: false,
    width: 900,
    height: 400,
    closable : true,
    //closeAction: 'hide',
    modal: true,
    resizable : true,
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
        me.items = [Ext.create('Reclamaciones.view.GridEstadoTrazas',{
              nameStore:'Reclamaciones.store.ReclamacionEstadoTrazas'
        })];
        me.callParent();
    }
});
