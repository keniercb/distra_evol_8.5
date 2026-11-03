UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var vistaComprobante = new LOG.lb.comprobante.View({
        idioma: LOG.util.UIManager.apply(LOG.lb.comprobante.Idioma, LOG.util.Idioma),
        idayuda: 'idcomprobantefact',
        acciones: acciones_reportes,
        subsistema: LOG.util.Subsistemas.facturacion
    });
    vistaComprobante.init();

    var entregarA = new LOG.util.ComboBox({
        fieldLabel: 'Cliente',
        //editable: false,
        url: 'cargarClientes',
        hiddenName: 'idcliente',
        valueField: 'idclientesproveedores',
        displayField: 'nombre',
        triggerAction: 'all',
        enableQtip: true,
        pageSize: 20,
        minChars: 0,
        mode: 'remote'
    });
    var frmCliente = new LOG.util.ColumnForm(2);
    frmCliente.addComponent(entregarA);
    frmCliente.getColumn(0).columnWidth = 1;
    frmCliente.getColumn(0).getComponent(0).anchor = '99%';
    vistaComprobante.addFilterComponent(frmCliente);

    vistaComprobante.view();
});