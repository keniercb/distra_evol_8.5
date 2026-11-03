UCID.portal.cargarAcciones(window.frameElement.id, function() {

    var receta = new LOG.inv.receta.View({
        acciones: acciones_reportes,
    });
    receta.init();
    receta.view();
});




