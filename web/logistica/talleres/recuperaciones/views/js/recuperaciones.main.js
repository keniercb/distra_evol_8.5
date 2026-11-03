Ext.ns('Log.tall.recuperaciones');
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var idioma = LOG.util.UIManager.apply(Log.tall.recuperaciones.Idioma, LOG.util.Idioma);
        var viewport = new Log.tall.recuperaciones.Vista({
            acciones: acciones_reportes,
            idioma: idioma,
            title: idioma.tlRecuperaciones
        });

        viewport.addNodoTree(idioma.lbTrabajosRealizados, 'trabajosrealizados', null, false, false);
        viewport.addNodoTree(idioma.lbMediosPendientes, 'mediospendientes', null, false, true);
        viewport.addNodoTree(idioma.lbPiezasMas, 'piezasmasusadas', null, false, true);
        viewport.addNodoTree(idioma.lbOrdenesInsatis, 'ordenesinsatisfacciones', null, false, true);
        viewport.addNodoTree(idioma.lbServiciosRealizados, 'serviciosrealizados', null, true);
        viewport.addNodoTree(idioma.lbParalizacionTalleres, 'paralizaciontalleres', null, false, false);
        viewport.addNodoTree(idioma.lbordenfactura, 'ordenfactura', null, false, false);
		viewport.addNodoTree(idioma.lbcuadredeproceso, 'cuadredeproceso', null, false, false);
        viewport.addNodoTree(idioma.lbestadia, 'estadia', null, false, false);
        viewport.addNodoTree(idioma.lbPenalizacionTerceros, 'penalizacionterceros', null, false, false);
        viewport.addNodoTree(idioma.lbPiezasRecuperadas, 'piezasrecuperadas', null, false, false);
        viewport.addNodoTree(idioma.lbGarantia, 'garantia', null, true);
        viewport.addNodoTree(idioma.lbPedidos, 'pedidosrealizados', null, false, false);
        viewport.addNodoTree(idioma.lbGastos, 'gastosmantenimiento', null, false, false);
        viewport.addNodoTree(idioma.lbCitasOrdenes, 'citasordenes', null, true);
        viewport.addNodoTree(idioma.lbBalancecuadreproceso, 'balancecuadreproceso', null, false, false);
});