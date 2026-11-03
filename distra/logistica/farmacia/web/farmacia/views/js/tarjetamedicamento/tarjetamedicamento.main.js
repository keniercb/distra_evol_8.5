UCID.portal.cargarAcciones(window.frameElement.id, function(){

    var idioma = LOG.util.UIManager.apply(LOG.farm.tarjetamedicamento.Idioma, LOG.util.Idioma);

    var vista = new LOG.farm.tarjetamedicamento.View({
        idioma: idioma,
        acciones: acciones_reportes
    });
    vista.init();
    vista.view();

});