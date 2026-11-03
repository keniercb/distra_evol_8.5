Ext.ns('LOG.fac.Recuperaciones');
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.fac.Recuperaciones.Idioma, LOG.util.Idioma);

    var viewport = new LOG.fac.Recuperaciones.Vista({
        acciones: acciones_reportes,
        idioma: idioma,
        title: idioma.tlRecuperaciones
    });
    //viewport.addNodoTree(idioma.lbFacturasEnProceso, 'facturasenproceso', null, true, true, false);//template
    viewport.addNodoTree(idioma.lbOfertasRealizadas, 'ofertasrealizadas', null, false, false, {
        productos: true,
        deposito: true
    });//panel
    viewport.addNodoTree(idioma.lbFacturasEmitidas, 'facturasemitidas', null, false, false, {
        transportador: true,
        deposito: true,
        subsistemas: true,
        contable: true
    });//panel
    viewport.addNodoTree('Orden de Despacho', 'ordendespacho', null, false, false, {
        deposito: true,
        subsistemas: true,
        contable: true
    });//panel
    viewport.addNodoTree('Ventas por vendedor', 'ventasvendedor', null, false, false, {
        deposito: true,
        subsistemas: true,
        contable: true
    });//panel
    viewport.addNodoTree('Facturas de fideicomiso', 'fideicomiso', null, false, true, {
        deposito: false,
        subsistemas: false,
        contable: false
    });//panel
    //viewport.addNodoTree('Ventas Programas', 'ventasprogramas', null, false, false, {deposito: true, subsistemas: true, contable: true});//panel
    //panel
    viewport.addNodoTree('Plazos - Fecha de vencimiento', 'facturasplazo', null, false, false, {
        transportador: true,
        deposito: true,
        subsistemas: true,
        contable: true
    });//panel
    //viewport.addNodoTree(idioma.lbProdDeficitIngreso, 'proddeficitingreso', null, false, false, {deposito: true});//panel
    //viewport.addNodoTree(idioma.lbCobroAndPago, 'cobroandpago', null, false, false);//panel
    viewport.addNodoTree(idioma.lbPrecioVenta, 'precioventa', null, false, false, {
        transportador: true,
        deposito: true,
        subsistemas: true,
        contable: true
    });//panel
    Ext.each(acciones_reportes, function (accion) {
        switch (accion.abreviatura) {
            case 'RParteVentas' :
                viewport.addNodoTree(idioma.lbReporteVentas, 'reporteventas', null, false, false, {
                    transportador: true,
                    deposito: true,
                    subsistemas: true,
                    contable: true
                });
                break;
            case 'RParteVentasDesglose' :
                viewport.addNodoTree(idioma.lbReporteVentas + ' Desglose', 'reporteventasdesglose', null, false, false, {
                    transportador: true,
                    deposito: true,
                    subsistemas: true,
                    contable: true
                });
                break;
            case 'RNaturalezaVenta' :
                viewport.addNodoTree(idioma.lbNaturalezaVentas, 'naturalezaventas', null, false, false, {
                    transportador: true,
                    deposito: true,
                    subsistemas: true,
                    contable: true
                });//panel
                break;
            case 'RProductosVenta' :
                viewport.addNodoTree('Ventas productos y servicios', 'ventasproductos', null, false, false, {
                    transportador: true,
                    deposito: true,
                    subsistemas: true,
                    contable: true
                });//panel//panel
                break;
            case 'RVentasProgramas' :
                viewport.addNodoTree('Ventas Programas', 'ventasprogramas', null, false, false, {
                    transportador: true,
                    deposito: true,
                    subsistemas: true,
                    contable: true
                });//panel//panel
                break;
            default:
                break;
        }
    });
});