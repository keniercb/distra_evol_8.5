Ext.ns('LOG.fac.Recuperaciones');
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.puntoventa.recuperacion.Idioma, LOG.util.Idioma.init());
    var viewport = new LOG.fac.recupuntoventa.Viewer({
        acciones: acciones_reportes,
        idioma: idioma,
        title: idioma.tlRecuperaciones
    });
//viewport.addNodoTree(idioma.tArqueoCierre, 'arqueocierre', null, false, false);//panel
//viewport.addNodoTree(idioma.tDevoluciones, 'devoluciones', null, false, false);//panel
	 
	if (acciones_reportes.length > 0) {
        for (var i = 0; i < acciones_reportes.length; i++) {
            switch (acciones_reportes[i].abreviatura) {
                case 'VENTCLIENT':
                    viewport.addNodoTree(idioma.tVentasRealizas, 'ventasrealizadas', null, false, false);
                break;
				case 'VENTARJETA':
					viewport.addNodoTree(idioma.tVentasTarjeta, 'ventastarjeta', null, false, false);
                break;
				case 'VENTPROD':
					viewport.addNodoTree(idioma.tResumenVentaProducto, 'productostpv', null, false, false);
                break;
                case 'RAUDITORA':
                    viewport.addNodoTree(idioma.tCintaAuditora, 'cintaauditora', null, false, false);
                    break;
/*				case 'VENTPROD':
					viewport.addNodoTree(idioma.tResumenVentaProducto, 'productostpv', null, false, false);
                break;*/
            }
        }
        if(viewport.treeMenu.root.childNodes.length == 1){
                viewport.treeMenu.fireEvent('click', viewport.treeMenu.root.childNodes[0]);
                viewport.selectTab(viewport.treeMenu.root.childNodes[0]);
                viewport.treeMenu.collapse();
        }
    } else {
        mostrarMensaje(1, 'Debe configurar los recursos para esta acción.');
    }
});