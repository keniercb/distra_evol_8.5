/**
 * Created by yoendy on 2/23/2016.
 */
Ext.ns('LOG.aft.Recuperaciones');
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.aft.Recuperaciones.Idioma, LOG.util.Idioma);

    var viewport = new LOG.aft.Recuperaciones.Vista({
        acciones: acciones_reportes,
        idioma: idioma,
        title: idioma.tlRecuperaciones
    });

    if (acciones_reportes.length > 0) {
        for (var i = 0; i < acciones_reportes.length; i++) {
            switch (acciones_reportes[i].abreviatura) {
                case 'DEPREACTIVO':
                    viewport.addNodoTree(idioma.lbListadoActivos, 'listadoactivos', null, null, true);
                 break;
                case 'AFTOPERACIONES':
                    viewport.addNodoTree(idioma.lbListadoDocumentos, 'listadodocumentos', null, null, false);
                 break;
                case 'LECTURARECURSO':
                    viewport.addNodoTree(idioma.lbListadoLecturas, 'listadolecturas', null, null, true);
                 break;
                case 'AFTMODIFICADO':
                    viewport.addNodoTree(idioma.lbListadoModificados, 'listadomodificados', null, null, false);
                 break;
                 case 'AFTRESPONSABLE':
                     viewport.addNodoTree(idioma.lbListadoResponsables, 'listadoresponsables', null, null, false);
                 break;
                 case 'AFTBALANCE':
                     viewport.addNodoTree(idioma.lbListadoBalance, 'listadobalance', null, null, true);
                 break;
            }
        }
    }
	var isNew = true;
	viewport.addNodoTree(idioma.lbAreasValores, 'valoresareas', null, null, true);
	viewport.addNodoTree('Analizador', 'analizador', null, null, true);




    //viewport.addNodoTree(idioma.lbListadoReparaciones, 'listadoreparaciones', null, null, true);


    //viewport.addNodoTree(idioma.lbDocEnProceso, 'documentoenproceso', null, true);
    //viewport.addNodoTree(idioma.lbLotesVencidos, 'lotesvencidos', null, true);
    //viewport.addNodoTree(idioma.lbValorDepositos, 'valordepositos', null, false);
    //viewport.addNodoTree(idioma.lbResumenGeneral, 'resumengeneral', null, false, false);
    //viewport.addNodoTree(idioma.lbResumenPeriodo, 'resumenporperiodo', null, false, false);
    //viewport.addNodoTree(idioma.lbDocEmitidosRecibidos, 'docemitidosrecibidos', null, false, false);
    //viewport.addNodoTree(idioma.lbProdDeficitIngreso, 'proddeficitingreso', null, false, false);
    //viewport.addNodoTree(idioma.lbClientesProductos, 'clientesproductos', null, false, false);
});