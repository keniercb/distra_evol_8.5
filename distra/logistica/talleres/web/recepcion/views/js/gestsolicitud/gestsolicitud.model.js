Ext.ns('log.tall.recepcion');

log.tall.recepcion.Model = Ext.extend(LOG.lb.documento.Model, {
    servicios: undefined,
    idproducto: undefined,
    idindicador: undefined,
    idpadre: undefined,
    atributoidentificador: undefined,
    dictamen: false,
    constructor: function (config) {
        this.urlAccionEliminarServicios = 'eliminarServios';
        this.urlAccionGuardarSolTerceros = 'adicionarSolicitud';
        this.urlActualizarPrioridad = 'actualizarPrioridad';
        this.urlAccionAprobarSolicitud = 'aprobarSolicitud';
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'iddocumento',
            primary: true
        });
        log.tall.recepcion.Model.superclass.constructor.call(this, config);
    },

    salvarNuevaSolicitud: function (parametros, _fn, _fnfail) {
        if (this.isValid()) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
            var objSubmit = {};
            this.idproducto = parametros['idproducto'];
            this.idpadre = parametros['idpadre'];
            this.idindicador = parametros['idindicador'];
            this.atributoidentificador = parametros['atributoidentificador'];
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
                            mostrarMensaje(1, this.idioma.lbMsgObjetoSalvado);

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
        } else {
            mostrarMensaje(1, this.idioma.msgDatosIncorrectos);
        }
    },

    salvarSolicitud: function (parametros, param, _fn, _fnfail) {
        Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
        var objSubmit = {};
        this.servicios = parametros;
        this.idproducto = param['idproducto'];
        this.idindicador = param['idindicador'];
        this.idpadre = param['idpadre'];
        this.idagencia = param['idagencia'];
        this.idestructura = param['idestructura'];
        this.entidad = param['entidad'];
        this.atributoidentificador = param['atributoidentificador'];
        objSubmit.data = Ext.encode(this.encode());
        Ext.Ajax.request({
            url: this.urlController + this.urlAccionGuardarSolTerceros,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.lbMsgObjetoSalvadoT);
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

    salvarDefectacion: function (parametros, _fn, _fnfail) {
        if (this.isValid()) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
            var objSubmit = parametros || {};
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
                            mostrarMensaje(1, this.idioma.lbMsgDefectacionSalvada);

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
        } else {
            mostrarMensaje(1, this.idioma.msgDatosIncorrectos);
        }
    },

    eliminarServicios: function (parametros, _fn) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgDeleteObjeto, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoObjeto, this.idioma.msgEspere || '...');
                var objSubmit = {
                    datos: Ext.encode(parametros)
                };
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminarServicios,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgObjetoEliminado);
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

    anularestado: function(parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }

        mostrarMensaje(2, this.idioma.msgAnularEstadoDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAnulandoEstadoObjetos, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAnularEstado,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
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

    eliminar: function(parametros, _fn, loadStore) {
        var _this = this;
        if (!this.sm.hasSelection() && !parametros.id) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgDeleteObjeto, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoObjetos, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.id) ? Ext.encode([objSubmit.id]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgObjetoEliminado);
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

    confirmar: function(parametros, _fn, _fnfail) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgConfirmarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgConfirmandoObjetos, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionConfirmar,
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
                        }else {
                            if (typeof _fnfail == 'function') {
                                _fnfail.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        });
    },

    aprobar: function(parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgAprobarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAprobandoObjetos, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAprobar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
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
                        }
                    }.createDelegate(this)

                });
            }
        });
    },

    confirmarSolicitud: function (parametros, _fn, _fnfail) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgConfirmarDocumento, function (btn) {
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

    confirmarSolicitudterceros: function (parametros, _fn, _fnfail) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgConfirmarDocumentoT, function (btn) {
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
                                mostrarMensaje(1, _this.idioma.msgDocumentoConfirmadoT);
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

    aprobarSolicitud: function (parametros, _fn, _fnfail) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgAprobarDocumento, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAprobandoObjetos, _this.idioma.msgEspere || '...');
                var objSubmit = {};
                objSubmit = {
                    id: Ext.encode(parametros)
                };
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAprobarSolicitud,
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
                        }
                    }.createDelegate(this)

                });
            }
        });
    },

    aprobarSolicitudTerceros: function (parametros, _fn, _fnfail) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgAprobarDocumentoT, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAprobandoObjetos, _this.idioma.msgEspere || '...');
                var objSubmit = {};
                objSubmit = {
                    id: Ext.encode(parametros)
                };
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAprobarSolicitud,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgDocumentoAprobadoT);
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

    actualizarPrioridad: function (parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgActualizandoObjeto, this.idioma.msgEspere || '...');
        var objSubmit = {
            datos: Ext.encode(parametros)
        };
        Ext.Ajax.request({
            url: _this.urlController + _this.urlActualizarPrioridad,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        _this.st.reload({callback: _fn});
                    }
                }
            }.createDelegate(this)
        });
    },

    salvarDefectacion: function (parametros, _fn, _fnfail) {
        if (this.isValid()) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoDefectacion, this.idioma.msgEspere || '...');
            var objSubmit = {};
            this.idproducto = parametros['idproducto'];
            this.medio = parametros['medio'];
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
                            mostrarMensaje(1, this.idioma.lbMsgDictamenSalvado);

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
        } else {
            mostrarMensaje(1, this.idioma.msgDatosIncorrectos);
        }
    },

    /*addActionButton: function (b) {
        b.disable();
        this.actionButtons.add(b);
    },*/

    setDictamen: function (d) {
        this.dictamen = d;
    },

    cargarActivos: function(idestructura, _fn, _fnfail) {
        var objSubmit = {
            idestructura: idestructura
        };
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/utiles/index.php/gestregnumerico/getCargarEnviadosATaller',
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

    cargarIndicadores: function(explotacion, _fn, _fnfail) {
        var objSubmit = {
            explotacion: explotacion
        };
        Ext.Ajax.request({
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
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

    cargarIdentificador: function(idpadre, _fn, _fnfail) {
        var objSubmit = {
            idindicador: idpadre
        };
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionmediostaller/atributosPorIndicador',
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
    }


});