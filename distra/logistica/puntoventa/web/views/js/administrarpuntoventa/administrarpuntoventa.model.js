Ext.ns('LOG.fac.administrar');

LOG.fac.administrar.Model = Ext.extend(LOG.util.Model, {
    constructor: function(config) {
        config.urlAccionGuardar = 'adicionarProductosgrid';
        this.urlAccionDevolucion = 'cantidadDevolucion';
        config.fields = [{
                name: 'idventaproducto',
                primary: true
            }, {
                name: 'idproducto'
            }];
        LOG.fac.administrar.Model.superclass.constructor.call(this, config);
    },
    salvar: function(parametros, _fn, _fnfail) {
        Ext.MessageBox.wait(parametros.idproducto ? this.idioma.msgCambiarPrecio : this.idioma.msgAddProducto, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        objSubmit.data = Ext.encode(this.encode());
        Ext.Ajax.request({
            url: this.urlController + this.urlAccionGuardar,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, parametros.idproducto ? this.idioma.msgCambiarPrecioSalvado : this.idioma.msgProductoSalvado);
                        if (this.st) {
                            this.st.reload();
                        }
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
    devolucion: function(parametros, _fn, _fnfail){
        Ext.MessageBox.wait(this.idioma.msgCambiarPrecio, this.idioma.msgEspere || '...');
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
        Ext.MessageBox.wait(_this.idioma.msgCargaInicial, _this.idioma.msgEspere);
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




