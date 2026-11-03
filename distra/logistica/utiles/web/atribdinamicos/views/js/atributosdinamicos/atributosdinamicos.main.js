UCID.portal.cargarAcciones(window.frameElement.id, function(){

    var idioma = LOG.util.UIManager.apply(LOG.lb.atributosdinamicos.Idioma, LOG.util.Idioma);

    var vista = new LOG.lb.atributosdinamicos.View({
        idioma: idioma,
        acciones: acciones_reportes
    });
    vista.init();
    vista.view();

//para instanciar el grid de atributos  formaVisualizacion: panel

});


