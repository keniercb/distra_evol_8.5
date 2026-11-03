Ext.ns('Maestro.Reporte.view');

Maestro.Reporte.view.TabPanelReporte = Ext.extend(Ext.TabPanel, {
	activeTab: 0,
    region: 'center',
    autoScroll : true,
    style: 'margin: 0 0 0 5px', 
    activeTab: 0,
    layoutOnTabChange : true, 
    enableTabScroll: true,
    deferredRender: false,
    initComponent: function(){
        var me = this,
            idiom = Maestro.Reporte.idiom;

        me.items = {
            title : idiom.lbTitlePrincipalTab,
            cls: 'menureporte-principalTab',
            html: '<div class="info-container"><div class="info"><p>'+idiom.lbMsgPrincipalTab+'</p><hr/></div></div>'
            //<h3>Aqui supuestamenta va en nombre del modulo</h3>
        };
        
        Maestro.Reporte.view.TabPanelReporte.superclass.initComponent.call(this);
    }
});