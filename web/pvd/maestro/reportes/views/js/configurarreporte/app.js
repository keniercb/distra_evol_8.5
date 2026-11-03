Ext.ns('Maestro.ConfigurarReporte');

Maestro.ConfigurarReporte.App = Ext.extend( Maestro.ConfigurarReporte.base.App, {
	autoCreateMainView: true,
	mainView: 'viewport',
	namespace: 'Maestro.ConfigurarReporte',
	views:[
        {ref : 'viewport', name: 'Viewport', views: ['listmodule', 'treereporte', 'panelreportedetails']},
        {ref : 'listmodule', name: 'ListModule', stores:['module'], views: ['tbarmodule']},
        {ref : 'tbarmodule', name: 'TbarModule'},
        {ref : 'editmodule', name: 'EditModule'},
        {ref : 'treereporte', name: 'TreeReporte', stores:['reporte'], views: ['tbarreporte']},
        {ref : 'tbarreporte', name: 'TbarReporte'},
        {ref : 'panelreportedetails', name: 'PanelReporteDetails'},
        {ref : 'editreporte', name: 'EditReporte'},
        {ref : 'crudfilter', name: 'CrudFilter', views: ['listfilter']},
        {ref : 'listfilter', name: 'ListFilter', stores:['filter'], views: ['tbarfilter']},
        {ref : 'tbarfilter', name: 'TbarFilter'},
        {ref : 'editfilter', name: 'EditFilter'},
    ],
	stores: [
        {ref : 'module', name: 'Module'},
        {ref : 'reporte', name: 'Reporte'},
        {ref : 'filter', name: 'Filter'}
    ],
    resources: [
        {ref : 'module', name: 'Module'},
        {ref : 'reporte', name: 'Reporte'},
        {ref : 'filter', name: 'Filter'}
    ],
    controllers: ['ListModule', 'TreeReporte', 'ListFilter']
});

new Maestro.ConfigurarReporte.App();