Ext.ns('LOG.inv.entrada.recepcionreserva');
LOG.inv.entrada.recepcionreserva.View = Ext.extend(LOG.inv.entrada.recepcion.View, {
    /**
     * Determina si el depósito actual es de la reserva.
     */
    esreserva: false,
    /**
     * @param {Object} config
     */
    constructor: function(config) {
        config.model = new LOG.inv.entrada.recepcionreserva.Model({});
        LOG.inv.entrada.recepcionreserva.View.superclass.constructor.call(this, config);
    },
    /**
     * @param {type} _fn
     * @returns {undefined}
     */
    cargaInicial: function(_fn) {
        var _this = this;
        this.modelo.cargaInicial({
            url: '/logistica/inventario/entrada/entrada/index.php/recepcionreserva/cargaInicial'
        }, function(r) {
            _fn.createDelegate(_this, [r]).call();
            _this.datosIniciales(r);
            _this.depositos = r[0].depositos;
            _this.tipo = r[0].tipo;
            _this.acumulacion = r[0].acumulacion;
            if (_this.acumulacion == '1') {
                LOG.util.UIManager.apply(_this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'cantacumular'), {
                    hidden: true
                });
            }
        }, this.idioma.msgCargaInicial);
    },
    render: function() {
        var render = LOG.inv.entrada.recepcionreserva.View.superclass.render.call(this);
        var _this = this;
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function(e) {
            if (e == 'load') {
                _this.esreserva = false;
                for (var i = 0; i < _this.depositos.length; i++) {
                    if (_this.idDeposito == _this.depositos[i]) {
                        _this.esreserva = true;
                    }
                }
            }
        }, 'stProductos');
        return render;
    },
    /**
     * Inicializa los botones de la interfaz.
     * @returns {undefined}
     */
    initDefaultButtons: function() {
        LOG.inv.entrada.recepcionreserva.View.superclass.initDefaultButtons.call(this);
        var _this = this;
        Ext.apply(this.listaBotones.getItem(6), {
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RContabilizar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '2' && _this.tipo == 'EMPRESA'
                                && ((window.useSign && typeof pki == 'object') ? (this.getSelected().get('controlfirma') == 2) : true)) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'contabilizar2');
                } else {
                    b.setVisible(false);
                }
            }
        });
        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(3), {
            controlFn: function(b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RContabilizar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2'
                        && _this.tipo == 'EMPRESA' && ((useSign && typeof pki == 'object') ?
                            (_this.winGestionarDocumento.record.data.controlfirma == 2) : true)) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        Ext.apply(this.winGestionarDocumento.listaBotonesProductos.getBy('btnTarg', true), {
            handler: function() {
                var winCrearTarjeta = new LOG.lb.producto.Tarjeta({
                    idioma: _this.idioma,
                    _parent: _this,
                    postSalvar: function(r) {
                        _this.winGestionarDocumento.cargarProductos();
                        if (_this.winGestionarDocumento.record == null) {
                            _this.winGestionarDocumento.record = {};
                            Ext.apply(_this.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: _this.porfactura ? "13" : "1"
                                }
                            });
                        }
                        _this.winGestionarDocumento.getTitleDocumento(r.iddocumento);
                        _this.winGestionarDocumento.listaBotonesVentana.each(function(b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                            }
                        }, _this.winGestionarDocumento);
                    }
                });
                winCrearTarjeta.show();
            }
        });
        Ext.apply(this.winGestionarDocumento.listaBotonesProductos.getBy('btnProd', true), {
            handler: function() {
                var winProductos = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    parametros: {
                        idestructura: _this.idDeposito,
                        iddocumento: _this.modelo.iddocumento,
                        cuadroBasico: _this.esreserva || null
                    },
                    postSalvar: function(r) {
                        _this.winGestionarDocumento.cargarProductos();
                        if (_this.winGestionarDocumento.record == null) {
                            _this.winGestionarDocumento.record = {};
                            Ext.apply(_this.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: _this.porfactura ? "13" : "1"
                                }
                            });
                        } else {
                            _this.winGestionarDocumento.record.data.estado = "1";
                        }
                        _this.winGestionarDocumento.getTitleDocumento(_this.winGestionarDocumento.record.data.iddocumento);
                        _this.winGestionarDocumento.listaBotonesVentana.each(function(b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                            }
                        }, _this.winGestionarDocumento);
                        winProductos.getStorePrincipal().reload();
                        _this.winGestionarDocumento.modelo.getStore().reload();
                    }
                });
                if (_this.esreserva) {
                    winProductos.urlBusquedaGridPrincipal = _this.esreserva ? 'cargarProductosDocumento' : winProductos.urlBusquedaGridPrincipal;
                    winProductos.dirController = _this.esreserva ? '/logistica/inventario/entrada/entrada/index.php/recepcionreserva' : winProductos.dirController;
                }
                winProductos.init();
                _this.vistaProductos = winProductos.view();
                _this.vistaProductos.show();
                winProductos.storePrincipal.load();
            }
        });
    },
    /**
     * Inicializa las columnas de la ventana.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        var _this = this;
        LOG.inv.entrada.recepcionreserva.View.superclass.initDefaultColumns.call(this);
        // Bloque de columnas de la ventana adicionar.
        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'iddeposito'), {
            dataIndex: 'iddeposito_old'
        });
        this.addGridColumnProductos({
            header: this.idioma.gcReserva,
            encabezado: this.idioma.gcReserva,
            width: 60,
            dataIndex: 'reserva',
            renderer: function(_v, _mD, _r) {
                _mD.css = _r.json.idcuadrobasico ? 'log-activo' : 'log-inactivo';
            },
            reserva: true,
            default: true
        });
        this.addGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.gcCantReserva,
            encabezado: this.idioma.gcCantReserva,
            width: 120,
            dataIndex: 'cantacumular',
            editor: LOG.util.Prototipos.inputDecimal({
                camporeserva: true,
                allowBlank: false,
                invalidText: _this.idioma.msgCantidadNoValido,
                validate: function() {
                    var error = false;
                    if (_this.getGridPrincipal().rowEditor) {
                        var v = this, editor = _this.getGridPrincipal().rowEditor;
                        Ext.each(_this.getGridPrincipal().rowEditor.items.items, function(item) {
                            if (item.chek && !v.getValue()) {
                                v.markInvalid();
                                editor.fireEvent('validateedit', editor);
                                error = true;
                                return false;
                            }
                        });
                    }
                    if (!error) {
                        Ext.form.NumberField.superclass.validate.call(this);
                    }
                }
            }),
            renderer: function(_v, _mD, _r) {
                if (!_r.data.acumular) {
                    return null;
                }
                return _v;
            },
            reserva: true,
            default: true
        }));
        this.addGridColumnProductos({
            header: this.idioma.gcAcumular,
            encabezado: this.idioma.gcAcumular,
            dataIndex: 'acumular',
            width: 60,
            align: 'center',
            editor: new Ext.form.Checkbox({
                check: true,
                listeners: {
                    check: function(_ch, _v) {
                        if (_this.winGestionarDocumento.gridDetalles.rowEditor) {
                            var grid = _this.winGestionarDocumento.gridDetalles;
                            Ext.each(grid.rowEditor.items.items, function(item) {
                                if (item.camporeserva) {
                                    item.setDisabled(!_v);
                                    item.validate();
                                }
                            });
                        }
                    }
                }
            }),
            renderer: function(_v, _mD) {
                _mD.css = _v == 1 ? 'log-activo' : 'log-inactivo';
            },
            reserva: true,
            default: true
        });
        this.addGridColumnProductos({
            header: this.idioma.gcDeposito,
            encabezado: this.idioma.gcDeposito,
            width: 150,
            dataIndex: 'iddeposito',
            editor: new LOG.util.ComboBox({
                camporeserva: true,
                url: 'cargarDepositos',
                hiddenName: 'iddeposito',
                valueField: 'iddeposito',
                displayField: 'deposito',
                mode: 'remote',
                allowBlank: false,
                editable: false
            }),
            renderer: function(_v, _mD, _r) {
                if (_r.data.acumular && this.editor.getStore().find('iddeposito', _v) != -1) {
                    var deposito = this.editor.getStore().getById(_v).data.deposito;
                }
                return deposito || null;
            },
            reserva: true,
            default: true
        });
        // Fin del bloque.
    },
    initVentanaGestion: function(d, t) {
        LOG.inv.entrada.recepcionreserva.View.superclass.initVentanaGestion.call(this, d, t);
        if (this.esreserva) {
            this.winGestionarDocumento.ocultarColumna('iddeposito');
            this.winGestionarDocumento.ocultarColumna('acumular');
            this.winGestionarDocumento.ocultarColumna('cantacumular');
            this.winGestionarDocumento.ocultarColumna('reserva');
        } else {
            this.winGestionarDocumento.ocultarColumna('iddeposito', false);
            this.winGestionarDocumento.ocultarColumna('acumular', false);
            this.winGestionarDocumento.ocultarColumna('cantacumular', false);
            this.winGestionarDocumento.ocultarColumna('reserva', false);
        }
    },
    /**
     * Habilita o deshabilita la edicion del movimiento.
     * @returns {undefined}
     */
    habilitarEdicion: function() {
        var _this = this;
        var grid = this.winGestionarDocumento.gridDetalles;
        if (grid.rowEditor) {
            grid.rowEditor.on({
                beforeedit: function(e) {
                    this.disabledFields = new Array();
                    var rec = grid.getSelectionModel().getSelected();
                    if (LOG.util.UIManager.isRecordValue(rec, 'equipo', 1) || LOG.util.UIManager.isRecordValue(rec, 'municion', 1)
                        || LOG.util.UIManager.isRecordValue(rec, 'tienelote', 1)) {
                        grid.rowEditor.disabledFields.push('cantidad');
                    }
                    if (_this.winGestionarDocumento.record.data.estado != '13') {
                        grid.rowEditor.disabledFields.push('cantfactura');
                    }
                    if (_this.winGestionarDocumento.record.data.estado != '1') {
                        grid.rowEditor.disabledFields.push('cantidad');
                        grid.rowEditor.disabledFields.push('recargo');
                        grid.rowEditor.disabledFields.push('descuento');
                        grid.rowEditor.disabledFields.push('preciocontable');
                        grid.rowEditor.disabledFields.push('acumular');
                        grid.rowEditor.disabledFields.push('cantacumular');
                        grid.rowEditor.disabledFields.push('iddeposito');
                    }
                    if (_this.winGestionarDocumento.record != null && _this.winGestionarDocumento.record.data.estado != '1' &&
                        _this.winGestionarDocumento.record.data.estado != '13') {
                        return false;
                    }
                    if (rec.data.acumular == 0) {
                        grid.rowEditor.disabledFields.push('cantacumular');
                        grid.rowEditor.disabledFields.push('iddeposito');
                    }
                    if (!rec.json.idcuadrobasico) {
                        grid.rowEditor.disabledFields.push('acumular');
                    }
                    return true;
                },
                afteredit: function(e) {
                    if (!e.record.data.acumular) {
                        e.record.data.cantacumular = null;
                        e.record.data.iddeposito = null;
                    }
                    _this.winGestionarDocumento.editarProducto(e);
                }
            });
        } else {
            grid.on({
                beforeedit: function(e) {
                    this.disabledFields = new Array();
                    var rec = grid.getSelectionModel().getSelected();
                    if (_this.winGestionarDocumento.record != null && _this.winGestionarDocumento.record.data.estado != '1' &&
                        _this.winGestionarDocumento.record.data.estado != '13') {
                        return false;
                    }
                    if ((LOG.util.UIManager.isRecordValue(rec, 'equipo', 1) || LOG.util.UIManager.isRecordValue(rec, 'municion', 1)
                        || LOG.util.UIManager.isRecordValue(rec, 'tienelote', 1)) && e.field == 'cantidad') {
                        return false;
                    }
                    if (_this.winGestionarDocumento.record.data.estado != '13' && e.field == 'cantfactura') {
                        return false;
                    }
                    if (_this.winGestionarDocumento.record.data.estado != '1' && (e.field == 'cantidad' || e.field == 'recargo'
                        || e.field == 'descuento' || e.field == 'preciocontable' || e.field == 'cantacumular' || e.field == 'iddeposito')) {
                        return false;
                    }
                    if (rec.data.acumular == 0 && (e.field == 'cantacumular' || e.field == 'iddeposito')) {
                        return false;
                    }
                    if (!rec.json.idcuadrobasico && e.field == 'acumular') {
                        return false;
                    }
                    return true;
                },
                afteredit: function(e) {
                    if (!e.record.data.acumular) {
                        e.record.data.cantacumular = null;
                        e.record.data.iddeposito = null;
                    }
                    _this.winGestionarDocumento.editarProducto(e);
                }
            });
        }
    }
});
