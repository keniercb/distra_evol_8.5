Ext.ns('Log.aft.rcp');
UCID.portal.cargarAcciones(window.parent.parent.parent.idFuncionalidad, function () {
    Log.aft.rcp.acciones = acciones_reportes;
    var idioma = LOG.util.UIManager.apply(Log.aft.rcp.Idioma, LOG.util.Idioma);
    var vista = new Log.aft.rcp.View({
        idioma: idioma
    });
    vista.init();
    vista.view();
});




