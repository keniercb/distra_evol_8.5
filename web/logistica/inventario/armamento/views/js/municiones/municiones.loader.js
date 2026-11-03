Ext.ns('LOG.inv.municiones');

LOG.inv.municiones.Loader = {
    init: function(cb) {
        var loader = new Ext.ux.ScriptManager();
        loader.loadJs({
            scripts: [
                '/logistica/inventario/armamento/views/js/municiones/municiones.component.js',
                '/logistica/inventario/armamento/views/js/municiones/municiones.model.js',
                '/logistica/inventario/armamento/views/idioma/' + idiomaMT + '/municiones.js'
            ],
            debug: true,
            callback: cb
        });
    }
};
