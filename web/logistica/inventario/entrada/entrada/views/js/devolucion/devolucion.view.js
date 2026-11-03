Ext.ns('LOG.inv.entrada.devolucion');
LOG.inv.entrada.devolucion.View = Ext.extend(LOG.lb.documento.View, {
    name: 'ValeDevolucion',
    cantSign: 3,
    signDetails: {
        1: 'Devuelto por',
        2: 'Recibido por',
        3: 'Contabilizado por'
    },
    dirReport: '/logistica/inventario/entrada/devolucion/',
    /**
     * Panel de los lotes del producto.
     * @type Ext.Panel
     */
    lote: undefined,
    /**
     * Tipo de documento.
     */
    tipoDoc: null,
    /**
     * Constructor de la clase.
     * @param {Object} config
     */
    constructor: function (config) {
        var _this = this;
        this.concepto = config.idioma.ttBtnBuscar;
        this.busquedaBasica = true;
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        this.tipoDoc = new Array();
        config.model = new LOG.inv.entrada.devolucion.Model({});
        LOG.inv.entrada.devolucion.View.superclass.constructor.call(this, config);
        this.modelo.cargaInicial({
            url: '/logistica/inventario/entrada/entrada/index.php/devolucion/cargarTipoDoc'
        }, function (r) {
            _this.tipoDoc = r[0];
        });
    },
    init: function () {
        LOG.inv.entrada.devolucion.View.superclass.init.call(this);
        this.panelSuperior();
        this.initWinNuevo();
        var _this = this;
        Ext.apply(this.winGestionarDocumento, {
            salvarHandler: function () {
                _this.modelo.salvar({
                    idestructuracomun: _this.idDeposito
                }, function (r) {
                    if (_this.modelo.listaLotes.count() || _this.modelo.listaProductos.count() || r.reloadGridDetalle == 1) {
                        _this.winGestionarDocumento.cargarProductos();
                    }
                    _this.winGestionarDocumento.getTitleDocumento(r.iddocumento);
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, this);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(this, [b, this]).call();
                        }
                    }, _this.winGestionarDocumento);
                });
            },
            beforeEditProducto: function (o) {
                if (this.record != null && this.record.data.estado != "1") {
                    o.cancel = true;
                } else if (o.field == 'cantidad') {
                    if (o.record.json.tienelote == '1' || o.record.json.equipo == '1' || o.record.json.municion == '1') {
                        o.cancel = true;
                        return false;
                    }
                    if (o.record.json.decimales == "0") {
                        o.grid.getColumnModel().setEditor(o.column, LOG.util.Prototipos.inputEntero({}));
                    } else {
                        o.grid.getColumnModel().setEditor(o.column, LOG.util.Prototipos.inputDecimal({}));
                    }
                }
            },
			editarProducto: function (o) {
                this.modelo.adicionarProducto(o.record.data);
				o.record.data.ordenado = o.record.data.cantentregada;
                if (parseFloat(o.value) > parseFloat(o.record.data.cantentregada) - parseFloat(o.record.json.resto)) {
                    o.record.data.cantidad = o.record.json.cantidad;
					if (parseFloat(o.originalValue) != parseFloat(o.value))
						mostrarMensaje(3, _this.idioma.msgErrorCantOrigen);
                }
				o.grid.getView().refresh();
                return o.record.data.cantidad;
            },
            controlFnGuardar: function (b, nuevo) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && (!this.record
                    || (nuevo && this.record.data.estado != '4') || (!nuevo && this.record.data.estado == '1')
                    )
                ) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        });
        this.formularioSur = new LOG.util.UIManager.initPanel({
            title: this.idioma.tlPanelLotes,
            titleCollapse: true,
            animCollapse: false,
            collapsible: true,
            region: 'south',
            layout: 'fit',
            hidden: true,
            height: 300,
            minSize: 300,
            maxSize: 500,
            split: true,
            frame: true,
            listeners: {
                collapse: function (_p) {
                    _p.hide();
                    _this.winGestionarDocumento.doLayout();
                },
                expand: function (_p) {
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
    },
    initDefaultButtons: function () {
        var _this = this;

        LOG.inv.entrada.devolucion.View.superclass.initDefaultButtons.call(this);
        // Bloque de botones de la interfaz principal.
        LOG.util.UIManager.apply(this.listaBotones.getItem(4), {id: 'idDevolucion'});
        this.listaBotones.getItem(0).handler = function () {
            _this.win.show();
        };
        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(1), 'handler', function () {
            _this.habilitarElementos();
            _this.cliente.setText(_this.winGestionarDocumento.record.data.descripcliente);
        }, 'devolucionVer');
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
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')) {
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
        }), 6);
        this.insertToolbarButton(this.__comprobante.btnGenerar, 7);
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
            fn: function () {
                _this.modelo.confirmar({id: _this.modelo.iddocumento}, function () {
                    _this.winGestionarDocumento.cargarProductos();
                    Ext.apply(_this.winGestionarDocumento.record.data, {estado: '2'});
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(this, [b, this]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos();
                    _this.modelo.habilitarBotones(true);
                });
            },
            controlFn: function (b) {
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
            fn: function () {
                _this.modelo.anularestado({id: _this.modelo.iddocumento}, function () {
                    _this.winGestionarDocumento.cargarProductos();
                    Ext.apply(_this.winGestionarDocumento.record.data, {estado: '1'});
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(this, [b, this]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos();
                    _this.modelo.habilitarBotones(true);
                });
            },
            controlFn: function (b) {
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
        this.winGestionarDocumento.listaBotonesVentana.getItem(4).hide();
        this.winGestionarDocumento.listaBotonesVentana.getItem(3).hide();
        this.insertToolbarButtonVentana(LOG.util.UIManager.createBtn({
            iconCls: 'nuevo',
            text: _this.idioma.lbBtnGenerarDoc,
            tooltip: _this.idioma.ttBtnGenerarDoc,
            handler: function () {
                _this.win.show();
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if (!_this.winGestionarDocumento.record) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }), 0);
        this.insertToolbarButtonVentana(LOG.util.Prototipos.botonContabilizar({
            tooltip: _this.idioma.ttBtnContabilizar,
            handler: function () {
                _this.modelo.contabilizar({id: _this.modelo.iddocumento}, function () {
                    _this.winGestionarDocumento.cargarProductos();
                    Ext.apply(_this.winGestionarDocumento.record.data, {estado: '4'});
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(this, [b, this]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                });
            },
            controlFn: function (b) {
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
        }), 4);
        // Fin del bloque.

        // Bloque de botones del panel de productos de la ventana adicionar.
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesProductos.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarProd,
            disabled: true,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && _this.winGestionarDocumento.record.data.estado == '1') {
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
            iconCls: 'producto',
            text: this.idioma.lbBtnProductos,
            tooltip: this.idioma.ttBtnProductos,
            handler: function () {
                var winProductos = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    urlBusquedaGridPrincipal: 'cargarProductosDocumento',
                    dirController: '',
                    parametros: {
                        iddocumento: _this.modelo.idpadre || -1,
                        iddocexcluir: _this.modelo.iddocumento,
                        idestructura: _this.idDeposito
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
                if ((!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record &&
                    _this.winGestionarDocumento.record.data.estado == '1')) && _this.modelo.basicForm && _this.modelo.basicForm.isValid()
                    && _this.modelo.idpadre) {
                    return false;
                }
                return true;
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.insertToolbarButtonProductos(btnProductos, 0);
        this.modelo.addActionButton(btnProductos, true);
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
                                && parseFloat(this.getSelected().data.cantidad) > 0) {
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
        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'numeroserie',
            text: this.idioma.lbBtnNoSerie,
            tooltip: this.idioma.ttBtnNoSerie,
            disabled: true,
            handler: function () {
                LOG.lb.numeroserie.Loader.init(function () {
                    this.winSerie = new LOG.lb.numeroserie.Salida({
                        producto: _this.winGestionarDocumento.smGridDetalles.getSelected().data,
                        documento: _this.winGestionarDocumento.record.data,
                        idestructura: _this.idDeposito,
                        salida: _this.idioma.lbTipoDocumento,
                        devolucion: true,
                        afecta: false,
                        cerrarFn: function () {
                            _this.winGestionarDocumento.stGridDetalles.reload();
                        }
                    });
                    this.winSerie.init();
                    this.winSerie.view();
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
                        devolucion: true,
                        fecha: fecha,
                        baseParams: {devolucion: true, estado: 2},
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
        }
        // Fin del bloque.
    },
    initDefaultColumns: function () {
        var _this = this;
        LOG.inv.entrada.devolucion.View.superclass.initDefaultColumns.call(this);

        // Bloque de columnas de la interfaz principal.
        Ext.apply(this.listaColumnas.getBy('dataIndex', 'aprobadopor'), {
            header: this.idioma.gcContabilizadoPor
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
            header: this.idioma.gcEntregadoPor,
            autoExpand: true,
            dataIndex: 'descripcliente',
            default: true
        }, 3);
        this.insertGridColumn({
            header: this.idioma.gcTipoOrigen,
            width: 120,
            dataIndex: 'tipodocorigen',
            default: true,
            renderer: function (_v) {
                return _v || '-';
            }
        }, 5);
        this.insertGridColumn({
            header: this.idioma.gcValeEntrega,
            width: 100,
            dataIndex: 'nroVale',
            default: true,
            align: 'right',
            renderer: function (_v) {
                return _v || '-';
            }
        }, 6);
        this.addGridColumn({dataIndex: 'idpadre'});
        this.addGridColumn({dataIndex: 'controlfirma'});
        this.addGridColumn({dataIndex: 'idnodo'});
        this.addGridColumn({
            dataIndex: 'idcomprobante'
        });
        this.insertGridColumn({
            // header: 'Nro. Comprobante',
            dataIndex: 'nrocomprobante',
            // width: 100,
            // align: 'right',
            default: true
        }, 9);
        //this.addGridColumn({dataIndex: 'iddoc'});
        // Fin del bloque.

        // Bloque de columnas de la ventana adicionar.
        this.addGridColumnProductos({dataIndex: 'resto'});
        var pos = this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'disponible', 'header');
        this.insertGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.gcCantEntregada,
            width: 110,
            align: 'right',
            dataIndex: 'cantentregada',
            default: true
        }), pos + 1);

        this.insertGridColumnProductos({
            dataIndex: 'existenciamovimiento'
        });

        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'preciocontable'), LOG.util.Prototipos.columnaPrecio({
            header: this.idioma.cgPrecio + ' ' + codContable,
            editor: LOG.util.Prototipos.inputDecimal({}),
        }));
        Ext.apply(_this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'importe'), LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgImporte + ' ' + codContable,
            //editor: LOG.util.Prototipos.inputDecimal({}),
            width: 90
        }));
        if (alternativa) {
            pos = this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'importe', 'header');
            this.insertGridColumnProductos(LOG.util.Prototipos.columnaPrecio({
                header: this.idioma.cgPrecio + ' ' + codAlternativa,
                width: 100,
                dataIndex: 'precioalternativo',
                align: 'right',
                editor: LOG.util.Prototipos.inputDecimal({}),
                default: true
            }), pos + 1);
            this.insertGridColumnProductos(LOG.util.Prototipos.columnaImporte({
                header: this.idioma.cgImporte + ' ' + codAlternativa,
                width: 100,
                dataIndex: 'importealternativo',
                align: 'right',
                //editor: LOG.util.Prototipos.inputDecimal({}),
                default: true
            }), pos + 2);
        }
        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'cantidad'), LOG.util.Prototipos.columnaCantidad({
            /*renderer: function (_v, _mD, _r) {
                _r.data.ordenado = _r.data.cantentregada;
                if (parseFloat(_v) > parseFloat(_r.data.cantentregada) - parseFloat(_r.json.resto)) {
                    _r.data.cantidad = parseFloat(_r.data.cantentregada) - parseFloat(_r.json.resto);
                    mostrarMensaje(3, _this.idioma.msgErrorCantOrigen);
                }
                return _r.data.cantidad;
            }*/
        }));
        // Fin del bloque.
    },
    /**
     * @param {Object} d
     * @param {Integer} t
     * @param {Boolean} n
     * @returns {undefined}
     */
    initVentanaGestion: function (d, t, n) {
        var _this = this;
        LOG.inv.entrada.devolucion.View.superclass.initVentanaGestion.call(this, d, t, n);
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.btnNuevo, 'handler', function () {
            _this.winGestionarDocumento.tipoVentana = 1;
            _this.habilitarElementos();
        });
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
    panelSuperior: function () {
        var _this = this;
        this.cliente = new Ext.form.Label({
            fieldLabel: this.idioma.lbCbEntregadoPor
        });
        this.taObservaciones = new Ext.form.TextArea({
            fieldLabel: _this.idioma.lbTaObservaciones,
            name: 'observaciones', width: '98%',
            minLength: 2,
            maxLength: 255,
            minLengthText: _this.idioma.msgTaTamanoMinimo,
            maxLengthText: _this.idioma.msgTaTamanoMaximo,
            validate: function () {
                if (!_this.modelo.idpadre) {
                    return false;
                }
                return Ext.form.TextArea.superclass.validate.call(this);
            }
        });
        var clsDatosDev = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        clsDatosDev.addComponent(new LOG.util.ComboBox({
				fieldLabel: 'Tipo de devoluci\xf3n',
				hiddenName: 'idoperacion',
				editable: true,
				mode:'remote',
				url: 'cargarComboTipoDocumento',
				valueField: 'idnomoperaciones',
				displayField: 'denominacion',
				autoLoad: true,
				allowBlank: false
		}));
		
		clsDatosDev.addComponent(new LOG.util.Prototipos.inputEntero({
			fieldLabel: "Doc. Primario",
			name: 'numeroref',
			editable: true,
			allowBlank: true,
			maxLength: 10,
			campo: true,
			padre: true
		}))
        this.formularioGeneral = LOG.util.UIManager.initPanel({
            layout: 'form',
            labelAlign: 'top',
            items: [_this.cliente,clsDatosDev, _this.taObservaciones]
        });
    },
    initWinNuevo: function () {
        if (!this.winAdd) {
            var _this = this;
            this.winAdd = new LOG.util.UITabTemplate({
                idioma: _this.idioma
            });
            this.winAdd.addTabToTemplete(new LOG.inv.entrada.devolucion.docExterno({
                idioma: _this.idioma,
                title: _this.idioma.tlValeEntrega,
                idestructura: _this.idDeposito,
                idComponent: 0
            }));
            if (facturacion) {
                this.winAdd.addTabToTemplete(new LOG.inv.entrada.devolucion.docExterno({
                    idioma: _this.idioma,
                    title: _this.idioma.tlFactura,
                    idestructura: _this.idDeposito,
                    idComponent: 1
                }));
            }
            this.winAdd.init();
            this.win = this.winAdd.view({
                title: _this.idioma.tlDocumentos,
                width: 700,
                height: 400,
                usarAplicar: false,
                aceptarFn: function () {
                    _this.modelo.generarDocumento({
                        idestructura: _this.idDeposito,
                        iddocumento: _this.winAdd.getActiveTemplate().getSmPrincipal().getSelected().data.iddocumento
                    }, function (r) {
                        var record = {
                            data: {
                                iddocumento: r.iddocumento, idpadre: r.idpadre, estado: '1',
                                numeroref: r.numeroref, fechacontable: r.fechacontable
                            }
                        };
                        Ext.apply(_this.modelo, record.data);
                        _this.initVentanaGestion(record, 2, true);
                        _this.cliente.setText(r.descripcliente);
                        _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, this);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }, _this.winGestionarDocumento);
                        _this.habilitarElementos();
                        _this.win.close();
                    }, function () {
                        _this.win.close();
                    });
                }
            });
            this.winAdd.listaPlantillas.each(function (_p, _index) {
                _p.getSmPrincipal().fireEvent = _p.getSmPrincipal().fireEvent.createSequence(function (e) {
                    if (_this.winAdd.getSelectedTabIndex() == _index && e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            _this.win.listaBotones.getItem(2).enable();
                        } else {
                            _this.win.listaBotones.getItem(2).disable();
                        }
                    }
                });
            });
            LOG.util.UIManager.encadenaFn(_this.winAdd, 'fireEvent', function (e) {
                _this.win.listaBotones.getItem(2).disable();
                if (e == 'tabchange') {
                    if (_this.winAdd.listaPlantillas.getItem(_this.winAdd.getSelectedTabIndex()).getSmPrincipal().getCount() > 0) {
                        _this.win.listaBotones.getItem(2).enable();
                    }
                }
            }, 'tabChange');
            LOG.util.UIManager.encadenaFn(_this.win, 'fireEvent', function (e) {
                if (e == 'show') {
                    _this.winAdd.listaPlantillas.each(function (p) {
                        p.getStorePrincipal().on({
                            beforeload: function () {
                                _this.win.listaBotones.getItem(2).disable();
                                Ext.apply(this.initBaseParams, {
                                    idestructura: _this.idDeposito,
                                    estado: 4,
                                    tipo: 2
                                });
                            }
                        });
                        p.getStorePrincipal().load();
                    });
                    _this.winAdd.activate(0);
                }
            }, 'showWin');
        }
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
                    formaVisualizacion: 'panel',
                    panelSuperior: false,
                    gridEditable: true,
                    ubicacion: true,
                    btnEliminar: true,
                    sm: _this.winGestionarDocumento.smGridDetalles,
                    parametros: {idpadre: _this.winGestionarDocumento.record.data.idpadre},
                    datos: {iddocumento: _this.winGestionarDocumento.record.data.iddocumento},
                    iddeposito: _this.idDeposito,
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
                _this.lote.addGridColumn({dataIndex: 'cantidadVieja'});
                Ext.apply(_this.lote.listaColumnas.getBy('dataIndex', 'descripcion'), {
                    hidden: true,
                    agrupador: true
                });
                _this.lote.insertToolbarButton(LOG.util.UIManager.createBtn({
                    iconCls: 'lote',
                    text: _this.idioma.lbBtnLote,
                    tooltip: _this.idioma.ttBtnLote,
                    hidden: true,
                    handler: function () {
                        var winLote = new LOG.lb.lote.adicionarLote({
                            idproducto: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idproducto,
                            idmovimiento: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idmovimiento,
                            iddocumento: _this.winGestionarDocumento.record.data.iddocumento,
                            idestructura: _this.idDeposito,
                            signo: _this.winGestionarDocumento.smGridDetalles.getSelected().json.signo,
                            parametros: {
                                idpadre: _this.modelo.idpadre
                            },
                            grantedAction: function (_p) {
                                return (_this.grantedAction(_p) && _this.winGestionarDocumento.record.data.estado == '1');
                            },
                            _postSalvarFn: function () {
                                _this.winGestionarDocumento.stGridDetalles.reload();
                            }
                        });
                        winLote.init();
                        Ext.apply(winLote.listaColumnas.getBy('dataIndex', 'existencia'), {
                            header: null
                        });
                        Ext.apply(winLote.listaColumnas.getBy('dataIndex', 'disponible'), {
                            header: _this.idioma.gcCantEntregada,
                            dataIndex: 'cantentregada',
                            width: 90
                        });
                        winLote.urlBusquedaGridPrincipal = 'cargarLotes';
                        winLote.view();
                    },
                    controlFn: function (b) {
                        if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                            && _this.winGestionarDocumento.record.data.estado == '1') {
                            b.show();
                        } else {
                            b.hide();
                        }
                    }
                }), 0);
                _this.lote.urlBusquedaGridPrincipal = 'cargarMovLote';
                Ext.apply(_this.lote.listaColumnas.getBy('dataIndex', 'cantidad'), {
                    editor: LOG.util.Prototipos.inputDecimal({})
                });
                var pos = _this.lote.listaColumnas.getPosByField('dataIndex', 'disponible');
                _this.lote.insertGridColumn(LOG.util.Prototipos.columnaCantidad({
                    header: _this.idioma.gcCantEntregada,
                    dataIndex: 'cantidadOrigen',
                    align: 'right',
                    width: 110,
                    default: true
                }), pos + 1);
                _this.formularioSur.add(_this.lote.view());
                _this.lote.getGridPrincipal().on({
                    beforeedit: function (e) {
                        if (!_this.grantedAction('CT') && !_this.grantedAction('RCRUD') && !_this.grantedAction('RAdicionar')) {
                            e.cancel = true;
                        } else {
                            if (_this.lote.sm.getSelected().json.decimales == '0') {
                                e.grid.getColumnModel().setEditor(e.column, LOG.util.Prototipos.inputEntero({}));
                            } else {
                                e.grid.getColumnModel().setEditor(e.column, LOG.util.Prototipos.inputDecimal({}));
                            }
                        }
                    },
                    afteredit: function (e) {
                        var record = _this.winGestionarDocumento.smGridDetalles.getSelected();
                        if ((_this.lote.modelo.getSumaCantidad() + (parseFloat(e.record.json.total) - _this.lote.getSumaCantidadVieja())) > (parseFloat(record.data.cantentregada) - parseFloat(record.json.resto))) {
                            e.record.data.cantidad = (parseFloat(record.data.cantentregada) - parseFloat(record.json.resto)) - ((_this.lote.modelo.getSumaCantidad() + (parseFloat(e.record.json.total) - _this.lote.getSumaCantidadVieja())) - parseFloat(e.record.data.cantidad));
                            mostrarMensaje(3, _this.idioma.msgErrorSumaTotal);
                        }
                        if (!e.value) {
                            e.record.data.cantidad = 0;
                        }
                        e.grid.view.refresh();
                    }
                });
                LOG.util.UIManager.encadenaFn(_this.lote.getGridPrincipal(), 'fireEvent', function (e, o) {
                    if (e == 'afteredit') {
                        if (o.record.data.idubicacion) {
                            _this.modelo.editarLote(o.record.data);
                        }
                    }
                }, 'editarGridLote');
                LOG.util.UIManager.encadenaFn(_this.lote.getStorePrincipal(), 'fireEvent', function (e) {
                    if (e == 'load') {
                        _this.modelo.listaLotes.deleteAll();
                    }
                }, 'recargarGridLote');
            });
        }
    },
    /**
     * Habilita o deshabilita los campos de entrada de datos.
     * @returns {undefined}
     */
    habilitarElementos: function () {
        if (this.winGestionarDocumento.tipoVentana == 2) {
            if (this.winGestionarDocumento.record.data.estado == '1') {
                this.taObservaciones.setDisabled(false);
            } else {
                this.taObservaciones.setDisabled(true);
            }
        } else {
            this.winGestionarDocumento.setTitle(this.idioma.tlAdicionar);
            this.taObservaciones.setDisabled(false);
        }
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
     * Devuelve el nombre del centro de costo por su id.
     * @param {Numeric} id
     * @returns {String}
     */
    getCentroCostoById: function (id) {
        for (var i = 0; i < this.centros.length; i++) {
            if (this.centros[i].idcentrogrupo == id) {
                return this.centros[i].descripcioncentrogrupo;
            }
        }
    },
    getParamsReport: function (record, btn) {
        var _this = this;
        return btn.isList ? {
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
            contabilizadopor: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null,
            creadopor: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
            fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d/m/Y') : null,
            fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d/m/Y') : null,
            tipodocumento: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null
        } : {
            useSign: this.useSign,
            hasCategoria: (usarCategoria) ? 'true' : 'false',
            iddocumento: record.get("iddocumento") || null,
            monedacontable: window.monedacontable || window.idcontable,
            monedaalternativa: window.monedaalternativa || window.idalternativa
        };
    },
    /**
     * Devuelve el nombre del tipo de documento por su iddoc.
     * @param {Numeric} id
     * @returns {String}
     */
    getNombreDoc: function (_value) {
        for (var i = 0; i < this.tipoDoc.length; i++) {
            if (this.tipoDoc[i].iddoc == _value)
                return this.tipoDoc[i].denominacion;
        }
        return '-';
    },
});


//Ventana para generar vales de devolución a parrtir de solicitudes de entrega y facturas.
LOG.inv.entrada.devolucion.docExterno = Ext.extend(LOG.util.UITemplate, {
    /**
     * @param {Object} config
     */
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.autoSelect = false;
        this.modoSeleccion = 1;
        this.dirController = '/logistica/inventario/entrada/entrada/index.php/devolucion';
        this.busquedaBasica = true;
        switch (config.idComponent) {
            case 0:
                this.concepto = config.idioma.ttBtnBucarEntrega;
                this.urlBusquedaGridPrincipal = 'cargarDocSalida';
                break;
            default:
                this.concepto = config.idioma.ttBtnBuscarFactura;
                this.urlBusquedaGridPrincipal = 'cargarDocFactura';
                break;
        }
        LOG.inv.entrada.devolucion.docExterno.superclass.constructor.call(this, config);
//        this.getVistaPrincipal().title = config.idioma.tlValeEntrega;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(700, 400);
    },
    initDefaultColumns: function () {
        this.addGridColumn({dataIndex: 'iddocumento'});
        this.addGridColumn({
            header: this.idioma.cgNroDoc,
            dataIndex: 'nrodoc',
            with: 80,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaCreado,
            width: 110,
            dataIndex: 'fechacontable',
            default: true
        });
        this.addGridColumn({
            header: (this.idComponent == 0 ? this.idioma.gcCentroCosto : this.idioma.gcCliente),
            autoExpand: true,
            dataIndex: (this.idComponent == 0 ? 'descripcliente' : 'cliente'),
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantProd,
            dataIndex: 'cantproductos',
            with: 100,
            align: 'right',
            default: true
        }));
    }
});
