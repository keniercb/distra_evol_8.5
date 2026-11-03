UCID.portal.cargarAcciones(window.frameElement.id, function() {
var idioma = LOG.util.UIManager.apply(LOG.lb.dispositivos.Idioma, LOG.util.Idioma);
/*var VentanaInicial= new LOG.lb.cierre.component.View({
    idioma: idioma
});
VentanaInicial.init();
VentanaInicial.view();*/
var VentanaInicial= new LOG.lb.dispositivos.View({
    idioma: idioma,
    acciones: acciones_reportes,
});
/*VentanaInicial.attachPlugin(new LOG.lb.plugin.ComboDepositos({
    caso : 3
},0));*/
VentanaInicial.init();
VentanaInicial.view();
});


