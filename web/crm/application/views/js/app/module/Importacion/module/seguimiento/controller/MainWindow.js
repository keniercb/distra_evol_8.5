Ext.define('Seguimiento.controller.MainWindow', {
    extend: 'Ext.app.Controller',

    refs: [
        {ref: 'WindowSeguimiento', selector: 's_seguimientowindow'},
        {ref: 'WindowFactura', selector: 's_facturawindow'},
        {ref: 'GridFactura', selector: 's_gridfactura'},
    ],

    init: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            store: {},
            component: {
            }
        });
    },

});
