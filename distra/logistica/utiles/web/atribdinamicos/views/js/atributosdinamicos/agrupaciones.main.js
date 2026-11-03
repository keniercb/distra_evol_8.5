UCID.portal.cargarAcciones(window.frameElement.id, function(){

    var idioma = LOG.util.UIManager.apply(LOG.lb.agrupaciones.Idioma, LOG.util.Idioma);
    var idiomaAtributo = LOG.util.UIManager.apply(LOG.lb.atributosdinamicos.Idioma, LOG.util.Idioma);

    var vista = new LOG.lb.agrupaciones.View({
        idioma: idioma,
        idiomaAtributo: idiomaAtributo,
        acciones: acciones_reportes
    });
    vista.init();
    vista.view();

//para instanciar el grid de atributos  formaVisualizacion: panel

});


