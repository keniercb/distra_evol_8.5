Ext.define('GestionContrato.view.WinAreaConPermiso', {
    extend: 'Ext.window.Window',
    alias: 'widget.winareaconpermiso',
    frame: false,
    margin: false,
    border: false,
    width: 400,
    height: 400,
    closable: true,
    closeAction: 'hide',
    modal: true,
    resizable: false,
    layout: 'fit',

    initComponent: function () {

        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.title = 'Áreas con permiso a ver contrato';

        me.store = Ext.create('GestionContrato.store.Areas');

        me.tree = Ext.create('Ext.tree.Panel', {
            cls: 'crm-icon-tree',
            name: 'areatree',
            store: me.store,
            rootVisible: false,
            autoScroll: true,
            selType: 'checkboxmodel',

        });

        me.items = me.tree;

        me.buttons = [
            {
                text: me.etiquetas.lbBtnCancel,
                iconCls: 'icondistra-cancelar',
                tooltip: me.etiquetas.qtipCancel,
                action: 'cerrar'
            }, {
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
