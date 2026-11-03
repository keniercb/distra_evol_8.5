Ext.ns('LOG.lb.ubicacion');
var cmbDeposito = new LOG.lb.plugin.ComboDepositos({
    caso : 3
});
var idioma = LOG.util.UIManager.apply(LOG.lb.ubicacion.Idioma, LOG.util.Idioma.init());
var vistaUbicacion = new LOG.lb.ubicacion.View({
    busquedaBasica: true,
    idioma: idioma
});
vistaUbicacion.attachPlugin(cmbDeposito);
vistaUbicacion.init();
vistaUbicacion.getPanelBusqueda().setColumns(1);
var tree = new LOG.util.TreeCombo({
    fieldLabel: idioma.cmbEstrucUbica,
    hiddenName: 'idubicacion',
    url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
    emptyText: idioma.lbEmptyText,
    node: 0
});
vistaUbicacion.addFilterComponent(tree);

vistaUbicacion.render = vistaUbicacion.render.createSequence(function() {
    vistaUbicacion.getPanelSuperior().comboDeposito.fireEvent = vistaUbicacion.getPanelSuperior().comboDeposito.fireEvent.createSequence(function(e, iddposito) {
        if ('valuechange' == e) {
            tree.setBaseNode({_node: iddposito});
        }
    })
});
vistaUbicacion.view();
