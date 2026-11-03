Ext.namespace('Ext.ControlCuenta.Nomenclador');
Ext.ControlCuenta.Nomenclador = Ext.extend(Ext.Component, {
    url: '/contabilidad//',
    constructor: function () {
        var parametros = {
            url: this.url
        };
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        this.crearGestNomenclador(parametros);
        Ext.ControlCuenta.Nomenclador.superclass.constructor.call(this);
    },
    crearGestNomenclador: function (parametros) {
        requireJS.loadJsArray([
            {
                url: this.url + '',
                id: '',
            },
            {
                url: this.url + '',
                id: '',
            },
            {
                url: this.url + '',
                id: '',
            },
        ], function () {
            new Ext.ControlCuenta.Nomenclador.Controller(parametros);
        }.bind(this));
    }
});

new Ext.ControlCuenta.Nomenclador();