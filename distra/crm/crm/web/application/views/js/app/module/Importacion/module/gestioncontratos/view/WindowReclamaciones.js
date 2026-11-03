Ext.define('GestionContratoImportacion.view.WindowReclamaciones', {
    extend: 'Ext.window.Window',
    alias: 'widget.windowreclamacionesimportacion',

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

        this.title = this.etiquetas.lbReclamacion;
        this.items = this.grid = Ext.create('GestionContratoImportacion.view.GridReclamacionContratacion', {
            idcontrato: this.idcontrato});
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
