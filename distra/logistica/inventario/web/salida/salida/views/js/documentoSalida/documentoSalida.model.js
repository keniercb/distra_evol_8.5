Ext.ns('LOG.inv.documentoSalida');

LOG.inv.documentoSalida.Model = Ext.extend(LOG.lb.documento.Model, {
    /**
     * Lista de lotes del movimiento.
     */
    listaLotes: null,
    /**
     * @param {Object} config
     */
    constructor: function(config) {
        this.urlAccionContabilizar = 'contabilizarDocumento';
        config.fields = [
            {name: 'observacion'},
            {name: 'idestructura'},
            {name: 'cicliente'},
            {name: 'version'},
            {name: 'nombrefirma'},
            {name: 'cargocliente'},
            {name: 'nombrecliente'},
            {name: 'casilla'},
            {name: 'cantbulto'},
            {name: 'origen'},
            {name: 'iddestino'},
            {name: 'ciconductor'},
            {name: 'nombreconductor'},
            {name: 'matricula'},
            {name: 'cartaporte'},
            {name: 'idorganizacion'},
            {name: 'idoperacion'},
            {name: 'tipocliente'},
            {name: 'idcuenta'},
            {name: 'iduebdestino'},
            {name: 'idcuentaalternativa'},
            {name: 'numerochip'},
            {name: 'fecha'}
			
        ];
        this.listaLotes = new LOG.util.List();
        LOG.inv.documentoSalida.Model.superclass.constructor.call(this, config);
    },
    /**
     * @param {UITemplate} plantilla
     * @param {Array} parametros
     * @param {function} _fn
     * @param {function} _fnfail
     * @returns {undefined}
     */
    proccesGridPanel: function(plantilla, parametros, _fn, _fnfail) {
        if (!plantilla.getSmPrincipal().hasSelection() && !plantilla.getStorePrincipal().getModifiedRecords().length > 0) {
            mostrarMensaje(1, this.idioma.msgSelectObjetoGenerar);
            return;
        }
        Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        this.getSelectedIdTab(plantilla, objSubmit);
//        objSubmit.id = Ext.encode(this.getSelectedIdTab(plantilla));

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
                        if (resp.depositos) {
                            mostrarMensaje(1, this.idioma.lbMsgObjetoSalvadoOrd + ' ' + resp.depositos + '.');
                        } else {
                            mostrarMensaje(1, this.idioma.lbMsgObjetoSalvado);
                        }
                        if (this.st) {
                            this.st.reload();
                        }
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    mostrarMensaje(1, (objSubmit.origen == 2 || objSubmit.origen == 4 ? this.idioma.msgObjetoNoSalvadoDisp : this.idioma.lbMsgObjetoNoSalvado));
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    /**
     * @param {LOG.util.UITemplate} plantilla
     * @param {Object} obj
     * @returns {Object} 
     */
    getSelectedIdTab: function(plantilla, obj) {
        var _this = this;
        var _selectedId = [];
        var collection = plantilla.gridEditable ? plantilla.getStorePrincipal().getModifiedRecords() : plantilla.getSmPrincipal().getSelections();
        if (collection.length > 0) {
            Ext.each(collection, function(r) {
                _selectedId.push(r.get(_this.primaryKeyField));
            });
        }
        Ext.apply(obj, {id: Ext.encode(_selectedId)});
        return obj;
    },
    /**
     * @param {Object} parametros
     * @param {type} _fn
     * @returns {undefined}
     */
    contabilizar: function(parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgContabilizarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgEspere, _this.idioma.msgContabilizandoObjeto || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                objSubmit.idComprobante = -1;
                Ext.Ajax.request({
                    url: _this.urlAccionContabilizar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
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
                    {name: 'idunidadmedida'},
                    {name: 'importefinal'},
                    {name: 'preciocontable'},
                    {name: 'importe'},
                    {name: 'precioalternativo'},
                    {name: 'idelementogasto'},
                    {name: 'idelementogastoalt'},
					{name: 'numerochip'},
                    {name: 'fecha'}
                ]
            });
        } else {
            pModel = this.listaProductos.getItem(currentIndex);
        }

        pModel.apply(p);
        this.listaProductos.setItem(pModel, currentIndex);
        this.habilitarBotones();
    },
    /**
     * Determina si es válido el formulario.
     * @returns {Boolean}
     */
    isValid: function() {
		return true;
        return (LOG.inv.documentoSalida.Model.superclass.isValid.call(this) || (this.basicForm.isValid() && this.listaLotes.count() > 0));
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
     * Codifica los datos que serán procesados.
     * @param {Object} o
     * @returns {Object}
     */
    encode: function(o) {
        var objDoc = LOG.inv.documentoSalida.Model.superclass.encode.call(this, o);
        objDoc.lotes = new Array();
        this.listaLotes.each(function(_l) {
            objDoc.lotes.push(_l);
        });
        return objDoc;
    },
    /**
     * Reestablece los valores.
     * @returns {undefined}
     */
    reset: function() {
        LOG.inv.documentoSalida.Model.superclass.reset.call(this);
        this.listaLotes.deleteAll();
    },
    /**
     * Establece los valores actuales de los campos del formulario como valores por defecto.
     * @returns {undefined}
     */
    setDefaulFormValues: function() {
        LOG.inv.documentoSalida.Model.superclass.setDefaulFormValues.call(this);
        this.listaLotes.deleteAll();
    }
});