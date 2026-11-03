Ext.ns('Maestro.ConfigurarReporte.view');

Maestro.ConfigurarReporte.view.TreeReporte = Ext.extend( Ext.tree.TreePanel, {
	autoScroll: true,
    animCollapse: false,
    animate: false,
    region: 'center',
    useArrows: true, 
    style: 'margin: 3px 2px 0px 3px', 
    initComponent: function(){
        var me = this,
            viewsRequired = (me.required)?me.required.views : null,
            storesRequired = (me.required)?me.required.stores : null,
            idiom = Maestro.ConfigurarReporte.idiom;

        me.tbar = viewsRequired.tbarreporte;
        me.loader = storesRequired.reporte;
        me.selModel = new Ext.tree.DefaultSelectionModel();
        
        me.root = new Ext.tree.AsyncTreeNode({
            id: 'root',
            text: idiom.lbNodeRootReporte,
            expanded: true,
        });
        Maestro.ConfigurarReporte.view.TreeReporte.superclass.initComponent.call(this);
    },
    initEvents : function(){
        Maestro.ConfigurarReporte.view.TreeReporte.superclass.initEvents.call(this);

        this.loadMask = new Ext.LoadMask(this.bwrap, {
            store: this.loader,
            msg: Maestro.ConfigurarReporte.idiom.waitLoadData,
        });
    },
});