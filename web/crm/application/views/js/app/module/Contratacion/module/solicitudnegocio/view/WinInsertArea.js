Ext.define('SolicitudNegocio.view.WinInsertArea', {
    extend: 'Ext.window.Window',
    alias: 'widget.wininsertarea',
    frame: false,
    margin: false,
    border: false,
    width: 400,
    height: 400,
    closable : true,
    closeAction: 'hide',
    modal: true,
    resizable: false,
    layout: 'fit',
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.title = me.etiquetas.titleWinInsertAreaImplicada;

        me.store = Ext.create('GestionContrato.store.Areas');

        me.tree = Ext.create('Ext.tree.Panel', {
            cls: 'crm-icon-tree',
            name: 'areatree',
            store: me.store,
            rootVisible: false,
            autoScroll: true,
        });

        me.items = me.tree;

        me.buttons = [
            {
                text: me.etiquetas.lbBtnCancel,
                iconCls: 'icondistra-cancelar',
                tooltip: me.etiquetas.qtipCancel,
                action: 'cerrar'
            },{
                text: me.etiquetas.lbBtnAccept,
                iconCls: 'icondistra-aceptar',
                tooltip: me.etiquetas.qtipAccept,
                disabled: true,
                action: 'aceptar'
            }
        ];

        me.callParent();
    }
});
