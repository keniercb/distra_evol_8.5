Ext.ns('LOG.inv.documentoSalida');
LOG.inv.documentoSalida.View = Ext.extend(LOG.lb.documento.View, {
    name: 'Salida',
    cantSign: 3,
    signDetails: {
        1: 'Entregado',
        2: 'Recibido',
        3: 'Contabilizado',
        4: 'Anotado'
    },
    dirReport: (farmacia !== 1) ? '/logistica/inventario/salida/salida/': '/logistica/inventarioFarmacia/salida/salida/' ,
    /**
     * Panel de los lotes del producto.
     * @type Ext.Panel
     */
    lote: undefined,
    tablaDocOrigen: undefined,
    /**
     * Ventana "Documentos".
     */
    winAddDocumento: undefined,
    /**
     * Tipo de documento.
     */
    tipoDoc: null,
    /**
     * Arreglo de paises.
     */
    paises: null,
    urlReport: window.reportSpace && window.reportSpace != undefined ? window.reportSpace : '/distra',
    /**
     * @param {object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.concepto = config.idioma.ttBtnBuscar;
        this.busquedaBasica = true;
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        config.model = new LOG.inv.documentoSalida.Model({});
        LOG.inv.documentoSalida.View.superclass.constructor.call(this, config);
        this.panelSuperior();
        this.tipoDoc = new Array();
        this.paises = new Array();
        var _this = this;
        this.modelo.cargaInicial({
            url: '/logistica/inventario/salida/salida/index.php/documentosalida/cargarTipoDoc'
        }, function (r) {
            _this.tipoDoc = r[0];
        });
        this.modelo.cargaInicial({
            url: '/logistica/inventario/salida/salida/index.php/documentosalida/cargarPaises'
        }, function (r) {
            _this.paises = r[0];
        });
    },
    /**
     * Inicializa los componentes.
     * @returns {undefined}
     */
    init: function () {
        LOG.inv.documentoSalida.View.superclass.init.call(this);
        var _this = this;
        this.initVentanaNuevDoc();
        this.formularioSur = new LOG.util.UIManager.initPanel({
            title: this.idioma.tlPanelLotes,
            titleCollapse: true,
            animCollapse: false,
            collapsible: true,
            region: 'south',
            layout: 'fit',
            hidden: true,
            height: 250,
            minSize: 250,
            maxSize: 500,
            split: true,
            frame: true,
            listeners: {
                collapse: function (_p) {
                    _p.hide();
                    _this.winGestionarDocumento.doLayout();
                },
                beforeexpand: function (_p) {
                    _p.show();
                    if (_this.lote) {
                        _this.lote.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, _this]).call();
                            }
                        }.createDelegate(this));
                    }
                    _this.winGestionarDocumento.doLayout();
                }
            }
        });
        Ext.apply(this.winGestionarDocumento, {
            salvarHandler: function () {
                //                var _this = this.scope || this;
                _this.modelo.salvar({
                    idestructuracomun: _this.idDeposito
                }, function (r) {
                    if (_this.modelo.listaLotes.count() || _this.modelo.listaProductos.count() || r.reloadGridDetalle == 1) {
                        _this.winGestionarDocumento.cargarProductos();
                    }
                    var elementos = document.getElementsByClassName('nroDoc');
                    for (var i = 0; i < elementos.length; i++) {
                        elementos[i].innerHTML = r.nroDocPadre || '-';
                    }
                    _this.winGestionarDocumento.tipoVentana = 2;
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this);
                });
            },
            beforeEditProducto: function (o) {
                var record = _this.winGestionarDocumento.record;
                if (record && record.data.estado != '1' &&  (o.field != 'elementogasto' && o.field != 'elementogastoalt') /*|| (o.field != 'numerochip' && o.field != 'fecha')*/) {
                    o.cancel = true;
                    return false;
                }

                if (_this.winGestionarDocumento.record.data.estado == "1") {
                    if (o.field == 'cantidad') {
                        if (o.record.json.decimales == "0") {
                            o.grid.getColumnModel().setEditor(o.column, LOG.util.Prototipos.inputEntero({}));
                        } else {
                            o.grid.getColumnModel().setEditor(o.column, LOG.util.Prototipos.inputDecimal({}));
                        }
                        if (_this.winGestionarDocumento.smGridDetalles.getSelected().json.tienelote != 1 && _this.winGestionarDocumento.smGridDetalles.getSelected().json.equipo != 1 && _this.winGestionarDocumento.smGridDetalles.getSelected().json.municion != 1) {
                            o.cancel = false;
                            return true;
                        }
                        if (_this.winGestionarDocumento.smGridDetalles.getSelected().json.municion == 1) {
                            o.cancel = true;
                            return false;
                        }
                    }
                }
                if (record.data.estado == '1' || record.data.estado == '2' || record.data.estado == '4') {
                    if (record.data.idcomprobante == "" && (o.field == 'elementogasto' || o.field == 'elementogastoalt') /*|| (o.field == 'numerochip' || o.field == 'fecha')*/) {
                        o.cancel = false;
                        return true;
                    }
                }
                o.cancel = false;
                return true;
            },
            controlFnGuardar: function (b, nuevo) {
                var comprobante = isNaN(parseInt(_this.winGestionarDocumento.record.data.idcomprobante));
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) && !nuevo/*&& _this.winGestionarDocumento.record.data.idcomprobante=="" && */ /*&& (!_this.winGestionarDocumento.record || _this.winGestionarDocumento.record.data.estado == '1' || (_this.winGestionarDocumento.record.data.tipocliente == '2' && (_this.winGestionarDocumento.record.data.estado == '2' || (_this.winGestionarDocumento.record.data.estado == '4' && comprobante))))*/) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }, this.winGestionarDocumento);
    },
    /**
     * Inicializa los botones de la interfaz.
     * @returns {undefined}
     */
    initDefaultButtons: function () {
        LOG.inv.documentoSalida.View.superclass.initDefaultButtons.call(this);
        var _this = this;
        // Bloque de botones de la interfaz principal.
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function () {
                _this.winAddDocumento.show();
            }
        });
        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(1), 'handler', function () {
            _this.habilitarElementos(_this.getSmPrincipal().getSelected().json.tipocliente != 2);
            _this.cargarDatosEncabezados(_this.getSmPrincipal().getSelected().json);
        }, 'ver');
        LOG.util.UIManager.apply(this.listaBotones.getItem(4), {
            id: 'idSalida'
        });
        this.insertToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
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
                            if (this.getCount() == 1 && _caller.getSmPrincipal().getSelected().data.estado == 1) {
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
            text: this.idioma.lbBtnAnularEstado,
            tooltip: this.idioma.ttBtnAnularEstado,
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
                            if (this.getCount() == 1 && _caller.getSmPrincipal().getSelected().data.estado == 2) {
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
        this.insertToolbarButton(LOG.util.Prototipos.botonContabilizar({
            tooltip: this.idioma.ttBtnContabilizar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.contabilizar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RContabilizar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(
                                (this.getCount() == 1 && this.getSelected().data.estado == 2) && //first
                                ((window.useSign && typeof pki == 'object') ? (_caller.getSmPrincipal().getSelected().get('controlfirma') == 2) : true) //last pki //para controlfirma == 2 limit 3 y 1 limit 2
                            ));
                        }
                    }, 'contabilizar1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 5);
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
                if (/*_caller.grantedAction('CT') ||*/ _caller.grantedAction('RAnular')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && _caller.getSmPrincipal().getSelected().data.estado == 4) {
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
        }), 6);
        this.insertToolbarButton(this.__comprobante.btnGenerar, 7);
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            itemId: 'btnImprimir',
            tooltip: this.idioma.ttBtnImprimir,
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirListado,
                    iconCls: 'icondistra-imprimir',
                    isList: true,
                    name: 'DocumentoSalidaListado',
                    handler: function (btn) {
                        _this.onReport.call(_this, btn);
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    isList: false,
                    name: 'PreDespachoModelo',
                    hidden: true,
                    handler: function (btn) {
                        _this.onReport.call(_this, btn);
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    iconCls: 'icondistra-imprimir',
                    isList: false,
                    name: 'TransferenciaAlmacenesModelo',
                    hidden: true,
                    handler: function (btn) {
                        _this.onReport.call(_this, btn);
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    iconCls: 'icondistra-imprimir',
                    isList: false,
                    name: 'TransferenciaClientesModelo',
                    hidden: true,
                    handler: function (btn) {
                        _this.onReport.call(_this, btn);
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    iconCls: 'icondistra-imprimir',
                    isList: false,
                    name: 'ValeEntregaModelo',
                    hidden: true,
                    handler: function (btn) {
                        _this.onReport.call(_this, btn);
                    }
                })
            ],
            controlFn: function (b, _caller) { //
                if (_this.grantedAction('CT') || _this.grantedAction('RB') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                              
                                b.enable();
                                b.menu.get(1).setVisible(((this.getSelected().data.abreviatura === 'transferenciaLog') && (this.getSelected().data.estado == '1' && this.getSelected().data.tipocliente == '1')) ? true : false);
                                b.menu.get(2).setVisible(((this.getSelected().data.abreviatura === 'transferenciaLog') && (this.getSelected().data.tipocliente == '3')) ? true : false);
                                b.menu.get(3).setVisible(((this.getSelected().data.abreviatura === 'transferenciaLog') && (this.getSelected().data.estado != '1') && (this.getSelected().data.tipocliente == '1')) ? true : false);
                                b.menu.get(4).setVisible((this.getSelected().data.abreviatura === 'valeLog') ? true : false);
                            } else {
                                b.disable();
                            }
                        }
                    }, 'imprimir');
                    LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'load') {
                            b.setVisible(this.getCount() > 0);
                        }
                    }, 'imprimir');
                } else {
                    b.setVisible(false);
                }
            }
        }));
        // Fin del bloque.
        // Bloque de botones del panel superior de la ventana adicionar.
        this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonImprimir({
            itemId: 'btnImprimir',
            tooltip: this.idioma.ttBtnImprimir,
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirListado,
                    iconCls: 'icondistra-imprimir',
                    isList: true,
                    hidden: true,
                    name: 'DocumentoSalidaListado',
                    handler: function (btn) {
                        _this.onReport.call(_this, btn);
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    isList: false,
                    name: 'PreDespachoModelo',
                    hidden: true,
                    handler: function (btn) {
                        _this.onReport.call(_this, btn);
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    iconCls: 'icondistra-imprimir',
                    isList: false,
                    name: 'TransferenciaAlmacenesModelo',
                    hidden: true,
                    handler: function (btn) {
                        _this.onReport.call(_this, btn);
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    iconCls: 'icondistra-imprimir',
                    isList: false,
                    name: 'TransferenciaClientesModelo',
                    hidden: true,
                    handler: function (btn) {
                        _this.onReport.call(_this, btn);
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    iconCls: 'icondistra-imprimir',
                    isList: false,
                    name: 'ValeEntregaModelo',
                    hidden: true,
                    handler: function (btn) {
                        _this.onReport.call(_this, btn);
                    }
                })
            ],
            controlFn: function (b, _caller) { //
                 if (_this.grantedAction('CT') || _this.grantedAction('RB') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);                    
                    b.enable(); 
					b.menu.get(1).setVisible(((_this.winGestionarDocumento.record.data.abreviatura === 'transferenciaLog') && (_this.winGestionarDocumento.record.data.estado == '1' && _this.winGestionarDocumento.record.data.tipocliente == '1')) ? true : false);                    
                    b.menu.get(2).setVisible(((_this.winGestionarDocumento.record.data.abreviatura === 'transferenciaLog') && (_this.winGestionarDocumento.record.data.tipocliente == '3')) ? true : false);
                   b.menu.get(3).setVisible(((_this.winGestionarDocumento.record.data.abreviatura === 'transferenciaLog') && (_this.winGestionarDocumento.record.data.estado != '1') && (_this.winGestionarDocumento.record.data.tipocliente == '1')) ? true : false);
                    b.menu.get(4).setVisible((_this.winGestionarDocumento.record.data.abreviatura === 'valeLog') ? true : false);
                } else {
                    b.setVisible(false);
                }
            }
        }));
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: this.idioma.ttBtnEliminar,
            handler: function () {
                _this.modelo.eliminar({}, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
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
                    _this.winGestionarDocumento.record.data.estado = '2';
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos(_this.modelo.tipocliente != 2);
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
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
                    _this.winGestionarDocumento.record.data.estado = '1';
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos(_this.modelo.tipocliente != 2);
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado')) {
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
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(3), LOG.util.Prototipos.botonContabilizar({
            tooltip: this.idioma.ttBtnContabilizar,
            isContextual: true,
            handler: function () {
                _this.modelo.contabilizar({
                    iddocumento: _this.winGestionarDocumento.record.data.iddocumento
                }, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    _this.winGestionarDocumento.record.data.estado = '4';
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RContabilizar')) {
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
        }));
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), LOG.util.UIManager.createBtn({
            iconCls: 'anulardocumento',
            text: this.idioma.lbBtnAnularDocumento,
            tooltip: this.idioma.ttBtnAnularDocumento,
            isContextual: true,
            key: null,
            handler: function () {
                _this.modelo.anular({
                    iddocumento: _this.winGestionarDocumento.record.data.iddocumento
                }, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    _this.winGestionarDocumento.record.data.estado = '6';
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                });
            },
            controlFn: function (b, _caller) {
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
        }));
        // Fin del bloque.
        // Bloque de botones del panel de productos.
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesProductos.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarProd,
            disabled: true,
            handler: _this.handlerEliminarMov,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
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
        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'lote',
            text: _this.idioma.lbBtnLote,
            tooltip: _this.idioma.ttBtnLote,
            disabled: true,
            handler: function () {
                _this.formularioSur.show();
                _this.formularioSur.expand();
                _this.winGestionarDocumento.doLayout();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().json.tienelote == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'lotesProd');
                } else {
                    b.setVisible(false);
                }
            }
        }), 0);
        this.winGestionarDocumento.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'numeroserie',
            text: _this.idioma.lbBtnNoSerie,
            tooltip: _this.idioma.ttBtnNoSerie,
            disabled: true,
            handler: function () {
                LOG.lb.numeroserie.Loader.init(function () {
                    this.winSerie = new LOG.lb.numeroserie.Salida({
                        producto: _this.winGestionarDocumento.smGridDetalles.getSelected().data,
                        documento: _this.winGestionarDocumento.record.data,
                        idestructura: _this.idDeposito,
                        afecta: (_this.winGestionarDocumento.record.data.origen != 1),
                        confubicacion: confubicacion,
                        fecha: fecha,
                        salida: _this.getNombreDoc(_this.winGestionarDocumento.record.data.iddoc),
                        cerrarFn: function (r) {
                            _this.winGestionarDocumento.stGridDetalles.reload();
                            var elementos = document.getElementsByClassName('nroDoc');
                            for (var i = 0; i < elementos.length; i++) {
                                elementos[i].innerHTML = r.nrodoc || elementos[i].innerHTML;
                            }
                        }
                    });
                    this.winSerie.init();
                    this.winSerie.view();
                });
            },
            controlFn: function (b, _caller) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) && _this.winGestionarDocumento.record.data.origen != 3) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().json.equipo == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'numeroSerie');
                } else {
                    b.setVisible(false);
                }
            }
        }));
        if (cmpArmamento == true) {
            this.winGestionarDocumento.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
                iconCls: 'partida',
                text: this.idioma.lbBtnMuniciones,
                tooltip: this.idioma.ttBtnMuniciones,
                disabled: true,
                handler: function () {
                    var municiones = new LOG.inv.municiones.View({
                        idestructura: _this.idDeposito,
                        producto: _this.winGestionarDocumento.smGridDetalles.getSelected().data,
                        documento: _this.winGestionarDocumento.record.data,
                        salida: true,
                        afecta: (_this.winGestionarDocumento.record.data.origen != 1),
                        confubicacion: confubicacion,
                        fecha: fecha,
                        baseParams: {
                            salida: true
                        },
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
                    if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) && _this.winGestionarDocumento.record.data.origen != 3) {
                        b.setVisible(true);
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && this.getSelected().json.municion == 1) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'municion');
                    } else {
                        b.setVisible(false);
                    }
                }
            }));
        }
        this.winGestionarDocumento.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'ajustar',
            text: this.idioma.lbBtnProcesar,
            tooltip: this.idioma.ttBtnProcesar,
            disabled: true,
            hidden: true,
            handler: function () {
                LOG.inv.ubicacion.Loader.init(function () {
                    this.winUbicaciones = new LOG.lb.ubicacion.proceso({
                        cantidadAlternativa: true,
                        idioma: _this.idioma,
                        record: _this.winGestionarDocumento.smGridDetalles.getSelected().json,
                        desubicar: true
                    });
                    this.winUbicaciones.init();
                    this.winUbicaciones.view();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && _this.winGestionarDocumento.record.data.estado == '1' && this.getSelected().json.tienelote == 0 && this.getSelected().json.equipo == 0 && this.getSelected().json.municion == 0 && !this.getSelected().json.ubicacionunica /*&& ((this.getSelected().data.existencia) - (this.getSelected().data.cantidad) != 0)*/) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'ajustar');
                } else {
                    b.hide();
                }
            }
        }));
    },
    /**
     * Inicializa las columnas del grid.
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        LOG.inv.documentoSalida.View.superclass.initDefaultColumns.call(this);
        var _this = this;
        // Bloque de columnas del grid principal.
        LOG.util.UIManager.apply(this.listaColumnas.getBy('dataIndex', 'aprobadopor'), {
            header: _this.idioma.gcContabilizadoPor
        });
        this.insertGridColumn({
            header: this.idioma.gcTipoDocumento,
            width: 150,
            dataIndex: 'iddoc',
            renderer: function (_value) {
                return _this.getNombreDoc(_value);
            },
            default: true
        }, 1);
        this.insertGridColumn({
            header: this.idioma.gcEntregarA,
            autoExpand: true,
            dataIndex: 'cliente',
            default: true
        }, 3);
        this.insertGridColumn({
            header: this.idioma.gcTipoDocOrigen,
            dataIndex: 'iddocPadre',
            width: 150,
            default: true,
            renderer: function (_value) {
                return _this.getNombreDoc(_value);
            }
        }, 6);
        this.insertGridColumn({
            header: this.idioma.gcDocOrigen,
            dataIndex: 'nroDocPadre',
            width: 100,
            align: 'right',
            default: true
        }, 7);
        this.insertGridColumn({
            header: this.idioma.gcImporte + ' ' + window.codContable,
            dataIndex: 'importecontable',
            width: 100,
            align: 'right',
            default: true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        }, 9);
        if (monedaalternativa) {
            this.insertGridColumn({
                header: this.idioma.gcImporte + ' ' + window.codAlternativa,
                dataIndex: 'importealternativo',
                width: 100,
                align: 'right',
                default: true,
                renderer: function (v) {
                    return Ext.util.Format.number(v, '0,000.00');
                }
            }, 10);
        }
        this.insertGridColumn({
            // header: 'Nro. Comprobante',
            dataIndex: 'nrocomprobante',
            // width: 100,
            // align: 'right',
            default: true
        }, 11);
        this.addGridColumn({
            dataIndex: 'observacion'
        });
        this.addGridColumn({
            dataIndex: 'idoperacion'
        });
        this.addGridColumn({
            dataIndex: 'idoperaciont'
        });
        this.addGridColumn({
            dataIndex: 'numeroreft'
        });
        this.addGridColumn({
            dataIndex: 'iduebdestino'
        });
        this.addGridColumn({
            dataIndex: 'origen'
        });
        this.addGridColumn({
            dataIndex: 'iddestino'
        });
        this.addGridColumn({
            dataIndex: 'cicliente'
        });
        this.addGridColumn({
            dataIndex: 'nombrecliente'
        });
        this.addGridColumn({
            dataIndex: 'idcliente'
        });
        this.addGridColumn({
            dataIndex: 'tipocliente'
        });
        this.addGridColumn({
            dataIndex: 'cargocliente'
        });
        this.addGridColumn({
            dataIndex: 'ciconductor'
        });
        this.addGridColumn({
            dataIndex: 'nombreconductor'
        });
        this.addGridColumn({
            dataIndex: 'matricula'
        });
        this.addGridColumn({
            dataIndex: 'cartaporte'
        });
        this.addGridColumn({
            dataIndex: 'idorganizacion'
        });
        this.addGridColumn({
            dataIndex: 'iddocPadre'
        });
        this.addGridColumn({
            dataIndex: 'idpadre'
        });
        this.addGridColumn({
            dataIndex: 'controlfirma'
        });
        this.addGridColumn({
            dataIndex: 'idnodo'
        });
        this.addGridColumn({
            dataIndex: 'iddoc'
        });
        this.addGridColumn({
            dataIndex: 'abreviatura'
        });
        this.addGridColumn({
            dataIndex: 'idcuenta'
        });
        this.addGridColumn({
            dataIndex: 'idcuentaalternativa'
        });
        this.addGridColumn({
            dataIndex: 'idcomprobante'
        });
        this.addGridColumn({
            dataIndex: 'denominacion'
        });
        // Fin del bloque.
        // Bloque de columnas del grid de productos.
        this.addGridColumnProductos({
            dataIndex: 'signo'
        });
        this.addGridColumnProductos({
            dataIndex: 'resto'
        });
        this.addGridColumn({
            dataIndex: 'numerochip'
        });
        this.addGridColumn({
            dataIndex: 'fecha'
        });
        /*this.insertGridColumnProductos({
         header: this.idioma.gcCodigoProveedor,
         width: 100,
         dataIndex: 'codigoproveedor',
         default: true
         }, 1);*/
        this.insertGridColumnProductos({
            header: 'Desubicar',
            width: 80,
            align: 'center',
            dataIndex: 'ubicacionunica',
            editor: null,
            renderer: function(v, m, rd) {
                if (!rd.json.ubicacionunica)
                    m.css = 'icondistra-aceptar verde';
                else
                    m.css = 'icondistra-aceptar rojo';
            }
        }, 0);
        var pos = this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'cantidad', 'header');
        this.insertGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.gcOrdenado,
            width: 80,
            align: 'right',
            dataIndex: 'ordenado',
            editor: null,
            renderer: function (_v, _mD, _r) {
                if (!_r.data.ordenado) {
                    _r.data.ordenado = _r.data.cantidad;
                }
                return _r.data.ordenado;
            }
        }), pos);

        if (typeof tarjetacombustible !== 'undefined' && tarjetacombustible == true) {
            this.insertGridColumnProductos(LOG.util.Prototipos.inputTexto({
                header: this.idioma.gcNumeroChip,
                width: 120,
                align: 'right',
                dataIndex: 'numerochip',
                regex: LOG.util.Regex.cadena,
                maxLength: 20,
                editor: LOG.util.Prototipos.inputTexto({}),
                renderer: function (_v, _mD, _r) {
                    _r.data.numerochip = _v || '';
                    return _r.data.numerochip;
                }
            }), pos + 2);

            this.fecha = new Ext.form.DateField({
                fieldLabel: this.idioma.gcFecha,
                name: 'fecha',
                format: 'd/m/Y',
                maxValue: Date.parseDate(fecha, 'd/m/Y')
            });

            this.insertGridColumnProductos({
                header: this.idioma.gcFecha,
                width: 100,
                align: 'right',
                dataIndex: 'fecha',
                editor: _this.fecha
            }, pos + 3);
        }

        this.cbElementoMN, this.cbElementoMLC;
        this.addGridColumnProductos({
            header: this.idioma.gcElementoGasto + (alternativa ? ' ' + nombrecontable : ''),
            encabezado: this.idioma.gcElementoGasto,
            gasto: true,
            width: 125,
            dataIndex: 'elementogasto',
             editor: this.cbElementoMN = new LOG.util.ComboBox({
             hiddenName: 'idelementogasto',
             valueField: 'idelementoobjeto',
             displayField: 'descripcion',
             url: 'devolverElementos',
             mode: 'remote',
             resizable: true
             }),
             /*renderer: function(_v) {
             var record = this.editor.getStore().getById(_v);
             return record ? record.data.descripcionelementoobjeto : '-';
             },*/
            default: true
        });
        this.addGridColumnProductos({
            dataIndex: 'existenciamovimiento'
        });
        this.cbElementoMN.getStore().on({
         beforeload: function() {
         this.baseParams.idcentro = this.initBaseParams.idcentro = _this.cbCuenta.getStore().baseParams.idcentrocosto;
         //this.baseParams.idcuenta = this.initBaseParams.idcuenta = _this.cbCuenta.getValue()
         }
         });
        if (alternativa) {
            LOG.util.UIManager.apply(_this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'preciocontable'), {
                header: this.idioma.cgPrecio + ' ' + nombrecontable
            });
            LOG.util.UIManager.apply(_this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'importe'), {
                header: this.idioma.cgImporte + ' ' + nombrecontable,
                width: 90
            });
            pos = this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'importe', 'header');
            this.insertGridColumnProductos(LOG.util.Prototipos.columnaPrecio({
                header: this.idioma.cgPrecio + ' ' + nombrealternativa,
                width: 100,
                align: 'right',
                dataIndex: 'precioalternativo',
                default: true
            }), pos + 1);
            this.insertGridColumnProductos(LOG.util.Prototipos.columnaImporte({
                header: this.idioma.cgImporte + ' ' + nombrealternativa,
                width: 100,
                align: 'right',
                dataIndex: 'importealternativo',
                default: true
            }), pos + 2);
            this.insertGridColumnProductos(LOG.util.Prototipos.columnaPrecio({
                header: this.idioma.cgPrecio + ' ' + 'USD',
                width: 100,
                align: 'right',
                dataIndex: 'precioconvertible',
                default: true
            }), pos + 3);

            this.insertGridColumnProductos(LOG.util.Prototipos.columnaImporte({
                header: this.idioma.cgImporte + ' ' + 'USD',
                width: 100,
                align: 'right',
                dataIndex: 'importeconvertible',
                default: true
            }), pos + 4);
            this.addGridColumnProductos({
                header: this.idioma.gcElementoGasto + ' ' + nombrealternativa,
                encabezado: this.idioma.gcElementoGasto,
                gasto: true,
                width: 125,
                dataIndex: 'elementogastoalt',
                 editor: this.cbElementoMLC = new LOG.util.ComboBox({
                 hiddenName: 'idelementogasto',
                 valueField: 'idelementoobjeto',
                 displayField: 'descripcion',
                 url: 'devolverElementos',
                 mode: 'remote',
                 resizable: true
                 }),
                 /*renderer: function(_v) {
                 var record = this.editor.getStore().getById(_v);
                 return record ? record.data.descripcionelementoobjeto : '-';
                 },*/
                default: true
            });
            this.cbElementoMLC.getStore().on({
             beforeload: function() {
             this.baseParams.idcentro = this.initBaseParams.idcentro = _this.cbCuentaAlt.getStore().baseParams.idcentrocosto;
             //this.baseParams.idcuenta = this.initBaseParams.idcuenta = _this.cbCuentaAlt.getValue()
             }
             });
            this.addGridColumnProductos({
                dataIndex: 'idelementogasto',
                default: true
            });
            this.addGridColumnProductos({
                dataIndex: 'idelementogastoalt',
                default: true
            });
        }
    },
    /**
     * Inicializa la ventana de adicionar documentos.
     * @param {Object} d
     * @param {Integer} t
     * @returns {undefined}
     */
    initVentanaGestion: function (d, t) {
        var _this = this;
        this.formularioSur.hide();
        LOG.inv.documentoSalida.View.superclass.initVentanaGestion.call(this, d, t);
        if (d.data.tipocliente == 2) {
            this.winGestionarDocumento.ocultarColumna('idelementogasto', false);
            this.winGestionarDocumento.ocultarColumna('idelementogastoalt', false);
            this.cbCuenta.getStore().on({
                beforeload: function () {
                    this.baseParams.idcentrocosto = d.data.idcliente;
                    this.baseParams.idmoneda = idmoneda;
                },
                load: function () {
                    _this.cbCuenta.setValue(_this.cbCuenta.getValue());
                }
            });
            if (this.cbCuenta.getValue()) {
                this.cbElementoMN.getStore().load();
            }
            this.cbCuenta.getStore().load();
            if (alternativa) {
                this.cbCuentaAlt.getStore().on({
                    beforeload: function () {
                        this.baseParams.idcentrocosto = d.data.idcliente;
                        this.baseParams.idmoneda = idmonedaalt;
                    },
                    load: function () {
                        _this.cbCuentaAlt.setValue(_this.cbCuentaAlt.getValue());
                    }
                });
                if (this.cbCuentaAlt.getValue()) {
                    this.cbElementoMLC.getStore().load();
                }
                this.cbCuentaAlt.getStore().load();
            }
        } else {
            this.winGestionarDocumento.ocultarColumna('idelementogasto');
            this.winGestionarDocumento.ocultarColumna('idelementogastoalt');
        }
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.gridDetalles, 'fireEvent', function (e, o) {
            if (e == 'afteredit') {
                /*if (o.field == 'cantidad' && parseFloat(o.value) > parseFloat(o.record.data.ordenado) - parseFloat(o.record.json.resto)) {
                 o.record.data.cantidad = parseFloat(o.record.data.ordenado) - parseFloat(o.record.json.resto);
                 mostrarMensaje(3, _this.idioma.msgErrorCantEntregar);
                 }*/
                if (o.field == 'elementogasto') {
                    o.record.data.idelementogasto = o.value;
                    o.record.data.elementogasto = _this.cbElementoMN.getRawValue();
                }
                if (o.field == 'elementogastoalt') {
                    o.record.data.idelementogastoalt = o.value;
                    o.record.data.elementogastoalt = _this.cbElementoMLC.getRawValue();
                }
                if (o.field == 'numerochip') {
                    o.record.data.numerochip = o.value;
                }
                if (o.field == 'fecha') {
                    o.record.data.fecha = o.value;
                }
                o.grid.view.refresh();
                _this.winGestionarDocumento.editarProducto(o);
            }
        }, 'editar');
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.smGridDetalles, 'fireEvent', function (e) {
            if (e == 'selectionchange') {
                if (this.getCount() == 1 && this.getSelected().json.tienelote == 1) {
                    _this.initPanelLote();
                }
                _this.formularioSur.collapse();
                _this.formularioSur.hide();
                _this.winGestionarDocumento.doLayout();
            }
        }, 'editarLote');
    },
    /**
     *
     * @returns {undefined}
     */
    panelSuperior: function () {
        var _this = this;


        var docprimario = new LOG.util.Prototipos.inputEntero({
            fieldLabel: "Doc. Primario",
            name: 'numeroreft',
            editable: true,
            allowBlank: true,
            width: '50%',
            maxLength: 10,
            campo: true,
            estado: true,
            padre: true
        });

        var Operacion = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbOperacion,
            hiddenName: 'idoperaciont',
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            url: '/logistica/inventario/salida/salida/index.php/documentosalida/cargarOperaciones?alias=transferenciaLog',
            mode: 'remote',
            //resizable: true,
            tab: true,
            estado: true,
            allowBlank: false
        });

        var observaciones = new Ext.form.TextArea({
            fieldLabel: _this.idioma.lbTaObservaciones,
            name: 'observaciones',
            tab: true,
            estado: true,
            anchor: '100%',
            height: '35px',
            minLength: 2,
            maxLength: 255,
            enableKeyEvents: true,
            setValue: function (v) {
                var me = this;
                this.value = v;
                if (this.rendered) {
                    this.el.dom.value = (Ext.isEmpty(v) ? '' : v);
                    this.validate();
                    me.fireEvent('cambio', v);
                }
                return this;
            },
            listeners: {
                cambio: function (_nv) {
                    _this.obs.setValue(_nv);
                    _this.modelo.observacion = _nv;
                }
            }
        });

        var clsformPanelGeneral = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        clsformPanelGeneral.addComponent(docprimario);
        clsformPanelGeneral.addComponent(Operacion);
        clsformPanelGeneral.addComponent(observaciones);

        this.clsTransportador = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });

        this.clsTransportador.addComponent(LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfCI,
            name: 'ciconductor',
            tab: true,
            estado: true,
            allowBlank: true,
            maxLength: 11,
            regex: LOG.util.Regex.carnet,
            regexText: _this.idioma.msgNfCarnet
        }));
        this.clsTransportador.addComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfNombre,
            name: 'nombreconductor',
            tab: true,
            estado: true,
            regex: LOG.util.Regex.nombre,
            regexText: _this.idioma.msgNombreIncorrecto,
            allowBlank: true,
            maxLength: 100
        }));
        this.clsTransportador.addComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfChapa,
            name: 'matricula',
            tab: true,
            estado: true,
            allowBlank: true,
            regex: LOG.util.Regex.matricula,
            regexText: _this.idioma.lbChapaIcorrecta,
            emptyText: _this.idioma.lbChapaVacia
        }));
        this.clsTransportador.addComponent(new LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfCartaPorte,
            name: 'cartaporte',
            tab: true,
            estado: true
        }));
        this.clsTransportador.addComponent(new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCbTransportador,
            tab: true,
            estado: true,
            hiddenName: 'idorganizacion',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
            mode: 'remote',
            pageSize: 10,
            allowBlank: true,
            resizable: true
        }));
        this.clsComprador = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        this.clsComprador.addComponent(LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbNfCI,
            name: 'cicliente',
            tab: true,
            estado: true,
            maxLength: 11,
            regex: LOG.util.Regex.carnet,
            maxLengthText: _this.idioma.msgNfCarnet
        }));
        this.clsComprador.addComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfNombre,
            name: 'nombrecliente',
            tab: true,
            estado: true,
            regex: LOG.util.Regex.nombre,
            regexText: _this.idioma.msgNombreIncorrecto,
            maxLength: 100
        }));
        this.clsComprador.addComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfCargo,
            name: 'cargocliente',
            tab: true,
            estado: true,
            regex: LOG.util.Regex.cadena,
            maxLength: 255
        }));
        /*    clsformPanelGeneral.addComponent(LOG.util.ComboBox({
                fieldLabel: this.idioma.lbCbOperacion,
                hiddenName: 'idoperaciont',
                valueField: 'idnomoperaciones',
                displayField: 'denominacion',
                url: '/logistica/inventario/salida/salida/index.php/documentosalida/cargarOperaciones?alias=transferenciaLog',
                mode: 'remote',
                //resizable: true,
                tab: true,
                estado: true,
                allowBlank: false
            }));*/
        this.cbCentroTransf = new LOG.util.ComboBox({
            fieldLabel: 'Centro de costo',
            name: 'idcentrocostotransf',
            url: 'cargarComboCentroCosto',
            valueField: 'idcentrogrupo',
            displayField: 'descripcioncentrogrupo',
            width: 50,
            tab: true,
            estado: false,
            allowBlank: true
        });
        this.tab = new Ext.TabPanel({
            border: false,
            activeTab: 0,
            frame: true,
            hidden: true,
            listeners: {
                tabchange: function () {
                    _this.winGestionarDocumento.doLayout();
                }
            },
            items: [{
                title: _this.idioma.lbTpDatosGenerales,
                items: [
                    LOG.util.UIManager.initPanel({
                        layout: 'form',
                        labelAlign: 'top',
                        frame: true,
                        items: [
                            {
                                autoHeight: true,
                                html: '<table width="100%">' + '<tr style="font-weight: bold; font-size: smaller;">' + '   <td width="20%">' + _this.idioma.lbTipoDocumento + '</td>' + '   <td width="20%">' + _this.idioma.lbNroDocumento + '</td>' + '   <td width="20%">' + _this.idioma.lbFechaCreacion + '</td>' + '   <td width="20%">' + _this.idioma.lbEntregarA + '</td>' + '</tr>' + '<tr>' + '   <td class="tipoDoc"></td>' + '   <td class="nroDoc"></td>' + '   <td class="fecha"></td>' + '   <td class="entrega"></td>' + '</tr>' + '</table><p>&nbsp;</p>',
                            }, {
                                layout: 'form',
                                labelAlign: 'top',
                                items: [clsformPanelGeneral]

                            }]
                    })]
            }, {
                title: _this.idioma.lbTpDatosTranportador,
                items: [
                    LOG.util.UIManager.initPanel({
                        layout: 'form',
                        labelAlign: 'top',
                        frame: true,
                        items: [this.clsTransportador]
                    })
                ]
            }, {
                title: _this.idioma.lbTpDatosConductor,
                items: [
                    LOG.util.UIManager.initPanel({
                        layout: 'form',
                        labelAlign: 'top',
                        frame: true,
                        items: [this.clsComprador]
                    })
                ]
            }]
        });
        this.clsVale = LOG.util.UIManager.initColumnForm({
            columnas: alternativa ? 3 : 2
        });

        this.cbOperacion = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbOperacion,
            hiddenName: 'idoperacion',
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            url: '/logistica/inventario/salida/salida/index.php/documentosalida/cargarOperaciones',
            mode: 'remote',
            resizable: true,
            allowBlank: false
        });
        this.cbCuenta = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbCuenta + (alternativa ? ' ' + codContable : ''),
            hiddenName: 'idcuenta',
            valueField: 'idcuenta',
            displayField: 'descripcioncta',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarCuentasCentroCosto',
            mode: 'remote',
            autoLoad: false,
            resizable: true,
            estado: true,
            listeners: {
                select: function () {
                    var _self = this;
                    if (alternativa) {
                        if (this.getValue() == _this.cbCuentaAlt.getValue()) {
                            this.reset();
                            mostrarMensaje(3, _this.idioma.msgErrorMismaCuenta);
                        }
//                        _this.cbElementoMN.getStore().on({
//                            beforeload: function() {
//                                this.baseParams.idcentro = this.initBaseParams.idcentro = _self.getStore().baseParams.idcentrocosto;
//                                this.baseParams.idcuenta = this.initBaseParams.idcuenta = _self.getValue()
//                            }
//                        });
                        //_this.cbElementoMN.getStore().load();
                    }
                }
            }
        });

        this.cbUEB = new LOG.util.ComboBox({
            fieldLabel: 'UEB Destino',
            hiddenName: 'iduebdestino',
            valueField: 'idestructura',
            displayField: 'denominacion',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarEntidadesGrupo',
            mode: 'remote',
            autoLoad: false,
            resizable: true,
            estado: true,
        });
        this.clsVale.addComponent(this.cbOperacion);
        /*this.clsVale.addComponent(this.cbCuenta);*/
        if (alternativa) {
            this.cbCuentaAlt = new LOG.util.ComboBox({
                fieldLabel: this.idioma.lbCbCuenta + ' ' + codAlternativa,
                hiddenName: 'idcuentaalternativa',
                valueField: 'idcuenta',
                displayField: 'descripcioncta',
                url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarCuentasCentroCosto',
                mode: 'remote',
                autoLoad: false,
                resizable: true,
                estado: true,
                listeners: {
                    select: function () {
                        var _self = this;
                        if (this.getValue() == _this.cbCuenta.getValue()) {
                            this.reset();
                            mostrarMensaje(3, _this.idioma.msgErrorMismaCuenta);
                        }
//                        _this.cbElementoMLC.getStore().on({
//                            beforeload: function() {
//                                this.baseParams.idcentro = this.initBaseParams.idcentro = _self.getStore().baseParams.idcentrocosto;
//                                this.baseParams.idcuenta = this.initBaseParams.idcuenta = _self.getValue()
//                            }
//                        });
                        //_this.cbElementoMLC.getStore().load();
                    }
                }
            });
            /*this.clsVale.addComponent(this.cbCuentaAlt);*/
        }

        this.clsVale.addComponent(this.cbUEB);
        this.clsVale.addComponent(new LOG.util.Prototipos.inputEntero({
            fieldLabel: "Doc. Primario",
            name: 'numeroref',
            editable: true,
            estado: true,
            allowBlank: true,
            maxLength: 10,
            campo: true,
            padre: true
        }));
        this.fsDatosDocOrigen = new Ext.form.FieldSet({
            title: this.idioma.tlFsDatosDocOrigen,
            items: [{
                html: '<table width="100%">' + '<tr style="font-weight: bold;">' + '   <td width="25%">' + _this.idioma.lbTipoDocumento + '</td>' + '   <td width="25%">' + _this.idioma.lbNroDocumento + '</td>' + '   <td width="25%">' + _this.idioma.lbFechaCreacion + '</td>' + '   <td width="25%">' + _this.idioma.lbEntregarA + '</td>' + '</tr>' + '<tr>' + '   <td class="tipoDoc"></td>' + '   <td class="nroDoc"></td>' + '   <td class="fecha"></td>' + '   <td class="entrega"></td>' + '</tr>' + '</table>'
            }]
        });
        this.obs = new Ext.form.TextArea({
            fieldLabel: _this.idioma.lbTaObservaciones,
            name: 'observacion',
            estado: true,
            anchor: '100%',
            height: '35px',
            minLength: 2,
            maxLength: 255,
            listeners: {
                keyup: function () {
                    _this.modelo.observaciones = this.getValue();
                }
            }
        });
        this.fsCentroCosto = new Ext.form.FieldSet({
            border: false,
            items: [
                this.tab,
                //                {html: '<p>&nbsp;</p>'},
                this.clsVale,
                this.obs
            ]
        });
        this.formularioGeneral = LOG.util.UIManager.initPanel({
            layout: 'form',
            labelAlign: 'top',
            items: [this.fsDatosDocOrigen, this.fsCentroCosto]
        });
    },
    /**
     * Inicilaiza y muestra una ventana para generar los nuevos documentos.
     * @returns {undefined}
     */
    initVentanaNuevDoc: function () {
        var _this = this;
        if (!this.win) {
            this.win = new LOG.util.UITabTemplate({
                idioma: this.idioma
            });
            this.win.addTabToTemplete(new LOG.inv.documentoSalida.GridDocumentos({
                idioma: this.idioma,
                title: this.idioma.tlTpOrdenDespacho,
                btns: true,
                idComponent: 0,
                name: 'DistribucionModelo',
                dirReport: _this.urlReport + '/logistica/distribucion/distribucion/',
                concepto: this.idioma.ttBtnBuscarDespacho
            }));
            if (entrega) {
                this.win.addTabToTemplete(new LOG.inv.documentoSalida.GridDocumentos({
                    idioma: this.idioma,
                    title: this.idioma.tlTpSolicitudEntrega,
                    btns: true,
                    idComponent: 1,
                    name: 'SolicitudEntregaModelo',
                    dirReport: _this.urlReport + '/logistica/inventario/salida/entrega/',
                    concepto: this.idioma.ttBtnBuscarSolEntrega
                }));
            }
            if (menu) {
                this.win.addTabToTemplete(new LOG.inv.documentoSalida.GridDocumentos({
                    idioma: this.idioma,
                    title: this.idioma.tlTpMenu,
                    idComponent: 2,
                    name: 'MenuModelo',
                    dirReport: _this.urlReport + '/logistica/inventario/alimento/',
                    concepto: this.idioma.ttBtnBuscarMenu
                }));
            }
            if (ordentrabajo) {
                this.win.addTabToTemplete(new LOG.inv.documentoSalida.GridDocumentos({
                    idioma: this.idioma,
                    title: this.idioma.tlTpOrdeTrabajo,
                    idComponent: 3,
                    name: 'OrdenDeTrabajoModelo',
                    dirReport: _this.urlReport + '/logistica/talleres/ordentrabajo/',
                    concepto: this.idioma.ttBtnBuscarOrdTrab
                }));
            }
            if (produccion) {
                this.win.addTabToTemplete(new LOG.inv.documentoSalida.GridDocumentos({
                    idioma: this.idioma,
                    title: 'Orden de producción',
                    idComponent: 4,
                    name: 'OrdenDeProduccionModelo',
                    dirController: '/logistica/produccion/produccion/index.php/ordenproduccion',
                    urlBusquedaGridPrincipal: 'cargarDocumentos',
                    btns: false,
                    baseParams: {
                        estado: 3,
                        iddeposito: _this.idDeposito
                    },
                    dirReport: _this.urlReport + '/logistica/produccion/ordenproduccion/',
                    concepto: 'Orden de producción'
                }));
            }
            this.win.init();
            this.winAddDocumento = this.win.view({
                title: this.idioma.tlAdicionar,
                width: 700,
                height: 400,
                usarAplicar: false
            });
            LOG.util.UIManager.apply(this.winAddDocumento.listaBotones.getItem(2), {
                disabled: true
            });
            LOG.util.UIManager.encadenaFn(this.win, 'fireEvent', function (e) {
                if (e == 'tabchange') {
                    _this.winAddDocumento.listaBotones.getItem(2).disable();
                    var idComponent = this.getActiveTemplate().idComponent;
                    var index = this.getSelectedTabIndex();
                    if (/*(idComponent == 3 && this.listaPlantillas.getItem(index).getStorePrincipal().getModifiedRecords().length > 0) || */(/*idComponent != 3 && */this.listaPlantillas.getItem(index).getSmPrincipal().hasSelection() > 0)) {
                        _this.winAddDocumento.listaBotones.getItem(2).enable();
                    }
                }
            }, 'cambiarTab');
            this.win.listaPlantillas.each(function (_p, _index) {
                LOG.util.UIManager.encadenaFn(_p.getSmPrincipal(), 'fireEvent', function (e) {
                    if (/*_p.idComponent != 3 && */_this.win.getSelectedTabIndex() == _index && e == 'selectionchange') {
                        if (this.getCount() > 0) {
                            _this.winAddDocumento.listaBotones.getItem(2).enable();
                        } else {
                            _this.winAddDocumento.listaBotones.getItem(2).disable();
                        }
                    }
                }, 'selectionarDoc');
            });
            if (ordentrabajo) {
                LOG.util.UIManager.encadenaFn(this.win.getTemplateByIndex(this.win.listaPlantillas.count() - 1).getGridPrincipal(), 'fireEvent', function (e) {
                    if (e == 'afteredit') {
                        _this.winAddDocumento.listaBotones.getItem(2).enable();
                    }
                }, 'generar');
            }
            this.win.listaPlantillas.each(function (_p) {
                LOG.util.UIManager.encadenaFn(_p.getStorePrincipal(), 'fireEvent', function (e) {
                    if (e == 'beforeload') {
                        _this.winAddDocumento.listaBotones.getItem(2).disable();
                        this.commitChanges();
                    }
                }, 'cargarOrden');
            });
            LOG.util.UIManager.encadenaFn(this.winAddDocumento, 'fireEvent', function (e) {
                if (e == 'show') {
                    _this.win.listaPlantillas.each(function (p) {
                        p.getStorePrincipal().initBaseParams.idestructura = _this.idDeposito;
                        p.getStorePrincipal().initBaseParams.iddeposito = _this.idDeposito;
                        p.getStorePrincipal().load();
                    });
                }
            }, 'showWin');
            this.winAddDocumento.aceptarFn = function () {
                if (_this.win.getSelectedTabIndex() == 0 && _this.win.getTemplateByIndex(0).getSmPrincipal().getSelected().json.cant_clientes > 1) {
                    var winClientes = new LOG.inv.documentoSalida.GridClientes({
                        idioma: _this.idioma,
                        ids: _this.win.getActiveTemplate().getSmPrincipal().getSelections(),
                        idestructura: _this.idDeposito,
                        generar: function (idclientes) {
                            _this.generar(idclientes);
                        }
                    });
                    winClientes.init();
                    winClientes.view();
                    return false;
                } else {
                    var _idClientes = [];
                    var _idAct = [];
                    if (/*_this.win.getActiveTemplate().idComponent == 4 &&*/ _this.win.getActiveTemplate().idComponent == 5) {
                        Ext.each(_this.win.getActiveTemplate().getStorePrincipal().getModifiedRecords(), function (r) {
                            _idClientes.push(r.data.idcliente);
                        });
                    } else if(_this.win.getActiveTemplate().idComponent == 3 || _this.win.getActiveTemplate().idComponent == 4) {
                        _this.win.getActiveTemplate().getSmPrincipal().each(function (r) {
                            let auxCC = r.json.idcentrocosto.split(',');
                            let auxOA = [];
                            if (r.json.idordenactividad) {
                                auxOA = r.json.idordenactividad.split(',');
                                Ext.each(auxOA, function(idordenactividad){
                                    _idAct.push(idordenactividad);
                                });
                            }
                            Ext.each(auxCC, function(idcentrocosto){
                                _idClientes.push(idcentrocosto);
                            });
                        });
                    }else {
                        _this.win.getActiveTemplate().getSmPrincipal().each(function (r) {
                            _idClientes.push(r.json.idcliente);
                        });
                    }
                    _this.generar(_idClientes, _idAct);
                }
            };
            this.win.activate(0);
        }
    },
    /***
     *
     */
    handlerEliminarMov: function () {
        var _scope = this;
        var idmovimientos = new Array();
        Ext.each(_scope.smGridDetalles.getSelections(), function (rec) {
            idmovimientos.push(rec.id);
        });
        _scope.modelo.eliminarMovimientos(idmovimientos, function (r) {
            var elementos = document.getElementsByClassName('nroDoc');
            for (var i = 0; i < elementos.length; i++) {
                elementos[i].innerHTML = r.nroDocPadre || '-';
            }
            _scope.stGridDetalles.reload();
        });
    },
    /**
     * Inicializa el panel de los lotes.
     * @returns {undefined}
     */
    initPanelLote: function () {
        var _this = this;
        if (this.lote == undefined) {
            LOG.lb.lote.Loader.init(function () {
                _this.lote = new LOG.lb.lote.View({
                    dirController: '/logistica/inventario/salida/salida/index.php/documentosalida',
                    formaVisualizacion: 'panel',
                    panelSuperior: false,
                    gridEditable: true,
                    btnEliminar: true,
                    ubicacion: true,
                    ubicacionLote: true,
                    sm: _this.winGestionarDocumento.smGridDetalles,
                    iddeposito: _this.idDeposito,
                    datos: {
                        iddocumento: _this.winGestionarDocumento.record.data.iddocumento
                    },
                    afectaLote: true,
                    afectaProducto: _this.modelo.origen != 1,
                    comprometida: true,
                    grantedAction: function (_p) {
                        return (_this.grantedAction(_p) && _this.winGestionarDocumento.record.data.estado == '1');
                    },
                    _postEliminarFn: function () {
                        _this.winGestionarDocumento.stGridDetalles.reload();
                    },
                    getSumaCantidadVieja: function () {
                        var suma = 0;
                        _this.lote.getStorePrincipal().each(function (l) {
                            suma += parseFloat(l.data.cantidadVieja);
                        });
                        return suma;
                    }
                });
                _this.lote.init();
                _this.lote.insertToolbarButton(LOG.util.UIManager.createBtn({
                    iconCls: 'lote',
                    text: _this.idioma.lbBtnLote,
                    tooltip: _this.idioma.ttBtnLote,
                    handler: function () {
                        var winLote = new LOG.lb.lote.adicionarLote({
                            idproducto: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idproducto,
                            idmovimiento: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idmovimiento,
                            cantidadmaxima: _this.winGestionarDocumento.smGridDetalles.getSelected().data.ordenado,
                            idestructura: _this.idDeposito,
                            iddocumento: _this.modelo.iddocumento,
                            signo: _this.winGestionarDocumento.smGridDetalles.getSelected().json.signo,
                            afectaLote: true,
                            afectaProducto: _this.modelo.origen != 1,
                            _postSalvarFn: function () {
                                _this.winGestionarDocumento.stGridDetalles.reload();
                            }
                        });
                        winLote.init();
                        winLote.view();
                    },
                    controlFn: function (b) {
                        if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) && _this.winGestionarDocumento.record.data.estado == '1') {
                            b.show();
                        } else {
                            b.hide();
                        }
                    }
                }), 0);
                _this.lote.addGridColumn({
                    dataIndex: 'cantidadVieja'
                });
                _this.lote.addGridColumn({
                    dataIndex: 'cantubicada'
                });
                Ext.apply(_this.lote.listaColumnas.getBy('dataIndex', 'descripcion'), {
                    hidden: true,
                    agrupador: true
                });
                Ext.apply(_this.lote.listaColumnas.getBy('dataIndex', 'cantidad'), LOG.util.Prototipos.columnaCantidad({
                    editor: LOG.util.Prototipos.inputDecimal({}),
                    renderer: function (_v, _mD, _r) {
                        if (!_v) {
                            _r.data.cantidad = 0;
                        }
                        return _r.data.cantidad;
                    }
                }));
                _this.formularioSur.add(_this.lote.view());
                LOG.util.UIManager.encadenaFn(_this.lote.getGridPrincipal(), 'fireEvent', function (e, o) {
                    if (e == 'beforeedit') {
                        if (_this.lote.sm.getSelected().json.decimales == '0') {
                            o.grid.getColumnModel().setEditor(o.column, LOG.util.Prototipos.inputEntero({}));
                        } else {
                            o.grid.getColumnModel().setEditor(o.column, LOG.util.Prototipos.inputDecimal({}));
                        }
                    }
                    if (e == 'afteredit') {
                        var record = _this.winGestionarDocumento.smGridDetalles.getSelected();
                        if (parseFloat(o.record.data.cantidad) > parseFloat(o.record.data.disponible)) {
                            o.record.data.cantidad = Math.min(parseFloat(o.record.data.disponible), Math.min(parseFloat(o.record.data.cantubicada), ((parseFloat(record.data.ordenado) - parseFloat(record.json.resto)) - ((_this.lote.modelo.getSumaCantidad() + (parseFloat(o.record.json.total) - _this.lote.getSumaCantidadVieja())) - parseFloat(o.record.data.cantidad)))));
                            mostrarMensaje(3, _this.idioma.msgErrorCantDisponible);
                        } else if (parseFloat(o.record.data.cantidad) > parseFloat(o.record.data.cantubicada)) {
                            o.record.data.cantidad = Math.min(parseFloat(o.record.data.cantubicada), ((parseFloat(record.data.ordenado) - parseFloat(record.json.resto)) - ((_this.lote.modelo.getSumaCantidad() + (parseFloat(o.record.json.total) - _this.lote.getSumaCantidadVieja())) - parseFloat(o.record.data.cantidad))));
                            mostrarMensaje(3, _this.idioma.msgErrorCantUbicada);
                            //                        } else if (_this.lote.modelo.getSumaCantidad() > (parseFloat(record.data.ordenado) - parseFloat(record.json.resto))) {
                            //                            o.record.data.cantidad = Math.max(0, ((parseFloat(record.data.ordenado) - parseFloat(record.json.resto)) - (_this.lote.modelo.getSumaCantidad() - parseFloat(o.record.data.cantidad))));
                            //                            mostrarMensaje(3, _this.idioma.msgErrorCantEntregar);
                        } else if ((_this.lote.modelo.getSumaCantidad() + (parseFloat(o.record.json.total) - _this.lote.getSumaCantidadVieja())) > (parseFloat(record.data.ordenado) - parseFloat(record.json.resto))) {
                            //o.record.data.cantidad = Math.min(parseFloat(o.record.data.cantubicada), ((parseFloat(record.data.ordenado) - parseFloat(record.json.resto)) - ((_this.lote.modelo.getSumaCantidad() + (parseFloat(o.record.json.total) - _this.lote.getSumaCantidadVieja())) - parseFloat(o.record.data.cantidad))));
                            //mostrarMensaje(3, _this.idioma.msgErrorCantEntregar);
                        }
                        o.grid.getView().refresh();
                        o.record.data.iddocumento = _this.lote.datos.iddocumento;
                        _this.modelo.editarLote(o.record.data);
                    }
                }, 'btnSalvar');
                LOG.util.UIManager.encadenaFn(_this.lote.getStorePrincipal(), 'fireEvent', function (e) {
                    if (e == 'beforeload') {
                        _this.modelo.listaLotes.deleteAll();
                        _this.modelo.habilitarBotones(!_this.modelo.isValid());
                    }
                }, 'btnSalvar');
            });
        } else {
            _this.lote.datos = {
                iddocumento: _this.winGestionarDocumento.record.data.iddocumento
            };
            _this.afectaProducto = _this.modelo.origen != 1;
        }
    },
    /**
     * Carga lod datos del documento que se muestran en la ventana adicionar.
     * @param {Object} datos
     * @returns {undefined}
     */
    cargarDatosEncabezados: function (datos) {
        var elementos = document.getElementsByTagName('td');
        for (var i = 0; i < elementos.length; i++) {
            if (elementos[i].getAttribute('class') == 'tipoDoc') {
                elementos[i].innerHTML = this.getNombreDoc(datos.iddocPadre) || '-';
            }
            if (elementos[i].getAttribute('class') == 'nroDoc') {
                elementos[i].innerHTML = datos.nroDocPadre || '-';
            }
            if (elementos[i].getAttribute('class') == 'fecha') {
                elementos[i].innerHTML = datos.fechacontablePadre || '-';
            }
            if (elementos[i].getAttribute('class') == 'entrega') {
                elementos[i].innerHTML = datos.cliente || '-';
            }
            if (elementos[i].getAttribute('class') == 'centrocosto') {
                elementos[i].innerHTML = 'Unidad 25';
            }
        }
    },
    /**
     * Habilita o deshabilita los elementos de la ventana adicionar de acuerdo al estado del documento.
     * @param {Boolean} mostarTab
     * @returns {undefined}
     */
    habilitarElementos: function (mostarTab) {
        /*Ext.each(this.tab.find('estado', true), function(item) {
         if (this.winGestionarDocumento.record.data.estado == '1') {
         item.enable();
         } else {
         item.disable();
         }
         }, this);*/
        if (mostarTab) {
            this.tab.show();
            this.fsDatosDocOrigen.hide();
            this.obs.hide();
            this.obs.disable();
            //this.cbOperacion.disable();
            this.clsVale.hide();
            /*Ext.each(this.clsVale.find('estado', true), function(item) {
             if (this.winGestionarDocumento.record.data.estado == '2' || (this.winGestionarDocumento.record.data.estado == '4' && isNaN(parseInt(this.winGestionarDocumento.record.data.idcomprobante)))) {
             item.enable();
             } else {
             item.disable();
             }
             });*/
            this.tab.doLayout();
        } else {
            this.tab.hide();
            this.fsDatosDocOrigen.show();
            this.obs.show();
            this.clsVale.show();
            //this.cbOperacion.setDisabled(this.winGestionarDocumento.record.data.estado != '1');
            this.obs.setDisabled(this.winGestionarDocumento.record.data.estado != '1');
            /*Ext.each(this.tab.find('tab', true), function(item) {
             item.disable();
             });
             Ext.each(this.clsVale.find('estado', true), function(item) {
             if (this.winGestionarDocumento.record.data.estado == '2' || (this.winGestionarDocumento.record.data.estado == '4' && isNaN(parseInt(this.winGestionarDocumento.record.data.idcomprobante)))) {
             item.enable();
             } else {
             item.disable();
             }
             }, this);*/
        }
        this.formularioGeneral.doLayout();
        this.winGestionarDocumento.doLayout();
        this.winGestionarDocumento.onShowHandler();
        if(this.winGestionarDocumento.record && this.winGestionarDocumento.record.data.estado == '4'){
            var cmG = this.winGestionarDocumento.cmGridDetalles;
            cmG.setDataIndex(
                cmG.findColumnIndex('existencia'),
                'existenciamovimiento'
            );
            this.winGestionarDocumento.ocultarColumna('disponible');
        }else{
            var cmG = this.winGestionarDocumento.cmGridDetalles;
            if(cmG.findColumnIndex('existenciamovimiento')){
                cmG.setDataIndex(
                    cmG.findColumnIndex('existenciamovimiento'),
                    'existencia'
                )
                ;this.winGestionarDocumento.ocultarColumna('disponible', false);
            }
        }  
    },
    /**
     * Devuelve el tipo de docuento dado su id.
     * @param {Numeric} _value
     * @returns {String}
     */
    getNombreDoc: function (_value) {
        for (var i = 0; i < this.tipoDoc.length; i++) {
            if (this.tipoDoc[i].iddoc == _value)
                return this.tipoDoc[i].denominacion;
        }
        return '-';
    },
    /**
     * Devuelve el Nombre de un país según su id.
     * @param {Numeric} _value
     * @returns {String}
     */
    getNombrePais: function (_value) {
        for (var i = 0; i < this.paises.length; i++) {
            if (this.paises[i].idpais == _value)
                return this.paises[i].nombrepais;
        }
        return '-';
    },
    getParamsReport: function (record, btn) {
        var _this = this;
        return btn.isList ? {
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            idcliente: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
            contabilizadopor: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
            tipodocumento: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null,
            creadopor: (_this.panelBusquedaAvanzada.findByType('combo')[4].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[4].getValue() : null,
            fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d/m/Y') : null,
            fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d/m/Y') : null,
            fechacontable: fecha ? fecha : null,
        } : {
            useSign: this.useSign,
            hasCategoria: (usarCategoria) ? 'true' : 'false',
            iddocumento: record.get("iddocumento") || null,
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            monedacontable: window.monedacontable || window.idcontable,
            monedaalternativa: window.monedaalternativa || window.idalternativa
        };
    },
    buildReport: function (btn, record) {
        if (btn.isList) {
            this.signDetails = {
                1: (btn.name.indexOf('ValeEntrega') != -1 || btn.name.indexOf('TransferenciaAlmacenes') != -1) ? 'Entregado' : 'Recepcionado',
                2: (btn.name.indexOf('ValeEntrega') != -1 || btn.name.indexOf('TransferenciaAlmacenes') != -1) ? 'Recibido' : 'Revisado',
                3: (btn.name.indexOf('ValeEntrega') != -1 || btn.name.indexOf('TransferenciaClientes') != -1) ? 'Contabilizado' : 'Aprobado'
            };
        }
        return LOG.inv.documentoSalida.View.superclass.buildReport.call(this, btn, record);
    },
    /**
     * Genera un documento por cada cliente.
     * @param {Array} idclientes
     * @returns {undefined}
     */
    generar: function (idclientes, actividades) {
        var _this = this;
        this.modelo.proccesGridPanel(_this.win.getActiveTemplate(), {
            idestructuracomun: _this.idDeposito,
            origen: _this.win.getActiveTemplate().idComponent + 1,
            idclientes: Ext.encode(idclientes),
            idactividades: Ext.encode(actividades)
        }, function (r) {
            if (r.iddocumento) {
                _this.getSmPrincipal().clearSelections();
                _this.winGestionarDocumento.tipoVentana = 2;
                _this.winGestionarDocumento.record = {
                    data: {
                        iddocumento: r.iddocumento,
                        iddoc: r.iddoc,
                        nrodoc: r.nrodoc,
                        numeroref: r.numeroref,
                        fechacontable: r.fechacontable,
                        estado: "1",
                        origen: _this.win.getActiveTemplate().idComponent + 1,
                        idcliente: r.idcliente,
                        tipocliente: r.tipocliente
                    }
                };
                _this.listaBotonesVentana.each(function (b) {
                    LOG.util.UIManager.applyKey(b, _this);
                    if (typeof b.controlFn == 'function') {
                        b.controlFn.createDelegate(_this, [b, _this]).call();
                    }
                }, _this);
                _this.initVentanaGestion(_this.winGestionarDocumento.record, 2);
                _this.winGestionarDocumento.buttons[1].hide();
                _this.habilitarElementos(r.tipocliente != 2);
                _this.modelo.iddocumento = r.iddocumento;
                _this.modelo.origen = _this.win.getActiveTemplate().idComponent + 1,
                _this.modelo.cargaInicial({
                    url: '/logistica/inventario/salida/salida/index.php/documentosalida/cargarDocumentos',
                    iddocumento: r.iddocumento
                }, function (resp) {
                    _this.cargarDatosEncabezados(resp[0][0]);
                });
            }
        });
    }
});
/**
 * Plantilla utilizada en la ventana nuevo (tabs).
 */
LOG.inv.documentoSalida.GridDocumentos = Ext.extend(LOG.util.UITemplate, {
    useSign: false,
    /**
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.busquedaBasica = true;
        this.textBusquedaSimple = config.idioma.gcNroDoc;
        this.autoSelect = false;
        this.idGridPrincipal = 'iddocumento';
        switch (config.idComponent) {
            case 0:
                this.urlBusquedaGridPrincipal = 'cargarDocDistribucion';
                this.modoSeleccion = 1;
                break;
            case 1:
                this.urlBusquedaGridPrincipal = 'cargarDocSolicitudentrega';
                break;
            case 2:
                this.urlBusquedaGridPrincipal = 'cargarDocMenualimento';
                break;
            case 4:
                this.urlBusquedaGridPrincipal = 'cargarDocumentos';
                this.modoSeleccion = 1;
                break;
            default:
                this.urlBusquedaGridPrincipal = 'cargarDocOrdenTrabajo';
                //this.gridEditable = true;
                this.modoSeleccion = 1;
                break;
        }
        LOG.inv.documentoSalida.GridDocumentos.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function () {
        if (this.btns) {
            var _this = this;
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'cumplimiento',
                text: _this.idioma.lbBtnCumplimiento,
                tooltip: _this.idioma.ttBtnCumplimiento,
                disabled: true,
                handler: function () {
                    var winCumplimiento = new LOG.dist.distribucion.winCumplimiento({
                        dirController: '/logistica/inventario/salida/salida/index.php/documentosalida',
                        datos: _this.getGridPrincipal().getSelectionModel().getSelected().json,
                        record: _this.getGridPrincipal().getSelectionModel().getSelected(),
                        externo: _this.idComponent == 1 ? 1 : null
                    });
                    winCumplimiento.init();
                    //winCumplimiento.getVistaPrincipal().maximized = false;
                    //winCumplimiento.getVistaPrincipal().setSize(800, 400);
                    winCumplimiento.view();
                },
                controlFn: function (b, _caller) {
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'asentar');
                }
            }));
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'estado',
                text: _this.idioma.lbBtnEstadoEjecucion,
                tooltip: _this.idioma.ttBtnEstadoEjecucion,
                disabled: true,
                handler: function () {
                    var winEstadoEjecucion = new LOG.dist.distribucion.winEstadoEjecucion({
                        datos: _this.getGridPrincipal().getSelectionModel().getSelected().json,
                        record: _this.getGridPrincipal().getSelectionModel().getSelected(),
                        pedido: true
                    });
                    winEstadoEjecucion.init();
                    winEstadoEjecucion.getVistaPrincipal().maximized = false;
                    winEstadoEjecucion.getVistaPrincipal().setSize(700, 400);
                    winEstadoEjecucion.view();
                },
                controlFn: function (b, _caller) {
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'ver');
                }
            }));
        }
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.lbBtnImprimirModelo,
            isList: false,
            name: this.name,
            disabled: true,
            handler: this.onReport.createDelegate(this, [{
                isList: false,
                name: this.name
            }]),
            controlFn: function (b, _caller) {
                //  if (_caller.grantedAction('CT') || _caller.grantedAction('RB')) {
                b.setVisible(true);
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        b.setDisabled(this.getCount() > 1);
                    }
                }, 'imprimir');
                /* } else {
                 b.setVisible(false);
                 }*/
            }
        }));
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocumento'
        });
        this.addGridColumn({
            dataIndex: 'estado'
        });
        this.addGridColumn({
            header: this.idioma.gcNroDoc,
            width: 100,
            dataIndex: 'nrodoc',
            default: true
        });
        this.cbCliente = new LOG.util.ComboBox({
             url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarCentroCostos',
             hiddenName: 'idcliente',
             valueField: 'idcentrogrupo',
             displayField: 'descripcioncentrogrupo',
             allowBlank: false,
             mode: 'local',
             autoLoad:true,
             pageSize: 10,
             resizable: true
        });
        this.cbCliente.getStore().load();
        this.addGridColumn({
            header: (this.idComponent == 0 ? this.idioma.gcEntregarA : this.idioma.gcCentroCosto),
            autoExpand: true,
            dataIndex: 'cliente',
            renderer: function (_v, _mD, _r) {
                if(_this.idComponent == 0){
                    if (parseInt(_r.json.cant_clientes) > 1) {
                        return parseInt(_r.json.cant_clientes) + ' ' + LOG.inv.documentoSalida.TipoCliente[_r.json.tipocliente];
                    }
                    return _r.data.cliente;
                } else if(_this.idComponent == 2){
                    _r.data.idcliente = _r.json.idcentrogrupo;
                    return _r.data.nombre ? _r.data.nombre : _this.cbCliente.getStore().getById(_r.json.idcentrogrupo).data.descripcioncentrogrupo;
                } else if(_this.idComponent == 3){
                    _r.data.idcliente = _r.data.idcliente;
                    return _r.data.cliente ? _this.cbCliente.getRawValue() : '';
                } else if(_this.idComponent == 4){         
                    _r.data.idcliente = _r.json.idcentrocosto;
                    return _this.cbCliente.getStore().getById(_r.json.idcentrocosto).data.descripcioncentrogrupo;
                } else {
                    return _r.json.cliente;
                }
               /* switch (_this.idComponent) {
                    case 0:

                        break;
                    case 2:
                        _r.data.idcliente = _r.json.idcentrogrupo;
                        break;
                    case 3:
                        _r.data.idcliente = _r.data.idcliente;
                        return _r.data.cliente ? _this.cbCliente.getRawValue() : '';
                        break;
                    case 4:
                        return _r.data.cliente ? _this.cbCliente.getStore().getById(_r.json.idcentrocosto).data.descripcioncentrogrupo : '';
                        break;
                }
                return _r.json.cliente;*/
            },
            //editor: (this.idComponent == 3 ? this.cbCliente : null),
            hidden: (this.idComponent == 3 ? true : false),
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcFecha,
            width: 110,
            dataIndex: 'fechacontable',
            default: true
        });
        this.addGridColumn({
            header: (this.idComponent > 1 ? null : this.idioma.gcEstadoEjecucion),
            width: 120,
            dataIndex: 'estadoejecucion',
            renderer: function (_v) {
                return LOG.inv.documentoSalida.EstadoCmpto[_v];
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcCantProductos,
            width: 100,
            dataIndex: (this.idComponent != 0 && this.idComponent != 3 ? 'cantproductos' : 'cant_productos'),
            default: true
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
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            monedacontable: window.monedacontable || window.idcontable,
            monedaalternativa: window.monedaalternativa || window.idalternativa
        };
    }
});
/**
 * Plantilla utilizada en la ventana nuevo para selecionar los clientes.
 */
LOG.inv.documentoSalida.GridClientes = Ext.extend(LOG.util.UITemplate, {
    /**
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.concepto = config.idioma.ttBtnBuscarCliente;
        this.textBusquedaSimple = config.idioma.gcCliente;
        this.busquedaBasica = true;
        this.autoSelect = false;
        this.urlBusquedaGridPrincipal = 'cargarClientes';
        LOG.inv.documentoSalida.GridClientes.superclass.constructor.call(this, config);
        this.getVistaPrincipal().setTitle(config.idioma.tlClientes);
        this.getVistaPrincipal().setSize(600, 400);
    },
    initDefaultButtons: function () {
        var _this = this;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            disabled: true,
            handler: function () {
                _this.generar.createDelegate(_this, [_this.getSelectedIdClientes()]).call();
                _this.getVistaPrincipal().close();
            }
        });
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idcliente'
        });
        this.addGridColumn({
            header: this.idioma.gcCliente,
            autoExpand: true,
            dataIndex: 'cliente',
            default: true
        });
    },
    render: function () {
        var render = LOG.inv.documentoSalida.GridClientes.superclass.render.call(this);
        var _this = this;
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            iddocumentos: Ext.encode(_this.getIddocumentos(_this.ids)),
            idestructura: _this.idestructura
        });
        this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange') {
                if (this.getCount() > 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });
        this.getStorePrincipal().load();
        return render;
    },
    /**
     * Devuelve los iddocumento seleccionados.
     * @param {Array} arrayId
     * @returns {Array}
     */
    getIddocumentos: function (arrayId) {
        var id = [];
        Ext.each(arrayId, function (item) {
            id.push(item.data.iddocumento);
        });
        return id;
    },
    /**
     * Devuelve los idclientesproveedores.
     * @returns {Array}
     */
    getSelectedIdClientes: function () {
        var _selecteId = [];
        if (this.getSmPrincipal().hasSelection()) {
            Ext.each(this.getSmPrincipal().getSelections(), function (r) {
                _selecteId.push(r.data.idcliente);
            });
        }
        return _selecteId;
    }
});
