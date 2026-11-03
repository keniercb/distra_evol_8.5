Ext.ns('Log.fac.ventasdevolucion');

Log.fac.ventasdevolucion.Model = Ext.extend(LOG.util.Model, {
    /**
     *
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function (config) {

        Log.fac.ventasdevolucion.Model.superclass.constructor.call(this, config);
    },

    adicionarCierre: function( params,fn){
        Ext.MessageBox.wait(this.idioma.msgSalvandoCierre, this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'adicionarCierre',
            method: 'POST',
            params: params,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (typeof fn == 'function') {
                        fn.createDelegate(this).call();
                    }
                mostrarMensaje(2,this.idioma.lbMsgObjetoSalvado);
                }
                //  this.setDefaulFormValues();
            }.createDelegate(this)
        });

    },
    CierrePorCajero:function(params, _fn, _fnfail){
        Ext.Ajax.request({
        url: 'Cierre',
        method: 'POST',
        params: params,
        callback: function(o, s, r) {
            Ext.MessageBox.hide();
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            this.apply(resp);
            if (resp.success) {
                if (typeof fn == 'function') {
                    fn.createDelegate(this).call();
                }
            }
            //  this.setDefaulFormValues();
        }.createDelegate(this)
    });
    },
    guardarObservacion:function(params, _fn, _fnfail){
        Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'guardarObservacion',
            method: 'POST',
            params: params,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (typeof _fn == 'function') {
                    _fn.createDelegate(this).call();
                    }
                }
                //  this.setDefaulFormValues();
            }.createDelegate(this)
        });
    },
    guardarDatosClientes:function(params, _fn, _fnfail){
        Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'guardarDatosClientes',
            method: 'POST',
            params: params,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    sincronizarDatos: function (parametros, _fn, _fnfail) {
        var me = this, msg;
        var urlController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/';
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
                    url: urlController + 'sincronizarDatos',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgSincronizadoOK);
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
    exportarEntregados: function (parametros, _fn, _fnfail) {
        var me = this, msg;
        msg = this.idioma.msgSincronizar;
        mostrarMensaje(2, msg, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(me.idioma.msgSincronizandoDatos, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: 'exportarEntregados',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.success) {
                            if (resp.url) {
                                var file_path = resp.url;
                                var a = document.createElement('A');
                                a.href = file_path;
                                a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
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
    confirmarDocumentos: function (parametros, _fn, _fnfail) {
        var me = this, msg;
        var urlController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/';
        mostrarMensaje(2, this.idioma.msgConfirmar, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(me.idioma.msgConfirmandoDocs, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: urlController + 'sincronizarDatos',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgSincronizadoDocs);
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
    anularEstado: function (parametros, _fn, _fnfail) {
        var me = this, msg;
        var urlController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/';
        mostrarMensaje(2, this.idioma.msgAnularEstado, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(me.idioma.msgAnulandoDocs, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: urlController + 'sincronizarDatos',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgSincronizadoDocs);
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
    contabilizarDocumentos: function (parametros, _fn, _fnfail) {
        var me = this, msg;
        var urlController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/';
        mostrarMensaje(2, this.idioma.msgContabilizar, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(me.idioma.msgContabilizandoDocs, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.idComprobante = -1;
                objSubmit.id = parametros.documentos;
                Ext.Ajax.request({
                    url: urlController + 'sincronizarDatos',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        var mensajeExito = this.idioma.msgSincronizadoDocs;
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.success) {
                            if (s) {
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
                                        url: '/logistica/facturacion/facturacion/comun_fact/index.php/comprobantefact/postCreateComprobanteAuto',
                                        method: 'POST',
                                        params: objSubmit,
                                        callback: function (o, s, r) {
                                            Ext.MessageBox.hide();
                                            me.st.reload();
                                        }.createDelegate(me)
                                    });
                                } else {
                                    Ext.MessageBox.hide();
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
    actualizarVentasEntregadas: function (parametros, _fn, _fnfail) {
        var me = this, msg;
        var urlController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/';
        mostrarMensaje(2, this.idioma.msgActualizarEstado, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(me.idioma.msgEstadoDocs, me.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: urlController + 'sincronizarDatos',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgSincronizadoDocs);
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

});
