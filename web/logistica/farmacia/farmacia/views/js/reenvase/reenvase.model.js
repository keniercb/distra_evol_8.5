Ext.ns('LOG.farm.reenvase');
LOG.farm.reenvase.Model = Ext.extend(LOG.lb.documento.Model , {
    constructor: function (config) {
        this.urlAccionAprobar = 'aprobarEstadoDocumentoAction';
        this.urlAccionEliminarLotes = 'eliminarLotes';
        this.urlAccionRealizarReenvase = 'realizarReenvaseProducto';
        this.urlAccionEliminarProducto = 'eliminarProducto';
        this.urlAccionGuardarProducto = 'adicionarProducto';
        config.fields = [
            {
                name: 'idarea'
            },
            {
                name: 'idproducto'
            },
            {
                name: 'idprodreenvasado'
            }
        ];

        LOG.farm.reenvase.Model.superclass.constructor.call(this, config);
    },
    realizarReenvaseProducto: function (parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgRealizandoReenvase, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        objSubmit.data = Ext.encode(objSubmit.data || this.encode());
        objSubmit[this.primaryKeyField] = this[this.primaryKeyField];
        Ext.Ajax.request({
            url: this.urlAccionRealizarReenvase,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.msgDocumentoReenvasado);
                        _this.st.reload();
                    }
                }
                if (typeof _fn == 'function') {
                    _fn.createDelegate(this, [resp]).call();
                }
            }.createDelegate(this)
        });
    },
    eliminarLotes: function (parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgSalvando, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        objSubmit[this.primaryKeyField] = this[this.primaryKeyField];
        Ext.Ajax.request({
            url: this.urlController + this.urlAccionEliminarLotes,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (!resp.mensaje) {
                    if (resp.success) {
                        mostrarMensaje(1, this.idioma.msgLotesEliminados);
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    } else {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    eliminarProducto: function (parametros, _fn, origen) {
        var _this = this;

        mostrarMensaje(2, (origen) ? _this.idioma.msgDeleteProductoOrigen : _this.idioma.msgDeleteProductoDestino, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgEliminandoProducto, _this.idioma.msgEspere || '...');
                var objSubmit = {
                    datos: Ext.encode(parametros),
                    iddocumento: _this.iddocumento
                };
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminarProducto,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, (origen) ? _this.idioma.msgProdOrigenEliminado : _this.idioma.msgProdDestinoEliminado);
                            _this.st.reload();
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        });
    },
    adicionarProducto: function(parametros, _fn, _fnFail, _Msg) {
        var _this = this;
            if (_Msg == 1) {
                Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto,this.idioma.msgEspere || '...');
            }
            var objSubmit = parametros || {};
            objSubmit[this.primaryKeyField] = this[this.primaryKeyField];
            Ext.Ajax.request({
                url: this.urlController + this.urlAccionGuardarProducto,
                method: 'POST',
                params: objSubmit,
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        if (s) {
                            if (_Msg == 1) {
                                mostrarMensaje(1, this.idioma.lbMsgProductoSalvado);
                            }
                            if (this.st) {
                                this.st.reload();
                            }
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    } else {
                        if (typeof _fnFail == 'function') {
                            _fnFail.createDelegate(this, [resp]).call();
                        }
                    }
                    this.setDefaulFormValues();
                }.createDelegate(this)
            });
    }
});