//Esto es para porner un panel con una página inicia

Ext.define('GestionContrato.view.MainContratacion', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.co_gcmainContratacion',
    frame: false,
    margin: false,
    border: false,

    initComponent: function () {
        var etiquetas = LangMgr.getLang(this);
        this.closable = true;

        this.title = etiquetas.moduleName;
        this.layout = 'border';

        this.items = [
            Ext.create('GestionContrato.view.MainGridContratacion')
        ];

        this.callParent();
    }
});
