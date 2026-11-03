UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var vistaTransferenciainterna = new LOG.inv.transferenciainterna.View({
        acciones: acciones_reportes,
        busquedaBasica: true,
        busquedaAvanzada: true,
        idioma: LOG.util.UIManager.apply(LOG.inv.transferenciainterna.Idioma, LOG.util.Idioma)
    });
    vistaTransferenciainterna.init();
    vistaTransferenciainterna.view();

});