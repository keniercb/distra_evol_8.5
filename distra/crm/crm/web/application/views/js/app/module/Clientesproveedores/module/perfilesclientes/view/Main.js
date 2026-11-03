//Esto es para porner un panel con una página inicia

Ext.define('PerfilesClientes.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mainperfil',
    frame: false,
    margin: false,
    border: false,

    initComponent: function() {

        var etiquetas = LangMgr.getLang(this);
        this.closable = true;

        this.title = etiquetas.moduleName;
        this.layout= 'border';

        this.items = [
            Ext.create('PerfilesClientes.view.PanelDataView')
        ];

        this.callParent();
    }
});
