Ext.ns('LOG.lb.lote');

LOG.lb.lote.Loader = {
    init: function(cb) {
        var loader = new Ext.ux.ScriptManager();
        loader.loadJs({
            scripts: [
                '/logistica/utiles/lote/views/js/lote/lote.component.js',
                '/logistica/utiles/lote/views/js/lote/lote.model.js',
                '/logistica/utiles/lote/views/js/lote/adicionarlote.component.js',
                '/logistica/utiles/lote/views/idioma/' + idiomaMT + '/lote/lote.js'
            ],
            debug: true,
            callback: cb
        });
    }
};
