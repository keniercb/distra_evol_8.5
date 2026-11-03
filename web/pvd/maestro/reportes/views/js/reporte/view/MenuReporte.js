Ext.ns('Maestro.Reporte.view');

Maestro.Reporte.view.MenuReporte = Ext.extend( Ext.tree.TreePanel, {
	autoScroll: true,
    animCollapse: false,
    animate: false,
    region: 'west',
    useArrows: true,  
    rootVisible: true, 
    width: 250,
    initComponent: function(){
        var me = this,
            storesRequired = (me.required)?me.required.stores : null,
            idiom = Maestro.Reporte.idiom;

        me.loader = storesRequired.reportemenu;
        me.selModel = new Ext.tree.DefaultSelectionModel();
        
        me.root = new Ext.tree.AsyncTreeNode({
            id: 'root',
            text: idiom.lbNodeRootReporte,
            expanded: true,
        });

        me.title = idiom.lbTitleMenuReporte;
        
        Maestro.Reporte.view.MenuReporte.superclass.initComponent.call(this);    
    }
});