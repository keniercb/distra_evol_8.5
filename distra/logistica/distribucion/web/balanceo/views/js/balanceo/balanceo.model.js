Ext.ns('LOG.dist.balanceo');

LOG.dist.balanceo.Model = Ext.extend(LOG.lb.documento.Model, {

    constructor: function (config) {
        this.urlController = '/logistica/distribucion/balanceo/index.php/balanceo';
        this.urlAdicionarPedidos = 'adicionarPedidos';
        this.urlEliminarPedidos = 'eliminarPedidos';
        this.urlAdicionarSustituto = 'adicionarSustituto';
        this.urlGuardarCantAComprar = 'guardarCantComprar';
        this.urlGuardarCantADistribuir = 'guardarCantDistribuir';
        this.urlCargarPedidosDeDoc = 'getPedidosFromDoc';
        this.urlEliminarProducto = 'eliminarProducto';
        this.urlComprarPedidos = 'comprarProductosDePedidos';
        this.urlAccionCancelar = 'cancelarDocumento';
        LOG.dist.balanceo.Model.superclass.constructor.call(this, config);
    },
    agregarPedidosDoc: function (iddocumento, idpedidos, _fn) {
        var _this = this;
        if (iddocumento && idpedidos && idpedidos.length > 0) {
            Ext.MessageBox.wait('Adicionando pedidos', 'Espere por favor');
            var objSubmit = {
                iddocumento: iddocumento,
                idpedidos: Ext.encode(idpedidos)
            };

            Ext.Ajax.request({
                url: _this.urlController + _this.urlAdicionarPedidos,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, 'Los pedidos fueron adicionado satisfactoriamente.');
                            //_this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn();
                            //_fn.createDelegate(this, [resp]).call();
                        }
                    } else if (resp.codMsg == 'ESTADO_DOC_INCORRECTO') {
                        mostrarMensaje(3, 'El documento debe encontrarse en estado de "Elaboración".');
                    } else {
                        if (typeof _fnfail == 'function') {
                            _fnfail.createDelegate(this, [resp]).call();
                        }

                    }
                }.createDelegate(this)

            });
        }
    },
    adicionarSustituto: function (iddocumento, idindicadorSustituto, idproductosbalanceo, idindicadorASustituir, _fn) {
        var _this = this;
        if (iddocumento && idindicadorSustituto && idproductosbalanceo) {
            Ext.MessageBox.wait('Adicionando sustitutos', 'Espere por favor');
            var objSubmit = {
                iddocumento: iddocumento,
                idindicadorSustituto: idindicadorSustituto,
                idindicadorASustituir: idindicadorASustituir,
                idproductosbalanceo: idproductosbalanceo
            };

            Ext.Ajax.request({
                url: _this.urlController + _this.urlAdicionarSustituto,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.codigoMsg == 1) {
                        if (s) {
                            mostrarMensaje(1, 'El sustituto fue adicionado satisfactoriamente.');
                            _this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn();
                            //_fn.createDelegate(this, [resp]).call();
                        }
                    } else if (resp.codigoMsg == 3) {
                        mostrarMensaje(3, 'El producto que desea sustituir ya existe.');
                    } else if (resp.codigoMsg == 'ESTADO_DOC_INCORRECTO') {
                        mostrarMensaje(3, 'El documento debe encontrarse en estado de "Elaboración".');
                    } else {
                        if (typeof _fnfail == 'function') {
                            _fnfail.createDelegate(this, [resp]).call();
                        }
                    }
                }.createDelegate(this)

            });
        }
    },
    sustituirProducto: function (iddocumento, idproductosbalanceo, idindicador) {
        var _this = this;
        if (idindicador) {
            mostrarMensaje(2, '¿Está seguro que desea sustituir el producto seleccionado?', function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.wait('Adicionando sustitutos', 'Espere por favor');
                    Ext.Ajax.request({
                        url: 'sustituirProducto',
                        params: {
                            idindicador: idindicador
                        },
                        method: "POST",
                        callback: function (o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            if (resp.codigoMsg == 3)
                                mostrarMensaje(3, 'El producto seleccionado no tiene sustituto.');
                            _this.adicionarSustituto(iddocumento, resp.datos[0].idsustituto, idproductosbalanceo, idindicador);
                        },
                        success: function () {

                        }
                    });
                }
            });
        }
    },
    guardarCantidadComprar: function (iddocumentobalanceo, idproductobalanceopedido, cantidad, _fn, _fnfail) {
        var _this = this;
        if (idproductobalanceopedido) {
            Ext.MessageBox.wait('Guardando cantidad', 'Espere por favor');
            var objSubmit = {
                iddocumentobalanceo: iddocumentobalanceo,
                //idproductosbalanceo: idproductosbalanceo,
                //idpatriarca: idpatriarca,
                //idpedido: idpedido,
                idproductobalanceopedido: idproductobalanceopedido,
                cantidad: cantidad
            };

            Ext.Ajax.request({
                url: _this.urlController + _this.urlGuardarCantAComprar,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                    if (resp.success) {
                        if (typeof _fn == 'function') {
                            _fn();
                            //_fn.createDelegate(this, [resp]).call();
                        }
                    } else if (resp.codMsg == 'ESTADO_DOC_INCORRECTO') {
                        mostrarMensaje(3, 'El documento debe encontrarse en estado de "Elaboración".');
                    } else {
                        if (typeof _fnfail == 'function') {
                            _fnfail();
                            //_fnfail.createDelegate(this, [resp]).call();
                        }
                    }
                }.createDelegate(this)
            })
        }
    },
    guardarCatidadDistribuir: function (iddocumentobalanceo, idproductobalanceopedido, idproducto, cantidad, cantidadVieja, _fn, _fnfail) {
        var _this = this;
        if (iddocumentobalanceo && idproductobalanceopedido && idproducto) {
            Ext.MessageBox.wait('Guardando cantidad', 'Espere por favor');
            var objSubmit = {
                iddocumentobalanceo: iddocumentobalanceo,
                idproducto: idproducto,
                idproductobalanceopedido: idproductobalanceopedido,
                cantidad: cantidad,
                cantidadVieja: cantidadVieja
            };

            Ext.Ajax.request({
                url: _this.urlController + _this.urlGuardarCantADistribuir,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                    if (resp.success) {
                        if (typeof _fn == 'function') {
                            _fn();
                        }
                    } else if (resp.codMsg == 'ESTADO_DOC_INCORRECTO') {
                        mostrarMensaje(3, 'El documento debe encontrarse en estado de "Elaboración".');
                    } else if (resp.codMsg == 'CANT_ERROR') {
                        mostrarMensaje(3, 'La cantidad no puede ser mayor que el disponible.');
                    } else {
                        if (typeof _fnfail == 'function') {
                            _fnfail();
                            //_fnfail.createDelegate(this, [resp]).call();
                        }
                    }
                }.createDelegate(this)
            })
        }
    },
    eliminarPedidos: function (iddocumento, idpedidos, _fn) {
        var _this = this;
        if (iddocumento && idpedidos && idpedidos.length > 0) {
            Ext.MessageBox.wait('Eliminando pedidos', 'Espere por favor');
            var objSubmit = {
                iddocumento: iddocumento,
                idpedidos: Ext.encode(idpedidos)
            };

            Ext.Ajax.request({
                url: _this.urlController + _this.urlEliminarPedidos,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, 'Los pedidos fueron eliminados satisfactoriamente.');
                        }
                        if (typeof _fn == 'function') {
                            _fn();
                        }
                    } else if (resp.codMsg == 'ESTADO_DOC_INCORRECTO') {
                        mostrarMensaje(3, 'El documento debe encontrarse en estado de "Elaboración".');
                    } else {
                        if (typeof _fnfail == 'function') {
                            _fnfail.createDelegate(this, [resp]).call();
                        }
                    }
                }.createDelegate(this)
            });
        }
    },
    comprarPedidos: function (iddocumento, idpedidos) {
        var _this = this;
        if (iddocumento && idpedidos && idpedidos.length > 0) {
            Ext.MessageBox.wait('Guardando cantidades compradas', 'Espere por favor');
            var objSubmit = {
                iddocumento: iddocumento,
                idpedidos: Ext.encode(idpedidos)
            };

            Ext.Ajax.request({
                url: _this.urlController + _this.urlComprarPedidos,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, 'Las cantidades a comprar de los pedidos fueron guardadas satisfactoriamente.');
                        }
                        if (typeof _fn == 'function') {
                            _fn();
                        }
                    } else if (resp.codMsg == 'ESTADO_DOC_INCORRECTO') {
                        mostrarMensaje(3, 'El documento debe encontrarse en estado de "Elaboración".');
                    } else if (resp.codMsg == 'PRODS_DISTRIBUIDOS') {
                        let msg = "El pedido seleccionado tiene productos distribuidos.";
                        if (idpedidos.length > 1) {
                            msg = "Alguno de los pedidos seleccionados tienen productos distribuidos."
                        }
                        mostrarMensaje(3, msg);
                    } else {
                        if (typeof _fnfail == 'function') {
                            _fnfail.createDelegate(this, [resp]).call();
                        }

                    }
                }.createDelegate(this)
            });
        }
    },
    cargarPedidosDeDocumento: function (iddocumento, _fn) {
        var _this = this;
        if (iddocumento) {
            var objSubmit = {
                iddocumento: iddocumento
            };

            // Esto es una Promesa, una manera de evitar "callback hell"
            return new Promise(function (fullfill, reject) {
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlCargarPedidosDeDoc,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (resp.datos && resp.datos.length > 0) {
                                fullfill(resp.datos);
                            }
                        } else {
                            reject(resp.error);
                        }
                    }
                });
            })


        }
    },
    eliminarProducto: function (iddocumento, idproductosbalanceo, _fn) {
        var _this = this;

        var objSubmit = {
            iddocumento: iddocumento,
            idproductosbalanceo: idproductosbalanceo
        };

        Ext.Ajax.request({
            url: _this.urlController + _this.urlEliminarProducto,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, 'El producto fue eliminado satisfactoriamente.');
                    }
                    if (typeof _fn == 'function') {
                        _fn();
                    }
                } else if (resp.codMsg == 'ESTADO_DOC_INCORRECTO') {
                    mostrarMensaje(3, 'El documento debe encontrarse en estado de "Elaboración".');
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });

    },
    cancelar: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgCancelarDocumento, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgCancelandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionCancelar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgDocumentoCancelado);
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
    }

});