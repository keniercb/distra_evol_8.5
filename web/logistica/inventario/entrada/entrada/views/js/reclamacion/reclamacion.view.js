Ext.ns('LOG.inv.entrada.reclamacion');
LOG.inv.entrada.reclamacion.View = Ext.extend(LOG.lb.documento.View, {
    name: 'Diferencia',
    cantSign: 4,
    signDetails: {
        1: 'Recepcionado por',
        2: 'Aprobado por',
        3: 'Transportado por',
        4: 'Suministrado por'
    },
    dirReport: '/logistica/inventario/entrada/diferencia/',
    tipoDoc: undefined,
    /**
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.concepto = config.idioma.ttBtnBuscar;
        this.busquedaBasica = true;
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        config.model = new LOG.lb.documento.Model({
            fields: [
                {name: 'viatransporte'},
                {name: 'aceptada'},
                {name: 'idrecepcion'},
                {name: 'tiporeclamacion'}
            ]
        });
        LOG.inv.entrada.reclamacion.View.superclass.constructor.call(this, config);
    },
    init: function () {
        LOG.inv.entrada.reclamacion.View.superclass.init.call(this);
        var _this = this;
        this.modelo.cargaInicial({
            url: '/logistica/inventario/entrada/entrada/index.php/recepcion/cargarComboTipoDocumento'
        }, function (resp) {
            _this.tipoDoc = resp[0];
        });
        this.panelSuperior();
        if (alternativa) {
            this.initPanelMonedas();
        }
        Ext.apply(this.winGestionarDocumento, {
            beforeEditProducto: function (o) {
                if (!o.record.json.enfalta || alternativa) {
                    o.cancel = true;
                }
            },
            prepareDocModify: function (d, noCargar) {
                if (this.fromularioGestion) {
                    this.fromularioGestion.getForm().loadRecord(d);
                    if (!noCargar) {
                        this.modelo.loadRecord(d.data);
                    }
                    this.record = d;
                    if (d.data.iddocumento) {
                        this.cargarProductos();
                        this.getTitleDocumento(this.record.data.iddocumento);
                    }
                }
            },
            controlFnGuardar: function (b, nuevo) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && _this.winGestionarDocumento.tipoVentana != '3'
                    && (!this.record || (nuevo && this.record.data.estado != '3') || (!nuevo &&
                    (!this.record.data.estado || this.record.data.estado == '1')))) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }, this.winGestionarDocumento);
    },
    /**
     * Inicializa los botones.
     * @returns {undefined}
     */
    initDefaultButtons: function () {
        LOG.inv.entrada.reclamacion.View.superclass.initDefaultButtons.call(this);
        var _this = this;

        // Bloque de botones de la interfaz principal.
        LOG.util.UIManager.apply(this.listaBotones.getItem(4), {id: 'idReclamacion'});
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function () {
                var winInfRecepcion = new LOG.inv.entrada.informeRecepcion.View({
                    idioma: _this.idioma,
                    idestructura: _this.idDeposito,
                    aceptarFn: function (r) {
                        var record = Ext.apply({data: r});
                        Ext.apply(record.data, {
                            idrecepcion: r.iddocumento, iddocumento: null, estado: null
                        });
                        _this.initVentanaGestion(record);
                    }
                });
                winInfRecepcion.init();
                winInfRecepcion.view();
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '1' && !this.getSelected().json.porfactura) {
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
        this.insertToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: _this.idioma.ttBtnConfirmar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.confirmar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '1') {
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
            tooltip: _this.idioma.ttBtnAnularEstado,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '2') {
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
        this.insertToolbarButton(LOG.util.Prototipos.botonAprobar({
            tooltip: _this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.initVentanaGestion(_this.getGridPrincipal().getSelectionModel().getSelected(), 3);
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(
                            (this.getCount() == 1 && this.getSelected().data.estado == '2') && //first
                            ((window.useSign && typeof pki == 'object') ? (_caller.getSmPrincipal().getSelected().get('controlfirma') == 2) : true) //last pki //para controlfirma == 2 limit 3 y 1 limit 2
                            ));
                        }
                    }, 'aprobar1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 5);
        this.insertToolbarButton(LOG.util.Prototipos.botonDuplicar({
            tooltip: _this.idioma.ttBtnDuplicar,
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
        }), 6);
        // Fin del bloque.

        // Bloque de botones de la ventana adicionar.
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarDoc,
            fn: function () {
                _this.modelo.eliminar({id: _this.modelo.iddocumento}, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar'))
                    && _this.winGestionarDocumento.tipoVentana != '3') {
                    b.show();
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1'
                        && !_this.winGestionarDocumento.record.data.porfactura) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.hide();
                }
            }
        });
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(1), {
            tooltip: this.idioma.ttBtnConfirmar,
            fn: function () {
                _this.modelo.confirmar({id: _this.modelo.iddocumento}, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    Ext.apply(_this.winGestionarDocumento.record.data, {estado: '2'});
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(this, [b, this]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(this, [b, this]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos();
                });
            },
            controlFn: function (b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar'))
                    && _this.winGestionarDocumento.tipoVentana != '3') {
                    b.show();
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.hide();
                }
            }
        });
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(2), {
            tooltip: this.idioma.ttBtnAnularEstado,
            fn: function () {
                _this.modelo.anularestado({id: _this.modelo.iddocumento}, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    Ext.apply(_this.winGestionarDocumento.record.data, {estado: '1'});
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos();
                });
            },
            controlFn: function (b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado'))
                    && _this.winGestionarDocumento.tipoVentana != '3') {
                    b.show();
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.hide();
                }
            }
        });
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(3), {
            tooltip: this.idioma.ttBtnAprobar,
            fn: function () {
                _this.modelo.aprobar({id: _this.modelo.iddocumento}, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    Ext.apply(_this.winGestionarDocumento.record.data, {estado: '3'});
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                });
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
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
            fn: function () {
                _this.modelo.duplicar({id: _this.modelo.iddocumento}, function (r) {
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
                    _this.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(r.datos['iddocumento']);
                    _this.habilitarElementos();
                });
            },
            controlFn: function (b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && _this.winGestionarDocumento.tipoVentana != '3') {
                    b.show();
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.hide();
                }
            }
        });
        this.insertToolbarButtonVentana(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: _this.idioma.lbBtnInformeDif,
            tooltip: _this.idioma.ttBtnInformeDif,
            handler: function () {
                var winInfRecepcion = new LOG.inv.entrada.informeRecepcion.View({
                    idioma: _this.idioma,
                    idestructura: _this.idDeposito,
                    aceptarFn: function (r) {
                        var record = Ext.apply({data: r});
                        Ext.apply(record.data, {
                            idrecepcion: r.iddocumento, iddocumento: null, estado: null
                        });
                        _this.initVentanaGestion(record);
                        _this.modelo.habilitarBotones(!_this.modelo.isValid());

                    }
                });
                winInfRecepcion.init();
                winInfRecepcion.view();
            },
            controlFn: function (b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && _this.winGestionarDocumento.tipoVentana != '3') {
                    b.show();
                    if (!_this.winGestionarDocumento.record) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.hide();
                }
            }
        }), 0);
        // Botones de la interfaz aprobar.
        this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnularEstado,
            hidden: true,
            handler: function () {
                _this.modelo.anularestado({id: _this.modelo.iddocumento}, function () {
                    if (_this.winGestionarDocumento.tipoVentana == '3') {
                        _this.winGestionarDocumento.close();
                    }
                });
            },
            controlFn: function (b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RAprobar')) && _this.winGestionarDocumento.tipoVentana == '3') {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }));
        // Fin del bloque.

        // Bloque de botones del panel de productos de la ventana adicionar.
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesProductos.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarProd,
            controlFn: function (b, _caller) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && _this.winGestionarDocumento.tipoVentana != '3') {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && _this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1'
                                && !this.getSelected().json.porfactura) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'eliminarProd');
                } else {
                    b.hide();
                }
            }
        });
        var btnProdDiferencia = LOG.util.UIManager.createBtn({
            iconCls: 'producto',
            text: _this.idioma.lbBtnProdinforme,
            tooltip: _this.idioma.ttBtnProdinforme,
            handler: function () {
                var winProductos = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    urlBusquedaGridPrincipal: 'cargarProductosDocumento',
                    dirController: '',
                    parametros: {
                        iddocumento: _this.modelo.idrecepcion,
                        idreclamacion: _this.modelo.iddocumento,
                        idestructura: _this.idDeposito
                    },
                    postSalvar: function (r) {
                        var _scope = _this.winGestionarDocumento;
                        _scope.cargarProductos();
                        _scope.record = _scope.record || {};
                        Ext.apply(_scope.record, {
                            data: {
                                iddocumento: r.iddocumento || _scope.record.data.iddocumento,
                                estado: "1"
                            }
                        });
                        _scope.getTitleDocumento(_scope.record.data.iddocumento);
                        _scope.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _scope);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_scope, [b, _scope]).call();
                            }
                        }, _scope);
                        _scope.modelo.getStore().reload();
                        winProductos.getStorePrincipal().reload();
                    }
                });
                winProductos.init();
                LOG.util.UIManager.apply(winProductos.listaColumnas.getBy('dataIndex', 'precio'), {
                    dataIndex: 'preciocontable'
                });
                _this.vistaProductos = winProductos.view();
                _this.vistaProductos.show();
            },
            fnEspecialCondition: function () {
                if (_this.winGestionarDocumento.record && (!_this.winGestionarDocumento.record.data.estado
                    || _this.winGestionarDocumento.record.data.estado == '1')
                    && _this.modelo.basicForm && _this.modelo.basicForm.isValid()) {
                    return false;
                }
                return true;
            },
            controlFn: function (b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && _this.winGestionarDocumento.tipoVentana != '3') {
                    b.show();
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.hide();
                }
            }
        });
        this.insertToolbarButtonProductos(btnProdDiferencia, 0);
        this.modelo.addActionButton(btnProdDiferencia, true);
        var btnProductos = LOG.util.UIManager.createBtn({
            iconCls: 'producto',
            text: _this.idioma.lbBtnProductos,
            tooltip: _this.idioma.ttBtnProductos,
            handler: function () {
                var winProductos = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    urlBusquedaGridPrincipal: 'cargarProductosDocumento',
                    dirController: '',
                    parametros: {
                        idestructura: _this.idDeposito,
                        iddocumento: _this.modelo.iddocumento || -1,
                        idrecepcion: _this.modelo.idrecepcion,
                        productos: true
                    },
                    postSalvar: function (r) {
                        var _scope = _this.winGestionarDocumento;
                        _scope.cargarProductos();
                        _scope.record = _scope.record || {};
                        Ext.apply(_scope.record, {
                            data: {
                                iddocumento: r.iddocumento || _scope.record.data.iddocumento,
                                estado: "1"
                            }
                        });
                        _scope.getTitleDocumento(_scope.record.data.iddocumento);
                        _scope.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _scope);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_scope, [b, _scope]).call();
                            }
                        }, _scope);
                        _scope.modelo.getStore().reload();
                        winProductos.getStorePrincipal().reload();
                    }
                });

                winProductos.init();
                winProductos.listaColumnas.delete(7);
                winProductos.listaColumnas.delete(6);
                winProductos.listaColumnas.delete(5);
                winProductos.listaColumnas.delete(4);
                _this.vistaProductos = winProductos.view();
                _this.vistaProductos.show();
            },
            fnEspecialCondition: function () {
                if (_this.winGestionarDocumento.record && (!_this.winGestionarDocumento.record.data.estado
                    || _this.winGestionarDocumento.record.data.estado == '1')
                    && _this.modelo.basicForm && _this.modelo.basicForm.isValid()) {
                    return false;
                }
                return true;
            },
            controlFn: function (b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && _this.winGestionarDocumento.tipoVentana != '3') {
                    b.show();
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.hide();
                }
            }
        });
        this.insertToolbarButtonProductos(btnProductos, 1);
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
                                    /*estado: _this.porfactura ? "13" : "1",*/
									estado: (_this.winGestionarDocumento.smGridDetalles.getSelected().json.porfactura) ? "13" : "1",
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
            },
            fnEspecialCondition: function () {
                /*if (_this.winGestionarDocumento.record && (!_this.winGestionarDocumento.record.data.estado
				|| _this.winGestionarDocumento.record.data.estado == '13'
				    || _this.winGestionarDocumento.record.data.estado == '1') 
				    && _this.modelo.basicForm && _this.modelo.basicForm.isValid()) { 
                    return false;
                }*/
				 if (_this.winGestionarDocumento.record && (!_this.winGestionarDocumento.record.data.estado
                    || _this.winGestionarDocumento.record.data.estado == '1')
                    && _this.modelo.basicForm && _this.modelo.basicForm.isValid()) {
                    return false;
				}
                return true;
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                   b.show();
				   if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.hide();
                }
            }
        });
        this.insertToolbarButtonProductos(btnTarjeta, 2);
		this.modelo.addActionButton(btnTarjeta, true);

        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: _this.idioma.lbBtnRegDiferencia,
            tooltip: _this.idioma.ttBtnRegDiferencia,
            disabled: true,
            handler: function () {
                var winRegistrarDiferencia = new LOG.inv.entrada.registrarDiferencia.View({
                    idmovimiento: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idmovimiento,
                    idestructuracomun: _this.idDeposito,
                    dif: true,
                    enfalta: _this.winGestionarDocumento.smGridDetalles.getSelected().json.enfalta,
                    porfactura: _this.winGestionarDocumento.smGridDetalles.getSelected().json.porfactura,
                    condiferencia: _this.winGestionarDocumento.smGridDetalles.getSelected().json.condiferencia,
                    alternativa: alternativa,
                    codContable: codContable,
                    codAlternativa: codAlternativa,
                    grantedAction: function (_p) {
                        return (_this.grantedAction(_p) && _this.winGestionarDocumento.record.data.estado == '1');
                    },
                    _postSalvar: function () {
                        _this.winGestionarDocumento.stGridDetalles.load();
                    }
                });
                winRegistrarDiferencia.show();
            },
            controlFn: function (b, _caller) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && _this.winGestionarDocumento.tipoVentana != '3') {
                    b.show();
                    b.disable();
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
                    b.hide();
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
                    _this.monedas.idmovimiento = _this.winGestionarDocumento.smGridDetalles.getSelected().data.idmovimiento;
                    if (_this.formularioSur.collapsed) {
                        _this.monedas.getStorePrincipal().load();
                        _this.formularioSur.show();
                        _this.formularioSur.expand();
                        _this.winGestionarDocumento.doLayout();
                    }
                },
                controlFn: function (b, _caller) {
                    if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                        && _this.winGestionarDocumento.tipoVentana != '3') {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && this.getSelected().json.enfalta) {
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
        // Fin del bloque.
    },
    /**
     * Inicializa las columnas.
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        LOG.inv.entrada.reclamacion.View.superclass.initDefaultColumns.call(this);
        var pos = this.listaColumnas.getPosByField('dataIndex', 'estado', 'header');
        this.insertGridColumn({
            header: this.idioma.gcInfRecepcion,
            width: 120,
            dataIndex: 'nrorecepcion',
            default: true
        }, pos + 1);
        this.addGridColumn({dataIndex: 'idrecepcion'});
        this.addGridColumn({dataIndex: 'viatransporte'});
        this.addGridColumn({dataIndex: 'tiporeclamacion'});
        this.addGridColumn({dataIndex: 'aceptada'});

        this.addGridColumn({dataIndex: 'cliente'});
        this.addGridColumn({dataIndex: 'direccion'});
        this.addGridColumn({dataIndex: 'nrorecepcion'});
        this.addGridColumn({dataIndex: 'idoperacionrec'});
        this.addGridColumn({dataIndex: 'fechadocorigen'});
        this.addGridColumn({dataIndex: 'nrodocorigen'});
        this.addGridColumn({dataIndex: 'nrocontrato'});
        this.addGridColumn({dataIndex: 'fechacontrato'});
        this.addGridColumn({dataIndex: 'idorganizacion'});
        this.addGridColumn({dataIndex: 'tipocliente'});
        this.addGridColumn({dataIndex: 'direcciontransporte'});
        this.addGridColumn({dataIndex: 'nombreconductor'});
        this.addGridColumn({dataIndex: 'matricula'});
        this.addGridColumn({dataIndex: 'ciconductor'});
        this.addGridColumn({dataIndex: 'cartaporte'});
        this.addGridColumn({dataIndex: 'fechacontablerec'});
        this.addGridColumn({dataIndex: 'porfactura'});

        this.addGridColumn({dataIndex: 'controlfirma'});
        this.addGridColumn({dataIndex: 'idnodo'});
        this.addGridColumn({dataIndex: 'iddoc'});

        // Columnas del grid de productos.

        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'cantidad'), {
            hidden: true
        });
        if (alternativa) {
            pos = this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'importe', 'header');
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
           //reclamacion
            LOG.util.UIManager.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'preciocontable'), {
                header: this.idioma.cgPrecio + ' ' + codContable
            });
            LOG.util.UIManager.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'importe'), {
                header: this.idioma.cgImporte + ' ' + codContable,
                width: 90
            });
        } else {
            Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'preciocontable'), {
                editor: LOG.util.Prototipos.inputDecimal({})
            });
        }
    },
    /**
     * Inicializa la ventana de productos.
     * @param {Object} d
     * @param {Integer} t
     * @returns {undefined}
     */
    initVentanaGestion: function (d, t) {
        var _this = this;
        this.modelo.iddocumento = d.data.iddocumento;
        LOG.inv.entrada.reclamacion.View.superclass.initVentanaGestion.call(this, d, t);
        this.modelo.idrecepcion = d.data.idrecepcion;
        this.modelo.detienda = d.json.detienda;
        this.winGestionarDocumento.record = d;
        Ext.getCmp('tab').setActiveTab(1);
        Ext.getCmp('tab').setActiveTab(0);
        if (d) {
            if (_this.rdCancelacion && d.data.tiporeclamacion != 1) {
                _this.rdCancelacion.setValue(true);
                _this.rdReposicion.setValue(false);
            } else if (_this.rdCancelacion) {
                _this.rdCancelacion.setValue(false);
                _this.rdReposicion.setValue(true);
            }
        }
        _this.modelo.cargaInicial({
            url: '/logistica/inventario/entrada/entrada/index.php/reclamacion/cargarClienteById',
            cargando: true,
            idcliente: d.data.idorganizacion,
            tipocliente: d.data.tipocliente
        }, function (r) {
            d.data.entidadtransporte = r[0][0].cliente;
            d.data.direcciontransporte = r[0][0].direccion;
            _this.cargarEncabezados(d.data);
        });
        _this.habilitarElementos();
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.btnNuevo, 'handler', function () {
            _this.winGestionarDocumento.tipoVentana = 1;
            _this.winGestionarDocumento.record = null;
            _this.cargarEncabezados({});
            _this.habilitarElementos();
        }, 'btnNuevo');
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.smGridDetalles, 'fireEvent', function (e) {
            if (e == 'selectionchange') {
                if (_this.monedas) {
                    _this.monedas.getStorePrincipal().removeAll();
                }
                if (alternativa) {
                    _this.formularioSur.collapse();
                    _this.formularioSur.hide();
                }
                _this.winGestionarDocumento.doLayout();
            }
        }, 'panelMonedas');
    },
    /**
     *
     * @returns {Ext.TabPanel}
     */
    panelSuperior: function () {
        var _this = this;
        var items = [new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCbViaTransporte,
            name: 'viatransporte',
            triggerAction: 'all',
            editable: false,
            mode: 'local',
            anchor: '98%',
            store: new Ext.data.SimpleStore({
                fields: ['viatransporte', 'nomb_viatransporte'],
                data: [
                    [1, _this.idioma.lbStFerroviaria],
                    [2, _this.idioma.lbStMaritima],
                    [3, _this.idioma.lbStAerea],
                    [4, _this.idioma.lbStTerrestre]
                ]
            }),
            valueField: 'viatransporte',
            displayField: 'nomb_viatransporte',
            allowBlank: false,
            campo: true,
            validate: function () {
                if (!_this.modelo.idrecepcion) {
                    return false;
                }
                return LOG.util.ComboBox.superclass.validate.call(this);
            }
        }),
            new Ext.form.TextArea({
                fieldLabel: _this.idioma.lbTaObservaciones,
                name: 'observaciones',
                anchor: '98%',
                minLength: 2,
                maxLength: 255,
                minLengthText: _this.idioma.msgTaTamanoMinimo,
                maxLengthText: _this.idioma.msgTaTamanoMaximo,
                campo: true
            })];
        if (typeof TV_EXIST !== 'undefined' && TV_EXIST == true) {
            this.rdReposicion = new Ext.form.Radio({
                boxLabel: 'Reposici\xf3n',
                name: 'tiporeclamacion',
                campo: true,
                listeners: {
                    'check': function(_radio, checked) {
                        if (checked) {
                            Ext.getCmp('reposicion').setValue(true);
                        } else {
                            Ext.getCmp('reposicion').setValue(false);
                        }
                    }
                }
            });
            this.rdCancelacion = new Ext.form.Radio({
                boxLabel: 'Cancelaci\xf3n',
                name: 'tiporeclamacion',
                campo: true,
                listeners: {
                    'check': function(_radio, checked) {
                        if (checked) {
                            Ext.getCmp('cancelacion').setValue(true);
                        } else {
                            Ext.getCmp('cancelacion').setValue(false);
                        }
                    }
                }
            });
            var frmTipo = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });
            frmTipo.addComponent(this.rdReposicion);
            frmTipo.addComponent(this.rdCancelacion);
            frmTipo.getColumn(0).columnWidth = 0.3;
            items = items.concat([frmTipo,
                {
                    xtype: 'checkbox',
                    hidden: true,
                    id: 'cancelacion',
                    name: 'cancelacion'
                }, {
                    xtype: 'checkbox',
                    hidden: true,
                    id: 'reposicion',
                    name: 'reposicion'
                }]);


        }

        var fsDatosInfDiferencia = new Ext.form.FieldSet({
            border: false,
            items: items
        });

        var clsDatosInfDifGeneral = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        clsDatosInfDifGeneral.addComponent(fsDatosInfDiferencia);
        clsDatosInfDifGeneral.addComponent(new Ext.form.FieldSet({
            title: this.idioma.tlFsInformeRecepcion,
            items: [{
                html: '<table cellspacing="5">' +
                '    <tr>' +
                '        <td><b>Doc. origina: </b></td>' +
                '        <td id="idoperacion"></td>' +
                '    </tr>' +
                '    <tr>' +
                '        <td><b>Fecha Doc. origina: </b></td>' +
                '        <td id="fechaOrigen"></td>' +
                '    </tr>' +
                '    <tr>' +
                '        <td><b>No. Doc. origina: </b></td>' +
                '        <td id="nroDocOrigen"></td>' +
                '    </tr>' +
                '    <tr>' +
                '        <td><b>No. Inf. recepción: </b></td>' +
                '        <td id="nroInfRecep"></td>' +
                '    </tr>' +
                '    <tr>' +
                '        <td><b>Fecha Inf. recepción: </b></td>' +
                '        <td id="fechaInfRrecep"></td>' +
                '    </tr>' +
                '    <tr>' +
                '        <td><b>No. contrato: </b></td>' +
                '        <td id="nroCont"></td>' +
                '    </tr>' +
                '    <tr>' +
                '        <td><b>Fecha contrato: </b></td>' +
                '        <td id="fechaContrato"></td>' +
                '    </tr>' +
                '</table>'
            }]
        }));

        var clsDatosRecepcion = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        clsDatosRecepcion.addComponent(new Ext.form.FieldSet({
            title: this.idioma.tlFsSuministrador,
            height: 130,
            items: [{
                html: '<table cellspacing="5">' +
                '    <tr>' +
                '        <td><b>Entidad: </b></td>' +
                '        <td id="suministrador"></td>' +
                '    </tr>' +
                '    <tr>' +
                '        <td><b>Dirección: </b></td>' +
                '        <td id="direccionSubmun"></td>' +
                '    </tr>' +
                '    <tr>' +
                '        <td><b>Carta porte: </b></td>' +
                '        <td id="cartaporte"></td>' +
                '    </tr>' +
                '</table>'
            }]
        }));
        clsDatosRecepcion.addComponent(new Ext.form.FieldSet({
            title: this.idioma.tlFsTranportador,
            items: [{
                html: '<table cellspacing="5">' +
                '    <tr>' +
                '        <td><b>Entidad: </b></td>' +
                '        <td id="idorganizacion"></td>' +
                '    </tr>' +
                '    <tr>' +
                '        <td><b>Dirección: </b></td>' +
                '        <td id="direccionTransp"></td>' +
                '    </tr>' +
                '    <tr>' +
                '        <td><b>Nombre transp.: </b></td>' +
                '        <td id="nombreconductor"></td>' +
                '    </tr>' +
                '    <tr>' +
                '        <td><b>CI transp.: </b></td>' +
                '        <td id="ciconductor"></td>' +
                '    </tr>' +
                '    <tr>' +
                '        <td><b>No. chapa: </b></td>' +
                '        <td id="matricula"></td>' +
                '    </tr>' +
                '</table>'
            }]
        }));

        this.formularioGeneral = new Ext.TabPanel({
            activeTab: 0,
            id: 'tab',
            listeners: {
                tabchange: function () {
                    _this.winGestionarDocumento.doLayout();
                }
            },
            items: [{
                title: _this.idioma.lbFsDatosInfDiferencia,
                items: [
                    LOG.util.UIManager.initPanel({
                        layout: 'form',
                        labelAlign: 'top',
                        frame: true,
                        items: [clsDatosInfDifGeneral]
                    })
                ]
            }, {
                title: _this.idioma.lbFsDatosInfRecepcion,
                items: [LOG.util.UIManager.initPanel({
                    frame: true,
                    items: [clsDatosRecepcion]
                })]
            }]
        });
    },
    /**
     * Inicializa el panel de monedas.
     * @returns {undefined}
     */
    initPanelMonedas: function () {
        var _this = this;
        this.monedas = new LOG.inv.entrada.reclamacion.Monedas({
            idioma: this.idioma,
            modelo: this.modelo,
            scope: this.winGestionarDocumento,
            grantedAction: function (_p) {
                return (_this.grantedAction(_p) && _this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1');
            }
        });
        this.monedas.init();
        this.formularioSur = LOG.util.UIManager.initPanel({
            title: _this.idioma.tlPanelMonedas,
            titleCollapse: true,
            animCollapse: false,
            collapsible: true,
            region: 'south',
            layout: 'fit',
            height: 200,
            minSize: 200,
            maxSize: 400,
            split: true,
            hidden: true,
            items: [_this.monedas.view()],
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
    /**
     * Habilita o deshabilita los elementos de entrada de datos.
     * @returns {undefined}
     */
    habilitarElementos: function () {
        Ext.each(this.winGestionarDocumento.panelSuperior.find('campo', true), function (item) {
            item.setDisabled((this.record && this.record.data.estado && this.record.data.estado != '1'));
            if (this.tipoVentana == '3') {
                this.setTitle(this.idioma.tlAprobar);
            }
            if (!this.record || !this.record.data.estado) {
                this.setTitle(this.idioma.tlAdicionar);
            }
        }, this.winGestionarDocumento);
        this.winGestionarDocumento.onShowHandler();
    },
    /**
     * Carga los datos de la recepcion.
     * @param {Object} datos
     * @returns {undefined}
     */
    cargarEncabezados: function (datos) {
        document.getElementById('idoperacion').innerHTML = this.getNombreOperacion(datos.idoperacionrec);
        document.getElementById('fechaOrigen').innerHTML = datos.fechadocorigen || '-';
        document.getElementById('nroDocOrigen').innerHTML = datos.nrodocorigen || '-';
        document.getElementById('nroInfRecep').innerHTML = datos.nrorecepcion || datos.nrodoc || '-';
        document.getElementById('suministrador').innerHTML = datos.cliente || '-';
        document.getElementById('direccionSubmun').innerHTML = datos.direccion || '-';
        document.getElementById('nroCont').innerHTML = datos.nrocontrato || '-';
        document.getElementById('fechaContrato').innerHTML = datos.fechacontrato || '-';
        document.getElementById('idorganizacion').innerHTML = datos.entidadtransporte || '-';
        document.getElementById('direccionTransp').innerHTML = datos.direcciontransporte || '-';
        document.getElementById('nombreconductor').innerHTML = datos.nombreconductor || '-';
        document.getElementById('matricula').innerHTML = datos.matricula || '-';
        document.getElementById('ciconductor').innerHTML = datos.ciconductor || '-';
        document.getElementById('cartaporte').innerHTML = datos.cartaporte || '-';
        document.getElementById('fechaInfRrecep').innerHTML = datos.fechacontablerec || datos.fechacontable || '-';
    },
    /**
     * Devuelve el nombre de la operacion.
     * @param {type} id
     * @returns {String}
     */
    getNombreOperacion: function (id) {
        for (var i = 0; i < this.tipoDoc.length; i++) {
            if (id == this.tipoDoc[i].idnomoperaciones) {
                return this.tipoDoc[i].denominacion;
            }
        }
        return '-';
    },
    getParamsReport: function (record, btn) {
        var _this = this;
        return btn.isList ? {
            annoreclamacion: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
            contabilizadopor: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null,
            creadopor: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
            nrodocumento: (_this.panelBusquedaAvanzada.findByType('textfield')[5].getValue()) ? _this.panelBusquedaAvanzada.findByType('textfield')[5].getValue() : null,
            annorecepcion: (_this.panelBusquedaAvanzada.findByType('combo')[4].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[4].getValue() : null,
            iddeposito: _this.idDeposito ? _this.idDeposito : null
        } : {
            useSign: this.useSign,
            hasCategoria: (usarCategoria) ? 'true' : 'false',
            iddocumento: record.get("iddocumento") || null,
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            monedacontable: window.monedacontable || window.idcontable,
            monedaalternativa: window.monedaalternativa || window.idalternativa
        };
    }
});


/**
 * Plantilla tipo panel para la gestión de las monedas.
 * @type LOG.util.UITemplate
 */
LOG.inv.entrada.reclamacion.Monedas = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.urlBusquedaGridPrincipal = 'cargarMonedas';
        this.gridEditable = true;
        this.modoSeleccion = 1;
        this.bbarVisible = false;
        LOG.inv.entrada.reclamacion.Monedas.superclass.constructor.call(this, config);
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
            header: this.idioma.cgPrecio,
            width: 90,
            align: 'right',
            dataIndex: 'precio',
            editor: new LOG.util.Prototipos.inputDecimal({
                allowBlank: false
            }),
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgImporte,
            width: 90,
            align: 'right',
            dataIndex: 'importe',
            default: true
        }));
    },
    render: function () {
        var render = LOG.inv.entrada.reclamacion.Monedas.superclass.render.call(this);
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