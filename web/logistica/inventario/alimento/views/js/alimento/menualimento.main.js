UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var vistaMenuAlimento = new LOG.inv.alimento.View({
        acciones: acciones_reportes
    });
    vistaMenuAlimento.init();
    vistaMenuAlimento.view();
});