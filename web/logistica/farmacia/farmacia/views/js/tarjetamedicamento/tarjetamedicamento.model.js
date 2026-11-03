Ext.ns('LOG.farm.tarjetamedicamento');
LOG.farm.tarjetamedicamento.Model = Ext.extend(LOG.lb.documento.Model, {
    gridEditado: false,
    constructor: function (config) {
        config.urlController = '/logistica/farmacia/farmacia/index.php/tarjetamedicamento/';
        config.urlAccionGuardar = 'adicionarTarjetas';
        config.urlAccionAprobar = 'aprobarTarjetas';
        config.urlAccionEliminar = 'eliminarTarjetas';
        this.urlAccionConfirmar = 'confirmarDocumento';
        this.urlAccionAnularEstado = 'anularEstadoDocumento';
        this.urlAccionAprobar = 'aprobarEstadoDocumento';
        this.urlAccionAnular = 'anularDocumento';
        this.urlAccionDuplicar = 'copiarDocumento';
        this.urlAccionFirmar = 'firmarDocumento';
        this.urlAccionSalvarMovimientos = 'adicionarMovimientos';
        this.urlAccionEliminarMovimiento = 'eliminarMovimientos';
        this.urlAccionExpirar = 'expirar';
        this.urlAccionEliminarProducto = 'eliminarProductosTarjeta';

        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'retrovirales'
        });
        config.fields.push({
            name: 'idtarjetamedicamento'
        });
        config.fields.push({
            name: 'nrocasoindice'
        });
        config.fields.push({
            name: 'numeroidentidad'
        });
        config.fields.push({
            name: 'nrotarjeta'
        });
		config.fields.push({
            name: 'nombre'
        });
        config.fields.push({
            name: 'snombre'
        });
        config.fields.push({
            name: 'papel'
        });
        config.fields.push({
            name: 'sapel'
        });
        config.fields.push({
            name: 'consultoriomedico'
        });
        config.fields.push({
            name: 'area'
        });
        config.fields.push({
            name: 'direccion'
        });
        config.fields.push({
            name: 'idpais'
        });
        config.fields.push({
            name: 'idprovincia'
        });
        config.fields.push({
            name: 'idmunicipio'
        });
        config.fields.push({
            name: 'idpaciente'
        });
        config.fields.push({
            name: 'idventacliente'
        });

        LOG.farm.tarjetamedicamento.Model.superclass.constructor.call(this, config);
        this.urlAccionAprobar = 'aprobarTarjetas';
        this.urlAccionConfirmar = 'confirmarTarjetas';
        this.urlAccionAnularEstado = 'anularEstadoTarjetas';
        this.urlAccionGuardar = 'adicionarTarjetas';
        this.urlAccionEliminar = 'eliminarTarjetas';
        this.urlAccionAdicionarProductos = 'adicionarProductosTarjeta';
    },
    eliminarProducto: function (parametros, _fn, loadStore) {
        var _this = this;
        //Pedir confirmacion desde la vista.
        Ext.MessageBox.wait(this.idioma.msgEliminandoProducto, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: _this.urlController + _this.urlAccionEliminarProducto,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.msgProductoEliminado);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });
    },
    adicionarProductos: function (parametros, _fn, loadStore) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgAdicionandoProducto, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: _this.urlController + 'adicionarProductosTarjeta',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.msgProductoAdicionado);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });

    },
    guardarEntrega: function (parametros, _fn, loadStore) {
        var _this = this;

        Ext.MessageBox.wait(this.idioma.msgAdicionandoProducto, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: _this.urlController + 'adicionarEntregaProducto',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.msgProductoAdicionado);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });

    },
    eliminarEntregaProducto: function (parametros, _fn, loadStore) {
        var _this = this;
        //Pedir confirmacion desde la vista.
        Ext.MessageBox.wait(this.idioma.msgEliminandoEntregaProducto, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: _this.urlController + 'eliminarEntregaProducto',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.msgEntregaProductoEliminado);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });
    },
    isValid: function () {
        if (this[this.primaryKeyField]) {
            return this.basicForm.isValid() && (this.basicForm.isDirty() || this.gridEditado);
        } else {
            return this.basicForm.isValid();
        }
    },
    aprobarProducto: function (parametros, _fn) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgAprobarProducto, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAprobandoProducto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = Ext.encode([objSubmit.idproducto]);
                Ext.Ajax.request({
                    url: _this.urlController + "aprobarProducto",
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgProductoAprobado);
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
    getPaciente: function (parametros, _fn) {
        var _this = this;

        Ext.MessageBox.wait("Buscando datos del paciente", _this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: _this.urlController + "getPaciente",
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.length > 0) {
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
                else {
                    var consepto = "el concepto de b\xfasqueda especificado ";
                    if (parametros.nrocaso) {
                        consepto = " Nro. caso \xedndice \x27" + parametros.nrocaso + "\x27";
                    }
                    else if (parametros.numid) {
                        consepto = " CI \x27" + parametros.numid + "\x27";
                    }

                    mostrarMensaje(1, 'No se encontr\xf3 alg\xfan paciente con ' + consepto);
                }
            }.createDelegate(this)

        });

    },
    renovarProducto: function (parametros, _fn, loadStore) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgRenovarProducto, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgRenovandoProducto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: _this.urlController + 'renovarProductoTarjeta',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        _this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgProductoRenovado);
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
    cambioTratamientos: function (parametros, _fn, loadStore) {
        var _this = this;


        mostrarMensaje(2, this.idioma.msgCambiarTratamiento, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgCambiandoTratamiento, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: _this.urlController + 'cambioTratamiento',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgTratamientoCambiado);
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

    ,
    expirar: function (parametros, _fn, loadStore) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgExpirarTratamiento, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgExpirandoTratamiento, _this.idioma.msgEspere || '...');

                Ext.MessageBox.wait('expirando...', '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionExpirar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgTratamientoExpirado);
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