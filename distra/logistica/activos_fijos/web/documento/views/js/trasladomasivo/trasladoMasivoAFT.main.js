
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.aft.documento.Idioma, LOG.util.Idioma);
    var gridPlugins = new LOG.util.List();
    /*gridPlugins.add(new Ext.Cont.Plugins.GridColumnComprobanteReporte({
        textIndex: 'numerocomprobante',
        idComprobantesCSVIndex: 'idcomprobante',
    }));*/
    var vistaTrasladoMasivoAFT = new LOG.aft.trasladomasivo.View({
        acciones: acciones_reportes,
        idfuncionalidad: window.frameElement.id,
        busquedaBasica: true,
        busquedaAvanzada: true,
        deposito: true,
        idioma: idioma,
        gridPlugins: gridPlugins
    });

    //RPluingFirma para mostrar firma
    var rPluingFirma = vistaTrasladoMasivoAFT.grantedAction('RPluingFirma');
    //RPluingFirmaModDef para poder cambiar la conf por defecto
    var rPluingFirmaModDef = vistaTrasladoMasivoAFT.grantedAction('RPluingFirmaModDef');
    if (rPluingFirma) {
        vistaTrasladoMasivoAFT.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
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

    vistaTrasladoMasivoAFT.init();
    vistaTrasladoMasivoAFT.getPanelBusqueda().setColumns(1);
    vistaTrasladoMasivoAFT.addFilterComponent(LOG.aft.documento.formBusqAvanzada(vistaTrasladoMasivoAFT));


    vistaTrasladoMasivoAFT.view();
});