Ext.ns('LOG.farm.Recuperaciones');
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var idioma = LOG.util.UIManager.apply(LOG.farm.Recuperaciones.Idioma, LOG.util.Idioma);
        var viewport = new LOG.farm.Recuperaciones.Vista({
            acciones: acciones_reportes,
            idioma: idioma,
            title: idioma.tlRecuperaciones
        });
    if (acciones_reportes.length > 0) {
        for (var i = 0; i < acciones_reportes.length; i++) {
            switch (acciones_reportes[i].abreviatura) {
                case 'CT':
                    viewport.addNodoTree(idioma.lbListadoCoberturaProd, 'listcoberturaprod', null, null, true);
                    viewport.addNodoTree(idioma.lbListadoConsultaprod, 'listconsultaprod', null, null, true);
                    viewport.addNodoTree(idioma.lbListadoConsumoprod, 'listconsumoprod', null, null, true);
                    viewport.addNodoTree(idioma.lbListadoDisponibilidadprod, 'listdisponibilidadprod', null, false, true);
                    viewport.addNodoTree(idioma.lbListadoDisponibilidadprodlote, 'listdisponibilidadprodlote', null, true, true);
                    viewport.addNodoTree(idioma.lbListadoInventarioProd, 'listinventarioprod', null, null, true);
                    viewport.addNodoTree(idioma.lbListadoMovProd, 'listmovimientoprod', null, null, true);
                    viewport.addNodoTree(idioma.lbListadoProdRetenido, 'listprodretenido', null, null, true);
                    viewport.addNodoTree(idioma.lbListadoRecepcionProd, 'listrecepcionprod', null, null, true);
                    viewport.addNodoTree(idioma.lbListadoVencimientoProd, 'listvencimientoprod', null, null, true);
                    viewport.addNodoTree(idioma.lbListadoMaxMinProd, 'listmaximominimo', null, null, true);
                    break;
                case 'AFTOPERACIONES':
                    break;
                case 'LECTURARECURSO':
                    break;
                case 'AFTMODIFICADO':
                    break;
                case 'AFTRESPONSABLE':
                    break;
            }
        }
    }


});