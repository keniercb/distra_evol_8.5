Ext.ns('LOG.inv.cuadrediario');

LOG.inv.cuadrediario.Model = Ext.extend(LOG.lb.documento.Model , {
    constructor: function (config) {
        this.urlController = '/logistica/inventario/movimiento/index.php/cuadrediario/';
        if (!this.fields) {
            this.fields = [];
        }

        LOG.inv.cuadrediario.Model.superclass.constructor.call(this, config);
    },
    abrirDiaActual: function(parametros, _fn, loadStore) {
        var _this = this;
        //Pedir confirmacion desde la vista.
        Ext.MessageBox.wait(_this.idioma.msgGuardandoDatos, _this.idioma.msgEspere || '...');
        var objSubmit = parametros ||{};
        Ext.Ajax.request({
            url: _this.urlController + 'abrirDiaActual',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, _this.idioma.msgAbrirDia);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });
    },
    abrirProximoDia: function(parametros, fn) {
        var _this = this;
        //Pedir confirmacion desde la vista.
        Ext.MessageBox.wait(this.idioma.msgGuardandoDatos, this.idioma.msgEspere || '...');
            Ext.Ajax.request({
            url:_this.urlController + 'abrirProximoDia',
            method: 'POST',
            params: parametros,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    mostrarMensaje(1, this.idioma.msgAbrirProxDia);
                    if (typeof fn == 'function') {
                        fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });
    },
    cerrarDiaActual: function(parametros, _fn, loadStore) {
        var _this = this;

        Ext.MessageBox.wait(this.idioma.msgGuardandoDatos, this.idioma.msgEspere || '...');
        var objSubmit = parametros ||{};
        Ext.Ajax.request({
            url: _this.urlController + 'cerrarDiaActual',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        let msg = (parametros.estado == 1)?this.idioma.msgCerrarDia:this.idioma.msgCrearCIerre;
                        mostrarMensaje(1, msg);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });

    },
    actualizarDatos: function(parametros, _fn, loadStore) {
        var _this = this;

        Ext.MessageBox.wait(this.idioma.msgGuardandoDatos, this.idioma.msgEspere || '...');
        var objSubmit = parametros ||{};
        Ext.Ajax.request({
            url: _this.urlController + 'actualizarDatos',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.msgCerrarDia);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });

    },
    eliminarCierreDiario: function(parametros, _fn, loadStore) {
        var _this = this;
        //Pedir confirmacion desde la vista.
        Ext.MessageBox.wait(_this.idioma.msgGuardandoDatos, _this.idioma.msgEspere || '...');
        var objSubmit = parametros ||{};
        Ext.Ajax.request({
            url: _this.urlController + 'eliminarCierreDiario',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, _this.idioma.msgEliminarCierre);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });
    },
    bloquearCierre: function(parametros, fn) {
        var _this = this;
        //Pedir confirmacion desde la vista.
        Ext.MessageBox.wait(this.idioma.msgGuardandoDatos, this.idioma.msgEspere || '...');
            Ext.Ajax.request({
            url:_this.urlController + 'bloquearCierre',
            method: 'POST',
            params: parametros,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    mostrarMensaje(1, this.idioma.msgBloquearDia);
                    if (typeof fn == 'function') {
                        fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });
    }
});
