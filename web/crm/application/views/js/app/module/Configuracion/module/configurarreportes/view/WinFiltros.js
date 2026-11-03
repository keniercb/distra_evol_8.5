Ext.define('Reportes.view.WinFiltros', {
    extend: 'Ext.window.Window',
    alias: 'widget.winfiltros',
    frame: false,
    margin: false,
    border: false,
    width: 550,
    height: 400,
    closable : true,
    closeAction: 'hide',
    modal: true,
    resizable:false,
    layout: 'fit',
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.title = me.etiquetas.titleListFiltros;
        me.items = [Ext.create('Reportes.view.GpFiltros')];

        me.buttons = [{
            text: me.etiquetas.lbBtnClose,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.qtipClose,
            action: 'cerrar'
        }];

        me.callParent();
    }
});
