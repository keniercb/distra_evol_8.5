Ext.ns('Ext.aft.plugins.Transportacion');
Ext.aft.plugins.Transportacion.Loader = {
    init: function(cb) {
        var loader = new Ext.ux.ScriptManager();
        loader.loadJs({
            scripts: ['/logistica/activos_fijos/plugins/views/js/transporteplugin/VistaTransportacionPlugin.js',
                '/logistica/activos_fijos/plugins/views/js/transporteplugin/transportacionCampos.js',
                '/logistica/activos_fijos/plugins/views/idioma/' + idiomaMT + '/IdiomaPlugin.js'
            ],
            debug: true,
            callback: cb
        });
    }
};
