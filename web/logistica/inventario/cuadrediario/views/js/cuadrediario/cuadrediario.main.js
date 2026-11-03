UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var vistacuadrediario = new LOG.inv.cuadrediario.View({
        acciones: acciones_reportes,
        busquedaBasica: false,
        busquedaAvanzada: true,
        idioma: LOG.util.UIManager.apply(LOG.inv.cuadrediario.Idioma, LOG.util.Idioma)
    });
    vistacuadrediario.init();
    vistacuadrediario.view();

});