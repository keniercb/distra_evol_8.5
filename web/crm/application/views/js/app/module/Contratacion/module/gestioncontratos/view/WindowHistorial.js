Ext.define('GestionContrato.view.WindowHistorial', {
    extend: 'Ext.window.Window',
    alias: 'widget.windowhistorial',

    maskOnDisable: false,
    constrain: true,
    modal: true,
    frame: false,
    border: false,
    width: 1000,
    minWidth: 600,
    height: 450,
    minHeight: 300,
    maximizable: true,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);

        this.title = this.etiquetas.lbHist;
        this.items = this.grid = Ext.create('GestionContrato.view.GridHistorialContratacion', {
            idcontrato: this.idcontrato,
            showModHistorico: this.showModHistorico
        });
        this.buttons = [
            {
                xtype: 'button',
                text: this.etiquetas.lbCerrar,
                iconCls: 'cerrar',
                listeners: {
                    click: function () {
                        me.destroy();
                    }
                }
            }
        ];

        this.callParent();
    }
});
