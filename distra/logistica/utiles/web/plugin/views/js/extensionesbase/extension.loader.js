Ext.ns('LOG.lb.extension');

LOG.lb.extension.Loader = {
    init: function(cb) {
        var loader = new Ext.ux.ScriptManager();
        loader.loadJs({
            scripts: ['/logistica/utiles/plugin/views/js/extensionesbase/extensionesbase.plugin.js',
                      '/logistica/utiles/plugin/views/js/extensionesbase/extensionproveedores.plugin.js',
                      '/logistica/utiles/plugin/views/js/extensionesbase/extensioncentrocosto.plugin.js',
                      '/logistica/utiles/plugin/views/js/extensionesbase/extensionproducto.plugin.js',
              
                '/logistica/utiles/plugin/views/idioma/' + idiomaMT + '/extensionesbase/extensionesbase.js',
                '/logistica/utiles/plugin/views/idioma/' + idiomaMT + '/extensioncentrocosto/extensioncentrocosto.js',
                '/logistica/utiles/plugin/views/idioma/' + idiomaMT + '/extensionproducto/extensionproducto.js',
                '/logistica/utiles/plugin/views/idioma/' + idiomaMT + '/extensionproveedores/extensionproveedores.js',
            ],
            debug: true,
            callback: cb
        });
    }
};
