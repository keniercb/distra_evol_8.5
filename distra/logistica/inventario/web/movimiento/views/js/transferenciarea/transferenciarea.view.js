Ext.ns('LOG.inv.transferenciarea');

/**
 * Plantilla tipo ViewPort para gestion de transferencia entre areas.
 * @type LOG.util.UITemplate
 */
LOG.inv.transferenciarea.View = Ext.extend(LOG.lb.documento.View, {
    name: 'TransferenciaEntreAreas',
    cantSign: 3,
    signDetails: {
        1: 'Elaborado',
        2: 'Aprobado',
        3: 'Contabilizado'
    },
    dirReport: '/logistica/inventario/movimiento/transferencia/',
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        config.urlBusquedaGridPrincipal = 'cargarDocumentos';
        config.modoSeleccion = 1;
        LOG.util.UIManager.apply(config.idioma, LOG.lb.documento.Idioma);
        config.model = new LOG.inv.transferenciarea.Model({
            idioma: config.idioma
        });
        this.concepto = config.idioma.concepto;
        LOG.inv.transferenciarea.View.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa los componentes.
     * @returns {undefined}
     */
    init: function () {
        var _this = this;
        LOG.inv.transferenciarea.View.superclass.init.call(this);
        this.initPanelSuperior();
        this.initPanelInferior();
        Ext.apply(this.winGestionarDocumento, {
            salvarHandler: function () {
                var _self = _this.winGestionarDocumento;
                _self.modelo.salvar({idestructuracomun: _this.idDeposito}, function (r) {
                    if (_self.modelo.listaProductos.count()) {
                        _self.cargarProductos();
                    }
                    _self.tipoVentana = 2;
                    if (_self.record == null) {
                        _self.record = {};
                        Ext.apply(_self.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1",
                                cantproductos: r.cantproductos
                            }
                        });
                    }
                    _this.habilitarElementos();
                    _self.getTitleDocumento(r.iddocumento);
                    _self.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _self);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_self, [b, _self]).call();
                        }
                    }, _self);
                });
            },
            beforeEditProducto: function (o) {
                o.cancel = true;
            },
            beforeLoadProductos: function () {
                _this.winGestionarDocumento.stGridDetalles.baseParams[_this.modelo.primaryKeyField] = (_this.modelo[_this.modelo.primaryKeyField]) ? _this.modelo[_this.modelo.primaryKeyField] : -1;
                _this.winGestionarDocumento.stGridDetalles.initBaseParams[_this.modelo.primaryKeyField] = (_this.modelo[_this.modelo.primaryKeyField]) ? _this.modelo[_this.modelo.primaryKeyField] : -1;
                _this.winGestionarDocumento.stGridDetalles.baseParams.idarea = (_this.modelo.idareaorigen) ? _this.modelo.idareaorigen : -1;
                _this.winGestionarDocumento.stGridDetalles.initBaseParams.idarea = (_this.modelo.idareaorigen) ? _this.modelo.idareaorigen : -1;
            },
            controlFnGuardar: function (b, nuevo) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && (!_this.winGestionarDocumento.record
                    || (nuevo && _this.winGestionarDocumento.record.data.estado != '3')
                    || (!nuevo && _this.winGestionarDocumento.record.data.estado == '1')
                    )
                ) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        });
    },
    /**
     * Inicializa los botones de la ventana.
     * @returns {undefined}
     */
    initDefaultButtons: function () {
        var _this = this;
        LOG.inv.transferenciarea.View.superclass.initDefaultButtons.call(this);

        // Bloque de botones de la interfaz principal.
        this.listaBotones.getItem(0).handler = this.listaBotones.getItem(0).handler.createSequence(function () {
            _this.winGestionarDocumento.tipoVentana = 1;
            _this.habilitarElementos();
        });
        this.listaBotones.getItem(1).handler = this.listaBotones.getItem(1).handler.createSequence(function () {
            _this.habilitarElementos();
        });
        this.winGestionarDocumento.onResetHandler = this.winGestionarDocumento.onResetHandler.createSequence(function (e) {
            _this.winGestionarDocumento.tipoVentana = 1;
            _this.habilitarElementos();
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
                    b.show();
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
                    b.hide();
                }
            }
        }), 3);

        this.insertToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnular,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '2') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'anularestado1');
                } else {
                    b.hide();
                }
            }
        }), 4);

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
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.setDisabled(!(
                            ( this.getCount() == 1 && this.getSelected().data.estado == '2' ) && //first
                            ( ( window.useSign && typeof pki == 'object' ) ? (_caller.getSmPrincipal().getSelected().get('controlfirma') == 2) : true) //last pki //para controlfirma == 2 limit 3 y 1 limit 2
                            ));
                        }
                    }, 'aprobar1');
                } else {
                    b.hide();
                }
            }
        }), 5);

        this.insertToolbarButton(LOG.util.Prototipos.botonDuplicar({
            tooltip: this.idioma.ttBtnDuplicar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.duplicar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD')) {
                    b.show();
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
                    b.hide();
                }
            }
        }), 6);


        this.listaBotones.getItem(9).id = 'idtransferencia';

        // Fin del bloque de botones.


        // Bloque de botones del panel superior de la interfaz de adicionar.
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: this.idioma.ttBtnEliminar,
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

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(1), {
            tooltip: this.idioma.ttBtnConfirmar,
            disabled: true,
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
                    _this.winGestionarDocumento.onShow();
                    _this.winGestionarDocumento.cargarProductos(_this.modelo);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos();
                });
            },
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

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(2), {
            tooltip: this.idioma.ttBtnAnular,
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
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado')) {
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

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(3), {
            tooltip: this.idioma.ttBtnAprobar,
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
                    _this.winGestionarDocumento.tipoVentana = 3;
                    _this.winGestionarDocumento.listaBotonesVentana.each(
                        function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                            }
                        }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos();
                });
            },
            disabled: true,
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

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), {
            tooltip: this.idioma.ttBtnDuplicar,
            handler: function () {
                _this.modelo.duplicar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
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
                    _this.winGestionarDocumento.tipoVentana = 2;
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                });
            },
            disabled: true,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record) {
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

        // Fin del bloque de botones.


        // Bloque de botones de la interfaz aprobar.

        this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonAprobar({
            hidden: true,
            tooltip: this.idioma.ttBtnAprobar,
            disabled: true,
            handler: function () {
                _this.modelo.aprobar(null, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
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

        this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonAnularEstado({
            hidden: true,
            tooltip: this.idioma.ttBtnAnular,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado(null, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
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
        // Fin del bloque de botones.


        // Bloque de botones del panel de productos de la interfaz de adicionar.
        var btnProducto = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnProducto,
            tooltip: this.idioma.ttBtnProducto,
            iconCls: 'producto',
            disabled: true,
            fnEspecialCondition: function () {
                if ((!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record &&
                    _this.winGestionarDocumento.record.data.estado == '1')) &&
                    _this.modelo.basicForm && _this.modelo.basicForm.isValid()) {
                    return false;
                }
                return true;
            },
            handler: function () {
                var _p = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    parametros: {
                        idestructura: _this.idDeposito,
                        idarea: _this.modelo.idareaorigen || _this.cbAreaOrigen.getValue(),
                        iddocumento: _this.modelo.iddocumento || -1,
                        tipoproducto: "[1, 4]"
                    }
                });
                _p.postSalvar = _p.postSalvar.createSequence(function (r) {
                    _this.winGestionarDocumento.record.data.cantproductos = r.cantproductos;
                    _p.getStorePrincipal().initBaseParams.iddocumento = _this.modelo.iddocumento;
                    _p.reiniciarBusqueda();
                    _this.habilitarElementos();
                });
                _p.init();
                var vistaProductos = _p.view();
                _p.tipoProducto.disable();
                vistaProductos.show();
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.insertToolbarButtonProductos(btnProducto, 0);
        this.modelo.addActionButton(btnProducto, true);

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesProductos.getItem(1), {
            tooltip: this.idioma.ttBtnEliminarProd,
            disabled: true,
            handler: _this.handlerEliminarMov,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        _caller.smGridDetalles.fireEvent = _caller.smGridDetalles.fireEvent.createSequence(function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() > 0 && (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1')) {
                                    b.enable();
                                } else {
                                    b.disable();
                                    _this.formularioSur.collapse();
                                }
                            }
                        });
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        // Fin del bloque de botones.
    },
    /**
     * Inicializa las columnas de la ventana.
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        LOG.inv.transferenciarea.View.superclass.initDefaultColumns.call(this);
        var pos = this.listaColumnas.getPosByField('dataIndex', 'fechacontable', 'header');
        this.insertGridColumn({
            header: this.idioma.cgTipoTransferencia,
            width: 170,
            dataIndex: 'tipotransferencia',
            default: true
        }, pos + 1);

        this.insertGridColumn({
            header: this.idioma.cgAreaOrigen,
            width: 160,
            dataIndex: 'areaorigen',
            default: true
        }, pos + 2);

        this.insertGridColumn({
            header: this.idioma.cgAreaDestino,
            width: 160,
            dataIndex: 'areadestino',
            default: true
        }, pos + 3);

        this.addGridColumn({dataIndex: 'idtipotransferencia'});
        this.addGridColumn({dataIndex: 'idareaorigen'});
        this.addGridColumn({dataIndex: 'idareadestino'});
        this.addGridColumn({dataIndex: 'controlfirma'});
        this.addGridColumn({dataIndex: 'idnodo'});
        this.addGridColumn({dataIndex: 'iddoc'});

        pos = this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'nacionalidad', 'header');
        this.insertGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgExistenciaArea,
            dataIndex: 'existencia_area',
            align: 'right',
            width: 120
        }), pos + 1);
    },
    /**
     * Inicializa la ventana de detalles de la transferencia.
     * @param {Object} d
     * @param {Integer} tipoVentana
     * @returns {undefined}
     */
    initVentanaGestion: function (d, tipoVentana) {
        tipoVentana = d ? (d.data.estado == '3' ? 3 : 2) : 1;
        var init = this.winGestionarDocumento.isInit();
        LOG.inv.transferenciarea.View.superclass.initVentanaGestion.createDelegate(this, [d, tipoVentana]).call();
        if (!init) {
            var _this = this;
            LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.smGridDetalles, 'fireEvent', function (e) {
                if (e == 'selectionchange') {
                    if (this.getCount() == 1 && tipoVentana != 3) {
                        _this.cargarDatosMovTransferencia(this.getSelected());
                        _this.formularioSur.expand();
                        _this.cargarDatosUbicacion({}, true, true);
                    } else {
                        _this.formularioSur.collapse();
                    }
                    _this.winGestionarDocumento.doLayout();
                }
            }, 'panelTransferencia');
        }
    },
    /**
     * Inicializa el panel de entrada de datos.
     * @returns {undefined}
     */
    initPanelSuperior: function () {
        var _this = this;
        this.cbTipoTransferencia = new Ext.erp.comboNomenclador({
            fieldLabel: this.idioma.lbCbTipoTransferenciaArea,
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomTipotransferencia',
            idnom: 'idtipotransferencia',
            name: 'idtipotransferencia',
            autoCargar: true,
            allowBlank: false,
            editable: false,
            emptyText: this.idioma.lbSeleccione,
            campo: true,
            listeners: {
                select: function (_cb, _r) {
                    _this.cbAreaOrigen.fireEvent('expand', _this.cbAreaOrigen);
                    _this.cbAreaOrigen.setValue(null);
                    _this.cbAreaOrigen.enable();
                    _this.cbAreaDestino.fireEvent('expand', _this.cbAreaDestino);
                    _this.cbAreaDestino.setValue(null);
                    _this.cbAreaDestino.enable();
                }
            }
        });

        this.stArea = new Ext.data.Store({
            url: 'cargarAreasXTipoTransferencia',
            reader: new Ext.data.JsonReader({
                    id: "idarea",
                    root: "datos"
                },
                [
                    {name: 'idarea'},
                    {name: 'descripcion'}
                ])
        });

        this.cbAreaOrigen = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbAreaOrigen,
            store: this.stArea,
            name: 'idareaorigen',
            valueField: 'idarea',
            displayField: 'descripcion',
            editable: false,
            allowBlank: false,
            disabled: true,
            campo: true,
            listeners: {
                focus: function (_cb) {
                    _cb.fireEvent('expand', _cb);
                },
                expand: function (_cb) {
                    _cb.getStore().filterBy(function (item) {
                        return _this.cbAreaDestino.getValue() != item.data.idarea
                        && item.json.idtipotransferencia.split(',').indexOf(_this.cbTipoTransferencia.getValue()) != -1;
                    });
                }
            }
        });

        this.cbAreaDestino = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbAreaDestino,
            store: this.stArea,
            name: 'idareadestino',
            valueField: 'idarea',
            displayField: 'descripcion',
            editable: false,
            allowBlank: false,
            disabled: true,
            campo: true,
            listeners: {
                focus: function (_cb) {
                    _cb.fireEvent('expand', _cb);
                },
                expand: function (_cb) {
                    _cb.getStore().filterBy(function (item) {
                        return _this.cbAreaOrigen.getValue() != item.data.idarea
                        && item.json.idtipotransferencia.split(',').indexOf(_this.cbTipoTransferencia.getValue()) != -1;
                    });
                }
            }
        });

        this.taObservaciones = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbObservaciones,
            name: 'observaciones',
            tabular: true,
            height: 40,
            minLength: 2,
            maxLength: 255,
            minLengthText: this.idioma.msjMinLengthText,
            maxLengthText: this.idioma.msjMaxLengthText,
            width: '98%',
            campo: true,
            obs: true
        });

        var clsDatosGenerales = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });

        clsDatosGenerales.addComponent(this.cbTipoTransferencia);
        clsDatosGenerales.addComponent(this.cbAreaOrigen);
        clsDatosGenerales.addComponent(this.cbAreaDestino);

        this.formularioGeneral = LOG.util.UIManager.initPanel({
            layout: 'form',
            labelAlign: 'top',
            items: [clsDatosGenerales, this.taObservaciones]
        });
    },
    /**
     * Inicializa el panel de transferencia de productos.
     * @returns {undefined}
     */
    initPanelInferior: function () {
        var _this = this;
        this.cbUbicacionOrigen = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbUbicacionOrigen,
            url: 'cargarArbolOrigen',
            name: 'ubicacionorigen',
            valueField: 'idubicacion',
            displayField: 'ubicacion',
            autoLoad: false,
            editable: false,
            allowBlank: false,
            campo: true,
            listeners: {
                select: function (_cb, _r) {
                    _this.cargarDatosUbicacion(_r.json, true);
                    _this.nfCantidad.setMaxValue(_r.json.disponible);
                    _this.nfCantidad.validate();
                }
            }
        });
        this.cbUbicacionOrigen.getStore().on({
            beforeload: function () {
                this.removeAll();
                _this.cbUbicacionOrigen.reset();
            }
        });

        this.cbUbicacionDestino = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbUbicacionDestino,
            url: 'cargarArbolDestino',
            name: 'ubicaciondestino',
            valueField: 'idubicacion',
            displayField: 'ubicacion',
            autoLoad: false,
            editable: false,
            allowBlank: false,
            campo: true,
            listeners: {
                select: function (_cb, _r) {
                    _this.cargarDatosUbicacion(_r.json);
                }
            }
        });
        this.cbUbicacionDestino.getStore().on({
            beforeload: function () {
                this.removeAll();
                _this.cbUbicacionDestino.reset();
            }
        });

        this.nfCantidad = LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Cantidad a transferir',
            name: 'cantidad',
            allowBlank: false,
            campo: true,
            listeners: {
                blur: function () {
                    this.validate();
                }
            }
        });

        var clsDatos = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        clsDatos.addComponent(this.cbUbicacionOrigen);
        clsDatos.addComponent(this.cbUbicacionDestino);
        clsDatos.addComponent(this.nfCantidad);

        var pnDetalles = LOG.util.UIManager.initPanel({
            frame: true,
            anchor: '99%',
            items: [{
                html: '<table width="100%">' +
                '<tr>' +
                '   <td width="33%"><lb style="font-weight: bold;">' + _this.idioma.lbExistencia + ':</lb> <lb class="existenciaorigen">-</lb></td>' +
                '   <td width="33%"><lb style="font-weight: bold;">' + _this.idioma.lbExistencia + ':</lb> <lb class="existenciadestino">-</lb></td>' +
                '   <td width="30%"></td>' +
                '</tr>' +
                '<tr>' +
                '   <td><lb style="font-weight: bold;">' + _this.idioma.lbDisponible + ':</lb> <lb class="disponibleorigen">-</lb></td>' +
                '   <td><lb style="font-weight: bold;">' + _this.idioma.lbDisponible + ':</lb> <lb class="disponibledestino">-</lb></td>' +
                '   <td></td>' +
                '</tr>' +
                '</table>'
            }]
        });

        var btnTransferir = LOG.util.UIManager.createBtn({
            text: 'Transferir',
            iconCls: 'cambiar',
            disabled: true,
            btn: true,
            handler: function () {
                _this.modelo.adicionarMovTransferencia({
                    iddocumento: _this.modelo.iddocumento,
                    idproducto: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idproducto,
                    idmovimiento: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idmovimiento,
                    idubicacion: _this.cbUbicacionOrigen.getValue(),
                    idestructuraubicacionorigen: _this.cbUbicacionOrigen.getValue(),
                    idestructuraubicaciondestino: _this.cbUbicacionDestino.getValue(),
                    cantidad: _this.nfCantidad.getValue()
                }, function () {
                    _this.winGestionarDocumento.stGridDetalles.load();
                    _this.formularioSur.collapse();
                    _this.formularioSur.hide();
                });
            },
            controlFn: function (b, _caller) {
                LOG.util.UIManager.encadenaFn(_caller.cbUbicacionOrigen, 'fireEvent', function (e) {
                    if (e == 'select') {
                        if (this.getValue() && _caller.cbUbicacionDestino.getValue()
                            && _caller.nfCantidad.getValue() > 0 && _caller.nfCantidad.isValid()) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'cbUbicacionOrigen');
                LOG.util.UIManager.encadenaFn(_caller.cbUbicacionDestino, 'fireEvent', function (e) {
                    if (e == 'select') {
                        if (this.getValue() && _caller.cbUbicacionOrigen.getValue()
                            && _caller.nfCantidad.getValue() > 0 && _caller.nfCantidad.isValid()) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'cbUbicacionDestino');
                LOG.util.UIManager.encadenaFn(_caller.nfCantidad, 'fireEvent', function (e) {
                    if (e == 'keyup' || e == 'blur') {
                        if (_caller.cbUbicacionOrigen.getValue() && _caller.cbUbicacionOrigen.getValue()
                            && this.getValue() > 0 && this.isValid()) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'nfCantidad');
            }
        });
        btnTransferir.controlFn.createDelegate(this, [btnTransferir, this]).call();

        this.pnDatos = new LOG.util.UIManager.initPanel({
            title: 'Movimiento',
            layout: 'form',
            labelAlign: 'top',
            region: 'center',
            frame: true,
            items: [clsDatos, pnDetalles],
            bbar: ['->', btnTransferir]
        });

        this.tabProductos = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            items: [this.pnDatos, this.initPanelTransferencia('panelProducto', false, true)]
        });

        this.formularioSur = LOG.util.UIManager.initPanel({
            frame: true,
            region: 'south',
//            hideCollapseTool: true,
            collapsible: true,
            collapseMode: 'mini',
            layout: 'card',
            activeItem: null,
            animCollapse: false,
            animate: true,
            collapsed: true,
            height: 280,
            split: true,
            pContainer: this.panelGrid,
            items: [this.tabProductos],
            listeners: {
                collapse: function () {
                    if (_this.winGestionarDocumento.tipoVentana == 3 || _this.winGestionarDocumento.smGridDetalles.getSelections().length != 1) {
                        this.hide();
                    }
                    this.pContainer.doLayout();
                },
                beforeexpand: function () {
                    this.show();
                    this.pContainer.doLayout();
                }
            }
        });
        if (cmpArmamento) {
            this.formularioSur.add(this.initPanelPartidas());
        }
    },
    /**
     * Inicializa el panel de municiones.
     * @returns {undefined}
     */
    initPanelPartidas: function () {
        var _this = this;
        this.municiones = new LOG.inv.municiones.Ventana({
            formaVisualizacion: 'panel',
            panelSuperior: false,
            confubicacion: confubicacion,
            fecha: fecha
        });
        this.municiones.init();
        var municiones = this.municiones.view();
        var panel = LOG.util.UIManager.initPanel({
            title: 'Movimiento',
            region: 'center',
            layout: 'border',
            items: [municiones, this.initPanelTransferirRevertir('panelPartidaTransferir', _this.municiones.getSmPrincipal(), true)]
        });
        panel.doLayout();
        return new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            items: [panel, this.initPanelTransferencia('panelPartida', true, true)]
        });
    },
    /**
     * Inicializa el panel de transferencias.
     * @param {String} nombre Texto mediante el cual se crea el nombre del panel.
     * @param {Boolean} partida [Opcional]
     * @param {Boolean} revertir [Opcional]
     * @returns {Ext.Panel}
     */
    initPanelTransferencia: function (nombre, partida, revertir) {
        var _this = this;
        this[nombre] = new LOG.inv.transferenciarea.Transferencia({
            idioma: this.idioma,
            partida: partida
        });
        this[nombre].init();
        var panel = this[nombre].view();

        return LOG.util.UIManager.initPanel({
            title: 'Movimientos registrados',
            region: 'center',
            layout: 'border',
            items: [panel, this.initPanelTransferirRevertir(nombre + 'Revertir', _this[nombre].getSmPrincipal(), partida, revertir)]
        });
    },
    /**
     * Inicializa el panel de revertir de transferencias.
     * @param {String} nombre Texto mediante el cual se crea el nombre panel.
     * @param {SelectionModel} sm
     * @param {Boolean} partida
     * @param {Boolean} revertir [Opcional]
     * @returns {Ext.Panel}
     */
    initPanelTransferirRevertir: function (nombre, sm, partida, revertir) {
        var _this = this;
        var btnRevertir = LOG.util.UIManager.createBtn({
            text: revertir ? 'Revertir' : 'Transferir',
            iconCls: revertir ? 'deshacer' : 'cambiar',
            disabled: true,
            btn: true,
            handler: function () {
                _this.modelo.adicionarMovTransferencia({
                    iddocumento: _this.modelo.iddocumento,
                    idproducto: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idproducto,
                    idmovimiento: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idmovimiento,
                    idmovubicacion: sm.getSelected().data.idmovubicacion,
                    idmovtransferencia: sm.getSelected().data.idmovtransferencia,
                    idmovtransferenciamunic: sm.getSelected().data.idmovtransferenciamunic,
                    idpartidaorigen: sm.getSelected().data.idpartidaorigen || sm.getSelected().data.idproductomunic,
                    idestructuraubicacion: (partida && !revertir) ? _this.cbUbicacionDestinoPartida.getValue() : sm.getSelected().data.idubicaciondestino,
                    idubicacion: sm.getSelected().data.idubicacionorigen || sm.getSelected().data.idestructuraubicacion,
                    idestructuraubicaciondestino: sm.getSelected().data.idubicaciondestino,
                    estiba: (partida && !revertir) ? estiba.getValue() : sm.getSelected().data.estiba,
                    hilera: (partida && !revertir) ? hilera.getValue() : sm.getSelected().data.hilera,
                    cantidad: cantidad.getValue(),
                    revertir: revertir || null,
                    partida: partida || null
                }, function () {
                    _this.winGestionarDocumento.stGridDetalles.load();
                    _this.formularioSur.collapse();
                    _this.formularioSur.hide();
                    _this.resetearDatos(nombre);
                });
            },
            controlFn: function (b, _caller) {
                LOG.util.UIManager.encadenaFn(cantidad, 'fireEvent', function (e) {
                    if (e == 'keyup' || e == 'blur') {
                        if (this.getValue() > 0 && this.isValid() && (((partida && !revertir && estiba.getValue() > 0 && hilera.getValue() > 0
                            && _caller.cbUbicacionDestinoPartida.getValue()) || revertir) || !partida)) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'nfCantidad' + nombre);
                if (partida && !revertir) {
                    LOG.util.UIManager.encadenaFn(estiba, 'fireEvent', function (e) {
                        if (e == 'keyup' || e == 'blur') {
                            if (cantidad.getValue() > 0 && cantidad.isValid() && this.getValue() > 0
                                && hilera.getValue() > 0 && _caller.cbUbicacionDestinoPartida.getValue()) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'nfEstiba' + nombre);
                    LOG.util.UIManager.encadenaFn(hilera, 'fireEvent', function (e) {
                        if (e == 'keyup' || e == 'blur') {
                            if (cantidad.getValue() > 0 && cantidad.isValid() && estiba.getValue() > 0
                                && this.getValue() > 0 && _caller.cbUbicacionDestinoPartida.getValue()) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'nfHilera' + nombre);
                    LOG.util.UIManager.encadenaFn(_caller.cbUbicacionDestinoPartida, 'fireEvent', function (e) {
                        if (e == 'select') {
                            if (cantidad.getValue() > 0 && cantidad.isValid() && estiba.getValue() > 0 && hilera.getValue() > 0 && this.getValue()) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'cbUbicacion' + nombre);
                }
            }
        });

        this[nombre] = LOG.util.UIManager.initPanel({
            frame: true,
            region: 'east',
            border: true,
            width: 250,
            bbar: ['->', btnRevertir]
        });
        if (partida && !revertir) {
            this.cbUbicacionDestinoPartida = new LOG.util.ComboBox({
                fieldLabel: 'Ubicaciones de destino',
                url: 'cargarArbolDestino',
                name: 'ubicacionorigen',
                valueField: 'idubicacion',
                displayField: 'ubicacion',
                autoLoad: false,
                editable: false,
                disabled: true,
                allowBlank: false,
                campo: true
            });
            this.cbUbicacionDestinoPartida.getStore().on({
                beforeload: function () {
                    this.removeAll();
                    _this.cbUbicacionDestinoPartida.reset();
                }
            });
            var clsDatosUbicacion = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            clsDatosUbicacion.addComponent(this.cbUbicacionDestinoPartida);
            this[nombre].add(clsDatosUbicacion);
            var clsDatosPartida = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });
            var estiba = LOG.util.Prototipos.inputEntero({
                fieldLabel: 'Estiba',
                name: 'estiba',
                disabled: true,
                allowBlank: false,
                campo: true,
                listeners: {
                    blur: function () {
                        this.validate();
                    }
                }
            });
            clsDatosPartida.addComponent(estiba);
            var hilera = LOG.util.Prototipos.inputEntero({
                fieldLabel: 'Hilera',
                name: 'hilera',
                disabled: true,
                allowBlank: false,
                campo: true,
                listeners: {
                    blur: function () {
                        this.validate();
                    }
                }
            });
            clsDatosPartida.addComponent(hilera);
            this[nombre].add(clsDatosPartida);
        }
        var clsDatos = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var cantidad = LOG.util.Prototipos[partida ? 'inputEntero' : 'inputDecimal']({
            fieldLabel: 'Cantidad a ' + (revertir ? 'revertir' : 'transferir'),
            name: revertir ? 'revertir' : 'transferir',
            disabled: true,
            allowBlank: false,
            campo: true,
            listeners: {
                blur: function () {
                    this.validate();
                }
            }
        });
        clsDatos.addComponent(cantidad);
        this[nombre].add(clsDatos);

        btnRevertir.controlFn.createDelegate(this, [btnRevertir, this]).call();

        LOG.util.UIManager.encadenaFn(sm, 'fireEvent', function (e) {
            if (e == 'selectionchange') {
                if (this.getCount() == 1) {
                    cantidad.setMaxValue(this.getSelected().data.disponible || this.getSelected().data.cantidad);
                    cantidad.validate();
                }
                _this.resetearDatos(nombre, this.hasSelection());
            }
        }, 'selecciona' + nombre);

        return this[nombre];
    },
    /**
     * Programa los eventos y devuelve la vista principal.
     * @returns {vistaPrincipal}
     */
    render: function () {
        var render = LOG.inv.transferenciarea.View.superclass.render.call(this);
        var _this = this;
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e) {
            if (e == 'load') {
                if (_this.idDeposito && _this.idDeposito != _this.idDepositiTemp) {
                    _this.stArea.load({params: {iddeposito: _this.idDeposito}});
                    _this.idDepositiTemp = _this.idDeposito;
                }
            }
        }, 'stAreas');
        return render;
    },
    /**
     * Resetea los datos de entrada de transferencia de movimientos.
     * @param {String} nombre
     * @param {Bollean} seleccionado
     * @returns {undefined}
     */
    resetearDatos: function (nombre, seleccionado) {
        Ext.each(this[nombre].find('campo', true), function (item) {
            item.reset();
            item.setDisabled(!seleccionado);
        });
        Ext.each(this[nombre].getBottomToolbar().find('btn', true), function (b) {
            b.disable();
        });
    },
    /**
     * Habilita o deshabilita los botones.
     * @returns {undefined}
     */
    habilitarElementos: function () {
        if (!this.winGestionarDocumento.record) {
            this.winGestionarDocumento.setTitle(this.idioma.tlAdicionar);
        }
        Ext.each(this.winGestionarDocumento.panelSuperior.find('campo', true), function (item) {
            if (!this.record || this.record.data.estado == '1') {
                if (item.obs) {
                    item.enable();
                } else {
                    item.setDisabled(this.record && parseInt(this.record.data.cantproductos) > 0);
                }
            } else {
                item.disable();
            }
        }, this.winGestionarDocumento);
    },
    /**
     *
     * @returns {undefined}
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
    /**
     * Carga los datos para realizar las transferencias.
     * @param {Object} datos
     * @returns {undefined}
     */
    cargarDatosMovTransferencia: function (datos) {
        if (datos.json.municion == 1) {
            this.formularioSur.getLayout().setActiveItem(1);
            this.municiones.idproducto = datos.data.idproducto;
            this.municiones.idarea = this.modelo.idareaorigen;
            this.municiones.reiniciarBusqueda();
            this.panelPartida.idmovimiento = datos.data.idmovimiento;
            this.panelPartida.reiniciarBusqueda();
            this.cbUbicacionDestinoPartida.getStore().load({
                params: {idproducto: datos.data.idproducto, idarea: this.modelo.idareadestino}
            });
        } else {
            this.formularioSur.getLayout().setActiveItem(0);
            this.panelProducto.idmovimiento = datos.data.idmovimiento;
            this.panelProducto.reiniciarBusqueda();
            this.cbUbicacionOrigen.getStore().load({
                params: {idproducto: datos.data.idproducto, idarea: this.modelo.idareaorigen}
            });
            this.cbUbicacionDestino.getStore().load({
                params: {idproducto: datos.data.idproducto, idarea: this.modelo.idareadestino}
            });
            this.resetearDatos('pnDatos', true);
        }
    },
    /**
     * Carga lod datos de la ubicacion.
     * @param {Object} datos
     * @param {Boolean} origen
     * @param {Boolean} ambos
     * @returns {undefined}
     */
    cargarDatosUbicacion: function (datos, origen, ambos) {
        var elementos = document.getElementsByTagName('lb');
        for (var i = 0; i < elementos.length; i++) {
            if (origen || ambos) {
                if (elementos[i].getAttribute('class') == 'existenciaorigen') {
                    elementos[i].innerHTML = parseFloat(datos.cantidad) || '-';
                }
                if (elementos[i].getAttribute('class') == 'disponibleorigen') {
                    elementos[i].innerHTML = parseFloat(datos.disponible) || '-';
                }
            }
            if (!origen || ambos) {
                if (elementos[i].getAttribute('class') == 'existenciadestino') {
                    elementos[i].innerHTML = parseFloat(datos.cantidad) || '-';
                }
                if (elementos[i].getAttribute('class') == 'disponibledestino') {
                    elementos[i].innerHTML = parseFloat(datos.disponible) || '-';
                }
            }
        }
    },
    /**
     * Genera el reporte de especificado de la transferencia entre areas.
     * @param {type} btn
     * @returns {undefined}
     */
    getParamsReport: function (record, btn) {
        var _this = this;
        return btn.isList ? {
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
            contabilizadopor: (_this.panelBusquedaAvanzada.findByType('combo')[5].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[5].getValue() : null,
            creadopor: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
            fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d/m/Y') : null,
            fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d/m/Y') : null,
            areaorigen: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
            areadestino: (_this.panelBusquedaAvanzada.findByType('combo')[4].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[4].getValue() : null,
            tipotransferencia: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null
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
 * Plantilla tipo panel
 * @type LOG.util.UITemplate
 */
LOG.inv.transferenciarea.Transferencia = Ext.extend(LOG.util.UITemplate, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.urlBusquedaGridPrincipal = 'cargarMovTransferencia';
        this.autoLoad = false;
        this.modoSeleccion = 1;
        LOG.inv.transferenciarea.Transferencia.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa las columnas de la ventana.
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        this.addGridColumn({dataIndex: 'idmovtransferencia'});
        this.addGridColumn({dataIndex: 'idmovubicacion'});
        this.addGridColumn({dataIndex: 'idubicacionorigen'});
        this.addGridColumn({dataIndex: 'idubicaciondestino'});
        this.addGridColumn({dataIndex: 'idmovtransferenciamunic'});
        this.addGridColumn({dataIndex: 'idpartidaorigen'});
        this.addGridColumn({dataIndex: 'idpartidadestino'});
        this.addGridColumn({
            header: 'Ubicaci\xf3n origen',
            dataIndex: 'origen',
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: 'Ubicaci\xf3n destino',
            dataIndex: 'destino',
            width: 150,
            default: true
        });
        if (this.partida) {
            this.addGridColumn({
                header: 'Estiba',
                dataIndex: 'estiba',
                width: 80,
                default: true
            });
            this.addGridColumn({
                header: 'Hilera',
                dataIndex: 'hilera',
                width: 80,
                default: true
            });
        }
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantidad,
            dataIndex: 'cantidad',
            align: 'right',
            width: 120,
            default: true
        }));
    },
    /**
     * Programa los eventos, renderiza el componente y devuelve la vista.
     * @param {Object} config
     * @returns {vistaPrincipal}
     */
    render: function () {
        var render = LOG.inv.transferenciarea.Transferencia.superclass.render.call(this);
        var _this = this;
        this.getStorePrincipal().on({
            beforeload: function () {
                this.initBaseParams.idmovimiento = _this.idmovimiento;
                this.initBaseParams.partida = _this.partida || null;
            }
        });
        return render;
    }
});