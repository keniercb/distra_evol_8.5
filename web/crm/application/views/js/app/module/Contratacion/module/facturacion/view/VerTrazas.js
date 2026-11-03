Ext.define('Facturacion.view.VerTrazas', {
    extend: 'Ext.window.Window',
    alias: 'widget.fac_vertrazas',
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
            text: me.etiquetas.lbCerrar,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.qtipCerrar,
            handler: function(){
                me.close();
            }
        }];

        me.items = Ext.create('GestionContrato.view.GridEstadoTrazas',{
            nameStore:'Facturacion.store.HitoEstadoTrazas'
        });

        me.callParent();
    }
});
