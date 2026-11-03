Ext.define('GestionOportunidad.controller.MainWindow', {
    extend: 'Ext.app.Controller',

    views: ['MainWindow'],

    refs: [{ref: 'MainWindow', selector: 'go_mainwindow'},
        {ref: 'clienteGrid', selector: 'clientgrid'}
    ],

    init: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);
        this.listen({
            store: {},
            component: {}
        });
    }

});

