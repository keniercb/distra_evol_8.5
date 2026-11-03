Ext.namespace('Ext.Caja.TarjetaOtros');
Ext.Caja.TarjetaOtros = Ext.extend(Ext.Component, {
    url: '/contabilidad/caja/tarjetaotros/views/js/tarjetaotros/',
    constructor: function () {
        var parametros = {
            url: this.url
        };
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        this.crearGestTarjetaOtros(parametros);
        Ext.Caja.TarjetaOtros.superclass.constructor.call(this);
    },
    crearGestTarjetaOtros: function (parametros) {
        requireJS.loadJsArray([
            {
                url: this.url + 'gestionar/TarjetaOtrosController',
                id: 'TarjetaOtrosController',
            },
            {
                url: this.url + 'gestionar/TarjetaOtrosModel',
                id: 'TarjetaOtrosModel',
            },
            {
                url: this.url + 'gestionar/TarjetaOtrosView',
                id: 'TarjetaOtrosView',
            },
        ], function () {
            new Ext.GestionarTarjetaOtros.Controller(parametros);
        }.bind(this));
    }
});

new Ext.Caja.TarjetaOtros();