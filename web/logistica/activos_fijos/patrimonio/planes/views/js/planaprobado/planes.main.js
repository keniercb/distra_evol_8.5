/**
 * Created by yoendy on 10/27/2015.
 */
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.aft.patrimonio.Idioma, LOG.util.Idioma);    
   var vistaPlanesPatrimonio = new LOG.aft.planes.View({
        acciones: acciones_reportes,
        //dirController: '/logistica/activos_fijos/patrimonio/documento/index.php/gestdocumento',
        idfuncionalidad: window.frameElement.id,
       // busquedaBasica: true,
       // busquedaAvanzada: true,
       // deposito: true,
        idioma: idioma//idioma
    });
   // vistaPlanesPatrimonio.dirController = '/logistica/activos_fijos/patrimonio/documento/index.php/gestdocumentopatrimonio';
   // vistaPlanesPatrimonio.urlBusquedaGridPrincipal = 'cargardocumentos';
    vistaPlanesPatrimonio.init();
   // vistaPlanesPatrimonio.getPanelBusqueda().setColumns(1);
   // vistaPlanesPatrimonio.addFilterComponent(LOG.aft.documento.formBusqAvanzada(vistaDocumentoPat));
    vistaPlanesPatrimonio.view();
});