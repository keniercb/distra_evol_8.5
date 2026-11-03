Ext.ns('LOG.dist.distribucion');
LOG.dist.distribucion.View = Ext.extend(LOG.lb.documento.View, {
    name: 'Distribucion',
    cantSign: 2,
    signDetails: {
        1: 'Despachado',
        2: 'Recibido'
    },
    dirReport:'/logistica/distribucion/distribucion/',
    constructor: function (config) {
        var _this = this;
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        this.concepto = 'distribuciones';
        config.model = new LOG.dist.distribucion.Model({
            idioma: config.idioma
        });

        this.arrayMenuImprimir = [LOG.util.UIManager.createMenuItem({
            iconCls: 'imprimir',
            tooltip: config.idioma.ttBtnImprimirModeloDespacho,
            text: config.idioma.ttBtnModeloDespacho,
            hidden: false,
            handler: function () {
                _this.onReport({
                    isList: false,
                    name:'DistribucionModeloDespacho'
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 3 || this.getCount() == 1 && this.getSelected().data.estado == 2) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    })
                } else {
                    b.setVisible(false);
                }
            }
        })];

        LOG.dist.distribucion.View.superclass.constructor.call(this, config);
        this.winGestionarDocumento = new LOG.dist.distribucion.VentanaAdicionar({
            idioma: config.idioma,
            modelo: config.model,
            scope: this,
            height: 580,
            title: this.idioma.tlVentanaAdicionarDistribucion,
            tipodistribucion: config.model.tipodistribucion,
            width: 750
        });
        this.winGestionarDocumento.on('show', function (w) {
            if (!w.record || w.record.data.estado == 1) {
                /*_this.cmbConcepto.allowBlank = false;*/
                _this.cmbConcepto.validate();
            } else {
                /*_this.cmbConcepto.allowBlank = true;*/
                _this.cmbConcepto.validate();
            }
        });
    },
    init: function () {
        LOG.dist.distribucion.View.superclass.init.call(this);
        this.panelSuperior();
    },
    initVentanaGestion: function (d, tipoVentana) {
        var _this = this;
        LOG.dist.distribucion.View.superclass.initVentanaGestion.createDelegate(this, [d, tipoVentana]).call();
        _this.habilitarElementosWindow();
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.btnNuevo, 'handler', function () {
            if (_this.modelo.tipodistribucion == 3) {
                _this.cmbDestino.enable();
            }
        });
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.stGridDetalles, 'fireEvent', function (e, o) {
            if (e == 'load') {
                if (this.getCount() == 0) {
                    if (!!o.baseParams.criterio) {
                        mostrarMensaje(1, _this.idioma.msgNoExistenDatosDelCriterio);
                    } else {
                        _this.cmbConcepto.enable();
                        _this.cmbDestino.enable();
                        _this.cmbEntidad.enable();
                    }
                } else {
                    _this.cmbDestino.disable();
                    _this.cmbEntidad.disable();
                }
            }
        }, 'editar');

        var titleGrid;
        if (_this.modelo.tipodistribucion == 3) {
            titleGrid = _this.idioma.tlGridDestinos;
            if (_this.cmbDestino.getValue() == 3) {
                _this.cmbEntidad.show();
                _this.panelCheck.hide()
            } else {
                _this.cmbEntidad.hide();
                _this.panelCheck.show();
                if (_this.cmbDestino.getValue() == 4) {
                    _this.checkSalidaFactura.disable();
                }
            }
        } else if (_this.modelo.tipodistribucion == 2) {
            titleGrid = _this.idioma.tlGridPedidos;
            _this.cmbEntidad.hide();
        } else {
            titleGrid = _this.idioma.tlGridClientes;
            _this.cmbEntidad.hide();
        }

        this.winGestionarDocumento.panelProductos.setTitle(titleGrid);
        this.winGestionarDocumento.listaBotonesProductos.getItem(0).setTooltip((_this.modelo.tipodistribucion == 3) ? _this.idioma.ttBtnAdicionarDestinoManual : (_this.modelo.tipodistribucion == 2 ? _this.idioma.ttBtnAdicionarPedidoDistribucion : (_this.modelo.tipodistribucion == 4) ? _this.idioma.ttBtnAdicionarSolicitudDistribucion : _this.idioma.ttBtnAdicionarPropuestaDistribucion));
        this.winGestionarDocumento.listaBotonesProductos.getItem(1).setTooltip((_this.modelo.tipodistribucion == 3) ? _this.idioma.ttBtnEliminarDestinoManual : (_this.modelo.tipodistribucion == 2 ? _this.idioma.ttBtnEliminarPedidoDistribucion : (_this.modelo.tipodistribucion == 4) ? _this.idioma.ttBtnEliminarSolicitudDistribucion : _this.idioma.ttBtnEliminarPropuestaDistribucion));

        this.winGestionarDocumento.listaBotonesVentana.getItem(0).setTooltip((_this.modelo.tipodistribucion == 3) ? _this.idioma.ttBtnProductosDistribucionManual : (_this.modelo.tipodistribucion == 2 ? _this.idioma.ttBtnProductosPedido : (_this.modelo.tipodistribucion == 4) ? _this.idioma.ttBtnProductosSolicitudDistribucion : _this.idioma.ttBtnProductosPropuestaDistribucion));
        this.winGestionarDocumento.listaBotonesVentana.getItem(1).setTooltip((_this.modelo.tipodistribucion == 3) ? _this.idioma.ttBtnEliminarDistribucionManual : (_this.modelo.tipodistribucion == 2 ? _this.idioma.ttBtnEliminarDistribucionPedido : (_this.modelo.tipodistribucion == 4) ? _this.idioma.ttBtnEliminaDistribucionSolicitud : _this.idioma.ttBtnEliminaPropuestaDistribucion));
        this.winGestionarDocumento.listaBotonesVentana.getItem(2).setTooltip((_this.modelo.tipodistribucion == 3) ? _this.idioma.ttBtnConfirmarDistribucionManual : (_this.modelo.tipodistribucion == 2 ? _this.idioma.ttBtnConfirmarDistribucionPedido : (_this.modelo.tipodistribucion == 4) ? _this.idioma.ttBtnConfirmarDistribucionSolicitud : _this.idioma.ttBtnConfirmarPropuestaDistribucion));
        this.winGestionarDocumento.listaBotonesVentana.getItem(3).setTooltip((_this.modelo.tipodistribucion == 3) ? _this.idioma.ttBtnAnularDistribucionManual : (_this.modelo.tipodistribucion == 2 ? _this.idioma.ttBtnAnularDistribucionPedido : (_this.modelo.tipodistribucion == 4) ? _this.idioma.ttBtnAnularDistribucionSolicitud : _this.idioma.ttBtnAnularPropuestaDistribucion));
        this.winGestionarDocumento.listaBotonesVentana.getItem(4).setTooltip((_this.modelo.tipodistribucion == 3) ? _this.idioma.ttBtnAprobarDistribucionManual : (_this.modelo.tipodistribucion == 2 ? _this.idioma.ttBtnAprobarDistribucionPedido : (_this.modelo.tipodistribucion == 4) ? _this.idioma.ttBtnAprobarDistribucionSolicitud : _this.idioma.ttBtnAprobarPropuestaDistribucion));

        _this.desabilitarElements(_this.modelo.tipodistribucion);
        this.winGestionarDocumento.doLayout();
    },
    initDefaultColumns: function () {
        var _this = this;
        LOG.dist.distribucion.View.superclass.initDefaultColumns.call(this);

        this.insertGridColumn({
            header: _this.idioma.cgTipoDocumento,
            width: 160,
            dataIndex: 'tipodistribucion',
            default: true,
            renderer: function (v) {
                return LOG.lb.documento.TipoDistribucion[v];
            }
        }, 0);

        var columFechaCreacion = this.listaColumnas.getPosByField('dataIndex', 'fechacontable', 'header');

        this.insertGridColumn({
            header: _this.idioma.cgEntregarA,
            width: 240,
            dataIndex: 'cliente',
            default: true,
            autoExpand: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.cant_clientes > 1) {
                    if (record.json.tipodestino == "1") {
                        return record.json.cant_clientes + '&nbsp;' + _this.idioma.lbClientes;
                    } else if (record.json.tipodestino == "2") {
                        return record.json.cant_clientes + '&nbsp;' + _this.idioma.lbCentrosCosto;
                    } else if (record.json.tipodestino == "3") {
                        return record.json.cant_clientes + '&nbsp;' + _this.idioma.lbCantDepositos;
                    } else if (record.json.tipodestino == "4") {
                        return record.json.cant_clientes + '&nbsp;' + _this.idioma.lbCantAreasresp;
                    } else {
                        return record.json.cant_clientes + '&nbsp;' + _this.idioma.lbPedidos;
                    }
                } else {
                    if (record.json.tipocliente == "3") {
                        return (record.json.entidaddestino) ? record.json.entidaddestino : record.json.cliente;
                    }
                }
                return value;
            }
        }, columFechaCreacion + 1);

        LOG.util.UIManager.apply(this.listaColumnas.getBy('dataIndex', 'cantproductos'), {
            dataIndex: 'cant_productos'
        });

        var columEstado = this.listaColumnas.getPosByField('dataIndex', 'estado', 'header');

        this.insertGridColumn({
            header: _this.idioma.cgEstadoEjecucion,
            width: 130,
            dataIndex: 'estadoejecucion',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.estadoejecucion == 3) {
                    return _this.idioma.lbCumplimentado;
                } else if (record.json.estadoejecucion == 2) {
                    return _this.idioma.lbEnProceso;
                } else {
                    return _this.idioma.lbNoProcesado;
                }
                return value;
            }
        }, columEstado + 1);

        var columCantProductos = this.listaColumnas.getPosByField('dataIndex', 'cant_productos', 'header');

        this.insertGridColumn({
            header: _this.idioma.cgSalidaPor,
            width: 150,
            dataIndex: 'salidapor',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.salidaporfactura == 1) {
                    return value;
                } else if (record.json.salidaporactivo == 1) {
                    return value;
                } else if (record.json.tipocliente == 2) {
                    return 'Vale de entrega';
                } else {
                    return 'Transferencia';
                }
            }
        }, columCantProductos + 1);

        this.insertGridColumn({
            header: 'Observaciones',
            dataIndex: 'observaciones',
            width: 300,
            filter : {
                type : 'string',
                emptyText : 'Observaci\xf3n',
                dataIndex : 'observaciones'
            }
        }, columCantProductos + 8);

        this.addGridColumn({dataIndex: 'cant_clientes'});

        this.addGridColumn({dataIndex: 'tipodistribucion'});

        this.addGridColumn({dataIndex: 'idnomconcepto'});

        this.addGridColumn({dataIndex: 'idestructuraop'});

        this.addGridColumn({dataIndex: 'tipodestino'});

        this.addGridColumn({dataIndex: 'arrayClientes'});

        this.addGridColumn({dataIndex: 'salidaporfactura'});

        this.addGridColumn({dataIndex: 'salidaporactivo'});

        this.addGridColumn({dataIndex: 'id'});

        this.addGridColumn({dataIndex: 'idcliente'});

        this.addGridColumn({dataIndex: 'controlfirma'});

        this.addGridColumn({dataIndex: 'idnodo'});

        this.addGridColumn({dataIndex: 'iddoc'});

        this.addGridColumn({dataIndex: 'entidaddestino'});
    },
    initDefaultButtons: function () {
        LOG.dist.distribucion.View.superclass.initDefaultButtons.call(this);

        var _this = this;

        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            controlFn: function (b, _caller) {
                b.hide();
            }
        });

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.lnBtnNuevo,
            iconCls: 'nuevo',
            isContextual: true,
            tooltip: _this.idioma.ttBtnNuevaDistribucion,
            menu: [
                new Ext.menu.Item({
                    text: _this.idioma.lbBtnDistribucionManual,
                    handler: function () {
                        _this.modelo.tipodistribucion = 3;
                        _this.initVentanaGestion();
                    }
                }),
                new Ext.menu.Item({
                    text: _this.idioma.lbBtnDistribucionPedido,
                    handler: function () {
                        _this.modelo.tipodistribucion = 2;
                        _this.initVentanaGestion();
                    }
                }),
                new Ext.menu.Item({
                    text: _this.idioma.lbBtnPropuestaDistribucion,
                    handler: function () {
                        _this.modelo.tipodistribucion = 1;
                        _this.initVentanaGestion();
                    }
                }),
                new Ext.menu.Item({
                    text: _this.idioma.lbBtnDistribucionReserva,
                    handler: function () {
                        _this.modelo.tipodistribucion = 4;
                        _this.initVentanaGestion();
                    }
                })
            ],
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }), 0);

        Ext.Ajax.request({
            url: 'getDistribucionPedido',
            callback: function (opt, scs, resp) {
                var respMsg = Ext.decode(resp.responseText);
                if (respMsg.datos[0]) {
                    if (!respMsg.datos[0].tipodistribucion) {
                        _this.listaBotones.getItem(0).menu.items.items[1].hidden = true;
                        _this.listaBotones.getItem(0).menu.items.items[2].hidden = true;
                    } else {
                        if (respMsg.datos[0].tipodistribucion == "2" || respMsg.datos[0].tipodistribucion == "0") {
                            _this.listaBotones.getItem(0).menu.items.items[1].hidden = true;
                        }
                        if (respMsg.datos[0].tipodistribucion == "1" || respMsg.datos[0].tipodistribucion == "0") {
                            _this.listaBotones.getItem(0).menu.items.items[2].hidden = true;
                        }
                    }
                    if (respMsg.datos[0].reserva == 0) {
                        _this.listaBotones.getItem(0).menu.items.items[3].hidden = true;
                    }
                }
            }
        });

        this.listaBotones.getItem(1).handler = this.listaBotones.getItem(1).handler.createSequence(function (e) {
            if (_this.getGridPrincipal().getSelectionModel().getSelected().data.tipodistribucion == 1) {
                _this.desabilitarElements(1);
            } else if (_this.getGridPrincipal().getSelectionModel().getSelected().data.tipodistribucion == 2) {
                _this.desabilitarElements(2);
            } else if (_this.getGridPrincipal().getSelectionModel().getSelected().data.tipodistribucion == 4) {
                _this.desabilitarElements(4);
            } else {
                _this.desabilitarElements(3);
            }
            _this.habilitarElementosWindow();
        });

        LOG.util.UIManager.apply(this.listaBotones.getItem(3), {
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.hide();
                }
            }
        });

        this.onGridDobleClick = function () {
            var b = _this.listaBotones.getItem(4);
            b.handler.call(b, b);
        };

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'producto',
            text: this.idioma.lbBtnProductos,
            tooltip: this.idioma.ttBtnProductos,
            isContextual: true,
            disabled: true,
            handler: function () {
                if (_this.getGridPrincipal().getSelectionModel().getSelected().data.tipodistribucion == '1' ||
                    _this.getGridPrincipal().getSelectionModel().getSelected().data.tipodistribucion == '3') {
                    var productos = new LOG.dist.distribucion.Productos({
                        idioma: _this.idioma,
                        record: _this.getSmPrincipal().getSelected(),
                        model: _this.modelo,
                        _parent: _this,
                        alternativa: alternativa,
                        codContable: codContable,
                        codAlternativa : codAlternativa,
                        operacion: _this.getGridPrincipal().getSelectionModel().getSelected().data.tipodistribucion,
                        hideComponent: (_this.getGridPrincipal().getSelectionModel().getSelected().data.tipodistribucion == 1) ? true : false,
                        datos: (_this.getGridPrincipal().getSelectionModel().getSelected()) ? _this.getGridPrincipal().getSelectionModel().getSelected().data : null
                    });
                    productos.init()
                    _this.vistaProductos = productos.view();
                    _this.vistaProductos.show();
                } else {
                    var productosdistribucion = new LOG.dist.distribucion.ProductosDistribucion({
                        idioma: _this.idioma,
                        model: _this.modelo,
                        record: _this.getSmPrincipal().getSelected(),
                        _parent: _this,
                        alternativa: alternativa,
                        codContable: codContable,
                        codAlternativa : codAlternativa,
                        listaClientes: _this.listaClientes,
                        winGestionarDocumento: _this.winGestionarDocumento,
                        hideComponent: (_this.getGridPrincipal().getSelectionModel().getSelected().data.tipodistribucion == 1) ? false : true,
                        datos: (_this.getGridPrincipal().getSelectionModel().getSelected()) ? _this.getGridPrincipal().getSelectionModel().getSelected().data : null
                    });
                    productosdistribucion.init();
                    _this.vistaProductosDistribucion = productosdistribucion.view();
                    _this.vistaProductosDistribucion.show();
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RProductos')) {
                    b.setVisible(true);
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
        }), 4);

        this.insertToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.confirmar();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    })
                } else {
                    b.setVisible(false);
                }
            }
        }), 5);

        this.insertToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnular,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado') || _this.grantedAction('RAnular')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 2) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }), 6);

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'estado',
            text: this.idioma.lbBtnEstadoEjecucion,
            tooltip: this.idioma.ttBtnEstadoEjecucion,
            isContextual: true,
            disabled: true,
            handler: function () {
                var winEstadoEjecucion = new LOG.dist.distribucion.winEstadoEjecucion({
                    record: _this.getSmPrincipal().getSelected(),
                    idioma: _this.idioma,
                    datos: (_this.getGridPrincipal().getSelectionModel().getSelected()) ? _this.getGridPrincipal().getSelectionModel().getSelected().data : null
                });
                winEstadoEjecucion.init();
                _this.vistaProductosDistribucion = winEstadoEjecucion.view();
                _this.vistaProductosDistribucion.show();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RB')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1/* && this.getSelected().data.estado == 3*/) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    })
                } else {
                    b.setVisible(false);
                }
            }
        }), 7);

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'cumplimiento',
            text: this.idioma.lbBtnCumplimiento,
            tooltip: this.idioma.ttBtnCumplimiento,
            isContextual: true,
            disabled: true,
            handler: function () {
                var winCumplimiento = new LOG.dist.distribucion.winCumplimiento({
                    record: _this.getSmPrincipal().getSelected(),
                    idioma: _this.idioma,
                    datos: (_this.getGridPrincipal().getSelectionModel().getSelected()) ? _this.getGridPrincipal().getSelectionModel().getSelected().data : null
                });
                winCumplimiento.init();
                _this.vistaCumplimiento = winCumplimiento.view();
                _this.vistaCumplimiento.show();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RB')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1/* && this.getSelected().data.estado == 3*/) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    })
                } else {
                    b.setVisible(false);
                }
            }
        }), 8);

this.insertToolbarButton(LOG.util.Prototipos.botonAprobar({
            tooltip: this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.initVentanaGestion(_this.getGridPrincipal().getSelectionModel().getSelected(), 3);
                if (_this.modelo.tipodistribucion == 1) {
                    _this.desabilitarElements(1);
                } else if (_this.modelo.tipodistribucion == 2) {
                    _this.desabilitarElements(2);
                } else if (_this.modelo.tipodistribucion == 4) {
                    _this.desabilitarElements(4);
                } else {
                    _this.desabilitarElements(3);
                }
                _this.habilitarElementosWindow();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(
                            (this.getCount() == 1 && (this.getSelected().data.estado == 2 || this.getSelected().data.estado == 10)) && //first
                            ((window.useSign && typeof pki == 'object') ? (_caller.getSmPrincipal().getSelected().get('controlfirma') == 2) : true) //last pki //para controlfirma == 2 limit 3 y 1 limit 2
                            ));
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }), 9);

        this.insertToolbarButton(LOG.util.Prototipos.botonDuplicar({
            tooltip: this.idioma.ttBtnDuplicar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.duplicar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RDuplicar')) {
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
        }), 10);

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'anular',
            text: this.idioma.lbBtnAnularAsignaciones,
            tooltip: this.idioma.ttBtnAnularAsignaciones,
            isContextual: true,
            disabled: true,
            handler: function () {
                var winAnularAsignaciones = new LOG.dist.distribucion.winAnularAsignaciones({
                    _parent: _this,
                    record: _this.getSmPrincipal().getSelected(),
                    idioma: _this.idioma,
                    iddocumento: _this.getGridPrincipal().getSelectionModel().getSelected().data.iddocumento,
                    datos: _this.getGridPrincipal().getSelectionModel().getSelected().data
                });
                winAnularAsignaciones.init();
                _this.vistaAnularAsignacion = winAnularAsignaciones.view();
                _this.vistaAnularAsignacion.show();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularasignacion')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && (this.getSelected().data.estado == 3 || this.getSelected().data.estado == 10) && this.getSelected().json.anular == 1 && this.getSelected().json.estadoejecucion != 3) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }), 11);

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'registro',
            text: 'Restablecer cumplimiento',
            tooltip: 'Restablece el cumplimiento de la distribuci\xf3n',
            disabled: true,
            handler: function() {
                Ext.MessageBox.wait('Restableciendo cumplimiento', LOG.util.Idioma.msgEspere);
                Ext.Ajax.request({
                    url: 'restablecerCumplimiento',
                    method: 'POST',
                    params:{
                        iddocumento : _this.getGridPrincipal().getSelectionModel().getSelected().data.iddocumento
                    } ,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        _this.getStorePrincipal().reload();
                    }
                });
            },
            controlFn: function (b, __caller){
                if (__caller.grantedAction('RRestablecer')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
                b.disable();
                LOG.util.UIManager.encadenaFn(__caller.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.estado == 3) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }), 12);
        LOG.util.UIManager.apply(this.listaBotones.getItem(13), {
            id: 'iddistribucion'
        });
        /*this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'imprimir',
            tooltip: _this.idioma.ttBtnImprimirModeloDespacho,
            text: _this.idioma.ttBtnImprimir,
            disabled:false,
            hidden: false,
            handler: function () {
                _this.onReport({
                    isList: false,
                    name: _this.name + 'Modelo'
                });
            },
            // controlFn: function (b, _caller) {
            //     if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RB')) {
            //         b.setVisible(true);
            //         if (_this.record) {
            //             b.enable();
            //         } else {
            //             b.disable();
            //         }
            //     } else {
            //         b.setVisible(false);
            //     }
            // }
        }), 14);*/

        this.insertToolbarButtonVentana(LOG.util.UIManager.createBtn({
            iconCls: 'producto',
            text: this.idioma.lbBtnProductos,
            tooltip: this.idioma.ttBtnProductos,
            disabled: true,
            handler: function () {
                if (_this.modelo.tipodistribucion == '1' ||
                    _this.modelo.tipodistribucion == '3') {
                    var _productos = new LOG.dist.distribucion.Productos({
                        idioma: _this.idioma,
                        record: _this.winGestionarDocumento.record,
                        model: _this.modelo,
                        _parent: _this,
                        alternativa: alternativa,
                        codContable: codContable,
                        codAlternativa : codAlternativa,
                        operacion: (_this.modelo.tipodistribucion == '1') ? 1 : 3,
                        hideComponent: (_this.modelo.tipodistribucion == '1') ? 1 : 2,
                        datos: (_this.winGestionarDocumento.record) ? _this.winGestionarDocumento.record.data : null
                    });
                    _productos.init();
                    _this.vistaProductos = _productos.view();
                    _this.vistaProductos.show();
                } else {
                    var _productosdistribucion = new LOG.dist.distribucion.ProductosDistribucion({
                        idioma: _this.idioma,
                        record: _this.winGestionarDocumento.record,
                        model: _this.modelo,
                        _parent: _this,
                        datos: _this.winGestionarDocumento.record.data
                    });
                    _productosdistribucion.init();
                    _this.vistaProductosDistribucion = _productosdistribucion.view();
                    _this.vistaProductosDistribucion.show();
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RProductos')) {
                    if (_this.winGestionarDocumento.record) {
                        _this.winGestionarDocumento.stGridDetalles.fireEvent = _this.winGestionarDocumento.stGridDetalles.fireEvent.createSequence(function (e) {
                            if (_this.winGestionarDocumento.stGridDetalles.getTotalCount() > 0) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        });
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }), 0);

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(1), {
            tootip: _this.idioma.ttBtnEliminarDistribucionManual,
            disabled: true,
            handler: function () {
                _this.modelo.eliminar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.setVisible(true);
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
            handler: function () {
                _this.modelo.confirmar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "2"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "2";
                    }
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWindow();
                });
            },
            disabled: true,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                    b.setVisible(true);
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

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(3), {
            disabled: true,
            handler: function () {
                _this.modelo.anularestado({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "1";
                    }
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWindow();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado') || _this.grantedAction('RAnular')) {
                    b.setVisible(true);
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

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), {
            disabled: true,
            handler: function () {
                _this.modelo.aprobar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "3"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "3";
                    }
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWindow();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
                    b.setVisible(true);
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

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(5), {
            controlFn: function (b, _caller) {
                b.hide();
            }
        });

        this.insertToolbarButtonProductos(LOG.util.Prototipos.botonAdicionar({
            disabled: true,
            handler: function () {
                if (_this.modelo.tipodistribucion == 3) {
                    if (_this.cmbDestino.getValue() == 1) {
                        var _clientes = new LOG.dist.distribucion.VentanaClientes({
                            idioma: _this.idioma,
                            _parent: _this,
                            parametros: {
                                listaClientes: Ext.encode(_this.winGestionarDocumento.stGridDetalles.collect('idcliente'))
                            }
                        });
                        _clientes.init();
                        _this.vistaClientes = _clientes.view();
                        _this.vistaClientes.show();
                    } else if (_this.cmbDestino.getValue() == 2) {
                        var _centroscosto = new LOG.dist.distribucion.VentanaCentrosCosto({
                            idioma: _this.idioma,
                            _parent: _this,
                            parametros: {
                                idseleccionados: Ext.encode(_this.winGestionarDocumento.stGridDetalles.collect('idcliente'))
                            }
                        });
                        _centroscosto.init();
                        _this.vistaCentrosCosto = _centroscosto.view();
                        _this.vistaCentrosCosto.show();
                    } else if (_this.cmbDestino.getValue() == 3) {
                        if (_this.cmbEntidad.getValue() != '') {
                            var _depositos = new LOG.dist.distribucion.VentanaDepositos({
                                idioma: _this.idioma,
                                _parent: _this,
                                parametros: {
                                    idseleccionados: Ext.encode(_this.winGestionarDocumento.stGridDetalles.collect('idcliente')),
                                    identidad: _this.cmbEntidad.getValue()
                                }
                            });
                            _depositos.init();
                            _this.vistaDepositos = _depositos.view();
                            _this.vistaDepositos.show();
                        } else {
                            mostrarMensaje(1, _this.idioma.msgSelectEntidad);
                        }

                    } else if (_this.cmbDestino.getValue() == 4) {
                        var _areasresp = new LOG.dist.distribucion.VentanaAreasResponsabilidad({
                            idioma: _this.idioma,
                            _parent: _this,
                            parametros: {
                                idseleccionados: Ext.encode(_this.winGestionarDocumento.stGridDetalles.collect('idcliente'))
                            }
                        });
                        _areasresp.init();
                        _this.vistaAreasResp = _areasresp.view();
                        _this.vistaAreasResp.show();
                    } else {
                        mostrarMensaje(1, _this.idioma.msgSelectDestino);
                    }
                } else if (_this.modelo.tipodistribucion == 1) {
                    var GridClientesCriticos = new LOG.dist.distribucion.GridClientesCriticos({
                        idioma: _this.idioma,
                        id: 'idcriticos',
                        model: _this.modelo,
                        title: 'Clientes cr\xedticos'
                    });
                    var GridClientes = new LOG.dist.distribucion.GridClientes({
                        idioma: _this.idioma,
                        id: 'idclientes',
                        title: 'Clientes',
                        _parent: _this.winGestionarDocumento,
                        model: _this.modelo,
                        parametros: {
                            listaClientes: Ext.encode(_this.winGestionarDocumento.stGridDetalles.collect('idcliente'))
                        }
                    });

                    this.tapPanel = new LOG.util.UITabTemplate({idioma: _this.idioma, formaVisualizacion: 'ventana'});
                    this.tapPanel.addTabToTemplete(GridClientes);
                    this.tapPanel.addTabToTemplete(GridClientesCriticos);
                    this.tapPanel.init();
                    var tap = this.tapPanel.view({
                        title: _this.idioma.tlVentanaAdicionarCliente,
                        width: 700,
                        height: 400,
                        usarAplicar: false,
                        aceptarFn: function () {
                            var _this = this;
                            var _clientes = new Array();
                            var seleccionados = GridClientes.getSmPrincipal().getSelections();
                            Ext.each(seleccionados, function (rec) {
                                _clientes.push({
                                    idcliente: rec.get('idclientesproveedores'),
                                    tipocliente: 1
                                });
                            });
                            var seleccionadosCriticos = GridClientesCriticos.getSmPrincipal().getSelections();
                            Ext.each(seleccionadosCriticos, function (rec) {
                                _clientes.push({
                                    idcliente: rec.get('idcliente'),
                                    tipocliente: 1
                                });
                            });
                            if (GridClientes.model.iddocumento == null) {
                                GridClientes.model.salvar({
                                    idcliente: Ext.encode(_clientes)
                                }, function (resp) {
                                    _this.postSalvar.createDelegate(_this, [resp]).call();
                                });
                            } else {
                                GridClientes.model.adicionarDestinos({
                                    idcliente: Ext.encode(_clientes)
                                }, function (resp) {
                                    _this.postSalvar.createDelegate(_this, [resp]).call();
                                });
                            }
                        },
                        getLeyendConfig: function () {
                            return {
                                autoWidth: true,
                                autoHeight: true,
                                tpl: new Ext.XTemplate(
                                    '<div class="leyend-block">',
                                    '<ul>',
                                    '<li style="color:red;">' + this.idioma.lbCriticosPorCobertura + '</li>',
                                    '<li style="color:green;"> ' + this.idioma.lbCriticosPorConsumo + '</li>',
                                    '</ul>',
                                    '</div>'
                                )
                            };
                        },
                        postSalvar: function (r) {
                            var _scope = GridClientes._parent;
                            _scope.cargarProductos();
                            if (_scope.record == null) {
                                _scope.record = {};
                                Ext.apply(_scope.record, {
                                    data: {
                                        iddocumento: r.iddocumento,
                                        nrodoc: r.nro,
                                        numeroref: r.numeroref,
                                        fechacontable: r.fecha,
                                        tipodestino: r.tipodestino,
                                        tipodistribucion: r.tipodistribucion,
                                        estado: "1",
                                        cant_clientes: r.cantclientes,
                                        cant_productos: 0
                                    }
                                });

                            } else {
                                _scope.record.data.estado = "1";
                                _scope.record.data.cant_clientes = r.cantclientes;
                            }
                            _scope.getTitleDocumento(_scope.record.data.iddocumento);
                            _scope.listaBotonesVentana.each(function (b) {
                                LOG.util.UIManager.applyKey(b, _scope);
                                if (typeof b.controlFn == 'function') {
                                    b.controlFn.createDelegate(_scope, [b, _scope]).call();
                                }
                            }, _scope);

                            _scope.modelo.getStore().reload();
                        }
                    });
                    LOG.util.UIManager.apply(tap.listaBotones.getItem(2), {
                        disabled: true
                    });
                    this.tapPanel.listaPlantillas.each(function (_p, _index) {
                        LOG.util.UIManager.encadenaFn(_p.getSmPrincipal(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() > 0) {
                                    tap.listaBotones.getItem(2).enable();
                                } else {
                                    tap.listaBotones.getItem(2).disable();
                                }
                            }
                        }, 'selectionarDoc');
                    });
                    tap.show();

                } else if (_this.modelo.tipodistribucion == 2) {
                    var _pedidos = new LOG.dist.distribucion.VentanaPedidos({
                        idioma: _this.idioma,
                        _parent: _this,
                        parametros: {
                            idseleccionados: Ext.encode(_this.winGestionarDocumento.stGridDetalles.collect('idpedido'))
                        }
                    });
                    _pedidos.init();
                    _this.vistaPedidos = _pedidos.view();
                    _this.vistaPedidos.show();
                } else if (_this.modelo.tipodistribucion == 4) {
                    var SolicitudPrestamo = new LOG.dist.distribucion.GridSolicitudes({
                        idioma: _this.idioma,
                        title: _this.idioma.tlTabPanelSolicitudPrestamo,
                        id: 'idprestamos',
                        idComponent: 0
                    });
                    var SolicitudCambioUbic = new LOG.dist.distribucion.GridSolicitudes({
                        idioma: _this.idioma,
                        id: 'idcambioubic',
                        title: _this.idioma.tlTabPanelSolicitudCambioUbicacion,
                        idComponent: 1
                    });
                    var SolicitudCambioSurtido = new LOG.dist.distribucion.GridSolicitudes({
                        idioma: _this.idioma,
                        id: 'idcambiosurtido',
                        title: _this.idioma.tlTabPanelSolicitudCambioSurtido,
                        idComponent: 2
                    });
                    var SolicitudLiberacion = new LOG.dist.distribucion.GridSolicitudes({
                        idioma: _this.idioma,
                        id: 'idliberacion',
                        title: _this.idioma.tlTabPanelSolicitudLiberacion,
                        idComponent: 3
                    });
                    _this.panelSolicitudes = new LOG.util.UITabTemplate({idioma: _this.idioma/*, formaVisualizacion: 'ventana'*/});
                    _this.panelSolicitudes.addTabToTemplete(SolicitudPrestamo);
                    _this.panelSolicitudes.addTabToTemplete(SolicitudCambioUbic);
                    _this.panelSolicitudes.addTabToTemplete(SolicitudCambioSurtido);
                    _this.panelSolicitudes.addTabToTemplete(SolicitudLiberacion);

                    _this.panelSolicitudes.init();

                    var _parent = _this.winGestionarDocumento;
                    var model = _this.modelo;

                    var winAddDocumentos = _this.panelSolicitudes.view({
                        title: _this.idioma.tlVentanaSolicitudes,
                        width: 850,
                        height: 550,
                        usarAplicar: false,
                        aceptarFn: function () {
                            var _scope = this;
                            var _documentos = new Array();
                            var _inversa = new Array();

                            //var _clientes = new Array();
                            /*
                             * Tipo 1: Solicitud de prestamo
                             * Tipo 2: Solicitud de cambio ubicacion
                             * Tipo 3: Solicitud de cambio surtido
                             * Tipo 4: Solicitud de liberacion
                             * */
                            var tipo = _this.panelSolicitudes.getSelectedTabIndex() + 1;
                            var seleccionados = _this.panelSolicitudes.getTemplateByIndex(_this.panelSolicitudes.getSelectedTabIndex()).getGridPrincipal().getSelectionModel().getSelections();

                            //var seleccionados = SolicitudPrestamo.getSmPrincipal().getSelections();
                            Ext.each(seleccionados, function (rec) {
                                _documentos.push(
                                    rec.get('iddocumento')
                                );
                                _inversa.push((rec.json.inversa) ? rec.json.inversa : 0);
                            });
                            _parent.modelo.salvar({
                                    documentos: Ext.encode(_documentos),
                                    tipo: tipo,
                                    inversa: Ext.encode(_inversa)
                                },
                                function (resp) {
                                    _scope.postSalvar.createDelegate(_scope, [resp]).call();
                                },
                                function (resp) {
                                    _scope.fnFail.createDelegate(_scope, [resp]).call();
                                }
                            )
                        },
                        postSalvar: function (r) {
                            var _scope = _parent;
                            _scope.cargarProductos();
                            if (_scope.record == null) {
                                _scope.record = {};
                                Ext.apply(_scope.record, {
                                    data: {
                                        iddocumento: r.iddocumento,
                                        nrodoc: r.nro,
                                        numeroref: r.numeroref,
                                        fechacontable: r.fecha,
                                        tipodestino: r.tipodestino,
                                        tipodistribucion: r.tipodistribucion,
                                        estado: "1",
                                        cant_clientes: r.cantclientes,
                                        cant_productos: 0
                                    }
                                });
                            } else {
                                _scope.record.data.estado = "1";
                                _scope.record.data.cant_clientes = r.cantclientes;
                            }
                            _scope.getTitleDocumento(_scope.record.data.iddocumento);
                            _scope.listaBotonesVentana.each(function (b) {
                                LOG.util.UIManager.applyKey(b, _scope);
                                if (typeof b.controlFn == 'function') {
                                    b.controlFn.createDelegate(_scope, [b, _scope]).call();
                                }
                            }, _scope);

                            _scope.modelo.getStore().reload();
                        },
                        fnFail: function (r) {
                            var _scope = _parent;
                            if (r.destino == 3) {
                                _scope.close();
                                //_this.postSalvar(r);
                                mostrarMensaje(1, _scope.idioma.msgNoSeAdicionoDocumento);
                            }
                        }

                    });
                    LOG.util.UIManager.apply(winAddDocumentos.listaBotones.getItem(2), {
                        disabled: true
                    });
                    _this.panelSolicitudes.listaPlantillas.each(function (_p, _index) {
                        LOG.util.UIManager.encadenaFn(_p.getSmPrincipal(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() > 0) {
                                    winAddDocumentos.listaBotones.getItem(2).enable();
                                } else {
                                    winAddDocumentos.listaBotones.getItem(2).disable();
                                }
                            }
                        }, 'selectionarDoc');
                    });
                    winAddDocumentos.show();

                    _this.panelSolicitudes.on({
                        'tabchange': function (p) {
                            p.getTemplateByIndex(p.getSelectedTabIndex()).getGridPrincipal().getSelectionModel().clearSelections();
                            winAddDocumentos.listaBotones.arrayData[2].disable();
                        }
                    });

                } else {
                    return;
                }
            },
            controlFn: function (b, _caller) {
				  b.disable();
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        _caller.smGridDetalles.fireEvent = _caller.smGridDetalles.fireEvent.createSequence(function (e) {
                            if (e == 'rowselect') {
                                if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1' && _this.winGestionarDocumento.record.data.tipodestino != 3) {
                                    b.enable();
                                }
                            }
                        });

                        if ((!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == 1)) && _this.cmbDestino.getValue() != 3) {
                            b.enable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }), 0);

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesProductos.getItem(1), {
            disabled: true,
            handler: function () {
                var idclientes = new Array();
                var iddocumentoclientes = new Array();
                var idpedido = new Array();

                Ext.each(_this.winGestionarDocumento.smGridDetalles.getSelections(), function (rec) {
                    if (rec.data.idpedido) {
                        idpedido.push(rec.data.idpedido);
                    }
                    if (rec.data.idcliente) {
                        idclientes.push(rec.data.idcliente);
                    }
                    if (rec.data.iddocumentocliente) {
                        iddocumentoclientes.push(rec.data.iddocumentocliente);
                    }
                });

                _this.modelo.eliminarDestinos({
                    idclientes: idclientes,
                    idpedido: idpedido,
                    iddocumentoclientes: iddocumentoclientes
                }/*, function () {
                 _this.winGestionarDocumento.stGridDetalles.reload();
                 }*/, function (resp) {
					 if (_this.winGestionarDocumento.record.data.tipodestino == 3) {
						 _this.cmbEntidad.setValue();
					 }
                    _this.postSalvar.createDelegate(_this, [resp]).call();
                });
            },
            controlFn: function (b, _caller) {
                b.disable();
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        _caller.smGridDetalles.fireEvent = _caller.smGridDetalles.fireEvent.createSequence(function (e) {
                            if (e == 'rowselect' && (!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1'))) {
                                b.enable();
                            }
                            if (e == 'rowdeselect') {
                                b.disable();
                            }
                        });
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });

        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnArriba,
            tooltip: this.idioma.ttBtnSubirPosicionCliente,
            iconCls: 'arriba',
            handler: function () {
                var rowSelected = _this.winGestionarDocumento.smGridDetalles.getSelections();
                var indexSelected = _this.winGestionarDocumento.stGridDetalles.indexOf(rowSelected[0]);
                if (indexSelected > 0) {
                    var prioridad = new Array();
                    _this.winGestionarDocumento.stGridDetalles.remove(rowSelected[0]);
                    _this.winGestionarDocumento.stGridDetalles.insert(indexSelected - 1, rowSelected);
                    _this.winGestionarDocumento.smGridDetalles.selectRow(indexSelected - 1);
                    var allRecord = _this.winGestionarDocumento.stGridDetalles.getRange();
                    Ext.each(allRecord, function (rm, index) {
                        if (rm.data.prioridad != index) {
                            var param = {};
                            param['iddocumentocliente'] = rm.data.iddocumentocliente;
                            param['prioridad'] = index;
                            prioridad[index] = param;
                        }
                    });
                    if (prioridad) {
                        _this.modelo.ajustarPrioridad(prioridad, _this.winGestionarDocumento.stGridDetalles, function () {
                            _this.winGestionarDocumento.smGridDetalles.selectRow(indexSelected - 1);
                        });
                    }
                }
            },
            controlFn: function (b, _caller) {
                b.disable();
                if (_this.grantedAction('CT') || _this.grantedAction('RB')) {
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        if (_this.modelo.tipodistribucion == 1) {
                            b.show();
                        } else {
                            b.hide();
                        }
                        _caller.smGridDetalles.fireEvent = _caller.smGridDetalles.fireEvent.createSequence(function (e) {
                            var rowSelected = _this.winGestionarDocumento.smGridDetalles.getSelections();
                            var indexSelected = _this.winGestionarDocumento.stGridDetalles.indexOf(rowSelected[0]);
                            if (e == 'rowselect' && indexSelected > 0 && (!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1'))) {
                                b.enable();
                            }
                            if (e == 'rowdeselect') {
                                b.disable();
                            }
                        });
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }), 2);

        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnAbajo,
            tooltip: this.idioma.ttBtnBajarPosicionCliente,
            iconCls: 'abajo',
            handler: function () {
                var rowSelected = _this.winGestionarDocumento.smGridDetalles.getSelections();
                var indexSelected = _this.winGestionarDocumento.stGridDetalles.indexOf(rowSelected[0]);
                if (indexSelected < _this.winGestionarDocumento.stGridDetalles.getCount() - 1) {
                    var prioridad = new Array();
                    _this.winGestionarDocumento.stGridDetalles.remove(rowSelected[0]);
                    _this.winGestionarDocumento.smGridDetalles.clearSelections();
                    _this.winGestionarDocumento.stGridDetalles.insert(indexSelected + 1, rowSelected);
                    _this.winGestionarDocumento.smGridDetalles.selectRow(indexSelected + 1);
                    var allRecord = _this.winGestionarDocumento.stGridDetalles.getRange();
                    Ext.each(allRecord, function (rm, index) {
                        if (rm.data.prioridad != index) {
                            var param = {};
                            param['iddocumentocliente'] = rm.data.iddocumentocliente;
                            param['prioridad'] = index;
                            prioridad[index] = param;
                        }
                    });
                    if (prioridad) {
                        _this.modelo.ajustarPrioridad(prioridad, _this.winGestionarDocumento.stGridDetalles, function () {
                            _this.winGestionarDocumento.smGridDetalles.selectRow(indexSelected + 1);
                        });
                    }
                }
            },
            controlFn: function (b, _caller) {
                b.disable();
                if (_this.grantedAction('CT') || _this.grantedAction('RB')) {
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        if (_this.modelo.tipodistribucion == 1) {
                            b.show();
                        } else {
                            b.hide();
                        }
                        _caller.smGridDetalles.fireEvent = _caller.smGridDetalles.fireEvent.createSequence(function (e) {
                            var rowSelected = _this.winGestionarDocumento.smGridDetalles.getSelections();
                            var indexSelected = _this.winGestionarDocumento.stGridDetalles.indexOf(rowSelected[0]);

                            if (e == 'rowselect' && indexSelected < _this.winGestionarDocumento.stGridDetalles.getCount() - 1 && (!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1'))) {
                                b.enable();
                            }
                            if (e == 'rowdeselect') {
                                b.disable();
                            }
                        });
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }), 3);

        this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonAprobar({
            hidden: true,
            tooltip: this.idioma.ttBtnAprobar,
            disabled: true,
            handler: function () {
                var param = {};
                if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                    _this.modelo.aprobar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function () {
                        _this.winGestionarDocumento.close();
                    });
                }
                param['iddocumento'] = _this.winGestionarDocumento.record.data.iddocumento;
                if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '10') {
                    _this.modelo.anularestadodoc(param, function (resp) {
                        _this.winGestionarDocumento.record.data.estado = 3;
                        _this.getStorePrincipal().reload();
                        _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                        if (resp.eliminado) {
                            //_this.getVistaPrincipal().close();
                            _this.winGestionarDocumento.close();
                        }
                    });
                }


            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.show();
                        if (_this.winGestionarDocumento.record && (_this.winGestionarDocumento.record.data.estado == '2' || _this.winGestionarDocumento.record.data.estado == '10')) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    } else {
                        b.hide();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonAnularEstado({
            hidden: true,
            tooltip: this.idioma.ttBtnAnular,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado') || _this.grantedAction('RAnular')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    } else {
                        b.hide();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
    },
    panelSuperior: function () {
        var _this = this;

        this.cmbConcepto = new Ext.erp.comboNomenclador({
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomConcepto',
            idnom: 'idnomconcepto',
            name: 'denominacion',
            autoCargar: true,
            fieldLabel: this.idioma.cmbConcepto,
            emptyText: this.idioma.lbSeleccione,
            forceSelection: true
        });

        this.cmbEntidad = new LOG.util.SelectorTF({
            width: 350,
            fieldLabel : this.idioma.cmbEntidad,
            title :this.idioma.tlVentanaEntidades,
            url : 'cargarEntidades',
            controller : '',
            valueField : 'idestructura',
            displayField : 'denominacion',
            hiddenName : 'entidaddestino',
            columns : [
                {
                    header : _this.idioma.cgEntidadCodigo,
                    dataIndex : 'codigo',
                    width : 120
                },{
                    header : _this.idioma.cgEntidadDenom,
                    dataIndex : 'denominacion',
                    width : 250,
                    autoExpand : true
                }
            ],
            listeners: {
                select: function (cmb) {
                    var _deposito = new Array();
                    if (_this.cmbEntidad.getValue() != idEntidad && ADD_DESTINO_DIST == false)  {
                        _this.winGestionarDocumento.listaBotonesProductos.getItem(0).disable();
                        _deposito.push({
                            idcliente: _this.cmbEntidad.getValue(),
                            idestructura: _this.cmbEntidad.getValue(),
                            tipocliente: 3
                        });

                        if (_this.modelo.iddocumento == null) {
                            _this.modelo.salvar({
                                idcliente: Ext.encode(_deposito)
                            }, function (r) {
                                _this.winGestionarDocumento.cargarProductos();
                                if (_this.winGestionarDocumento && _this.winGestionarDocumento.record == null) {
                                    _this.winGestionarDocumento.record = {};
                                    Ext.apply(_this.winGestionarDocumento.record, {
                                        data: {
                                            iddocumento: r.iddocumento,
                                            nrodoc: r.nro,
                                            numeroref: r.numeroref,
                                            fechacontable: r.fecha,
                                            tipodestino: r.tipodestino,
                                            tipodistribucion: r.tipodistribucion,
                                            estado: "1",
                                            cant_clientes: r.cantclientes,
                                            cant_productos: 0
                                        }
                                    });
                                } else {
                                    _this.winGestionarDocumento.record.data.estado = "1";
                                    _this.winGestionarDocumento.record.data.cant_clientes = r.cantclientes;
                                }
                                _this.winGestionarDocumento.getTitleDocumento(r.iddocumento);
                                _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                                    LOG.util.UIManager.applyKey(b, _this);
                                    if (typeof b.controlFn == 'function') {
                                        b.controlFn.createDelegate(_this, [b, _this]).call();
                                    }
                                }, _this);
                            });
                        } else {
                            _this.modelo.adicionarDestinos({
                                idcliente: Ext.encode(_deposito),
                                addproductos: 1,
                                iddocumento: _this.modelo.iddocumento
                            }, function (r) {
                                _this.winGestionarDocumento.cargarProductos();
                                if (_this.winGestionarDocumento && _this.winGestionarDocumento.record == null) {
                                    _this.winGestionarDocumento.record = {};
                                    Ext.apply(_this.winGestionarDocumento.record, {
                                        data: {
                                            iddocumento: r.iddocumento,
                                            nrodoc: r.nro,
                                            numeroref: r.numeroref,
                                            fechacontable: r.fecha,
                                            tipodestino: r.tipodestino,
                                            tipodistribucion: r.tipodistribucion,
                                            estado: "1",
                                            cant_clientes: r.cantclientes,
                                            cant_productos: 0
                                        }
                                    });
                                } else {
                                    _this.winGestionarDocumento.record.data.estado = "1";
                                    _this.winGestionarDocumento.record.data.cant_clientes = r.cantclientes;
                                }
                                _this.winGestionarDocumento.getTitleDocumento(r.iddocumento);
                                _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                                    LOG.util.UIManager.applyKey(b, _this);
                                    if (typeof b.controlFn == 'function') {
                                        b.controlFn.createDelegate(_this, [b, _this]).call();
                                    }
                                }, _this);
                            });
                        }
                    } else  {
                        _this.winGestionarDocumento.listaBotonesProductos.getItem(0).enable();
                    }
                }
            }
        });

        this.dataFieldDestino = [[1, this.idioma.lbDestinoCliente],
            [2, this.idioma.lbDestinoCentroCosto],
            [3, this.idioma.lbDestinoDeposito]];

        if (this.grantedAction('areaResponsabilidad')) {
            this.dataFieldDestino.push([4, this.idioma.lbDestinoAreaResponsabilidad]);
        }

        this.cmbDestino = new LOG.util.ComboBox({
            fieldLabel: this.idioma.cmbDestino,
            store: new Ext.data.SimpleStore({
                fields: ['tipodestino', 'destino'],
                data: this.dataFieldDestino
            }),
            hiddenName: 'tipodestino',
            valueField: 'tipodestino',
            displayField: 'destino',
            editable: false,
            emptyText: this.idioma.lbSeleccione,
            allowBlank: false,
            listeners: {
                select: function (_cmbDestino, r, i) {
                    if (_cmbDestino.value == 1) {
						_this.winGestionarDocumento.listaBotonesProductos.getItem(0).enable();
                        _this.cmbEntidad.hide();
                        _this.panelCheck.show();
                        _this.checkSalidaFactura.enable();
                        if (typeof esminfar !== 'undefined' && esminfar) {
                            _this.checkSalidaFactura.setValue(0);
                        } else {
                            _this.checkSalidaFactura.setValue(1);
                        }
                    } else if (_cmbDestino.value == 2) {
						_this.winGestionarDocumento.listaBotonesProductos.getItem(0).enable();
                        _this.cmbEntidad.hide();
                        _this.panelCheck.show();
                        _this.checkSalidaFactura.disable();
                        _this.checkSalidaFactura.setValue(0);
                    } else if (_cmbDestino.value == 4) {
                        _this.winGestionarDocumento.listaBotonesProductos.getItem(0).enable();
                        _this.cmbEntidad.hide();
                        _this.panelCheck.show();
                        _this.checkSalidaFactura.disable();
                    } else {
                        _this.panelCheck.hide();
                        _this.cmbEntidad.show();
                    }
                }
            }
        });

        this.taObservaciones = new Ext.form.TextArea({
            fieldLabel: this.idioma.taObservaciones,
            name: 'observaciones',
            maxLength: 255,
            maxLengthText: this.idioma.msgMaxLengthText,
            tabular: true,
            width: '98%'
        });

        this.checkSalidaFactura = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbCbxSalidaFactura,
            name: 'salidaporfactura',
            style: 'margin:25px 0px 0px 15px',
            height: 40,
            disabled: true
        });

        this.cls = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });

        this.cls.addComponent(this.cmbConcepto);

        this.cls.addComponent(this.cmbDestino);

        this.cls.addComponent(this.cmbEntidad);

        this.panelCheck = LOG.util.UIManager.initPanel({
            title: '',
            region: 'center',
            labelAlign: 'left',
            layout: 'column',
            height: 40,
            items: [this.checkSalidaFactura]
        });

        this.cls.addComponent(this.panelCheck)
        this.cls.getColumn(3).columnWidth = 0.20;

        this.formularioGeneral = LOG.util.UIManager.initPanel({
            layout: 'form',
            labelAlign: 'top',
            items: [this.cls, this.taObservaciones]
        });
    },
    habilitarElementosWindow: function () {
        if (this.winGestionarDocumento.tipoVentana == 3) {
            this.winGestionarDocumento.panelSuperior.findByType('combo')[0].setDisabled(true);
            this.winGestionarDocumento.panelSuperior.findByType('combo')[1].setDisabled(true);
            this.winGestionarDocumento.panelSuperior.findByType('combo')[2].setDisabled(true);
            this.winGestionarDocumento.panelSuperior.findByType('checkbox')[0].setDisabled(true);
            this.winGestionarDocumento.panelSuperior.findByType('checkbox')[1].setDisabled(true);
            this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(true);
            this.winGestionarDocumento.doLayout();
            this.winGestionarDocumento.buttons[1].hide();
            this.winGestionarDocumento.buttons[2].hide();
        } else {
            this.winGestionarDocumento.doLayout();
            if (this.winGestionarDocumento.record) {
                if (this.winGestionarDocumento.record.data.estado == 1) {
                    this.winGestionarDocumento.panelSuperior.findByType('combo')[0].setDisabled(false);
                    this.winGestionarDocumento.panelSuperior.findByType('combo')[1].setDisabled(false);
                    this.winGestionarDocumento.panelSuperior.findByType('combo')[2].setDisabled(false);
                    this.winGestionarDocumento.panelSuperior.findByType('checkbox')[0].setDisabled(false);
                    this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(false);
                    this.winGestionarDocumento.buttons[2].show();
                } else {
                    this.winGestionarDocumento.panelSuperior.findByType('combo')[0].setDisabled(true);
                    this.winGestionarDocumento.panelSuperior.findByType('combo')[1].setDisabled(true);
                    this.winGestionarDocumento.panelSuperior.findByType('combo')[2].setDisabled(true);
                    this.winGestionarDocumento.panelSuperior.findByType('checkbox')[0].setDisabled(true);
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
                this.winGestionarDocumento.setTitle(this.idioma.tlVentanaAdicionarDistribucion);
                this.winGestionarDocumento.panelSuperior.findByType('combo')[0].setDisabled(false);
                this.winGestionarDocumento.panelSuperior.findByType('combo')[1].setDisabled(false);
                this.winGestionarDocumento.panelSuperior.findByType('combo')[2].setDisabled(false);
                this.winGestionarDocumento.panelSuperior.findByType('checkbox')[0].setDisabled(false);
                this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(false);
                this.winGestionarDocumento.buttons[1].show();
                this.winGestionarDocumento.buttons[2].show();
            }
        }
    },
    desabilitarElements: function (opcion) {
        var _this = this;

        LOG.util.UIManager.apply(this.winGestionarDocumento.cmGridDetalles.setColumnHeader(1, (opcion == 2) ? _this.idioma.cgNroPedido : _this.idioma.cgCodigo));
        LOG.util.UIManager.apply(this.winGestionarDocumento.cmGridDetalles.setColumnHeader(2, (opcion == 2) ? _this.idioma.cgCliente : _this.idioma.cgDenominacion));

        LOG.util.UIManager.apply(this.winGestionarDocumento.cmGridDetalles.setHidden(6, (opcion == 2) ? false : true));
        LOG.util.UIManager.apply(this.winGestionarDocumento.cmGridDetalles.setHidden(5, (opcion == 2) ? false : true));
        LOG.util.UIManager.apply(this.winGestionarDocumento.cmGridDetalles.setHidden(4, (opcion == 2) ? false : true));
        LOG.util.UIManager.apply(this.winGestionarDocumento.cmGridDetalles.setHidden(3, (opcion == 2) ? false : true));

        if (opcion == 1 || opcion == 4) {
            this.cls.getColumn(0).columnWidth = '1';
            this.cls.getColumn(1).items.items[0].disable();
            this.cls.getColumn(1).hide();
            this.cls.getColumn(2).hide();
        } else if (opcion == 2) {
            this.cls.getColumn(0).columnWidth = '0.66';
            this.cls.getColumn(1).items.items[0].disable();
            this.cls.getColumn(2).show();
            this.cls.getColumn(1).hide();
        } else {
            this.cls.getColumn(3).columnWidth = '0.33';
            this.cls.getColumn(2).columnWidth = '0.33';
            this.cls.getColumn(1).columnWidth = '0.33';
            this.cls.getColumn(0).columnWidth = '0.33';
            this.cls.getColumn(1).items.items[0].enable();
            this.cls.getColumn(2).show();
            this.cls.getColumn(1).show();
        }
        this.winGestionarDocumento.doLayout();
    },
    getParamsReport: function (record,btn) {
        var _this = this;
        return btn.isList ? {
            tipodocumento: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[4].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[4].getValue() : null,
            creadopor: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
            aprobadopor: (_this.panelBusquedaAvanzada.findByType('combo')[5].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[5].getValue() : null,
            entregar: (_this.panelBusquedaAvanzada.findByType('combo')[7].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[7].getValue() : null,
            destino: (_this.panelBusquedaAvanzada.findByType('combo')[6].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[6].getValue() : null,
            estadoejecucion: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
            fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d-m-Y') : null,
            fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d-m-Y') : null
        } : {
            monedacontable: window.monedacontable || window.idcontable,
            monedaalternativa: window.monedaalternativa || window.idalternativa,
            useSign: this.useSign,
            hasCategoria: (usarCategoria) ? 'true' : 'false',
            hasFactura: (record.get("salidaporfactura") == "1") ? 'true' : 'false',
            iddocumento: record.get("iddocumento") || null,
            hasActivo: (record.get("salidaporactivo") == "1") ? 'true' : 'false'
        };
    },
    postSalvar: function (r) {
        var _scope = this.winGestionarDocumento;
        _scope.cargarProductos();

        _scope.record.data.estado = "1";
        _scope.record.data.cant_clientes = r.cantclientes;
        _scope.record.data.cant_productos = r.cantproductos;

        _scope.getTitleDocumento(_scope.record.data.iddocumento);
        _scope.listaBotonesVentana.each(function (b) {
            LOG.util.UIManager.applyKey(b, _scope);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_scope, [b, _scope]).call();
            }
        }, _scope);

        _scope.modelo.getStore().reload();
    }
});

LOG.dist.distribucion.GridClientesCriticos = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.urlBusquedaGridPrincipal = 'cargarClientesCriticos';
        this.autoLoad = true;
        this.concepto = 'clientes cr\xedticos'
        //this.textBusquedaSimple = config.idioma.lbCampoBusquedaSimple;
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 3;
        this.dirController = '/logistica/distribucion/distribucion/index.php/distribucion';
        this.busquedaBasica = true;
        LOG.dist.distribucion.GridClientesCriticos.superclass.constructor.call(this, config);
    },
    init: function () {
        LOG.dist.distribucion.GridClientesCriticos.superclass.init.call(this);
    },
    render: function () {
        var _this = this;
        var _res = LOG.dist.distribucion.GridClientesCriticos.superclass.render.call(this);

        this.leyenda = new LOG.lb.plugin.Leyenda({
            leyendAlign: 'bot-left',
            leyendContainer: this.getVistaPrincipal(),
            leyendConfig: this.getLeyendConfig(),
            handler: function () {
            },
            controlFn: function (b, _caller) {
            }
        });
        this.getGridPrincipal().getBottomToolbar().insert(
            this.getGridPrincipal().getBottomToolbar().items.length - 1, this.leyenda
        );
        if (this.leyenda) {
            this.getGridPrincipal().getBottomToolbar().insert(
                this.getGridPrincipal().getBottomToolbar().items.length - 1, '-'
            );
        }

        return _res;
    },
    initDefaultButtons: function () {
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: this.idioma.cgCliente,
            dataIndex: 'nombre',
            width: 320,
            default: true,
            hidden: true,
            agrupador: true
        });

        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true
        });

        this.addGridColumn({
            header: this.idioma.cgExistencia,
            dataIndex: 'existencia',
            width: 80,
            align: 'right',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgExtenciaTR,
            dataIndex: 'existenciatr',
            width: 120,
            align: 'right',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgCantidadD,
            dataIndex: 'cantdias',
            width: 80,
            align: 'right',
            default: true
        });

        this.listaColumnas.each(function (c) {
            c.renderer = _this.cambiarColorFilaCliente;
        });

        this.addGridColumn({dataIndex: 'idcliente'});

        this.addGridColumn({dataIndex: 'porcobertura'});

        this.addGridColumn({dataIndex: 'porconsumo'});
    },
    getLeyendConfig: function () {
        return {
            autoWidth: true,
            autoHeight: true,
            tpl: new Ext.XTemplate(
                '<div class="leyend-block">',
                '<ul>',
                '<li style="color:red;">' + this.idioma.lbCriticosPorCobertura + '</li>',
                '<li style="color:green;"> ' + this.idioma.lbCriticosPorConsumo + '</li>',
                '</ul>',
                '</div>'
            )
        };
    },
    cambiarColorFilaCliente: function (valor, celda, record) {
        if (record.data.porconsumo == 1)
            return '<span style="color:red;">' + valor + '</span>';
        else if (record.data.porcobertura == 1)
            return '<span style="color:#1f8017;">' + valor + '</span>';
        else
            return '<span style="color:black;">' + valor + '</span>';
    }
});

LOG.dist.distribucion.GridClientes = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.urlBusquedaGridPrincipal = 'cargarClientes';
        this.autoLoad = false;
        this.autoSelect = false;
        this.parametros = config.parametros;
        this.concepto = 'clientes';
        //this.textBusquedaSimple = config.idioma.lbCampoBusquedaSimple;
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 3;
        this.dirController = '/logistica/distribucion/distribucion/index.php/distribucion';
        this.busquedaBasica = true;
        LOG.dist.distribucion.GridClientes.superclass.constructor.call(this, config);
    },
    init: function () {
        var _this = this;
        LOG.dist.distribucion.GridClientes.superclass.init.call(this);
    },
    render: function (config) {
        var _this = this;
        var _res = LOG.dist.distribucion.GridClientes.superclass.render.call(this);
        LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);
        this.getStorePrincipal().load();
        return _res;
    },
    initDefaultButtons: function () {
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: this.idioma.cgCodigo,
            dataIndex: 'codigo',
            width: 120,
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'nombre',
            default: true,
            autoExpand: true
        });

        this.addGridColumn({dataIndex: 'idclientesproveedores'});
    }
});

LOG.dist.distribucion.Clientes = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        //this.textBusquedaSimple = config.idioma.lbCampoBusquedaSimple;
        this.modoSeleccion = 3;
        this.busquedaBasica = true;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        this.concepto = 'clientes';
        this.urlBusquedaGridPrincipal = 'cargarClientes';
        this.dirController = '/logistica/distribucion/distribucion/index.php/distribucion';
        config.idioma = LOG.dist.distribucion.Idioma;
        this.modelo = new LOG.dist.distribucion.Model({
            idioma: config.idioma
        });
        LOG.dist.distribucion.Clientes.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            autoExpand: true,
            dataIndex: (_this._parent.modelo.tipodistribucion == 2) ? 'cliente' : 'nombre',
            default: true
        });

        this.addGridColumn({dataIndex: 'idclientesproveedores'});

        this.addGridColumn({dataIndex: 'idcliente'});
    },
    init: function () {
        var _this = this;
        LOG.dist.distribucion.Clientes.superclass.init.call(this);
        this.getVistaPrincipal().setTitle(this.idioma.tlVentanaClientes);
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().resizable = false;
        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
            onShow: function () {
                LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);
                _this.onShowHandler();
            },
            aceptarFn: function (aplicar) {
                if (typeof _this.doAction == 'function') {
                    if (!_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                        mostrarMensaje(1, _this.idioma.msgSelectClienteGenerar);
                        return;
                    }
                    _this.doAction.createDelegate(_this, [_this.getGridPrincipal().getSelectionModel().getSelections(), aplicar]).call();
                }
            }
        });

        this.panelGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            title: this.idioma.tlPanelClientes
        });
    },
    render: function () {
        var _this = this;
        var _res = LOG.dist.distribucion.Clientes.superclass.render.call(this);
        this.getGridPrincipal().getSelectionModel().fireEvent = this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange' && _this.formaVisualizacion == 'ventana') {
                _this.habilitarBotones();
            }
        });
        return _res;
    },
    habilitarBotones: function () {
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
            this.getVistaPrincipal().listaBotones.getItem(1).enable();
            this.getVistaPrincipal().listaBotones.getItem(2).enable();
        }
    },
    onShowHandler: function () {
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, this.parametros);
        this.getStorePrincipal().reload();
    }
});

LOG.dist.distribucion.VentanaClientes = Ext.extend(LOG.dist.distribucion.Clientes, {
    _parent: undefined,
    constructor: function (config) {
        LOG.dist.distribucion.VentanaClientes.superclass.constructor.call(this, config);
        this.autoLoad = false;
    },
    doAction: function (r, aplicar) {
        var _this = this;
        if (_this._parent != undefined) {
            var _clientes = new Array();
            var _idseleccionados = [];
            Ext.each(r, function (rec) {
                _clientes.push({
                    idcliente: rec.get('idclientesproveedores'),
                    tipocliente: 1
                });
                _idseleccionados.push(rec.get('idclientesproveedores'));
            });

            if (_this._parent.modelo.iddocumento == null) {
                _this._parent.modelo.salvar({
                    idcliente: Ext.encode(_clientes)
                }, function (resp) {
                    resp.destinos = 0;
                    _this.postSalvar.createDelegate(_this, [resp, aplicar, _idseleccionados]).call();
                });
            } else {
                _this._parent.modelo.adicionarDestinos({
                    idcliente: Ext.encode(_clientes),
                    addproductos: 1,
                    iddocumento: _this._parent.modelo.iddocumento
                }, function (resp) {
                    resp.destinos = 1;
                    _this.postSalvar.createDelegate(_this, [resp, aplicar, _idseleccionados]).call();
                });
            }
        }
    },
    postSalvar: function (r, a, _idselecc) {
        var _this = this;
        var _scope = this._parent.winGestionarDocumento;
        _scope.cargarProductos();

        if (_scope.record == null) {
            _scope.record = {};
            Ext.apply(_scope.record, {
                data: {
                    iddocumento: r.iddocumento,
                    nrodoc: r.nro,
                    numeroref: r.numeroref,
                    fechacontable: r.fecha,
                    tipodestino: r.tipodestino,
                    tipodistribucion: r.tipodistribucion,
                    estado: "1",
                    cant_clientes: r.cantclientes,
                    cant_productos: (r.destinos == 1) ? r.cantproductos : 0
                }
            });
        } else {
            _scope.record.data.estado = "1";
            _scope.record.data.cant_clientes = r.cantclientes;
        }
        _scope.getTitleDocumento(_scope.record.data.iddocumento);
        _scope.listaBotonesVentana.each(function (b) {
            LOG.util.UIManager.applyKey(b, _scope);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_scope, [b, _scope]).call();
            }
        }, _scope);
        if (a) {
            _this.storePrincipal.reload(
                _this.storePrincipal.initBaseParams.listaClientes = Ext.encode(Ext.decode(_this.storePrincipal.initBaseParams.listaClientes).concat(_idselecc)),
                _this.storePrincipal.baseParams.listaClientes = Ext.encode(Ext.decode(_this.storePrincipal.baseParams.listaClientes).concat(_idselecc))
            );
        }
        _scope.modelo.getStore().reload();
    }
});


LOG.dist.distribucion.CentrosCosto = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.busquedaBasica = true;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        this.concepto = 'centros de costo';
        this.textBusquedaSimple = config.idioma.lbCampoBusquedaCentroCostos;
        this.urlBusquedaGridPrincipal = 'cargarCentrosCosto';
        this.dirController = '/logistica/distribucion/distribucion/index.php/distribucion';
        config.idioma = LOG.dist.distribucion.Idioma;
        this.modelo = new LOG.dist.distribucion.Model({
            idioma: config.idioma
        });
        LOG.dist.distribucion.CentrosCosto.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'concat',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'descripcioncentrogrupo',
            default: true,
            autoExpand: true
        });

        this.addGridColumn({dataIndex: 'idcentrogrupo'});
    },
    init: function () {
        var _this = this;
        LOG.dist.distribucion.CentrosCosto.superclass.init.call(this);
        this.getVistaPrincipal().setTitle(this.idioma.tlVentanaCentrosCosto);
        //this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().resizable = false;
        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
            onShow: function () {
                LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);
                _this.onShowHandler();
            },
            aceptarFn: function (aplicar) {
                if (typeof _this.doAction == 'function') {
                    if (!_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                        mostrarMensaje(1, _this.idioma.msgSelectCentroCostoGenerar);
                        return;
                    }
                    _this.doAction.createDelegate(_this, [_this.getGridPrincipal().getSelectionModel().getSelections(), aplicar]).call();
                }
            }
        });
        this.panelGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            title: this.idioma.tlPanelCentrosCosto
        });
    },
    render: function () {
        var _this = this;
        var _res = LOG.dist.distribucion.CentrosCosto.superclass.render.call(this);
        this.getGridPrincipal().getSelectionModel().fireEvent = this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange' && _this.formaVisualizacion == 'ventana') {
                _this.habilitarBotones();
            }
        });
        return _res;
    },
    habilitarBotones: function () {
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
            this.getVistaPrincipal().listaBotones.getItem(1).enable();
            this.getVistaPrincipal().listaBotones.getItem(2).enable();
        }
    },
    onShowHandler: function () {
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, this.parametros);
        this.getStorePrincipal().reload();
    }
});

LOG.dist.distribucion.VentanaCentrosCosto = Ext.extend(LOG.dist.distribucion.CentrosCosto, {
    _parent: undefined,
    constructor: function (config) {
        LOG.dist.distribucion.VentanaCentrosCosto.superclass.constructor.call(this, config);
        this.autoLoad = false;
    },
    doAction: function (r, aplicar) {
        var _this = this;
        if (_this._parent != undefined) {
            var _centrocosto = new Array();
            var _idseleccionados = [];
            Ext.each(r, function (rec) {
                _centrocosto.push({
                    idcliente: rec.get('idcentrogrupo'),
                    tipocliente: 2
                });
                _idseleccionados.push(rec.get('idcentrogrupo'));
            });

            if (_this._parent.modelo.iddocumento == null) {
                _this._parent.modelo.salvar({
                    idcliente: Ext.encode(_centrocosto)
                }, function (resp) {
                    _this.postSalvar.createDelegate(_this, [resp, aplicar, _idseleccionados]).call();
                });
            } else {
                _this._parent.modelo.adicionarDestinos({
                    idcliente: Ext.encode(_centrocosto),
                    addproductos: 1,
                    iddocumento: _this._parent.modelo.iddocumento
                }, function (resp) {
                    _this.postSalvar.createDelegate(_this, [resp, aplicar, _idseleccionados]).call();
                });
            }
        }
    },
    postSalvar: function (r, a, _idselecc) {
        var _this = this;
        var _scope = this._parent.winGestionarDocumento;
        _scope.cargarProductos();
        if (_scope.record == null) {
            _scope.record = {};
            Ext.apply(_scope.record, {
                data: {
                    iddocumento: r.iddocumento,
                    nrodoc: r.nro,
                    numeroref: r.numeroref,
                    fechacontable: r.fecha,
                    tipodestino: r.tipodestino,
                    tipodistribucion: r.tipodistribucion,
                    estado: "1",
                    cant_clientes: r.cantclientes,
                    cant_productos: 0
                }
            });

        } else {
            _scope.record.data.estado = "1";
            _scope.record.data.cant_clientes = r.cantclientes;
        }
        _scope.getTitleDocumento(_scope.record.data.iddocumento);
        _scope.listaBotonesVentana.each(function (b) {
            LOG.util.UIManager.applyKey(b, _scope);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_scope, [b, _scope]).call();
            }
        }, _scope);
        if (a) {
            _this.storePrincipal.reload(
                _this.storePrincipal.initBaseParams.idseleccionados = Ext.encode(Ext.decode(_this.storePrincipal.initBaseParams.idseleccionados).concat(_idselecc)),
                _this.storePrincipal.baseParams.idseleccionados = Ext.encode(Ext.decode(_this.storePrincipal.baseParams.idseleccionados).concat(_idselecc))
            );
        }
        _scope.modelo.getStore().reload();
    }
});


LOG.dist.distribucion.Depositos = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.busquedaBasica = true;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        this.concepto = 'dep\xf3sitos';
        this.textBusquedaSimple = config.idioma.lbCampoBusquedaDepositos;
        this.urlBusquedaGridPrincipal = 'cargarEstructuras';
        this.dirController = '/logistica/distribucion/distribucion/index.php/distribucion';
        config.idioma = LOG.dist.distribucion.Idioma;
        this.modelo = new LOG.dist.distribucion.Model({
            idioma: config.idioma
        });
        LOG.dist.distribucion.Depositos.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'nombre',
            default: true,
            autoExpand: true
        });

        this.addGridColumn({dataIndex: 'idestructuraop'});
    },
    init: function () {
        var _this = this;
        LOG.dist.distribucion.Depositos.superclass.init.call(this);
        this.getVistaPrincipal().setTitle(this.idioma.tlVentanaDepositos);
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().resizable = false;
        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
            onShow: function () {
                LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);
                _this.onShowHandler();
            },
            aceptarFn: function (aplicar) {
                if (typeof _this.doAction == 'function') {
                    if (!_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                        mostrarMensaje(1, _this.idioma.msgSelectDepositoGenerar);
                        return;
                    }
                    _this.doAction.createDelegate(_this, [_this.getGridPrincipal().getSelectionModel().getSelections(), aplicar]).call();
                }
            }
        });

        /*this.cmbEntidad = new LOG.util.ComboBox({
         fieldLabel: this.idioma.cmbEntidad,
         url: 'cargarEntidades',
         hiddenName: 'id',
         valueField: 'id',
         displayField: 'text',
         editable: false,
         emptyText: this.idioma.lbSeleccione,
         allowBlank: false
         });

         this.cls = LOG.util.UIManager.initColumnForm({
         columnas: 2
         });

         this.cls.addComponent(this.cmbEntidad);

         this.panelSuperior = LOG.util.UIManager.initPanel({
         region: 'north',
         labelAlign: 'top',
         frame: true,
         layout: 'form',
         height: 60,
         items: [this.cls]
         });*/

        this.panelGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            title: this.idioma.tlPanelDepositos
        });

        /*this.getPanelGrid().onRender = this.getPanelGrid().onRender.createSequence(function () {
         this.getPanelGrid().add(this.panelSuperior);
         }, this);

         LOG.util.UIManager.encadenaFn(this.cmbEntidad, 'fireEvent', function(e, cb) {
         if (e == 'select') {
         _this.getSmPrincipal().clearSelections();
         _this.getStorePrincipal().load({
         params : {
         start : 0,
         identidad : cb.getValue()
         }
         });
         }
         });*/
    },
    render: function () {
        var _this = this;
        var _res = LOG.dist.distribucion.Depositos.superclass.render.call(this);
        this.getGridPrincipal().getSelectionModel().fireEvent = this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange' && _this.formaVisualizacion == 'ventana') {
                _this.habilitarBotones();
            }
        });
        return _res;
    },
    habilitarBotones: function () {
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
            this.getVistaPrincipal().listaBotones.getItem(1).enable();
            this.getVistaPrincipal().listaBotones.getItem(2).enable();
        }
    },
    onShowHandler: function () {
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, this.parametros);
        this.getStorePrincipal().reload();
    }
});

LOG.dist.distribucion.VentanaDepositos = Ext.extend(LOG.dist.distribucion.Depositos, {
    _parent: undefined,
    constructor: function (config) {
        LOG.dist.distribucion.VentanaDepositos.superclass.constructor.call(this, config);
        this.autoLoad = false;
    },
    doAction: function (r, aplicar) {
        var _this = this;
        var arrayEntidad = new Array();
        if (_this._parent != undefined) {
            var _depositos = new Array();
            var _idseleccionados = [];
            Ext.each(r, function (rec) {
                _depositos.push({
                    idcliente: rec.get('idestructuraop'),
                    idestructura: _this.parametros.identidad,
                    tipocliente: 3
                });
                _idseleccionados.push(rec.get('idestructuraop'));
            });

            if (_this._parent.modelo.iddocumento == null) {
                _this._parent.modelo.salvar({
                    idcliente: Ext.encode(_depositos)
                }, function (resp) {
                    _this.postSalvar.createDelegate(_this, [resp, aplicar, _idseleccionados]).call();
                });
            } else {
                _this._parent.modelo.adicionarDestinos({
                    idcliente: Ext.encode(_depositos),
                    addproductos: 1,
                    iddocumento: _this._parent.modelo.iddocumento
                }, function (resp) {
                    _this.postSalvar.createDelegate(_this, [resp, aplicar, _idseleccionados]).call();
                });
            }
        }
    },
    postSalvar: function (r, a, _idselecc) {
        var _this = this;
        var _scope = this._parent.winGestionarDocumento;
        _scope.cargarProductos();
        if (_scope.record == null) {
            _scope.record = {};
            Ext.apply(_scope.record, {
                data: {
                    iddocumento: r.iddocumento,
                    nrodoc: r.nro,
                    numeroref: r.numeroref,
                    fechacontable: r.fecha,
                    tipodestino: r.tipodestino,
                    tipodistribucion: r.tipodistribucion,
                    estado: "1",
                    cant_clientes: r.cantclientes,
                    cant_productos: 0
                }
            });

        } else {
            _scope.record.data.estado = "1";
            _scope.record.data.cant_clientes = r.cantclientes;
        }
        _scope.getTitleDocumento(_scope.record.data.iddocumento);
        _scope.listaBotonesVentana.each(function (b) {
            LOG.util.UIManager.applyKey(b, _scope);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_scope, [b, _scope]).call();
            }
        }, _scope);
        if (a) {
            _this.storePrincipal.reload(
                _this.storePrincipal.initBaseParams.idseleccionados = Ext.encode(Ext.decode(_this.storePrincipal.initBaseParams.idseleccionados).concat(_idselecc)),
                _this.storePrincipal.baseParams.idseleccionados = Ext.encode(Ext.decode(_this.storePrincipal.baseParams.idseleccionados).concat(_idselecc)),
                _this.storePrincipal.initBaseParams.identidad = _this._parent.cmbEntidad.getValue()
            );
        }
        _scope.modelo.getStore().reload();
    }
});


LOG.dist.distribucion.Pedidos = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.busquedaBasica = true;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        this.concepto = 'pedidos';
        this.parametros = {};
        //this.textBusquedaSimple = config.idioma.lbCampoBusquedaSimple;
        this.urlBusquedaGridPrincipal = 'cargarPedidos';
        this.dirController = '/logistica/distribucion/distribucion/index.php/distribucion';
        this.autoLoad = true;
        config.idioma = LOG.dist.distribucion.Idioma;
        this.modelo = new LOG.dist.distribucion.Model({
            idioma: config.idioma
        });
        LOG.dist.distribucion.Pedidos.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.cgNroPedido,
            width: 80,
            dataIndex: 'nrodoc',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgCliente,
            dataIndex: 'cliente',
            default: true,
            autoExpand: true
        });

        this.addGridColumn({
            header: this.idioma.cgFechaEmision,
            width: 100,
            dataIndex: 'fechacontable',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgFechaVencimiento,
            width: 120,
            dataIndex: 'fechavencimiento',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgCantReclamaciones,
            width: 130,
            dataIndex: 'reclamos',
            align: 'right',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgCantProductos,
            width: 100,
            dataIndex: 'productos',
            align: 'right',
            default: true
        });

        this.addGridColumn({dataIndex: 'iddocumento'});

        this.addGridColumn({dataIndex: 'idcliente'});
    },
    init: function () {
        var _this = this;
        LOG.dist.distribucion.Pedidos.superclass.init.call(this);
        this.getVistaPrincipal().setTitle(this.idioma.tlVentanaPedidos);
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        this.getVistaPrincipal().width = 900;
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().resizable = false;
        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
            onShow: function () {
                LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);
                _this.onShowHandler();
            },
            aceptarFn: function () {
                if (typeof _this.doAction == 'function') {
                    if (!_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                        mostrarMensaje(1, _this.idioma.msgSelectDepositoGenerar);
                        return;
                    }
                    _this.doAction.createDelegate(_this, [_this.getGridPrincipal().getSelectionModel().getSelections()]).call();
                }
            }
        });
    },
    render: function () {
        var _this = this;
        var _res = LOG.dist.distribucion.Pedidos.superclass.render.call(this);
        this.getGridPrincipal().getSelectionModel().fireEvent = this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange' && _this.formaVisualizacion == 'ventana') {
                _this.habilitarBotones();
            }
        });
        return _res;
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

LOG.dist.distribucion.VentanaPedidos = Ext.extend(LOG.dist.distribucion.Pedidos, {
    _parent: undefined,
    constructor: function (config) {
        LOG.dist.distribucion.VentanaPedidos.superclass.constructor.call(this, config);
        this.autoLoad = false;
    },
    doAction: function (r) {
        var _this = this;
        if (_this._parent != undefined) {
            var _pedidos = new Array();
            var _clientes = new Array();
            Ext.each(r, function (rec) {
                _clientes.push({
                    idcliente: rec.get('idcliente'),
                    tipocliente: 1
                });
                _pedidos.push({
                    idpedido: rec.get('iddocumento')
                });
            });

            if (_this._parent.modelo.iddocumento == null) {
                _this._parent.modelo.salvar({
                    idcliente: Ext.encode(_clientes),
                    idpedido: Ext.encode(_pedidos)
                }, function (resp) {
                    _this.postSalvar.createDelegate(_this, [resp]).call();
                }, function (resp) {
                    _this.fnFail.createDelegate(_this, [resp]).call();
                });
            } else {
                _this._parent.modelo.adicionarPedidos({
                    idcliente: Ext.encode(_clientes),
                    idpedido: Ext.encode(_pedidos)
                }, function (resp) {
                    _this.postSalvar.createDelegate(_this, [resp]).call();
                });
            }
        }
    },
    fnFail: function (r) {
        var _this = this;
        if (r.destino == 2) {
            _this.postSalvar(r);
            mostrarMensaje(1, this.idioma.msgPedidoAdicionadoFaltanProductos);
        }
        if (r.destino == 3) {
            _this.postSalvar(r);
            mostrarMensaje(1, this.idioma.msgPedidoAdicionadoFaltanPedidos);
        }
    },
    postSalvar: function (r) {
        var _scope = this._parent.winGestionarDocumento;
        _scope.cargarProductos();
        if (_scope.record == null) {
            _scope.record = {};
            Ext.apply(_scope.record, {
                data: {
                    iddocumento: r.iddocumento,
                    nrodoc: r.nro,
                    numeroref: r.numeroref,
                    fechacontable: r.fecha,
                    tipodistribucion: r.tipodistribucion,
                    estado: "1"
                }
            });

        } else {
            _scope.record.data.estado = "1";
        }
        _scope.getTitleDocumento(_scope.record.data.iddocumento);
        _scope.listaBotonesVentana.each(function (b) {
            LOG.util.UIManager.applyKey(b, _scope);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_scope, [b, _scope]).call();
            }
        }, _scope);

        _scope.modelo.getStore().reload();
    }
});

LOG.dist.distribucion.AreasResponsabilidad = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.busquedaBasica = true;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        this.concepto = '\xe1reas de responsabilidad';
        this.textBusquedaSimple = config.idioma.lbCampoBusquedaAreasResponsabilidad;
        this.urlBusquedaGridPrincipal = 'cargarAreasResponsabilidad';
        this.dirController = '/logistica/distribucion/distribucion/index.php/distribucion';
        config.idioma = LOG.dist.distribucion.Idioma;
        this.modelo = new LOG.dist.distribucion.Model({
            idioma: config.idioma
        });
        LOG.dist.distribucion.AreasResponsabilidad.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'deposito',
            default: true,
            autoExpand: true
        });

        this.addGridColumn({dataIndex: 'iddeposito'});
    },
    init: function () {
        var _this = this;
        LOG.dist.distribucion.AreasResponsabilidad.superclass.init.call(this);
        this.getVistaPrincipal().setTitle(this.idioma.tlVentanaAreasResponsabiliad);
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().resizable = false;
        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
            onShow: function () {
                LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);
                _this.onShowHandler();
            },
            aceptarFn: function (aplicar) {
                if (typeof _this.doAction == 'function') {
                    if (!_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                        mostrarMensaje(1, _this.idioma.msgSelectAreaGenerar);
                        return;
                    }
                    _this.doAction.createDelegate(_this, [_this.getGridPrincipal().getSelectionModel().getSelections(), aplicar]).call();
                }
            }
        });

        this.panelGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            title: this.idioma.tlPanelAreasResponsabilidad
        });
    },
    render: function () {
        var _this = this;
        var _res = LOG.dist.distribucion.AreasResponsabilidad.superclass.render.call(this);
        this.getGridPrincipal().getSelectionModel().fireEvent = this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange' && _this.formaVisualizacion == 'ventana') {
                _this.habilitarBotones();
            }
        });
        return _res;
    },
    habilitarBotones: function () {
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
            this.getVistaPrincipal().listaBotones.getItem(1).enable();
            this.getVistaPrincipal().listaBotones.getItem(2).enable();
        }
    },
    onShowHandler: function () {
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, this.parametros);
        this.getStorePrincipal().reload();
    }
});

LOG.dist.distribucion.VentanaAreasResponsabilidad = Ext.extend(LOG.dist.distribucion.AreasResponsabilidad, {
    _parent: undefined,
    constructor: function (config) {
        LOG.dist.distribucion.VentanaAreasResponsabilidad.superclass.constructor.call(this, config);
        this.autoLoad = false;
    },
    doAction: function (r, aplicar) {
        var _this = this;
        var arrayEntidad = new Array();
        if (_this._parent != undefined) {
            var _depositos = new Array();
            var _idseleccionados = [];
            Ext.each(r, function (rec) {
                _depositos.push({
                    idcliente: rec.get('iddeposito'),
                    idestructura: _this.parametros.identidad,
                    tipocliente: 4
                });
                _idseleccionados.push(rec.get('iddeposito'));
            });

            if (_this._parent.modelo.iddocumento == null) {
                _this._parent.modelo.salvar({
                    idcliente: Ext.encode(_depositos)
                }, function (resp) {
                    _this.postSalvar.createDelegate(_this, [resp, aplicar, _idseleccionados]).call();
                });
            } else {
                _this._parent.modelo.adicionarDestinos({
                    idcliente: Ext.encode(_depositos),
                    addproductos: 1,
                    iddocumento: _this._parent.modelo.iddocumento
                }, function (resp) {
                    _this.postSalvar.createDelegate(_this, [resp, aplicar, _idseleccionados]).call();
                });
            }
        }
    },
    postSalvar: function (r, a, _idselecc) {
        var _this = this;
        var _scope = this._parent.winGestionarDocumento;
        _scope.cargarProductos();
        if (_scope.record == null) {
            _scope.record = {};
            Ext.apply(_scope.record, {
                data: {
                    iddocumento: r.iddocumento,
                    nrodoc: r.nro,
                    numeroref: r.numeroref,
                    fechacontable: r.fecha,
                    tipodestino: r.tipodestino,
                    tipodistribucion: r.tipodistribucion,
                    estado: "1",
                    cant_clientes: r.cantclientes,
                    cant_productos: 0
                }
            });

        } else {
            _scope.record.data.estado = "1";
            _scope.record.data.cant_clientes = r.cantclientes;
        }
        _scope.getTitleDocumento(_scope.record.data.iddocumento);
        _scope.listaBotonesVentana.each(function (b) {
            LOG.util.UIManager.applyKey(b, _scope);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_scope, [b, _scope]).call();
            }
        }, _scope);
        if (a) {
            _this.storePrincipal.reload(
                _this.storePrincipal.initBaseParams.idseleccionados = Ext.encode(Ext.decode(_this.storePrincipal.initBaseParams.idseleccionados).concat(_idselecc)),
                _this.storePrincipal.baseParams.idseleccionados = Ext.encode(Ext.decode(_this.storePrincipal.baseParams.idseleccionados).concat(_idselecc)),
                _this.storePrincipal.initBaseParams.identidad = _this._parent.cmbEntidad.getValue()
            );
        }
        _scope.modelo.getStore().reload();
    }
});

LOG.dist.distribucion.GridSolicitudes = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        //this.textBusquedaSimple = config.idioma.gcNroDoc;
        this.autoSelect = false;
        switch (config.idComponent) {
            case 0:
                this.urlBusquedaGridPrincipal = 'cargarSolicitudPrestamo';
                this.autoLoad = true;
                break;
            case 1:
                this.urlBusquedaGridPrincipal = 'cargarSolicitudCambioUbic';
                break;
            case 2:
                this.urlBusquedaGridPrincipal = 'cargarSolicitudCambioSurtido';
                break;
            case 3:
                this.urlBusquedaGridPrincipal = 'cargarSolicitudLiberacion';
                break;
        }
        LOG.dist.distribucion.GridSolicitudes.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgNroDoc,
            width: 115,
            dataIndex: 'nrodoc',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'cantidadclientes'
        });
        this.addGridColumn({
            header: this.idioma.cgEntregarA,
            width: 300,
            dataIndex: 'cliente',
            default: true,
            renderer: function (value, md, r) {
                if (r.data.cantidadclientes > 1) {
                    return r.data.cantidadclientes + _this.idioma.lbcantclientes;
                } else
                    return value;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgEstado,
            width: 120,
            dataIndex: 'estado',
            default: true,
            renderer: function (v) {
                return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            header: this.idioma.cgFechaEmision,
            width: 120,
            dataIndex: 'fechacontable',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantProductos,
            width: 95,
            dataIndex: 'cantidadproductos',
            default: true
        });

        this.addGridColumn({dataIndex: 'iddocumento'});

        this.addGridColumn({dataIndex: 'idcliente'});

        this.addGridColumn({dataIndex: 'arrayclientes'});
    }
});

/*LOG.dist.distribucion.WinClientes = Ext.extend(LOG.util.Window, {
 _parent: undefined,
 listaBotones: undefined,
 usarAplicar: false,
 constructor: function (config) {
 Ext.apply(this, config);
 var _this = this;
 this.listaBotones = new LOG.util.List();
 this.parametros = config.parametros;
 this.addEvents('quitarmask');
 this.addEvents('mask');
 config.width = 800;
 config.height = 450;
 config.resizable = false;
 config.idioma = LOG.util.UIManager.apply(LOG.dist.distribucion.Idioma, LOG.util.Idioma);
 LOG.dist.distribucion.WinClientes.superclass.constructor.call(this, config);
 this.modelo = new LOG.dist.distribucion.Model({
 idioma: config.idioma,
 urlController: '/logistica/distribucion/distribucion/index.php/distribucion/'
 });
 this.setTitle(config.idioma.tlVentanaAdicionarCliente);
 this.panelDatos();
 },
 initComponents: function () {
 var _this = this;
 _this.listaBotones.getButton(2).disable();
 },
 panelDatos: function () {
 var _this = this;

 this.GridClientesCriticos = new LOG.dist.distribucion.GridClientesCriticos({
 idioma: _this.idioma,
 id: 'idcriticos',
 title: 'Clientes cr\xedticos'
 });
 this.GridClientes = new LOG.dist.distribucion.GridClientes({
 idioma: _this.idioma,
 id: 'idclientes',
 title: 'Clientes',
 parametros: {
 listaClientes: Ext.encode(_this.parametros.listaClientes)
 }
 });

 this.tapPanel = new LOG.util.UITabTemplate({idioma: _this.idioma, formaVisualizacion: 'panel'});
 this.tapPanel.addTabToTemplete(this.GridClientes);
 this.tapPanel.addTabToTemplete(this.GridClientesCriticos);

 this.tapPanel.init();
 var tap = this.tapPanel.view();
 tap.region = 'center';

 this.panelPrincipal = LOG.util.UIManager.initPanel({
 frame: true,
 region: 'center',
 layout: 'border',
 items: [tap]
 });

 this.add(this.panelPrincipal);
 },
 onRenderHandler: function () {
 var _this = this;
 this.panel.on({
 'render': function () {
 _this.listaBotones.each(function (b) {
 LOG.util.UIManager.applyKey(b, _this.panel);
 }, _this);

 _this.GridClientesCriticos.getGridPrincipal().getSelectionModel().fireEvent = _this.GridClientesCriticos.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
 if (e == 'selectionchange') {
 _this.habilitarBotones();
 }
 });

 _this.GridClientes.getGridPrincipal().getSelectionModel().fireEvent = _this.GridClientes.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
 if (e == 'selectionchange') {
 _this.habilitarBotones();
 }
 });
 _this.GridClientesCriticos.getGridPrincipal().on({
 'keypress': function (eventoObject) {
 if (eventoObject.getCharCode() == 13) {
 _this.onAceptarHandler();
 }
 }
 });
 _this.GridClientes.getGridPrincipal().on({
 'keypress': function (eventoObject) {
 if (eventoObject.getCharCode() == 13) {
 _this.onAceptarHandler();
 }
 }
 });
 }
 });
 },
 getLeyendConfig: function () {
 return {
 autoWidth: true,
 autoHeight: true,
 tpl: new Ext.XTemplate(
 '<div class="leyend-block">',
 '<ul>',
 '<li style="color:red;">' + this.idioma.lbCriticosPorCobertura + '</li>',
 '<li style="color:green;"> ' + this.idioma.lbCriticosPorConsumo + '</li>',
 '</ul>',
 '</div>'
 )
 };
 },
 habilitarBotones: function () {
 var _this = this;
 this.listaBotones.getItem(2).disable();
 if (_this.GridClientes.getGridPrincipal().getSelectionModel().hasSelection() || _this.GridClientesCriticos.getGridPrincipal().getSelectionModel().hasSelection()) {
 this.listaBotones.getItem(2).enable();
 }
 },
 aceptarFn: function () {
 var _this = this;

 if (!_this.GridClientes.getGridPrincipal().getSelectionModel().hasSelection() && !_this.GridClientesCriticos.getGridPrincipal().getSelectionModel().hasSelection()) {
 mostrarMensaje(1, _this.idioma.msgSelectClienteGenerar);
 return;
 }

 if (_this._parent != undefined) {

 var _clientes = new Array();

 if (_this.GridClientes.getGridPrincipal().getSelectionModel().hasSelection()) {
 Ext.each(_this.GridClientes.getGridPrincipal().getSelectionModel().getSelections(), function (rec) {
 _clientes.push({
 idcliente: rec.get('idclientesproveedores'),
 tipocliente: 1
 });
 });
 }

 if (_this.GridClientesCriticos.getGridPrincipal().getSelectionModel().hasSelection()) {
 Ext.each(_this.GridClientesCriticos.getGridPrincipal().getSelectionModel().getSelections(), function (rec) {
 _clientes.push({
 idcliente: rec.get('idcliente'),
 tipocliente: 1
 });
 });
 }

 if (_this._parent.modelo.iddocumento == null) {
 _this._parent.modelo.salvar({
 idcliente: Ext.encode(_clientes)
 }, function (resp) {
 _this.postSalvar.createDelegate(_this, [resp]).call();
 });
 } else {
 _this._parent.modelo.adicionarDestinos({
 idcliente: Ext.encode(_clientes)
 }, function (resp) {
 _this.postSalvar.createDelegate(_this, [resp]).call();
 });
 }
 }
 },
 postSalvar: function (r) {
 var _scope = this._parent.winGestionarDocumento;
 _scope.cargarProductos();
 if (_scope.record == null) {
 _scope.record = {};
 Ext.apply(_scope.record, {
 data: {
 iddocumento: r.iddocumento,
 nrodoc: r.nro,
 numeroref: r.numeroref,
 fechacontable: r.fecha,
 tipodestino: r.tipodestino,
 tipodistribucion: r.tipodistribucion,
 estado: "1",
 cant_clientes: r.cantclientes,
 cant_productos: 0
 }
 });

 } else {
 _scope.record.data.estado = "1";
 _scope.record.data.cant_clientes = r.cantclientes;
 }
 _scope.getTitleDocumento(_scope.record.data.iddocumento);
 _scope.listaBotonesVentana.each(function (b) {
 LOG.util.UIManager.applyKey(b, _scope);
 if (typeof b.controlFn == 'function') {
 b.controlFn.createDelegate(_scope, [b, _scope]).call();
 }
 }, _scope);
 _scope.modelo.getStore().reload();
 }
 });*/
