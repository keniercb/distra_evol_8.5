Ext.ns('LOG.inv.rotacionlote');
UCID.portal.cargarAcciones(window.parent.parent.parent.idFuncionalidad, function() {
    var idioma = LOG.util.UIManager.apply(LOG.inv.rotacionlote.Idioma, LOG.util.Idioma);
    var VentanaInicial= new LOG.inv.rotacionlote.View({
        idioma: idioma,
        busquedaBasica: true,
        busquedaAvanzada: true,
        acciones : acciones_reportes
    });

    VentanaInicial.init();
    VentanaInicial.view();
});