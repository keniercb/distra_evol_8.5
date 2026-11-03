var idioma = LOG.util.UIManager.apply(LOG.fac.administrar.Idioma, LOG.util.Idioma.init());
var ventana = new LOG.fac.administrar.tbGeneral({
    idioma: idioma,
    formaVisualizacion: 'viewport'
});
ventana.init();
ventana.view();
