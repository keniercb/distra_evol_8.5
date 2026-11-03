Ext.ns('LOG.fac.lecturamedidor');
LOG.fac.lecturamedidor.View = Ext.extend(LOG.lb.documento.View, {
    /**
     * @param {Object} config
     */
    constructor: function (config) {
        this.busquedaBasica = true;
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        config.model = new LOG.fac.lecturamedidor.Model({});
        LOG.fac.lecturamedidor.View.superclass.constructor.call(this, config);
    },
    init: function () {
        LOG.fac.lecturamedidor.View.superclass.init.call(this);
        this.panelSuperior();
    },
    initDefaultButtons: function () {
        var _this = this;
        LOG.fac.lecturamedidor.View.superclass.initDefaultButtons.call(this);
        // Bloque de botones de la interfaz principal.
        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(0), 'handler', function () {
            _this.habilitarEdicion();
            _this.habilitarElementos();
        }, 'lecturaMedidorAdd');
        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(1), 'handler', function () {
            _this.habilitarEdicion();
            _this.habilitarElementos();
            LOG.util.UIManager.apply(_this.winGestionarDocumento.record.data, _this.getSmPrincipal().getSelected().data);
        }, 'lecturaMedidorVer');
        this.insertToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.confirmar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 1) {
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
                _this.modelo.anularestado();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 2) {
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
            iconCls: 'cancelar',
            text: this.idioma.lbBtnAnularDocumento,
            tooltip: this.idioma.ttBtnAnularDocumento,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.anular();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('RAn')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 4) {
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
        this.insertToolbarButton(LOG.util.Prototipos.botonAprobar({
            tooltip: this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.initVentanaGestion(_this.getGridPrincipal().getSelectionModel().getSelected(), 3);
                _this.habilitarElementos();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(
                            (this.getCount() == 1 && this.getSelected().data.estado == 2) && //first
                            ((window.useSign && typeof pki == 'object') ? (_caller.getSmPrincipal().getSelected().get('controlfirma') == 2) : true) //last pki //para controlfirma == 2 limit 3 y 1 limit 2
                            ));
                        }
                    }, 'aprobar1');
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
                if (_caller.grantedAction('RCRUD')) {
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
        this.insertToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttBtnImprimir,
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirListado,
                    isList: true,
                    name: 'LecturaMedidorListado',
                    dirReport: '/logistica/facturacion/lecturamedidor/LecturaMedidorListado',
                    handler: _this.onReport.createDelegate(this)
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    isList: false,
                    name: 'LecturaMedidorModelo',
                    ddirReport '/distra/logistica/facturacion/lecturamedidor/LecturaMedidorModelo',
                    disabled: true,
                    handler: _this.onReport.createDelegate(this)
                })
            ],
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RB')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.menu.get(1).setDisabled(this.getCount() > 1);
                        }
                    }, 'imprimir1');
                    LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'load') {
                            b.setVisible(this.getCount() > 0);
                        }
                    }, 'imprimir1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 8);
        // Fin del bloque.
        // Bloque de botones del panel superior de la ventana adicionar.
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarDoc,
            handler: function () {
                _this.modelo.eliminar({}, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
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
            handler: function () {
                _this.modelo.confirmar({
                    iddocumento: _this.winGestionarDocumento.record.data.iddocumento
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
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
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
            handler: function () {
                _this.modelo.anularestado({
                    iddocumento: _this.winGestionarDocumento.record.data.iddocumento
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
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), {
            tooltip: this.idioma.ttBtnDuplicar,
            handler: function () {
                _this.modelo.duplicar({
                    iddocumento: _this.winGestionarDocumento.record.data.iddocumento
                }, function (r) {
                    Ext.apply(_this.winGestionarDocumento.record.data, {
                        iddocumento: r.datos['iddocumento'],
                        estado: '1',
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
                    _this.winGestionarDocumento.getTitleDocumento(r.datos['iddocumento']);
                    _this.habilitarElementos();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RCRUD')) {
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
        this.winGestionarDocumento.listaBotonesVentana.getItem(3).hide();
        this.insertToolbarButtonVentana(LOG.util.UIManager.createBtn({
            iconCls: 'cancelar',
            text: this.idioma.lbBtnAnularDocumento,
            tooltip: this.idioma.ttBtnAnularDocumento,
            handler: function () {
                _this.modelo.anular({
                    iddocumento: _this.winGestionarDocumento.record.data.iddocumento
                }, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RAn')) {
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
        }), 3);
        this.insertToolbarButtonVentana(LOG.util.Prototipos.botonContabilizar({
            tooltip: this.idioma.ttBtnContabilizar,
            handler: function () {
                _this.modelo.contabilizar({
                    iddocumento: _this.winGestionarDocumento.record.data.iddocumento,
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
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RCon')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }), 4);

        this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonImprimir({
            hidden: true,
            handler: function () {
                _this.onReport({
                    isList: false, name: 'LecturaMedidorModelo',
                    dirReport:'/distra/logistica/facturacion/lecturamedidor/LecturaMedidorModelo',
                });
            },
            controlFn: function (b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RB'))) {
                    b.setVisible(true);
                    b.setVisible((_this.winGestionarDocumento.record) ? true : false);
                } else {
                    b.hide();
                }
            }
        }));
        // Fin del bloque.
        // Bloque botones del panel productos de la ventana adicionar.
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesProductos.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarProd,
            disabled: true,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && _this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
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
        this.insertToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'informe',
            text: this.idioma.lbBtnProductos,
            tooltip: this.idioma.ttBtnProductos,
            handler: function () {
                var winProductos = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    parametros: {
                        idestructura: _this.idDeposito
                    }
                });
                winProductos.init();
                _this.vistaProductos = winProductos.view();
                _this.vistaProductos.show();
                winProductos.storePrincipal.load();
            }
        }), 0);
        this.modelo.addActionButton(this.winGestionarDocumento.listaBotonesProductos.getBy('iconCls', 'informe'));
        this.insertToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: this.idioma.lbBtnCrearTarjeta,
            tooltip: this.idioma.ttBtnCrearTarjeta,
            handler: function () {
                var winCrearTarjeta = new LOG.lb.producto.Tarjeta({
                    idioma: _this.idioma,
                    _parent: _this
                });
                winCrearTarjeta.show();
            }
        }), 1);
        this.modelo.addActionButton(this.winGestionarDocumento.listaBotonesProductos.getBy('iconCls', 'adicionar'));
        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'ubicarproducto',
            text: this.idioma.lbBtnUbicar,
            tooltip: this.idioma.ttBtnUbicar,
            disabled: true,
            handler: function () {
                LOG.inv.ubicacion.Loader.init(function () {
                    var winUbicar = new LOG.lb.ubicacion.winUbicar({
                        datos: _this.winGestionarDocumento.smGridDetalles, //_this.getGridPrincipal().getSelectionModel(),
                        iddeposito: _this.idDeposito,
                        idindicador: _this.winGestionarDocumento.smGridDetalles.getSelected().json.idindicador,
                        confubicacion: _this.winGestionarDocumento.confubicacion,
                        proceso: true
                    });
                    winUbicar.show();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && _this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1'
                                && this.getSelected().json.tienelote != 1 && this.getSelected().json.equipo != 1 && this.getSelected().json.municion != 1) {
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
                if (this.winLote == undefined) {
                    LOG.lb.lote.Loader.init(function () {
                        this.winLote = new LOG.lb.lote.View({
                            sm: _this.winGestionarDocumento.smGridDetalles,
                            iddeposito: _this.idDeposito,
                            ubicacion: true,
                            grantedAction: function (_p) {
                                return (_this.grantedAction(_p) && _this.winGestionarDocumento.record.data.estado == '1');
                            },
                            cerrarFn: function () {
                                _this.winGestionarDocumento.stGridDetalles.reload();
                            }
                        });
                        this.winLote.init();
                        this.winLote.view();
                    });
                } else {
                    this.winLote.view();
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RB')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().json.tienelote == 1) {
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
            disabled: true,
            handler: function () {
                LOG.lb.numeroserie.Loader.init(function () {
                    var winNroSerie = new LOG.lb.numeroserie.View({
//                        idproducto: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idproducto,
                        idmovimiento: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idmovimiento,
                        idestructura: _this.idDeposito,
                        producto: _this.winGestionarDocumento.smGridDetalles.getSelected().data,
                        documento: _this.winGestionarDocumento.record.data,
                        grantedAction: function (_p) {
                            return (_this.grantedAction(_p) && _this.winGestionarDocumento.record.data.estado == '1');
                        },
                        cerrarFn: function () {
                            _this.winGestionarDocumento.stGridDetalles.reload();
                        }
                    });
                    winNroSerie.show();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RB')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && this.getSelected().json.equipo == 1) {
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
        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'cambiar',
            text: this.idioma.lbBtnMuniciones,
            disabled: true,
            handler: function () {
                var municiones = new LOG.inv.municiones.View({
                    idestructura: _this.idDeposito,
                    producto: _this.winGestionarDocumento.smGridDetalles.getSelected().data,
                    documento: _this.getSmPrincipal().getSelected().data,
                    grantedAction: function (_p) {
                        return _this.grantedAction(_p);
                    },
                    cerrarFn: function () {
                        _this.winGestionarDocumento.stGridDetalles.reload();
                    }
                });
                municiones.show();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RB')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && this.getSelected().json.municion == 1) {
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
        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: this.idioma.lbBtnRegDiferencia,
            disabled: true,
            handler: function () {
                var winRegistrarDiferencia = new LOG.inv.entrada.registrarDiferencia.View({
                    idmovimiento: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idmovimiento,
                    idestructuracomun: _this.idDeposito,
                    grantedAction: function (_p) {
                        return (_this.grantedAction(_p) && _this.winGestionarDocumento.record.data.estado == '1');
                    }
                });
                winRegistrarDiferencia.show();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
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
        // Fin del bloque.
    },
    initDefaultColumns: function () {
        var _this = this;
        LOG.fac.lecturamedidor.View.superclass.initDefaultColumns.call(this);
        // Bloque de columnas de la interfaz principal.
        LOG.util.UIManager.apply(this.listaColumnas.getItem(8), {
            header: this.idioma.gcContabilizadoPor,
            width: 120
        });
        this.insertGridColumn({
            header: this.idioma.gcProveedor,
            autoExpand: true,
            dataIndex: 'cliente',
            default: true
        }, 3);
        this.addGridColumn({
            dataIndex: 'idcliente',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idoperacion',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idtransporte',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idorganizacion',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'fechadocorigen',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'nrodocorigen',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'nrocontrato',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'fechacontrato',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'nombreconductor',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'ciconductor',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'matricula',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'cartaporte',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'manifiesto',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'partida',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'casilla',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'embarque',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpadre',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'controlfirma',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idnodo',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'iddoc',
            default: true
        });
        // Fin del bloque.
        // Bloque de columnas de la ventana adicionar.
        this.insertGridColumnProductos({
            header: this.idioma.gcRecargo,
            width: 100,
            dataIndex: 'recargo',
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                listeners: {
                    keyup: function () {
                        _this.winGestionarDocumento.smGridDetalles.getSelected().data.r2 = true;
                        _this.winGestionarDocumento.smGridDetalles.getSelected().data.d2 = false;
                    }
                }
            }),
            renderer: function (_v, _mD, _r) {
                var v = _r.json.recargodescuento;
                if (!_r.data.r && Ext.isNumber(parseFloat(v)) && parseFloat(v) > 0) {
                    _r.data.recargo = _r.json.recargodescuento;
                }
                _r.data.r = true;
                if (_this.winGestionarDocumento.smGridDetalles.hasSelection() && !_this.winGestionarDocumento.smGridDetalles.getSelected().data.r2) {
                    _r.data.recargo = null;
                }
                return _r.data.recargo;
            },
            default: true
        }, 6);
        this.insertGridColumnProductos({
            header: this.idioma.gcDescuento,
            width: 100,
            dataIndex: 'descuento',
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                listeners: {
                    keyup: function () {
                        _this.winGestionarDocumento.smGridDetalles.getSelected().data.r2 = false;
                        _this.winGestionarDocumento.smGridDetalles.getSelected().data.d2 = true;
                    }
                }
            }),
            renderer: function (_v, _mD, _r) {
                var v = _r.json.recargodescuento;
                if (!_r.data.d && Ext.isNumber(parseFloat(v)) && parseFloat(v) < 0) {
                    _r.data.descuento = _r.json.recargodescuento.replace('-', '');
                }
                _r.data.d = true;
                if (_this.winGestionarDocumento.smGridDetalles.hasSelection() && !_this.winGestionarDocumento.smGridDetalles.getSelected().data.d2) {
                    _r.data.descuento = null;
                }
                return _r.data.descuento;
            },
            default: true
        }, 7);
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaGridColumnsProductos.getItem(8), {
            editor: LOG.util.Prototipos.inputDecimal()
        });
        // Fin del bloque.
    },
    initVentanaGestion: function (d, t) {
        var _this = this;
        LOG.fac.lecturamedidor.View.superclass.initVentanaGestion.call(this, d, t);
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.btnNuevo, 'handler', function () {
            _this.winGestionarDocumento.tipoVentana = 1;
            _this.habilitarElementos();
        });
    },
    panelSuperior: function () {
        var _this = this;
        var clsDatosRecepion1 = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        clsDatosRecepion1.addComponent(new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCbTipoDocumento,
            hiddenName: 'idoperacion',
            editable: false,
            url: 'cargarComboTipoDocumento',
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            allowBlank: false,
            listeners: {
                select: function () {
                    clsDatosRecepion1.getColumn(2).items.items[0].setValue(null);
                    clsDatosRecepion1.getColumn(3).items.items[0].setValue(null);
                    clsDatosRecepion2.getColumn(0).items.items[0].setValue(null);
                    clsDatosRecepion1.getColumn(2).items.items[0].enable();
                    clsDatosRecepion1.getColumn(3).items.items[0].enable();
                    clsDatosRecepion2.getColumn(0).items.items[0].enable();
                    clsDatosRecepion1.getColumn(2).items.items[0].fireEvent('select');
                    clsDatosRecepion1.getColumn(3).items.items[0].fireEvent('keyup');
                    clsDatosRecepion2.getColumn(0).items.items[0].fireEvent('select');
                }
            }
        }));
        var btnVentana = LOG.util.UIManager.createBtn({
            text: '...',
            tooltip: _this.idioma.ttBtnSeleccionar,
            disabled: true,
            handler: function () {
                if (clsDatosRecepion1.getColumn(0).items.items[0].getValue()) {
                    var win = new LOG.inv.entrada.documento.View({
                        idioma: _this.idioma,
                        title: clsDatosRecepion1.getColumn(0).items.items[0].getRawValue(),
                        idnomoperaciones: clsDatosRecepion1.getColumn(0).items.items[0].getValue(),
                        idestructura: _this.idDeposito,
                        reporteFn: function (btn) {
                            _this.onReport(btn);
                        }
                    });
                    win.init();
                    win.getVistaPrincipal().aceptarFn = function () {
                        clsDatosRecepion1.getColumn(2).items.items[0].setValue(win.getSmPrincipal().getSelected().data.fechacontable);
                        clsDatosRecepion1.getColumn(3).items.items[0].setValue(win.getSmPrincipal().getSelected().data.nrodoc);
                        clsDatosRecepion2.getColumn(0).items.items[0].setValue(win.getSmPrincipal().getSelected().data.idcliente);
                        clsDatosRecepion1.getColumn(0).items.items[0].disable();
                        clsDatosRecepion1.getColumn(2).items.items[0].disable();
                        clsDatosRecepion1.getColumn(3).items.items[0].disable();
                        clsDatosRecepion2.getColumn(0).items.items[0].disable();
                        clsDatosRecepion1.getColumn(2).items.items[0].fireEvent('select');
                        clsDatosRecepion1.getColumn(3).items.items[0].fireEvent('keyup');
                        clsDatosRecepion2.getColumn(0).items.items[0].fireEvent('select');

                        _this.modelo.idpadre = win.getSmPrincipal().getSelected().json.iddocumento;
                        _this.modelo.salvarDocumento({
                            url: '/logistica/inventario/entrada/entrada/index.php/lecturaMedidorcion/cargarProdFacturasOrConduce',
                            iddocumento: _this.modelo.idpadre,
                            idestructuracomun: _this.idDeposito
                        }, function (r) {
                            var _productos = new Array();
                            Ext.each(r[0], function (rec) {
                                rec.idmovimiento = null;
                                _productos.push(rec);
                            });
                            return _productos;
                        }, function (resp) {
                            _this.winGestionarDocumento.record = {};
                            Ext.apply(_this.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: resp.iddocumento,
                                    estado: '1',
                                    idpadre: _this.modelo.idpadre
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
                        }, function () {
                            clsDatosRecepion1.getColumn(2).items.items[0].setValue(null);
                            clsDatosRecepion1.getColumn(3).items.items[0].setValue(null);
                            clsDatosRecepion2.getColumn(0).items.items[0].setValue(null);
                            clsDatosRecepion1.getColumn(0).items.items[0].enable();
                            clsDatosRecepion1.getColumn(2).items.items[0].enable();
                            clsDatosRecepion1.getColumn(3).items.items[0].enable();
                            clsDatosRecepion2.getColumn(0).items.items[0].enable();
                            clsDatosRecepion1.getColumn(2).items.items[0].fireEvent('select');
                            clsDatosRecepion1.getColumn(3).items.items[0].fireEvent('keyup');
                            clsDatosRecepion2.getColumn(0).items.items[0].fireEvent('select');
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
                btnVentana
            ]
        }));
        clsDatosRecepion1.addComponent(new Ext.form.DateField({
            fieldLabel: _this.idioma.lbDfFecha,
            name: 'fechadocorigen',
            editable: false,
            allowBlank: false
        }));
        clsDatosRecepion1.addComponent(LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfNumero,
            name: 'nrodocorigen',
            allowBlank: false
        }));
        clsDatosRecepion1.getColumn(0).columnWidth = 0.32;
        clsDatosRecepion1.getColumn(1).columnWidth = 0.04;
        clsDatosRecepion1.getColumn(2).columnWidth = 0.32;
        clsDatosRecepion1.getColumn(3).columnWidth = 0.32;
        var clsDatosRecepion2 = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        clsDatosRecepion2.addComponent(new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCbSuministrador,
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
            hiddenName: 'idcliente',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            allowBlank: false,
            mode: 'remote',
            pageSize: 10,
            resizable: true
        }));
        clsDatosRecepion2.addComponent(LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfContrato,
            name: 'nrocontrato'
        }));
        clsDatosRecepion2.addComponent(new Ext.form.DateField({
            fieldLabel: _this.idioma.lbDfFecha,
            name: 'fechacontrato',
            editable: false
        }));
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
            columnas: 4
        });
        clsDatosTransp.addComponent(new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCbOrgTransportadora,
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
            hiddenName: 'idorganizacion',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            mode: 'remote',
            pageSize: 10,
            resizable: true
        }));
        clsDatosTransp.addComponent(new Ext.form.TextField({
            fieldLabel: _this.idioma.lbTfNombreConductor,
            name: 'nombreconductor',
            regex: LOG.util.Regex.cadena
        }));
        clsDatosTransp.addComponent(new Ext.form.NumberField({
            fieldLabel: _this.idioma.lbNfCIConductor,
            name: 'ciconductor',
            maxLength: 11,
            minLength: 11
        }));
        clsDatosTransp.addComponent(new Ext.form.TextField({
            fieldLabel: _this.idioma.lbTfChapa,
            name: 'matricula',
            regex: LOG.util.Regex.matricula,
            regexText: _this.idioma.lbChapaIcorrecta,
            emptyText: _this.idioma.lbChapaVacia
        }));
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfCartaPorte,
            name: 'cartaporte'
        }));
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfEmbarque,
            name: 'embarque'
        }));
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbCbManifiesto,
            name: 'manifiesto'
        }));
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfPartida,
            name: 'partida'
        }));
        clsDatosTransp.addComponent(LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfCasilla,
            name: 'casilla'
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
                                new Ext.form.TextArea({
                                    fieldLabel: this.idioma.lbTaObservaciones,
                                    name: 'observaciones',
                                    width: '98%',
                                    height: '40px',
                                    maxLength: 255,
                                    maxLengthText: this.idioma.msgTaTamanoMaximo
                                })
                            ]
                        })
                    ]
                },
                {
                    title: _this.idioma.lbTpDatosTransp,
                    items: [
                        LOG.util.UIManager.initPanel({
                            layout: 'form',
                            labelAlign: 'top',
                            frame: true,
                            items: [
                                new Ext.form.FieldSet({
                                    border: false,
                                    items: [clsDatosTransp]
                                })
                            ]
                        })
                    ]
                }
            ]
        });
        this.formularioGeneral = LOG.util.UIManager.initPanel({
            items: [tab]
        });
    },
    /**
     * Habilita o deshabilita los elementos del panel de datos de acuerdo al estado del documento.
     * @returns {undefined}
     */
    habilitarElementos: function () {
        if (this.winGestionarDocumento.tipoVentana == 2) {
            if (this.winGestionarDocumento.record.data.estado == 1) {
                Ext.each(this.winGestionarDocumento.panelSuperior.findByType('combo'), function (_item) {
                    _item.setDisabled(false);
                });
                Ext.each(this.winGestionarDocumento.panelSuperior.findByType('numberfield'), function (_item) {
                    _item.setDisabled(false);
                });
                Ext.each(this.winGestionarDocumento.panelSuperior.findByType('textfield'), function (_item) {
                    _item.setDisabled(false);
                });
                this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(false);
                if (this.winGestionarDocumento.record.data.idpadre) {
                    this.winGestionarDocumento.panelSuperior.findByType('combo')[0].setDisabled(true);
                    this.winGestionarDocumento.panelSuperior.findByType('combo')[1].setDisabled(true);
                    this.winGestionarDocumento.panelSuperior.findByType('datefield')[0].setDisabled(true);
                    this.winGestionarDocumento.panelSuperior.findByType('numberfield')[0].setDisabled(true);
                    this.winGestionarDocumento.panelSuperior.findByType('button')[0].setDisabled(true);
                } else {
                    this.winGestionarDocumento.panelSuperior.findByType('combo')[0].setDisabled(false);
                    this.winGestionarDocumento.panelSuperior.findByType('combo')[1].setDisabled(false);
                    this.winGestionarDocumento.panelSuperior.findByType('datefield')[0].setDisabled(false);
                    this.winGestionarDocumento.panelSuperior.findByType('numberfield')[0].setDisabled(false);
                    this.winGestionarDocumento.panelSuperior.findByType('button')[0].setDisabled(false);
                }
                this.winGestionarDocumento.buttons[2].show();
            } else {
                Ext.each(this.winGestionarDocumento.panelSuperior.findByType('combo'), function (_item) {
                    _item.setDisabled(true);
                });
                Ext.each(this.winGestionarDocumento.panelSuperior.findByType('numberfield'), function (_item) {
                    _item.setDisabled(true);
                });
                Ext.each(this.winGestionarDocumento.panelSuperior.findByType('textfield'), function (_item) {
                    _item.setDisabled(true);
                });
                this.winGestionarDocumento.panelSuperior.findByType('datefield')[0].setDisabled(true);
                this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(true);
                this.winGestionarDocumento.panelSuperior.findByType('button')[0].setDisabled(true);
                this.winGestionarDocumento.buttons[2].hide();
            }
            this.winGestionarDocumento.buttons[1].hide();
        } else {
            this.winGestionarDocumento.setTitle(this.idioma.tlAdicionar);
            Ext.each(this.winGestionarDocumento.panelSuperior.findByType('combo'), function (_item) {
                _item.setDisabled(false);
            });
            Ext.each(this.winGestionarDocumento.panelSuperior.findByType('numberfield'), function (_item) {
                _item.setDisabled(false);
            });
            Ext.each(this.winGestionarDocumento.panelSuperior.findByType('textfield'), function (_item) {
                _item.setDisabled(false);
            });
            this.winGestionarDocumento.panelSuperior.findByType('datefield')[0].setDisabled(false);
            this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(false);
            this.winGestionarDocumento.panelSuperior.findByType('button')[0].setDisabled(false);
            this.winGestionarDocumento.buttons[1].show();
            this.winGestionarDocumento.buttons[2].show();
        }
    },
    /**
     * Habilita o deshabilita la edicion del movimiento.
     * @returns {undefined}
     */
    habilitarEdicion: function () {
        var _this = this;
        var grid = this.winGestionarDocumento.gridDetalles;
        grid.rowEditor.on({
            beforeedit: function (e) {
                this.disabledFields = new Array();
                var rec = grid.getSelectionModel().getSelected();
                if (LOG.util.UIManager.isRecordValue(rec, 'equipo', 1) || LOG.util.UIManager.isRecordValue(rec, 'municion', 1)
                    || LOG.util.UIManager.isRecordValue(rec, 'tienelote', 1)) {
                    grid.rowEditor.disabledFields.push('cantidad');
                }
                if (_this.winGestionarDocumento.record != null && _this.winGestionarDocumento.record.data.estado != '1') {
                    return false;
                }
                return true;
            },
            afteredit: function (e) {
                _this.winGestionarDocumento.editarProducto(e);
            }
        });
    },
    onReport: function (btn) {
        var _this = this;
        var has = _this.getGridPrincipal().getSelectionModel().hasSelection();
        var record = _this.getGridPrincipal().getSelectionModel().getSelected();
        this.sm = _this.getGridPrincipal().getSelectionModel();
        this.control = new LOG.util.Report({
            sm: _this.getGridPrincipal().getSelectionModel(),
            useSign: (window.useSign && typeof pki == 'object'),
            idioma: this.idioma,
            acciones: this.acciones,
            st: _this.getStorePrincipal(),
            reports: [
                {
                    name: btn.name,
                    typeView: 3,
                    record: record,
                    status: LOG.lb.documento.Estado,
                    limit: 3,
                    isList: btn.isList,
                    params: {
                        useSign: this.useSign,
                        hasCategoria: (usarCategoria) ? 'true' : 'false',
                        iddoc: (has) ? record.get("iddoc") : null,
                        idnodo: (has) ? record.get("idnodo") : null,
                        iddir: (idespaciotrabajo && idespaciotrabajo != undefined) ? idespaciotrabajo : null,
                        iddocumento: ((has)) ? record.get("iddocumento") : null,
                        tiporeclamo: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
                        fechavencimineto: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d-m-Y') : null,
                        idestado: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
                        estadoejecucion: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
                        cliente: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null
                    },
                    dirdirReporttn.dirReports,
                detailFirma
        :
        {
            fullName: 'Nombres y Apellidos',
                fechaCreacion
        :
            'Fecha de creación',
                detalleFirma
        :
            'Detalles de la firma',
                1
        :
            'Elaborado y Firmado por',
                2
        :
            'Aprobado y Firmado por'
        }
        ,
        browserAdvanz: {
        }
    }
]
})
;
this.control.view('1');
}
})
;
LOG.fac.ListDocuments = Ext.extend(Ext.Window, {
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        _this.title = this.idioma.titlelistadodocumentos;
        _this.closeAction = 'destroy';
        _this.layout = 'border';
        _this.resizable = false;
        _this.modal = true;
        _this.width = 600;
        _this.height = 465;
        _this.listeners = {
            'show': function () {
                Ext.getBody().unmask();
            }
        };
        this.lbServicio = {html: this.idioma.msgErrorservicioInDocNotAprobado + this.data.servicio + this.idioma.msgErrorConsumidoresInDocNotAprobado};
        /**----------------Fieldset de datos del documento-----------------------------------**/
        this.fieldsetDatosDoc = new Ext.form.FieldSet({
            height: 70,
            layout: 'column',
            defaults: {frame: false, layout: 'form'},
            items: [
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [this.lbServicio]
                }
            ]
        });
        this.formInfo = new Ext.FormPanel({
            layout: 'form',
            frame: true,
            items: [this.fieldsetDatosDoc]
        });
        this.nfNDoc = new Ext.form.NumberField({
            width: 80,
            enableKeyEvents: true,
            allowNegative: false,
            maxLength: 10,
            listeners: {
                'specialkey': function (me, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.onSearchDocument();
                    }
                }
            }
        });
        this.smListadoDoc = new Ext.grid.RowSelectionModel({singleSelect: false});


        this.stListadoDoc = new Ext.data.Store({
            url: 'listarDocumentos',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                fields: [
                    {name: 'iddocumento'},
                    {name: 'nrodoc'},
                    {name: 'servicio'},
                    {name: 'idservicio'},
                    {name: 'codigocontrato'},
                    {name: 'clientes'},
                    {name: 'fechacontable' /*, type: 'date'*/},
                    {name: 'estado'}
                ],
            }), listeners: {
                'beforeload': function (st, opt) {
                    st.baseParams.accion = 'dc';
                    st.baseParams.idservicio = _this.data.idservicio;
                    st.baseParams.idclientes = _this.data.idclientes;
                    st.baseParams.limit = _this.gpListadoDoc.getBottomToolbar().cbPageSize.getValue();
                }
            }
        });
        this.gpListadoDoc = new Ext.grid.GridPanel({
            cls: 'x-toolbar',
            autoExpandColumn: 'clientes',
            sm: this.smListadoDoc,
            store: this.stListadoDoc,
            loadMask: {
                store: this.stListadoDoc,
                msg: this.idioma.textCargandoDocs
            },
            columns: [
                new Ext.grid.RowNumberer({header: this.idioma.lbnum, width: 30, aling: 'center'}),
                {header: this.idioma.lbnumDoc, width: 95, dataIndex: 'nrodoc', align: 'center'},
                {header: this.idioma.lbStatus, width: 90, dataIndex: 'estado'},
                {header: this.idioma.lbCliente1, width: 250, dataIndex: 'clientes', id: 'clientes'},
                {header: this.idioma.lbContrato, width: 100, dataIndex: 'codigocontrato'},
                {header: this.idioma.lbFecha, width: 90, dataIndex: 'fechacontable' /*, renderer: this.onFormatoFecha*/}
            ],
            tbar: [new Ext.Toolbar.TextItem(this.idioma.lbnumDoc + ':'), this.nfNDoc],
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: this.stListadoDoc,
                displayInfo: true
            })
        });

        _this.items = [
            {
                region: 'north',
                height: 90,
                layout: 'fit',
                items: [this.formInfo]
            },
            {
                region: 'center',
                layout: 'fit',
                items: [this.gpListadoDoc]
            }
        ];
        LOG.fac.ListDocuments.superclass.constructor.apply(this, arguments);
    },
    displayUILectura: function () {
        var _this = this;
        this.tpAddPersonas = new LOG.fac.UITemplate({
            idioma: _this.idioma,
            urlBusquedaGridPrincipal: 'getDatosPrincipalesPersonas',
            formaVisualizacion: 'ventana',
            modoSeleccion: 3,
            addToolbar: false,
            autoShow: true,
            height: 470,
            width: 1000,
            title: this.idioma.lbTitleAdicionarPersonas,
            aceptarFn: function () {
                _this.onAccept({
                    first: _this.tpAddPersonas,
                    last: _this.tpPersonas,
                    totalProperty: 3, //_this.tpUnidadesTransporte.getSmPrincipal().getSelected().get('capacidad'),
                    value: _this.tpPersonas.idProperty,
                    msg: _this.idioma.lbMsgAddPersonasDeMas.replace('_', _this.tpUnidadesTransporte.getSmPrincipal().getSelected().get('capacidad'))
                });
            },
            usarAplicar: true,
            gColumns: this.crearColumns(3)
        });
        this.tpAddPersonas.init();
        this.tpAddPersonas.view();
        this.tpAddPersonas.getStorePrincipal().reload();
    },
});
/**------------Validar campos numericos  que uno no sea mayor que el otro-----------------------------**/
Ext.apply(Ext.form.VTypes, {
    numberRange: function (val, field) {
        if (!val) {
            return;
        }
        if (field.mayorque && field.lectura.getSelected()) {
            var valor = field.lectura.getSelected().get(field.mayorque);
            if (valor && (valor >= field.getValue())) {
                return false;
            } else {
                field.clearInvalid();
                return true;
            }
        }
        return true;
    },
    numberRangeText: this.idioma.msgErrorNuevaLectura
});
LOG.fac.LecturaView = Ext.extend(Ext.Window, {
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        _this.title = this.idioma.titLecturas;
        _this.closeAction = 'destroy';
        _this.layout = 'fit';
        _this.resizable = false;
        _this.modal = true;
        _this.width = 1000;
        _this.height = 500;
        _this.listeners = {
            'show': function () {
                Ext.getBody().unmask();
            }
        };
        var iddocumento = this._this.documento.data.iddocumento;
        var enElaboracion = this._this.documento.data.idestado == 1;
        var confirmado = this._this.documento.data.idestado == 2;
        var aprobado = this._this.documento.data.idestado == 3;
        var huboCambios = false;
        _this.registrar = false;
        /**---------------------SelectionModel ---record seleccionado-------**/
        _this.lectura = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                'rowdeselect': function () {
                    if (enElaboracion) {
                        _this.btnEliminar.disable();
                    }
                }
            }
        });
        /**-------------Botones ----------------------------------------------------------------**/
        _this.btnAdicionar = new Ext.Button({
            disabled: !enElaboracion,
            text: this.idioma.lbBtnAdicionar,
            tooltip: this.idioma.tooltipAdicClientDoc,
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn'
        });
        _this.btnEliminar = new Ext.Button({
            disabled: true,
            text: this.idioma.lbBtnEliminar,
            tooltip: this.idioma.tooltipElimClientDoc,
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn'
        });
        _this.btnConfirmar = new Ext.Button({
            disabled: !enElaboracion,
            tooltip: this.idioma.tooltipConfirDoc,
            iconCls: 'btn',
            icon: perfil.dirImg + 'confirmar.png',
            text: this.idioma.lbBtnConfirmar
        });
        _this.btnAnularStatus = new Ext.Button({
            disabled: !this.confirmado,
            tooltip: this.idioma.tooltipAnulStatDoc,
            iconCls: 'btn',
            icon: perfil.dirImg + 'cancelarestado.png',
            text: this.idioma.lbBtnAnularStatus
        });
        _this.btnImprimirmodelo = new Ext.Button({
            /*disabled: true,*/
            tooltip: this.idioma.tooltipImpModeloDoc,
            iconCls: 'btn',
            icon: perfil.dirImg + 'imprimir.png',
            text: this.idioma.lbBtnImprimirModelo
        });
        /**----------------Botones-----------------------------------------------------**/

        _this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: this.idioma.lbBtnAceptar,
            tooltip: this.idioma.tooltipAceptar
        });
        _this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            text: this.idioma.lbBtnAplicar,
            tooltip: this.idioma.tooltipAplicar
        });

        /**------------------Label Importe total-----------------------------------**/
        var importeTotal = new Ext.form.Label({html: '-', autoShow: true});

        _this.labelNumeroDoc = {html: this.idioma.lbNumDoc};
        _this.labelFechaemision = {html: this.idioma.lbFechaEmisionDoc};
        _this.labelEstadoDoc = {html: this.idioma.lbEstadoDoc};
        _this.valorNumeroDoc = new Ext.form.Label({html: _this.documento.data.nrodoc, autoShow: true});
        _this.valorFechaemision = {html: this.formatoFecha(_this.documento.data.fechacontable) || '-', autoShow: true};
        _this.valorEstado = new Ext.form.Label({
            html: '<div id="estado">' + _this.documento.data.estado + '</div>',
            autoShow: true
        });

        /**----------------Fieldset de datos del documento-----------------------------------**/
        _this.fieldsetDatosDoc = new Ext.form.FieldSet({
            height: 90,
            title: this.idioma.lbTitDatosDoc,
            layout: 'column',
            defaults: {frame: false, layout: 'form', bodyStyle: 'padding:5px'},
            items: [
                {
                    columnWidth: .15,
                    layout: 'form',
                    items: [this.labelNumeroDoc, this.labelFechaemision, this.labelEstadoDoc]
                },
                {
                    columnWidth: .85,
                    layout: 'form',
                    items: [this.valorNumeroDoc, this.valorFechaemision, this.valorEstado]
                }
            ]

        });

        /**--------------Columnas tipo de precio y nueva lectura para poner o quitar editor -------------------------------**/
        var columnaTipoPrecio = {
            header: this.idioma.lbTipoprecio,
            width: 100,
            dataIndex: 'tipoprecio',
            renderer: this.marcarColumnaSiVacia,
            align: 'center'
        };
        var columnaNuevaLectura = {
            header: this.idioma.lNuevalectura,
            width: 100,
            align: 'right',
            dataIndex: 'nuevalectura',
            renderer: this.marcarColumnaSiVacia
        };
        if (enElaboracion) {
            columnaTipoPrecio.editor = new Ext.form.ComboBox({
                emptyText: this.idioma.comboVacio,
                editable: false,
                allowBlank: false,
                store: [this.idioma.stPrecioVenta, this.idioma.stPrecioPromedio], //'Precio venta', 'Precio promedio'],
                disabled: !enElaboracion,
                valueField: 'id',
                displayField: 'tipoprecio',
                forceSelection: true,
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus: true,
                anchor: '100%',
                listeners: {
                    'select': {
                        fn: function (th) {
                            var lectura = _this.lecturaSeleccionada();
                            var precio = th.getValue() == 'Precio venta' ? lectura.get('precioventa') : lectura.get('preciopromedio');
                            lectura.set('precio', precio);
                            _this.actualizarValoresGrid(lectura);

                        }
                    }
                }
            });
            columnaNuevaLectura.editor = new Ext.form.NumberField({
                vtype: 'numberRange',
                lectura: this.lectura,
                mayorque: 'medicion',
                emptyText: this.idioma.lbNuevaLectura,
                allowNegative: false,
                validator: validatorNuevaLectoraMayor
            });
        }
        _this.listadoLecturas = new Ext.data.JsonStore({
            url: 'listarLecturasMedidor',
            root: "datos",
            totalProperty: "cantidad",
            fields: [
                {name: 'iddocumedcliente'},
                {name: 'codigocliente'},
                {name: 'cliente'},
                {name: 'idcontrato'},
                {name: 'contrato'},
                {name: 'idestado'},
                {name: 'fechamedicion', type: 'date', dateFormat: 'd/m/Y'},
                {name: 'medicion', type: 'float'},
                {name: 'idindicador'},
                {name: 'nuevalectura', type: 'float'},
                {name: 'precioventa', type: 'float'},
                {name: 'preciopromedio', type: 'float'},
                {name: 'idmedicioncliente'},
                {name: 'iddocumento'}
            ]
        });
        /**--------------Grid para listar las lecturas---------------------------------------------**/
        _this.lecturaGrid = new Ext.grid.EditorGridPanel({
            cls: 'x-toolbar',
            autoExpandColumn: 'expandir',
            sm: this.lectura,
            region: 'center',
            clicksToEdit: 1,
            store: _this.listadoLecturas,
            loadMask: {
                store: _this.listadoLecturas,
                msg: this.idioma.textCargandoMed
            },
            columns: [
                new Ext.grid.RowNumberer(),
                {header: this.idioma.lbCodigoDelConsumidor, width: 150, dataIndex: 'codigocliente'},
                {header: this.idioma.lbCliente1, width: 150, dataIndex: 'cliente', id: 'expandir'},
                {
                    header: this.idioma.lbFechaultimaLectura,
                    width: 120,
                    align: 'center',
                    dataIndex: 'fechamedicion',
                    renderer: this.formatoFecha
                },
                {header: this.idioma.lbUltimaLectura, width: 90, align: 'right', dataIndex: 'medicion'},
                columnaNuevaLectura,
                {
                    header: this.idioma.lbCantidad,
                    width: 70,
                    align: 'right',
                    dataIndex: 'cantidad',
                    renderer: this.calcularCantidad
                },
                {hidden: true, hideable: false, dataIndex: 'idcontrato'},
                {hidden: true, hideable: false, dataIndex: 'iddocumedcliente'},
                {hidden: true, hideable: false, dataIndex: 'precioventa'},
                {hidden: true, hideable: false, dataIndex: 'preciopromedio'}
            ],
            tbar: [
                new Ext.Toolbar.TextItem(this.idioma.lbCodigo + ':'), this.buscarCodigo, '-',
                new Ext.Toolbar.TextItem(this.idioma.lbCliente1 + ':'), this.buscarCliente,
                this.btnBuscar, this.btnLimpiar],
            bbar: new Ext.PagingToolbar({
                pageSize: 5,
                store: _this.listadoLecturas,
                displayInfo: true
            })
        });
        _this.buttons = [
            this.btnCancelar
        ];
        _this.items = [
            {
                layout: 'border',
                frame: true,
                items: [
                    {
                        xtype: 'panel',
                        layout: 'form',
                        region: 'north',
                        autoHeight: true,
                        tbar: [this.btnAdicionar, this.btnEliminar, this.btnConfirmar, this.btnAnularStatus, '->', this.btnAyuda],
                        items: [this.fieldsetDatosDoc]
                    },
                    _this.lecturaGrid
                ]
            }
        ];

        /**----------------Eventos----------------------------------------**/
        _this.lectura.on('rowselect', function () {
            _this.cambiarEstadoBtn(false);
        }, _this);

        _this.btnAdicionar.on('click', function () {
            var contratos = this.obtenerContratos();
            _this.registrar = true;
            var obj = new Logistica.lecturamedidor.VistaClientes(idioma, modelo, documento, contratos, this);
            obj.mostrar();
        }, _this);

        _this.btnEliminar.on('click', function () {
            _this.eliminarLectura(_this.listadoLecturas.getTotalCount());
        }, _this);

        _this.btnConfirmar.on('click', function () {
            _this.win.confirmar(iddocumento, _this);
            _this.actualizarEstadoBotones;
        }, _this);

        _this.btnAnularStatus.on('click', function () {
            _this.win.anularStatus(iddocumento, _this);
        }, _this);

        _this.btnImprimirmodelo.on('click', function () {
            _this.win.imprimirDocumento(iddocumento);
        }, _this);

        _this.btnAceptar.on('click', function () {
            _this.guardar(true);
        }, _this);

        _this.btnAplicar.on('click', function () {
            _this.guardar(false);
        }, _this);
        _this.btnCancelar.on('click', function () {
            _this.ocultar();
        }, _this);

        _this.btnBuscar.on('click', function () {
            _this.buscar();
        }, _this);

        _this.btnLimpiar.on('click', function () {
            _this.limpiar();
        }, _this);

        _this.listado.on('afteredit', function (e) {
            if (e.field == 'nuevalectura')
                _this.actualizarValoresGrid(e.record);
        }, _this);

        _this.listadoLecturas.on('beforeload', function (st) {
            st.baseParams.idservicio = _this.documento.data.idservicio;
            st.baseParams.iddocumento = _this.documento.data.iddocumento;
            st.baseParams.limit = _this.listado.getBottomToolbar().cbPageSize.getValue();
        }, _this);

        _this.listadoLecturas.on('load', function (store, records) {
            _this.cambiarEstadoBtn(true);
            _this.actualizarImporteTotal();
        }, _this);

        _this.ventana.on('destroy', function () {
            if (huboCambios)
                _this.win.cargar();
        });
        _this.buscarCodigo.on('keyup', _this.cambiarEstadoBtnBuscar);
        _this.buscarCliente.on('keyup', _this.cambiarEstadoBtnBuscar);

        LOG.fac.LecturaView.superclass.constructor.apply(this, arguments);
    },
    /**--------------- Muestra la ventana para listar las lecturas.-----------**/
    mostrar: function () {
        _this.listadoLecturas.removeAll();
        this.ventana.doLayout();
        this.ventana.show();
        this.cargar();
    },
    /**--------------Ocultar la ventana--------------------------------**/
    ocultar: function () {
        this.ventana.close();
    },
    /**------------Cambiar el estado de los botones(habilitar/desabilitar)----------------------------**/
    cambiarEstadoBtn: function (estado) {
        if (enElaboracion)
            this.btnEliminar.setDisabled(estado);
    },
    /**-----------Cambiar estado de los botones-------------------------------------**/

    actualizarEstadoBotones: function (idestado) {
        if (idestado == 1) {
            this.btnConfirmar.setDisabled(false);
            this.btnAdicionar.setDisabled(false);
            this.valorEstado.setText('Elaboración');

        } else {
            this.btnConfirmar.setDisabled(true);
            this.btnAdicionar.setDisabled(true);
        }
        if (idestado == 2) {
            if (Ext.getDom('estado'))
                Ext.getDom('estado').innerHTML = 'Preparado';
            this.valorEstado.setText('Preparado');
            this.btnAnularStatus.setDisabled(false);
        } else {
            this.btnAnularStatus.setDisabled(true);
        }
    },
    /**-------------Cargar mediciones----------------------------------------**/
    cargar: function () {
        var params = (params) ? params : {};
        params.start = 0;
        params.limit = 5;
        params.idservicio = _this.documento.data.idservicio;
        params.iddocumento = _this.documento.data.iddocumento;
        _this.listadoLecturas.load({params: params});
    },
    /**----------------Realizar la busqueda----------------------------------**/
    buscar: function () {
        var params = (params) ? params : {};
        params.start = 0;
        params.limit = 5;
        params.codigo = this.buscarCodigo.getValue();
        params.cliente = this.buscarCliente.getValue();
        params.iddocumento = _this.documento.data.iddocumento;
        params.idestado = _this.documento.data.idestado;
        params.idindicador = _this.documento.data.idindicador;
        _this.listadoLecturas.load({
            params: params,
            callback: function () {
                if (_this.listadoLecturas.getCount() == 0)
                    mostrarMensaje(1, this.idioma.msgNoExisteDatos);
            }
        });
    },
    /*----------------Limpiar------------------------------------- */
    limpiar: function () {
        this.buscarCodigo.reset();
        this.buscarCliente.reset();
        this.cargar();
    },
    /**------------------Actualizar campos Cantidad, Importe, Importe total del grid------------------------**/
    actualizarValoresGrid: function (lectura) {
        var cantidad = lectura.get('nuevalectura') - lectura.get('medicion');
        lectura.set('cantidad', cantidad);
        var importe = cantidad * lectura.get('precio');
        lectura.set('importe', importe);
        this.actualizarImporteTotal();
    },
    /**----------------Obtener los ids de los contratos-------------------**/
    obtenerContratos: function () {
        var idsclientes = [];
        _this.listadoLecturas.each(function (cliente) {
            idsclientes.push(cliente.data.idcontrato);
        });
        return idsclientes;
    },
    /**-----------Obtener records con cambios----------------------------------------**/
    obtenerRecordsModificardos: function () {
        var result = [];
        var modified = _this.listadoLecturas.getModifiedRecords();
        Ext.each(modified, function (record) {
            if (record.data.importe || record.data.tipoprecio)
                result.push(record);
        });
        return result;
    },
    /**-------------Obtener Cambios hechos en el grid---------------------------------------------------------**/
    getMediciones: function () {
        var result = {};
        result.cambios = [];
        result.tipoprecio = true;
        result.precio = true;
        var modified = _this.listadoLecturas.getModifiedRecords();

        if (!Ext.isEmpty(modified)) {
            Ext.each(modified, function (record) {
                if (!record.data.tipoprecio)
                    result.tipoprecio = false;
                if (!record.data.precio)
                    result.precio = false;
                result.cambios.push({
                    idmedicioncliente: record.data.idmedicioncliente,
                    iddocumento: record.data.iddocumento,
                    fechamedicion: record.data.fechamedicion,
                    medicion: record.data.nuevalectura,
                    cantidad: record.data.cantidad,
                    importe: record.data.importe,
                    tipoprecio: record.data.tipoprecio
                });
            });
        }
        return result;
    },
    /**--------------Guardar los cambios de las mediciones----------------------------------**/
    guardar: function (aplicar) {
        var mediciones = this.getMediciones();
        if (mediciones.cambios.length > 0) {
            var params = {};
            params.mediciones = Ext.encode(mediciones.cambios);
            _this.ventana.getEl().mask(this.idioma.textGuardandoMed, 'x-mask-loading');
            Ext.Ajax.request({
                url: 'guardarLecturas',
                params: params,
                method: 'POST',
                callback: function (options, success, response) {
                    _this.ventana.getEl().unmask();
                    var result = Ext.decode(response.responseText);
                    if (result.success == true) {
                        if (aplicar)
                            _this.ocultar();
                        _this.listadoLecturas.commitChanges();
                        mostrarMensaje(1, this.idioma.msgLesturasGuardadas);
                    } else {
                        _this.listadoLecturas.reload();
                        _this.listadoLecturas.rejectChanges();
                        mostrarMensaje(1, this.idioma.msgErrorLesturas);
                    }
                }
            });
        } else
            mostrarMensaje(1, this.idioma.msgErrorRegistrar);
    },
    eliminarLectura: function (cant) {
        var msgs = [this.idioma.msgEliminarLectura, this.idioma.msgLecEliminada, this.idioma.msgErrorEliminandoMed, this.idioma.msgEliminandoMed];
        this.enviar('eliminarMidicionCliente', msgs);
    },
    enviar: function (url, msgs, cant) {
        var params = {};
        params.idmedicioncliente = this.lecturaSeleccionada().data.idmedicioncliente;
        mostrarMensaje(2, msgs[0], function (btnPresionado) {
            if (btnPresionado == 'ok') {
                Ext.getBody().mask(msgs[3], 'x-mask-loading');
                if (url != 'eliminarMidicionCliente')
                    _this.ocultar();
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: params,
                    callback: function (options, success, response) {
                        Ext.getBody().unmask();
                        var result = Ext.decode(response.responseText);
                        if (result.success == true) {
                            huboCambios = true;
                            _this.listadoLecturas.reload();
                            mostrarMensaje(1, msgs[1]);
                        } else
                            mostrarMensaje(1, msgs[2]); //mensaje error

                    }
                });
            }
        });
    },
    adicionarMediciones: function (clientes) {
        Record = Ext.data.Record.create(_this.listadoLecturas.fields.items);
        huboCambios = true;
        Ext.each(clientes, function (cliente) {
            var r = new Record({});
            r.data.idmedicioncliente = cliente.idmedicioncliente;
            r.data.codigocliente = cliente.codigocliente;
            r.data.medicion = 0;
            r.data.idcontrato = cliente.idcontrato;
            r.data.iddocumedcliente = cliente.iddocumedcliente;
            _this.listadoLecturas.add(r);
        });
    },
    cambiarEstadoBtnBuscar: function () {
        var estado = _this.buscarCodigo.getValue() || _this.buscarCliente.getValue() ? false : true;
        _this.btnBuscar.setDisabled(estado);
    },
    lecturaSeleccionada: function () {
        return this.lectura.getSelected();
    },
    formatoFecha: function (val) {
        return Ext.util.Format.date(val, 'd/m/Y');
    },
    actualizarImporteTotal: function () {
        var impTotal = _this.listadoLecturas.sum('importe');
        var valor = (impTotal > 0) ? impTotal : '0.00';
        importeTotal.setText(valor);
    },
    calcularCantidad: function (val, metadata, lectura) {
        return lectura.get('nuevalectura') ? lectura.get('nuevalectura') - lectura.get('medicion') : '<span style="color:red;">' + ' ? ';
    },
    calcularImporte: function (val, metadata, lectura) {
        if (lectura.get('nuevalectura')) {
            var valor = (lectura.get('nuevalectura') - lectura.get('medicion')) * lectura.get('precio');
            lectura.set('importe', valor);
        }
        return lectura.get('nuevalectura') ? (lectura.get('nuevalectura') - lectura.get('medicion')) * lectura.get('precio') : '<span style="color:red;">' + ' ? ';
    },
    marcarColumnaSiVacia: function (val) {
        return val ? val : '<span style="color:red;">' + ' ? ';
    },
    validatorNuevaLectoraMayor: function (val) {
        if (_this.lectura.getSelected() && val > _this.lectura.getSelected().get('medicion')) {
            return true;
        } else {
            return false;
        }
    }
});
LOG.fac.AddDocumentView = Ext.extend(Ext.Window, {
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        _this.title = (!this.mod) ? this.idioma.lbTitAdicionarDocLectura : this.idioma.lbTitModificarDocLectura;
        _this.closeAction = 'close';
        _this.layout = 'border';
        _this.resizable = false;
        _this.modal = true;
        _this.width = 642;
        _this.height = 575;
        _this.listeners = {
            'beforeclose': {
                fn: function () {
                    if (_this.mod == true) {
                        if (_this.storeConsumidores.getCount() == 0) {
                            mostrarMensaje(1, _this.idioma.msgVerifiqueCamposIncorrectos);
                            return false;
                        } else {
                            _this.ventana.hide();
                        }
                    } else {
                        _this.ventana.hide();
                    }
                },
                scope: this
            },
            'hide': function () {
                _this.ventana.destroy();
                vistaDoc.desbloqueardoc();
            }
        };

        this.idproducto = null;

        var cantAnterior = 0;
        this.storeConsumidores = new Ext.data.JsonStore({
            url: 'listarClientes',
            root: "datos",
            totalProperty: 'cantidad',
            change: false,
            autoSave: true,
            fields: [
                {name: 'idmedicioncliente', mapping: 'idmedicioncliente'},
                {name: 'codigocliente', mapping: 'codigocliente'},
                {name: 'codigocontrato', mapping: 'codigocontrato'},
                {name: 'idcontrato', mapping: 'idcontrato'},
                {name: 'cliente', mapping: 'cliente'},
                {name: 'idcliente', mapping: 'idcliente'},
                {name: 'numerocontrato', mapping: 'numerocontrato'},
                {name: 'select'}
            ],
            listeners: {
                'beforeload': function (st, opts) {
                    cantAnterior = st.getCount();
                },
                'load': function (st, records, opts) {
                    st.change = (st.getCount() != cantAnterior) ? true : false;
                }
            }
        });

        this.consumidor = new Ext.grid.CheckboxSelectionModel();
        this.storeServicios = new Ext.data.JsonStore({
            url: 'cargarServicios',
            root: "datos",
            autoLoad: true,
            fields: [
                {name: 'idservicio', mapping: 'idservicio'},
                {name: 'servicio', mapping: 'denominacion'}
            ]
        });

        this.comboServicios = new Ext.form.ComboBox({
            emptyText: _this.idioma.comboVacio,
            fieldLabel: _this.idioma.lbServicios,
            allowBlank: false,
            disabled: false,
            editable: false,
            store: _this.storeServicios,
            valueField: 'idservicio',
            displayField: 'servicio',
            hiddenName: 'idservicio',
            forceSelection: true,
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '100%'
        });

        this.storeServicios.on('load', function (st, records, opts) {//
            if (_this.storeServicios.getCount() == 0) {
                if (_this.storeServicios.reader.jsonData.noServicio) {
                    mostrarMensaje(1, _this.idioma.msgErrorNoServicioConfigurado);
                } else if (_this.storeServicios.reader.jsonData.noOperacion) {
                    mostrarMensaje(1, _this.idioma.msgErrorNoServicioConOperacion);
                }
            }
            _this.ventana.getEl().unmask();
            if (records.length == 1) {
                _this.comboServicios.setValue(records[0].data.idservicio);
                _this.comboServicios.fireEvent('select', _this.comboServicios, records[0]);
            }
            if (mod) {
                _this.comboServicios.setValue(docSeleccionado.data.idservicio);
                _this.comboServicios.setRawValue(docSeleccionado.data.servicio);
            }
        });

        /**
         *  Botones adicionar y elimanar
         */
        this.btnAdicionar = new Ext.Button({
            text: _this.idioma.lbBtnAdicionar,
            tooltip: _this.idioma.tooltipAdicCliente,
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn'
        });

        this.btnEliminar = new Ext.Button({
            disabled: true,
            text: _this.idioma.lbBtnEliminar,
            tooltip: _this.idioma.tooltipElimClientDoc,
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn'
        });

        this.labelNumeroDoc = {html: _this.idioma.lbNumDoc};
        this.labelFechaemision = {html: _this.idioma.lbFechaEmisionDoc};
        this.labelEstadoDoc = {html: _this.idioma.lbEstadoDoc};

        this.valorFechaemision = {html: (mod) ? " <div id='idEncabezado'>" + (docSeleccionado.data.fechacontable).format('d/m/Y') + "</div>" : " <div id='idEncabezado'></div>"};
        this.valorEstado = {html: (mod) ? " <div id='idEstatus'>" + docSeleccionado.data.estado + "</div>" : " <div id='idEstatus'></div>"};
        this.valorNumeroDoc = {html: (mod) ? " <div id='idNumerodoc'>" + docSeleccionado.data.nrodoc + "</div>" : " <div id='idNumerodoc'></div>"};

        /**
         *  Fieldset de datos del documento
         */
        this.fieldsetDatosDoc = new Ext.form.FieldSet({
            height: 80,
            title: _this.idioma.lbTitDatosDoc,
            layout: 'column',
            defaults: {frame: false, layout: 'form'},
            items: [
                {
                    columnWidth: .30,
                    layout: 'form',
                    items: [this.labelNumeroDoc, this.labelFechaemision, this.labelEstadoDoc]
                },
                {
                    columnWidth: .70,
                    layout: 'form',
                    items: [this.valorNumeroDoc, this.valorFechaemision, this.valorEstado]
                }
            ]
        });

        this.objDatosCliente = new Contratacion.Cmpgestionarcontrato({
            tipocomponente: 'panel',
            idcomponente: 'idpropio1',
            seleccionSimple: false,
            noUsarBtnAdicionar: true,
            noUsarBtnModificar: true,
            noUsarBtnEliminar: true,
            noUsarBtnConfirmar: true,
            noUsarBtnActivar: true,
            noUsarBtnDesactivar: true,
            noUsarBtnCambiarEstatus: true,
            noUsarVerdetalles: true,
            noUsarImprimir: true,
            noUsarBtnAyuda: true,
            seleccionarDobleClic: true,
            puedemodificar: false,
            puedemodificarparcial: false
        });

        this.objDatosCliente.Inicializar();
        this.gridpanel = this.objDatosCliente.gGridContrato;
        this.gridpanel.getBottomToolbar().cbPageSize.setValue(5);

        this.gridpanel.getStore().on('beforeload', function (store, records, op) {
            store.baseParams.idservicio = (_this.comboServicios.getValue()) ? _this.comboServicios.getValue() : -1;
            store.baseParams.estatusactivacion = 1;
            store.baseParams.estatus = 86;
        });
        if (!mod)
            this.gridpanel.getStore().reload();

        this.gridpanel.getStore().on('load', function (store, records, op) {
            if (!_this.comboServicios.getValue()) {
                store.removeAll();
            }
            if (_this.gridpanel.getBottomToolbar().items.items[4])
                _this.gridpanel.getBottomToolbar().items.items[4].el.value = 1;

        });

        if (!mod) {
            this.objDatosCliente.fpFiltroContrato.setSize(85, 85);
            this.gridpanel.getColumnModel().setColumnWidth(0, 30);
            this.gridpanel.getColumnModel().setColumnHeader(this.gridpanel.getColumnModel().findColumnIndex('codigocliente'), _this.idioma.lbCodigoDelConsumidor);
            this.gridpanel.getColumnModel().setColumnHeader(this.gridpanel.getColumnModel().findColumnIndex('cliente'), _this.idioma.lbCliente1);
            this.gridpanel.getColumnModel().setHidden(this.gridpanel.getColumnModel().findColumnIndex('fechacreacion'), true);
            this.gridpanel.getColumnModel().setHidden(this.gridpanel.getColumnModel().findColumnIndex('estatus'), true);
            this.gridpanel.getColumnModel().setHidden(this.gridpanel.getColumnModel().findColumnIndex('entidad'), true);
            this.gridpanel.getColumnModel().setHidden(this.gridpanel.getColumnModel().findColumnIndex('activo'), true);
            this.gridpanel.getColumnModel().setColumnWidth(this.gridpanel.getColumnModel().findColumnIndex('cliente'), 150);
        }

        this.objDatosCliente.btnEliminar.disable();

        /**
         *  Grid para listar los consumidores
         */
        this.listado = new Ext.grid.GridPanel({
            title: '<b>' + _this.idioma.lbTitConsumidores + '</b>',
            cls: 'x-toolbar',
            autoExpandColumn: 'exp',
            sm: this.consumidor,
            region: 'center',
            frame: true,
            store: modelo.storeConsumidores,
            loadMask: {store: modelo.storeConsumidores},
            columns: [this.consumidor,
                new Ext.grid.RowNumberer({header: _this.idioma.lbnum, width: 30, aling: 'center'}),
                {header: _this.idioma.lbCodigoDelConsumidor, dataIndex: 'codigocliente', id: 'exp'},
                {header: _this.idioma.lbCodigocontrato, width: 150, dataIndex: 'codigocontrato'},
                {hidden: true, hideable: false, dataIndex: 'idcontrato'},
                {header: _this.idioma.lbCliente1, width: 200, dataIndex: 'cliente'},
                {hidden: true, hideable: false, dataIndex: 'idmedicioncliente'}
            ],
            tbar: (mod) ? [this.btnAdicionar, this.btnEliminar] : new Ext.Toolbar({hidden: true}),
            bbar: new Ext.PagingToolbar({
                pageSize: 5,
                store: modelo.storeConsumidores,
                displayInfo: true
            })
        });
        /**
         *  Label y textarea de observaciones
         */
        var labelobservaciones = new Ext.form.Label({html: _this.idioma.lbObservaciones + ':', cls: 'x-form-field'});

        var lbServicios = new Ext.form.Label({html: _this.idioma.lbServicios + ':', cls: 'x-form-field'});

        this.observaciones = new Ext.form.TextArea({
            hideLabel: true,
            name: 'observaciones',
            maxLength: 255,
            minLengthText: _this.idioma.infoTamannoMax,
            height: 50,
            anchor: '100%'
        });
        /**----------------Botones-----------------------------------------------------**/

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: _this.idioma.lbBtnCancelar,
            tooltip: _this.idioma.tooltipCancelar
        });
        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: _this.idioma.lbBtnAceptar,
            tooltip: _this.idioma.tooltipAceptar
        });
        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            text: _this.idioma.lbBtnAplicar,
            tooltip: _this.idioma.tooltipAplicar
        });

        /**
         *  Panel con barra de herramientas y listado.
         */
        this.form = new Ext.FormPanel({
            layout: 'form',
            frame: true,
            region: 'north',
            height: 130,
            items: [this.fieldsetDatosDoc, this.comboServicios]
        });

        this.formSouth = new Ext.FormPanel({
            layout: 'form',
            frame: true,
            region: 'south',
            height: 90,
            items: [labelobservaciones, this.observaciones]
        });

        this.objDatosCliente.tfcodigocontrato.anchor = '90%';

        this.objDatosCliente.pContrato.removeClass('x-panel-tbar');
        this.objDatosCliente.pContrato.elements = 'body';
        this.objDatosCliente.btnBuscarAvanzado.hide();

        this.btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            border: false,
            text: _this.idioma.lbBtnBuscar,
            tooltip: _this.idioma.tooltipBuscarConsumidores
        });

        this.btnLimpiar = new Ext.Button({
            iconCls: 'limpiar',
            border: false,
            text: _this.idioma.lbBtnLimpiar,
            tooltip: _this.idioma.tooltipLimpiar
        });

        this.codigoContrato = new Ext.form.TextField({
            name: 'codigocontrato',
            hideLabel: true,
            maskRe: /^([a-zA-Z]*|[0-9]*)+\s?([a-zA-Z]*|[0-9]*)+\s?$/,
            regex: /^([a-zA-Z]*|[0-9]*)+\s?([a-zA-Z]*|[0-9]*)+\s?$/,
            minLength: _this.idioma.lbMinLengthCodigo,
            minLengthText: _this.idioma.lbMsgMinLengthCodigo,
            maxLength: _this.idioma.lbMaxLengthCodigo,
            maxLengthText: _this.idioma.lbMsgMaxLengthCodigo,
            anchor: '95%'
        });

        this.codigoCliente = new Ext.form.TextField({
            name: 'codgiocliente',
            maskRe: /^([a-zA-ZáéíóúñüÑ0-9-_/,.:\s]+ ?[a-zA-ZáéíóúñüÑ0-9-_/,.:\s]*)+$/,
            regex: /^([a-zA-ZáéíóúñüÑ0-9-_/,.\s]+ ?[a-zA-ZáéíóúñüÑ0-9-_/,.\s]*)+$/,
            minLength: _this.idioma.lbMinLengthCodigo,
            minLengthText: _this.idioma.lbMsgMinLengthCodigo,
            maxLength: _this.idioma.lbMaxLengthCodigo,
            maxLengthText: _this.idioma.lbMsgMaxLengthCodigo,
            hideLabel: true,
            anchor: '95%'
        });

        this.btnBuscar.on('click', function () {
            _this.listado.getStore().reload();
        });

        this.btnLimpiar.on('click', function () {
            _this.codigoCliente.reset();
            _this.codigoContrato.reset();
            _this.listado.getStore().reload();
        });

        this.panelFiltrado = new Ext.Panel({
            region: 'north',
            height: 70,
            style: 'padding:2px 2px 2px 2px;margin-bottom:0px',
            border: true,
            frame: true,
            items: [{
                layout: 'column',
                bodyStyle: 'height:65px',
                items: [{
                    columnWidth: .27,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [{
                        html: _this.idioma.lbContrato + ':'
                    }, _this.codigoContrato]
                }, {
                    columnWidth: .27,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [{
                        html: _this.idioma.lbCodigocliente + ':'
                    }, _this.codigoCliente]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    bodyStyle: 'margin-top:20px',
                    items: [{
                        html: "  "
                    }, this.btnBuscar]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    bodyStyle: 'margin-top:20px;',
                    items: [{
                        html: "  "
                    }, this.btnLimpiar]
                }]
            }]
        });


        this.panelContratos = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            // items: [this.objDatosCliente.pContrato]
        });
        this.panelSelecionados = new Ext.Panel({
            region: 'center',
            layout: 'border',
            frame: true,
            items: [this.panelFiltrado, this.listado]
        });


        _this.items = [
            this.form,
            /*(!_this.mod) ? this.panelContratos : */this.panelSelecionados,
            this.formSouth
        ];

        _this.buttons = [
            this.btnCancelar, this.btnAplicar, this.btnAceptar
        ];
        LOG.fac.AddDocumentView.superclass.constructor.apply(this, arguments);

    }, /**
     *  Muestra la ventana para adicionar un documento de lectura.
     */
    mostrar: function () {
        var _this = this;
        this.form.getForm().reset();
        this.formSouth.getForm().reset();

        if (_this.mod == true) {
            _this.btnAplicar.setVisible(false);
            _this.comboServicios.setValue(docSeleccionado.data.idservicio);
            _this.observaciones.setValue(docSeleccionado.data.observaciones);
            _this.comboServicios.setDisabled(true);
            _this.cargar();

        } else {
            _this.btnAplicar.setVisible(true);
            this.cargarEncabezado();
        }

        _this.storeConsumidores.removeAll();
        this.ventana.doLayout();
        this.ventana.show();
    },
    /*-------------Cargar store de los consumidores------------------*/
    cargar: function () {
        var _this = this;
        var params = {};
        if (_this.mod == true) {
            params.idservicio = docSeleccionado.data.idservicio;
            params.iddocumento = docSeleccionado.data.iddocumento;
        } else {
            params = {};
        }
        params.start = 0;
        params.limit = 5;

        modelo.storeConsumidores.load({params: params});
    },
    /**-----------Ocultar la ventana-----------------------------------**/
    ocultar: function () {
        this.ventana.close();
        this.ventana = "";
        this.objDatosCliente.fpFiltroContrato.destroy();
        this.objDatosCliente.fpFiltroContrato = "";

        this.objDatosCliente.tfcodigocliente.destroy();
        this.objDatosCliente.tfcodigocontrato.destroy();
        this.objDatosCliente.tfnombcliente.destroy();

        this.objDatosCliente.tfcodigocliente = "";
        this.objDatosCliente.tfcodigocontrato = "";
        this.objDatosCliente.tfnombcliente = "";
    },
    request: function (aplicar) {
        var _this = this;
        var params = {};
        var clientes = "";
        var accion = 1;
        if (_this.mod == false) {
            accion = 0;
            clientes = this.obtenerClientesSeleccionados();
            //params.fechaemision = Ext.get('idEncabezado').innerHTML;
        } else {
            params.iddocumento = docSeleccionado.data.iddocumento;
            accion = 1;
        }
        params.clientes = (clientes != "") ? Ext.encode(clientes) : "";
        params.observaciones = _this.observaciones.getValue();
        params.accion = accion;
        _this.ventana.getEl().mask(_this.idioma.textGuardandoDoc, 'x-mask-loading');
        this.form.getForm().submit({
            url: 'guardarDocumento',
            params: params,
            success: function (form, action) {
                response = Ext.decode(action.response.responseText);
                if (response.success) {
                    vistaDoc.cargar();
                    if (!_this.mod)
                        mostrarMensaje(1, _this.idioma.msgDocGuardado);
                    else
                        mostrarMensaje(1, _this.idioma.msgDocModificado);
                    _this.ocultar();
                } else
                    mostrarMensaje(1, _this.idioma.msgErrorGuardandoDoc);

            },
            failure: function (form, action) {
                _this.ventana.getEl().unmask();
                response = Ext.decode(action.response.responseText);
                if (action.failureType == 'connect') {
                    mostrarMensaje(1, _this.idioma.msgErrorServerNoEncontrado); //mensaje error
                    return;
                } else if (response.codigo == 1) {
                    _this.wListadoDoc = new LOG.fac.ListDocuments({
                        data: {
                            idclientes: params.clientes,
                            idservicio: _this.comboServicios.getValue(),
                            servicio: _this.comboServicios.getRawValue(),
                        },
                        idioma: _this.idioma
                    });
                    _this.wListadoDoc.show();
                } else {
                    mostrarMensaje(1, _this.idioma.msgErrorGuardandoDoc); //mensaje error
                }
            }

        });

    },
    /**---------------Guardar documento---------------------------**/
    guardar: function (aplicar) {
        var _this = this;
        if (this.form.getForm().isValid()) {
            if (!_this.mod) {
                if (this.obtenerClientesSeleccionados().length != 0) {
                    this.request(aplicar);
                } else {
                    mostrarMensaje(1, _this.idioma.msgVerifiqueCamposIncorrectos);
                }
            } else if (_this.mod) {
                if (_this.storeConsumidores.getCount() != 0) {

                    if (_this.storeConsumidores.change || this.observaciones.isDirty()) {
                        this.request(aplicar);
                        _this.listadoDocumentos.reload();
                    } else {
                        _this.ocultar();
                    }
                } else {
                    mostrarMensaje(1, _this.idioma.msgVerifiqueCamposIncorrectos);
                }
            }
        } else {
            mostrarMensaje(1, _this.idioma.msgVerifiqueCamposIncorrectos);
            return;
        }
    },
    /*----------------------Eliminar clientes---------------------------------*/
    eliminarCliente: function () {
        var _this = this;
        var params = {};
        var clientes = this.consumidor.getSelections();
        var arrClientes = new Array();
        Ext.each(clientes, function (record, index) {
            arrClientes.push(record.data.idmedicioncliente);
        });
        params.idmedicioncliente = Ext.encode(arrClientes);
        mostrarMensaje(2, _this.idioma.msgEliminarCliente, function (btnPresionado) {
            if (btnPresionado == 'ok') {
                Ext.getBody().mask(_this.idioma.msgEliminandoCliente, 'x-mask-loading');
                Ext.Ajax.request({
                    url: 'eliminarMidicionCliente',
                    method: 'POST',
                    params: params,
                    callback: function (options, success, response) {
                        Ext.getBody().unmask();
                        var result = Ext.decode(response.responseText);
                        if (result.success == true) {
                            _this.cargar();

                            mostrarMensaje(1, _this.idioma.msgLecEliminada);
                        } else
                            mostrarMensaje(1, _this.idioma.msgErrorEliminandoCliente); //mensaje error

                    }
                });
            }
        });
    },
    /**-----------------Buscar en la Base de datos el maximo numero de documento---------------------**/
    cargarEncabezado: function (th) {
        var _this = this;
        Ext.Ajax.request({
            url: 'cargarEncabezado',
            method: 'POST',
            callback: function (options, success, response) {
                if (response.responseText != -1) {
                    datos = Ext.decode(response.responseText);
                    document.getElementById('idEncabezado').textContent = datos.fecha;
                    document.getElementById('idEstatus').textContent = datos.estado;
                    document.getElementById('idNumerodoc').textContent = datos.nrodoc;
                    var responseText = response.responseText;
                    if (responseText != -1) {
                        var datos = Ext.decode(responseText);
                        Ext.get('idEncabezado').dom.innerHTML = datos.fecha;
                        Ext.get('idEstatus').dom.innerHTML = datos.estado;
                        Ext.get('idNumerodoc').dom.innerHTML = datos.nrodoc;
                    } else {
                        this.ocultar();
                        mostrarMensaje(1, _this.idioma.msgErrorGenerandoNum); //mensaje error
                    }
                }
            }
        });
    },
    /**----------------Obtener los ids de los clientes seleccionados-------------------**/
    obtenerClientesSeleccionados: function () {
        var _this = this;
        var clientes = this.gridpanel.getSelectionModel().getSelections();
        var idsclientes = [];
        Ext.each(clientes, function (cliente) {
            idsclientes.push({
                idcontrato: cliente.data.idcontrato,
                idcliente: cliente.data.idcliente
            });
        });
        return idsclientes;
    },
    /**----------------Obtener los ids de los contratos y los clientes-------------------**/
    obtenerContratos: function () {
        var _this = this;
        var idsclientes = [];
        _this.storeConsumidores.each(function (cliente) {
            idsclientes.push({
                idcontrato: cliente.data.idcontrato,
                idcliente: cliente.data.idcliente
            });
        });
        return idsclientes;
    },
    /**-----------------Eliminar del grid clientes seleccionados-------------------**/
    eliminarClientesSeleccionados: function () {
        var _this = this;
        var clientes = this.consumidor.getSelections();
        for (var i = clientes.length - 1; i >= 0; i--) {
            _this.storeConsumidores.remove(clientes[i]);
        }
    },
    /**-----------------Eliminar del grid clientes seleccionados-------------------**/
    validarAM: function () {
        var _this = this;
        if (_this.mod == true) {
            if (modelo.storeConsumidores.getCount() != 0) {
                this.ocultar();
            } else {
                mostrarMensaje(1, _this.idioma.msgVerifiqueCamposIncorrectos);
                return true;
            }
        } else {
            this.ocultar();
        }
    }
});
LOG.fac.UITemplate = Ext.extend(LOG.util.UITemplate, {
    busquedaBasica: true,
    formaVisualizacion: 'panel',
    modoSeleccion: 2,
    nuevos: new Array(),
    eliminar: new Array(),
    cambiosRol: new Array(),
    asignados: new Array(),
    addToolbar: true,
    autoLoad: false,
    constructor: function (config) {
        var _this = this;
        LOG.trans.UITemplate.superclass.constructor.call(this, config);
        if (config.formaVisualizacion === 'ventana') {
            LOG.util.UIManager.apply(this.getVistaPrincipal(), {
                height: config.height,
                width: config.width,
                title: config.title,
                aceptarFn: config.aceptarFn,
                usarAplicar: config.usarAplicar
            });
        }
    },
    initDefaultColumns: function () {
        var _this = this;
        for (var i = 0; i < _this.gColumns.count(); i++) {
            _this.addGridColumn(_this.gColumns.getItem(i));
        }
    },
    initDefaultButtons: function () {
        var _this = this;
        if (_this.addToolbar) {
            _this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
                tooltip: _this.idioma.lbTtBtnAdicionar,
                text: _this.idioma.lbBtnAdicionar,
                handler: function () {
                    _this.onAdd.call(_this);
                }
            }));
            _this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
                hidden: false,
                tooltip: _this.idioma.lbTtBtnEliminar,
                text: _this.idioma.lbBtnEliminar,
                disabled: true,
                handler: function () {
                    _this.onDelete.call(_this);
                }
            }));
            _this.addToolbarButton('->');
            _this.listaBotones.add(_this.tbtext);
        }
    },
    render: function () {
        var _this = this;
        var p = LOG.trans.UITemplate.superclass.render.call(this);
        _this.getStorePrincipal().add = _this.getStorePrincipal().add.createInterceptor(function (records) {
            _this.getStorePrincipal().data.items.forEach(function (record, index) {
                if (record == records) {
                    return false;
                }
            });
        }, this);
        _this.getStorePrincipal().add = _this.getStorePrincipal().add.createSequence(function (records) {
            _this.getStorePrincipal().modified.remove(records[0]);
            _this.isValid();
        }, this);
        _this.getStorePrincipal().on({
            'load': function (store, opts) {
                _this.isValid();
            },
            'remove': function (store, record, index) {
                if (record.get('nuevo')) {
                    store.remove(record);
                    _this.isValid();
                }
            }
        });
        return p;
    },
    onDelete: function () {
        var _this = this;
        _this.getStorePrincipal().remove(_this.getSmPrincipal().getSelections());
        _this.getPanelSuperior().getTopToolbar().get(2).disable();
    },
    isValid: function () {
        var _this = this;
        if (_this.totalProperty) {
            if (_this.totalProperty > _this.getStorePrincipal().getCount()) {
                _this.getPanelSuperior().getTopToolbar().get(1).enable();
                return false;
            } else {
                _this.getPanelSuperior().getTopToolbar().get(1).disable();
                return true;
            }
        }
    },
    getNewValue: function () {
        var _this = this;
        _this.newValue = new Array();
        _this.getStorePrincipal().data.items.forEach(function (record, index) {
            if (record.get('nuevo')) {
                var property = {};
                property[_this.idProperty] = record.get(_this.idProperty);
                property['idtransrol'] = record.get('idtransrol');
                _this.newValue.push(property);
            }
        });
        return _this.newValue;
    },
    getRemValue: function () {
        var _this = this;
        _this.remValue = new Array();
        _this.getStorePrincipal().removed.forEach(function (record, index) {
            if (!record.get('nuevo')) {
                _this.remValue.push(record.get(_this.idProperty));
            }
        });
        return _this.remValue;
    }
});