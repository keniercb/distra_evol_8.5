Ext.define('Seguimiento.view.TrazasS', {
    extend: 'Ext.window.Window',
    alias: 'widget.fac_trazas',
    width: 900,
    height: 350,
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

        me.items = Ext.create('GestionContratoImportacion.view.GridEstadoTrazas',{
            nameStore:'Seguimiento.store.EstadoTrazas'
        });

        me.callParent();
    }
});
