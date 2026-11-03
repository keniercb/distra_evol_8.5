Ext.ns('LOG.lb.documento');

LOG.lb.documento.Model = Ext.extend(LOG.util.Model, {
    /*
     * Nombre del tipo de documento
     *
     *@type string
     */
    name: "DocumentoModel",
    /**
     * Lista de los productos del documento
     * @type type
     */
    listaProductos: undefined,
    /**
     *
     */
    urlAccionConfirmar: null,
    /**
     *
     */
    urlAccionAnularEstado: null,
    /**
     *
     */
    urlAccionAprobar: null,
    /**
     *
     */
    urlAccionAnular: null,
    /**
     *
     */
    urlAccionDuplicar: null,
    /**
     *
     *
     */
    urlAccionEliminarMovimiento: null,
    /**
     *
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.listaProductos = new LOG.util.List();
        this.name = config.name;
        config.urlAccionGuardar = 'adicionarDocumento';
        config.urlAccionEliminar = 'eliminarDocumento';
        this.urlAccionConfirmar = 'confirmarDocumento';
        this.urlAccionAnularEstado = 'anularEstadoDocumento';
        this.urlAccionAprobar = 'aprobarEstadoDocumento';
        this.urlAccionAnular = 'anularDocumento';
        this.urlAccionDuplicar = 'copiarDocumento';
        this.urlAccionFirmar = 'firmarDocumento';
        this.urlAccionSalvarMovimientos = 'adicionarMovimientos';
        this.urlAccionEliminarMovimiento = 'eliminarMovimientos';
        this.urlAccionBloquear = 'bloquearDocumento';
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'iddocumento',
            primary: true
        });
        config.fields.push({
            name: 'observaciones'
        });
        LOG.lb.documento.Model.superclass.constructor.call(this, config);
    },
    /**
     *
     * @param {type} parametros
     * @param {type} _fn
     * @returns {undefined}
     */
    confirmar: function (parametros, _fn, _fnfail) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgConfirmarDocumento, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgConfirmandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionConfirmar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
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
     *
     * @param {type} parametros
     * @param {type} _fn
     * @returns {undefined}
     */
    anularestado: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }

        mostrarMensaje(2, this.idioma.msgAnularEstadoDocumento, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAnulandoEstadoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAnularEstado,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgEstadoDocumentoAnulado);
                                _this.st.reload();
                            }
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
     * @param {type} parametros
     * @param {type} _fn
     * @returns {undefined}
     */
    aprobar: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgAprobarDocumento, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAprobandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAprobar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgDocumentoAprobado);
                                _this.st.reload();
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }else if(resp.error){
                            mostrarMensaje(3, resp.error);
                            _this.st.reload();
                        }
                    }.createDelegate(this)

                });
            }
        });
    },
    /**
     *
     * @param {type} parametros
     * @param {type} _fn
     * @returns {undefined}
     */
    anular: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgAnularDocumento, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAnulandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAnular,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgDocumentoAnulado);
                                _this.st.reload();
                            }
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
     * @param {type} parametros
     * @param {type} _fn
     * @returns {undefined}
     */
    duplicar: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgDuplicarDocumento, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgDuplicandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};

                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionDuplicar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgDuplicarAnulado);
                                _this.st.reload();
                            }
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
     * @param parametros
     * @param _fn
     */
    bloquear: function (accion, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgLookObjeto, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgLookinObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = {
                    accion: accion
                };

                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionBloquear,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgLookedObjeto);
                                _this.st.reload();
                            }
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
     * @param {Object} params
     * @returns {undefined}
     */
    firmar: function (params,callback) {
        var _this = this;
        var r = this.sm.getSelected();
        var doc = {
            id: r.get(_this.primaryKeyField),
            controlfirma: r.get('controlfirma'),
            step: (r.get('controlfirma') != 0 || !Ext.isEmpty(r.get('idnodo')) ? '4' : '1'),
            reportSet: {
                "typeRequest": "auto",
                "typeFormat": "PDF",
                "content": "application/pdf",
                "paginated": true,
                "isAttachment": false,
                "useSign": true,
                "pages": null,
                "attachmentsPrefix": null,
                "interactive": false,
                "freshData": false,
                "saveDataSnapshot": false,
                "transformerKey": false,
                "name": _this.name + "-" + r.get('iddocumento'),
                "dirReport": '/reports' + params.reportSet.dirReport,
                "params": params.reportSet
            },
            idnodo: r.get('idnodo') || null,
            iddir: (window.idespaciotrabajo) ? idespaciotrabajo : null,
            fileSet: {
                idnodo: r.get('idnodo') || null,
                iddir: (window.idespaciotrabajo) ? idespaciotrabajo : null
            },
            signSet: params.signSet
        };

        var objSubmit = {};
        objSubmit.data = Ext.encode(doc);
        Ext.Ajax.request({
            url: '/logistica/utiles/documento/index.php/documentologistica/' + _this.urlAccionFirmar,
            method: 'POST',
            params: objSubmit,
            waitMsg: params.action,
            callback: function (o, s, r) {
                var response = LOG.util.UIManager.decodeAjaxResponse(r);
                if (s) {
                    mostrarMensaje(1, this.idioma.msgObjetoFirmado);//_this.idioma.msgEtapaFirmado[responseText.data.step]
                    if (resp.data.step == 3 || resp.data.step == 5) {
                        if (resp.data.step == 5) {
                            callback.call(this,response)
                        }
                        this.st.reload();
                    }
                } else {
                    var msg = this.idioma.msgObjetoEliminado;
                    mostrarMensaje(1, msg);
                }
            }.createDelegate(this)

        });
    },
    /**
     *
     * @param {type} parametros
     * @param {type} _fn
     * @returns {undefined}
     */
    adicionarMovimientos: function (parametros, _fn) {
        Ext.MessageBox.wait(this.idioma.msgSalvando, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        objSubmit[this.primaryKeyField] = this[this.primaryKeyField];
        Ext.Ajax.request({
            url: this.urlController + this.urlAccionSalvarMovimientos,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (!resp.mensaje) {
                    if (resp.success) {
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
    /**
     * Funcion para adicionar un producto al grid cuando este fue editado
     * @param {type} p
     * @returns {undefined}
     */
    adicionarProducto: function (p) {
        var currentIndex = -1;
        this.listaProductos.each(function (_p, index) {
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
                    {name: 'precioalternativo'}
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
     *
     * @param {type} parametros
     * @returns {undefined}
     */
    eliminarMovimientos: function (parametros, _fn) {
        var _this = this;

        mostrarMensaje(2, this.idioma.msgDeleteMovObjeto, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoObjeto, this.idioma.msgEspere || '...');
                var objSubmit = {
                    idmovimientos: Ext.encode(parametros),
                    iddocumento: _this.iddocumento
                };


                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminarMovimiento,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, this.idioma.msgObjetoEliminadoMov);
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
     *
     * @param {type} o
     * @returns {Array.encode._o}
     */
    encode: function (o) {
        var objDoc = LOG.lb.documento.Model.superclass.encode.call(this, o);
        objDoc.productos = new Array();
        this.listaProductos.each(function (_p) {
            objDoc.productos.push(_p.encode());
        });
        return objDoc;
    },
    reset: function () {
        LOG.lb.documento.Model.superclass.reset.call(this);
        this.listaProductos.deleteAll();
    },
    isValid: function () {
        return (LOG.lb.documento.Model.superclass.isValid.call(this) ||
        (this.basicForm.isValid() && this.listaProductos.count() > 0));
    },
    /**
     * Establece los valores actuales de los campos del formulario como valores por defecto.
     * @returns {undefined}
     */
    setDefaulFormValues: function () {
        LOG.lb.documento.Model.superclass.setDefaulFormValues.call(this);
        this.listaProductos.deleteAll();
    },
    salvarObservaciones: function (parametros, _fn) {
        Ext.MessageBox.wait(this.idioma.msgSalvando, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: this.urlController + '/salvarObservaciones',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    eliminarObservaciones: function (parametros, _fn) {
        var _this = this;
        Ext.Ajax.request({
            url: _this.urlController + '/eliminarObservaciones',
            method: 'POST',
            params: {ids: Ext.encode(parametros)},
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, _this.idioma.msgObservacionEliminada);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    }
});