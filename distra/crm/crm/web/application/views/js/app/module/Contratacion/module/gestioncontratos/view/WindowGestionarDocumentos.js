Ext.define('GestionContrato.view.WindowGestionarDocumentos', {
    extend: 'Ext.window.Window',
    alias: 'widget.windowgestionardocumentos',
    constrain: true,
    modal: true,
    // frame: false,
    border: false,
    // width: 100,
    minWidth: 700,
    // height: 100,
    minHeight: 120,
    maximizable: false,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);

        this.title = 'Gestionar documentos';

        this.items = [
            Ext.create('GestionContrato.view.DocumentosAdicionales'),
            {
                xtype: 'hiddenfield',
                name: 'idcontrato',
                itemId: 'idcontrato'
            }
        ];

        this.buttons = [
            {
                text: this.etiquetas.lbBtnCancel,
                tooltip: this.etiquetas.qtipCancel,
                action: 'cancel',
                iconCls: 'cancelar',
                listeners: {
                    click: function () {
                        me.destroy();
                    }
                }
            },
            {
                text: this.etiquetas.lbBtnAccept,
                tooltip: this.etiquetas.qtipAccept,
                itemId: 'acept',
                action: 'acept',
                disabled: true,
                iconCls: 'aceptar'
            }
        ];

        this.callParent();
    }
});