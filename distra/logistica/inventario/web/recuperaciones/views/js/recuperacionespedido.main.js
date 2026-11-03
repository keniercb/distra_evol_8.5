Ext.ns('LOG.inv.Recuperaciones');
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var idioma = LOG.util.UIManager.apply(LOG.inv.Recuperaciones.Idioma, LOG.util.Idioma);
    Ax.onReady(function() {
        var viewport = new LOG.inv.Recuperaciones.Vista({
            acciones: acciones_reportes,
            idioma: idioma,
            title: idioma.tlRecuperaciones
        });

        viewport.addNodoTree(idioma.lbPedido, 'reportepedido', null, true);
    },true);//
});