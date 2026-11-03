Ext.ns('LOG.lb.variablesglobales');
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var vistaMaestro = new LOG.lb.variablesglobales.View({
        acciones: acciones_reportes
    });
    vistaMaestro.init();
    vistaMaestro.view();
})