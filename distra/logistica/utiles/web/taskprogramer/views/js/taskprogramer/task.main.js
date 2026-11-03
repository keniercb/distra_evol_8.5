UCID.portal.cargarAcciones(window.frameElement.id, function(){

    var idioma = LOG.util.UIManager.apply(LOG.lb.task.Idioma, LOG.util.Idioma);

    var vista = new LOG.lb.task.View({
        idioma: idioma,
        acciones: acciones_reportes
    });
    vista.init();
    vista.view();

});


