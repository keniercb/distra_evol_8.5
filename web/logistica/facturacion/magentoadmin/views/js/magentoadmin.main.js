UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var vistaOrdenes = new LOG.fact.magentoadmin.View({
        acciones: acciones_reportes
    });
    vistaOrdenes.init();
    vistaOrdenes.view();
})
