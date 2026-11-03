UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var vistaComprobante = new LOG.lb.comprobante.View({
        idioma: LOG.util.UIManager.apply(LOG.lb.comprobante.Idioma, LOG.util.Idioma),
        acciones: acciones_reportes,
        subsistema: LOG.util.Subsistemas.inventario
    });
    vistaComprobante.init();
    vistaComprobante.view();
});