Ext.ns('LOG.lb.ubicacion');

LOG.lb.ubicacion.Model = Ext.extend(LOG.util.Model, {
    constructor: function(config) {
        config.fields = [{
                name: 'idubicacionproducto',
                primary: true
            },
            {name: 'idubicacion'},
            {name: 'idarea'},
            {name: 'cantidad'},
            {name: 'esarea'},
            {name: 'estado'}
        ];
        config.urlAccionGuardar = 'ubicarProducto';
        this.urlAccionUbicaciones = 'cargarProductosUbicar';
        config.urlAccionEliminar = 'eliminarUbicacion';
        this.urlAccionDesubicar = 'desubicarProducto';
        this.urlAccionRedistUbicLotes = 'redistribuirUbicacion';

        LOG.lb.ubicacion.Model.superclass.constructor.call(this, config);
    },
    cargarUbicaciones: function(_params, _fn) {
        _params.url = this.urlAccionUbicaciones;
        _params.ponerMsg = true;
        this.cargaInicial(_params, _fn);
    },
    desubicarProductos: function(parametros, _fn) {
        var _this = this;
        if (this.basicForm) {
            if (this.isValid()) {
                Ext.MessageBox.wait(_this.idioma.msgDesubicandoObjeto, _this.idioma.msgEspere);
                var objSubmit = {data: Ext.encode(parametros)} || {};
                objSubmit.exception = false;
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionDesubicar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, _this.idioma.msgDesubicarObj);
                            _fn.call(this, [resp.datos]);
                        }
                    }.createDelegate(this)
                });
            } else {
                mostrarMensaje(3, _this.idioma.msgDatosIncorrectos);
            }
        } else {
            Ext.MessageBox.wait(_this.idioma.msgDesubicandoObjeto, _this.idioma.msgEspere);
            var objSubmit = {data: Ext.encode(parametros)} || {};
            objSubmit.exception = false;
            Ext.Ajax.request({
                url: _this.urlController + _this.urlAccionDesubicar,
                method: 'POST',
                params: objSubmit,
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success) {
                        mostrarMensaje(1, _this.idioma.msgDesubicarObj);
                        _fn.call(this, [resp.datos]);
                    }
                }.createDelegate(this)
            });
        }
    },
    cargaInicial: function(parametros, _fn) {
        var _this = this;
        if (parametros.ponerMsg) {
            Ext.MessageBox.wait(_this.idioma.msgCargaInicial, _this.idioma.msgEspere);
        }
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
    },
    cargarEstado: function(parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.msgCargaInicial, _this.idioma.msgEspere);
        var objSubmit = parametros || {};
        objSubmit.exception = false;
        Ext.Ajax.request({
            url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarEstado',
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
    },
    redistribuirLotes: function(parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgSalvando, this.idioma.msgEspere || '...');
        var objSubmit = {
            data: Ext.encode(parametros)
        } || {};
        Ext.Ajax.request({
            url: _this.urlController + _this.urlAccionRedistUbicLotes,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                if (s) {
                    mostrarMensaje(1, this.idioma.msgSalvandoCat);

                }
                if (typeof _fn == 'function') {
                    _fn.createDelegate(this, [o, s, r]).call();
                }
            }.createDelegate(this)
        });
    }
});