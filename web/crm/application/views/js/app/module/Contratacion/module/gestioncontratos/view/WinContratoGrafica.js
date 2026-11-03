Ext.define('GestionContrato.view.WinContratoGrafica', {
    extend: 'Ext.window.Window',
    alias: 'widget.wincontratografica',
    margin: false,
    width: 980,
    height: 500,
    closable: true,
    modal: true,
    resizable: false,
    autoScroll: true,
    border: false,
    layout: 'fit',
    maximizable: true,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.buttons = [{
            text: me.etiquetas.lbCerrar,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.lbCerrar,
            action: 'cerrar',
            handler: function () {
                me.close();
            }
        }];
        me.items = [Ext.create('GestionContrato.view.Grafica',{
            idcontratos: me.idcontratos,
            winContratoGrafica: me
        })];
        me.callParent();
    }
});
