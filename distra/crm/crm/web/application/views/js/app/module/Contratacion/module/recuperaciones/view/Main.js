Ext.define('Recuperaciones.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.recuperaciones_main',
    closable: true,
    border: false,
    layout: 'fit',
    module: 'Recuperaciones',
    initComponent: function () {
        this.createBody();
        this.callParent();
    },
    createBody: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);
        this.title = this.etiquetas.moduleName;

        this.items = Ext.create('ComponenteReporte.view.Main',{
            identificadormodulo: 'contratacion'
        });
    }
});