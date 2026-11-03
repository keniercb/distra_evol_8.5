UCID.portal.cargarAcciones(window.frameElement.id, function() {
var idioma = LOG.util.UIManager.apply(Log.lb.cierre.Idioma, LOG.util.Idioma);
/*var VentanaInicial= new LOG.lb.cierre.component.View({
    idioma: idioma
});
VentanaInicial.init();
VentanaInicial.view();*/
var VentanaInicial= new log.lb.cierreinventario.View({
    idioma: idioma,
    acciones: acciones_reportes,
});
VentanaInicial.init();
VentanaInicial.view();
});


