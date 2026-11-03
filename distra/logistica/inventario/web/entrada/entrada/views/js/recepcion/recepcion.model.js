Ext.ns('LOG.inv.entrada.recepcion');
LOG.inv.entrada.recepcion.Model = Ext.extend(LOG.lb.documento.Model, {
    listaMonedas: null,
    listaConceptos: null,
    /**
     * @param {Object} config
     */
    constructor: function(config) {
        this.listaMonedas = new LOG.util.List({});
        this.listaConceptos = new LOG.util.List({});
        this.urlAccionContabilizar = 'contabilizarDocumento';
        this.urlAccionContar = 'contarDocumento';
        this.urlAccionEliminarMoneda = 'eliminarMoneda';
        config.fields = [
            {name: 'idoperacion'},
            {name: 'fechadocorigen'},
            {name: 'nrodocorigen'},
            {name: 'idcliente'},
            {name: 'nrocontrato'},
            {name: 'fechacontrato'},
            {name: 'idorganizacion'},
            {name: 'nombreconductor'},
            {name: 'ciconductor'},
            {name: 'embarque'},
            {name: 'manifiesto'},
            {name: 'casilla'},
            {name: 'matricula'},
            {name: 'partida'},
            {name: 'idpadre'},
            {name: 'cartaporte'},
            {name: 'idcondicionpago'},
            {name: 'numeroDoc'},
            {name: 'tipopago'},
            {name: 'recargo'},
            {name: 'descuento'},
            {name: 'recargoalternativo'},
            {name: 'descuentoalternativo'},
            {name: 'cantbulto'},
            {name: 'tipobulto'},
            {name: 'tasa'},
            {name: 'idmoneda'},
            {name: 'codigoiso'},
            {name: 'numerochip'},
            {name: 'fecha'},
	        {name: 'salidafactura'},
            {name: 'idsolicitudpadre'},
            {name: 'idcontrato'},
            {name: 'bl'},
            {name: 'idpuertodestino'},
            {name: 'puertodestino'},
            {name: 'destinocomercial'},
            {name: 'prodgenerico'},
            {name: 'contenedor'},
        ];
        LOG.inv.entrada.recepcion.Model.superclass.constructor.call(this, config);
    },
    /**
     * Funcion para adicionar un producto al grid cuando este fue editado
     * @param {Object} p
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
                    {name: 'idcategoria'},
                    {name: 'idunidadmedida'},
                    {name: 'importefinal'},
                    {name: 'preciocontable'},
                    {name: 'precioalternativo'},
                    {name: 'cantidadvieja'},
                    {name: 'cantfactura'},
                    {name: 'existenciaalmacen'},
                    {name: 'importe'},
                    {name: 'importealternativo'},
                    {name: 'minimo'},
                    {name: 'maximo'},
					{name: 'numerochip'},
                    {name: 'fecha'},
                    {name: 'numerolote'},
                    {name: 'fechavencelote'},
                    {name: 'idclasificacioncontable'}
                ]
            });
        } else {
            pModel = this.listaProductos.getItem(currentIndex);
        }
        if (registrarimporte != undefined && registrarimporte == true)  {
            p.preciocontable = p.cantidad != 0 ? p.importe / p.cantidad : 0;
            p.precioalternativo = p.cantidad != 0 ? p.importealternativo / p.cantidad : 0;
            if(p.cantidad == 0){
                mostrarMensaje(6,LOG.inv.entrada.recepcion.Idioma.msgCantVacio);
            }
        }
        pModel.apply(p);
        this.listaProductos.setItem(pModel, currentIndex);
        this.habilitarBotones();
    },
    /**
     * 
     * @param {type} parametros
     * @param {type} _fn
     * @returns {undefined}
     */
    contar: function(parametros, _fn, _fnfail) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgConfirmarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgConfirmandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionContar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgDocumentoConfirmado);
                                _this.st.reload();
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
            }
        });
    },
    /**
     * Contabiliza el documento seleccionado.
     * @param {Object} parametros
     * @param {function} _fn
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
                //objSubmit.data = Ext.encode(_this.encode());
                Ext.Ajax.request({
                    url: _this.urlAccionContabilizar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        if (s) {
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            var mensajeExito = (resp.nrodif ? _this.idioma.msgCreadoInfDiferencia + ' ' + resp.nrodif + '.' : _this.idioma.msgDocumentoContabilizado);
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
                            //_this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(_this, [o, s, r]).call();
                        }
                    }.createDelegate(_this)
                });
            }
        });
    },
    /**
     * Adiciona un documento a partir del tipo de documento seleccionado.
     * @param {Object} parametros
     * @param {function} _fnProd
     * @param {function} _fn
     * @param {function} _fnFail
     * @returns {undefined}
     */
    salvarDocumento: function(parametros, _fn, _fnFail) {
        if (this.isValid() || !this.validar) {
            var idestructura = parametros.idestructura;
            var idpadre = this.idpadre;
            this.salvar({
                idestructuracomun: idestructura,
                //tarjeta: Ext.encode(_tarjeta),
                //idproductos: Ext.encode(_productos),
                idpadre: idpadre,
                portipodoc: true,
                paramsprod: Ext.encode(parametros)
            }, _fn, _fnFail);
            /*this.cargaInicial(parametros, function(r) {
                var _tarjeta = new Array();
                var _productos = new Array();
                Ext.each(r[0], function (rec) {
                    if (rec.idproducto) {
                        _productos.push(rec);
                    } else {
                        _tarjeta.push(rec);
                    }
                });
                this.salvar({
                    idestructuracomun: idestructura,
                    //tarjeta: Ext.encode(_tarjeta),
                    //idproductos: Ext.encode(_productos),
                    idpadre: idpadre,
                    portipodoc: true,
                    paramsprod: Ext.encode(parametros)
                }, _fn);
            });*/
        } else {
            mostrarMensaje(1, this.idioma.msgDatosIncorrectos);
            _fnFail.createDelegate(this).call();
        }
    },
    /**
     * @param {Object} moneda
     * @returns {undefined}
     */
    editarMoneda: function(moneda) {
        var index = -1;
        this.listaMonedas.each(function(_m, _i) {
            if ((moneda.idmovmoneda && _m.idmovmoneda == moneda.idmovmoneda) || (!moneda.idmovmoneda && _m.idmoneda == moneda.idmoneda)) {
                index = _i;
            }
        });
        if (index == -1) {
            this.listaMonedas.add(moneda);
        } else {
            this.listaMonedas.setItem(moneda, index);
        }
        this.habilitarBotones(!this.isValid());
    },
    /**
     * Elimina las monedas seleccionadas.
     * @param {Object} parametros
     * @param {function} _fn
     * @param {function} _fnFail
     * @returns {undefined}
     */
    eliminarMonedas: function(parametros, _fn, _fnFail) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgDeleteMoneda, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoMoneda, this.idioma.msgEspere || '...');
                var objSubmit = parametros;
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminarMoneda,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, _this.idioma.msgMonedaEliminada);
                            _this.st.reload();
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    },
    /**
     * Codifica los datos que serán procesados.
     * @param {Object} o
     * @returns {Object}
     */
    encode: function(o) {
        var objDoc = LOG.inv.entrada.recepcion.Model.superclass.encode.call(this, o);
        objDoc.monedas = new Array();
        objDoc.conceptosimporte = new Array();
        this.listaMonedas.each(function(_m) {
            objDoc.monedas.push(_m);
        });
        this.listaConceptos.each(function(_m) {
            objDoc.conceptosimporte.push(_m);
        });
        return objDoc;
    },
    /**
     * Determina si es válido el formulario de datos.
     * @returns {Boolean}
     */
    isValid: function() {
        return (LOG.inv.entrada.recepcion.Model.superclass.isValid.call(this) || (this.basicForm.isValid() && this.listaMonedas.count() > 0) || (this.basicForm.isValid() && this.listaConceptos.count() > 0));
    },
    /**
     * Establece los valores actuales de los campos del formulario como valores por defecto.
     * @returns {undefined}
     */
    setDefaulFormValues: function() {
        LOG.inv.entrada.recepcion.Model.superclass.setDefaulFormValues.call(this);
        this.listaMonedas.deleteAll();
        this.listaConceptos.deleteAll();
    },
    salvarProd711: function(parametros, _fn) {
        Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        objSubmit.data = Ext.encode(objSubmit.data || this.encode());

        Ext.Ajax.request({
            url: this.urlController + this.urlAccionGuardar,
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
                this.setDefaulFormValues();
            }.createDelegate(this)
        });
    }
});
