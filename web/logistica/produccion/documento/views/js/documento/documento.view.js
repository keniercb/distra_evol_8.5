Ext.ns('LOG.produccion.documento');
LOG.produccion.documento.View = Ext.extend(LOG.lb.documento.View, {
    name: 'Recepcion',
    cantSign: 4,
    signDetails: {
        1: 'Recepcionado por',
        2: 'Revisado por',
        3: 'Contabilizado por',
        4: 'Transportado por'
    },
    dirReport: '/logistica/contenedor/transportacion/documento/',
    usarAbrir: false,
    constructor: function (config) {
        this.textBusquedaSimple = config.idioma.cmNumero;
        this.concepto = config.idioma.ttBtnBuscar;
        this.busquedaBasica = true;
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        LOG.produccion.documento.View.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa los componentes.
     * @returns {undefined}
     */
    init: function () {
        LOG.produccion.documento.View.superclass.init.call(this);
    },
    initDefaultButtons: function () {
        var _this = this;
        LOG.produccion.documento.View.superclass.initDefaultButtons.call(this);
        this.insertToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            isContextual: true,
            itemId:'confirmar',
            disabled: true,
            handler: function () {
                _this.model.confirmar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(this.getCount() == 1 && (this.getSelected().data.estado == 1)));
                        }
                    }, 'confirmarDocumento1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 3);
        this.insertToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnular,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.model.anularestado({estado: _this.getSmPrincipal().getSelected().data.estado});
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'rowselect') {
                            if (this.getCount() == 1 && (this.getSelected().data.estado == '2')) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'anularEstadoDocumento1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 4);
        this.insertToolbarButton(LOG.util.Prototipos.botonAprobar({
            tooltip: this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.model.aprobar({}, function (resp) {
                   // _this.model.fireEvent('aprobado',this,resp);
                    mostrarMensaje(1, _this.idioma.msgDocumentoGenerado);
                });
            },
            controlFn: function (b, _caller) {
                if ((_caller.grantedAction('CT') || _caller.grantedAction('RAprobar'))) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(this.getCount() == 1 && this.getSelected().data.estado == 2));
                        }
                    }, 'aprobarDocumento');
                } else {
                    b.setVisible(false);
                }
            }
        }), 5);
        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: this.idioma.ttBtnEliminar,
            disabled: true,
            handler: function () {
                _this.model.eliminar({id: _this.modelo.iddocumento}, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(this.getCount() == 1 && (this.getSelected().data.estado == 1 || this.getSelected().data.estado == 13)/* && this.getSelected().data.confirmar == 1*/));
                        }
                    }, 'eliminarDocumento1');
                } else {
                    b.hide();
                }
            }
        });
        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(1), {
            tooltip: this.idioma.ttBtnConfirmar,
            disabled: true,
            handler: function () {
                _this.model.confirmar({
                    id: _this.modelo.iddocumento,
                    iddocumento: _this.modelo.iddocumento
                }, function (r) {                    
                    //_this.model.fireEvent('confirmado',this,r);
                    _this.winGestionarDocumento.cargarProductos();
                    Ext.apply(_this.winGestionarDocumento.record.data, {estado: '2'});
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.modelo.habilitarBotones(true);
                    _this.winGestionarDocumento.doLayout();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar') || _this.grantedAction('RContar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(this.getCount() == 1 && (this.getSelected().data.estado == 1 || this.getSelected().data.estado == 13)/* && this.getSelected().data.confirmar == 1*/));
                        }
                    }, 'confirmarDocumento2');
                } else {
                    b.setVisible(false);
                }
            }
        });
        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(2), {
            tooltip: this.idioma.ttBtnAnular,
            disabled: true,
            handler: function () {
                _this.model.anularestado({
                    id: _this.modelo.iddocumento,
                    iddocumento: _this.modelo.iddocumento,
                    estado: _this.winGestionarDocumento.record.data.estado
                }, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    Ext.apply(_this.winGestionarDocumento.record.data, {
                        estado: (_this.winGestionarDocumento.record.data.estado == '1' ? '13' : '1')
                    });
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.modelo.habilitarBotones(true);
                    _this.winGestionarDocumento.doLayout();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.hasOwnProperty('data') && (_this.winGestionarDocumento.record.data.estado == '2')) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(3), {
            tooltip: this.idioma.ttBtnAprobar,
            disabled: true,
            handler: function () {
                _this.model.aprobar({id: _this.modelo.iddocumento}, function (r) {
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        _this.winGestionarDocumento.close();
                    } else {
                      //  _this.winGestionarDocumento.cargarProductos();
                        Ext.apply(_this.winGestionarDocumento.record.data, {estado: '3'});
                        //_this.model.fireEvent('aprobado',this,r);
                        _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                            }
                        }, _this.winGestionarDocumento);
                    }
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    mostrarMensaje(1, _this.idioma.msgDocumentoGenerado);
                });
            },
            controlFn: function (b, _caller) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RAprobar'))) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.hasOwnProperty('data') && (_this.winGestionarDocumento.record.data.estado == '2')) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), {
            hidden: true
        });
        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(5), {
            hidden: true
        });

        this.insertToolbarButtonProductos(LOG.util.Prototipos.botonNuevo({
            btnProd: true,
            iconCls: this.iconClsProd || 'producto',
            text: this.idioma.btnProducto || 'Actividades',
            tooltip: this.idioma.lbBtnProductos,
            handler: function () {
                _this.initVentana(_this.winGestionarDocumento.smGridDetalles.getSelected(), false);
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 1 || (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.hasOwnProperty('data') && (_this.winGestionarDocumento.record.data.estado == '1'))) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }), 0);
        this.insertToolbarButtonProductos(LOG.util.Prototipos.botonAbrir({
            tooltip: this.idioma.ttBtnAbrir,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.initVentana(_this.winGestionarDocumento.smGridDetalles.getSelected(), 2);
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD')) {
                    b.setVisible(_this.usarAbrir);
                    LOG.util.UIManager.encadenaFn(_this.winGestionarDocumento.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && _this.winGestionarDocumento.record && _this.winGestionarDocumento.record.hasOwnProperty('data') && (_this.winGestionarDocumento.record.data.estado == '1')) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'verProducto');
                } else {
                    b.setVisible(false);
                }
            }
        }), 1);
        Ext.apply(this.winGestionarDocumento.listaBotonesProductos.getItem(2), {
            disabled: true,
            handler: function () {
                _this.handlerEliminarMov();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.winGestionarDocumento.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'rowselect') {
                            if (this.getCount() == 1 && _this.winGestionarDocumento.record && _this.winGestionarDocumento.record.hasOwnProperty('data') && (_this.winGestionarDocumento.record.data.estado == '1')) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'eliminarProductoRow');
                } else {
                    b.setVisible(false);
                }
            }
        });
    },
    buildMgm: Ext.emptyFn,
    render: function () {
        var _this = this;
        this.buildMgm();
        var p = LOG.produccion.documento.View.superclass.render.call(this);
        return p;
    },
    initVentana: function (record, tipo) {
        var _this = this;
    },
    getParamsReport: function (record, btn) {
        var _this = this;
        return btn.isList ? this.getStorePrincipal().baseParams: {
            iddocumento: record.get("iddocumento") || null
        };
    }
});