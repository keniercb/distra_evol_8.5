UCID.portal.cargarAcciones(window.frameElement.id, function () {
    const model = new Ext.EstandarCodigoBarras.model();
    const view = new Ext.EstandarCodigoBarras.view(model);
    const controller = new Ext.EstandarCodigoBarras.controller(model, view);
    new Ext.Viewport({
        // renderTo: document.body,
        layout: 'border',
        items: [view]
    });

});