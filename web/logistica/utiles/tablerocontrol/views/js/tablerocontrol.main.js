Ext.ns('LOG.lb.TableroControl');
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var idioma = LOG.util.UIManager.apply(LOG.lb.TableroControl.Idioma, LOG.util.Idioma);
    Ax.onReady(function() {
        if (acciones_reportes.length > 0) {
            var viewport = new LOG.lb.TableroControl.Vista({
                acciones: acciones_reportes,
                idioma: idioma,
                title: idioma.tlRecuperaciones
            });
            /*for (var i = 0; i < acciones_reportes.length; i++) {
                switch (acciones_reportes[i].abreviatura) {
                    case 'TCPED':
                        viewport.addNodoTree('Pedido', 'tcpedido', null, true);
                        break;
                    case 'TCDIST':
                        viewport.addNodoTree('Distribución', 'tcdistribucion', null, true);
                        break;
                    case 'TCINV':
                        viewport.addNodoTree('Inventario', 'tcinventario', null, true);
                        break;
                    case 'TCTALL':
                        viewport.addNodoTree('Talleres', 'tctalleres', null, true);
                        break;
                    case 'TCAFT':
                        viewport.addNodoTree('Activo fijo', 'tcaft', null, true);
                        break;
                    case 'TCFAC':
                        viewport.addNodoTree('Facturación', 'tcfacturacion', null, true);
                        break;
                    case 'TCPTV':
                        viewport.addNodoTree('Punto de venta', 'tcpuntoventa', null, true);
                        break;
                    
                    
                }
            }*/
        } else {
            mostrarMensaje(1, 'Debe configurar los recursos para esta acción.');
        }
       
    },true);//
});