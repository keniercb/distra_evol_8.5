Ext.ns('LOG.tools.Productos');
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var vistaClientes = new LOG.tools.Productos.View({
        idioma : LOG.tools.Productos.Idioma,
        acciones : acciones_reportes,
        busquedaBasica: true,
    });
    vistaClientes.init();
    vistaClientes.view();
})