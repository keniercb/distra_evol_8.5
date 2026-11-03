Ext.ns('Maestro.Reporte');

Maestro.Reporte.MenuApp = Ext.extend( Maestro.ConfigurarReporte.base.App, {
	mainView: 'container',
	namespace: 'Maestro.Reporte',
	views:[
        {ref : 'container', name: 'Container', views: ['menureporte', 'tabpanelreporte']},
        {ref : 'menureporte', name: 'MenuReporte', stores:['reportemenu']},
        {ref : 'tabpanelreporte', name: 'TabPanelReporte'},
    ],
	stores: [{ref : 'reportemenu', name: 'MenuReporte'}],
    controllers: ['MenuReporte']
});