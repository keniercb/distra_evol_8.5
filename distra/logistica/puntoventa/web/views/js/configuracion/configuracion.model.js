Ext.ns('LOG.fac.configuracionpuntoventa');
LOG.fac.configuracionpuntoventa.Model = Ext.extend(LOG.util.Model, {
    constructor: function (config) {
        config.fields = [
            {name: 'idusuario'},
            {name: 'idarea'},
            {name: 'idtipocaja'}
        ];
        LOG.fac.configuracionpuntoventa.Model.superclass.constructor.call(this, config);
        this.urlAccionEliminar = 'eliminarAreaCaja';
        this.urlAccionActivar = 'activarAreaCaja';
        this.urlAccionActivarNaturaleza = 'activarNaturaleza';
        this.urlAccionActivarAgrupacion = 'activarAgrupacion';
        this.urlAccionAdicionarProductos = 'adicionarProductosgrid';
        this.urlAccionAdicionarAreaCaja = 'adicionarAreaCaja';
        this.urlAccionDiasHabiles = 'diasHabiles';
        this.urlAccionAdicionarNaturaleza = 'adicionarNaturaleza';
    },
    salvar: function (parametros, _fn, _fnfail) {
        var msg;
        if (parametros.cajaArea) {
            msg = (parametros.action == 'mod') ? this.idioma.msgSalvandoModCajaArea : this.idioma.msgSalvandoCajaArea;
        } else {
            msg = this.idioma.msgSalvandoObjeto;
        }
        Ext.MessageBox.wait(msg, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: this.urlController + this.urlAccionAdicionarAreaCaja,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        var msgConf;
                        if (parametros.cajaArea) {
                            msgConf = (parametros.action == 'mod') ? this.idioma.lbMsgModCajaAreaSalvado : this.idioma.lbMsgCajaAreaSalvado;
                        } else {
                            msgConf = this.idioma.lbMsgObjetoSalvado;
                        }
                        mostrarMensaje(1, msgConf);
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
    salvarNaturalezas: function (parametros, _fn, _fnfail) {
        var msg;
        msg = this.idioma.msgSalvandoNat;        
        Ext.MessageBox.wait(msg, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: this.urlController + this.urlAccionAdicionarNaturaleza,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        var msgConf;
                        msgConf = this.idioma.lbMsgObjetoSalvadoNat;
                        
                        mostrarMensaje(1, msgConf);
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
    adicionarProductos: function (parametros, _fn, _fnfail) {
        var msg = (parametros.productoTPV === 1) ? this.idioma.msgSalvandoProducto : this.idioma.msgSalvando;
        Ext.MessageBox.wait(msg, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};

        Ext.Ajax.request({
            url: this.urlController + this.urlAccionAdicionarProductos,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        var msgConf;
                        if (parametros.productoTPV === 1) {
                            msgConf = this.idioma.msgProductoSalvado
                        } else if (parametros.revaluarPrecioTPV === 1) {
                            msgConf = this.idioma.msgReevaluarPrecioSalvado;
                        } else {
                            msgConf = this.idioma.msgCambiarPrecioSalvado;
                        }
                        mostrarMensaje(1, msgConf);
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
    eliminar: function (parametros, _fn, _fnfail) {
        var me = this;
        mostrarMensaje(2, (parametros.areaCaja) ? this.idioma.msgDeleteCajaArea : this.idioma.msgDeleteObjeto, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait((parametros.areaCaja) ? me.idioma.msgEliminandoCajaArea : me.idioma.msgEliminandoObjeto, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: me.urlController + me.urlAccionEliminar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, (parametros.areaCaja) ? this.idioma.lbMsgCajaAreaEliminando : this.idioma.lbMsgObjetoEliminando);
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(me, [resp]).call();
                            }
                        } else {
                            if (typeof _fnfail == 'function') {
                                _fnfail.createDelegate(me, [resp]).call();
                            }
                        }
                    }.createDelegate(me)
                });
            }
        });
    },
    activacion: function (parametros, _fn, _fnfail) {

        var me = this, msg;
        if (parametros.activo) {
            msg = (parametros.areaCaja) ? this.idioma.msgHabilitarCajaArea : this.idioma.msgHabilitarObjeto;
        } else {
            msg = (parametros.areaCaja) ? this.idioma.msgDeshabilitarCajaArea : this.idioma.msgDeshabilitarObjeto;
        }
        mostrarMensaje(2, msg, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(me.idioma.msgEnviandoDatos, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: me.urlController + me.urlAccionActivar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.success) {
                            if (s) {
                                var msgconf;
                                if (parametros.activo) {
                                    msgconf = (parametros.areaCaja) ? this.idioma.msgHabCajaArea : this.idioma.msgHabilitarObj;
                                } else {
                                    msgconf = (parametros.areaCaja) ? this.idioma.msgDeshabCajaArea : this.idioma.msgDeshabilitarObj;
                                }
                                mostrarMensaje(1, msgconf);
                                if (me.st) {
                                    me.st.reload();
                                }
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(me, [resp]).call();
                            }
                        } else {
                            if (typeof _fnfail == 'function') {
                                _fnfail.createDelegate(me, [resp]).call();
                            }
                        }
                    }.createDelegate(me)
                });
            }
        });
    },
    activacionarea: function (parametros, _fn, _fnfail) {
        var me = this, msg;
        Ext.Ajax.request({
            url: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/cargarPuntoVenta',
            method: 'POST',
            callback: function (opt, scs, resp) {
                Ext.getBody().unmask();
                if (scs) {
                    aux = Ext.decode(resp.responseText);
                    var record = {
                        data: aux.datos
                    }
                    for (var i = 0; i < record.data.length; i++) {

                        if ((parametros.datos.substr(2, 7) == record.data[i].idareacaja) && record.data[i].activocaja == 1) {
                            mostrarMensaje(3, this.idioma.msgDesabiliarConfgCaja);
                            return;
                        }
                    }
                    if (parametros.activo) {
                        msg = (parametros.areaCaja) ? this.idioma.msgHabilitarCajaArea : me.idioma.msgHabilitarObjeto;
                    } else {
                        msg = (parametros.areaCaja) ? this.idioma.msgDeshabilitarCajaArea : me.idioma.msgDeshabilitarObjeto;
                    }
                    mostrarMensaje(2, msg, function (btn) {
                        if (btn == 'ok') {
                            Ext.MessageBox.wait(me.idioma.msgEnviandoDatos, me.idioma.msgEspere || '...');
                            var objSubmit = parametros || {};
                            Ext.Ajax.request({
                                url: me.urlController + me.urlAccionActivar,
                                method: 'POST',
                                params: objSubmit,
                                callback: function (o, s, r) {
                                    Ext.MessageBox.hide();
                                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                    me.apply(resp);
                                    if (resp.success) {
                                        if (s) {
                                            var msgconf;
                                            if (parametros.activo) {
                                                msgconf = (parametros.areaCaja) ? this.idioma.msgHabCajaArea : this.idioma.msgHabilitarObj;
                                            } else {
                                                msgconf = (parametros.areaCaja) ? this.idioma.msgDeshabCajaArea : this.idioma.msgDeshabilitarObj;
                                            }
                                            mostrarMensaje(1, msgconf);
                                            if (me.st) {
                                                me.st.reload();
                                            }
                                        }
                                        if (typeof _fn == 'function') {
                                            _fn.createDelegate(me, [resp]).call();
                                        }
                                    } else {
                                        if (typeof _fnfail == 'function') {
                                            _fnfail.createDelegate(me, [resp]).call();
                                        }
                                    }
                                }.createDelegate(me)
                            });
                        }
                    });
                }
            }
        });
    },
    activacionNaturaleza: function (parametros, _fn, _fnfail) {
        var me = this, msg;
        if (parametros.activo) {
            msg = this.idioma.msgHabilitarNaturaleza;
        } else {
            msg = this.idioma.msgDeshabilitarNaturaleza;
        }
        mostrarMensaje(2, msg, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(me.idioma.msgEnviandoDatos, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: me.urlController + me.urlAccionActivarNaturaleza,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.success) {
                            if (s) {
                                var msgconf;
                                if (parametros.activo) {
                                    msgconf = this.idioma.msgHabNaturaleza;
                                } else {
                                    msgconf = this.idioma.msgDeshabilitarNat;
                                }
                                mostrarMensaje(1, msgconf);
                                if (me.st) {
                                    me.st.reload();
                                }
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(me, [resp]).call();
                            }
                        } else {
                            if (typeof _fnfail == 'function') {
                                _fnfail.createDelegate(me, [resp]).call();
                            }
                        }
                    }.createDelegate(me)
                });
            }
        });
    },
    activacionAgrupacion: function (parametros, _fn, _fnfail) {
        var me = this, msg;
        if (parametros.activo) {
            msg = this.idioma.msgHabilitarAgr;
        } else {
            msg = this.idioma.msgDeshabilitarAgr;
        }
        mostrarMensaje(2, msg, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(me.idioma.msgEnviandoDatos, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: me.urlController + me.urlAccionActivarAgrupacion,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.success) {
                            if (s) {
                                var msgconf;
                                if (parametros.activo) {
                                    msgconf = this.idioma.msgHabAgr;
                                } else {
                                    msgconf = this.idioma.msgDeshabAgr;
                                }
                                mostrarMensaje(1, msgconf);
                                if (me.storeOeste) {
                                    me.storeOeste.reload();
                                }
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(me, [resp]).call();
                            }
                        } else {
                            if (typeof _fnfail == 'function') {
                                _fnfail.createDelegate(me, [resp]).call();
                            }
                        }
                    }.createDelegate(me)
                });
            }
        });
    },
    sincronizarDatos: function (parametros, _fn, _fnfail) {
        var me = this, msg;
        /*if (parametros.activo) {
            msg = this.idioma.msgHabilitarNaturaleza;
        } else {
            msg = this.idioma.msgDeshabilitarNaturaleza;
        }*/
        msg = this.idioma.msgSincronizar;
        mostrarMensaje(2, msg, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(me.idioma.msgSincronizandoDatos, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: me.urlController + 'sincronizarDatos',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.codErr && resp.idpedidos) {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'Existen productos/servicios que cambiaron su precio y tienen ventas pendientes en caja',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR,
                                fn: function () {
                                    let win = new LOG.fac.configuracionpuntoventa.Error({ idioma: me.idioma, pedidos: resp.idpedidos});
                                    win.init();
                                    win.view();
                                }
                            });
                        } else {
                            if (resp.success) {
                                if (resp.url) {
                                    var file_path = resp.url;
                                    var a = document.createElement('A');
                                    a.href = file_path;
                                    a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                } else {
                                    if (s) {
                                        mostrarMensaje(1, this.idioma.msgSincronizadoOK);
                                        if (me.st) {
                                            me.st.reload();
                                        }
                                    }
                                    if (typeof _fn == 'function') {
                                        _fn.createDelegate(me, [resp]).call();
                                    }
                                }
                            } else {
                                if (typeof _fnfail == 'function') {
                                    _fnfail.createDelegate(me, [resp]).call();
                                }
                            }
                        }
                    }.createDelegate(me)
                });
            }
        });
    },
    actualizarPrecios: function (parametros, _fn, _fnfail) {
        var me = this, msg;
        /*if (parametros.activo) {
            msg = this.idioma.msgHabilitarNaturaleza;
        } else {
            msg = this.idioma.msgDeshabilitarNaturaleza;
        }*/
        msg = this.idioma.msgActPrecios;
        mostrarMensaje(2, msg, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(me.idioma.msgActualizandoPrecios, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: me.urlController + 'actualizarPrecios',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgActualizadoPrecioOK);
                                if (me.st) {
                                    me.st.reload();
                                }
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(me, [resp]).call();
                            }
                        } else {
                            if (typeof _fnfail == 'function') {
                                _fnfail.createDelegate(me, [resp]).call();
                            }
                        }
                    }.createDelegate(me)
                });
            }
        });
    },
    diasHabiles: function (parametros, _fn) {
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: this.urlController + this.urlAccionDiasHabiles,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (typeof _fn == 'function') {
                        _fn.call(this, [resp.datos]);
                        //console.info(resp);
                    }
                }
            }.createDelegate(this)
        });
    },
    cargaInicial: function (parametros, _fn) {
        var me = this;
        Ext.MessageBox.wait(me.idioma.msgCargaInicial, me.idioma.msgEspere);
        var objSubmit = parametros || {};
        objSubmit.exception = false;
        Ext.Ajax.request({
            url: parametros.url,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp.datos]).call();

                    }
                }
            }.createDelegate(this)
        });
    },
    guardarInfoConexion: function (parametros, _fn) {
        var me = this;
        Ext.MessageBox.wait(me.idioma.msgSalvandoDatos, me.idioma.msgEspere);
        var objSubmit = parametros || {};
        objSubmit.exception = false;
        Ext.Ajax.request({
            url: 'guardarInfoConexion',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success && resp.codigoMsg == 1) {
                    mostrarMensaje(resp.codigoMsg, me.idioma.msgDatosCorrectos);
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp.datos]).call();

                    }
                }
            }.createDelegate(this)
        });
    },
    eliminarInfoConexion: function (parametros, _fn) {
        var me = this;
        Ext.MessageBox.wait(me.idioma.msgElimandoDatos, me.idioma.msgEspere);
        var objSubmit = parametros || {};
        objSubmit.exception = false;
        Ext.Ajax.request({
            url: 'guardarInfoConexion',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success && resp.codigoMsg == 1) {
                    mostrarMensaje(resp.codigoMsg, me.idioma.msgEliminadoCorrectos);
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp.datos]).call();

                    }
                }
            }.createDelegate(this)
        });
    },
    guardarTiempos:function(parametros,_fn){
        var msg;
        msg = "Salvando tiempos y cantidades";        
        Ext.MessageBox.wait(msg, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: 'guardarTiemposCantidads',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        var msgConf;
                        msgConf = this.idioma.lbMsgObjetoSalvadoTiempos;
                        
                        mostrarMensaje(1, msgConf);
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
    eliminarTiempos:function(parametros,_fn){
        var msg;
        msg = "Eliminando tiempo(s) y cantidades";        
        Ext.MessageBox.wait(msg, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: 'eliminarTiemposCantidads',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        var msgConf;
                        msgConf = this.idioma.lbMsgObjetoEliminadoTiempos;
                        
                        mostrarMensaje(1, msgConf);
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
    asociarAreaCaja:function(parametros,_fn){
        var me = this;
        var msg;
        mostrarMensaje(2, this.idioma.msgAsociarAreaCaja, function (btn) {            
            if (btn == 'ok') {
                msg = "Asociando \xe1rea de venta a tipo de caja";        
                Ext.MessageBox.wait(msg, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: 'asociarAreaCaja',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        //this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                /*var msgConf;
                                msgConf = this.idioma.lbMsgObjetoSalvadoTiempos;                        
                                mostrarMensaje(1, msgConf);*/
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
            }   
        });        
    },
    aplicarConfiguracion:function(parametros,_fn){
        var me = this;
        var msg;
        mostrarMensaje(2, this.idioma.msgAplicarConf, function (btn) {
            if (btn == 'ok') {
                msg = "Aplicando configuraci\xf3n";        
                Ext.MessageBox.wait(msg, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: 'aplicarConfiguracion',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        //this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                /*var msgConf;
                                msgConf = this.idioma.lbMsgObjetoSalvadoTiempos;                        
                                mostrarMensaje(1, msgConf);*/
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
            }   
        });        
    },
    asociarUsuarioACaja:function(parametros,_fn){
        var me = this;
        var msg;
        //mostrarMensaje(2, this.idioma.msgAplicarConf, function (btn) {
            //if (btn == 'ok') {
                msg = "Aplicando cambios";        
                Ext.MessageBox.wait(msg, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: 'asociarUsuarioACaja',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        //this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                /*var msgConf;
                                msgConf = this.idioma.lbMsgObjetoSalvadoTiempos;                        
                                mostrarMensaje(1, msgConf);*/
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
            //}   
        //});        
    },
    eliminarNaturalezas:function(parametros,_fn){
        var msg;
        msg = "Eliminando naturalezas";
        Ext.MessageBox.wait(msg, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: 'eliminarNaturalezas',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        var msgConf;
                        msgConf = 'Las naturalezas han sido eliminadas satesfactoriamente';

                        mostrarMensaje(1, msgConf);
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
    eliminarServicios:function(parametros,_fn){
        var msg;
        msg = "Eliminando servicios";
        Ext.MessageBox.wait(msg, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: 'eliminarServicios',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        var msgConf;
                        msgConf = 'Los servicios han sido eliminados satesfactoriamente';

                        mostrarMensaje(1, msgConf);
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
    eliminarOperario:function(parametros,_fn){
        var msg;
        msg = "Eliminando operarios";
        Ext.MessageBox.wait(msg, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: 'eliminarOperarios',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        var msgConf;
                        msgConf = 'Los operarios han sido eliminados satesfactoriamente';

                        mostrarMensaje(1, msgConf);
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
    activacionModoCatalogo: function (parametros) {
        var me = this, msg;
        msg = (parametros.seleccion.data.modocatalogo == 1)
            ? "\xbfEst\xe1 seguro que desea desactivar el modo cat\xe1logo de la tienda virtual\x3f"
            : "\xbfEst\xe1 seguro que desea activar el modo cat\xe1logo de la tienda virtual\x3f";

        mostrarMensaje(2, msg, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(me.idioma.msgEnviandoDatos, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: me.urlController + 'setModoCatalogo',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.success) {
                            if (s) {
                                var msgconf = "Modo cat\xe1logo cambiado satisfactoriamente";
                                mostrarMensaje(1, msgconf);
                                if (me.st) {
                                    me.st.reload();
                                }
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(me, [resp]).call();
                            }
                        } else {
                            if (typeof _fnfail == 'function') {
                                _fnfail.createDelegate(me, [resp]).call();
                            }
                        }
                    }.createDelegate(me)
                });
            }
        });
    },
    enviarCajerosCaja: function (parametros) {
        var me = this, msg;
        msg = "\xbfEst\xe1 seguro que desea sincronizar cajeros a cajas asociadas al \xe1rea\x3f";

        mostrarMensaje(2, msg, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(me.idioma.msgEnviandoDatos, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: me.urlController + 'enviarCajerosCaja',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.success) {
                            if (s) {
                                var msgconf = "Los datos han sido sincronizados satisfactoriamente";
                                mostrarMensaje(1, msgconf);
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(me, [resp]).call();
                            }
                        } else {
                            if (typeof _fnfail == 'function') {
                                _fnfail.createDelegate(me, [resp]).call();
                            }
                        }
                    }.createDelegate(me)
                });
            }
        });
    }
});