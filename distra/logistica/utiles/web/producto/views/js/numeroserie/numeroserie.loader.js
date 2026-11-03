Ext.ns('LOG.lb.numeroserie');

LOG.lb.numeroserie.Loader = {
    init: function(cb) {
        var loader = new Ext.ux.ScriptManager();
        loader.loadJs({
            scripts: [
                '/logistica/utiles/producto/views/js/numeroserie/numeroserie.component.js',
                '/logistica/utiles/producto/views/js/numeroserie/numeroserie.model.js',
                '/logistica/utiles/producto/views/idioma/' + idiomaMT + '/numeroserie.js'
            ],
            debug: true,
            callback: cb
        });
    }
};
