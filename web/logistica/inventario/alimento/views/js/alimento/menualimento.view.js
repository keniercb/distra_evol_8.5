Ext.ns('LOG.inv.alimento');
LOG.inv.alimento.View = Ext.extend(LOG.lb.documento.View, {
    constructor: function (config)

    {
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        this.busquedaBasica = true;
        this.idGridPrincipal = 'iddocumento';
        this.dirReport = '/distra/logistica/inventario/alimento/',
        config.idioma = LOG.util.UIManager.apply(LOG.util.Idioma.init(), LOG.inv.alimento.Idioma);
        config.model = new LOG.inv.alimento.Model({
            idioma: config.idioma
        });
        LOG.inv.alimento.View.superclass.constructor.call(this, config);
        this.concepto = config.idioma.ttBuscar;
        this.winGestionarDocumento = new LOG.inv.alimento.ventanaAdicionarMenuAlimento({
            idioma: config.idioma,
            modelo: config.model,
            padreGestionarMenuAlimento: this,
            width: 750,
            height: 580,
            title: config.idioma.tlAdicionar
        });
    },
    init: function () {
        LOG.inv.alimento.View.superclass.init.call(this);
        this.panelSuperior();
    },
    initVentanaGestion: function (d, tipoVentana) {
        var _this = this;
        LOG.inv.alimento.View.superclass.initVentanaGestion.createDelegate(this, [d, tipoVentana]).call();
        _this.gestionarElementos();
        this.winGestionarDocumento.doLayout();
    },
    actualizarPanel: function () {
        var _this = this;
        if (_this.winGestionarDocumento.panelProductos.items && _this.winGestionarDocumento.panelProductos.items.items[0]) {
            _this.winGestionarDocumento.panelProductos.items.items[0].destroy();
            _this.winGestionarDocumento.panelProductos.doLayout();
        }
    },
    initDefaultButtons: function () {
        var _this = this;
        LOG.inv.alimento.View.superclass.initDefaultButtons.call(this);

        this.listaBotones.getItem(0).handler = this.listaBotones.getItem(1).handler.createSequence(function (e) {
            _this.gestionarElementos(); //nuevo
            _this.fechaConsumo.reset();
            _this.actualizarPanel();
        });
        this.listaBotones.getItem(1).handler = this.listaBotones.getItem(1).handler.createSequence(function (e) {
            _this.gestionarElementos();
            _this.actualizarPanel();
            _this.tapPanel = new LOG.util.UITabTemplate({//detalles adicionando tabPanel
                idioma: _this.idioma,
                formaVisualizacion: 'panel'
            });
            _this.modelo.cargaInicial({
                url: '/logistica/inventario/alimento/index.php/menualimento/cargarCategorias',
                iddocumento: _this.smGridPrincipal.getSelected().data.iddocumento
            }, function (r) {
                r[0].forEach(function (e, i) {
                    if (!_this.existeElemento(_this.tapPanel, e)) {
                        this.gridT = new LOG.inv.alimento.GridTabPanel({
                            idioma: _this.idioma,
                            modeloTabPanel: _this.modelo,
                            padreTabPanel: _this,
                            title: e.denominacion,
                            idComponent: e.idactividadalimento,
                            iddocumento: _this.modelo.iddocumento
                        });
                        _this.tapPanel.addTabToTemplete(this.gridT);
                    }
                });
                _this.winGestionarDocumento.panelProductos.add(_this.tapPanel);
                _this.tapPanel.init();
                _this.tapPanel.view();
                _this.winGestionarDocumento.panelProductos.doLayout();
                _this.tapPanel.setActiveTab(0);
            });
        });
        // Botones adicionales de la interfaz principal.
        this.insertToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            isContextual: true,
            handler: function () {
                _this.modelo.confirmar(_this.winGestionarDocumento.modelo.sm.getSelected().data);
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect' && _caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 1) {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }), 3);
        this.insertToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnularEstado,
            isContextual: true,
            handler: function () {
                _this.modelo.anularestado();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')) {
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect' && _caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 2) {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }), 4);
        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'revisar',
            text: this.idioma.lbBtnRevisadopor,
            tooltip: this.idioma.ttBtnRevisadopor,
            isContextual: true,
            handler: function () {
                var iddocumento = _this.winGestionarDocumento.modelo.sm.getSelected().data.iddocumento;
                _this.modelo.revisadoPor(iddocumento);
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RRevisadopor')) {
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect' && _caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 2) {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
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
                var iddocumento = _this.smGridPrincipal.getSelected().get('iddocumento');
                var idestructuracomun = _this.smGridPrincipal.getSelected().get('idestructuracomun');
                _this.modelo.aprobar(iddocumento, idestructuracomun, function (r) {
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RAprobar')) {
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(
                                ( this.getCount() == 1 && this.getSelected().data.estado == 11 ) //&& //first
                                    /*( ( usarPki && typeof pki == 'object' ) ? (_caller.getSmPrincipal().getSelected().get('controlfirma') == 2) : true) //last pki //para controlfirma == 2 limit 3 y 1 limit 2*/
                                ));
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }), 6);
        this.insertToolbarButton(LOG.util.Prototipos.botonImprimir({
            text: this.idioma.ttmBtnProductos,
            tooltip: this.idioma.ttmBtnProductos,
            iconCls: 'producto',
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.ttmBtnProductosa,
                    idItem: 'productoAct',
                    scope: _this,
                    handler: function () {
                        var _this = this;
                        var _vProdAct = new LOG.inv.alimento.detallesProductosActividad({
                            idioma: _this.idioma,
                            iddeposito: _this.smGridPrincipal.getSelected().data.idestructuracomun,
                            iddocumento: _this.smGridPrincipal.getSelected().data.iddocumento
                        });
                        _vProdAct.init();
                        _this.vistaA = _vProdAct.view();
                        _this.vistaA.show();
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.tlProductosMenu,
                    scope: _this,
                    idItem: 'productoMenu',
                    handler: function () {
                        var _this = this;
                        var _vProdMenu = new LOG.inv.alimento.detallesProductosMenu({
                            idioma: _this.idioma,
                            padreProductosMenu: _this,
                            modeloProductosMenu: _this.modelo,
                            iddeposito: _this.smGridPrincipal.getSelected().data.idestructuracomun,
                            iddocumento: _this.smGridPrincipal.getSelected().data.iddocumento
                        });
                        _vProdMenu.init();
                        _this.vistaM = _vProdMenu.view();
                        _this.vistaM.show();
                    }
                })
            ],
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RProductos')) {
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }), 7);
        this.insertToolbarButton(LOG.util.Prototipos.botonDuplicar({
            tooltip: this.idioma.ttBtnDuplicar,
            isContextual: true,
            handler: function () {
                _this.modelo.duplicar({
                    iddeposito: _this.smGridPrincipal.getSelected().get('iddeposito')
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') ||_caller.grantedAction('RDuplicar')) {
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }), 8);
        this.insertToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttBtnImprimir,
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirListado,
                    isList: true,
                    //dirReports: '/distra/logistica/inventario/alimento/MenuListado',
                    name: 'MenuListado',
                    handler: _this.onReport.createDelegate(this)
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    isList: false,
                    //dirReports: '/distra/logistica/inventario/alimento/MenuModelo',
                    name: 'MenuModelo',
                    disabled: true,
                    handler: _this.onReport.createDelegate(this)
                })
            ],
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RB')) {
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
        }), 9);
        LOG.util.UIManager.apply(this.listaBotones.getItem(11), {id: 'idMenu'});
        this.listaBotones.delete(10);
        //Accediendo a los botones por detalles
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarDoc,
            handler: function () {
                _this.modelo.eliminar(null, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(1), {
            tooltip: this.idioma.ttBtnConfirmar,
            handler: function () {
                _this.modelo.confirmar(_this.winGestionarDocumento.record.data, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    _this.modelo.addActionButton(_this.winGestionarDocumento.btnAdicionarActividad, false);
                    var tabPanel = _this.winGestionarDocumento.panelProductos.items.items[0];
                    Ext.each(tabPanel.items.items, function (rec, index) {
                        if (tabPanel.getTemplateByIndex(index).storePrincipal.getCount() > 0) {
                            tabPanel.getTemplateByIndex(index).storePrincipal.reload();
                        };
                        tabPanel.getTemplateByIndex(index).noRac.setDisabled(true);
                    });
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: '2'
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = '2';
                    }
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.gestionarElementos();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(2), {
            tooltip: this.idioma.ttBtnAnularEstado,
            handler: function () {
                _this.modelo.anularestado(_this.winGestionarDocumento.record.data, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    _this.modelo.addActionButton(_this.winGestionarDocumento.btnAdicionarActividad, true);
                    var tabPanel = _this.winGestionarDocumento.panelProductos.items.items[0];
                    Ext.each(tabPanel.items.items, function (rec, index) {
                        if (tabPanel.getTemplateByIndex(index).storePrincipal.getCount() > 0) {
                            tabPanel.getTemplateByIndex(index).storePrincipal.reload();
                        };
                        tabPanel.getTemplateByIndex(index).noRac.setDisabled(false);
                    });
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: '1'
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = '1';
                    }
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.gestionarElementos();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado')) {
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.insertToolbarButtonVentana(LOG.util.UIManager.createBtn({
            iconCls: 'revisar',
            text: this.idioma.lbBtnRevisadopor,
            tooltip: this.idioma.ttBtnRevisadopor,
            isContextual: true,
            disabled: true,
            handler: function () {
                var iddocumento = _this.smGridPrincipal.getSelected().get('iddocumento');
                _this.modelo.revisadoPor(iddocumento, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    _this.modelo.addActionButton(_this.winGestionarDocumento.btnAdicionarActividad, false);
                    var tabPanel = _this.winGestionarDocumento.panelProductos.items.items[0];
                    Ext.each(tabPanel.items.items, function (rec, index) {
                        if (tabPanel.getTemplateByIndex(index).storePrincipal.getCount() > 0) {
                            tabPanel.getTemplateByIndex(index).storePrincipal.reload();
                        };
                        tabPanel.getTemplateByIndex(index).noRac.setDisabled(false);
                    });
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: '11'
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = '11';
                    }
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.gestionarElementos();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RRevisadopor')) {
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }),3);
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), {
            tooltip: this.idioma.ttBtnAprobar,
            handler: function () {
                var iddocumento = _this.smGridPrincipal.getSelected().get('iddocumento');
                var idestructuracomun = _this.smGridPrincipal.getSelected().get('idestructuracomun');
                _this.modelo.aprobar(iddocumento, idestructuracomun, function (r) {
                    _this.modelo.addActionButton(_this.winGestionarDocumento.btnAdicionarActividad, false);
                    var tabPanel = _this.winGestionarDocumento.panelProductos.items.items[0];
                    Ext.each(tabPanel.items.items, function (rec, index) {
                        if (tabPanel.getTemplateByIndex(index).storePrincipal.getCount() > 0) {
                            tabPanel.getTemplateByIndex(index).storePrincipal.reload();
                        };
                    });
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: '3'
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = '3';
                    }
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.gestionarElementos();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '11') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(5), {
            tooltip: this.idioma.ttBtnDuplicar,
            handler: function () {
                _this.modelo.duplicar({
                    iddocumento: _this.winGestionarDocumento.record.data.iddocumento
                }, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: '1'
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = '1';
                    }
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(r.iddocumento);
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RDuplicar')) {
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

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(6), {
            tooltip: this.idioma.lbBtnImprimirModelo,
            disabled: true,
            handler: function () {
                _this.onReport({
                    isList: false,
                    name: 'MenuModelo'
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RB')) {
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
        /*this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonImprimir({
            hidden: true,
            handler: function () {
                _this.onTriggerReport({isList: false, name: 'MenuModelo',
                    dirReports: '/distra/logistica/inventario/alimento/MenuModelo'});
            },
            controlFn: function (b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RB'))) {
                    b.setVisible((_this.winGestionarDocumento.record) ? true : false);
                } else {
                    b.hide();
                }
            }
        }));*/
    },
    existeElemento: function (tabpanel, elem) {
        Ext.each(tabpanel.items.items, function (rec, index) {
            if (rec == elem)
                return true;
        });
        return false;
    },
    gestionarElementos: function () {
        var _this = this;
        if (this.winGestionarDocumento.tipoVentana == 3) {
            this.winGestionarDocumento.panelSuperior.setVisible(false);
            this.winGestionarDocumento.doLayout();
            this.winGestionarDocumento.buttons[1].hide();
            this.winGestionarDocumento.buttons[2].hide();
        } else {
            this.winGestionarDocumento.panelSuperior.setVisible(true);
            this.winGestionarDocumento.doLayout();
            if (this.winGestionarDocumento.record) {
                if (this.winGestionarDocumento.record.data.estado == 1) {
                    Ext.each(this.winGestionarDocumento.panelSuperior.findByType('combo'), function (_item) {
                        _item.setDisabled(false);
                    });
                    this.winGestionarDocumento.panelSuperior.findByType('datefield')[0].setDisabled(false);
                    this.winGestionarDocumento.panelSuperior.findById('iddeposito').setDisabled(false);
                    this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(false);
                    this.winGestionarDocumento.buttons[2].show();
                } else {
                    Ext.each(this.winGestionarDocumento.panelSuperior.findByType('combo'), function (_item) {
                        _item.setDisabled(true);
                    });
                    this.winGestionarDocumento.panelSuperior.findByType('datefield')[0].setDisabled(true);
                    this.winGestionarDocumento.panelSuperior.findById('iddeposito').setDisabled(true);
                    this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(true);
                    this.winGestionarDocumento.buttons[2].hide();
                }
                if (this.winGestionarDocumento.record.data.estado > 2) {
                    this.winGestionarDocumento.buttons[1].hide();
                }
                else {
                    this.winGestionarDocumento.buttons[1].show();
                }
            } else {
                this.winGestionarDocumento.setTitle(this.idioma.tlAdicionar);
                Ext.each(this.winGestionarDocumento.panelSuperior.findByType('combo'), function (_item) {
                    _item.setDisabled(false);
                });
                this.winGestionarDocumento.panelSuperior.findByType('datefield')[0].setDisabled(false);
                this.winGestionarDocumento.panelSuperior.findById('iddeposito').setDisabled(false);
                this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(false);
                this.winGestionarDocumento.buttons[1].show();
                this.winGestionarDocumento.buttons[2].show();
            }
        }
    },
    initDefaultColumns: function () {
        var _this = this;
        LOG.inv.alimento.View.superclass.initDefaultColumns.call(this);
        var columNroReferencia = this.listaColumnas.getPosByField('dataIndex', 'numeroref', 'header');
        this.insertGridColumn({
            header: this.idioma.gcFechaConsumo,
            width: 140,
            dataIndex: 'fechaconsumo',
            agrupador: true,
            hidden: true,
            default: true
        }, columNroReferencia + 1);

        var columEstado = this.listaColumnas.getPosByField('dataIndex', 'estado', 'header');
        this.insertGridColumn({
            header: this.idioma.gcActividad,
            width: 210,
            dataIndex: 'dactividades',
            default: true
        }, columEstado + 1);

        var columActividad = this.listaColumnas.getPosByField('dataIndex', 'dactividades', 'header');
        this.insertGridColumn({
            header: this.idioma.gcNormas,
            width: 120,
            dataIndex: 'denominacionnorma',
            default: true
        }, columActividad + 1);

        var columCreadopor = this.listaColumnas.getPosByField('dataIndex', 'idusuario', 'header');
        this.insertGridColumn({
            header: this.idioma.ttBtnRevisadoPor,
            width: 170,
            dataIndex: 'denominacionrevisado',
            default: true
        }, columCreadopor + 1);
        this.addGridColumn({
            dataIndex: 'idnorma',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idcentrogrupo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.lbCentroCosto,
            width: 40,
            hidden: true,
            autoExpand: true,
            dataIndex: 'descripcioncentrogrupo',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idestructuracomun',
            default: true
        });
        /*this.addGridColumn({
            header: this.idioma.lbDep,
            width: 40,
            hidden: true,
            dataIndex: 'deposito',
            default: true
        });*/
        this.addGridColumn({
            dataIndex: 'deposito'
        });
        this.addGridColumn({
            dataIndex: 'iddeposito'
        });
        this.addGridColumn({
            dataIndex: 'controlfirma'
        });
        this.addGridColumn({
            dataIndex: 'idnodo'
        });
    },
    buildReport: function (btn, record) {
        return {
            name: btn.name,
            description: btn.name + " # " + record.get('nrodoc') + " del " + record.get('fechacontable') + " en " + LOG.lb.documento.Estado[record.get('estado')],
            isList: btn.isList,
            params: this.getParamsReport(record, btn),
            dirReport: this.dirReport + btn.name
        };
    },
    onReport: function (btn) {
        var _this = this;
        var record = this.getGridPrincipal().getSelectionModel().getSelected();
        new LOG.util.Report({
            reports: [this.buildReport(btn, record)]
        }).view();
    },
    getParamsReport: function (record, btn) {
        var _this = this;
        return {
            useSign: this.useSign,
            hasCategoria: (usarCategoria) ? 'true' : 'false',
            iddocumento: record.get("iddocumento") || null,
            iddoc: record.get("iddoc") || null,
            idnodo: record.get("idnodo") || null,
            //hasFirma: (usarPki && typeof pki == 'object') ? 'true' : 'false',
            //iddir: (idespaciotrabajo && idespaciotrabajo != undefined) ? idespaciotrabajo : null,
            idestructura: true

        };
    }/*,
    onTriggerReport: function (btn) {
        var _this = this;
        var has = _this.getGridPrincipal().getSelectionModel().hasSelection();
        var record = _this.winGestionarDocumento.isVisible() ? new Ext.data.Record(_this.winGestionarDocumento.record.data) :_this.getGridPrincipal().getSelectionModel().getSelected();
        this.sm = _this.getGridPrincipal().getSelectionModel();
        this.control = new Distra.util.report.ViewController({
            sm: _this.getGridPrincipal().getSelectionModel(),
            //useFirma: (usarPki && typeof pki == 'object'),
            idioma: this.idioma,
            st: _this.getStorePrincipal(),
            reportList: [
                {
                    name: btn.name,
                    typeView: 3,
                    record: record,
                    status: LOG.lb.documento.Estado,
                    limit: 2,
                    acciones: this.acciones,
                    isList: btn.isList,
                    params: {
                        //hasFirma: (usarPki && typeof pki == 'object') ? 'true' : 'false',
                        hasCategoria: (usarCategoria) ? 'true' : 'false',
                        iddoc: (has) ? record.get("iddoc") : null,
                        idnodo: (has) ? record.get("idnodo") : null,
                        //iddir: (idespaciotrabajo && idespaciotrabajo != undefined) ? idespaciotrabajo : null,
                        iddocumento: ((has)) ? record.get("iddocumento") : null,
                        idestructura: true
                    },
                    dirReports: btn.dirReports,
                    detailFirma: {
                        1: 'Elaborado',
                        2: 'Aprobado'
                    },
                    browserAdvanz: {}
                }
            ]
        });
        this.control.view('1');
    }*/,
    panelSuperior: function () {
        var _this = this;
        //Primer bloque de columnas
        this.cls = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        this.date = new Date();
        this.cls.addComponent(this.fechaConsumo = new Ext.form.DateField({
            fieldLabel: _this.idioma.lbDfFecha,
            name: 'fechaconsumo',
            enableKeyEvents: true,
            editable: false,
            allowBlank: false,
            minValue: this.date
            //value: null
        }));
        //this.fechaConsumo.setValue(date);
        this.cls.addComponent(this.extensionCentroCosto = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCentroCosto,
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarCentroCostos',
            hiddenName: 'idcentrogrupo',
            valueField: 'idcentrogrupo',
            displayField: 'descripcioncentrogrupo',
            allowBlank: false,
            mode: 'remote',
            pageSize: 10,
            forceSelection: true,
            resizable: true,
            emptyText: this.idioma.lbSel
        }));
        this.cls.addComponent(this.cbTipoNorma = new Ext.erp.comboNomenclador({
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            // bussines: 'NomNormaModel',
            modelo: 'NomNorma',
            idnom: 'idnorma',
            name: 'denominacionnorma',
            anchor: '90%',
            forceSelection: true,
            allowBlank: false,
            editable: false,
            autoCargar: true,
            fieldLabel: this.idioma.lbTipoN,
            emptyText: this.idioma.lbSel
        }));

        this.cls.addComponent(this.comboDepositos = new LOG.util.LovCombo({
            fieldLabel: this.idioma.lbDep,
            url: 'cargardepositos',
            hiddenName: 'iddeposito',
            valueField: 'iddeposito',
            displayField: 'deposito',
            id: 'iddeposito',
            editable: false,
            allowBlank: false,
            mode: 'remote',
            forceSelection: true,
            resizable: true,
            emptyText: this.idioma.lbSel
        }));

        this.taObservaciones = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbTaObservaciones,
            name: 'observaciones',
            width: '99%',
            minLength: 2,
            maxLength: 255,
            maxLengthText: this.idioma.msgTaTamanoMaximo,
            tabular: true
        });

        this.formularioGeneral = LOG.util.UIManager.initPanel({
            layout: 'form',
            labelAlign: 'top',
            items: [this.cls, this.taObservaciones]
        });
    }
});
LOG.inv.alimento.ventanaAdicionarMenuAlimento = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    constructor: function (config) {
        LOG.util.UIManager.apply(config.idioma, LOG.inv.alimento.Idioma);
        LOG.inv.alimento.ventanaAdicionarMenuAlimento.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function () {
        LOG.inv.alimento.ventanaAdicionarMenuAlimento.superclass.initDefaultButtons.call(this);
    },
    builComponent: function () {
        var _this = this;
        this.idioma = this.idioma || LOG.lb.documento.Idioma;
        this.panelSuperior = LOG.util.UIManager.initPanel({
            region: 'north',
            title: this.idioma.tlPanelAdicionar,
            titleCollapse: true,
            collapsible: true,
            collapseMode: 'mini',
            animCollapse: false,
            animate: false,
            autoHeight: true,
            frame: true
        });
        this.btnAdicionarActividad = LOG.util.UIManager.createBtn({
            text: this.idioma.lbAct,
            tooltip: this.idioma.ttmBtnAddAct,
            iconCls: 'actividades',
            isContextual: true,
            handler: function () {
                var _vAct = new LOG.inv.alimento.gridActividades({
                    idioma: _this.idioma,
                    padreActividades: _this.padreGestionarMenuAlimento,
                    modeloActividades: _this.modelo
                });
                _vAct.init();
                _this.vistaAct = _vAct.view();
                _this.vistaAct.show();
            },
            controlFn: function (b, _caller) {
                if (_this.padreGestionarMenuAlimento.grantedAction('RCRUD') || _this.padreGestionarMenuAlimento.grantedAction('RAdicionar')) {
                    b.disable();
                    if (/*_this.tipoVentana == 1 && !_this.record || (*/_this.record && _this.record.data.estado == '1') {
                        b.enable();
                    } else if (_this.tipoVentana == 2 && _this.record && _this.record.data.estado == '1') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            },
            fnEspecialCondition: function () {
                if ((_this.modelo.basicForm && !_this.modelo.basicForm.isValid())) {
                    return true;//para que desahabilite el boton
                }
                else {

                    return false;
                }
            }
        });
        this.panelProductos = LOG.util.UIManager.initPanel({
            layout: 'fit',
            frame: true,
            tbar: LOG.util.UIManager.initToolbar({
                items: [this.btnAdicionarActividad]
            }),
            region: 'center'
        });
        this.btnSalvar = LOG.util.Prototipos.botonGuardar({
            tooltip: this.idioma.lbBtnGuardar,
            scope: this,
            handler: this.salvarHandler,
            controlFn: function (b, _caller) {
                /*if (_this.noRac.isValid()) {
                    b.enable();
                }*/
               /*Ext.each(_this.panelProductos.items.items[0].items.items, function (rec, index) {
                    _this.panelProductos.items.items[0].getTemplateByIndex(index).storePrincipal.fireEvent = _this.panelProductos.items.items[0].getTemplateByIndex(index).storePrincipal.fireEvent.createSequence(function (e) {
                        if (_this.record &&_this.panelProductos.items.items[0].getTemplateByIndex(index).storePrincipal.getCount() > 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    });
                });*/
            }
        });
        this.btnNuevo = LOG.util.Prototipos.botonNuevo({
            tooltip: this.idioma.lbBtnNuevoDoc,
            handler: this.onResetHandler,
            scope: this,
            controlFn: function () {

            }
        });
        this.btnCerrar = LOG.util.Prototipos.botonCancelar({
            text: this.idioma.lbBtnCerrar,
            handler: function () {
                _this.modelo.reset();
                this.scope.close();
            },
            scope: this
        }, true);
        this.modelo.addActionButton(this.btnSalvar);
        this.modelo.addActionButton(this.btnAdicionarActividad, true);
        LOG.util.UIManager.apply(this, {
            resizable: false,
            tbar: this.listaBotonesVentana.getArray(),
            items: [this.panelSuperior, this.panelProductos],
            buttons: [this.btnCerrar, this.btnNuevo, this.btnSalvar]
        });
        LOG.inv.alimento.ventanaAdicionarMenuAlimento.superclass.initComponent.call(this);
        this.onShow = this.onShow.createSequence(this.onShowHandler, this);
    },
    salvarHandler: function () {
        var _this = this.scope || this;
        _this.menu = {
            'actividades': []
        };
        var tabPanel = _this.panelProductos.items.items[0];
        if (tabPanel == undefined) {
            mostrarMensaje(1, _this.idioma.msgValidarDatosMenu);
        } else if (tabPanel.getTemplateByIndex(0).storePrincipal.getCount() == 0) {
            mostrarMensaje(1, _this.idioma.msgValidarDatosReceta);
        } else {
            Ext.each(tabPanel.items.items, function (rec, index) {
                if (tabPanel.getTemplateByIndex(index).storePrincipal.getCount() > 0) {
                    _this.menu['actividades'].push({
                        idactividadalimento: tabPanel.getTemplateByIndex(index).idComponent,
                        racion: tabPanel.getTemplateByIndex(index).noRac.value
                        /*orden: tabPanel.getTemplateByIndex(index).nOrd.value*/
                    });
                }
            });
            _this.modelo.salvar({
                listaRecetas: Ext.encode(_this.menu)
            }, function (r) {
                if (_this.modelo.listaProductos.count() || r.reloadGridDetalle == 1) {
                    _this.cargarProductos();
                }
                _this.tipoVentana = 2;
                if (_this.record == null) {
                    _this.record = {};
                    Ext.apply(_this.record, {
                        data: {
                            iddocumento: r.iddocumento,
                            nrodoc: r.nro,
                            numeroref: r.numeroref,
                            fechacontable: r.fecha,
                            estado: "1"
                        }
                    });
                }

                Ext.each(tabPanel.items.items, function (rec, index) {
                    if (tabPanel.getTemplateByIndex(index).storePrincipal.getCount() > 0) {
                        tabPanel.getTemplateByIndex(index).storePrincipal.reload();
                    };
                });

                if (_this.padreGestionarMenuAlimento) {
                    _this.padreGestionarMenuAlimento.storePrincipal.reload();
                }
                _this.getTitleDocumento(r.iddocumento);
                _this.listaBotonesVentana.each(function (b) {
                    LOG.util.UIManager.applyKey(b, _this);
                    if (typeof b.controlFn == 'function') {
                        b.controlFn.createDelegate(_this, [b, _this]).call();
                    }
                }, _this);
            });
        }
    },
    onResetHandler: function () {
        var _this = this.scope || this;
        if (_this.fromularioGestion) {
            _this.modelo.reset();
            _this.record = null;
        }
        if (_this.padreGestionarMenuAlimento.winGestionarDocumento.panelProductos.items.items[0]) {
            _this.padreGestionarMenuAlimento.winGestionarDocumento.panelProductos.items.items[0].destroy();
            _this.padreGestionarMenuAlimento.winGestionarDocumento.panelProductos.doLayout();
        }
    },
    onCloseHandler: function (p) {
        var _this = this;
        if (_this.fromularioGestion) {
            _this.record = null;
            _this.modelo.reset();
        }
        _this.padreGestionarMenuAlimento.storePrincipal.reload();
        return LOG.lb.documento.ventanaGestionDocumentos.superclass.onCloseHandler.call(_this, p);
    },
    addPanelSuperior: function (p) {
        this.fromularioGestion = LOG.util.UIManager.initForm({items: [p]});
        this.modelo.bindForm(this.fromularioGestion);
        this.panelSuperior.add(this.fromularioGestion);
    },
    prepareDocModify: function (d) {
        if (this.fromularioGestion) {
            this.fromularioGestion.getForm().loadRecord(d);
            this.modelo.loadRecord();
            this.cargarProductos();
            this.record = d;
            this.getTitleDocumento(this.record.data.iddocumento);
        }
    },
    onCancelarHandler: function () { //cerrar
        var _this = this.scope || this;
        _this.close();
        _this.modelo.reset();
    },
    cargarProductos: function (parametros) {
        var _this = this;

    },
    onShow: function () {
        var _this = this;
        LOG.inv.alimento.ventanaAdicionarMenuAlimento.superclass.onShow.call(this);
        this.btnAdicionarActividad.controlFn.createDelegate(this, [this.btnAdicionarActividad, this]).call();
        this.listaBotonesVentana.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
        this.listaBotonesProductos.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
    },
    ocultarColumna: function (dataIndex, ocultar) {
    }
});
LOG.inv.alimento.GridTabPanel = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 3;
        this.idComponent = 0;
        this.autoLoad = false;
        this.listaRecetas = new LOG.util.List();
        this.idGridPrincipal = 'idreceta';
        this.busquedaBasica = true;
        this.textBusquedaSimple = config.idioma.cgDenominacion;
        this.urlBusquedaGridPrincipal = 'cargarRecetaMenu';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.inv.alimento.Idioma);
        this.iddocumento = config.iddocumento;
        this.rowexpander = this.idioma.cgRowExpand + ' : ' + ' {observacioncalidad}';
        LOG.inv.alimento.GridTabPanel.superclass.constructor.call(this, config);
    },
    init: function () {
        var _this = this;
        LOG.inv.alimento.GridTabPanel.superclass.init.call(this);
        this.noRac.on({
            keyup: function () {
                _this.listaBotones.getItem(0).disable();
                if (this.getValue() > 0) {
                    _this.listaBotones.getItem(0).enable();
                    _this.padreTabPanel.winGestionarDocumento.btnSalvar.enable();
                } else {
                    _this.listaBotones.getItem(0).disable();
                    _this.padreTabPanel.winGestionarDocumento.btnSalvar.disable();
                }
            }
        });

        /*this.nOrd.on({
            keyup: function () {
                if (this.getValue() != '' && this.isValid()) {
                    _this.padreTabPanel.winGestionarDocumento.btnSalvar.enable();
                } else {
                    _this.padreTabPanel.winGestionarDocumento.btnSalvar.disable();
                }
            }
        })*/
    },
    render: function () {
        var _this = this;
        var p = LOG.inv.alimento.Recetas.superclass.render.call(this);
        p.on({
            'activate': function (panel) {
                _this.storePrincipal.reload();
            }
        });
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                st.initBaseParams.iddocumento = _this.padreTabPanel.winGestionarDocumento.modelo.iddocumento;
                st.initBaseParams.idComponent = _this.idComponent;
            },
            'load': function (st, r, o) {
                if (st.getAt(0)) {
                    _this.noRac.setValue(st.getAt(0).data.cantidad);
                    _this.calorias.setValue(st.getAt(0).json.caloriastotal);
                    _this.proteinas.setValue(st.getAt(0).json.proteinastotal);
                }
                if (_this.padreTabPanel.winGestionarDocumento && _this.padreTabPanel.winGestionarDocumento.record.data.estado > 1) {
                    _this.noRac.disable();
                } else {
                    _this.noRac.enable();
                }
            }
        });

        if (_this.padreTabPanel.winGestionarDocumento && _this.padreTabPanel.winGestionarDocumento.tipoVentana == 2) {
            _this.getStorePrincipal().load();
        }
        return p;
    },
    onShowHandler: function () {
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, this.parametros);
        this.getStorePrincipal().reload();
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 120,
            dataIndex: 'denominacionreceta',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantidad,
            width: 100,
            dataIndex: 'cantidad',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 80,
            dataIndex: 'umedida',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgAutorizado,
            width: 80,
            dataIndex: 'autorizadoentregar',
            default: true,
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'log-activo';
                } else {
                    metaData.css = 'log-inactivo';
                }
            }
        });
        this.addGridColumn({
            dataIndex: 'idactividad'
        });
        this.addGridColumn({
            dataIndex: 'observacioncalidad'
        });
        this.addGridColumn({
            dataIndex: 'aprobadocalidad'
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
            text: this.idioma.lbRecetas,
            tooltip: this.idioma.ttBtnAddReceta,
            handler: function () {
                var _vRecetas = new LOG.inv.alimento.Recetas({
                    idioma: _this.idioma
                });
                _vRecetas.init();
                _vRecetas.getVistaPrincipal().aceptarFn = function () {
                    if (_this.padreTabPanel != undefined) {
                        var sm = _vRecetas.smGridPrincipal.selections.items;
                        var _recetas = new Array();
                        Ext.each(sm, function (rec) {
                            _recetas.push(rec.get('idreceta'));
                        });
                        _this.menuHijo = {
                            actividades: [
                                {
                                    idactividadalimento: _this.idComponent,
                                    data: _recetas,
                                    racion: _this.noRac.getValue()
                                    /*orden: _this.nOrd.getValue()*/
                                }
                            ]
                        };
                        var datosRecetas = {
                            listaRecetas: Ext.encode(_this.menuHijo),
                            idactividadalimento: _this.idComponent,
                            idreceta: Ext.encode(_recetas)};
                        _this.modeloTabPanel.salvarRecetas(datosRecetas, _this.padreTabPanel.winGestionarDocumento.tipoVentana,
                            function (r) {
                                _this.getStorePrincipal().reload({
                                    params: r
                                });
                                if (_this.padreTabPanel.winGestionarDocumento.record == null) {
                                    _this.padreTabPanel.winGestionarDocumento.record = {};
                                    Ext.apply(_this.padreTabPanel.winGestionarDocumento.record, {
                                        data: {
                                            iddocumento: r.iddocumento,
                                            estado: '1'
                                        }
                                    });
                                }
                                _this.padreTabPanel.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                                    LOG.util.UIManager.applyKey(b, _this.padreTabPanel.winGestionarDocumento);
                                    if (typeof b.controlFn == 'function') {
                                        b.controlFn.createDelegate(_this.padreTabPanel.winGestionarDocumento, [b, _this.padreTabPanel.winGestionarDocumento]).call();
                                    }
                                }, _this.padreTabPanel.winGestionarDocumento);
                            });
                    }
                };
                _this.vistaRecetas = _vRecetas.view();
                _this.vistaRecetas.show();
            },
            scope: this,
            controlFn: function (b, _caller) {
                if (_this.padreTabPanel.grantedAction('CT') || _this.padreTabPanel.grantedAction('RCRUD') || _this.padreTabPanel.grantedAction('RAdicionar')) {
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        /*if (_this.padreTabPanel.winGestionarDocumento && _this.padreTabPanel.winGestionarDocumento.record && _this.padreTabPanel.winGestionarDocumento.record.data.estado == 1) {
                            b.enable();
                            _this.noRac.setDisabled(false);
                        } else if (_this.padreTabPanel && _this.padreTabPanel.winGestionarDocumento && _this.padreTabPanel.winGestionarDocumento.tipoVentana == 1) {
                            b.enable();
                            _this.noRac.setDisabled(false);
                        } else {
                            b.disable();
                            _this.noRac.setDisabled(true);
                        }*/
                        if (_this.padreTabPanel.winGestionarDocumento && _this.padreTabPanel.winGestionarDocumento.record && _this.padreTabPanel.winGestionarDocumento.record.data.estado == 1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
            text: this.idioma.txtEliminar,
            tooltip: this.idioma.ttbtnEliminarReceta,
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                var sm = _this.smGridPrincipal.selections.items;
                var _recetas = new Array();
                var iddocumento = _this.modeloTabPanel.iddocumento;
                Ext.each(sm, function (rec) {
                    _recetas.push(rec.json.idreceta);
                });
                _this.modeloTabPanel.eliminarRecetas(_recetas, iddocumento, _this.idComponent, function (r) {
                    _this.storePrincipal.reload(/*{params: r}*/);
                    if (_this.storePrincipal.getCount() > 0) {
                        _this.listaBotones.getItem(1).disable();
                    } else {
                        _this.noRac.setValue('');
                    }
                });
            },
            controlFn: function (b, _caller) {
                if (_this.padreTabPanel.grantedAction('CT') || _this.padreTabPanel.grantedAction('RCRUD') || _this.padreTabPanel.grantedAction('REliminar')) {
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect' && (!_this.padreTabPanel.winGestionarDocumento.record || (_this.padreTabPanel.winGestionarDocumento.record && _this.padreTabPanel.winGestionarDocumento.record.data.estado == 1))) {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnAutorizar,
            tooltip: this.idioma.ttBtnAutorizar,
            iconCls: 'aprobar',
            handler: function () {
                var params = new Array();
                params.push({
                    'idactividad': _this.storePrincipal.getAt(0).json.idactividad
                });
                _this.modeloTabPanel.guardarAutorizacionEntrega(params, function () {
                    _this.getStorePrincipal().reload();
                });
            },
            scope: this,
            controlFn: function (b, _caller) {
                if (_this.padreTabPanel.grantedAction('CT') || _this.padreTabPanel.grantedAction('RAutorizar')) {
                    b.setVisible(true);
                    b.disable();
                    /*_caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (_caller.padreTabPanel.winGestionarDocumento.record && _caller.padreTabPanel.winGestionarDocumento.record.data.estado == 3) {
                            var seleccion = this.getSelections();
                            Ext.each(seleccion, function (r) {
                                if (r.json.aprobadocalidad != 1) {
                                    b.disable();
                                }
                            });
                        }
                        else {
                            b.enable();
                        }
                    });*/
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0) {
                                b.enable();
                                var seleccion = this.getSelections();
                                Ext.each(seleccion, function (r) {
                                    if (r.json.aprobadocalidad != 1) {
                                        b.disable();
                                    }
                                });
                            } else {
                                b.disable();
                            }
                        }
                    }, 'autorizar');
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnCalidad,
            tooltip: this.idioma.ttBtnCalidad,
            iconCls: 'dictamentecnico',
            handler: function () {
                this.calid = new LOG.inv.alimento.conclusionMedicas({
                    idioma: _this.idioma,
                    modeloConMedicas: _this.modeloTabPanel,
                    scope: _this
                });
                this.calid.show();
            },
            scope: this,
            controlFn: function (b, _caller) {
                if (_this.padreTabPanel.grantedAction('CT') || _this.padreTabPanel.grantedAction('RConclusionmedica')) {
                    b.setVisible(true);
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (_caller.padreTabPanel.winGestionarDocumento.record && _caller.padreTabPanel.winGestionarDocumento.record.data.estado == 3) {
                            if (_caller.getGridPrincipal().getSelectionModel().hasSelection()) {
                                b.enable();
                            } else {
                                b.enable();
                            }
                        } else {
                            b.disable();
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton('->');

        /*this.addToolbarButton(this.idioma.lbNoOrden);
        this.nOrd = LOG.util.Prototipos.inputEntero({
            name: 'nOrden',
            width: 100,
            enableKeyEvents: true
        });*/
        /*this.addToolbarButton(this.nOrd);*/
        this.addToolbarButton(this.idioma.lbTotalCal);
        this.calorias = LOG.util.Prototipos.inputTexto({
            disabled: true,
            width: 100,
            enableKeyEvents: true
        });
        this.addToolbarButton(this.calorias);
        this.addToolbarButton(this.idioma.lbTotalProt);
        this.proteinas = LOG.util.Prototipos.inputTexto({
            disabled: true,
            width: 100,
            enableKeyEvents: true
        });
        this.addToolbarButton(this.proteinas);
        this.addToolbarButton(this.idioma.lbNoRac);
        this.noRac = LOG.util.Prototipos.inputEntero({
            name: 'noRaciones',
            width: 100,
            enableKeyEvents: true
        });
        this.addToolbarButton(this.noRac);
    },
    getDatosRaciones: function () {
        var _this = this;
        return this.noRac.getValue();
    }
});
LOG.inv.alimento.Recetas = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        config.idioma = LOG.util.UIManager.apply(LOG.inv.alimento.Idioma, LOG.util.Idioma.init());
        this.formaVisualizacion = 'ventana';
        this.busquedaBasica = true;
//        this.textBusquedaSimple = '';
        this.autoSelect = false;
        this.parametros = undefined;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        this.dirController = '/logistica/inventario/alimento/index.php/menualimento';
        this.urlBusquedaGridPrincipal = 'cargarRecetasNomencladas';
        LOG.inv.alimento.Recetas.superclass.constructor.call(this, config);
    },
    init: function () {
        var _this = this;
        LOG.inv.alimento.Recetas.superclass.init.call(this);
        this.getVistaPrincipal().title = this.idioma.tlAdicionarReceta;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(700, 400);
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idreceta',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantCal,
            dataIndex: 'calorias',
            default: true,
            align:'right'
        });
        this.addGridColumn({
            header: this.idioma.cgCantProt,
            dataIndex: 'proteinas',
            default: true,
            align:'right'
        });
        this.addGridColumn({
            header: this.idioma.cgCantidad,
            dataIndex: 'cantracion',
            default: true,
            align:'right'
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            dataIndex: 'abreviaturaunidadmedida',
            default: true
        });
    },
    render: function () {
        var _this = this;
        var p = LOG.inv.alimento.Recetas.superclass.render.call(this);
        this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange') {
                _this.habilitarBotones();
            }
        });
        return p;
    },
    habilitarBotones: function () {
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
            this.getVistaPrincipal().listaBotones.getItem(2).enable();
        }
    },
    onShowHandler: function () {
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, this.parametros);
        this.getStorePrincipal().reload();
    }
});
LOG.inv.alimento.detallesProductosActividad = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        config.idioma = LOG.util.UIManager.apply(LOG.inv.alimento.detallesProductosActividad, LOG.inv.alimento.Idioma);
        this.formaVisualizacion = 'ventana';
        this.busquedaBasica = true;
        this.textBusquedaSimple = config.idioma.cgDenominacion;
        this.autoSelect = false;
        this.modoSeleccion = 1;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        this.autoLoad = false;
        this.idGridPrincipal = 'idordenar';
        this.dirController = '/logistica/inventario/alimento/index.php/menualimento';
        this.urlBusquedaGridPrincipal = 'cargarDetallesProductos';
        LOG.inv.alimento.detallesProductosActividad.superclass.constructor.call(this, config);
    },
    init: function () {
        var _this = this;
        LOG.inv.alimento.detallesProductosActividad.superclass.init.call(this);
        this.getVistaPrincipal().title = this.idioma.tlActividades;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(800, 400);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idordenar'
        });
        this.addGridColumn({
            dataIndex: 'idactividad'
        });
        this.addGridColumn({
            header: this.idioma.gcActividad,
            dataIndex: 'tipoactividadetalle',
            hidden: true,
            agrupador: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcRaciones,
            dataIndex: 'cantraciones',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantidadP,
            dataIndex: 'cantidad',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantidadT,
            dataIndex: 'cantidadtotal',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            dataIndex: 'umedida',
            default: true
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(0), {
            text: this.idioma.lbBtnCerrar

        });
    },
    render: function () {
        var _this = this;
        var p = LOG.inv.alimento.detallesProductosActividad.superclass.render.call(this);
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                st.initBaseParams.iddocumento = _this.iddocumento;
                st.initBaseParams.iddeposito = _this.iddeposito;
            }
        });
        _this.getStorePrincipal().load();
        return p;
    }
});
LOG.inv.alimento.detallesProductosMenu = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        config.idioma = LOG.util.UIManager.apply(LOG.inv.alimento.detallesProductosMenu, LOG.inv.alimento.Idioma);
        this.formaVisualizacion = 'ventana';
        this.busquedaBasica = true;
        this.textBusquedaSimple = config.idioma.cgDenominacion;
        this.autoSelect = false;
        this.modoSeleccion = 1;
        this.concepto = config.idioma.txtCampoBusqueda;
        this.autoShow = false;
        this.autoLoad = false;
        this.gridEditable = true;
        this.idGridPrincipal = 'idproducto';
        this.dirController = '/logistica/inventario/alimento/index.php/menualimento';
        this.urlBusquedaGridPrincipal = 'cargarDetallesProductos';
        LOG.inv.alimento.detallesProductosMenu.superclass.constructor.call(this, config);
    },
    init: function () {
        var _this = this;
        LOG.inv.alimento.detallesProductosMenu.superclass.init.call(this);
        this.getVistaPrincipal().title = this.idioma.tlProductosMenu;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(800, 400);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            header: this.idioma.lbInd,
            dataIndex: 'idindicador',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idestructura',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcRaciones,
            dataIndex: 'cantraciones',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantidad,
            dataIndex: 'cantidad',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.lbNec,
            dataIndex: 'cantidadtotal',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.lbDisp,
            dataIndex: 'disponible',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            dataIndex: 'umedida',
            default: true
        });
        this.cmbCategorias = new LOG.util.ComboBox({
            valueField: 'idcategoria',
            displayField: 'denominacioncategoria',
            anchor: '90%',
            allowBlank: false,
            editable: false,
            autoCargar: true,
            store: new Ext.data.JsonStore({
                idProperty: 'idcategoria',
                fields: ['idcategoria', 'denominacioncategoria']
            }),
            listeners: {
                'focus': function (combo) {
                    var record = _this.smGridPrincipal.getSelected();
                    combo.getStore().loadData(record.json.categoria);
                },
                'select': function (cb, rec) {
                    var record = _this.smGridPrincipal.getSelected();
                    record.data.idcategoria = rec.data.idcategoria;
                    cb.setValue(rec.data.denominacioncategoria);
                }
            }
        });
        if (typeof usarCategoria !== 'undefined' && usarCategoria == true) {
            this.addGridColumn({
                header: this.idioma.cgCategoria,
                dataIndex: 'nomcategoria',
                width: 150,
                editor: this.cmbCategorias,
                default: true
            });
        }
        this.addGridColumn({
            dataIndex: 'idcategoria',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'cantcategoria',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'colorize',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'codigoauxiliar',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'aceptalternativo',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'imprescindible',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idproductomenu',
            default: true
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
            disabled: true,
            text: this.idioma.lbAlt,
            tooltip: this.idioma.tlProAlt,
            iconCls: 'producto',
            handler: function () {
                this.act = new LOG.inv.alimento.productoAlternativo({
                    idioma: this.idioma,
                    padreProductoAlternativo: _this,
                    modeloProductoAlternativo: _this.modeloProductosMenu,
                    idindicador: _this.smGridPrincipal.getSelected().data.idindicador,
                    iddeposito: _this.smGridPrincipal.getSelected().data.idestructura,
                    codigoauxiliar: _this.smGridPrincipal.getSelected().data.codigoauxiliar,
                    idproducto: _this.smGridPrincipal.getSelected().data.idproducto,
                    idproductomenu: _this.smGridPrincipal.getSelected().data.idproductomenu,
                    iddocumento: _this.iddocumento
                });
                this.act.show();
            },
            controlFn: function (b, _caller) {
                if ((_this.padreProductosMenu.grantedAction('CT')  || _this.padreProductosMenu.grantedAction('RAdicionar') || _this.padreProductosMenu.grantedAction('RCRUD'))) {
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 /*&& this.getSelected().data.colorize == 1*/
                                && this.getSelected().data.aceptalternativo == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'alternativoProd');
                } else {
                    b.setVisible(false);
                }
            }

        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: this.idioma.ttmBtnEliminarProd,
            handler: function () {
                var iddocumento = _this.iddocumento;
                var idindicador = _this.smGridPrincipal.getSelected().data.idindicador;
                _this.modeloProductosMenu.eliminarProductoMenu(iddocumento, idindicador, function (r) {
                    _this.getStorePrincipal().reload({
                        params: r
                    });
                });
            },
            controlFn: function (b, _caller) {
                if (_this.padreProductosMenu.grantedAction('CT') || _this.padreProductosMenu.grantedAction('REliminar') || _this.padreProductosMenu.grantedAction('RCRUD')) {
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                      
                        if (e == 'rowselect' && _caller.getGridPrincipal().getSelectionModel().getSelected().data.imprescindible != 1) {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            /* text: this.idioma.lbBtnGuardar,
             tooltip: this.idioma.ttmBtnGuardarCambio,
             iconCls: 'guardar',*/
            disabled: true,
            handler: function () {
                var record = _this.storePrincipal.getModifiedRecords();
                var listaProductosCategorias = new Array();
                Ext.each(record, function (rec) {
                    var data = {
                        idindicador: rec.data.idindicador,
                        idcategoria: rec.data.idcategoria,
                        cantidadtotal: rec.data.cantidadtotal
                    };
                    listaProductosCategorias.push(data);
                });
                _this.modeloProductosMenu.salvarCategorias({
                    productos: listaProductosCategorias,
                    deposito: _this.iddeposito,
                    idmenu: _this.iddocumento
                });
            }
        });
    },
    render: function () {
        var _this = this;
        var p = LOG.inv.alimento.detallesProductosMenu.superclass.render.call(this);
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                st.initBaseParams.iddocumentos = _this.iddocumento;
                st.initBaseParams.iddeposito = _this.iddeposito;
                st.initBaseParams.productoMenu = true;
            }
        });
        _this.getStorePrincipal().load();
        _this.gpPrincipal.on({
            'beforeedit': function (e) {
                if (e.record.data.cantcategoria < 2)
                    return false;
            }
        });
        Ext.apply(_this.gpPrincipal, {
            viewConfig: {
                getRowClass: function (rec, index, rowParams, store) {
                    if (rec.data.colorize == 1) {
                        return 'redrow-text';
                    }
                }
            }
        });
        _this.gpPrincipal.on({
            'afteredit': function (obj) {
                _this.getVistaPrincipal().listaBotones.getItem(1).enable();
            }
        });
        return p;
    }
});
LOG.inv.alimento.gridActividades = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        config.idioma = LOG.util.UIManager.apply(LOG.inv.alimento.gridActividades, LOG.inv.alimento.Idioma);
        this.formaVisualizacion = 'ventana';
        this.busquedaBasica = false;
        this.autoSelect = false;
        this.autoLoad = false;
        this.autoShow = false;
        this.gridEditable = true;
        this.idGridPrincipal = 'id';
        this.dirController = '/logistica/inventario/alimento/index.php/menualimento';
        this.urlBusquedaGridPrincipal = 'cargarActividadesMenu';
        LOG.inv.alimento.gridActividades.superclass.constructor.call(this, config);
    },
    init: function () {
        var _this = this;
        LOG.inv.alimento.gridActividades.superclass.init.call(this);
        this.getVistaPrincipal().title = this.idioma.lbAct;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(500, 350);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            dataIndex: 'idactividadalimento',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'estado',
            default: true
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            disabled: true,
            handler: function () {
                var sm = _this.smGridPrincipal.selections.items;
                _this.tapPanel = new LOG.util.UITabTemplate({
                    idioma: _this.idioma,
                    formaVisualizacion: 'panel'
                });
                if (_this.padreActividades.winGestionarDocumento.panelProductos.items && _this.padreActividades.winGestionarDocumento.panelProductos.items.items[0]) {
                    var data = _this.padreActividades.winGestionarDocumento.panelProductos.items.items[0].items.items;
                    var elementos = _this.obtenerElementos(data, sm);
                    _this.padreActividades.winGestionarDocumento.panelProductos.items.items[0].destroy();
                    _this.padreActividades.winGestionarDocumento.panelProductos.doLayout();
                    _this.crearPaneles(_this.tapPanel, elementos, true);
                } else {
                    _this.crearPaneles(_this.tapPanel, sm, false);
                }
                _this.tapPanel.init();
                _this.tapPanel.view();
                _this.padreActividades.winGestionarDocumento.panelProductos.doLayout();
                _this.tapPanel.setActiveTab(0);
                this.close();
            }
        });
    },
    crearPaneles: function (tabPanel, elem, flag) {
        var _this = this;
        elem.forEach(function (e, i) {
            this.gridT = new LOG.inv.alimento.GridTabPanel({
                idioma: _this.idioma,
                modeloTabPanel: _this.modeloActividades,
                padreTabPanel: _this.padreActividades,
                title: flag ? e['denominacion'] : e.get('denominacion'),
                idComponent: flag ? e['idactividadalimento'] : e.get('idactividadalimento'),
                iddocumento: _this.modeloActividades.iddocumento
            });
            tabPanel.addTabToTemplete(this.gridT);
        });
        _this.padreActividades.winGestionarDocumento.panelProductos.add(tabPanel);
    },
    existeActividad: function (idActividad, data) {
        var res = true;
        data.forEach(function (elem, index) {
            if (elem.idComponent == idActividad) {
                res = false;
            }
        });
        return res;
    },
    obtenerElementos: function (arrayData, sm) {
        var _this = this;
        var res = [];
        arrayData.forEach(function (e, i) {
            res.push({
                'idactividadalimento': e.idComponent,
                'denominacion': e.title
            });
        });
        sm.forEach(function (d, p) {
            if (_this.existeActividad(d.get('idactividadalimento'), arrayData)) {
                res.push({
                    'idactividadalimento': d.get('idactividadalimento'),
                    'denominacion': d.get('denominacion')
                });
            }
        });
        return res;
    },
    render: function () {
        var _this = this;
        var p = LOG.inv.alimento.gridActividades.superclass.render.call(this);
        _this.getStorePrincipal().load();
        this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange') {
                if (this.getCount() > 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });
        return p;
    }
});
LOG.inv.alimento.conclusionMedicas = Ext.extend(LOG.util.Window, {
    param: undefined,
    constructor: function (config) {
        config.resizable = false;
        this.usarAplicar = false;
        this.param = new Array();
        config.idioma = LOG.util.UIManager.apply(LOG.inv.alimento.productoAlternativo, LOG.inv.alimento.Idioma);
        this.initComponents(config);
        LOG.inv.alimento.conclusionMedicas.superclass.constructor.call(this, config);
        this.model = new LOG.inv.alimento.Model({
            idioma: config.idioma,
            urlController: '/logistica/inventario/alimento/index.php/menualimento'
        });
        this.setTitle(config.idioma.lbTaConclusMedi);
        this.panelDatos();
        this.width = 300;
        this.height = 300;
    },
    initComponents: function (config) {
        var _this = this;
        this.listaBotones = new LOG.util.List();
        this.listaBotones.add(LOG.util.Prototipos.botonCancelar({
            text: config.idioma.lbBtnCancelar,
            handler: function () {
                _this.close();
            }
        }));
        this.aceptar = LOG.util.Prototipos.botonAceptar({
            text: config.idioma.lbBtnAceptar,
            disabled: true,
            handler: function () {
                _this.param.push({
                    'conclusion': _this.taConclusion.getValue(),
                    'calidad': _this.cbCalidad.getValue(),
                    'idactividad': _this.scope.storePrincipal.data.items[0].data.idactividad
                });
                _this.modeloConMedicas.guardarConclusionMedica(_this.param, function () {
                    _this.scope.getStorePrincipal().reload();
                });
                _this.close();
            },
            controlFn: function (b) {
                _this.taConclusion.on({
                    keyup: function () {
                        if (_this.taConclusion.isValid() && _this.cbCalidad.isValid()) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
                _this.cbCalidad.on({
                    select: function () {
                        if (_this.taConclusion.isValid() && _this.cbCalidad.isValid()) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });

            }
        });
        this.listaBotones.add(this.aceptar);
        config.buttons = this.listaBotones.getArray();
    },
    panelDatos: function () {
        var _this = this;
        this.taConclusion = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbTaConclusiones,
            name: 'observaciones',
            width: '95%',
            height: 150,
            /*allowBlank: false,*/
            minLength: 2,
            maxLength: 255,
            maxLengthText: this.idioma.msgTaTamanoMaximo
        });
        this.cbCalidad = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbCalidad,
            valueField: 'idcalidad',
            displayField: 'aprobadocalidad',
            allowBlank: false,
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: ['idcalidad', 'aprobadocalidad'],
                data: [
                    [1, _this.idioma.lbStBuenaCalidad],
                    [0, _this.idioma.lbStMalaCalidad],
                    [2, _this.idioma.lbStRegularCalidad]
                ]
            })
        });
        this.clsPanel = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.clsPanel.addComponent(this.cbCalidad);
        this.clsPanel.addComponent({});
        this.panel = LOG.util.UIManager.initForm({
            frame: true,
            region: 'center',
            layout: 'form',
            labelAlign: 'top',
            items: [this.clsPanel, this.taConclusion]
        });
        this.add(this.panel);
    },
    onShowHandler: function () {
        var _this = this;
        LOG.util.UIManager.applyKey(this.aceptar, this.panel);
        if (typeof this.aceptar.controlFn == 'function') {
            this.aceptar.controlFn.createDelegate(this, [this.aceptar, this]).call();
        }
    }
});
LOG.inv.alimento.productoAlternativo = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        config.resizable = false;
        this.usarAplicar = false;
        config.idioma = LOG.util.UIManager.apply(LOG.util.Idioma.init(), LOG.inv.alimento.Idioma);

        LOG.inv.alimento.productoAlternativo.superclass.constructor.call(this, config);
        this.setTitle(this.idioma.lbProdalt);
        this.model = new LOG.inv.alimento.Model({
            idioma: config.idioma,
            urlController: '/logistica/inventario/alimento/index.php/menualimento'
        });

        this.width = 445;
        this.height = 130;
    },
    initComponent: function () {
        var _this = this;
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            handler: function () {
                var params = {
                    iddocumento: _this.iddocumento,
                    idproducto: _this.cmbAlternativo.getValue(),
                    idproductomenu: _this.idproductomenu,
                    cantidad: _this.txtCantidad.getValue(),
                    iddeposito: _this.iddeposito
                };
                _this.modeloProductoAlternativo.alternarProductoMenu(params, function (r) {
                    _this.close();
                    _this.padreProductoAlternativo.storePrincipal.reload({
                        params: r
                    });
                });
            }
        });
        _this.modeloProductoAlternativo.addActionButton(this.listaBotones.getItem(2));
        this.cmbAlternativo = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbProdAlter,
            url: 'cargarProductoAlternativo',
            hiddenName: 'idindicador',
            valueField: 'idproducto',
            autoLoad: false,
            displayField: 'denominacion',
            editable: false,
            allowBlank: false,
            emptyText: this.idioma.lbSel
        });
        this.cmbAlternativo.store.on({
            'beforeload': function (st) {
                st.baseParams.idindicador = _this.idindicador;
                st.baseParams.iddeposito = _this.iddeposito;
                st.baseParams.codigoauxiliar = _this.codigoauxiliar;
                st.baseParams.idproducto = _this.idproducto;
            }
        });
        this.cmbAlternativo.store.load();
        this.txtCantidad = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.idioma.lbProp,
            name: 'cantalter',
            allowBlank: false
        });
        LOG.inv.alimento.productoAlternativo.superclass.initComponent.call(this);
        this.clsPanel = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.clsPanel.addComponent(this.cmbAlternativo);
        this.clsPanel.addComponent(this.txtCantidad);
        this.panel = LOG.util.UIManager.initForm({
            frame: true,
            region: 'center',
            layout: 'form',
            labelAlign: 'top',
            items: [this.clsPanel]
        });
        this.modeloProductoAlternativo.bindForm(this.panel);
        this.add(this.panel);

    }
});