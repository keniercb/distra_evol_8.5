Ext.ns('LOG.inv.hojainventario');
LOG.inv.hojainventario.View = Ext.extend(LOG.lb.documento.View, {
    name: 'HojaInventario',
    cantSign: 3,
    signDetails: {
        1: 'Conteo',
        2: 'Jefe comisi&oacute;n inventario',
        3: 'Jefe almac&eacute;n'
    },
    dirReport: '/logistica/inventario/movimiento/hojainventario/',
    constructor: function (config) {
        config.urlBusquedaGridPrincipal = 'cargarDocumentos';
        config.modoSeleccion = 1;
        this.concepto = config.idioma.concepto;
        config.model = new LOG.inv.hojainventario.Model({
            idioma: config.idioma
        });
        LOG.inv.hojainventario.View.superclass.constructor.call(this, config);
    },
    init: function () {
        var _this = this;
        LOG.inv.hojainventario.View.superclass.init.call(this);
        this.panelSuperior();

        this.formularioSur = LOG.util.UIManager.initPanel({
            animCollapse: false,
            collapsible: true,
            collapsed: true,
            region: 'south',
            layout: 'fit',
            html: 'fit',
            height: 300,
            minSize: 200,
            maxSize: 400,
            split: true,
            title: _this.idioma.tlPanelLotes,
            collapseMode: 'mini',
            titleCollapse: true,
            pContainer: _this.getPanelPrincipal(),
            listeners: {
                collapse: function (_p) {
                    _p.hide();
                    _this.winGestionarDocumento.doLayout();
                },
                beforeexpand: function (_p) {
                    _p.show();
                    if (_this.lotes) {
                        _this.lotes.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, _this]).call();
                            }
                        }.createDelegate(this));
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado != '1') {
                            _this.lotes.ocultarColumna('cantidad', false);
                        } else {
                            _this.lotes.ocultarColumna('cantidad');
                        }
                    }
                    _this.winGestionarDocumento.doLayout();
                }
            }
        });

        Ext.apply(this.winGestionarDocumento, {
            salvarHandler: function (params) {
                var _scope = this.scope || this;
                params = params || {
                    idestructuracomun: _this.idDeposito
                };
                _this.modelo.salvar(params, function (r) {
                    if (_this.modelo.listaProductos.count() || r.reloadGridDetalle == 1) {
                        _scope.cargarProductos();
                    }
                    _scope.tipoVentana = 2;
                    if (_scope.record == null) {
                        _scope.record = {};
                        Ext.apply(_scope.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1",
                                cantproductos: r.cantproductos
                            }
                        });

                    }
                    _scope.getTitleDocumento(r.iddocumento);
                    _scope.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _scope);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_scope, [b, _scope]).call();
                        }
                    }, _scope);
                    _this.habilitarElementosWindow();
                });
            },
            beforeEditProducto: function (o) {
                if (this.record.data.estado != "2" || this.tipoVentana == 3 || this.smGridDetalles.getSelected().json.tienelote == 1) {
                    o.cancel = true;
                } else {
                    o.cancel = false;
                    if (o.field == 'cantidad') {
                        if (o.record.json.decimales == "0") {
                            o.grid.getColumnModel().setEditor(o.column, LOG.util.Prototipos.inputEntero({}));
                        } else {
                            o.grid.getColumnModel().setEditor(o.column, LOG.util.Prototipos.inputDecimal({}));
                        }
                    }
                }
            },
            controlFnGuardar: function (b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && (!this.record || this.record.data.estado == '1' || this.record.data.estado == '2')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }, this.winGestionarDocumento);
    },
    initVentanaGestion: function (d, tipoVentana) {
        var init = this.winGestionarDocumento.isInit();
        var _this = this;

        LOG.inv.hojainventario.View.superclass.initVentanaGestion.createDelegate(this, [d, tipoVentana]).call();
        this.cbUbicacion.setBaseNode({_node: _this.idDeposito});
        if (d) {
            this.cmbTipoInventario.fireEvent('select', this.cmbTipoInventario);
        }
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.btnNuevo, 'handler', function () {
            _this.winGestionarDocumento.tipoVentana = 1;
            _this.habilitarElementosWindow();
        });

        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.btnSalvar, 'handler', function () {
            _this.salvarConteoLote();
        }, 'salvarDatos');
        this.winGestionarDocumento.stGridDetalles.on({
            load: function () {
                this.each(function (record, index) {
                    var css = '';
                    if (record.json.cantidad >= 0) {
                        if ((record.json.faltante == 1) && (record.json.sobrante == 1))
                            css = 'fila-azul';
                        else if (record.json.sobrante == 1)
                            css = 'fila-verde';
                        else if (record.json.faltante == 1)
                            css = 'fila-roja';
                    }
                    Ext.fly(_this.winGestionarDocumento.gridDetalles.getView().getRow(index)).addClass(css);
                });
            }
        });

        if (!init) {
            this.leyenda = new LOG.lb.plugin.Leyenda({
                leyendAlign: 'bot-left',
                leyendContainer: this.winGestionarDocumento,
                leyendConfig: this.getLeyendConfig(),
                hidden: true,
                controlFn: function (b, _caller) {
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado != 1) {
                        b.setVisible(true);
                    } else {
                        b.setVisible(false);
                    }
                }
            });

            this.winGestionarDocumento.gridDetalles.getBottomToolbar().insert(this.winGestionarDocumento.gridDetalles.getBottomToolbar().items.length - 1, this.leyenda);
            if (this.leyenda) {
                this.winGestionarDocumento.gridDetalles.getBottomToolbar().insert(this.winGestionarDocumento.gridDetalles.getBottomToolbar().items.length - 1, '-');
            }
            LOG.util.UIManager.encadenaFn(_this.winGestionarDocumento.smGridDetalles, 'fireEvent', function (e) {
                if (e == 'selectionchange') {
                    if (this.getCount() == 1 && this.getSelected().json.tienelote == '1') {
                        _this.initLote();
                        _this.formularioSur.expand();
                        _this.formularioSur.doLayout();
                    } else {
                        if (this.lotes){
                            _this.formularioSur.collapse();
                            _this.lotes.getStorePrincipal().removeAll();
                        }
                    }
                }
            }, 'lote');


        }
    },
    initDefaultColumns: function () {
        LOG.inv.hojainventario.View.superclass.initDefaultColumns.call(this);
        var _this = this;

        this.addGridColumn({dataIndex: 'controlfirma'});
        this.addGridColumn({dataIndex: 'idnodo'});
        this.addGridColumn({dataIndex: 'iddoc'});
        this.insertGridColumn({
            header: this.idioma.cgTipoInventario,
            width: 200,
            dataIndex: 'tipoinventario',
            default: true,
            renderer: function (v) {
                return LOG.lb.documento.TipoInventario[v];
            }
        }, 3);

        this.addGridColumn({dataIndex: 'area'});
        this.addGridColumn({dataIndex: 'idarea'});
        this.addGridColumn({dataIndex: 'idperiodo'});
        this.addGridColumn({dataIndex: 'tipoinventario'});
        this.addGridColumn({dataIndex: 'idannoinv'});
        this.addGridColumn({dataIndex: 'idnaturaleza'});

        // Columnas del grid de productos.

        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'disponible'), {
            hidden: true
        });
        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'existencia'), {
            hidden: false
        });
        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'clasificacioncont'), {
            hidden: true
        });
        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'cantidad'), LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgConteo,
            renderer: function (_v, _mD, _r) {
                _r.data.idunidadmedida = _r.json.idumedida;
                if (parseFloat(_r.data.cantidad) == -1) {
                    _r.data.cantidad = null;
                    return '-';
                }
                return _v;
            }
        }));

        /*var pos = this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'codigo', 'header');
        this.insertGridColumnProductos({
            header: this.idioma.cgCodigoproveedor,
            width: 160,
            dataIndex: 'codigoproveedor',
            default: true
        }, pos + 1);*/
        this.addGridColumnProductos({dataIndex: 'iddeposito'});
    },
    initDefaultButtons: function () {
        LOG.inv.hojainventario.View.superclass.initDefaultButtons.call(this);
        var _this = this;

        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            tooltip: _this.idioma.ttBtnAdicionarHoja
        });

        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(0), 'handler', function () {
            _this.habilitarElementosWindow();
        }, 'hojainventarioAdd');

        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(1), 'handler', function () {
            _this.habilitarElementosWindow();
            if (_this.winGestionarDocumento.record != null) {
                _this.habilitarColumConteo(_this.winGestionarDocumento.record.data.estado);
            }
        }, 'hojainventarioVer');

        this.listaBotones.getItem(1).tooltip = this.idioma.ttBtnVerDetalles;

        this.listaBotones.getItem(2).tooltip = this.idioma.ttBtnEliminarHoja;

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
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 1) {
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
        }), 3);

        this.insertToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnular,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado();
            },
            controlFn: function (b, _caller) {
                if (this.grantedAction('CT') || this.grantedAction('RCRUD') || this.grantedAction('RAnularestado')) {
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
            tooltip: this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.initVentanaGestion(_this.getGridPrincipal().getSelectionModel().getSelected(), 3);
                _this.habilitarElementosWindow();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(
                            (this.getCount() == 1 && this.getSelected().data.estado == 2) && //first
                            ((window.useSign && typeof pki == 'object') ? (_caller.getSmPrincipal().getSelected().get('controlfirma') == 2) : true) //last pki //para controlfirma == 2 limit 3 y 1 limit 2
                            ));
                        }
                    });
                } else {
                    b.setVisible(false);
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
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
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
        }), 6);
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            itemId: 'btnImprimir',
            tooltip: this.idioma.ttBtnImprimir,
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirListado,
                    tooltip: this.idioma.ttBtnImprimir,
                    iconCls: 'icondistra-imprimir',
                    isList: true,
                    name: this.name + 'Listado',
                    handler: function (btn) {
                        _this.onReport.call(_this, btn);
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    iconCls: 'icondistra-imprimir', hidden: true,
                    isList: false,
                    hasExistencia: 'true',
                    name: this.name +  'Modelo',
                    handler: function (btn) {
                        _this.onReport.call(_this, btn);
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModeloDiario,
                    iconCls: 'icondistra-imprimir', hidden: true,
                    isList: false,
                    hasExistencia: 'false',
                    name:'Cierre' + 'Modelo',
                    handler: function (btn) {
                        _this.onReport.call(_this, btn);
                    }
                })
            ],
            controlFn: function (b, _caller) {//
                if (_this.grantedAction('CT') || _this.grantedAction('RB') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                                b.menu.get(1).setVisible(true);
                                b.menu.get(2).setVisible(((this.getSelected().data.tipoinventario == '1') && (this.getSelected().data.estado != '3')));
                            } else {
                                b.disable();
                            }
                        }
                    }, 'imprimir');
                    LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'load') {
                            b.setVisible(this.getCount() > 0);
                        }
                    }, 'imprimir');
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.listaBotones.getItem(9).id = 'idhojainventario';
        this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonImprimir({
            itemId: 'btnImprimir',
            hidden: true,
            text: this.idioma.lbBtnImprimirModelo,
            tooltip: this.idioma.ttBtnImprimir,
            iconCls: 'icondistra-imprimir',
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModeloConExistencia,
                    iconCls: 'icondistra-imprimir',
                    isList: false,
                    hasExistencia: 'true',
                    name: this.name +  'Modelo',
                    handler: this.onReport.createDelegate(this, [{
                        isList: false,
                        hasExistencia: 'true',
                        name: this.name +  'Modelo',
                    }])
                })
            ],
            controlFn: function (b, _caller) {//
                if (_this.grantedAction('CT') || _this.grantedAction('RB') || _this.grantedAction('RCRUD')) {
                    if (_this.winGestionarDocumento.record) {
                        b.menu.get(0).setVisible(true);
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarHoja,
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
            handler: function () {
                _this.modelo.confirmar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    _this.winGestionarDocumento.record.data.estado = "2";
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
                    _this.habilitarColumConteo(_this.winGestionarDocumento.record.data.estado);
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

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(2), {
            tooltip: this.idioma.ttBtnAnular,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    _this.winGestionarDocumento.record.data.estado = "1";
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
                    _this.habilitarColumConteo(_this.winGestionarDocumento.record.data.estado);
                    _this.habilitarElementosWindow();
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
            disabled: true,
            handler: function () {
                _this.modelo.aprobar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    _this.winGestionarDocumento.record.data.estado = "3";
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
                    _this.habilitarColumConteo(_this.winGestionarDocumento.record.data.estado);
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

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), {
            tooltip: this.idioma.ttBtnDuplicar,
            disabled: true,
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
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarColumConteo(_this.winGestionarDocumento.record.data.estado);
                });
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
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
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesProductos.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarProducto,
            disabled: true,
            hidden: true,
            handler: _this.handlerEliminarMov,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    LOG.util.UIManager.encadenaFn(_this.cmbTipoInventario, 'fireEvent', function (e) {
                        if (e == 'reset') {
                            b.hide();
                        }
                        if (e == 'select') {
                            if (this.getValue() == 3) {
                                b.show();
                            } else {
                                b.hide();
                            }
                        }
                    }, 'combo2');
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && _this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'elim');
                } else {
                    b.hide();
                }
            }
        });
        var producto = LOG.util.UIManager.createBtn({
            iconCls: 'producto',
            text: this.idioma.lbBtnProducto,
            tooltip: this.idioma.ttBtnProducto,
            hidden: true,
            handler: function () {
                var _p = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    parametros: {
                        idestructura: _this.idDeposito,
                        iddocumento: _this.modelo.iddocumento,
                        conexistencia : true
                    },
                    doAction: function (r) {
                        var _t = this;
                        if (_t._parent != undefined) {
                            var _productos = new Array();
                            Ext.each(r, function (rec) {
                                _productos.push(rec.get('idproducto'));
                            });

                            if (_t._parent.modelo.iddocumento == null) {
                                _t._parent.modelo.salvar({
                                    idestructuracomun: _t._parent.idDeposito,
                                    idproductos: Ext.encode(_productos)
                                }, function (resp) {
                                    _t.postSalvar.createDelegate(_t, [resp]).call();
                                });
                            } else {
                                _t._parent.modelo.adicionarMovimientos({
                                    idproductos: Ext.encode(_productos)
                                }, function (resp) {
                                    _t.postSalvar.createDelegate(_t, [resp]).call();
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
                                    estado: "1",
                                    tipoinventario: _this.cmbTipoInventario.getValue(),
                                    cantproductos: r.cantproductos
                                }
                            });
                        } else {
                            _scope.record.data.tipoinventario = _this.cmbTipoInventario.getValue();
                            _scope.record.data.cantproductos = r.cantproductos;
                        }
                        _this.winGestionarDocumento.tipoVentana = 2;
                        _this.habilitarElementosWindow();
                        _scope.getTitleDocumento(_scope.record.data.iddocumento);
                        _scope.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _scope);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_scope, [b, _scope]).call();
                            }
                        }, _scope);
                        _scope.listaBotonesProductos.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _scope);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_scope, [b, _scope]).call();
                            }
                        }, _scope);
                        _p.getStorePrincipal().initBaseParams.iddocumento = _this.modelo.iddocumento;
                        _p.reiniciarBusqueda();
                        _scope.modelo.getStore().reload();
                    }
                });
                _p.init();
                _this.vistaProductos = _p.view();
                _this.vistaProductos.show();
            },
            fnEspecialCondition: function () {
                if (_this.modelo.basicForm && _this.modelo.basicForm.isValid() && (!_this.winGestionarDocumento.record
                    || (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1'))) {
                    return false;
                }
                return true;
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    LOG.util.UIManager.encadenaFn(_this.cmbTipoInventario, 'fireEvent', function (e) {
                        if (e == 'reset') {
                            b.hide();
                        }
                        if (e == 'select') {
                            if (this.getValue() == 3) {
                                b.show();
                            } else {
                                b.hide();
                            }
                        }
                    }, 'combo1');
                } else {
                    b.hide();
                }
            }
        });
        this.insertToolbarButtonProductos(producto, 0);
        this.modelo.addActionButton(producto, true);


        /**button generico adiciona los productos genericos que estan en el conmat2**/
        var generico = LOG.util.UIManager.createBtn({
            iconCls: 'producto',
            text: this.idioma.lbGenerico,
            tooltip: this.idioma.ttBtnGenerico,
            hidden: true,
            handler: function () {
                LOG.inv.maestroproductos.Loader.init(function () {
                    var winMaestroProductos = new LOG.lb.maestroproductos.UIArbolProductos({
                        usarAplicar: true,
                        tipo: 1,
                        usarCheckBox: true,
                        doAction: function (params) {
                            var _t = this;
                            var array = [];
                            Ext.each(params, function (record) {
                                array.push(record.attributes.id);
                            });
                            if (_this.modelo.iddocumento != null) {
                                _this.modelo.adicionarMovimientos({
                                    idindicador: Ext.encode(array),
                                    idestructuracomun: _this.idDeposito
                                }, function (resp) {
                                    _t.postSalvar.createDelegate(_t, [resp]).call();
                                })
                            } else {
                                _this.modelo.salvar({
                                    idindicador: Ext.encode(array),
                                    idestructuracomun: _this.idDeposito
                                }, function (resp) {
                                    _t.postSalvar.createDelegate(_t, [resp]).call();
                                })
                            }
                        },
                        postSalvar: function (r) {
                            var _scope = _this.winGestionarDocumento;
                            _scope.cargarProductos();
                            if (_scope.record == null) {
                                _scope.record = {};
                                Ext.apply(_scope.record, {
                                    data: {
                                        iddocumento: r.iddocumento,
                                        estado: "1",
                                        tipoinventario: _this.cmbTipoInventario.getValue(),
                                        cantproductos: r.cantproductos
                                    }
                                });
                            } else {
                                _scope.record.data.tipoinventario = _this.cmbTipoInventario.getValue();
                                _scope.record.data.cantproductos = r.cantproductos;
                            }
                            _this.winGestionarDocumento.tipoVentana = 2;
                            _this.habilitarElementosWindow();
                            _scope.getTitleDocumento(_scope.record.data.iddocumento);
                            _scope.listaBotonesVentana.each(function (b) {
                                LOG.util.UIManager.applyKey(b, _scope);
                                if (typeof b.controlFn == 'function') {
                                    b.controlFn.createDelegate(_scope, [b, _scope]).call();
                                }
                            }, _scope);
                            _scope.listaBotonesProductos.each(function (b) {
                                LOG.util.UIManager.applyKey(b, _scope);
                                if (typeof b.controlFn == 'function') {
                                    b.controlFn.createDelegate(_scope, [b, _scope]).call();
                                }
                            }, _scope);
                            _scope.modelo.getStore().reload();
                        }
                    });
                    winMaestroProductos.show();
                })

            },
            fnEspecialCondition: function () {
                if (_this.modelo.basicForm && _this.modelo.basicForm.isValid() && (!_this.winGestionarDocumento.record
                    || (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1'))) {
                    return false;
                }
                return true;
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    LOG.util.UIManager.encadenaFn(_this.cmbTipoInventario, 'fireEvent', function (e) {
                        if (e == 'reset') {
                            b.hide();
                        }
                        if (e == 'select') {
                            if (this.getValue() == 3) {
                                b.show();
                            } else {
                                b.hide();
                            }
                        }
                    }, 'combo1');
                } else {
                    b.hide();
                }
            }
        });
        this.insertToolbarButtonProductos(generico, 1);
        this.modelo.addActionButton(generico, true);


        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'actualizar',
            text: this.idioma.lbBtnSinDiferencias,
            tooltip: this.idioma.ttBtnSinDiferencias,
            handler: function () {
                _this.modelo.actualizarConteo(_this.cmbTipoInventario.getValue(), function () {
                    _this.winGestionarDocumento.cargarProductos();
                });
            },
            controlFn: function (b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) && _this.winGestionarDocumento.tipoVentana != 3
                    && _this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == 2) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }));

        this.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'lote',
            text: this.idioma.lbBtnLote,
            tooltip: this.idioma.ttBtnLote,
            disabled: true,
            handler: function () {
                _this.initLote();
            },
            controlFn: function (b, _caller) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar') || _this.grantedAction('RB'))
                    && _this.winGestionarDocumento.record) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_this.cmbTipoInventario, 'fireEvent', function (e) {
                        if (e == 'select') {
                            if (this.getValue() == 3 || (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado != '1')) {
                                b.show();
                            } else {
                                b.hide();
                            }
                        }
                    }, 'combo3');
                    LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().json.tienelote == '1') {
                                b.enable();
                            } else {
                                if (_this.lotes) {
                                    _this.formularioSur.collapse();
                                    _this.lotes.getStorePrincipal().removeAll();
                                }
                                b.disable();
                            }
                        }
                    }, 'lote');
                } else {
                    b.hide();
                }
            }
        }));

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
            handler: function () {
                _this.modelo.anularestado(null, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            disabled: true,
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

    },
    panelSuperior: function () {
        var _this = this;
        this.cmbTipoInventario = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbTipoInventario,
            store: new Ext.data.SimpleStore({
                fields: ['tipoinventario', 'dtipoinventario'],
                data: [
                    [1, LOG.lb.documento.TipoInventario[1]],
                    [2, LOG.lb.documento.TipoInventario[2]],
                    [3, LOG.lb.documento.TipoInventario[3]],
                    [4, LOG.lb.documento.TipoInventario[4]]
                ]
            }),
            hiddenName: 'tipoinventario',
            valueField: 'tipoinventario',
            displayField: 'dtipoinventario',
            emptyText: this.idioma.lbSeleccione,
            editable: false,
            allowBlank: false,
            campo: true,
            combo: true,
            setValue: function (v) {
                LOG.util.ComboBox.superclass.setValue.call(this, v);
                if (v == null) {
                    this.fireEvent('reset');
                }
                _this.winGestionarDocumento.doLayout();
            },
            listeners: {
                select: function (combo) {
                    _this.cbLineaProducto.disable();
                    if (combo.getValue() == '2' && !_this.winGestionarDocumento.record) {
                        var winInvParcialMensual = new LOG.inv.hojainventario.winInvParcialMensual({
                            idioma: _this.idioma,
                            iddeposito: _this.idDeposito,
                            cmbTipoInventario: _this.cmbTipoInventario,
                            model: _this.modelo
                        });
                        winInvParcialMensual.show();
                    } else if (combo.getValue() == '3' && !_this.winGestionarDocumento.record) {
                        _this.cbLineaProducto.enable();
                    }
                }
            }
        });

        this.taObservaciones = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbObservaciones,
            name: 'observaciones',
            maxLength: 255,
            minLength: 2,
            minLengthText: this.idioma.msgMinLengthText,
            maxLengthText: this.idioma.msgMaxLengthText,
            width: '100%',
            tabular: true,
            campo: true
        });

        this.cbLineaProducto = new LOG.util.LovComboNomenclador({
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomNaturaleza',
            idnom: 'idnaturaleza',
            entidad: false,
            name: 'denominacion',
            autoCargar: true,
            allowBlank: true,
            disabled: true,
            fieldLabel: this.idioma.lbLineaProducto
        });
        this.cbUbicacion = new LOG.util.TreeCombo({
            fieldLabel: 'Ubicaci\xf3n',
            hiddenName: 'idestructuraubicacion',
            url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
            node: 0
        });

        this.fpDatos = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.fpDatosOperacion = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });


        this.fpDatosOperacion.addComponent(this.cmbTipoInventario);
        this.fpDatosOperacion.addComponent(this.cbLineaProducto);
        this.fpDatosOperacion.addComponent(this.cbUbicacion);
        this.fpDatos.addComponent(this.fpDatosOperacion);
        this.fpDatos.addComponent(this.taObservaciones);

        this.formularioGeneral = LOG.util.UIManager.initPanel({
            labelAlign: 'top',
            layout: 'form',
            items: [this.fpDatos]
        });
    },
    habilitarElementosWindow: function () {
        Ext.each(this.winGestionarDocumento.panelSuperior.find('campo', true), function (item) {
            var habilitado = this.record && this.record.data.estado != '1';
            if (item.combo && this.record && this.record.data.cantproductos > 0) {
                habilitado = true;
            }
            item.setDisabled(habilitado);
        }, this.winGestionarDocumento);
        var estado = this.winGestionarDocumento.record ? this.winGestionarDocumento.record.data.estado : '1';
        if (!this.winGestionarDocumento.record) {
            this.winGestionarDocumento.setTitle(this.idioma.tlVentanaAdicionarHojaInventario);
        }
        this.winGestionarDocumento.doLayout();
        this.habilitarColumConteo(estado);
        this.winGestionarDocumento.doLayout();
        if (this.leyenda) {
            LOG.util.UIManager.applyKey(this.leyenda, this);
            if (typeof this.leyenda.controlFn == 'function') {
                this.leyenda.controlFn.createDelegate(this, [this.leyenda, this]).call();
            }
        }
    },
    habilitarColumConteo: function (estado) {
        if (estado == '1') {
            this.winGestionarDocumento.ocultarColumna('cantidad');
            this.winGestionarDocumento.ocultarColumna('importe');
        } else {
            this.winGestionarDocumento.ocultarColumna('cantidad', false);
            this.winGestionarDocumento.ocultarColumna('importe', false);
        }
    },
    salvarConteoLote: function () {
        var _this = this;
        var arrayObj = [];
        if (_this.lotes && _this.winGestionarDocumento.smGridDetalles.getSelected() && _this.winGestionarDocumento.smGridDetalles.getSelected().json.tienelote == 1) {
            var record = _this.lotes.storePrincipal.getModifiedRecords();
            Ext.each(record, function (rec) {
                arrayObj.push({
                    idmovlote: (rec.data.idmovlote) ? rec.data.idmovlote : null,
                    idmovimiento: _this.winGestionarDocumento.smGridDetalles.getSelected().json.idmovimiento,
                    idproducto: _this.winGestionarDocumento.smGridDetalles.getSelected().json.idproducto,
                    idlote: rec.data.idlote,
                    cantidad: rec.data.cantidad
                });
            });
            if (arrayObj.length > 0) {
                _this.modelo.guardarConteoLote(arrayObj, function (resp) {
                    _this.lotes.storePrincipal.reload();
                    _this.winGestionarDocumento.stGridDetalles.reload();
                });
                _this.lotes.getStorePrincipal().commitChanges();
            }
        }
    },
    initLote: function () {
        var _this = this;
        if (this.lotes == undefined) {
            LOG.lb.lote.Loader.init(function () {
                    _this.lotes = new LOG.lb.lote.View({
                        formaVisualizacion: 'panel',
                        panelSuperior: false,
                        gridEditable: true,
                        ubicacion: true,
                        contabilizado: true,
                        sm: _this.winGestionarDocumento.smGridDetalles,
                        dirController: '/logistica/inventario/movimiento/index.php/inventario',
                        urlBusquedaGridPrincipal: 'cargarLotes',
                        grantedAction: function (_p) {
                            return (_this.grantedAction(_p) && _this.winGestionarDocumento.record.data.estado == '1' && _this.cmbTipoInventario.getValue() == 3);
                        },
                        _colorFilaFn: function (_r) {
                            if (_this.winGestionarDocumento.record.data.estado != '1' && parseFloat(_this.lotes.sm.getSelected().json.cantidad) >= 0) {
                                if (_r.json.conteopor == 2) {
                                    return 'fila-verde';
                                } else if (_r.json.conteopor == 1) {
                                    return 'fila-roja';
                                }
                            }
                        }
                    });
                    _this.lotes.init();
                _this.lotes.insertToolbarButton(LOG.util.UIManager.createBtn({
                    text: LOG.util.Idioma.lbBtnAnterior,
                    iconCls: 'anterior',
                    disabled: true,
                    handler: function () {
                        _this.winGestionarDocumento.smGridDetalles.selectPrevious();
                    },
                    controlFn: function (b) {
                        console.log(_this.winGestionarDocumento.record);
                        if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))) {
                            if (_this.winGestionarDocumento.record.json.cantproductos != 0) {
                                b.enable();
                            } else {
                                b.disabled();
                            }
                        }
                    }


                }), 0);
                _this.lotes.insertToolbarButton(LOG.util.UIManager.createBtn({
                    text: LOG.util.Idioma.lbBtnSiguiente,
                    iconCls: 'siguiente',
                    disabled: true,
                    handler: function () {
                        _this.winGestionarDocumento.smGridDetalles.selectNext();
                    },
                    controlFn: function (b) {
                        if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) && _this.winGestionarDocumento.record.json.cantproductos != 0) {
                            b.enable();
                        } else {
                            b.disabled();
                        }
                    }

                }), 1);
                    LOG.util.UIManager.apply(_this.lotes.listaColumnas.getBy('dataIndex', 'descripcion'), {
                        agrupador: true
                    });

                    LOG.util.UIManager.apply(_this.lotes.listaColumnas.getBy('dataIndex', 'existencia'), {
                        hidden: true
                    });

                    LOG.util.UIManager.apply(_this.lotes.listaColumnas.getBy('dataIndex', 'disponible'), {
                        hidden: true
                    });

                LOG.util.UIManager.apply(_this.lotes.listaColumnas.getBy('dataIndex', 'cantidad'), {
                    header: _this.idioma.cgConteo,
                    hideable: true,
                    editor: LOG.util.Prototipos.inputDecimal({})
                });

                    _this.formularioSur.add(_this.lotes.view());
                    _this.formularioSur.doLayout();
                    _this.formularioSur.expand();

                    _this.lotes.getGridPrincipal().on({
                        'afteredit': function (e) {
                            _this.modelo.habilitarBotones(!_this.modelo.basicForm.isValid());
                        },
                        'beforeedit': function (e) {
                            if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado != '2' || _this.winGestionarDocumento.tipoVentana == 3) {
                                e.cancel = true;
                            } else {
                                e.cancel = false;
                            }
                        }
                    });
                    LOG.util.UIManager.encadenaFn(_this.lotes.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'beforeload') {
                            _this.modelo.habilitarBotones(!_this.modelo.isValid());
                        }
                    }, 'seleccionar');
                    _this.formularioSur.expand();
                }
            );
        } else {
            _this.formularioSur.expand();
        }
    },
    /***
     *
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
            _parent.habilitarElementosWindow();
        });
    },
    cambiarColorFilaProducto: function (valor, celda, record, _row, _col) {
        var dat = (valor != null) ? valor : '';

        if (record.json.cantidad >= 0) {
            if ((record.json.faltante == 1) && (record.json.sobrante == 1))
                return '<span style="color:blue;">' + dat + '</span>';
            else if (record.json.sobrante == 1)
                return '<span style="color:green;">' + dat + '</span>';
            else if (record.json.faltante == 1)
                return '<span style="color:red;">' + dat + '</span>';
        } else if (parseFloat(record.data.cantidad) == -1) {
            record.data.cantidad = 0;
            return (0).toFixed(6);
        }
        return dat;
    },
    getLeyendConfig: function () {
        return {
            autoWidth: true,
            autoHeight: true,
            tpl: new Ext.XTemplate(
                '<div class="leyend-block">',
                '<h3>Producto con diferencias por:</h3>',
                '<ul>',
                //'<tpl for=".">',
                '<li style="color:red;">' + this.idioma.lbConteoPorFaltante + '</li>',
                '<li style="color:green;"> ' + this.idioma.lbConteoPorSobrante + '</li>',
                '<li style="color:blue;">' + this.idioma.lbConteoPorFaltanteSobrante + '</li>',
                //'</tpl>',
                '</ul>',
                '</div>'
            )
        };
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
            tipoinventario: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null
        } : {
            useSign: this.useSign,
            hasCategoria: (usarCategoria) ? 'true' : 'false',
            hasExistencia: btn.hasExistencia,
            iddocumento: record.get("iddocumento") || null,
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            monedacontable: window.monedacontable || window.idcontable,
            monedaalternativa: window.monedaalternativa || window.idalternativa
        };
    }
});

//