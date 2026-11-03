Ext.ns('LOG.tools.Clientes');
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var vistaClientes = new LOG.tools.Clientes.View({
        idioma : LOG.tools.Clientes.Idioma,
        acciones : acciones_reportes,
        busquedaBasica: true,
    });
    vistaClientes.init();
    vistaClientes.view();
})