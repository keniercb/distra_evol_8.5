//Esto es para porner un panel con una página inicia

Ext.define('CRM.view.InitPage', {
    extend: 'Ext.panel.Panel',
    layout: 'border',
    alias: 'widget.initpage',
    iconCls: ' icondistra-iniciocrm',
    initComponent: function() {
        this.title = 'Inicio';
        // this.layout = 'fit';
        //this.html = '<iframe id=chartIframe' + ' style="border: none;" src= " ../../views/js/app/view/dashboard/index.html" width="100%" height="100%" on>' + '</iframe>';
        this.html = '<img src="../../../application/views/images/gestioncomercial.png" width="100%" height="100%" style="position: absolute"/>';
        this.callParent();
    }
});
