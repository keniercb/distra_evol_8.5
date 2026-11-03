Ext.define('Reportes.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.configreportes',
    border: false,
    closable: true,
    layout: 'border',
    initComponent: function() {
        this.getLang();
        this.title = this.etiquetas.moduleName;

        this.items =[
            Ext.create('Reportes.view.GpModulos',{
                region: 'west',
                width: 300,
                margin: '0 5px 0 0'
            }),
            Ext.create('Reportes.view.TreeReportes',{
                region: 'center'
            })
        ];

        this.callParent();
    }
});
