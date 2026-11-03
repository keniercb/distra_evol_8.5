UCID.portal.cargarAcciones(window.frameElement.id, function(){

    var idioma = LOG.util.UIManager.apply(LOG.lb.nomdinamicos.Idioma, LOG.util.Idioma);

    var vista = new LOG.lb.nomdinamicos.View({
        idioma: idioma,
        acciones: acciones_reportes
    });
    vista.init();
    vista.view();

//para instanciar el grid de atributos  formaVisualizacion: panel

});


