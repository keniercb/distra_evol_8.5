Ext.ns('log.fac.desbloqueofact');

UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.lb.desbloqueo.Idioma, LOG.util.Idioma.init());
    var VistaDesbloqueo = new LOG.lb.desbloqueo.View({
        idioma: idioma,
        acciones: acciones_reportes,
        dirController: '/logistica/facturacion/facturacion/comun_fact/index.php/desbloqueofactura'
    });


    VistaDesbloqueo.init();
    VistaDesbloqueo.view();
});