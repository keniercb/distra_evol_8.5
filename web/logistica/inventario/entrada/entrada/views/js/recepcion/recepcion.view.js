Ext.ns('LOG.inv.entrada.recepcion');
LOG.inv.entrada.recepcion.View = Ext.extend(LOG.lb.documento.View, {
    name: 'Recepcion',
    cantSign: 4,
    signDetails: {
        1: 'Recepcionado por',
        2: 'Revisado por',
        3: 'Contabilizado por',
        4: 'Transportado por'
    },
   
    dirReport: '/logistica/inventario/entrada/recepcion/',
    //dirReport: '/logistica/farmacia/entrada/recepcion/',
    /**
     * @param {Object} config
     */
    constructor: function (config) {
        this.concepto = config.idioma.ttBtnBuscar;
        this.busquedaBasica = true;
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        this.subsistema = LOG.util.Subsistemas.inventario;
        config.model = config.model || new LOG.inv.entrada.recepcion.Model({});
        LOG.inv.entrada.recepcion.View.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa los componentes.
     * @returns {undefined}
     */
    init: function () {
        LOG.inv.entrada.recepcion.View.superclass.init.call(this);
        this.panelSuperior();
        this.initPanelImporte();
        if (alternativa) {
            this.initPanelMonedas();
        }

    },   

    /**
     * @param {type} _fn
     * @returns {undefined}
     */
    cargaInicial: function (_fn) {
        var _this = this;
        this.modelo.cargaInicial({
            url: '/logistica/inventario/entrada/entrada/index.php/recepcion/cargaInicial'
        }, function (r) {
            _fn.createDelegate(_this, [r]).call();
            _this.datosIniciales(r);
            _this.depositos = r[0].depositos || new Array();
        }, this.idioma.msgCargaInicial);
    },
    /**
     * Prepara los datos de la carga inicial.
     * @param {Array} r Arreglo con los datos iniciales del proceso.
     * @returns {undefined}
     */
    datosIniciales: function (r) {
        var _this = this;
        _this.porfactura = r[0].porfactura == '1' ? true : false;
        LOG.util.UIManager.apply(_this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'cantfactura'), {
            hidden: !_this.porfactura
        });
        LOG.util.UIManager.apply(_this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'saldofactura'), {
            hidden: !_this.porfactura
        });
        if (alternativa) {
            this.recargoContable.fieldLabel = _this.idioma.lbNfRecargo + ' ' + codContable;
            this.descuentoContable.fieldLabel = _this.idioma.lbNfDescuento + ' ' + codContable;
            this.recargoAlternativo.fieldLabel = _this.idioma.lbNfRecargo + ' ' + codAlternativa;
            this.descuentoAlternativo.fieldLabel = _this.idioma.lbNfDescuento + ' ' + codAlternativa;
        }
        Ext.apply(this.winGestionarDocumento, {
            beforeEditProducto: function (o) {
                var record = _this.winGestionarDocumento.record;
                if (record && record.data.estado != '1' && record.data.estado != '13') {
                    o.cancel = true;
                    return false;
                }

                if ((o.field == 'precioalternativo' || o.field == 'preciocontable') &&(registrarimporte != undefined && registrarimporte == true))  {
                    o.cancel = true;
                    return false;
                }
                if (o.field == 'cantidad') {
                    if ((o.record.json.equipo == 1 || o.record.json.municion == 1 || o.record.json.tienelote == 1)
                        || o.record.json.estado != '1') {
                        o.cancel = true;
                    }
                }
                if (o.field == 'minimo' || o.field == 'maximo' || o.field == 'nomcategoria') {
                    if (parseInt(o.record.json.cronologia) > 0) {
                        o.cancel = true;
                    }
                }
                if (o.field == 'cantfactura') {
                    if (_this.porfactura && o.record.json.estado != "1") {
                        o.cancel = true;
                    } else {
                        if (o.record.json.decimales == "0") {
                            o.grid.getColumnModel().setEditor(o.column, LOG.util.Prototipos.inputEntero({}));
                        } else {
                            o.grid.getColumnModel().setEditor(o.column, LOG.util.Prototipos.inputDecimal({}));
                        }
                    }
                }
                if (o.field == 'existenciaalmacen') {
                    if (o.record.json.estado == '1') {
                        if (o.record.json.decimales == "0") {
                            o.grid.getColumnModel().setEditor(o.column, LOG.util.Prototipos.inputEntero({}));
                        } else {
                            o.grid.getColumnModel().setEditor(o.column, LOG.util.Prototipos.inputDecimal({}));
                        }
                    } else {
                        o.cancel = true;
                    }
                }
                if ((o.field == 'idclasificacioncontable' || o.field == 'umedida'  || o.field == 'numerolote' || o.field == 'fechavencelote') && o.record.json.cronologia > 0) {
                    o.cancel = true;
                }
            }
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        LOG.inv.entrada.recepcion.View.superclass.initDefaultButtons.call(this);
        // Bloque de botones de la interfaz principal.
        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(0), 'handler', function () {
            _this.habilitarElementos();
        }, 'recepAdd');
        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(1), 'handler', function () {
            _this.habilitarElementos();
            LOG.util.UIManager.apply(_this.winGestionarDocumento.record.data, _this.getSmPrincipal().getSelected().data);
        }, 'recepVer');
        Ext.apply(this.listaBotones.getItem(2), {
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && (this.getSelected().data.estado == '1' || this.getSelected().data.estado == '13')) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'eliminar');
                } else {
                    b.hide();
                }
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(4), {id: 'idRecepcion'});
        this.insertToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            isContextual: true,
            disabled: true,
            handler: function () {

                if (_this.getSmPrincipal().getSelected().data.estado == '1') {
                    _this.modelo.confirmar({porfactura: _this.porfactura ? true : null});

                } else {
                    _this.modelo.contar({porfactura: _this.porfactura ? true : null});
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar') || _caller.grantedAction('RContar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && ((this.getSelected().data.estado == '1'
                                && (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')))
                                || (this.getSelected().data.estado == '13' && (_caller.grantedAction('CT') || _caller.grantedAction('RContar'))))) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'confirmar1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 3);
        this.insertToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnularEstado,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado({estado: _this.getSmPrincipal().getSelected().data.estado});
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado') || _caller.grantedAction('RAnularcontar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && ((this.getSelected().data.estado == '2'
                                && (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')))
                                || (_this.porfactura && this.getSelected().data.estado == '1' && (_caller.grantedAction('CT')
                                    || _caller.grantedAction('RAnularcontar'))))) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'anularEstado1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 4);
        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'anulardocumento',
            text: this.idioma.lbBtnAnularDocumento,
            tooltip: this.idioma.ttBtnAnularDocumento,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.anular();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RAnular')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '4') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'anularDoc1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 5);
        this.insertToolbarButton(LOG.util.Prototipos.botonContabilizar({
            tooltip: this.idioma.ttBtnContabilizar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.contabilizar({
                    idestructuracomun: _this.idDeposito
                }, function (o, s, r) {
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RContabilizar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '2'
                                && ((window.useSign && typeof pki == 'object') ? (this.getSelected().get('controlfirma') == 2) : true)) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'contabilizar1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 6);
        this.insertToolbarButton(LOG.util.Prototipos.botonDuplicar({
            tooltip: this.idioma.ttBtnDuplicar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.duplicar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'duplicar1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 7);
        this.insertToolbarButton(this.__comprobante.btnGenerar, 8);
        // Fin del bloque.
        // Bloque de botones del panel superior de la ventana adicionar.
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarDoc,
            fn: function () {
                _this.modelo.eliminar({id: _this.modelo.iddocumento}, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && (_this.winGestionarDocumento.record.data.estado == '1'
                        || _this.winGestionarDocumento.record.data.estado == '13')) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(1), {
            tooltip: this.idioma.ttBtnConfirmar,
            fn: function () {

                if (_this.winGestionarDocumento.record.data.estado == '1') {

                    _this.modelo.confirmar({
                        id: _this.modelo.iddocumento,
                        iddocumento: _this.modelo.iddocumento,
                        porfactura: _this.porfactura ? true : null
                    }, function (r) {
                        _this.winGestionarDocumento.cargarProductos();
                        Ext.apply(_this.winGestionarDocumento.record.data, {estado: '2'});
                        _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                            }
                        }, _this.winGestionarDocumento);
                        _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                        _this.habilitarElementos();
                        _this.modelo.habilitarBotones(true);
                        if (alternativa) {
                            _this.monedas.listaBotones.each(function (b) {
                                if (typeof b.controlFn == 'function') {
                                    b.controlFn.createDelegate(this, [b, this]).call();
                                }
                            }.createDelegate(_this.monedas));
                        }
                        _this.winGestionarDocumento.doLayout();
                    });
                } else {
                    _this.modelo.contar({
                        id: _this.modelo.iddocumento,
                        iddocumento: _this.modelo.iddocumento,
                        porfactura: _this.porfactura ? true : null
                    }, function (r) {
                        _this.winGestionarDocumento.cargarProductos();
                        Ext.apply(_this.winGestionarDocumento.record.data, {estado: '1'});
                        _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                            }
                        }, _this.winGestionarDocumento);
                        _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                        _this.habilitarElementos();
                        _this.modelo.habilitarBotones(true);
                        if (alternativa) {
                            _this.monedas.listaBotones.each(function (b) {
                                if (typeof b.controlFn == 'function') {
                                    b.controlFn.createDelegate(this, [b, this]).call();
                                }
                            }.createDelegate(_this.monedas));
                        }
                        _this.winGestionarDocumento.doLayout();
                    });
                }
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar') || _this.grantedAction('RContar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && ((_this.winGestionarDocumento.record.data.estado == '1' && (_this.grantedAction('CT')
                        || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')))
                        || (_this.porfactura && _this.winGestionarDocumento.record.data.estado == '13'
                            && (_this.grantedAction('CT') || _this.grantedAction('RContar'))))) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(2), {
            tooltip: this.idioma.ttBtnAnularEstado,
            fn: function () {
                _this.modelo.anularestado({
                    id: _this.modelo.iddocumento,
                    estado: _this.winGestionarDocumento.record.data.estado
                }, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    Ext.apply(_this.winGestionarDocumento.record.data, {
                        estado: (_this.winGestionarDocumento.record.data.estado == '1' ? '13' : '1')
                    });
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos();
                    _this.modelo.habilitarBotones(true);
                    if (alternativa) {
                        _this.monedas.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(_this.monedas));
                    }
                    _this.winGestionarDocumento.doLayout();
                });
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado') || _this.grantedAction('RAnularcontar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && ((_this.winGestionarDocumento.record.data.estado == '2'
                        && (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado')))
                        || (_this.porfactura && _this.winGestionarDocumento.record.data.estado == '1'
                            && (_this.grantedAction('CT') || _this.grantedAction('RAnularcontar'))))
                    ) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(3), LOG.util.Prototipos.botonContabilizar({
            tooltip: this.idioma.ttBtnContabilizar,
            handler: function () {
                _this.modelo.contabilizar({
                    id: _this.modelo.iddocumento,
                    idestructuracomun: _this.idDeposito
                }, function (o, s, r) {
                    _this.winGestionarDocumento.cargarProductos();
                    Ext.apply(_this.winGestionarDocumento.record.data, {estado: '4'});
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos();
                });
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RContabilizar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2'
                        && ((window.useSign && typeof pki == 'object') ? (_this.winGestionarDocumento.record.data.controlfirma == 2) : true)) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }), 5);
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), {
            tooltip: this.idioma.ttBtnDuplicar,
            fn: function () {
                _this.modelo.duplicar({
                    id: _this.modelo.iddocumento
                }, function (r) {
                    Ext.apply(_this.winGestionarDocumento.record.data, {
                        iddocumento: r.datos['iddocumento'],
                        estado: 1,/*_this.porfactura ? "13" : "1",*/
                        importecontable: 0,
                        importealternativo: 0,
                        observaciones: r.datos['observaciones']
                    });
                    Ext.apply(_this.modelo, _this.winGestionarDocumento.record.data);
                    _this.winGestionarDocumento.cargarProductos();
                    _this.winGestionarDocumento.fromularioGestion.getForm().loadRecord(_this.winGestionarDocumento.record);
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    if (_this.monedas) {
                        _this.monedas.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(_this.monedas));
                    }
                    _this.winGestionarDocumento.getTitleDocumento(r.datos['iddocumento']);
                    _this.habilitarElementos();
                });
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RContar') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.insertToolbarButtonVentana(LOG.util.UIManager.createBtn({
            iconCls: 'anulardocumento',
            text: this.idioma.lbBtnAnularDocumento,
            tooltip: this.idioma.ttBtnAnularDocumento,
            handler: function () {
                _this.modelo.anular({
                    id: _this.modelo.iddocumento
                }, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAnular')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '4') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }), 4);
        // Fin del bloque.

        // Bloque botones del panel productos de la ventana adicionar.
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesProductos.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarProd,
            disabled: true,
            handler: _this.handlerEliminarMov,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && _this.winGestionarDocumento.record &&
                                (_this.winGestionarDocumento.record.data.estado == '1' || _this.winGestionarDocumento.record.data.estado == '13')) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'eliminarProd');
                } else {
                    b.setVisible(false);
                }
            }
        });
        var btnProductos = LOG.util.UIManager.createBtn({
            btnProd: true,
            iconCls: 'producto',
            text: this.idioma.lbBtnProductos,
            tooltip: this.idioma.ttBtnProductos,
            handler: function () {
                var winProductos = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    parametros: {
                        idestructura: _this.idDeposito,
                        iddocumento: _this.modelo.iddocumento,
                        asentado : -1,
                        entrada: 1
                    },
                    doAction: function (r) {
                        var _t = this;
                        if (_this.winGestionarDocumento != undefined) {
                            var _productos = new Array();
                            Ext.each(r, function (rec) {
                                _productos.push(rec.get('idproducto'));
                            });

                            if (_this.modelo.iddocumento == null) {
                                _this.modelo.salvar({
                                    idestructuracomun: _this.idDeposito,
                                    idproductos: Ext.encode(_productos)
                                }, function (resp) {
                                    _t.postSalvar.createDelegate(_this.winGestionarDocumento, [resp]).call();
                                });
                            } else {
                                _this.modelo.adicionarMovimientos({
                                    idproductos: Ext.encode(_productos)
                                }, function (resp) {
                                    _t.postSalvar.createDelegate(_this.winGestionarDocumento, [resp]).call();
                                });
                            }
                        }
                    },
                    postSalvar: function (r) {
                        _this.winGestionarDocumento.cargarProductos();
                        if (_this.winGestionarDocumento.record == null) {
                            _this.winGestionarDocumento.record = {};
                            Ext.apply(_this.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: 1,/*_this.porfactura ? "13" : "1",*/
                                    cantproductos: r.cantproductos,
                                    idpadre: r.idpadre
                                }
                            });
                        } else {
                            _this.winGestionarDocumento.record.data.cantproductos = r.cantproductos;
                        }
                        _this.winGestionarDocumento.getTitleDocumento(_this.winGestionarDocumento.record.data.iddocumento);
                        _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                            }
                        }, _this.winGestionarDocumento);
                        winProductos.getStorePrincipal().reload({params: {iddocumento: r.iddocumento}});
                        _this.winGestionarDocumento.modelo.getStore().reload();
                        _this.habilitarElementos();
                    }
                });
                winProductos.init();
                _this.vistaProductos = winProductos.view();
                _this.vistaProductos.show();
            },
            fnEspecialCondition: function () {
                /*if ((!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record &&
                    (_this.porfactura && _this.winGestionarDocumento.record.data.estado == '13') ||
                    (!_this.porfactura && _this.winGestionarDocumento.record.data.estado == '1'))) &&
                    (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) {
                    return false;
                }*/
                
                if ((!_this.winGestionarDocumento.record || _this.winGestionarDocumento.record.data.estado == '1') &&
                    (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) {
                    return false;
                }
                return true;
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.insertToolbarButtonProductos(btnProductos, 0);
        this.modelo.addActionButton(btnProductos, true);
        var btnTarjeta = LOG.util.UIManager.createBtn({
            btnTarg: true,
            iconCls: 'adicionar',
            text: this.idioma.lbBtnCrearTarjeta,
            tooltip: this.idioma.ttBtnCrearTarjeta,
            handler: function () {
                var winCrearTarjeta = new LOG.lb.producto.Tarjeta({
                    idioma: _this.idioma,
                    _parent: _this,
                    idestructura: _this.idDeposito,
                    postSalvar: function (r) {
                        _this.winGestionarDocumento.cargarProductos();
                        if (_this.winGestionarDocumento.record == null) {
                            _this.winGestionarDocumento.record = {};
                            Ext.apply(_this.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: 1,/*_this.porfactura ? "13" : "1",*/
                                    cantproductos: r.cantproductos,
                                    idpadre: r.idpadre
                                }
                            });
                        }
                        _this.winGestionarDocumento.getTitleDocumento(r.iddocumento);
                        _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                            }
                        }, _this.winGestionarDocumento);
                    }
                });
                winCrearTarjeta.show();
                winCrearTarjeta.nomClasificacioncontablelog.stCombo.setBaseParam('cargarSinEntidad', 1)
                delete winCrearTarjeta.nomClasificacioncontablelog.stCombo.baseParams.bussines;
            },
            fnEspecialCondition: function () {
                
                /* if ((!_this.winGestionarDocumento.record ||
                     (_this.winGestionarDocumento.record && (_this.porfactura && _this.winGestionarDocumento.record.data.estado == '13') ||
                     (!_this.porfactura && _this.winGestionarDocumento.record.data.estado == '1'))) &&
                     (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) */
                if ((!_this.winGestionarDocumento.record || _this.winGestionarDocumento.record.data.estado == '1') &&
                    (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) {
                    return false;
                }
                return true;
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.insertToolbarButtonProductos(btnTarjeta, 1);
        this.modelo.addActionButton(btnTarjeta, true);
        var btn711 = LOG.util.UIManager.createBtn({
            btnTarg: true,
            iconCls: 'adicionar',
            text: 'Productos del 711',
            tooltip: 'Seleccionar productos del 711',
            handler: function () {
                var win711 = new LOG.lb.producto.Tarjeta711({
                    idioma: _this.idioma,
                    _parent: _this,
                    idestructura: _this.idDeposito,
                    postSalvar: function (r) {
                        _this.winGestionarDocumento.cargarProductos();
                        if (_this.winGestionarDocumento.record == null) {
                            _this.winGestionarDocumento.record = {};
                            Ext.apply(_this.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: 1,/*_this.porfactura ? "13" : "1",*/
                                    cantproductos: r.cantproductos,
                                    idpadre: r.idpadre
                                }
                            });
                        }
                        _this.winGestionarDocumento.getTitleDocumento(r.iddocumento);
                        _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                            }
                        }, _this.winGestionarDocumento);
                    },
                    doAction: function(r) {
                        var _t = this;
                        var params = {
                            idestructura: this._parent.idDeposito, iddocumento: this._parent.modelo.iddocumento, plan711: 1
                        };
                        if (r.length > 0) {
                            params.arridindicador = new Array();
                            Ext.each(r, function(rec) {
                                rec.data.idestructura = params.idestructura;
                                rec.data.iddocumento = params.iddocumento;
                                params.arridindicador.push(rec.data);
                            });
                            params.arridindicador = Ext.encode(params.arridindicador);
                        }
                        if (params.iddocumento) {
                            this._parent.modelo.salvarProd711({
                                idestructuracomun: this._parent.idDeposito,
                                arridindicador: params.arridindicador,
                                plan711: 1
                            }, function(r) {
                                _t.postSalvar.createDelegate(_this, [r]).call();
                                _t.modelo.reset();
                            });
                        } else {
                            this._parent.modelo.salvar({
                                idestructuracomun: this._parent.idDeposito,
                                arridindicador: params.arridindicador,
                                plan711: 1
                            }, function(r) {
                                _t.postSalvar.createDelegate(_this, [r]).call();
                                _t.modelo.reset();
                            });
                        }
                    },
                });
                win711.show();
            },
            fnEspecialCondition: function () {
                /* if ((!_this.winGestionarDocumento.record ||
                     (_this.winGestionarDocumento.record && (_this.porfactura && _this.winGestionarDocumento.record.data.estado == '13') ||
                     (!_this.porfactura && _this.winGestionarDocumento.record.data.estado == '1'))) &&
                     (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) */
                if ((!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record ||
                    (!_this.porfactura && _this.winGestionarDocumento.record.data.estado == '1'))) &&
                    (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) {
                    return false;
                }
                return true;
            },
            controlFn: function (b) {
                if (_this.grantedAction('RPLAN711')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.insertToolbarButtonProductos(btn711, 2);
        this.modelo.addActionButton(btn711, true);
        var btnImportarProductos = LOG.util.UIManager.createBtn({
            iconCls: 'importar',
            text: 'Importar productos',
            tooltip: 'Importar productos desde un fichero excel',
            handler: function () {
                var win = new LOG.lb.importar.View({
                    class: 'RecepcionModel',
                    params: {
                        idestructuracomun: _this.idDeposito,
                        iddocumento: _this.modelo.iddocumento || null,
                        data: Ext.encode(_this.modelo.encode())
                    },
                    fn: function (r) {
                        if (_this.winGestionarDocumento.record == null) {
                            _this.winGestionarDocumento.record = {};
                            Ext.apply(_this.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: 1,/*_this.porfactura ? "13" : "1",*/
                                    cantproductos: r.cantproductos,
                                    idpadre: r.idpadre
                                }
                            });
                        }
                        _this.modelo[_this.modelo.primaryKeyField] = r.iddocumento
                        _this.winGestionarDocumento.cargarProductos();
                        _this.winGestionarDocumento.getTitleDocumento(r.iddocumento);
                        _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                            }
                        }, _this.winGestionarDocumento);
                        _this.getStorePrincipal().load();
                        if (r.productoserror/*|| parseInt(r.total) > parseInt(r.cantidad*/) {
                            var win = new LOG.inv.entrada.recepcion.Error({ idioma: _this.idioma, iddocumento: r.iddocumento});
                            win.init();
                            win.view();
                        }

                    }
                });
                win.show();
            },
            fnEspecialCondition: function () {

                /* if ((!_this.winGestionarDocumento.record ||
                     (_this.winGestionarDocumento.record && (_this.porfactura && _this.winGestionarDocumento.record.data.estado == '13') ||
                     (!_this.porfactura && _this.winGestionarDocumento.record.data.estado == '1'))) &&
                     (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) */
                if ((!_this.winGestionarDocumento.record || _this.winGestionarDocumento.record.data.estado == '1') &&
                    (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) {
                    return false;
                }
                return true;
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.insertToolbarButtonProductos(btnImportarProductos, 3);
        this.modelo.addActionButton(btnImportarProductos, true);
        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'ubicarproducto',
            text: this.idioma.lbBtnUbicar,
            tooltip: this.idioma.ttBtnUbicar,
            disabled: true,
            handler: function () {
                LOG.inv.ubicacion.Loader.init(function () {
                    var winUbicar = new LOG.lb.ubicacion.winUbicar({
                        st: _this.winGestionarDocumento.stGridDetalles,
                        datos: _this.winGestionarDocumento.smGridDetalles,
                        iddeposito: _this.idDeposito,
                        vista: _this,
                        idindicador: _this.winGestionarDocumento.smGridDetalles.getSelected().json.idindicador,
                        confubicacion: _this.winGestionarDocumento.confubicacion,
                        nomDeposito: _this.nomDeposito,
                        proceso: true,
                        idmovimiento: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idmovimiento
                    });
                    winUbicar.show();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && _this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1'
                                && this.getSelected().json.tienelote != 1 && this.getSelected().json.equipo != 1 && this.getSelected().json.municion != 1
                                && parseFloat(this.getSelected().data.cantidad) > 0 && _this.winGestionarDocumento.record.data.estado == '1') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'ubicar');
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'lote',
            text: this.idioma.lbBtnLote,
            tooltip: this.idioma.ttBtnLote,
            disabled: true,
            handler: function () {
                var selected = _this.winGestionarDocumento.smGridDetalles.getSelected()
                LOG.lb.lote.Loader.init(function () {
                    var winLote = new LOG.lb.lote.Ventana({
                        sm: _this.winGestionarDocumento.smGridDetalles,
                        iddeposito: _this.idDeposito,
                        ubicacion: true,
                        usaMonedas: true,
                        compraVenta: 2,
                        region: 'center',
                        modal: true,
                        width: 950,
                        height: 500,
                        title: _this.idioma.tlVentanaLote,
                        confubicacion: confubicacion,
                        fecha: fecha,
                        listeners: {
                            close: function () {
                                _this.winGestionarDocumento.stGridDetalles.reload();
                                //add to db
                            }

                        },

                        grantedAction: function (_p) {
                            return (_this.grantedAction(_p) && _this.winGestionarDocumento.record.data.estado == '1');
                        },
                        cerrarFn: function () {

                        },
                        parametros: {
                            iddocumento: _this.modelo.iddocumento,
                            idproducto: (selected) ? selected.json.idproducto : null
                        }

                    });

                    //winLote.init();

                    winLote.show();
                });
                /*if (this.winLote == undefined) {
                 LOG.lb.lote.Loader.init(function () {
                 this.winLote = new LOG.lb.lote.View({
                 sm: _this.winGestionarDocumento.smGridDetalles,
                 iddeposito: _this.idDeposito,
                 ubicacion: true,
                 usaMonedas: true,
                 compraVenta: 2,
                 confubicacion: confubicacion,
                 fecha: fecha,
                 grantedAction: function (_p) {
                 return (_this.grantedAction(_p) && _this.winGestionarDocumento.record.data.estado == '1');
                 },
                 cerrarFn: function () {
                 _this.winGestionarDocumento.stGridDetalles.reload();
                 },
                 parametros : {
                 iddocumento : _this.modelo.iddocumento
                 }
                 });
                 this.winLote.init();
                 this.winLote.view();
                 });
                 } else {
                 this.winLote.view();
                 }*/
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().json.tienelote == 1
                                && _this.winGestionarDocumento.record.data.estado != '13') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'lote');
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'numeroserie',
            text: this.idioma.lbBtnNoSerie,
            tooltip: this.idioma.ttBtnNoSerie,
            disabled: true,
            handler: function () {
                LOG.lb.numeroserie.Loader.init(function () {
                    var winNroSerie = new LOG.lb.numeroserie.Entrada({
                        idestructura: _this.idDeposito,
                        producto: _this.winGestionarDocumento.smGridDetalles.getSelected().data,
                        documento: _this.winGestionarDocumento.record.data,
                        confubicacion: confubicacion,
                        fecha: fecha,
                        cerrarFn: function () {
                            _this.winGestionarDocumento.stGridDetalles.reload();
                        }
                    });
                    winNroSerie.init();
                    winNroSerie.view();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && this.getSelected().json.equipo == 1
                                    && _this.winGestionarDocumento.record.data.estado != '13') {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'nroserie');
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
        if (cmpArmamento == true) {
            this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
                iconCls: 'partida',
                text: this.idioma.lbBtnMuniciones,
                tooltip: this.idioma.ttBtnMuniciones,
                disabled: true,
                handler: function () {
                    var municiones = new LOG.inv.municiones.View({
                        idestructura: _this.idDeposito,
                        producto: _this.winGestionarDocumento.smGridDetalles.getSelected().data,
                        documento: _this.winGestionarDocumento.record.data,
                        confubicacion: confubicacion,
                        fecha: fecha,
                        desglose: false,
                        grantedAction: function (_p) {
                            return _this.grantedAction(_p);
                        },
                        cerrarFn: function () {
                            if (_this.winGestionarDocumento.record.data.estado == '1') {
                                _this.winGestionarDocumento.stGridDetalles.reload();
                            }
                        }
                    });
                    municiones.show();
                },
                controlFn: function (b, _caller) {
                    if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                        b.setVisible(true);
                        if (_this.winGestionarDocumento.tipoVentana == 3) {
                            b.hide();
                        } else {
                            b.show();
                            LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                                if (e == 'selectionchange') {
                                    if (this.getCount() == 1 && this.getSelected().json.municion == 1
                                        && _this.winGestionarDocumento.record.data.estado != '13') {
                                        b.enable();
                                    } else {
                                        b.disable();
                                    }
                                }
                            }, 'municion');
                        }
                    } else {
                        b.setVisible(false);
                    }
                }
            }));
        }
        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: this.idioma.lbBtnRegDiferencia,
            tooltip: this.idioma.ttBtnRegDiferencia,
            disabled: true,
            handler: function () {
                var winRegistrarDiferencia = new LOG.inv.entrada.registrarDiferencia.View({
                    idmovimiento: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idmovimiento,
                    idestructuracomun: _this.idDeposito,
                    porfactura: _this.winGestionarDocumento.smGridDetalles.getSelected().json.porfactura,
                    alternativa: alternativa,
                    codContable: codContable,
                    codAlternativa: codAlternativa,
                    grantedAction: function (_p) {
                        return (_this.grantedAction(_p) && _this.winGestionarDocumento.record.data.estado == '1');
                    }
                });
                winRegistrarDiferencia.show();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && _this.winGestionarDocumento.record.data.estado == '1') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'diferencia');
                } else {
                    b.setVisible(false);
                }
            }
        }));
        if (alternativa) {
            this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
                iconCls: 'deposito',
                text: this.idioma.lbBtnMonedas,
                tooltip: this.idioma.ttBtnMonedas,
                disabled: true,
                handler: function () {
                    if (_this.formularioSur.collapsed) {
                        _this.monedas.getStorePrincipal().load();
                        _this.formularioSur.show();
                        _this.formularioSur.expand();
                        _this.winGestionarDocumento.doLayout();
                    }
                },
                controlFn: function (b, _caller) {
                    if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'monedas');
                    } else {
                        b.hide();
                    }
                }
            }));
        }
        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnCalcularUM,
            tooltip: this.idioma.ttBtnCalcularUM,
            iconCls: 'unidadmedida',
            disabled: true,
            handler: function () {
                var win = new LOG.inv.entrada.CalcularUM({
                    idioma: _this.idioma,
                    idmovimiento: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idmovimiento,
                    idproducto: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idproducto,
                    idindicador: _this.winGestionarDocumento.smGridDetalles.getSelected().json.idindicador,
                    idunidadmedida: _this.winGestionarDocumento.smGridDetalles.getSelected().json.idunidadmedida,
                    postSalvar: function () {
                        _this.winGestionarDocumento.stGridDetalles.reload();
                    }
                });
                win.show();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && _this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'convertirUM');
                } else {
                    b.hide();
                }
            }
        }));

//        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
//            text: 'Desglose',
//            tooltip: 'Desglose de producto',
//            iconCls: 'desglose',
//            disabled: true,
//            handler: function () {
//                LOG.inv.desglose.Loader.init(function () {
//                    var win = new LOG.inv.desglose.View({
//                        sm: _this.winGestionarDocumento.smGridDetalles,
//                        postSalvar: function () {
//                            _this.winGestionarDocumento.stGridDetalles.reload();
//                        }
//                    });
//                    win.init();
//                    win.view();
//                });
//            },
//            controlFn: function (b, _caller) {
//                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
//                    b.show();
//                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
//                        if (e == 'selectionchange') {
//                            if (this.getCount() == 1 && _this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
//                                b.enable();
//                            } else {
//                                b.disable();
//                            }
//                        }
//                    }, 'generico');
//                } else {
//                    b.hide();
//                }
//            }
//        }));
        // Fin del bloque.
    },
    initDefaultColumns: function () {
        var _this = this;
        LOG.inv.entrada.recepcion.View.superclass.initDefaultColumns.call(this);
        // Bloque de columnas de la interfaz principal.
        LOG.util.UIManager.apply(this.listaColumnas.getBy('dataIndex', 'aprobadopor'), {
            header: this.idioma.gcContabilizadoPor,
            width: 120
        });
        this.insertGridColumn({
            header: this.idioma.gcProveedor,
            autoExpand: true,
            dataIndex: 'cliente',
            default: true
        }, 3);
        this.insertGridColumn({
            header: this.idioma.gcImporte /*+ ' ' + window.codContable*/,
            dataIndex: 'importecontable',
            width: 100,
            align: 'right',
            default: true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        }, 6);
        this.insertGridColumn({
            header: this.idioma.gcImporte + ' ' + window.codAlternativa,
            dataIndex: 'importealternativo',
            width: 100,
            align: 'right',
            default: true,
            hidden: (alternativa) ?false:true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        }, 7);
        this.insertGridColumn({
            // header: 'Nro. Comprobante',
            dataIndex: 'nrocomprobante',
            // width: 100,
            // align: 'right',
            default: true
        }, 8);
        this.insertGridColumn({
            header: 'Doc. Origen',
            dataIndex: 'nrodocorigen',
            width: 100,
            align: 'right',
            default: true
        }, 9);
        this.addGridColumn({
            header: 'Observaciones',
            dataIndex: 'observaciones',
            width: 300,
            filter : {
                type : 'string',
                emptyText : 'Observaci\xf3n',
                dataIndex : 'observaciones'
            }
        });
        this.addGridColumn({dataIndex: 'idcliente'});
        this.addGridColumn({dataIndex: 'idoperacion'});
        this.addGridColumn({dataIndex: 'idtransporte'});
        this.addGridColumn({dataIndex: 'idorganizacion'});
        this.addGridColumn({dataIndex: 'fechadocorigen'});
        //this.addGridColumn({dataIndex: 'nrodocorigen'});
        this.addGridColumn({dataIndex: 'nrocontrato'});
        this.addGridColumn({dataIndex: 'fechacontrato'});
        this.addGridColumn({dataIndex: 'nombreconductor'});
        this.addGridColumn({dataIndex: 'ciconductor'});
        this.addGridColumn({dataIndex: 'matricula'});
        this.addGridColumn({dataIndex: 'cartaporte'});
        this.addGridColumn({dataIndex: 'manifiesto'});
        this.addGridColumn({dataIndex: 'partida'});
        this.addGridColumn({dataIndex: 'casilla'});
        this.addGridColumn({dataIndex: 'embarque'});
        this.addGridColumn({dataIndex: 'idpadre'});
        this.addGridColumn({dataIndex: 'controlfirma'});
        this.addGridColumn({dataIndex: 'idnodo'});
        this.addGridColumn({dataIndex: 'iddoc'});
        this.addGridColumn({dataIndex: 'numeroDoc'});
        this.addGridColumn({dataIndex: 'tipopago'});
        this.addGridColumn({dataIndex: 'recargo'});
        this.addGridColumn({dataIndex: 'descuento'});
        this.addGridColumn({dataIndex: 'recargoalternativo'});
        this.addGridColumn({dataIndex: 'descuentoalternativo'});
        this.addGridColumn({dataIndex: 'importecontable'});
        this.addGridColumn({dataIndex: 'importealternativo'});
        this.addGridColumn({dataIndex: 'idcondicionpago'});
        this.addGridColumn({dataIndex: 'cantbulto'});
        this.addGridColumn({dataIndex: 'tipobulto'});
        this.addGridColumn({dataIndex: 'salidafactura'});
        this.addGridColumn({dataIndex: 'tasa'});
        this.addGridColumn({dataIndex: 'idmoneda'});
        this.addGridColumn({dataIndex: 'codigoiso'});
        this.addGridColumn({dataIndex: 'numerochip'});
        this.addGridColumn({dataIndex: 'fecha'});
        this.addGridColumn({dataIndex: 'idcategoria'});
        this.addGridColumn({dataIndex: 'idsolicitudpadre'});
        this.addGridColumn({dataIndex: 'idcontrato'});
        this.addGridColumn({dataIndex: 'bl'});
        this.addGridColumn({dataIndex: 'idpuertodestino'});
        this.addGridColumn({dataIndex: 'puertodestino'});
        this.addGridColumn({dataIndex: 'destinocomercial'});
        this.addGridColumn({dataIndex: 'prodgenerico'});
        this.addGridColumn({dataIndex: 'contenedor'});
        this.addGridColumn({dataIndex: 'idcomprobante'});
        // Fin del bloque.

        // Bloque de columnas de la ventana adicionar.
        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'nomcategoria'), {
            editor: new Ext.erp.comboNomenclador({
                controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
                modelo: 'NomCategoriasproducto',
                idnom: 'idcategoria',
                name: 'categoria',
                autoCargar: true,
                allowBlank: false
            }),
            renderer: function (_v, _mD, _r) {
                if (_r.json.cronologia == 0) {
                    if (this.editor.getStore().getCount() > 0) {
                        var record = this.editor.getStore().getById(_v);
                        _r.data.idcategoria = record ? record.get('idcategoria') : _r.data.idcategoria;
                        _r.data.nomcategoria = record ? record.get('denominacion') : _r.data.nomcategoria;
                    }
                }
                return _r.data.nomcategoria;
            }
        });

        if (alternativa) {
            var pos = this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'importe', 'header');
            this.insertGridColumnProductos(LOG.util.Prototipos.columnaPrecio({
                header: this.idioma.cgPrecio + ' ' + codAlternativa,
                width: 100,
                dataIndex: 'precioalternativo',
                align: 'right',
                default: true
            }), pos + 1);
            this.insertGridColumnProductos(LOG.util.Prototipos.columnaImporte({
                header: this.idioma.cgImporte + ' ' + codAlternativa,
                width: 100,
                dataIndex: 'importealternativo',
                align: 'right',
                default: true
            }), pos + 2);
            LOG.util.UIManager.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'preciocontable'), {
                header: this.idioma.cgPrecio + ' ' + codContable
            });
            LOG.util.UIManager.apply(_this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'importe'), {
                header: this.idioma.cgImporte + ' ' + codContable,
                width: 90
            });

            //var importe = this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'importealternativo', 'header');
            /**
             ** Nuevo para los precios de la recepcion
             */
            LOG.util.UIManager.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'preciocontable'), {
                editor: LOG.util.Prototipos.inputDecimal({})
            });
            LOG.util.UIManager.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'precioalternativo'), {
                editor: LOG.util.Prototipos.inputDecimal({})
            });
            LOG.util.UIManager.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'importe'), {
                editor: LOG.util.Prototipos.inputDecimal({})
            });
            LOG.util.UIManager.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'importealternativo'), {
                editor: LOG.util.Prototipos.inputDecimal({})
            });
        } else {
            LOG.util.UIManager.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'preciocontable'), {
                editor: LOG.util.Prototipos.inputDecimal({})
            });
            LOG.util.UIManager.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'importe'), {
                editor: LOG.util.Prototipos.inputDecimal({})
            });
        }
        var pos = this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'cantidad', 'header');
        this.insertGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgSaldoExistencia,
            width: 120,
            align: 'right',
            dataIndex: 'saldoexistencia',
            renderer: function (_v, _mD, _r) {
                _r.data.cantidadvieja = parseFloat(_r.json.cantidad);
                return parseFloat(_r.data.cantidad || 0) + parseFloat(_r.data.existencia || 0);
            },
            default: true
        }), pos + 1);

        if (typeof tarjetacombustible !== 'undefined' && tarjetacombustible == true) {
            this.insertGridColumnProductos(LOG.util.Prototipos.inputTexto({
                header: this.idioma.cgNumeroChip,
                width: 120,
                align: 'right',
                dataIndex: 'numerochip',
                regex: LOG.util.Regex.cadena,
                maxLength: 20,
                editor: LOG.util.Prototipos.inputTexto({}),
                renderer: function (_v, _mD, _r) {
                    _r.data.numerochip = _v || '';
                    return _r.data.numerochip;
                },
                default: true
            }), pos + 2);

            this.fecha = new Ext.form.DateField({
                fieldLabel: this.idioma.cgFecha,
                name: 'fecha',
                maxValue: Date.parseDate(fecha, 'd/m/Y'),
                campo: false,
                padre: false
            });

            this.insertGridColumnProductos({
                header: this.idioma.cgFecha,
                width: 100,
                align: 'right',
                dataIndex: 'fecha',
                editor: _this.fecha
            }, pos + 3);
        }

        this.insertGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgSaldoAlmacen,
            hidden: !almacen,
            width: 150,
            align: 'right',
            dataIndex: 'existenciaalmacen',
            editor: LOG.util.Prototipos.inputDecimal({}),
            renderer: function (_v, _mD, _r) {
                _r.data.existenciaalmacen = _v || 0;
                return _r.data.existenciaalmacen;
            },
            default: true
        }), pos + 4);
        this.insertGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.gcMaximo,
            width: 100,
            align: 'right',
            dataIndex: 'maximo',
            editor: LOG.util.Prototipos.inputDecimal({}),
            renderer: function (_v, _mD, _r) {
                _r.data.maximo = _v || 0;
                return _r.data.maximo;
            },
            default: true
        }), pos);
        this.insertGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.gcMinimo,
            width: 100,
            align: 'right',
            dataIndex: 'minimo',
            editor: LOG.util.Prototipos.inputDecimal({}),
            renderer: function (_v, _mD, _r) {
                _r.data.minimo = _v || 0;
                return _r.data.minimo;
            },
            default: true
        }), pos);
        if (_this.grantedAction('CT') || _this.grantedAction('RContar')) {
            this.insertGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
                header: this.idioma.gcCantFactura,
                width: 125,
                align: 'right',
                dataIndex: 'cantfactura',

                editor: LOG.util.Prototipos.inputDecimal({}),
                default: true
            }), pos);
            this.insertGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
                header: this.idioma.gcSaldoFactura,
                width: 120,
                align: 'right',
                dataIndex: 'saldofactura',
                renderer: function (_v, _mD, _r) {
                    return parseFloat(_r.data.cantfactura || 0) + parseFloat(_r.data.existencia || 0);
                },
                default: true
            }), pos + 1);
        } else {
            Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'existencia'), {
                hidden: true
            });
            Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'disponible'), {
                hidden: true
            });
        }
        this.cbUM = new LOG.util.ComboBox({
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarComboUM',
            name: 'idunidadmedida',
            valueField: 'idunidadmedida',
            displayField: 'abreviaturaunidadmedida',
            selectOnlyLeaf: true,
            autoLoad: false
        });
        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'umedida'), {
            editor: _this.cbUM,
            renderer: function (_v, _mD, _r) {
                if (_this.cargado) {
                    _r.data.idunidadmedida = !isNaN(_v) ? _v : _r.json.idunidadmedida;
                    var record = this.editor.getStore().getById(_r.data.idunidadmedida);
                }
                return record ? record.data.abreviaturaunidadmedida : _r.data.umedida;
            }
        });

        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'clasificacioncont'), {
            dataIndex: 'idclasificacioncontable',
            editor: new Ext.erp.comboNomenclador({
                controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
                modelo: 'NomClasificacioncontablelog',
                idnom: 'idclasificacioncontable',
                name: 'denominacion',
                autoCargar: true,
                pageSize: 30,
                resizable: true,
                listWidth: 300
            }),
            renderer: function (_v, _mD, _r) {
                _r.data.idclasificacioncontable = _v || _r.data.clasificacioncont;
                var record = this.editor.getStore().getById(_r.data.idclasificacioncontable);
                return record ? record.data.denominacion : null;
            }
        });

        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'numerolote'), {
            editor: LOG.util.Prototipos.inputTexto({
                listeners: {
                    focus: function (t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            })
        });

        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'fechavencelote'), {
            editor: new Ext.form.DateField({
                name: 'fechavencelote',
                id: id + 'fechavencelote',
                format: 'd/m/Y',
                editable: false,
            }),
            renderer: function (value, c, record) {
                if (value) {
                    if (typeof value == "object") {
                        return value.dateFormat('d/m/Y');
                    }
                }
                return value;
            }
        });

        this.insertGridColumnProductos({
            dataIndex: 'existenciamovimiento'
        }, 0);
        
        // Fin del bloque.
    },
    render: function () {
        var render = LOG.inv.entrada.recepcion.View.superclass.render.call(this);
        var _this = this;
        Ext.apply(this.winGestionarDocumento, {
            salvarHandler: function (params) {
                var _t = this.scope || this;
                params = params || {idestructuracomun: _t.scope ? _t.scope.idDeposito : null};
                var conceptos = _this.storeConceptos.getModifiedRecords();
                if (conceptos.length > 0) {
                    _this.modelo.listaConceptos.deleteAll();
                    Ext.each(conceptos, function (c) {
                        _this.modelo.listaConceptos.add(c.data);
                    });
                    //params.conceptosimporte = Ext.encode(datos);
                }
                _t.modelo.salvar(params, function (r) {
                    if (_t.modelo.listaMonedas.count() || _t.modelo.listaProductos.count() || r.reloadGridDetalle == 1) {
                        _t.cargarProductos();
                    }
                    _this.storeConceptos.reload();
                    _t.tipoVentana = 2;
                    if (_t.record == null) {
                        _t.record = {};
                        Ext.apply(_t.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                idpadre: _this.idpadre,
                                idpadre: _this.idsolicitudpadre,
                                estado: 1/*_this.porfactura ? "13" : "1",*/
                            }
                        });
                    }
                    _t.getTitleDocumento(r.iddocumento);
                    _t.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _t);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_t, [b, _t]).call();
                        }
                    }, _t);
                    if (alternativa) {
                        _this.monedas.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(_this.monedas));
                    }
                    _this.habilitarElementos();
                });
            },
            editarProducto: function (e) {
                if (e.record.json.idcategoria != '') {
                    e.record.data.idcategoria = e.record.json.idcategoria;
                }
                if (e.field == 'preciocontable') {
                    e.record.data.importe = e.record.data.cantidad * e.value;
                }
                if (e.field == 'precioalternativo') {
                    e.record.data.importealternativo = e.record.data.cantidad * e.value;
                }
                if (e.field == 'precioconvertible') {
                    e.record.data.importeconvertible = e.record.data.cantidad * e.value;
                }
                if (e.field == 'importe') {
                    e.record.data.preciocontable = (e.record.data.cantidad > 0) ? e.value / e.record.data.cantidad : 0;
                }
                if (e.field == 'importealternativo') {
                    e.record.data.precioalternativo = (e.record.data.cantidad > 0) ? e.value / e.record.data.cantidad : 0;
                }
                if (e.field == 'importeconvertible') {
                    e.record.data.precioconvertible = (e.record.data.cantidad > 0) ? e.value / e.record.data.cantidad : 0;
                }
                if (e.field == 'cantida') {
                    if (e.record.data.importe > 0) {
                        e.record.data.preciocontable = (e.value > 0) ? e.record.data.importe / e.value : 0;
                    } else if (e.record.data.preciocontable > 0) {
                        e.record.data.importe = e.record.data.preciocontable * e.value;
                    }
                    if (e.record.data.importealternativo > 0) {
                        e.record.data.precioalternativo = (e.value > 0) ? e.record.data.importealternativo / e.value : 0;
                    } else if (e.record.data.precioalternativo > 0) {
                        e.record.data.importealternativo = e.record.data.precioalternativo * e.value;
                    }
                    if (e.record.data.importeconvertible > 0) {
                        e.record.data.precioconvertible = (e.value > 0) ? e.record.data.importeconvertible / e.value : 0;
                    } else if (e.record.data.precioalternativo > 0) {
                        e.record.data.importeconvertible = e.record.data.precioconvertible * e.value;
                    }
                }
                
                this.modelo.adicionarProducto(e.record.data);
            },

            controlFnGuardar: function (b, nuevo) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && (!_this.winGestionarDocumento.record
                        || (nuevo && _this.winGestionarDocumento.record.data.estado != '4')
                        || (!nuevo && (_this.winGestionarDocumento.record.data.estado == '1' || _this.winGestionarDocumento.record.data.estado == '13')
                        || (_this.winGestionarDocumento.record.data.estado == '4' && !_this.winGestionarDocumento.record.data.idcomprobante))
                    )
                ) {
                    b.show();
                    if (_this.gpConceptos) {
                        _this.gpConceptos.fireEvent = _this.gpConceptos.fireEvent.createSequence(function (e) {
                            if (e == "afteredit") {
                                if (_this.storeConceptos.getModifiedRecords().length > 0) {
                                    if (_this.winGestionarDocumento.fromularioGestion.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                        _this.storeConceptos.fireEvent = _this.storeConceptos.fireEvent.createSequence(function (e) {
                            if (e == "load") {
                                if (_this.storeConceptos.getModifiedRecords().length > 0) {
                                    if (_this.winGestionarDocumento.fromularioGestion.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                    }
                } else {
                    b.hide();
                }
            }
        }, this.winGestionarDocumento);
        return render;
    },
    initVentanaGestion: function (d, t) {
        var _this = this;
        this.initPanelConceptos();
        this.lbCantidadText.setText(_this.idioma.lbImporteTotal+': '+0.00);
        LOG.inv.entrada.recepcion.View.superclass.initVentanaGestion.call(this, d, t);
        this.modelo.listaConceptos = new LOG.util.List();
        this.storeConceptos.on({
            'beforeload': function () {
                _this.beforeLoadConceptos();
            }
        });
        this.storeConceptos.load();
        this.winGestionarDocumento.stGridDetalles.on({
            load: function(st, records, op) {
                var importe = 0, importeTotal = 0;
                if (st.data.items[0]) {
                    importe = st.reader.jsonData.importeTotal;
                    importeTotal = Ext.util.Format.number(importe, '0,000.00');
                    _this.lbCantidadText.setText(_this.idioma.lbImporteTotal + ': ' + importeTotal);
                } else {
                    _this.lbCantidadText.setText(_this.idioma.lbImporteTotal +': ' + importe);
                }
            }
        });
        if (this.winGestionarDocumento.record) {
            if (this.winGestionarDocumento.record.data.cliente && this.winGestionarDocumento.record.data.cliente != '') {
                this.cbSuministrador.setRawValue(this.winGestionarDocumento.record.data.cliente);
                _this.comboCondiciones.getStore().load();

            }
        }
        this.cbTipoPago.fireEvent('select', this.cbTipoPago, this.cbTipoPago.getValue());
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.btnNuevo, 'handler', function () {
            _this.winGestionarDocumento.tipoVentana = 1;
            _this.habilitarElementos();
            _this.comboCondiciones.getStore().fireEvent('load', _this.comboCondiciones.getStore());
        }, 'botonNuevo');
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.stGridDetalles, 'fireEvent', function (e, o) {
            if (e == 'beforeload') {
                o.commitChanges();
                _this.modelo.listaProductos = new LOG.util.List();
                _this.modelo.listaMonedas = new LOG.util.List();
                _this.modelo.habilitarBotones(!_this.modelo.isValid());
            }
        }, 'stProductos');
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.smGridDetalles, 'fireEvent', function (e) {
            if (e == 'selectionchange') {
                if (_this.monedas) {
                    _this.monedas.getStorePrincipal().removeAll();
                }
                if (this.getCount() == 1) {
                    if (this.getSelected().json.cronologia == 0 && (_this.winGestionarDocumento.record.data.estado == '1'
                        || _this.winGestionarDocumento.record.data.estado == '13')) {
                        _this.cbUM.getStore().removeAll();
                        _this.cbUM.getStore().load({
                            params: {
                                idindicador: this.getSelected().json.idindicador
                            },
                            callback: function () {
                                _this.cargado = true;
                            }
                        });
                    }
                    if (_this.monedas) {
                        _this.monedas.idmovimiento = this.getSelected().data.idmovimiento;
                        if (!_this.formularioSur.collapsed) {
                            _this.monedas.getStorePrincipal().load();
                        }
                    }
                }
            }
        }, 'panelMonedas');
        if (alternativa) {
            this.monedas.listaBotones.each(function (b) {
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(this, [b, this]).call();
                }
            }.createDelegate(this.monedas));
        }
        this.winGestionarDocumento.doLayout();
    },
    /***
     *
     */
    handlerEliminarMov: function () {
        var _scope = this;
        var _parent = this.scope;
        var idmovimientos = new Array();
        Ext.each(_scope.smGridDetalles.getSelections(), function (rec) {
            idmovimientos.push(rec.id);
        });
        _scope.modelo.eliminarMovimientos(idmovimientos, function (r) {
            Ext.apply(_scope.record.data, {cantproductos: r.cantproductos});
            _scope.stGridDetalles.reload();
            _parent.habilitarElementos();
        });
    },
    panelSuperior: function () {
        var _this = this;
        var clsDatosRecepion1 = LOG.util.UIManager.initColumnForm({
            columnas: 6
        });
        this.cbTipoDocumento = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCbTipoDocumento,
            hiddenName: 'idoperacion',
            editable: true,
			     // mode: 'remote',
            url: 'cargarComboTipoDocumento',
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            autoLoad: true,
            allowBlank: false,
            campo: true,
            padre: true,
            sol711: true,
            listeners: {
                select: function (cb, rec) {
                    _this.cbSuministrador.fireEvent('select');

                    Ext.each(_this.winGestionarDocumento.panelSuperior.find('padre', true), function (item) {
                        if (item.hiddenName != 'idcliente' && item.hiddenName != 'idoperacion' && !item.btn) {
                            item.setValue(null);
                            item.enable();
                            item.fireEvent('blur');
                        }
                    });

                    _this.formularioGeneral.doLayout();
                    _this.comboCondiciones.codOperacion = rec.json.codigooperacion;
                }
            }
        });
        clsDatosRecepion1.addComponent(this.cbTipoDocumento);
        this.btnVentana = LOG.util.UIManager.createBtn({
            //text: '...',
            iconCls: 'buscar',
            tooltip: _this.idioma.ttBtnSeleccionar,
            disabled: !facturacion,
            btn: true,
            campo: true,
            padre: true,
            sol711: true,
            handler: function () {
                if (clsDatosRecepion1.getColumn(0).items.items[0].getValue()) {
                    var win = new LOG.inv.entrada.documento.View({
                        idioma: _this.idioma,
                        title: clsDatosRecepion1.getColumn(0).items.items[0].getRawValue(),
                        textBusquedaSimple: _this.textBusquedaSimple,
                        idnomoperaciones: clsDatosRecepion1.getColumn(0).items.items[0].getValue(),
                        idestructura: _this.idDeposito,
                        reporteFn: function (btn) {
                            _this.onReport(btn);
                        }
                    });
                    win.init();
                    win.getVistaPrincipal().aceptarFn = function () {
                        if (!_this.comboCondiciones.getValue()) {
                            //_this.comboCondiciones.setValue(_this.comboCondiciones.getStore().data.items[0].id);
                        }
                        var fechaSolicitud = null;
                        if (win.getSmPrincipal().getSelected().json.idsolicitud711) {
                            var aux = win.getSmPrincipal().getSelected().json.fechacreacion.split(' ');
                            var aux1 = aux[0].split('/');
                            fechaSolicitud = new Date(+aux1[2], aux1[1] - 1, +aux1[0]);
                        }
                        fechaorigen.setValue((!win.getSmPrincipal().getSelected().json.idsolicitud711) ?
                            win.getSmPrincipal().getSelected().data.fechacontable :
                            fechaSolicitud);
                        nfNumeroDoc.setValue((!win.getSmPrincipal().getSelected().json.idsolicitud711) ?
                            win.getSmPrincipal().getSelected().data.nrodoc :
                            win.getSmPrincipal().getSelected().json.nosolicitud);
                        if (!win.getSmPrincipal().getSelected().json.idsolicitud711) {
                            _this.cbSuministrador.setValue(win.getSmPrincipal().getSelected().json.idcliente);
                            _this.modelo.idcliente = win.getSmPrincipal().getSelected().json.idcliente;
                            _this.cbSuministrador.setRawValue(win.getSmPrincipal().getSelected().json.denominacion);
                            _this.nfNumeroContrato.setValue(win.getSmPrincipal().getSelected().json.nrocontrato);
                            _this.fechaContrato.setValue(win.getSmPrincipal().getSelected().json.fechacontrato);
                            _this.cbTransportador.setValue(win.getSmPrincipal().getSelected().json.idorganizacion);
                            tfNombreConductor.setValue(win.getSmPrincipal().getSelected().json.nombreconductor);
                            nfCIConductor.setValue(win.getSmPrincipal().getSelected().json.ciconductor);
                            chapa.setValue(win.getSmPrincipal().getSelected().json.matricula);
                            cartaporte.setValue(win.getSmPrincipal().getSelected().json.cartaporte);
                        }
                        Ext.each(_this.winGestionarDocumento.panelSuperior.find('padre', true), function (item) {
                            item.disable();
                            if (!item.btn) {
                                item.fireEvent('blur');
                            }
                        });

                        _this.modelo.idpadre = win.getSmPrincipal().getSelected().json.iddocumento;
                        _this.modelo.idsolicitudpadre = win.getSmPrincipal().getSelected().json.idsolicitud711;
                        _this.modelo.salvarDocumento({
                            url: '/logistica/inventario/entrada/entrada/index.php/recepcion/cargarProductosDocumentoExterno',
                            iddocumento: _this.modelo.idpadre,
                            idsolicitud711: win.getSmPrincipal().getSelected().json.idsolicitud711 || null,
                            idindicador: win.getSmPrincipal().getSelected().json.idindicador,
                            cantidad: win.getSmPrincipal().getSelected().json.cantidad,
                            nrolote: win.getSmPrincipal().getSelected().json.nrolote,
                            fechafabricacion: win.getSmPrincipal().getSelected().json.fechacierre,
                            idestructura: _this.idDeposito,
                            proceso: win.proceso,
							validar : false
                        }, function (resp) {
                            _this.winGestionarDocumento.record = {};
                            Ext.apply(_this.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: resp.iddocumento,
                                    estado: 1,/*_this.porfactura ? "13" : "1",*/
                                    cantproductos: resp.cantproductos,
                                    idpadre: _this.modelo.idpadre,
                                    idsolicitudpadre: _this.modelo.idsolicitudpadre
                                }
                            });
                            _this.winGestionarDocumento.tipoVentana = 2;
                            _this.modelo.iddocumento = resp.iddocumento;
                            _this.winGestionarDocumento.cargarProductos();
                            _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                                LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                                if (typeof b.controlFn == 'function') {
                                    b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                                }
                            }, _this.winGestionarDocumento);
                            _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                            _this.habilitarElementos();
                        }, function (resp) {
                            Ext.each(_this.winGestionarDocumento.panelSuperior.find('padre', true), function (item) {
                                if (item.hiddenName != 'idoperacion' && !item.btn) {
                                    item.setValue(null);
                                    item.enable();
                                    item.fireEvent('blur');
                                }
                            });
                            if (resp.inactivos) {
                                Ext.MessageBox.show({
                                    title: 'Error',
                                    msg: 'No se puede recepcionar productos con tarjeta inactiva',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR,
                                    fn: function () {
                                        var win = new LOG.inv.entrada.recepcion.Error({ idioma: _this.idioma, inactivos: resp.inactivos});
                                        win.init();
                                        win.view();
                                    }
                                });
                            }
                        });
                    };
                    win.view();
                } else {
                    mostrarMensaje(1, _this.idioma.msgSeleccionarDoc);
                }
            }
        });
        clsDatosRecepion1.addComponent(LOG.util.UIManager.initPanel({
            items: [
                LOG.util.UIManager.initPanel({height: 19}),
                _this.btnVentana
            ]
        }));
        var fechaorigen = new Ext.form.DateField({
            fieldLabel: _this.idioma.lbDfFecha,
            name: 'fechadocorigen',
            editable: false,
            allowBlank: false,
            maxValue: Date.parseDate(fecha, 'd/m/Y'),
            campo: true,
            padre: true,
            sol711: true
        });
        clsDatosRecepion1.addComponent(fechaorigen);
        this.monedasfac = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbDMFactura,
            hiddenName: 'idmoneda',
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            url: 'cargarMonedasDiferentes',
            editable: false,
            mode: 'remote',
            resizable: true/*,
            getValue: function () {
                console.info(this)
                 return this.value;
            }*/
            /* listeners: {
               focus: function (_cb) {
                   _cb.getStore().filterBy(function (item) {
                       return _this.getStorePrincipal().find('idmoneda', item.data.idmoneda) == -1;
                   });
               }
           }*/
        });
        this.monedasfac.on('select', function(cmb, rd, ix, p) {
            if(rd.json.tasa == 0){
                mostrarMensaje(1, 'No existen tasas configuradas');
                _this.monedasfac.reset();
            }else{
                _this.campotasa.setValue(rd.json.tasa[0].factordeconversion);
                _this.campotasa.setDisabled(false);
                _this.campotasa.fireEvent('blur');
            }
        });

        //El numero del doc origen se cambio porque este campo puede tener letras y caracteres especiales
        var nfNumeroDoc = LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbNfNumero,
            name: 'nrodocorigen',
            allowBlank: false,
            campo: true,
            padre: true,
            sol711: true,
            regex: LOG.util.Regex.cadena,
            maxLength: 20

        });
        clsDatosRecepion1.addComponent(nfNumeroDoc);
        clsDatosRecepion1.getColumn(0).columnWidth = 0.20;
        clsDatosRecepion1.getColumn(1).columnWidth = 0.04;
        clsDatosRecepion1.getColumn(2).columnWidth = 0.15;
        clsDatosRecepion1.getColumn(3).columnWidth = 0.15;
        clsDatosRecepion1.getColumn(4).columnWidth = 0.15;
        var clsDatosRecepion2 = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        this.cbSuministrador = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCbSuministrador,
            url: 'cargarComboProveedores',
            hiddenName: 'idcliente',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            autoSelect: false,
            allowBlank: false,
            mode: 'remote',
            //pageSize: 10,
            minChars: 0,
            resizable: true,
            campo: true,
            padre: true,

        });
        var cbTmpProv = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbCbSuministrador,
            //url: 'cargarComboProveedores',
            hiddenName: 'idcliente',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            //autoSelect : false,
            allowBlank: false,
            store: this.cbSuministrador.getStore(),
            mode: 'remote',
            pageSize: 10,
            minChars: 0,
        });


        //this.cbSuministrador = cbTmpProv;
        this.cbSuministrador = new LOG.util.SelectorTF({
            fieldLabel :_this.idioma.lbCbSuministrador,
            title :_this.idioma.lbCbSuministrador,
            url : 'cargarComboProveedores',
            controller : '',
            valueField : 'idclientesproveedores',
            displayField : 'nombre',
            hiddenName : 'idcliente',
            allowBlank: false,
            campo: true,
            padre:true,
            columns : [
                {
                    header : 'Codigo',
                    dataIndex : 'codigo',
                    width : 120
                },{
                    header : 'Nombre de proveedor',
                    dataIndex : 'nombre',
                    width : 250,
                    autoExpand : true
                }
            ]
        });
        /*this.cbSuministrador.on('select', function (cmb, rd) {
            _this.comboCondiciones.setValue(null);
            _this.comboCondiciones.getStore().load();
        });*/
        this.cbSuministrador.on('change', function (cmb, rd) {
            _this.comboCondiciones.setValue(null);
            _this.comboCondiciones.getStore().load();
            _this.nfNumeroContrato.setValue(null);
            _this.fechaContrato.setValue(null);
        });
        clsDatosRecepion2.addComponent(this.cbSuministrador);
        if(!contratacion){
            this.nfNumeroContrato = LOG.util.Prototipos.inputTexto({
                fieldLabel: _this.idioma.lbNfContrato,
                name: 'nrocontrato',
                regex: LOG.util.Regex.cadena,
                campo: true,
                //padre: true
            });
    
        }else{
            this.nfNumeroContrato = new Ext.form.TriggerField({
                fieldLabel: _this.idioma.lbNfContrato,
                name: 'nrocontrato',
                triggerClass: 'x-form-cliente-trigger',
                editable: false,
                emptyText: _this.idioma.cbEmtyText,
                campo: true,
                //padre: true
            });
            this.nfNumeroContrato.onTriggerClick = function(e) {
                if (!_this.nfNumeroContrato.disabled)
                    _this.showContratos();//.Inicializar();
            };
        }
       
        clsDatosRecepion2.addComponent(this.nfNumeroContrato);
        this.fechaContrato = new Ext.form.DateField({
            fieldLabel: _this.idioma.lbDfFecha,
            name: 'fechacontrato',
            editable: false,
            maxValue: Date.parseDate(fecha, 'd/m/Y'),
            campo: true,
            //padre: true
        });
        clsDatosRecepion2.addComponent(this.fechaContrato);
        this.comboCondiciones = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCondicionPago,
            hiddenName: 'idterminodepago',
            name: 'idcondicionpago',
            editable: true,
            typeAhead: true,
            allowBlank: true,
            autoSelect: true,
            autoLoad: false,
            url: 'cargarCondicionPago',
            valueField: 'idterminodepago',
            displayField: 'nombre',
            campo: true,
            mode: 'remote',
//            padre: true
        });
        this.comboCondiciones.on('select', function (cmb, rd) {
            Ext.getCmp('idhdcondicionpago').setValue(cmb.getValue());
            if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data) {
                _this.winGestionarDocumento.record.data.idcondicionpago = cmb.getValue();
            }
            _this.modelo.idcondicionpago = cmb.getValue();
        });
        this.comboCondiciones.getStore().on('beforeload', function (st, opts) {
            st.baseParams.idclienteproveedor = _this.cbSuministrador.getValue();
        });
        LOG.util.UIManager.encadenaFn(this.comboCondiciones.getStore(), 'fireEvent', function (e) {
            if (e == 'load') {
                if (_this.winGestionarDocumento.record) {
                    if (_this.winGestionarDocumento.record.data.idcondicionpago && _this.winGestionarDocumento.record.data.idcondicionpago != '') {
                        _this.comboCondiciones.setValue(_this.winGestionarDocumento.record.data.idcondicionpago);
                    }
                }
                _this.comboCondiciones.expand();
                if (_this.comboCondiciones.getStore().getCount() > 0) {
                    //_this.comboCondiciones.select(0);
                }
            }
        });
        //javier
        clsDatosRecepion2.addComponent(this.comboCondiciones);
        clsDatosRecepion2.addComponent({
            xtype: 'hidden',
            isFormField: true,
            name: 'idcondicionpago',
            id: 'idhdcondicionpago',
            campo: true
        });
        clsDatosRecepion2.getColumn(0).columnWidth = 1.00;
        clsDatosRecepion2.getColumn(1).columnWidth = 0.33;
        clsDatosRecepion2.getColumn(2).columnWidth = 0.33;
        clsDatosRecepion2.getColumn(3).columnWidth = 0.33;

        this.campotasa = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: "Tasa cambio",
            name: 'tasa',
            //readOnly: true,
            allowBlank: true,
            editable: true,
            //maxLength: 6,

            campo: true,
            listeners: {
                'focus': function (t) {
                    if (_this.monedasfac.getValue()) {
                        t.enable()
                    }else(
                        t.disable()
                    )
                }
            }
                
            // value: .getSmPrincipal().getSelected().data.tasa
            /* campo: true,
             padre: true,*/

        });
        // this.campotasa.on('select', function(cmb, rd, ix, p) {
        //     if(this.monedasfac.isdirty()){
        //         this.campotasa.disable();
        //     }else{
               
        //     }
        // });
        
        clsDatosRecepion1.addComponent(this.campotasa);
        clsDatosRecepion1.addComponent(this.monedasfac);
        clsDatosRecepion1.addComponent(new LOG.util.Prototipos.inputEntero({
            fieldLabel: "Doc. Primario",
            name: 'numeroref',
            editable: true,
            allowBlank: true,
            maxLength: 10,
            campo: true,
            padre: true
        }));
        var chxSalidaFactura = new Ext.form.Checkbox({
            boxLabel: 'Facturar',
            //hideLabel: true,
            name: 'salidafactura',
            listeners: {}
        });
        clsDatosRecepion1.addComponent(new Ext.Spacer({}));
        //if (_this.grantedAction('RCIMP'))
        clsDatosRecepion1.addComponent(chxSalidaFactura);
        var fsRecepcion1 = new Ext.form.FieldSet({
            title: _this.idioma.lbFsDatosDocRecepOrigen,
            items: [clsDatosRecepion1]
        });
        var fsRecepcion2 = new Ext.form.FieldSet({
            title: _this.idioma.lbFsDatosSuministrador,
            items: [clsDatosRecepion2]
        });
        var clsRecepcionGeneral = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        clsRecepcionGeneral.addComponent(fsRecepcion1);
        clsRecepcionGeneral.addComponent(fsRecepcion2);

        var clsDatosTransp = LOG.util.UIManager.initColumnForm({
            columnas: 5
        });
        this.cbTransportador = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCbOrgTransportadora,
            url: 'cargarComboProveedores',
            hiddenName: 'idorganizacion',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            mode: 'remote',
            pageSize: 10,
            minChars: 0,
            resizable: true,
            allowBlank: true,
            campo: true,
            padre: true
        });
        clsDatosTransp.addComponent(this.cbTransportador);
        var tfNombreConductor = LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfNombreConductor,
            name: 'nombreconductor',
            regex: LOG.util.Regex.nombre,
            regexText: _this.idioma.msgNombreIncorrecto,
            maxLength: 100,
            allowBlank: true,
            campo: true,
            padre: true
        });
        clsDatosTransp.addComponent(tfNombreConductor);
        var nfCIConductor = LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfCIConductor,
            name: 'ciconductor',
            maxLength: 11,
            allowBlank: true,
            regex: LOG.util.Regex.carnet,
            regexText: this.idioma.msgCarnetIncorrecto,
            campo: true,
            padre: true
        });
        clsDatosTransp.addComponent(nfCIConductor);
        var chapa = LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfChapa,
            name: 'matricula',
            regex: LOG.util.Regex.matricula,
            regexText: _this.idioma.lbChapaIcorrecta,
            emptyText: _this.idioma.lbChapaVacia,
            allowBlank: true,
            campo: true,
            padre: true
        });
        clsDatosTransp.addComponent(chapa);
        var cartaporte = LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfCartaPorte,
            name: 'cartaporte',
            campo: true,
            padre: true
        });
        clsDatosTransp.addComponent(cartaporte);
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfEmbarque,
            name: 'embarque',
            campo: true
        }));
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbCbManifiesto,
            name: 'manifiesto',
            campo: true
        }));
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfPartida,
            name: 'partida',
            campo: true
        }));
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfCasilla,
            name: 'casilla',
            campo: true
        }));
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfCantBulto,
            name: 'cantbulto',
            campo: true
        }));
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfTipoBulto,
            name: 'tipobulto',
            campo: true
        }));
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: 'BL',
            name: 'bl',
            campo: true
        }));
        this.cbPuertoDestino = new LOG.util.ComboBox({
            fieldLabel: 'Puerto destino',
            url: 'getPuertos',
            hiddenName: 'puertodestino',
            valueField: 'denominacion',
            displayField: 'denominacion',
            mode: 'remote',
            pageSize: 15,
            minChars: 1,
            resizable: true,
            allowBlank: true,
            campo: true
        });
        this.cbPuertoDestino.on('select', function(cb, rd){
            _this.modelo.idpuertodestino = rd.json.idpuertodestino;
        })
        clsDatosTransp.addComponent(this.cbPuertoDestino);
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: 'Destino comercial',
            name: 'destinocomercial',
            campo: true
        }));
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: 'Producto gen\xe9rico',
            name: 'prodgenerico',
            campo: true
        }));
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: 'Contenedor',
            name: 'contenedor',
            campo: true
        }));
        var tab = new Ext.TabPanel({
            activeTab: 0,
            listeners: {
                tabchange: function () {
                    _this.winGestionarDocumento.doLayout();
                }
            },
            items: [
                {
                    title: _this.idioma.lbTpDatosRecepcion,
                    autoHeight: true,
                    items: [
                        LOG.util.UIManager.initPanel({
                            layout: 'form',
                            labelAlign: 'top',
                            frame: true,
                            items: [
                                clsRecepcionGeneral,
                                _this.clsDatosRecepion3 || new Ext.form.TextArea({
                                    fieldLabel: _this.idioma.lbTaObservaciones,
                                    name: 'observaciones',
                                    height: '40px',
                                    anchor: '98%',
                                    minLength: 2,
                                    maxLength: 255,
                                    campo: true
                                })
                            ]
                        })
                    ]
                }
            ]
        });
        tab.add({
            title: _this.idioma.lbTpDatosTransp,
            autoHeight: true,
            items: [
                LOG.util.UIManager.initPanel({
                    layout: 'form',
                    labelAlign: 'top',
                    frame: true,
                    items: [clsDatosTransp]
                })
            ]
        });
        if (this.grantedAction('CT') || this.grantedAction('RRComercial')) {
            var clsDatosTipoPago = LOG.util.UIManager.initColumnForm({
                columnas: alternativa ? 5 : 3
            });
            this.cbTipoPago = new LOG.util.ComboBox({
                fieldLabel: this.idioma.lbCbTipoPago,
                hiddenName: 'tipopago',
                valueField: 'idtipopago',
                displayField: 'tipopago',
                triggerAction: 'all',
//                editable: false,
                campo: true,
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['idtipopago', 'tipopago'],
                    data: [
                        [1, LOG.inv.entrada.recepcion.TipoPago[1]],
                        [2, LOG.inv.entrada.recepcion.TipoPago[2]]
                    ]
                }),
                listeners: {
                    select: function () {
                        if (!this.disabled) {
                            _this.recargoContable.setDisabled(!this.getValue());
                            _this.descuentoContable.setDisabled(!this.getValue());
                            _this.descuentoContable.setMaxValue((this.getValue() == 1 ? 99.99 : null));
                            if (alternativa) {
                                _this.recargoAlternativo.setDisabled(!this.getValue());
                                _this.descuentoAlternativo.setDisabled(!this.getValue());
                                _this.descuentoAlternativo.setMaxValue((this.getValue() == 1 ? 99.99 : null));
                            }
                        }
                    },
                    blur: function () {
                        if (!this.getValue()) {
                            _this.recargoContable.setValue(null);
                            _this.modelo.recargo = null;
                            _this.recargoContable.disable();
                            _this.descuentoContable.setValue(null);
                            _this.modelo.descuento = null;
                            _this.descuentoContable.disable();
                            if (alternativa) {
                                _this.recargoAlternativo.setValue(null);
                                _this.modelo.recargoalternativo = null;
                                _this.recargoAlternativo.disable();
                                _this.descuentoAlternativo.setValue(null);
                                _this.modelo.descuentoalternativo = null;
                                _this.descuentoAlternativo.disable();
                            }
                            this.setValue(null);
                            _this.modelo.tipopago = null;
                        }
                    }
                }
            });
            clsDatosTipoPago.addComponent(this.cbTipoPago);
            this.recargoContable = LOG.util.Prototipos.inputDecimal({
                fieldLabel: _this.idioma.lbNfRecargo,
                name: 'recargo',
                enableKeyEvents: true,
                disabled: true,
                campo: true,
                listeners: {
                    keyup: function () {
                        if (this.getValue()) {
                            _this.descuentoContable.setValue(null);
                            _this.modelo.descuento = null;
                        }
                    },
                    blur: function () {
                        if (!this.getValue() || isNaN(this.getValue())) {
                            this.setValue(null);
                            _this.modelo.recargo = null;
                        }
                    }
                }
            });
            clsDatosTipoPago.addComponent(this.recargoContable);
            this.descuentoContable = LOG.util.Prototipos.inputDecimal({
                fieldLabel: _this.idioma.lbNfDescuento,
                name: 'descuento',
                enableKeyEvents: true,
                disabled: true,
                campo: true,
                listeners: {
                    keyup: function () {
                        if (this.getValue()) {
                            _this.recargoContable.setValue(null);
                            _this.modelo.recargo = null;
                        }
                    },
                    blur: function () {
                        if (!this.getValue() || isNaN(this.getValue())) {
                            this.setValue(null);
                            _this.modelo.descuento = null;
                        }
                    }
                }
            });
            clsDatosTipoPago.addComponent(this.descuentoContable);
            if (alternativa) {
                this.recargoAlternativo = LOG.util.Prototipos.inputDecimal({
                    fieldLabel: _this.idioma.lbNfRecargo,
                    name: 'recargoalternativo',
                    enableKeyEvents: true,
                    campo: true,
                    disabled: true,
                    listeners: {
                        keyup: function () {
                            if (this.getValue()) {
                                _this.descuentoAlternativo.setValue(null);
                                _this.modelo.descuentoalternativo = null;
                            }
                        },
                        blur: function () {
                            if (!this.getValue() || isNaN(this.getValue())) {
                                this.setValue(null);
                                _this.modelo.recargoalternativo = null;
                            }
                        }
                    }
                });
                clsDatosTipoPago.addComponent(this.recargoAlternativo);
                this.descuentoAlternativo = LOG.util.Prototipos.inputDecimal({
                    fieldLabel: _this.idioma.lbNfDescuento,
                    name: 'descuentoalternativo',
                    enableKeyEvents: true,
                    campo: true,
                    disabled: true,
                    listeners: {
                        keyup: function () {
                            if (this.getValue()) {
                                _this.recargoAlternativo.setValue(null);
                                _this.modelo.recargoalternativo = null;
                            }
                        },
                        blur: function () {
                            if (!this.getValue() || isNaN(this.getValue())) {
                                this.setValue(null);
                                _this.modelo.descuentoalternativo = null;
                            }
                        }
                    }
                });
                clsDatosTipoPago.addComponent(this.descuentoAlternativo);
            }
            var tabRD = {
                title: _this.idioma.tlTipoPago,
                autoHeight: true,
                items: [
                    LOG.util.UIManager.initPanel({
                        layout: 'form',
                        labelAlign: 'top',
                        frame: true,
                        items: [
                            new Ext.form.FieldSet({
                                border: false,
                                items: [clsDatosTipoPago]
                            })
                        ]
                    })
                ]
            };
            tab.add(tabRD);
        }
        var tabObs = {
            title: _this.idioma.lbTaObservaciones,
            autoHeight: true,
            items: [
                LOG.util.UIManager.initPanel({
                    layout: 'form',
                    labelAlign: 'top',
                    frame: true,
                    items: [
                        new Ext.form.TextArea({
                            fieldLabel: _this.idioma.lbTaObservaciones,
                            name: 'observaciones',
                            //height: '40px',
                            anchor: '100%',
                            minLength: 2,
                            campo: true
                        })
                    ]
                })
            ]
        };
        tab.add(tabObs);

        this.formularioGeneral = LOG.util.UIManager.initPanel({
            items: [tab]
        });
    },
    getCondicionesPago: function (record) {
        var _this = this;
        var arrayCond = new Array();
        if (record.json && record.json.cobrospagos) {
            Ext.each(record.json.cobrospagos, function (cond) {
                if (cond.idterminodepago != null && !_this.estaTermino(cond.idterminodepago, arrayCond) && cond.idclasificacion == 2) {
                    arrayCond.push([cond.idterminodepago, cond.nombreterminodepago, cond.plazo]);
                }
            });
        }
        return arrayCond;
    },
    estaTermino: function (termino, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][0] == termino) {
                return true;
            }
        }
        return false;
    },
    fnPostChangeEntidad: function () {
        /*this.cbTipoDocumento.getStore().removeAll();
        this.cbTipoDocumento.getStore().load();
        this.cbSuministrador.getStore().removeAll();
        this.cbSuministrador.getStore().load();
        this.cbTransportador.getStore().removeAll();
        this.cbTransportador.getStore().load();*/
    },
    /**
     * Inicializa el panel de monedas.
     * @returns {undefined}
     */
    initPanelMonedas: function () {
        var _this = this;
        this.monedas = new LOG.inv.entrada.recepcion.Monedas({
            idioma: this.idioma,
            modelo: this.modelo,
            scope: this.winGestionarDocumento,
            grantedAction: function (_p) {
                return (_this.grantedAction(_p) && _this.winGestionarDocumento.record && ((_this.porfactura && _this.winGestionarDocumento.record.data.estado == '13')
                    || (!_this.porfactura && _this.winGestionarDocumento.record.data.estado == '1')));
            }
        });
        this.monedas.init();
        this.formularioSur = LOG.util.UIManager.initPanel({
            title: this.idioma.tlPanelMonedas,
            titleCollapse: true,
            animCollapse: false,
            collapsible: true,
            collapsed: true,
            region: 'east',
            layout: 'fit',
            height: 200,
            width: 450,
            minSize: 200,
            maxSize: 400,
            split: true,
            hidden: true,
            items: [this.monedas.view()],
            listeners: {
                expand: function (_p) {
                    _p.show();
                    _this.monedas.listaBotones.each(function (b) {
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(this, [b, this]).call();
                        }
                    }.createDelegate(_this.monedas));
                    _this.winGestionarDocumento.doLayout();
                },
                collapse: function (_p) {
                    _p.hide();
                    _this.winGestionarDocumento.doLayout();
                }
            }
        });
    },
    showContratos: function(){
        var _this = this;
        _this.windowContratos = new LOG.inv.contratos({
            idioma: _this.idioma,
            usarAplicar: false,
            title: _this.idioma.titlecontrato,
            idcliente: _this.idcliente,
            _parent: _this
        });
        _this.windowContratos.pGdList.getGridPrincipal().on('rowdblclick', function(g) {
            _this.windowContratos.aceptarFn();
            _this.windowContratos.close();
        });
        _this.windowContratos.show();

        _this.windowContratos.aceptarFn = function() {
            var contrato = _this.windowContratos.pGdList.getSmPrincipal().getSelected();

            //_this.cbSuministrador.setValue(contrato.json.idclienteproveedor);
            //_this.cbSuministrador.setRawValue(contrato.json.clienteproveedor);
            _this.cbSuministrador.setDisabled(true);
            _this.fechaContrato.setValue(contrato.json.fechafirma);
            _this.modelo.fechacontrato = contrato.json.fechafirma; 
            _this.idcontrato = contrato.json.idcontrato;
            _this.nfNumeroContrato.setValue(contrato.json.numero);
            _this.nfNumeroContrato.setRawValue(contrato.json.numero);
            _this.nfNumeroContrato.fireEvent('change', _this.nfNumeroContrato,
                contrato.json.numerocontrato,
                _this.nfNumeroContrato.originalValue);

            /*var seleccionClientes = window.getTemplateByIndex(1).getSmPrincipal().getSelections();
            if (window.getSelectedTabIndex() == 0 && seleccionEstructuras.length > 0) {
                _this.idproveedor = seleccionEstructuras[0].json.id;
                _this.cmbOrganTransp.setValue(seleccionEstructuras[0].json.id);
                _this.cmbOrganTransp.setRawValue(seleccionEstructuras[0].json.text);

                _this.cmbOrganTransp.fireEvent('change', _this.cmbOrganTransp,
                    seleccionEstructuras[0].json.id,
                    _this.cmbOrganTransp.originalValue);

                _this.tiporgtransp = 1;
            }else if (window.getSelectedTabIndex() == 1 && seleccionClientes.length > 0) {
                _this.idproveedor = seleccionClientes[0].json.idclientesproveedores;
                _this.cmbOrganTransp.setValue(seleccionClientes[0].json.idclientesproveedores);
                _this.cmbOrganTransp.setRawValue(seleccionClientes[0].json.nombre);

                _this.cmbOrganTransp.fireEvent('change', _this.cmbOrganTransp,
                    seleccionClientes[0].json.idclientesproveedores,
                    _this.cmbOrganTransp.originalValue);

                _this.tiporgtransp = 0;
            } else {

            }*/
        };
    },
    initPanelImporte: function() {
        var _this = this;
        this.lbCantidadText = new Ext.form.Label({
            text: _this.idioma.lbImporteTotal+': ',
            style: 'padding: 10px 100px 0px 0px;font-weight: bolder;font-size: 12px;',
            tabular: true
        });
        this.lbCantidadTextAlt = new Ext.form.Label({
            text: _this.idioma.lbImporteTotal+' '+ window.codAlternativa+': ',
            style: 'padding: 10px 100px 0px 0px;font-weight: bolder;font-size: 12px;',
            tabular: true
        });
        var tbar = new Array('->',this.lbCantidadText, ' ', (alternativa) ? this.lbCantidadTextAlt : ' ');
        this.formularioSur = LOG.util.UIManager.initPanel({
            region: 'south',
            tbar: tbar
        });
    },
    /**
     * Habilita o deshabilita los elementos del panel de datos de acuerdo al estado del documento.
     * @returns {undefined}
     */
    habilitarElementos: function () {
        var _this = this;
        if (!this.winGestionarDocumento.record) {
            this.winGestionarDocumento.setTitle(this.idioma.tlAdicionar);
        }
        if (!this.winGestionarDocumento.record || (this.winGestionarDocumento.record
            && (this.winGestionarDocumento.record.data.estado == '1' || this.winGestionarDocumento.record.data.estado == '2'
                || this.winGestionarDocumento.record.data.estado == '13'))) {
            this.winGestionarDocumento.ocultarColumna('saldoexistencia', false);
        } else {
            this.winGestionarDocumento.ocultarColumna('saldoexistencia');
        }
        Ext.each(this.winGestionarDocumento.panelSuperior.find('campo', true), function (item) {
            var deshabilitar = ((this.winGestionarDocumento.record && this.winGestionarDocumento.record.data.estado != '1' &&
                this.winGestionarDocumento.record.data.estado != '13') ||
                (this.winGestionarDocumento.record && this.winGestionarDocumento.record.data.idpadre && item.padre) ||
                (this.winGestionarDocumento.record && this.winGestionarDocumento.record.data.idsolicitudpadre && item.sol711)) ? true : false;
            if (item.prod) {
                deshabilitar = deshabilitar || (this.winGestionarDocumento.record && this.winGestionarDocumento.record.data.cantproductos > 0);
            }
            if (item.name == 'idcondicionpago') {
                item.setDisabled((_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.idcomprobante)
                ? true : false);
            } else {
                item.setDisabled(deshabilitar);
            }
        }, this);
        if(this.winGestionarDocumento.record && this.winGestionarDocumento.record.data.estado == '4'){
            var cmG = this.winGestionarDocumento.cmGridDetalles;
            cmG.setDataIndex(
                cmG.findColumnIndex('existencia'),
                'existenciamovimiento'
            );
            this.winGestionarDocumento.ocultarColumna('disponible');
        }else{
            var cmG = this.winGestionarDocumento.cmGridDetalles;
            // if(cmG.findColumnIndex('existenciamovimiento')){
            //     cmG.setDataIndex(
            //         cmG.findColumnIndex('existenciamovimiento'),
            //         'existencia'
            //     )
            //     ;this.winGestionarDocumento.ocultarColumna('disponible', false);
            // }
        }  
        if(this.winGestionarDocumento.record && this.winGestionarDocumento.record.data.estado == '7'){
            
        }
        this.winGestionarDocumento.onShowHandler();
        this.cbTipoPago.fireEvent('select', this.cbTipoPago, this.cbTipoPago.getValue());
    },
    buildReport: function (btn, record) {

       //console.log(farmacia);
        //this.urlReport = '/distra/logistica/inventario/entrada/recepcion/';
        /*if (btn.isList) {
            this.dirReport = this.urlReport;
        } else {
            this.dirReport = this.urlReport + ((record.get('estado') == 13) ? 'preelaborado/' : '');
        }*/
        //this.dirReport = this.urlReport;
        if (farmacia == 1) {
            this.dirReport ='/logistica/farmacia/entrada/recepcion/' ;
        } else {           
            this.dirReport ='/logistica/inventario/entrada/recepcion/'  ; 
        }
       
        //this.dirReport = this.urlReport;
        return LOG.inv.entrada.recepcion.View.superclass.buildReport.call(this, btn, record);
    },
    getParamsReport: function (record, btn) {
        var _this = this;
        return btn.isList ? {
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
            contabilizadopor: (_this.panelBusquedaAvanzada.findByType('combo')[4].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[4].getValue() : null,
            idsuministrador: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null,
            creadopor: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
            fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d-m-Y') : null,
            fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d-m-Y') : null,
            docorigen: null,
            tipodocumento: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null
        } : {
            useSign: this.useSign,
            hasCategoria: (window.usarCategoria) ? 'true' : 'false',
            iddocumento: record.get("iddocumento") || null,
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            monedacontable: window.monedacontable || window.idcontable,
            monedaalternativa: window.monedaalternativa || window.idalternativa
        };
    },
    initPanelConceptos: function () {
        var _this = this;
        if (!this.gpConceptos) {
            this.listColConceptos = new LOG.util.List();

            this.listColConceptos.add({
                dataIndex: 'idconceptoimporte'
            });
            this.listColConceptos.add({
                dataIndex: 'idconceptorecep'
            });
            this.listColConceptos.add({
                header: 'Concepto',
                dataIndex: 'denominacion',
                default: true,
                width: 100
            });
            this.listColConceptos.add({
              dataIndex: 'porciento',
              width: 80,
              header: 'Porcentual',
              renderer : function(value, metaData){
                  if (value == 1) {
                      metaData.css = 'icondistra-aceptar verde';
                  } else {
                      metaData.css = 'icondistra-cancelar rojo';
                  }
              },
              default: true
          });
            this.listColConceptos.add({
                header: 'Moneda',
                dataIndex: 'moneda',
                default: true,
                width: 60,
                renderer: function(value, metaData) {
                    var codiso = '';
                    Ext.each(monedas, function(m) {
                        if (value == m.idmoneda) {
                            codiso = m.codigoiso;
                        }
                    });
                    return codiso;
                    /*if (value == idmoneda) {
                        return moneda;
                    } else if (value == idmonedaalternativa){
                        return monedaalternativa;
                    }*/
                }
            });
            this.listColConceptos.add({
                dataIndex: 'valormn',
                header: 'Valor',
                id: 'vcont',
                default: true,
                width: 60,
                editor: LOG.util.Prototipos.inputDecimal({
                    listeners: {
                        focus: function (t) {
                            t.selectText(0, t.getValue().length);
                        }
                    }
                }),
                renderer: function (value, metaData) {
                    if (value) {
                        return value;
                    } else {
                        return 0;
                    }
                }
            });

            if (alternativa) {
                this.listColConceptos.add({
                    dataIndex: 'valoralt',
                    header: 'Valor' + ' ' + codAlternativa,
                    id: 'valt',
                    default: true,
                    width: 60,
                    editor: LOG.util.Prototipos.inputDecimal({
                        listeners: {
                            focus: function (t) {
                                t.selectText(0, t.getValue().length);
                            }
                        }
                    }),
                    renderer: function (value, metaData) {
                        if (value) {
                            return value;
                        } else {
                            return 0;
                        }
                    }
                });
            }

            this.listColConceptos.add({
                header: 'Proveedor',
                dataIndex: 'proveedor',
                default: true,
                width: 100,
                editor: LOG.util.Prototipos.inputTexto({}),
            });

            this.listColConceptos.add({
                header: 'Condici\xf3n de pago',
                dataIndex: 'condicionpago',
                default: true,
                width: 100,
                editor: new LOG.util.ComboBox({
                    store: new Ext.data.SimpleStore({
                        fields: [
                            {
                                name: 'idcondicionpago'
                            },
                            {
                                name: 'denominacion'
                            }
                        ]
                    }),
                    autoLoad: false,
                    valueField: 'idcondicionpago',
                    displayField: 'denominacion',
                    editable: false,
                    listeners: {
                        select: function (cmb, rd) {
                            cmb.setValue(rd.data.denominacion);
                            _this.gpConceptos.getSelectionModel().getSelected().data.idcondicionpago = rd.data.idcondicionpago;
                        }
                    }
                })
            });

            this.listColConceptos.add({
                header: 'Nro. Factura',
                dataIndex: 'nrofactura',
                default: true,
                width: 80,
                editor: LOG.util.Prototipos.inputTexto({}),
            });

            this.listColConceptos.add({
                dataIndex: 'concepto'
            });

            this.listColConceptos.add({
                dataIndex: 'idproveedor'
            });

            this.listColConceptos.add({
                dataIndex: 'idcondicionpago'
            });

            this.smGridConceptos = LOG.util.UIManager.initSelectionModel(2, true);
            this.smGridConceptos.moveEditorOnEnter = false;

            var cls = LOG.util.UIManager.proccessColumns(this.listColConceptos);
            this.cmGridConceptos = new Ext.grid.ColumnModel(cls.columns);
            this.recStGridConceptos = Ext.data.Record.create(cls.fields);
            this.storeConceptos = new Ext.data.Store({
                autoLoad: false,
                url: 'cargarConceptos',
                reader: new Ext.data.JsonReader({
                    id: "idconcepto",
                    root: "datos"
                }, this.recStGridConceptos),
                listeners: {
                    /*beforeload: function(st){
                        _this.beforeLoadConceptos();
                    },*/
                    load: function (st) {
                        st.commitChanges();
                    }
                }
            });
            this.gpConceptos = LOG.util.UIManager.initEditableGridPanel(this.cmGridConceptos, this.storeConceptos, this.smGridConceptos, {nobbar: true});

            this.gpConceptos.on('beforeedit', function (e, t) {
                if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado != '1' && _this.winGestionarDocumento.record.data.estado != '13') {
                    if (_this.winGestionarDocumento.record.data.idcomprobante || e.field == 'valormn' || e.field == 'valoralt') {
                      o.cancel = true;
                      return false;
                    }
                }
                if (e.field == 'proveedor') {
                    //e.cancel = true;
                    _this.windowProveedor = new LOG.inv.entrada.recepcion.Proveedores({
                        idioma: _this.idioma,
                        usarAplicar: false,
                        title: 'Suministrador',
                        _parent: _this,
                        event: e
                    });
                    _this.windowProveedor.pGdList.getGridPrincipal().on('rowdblclick', function (g) {
                        _this.windowProveedor.aceptarFn();
                        _this.windowProveedor.close();
                    });
                    _this.windowProveedor.show();

                    _this.windowProveedor.aceptarFn = function () {
                        //e.stopEvent();
                        /*var index = _this.gpConceptos.getView().findRowIndex(t);
                        var record = _this.gpConceptos.store.getAt(index);*/
                        var prov = _this.windowProveedor.pGdList.getSmPrincipal().getSelected();
                        e.record.set('proveedor', prov.data.nombre);
                        e.record.set('idproveedor', prov.data.idclientesproveedores);
                        e.record.set('idcondicionpago', null);
                        e.record.set('condicionpago', null);
                        _this.gpConceptos.getSelectionModel().selectRow(e.row);
                        _this.gpConceptos.fireEvent('afteredit', {
                            field: 'proveedor',
                            grid: _this.gpConceptos,
                            originalValue: e.originalValue,
                            record: e.record,
                            row: e.row,
                            value: e.record.data.proveedor
                        });
                        var condiciones = _this.getCondicionesPago(prov);
                        _this.gpConceptos.getColumnModel().getCellEditor(e.column + 1, e.row).field.getStore().loadData(condiciones);

                        /*


                                            var proveedor = _this.windowProveedor.pGdList.getSmPrincipal().getSelected();
                                            e.value = proveedor.data.nombre;
                                            e.record.data.proveedor = proveedor.data.nombre;

                                            _this.gpConceptos.getView().refresh();*/
                    };
                }
                if (e.field == 'condicionpago') {
                    if (e.record.data.idproveedor == e.record.json.idproveedor) {
                        var condiciones = _this.getCondicionesPago(e.record);
                        _this.gpConceptos.getColumnModel().getCellEditor(e.column, e.row).field.getStore().loadData(condiciones);
                    }
                }
                /*if(_this.documento && _this.documento.json.estado != 1){
                    e.cancel = true;
                }*/
            });
            this.formularioEste = LOG.util.UIManager.initPanel({
                region: 'east',
                width: 500,
                layout: 'fit',
                frame: true,
                collapsible: true,
                title: 'Conceptos para el importe',
                collapsed: true,
                split: true,
                hidden: !_this.grantedAction('RCIMP'),
                //bodyStyle: 'padding:21px 2px 0px',
                items: this.gpConceptos
            });
        } else {
            this.storeConceptos.removeAll();
        }

        //_this.winGestionarDocumento.addPanel(_this.pnConcp);
    },
    beforeLoadConceptos: function () {
        this.storeConceptos.baseParams[this.modelo.primaryKeyField] = (this.modelo[this.modelo.primaryKeyField]) ? this.modelo[this.modelo.primaryKeyField] : -1;
        this.storeConceptos.initBaseParams[this.modelo.primaryKeyField] = (this.modelo[this.modelo.primaryKeyField]) ? this.modelo[this.modelo.primaryKeyField] : -1;
    }
});

LOG.inv.entrada.recepcion.gpProveedores = Ext.extend(LOG.util.UITemplate, {
    iddocumento: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.busquedaBasica = true;
        this.autoSelect = false;
        this.modoSeleccion = 1;
        this.urlBusquedaGridPrincipal = 'cargarComboProveedores';

        LOG.inv.entrada.recepcion.gpProveedores.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function () {

    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idclientesproveedores',
            default: true
        });

        this.addGridColumn({
            header: 'C\xf3digo',
            width: 100,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbCbSuministrador,
            width: 300,
            dataIndex: 'nombre',
            default: true
        });
    },
    render: function () {
        var _this = this;
        var render = LOG.inv.entrada.recepcion.gpProveedores.superclass.render.call(this);
        this.getStorePrincipal().reload();
        return render;
    }
});

LOG.inv.entrada.recepcion.Proveedores = Ext.extend(LOG.util.Window, {
    _parent: undefined,
    event: undefined,
    constructor: function (config) {
        this.idioma = config.idioma;
        this.constrain = true;
        this.idcliente = config.idcliente || null;
        LOG.inv.entrada.recepcion.Proveedores.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        var _this = this;
        var config = {
            layout: 'border',
            modal: true,
            closeAction: 'hide',
            width: 500,
            frame: true,
            height: 350,
            items: _this.createItems()
        };
        Ext.apply(this, config);
        LOG.inv.entrada.recepcion.Proveedores.superclass.initComponent.call(this, arguments);
    },
    createItems: function () {
        var _this = this;

        _this.pGdList = new LOG.inv.entrada.recepcion.gpProveedores({
            region: 'center',
            idioma: _this.idioma,
            frame: true,
            //filter: _this.filter,
            concepto: '',
            textBusquedaSimple: ''
            //iddocumento: _this._parent.scope.modelo.iddocumento
        });
        _this.pGdList.init();
        return _this.pGdList.view();
    },
    aceptarFn: function () {


    },
    postSalvar: function (r, a) {

    }
});

/**
 * Plantilla tipo panel para la gestion de las monedas.
 * @type LOG.util.UITemplate
 */
LOG.inv.entrada.recepcion.Monedas = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.urlBusquedaGridPrincipal = 'cargarMonedas';
        this.gridEditable = true;
        this.modoSeleccion = 1;
        this.bbarVisible = false;
        LOG.inv.entrada.recepcion.Monedas.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnAdicionar,
            tooltip: this.idioma.ttBtnAdicionarMoneda,
            iconCls: 'adicionar',
            hidden: true,
            handler: function () {
                _this.getStorePrincipal().add(new Ext.data.Record({
                    idmovimiento: _this.idmovimiento,
                    precio: 0,
                    importe: 0
                }));
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function (e) {
                        switch (e) {
                            case 'load' :
                                b.setDisabled(this.getCount() >= _this.monedas.cantidad);
                                break;
                            case 'add' :
                                b.setDisabled(this.getCount() >= _this.monedas.cantidad);
                                break;
                            case 'remove' :
                                b.enable();
                                break;
                            case 'clear' :
                                b.disable();
                                break;
                        }
                    }, 'addMoneda');
                } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: this.idioma.ttBtnEliminarMoneda,
            hidden: true,
            disabled: true,
            btn: true,
            handler: function () {
                if (_this.getSmPrincipal().getSelected().data.idmovmoneda) {

                    _this.modelo.eliminarMonedas({idmovmoneda: _this.getSmPrincipal().getSelected().data.idmovmoneda}, function () {
                        _this.scope.stGridDetalles.load();
                    });
                } else {

                    _this.editarMonedas(_this.getStorePrincipal(), _this.getSmPrincipal().getSelected(), true);
                    _this.getStorePrincipal().remove(_this.getSmPrincipal().getSelected());
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'eliminarMoneda');
                } else {
                    b.hide();
                }
            }
        }));
        Ext.apply(this.listaBotones.getBy('btn', true), {key: null});
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({dataIndex: 'idmovmoneda'});
        this.addGridColumn({dataIndex: 'idmoneda'});
        this.addGridColumn({dataIndex: 'idmovimiento'});
        this.addGridColumn({dataIndex: 'tipomoneda'});
        this.monedas = new LOG.util.ComboBox({
            hiddenName: 'idmoneda',
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            url: 'cargarTipoMonedas',
            allowBlank: false,
            editable: false,
            mode: 'remote',
            resizable: true,
            listeners: {
                focus: function (_cb) {
                    _cb.getStore().filterBy(function (item) {
                        return _this.getStorePrincipal().find('idmoneda', item.data.idmoneda) == -1;
                    });
                }
            }
        });
        this.monedas.getStore().on({
            load: function (_st) {
                _this.monedas.cantidad = _st.getCount();
                _st.filterBy(function (item) {
                    return _this.getStorePrincipal().find('idmoneda', item.data.idmoneda) == -1;
                });
            },
            afterload: function (_st) {
                var precio = this.editor.getStore().getById(_v);
            }
        });
        this.addGridColumn({
            header: this.idioma.gcTipoMoneda,
            width: 120,
            dataIndex: 'idmoneda',
            editor: this.monedas,
            renderer: function (_v, _mD, _r) {
                var moneda = this.editor.getStore().getById(_v);
                if (moneda) {
                    moneda = moneda.data.codigoiso;
                }
                return moneda;
            },
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: this.idioma.cgPrecioOriginal,
            width: 100,
            align: 'right',
            dataIndex: 'precio',
            allowBlank: false,
            editor: new LOG.util.Prototipos.inputDecimal({}),
            /*  renderer: function (value, metaData, record) {
                 if (record.json && record.json.tipomoneda == 0) {
                     return record.json.precioalternativo;
                 }
                 return value;
              },*/
            default: true,
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgImporteOriginal,
            width: 100,
            align: 'right',
            dataIndex: 'importe',
            default: true,
            /*  renderer: function (value, metaData, record) {
                  if (record.json && record.json.tipomoneda == 0) {
                      return record.json.importealternativo;
                  }
                  return value;
              },*/
        }));
        //console.info(_this.scope.scope.winGestionarDocumento.modelo.sm.selections.items[0].data.codigoiso);
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: this.idioma.cgPrecioFinal /* + ' ' + _this.scope.scope.modelo.codigoiso*/,
            width: 90,
            align: 'right',
            dataIndex: 'preciotasa',
            allowBlank: false,
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgImporteFinal,
            width: 90,
            align: 'right',
            dataIndex: 'importetasa',
            default: true

        }));
    },
    render: function () {
        var render = LOG.inv.entrada.recepcion.Monedas.superclass.render.call(this);
        var _this = this;
        this.getGridPrincipal().on({
            beforeedit: function () {
                return (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'));
            },
            afteredit: function (e) {
                _this.editarMonedas(e.grid.getStore(), e.record);
                e.grid.view.refresh();
            }
        });
        this.getStorePrincipal().on({
            beforeload: function () {
                this.removeAll();
                _this.modelo.listaMonedas = new LOG.util.List();
                _this.modelo.habilitarBotones(!_this.modelo.isValid());
                this.initBaseParams.idmovimiento = _this.idmovimiento;
            }
        });
        return render;
    },
    /**
     * Prepara los datos del grid de monedas y los adiciona a la lista.
     * @param {Object} store
     * @param {Object} record
     * @param {Boolean} borrar [Opcional]
     * @returns {undefined}
     */
    editarMonedas: function (store, record, borrar) {
        var _this = this;
        this.modelo.listaMonedas = new LOG.util.List();
        store.each(function (item) {
            if (record.data.idmoneda && (!borrar || (borrar && record.data.idmoneda != item.data.idmoneda))) {
                _this.modelo.editarMoneda(item.data);
            }
        });
    }
});


LOG.inv.entrada.CalcularUM = Ext.extend(LOG.util.Window, {
    /**
     * @type Array
     */
    factores: null,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        Ext.apply(config, {
            usarAplicar: false,
            title: config.idioma.tlPanelCalcularUM,
            width: 400,
            height: 180
        });
        this.factores = new Array();
        this.modelo = new LOG.util.Model({
            idioma: config.idioma,
            urlAccionGuardar: 'registrarPrecio',
            fields: [
                {
                    primary: true,
                    name: 'idmovimiento'
                },
                {name: 'idproducto'},
                {name: 'preciocontable'}
            ]
        });
        this.modelo.idmovimiento = config.idmovimiento;
        this.modelo.idproducto = config.idproducto;
        LOG.inv.entrada.CalcularUM.superclass.constructor.call(this, config);
    },
    /**
     *
     * @returns {undefined}
     */
    initComponent: function () {
        var _this = this;
        LOG.inv.entrada.CalcularUM.superclass.initComponent.call(this);
        this.modelo.cargaInicial({
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarFactorConversion',
            idindicador: this.idindicador
        }, function (r) {
            _this.factores = r[0];
        });
        this.cbUM = new LOG.util.ComboBox({
            fieldLabel: this.idioma.cgUM,
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarComboUM',
            valueField: 'idunidadmedida',
            displayField: 'abreviaturaunidadmedida',
            selectOnlyLeaf: true,
            autoLoad: false,
            allowBlank: false,
            listeners: {
                expand: function () {
                    this.getStore().filterBy(function (item) {
                        return item.data.idunidadmedida != _this.idunidadmedida;
                    });
                },
                select: function () {
                    var v = this.getValue();
                    _this.factorOrigen = _this.factorDestino = 1;
                    Ext.each(_this.factores, function (item) {
                        if (item.idunidadmedida == _this.idunidadmedida) {
                            _this.factorDestino = parseFloat(item.factorconversion);
                        }
                        if (item.idunidadmedida == v) {
                            _this.factorOrigen = parseFloat(item.factorconversion);
                        }
                    });
                    _this.calcularPrecio();
                }
            }
        });
        this.cbUM.getStore().on({
            beforeload: function () {
                this.baseParams.idindicador = _this.idindicador;
            },
            load: function () {
                this.filterBy(function (item) {
                    return item.data.idunidadmedida != _this.idunidadmedida;
                });
                _this.cbUM.fireEvent('expand', _this.cbUM);
            }
        });
        this.cbUM.getStore().load();
        this.clsUMOrigen = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        this.clsUMOrigen.addComponent(this.cbUM);
        this.cantOrigen = LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.idioma.cgCantidad,
            allowBlank: false,
            listeners: {
                keyup: function () {
                    _this.calcularPrecio();
                }
            }
        });
        this.clsUMOrigen.addComponent(this.cantOrigen);
        this.importe = LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.idioma.cgImporte,
            allowBlank: false,
            listeners: {
                keyup: function () {
                    _this.calcularPrecio();
                }
            }
        });
        this.clsUMOrigen.addComponent(this.importe);
        this.clsUMDestino = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        this.cbUM2 = new LOG.util.ComboBox({
            fieldLabel: this.idioma.cgUM,
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarComboUM',
            valueField: 'idunidadmedida',
            displayField: 'abreviaturaunidadmedida',
            selectOnlyLeaf: true,
            disabled: true
        });
        this.cbUM2.getStore().on({
            load: function () {
                _this.cbUM2.setValue(_this.idunidadmedida);
            }
        });
        this.clsUMDestino.addComponent(this.cbUM2);
        this.cantidad = LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.idioma.cgCantidad,
            disabled: true
        });
        this.clsUMDestino.addComponent(this.cantidad);
        this.precio = LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.idioma.cgPrecio,
            name: 'preciocontable',
            disabled: true
        });
        this.clsUMDestino.addComponent(this.precio);
        this.panel = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [this.clsUMOrigen, this.clsUMDestino]
        });
        this.modelo.bindForm(this.panel);
        this.modelo.addActionButton(this.listaBotones.getItem(2));
        this.add(this.panel);
    },
    /**
     * Calcua la cantidad y precio destino.
     * @returns {undefined}
     */
    calcularPrecio: function () {
        if (this.cbUM.getValue() && this.cantOrigen.getValue() && this.importe.getValue()) {
            var cantidad = this.cantOrigen.getValue() * this.factorDestino / this.factorOrigen;//...operacion invertida
            this.cantidad.setValue(cantidad);
            this.cantidad.fireEvent('keyup', this.cantidad);
            this.precio.setValue(this.importe.getValue() / cantidad);
            this.precio.fireEvent('keyup', this.precio);
        }
    },
    /**
     *
     * @returns {undefined}
     */
    aceptarFn: function () {
        var _this = this;
        this.modelo.salvar({}, function () {
            if (typeof _this.postSalvar == 'function') {
                _this.postSalvar.createDelegate(_this).call();
            }
        });
    }
});
LOG.lb.producto.Tarjeta711 = Ext.extend(LOG.lb.producto.Tarjeta, {
    constructor: function(config) {
        var _this = this;
        LOG.lb.producto.Tarjeta711.superclass.constructor.call(this, config);
        this.parametros.idalmacen = config.idestructura;
        this.parametros.iddocumento = config._parent.modelo.iddocumento;
        this.addGridColumn({
            dataIndex: 'idclasificacioncontable'
        });
        this.addGridColumn({
            header: 'Existe',
            dataIndex: 'existe',
            width: 80,
            renderer: function(v, m, rd) {
                if (rd.data.existe)
                    m.css = 'icondistra-aceptar verde';
                else
                    m.css = 'icondistra-aceptar rojo';
            }
        });
        this.urlBusquedaGridPrincipal = 'cargarProductos711';
        this.dirController = '/logistica/inventario/entrada/entrada/index.php/recepcion';
    },
    onShowHandler: function() {
        LOG.lb.producto.Tarjeta711.superclass.onShowHandler.call(this);
        var _this = this;
        this.getGridPrincipal().getSelectionModel().on({
            'rowselect': function(sm, idx, rec) {
                _this.comboUM.idSeleccionado = rec.data.idumedida;
                _this.comboClasificacion.reset();
                if (rec.data.idclasificacioncontable) {
                    _this.comboClasificacion.setValue(rec.data.idclasificacioncontable);
                }
                _this.modelo.idunidadmedida = rec.data.idumedida;
                _this.modelo.idumedida = rec.data.idumedida;
                _this.comboUM.getStore().load();
                _this.modelo.minimo = 0;
                _this.modelo.maximo = 0;
                _this.nfPrecio.setValue(rec.data.precio);
                _this.tMaximo.setValue(0);
                _this.tMinimo.setValue(0);
                _this.tMinimo.fireEvent('keyup');
                _this.tMinimo.fireEvent('keyup');
                _this.nfPrecio.fireEvent('keyup');
                if (!_this.modelo.isValid()) {
                    _this.modelo.habilitarBotones();
                }
            }
        });
    }
});
LOG.inv.entrada.recepcion.Error = Ext.extend(LOG.util.UITemplate, {
    dirController: '/logistica/inventario/entrada/entrada/index.php/recepcion',
    /**
     * Nombre de la funcion de busqueda principal de datos.
     * @type String
     */
    urlBusquedaGridPrincipal: 'cargarProductoError',
    /**
     * Forma en que se muestra el componente (default = "viewport", "ventana", "panel").
     * @type String
     */
    formaVisualizacion: 'ventana',
    /**
     * Determina si se carga automaticamente el store.
     * @type Boolean
     */
    autoLoad: false,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.urlBusquedaGridPrincipal = 'cargarProductoError';
        this.autoLoad = false;
        this.autoSelect = false;
        LOG.inv.entrada.recepcion.Error.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = (config.inactivos) ? 'Tarjetas inactivas' : 'Productos errores';
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({ dataIndex: 'idproductoerror' });
        this.addGridColumn({
            header: 'C\xf3digo',
            width: 80,
            dataIndex: 'codigoproducto',
            default: true
        });
        this.addGridColumn({
            header: 'C\xf3digo de barra',
            width: 80,
            dataIndex: 'codigobarra',
            default: true
        });
        this.addGridColumn({
            header: 'Denominaci\xf3n',
            autoExpand: true,
            dataIndex: 'denominacionproducto',
            default: true
        });
        this.addGridColumn({
            header: 'U/M',
            width: 40,
            dataIndex: 'um',
            default: true
        });
        this.addGridColumn({
            header: 'C.Contable',
            width: 80,
            dataIndex: 'clasificacioncontable',
            default: true,
            hidden: (_this.inactivos) ? true : false
        });
        this.addGridColumn({
            header: 'Error',
            width: 200,
            dataIndex: 'error',
            default: true,
            hidden: (_this.inactivos) ? true : false
        });


    },
    initDefaultButtons: function () {
        let _this = this;
        let isCimex = LOG.util.isVariableGlobalActiva('VG_ISCIMEX');

        if (isCimex) {
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'modificar',
                text: 'Generar codigo de barra',
                tooltip: 'Generar codigo de barra y volver a importar',
                handler: function () {
                    let win = _this.crearVentanaSeleccionEstandarCodigobarras();
                    win.on('aceptar', function (idestandarcodigobarra) {
                        _this.generarCodigoBarrasProductoError.call(_this, idestandarcodigobarra);
                        win.close();
                    });
                    win.show();
                }
            }));
        }
    },
    render: function () {
        var _this = this;
        var render = LOG.inv.entrada.recepcion.Error.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function () {
                if (_this.inactivos) {
                    this.baseParams.inactivos = this.initBaseParams.inactivos = Ext.encode(_this.inactivos);
                } else {
                    this.baseParams.iddocumento = this.initBaseParams.iddocumento = _this.iddocumento || null;
                }
            }
        });
        this.getStorePrincipal().load();
        if (!_this.inactivos) {
            this.getVistaPrincipal().closeFn = function () {
                Ext.Ajax.request({
                    url: 'eliminarImportar',
                    method: 'POST',
                    params: {iddocumento: _this.iddocumento}
                });
            };
        }
        return render;
    },
    mostrarError: function (iddocumento) {
        var _this = this;
        Ext.MessageBox.show({
            title: 'Error',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR,
            fn: function () {
                var win = new LOG.inv.entrada.recepcion.Error({ idioma: _this.idioma, diferencia: iddocumento });
                win.init();
                win.view();
            }
        });
    },
    crearVentanaSeleccionEstandarCodigobarras: function () {
        // let me = this;

        let btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            selectOnFocus: true,
            text: 'Cancelar',
            handler: function () {
                winForm.close();
            }
        });

        let btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            scope: this,
            handler: function () {
                if (cbEstandarCodigoBarras.getValue()) {
                    winForm.fireEvent('aceptar', cbEstandarCodigoBarras.getValue());
                }
            }
        });

        let cbEstandarCodigoBarras = new LOG.util.ComboBox({
            url: '/logistica/utiles/maestroproductos/index.php/estandarcodigobarras/cargarEstandaresCodigoBarra',
            name: 'idestandarcodigobarra',
            valueField: 'idestandarcodigobarra',
            autoLoad: true,
            autoSelect: false,
            displayField: 'denominacion',
            descField: 'desc',
            fieldLabel: 'Estandar',
            selectOnFocus: true,
            forceSelection: true,
            anchor: '100%',
            mode: 'local',
            // minChars: 0,
            listWidth: 300,
            //pageSize: 20,
            isCombo: true
        });

        let form = new Ext.FormPanel({
            // labelWidth: 50,
            // labelAlign: 'top',
            //region: 'center',
            autoHeight: true,
            frame: true,
            border: false,
            buttonAlign: 'right',
            layout: 'form',
            items: [
                {
                    layout: 'column',
                    labelAlign: 'top',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            // style: 'margin: 0 0 0 5',
                            items: [cbEstandarCodigoBarras]
                        }
                    ]
                }
            ]
        });

        let winForm = new Ext.Window({
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.30,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            layout: 'fit',
            buttons: [btnCancelar, btnAceptar],
            items: [form]
        });
        winForm.addEvents('aceptar');
        return winForm;
    },
    generarCodigoBarrasProductoError: function (idestandarcodigobarra) {
        Ext.Ajax.request({
            url: 'generarCodigoBarrasProductoError',
            method: 'POST',
            scope: this,
            params: {
                idestandarcodigobarra: idestandarcodigobarra
            },
            callback: function(options, success, response)
            {
                var responseData = Ext.decode(response.responseText);
                if (responseData.codigoMsg === 1) {
                    mostrarMensaje(1, responseData.msg);
                    this.vistaPrincipal.close();
                } else {
                    mostrarMensaje(1, responseData.msg);
                    this.getStorePrincipal().load();
                }
            }
        });
    }
});

LOG.inv.contratos = Ext.extend(LOG.util.Window, {
    //_parent: undefined,
    constructor: function(config) {
        this.idioma = config.idioma;
        this.constrain = true;
        this.idcliente = config.idcliente || null;
        this.parent = config._parent;
        LOG.inv.contratos.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        var _this = this;
        var config = {
            layout: 'border',
            modal: true,
            closeAction: 'hide',
            width: 700,
            frame: true,
            height: 400,
            items: _this.createItems()
        };
        Ext.apply(this, config);
        LOG.inv.contratos.superclass.initComponent.call(this, arguments);
    },
    createItems: function () {
        var _this = this;
        if(_this.servicios) {
            _this.pGdList = new LOG.inv.GridServicios({
                region: 'center',
                idioma: _this.idioma,
                url: _this.urlAction,
                frame: true,
                idcontrato: _this.idcontrato,
                //filter: _this.filter,
                concepto: _this.idioma.conceptoServicios,
                textBusquedaSimple: _this.idioma.fdCriterio
                //iddocumento: _this._parent.scope.modelo.iddocumento
            });
        } else if(_this.productos){
            _this.pGdList = new LOG.inv.GridProductos({
                region: 'center',
                idioma: _this.idioma,
                url: _this.urlAction,
                frame: true,
                idcontrato: _this.idcontrato,
                //filter: _this.filter,
                concepto: _this.idioma.conceptoServicios,
                textBusquedaSimple: _this.idioma.fdCriterio
                //iddocumento: _this._parent.scope.modelo.iddocumento
            });
        }else{
            _this.pGdList = new LOG.inv.GridContratos({
                region: 'center',
                idioma: _this.idioma,
                url: _this.urlAction,
                frame: true,
                idcliente: _this.idcliente,
                parent : _this.parent,
                //filter: _this.filter,
                concepto: _this.idioma.lbconceptocontrato,
                textBusquedaSimple: _this.idioma.cmnumerocontrato
                //iddocumento: _this._parent.scope.modelo.iddocumento
            });
        }
        _this.pGdList.init();
        return _this.pGdList.view();
    },
    aceptarFn: function () {


    },
    postSalvar: function (r, a) {

    }
});

LOG.inv.GridContratos = Ext.extend(LOG.util.UITemplate, {
    iddocumento: undefined,
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.busquedaBasica = true;
        this.autoSelect = false;
        this.idcliente = config.idcliente || -1;
        this.modoSeleccion = 1;
        this.urlBusquedaGridPrincipal = 'cargarContratos';
        this.parent = config.parent;

        LOG.inv.GridContratos.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {

    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idcontrato',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idclienteproveedor',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmnumerocontrato,
            width: 150,
            dataIndex: 'numero',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmnombrecontrato,
            width: 200,
            dataIndex: 'nombre',
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            header: _this.idioma.lbCliente,
            width: 200,
            dataIndex: 'clienteproveedor',
            default: true
        });
    },
    render: function() {
        var _this = this;
        var render = LOG.inv.GridContratos.superclass.render.call(this);
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            idclienteproveedor: _this.parent.cbSuministrador.getValue() || null
        });
        this.getStorePrincipal().reload();
        return render;
    }
});

LOG.inv.GridServicios = Ext.extend(LOG.util.UITemplate, {
    iddocumento: undefined,
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.busquedaBasica = false;
        this.autoSelect = false;
        this.idcontrato = config.idcontrato;
        this.modoSeleccion = 3;
        this.urlBusquedaGridPrincipal = 'cargarServContrato';

        LOG.inv.GridServicios.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {

    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idindicador',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'prodserv',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idhito',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmCodigo,
            width: 100,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            header: _this.idioma.cmCantidad,
            width: 80,
            dataIndex: 'cantidad',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmPrecio,
            width: 80,
            dataIndex: 'precio',
            default: true
        });
    },
    render: function() {
        var _this = this;
        var expander = new Ext.ux.grid.RowExpander({
            tpl : new Ext.Template(
                '<p>{prodserv}</p>'
            )
        });
        _this.addGridPlugin(expander);
        var render = LOG.inv.GridServicios.superclass.render.call(this);
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            idcontrato: _this.idcontrato || null
        });
        this.getStorePrincipal().on('load', function(st){
            if (st.data.items[0].json.idhito){
                if(_this.rowexp == undefined){
                    _this.rowexp = true;
                    _this.insertGridColumn(expander, 3);
                    var listaColumnas = LOG.util.UIManager.proccessColumns(_this.listaColumnas, _this.getGridPrincipal().getSelectionModel());
                    var columnas = new Ext.grid.ColumnModel(listaColumnas.columns);
                    _this.getGridPrincipal().reconfigure(_this.getStorePrincipal(), columnas);
                }
            }

        });
        this.getStorePrincipal().reload();
        return render;
    }
});

LOG.inv.GridProductos = Ext.extend(LOG.util.UITemplate, {
    iddocumento: undefined,
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.busquedaBasica = false;
        this.autoSelect = false;
        this.idcontrato = config.idcontrato;
        this.modoSeleccion = 3;
        this.urlBusquedaGridPrincipal = 'cargarProdContrato';

        LOG.inv.GridProductos.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idindicador',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idhito',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'prodserv',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmCodigo,
            width: 100,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            header: _this.idioma.cmCantidad,
            width: 80,
            dataIndex: 'cantidad',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmPrecio,
            width: 80,
            dataIndex: 'precio',
            default: true
        });
    },
    render: function() {
        var _this = this;
        var expander = new Ext.ux.grid.RowExpander({
            tpl : new Ext.Template(
                '<p>{prodserv}</p>'
            )
        });
        _this.addGridPlugin(expander);
        var render = LOG.inv.GridProductos.superclass.render.call(this);
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            idcontrato: _this.idcontrato || null
        });
        this.getStorePrincipal().on('load', function(st){
            if (st.data.items[0].json.idhito){
                if(_this.rowexp == undefined){
                    _this.rowexp = true;
                    _this.insertGridColumn(expander, 3);
                    var listaColumnas = LOG.util.UIManager.proccessColumns(_this.listaColumnas, _this.getGridPrincipal().getSelectionModel());
                    var columnas = new Ext.grid.ColumnModel(listaColumnas.columns);
                    _this.getGridPrincipal().reconfigure(_this.getStorePrincipal(), columnas);
                }
            }

        });
        this.getStorePrincipal().reload();
        return render;
    }
});
