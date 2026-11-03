Ext.ns('LOG.inv.revaluacion');

LOG.inv.revaluacion.Model = Ext.extend(LOG.util.Model, {
    constructor: function (config) {
        LOG.inv.revaluacion.Model.superclass.constructor.call(this, config);
    },
    revaluarProductos: function (parametros, _fn) {
        var _this = this;

        Ext.Ajax.request({
            url: 'revaluarProductos',
            method: 'POST',
            params: parametros,
            callback: function(o, s, r) {

                Ext.MessageBox.hide();
                if (typeof _fn == 'function') {
                    _fn.createDelegate(_this, [o, s, r]).call();
                }
                
            }.createDelegate(_this)
        });
    },
    revisarProductos: function (parametros, _fn) {
        var _this = this;

        Ext.Ajax.request({
            url: 'revisarEvaluacionProductos',
            method: 'POST',
            params: parametros,
            callback: function(o, s, r) {

                Ext.MessageBox.hide();
                if (typeof _fn == 'function') {
                    _fn.createDelegate(_this, [o, s, r]).call();
                }
            }.createDelegate(_this)
        });
    },
    aprobarProductos: function (parametros, _fn) {
        var _this = this;

        Ext.Ajax.request({
            url: 'aprobarEvaluacionProductos',
            method: 'POST',
            params: parametros,
            callback: function(o, s, r) {

                Ext.MessageBox.hide();
                if (typeof _fn == 'function') {
                    _fn.createDelegate(_this, [o, s, r]).call();
                }
            }.createDelegate(_this)
        });
    },
    guardarConfiguracion: function (parametros, _fn) {
        var _this = this;

        Ext.Ajax.request({
            url: 'setConfiguracionEvaluacion',
            method: 'POST',
            params: parametros,
            callback: function(o, s, r) {
                
                Ext.MessageBox.hide();
                if (typeof _fn == 'function') {
                    _fn.createDelegate(_this, [o, s, r]).call();
                }
            }.createDelegate(_this)
        });
    }
});