Ext.ns('LOG.inv.ajuste');

LOG.inv.ajuste.Model = Ext.extend(LOG.lb.documento.Model, {
    listaLotes: null,
    constructor: function(config) {
        this.listaLotes = new LOG.util.List();
        this.urlAccionContabilizar = 'contabilizarDocumento';
        this.urlAccionGuardarConteoLote = 'guardarConteoLote';
        config.fields = [
            {name: 'tipoajuste'},
            {name: 'cantidadTotal'},
            {name: 'idinventario'}
        ];
        LOG.inv.ajuste.Model.superclass.constructor.call(this, config);
    },
    /**
     * Metodo para contabilizar un documento de ajuste de inventario
     * @param {type} parametros
     * @param {type} _fn
     * @returns {undefined}
     */
    cargarAjustes: function(_params, _fn) {
        _params.url = '/logistica/inventario/movimiento/index.php/ajuste/cargaMotivoAjuste';
        this.cargaInicial(_params, _fn);
    },
    contabilizar: function(parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgContabilizarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgContabilizandoObjeto, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = Ext.encode(_this.getSelectedId());
                objSubmit.idComprobante = -1;
                Ext.Ajax.request({
                    url: _this.urlAccionContabilizar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        var mensajeExito = this.idioma.msgDocumentoContabilizado;
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
        }.createDelegate(this));
    },
    ajustarcero: function(iddeposito, _fn) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgAjustarCero, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgAjustandoCero, this.idioma.msgEspere || '...');
                Ext.Ajax.request({
                    url: 'ajustarCero',
                    method: 'POST',
                    params: {
                        iddeposito: iddeposito
                    },
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        if (s) {
                            mostrarMensaje(1, this.idioma.msgAjustarCeroGenerado);
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
    /**
     * Funcion para adicionar un producto al grid cuando este fue editado
     * @param {type} p
     * @returns {undefined}
     */
    adicionarProducto: function(p) {        
        var currentIndex = -1;
        this.listaProductos.each(function(_p, index) {
            if (_p.idmovimiento == p.idmovimiento) {
                currentIndex = index;
            }
        });
        var pModel = null;
        if (currentIndex == -1) {
            var pModel = new LOG.util.Model({
                fields: [{
                        name: 'idmovimiento',
                        primary: true
                    },
                    {name: 'idproducto'},
                    {name: 'cantidad'},
                    {name: 'preciocontable'},
                    {name: 'importe'},
                    {name: 'precioalternativo'},
                    {name: 'importealternativo'}
                ]
            });
        } else {
            pModel = this.listaProductos.getItem(currentIndex);
        }

        pModel.apply(p);
        this.listaProductos.setItem(pModel, currentIndex);
        this.habilitarBotones();
    },
    guardarConteoLote: function(parametros, cantidadTotal, _fn) {
        var _this = this;

        Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        var objSubmit = {
            data: Ext.encode(parametros),
            datos: Ext.encode({collection: true, iddocumento: _this.iddocumento}),
            cantidad: Ext.encode(cantidadTotal)
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
    /**
     * @param {Object} lote
     * @returns {undefined}
     */
    editarLote: function(lote) {
        var index = -1;
        this.listaLotes.each(function(_l, _i) {
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
     * @param {Object} o
     * @returns {Object}
     */
    encode: function(o) {
        var objDoc = LOG.inv.ajuste.Model.superclass.encode.call(this, o);
        objDoc.lotes = new Array();
        this.listaLotes.each(function(_l) {
            objDoc.lotes.push(_l);
        });
        return objDoc;
    },
    reset: function() {
        LOG.inv.ajuste.Model.superclass.reset.call(this);
        this.listaLotes.deleteAll();
    },
    isValid: function() {
        return (LOG.inv.ajuste.Model.superclass.isValid.call(this) || (this.basicForm.isValid() && this.listaLotes.count() > 0));
    },
    /**
     * Establece los valores actuales de los campos del formulario como valores por defecto.
     * @returns {undefined}
     */
    setDefaulFormValues: function() {
        LOG.inv.ajuste.Model.superclass.setDefaulFormValues.call(this);
        this.listaLotes.deleteAll();
    }
});

