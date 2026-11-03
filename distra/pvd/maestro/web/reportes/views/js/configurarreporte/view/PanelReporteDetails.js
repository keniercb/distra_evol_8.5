Ext.ns('Maestro.ConfigurarReporte.view');

Maestro.ConfigurarReporte.view.PanelReporteDetails = Ext.extend( Ext.Panel, {
	region: 'south',
    autoScroll: true,
    style: 'margin: 9px 2px 2px 3px', 
    cls: 'detailspanel',
    height: 160,
    initComponent: function(){
        var me = this,
            idiom = Maestro.ConfigurarReporte.idiom;

        me.title = idiom.lbTitlePanelReporteDetails; 
        me.html = idiom.lbEmptyReporteDetails;

        me.detailsTpl = new Ext.XTemplate(
            '<h2 class="reporteName">{denominacion}</h2>',
            '<p><b>Identificador</b>: {identificador}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
            '<b>General</b>: ',
            '<tpl if="general == 0">No</tpl>',
            '<tpl if="general == 1">Si</tpl>',
            '</p>',
            '<p><b>Tipo contenido</b>: ',
            '<tpl if="tipocontenido == 1">'+idiom.reportContentTypeServerFile+'</tpl>',
            '<tpl if="tipocontenido == 2">'+idiom.reportContentTypeJasperFile+'</tpl>',
            '<tpl if="tipocontenido == 3">'+idiom.reportContentTypeComponent+'</tpl>',
            '</p>',
            '<tpl if="tipocontenido == 1"><p><b>Url</b>: {url}</p></tpl>',
            '<tpl if="tipocontenido == 2"><p><b>Recurso</b>: {recurso}</p></tpl>',
            '<tpl if="tipocontenido == 3"><p><b>Nombre componente</b>: {nombrecomponente}</p></tpl>'
            
        );
        me.detailsTpl.compile();

        Maestro.ConfigurarReporte.view.PanelReporteDetails.superclass.initComponent.call(this);
    },
});