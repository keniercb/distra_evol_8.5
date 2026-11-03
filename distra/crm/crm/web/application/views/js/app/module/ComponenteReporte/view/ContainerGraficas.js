//Esto es para porner un panel con una página inicia

Ext.define('ComponenteReporte.view.ContainerGraficas', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    alias: 'widget.containergraficas',
    initComponent: function() {
        // this.title = 'Inicio';
        this.layout = 'fit';
        this.html = '<iframe id=chartIframe' + ' style="border: none;" src= " ../../views/js/app/view/dashboard/index.html" width="100%" height="100%" on>' + '</iframe>';
        this.callParent();
    }
});
