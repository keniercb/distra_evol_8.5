Ext.namespace('Ext.TarjetasObligacion');
Ext.TarjetasObligacion = Ext.extend(Ext.Component, {
    url: '/contabilidad/caja/tarjeta_obligacion/views/js/tarjeta_obligacion/',
    constructor: function () {
        var parametros = {
            url: this.url
        };
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        this.crearGestTarjeta(parametros);
        Ext.TarjetasObligacion.superclass.constructor.call(this);
    },
    crearGestTarjeta: function (parametros) {
        requireJS.loadJsArray([
            {
                url: this.url + 'gestionar/TarjetaObligacionController',
                id: 'TarjetaObligacionController',
            },
            {
                url: this.url + 'gestionar/TarjetaObligacionModel',
                id: 'TarjetaObligacionModel',
            },
            {
                url: this.url + 'gestionar/TarjetaObligacionView',
                id: 'TarjetaObligacionView',
            },
        ], function () {
            new Ext.GestionarTarjetaObligacion.Controller(parametros);
        }.bind(this));
    }
});

new Ext.TarjetasObligacion();
