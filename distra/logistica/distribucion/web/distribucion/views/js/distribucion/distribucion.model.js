Ext.ns('LOG.dist.distribucion');

LOG.dist.distribucion.Model = Ext.extend(LOG.lb.documento.Model, {
    listaClientesDistribucion: undefined,
    constructor: function (config) {
        this.listaClientesDistribucion = new LOG.util.List();
        this.urlAccionAdicionarDestinos = 'adicionarDestinos';
        this.urlAccionEliminarDestinos = 'eliminarDestinos';
        this.urlAccionSalvarCantidades = 'salvarCantidades';
        this.urlAccionSalvarCantidadesAnular = 'salvarCantidadesAnular';
        this.urlAccionEliminarProductosPedido = 'eliminarProductosPedido';
        this.urlAccionAdicionarPedidos = 'adicionarPedidos';
        this.urlAnularAsignacion = 'anularAsignacion';
        this.urlAccionAnularEstadoDoc = 'anularEstadoDoc';
        this.urlAccionAnularEstado = 'anularEstado';
        this.urlAccionRealizarPropuestaDistribucion = 'realizarPropuestaDistribucion';
        this.urlAccionAjustarPrioridad = 'ajustarPrioridad';
        this.urlAccionAdicionarDocReserva = 'adicionarDocReserva';
        this.urlAccionCargarMovRecepcion = 'cargarMovRecepcion';
        this.urlAccionEliminarProductosClientes = 'eliminarClientesProductos'

        config.fields = [
            {
                name: 'idnomconcepto'
            },
            {
                name: 'idestructuraop'
            },
            {
                name: 'tipodestino'
            },
            {
                name: 'tipodistribucion'
            },
            {
                name: 'salidaporfactura'
            },
            {
                name: 'id'
            }
        ];
        LOG.dist.distribucion.Model.superclass.constructor.call(this, config);
    },
    confirmarDistribucion: function (parametros, _fn, _fnfail) {
        var _this = this;

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
    eliminarDestinos: function (parametros, _fn) {
        var _this = this;

        mostrarMensaje(2, (_this.tipodistribucion == 2) ? this.idioma.msgDeletePedidosObjeto : (_this.tipodistribucion == 1 ? this.idioma.msgDeleteClienteObjeto : this.idioma.msgDeleteDestinoObjeto), function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoObjeto, this.idioma.msgEspere || '...');
                var objSubmit = {
                    iddocclientes: Ext.encode(parametros),
                    iddocumento: _this.iddocumento};
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminarDestinos,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, (_this.tipodistribucion == 2) ? this.idioma.msgPedidosEliminado : (_this.tipodistribucion == 1 ? this.idioma.msgClienteEliminado : this.idioma.msgDestinoEliminado));
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
    eliminarProductosDistribucion: function (parametros, _fn) {
        var _this = this;

        mostrarMensaje(2, this.idioma.msgDeleteMovObjeto, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoObjeto, this.idioma.msgEspere || '...');
                var objSubmit = {
                    idproductopedido: Ext.encode(parametros),
                    iddocumento: _this.iddocumento};


                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminarProductosPedido,
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
    adicionarDestinos: function (parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgSalvando, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        //objSubmit[this.primaryKeyField] = this[this.primaryKeyField];
        Ext.Ajax.request({
                url: this.urlAccionAdicionarDestinos,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, _this.tipodistribucion == 1 ? _this.idioma.msgClienteAdicionado : _this.idioma.msgDestinoAdicionado);
                            _this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    }
                }.createDelegate(this)
            }
        );
    },

    getIndicadoresPedido: function(_fn){
        var objSubmit = {};
        objSubmit.iddocumento = this.iddocumento;
        Ext.MessageBox.wait(this.idioma.msjLoadMask, this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'devolverIndicadoresPedido',
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
    adicionarPedidos: function (parametros, _fn) {
        Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        objSubmit[this.primaryKeyField] = this[this.primaryKeyField];
        Ext.Ajax.request({
            url: this.urlController + this.urlAccionAdicionarPedidos,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (s) {
                        if(resp.destino != 2 && resp.destino != 3){
                            mostrarMensaje(1, this.idioma.msgPedidoAdicionado);
                        }else{
                            if (resp.destino == 2) {
                                mostrarMensaje(1, this.idioma.msgPedidoAdicionadoFaltanProductos);
                            }
                            if (resp.destino == 3) {
                                mostrarMensaje(1, this.idioma.msgPedidoAdicionadoFaltanPedidos);
                            }
                        }
                        if (this.st) {
                            this.st.reload();
                        }
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    /*adicionarDocReserva:function (parametros, _fn) {
        console.log(parametros);
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgSalvando, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
                url: this.urlAccionAdicionarDocReserva,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success) {
                        if (s) {
                            //mostrarMensaje(1, _this.tipodistribucion == 1 ? _this.idioma.msgClienteAdicionado : _this.idioma.msgDestinoAdicionado);
                            _this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [o, s, r]).call();
                        }
                    }
                }.createDelegate(this)
            }
        );
    },*/
    salvarCantidades: function (parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgSalvando, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        objSubmit = {
            datos: Ext.encode(parametros)
        };
        objSubmit[this.primaryKeyField] = this[this.primaryKeyField];
        Ext.Ajax.request({
            url: this.urlAccionSalvarCantidades,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.msgCantidadDistribuida);
                        //_this.st.reload();
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [o, s, r]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    salvarCantidadesAnular: function (parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgSalvando, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        var objSubmit = {
            datos: Ext.encode(parametros),
            iddocumento: _this.iddocumento
        };
        Ext.Ajax.request({
                url: this.urlAccionSalvarCantidadesAnular,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    if (s) {
                        //mostrarMensaje(1, this.idioma.msgCantidadAnulada);
                        _this.st.reload();
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [o, s, r]).call();
                    }
                }.createDelegate(this)
            }
        );
    },
    anularAsignacion: function (parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgCancelando, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        var objSubmit = {
            id: Ext.encode([parametros['iddocumento']])
        };
        Ext.Ajax.request({
                url: this.urlAnularAsignacion,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    if (s) {
                        mostrarMensaje(1, this.idioma.msgAsignacionAnulada);
                        _this.st.reload();
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [o, s, r]).call();
                    }
                }.createDelegate(this)
            }
        );

    },
    anularestado: function (parametros, _fn) {
        var _this = this;
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
    anularestadodoc: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectDistribucion);
            return;
        }
        mostrarMensaje(2, this.idioma.msgAprobarDocumento, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAprobandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = {
                    id: Ext.encode([parametros['iddocumento']])
                };
                Ext.Ajax.request({
                    url: _this.urlAccionAnularEstadoDoc,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (s) {
                            if (resp.eliminado) {
                                mostrarMensaje(1, _this.idioma.msgObjetoEliminadoCancelado);
                            } else {
                                mostrarMensaje(1, _this.idioma.msgDocumentoAprobado);
                            }
                            _this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
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
    aprobar: function(parametros, _fn) {
        var _this = this;

        mostrarMensaje(2, this.idioma.msgAprobarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAprobandoObjeto, _this.idioma.msgEspere || '...');
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
                                if (resp.eliminado) {
                                    mostrarMensaje(1, _this.idioma.msgObjetoEliminadoCancelado);
                                } else {
                                    mostrarMensaje(1, _this.idioma.msgDocumentoAprobado);
                                }
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
    realizarPropuestaDistribucion: function (parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgRealizandoDistribucion, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        /*objSubmit = {
         datos: Ext.encode(parametros)
         };*/
        objSubmit[this.primaryKeyField] = this[this.primaryKeyField];
        Ext.Ajax.request({
            url: this.urlAccionRealizarPropuestaDistribucion,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.msgDocumentoDistribuido);
                        _this.st.reload();
                    }
                }
                if (typeof _fn == 'function') {
                    _fn.createDelegate(this, [resp]).call();
                }
            }.createDelegate(this)
        });
    },
    ajustarPrioridad: function (parametros, stGridDetalles,_fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgActualizandoObjeto, this.idioma.msgEspere || '...');
        var objSubmit = {
            datos: Ext.encode(parametros)
        };
        Ext.Ajax.request({
            url: _this.urlController + _this.urlAccionAjustarPrioridad,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        stGridDetalles.reload({callback: _fn});
                    }
                }
            }.createDelegate(this)
        });
    },
    /**
     * Devuelve los movimientos de un informe de recepción.
     * @param {Numeric} iddocumento
     * @param {Function} _fn
     * @returns {undefined}
     */
    
    cargarMovRecepcion: function(iddocumento, _fn) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.msgCargandoMomvRecepcion, _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: _this.urlController + _this.urlAccionCargarMovRecepcion,
            method: 'POST',
            params: {id: iddocumento},
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                Ext.each(resp.datos, function(record) {
                    record.idrecepcion =  iddocumento;
                });
                if (resp.success) {
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp.datos]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    eliminarClientesProductos: function(parametros, parametros1, parametros2, _fn, distribuidos) {
        var _this = this;
        mostrarMensaje(2, (distribuidos) ? this.idioma.msgProductosNoDistribuidos :_this.idioma.msgDeleteMovObjeto, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = {
                    idmovimientos: Ext.encode(parametros),
                    idclientes: Ext.encode(parametros1),
                    idprodorden: Ext.encode(parametros2),
                    iddocumento: _this.iddocumento
                };
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminarProductosClientes,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, _this.idioma.msgObjetoEliminadoDoc);
                            _this.st.reload();
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    }
});