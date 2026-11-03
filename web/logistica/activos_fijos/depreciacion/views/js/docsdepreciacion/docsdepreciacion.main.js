Ext.ns('LOG.aft.docsdepreciacion');
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var gridPlugins = new LOG.util.List();
    gridPlugins.add(new Ext.Cont.Plugins.GridColumnComprobanteReporte({
        textIndex: 'comprobante',
        idComprobantesCSVIndex: 'idcomprobante',
    }));
    var idioma = LOG.util.UIManager.apply(LOG.aft.docsdepreciacion.Idioma, LOG.util.Idioma);
    var winDocDepre = new LOG.aft.docsdepreciacion.View({
        acciones: acciones_reportes,
        idioma: idioma,
        busquedaBasica: true,
        busquedaAvanzada: true,
        gridPlugins: gridPlugins
    });
    winDocDepre.init();
    winDocDepre.view();
});