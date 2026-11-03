/**
 * Created by yoendy on 10/27/2015.
 */


UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var idioma = LOG.util.UIManager.apply(LOG.aft.autorizacionentrega.Idioma, LOG.util.Idioma);
   // Ext.apply(LOG.lb.documento.Estado, {0:'jsdhsf'});
    var autorizacionentrega = new LOG.aft.autorizacionentrega.View({
        acciones: acciones_reportes,
        busquedaBasica: true,
        busquedaAvanzada: false,
        idioma: idioma
    });
    //autorizacionentrega.show();
    //autorizacionentrega.maximize();
    autorizacionentrega.init();
    autorizacionentrega.view();
    //vistaDocumentoAFT.getPanelBusqueda().setColumns(1);
    // vistaDocumentoAFT.addFilterComponent(LOG.aft.documento.formBusqAvanzada(vistaDocumentoAFT));


});