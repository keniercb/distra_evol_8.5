Ext.ns('log.tall.inscripcion');

log.tall.inscripcion.Model = Ext.extend(LOG.lb.documento.Model, {
    idmedio: undefined,
    idorden: undefined,
    listaDinamicos: undefined,
    datosmedios: {},
    constructor: function (config) {
        this.urlAccionAprobarInscripcion = 'aprobarInscripcion';
        this.listaDinamicos = new LOG.util.List();
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'iddocumento',
            primary: true
        });
        log.tall.inscripcion.Model.superclass.constructor.call(this, config);
    },

    addActionButton: function (b) {
        b.disable();
        this.actionButtons.add(b);
    },

    cargarAtributosMedios: function (params, _fn, _fnfail) {
        var objSubmit = {};
        objSubmit.idindicador = Ext.encode(params);
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionmediostaller/atributosPorIndicador',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
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

    eliminar: function (parametros, _fn, loadStore) {
        var _this = this;
        if (!this.sm.hasSelection() && !parametros.id) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgDeleteObjetoIns, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoObjetos, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgObjetoEliminadoIns);
                                loadStore = loadStore || true;
                                if (loadStore) {
                                    this.st.reload();
                                }
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        }.createDelegate(this));
    },

    confirmar: function (parametros, _fn, _fnfail) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgConfirmarDocumentoIns, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgConfirmandoObjetos, _this.idioma.msgEspere || '...');
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
                                mostrarMensaje(1, _this.idioma.msgDocumentoConfirmadoIns);
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

    anularestado: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }

        mostrarMensaje(2, this.idioma.msgAnularEstadoDocumentoIns, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAnulandoEstadoObjetos, _this.idioma.msgEspere || '...');
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
                                mostrarMensaje(1, _this.idioma.msgEstadoDocumentoAnuladoIns);
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

    aprobar: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgAprobarDocumentoIns, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAprobandoObjetos, _this.idioma.msgEspere || '...');
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
                                mostrarMensaje(1, _this.idioma.msgDocumentoAprobadoIns);
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

    salvar: function (parametros, _fn, _fnfail) {
        Ext.MessageBox.wait(this.idioma.msgSalvandoObjetoIns, this.idioma.msgEspere || '...');
        var objSubmit = {};
        this.idmedio = parametros['idmedio'];
        this.idorden = parametros['idorden'];
        this.datosmedios = this.listaDinamicos.getArray();
        objSubmit.data = Ext.encode(this.encode());
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
                        mostrarMensaje(1, this.idioma.lbMsgObjetoSalvadoIns);

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

    bindFormMedio: function (basicForm) {
        var _scope = this;
        basicForm.getForm().items.each(function (field) {

            if (field.isFormField) {
                if (_scope.xtypesEvtents[field.getXType()]
                    && _scope.xtypesEvtents[field.getXType()]['evt'] == 'keyup'
                    && !field.enableKeyEvents) {
                    field.enableKeyEvents = true;
                }

                field.fireEvent = field.fireEvent.createSequence(function (e) {
                    if ((_scope.xtypesEvtents[field.getXType()]
                        && e == _scope.xtypesEvtents[field.getXType()]['evt'])
                        || e == 'blur') {
                        var auxObj = {};
                        var existe = _scope.existeYa(field.getName());

                        auxObj[field.getName()] = field.getValue();
                        auxObj['name'] = field.getName();
                        auxObj['identificador'] = field.identificador;
                        auxObj['tipo'] = field.tipo;
                        auxObj['idcampo'] = field.idcampo;
                        _scope.listaDinamicos.setItem(auxObj, existe);
                        if (_scope.isValid() && basicForm.getForm().isValid()) {
                            _scope.habilitarBotones();
                        } else {
                            _scope.habilitarBotones(true);
                        }
                    }
                });
            }
        });
    },

    existeYa: function (name) {
        var result = -1;
        this.listaDinamicos.each(function (it, pos) {
            if (it.name == name) {
                result = pos;
            }
        });
        return result;
    },

    confirmarInscripcion: function (parametros, _fn, _fnfail) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgConfirmarDocumentoIns, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgConfirmandoObjetos, _this.idioma.msgEspere || '...');
                var objSubmit = {};
                objSubmit = {
                    id: Ext.encode(parametros)
                };
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionConfirmar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgDocumentoConfirmadoIns);
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

    aprobarInscripcion: function (parametros, _fn, _fnfail) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgAprobarDocumentoIns, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAprobandoObjetos, _this.idioma.msgEspere || '...');
                var objSubmit = {};
                objSubmit = {
                    id: Ext.encode(parametros)
                };
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAprobarInscripcion,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgDocumentoAprobadoIns);
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

    generarOrden: function (idindicador, _fn, _fnfail) {
        var param = {};
        var result = {};
        param['iddocumentoorigen'] = idindicador;
        var objSubmit = {
            datos: Ext.encode(param)
        };
        Ext.Ajax.request({
            url: '/logistica/talleres/inscripciones/index.php/inscripcion/generarOrden',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
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

    cargarNombreMedio: function(_fn) {
        Ext.Ajax.request({
            url:  '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
            method: 'POST',
            callback: function (o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp.datos]).call();
                    }
                }
            }.createDelegate(this)

        });
    }
});