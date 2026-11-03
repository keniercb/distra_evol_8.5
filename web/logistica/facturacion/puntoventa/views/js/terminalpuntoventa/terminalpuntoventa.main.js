Ext.ns('LOG.fac.puntoventa');
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var idioma = LOG.util.UIManager.apply(LOG.fac.puntoventa.Idioma, LOG.util.Idioma.init());
    var model = new LOG.fac.puntoventa.Model({
        idioma: idioma
    });
    model.cargaInicial(
        function (rd) {
            new LOG.fac.puntoventa.View({
                idioma: idioma,
                acciones: acciones_reportes,
                datos: rd.datos[0]
            });
        },
        function () {
            var sesionCaja = new LOG.fac.puntoventa.sesionCaja({
                usarAplicar: false,
                idioma: idioma
            });
            sesionCaja.show();
        }
    );
});