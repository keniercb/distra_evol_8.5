/**
 *  Jorge Luis Cuellar Mondeja
 *  24/07/2013
 */
Ext.ns('Ext.erp.LOG.ConfiguracionMatricula');

Ext.erp.LOG.ConfiguracionMatricula.Vista = {
    init: function (idioma) {

        var viewport = new Ext.erp.viewPortNomencladores({
            title: idioma.lbNomenlcadores
        });
        var aftDefaultController = '/logistica/regmatricula/configuracionmatricula/index.php/configuracionmatricula/';
        if (acciones_reportes.length > 0) {
            for (var i = 0; i < acciones_reportes.length; i++) {
                switch (acciones_reportes[i].abreviatura) {
                    case 'NOMTIPOTRAMITE':
                        viewport.addNodoTree(idioma.lbTipoTramite, 'tipotramite', aftDefaultController, 'NomTipoTramite', idioma.lbtabTipoTramite);
                        break;

                    case 'NOMTIPOCHAPA':
                        viewport.addNodoTree(idioma.lbTipoChapa, 'tipochapa', aftDefaultController, 'NomTipoChapa', idioma.lbtabTipoChapa);
                        break;

                    case 'NOMSECTOR':
                        viewport.addNodoTree(idioma.lbSector, 'sector', aftDefaultController, 'NomSectorRegMatric', idioma.lbtabSector);
                        break;
                }
            }
        } else {
            mostrarMensaje(1, 'Debe configurar los recursos para esta acción.');
        }
    }

}

UCID.portal.cargarEtiquetas('configuracionmatricula', function (perfil, idioma) {

    Ext.QuickTips.init();

    UCID.portal.cargarAcciones(window.frameElement.id, function (res) {
        urlReportes = UCID.portal.getAccionesReportes();
        var vista = Ext.erp.LOG.ConfiguracionMatricula.Vista;
        vista.init(idioma, {});
    });

});