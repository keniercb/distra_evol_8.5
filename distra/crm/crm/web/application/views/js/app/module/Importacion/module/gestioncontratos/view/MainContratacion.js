//Esto es para porner un panel con una página inicia

Ext.define('GestionContratoImportacion.view.MainContratacion', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.co_gcmainContratacionimportacion',
    frame: false,
    margin: false,
    border: false,

    initComponent: function () {
        var etiquetas = LangMgr.getLang(this);
        this.closable = true;

        this.title = etiquetas.moduleName;
        this.layout = 'border';

        this.items = [
            Ext.create('GestionContratoImportacion.view.MainGridContratacion')
        ];

        this.callParent();
    }
});
