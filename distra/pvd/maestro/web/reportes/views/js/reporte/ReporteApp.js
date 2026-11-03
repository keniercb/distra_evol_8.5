Ext.ns('Maestro.Reporte');

Maestro.Reporte.ReporteApp = Ext.extend( Maestro.ConfigurarReporte.base.App, {
	mainView: 'container',
	namespace: 'Maestro.Reporte',
	views:[
        {ref : 'container', name: 'ContainerReporte', views: ['panelfilters', 'reportedata']},
        {ref : 'panelfilters', name: 'PanelFilter'},
        {ref : 'reportedata', name: 'ReporteData', views: ['tbarreporte']},
        {ref : 'tbarreporte', name: 'TbarReporteData'},
    ],
    controllers: ['Reporte']
});