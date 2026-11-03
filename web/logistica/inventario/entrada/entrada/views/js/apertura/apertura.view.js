Ext.ns('LOG.inv.entrada.apertura');
LOG.inv.entrada.apertura.View = Ext.extend(LOG.lb.documento.View, {
    name:'Apertura',
    cantSign:2,
    signDetails:{
        1: 'Elaborado por',
        2: 'Aprobado por'
    },
    dirReport:'/logistica/inventario/entrada/apertura/',
    /**
     *
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.concepto = config.idioma.ttBtnBuscar;
        this.busquedaBasica = true;
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        config.model = config.model || new LOG.inv.entrada.apertura.Model({});
        LOG.inv.entrada.apertura.View.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa los componentes.
     * @returns {undefined}
     */
    init: function() {
        LOG.inv.entrada.apertura.View.superclass.init.call(this);
        this.panelSuperior();
        if (alternativa) {
            this.initPanelMonedas();
        }
    },
    /**
     * @param {type} _fn
     * @returns {undefined}
     */
    cargaInicial: function(_fn) {
        this.modelo.cargaInicial({
            url: '/logistica/inventario/entrada/entrada/index.php/apertura/cargaInicial'
        }, _fn, this.idioma.msgCargaInicial);
    },
    view: function() {
        var _this = this;
        this.cargaInicial(function(r) {
            _this.usuarios = r[0].usuarios;
            _this.contintegrada = r[0].contintegrada == 1 ? true : false;
            _this.aprobados = r[0].aprobados;
            _this.depositos = r[0].depositos;
            LOG.lb.documento.View.superclass.view.call(_this);
        });
    },
    /**
     * Inicializa los botones de la ventana.
     * @returns {undefined}
     */
    initDefaultButtons: function() {
        LOG.inv.entrada.apertura.View.superclass.initDefaultButtons.call(this);
        // Bloque de botones de la interfaz principal.
        var _this = this;
        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(0), 'handler', function() {
            _this.habilitarElementos();
            _this.winGestionarDocumento.btnSalvar.enable();
        }, 'aperturaAdd');
        Ext.apply(this.listaBotones.getItem(0), {
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.show();
                    if (_caller.contintegrada && _caller.aprobados  && is_uh === undefined) {
                        b.hide();
                    }
                } else {
                    b.hide();
                }
                
            }
        });
        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(1), 'handler', function() {
            _this.habilitarElementos();
        }, 'aperturaVer');
        LOG.util.UIManager.apply(this.listaBotones.getItem(4), {id: 'idApertura'});
        this.insertToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            isContextual: true,
            disabled: true,
            handler: function() {
                _this.modelo.confirmar();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _this.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
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
            text: this.idioma.lbBtnAnularEstado,
            tooltip: this.idioma.ttBtnAnularEstado,
            isContextual: true,
            disabled: true,
            handler: function() {
                _this.modelo.anularestado();
            },
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
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
        this.insertToolbarButton(LOG.util.Prototipos.botonAprobar({
            tooltip: this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            handler: function() {
                _this.initVentanaGestion(_this.getGridPrincipal().getSelectionModel().getSelected(), 3);
                _this.habilitarElementos();
            },
            controlFn: function(b, _caller) {
                if ((_caller.grantedAction('CT') || _caller.grantedAction('RAprobar')) && !_this.contintegrada) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
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
        }), 5);
        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Importar',
            tooltip: 'Importar productos',
            iconCls: 'importar',
            isContextual: true,
            disabled: true,
            handler: function() {
                var win = new LOG.lb.importar.View({
                    class: 'AperturaModel',
                    params: {iddocumento: _this.getSmPrincipal().getSelected().get('iddocumento')},
                    fn: function(r) {
                        _this.getStorePrincipal().load();
                        if (r.error || parseInt(r.total) > parseInt(r.cantidad)) {
                            _this.mostrarError(
                                (!r.error ? _this.idioma.msjErrorImportar : (r.error == 1 ? _this.idioma.msjErrorTarjeta : _this.idioma.msjErrorValoresNoValidos)),
                                _this.getSmPrincipal().getSelected().get('iddocumento'),
                                (!r.error && parseInt(r.total) > parseInt(r.cantidad))
                                );
                        }
                    }
                });
                win.show();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '1') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'importar');
                } else {
                    b.setVisible(false);
                }
            }
        }), 6);
        // Fin del bloque.

        // Bloque de botones de la ventana adicionar.
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarDoc,
            fn: function() {
                _this.modelo.eliminar({id: _this.modelo.iddocumento}, function() {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function(b) {
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
            fn: function() {
                _this.modelo.confirmar({id: _this.modelo.iddocumento}, function() {
                    _this.winGestionarDocumento.cargarProductos();
                    Ext.apply(_this.winGestionarDocumento.record.data, {estado: '2'});
                    _this.winGestionarDocumento.listaBotonesVentana.each(function(b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos();
                });
            },
            controlFn: function(b) {
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
            tooltip: this.idioma.ttBtnAnularEstado,
            fn: function() {
                _this.modelo.anularestado({id: _this.modelo.iddocumento}, function(r) {
                    _this.winGestionarDocumento.cargarProductos();
                    Ext.apply(_this.winGestionarDocumento.record.data, {estado: '1'});
                    _this.winGestionarDocumento.listaBotonesVentana.each(function(b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos();
                });
            },
            controlFn: function(b) {
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
            fn: function() {
                _this.modelo.aprobar({id: _this.modelo.iddocumento}, function(r) {
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        _this.winGestionarDocumento.close();
                    } else {
                        _this.winGestionarDocumento.cargarProductos();
                        Ext.apply(_this.winGestionarDocumento.record.data, {estado: '3'});
                        _this.winGestionarDocumento.listaBotonesVentana.each(function(b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                            }
                        }, _this.winGestionarDocumento);
                    }
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                });
                _this.habilitarElementos();
            },
            controlFn: function(b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RAprobar')) && !_this.contintegrada) {
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
            text: 'Importar',
            tooltip: 'Importar productos',
            iconCls: 'importar',
            disabled: true,
            fn: function() {
                var win = new LOG.lb.importar.View({
                    class: 'AperturaModel',
                    params: {iddocumento: _this.winGestionarDocumento.record.data.iddocumento},
                    fn: function(r) {
                        _this.winGestionarDocumento.stGridDetalles.load();
                        _this.getStorePrincipal().load();
                        if (r.error || parseInt(r.total) > parseInt(r.cantidad)) {
                            _this.mostrarError(
                                (!r.error ? _this.idioma.msjErrorImportar : (r.error == 1 ? _this.idioma.msjErrorTarjeta : _this.idioma.msjErrorValoresNoValidos)),
                                _this.winGestionarDocumento.record.data.iddocumento,
                                (!r.error && parseInt(r.total) > parseInt(r.cantidad))
                                );
                        }
                    }
                });
                win.show();
            },
            controlFn: function(b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) && _this.winGestionarDocumento.tipoVentana != 3) {
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
        // Botones de la interfaz aprobar.
        this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonAnularEstado({
            hidden: true,
            handler: function() {
                _this.modelo.anularestado({id: _this.modelo.iddocumento}, function() {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function(b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.show();
                    } else {
                        b.hide();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
        // Fin del bloque.

        // Bloque de botones del panel de productos de la ventana adicionar.
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesProductos.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarProd,
            disabled: true,
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function(e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() > 0 && _this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'eliminarProd');
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        var btnTarjeta = LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: this.idioma.lbBtnCrearTarjeta,
            tooltip: this.idioma.ttBtnCrearTarjeta,
            handler: function() {
                var winCrearTarjeta = new LOG.lb.producto.Tarjeta({
                    idioma: _this.idioma,
                    _parent: _this,
                    idestructura: _this.idDeposito,
                    postSalvar: function(r) {
                        _this.winGestionarDocumento.cargarProductos();
                        if (_this.winGestionarDocumento.record == null) {
                            _this.winGestionarDocumento.record = {};
                            Ext.apply(_this.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    numeroref: r.numeroref,
                                    fechacontable: r.fechacontable,
                                    estado: "1"
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
            },
            fnEspecialCondition: function() {
                if ((!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record &&
                    _this.winGestionarDocumento.record.data.estado == '1')) && (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) {
                    return false;
                }
                return true;
            },
            controlFn: function(b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
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
        this.insertToolbarButtonProductos(btnTarjeta, 0);
        this.modelo.addActionButton(btnTarjeta, true);

//        var btnModTarjeta = LOG.util.UIManager.createBtn({
//            iconCls: 'modificar',
//            text: this.idioma.lbBtnCrearTarjeta,
//            tooltip: this.idioma.ttBtnCrearTarjeta,
//            handler: function() {
//                var winCrearTarjeta = new LOG.lb.producto.Tarjeta({
//                    idioma: _this.idioma,
//                    _parent: _this,
//                    idProducto : _this.winGestionarDocumento.smGridDetalles.getSelected().data.idproducto
//                });
//                winCrearTarjeta.show();
//            },
//            fnEspecialCondition: function() {
//                if ((!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record &&
//                    _this.winGestionarDocumento.record.data.estado == '1')) && (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) {
//                    return false;
//                }
//                return true;
//            },
//            controlFn: function(b) {
//                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
//                    b.setVisible(true);
//                    if (_this.winGestionarDocumento.tipoVentana == 3) {
//                        b.hide();
//                    } else {
//                        b.show();
//                    }
//                } else {
//                    b.setVisible(false);
//                }
//            }
//        });
//        this.insertToolbarButtonProductos(btnModTarjeta, 1);
//        this.modelo.addActionButton(btnModTarjeta, true);

        this.winGestionarDocumento.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'ubicarproducto',
            text: this.idioma.lbBtnUbicar,
            tooltip: this.idioma.ttBtnUbicar,
            disabled: true,
            handler: function() {
                LOG.inv.ubicacion.Loader.init(function() {
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
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function(e) {
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
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.winGestionarDocumento.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'lote',
            text: this.idioma.lbBtnLote,
            tooltip: this.idioma.ttBtnLote,
            disabled: true,
            handler: function() {
                var selected = _this.winGestionarDocumento.smGridDetalles.getSelected()
                LOG.lb.lote.Loader.init(function() {
                    var winLote = new LOG.lb.lote.Ventana({
                        sm: _this.winGestionarDocumento.smGridDetalles,
                        st: _this.winGestionarDocumento.stGridDetalles,
                        iddeposito: _this.idDeposito,
                        ubicacion: true,
                        usaMonedas: true,
                        compraVenta: 2,
                        region:'center',
                        modal: true,
                        width: 950,
                        height: 500,
                        title: _this.idioma.tlVentanaLote,
                        confubicacion: confubicacion,
                        fecha: fecha,
                        grantedAction: function(_p) {
                            return (_this.grantedAction(_p) && _this.winGestionarDocumento.record.data.estado == '1');
                        },
                        cerrarFn: function() {
                            console.info(_this)
                            _this.winGestionarDocumento.stGridDetalles.reload();
                        },
                        parametros : {
                            iddocumento : _this.modelo.iddocumento,
                            idproducto: (selected)?selected.json.idproducto:null
                        }
                    });
                    //winLote.init();
                    winLote.show();
                });
            },
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function(e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && this.getSelected().json.tienelote == 1) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'lote');
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.winGestionarDocumento.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'numeroserie',
            text: this.idioma.lbBtnNoSerie,
            tooltip: this.idioma.ttBtnNoSerie,
            disabled: true,
            handler: function() {
                LOG.lb.numeroserie.Loader.init(function() {
                    var winNroSerie = new LOG.lb.numeroserie.Entrada({
                        producto: _this.winGestionarDocumento.smGridDetalles.getSelected().data,
                        documento: _this.winGestionarDocumento.record.data,
                        idestructura: _this.idDeposito,
                        confubicacion: confubicacion,
                        fecha: fecha,
                        cerrarFn: function() {
                            _this.winGestionarDocumento.stGridDetalles.reload();
                        }
                    });
                    winNroSerie.init();
                    winNroSerie.view();
                });
            },
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function(e) {
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
                handler: function() {
                    var municiones = new LOG.inv.municiones.View({
                        idestructura: _this.idDeposito,
                        producto: _this.winGestionarDocumento.smGridDetalles.getSelected().data,
                        documento: _this.winGestionarDocumento.record.data,
                        confubicacion: confubicacion,
                        desglose: false,
                        fecha: fecha,
                        grantedAction: function(_p) {
                            return _this.grantedAction(_p);
                        },
                        cerrarFn: function() {
                            if (_this.winGestionarDocumento.record.data.estado == '1') {
                                _this.winGestionarDocumento.stGridDetalles.reload();
                            }
                        }
                    });
                    municiones.show();
                },
                controlFn: function(b, _caller) {
                    if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                        b.setVisible(true);
                        if (_this.winGestionarDocumento.tipoVentana == 3) {
                            b.hide();
                        } else {
                            b.show();
                            LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function(e) {
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
        if (alternativa) {
            this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
                iconCls: 'deposito',
                text: this.idioma.lbBtnMonedas,
                tooltip: this.idioma.ttBtnMonedas,
                disabled: true,
                handler: function() {
                    if (_this.formularioSur.collapsed) {
                        _this.monedas.getStorePrincipal().load();
                        _this.formularioSur.show();
                        _this.formularioSur.expand();
                        _this.winGestionarDocumento.doLayout();
                    }
                },
                controlFn: function(b, _caller) {
                    if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function(e) {
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
        // Fin del bloque.
    },
    initDefaultColumns: function() {
        var _this = this;
        LOG.inv.entrada.apertura.View.superclass.initDefaultColumns.call(this);
        this.addGridColumn({dataIndex: 'controlfirma'});
        this.addGridColumn({dataIndex: 'idnodo'});
        this.addGridColumn({dataIndex: 'iddoc'});
        this.addGridColumn({dataIndex: 'idestructuracomun'});
        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'nomcategoria'), {
            editor: new Ext.erp.comboNomenclador({
                controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
                modelo: 'NomCategoriasproducto',
                idnom: 'idcategoria',
                name: 'categoria',
                autoCargar: true,
                allowBlank: false
            }),
            renderer: function(_v, _mD, _r) {
                if (this.editor.getStore().getCount() > 0) {
                    var record = this.editor.getStore().getById(_v);
                    _r.data.idcategoria = record ? record.get('idcategoria') : _r.data.idcategoria;
                    _r.data.nomcategoria = record ? record.get('denominacion') : _r.data.nomcategoria;
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
            LOG.util.UIManager.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'importe'), {
                header: this.idioma.cgImporte + ' ' + codContable,
                width: 90
            });
			Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'preciocontable'), {
                editor: LOG.util.Prototipos.inputDecimal({})
            });
			Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'precioalternativo'), {
                editor: LOG.util.Prototipos.inputDecimal({})
            });
        } else {
            Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'preciocontable'), {
                editor: LOG.util.Prototipos.inputDecimal({})
            });
        }
        var pos = this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'cantidad', 'header');
        
        this.insertGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.gcMinimo,
            width: 100,
            align: 'right',
            dataIndex: 'minimo',
            editor: LOG.util.Prototipos.inputDecimal({value: 0}),
            renderer: function(_v, _mD, _r) {
                _r.data.minimo = _v || 0;
                return _r.data.minimo;
            },
            default: true
        }), pos);
        this.insertGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.gcMaximo,
            width: 100,
            align: 'right',
            dataIndex: 'maximo',
            editor: LOG.util.Prototipos.inputDecimal({value: 0}),
            renderer: function(_v, _mD, _r) {
                _r.data.maximo = _v || 0;
                return _r.data.maximo;
            },
            default: true
        }), pos + 1);
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
            renderer: function(_v, _mD, _r) {
                if (_this.cargado) {
                    _r.data.idunidadmedida = Ext.isNumber(parseInt(_v)) ? _v : _r.json.idunidadmedida;
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
                name: 'idclasificacioncontable',
                autoCargar: true,
                pageSize: 30,
                resizable: true,
                listWidth: 300
            }),
            renderer: function(_v, _mD, _r) {
                _r.data.idclasificacioncontable = _v || _r.data.clasificacioncont;
                var record = this.editor.getStore().getById(_r.data.idclasificacioncontable);
                return record ? record.data.denominacion : _r.json.clasificacioncont;
            }
        });
    },
    panelSuperior: function() {
        var _this = this;
        this.formularioGeneral = LOG.util.UIManager.initPanel({
            layout: 'form',
            labelAlign: 'top',
            items: [
                new Ext.form.TextArea({
                    fieldLabel: _this.idioma.lbTaObservaciones,
                    name: 'observaciones',
                    width: '98%',
                    minLength: 2,
                    maxLength: 255
                })
            ]
        });
    },
    initVentanaGestion: function(d, t) {
        var _this = this;
        Ext.apply(this.winGestionarDocumento, {
            salvarHandler: function(params) {
                var _t = this.scope || this;
                params = params || {
                    idestructuracomun: _t.scope ? _t.scope.idDeposito : null
                };
                _t.modelo.salvar(params, function(r) {
                    if (_t.modelo.listaMonedas.count() || _t.modelo.listaProductos.count() || r.reloadGridDetalle == 1) {
                        _t.cargarProductos();
                    }
                    _t.tipoVentana = 2;
                    if (_t.record == null) {
                        _t.record = {};
                        Ext.apply(_t.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1"
                            }
                        });
                    }
                    _t.getTitleDocumento(r.iddocumento);
                    _t.listaBotonesVentana.each(function(b) {
                        LOG.util.UIManager.applyKey(b, _t);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_t, [b, _t]).call();
                        }
                    }, _t);
                    if (alternativa) {
                        _this.monedas.listaBotones.each(function(b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(_this.monedas));
                    }
                });
            },
            controlFnGuardar: function(b, nuevo) {
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
        }, this.winGestionarDocumento);
        LOG.inv.entrada.apertura.View.superclass.initVentanaGestion.call(this, d, t);
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.btnNuevo, 'handler', function() {
            _this.winGestionarDocumento.tipoVentana = 1;
            _this.habilitarElementos();
            _this.winGestionarDocumento.btnSalvar.enable();
        });
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.stGridDetalles, 'fireEvent', function(e, o) {
            if (e == 'beforeload') {
                o.commitChanges();
                _this.modelo.listaProductos = new LOG.util.List();
                _this.modelo.listaMonedas = new LOG.util.List();
                _this.modelo.habilitarBotones(!_this.modelo.isValid());
            }
        }, 'stProductos');
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.gridDetalles, 'fireEvent', function(e, o) {
            if (e == 'beforeedit') {
                if (o.field == 'cantidad' && (o.record.json.tienelote == '1' || o.record.json.equipo == '1'
                    || o.record.json.municion == '1') || ((o.field == 'idclasificacioncontable' || o.field == 'umedida')
                    && o.record.json.cronologia > 0)) {
                    o.cancel = true;
                }
            }
        }, 'editar');
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.smGridDetalles, 'fireEvent', function(e) {
            if (e == 'selectionchange') {
                if (_this.monedas) {
                    _this.monedas.getStorePrincipal().removeAll();
                }
                if (this.getCount() == 1) {
                    if (_this.winGestionarDocumento.record.data.estado == '1') {
                        _this.cbUM.getStore().removeAll();
                        _this.cbUM.getStore().load({
                            params: {
                                idindicador: this.getSelected().json.idindicador
                            },
                            callback: function() {
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
    },
    /**
     * Iniciliza el panel de monedas.
     * @returns {undefined}
     */
    initPanelMonedas: function() {
        var _this = this;
        this.monedas = new LOG.inv.entrada.apertura.Monedas({
            idioma: this.idioma,
            modelo: this.modelo,
            scope: this.winGestionarDocumento,
            grantedAction: function(_p) {
                return (_this.grantedAction(_p) && _this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1');
            }
        });
        this.monedas.init();
        this.formularioSur = LOG.util.UIManager.initPanel({
            title: this.idioma.tlPanelMonedas,
            titleCollapse: true,
            animCollapse: false,
            collapsible: true,
            collapsed: true,
            region: 'south',
            layout: 'fit',
            height: 200,
            minSize: 200,
            maxSize: 400,
            split: true,
            hidden: true,
            items: [this.monedas.view()],
            listeners: {
                expand: function(_p) {
                    _p.show();
                    _this.monedas.listaBotones.each(function(b) {
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(this, [b, this]).call();
                        }
                    }.createDelegate(_this.monedas));
                    _this.winGestionarDocumento.doLayout();
                },
                collapse: function(_p) {
                    _p.hide();
                    _this.winGestionarDocumento.doLayout();
                }
            }
        });
    },
    /**
     * Habilita o deshabilita los elementos del panel de datos de acuerdo al estado del documento.
     * @returns {undefined}
     */
    habilitarElementos: function() {
        if (this.winGestionarDocumento.tipoVentana == '3') {
            this.winGestionarDocumento.panelSuperior.setVisible(false);
            this.winGestionarDocumento.doLayout();
//            this.winGestionarDocumento.buttons[1].hide();
//            this.winGestionarDocumento.buttons[2].hide();
        } else {
            this.winGestionarDocumento.panelSuperior.setVisible(true);
            this.winGestionarDocumento.doLayout();
            if (this.winGestionarDocumento.record /*this.winGestionarDocumento.tipoVentana == 2*/) {
                if (this.winGestionarDocumento.record.data.estado == '1') {
                    this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(false);
//                    this.winGestionarDocumento.buttons[2].show();
                } else {
                    this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(true);
//                    this.winGestionarDocumento.buttons[2].hide();
                }
//                if (this.winGestionarDocumento.record.data.estado > 2) {
//                    this.winGestionarDocumento.buttons[1].hide();
//                }
//                else {
//                    this.winGestionarDocumento.buttons[1].show();
//                }
            } else {
                this.winGestionarDocumento.setTitle(this.idioma.tlAdicionar);
                this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(false);
//                this.winGestionarDocumento.buttons[1].show();
//                this.winGestionarDocumento.buttons[2].show();
            }
        }
        this.winGestionarDocumento.onShowHandler();
    },
    getParamsReport:function(record,btn){
        var _this = this;
        return btn.isList ? {
             iddeposito: this.idDeposito ? this.idDeposito : null,
             idestado: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
             contabilizadopor: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
             creadopor: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
             fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d/m/Y') : null,
             fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d/m/Y') : null
        }:{
            monedacontable: window.monedacontable || window.idcontable,
            monedaalternativa: window.monedaalternativa || window.idalternativa,
            iddeposito: this.idDeposito ? this.idDeposito : null,
            hasCategoria: (window.usarCategoria) ? 'true' : 'false',
            iddocumento: record.get("iddocumento"),
            isMinfar: (esminfar) ? 'true' : 'false',
            hasArmamento: (confArmamento) ? 'true' : 'false'
        };
    },
    /**
     * 
     * @param {String} msg
     * @param {Numeric} id
     * @param {Boolean} diferencia
     * @returns {undefined}
     */
    mostrarError: function(msg, id, diferencia) {
        var _this = this;
        Ext.MessageBox.show({
            title: 'Error',
            msg: msg,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR,
            fn: function() {
                var win = new LOG.inv.entrada.Error({idioma: _this.idioma, iddocumento: id, diferencia: diferencia});
                win.init();
                win.view();
            }
        });
    }
});


/**
 * Plantilla tipo panel para la gestión de las monedas.
 * @type LOG.util.UITemplate
 */
LOG.inv.entrada.apertura.Monedas = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.urlBusquedaGridPrincipal = 'cargarMonedas';
        this.gridEditable = true;
        this.modoSeleccion = 1;
        this.bbarVisible = false;
        LOG.inv.entrada.apertura.Monedas.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnAdicionar,
            tooltip: this.idioma.ttBtnAdicionarMoneda,
            iconCls: 'adicionar',
            hidden: true,
            handler: function() {
                _this.getStorePrincipal().add(new Ext.data.Record({
                    idmovimiento: _this.idmovimiento,
                    precio: 0,
                    importe: 0
                }));
            },
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function(e) {
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
            handler: function() {
                if (_this.getSmPrincipal().getSelected().data.idmovmoneda) {
                    _this.modelo.eliminarMonedas({idmovmoneda: _this.getSmPrincipal().getSelected().data.idmovmoneda}, function() {
                        _this.scope.stGridDetalles.load();
                    });
                } else {
                    _this.editarMonedas(_this.getStorePrincipal(), _this.getSmPrincipal().getSelected(), true);
                    _this.getStorePrincipal().remove(_this.getSmPrincipal().getSelected());
                }
            },
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
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
    initDefaultColumns: function() {
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
                focus: function(_cb) {
                    _cb.getStore().filterBy(function(item) {
                        return _this.getStorePrincipal().find('idmoneda', item.data.idmoneda) == -1;
                    });
                }
            }
        });
        this.monedas.getStore().on({
            load: function(_st) {
                _this.monedas.cantidad = _st.getCount();
                _st.filterBy(function(item) {
                    return _this.getStorePrincipal().find('idmoneda', item.data.idmoneda) == -1;
                });
            }
        })
        this.addGridColumn({
            header: this.idioma.gcTipoMoneda,
            width: 120,
            dataIndex: 'idmoneda',
            editor: this.monedas,
            renderer: function(_v, _mD, _r) {
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
            editor: LOG.util.Prototipos.inputDecimal({
                precio: true,
                allowBlank: false,
                enableKeyEvents: true,
                invalidText: _this.idioma.msgPrecioVacio,
                validate: function() {
                    if (!this.getValue()) {
                        this.markInvalid();
                        return false;
                    }
                    return Ext.form.NumberField.superclass.validate.call(this);
                }
            }),
            renderer: function(_v, _mD, _r) {
                _r.data.precio = _v || 0;
                return _r.data.precio;
            },
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
    render: function() {
        var render = LOG.inv.entrada.apertura.Monedas.superclass.render.call(this);
        var _this = this;
        this.getGridPrincipal().on({
            beforeedit: function() {
                return (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'));
            },
            afteredit: function(e) {
                _this.editarMonedas(e.grid.getStore(), e.record);
                e.grid.view.refresh();
            }
        });
        this.getStorePrincipal().on({
            beforeload: function() {
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
    editarMonedas: function(store, record, borrar) {
        var _this = this;
        this.modelo.listaMonedas = new LOG.util.List();
        store.each(function(item) {
            if (record.data.idmoneda && (!borrar || (borrar && record.data.idmoneda != item.data.idmoneda))) {
                _this.modelo.editarMoneda(item.data);
            }
        });
    }
});


/**
 * Modelo del componente para el manejo de datos.
 */
LOG.inv.entrada.apertura.Model = Ext.extend(LOG.lb.documento.Model, {
    listaMonedas: null,
    /**
     * @param {Object} config
     */
    constructor: function(config) {
        this.listaMonedas = new LOG.util.List({});
        this.urlAccionEliminarMoneda = 'eliminarMoneda';
        LOG.inv.entrada.apertura.Model.superclass.constructor.call(this, config);
    },
    /**
     * Funcion para adicionar un producto al grid cuando este fue editado
     * @param {type} p
     * @returns {undefined}
     */
    adicionarProducto: function(p) {
        var currentIndex = -1;
        this.listaProductos.each(function(_p, index) {
            if (_p.idmovimiento == p.idmovimiento) {
                currentIndex = index;
            }
        });
        var pModel = null;
        if (currentIndex == -1) {
            var pModel = new LOG.util.Model({
                fields: [{
                        name: 'idmovimiento',
                        primary: true
                    },
                    {name: 'idproducto'},
                    {name: 'minimo'},
                    {name: 'maximo'},
                    {name: 'cantidad'},
                    {name: 'idcategoria'},
                    {name: 'idunidadmedida'},
                    {name: 'importefinal'},
                    {name: 'preciocontable'},
                    {name: 'importe'},
                    {name: 'precioalternativo'},
                    {name: 'idclasificacioncontable'}
                ]
            });
        } else {
            pModel = this.listaProductos.getItem(currentIndex);
        }

        pModel.apply(p);
        this.listaProductos.setItem(pModel, currentIndex);
        this.habilitarBotones();
    },
    /**
     * @param {Object} moneda
     * @returns {undefined}
     */
    editarMoneda: function(moneda) {
        var index = -1;
        this.listaMonedas.each(function(_m, _i) {
            if ((moneda.idmovmoneda && _m.idmovmoneda == moneda.idmovmoneda) || (!moneda.idmovmoneda && _m.idmoneda == moneda.idmoneda)) {
                index = _i;
            }
        });
        if (index == -1) {
            this.listaMonedas.add(moneda);
        } else {
            this.listaMonedas.setItem(moneda, index);
        }
        this.habilitarBotones(!this.isValid());
    },
    /**
     * Elimina las monedas seleccionadas.
     * @param {Object} parametros
     * @param {function} _fn
     * @param {function} _fnFail
     * @returns {undefined}
     */
    eliminarMonedas: function(parametros, _fn, _fnFail) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgDeleteMoneda, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoMoneda, this.idioma.msgEspere || '...');
                var objSubmit = parametros;
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminarMoneda,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, _this.idioma.msgMonedaEliminada);
                            _this.st.reload();
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    },
    /**
     * Codifica los datos que serán procesados.
     * @param {Object} o
     * @returns {Object}
     */
    encode: function(o) {
        var objDoc = LOG.inv.entrada.apertura.Model.superclass.encode.call(this, o);
        objDoc.monedas = new Array();
        this.listaMonedas.each(function(_m) {
            objDoc.monedas.push(_m);
        });
        return objDoc;
    },
    /**
     * Determina si es válido el formulario de datos.
     * @returns {Boolean}
     */
    isValid: function() {
        return (LOG.inv.entrada.apertura.Model.superclass.isValid.call(this) || (this.basicForm.isValid() && this.listaMonedas.count() > 0));
    },
    /**
     * Establece los valores actuales de los campos del formulario como valores por defecto.
     * @returns {undefined}
     */
    setDefaulFormValues: function() {
        LOG.inv.entrada.apertura.Model.superclass.setDefaulFormValues.call(this);
        this.listaMonedas.deleteAll();
    }
});


/**
 * 
 * @type LOG.util.UITemplate
 */
LOG.inv.entrada.Error = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.formaVisualizacion = 'ventana';
        this.urlBusquedaGridPrincipal = 'cargarProductoError';
        this.autoLoad = false;
        this.autoSelect = false;
        LOG.inv.entrada.Error.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = config.idioma.tlError;
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({dataIndex: 'idimpapertura'});
        this.addGridColumn({
            header: this.idioma.gcNro,
            width: 30,
            dataIndex: 'nro',
            align: 'right',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcCodigo,
            width: 80,
            dataIndex: 'codigoproducto',
            renderer: function(_v) {
                return _v || _this.idioma.gcCodigoVacio;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcDenominacion,
            autoExpand: true,
            dataIndex: 'descripcionproducto',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcUM,
            width: 40,
            dataIndex: 'um',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcCategoria,
            width: 80,
            dataIndex: 'categoria',
            renderer: function(_v) {
                return _v || '-';
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcFechaFabricacion,
            width: 100,
            dataIndex: 'fechafabricacion',
            renderer: function(_v, _mD, _r) {
                var pos = -1;
                if (_r.json.errorfecha) {
                    pos = _r.json.errorfecha.indexOf('1');
                }
                return _v || (pos != -1 ? _this.idioma.gcFechaNoValida : '-');
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcFechaVencimiento,
            width: 100,
            dataIndex: 'fechavencimiento',
            renderer: function(_v, _mD, _r) {
                var pos = -1;
                if (_r.json.errorfecha) {
                    pos = _r.json.errorfecha.indexOf('2');
                }
                return _v || (pos != -1 ? _this.idioma.gcFechaNoValida : '-');
            },
            default: true
        });
        // Lote.
        this.addGridColumn({
            header: this.idioma.gcFechaProduccion,
            width: 120,
            dataIndex: 'fechaproduccion',
            renderer: function(_v, _mD, _r) {
                var pos = -1;
                if (_r.json.errorfecha) {
                    pos = _r.json.errorfecha.indexOf('3');
                }
                return _v || (pos != -1 ? _this.idioma.gcFechaNoValida : _r.json.cantidadlote ? _this.idioma.gcFechaVacia : '-');
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcFechaVencimientoLote,
            width: 120,
            dataIndex: 'fechavencimientolote',
            renderer: function(_v, _mD, _r) {
                var pos = -1;
                if (_r.json.errorfecha) {
                    pos = _r.json.errorfecha.indexOf('4');
                }
                return _v || (pos != -1 ? _this.idioma.gcFechaNoValida : '-');
            },
            default: true
        });
    },
    render: function() {
        var _this = this;
        var render = LOG.inv.entrada.Error.superclass.render.call(this);
        if (!_this.diferencia) {
            this.leyenda = new LOG.lb.plugin.Leyenda({
                leyendAlign: 'bot-left',
                leyendContainer: this.getGridPrincipal(),
                leyendConfig: this.getLeyenda()
            });
            this.getGridPrincipal().getBottomToolbar().insert(this.getGridPrincipal().getBottomToolbar().items.length - 1, this.leyenda);
            this.getGridPrincipal().getBottomToolbar().insert(this.getGridPrincipal().getBottomToolbar().items.length - 1, '-');
        }
        this.getStorePrincipal().on({
            beforeload: function() {
                this.baseParams.iddocumento = this.initBaseParams.iddocumento = _this.iddocumento;
                this.baseParams.diferencia = this.initBaseParams.diferencia = _this.diferencia || null;
            },
            load: function() {
                this.each(function(p, index) {
                    if (p.json.codigoproducto && !p.json.rangop && !p.json.rangol && !p.json.sinfecha && !p.json.actualp && !p.json.actuall) {
                        if (p.json.errorfecha && p.json.errorfecha.indexOf('5') != -1) {
                            Ext.fly(_this.getGridPrincipal().getView().getRow(index)).addClass('fila-azul');
                        }
                        if (p.json.duplicado) {
                            Ext.fly(_this.getGridPrincipal().getView().getRow(index)).addClass('fila-verde');
                        }
                    }
                    if (!p.json.codigoproducto) {
                        Ext.fly(_this.getGridPrincipal().getView().getCell(index, 3)).addClass('fila-roja');
                    }
                    if (!p.json.sinfecha && !p.json.errorfecha) {
                        if (p.json.rangop && !p.json.actualp) {
                            Ext.fly(_this.getGridPrincipal().getView().getCell(index, 7)).addClass('fila-naranja');
                            Ext.fly(_this.getGridPrincipal().getView().getCell(index, 8)).addClass('fila-naranja');
                        }
                        if (p.json.rangol && !p.json.actuall) {
                            Ext.fly(_this.getGridPrincipal().getView().getCell(index, 9)).addClass('fila-naranja');
                            Ext.fly(_this.getGridPrincipal().getView().getCell(index, 10)).addClass('fila-naranja');
                        }
                    }
                    if (p.json.sinfecha) {
                        Ext.fly(_this.getGridPrincipal().getView().getCell(index, 9)).addClass('fila-marron');
                    }
                    if (p.json.actualp) {
                        Ext.fly(_this.getGridPrincipal().getView().getCell(index, 7)).addClass('fila-violeta');
                    }
                    if (p.json.actuall) {
                        Ext.fly(_this.getGridPrincipal().getView().getCell(index, 9)).addClass('fila-violeta');
                    }
                    if (p.json.errorfecha) {
                        var error = p.json.errorfecha.trim().split(' ');
                        Ext.each(error, function(e) {
                            if (parseInt(e) < 5) {
                                Ext.fly(_this.getGridPrincipal().getView().getCell(index, (parseInt(e) + 6))).addClass('fila-violeta');
                            }
                        });
                    }
                });
            }
        });
        this.getStorePrincipal().load();
        this.getVistaPrincipal().closeFn = function() {
            Ext.Ajax.request({
                url: 'eliminarImportar',
                method: 'POST',
                params: {iddocumento: _this.iddocumento}
            });
        };
        return render;
    },
    getLeyenda: function() {
        return {
            autoWidth: true,
            autoHeight: true,
            tpl: new Ext.XTemplate(
                '<div class="leyend-block">',
                '<h3>' + this.idioma.lbTipoError + '</h3>',
                '<ul>',
                '<li style="color:#00CCFF;">' + this.idioma.lbTarjetaExistencte + '</li>',
                '<li style="color:#00CC33;">' + this.idioma.lbProductoRepetido + '</li>',
                '<li style="color:red;">' + this.idioma.lbCodigoProductoFaltante,
                '<li style="color:violet;">' + this.idioma.lbFechaNoValida + '</li>',
                '<li style="color:#FF9933;">' + this.idioma.lbRangoFecha + '</li>',
                '<li style="color:#cccc00;">' + this.idioma.lbFechaVacia + '</li>',
                '</ul>',
                '</div>'
                )
        };
    }
});