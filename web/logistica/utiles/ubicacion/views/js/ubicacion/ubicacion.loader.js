Ext.ns('LOG.inv.ubicacion');

LOG.inv.ubicacion.Loader = {
    init: function(cb) {
        var loader = new Ext.ux.ScriptManager();
        loader.loadJs({
            scripts: ['/logistica/utiles/ubicacion/views/js/ubicacion/winubicar.component.js',
               '/logistica/utiles/ubicacion/views/js/ubicacion/winubicaciones.component.js',
                '/logistica/utiles/ubicacion/views/js/ubicacion/ubicacion.model.js',
                '/logistica/utiles/ubicacion/views/js/ubicacion/winCambiarUbicaciones.component.js',
                '/logistica/utiles/ubicacion/views/js/ubicacion/winproceso.component.js',
                '/logistica/utiles/ubicacion/views/idioma/' + idiomaMT + '/ubicacion/ubicacion.js'
            ],
            debug: true,
            callback: cb
        });
    }
};
