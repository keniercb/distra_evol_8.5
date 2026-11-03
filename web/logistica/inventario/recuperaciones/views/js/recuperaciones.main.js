Ext.ns('LOG.inv.Recuperaciones');
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var idioma = LOG.util.UIManager.apply(LOG.inv.Recuperaciones.Idioma, LOG.util.Idioma);
    Ax.onReady(function() {
        var viewport = new LOG.inv.Recuperaciones.Vista({
            acciones: acciones_reportes,
            idioma: idioma,
            title: idioma.tlRecuperaciones
        });

        viewport.addNodoTree(idioma.lbLentoMov, 'movimientolento', null, true);
        viewport.addNodoTree(idioma.lbProductoMin, 'productominimo', null, true);
        viewport.addNodoTree(idioma.lbProductoMax, 'productomaximo', null, true);
        viewport.addNodoTree(idioma.lbDocEnProceso, 'documentoenproceso', null, true);
        viewport.addNodoTree(idioma.lbLotesVencidos, 'lotesvencidos', null, true);
        viewport.addNodoTree(idioma.lbValorDepositos, 'valordepositos', null, false);
        viewport.addNodoTree(idioma.lbResumenGeneral, 'resumengeneral', null, false, false);
        viewport.addNodoTree(idioma.lbmercanciatransito, 'mercanciatransito', null, false, false);
        viewport.addNodoTree(idioma.lbResumenPeriodo, 'resumenporperiodo', null, false, false);
        viewport.addNodoTree(idioma.lbDocEmitidosRecibidos, 'docemitidosrecibidos', null, false, false);
        viewport.addNodoTree('Existencias de productos', 'existenciaproductos', null, true);
        //viewport.addNodoTree(idioma.lbProdDeficitIngreso, 'proddeficitingreso', null, false, false);
        viewport.addNodoTree(idioma.lbClientesProductos, 'clientesproductos', null, false, false);
        viewport.addNodoTree(idioma.lbBalanceCont, 'balancecontable', null, true);
        viewport.addNodoTree(idioma.lbBalanceCont + ' de apertura', 'balanceapertura', null, true);
        viewport.addNodoTree(idioma.lbPedidosPendCumpliminto, 'pedidospendcumplimiento', null, false, true);
        //viewport.addNodoTree(idioma.lbPedidosPendCumpliminto, 'pedidospendcumplimiento', null, false, true);
        viewport.addNodoTree(idioma.lbValorDepositosFecha, 'valordepositosxfecha', null, false);
        viewport.addNodoTree(idioma.lbHojasConteo, 'hojasconteo', null, false);
        viewport.addNodoTree('Mercancía distribuida', 'mercanciadistribuida', null, false,false);
        viewport.addNodoTree('Analizador', 'analizador', null, false);
        viewport.addNodoTree('Indicadores de inventario', 'indicadordeinventario', null,false,false);
        viewport.addNodoTree('Existencias publicas', 'existenciaspublicas', null, true);

    },true);
});