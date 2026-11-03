Ext.ns('Maestro.Reporte.controller');

Maestro.Reporte.controller.MenuReporte = Ext.extend( Maestro.ConfigurarReporte.base.Controller,{
    init: function(){

        this.registerEvents({
            'menureporte selModel': {
                selectionchange: this.onSelectionChange
            },
        	'tabpanelreporte': {
        		tabchange : this.onTabChange,
        	}
        }, this);
    },
    onSelectionChange: function(sm, node){
        if(node && node.attributes.agrupador != 1 && node.id != 'root')
            this.activeReporteTab(node);
    },
    activeReporteTab: function(node){
    	var me = this,
    		tabpanel = me.getView('tabpanelreporte'),
    		tabId = 'tab_'+node.id,
    		isRenderedTab = tabpanel.getItem(tabId);

		if(!isRenderedTab)
			this.createTabReporte(tabId, node.attributes);

    	tabpanel.activate(tabId);

    },
    createTabReporte: function(tabid, config){
		var me = this,
    		tabpanel = me.getView('tabpanelreporte'),
            idmodule = (me.application.initConfig)?me.application.initConfig.idmodule: '';
        
		tabpanel.add({
            title: config.denominacion,
            id: tabid,
            tabTip: config.denominacion,
            height: '100%',
            closable: true,
            layout: 'fit',
            border: false,
            items: [(new Maestro.Reporte.ReporteApp({idmodule: idmodule, idreporte: config.identificador})).getMainView()]
        });
    },
    onTabChange: function(tabpanel, panel){
    	var nodeId = panel.id.split('tab_')[1],
    		menureporte = this.getView('menureporte'),
    		node = menureporte.getNodeById(nodeId),
    		sm = menureporte.getSelectionModel();

    	if(node)
    		sm.select(node);
    	else
    		sm.clearSelections();
    }
});