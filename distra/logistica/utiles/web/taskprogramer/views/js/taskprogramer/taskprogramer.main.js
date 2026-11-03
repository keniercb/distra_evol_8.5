UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var taskprogramer = new LOG.lb.taskprogramer.View({
        busquedaAvanzada: true,
        acciones: acciones_reportes
    });
    taskprogramer.init();
    taskprogramer.view();
});