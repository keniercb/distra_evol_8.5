Ext.ns('LOG.aft.documentoPat');
LOG.aft.documentoPat.Model = Ext.extend(LOG.util.Model, {
    constructor: function(config) {
        Ext.apply(this, config);
        LOG.aft.documentoPat.Model.superclass.constructor.call(this, config);
    },
    /**
     * Funcionalidad para cargar los datos del encabezado de la ventana gestinar documento
     */
    cargarEncabezado: function(modificar, record, datos_traslado) {
        var _this = this;

        Ext.getBody().mask(_this.idioma.lbMsgCargandoDatos, 'x-mask-loading');
        Ext.Ajax.request({
            url: 'getencabezadogastionardoc',
            method: 'POST',
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);

                if (modificar == 'modificar') {
                    rd.fecha = record.data.fechacontable
                    rd.estado = record.data.estadod
                    rd.cant = record.data.cant_medios
                }
                rd.arearesp = _this.scope.denomNodoSeleccionado;
                _this.scope.onBtnAdicionarClick(modificar, record, rd, '', datos_traslado);
                Ext.getBody().unmask();
            }
        });
    },
    eliminarDocumento: function() {
        var _this = this.scope;
        var idoperacion = _this.getSmPrincipal().getSelected().get('idoperacion');

        var nodoPadre = {
            attributes: {
                text: _this.denomPadreNodoSeleccionado,
                id: _this.idPadreNodoSeleccionado
            }
        };

        var parametros = {
            idoperacion: idoperacion,
            identidadpadre: nodoPadre.attributes.id //este parametro es para cuando el documento es una recepcion de traslado externo
        };

        parametros.iddocumento = _this.getSmPrincipal().getSelected().get('iddocumento');

        mostrarMensaje(2, _this.idioma.lbMsgConfirmarEliminar, function(btn) {
            if (btn == 'ok') {
                Ext.getBody().mask(_this.idioma.MaskEliminarDocumento, 'x-mask-loading');
                Ext.Ajax.request({
                    url: 'eliminardocumento',
                    method: 'POST',
                    params: parametros,
                    callback: function(opts, success, resp) {
                        if (!success) {
                            Ext.getBody().unmask();
                            return;
                        }
                        Ext.getBody().unmask();
                        mostrarMensaje(1, _this.idioma.lbMsgDocumentoEliminado);
                        _this.getStorePrincipal().reload();
                    }
                });
            }
        });
    },
    aprobarDoc: function(params, accion, scope) {
        var _this = this.scope;
        mostrarMensaje(2, _this.idioma.MsgAprobarEstatus, function(btn) {
            if (btn == 'ok') {

                Ext.getBody().mask(_this.idioma.MaskAprobHI, 'x-mask-loading');
                Ext.Ajax.request({
                    url: 'aprobardocumento',
                    params: params,
                    method: 'POST',
                    callback: function(options, success, response) {
                        Ext.getBody().unmask();
                        if (success) {
                            var rd = Ext.decode(response.responseText);
                            if (rd.success) {
                                mostrarMensaje(1, _this.idioma.MsgAprobHIOk);
                                _this.storePrincipal.reload();

                                //  Para el caso de los movimientos
                                if (typeof accion == 'function') {
                                    (scope) ? accion.call(scope, rd.estado, rd.idestado) : accion(rd.estado, rd.idestado);
                                }
                            } else {
                                if (rd.cod == "3") {
                                    mostrarMensaje(3, _this.idioma.MsgAprobHIError);
                                } else if (rd.cod == "5") {
                                    mostrarMensaje(3, _this.idioma.MsgAprobHIError5);
                                } else if (rd.cod == "6") {
                                    mostrarMensaje(3, _this.idioma.MsgAprobHIError6);
                                }
                            }
                        } else {
                            mostrarMensaje(3, _this.idioma.MsgAprobHIError);
                        }
                    }
                })
            }
        });
    },
    confirmarDoc: function(params, accion) {
        var _this = this.scope;
        mostrarMensaje(2, _this.idioma.MsgConfirmarEstatus, function(btn) {
            if (btn == 'ok') {
                Ext.getBody().mask(_this.idioma.MaskConfHI, 'x-mask-loading');

                Ext.Ajax.request({
                    url: 'confirmardocumento',
                    params: params,
                    method: 'POST',
                    callback: function(options, success, response) {
                        Ext.getBody().unmask();
                        if (success) {
                            var rd = Ext.decode(response.responseText);
                            if (rd.success) {
                                mostrarMensaje(1, _this.idioma.MsgConfHIOk);
                                _this.storePrincipal.reload();

                                //  Para el caso de los movimientos
                                if (typeof accion == 'function') {
                                    (params.scope) ? accion.call(params.scope, rd.estado, rd.idestado) : accion(rd.estado, rd.idestado);
                                }
                            } else if (rd.cod == 3) {
                                mostrarMensaje(3, _this.idioma.MsgConfHIError);
                            } else if (rd.msg) {
                                mostrarMensaje(3, rd.msg);
                            } else if (rd.validar) {
                                var msgString = 'Existen activos con campos incorrectos.' + '</br></br>';
                                for (var i = 0; i < rd.validar.length; i++) {
                                    msgString = '<b>'+msgString + rd.validar[i].denominacion + ':'+'</b>'+'</br>';
                                    for (var j = 0; j < rd.validar[i].novalido.length; j++) {
                                        var cadena = rd.validar[i].novalido[j].hedaer;
                                        msgString = msgString + cadena;
                                        msgString = msgString + '  ' + rd.validar[i].novalido[j].cant + '</br>';
                                    }
                                    msgString = msgString + '</br>';
                                }
                                mostrarMensaje(3, msgString);
                            }
                        }
                    }
                });
            }
        });
    },
    cancelarEstadoDoc: function(params, accion, scope) {
        var _this = this.scope;
        mostrarMensaje(2, _this.idioma.MsgAnularEstatus, function(btn) {
            if (btn == 'ok') {
                Ext.getBody().mask(_this.idioma.MaskCancelarEstatus, 'x-mask-loading');

                Ext.Ajax.request({
                    url: 'cancelardocumento',
                    params: params,
                    method: 'POST',
                    callback: function(options, success, response) {
                        if (success) {
                            var rd = Ext.decode(response.responseText);
                            if (rd.success) {
                                Ext.getBody().unmask();
                                mostrarMensaje(1, _this.idioma.MsgAnularEstatusOk);
                                _this.storePrincipal.reload();

                                //  Para el caso de los movimientos
                                if (typeof accion == 'function') {
                                    (scope) ? accion.call(scope, rd.estado, rd.idestado) : accion(rd.estado, rd.idestado);
                                }
                            } else {
                                Ext.getBody().unmask();
                                mostrarMensaje(3, _this.idioma.MsgAnularEstatusError);
                            }
                        } else {
                            Ext.getBody().unmask();
                            mostrarMensaje(3, _this.idioma.MsgAnularEstatusError);
                        }
                    }
                })
            }
        });
    },
    cargarDatComboDeposito: function(_fn) {
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/cargarareas',
            method: 'POST',
            callback: function(options, success, response) {
                var resp = Ext.decode(response.responseText);
                if (resp.success) {
                    if (typeof _fn == 'function') {
                        _fn.call(this, [resp]);
                    }
                }
            }
        });
    },
    cargarEntidadComboArea: function(conf) {
        var _this = this.scope;

        Ext.Ajax.request({
            url: 'getentidad',
            method: 'POST',
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.idNodoSeleccionado = rd.identidad;
                _this.denomNodoSeleccionado = rd.entidad;

                _this.idPadreNodoSeleccionado = rd.identidad;
                _this.denomPadreNodoSeleccionado = rd.entidad;
                if (_this.autoLoad) {
                    _this.storePrincipal.load();
                }
                if (typeof conf.fnEntidad == 'function')
                {
                    conf.fnEntidad.call(_this);
                }
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
    controlFirmaDocumento: function(parametros, _fn, _fnFail) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        var objSubmit = parametros || {};
        objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
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
    getExisteDocAjustesInventario: function(iddocumento) {
        var _this = this;
        Ext.MessageBox.wait("Validando documento", _this.idioma.lbEspere);
        Ext.Ajax.request({
            url: 'getExisteDocAjustesInventario',
            method: 'POST',
            params: {
                iddocumento: iddocumento
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                Ext.MessageBox.hide();
                if (rd.data = 1) {
                    _this.eliminarDocumento();
                } else if (rd.data == 0) {
                    mostrarMensaje(3, 'El documento no puede ser eliminado, ha sido generado a partir de un inventario parcial.');
                }
            }
        });
    }
});