Ext.define('OfertaNegocioImportacion.view.WinOfertaEstadoTrazas', {
    extend: 'Ext.window.Window',
    alias: 'widget.winofertaestadotrazasimportacion',
    margin: false,
    width: 900,
    height: 400,
    closable : true,
    closeAction: 'hide',
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
            action: 'cerrar',
            handler:function(){
                me.close();
            }
        }];

        me.items = Ext.create('GestionContratoImportacion.view.GridEstadoTrazas',{
            nameStore:'OfertaNegocioImportacion.store.OfertaEstadoTrazas'
        });

        me.callParent();
    }
});
