Ext.ns('LOG.fac.puntoventa.devolucion');

LOG.fac.puntoventa.devolucion.Model = Ext.extend(LOG.util.Model, {
    urlAccionDevolucion: 'cantidadDevolucion',
    constructor: function(config) {
        LOG.fac.puntoventa.devolucion.Model.superclass.constructor.call(this, config);
    },
    devolucion: function(parametros, _fn, _fnfail){
        Ext.MessageBox.wait(this.idioma.msgSalvando, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        objSubmit.data = Ext.encode(this.encode());
        Ext.Ajax.request({
            url: this.urlController + this.urlAccionDevolucion,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.msgDevolucionSalvado);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    cargaInicial: function(parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgCargaInicial, this.idioma.msgEspere);
        var objSubmit = parametros || {};
        objSubmit.exception = false;
        Ext.Ajax.request({
            url: parametros.url,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (typeof _fn == 'function') {
                        _fn.call(this, [resp.datos]);
                    }
                }
            }.createDelegate(this)
        });
    }
});