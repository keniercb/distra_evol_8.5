Ext.ns('Ext.aft.plugins.buque');
Ext.aft.plugins.buque.Loader = {
    init: function(cb) {
        var loader = new Ext.ux.ScriptManager();
        loader.loadJs({
            scripts: ['/logistica/activos_fijos/plugins/views/js/buqueplugin/VistaBuquePlugin.js',
                '/logistica/activos_fijos/plugins/views/js/buqueplugin/buqueCampos.js',
                '/logistica/activos_fijos/plugins/views/idioma/' + idiomaMT + '/IdiomaPluginBuque.js'
            ],
            debug: true,
            callback: cb
        });
    }
};
