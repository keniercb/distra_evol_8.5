Ext.ns('Maestro.ConfigurarReporte.view');

Maestro.ConfigurarReporte.view.ListFilter = Ext.extend( Ext.grid.GridPanel, {
	loadMask: true,
	stripeRows: true,
    initComponent: function(){
        var me = this,
            viewsRequired = (me.required)?me.required.views : null,
            storesRequired = (me.required)?me.required.stores : null,
            idiom = Maestro.ConfigurarReporte.idiom;

        me.tbar = viewsRequired.tbarfilter;
        me.store = storesRequired.filter;
        
        me.sm = new Ext.grid.CheckboxSelectionModel();

        me.columns = [
            me.sm,
            {header: idiom.lbColDenominacion, sortable: true, dataIndex: 'denominacion'},
            {header: idiom.lbColType, fixed: true, width: 100, sortable: true, dataIndex: 'tipo', renderer: this.formatTypeFilter},
            {header: idiom.lbColParamName, fixed: true, width: 100, sortable: true, dataIndex: 'nombreparametro'},
            {header: idiom.lbColOrden, fixed: true, align: 'center', width: 50, sortable: true, dataIndex: 'orden'},
        ];	

        me.viewConfig = {
			forceFit: true,
			deferEmptyText: idiom.emptyData,
			emptyText : idiom.emptyData,
		};

        Maestro.ConfigurarReporte.view.ListFilter.superclass.initComponent.call(this);
    },
    formatTypeFilter: function(val){
        var idiom = Maestro.ConfigurarReporte.idiom;
        
        switch(val){
            case '1' : return idiom.lbActionFilterText;break;
            case '2' : return idiom.lbActionFilterDate;break;
            case '3' : return idiom.lbActionFilterNumeric;break;
            case '4' : return idiom.lbActionFilterNomenclador;break;
            case '5' : return idiom.lbActionFilterEstructura;break;
        }
    }
});