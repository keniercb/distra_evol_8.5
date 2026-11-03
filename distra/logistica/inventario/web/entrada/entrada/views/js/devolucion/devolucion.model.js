Ext.ns('LOG.inv.entrada.devolucion');

LOG.inv.entrada.devolucion.Model = Ext.extend(LOG.lb.documento.Model, {
    /**
     * Lista de lotes del movimiento.
     */
    listaLotes: null,
    /**
     * @param {Object} config
     */
    constructor: function (config) {
        this.urlAccionContabilizar = 'contabilizarDocumento';
        this.urlAccionGenerar = 'generarDocumento';
        config.fields = [
            {name: 'descripcliente'},
            {name: 'idpadre'}
        ];
        this.listaLotes = new LOG.util.List();
        LOG.inv.entrada.devolucion.Model.superclass.constructor.call(this, config);
    },
    /**
     * @param {Object} parametros
     * @param {function} _fn
     * @returns {undefined}
     */
    contabilizar: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, _this.idioma.msgContabilizarDocumento, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgEspere, _this.idioma.msgContabilizandoObjeto || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                objSubmit.idComprobante = -1;
                Ext.Ajax.request({
                    url: _this.urlAccionContabilizar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        var mensajeExito = _this.idioma.msgDocumentoContabilizado;
                        if (s) {
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            if (resp.comprobante) {
                                if (resp.comprobante.codMsg) {
                                    mensajeExito = mensajeExito + "<br>No se ha podido generar el comprobante por descuadre en los importes";
                                } else {
                                    objSubmit.idComprobante = resp.comprobante.idComprobante;
                                    objSubmit.numComprobante = resp.comprobante.numComprobante;
                                    objSubmit.fechaComprobante = resp.comprobante.fechaComprobante;
                                    mensajeExito = mensajeExito + "<br>Se ha generado el comprobante numero: <b>"+resp.comprobante.numComprobante;
                                }
                            }
                            mostrarMensaje(1, mensajeExito);
                            if (objSubmit.idComprobante != -1) {
                                Ext.Ajax.request({
                                    url: '/logistica/utiles/comprobante/index.php/comprobante/postCreateComprobanteAuto',
                                    method: 'POST',
                                    params: objSubmit,
                                    callback: function (o, s, r) {
                                        Ext.MessageBox.hide();
                                        _this.st.reload();
                                    }.createDelegate(_this)
                                });
                            } else {
                                Ext.MessageBox.hide();
                                _this.st.reload();
                            }
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [o, s, r]).call();
                        }
                    }.createDelegate(this)
                });
            }
        });
    },
    /**
     * @param {Object} parametros
     * @param {function} _fn
     * @param {function} _fnFail
     * @returns {undefined}
     */
    generarDocumento: function (parametros, _fn, _fnFail) {
        Ext.MessageBox.wait(this.idioma.msgEspere, this.idioma.msgSalvandoObjeto || '...');
        var objSubmit = {};
        objSubmit.data = Ext.encode(parametros);
        Ext.Ajax.request({
            url: this.urlController + this.urlAccionGenerar,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.lbMsgObjetoSalvado);
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
            }.createDelegate(this)
        });
    },
    /**
     * Determina si es válido el formulario de datos.
     * @returns {Boolean}
     */
    isValid: function () {
        return (LOG.inv.entrada.devolucion.Model.superclass.isValid.call(this) || (this.basicForm.isValid() && this.listaLotes.count() > 0));
    },
    /**
     * Establece los valores actuales de los campos del formulario como valores por defecto.
     * @returns {undefined}
     */
    setDefaulFormValues: function () {
        LOG.inv.entrada.devolucion.Model.superclass.setDefaulFormValues.call(this);
        this.listaLotes.deleteAll();
    },
    /**
     * @param {Object} lote
     * @returns {undefined}
     */
    editarLote: function (lote) {
        var index = -1;
        this.listaLotes.each(function (_l, _i) {
            if (_l.idmovlote == lote.idmovlote) {
                index = _i;
            }
        });
        if (index == -1) {
            this.listaLotes.add(lote);
        } else {
            this.listaLotes.setItem(lote, index);
        }
        this.habilitarBotones(!this.isValid());
    },
    /**
     * Codifica los datos que serán procesados.
     * @param {Object} o
     * @returns {Object}
     */
    encode: function (o) {
        var objDoc = LOG.inv.entrada.devolucion.Model.superclass.encode.call(this, o);
        objDoc.lotes = new Array();
        this.listaLotes.each(function (_l) {
            objDoc.lotes.push(_l);
        });
        return objDoc;
    }
});
