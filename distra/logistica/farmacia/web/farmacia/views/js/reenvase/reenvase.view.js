Ext.ns('LOG.farm.reenvase');
LOG.farm.reenvase.View = Ext.extend(LOG.lb.documento.View, {
    name: 'Reenvase',
    cantSign: 3,
    signDetails: {
        1: 'Elaborado',
        2: 'Preparado',
        3: 'Aprobado'
    },
    dirReport: '/logistica/farmacia/reenvase/',
    constructor: function (config) {
        this.dirController = '/logistica/farmacia/farmacia/index.php/reenvase';
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        this.textBusquedaSimple = config.idioma.lbNroDocumento;
        this.concepto = config.idioma.ttBtnBuscarReenvase;
        config.model = new LOG.farm.reenvase.Model({
            idioma: config.idioma
        });
        this.listaBotonesProductoOrigen = new LOG.util.List();
        this.listaBotonesProductoDestino = new LOG.util.List();
        LOG.farm.reenvase.View.superclass.constructor.call(this, config);
        this.winGestionarDocumento = new LOG.farm.reenvase.VentanaAdicionar({
            idioma: config.idioma,
            modelo: config.model,
            scope: this,
            listaAcciones:this.listaAcciones,
            title: this.idioma.tlVentanaAdicionarReenvase
        });
    },
    init: function () {
        var _this = this;
        LOG.farm.reenvase.View.superclass.init.call(this);
        this.panelSuperior();
    },
    initVentanaGestion: function (d, tipoVentana) {
        var _this = this;
        LOG.farm.reenvase.View.superclass.initVentanaGestion.createDelegate(this, [d, tipoVentana]).call();
        _this.cmbArea.store.load();
        this.winGestionarDocumento.doLayout();
    },
    initDefaultColumns: function () {
        var _this = this;
        LOG.farm.reenvase.View.superclass.initDefaultColumns.call(this);

        LOG.util.UIManager.apply(this.listaColumnas.getBy('dataIndex', 'fechacontable'), {
            header: _this.idioma.cgFechaReenvase,
            dataIndex: 'fecha',
            width: 100
        });

        var columFechaReenvase = this.listaColumnas.getPosByField('dataIndex', 'fecha', 'header');

        this.insertGridColumn({
            header: _this.idioma.cgArea,
            width: 360,
            dataIndex: 'area',
            autoExpand: true,
            default: true
        }, columFechaReenvase + 1);

        this.insertGridColumn({
            header: _this.idioma.cgProductoOrigen,
            width: 380,
            dataIndex: 'productoorigen',
            default: true
        }, columFechaReenvase + 2);

        this.insertGridColumn({
            header: _this.idioma.cgProductoDestino,
            width: 380,
            dataIndex: 'productodestino',
            default: true
        }, columFechaReenvase + 3);

        this.insertGridColumn({
            header: _this.idioma.cgDiferencias,
            align: 'center',
            dataIndex: 'cantdif',
            width: 160,
            renderer: function(value, metaData) {
                if (value > 0 || value < 0) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmHabiltado + '"';
                } else {
                    metaData.css = 'icondistra-aceptar rojo';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmDeshabiltado + '"';
                }
                return '';
            }

        }, columFechaReenvase + 4);

        LOG.util.UIManager.apply(this.listaColumnas.getBy('dataIndex', 'cantproductos'), {
            hidden: true
        });

        this.addGridColumn({dataIndex: 'idarea'});

        this.addGridColumn({dataIndex: 'idreenvase'});

        this.addGridColumn({dataIndex: 'observaciones'});

        this.addGridColumn({dataIndex: 'iddoc'});

        this.addGridColumn({dataIndex: 'idprodreenvase'});

        this.addGridColumn({dataIndex: 'idforma'});

        this.addGridColumn({dataIndex: 'codigoorigen'});

        this.addGridColumn({dataIndex: 'dosisunitaria'});

        this.addGridColumn({dataIndex: 'existenciaorigen'});

        this.addGridColumn({dataIndex: 'cantidad'});

        this.addGridColumn({dataIndex: 'preciocosto'});

        this.addGridColumn({dataIndex: 'importecosto'});

        this.addGridColumn({dataIndex: 'idproductoorigen'});

        this.addGridColumn({dataIndex: 'idproducto'});

        this.addGridColumn({dataIndex: 'codigodestino'});

        this.addGridColumn({dataIndex: 'dosisunitariadestino'});

        this.addGridColumn({dataIndex: 'existenciadestino'});

        this.addGridColumn({dataIndex: 'cantidaddest'});

        this.addGridColumn({dataIndex: 'cantdif'});

        this.addGridColumn({dataIndex: 'diferencia'});

        this.addGridColumn({dataIndex: 'idproductodestino'});

        this.addGridColumn({dataIndex: 'idprodreenvasado'});

        this.addGridColumn({dataIndex: 'preciocostodestino'});

        this.addGridColumn({dataIndex: 'importecostodestino'});

        this.addGridColumn({dataIndex: 'productodestino'});

        this.addGridColumn({dataIndex: 'importecostodif'});

        this.addGridColumn({dataIndex: 'idmovimiento'});

        this.addGridColumn({dataIndex: 'idprodorigenreenvase'});

        this.addGridColumn({dataIndex: 'idprodorigenreenvasado'});

    },
    initDefaultButtons: function () {
        var _this = this;
        LOG.farm.reenvase.View.superclass.initDefaultButtons.call(this);

        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(0), 'handler', function() {
            _this.habilitarBotones();
        }, 'reenvaseAdd');

        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(1), 'handler', function() {
            _this.habilitarBotones();
        }, 'reenvaseVer');

        this.insertToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: _this.idioma.ttBtnConfirmar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.confirmar();
                _this.winGestionarDocumento.habilitarElementosComponentes();
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
        }), 3);

        this.insertToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            tooltip: _this.idioma.ttBtnAnular,
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
        }), 4);

        this.insertToolbarButton(LOG.util.Prototipos.botonAprobar({
            tooltip: _this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.aprobar();
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
        }), 5);

        this.insertToolbarButton(LOG.util.Prototipos.botonImprimir({
            text: _this.idioma.lbBtnImprimirModelo,
            tooltip: _this.idioma.ttBtnImprimirModelo,
            disabled:true,
            handler: function () {
                LOG.farm.reenvase.fnImprimirModelo(_this.getSmPrincipal().getSelected().data.iddocumento, _this.idioma);
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RB') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && _this.record.data.estado == 2) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'imprimir');
                }
            }
        }), 6);

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: _this.idioma.ttBtnEliminarReenvase,
            disabled: true,
            fn: function() {
                _this.modelo.eliminar({id: _this.winGestionarDocumento.record.data.iddocumento}, function () {
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
            tooltip: _this.idioma.ttBtnConfirmarReenvase,
            disabled: true,
            fn: function() {
                _this.modelo.confirmar({id: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
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
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.winGestionarDocumento.habilitarElementosComponentes();
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
            tooltip: _this.idioma.ttBtnAnularEstadoReenvase,
            disabled: true,
            fn: function() {
                _this.modelo.anularestado({id: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
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
                    _this.winGestionarDocumento.habilitarElementosComponentes();
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

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(3), {
            tooltip: _this.idioma.ttBtnAprobarReenvase,
            disabled: true,
            fn: function() {
                _this.modelo.aprobar({id: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
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
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.winGestionarDocumento.habilitarElementosComponentes();
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

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), {
            controlFn: function (b, _caller) {
                b.hide();
            }
        });

        LOG.util.UIManager.apply(this.listaBotones.getItem(9), {
            id: 'reenvase'
        });

        this.winGestionarDocumento.addToolbarButtonVentana('->');

        this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonAyuda({
            id: 'reenvase'
        }));

        var btnProducto = LOG.util.UIManager.createBtn({
            iconCls: 'producto',
            text: this.idioma.lbBtnProducto,
            tooltip: _this.idioma.ttBtnAdicionarProducto,
            disabled: true,
            handler: function () {
                _this.showVentanaProducto();
            },
            fnEspecialCondition: function() {
                if ((!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record &&
                    _this.winGestionarDocumento.record.data.estado == '1') &&  _this.winGestionarDocumento.stGridDetalles.getTotalCount() == 0) && (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) {
                    return false;
                }
                return true;
            },
            controlFn: function (b, _caller) {
                b.disable();
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RProducto')) {
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
        this.listaBotonesProductoOrigen.add(btnProducto);

        this.listaBotonesProductoOrigen.add(LOG.util.Prototipos.botonEliminar({
            tooltip: _this.idioma.ttBtnEliminaProducto,
            disabled: true,
            handler: function () {
                if (!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record  && _this.winGestionarDocumento.record.data.idprodreenvase == null)) {
                    _this.limpiarCamposProducto(false, true);
                    _this.listaBotonesProductoOrigen.getItem(2).setDisabled(true);
                    _this.listaBotonesProductoOrigen.getItem(0).setDisabled(false);
                    _this.winGestionarDocumento.stGridDetalles.reload();
                    _this.winGestionarDocumento.listaBotonesLotes.getItem(0).setDisabled(true);
                } else {
                    _this.model.eliminarProducto({
                        origen: 1
                    }                    
                    );
                }
            },
            controlFn: function (b, _caller) {
                b.disable();
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1' && _this.validarCamposProducto(false, true)) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.listaBotonesProductoOrigen.add(LOG.util.UIManager.createBtn({
            iconCls: 'informe',
            text: this.idioma.lbBtnReenvase,
            tooltip: this.idioma.ttBtnReenvase,
            disabled: true,
            handler: function () {
                _this.reenvasarProductoDestino();
            },
            controlFn: function (b, _caller) {
                b.disable();
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RReenvase')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1' && (_this.winGestionarDocumento.stGridDestino.getTotalCount() > 0 )
                         && _this.TfDestDosisUnitaria.getValue() != '') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));

        var btnTarjeta = LOG.util.UIManager.createBtn({
            iconCls: 'producto',
            itemId: 'btntarjeta',
            text: this.idioma.lbBtnCrearProducto,
            tooltip: this.idioma.ttBtnCrearProducto,
            disabled: true,
            handler: function() {
                _this.idDeposito = _this.winGestionarDocumento.record ? _this.winGestionarDocumento.record.data.idarea : _this.cmbArea.getValue();
                var winCrearTarjeta = new LOG.lb.producto.Tarjeta({
                    idioma: _this.idioma,
                    _parent: _this,
                    idestructura: _this.winGestionarDocumento.record ? _this.winGestionarDocumento.record.data.idarea : _this.cmbArea.getValue(),
                    dosisunitaria: _this.TfDosisUnitaria.getValue() ? _this.TfDosisUnitaria.getValue() : -1,
                    fpresentacion: _this.winGestionarDocumento.record ? _this.winGestionarDocumento.record.data.idforma : -1,
                    idprodreenvase: _this.winGestionarDocumento.record ? _this.winGestionarDocumento.record.data.idprodreenvase : _this.idproducto,
                    idseleccionados: Ext.encode(_this.winGestionarDocumento.stGridDetalles.collect('idproducto')),
                    destino: 1,
                    doAction: function(r) {
                        var _this = this;

                        var params = {
                            idestructura: _this.idDeposito, 
                            iddocumento: _this.modelo.iddocumento
                        };

                        _this.modelo.idindicador = (r[0].data.idindicador) ? r[0].data.idindicador : r[0].id;
                        _this.modelo.idcodificador = (r[0].data.idcodificador) ? r[0].data.idcodificador : null;
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
                            _this.modelo.salvar(params, function() {
                                _this.modelo.reset();
                                _this.getStorePrincipal().load();

                            });
                        } else {
                            this._parent.modelo.salvar({
                                tarjeta: Ext.encode(_this.modelo.encode()),
                                idestructuracomun: this._parent.idDeposito,
                                arridindicador: params.arridindicador
                            }, function(r) {

                                _this.postSalvar.createDelegate(_this, [r]).call();
                                _this.modelo.reset();

                            });
                        }
                    },
                    postSalvar: function (r) {
                        var _this = this;
                        var params = {
                            idindicador: (r[0].data.idindicador) ? r[0].data.idindicador : r[0].id,
                            idprodreenvase: (_this._parent.winGestionarDocumento.record) ? _this._parent.winGestionarDocumento.record.data.idprodreenvase : _this._parent.idproducto
                        };

                        _this._parent.modelo.adicionarProducto(params, function (resp) {

                            if (resp.data) {
                                _this.modelo.idprodreenvasado = resp.data.idprodreenvasado;
                                _this._parent.winGestionarDocumento.fromularioGestion.getForm().loadRecord(resp);
                            }
                        }, 0);
                        _this.VentanaProductos(true);
                    }
                });
                winCrearTarjeta.show();
            },
            fnEspecialCondition: function() {
                if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1'
                    && (_this.winGestionarDocumento.stGridDetalles.getTotalCount() == 0)) {
                    return false;
                }
                return true;
            },
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(false);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1'  //&& _this.winGestionarDocumento.stGridDetalles.getTotalCount() > 0
                        ) {
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
        this.listaBotonesProductoDestino.add(btnTarjeta);
        var btnProductoTarjeta = LOG.util.UIManager.createBtn({
            iconCls: 'producto',
            text: this.idioma.lbBtnProducto,
            tooltip: _this.idioma.ttBtnAdicionarProducto,
            disabled: true,
            handler: function () {
                _this.showVentanaProducto(destino = true);
            },
            fnEspecialCondition: function() {
                if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado != '1'
                    && (_this.winGestionarDocumento.stGridDetalles.getTotalCount() > 0 && _this.winGestionarDocumento.stGridDestino.getTotalCount() == 0 && _this.winGestionarDocumento.record.data.cantidaddest != null)) {
                    return false;
                }
                return true;
            },
             controlFn: function (b, _caller) {
                 b.disable();
                 if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                     b.setVisible(true);
                     if (_this.winGestionarDocumento.tipoVentana == 3) {
                         b.hide();
                     } else {
                         b.show();
                         if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1'  //&& _this.winGestionarDocumento.stGridDetalles.getTotalCount() > 0
                         ) {
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
        this.listaBotonesProductoDestino.add(btnProductoTarjeta);
        this.listaBotonesProductoDestino.add(LOG.util.Prototipos.botonEliminar({
            disabled:true,
            tooltip: _this.idioma.ttBtnEliminarProductoDestino,
            handler: function() {
                if (_this.winGestionarDocumento.record  && _this.winGestionarDocumento.record.data.idprodreenvasado == null) {
                    _this.limpiarCamposProducto(true, false);
                } else {
                    _this.model.eliminarProducto({
                        destino: 1
                    }, function () {
                        _this.limpiarCamposProducto(true, false);
                        _this.listaBotonesProductoDestino.getItem(2).setDisabled(true);                        
                    }, false);
                }
            },
            controlFn: function (b, _caller) {
                b.disable();
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1' && !_this.validarCamposProducto(true, false)
                        && _this.TfDestDenominacion.getValue() != ''  /*_this.winGestionarDocumento.record.data.idproductodestino != null*/) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));       
    },
    panelSuperior: function () {
        var _this = this;

        this.cmbArea = new LOG.util.ComboArea({
            width : 350,
            fieldLabel: _this.idioma.lbCmbArea,
            title : _this.idioma.tlVentanaArea,
            url: 'cargarDeposito',
            controller : '/logistica/farmacia/farmacia/index.php/reenvase',
            hiddenName: 'idarea',
            name : 'idarea',
            valueField: 'idarea',
            displayField: 'denominacion',
            emptyText: _this.idioma.lbSeleccione,
            columns : [
                {
                    header : _this.idioma.cgCodigo,
                    dataIndex : 'codigo',
                    width : 120
                },
                {
                    header : _this.idioma.cgDenominacion,
                    dataIndex : 'denominacion',
                    width : 250,
                    autoExpand : true
                }
            ],
            listeners: {
                select: function (cmbArea, r, i) {
                    if (_this.cmbArea.value ) {
                        _this.listaBotonesProductoOrigen.getItem(0).setDisabled(false);
                        if(_this.winGestionarDocumento.panelSuperior.findByType('textfield')[4].getValue() !=''){
                            _this.originelementflag(true);
                        }
                        _this.limpiarCamposProducto(false,true);
                    }
                }, 
                change: function (cmbArea, o, n){
                }
            },
            setValue: Ext.form.ComboBox.prototype.setValue.createInterceptor(function (value) {
                if (this.isXType('comboarea', false)){
                    this.fireEvent('valuechange', value);
                }
            })
        });

        this.cmbArea.getStore().on({
            'load': function(st, rd, opt){
                if (rd.length == 1) {
                    _this.cmbArea.disable();
                    _this.areaunica = true;
                    _this.limpiarCamposProducto();
                } else if (rd.length > 1) {
                    _this.cmbArea.enable();
                } else {
                    mostrarMensaje(3, _this.idioma.msgErrorConfiguracionArea);
                }
            }
        });

        this.cmbArea.on('valuechange', function(st,v){ 
            if(!Ext.isEmpty(v)){       
            _this.cmbArea.fireEvent('select', _this.cmbArea,
            _this.cmbArea.getStore().getById(v),
            _this.cmbArea.getStore().indexOfId(v));
            _this.cmbArea.enable();
        }
        });
        this.taObservaciones = new Ext.form.TextField({
            fieldLabel: _this.idioma.lbTaObservaciones,
            name: 'observaciones',
            maxLength: 255,
            maxLengthText: _this.idioma.msgMaxLengthText,
            tabular: true,
            width: '98%'
        });

        this.cls = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.cls.addComponent(this.cmbArea);

        this.cls.addComponent(this.taObservaciones);

        this.clsDiferencias = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });

        this.cmbDiferencias = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCmbDiferencias,
            hiddenName: 'diferencia',
            editable: false,
            disabled: true,
            store: new Ext.data.SimpleStore({
                fields: ['diferencia', 'denomdiferencia'],
                data: [
                    [0, 'Ninguna'],
                    [1, 'Faltante'],
                    [2, 'Sobrante']
                ]
            }),
            valueField: 'diferencia',
            displayField: 'denomdiferencia',
        });

        this.TfDifImporteCosto = new LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfDifImporteCosto,
            name: 'importecostodif',
            disabled: true
        });

        this.clsDiferencias.addComponent(this.cmbDiferencias);

        this.clsDiferencias.addComponent(this.TfDifImporteCosto);

        this.fsIsquierdo = new Ext.form.FieldSet({
            labelAlign: 'top',
            items: [this.cls]
        });

        this.fsDerecho = new Ext.form.FieldSet({
            labelAlign: 'top',
            items: [this.clsDiferencias]
        });

        this.clsContenedorSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.clsContenedorSuperior.addComponent(this.fsIsquierdo);

        this.clsContenedorSuperior.addComponent(this.fsDerecho);

        this.panelDatosProductoOrigen = LOG.util.UIManager.initColumnForm({
            columnas: 5
        });

        this.TfCodigoOrigen = new LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfCodigoOrigen,
            name: 'codigoorigen',
            disabled: true
        });

        this.TfDenominacion = new LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfDenominacion,
            name: 'productoorigen',
            disabled: true
        });

        this.TfDosisUnitaria = new LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbTfDosisUnitaria,
            name: 'dosisunitaria',
            disabled: true,
            listeners: {
                'keyup': function(num) {
                    if (num.isDirty() && num.getValue() > 0 ) {
                        _this.winGestionarDocumento.listaBotonesLotes.getItem(0).enable();
                    } else {
                        _this.winGestionarDocumento.listaBotonesLotes.getItem(0).disable();
                    }
                }
            }
        });

        this.TfExistencia = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: _this.idioma.lbTfExitsencia,
            name: 'existenciaorigen',
            disabled: true
        });

        this.TfPrecioCosto = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: _this.idioma.lbTfPrecioCosto,
            name: 'preciocosto',
            disabled: true
        });

        this.TfImporteCosto = new LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfImporteCosto,
            name: 'importecosto',
            disabled: true
        });

        this.TfCantidad = new LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbTfCantidad,
            name: 'cantidad',
            disabled: true,
        });

        this.TfProducto = new LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbTfCantidad,
            name : 'idproducto',
            hidden: true
        });

        this.panelDatosProductoOrigen.addComponent(this.TfCodigoOrigen);

        this.panelDatosProductoOrigen.addComponent(this.TfDenominacion);

        this.panelDatosProductoOrigen.addComponent(this.TfDosisUnitaria);

        this.panelDatosProductoOrigen.addComponent(this.TfExistencia);

        this.panelDatosProductoOrigen.addComponent(this.TfCantidad);

        this.panelDatosProductoOrigen.addComponent(this.TfPrecioCosto);

        this.panelDatosProductoOrigen.addComponent(this.TfImporteCosto);

        this.panelDatosProductoOrigen.addComponent(this.TfProducto);

        this.panelDatosProductoDestino = LOG.util.UIManager.initColumnForm({
            columnas: 5
        });

        this.TfCodigoDestino = new LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfCodigoDestino,
            name: 'codigodestino',
            disabled: true
        });

        this.TfDestDenominacion = new LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfDestDenominacion,
            name: 'productodestino',
            disabled: true,
            keyup : function(){
                if(_this.winGestionarDocumento.panelSuperior.findByType('textfield')[14].getValue() != ''){
                    _this.winGestionarDocumento.panelSuperior.findByType('textfield')[16].setDisabled(false);
                }
            }
        });

        this.TfDestDosisUnitaria = new LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbTfDestDosisUnitaria,
            name: 'dosisunitariadestino',
            disabled: true,
            listeners: {
                'keyup': function(num) {
                    if(_this.TfDestDenominacion.getValue() !=''){
                        _this.TfDestDosisUnitaria.setDisabled(false);
                    }
                    if (num.isDirty() && num.getValue() > 0 && _this.TfDestDenominacion.getValue() !='') {
                        _this.listaBotonesProductoOrigen.getItem(2).enable();
                    } else {
                        _this.listaBotonesProductoOrigen.getItem(2).disable();
                    }
                }
            }
            
        });

        this.TfDestExistencia = new LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbTfDestExitsencia,
            name: 'existenciadestino',
            disabled: true
        });

        this.TfDestPrecioCosto = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: _this.idioma.lbTfDestPrecioCosto,
            name: 'preciocostodestino',
            disabled: true
        });

        this.TfDestImporteCosto = new LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfDestImporteCosto,
            name: 'importecostodestino',
            disabled: true
        });

        this.TfDestCantidad = new LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbTfDestCantidad,
            name: 'cantidaddest',
            disabled: true
        });

        this.TfProductoDestino = new LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbTfDestCantidad,
            name : 'idproducto',
            hidden: true
        });

        this.panelDatosProductoDestino.addComponent(this.TfCodigoDestino);

        this.panelDatosProductoDestino.addComponent(this.TfDestDenominacion);

        this.panelDatosProductoDestino.addComponent(this.TfDestDosisUnitaria);

        this.panelDatosProductoDestino.addComponent(this.TfDestExistencia);

        this.panelDatosProductoDestino.addComponent(this.TfDestCantidad);

        this.panelDatosProductoDestino.addComponent(this.TfDestPrecioCosto);

        this.panelDatosProductoDestino.addComponent(this.TfDestImporteCosto);

        this.panelDatosProductoDestino.addComponent(this.TfProductoDestino);

        this.fsIsquierdo1 = new Ext.form.FieldSet({
            tbar: LOG.util.UIManager.initToolbar({
                items: _this.listaBotonesProductoOrigen.getArray()
            }),
            itemId:'fsIsquierdo1',
            title: _this.idioma.tlGriProductoOrigen,
            labelAlign: 'top',
            items: [this.panelDatosProductoOrigen]
        });

        this.fsDerecho1 = new Ext.form.FieldSet({
            tbar: LOG.util.UIManager.initToolbar({
                items: this.listaBotonesProductoDestino.getArray()
            }),
            itemId:'fsDerecho1',
            title: _this.idioma.tlGriProductoDestino,
            labelAlign: 'top',
            items: [this.panelDatosProductoDestino]
        });

        this.clsContenedorSuperior.addComponent(this.fsIsquierdo1);

        this.clsContenedorSuperior.addComponent(this.fsDerecho1);

        this.formularioGeneral = LOG.util.UIManager.initPanel({
            layout: 'form',
            labelAlign: 'top',
            items: [this.clsContenedorSuperior]
        });

    },
    showVentanaProducto: function(destino) {
        var _this = this;
        _this.producto = new LOG.lb.documento.VentanaProductos({
            idioma: _this.idioma,
            _parent: _this,
            busquedaAvanzada: false,
            usarFiltroDeposito: true,
            modoSeleccion: 1,
            parametros: {
                idestructura: _this.cmbArea.value,
                idseleccionados: Ext.encode(_this.winGestionarDocumento.stGridDetalles.collect('idproducto')),
                idproducto: _this.winGestionarDocumento.stGridDetalles.collect('idproducto'),
                dosisunitaria: destino ? _this.TfDosisUnitaria.getValue() : -1,
                cantidad: destino ? _this.TfCantidad.getValue() : -1,
                fpresentacion: destino ? 1 : 0
            },
            doAction: function(r) {
                _this.cantidad = [];
                if (r[0].json && !destino) {
                    _this.TfCantidad.setValue();
                    _this.TfProducto.setValue();
                    _this.TfCodigoOrigen.setValue(r[0].json.codigo);
                    _this.TfDenominacion.setValue(r[0].json.denominacion);
                    _this.TfDosisUnitaria.setValue(r[0].json.dosisunitaria);
                    _this.TfExistencia.setValue(r[0].json.existencia);
                    _this.cantidad.push(r[0].json.cantidad);
                    _this.TfPrecioCosto.setValue(r[0].json.precio);
                    _this.TfImporteCosto.setValue(r[0].json.importecalculado);
                    _this.idproducto = r[0].json.idproducto;
                    _this.listaBotonesProductoOrigen.getItem(1).enable();
                    _this.TfDosisUnitaria.setDisabled(false);
                    _this.originelementflag(true);  
                } else {
                    _this.TfDestCantidad.setValue();
                    _this.TfProductoDestino.setValue();
                    _this.TfCodigoDestino.setValue(r[0].json.codigo);
                    _this.TfDestDenominacion.setValue(r[0].json.denominacion);
                    _this.TfDestDosisUnitaria.setValue(r[0].json.dosisunitaria);
                    _this.dosisunitariadest = r[0].json.dosisunitaria;
                    _this.TfDestExistencia.setValue(r[0].json.existencia);
                    _this.cantidad.push(r[0].json.cantidad);
                    _this.TfDestCantidad.setValue(_this.TfCantidad.getValue());
                    _this.TfDestPrecioCosto.setValue(r[0].json.precio);
                    _this.TfDestImporteCosto.setValue(r[0].json.importecalculado);
                    _this.idproducto = r[0].json.idproducto;
                    _this.listaBotonesProductoDestino.getItem(2).enable();
                    _this.TfDestDosisUnitaria.setDisabled(false);

                    var params = {
                        idproducto: (r[0].data.idproducto) ? r[0].data.idproducto : r[0].id,
                        idprodreenvase: (_this.winGestionarDocumento.record) ? _this.winGestionarDocumento.record.data.idprodreenvase : null,
                        cantidad: _this.TfCantidad.getValue() ? _this.TfCantidad.getValue() : 0,
                        producto: 1
                    };

                    _this.modelo.adicionarProducto(params, function (resp) {
                        if (resp.data) {
                            _this.modelo.idprodreenvasado = resp.data.idprodreenvasado;
                            _this.winGestionarDocumento.fromularioGestion.getForm().loadRecord(resp);
                            _this.winGestionarDocumento.cargarDestinos();
                        }
                        _this.listaBotonesProductoDestino.getItem(2).enable();
                    }, 1);
                }
            }
        });
        _this.producto.init();
        _this.producto.autoLoad = true;
        _this.producto.urlBusquedaGridPrincipal = 'cargarProductos'
        _this.vistaProductos =  _this.producto.view();
        _this.vistaProductos.show();
    },
    showVentanaLote: function() {
        var _this = this

        var seleccionados = new Array();

        _this.winGestionarDocumento.stGridDetalles.each(function(rec){
            if(rec.data.idlote) {
                seleccionados.push(rec.data.idlote);
            }
        });

        var _lote = new LOG.farm.reenvase.WinLote({
            idioma: _this.idioma,
            _parent: _this,
            parametros: {
                excluir:  Ext.encode(seleccionados),
                idproducto: (_this.idproducto) ? _this.idproducto : _this.winGestionarDocumento.record.data.idproductoorigen,
                activo: 1
            },
            doAction: function(r) {
                var _this = this;
                var selections = _lote.smGridPrincipal.getSelections();
                _this._parent.winGestionarDocumento.stGridDetalles.add(selections);
                if(_this._parent.winGestionarDocumento.stGridDetalles.data.items.length > 0){
                    _this._parent.winGestionarDocumento.listaBotonesLotes.getItem(0).setDisabled(true); 
                }
            }
        });
        _lote.init();
        _this.vistaLotes = _lote.view();
        _this.vistaLotes.show();
    },
    limpiarCamposProducto: function(destino, origen) {
        var _this = this;
        if (origen) {
            _this.TfProducto.setValue();
            _this.TfCantidad.setValue();
            _this.idproducto = null;
            _this.TfCodigoOrigen.setValue();
            _this.TfDenominacion.setValue();
            _this.TfDosisUnitaria.setValue();
            _this.TfDosisUnitaria.disable();
            _this.TfExistencia.setValue();
            _this.cantidad = [];
            _this.TfPrecioCosto.setValue();
            _this.TfImporteCosto.setValue();
            _this.listaBotonesProductoOrigen.getItem(1).disable();
        }
        if (destino) {
            _this.TfProductoDestino.setValue();
            _this.TfDestCantidad.setValue();
            _this.idproducto = null;
            _this.TfCodigoDestino.setValue();
            _this.TfDestDenominacion.setValue();
            _this.TfDestDosisUnitaria.setValue();
            _this.TfDestDosisUnitaria.disable();
            _this.TfDestExistencia.setValue();
            _this.TfDestCantidad.setValue();
            _this.cantidad = [];
            _this.TfDestPrecioCosto.setValue();
            _this.TfDestImporteCosto.setValue();
            _this.listaBotonesProductoDestino.getItem(2).disable();
            _this.cmbDiferencias.setValue();
            _this.TfDifImporteCosto.setValue();
        }
    },
    validarCamposProducto: function(destino, origen) {
        var _this = this;
        var todoOk = false;
        if (origen) {
            if (_this.TfCodigoOrigen.getValue() != "" && _this.TfDenominacion.getValue() != "" && _this.TfDosisUnitaria.getValue() != ""
                && _this.TfPrecioCosto.getValue() != "" && _this.TfImporteCosto.getValue() != "" 
            ) {
                todoOk  = true;
            }
        }
        if (destino) {
            if (_this.TfCodigoDestino.getValue() != "" &&  _this.TfDestDenominacion.getValue() != "" && _this.TfDestDosisUnitaria.getValue() != ""
                && _this.TfDestPrecioCosto.getValue() != "" && _this.TfDestImporteCosto.getValue() != ""
            ) {
                todoOk  = true;
            }
        }
        return todoOk;
    },
    reenvasarProductoDestino: function() {
        var _this = this;
        _this.modelo.idproducto = (_this.modelo.idproductoorigen) ? _this.modelo.idproductoorigen : _this.TfProducto.getValue();
        _this.modelo.idproductodestino = (_this.idproducto) ? _this.idproducto : _this.modelo.idprodreenvasado;
        _this.modelo.cantidad = (_this.cantidaddest) ? _this.cantidaddest : _this.TfDestCantidad.getValue();
        _this.modelo.dosisunitariadest = (_this.dosisunitariadest) ? _this.dosisunitariadest : _this.TfDestDosisUnitaria.getValue();
        _this.modelo.dosisunitaria = (_this.modelo.dosisunitaria) ? _this.modelo.dosisunitaria : _this.TfDosisUnitaria.getValue();
        _this.modelo.preciocosto = (_this.modelo.preciocosto) ? _this.modelo.preciocosto : _this.TfPrecioCosto.getValue();
        
        if (_this.modelo.iddocumento != null) {
            _this.modelo.realizarReenvaseProducto({}, function (resp) {
                if (resp.datos) {        
                     _this.modelo.idproductodestino = (_this.idproducto) ? _this.idproducto : _this.modelo.idprodreenvasado;
                     _this.cmbDiferencias.setValue((resp.datos.diferencias[0] ? resp.datos.diferencias[0].diferenciacalc : 0));
                     _this.TfDifImporteCosto.setValue(resp.datos.diferencias[0].importecostodif);
                     _this.TfDestCantidad.setValue(resp.datos.datosReenvasado);
                }

                _this.winGestionarDocumento.cargarDestinos();

                _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                    LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                    if (typeof b.controlFn == 'function') {
                        b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                    }
                }, _this.winGestionarDocumento);                
            });
        }
    },
    originelementflag: function(origen){
        var _this=this;
            this.winGestionarDocumento.panelSuperior.findByType('textfield')[1].setDisabled(!origen);
            this.winGestionarDocumento.panelSuperior.findByType('textfield')[6].setDisabled(!origen);        
    },
    getParamsReport:function(record){
        var _this = this;
        return {
            iddeposito: this.idDeposito ? this.idDeposito : null,
            iddocumento: record.get("iddocumento")|| null
        };
    },    
    habilitarBotones: function () {
        this.listaBotones.getItem(1).disable();
        this.listaBotones.getItem(2).disable();
        if (this.record) {
            this.listaBotones.getItem(1).enable();
            this.listaBotones.getItem(2).enable();
        }
    },
});

LOG.farm.reenvase.WinLote = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    constructor: function(config) {
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.busquedaBasica = false;
        this.autoShow = false;
        this.concepto = config.idioma.tlBtnBuscar;
        this.parametros = {};
        this.urlBusquedaGridPrincipal = 'cargarLotes';
        this.dirController = '/logistica/farmacia/farmacia/index.php/reenvase';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.farm.reenvase.Idioma);
        this.modelo = new LOG.farm.reenvase.Model({
            idioma: config.idioma
        });
        LOG.farm.reenvase.WinLote.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'identrega',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idtransfinternalote',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idlote',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'existencia',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'disponible',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idlotereenvase',
            hidden: true
        });
        this.addGridColumn({
            header: _this.idioma.cgNroLote,
            dataIndex: 'nrolote',
            width: 120,
            autoExpand: true
        });
        this.addGridColumn({
            header: _this.idioma.cgFechaFabricacion,
            dataIndex: 'fechafabricacion',
            width: 120
        });
        this.addGridColumn({
            header: _this.idioma.cgFechaVencimiento,
            dataIndex: 'fechavencimiento',
            width: 120
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.lbCantidadLote,
            align: 'right',
            dataIndex: 'cantidad',
            width: 120
        }));
        this.addGridColumn({
            header: _this.idioma.cgUbicacion,
            dataIndex: 'ubicacion',
            width: 120
        });
    },
    init: function () {
        var _this = this;
        LOG.farm.reenvase.WinLote.superclass.init.call(this);
        this.getVistaPrincipal().setTitle(this.idioma.tlVentanaLotes);
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
    },
    render:function() {
        var _this = this;
        var _res = LOG.farm.reenvase.WinLote.superclass.render.call(this);
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
    },
});

LOG.farm.reenvase.Diferencia = {

    1: 'Ninguna',

    2: 'Faltante',

    3: 'Sobrante'
};
LOG.util.ComboArea = Ext.extend(LOG.util.SelectorTF, {
    url: '',
    controller: '',
    columns: [],
    title: 'Datos',
    width: 90,
    valueField: undefined,
    displayField: undefined,
    data: {},
    autoLoad:true,
    constructor: function (config) {
        var _this = this;
        LOG.util.ComboArea.superclass.constructor.call(this, config);
        this.store = new Ext.data.Store({
            autoLoad: this.autoLoad,
            url: this.controller + '/' + this.url,
            reader:  new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                idProperty: this.valueField,
                root: 'datos',
                fields: [
                    {name: this.valueField, type: 'int'},
                    {name: this.displayField, type: 'string'}
                ]
            })
        });
    },
});


Ext.reg('comboarea', LOG.util.ComboArea);