Ext.ns('Maestro.ConfigurarReporte.view');

Maestro.ConfigurarReporte.view.ListModule = Ext.extend( Ext.grid.GridPanel, {
	loadMask: true,
	stripeRows: true,
    width: 380,
    region: 'west',
    initComponent: function(){
        var me = this,
            viewsRequired = (me.required)?me.required.views : null,
            storesRequired = (me.required)?me.required.stores : null,
            idiom = Maestro.ConfigurarReporte.idiom;

        me.title = idiom.lbTitleListModule;
        me.tbar = viewsRequired.tbarmodule;
        me.store = storesRequired.module;
        
        me.sm = new Ext.grid.CheckboxSelectionModel();

        me.columns = [
            me.sm,
            {header: idiom.lbColIdentificador, fixed: true, width: 100, sortable: true, dataIndex: 'identificador'},
            {header: idiom.lbColDenominacion, sortable: true, dataIndex: 'denominacion'}
        ];	

        me.viewConfig = {
			forceFit: true,
			deferEmptyText: idiom.emptyData,
			emptyText : idiom.emptyData,
		};

        Maestro.ConfigurarReporte.view.ListModule.superclass.initComponent.call(this);
    }
});