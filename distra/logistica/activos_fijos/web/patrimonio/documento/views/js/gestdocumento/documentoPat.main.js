/**
 * Created by yoendy on 10/27/2015.
 */
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.aft.documentoPat.Idioma, LOG.util.Idioma);    
    var vistaDocumentoPat = new LOG.aft.documentoPat.View({
        acciones: acciones_reportes,
        //dirController: '/logistica/activos_fijos/patrimonio/documento/index.php/gestdocumento',
        idfuncionalidad: window.frameElement.id,
        busquedaBasica: true,
        busquedaAvanzada: true,
        deposito: true,
        idioma: idioma//idioma
    });
    vistaDocumentoPat.dirController = '/logistica/activos_fijos/patrimonio/documento/index.php/gestdocumentopatrimonio';
    vistaDocumentoPat.urlBusquedaGridPrincipal = 'cargardocumentos';
    vistaDocumentoPat.init();
    vistaDocumentoPat.getPanelBusqueda().setColumns(1);
    vistaDocumentoPat.addFilterComponent(LOG.aft.documento.formBusqAvanzada(vistaDocumentoPat));
    vistaDocumentoPat.view();
});