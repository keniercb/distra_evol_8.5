/**
 * Created by yoendy on 10/27/2015.
 */
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.aft.documento.Idioma, LOG.util.Idioma);
    var gridPlugins = new LOG.util.List();
    gridPlugins.add(new Ext.Cont.Plugins.GridColumnComprobanteReporte({
        textIndex: 'numerocomprobante',
        idComprobantesCSVIndex: 'idcomprobante',
    }));
    var vistaDocumentoAFT = new LOG.aft.documento.View({
        acciones: acciones_reportes,
        idfuncionalidad: window.frameElement.id,
        busquedaBasica: true,
        busquedaAvanzada: true,
        deposito: true,
        idioma: idioma,
        gridPlugins: gridPlugins
    });

    //RPluingFirma para mostrar firma
    var rPluingFirma = vistaDocumentoAFT.grantedAction('RPluingFirma');
    //RPluingFirmaModDef para poder cambiar la conf por defecto
    var rPluingFirmaModDef = vistaDocumentoAFT.grantedAction('RPluingFirmaModDef');
    if (rPluingFirma) {
        vistaDocumentoAFT.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
            columnas : 3,
            firmas: [
                'aprobadopor',//por perfil
                'revisadopor',//conf
                'recibido',//conf
                'creadopor'//perfil
            ],
            confPorFirmas: {
                aprobadopor: {readOnlyIfLoad: !rPluingFirmaModDef},
                creadopor: {readOnly: true, loadFromRecord: 'cicreadopor'},
                revisadopor: {readOnlyIfLoad: !rPluingFirmaModDef},
                recibido: {readOnlyIfLoad: !rPluingFirmaModDef}
            },
            //posBtn: 'last',
            firmasPorDefecto: true,
            enableBtnSaveFirmaPorDef: rPluingFirmaModDef
        }));
    }

    vistaDocumentoAFT.init();
    vistaDocumentoAFT.getPanelBusqueda().setColumns(1);
    vistaDocumentoAFT.addFilterComponent(LOG.aft.documento.formBusqAvanzada(vistaDocumentoAFT));


    vistaDocumentoAFT.view();
});