Ext.define('Demanda.view.WinEstadoTrazas', {
    extend: 'Ext.window.Window',
    alias: 'widget.winestadotrazas',
    margin: false,
    width: 900,
    height: 400,
    closable : true,
    closeAction: 'destroy',
    modal: true,
    resizable : true,
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
            nameStore:'Demanda.store.EstadoTrazas'
        });

        me.callParent();
    }
});
