Ext.ns('LOG.inv.hojainventario');
LOG.inv.hojainventario.Model = Ext.extend(LOG.lb.documento.Model, {
    constructor: function(config) {
        this.urlAccionActualizarConteo = 'actualizarConteo';
        this.urlAccionGuardarConteoLote = 'guardarConteoLote';
        config.fields = [
            {name: 'tipoinventario'},
            {name: 'idperiodo'},
            {name: 'porciento'}
        ];
        LOG.inv.hojainventario.Model.superclass.constructor.call(this, config);
    },
    /**
     * Metodo para actualizar sin diferencias el conteo realizado a un producto
     * @param {type} parametros
     * @param {type} _fn
     * @returns {undefined}
     */
    actualizarConteo: function(tipoinventario, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, _this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, _this.idioma.msgActualizandoConteo, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgActualizandoSDiferencias, _this.idioma.msgEspere || '...');
                var objSubmit = {
                    tipoinventario: tipoinventario,
                    iddocumento: _this.iddocumento
                };
                Ext.Ajax.request({
                    url: _this.urlAccionActualizarConteo,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        if (s) {
                            mostrarMensaje(1, _this.idioma.msgConteoActualizado);
                            _this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [o, s, r]).call();
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    },
    guardarConteoLote: function(parametros, _fn) {
        var _this = this;

        Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        var objSubmit = {
            datos: Ext.encode(parametros),
            params: Ext.encode({collection: true, iddocumento: _this.iddocumento, actualizarMov: true})
        };
        Ext.Ajax.request({
            url: _this.urlAccionGuardarConteoLote,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                if (s) {
                    mostrarMensaje(1, this.idioma.msgConteoLoteSalvado);
                    _this.st.reload();
                }
                if (typeof _fn == 'function') {
                    _fn.createDelegate(this, [o, s, r]).call();
                }
            }.createDelegate(this)
        });
    },
    aprobar: function(parametros, _fn) {
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        var _this = this;

        mostrarMensaje(2, this.idioma.msgAprobarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAprobandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlAccionAprobar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (resp.codigoMsg == 0) {
                                mostrarMensaje(1, _this.idioma.msgDocumentoAprobado);
                            } else {
                                mostrarMensaje(1, _this.idioma.msgDocumentoDiferenciasAprobado);
                            }
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
    /**
     * 
     * @param {Object} parametros
     * @param {function} _fn
     * @param {function} _fnFail
     * @returns {undefined}
     */
    salvarDoc: function(parametros, _fn, _fnFail, msgMostrar) {
        if (this.basicForm.isValid()) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
            var objSubmit = parametros || {};
            objSubmit.data = Ext.encode(objSubmit.data || this.encode());

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
                            mostrarMensaje(1, msgMostrar || this.idioma.lbMsgObjetoSalvado);
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
        } else {
            mostrarMensaje(3, this.idioma.msgDatosIncorrectos);
        }
    }
});
