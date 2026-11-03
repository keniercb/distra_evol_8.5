UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var vistaRepli = new LOG.inv.replicar.View({
        acciones: acciones_reportes,
        idioma: LOG.util.UIManager.apply(LOG.inv.replicar.Idioma, LOG.util.Idioma)
    });
    vistaRepli.init();
    vistaRepli.view();
});
