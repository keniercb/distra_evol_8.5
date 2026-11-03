Ext.namespace('Ext.TarjetasOperacion');
Ext.TarjetasOperacion = Ext.extend(Ext.Component, {
    url: '/contabilidad/caja/tarjeta_fincimex/views/js/tarjeta_fincimex/',
    constructor: function () {
        var parametros = {
            url: this.url
        };
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        this.crearGestTarjeta(parametros);
        Ext.TarjetasOperacion.superclass.constructor.call(this);
    },
    crearGestTarjeta: function (parametros) {
        requireJS.loadJs(this.url + 'gestionar/TarjetaOperController', 'TarjetaOperController', function () {
            new Ext.GestionarTarjetaOper.Controller(parametros);
        });
    }
});

new Ext.TarjetasOperacion();
