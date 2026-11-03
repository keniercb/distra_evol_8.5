Ext.ns('LOG.inv.reposicion');
UCID.portal.cargarAcciones(window.parent.parent.parent.idFuncionalidad, function() {
    var idioma = LOG.util.UIManager.apply(LOG.inv.reposicion.Idioma, LOG.util.Idioma);
    var vistaPrincipal = new LOG.inv.reposicion.View({
        idioma: idioma,
        busquedaBasica: true,
        acciones : acciones_reportes
    });

    vistaPrincipal.init();
    vistaPrincipal.view();
});