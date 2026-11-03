UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(Ext.LOG.registroNumericoDepreciacion.Idioma, LOG.util.Idioma);
    var winRegistroDepre = new Ext.LOG.registroNumericoDepreciacion.ventana({
        idioma: idioma,
        acciones: acciones_reportes
    });
    winRegistroDepre.init();
    winRegistroDepre.view();

//subiendo...
});