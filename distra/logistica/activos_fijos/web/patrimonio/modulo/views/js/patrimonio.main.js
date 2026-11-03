

UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var idioma = LOG.util.UIManager.apply(Ext.LOG.gestModulo.Idioma, LOG.util.Idioma);
    Ext.each(acciones_reportes, function(dat) {
        if (dat.abreviatura == 'patrimonio') {
            var winPatrimonio = new Ext.LOG.moduloMedio.ventanaP({
                idioma: idioma,
                acciones: acciones_reportes
            });
            winPatrimonio.init();
            winPatrimonio.view();
        }
    });

});