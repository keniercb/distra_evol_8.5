Ext.ns('LOG.inv.cambioclasificacioncontable');
/**
 * Plantilla configurable para la gestion de productos genericos.
 * @type LOG.util.UITemplate
 */
LOG.inv.cambioclasificacioncontable = Ext.extend(LOG.lb.documento.View, {
    name: 'CambioClasificacion',
    cantSign: 0,
    signDetails: {},
    dirReport: '/logistica/inventario/movimiento/cambioclasificacion/',
    /**
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.busquedaBasica = true;
        this.concepto = config.idioma.ttBtnBuscarDoc;
        this.autoSelect = false;	
        this.modoSeleccion = 1;
        config.model = new LOG.inv.cambioclasificacioncontable.Model({
            idioma: config.idioma
        });
        LOG.inv.cambioclasificacioncontable.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa el componente.
     * @returns {undefined}
     */
    init: function() {
        LOG.inv.cambioclasificacioncontable.superclass.init.call(this);
        this.panelSuperior();
    },
    /**
     * Inicializa los botones del panel superior.
     * @returns {undefined}
     */
    initDefaultButtons: function() {
        LOG.inv.cambioclasificacioncontable.superclass.initDefaultButtons.call(this);
        var _this = this;
        
        // Bloque de botones de la interfaz principal.
        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(0), 'handler', function() {
            _this.habilitarElementos();
            _this.winGestionarDocumento.btnSalvar.enable();
        }, 'ccontableAdd');
        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(1), 'handler', function() {
            _this.habilitarElementos();
        }, 'ccontableVer');
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
            tooltip: this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            handler: function() {
                _this.modelo.aprobar();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '2') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'aprobar1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 5);
        // Fin del bloque.
        
        // Bloque de botones de la ventana adicionar.
        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarDoc,
            fn: function() {
                _this.modelo.eliminar({}, function() {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function(b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
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
        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(1), {
            tooltip: this.idioma.ttBtnConfirmar,
            disabled: true,
            fn: function() {
                _this.modelo.confirmar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function() {
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
        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(2), {
            tooltip: this.idioma.ttBtnAnularEstado,
            fn: function() {
                _this.modelo.anularestado({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function(r) {
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
        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(3), {
            tooltip: this.idioma.ttBtnAprobar,
            fn: function() {
                _this.modelo.aprobar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function(r) {
                    _this.winGestionarDocumento.cargarProductos();
                    Ext.apply(_this.winGestionarDocumento.record.data, {estado: '3'});
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
                if ((_this.grantedAction('CT') || _this.grantedAction('RAprobar')) && !_this.contintegrada) {
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
        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), {hidden: true});
        // Fin del bloque.
        
        // Bloque de botones del panel de productos de la ventana adicionar.
        Ext.apply(this.winGestionarDocumento.listaBotonesProductos.getItem(0), {
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
        var btnProductos = LOG.util.UIManager.createBtn({
            iconCls: 'producto',
            text: this.idioma.lbBtnProductos,
            tooltip: this.idioma.ttBtnProductos,
            handler: function () {
                var winProductos = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    busquedaAvanzada: true,
                    parametros: {
                        idestructura: _this.idDeposito,
                        tipo: 1,
                        almacenado: 1
                    },
                    postSalvar: function(r) {
                        var _scope = _this.winGestionarDocumento;
                        _scope.cargarProductos();        
                        if (_scope.record == null) {
                            _scope.record = {};
                            Ext.apply(_scope.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "1"
                                }
                            });

                        } else {
                            _scope.record.data.estado = "1";
                        }
                        _scope.getTitleDocumento(_scope.record.data.iddocumento);
                        _scope.listaBotonesVentana.each(function(b) {
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
                winProductos.urlBusquedaGridPrincipal = '/logistica/inventario/comun_inv/index.php/cambioclasificacioncontable/cargarProductos';
                _this.vistaProductos = winProductos.view();
                _this.vistaProductos.show();
            },
            fnEspecialCondition: function () {
                if ((!_this.winGestionarDocumento.record || 
                    (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1')) &&
                    (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) {
                    return false;
                }
                return true;
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
		
		var btnReplicarProductos = LOG.util.UIManager.createBtn({
            iconCls: 'iniciar',
            text: 'Replicar',
            tooltip: 'Establecer la clasificaci\xf3n contable a todos los productos.',
            handler: function () {
				var idmovimientos = new Array();
				Ext.each(_this.winGestionarDocumento.smGridDetalles.getSelections(), function(rec) {
					idmovimientos.push(rec.id);
				});
				_this.modelo.replicar(idmovimientos, function() {
					_this.winGestionarDocumento.stGridDetalles.reload();
				});
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        var btnLentoMovimiento = LOG.util.UIManager.createBtn({
            iconCls: 'cambiar',
            text: 'Lento movimiento',
            tooltip: 'Establecer la clasificaci\xf3n contable a todos los productos.',
            handler: function () {
               _this.winLento = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    busquedaAvanzada: false,
                    parametros: {
                        idestructuracomun: _this.idDeposito,
                        tipo: 1,
                        almacenado: 1,
                        lento: 1,
                       iddocumento:_this.winGestionarDocumento.idDocumento
                    },
 		            panelBotonesVisible: true,
                    initDefaultButtons: function (){
                        this.addToolbarButton(LOG.util.UIManager.createBtn({
                            iconCls: 'cambiar',
                            text: 'Cambiar clasificación contable',
                            tooltip: 'Establecer la clasificaci\xf3n contable a todos los productos.',
                            handler: function () {
                              
                                var ventana = new LOG.inv.winCambioClasificacion({
                                    idioma: _this.idioma,
                                    scope: _this,
                                    lento: _this.winLento
                                })
                                ventana.show();
                            },
                            controlFn: function (b) {
                                     if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                                    b.setVisible(true);
                                    LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e) {
                                        if (e == 'load') {
                                            if (this.data.length === 0) {
                                              b.setVisible(false);
                                                  mostrarMensaje(2,'No existen datos que mostrar');
                                            } else {
                                                b.setVisible(true);
                                              
                                            }
                                        }
                                    }, 'stAreas');
                                } else {
                                    b.setVisible(false);
                                }    
                                
                          
                            }
                                 
                        }));
                    },
                    postSalvar: function(r) {
                        var _scope = _this.winGestionarDocumento;
                      
                        _scope.cargarProductosOciosos();   
                        if (_scope.record == null) {
                            _scope.record = {};
                            Ext.apply(_scope.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "1"
                                }
                            });

                        } else {
                            _scope.record.data.estado = "1";
                        }
                        _scope.getTitleDocumento(_scope.record.data.iddocumento);
                        _scope.listaBotonesVentana.each(function(b) {
                            LOG.util.UIManager.applyKey(b, _scope);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_scope, [b, _scope]).call();
                            }
                        }, _scope);
                      
                       // winLento.getStorePrincipal().reload();
                       ventana.hide();
                    }
                });
               
               _this.winLento.getVistaPrincipal().listaBotones.getItem(0).hide();
               _this.winLento.getVistaPrincipal().listaBotones.getItem(1).hide();
               _this.winLento.getVistaPrincipal().listaBotones.getItem(2).hide();
                
               _this.winLento.init();
               
               _this.winLento.urlBusquedaGridPrincipal = '/logistica/inventario/comun_inv/index.php/cambioclasificacioncontable/cargarProductosOciosos';
                _this.vistaProductos = _this.winLento.view();
                _this.vistaProductos.show();
                _this.winLento.getStorePrincipal().reload();
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        var btnOciosos = LOG.util.UIManager.createBtn({
            iconCls: 'cambiar',
            text: 'Ociosos',
            //autoLoad:true,
            tooltip: 'Establecer la clasificaci\xf3n contable a todos los productos.',
            handler: function () {
                _this.winOciosos = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    busquedaAvanzada: false,
                    parametros: {
                        idestructuracomun: _this.idDeposito,
                        tipo: 1,
                        almacenado: 1,
                        iddocumento:_this.winGestionarDocumento.idDocumento
                    },
                    panelBotonesVisible: true,
                    initDefaultButtons: function (){
                        this.addToolbarButton(LOG.util.UIManager.createBtn({
                            iconCls: 'cambiar',
                            text: 'Cambiar clasificación contable',
                            tooltip: 'Establecer la clasificaci\xf3n contable a todos los productos.',
                            handler: function () {
                                var ventana = new LOG.inv.winCambioClasificacion({
                                    idioma: _this.idioma,
                                    scope: _this,
                                    ociosos:_this.winOciosos
                                })
                                ventana.show();
                            },
                            controlFn: function (b) {
                                     if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                                    b.setVisible(true);
                                    LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e) {
                                        if (e == 'load') {
                                            if (this.data.length === 0) {
                                              b.setVisible(false);
                                                  mostrarMensaje(2,'No existen datos que mostrar');
                                            } else {
                                                b.setVisible(true);
                                              
                                            }
                                        }
                                    }, 'stAreas');
                                } else {
                                    b.setVisible(false);
                                }    
                                
                          
                            }
                                 
                        }));
                    },
                     postSalvar: function(r) {
                        var _scope = _this.winGestionarDocumento;
                        _scope.cargarProductosOciosos();   
                        if (_scope.record == null) {
                            _scope.record = {};
                            Ext.apply(_scope.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "1"
                                }
                            });

                        } else {
                            _scope.record.data.estado = "1";
                        }
                       _scope.getTitleDocumento(_scope.record.data.iddocumento);
                        _scope.listaBotonesVentana.each(function(b) {
                            LOG.util.UIManager.applyKey(b, _scope);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_scope, [b, _scope]).call();
                            }
                        }, _scope);
                        //_scope.modelo.getStore().reload();
                        _this.winOciosos.getStorePrincipal().reload();
                    }
                });

                _this.winOciosos.getVistaPrincipal().listaBotones.getItem(0).hide();
                _this.winOciosos.getVistaPrincipal().listaBotones.getItem(1).hide();
                _this.winOciosos.getVistaPrincipal().listaBotones.getItem(2).hide();
                _this.winOciosos.init();
                
                _this.winOciosos.urlBusquedaGridPrincipal = '/logistica/inventario/comun_inv/index.php/cambioclasificacioncontable/cargarProductosOciosos';
                _this.vistaProductos = _this.winOciosos.view();
                _this.vistaProductos.show();
                _this.winOciosos.storePrincipal.load(); 
               
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        /*var btncambioClasificacion  = LOG.util.UIManager.createBtn({
            iconCls: 'cambiar',
            text: 'Cambio clasificación contable',
            tooltip: 'Establecer la clasificaci\xf3n contable a todos los productos.',
        });*/
        this.insertToolbarButtonProductos(btnProductos, 0);
        this.insertToolbarButtonProductos(btnReplicarProductos, 1);
        this.insertToolbarButtonProductos(btnLentoMovimiento, 2);
        this.insertToolbarButtonProductos(btnOciosos, 3);
    
        this.modelo.addActionButton(btnProductos, true);
        // Fin del bloque.
    },
    /**
     * Inicializa las columnas del grid.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        LOG.inv.cambioclasificacioncontable.superclass.initDefaultColumns.call(this);
        this.addGridColumnProductos({dataIndex: 'idmovcambioccontable'});
        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'existencia'), {
            hidden: true
        });
        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'disponible'), {
            hidden: true
        });
        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'cantidad'), {
            hidden: true
        });
        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'preciocontable'), {
            hidden: true
        });
        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'importe'), {
            hidden: true
        });
        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'clasificacioncont'), {
            header: this.idioma.cgClasificacionCont + ' actual',
            width: 170,
            dataIndex: 'idclasificacioncontable',
            editor: new Ext.erp.comboNomenclador({
                controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
                modelo: 'NomClasificacioncontablelog',
                idnom: 'idclasificacioncontable',
                name: 'denominacion',
                autoCargar: true
            }),
            renderer: function(_v, _mD, _r) {
                _r.data.idclasificacioncontable = _v || _r.data.clasificacioncont;
                var record = this.editor.getStore().getById(_r.data.idclasificacioncontable);
                return record ? record.data.denominacion : null;
            }
        });
        this.insertGridColumnProductos({
            header: this.idioma.cgClasificacionCont + ' anterior',
            width: 190,
            dataIndex: 'clasficacionold'
        }, 10);
        this.addGridColumn({dataIndex: 'nrocomprobante'});
    },
    /**
     * Inicializa la ventana adicionar.
     * @param {Object} datos
     * @param {Integer} tipoVentana
     * @returns {undefined}
     */
    initVentanaGestion: function(datos, tipoVentana) {
        if (!this.winGestionarDocumento.isInit()) {
            var _this = this;
            Ext.apply(this.winGestionarDocumento, {
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
            });
            LOG.inv.cambioclasificacioncontable.superclass.initVentanaGestion.call(this, datos, tipoVentana);
            LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.btnNuevo, 'handler', function() {
                _this.winGestionarDocumento.tipoVentana = 1;
                _this.habilitarElementos();
                _this.winGestionarDocumento.btnSalvar.enable();
            });
            this.winGestionarDocumento.stGridDetalles.on({
                load: function() {
                    this.each(function(_p, index) {
                        var css = (_p.json.editado || _this.winGestionarDocumento.record.data.estado != '1') ? '' : 'redrow-text';
                        Ext.fly(_this.winGestionarDocumento.gridDetalles.getView().getRow(index)).addClass(css);
                    });
                }
            });
        } else {
            LOG.inv.cambioclasificacioncontable.superclass.initVentanaGestion.call(this, datos, tipoVentana);
        }
    },
    /**
     * Inicializa los campos de entrada de datos.
     * @returns {undefined}
     */
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
                    maxLength: 255,
                    campo: true
                })
            ]
        });
    },
    /**
     * Habilita o deshabilita los elementos del panel de datos de acuerdo al estado del documento.
     * @returns {undefined}
     */
    habilitarElementos: function() {
        if (!this.winGestionarDocumento.record) {
            this.winGestionarDocumento.setTitle(this.idioma.tlAdicionar);
        }
        Ext.each(this.winGestionarDocumento.panelSuperior.find('campo', true), function (item) {
            item.enable();
            if (this.record) {
                item.setDisabled(this.record.data.estado != '1');
            }
        }, this.winGestionarDocumento);
    },
	 getParamsReport: function (record, btn) {
        var _this = this;
        return btn.isList ? {
            /*iddeposito: _this.idDeposito ? _this.idDeposito : null,
            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
            contabilizadopor: (_this.panelBusquedaAvanzada.findByType('combo')[4].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[4].getValue() : null,
            idsuministrador: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null,
            creadopor: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
            fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d/m/Y') : null,
            fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d/m/Y') : null,
            docorigen: null,
            tipodocumento: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null*/
        } :  {
            iddocumento: record.get("iddocumento") || null,
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            monedacontable: window.monedacontable || window.idcontable,
            monedaalternativa: window.monedaalternativa || window.idalternativa
        };
    }
});


LOG.inv.winCambioClasificacion  =  Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        Ext.apply(config, {
            usarAplicar: false,
            title: 'Cambiar clasificación contable',
            width: 400,
            height: 180,
            parent: config._parent
        });
        this.modelo = new LOG.inv.cambioclasificacioncontable.Model({
            idioma: config.idioma,
        });
        /*var idmovimiento = Array();
        var productos = Array();
        Ext.each(config.movimiento, function(mov){
            idmovimiento.push(mov.json.idmovimiento)
            productos.push(mov.data)
        });*/
       
        LOG.inv.winCambioClasificacion.superclass.constructor.call(this, config);
    },
  
    initComponent: function () {
        var _this = this;
        LOG.inv.winCambioClasificacion.superclass.initComponent.call(this);
        this.clsUMOrigen = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.store = new Ext.data.Store({
            url: '/logistica/inventario/comun_inv/index.php/cambioclasificacioncontable/cargarClasificacion',
            reader: new Ext.data.JsonReader({root: 'datos', totalProperty: 'cantidad', id: "idclasificacioncontable"},
                [
                    {name: 'idclasificacioncontable'},
                    {name: 'denominacion'}
                ])
        });
        this.store.load(); 
        _this.cmboClasificacion= new Ext.form.ComboBox({
            // id          : 'cmboxCentrosCosto',
             msgTarget: 'qtip', 
             enableQtip: true,
             store : this.store,
             fieldLabel: 'Clasificación contable', 
             mode: 'local',
             displayField: 'denominacion', 
             hiddenName: 'idclasificacioncontable', 
             valueField: 'idclasificacioncontable',
             typeAhead   : true, 
             triggerAction: 'all', 
             editable:false,
             forceSelection: true,
             emptyText   : 'Seleccione...', 
             anchor: '99%', 
             allowBlank: false, 
             name: 'denominacion'
         }); 
        this.clsUMOrigen.addComponent(_this.cmboClasificacion);
        this.panel = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [this.clsUMOrigen]
        });
        this.modelo.bindForm(this.panel);
        this.modelo.addActionButton(this.listaBotones.getItem(2));
        this.add(this.panel);
    },
    aceptarFn: function () {
        var _this = this;

        this.modelo.salvar({
            cambiarAll: true, 
            idestructuracomun: _this.scope.idDeposito,lento:true
        }, function (resp) {   
            _this.postSalvar.createDelegate(_this, [resp]).call();
        }, function(){}, 'Los datos han sido guardados satisfactoriamente');
    },
    postSalvar: function (r) {
        if (this.scope.winOciosos) {
         this.scope.winOciosos.vistaPrincipal.close(); 
         this.scope.winGestionarDocumento.gridDetalles.store.reload({
             params: {iddocumento:r.iddocumento}
         });       
         }
        if(this.scope.winLento){
             this.scope.winLento.vistaPrincipal.close();
             this.scope.winGestionarDocumento.gridDetalles.store.reload({
                params: {iddocumento:r.iddocumento}
            });      
        }
    }
});