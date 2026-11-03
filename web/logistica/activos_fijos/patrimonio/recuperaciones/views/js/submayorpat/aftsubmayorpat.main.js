Ext.ns('Log.aft.submayorpat');
UCID.portal.cargarAcciones(window.parent.parent.parent.idFuncionalidad, function() {
    Log.aft.submayor.acciones = acciones_reportes;
    var idioma = LOG.util.UIManager.apply(Log.aft.submayorpat.Idioma, LOG.util.Idioma);
    var VentanaInicial= new Log.aft.submayorpat.View({
        idioma: idioma,
    });
    VentanaInicial.init();
    VentanaInicial.view();
});
