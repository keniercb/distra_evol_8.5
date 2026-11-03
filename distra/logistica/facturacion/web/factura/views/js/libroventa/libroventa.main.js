Ext.ns('LOG.fac.libroventa');
var idioma = LOG.util.UIManager.apply(LOG.fac.libroventa.Idioma, LOG.util.Idioma);
var vistaLibroventa = new LOG.fac.libroventa.View({
    busquedaAvanzada: false,
    idioma: idioma
});
vistaLibroventa.init();	
vistaLibroventa.view();