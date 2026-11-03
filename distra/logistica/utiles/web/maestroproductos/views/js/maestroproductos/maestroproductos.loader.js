Ext.ns('LOG.inv.maestroproductos');

LOG.inv.maestroproductos.Loader = {
    init: function(cb) {
        var loader = new Ext.ux.ScriptManager();
        loader.loadJs({
            scripts: [
                '/logistica/utiles/maestroproductos/views/js/maestroproductos/maestroproductos.plugins.js',
                '/logistica/utiles/maestroproductos/views/js/maestroproductos/arbolproductos.view.js',
                '/logistica/utiles/maestroproductos/views/js/maestroproductos/maestroproductos.services.js',
                '/logistica/utiles/maestroproductos/views/idioma/es/maestroproductos.js'
            ],
            debug: true,
            callback: cb
        });
    }
};
