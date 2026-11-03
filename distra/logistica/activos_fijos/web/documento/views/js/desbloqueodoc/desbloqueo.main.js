Ext.ns('log.aft.desbloqueoaft');

UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.aft.desbloqueo.Idioma, LOG.util.Idioma.init());
    var VistaDesbloqueo = new LOG.lb.desbloqueo.View({
        idioma: idioma,
        acciones: acciones_reportes
    });
    VistaDesbloqueo.dirController = '/logistica/activos_fijos/documento/index.php/desbloqueoaft';
    VistaDesbloqueo.urlBusquedaGridPrincipal = 'cargarDocumentoBloqueados';

    VistaDesbloqueo.init();
    VistaDesbloqueo.view();
});