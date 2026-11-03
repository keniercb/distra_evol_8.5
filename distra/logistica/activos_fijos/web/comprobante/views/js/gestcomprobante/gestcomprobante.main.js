/**
 * Created by Adrian on 27/04/15.
 */
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var vistaPrin = new LOG.aft.comprobante.View({

//    dDeposito: cmbDeposito.getRawValue(),
        idioma: LOG.util.UIManager.apply(LOG.aft.comprobante.Idioma, LOG.util.Idioma),
        acciones: acciones_reportes
    });
    vistaPrin.init();
    vistaPrin.view();
});


