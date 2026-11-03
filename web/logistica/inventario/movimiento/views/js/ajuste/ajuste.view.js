Ext.ns('LOG.inv.ajuste');
LOG.inv.ajuste.View = Ext.extend(LOG.lb.documento.View, {
    listaAjustes: null,
    name: 'Ajuste',
    cantSign: 4,
    signDetails: {
        1: 'Confeccionado',
        2: 'Aprobado',
        3: 'Contabilizado',
        4: 'Anotado'
    },
    dirReport: '/logistica/inventario/movimiento/ajuste/',
    constructor: function (config) {
        config.urlBusquedaGridPrincipal = 'cargarDocumentos';
        config.modoSeleccion = 1;
        config.title = 'Ayuda de ajustes de inventario';
        config.referencia = "logistica/inventario/ajuste/ajusteinventario";
        config.model = new LOG.inv.ajuste.Model({
            idioma: config.idioma
        });
        this.modelo = new LOG.inv.ajuste.Model({
            idioma: config.idioma
        });
        this.concepto = config.idioma.concepto;
        this.listaAjustes = new Array();
        this.cargarAjustes();
        LOG.inv.ajuste.View.superclass.constructor.call(this, config);
    },
    init: function () {
        var _this = this;
        LOG.inv.ajuste.View.superclass.init.call(this);
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
                expand: function (_p) {
                    _p.show();
                    _this.lotes.listaBotones.each(function (b) {
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(this, [b, this]).call();
                        }
                    }.createDelegate(_this.lotes));
                    _this.winGestionarDocumento.doLayout();
                },
                collapse: function (_p) {
                    _p.hide();
                    _this.winGestionarDocumento.doLayout();
                }
            }
        });

        Ext.apply(this.winGestionarDocumento, {
            salvarHandler: function () {
                var _self = _this.winGestionarDocumento;
                _self.modelo.salvar({
                    idestructuracomun: _this.idDeposito
                }, function (r) {
                    if (_self.modelo.listaProductos.count() || _self.modelo.listaLotes.count()) {
                        _self.cargarProductos();
                    }
                    _self.tipoVentana = 2;
                    if (_self.record == null) {
                        _self.record = {};
                        Ext.apply(_self.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                signo: r.signo,
                                estado: "1",
                                fechacontable: r.fechacontable,
                                numeroref: r.numeroref,
                                nrodoc: r.nrodoc,
                                cantproductos: r.cantproductos
                            }
                        });
                    }
                    _this.habilitarElementosWinVentana();
                    _self.getTitleDocumento(r.iddocumento);
                    _self.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _self);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_self, [b, _self]).call();
                        }
                    }, _self);
                    if (r.signo == '+') {
                        _this.btnUbicaciones.setText(_this.idioma.lbBtnUbicar);
                        _this.btnUbicaciones.setTooltip(_this.idioma.ttBtnUbicarProductos);
                    } else {
                        _this.btnUbicaciones.setText(_this.idioma.lbBtnDesubicar);
                        _this.btnUbicaciones.setTooltip(_this.idioma.ttBtnDesubicarProductos);
                    }
                });
            },
            beforeEditProducto: function (o) {
                if ((this.record.data.estado != '1' || o.record.json.tienelote == '1' ||
                    o.record.json.equipo == '1' || o.record.json.municion == '1' || !!this.record.data.idinventario ||
                    (this.record.data.signo == '+' && this.smGridDetalles.getSelected().json.municion == 1))
                    && o.field == 'cantidad' || ((o.field == 'importe' || o.field == 'importealternativo')
                    && _this.cmbMotivoAjuste.getStore().getById(_this.cmbMotivoAjuste.getValue()).json.codigo != 'OPER_INV_IMPORTE_MAS'
                    && _this.cmbMotivoAjuste.getStore().getById(_this.cmbMotivoAjuste.getValue()).json.codigo != 'OPER_INV_IMPORTE_MEN')) {
                    o.cancel = true;
                }
                else {
                    if (o.field == 'cantidad' && o.record.json.decimales == '0') {
                        o.grid.getColumnModel().setEditor(o.column, LOG.util.Prototipos.inputEntero({}));
                    } else {
                        o.grid.getColumnModel().setEditor(o.column, LOG.util.Prototipos.inputDecimal({}));
                    }
                }
            }
        });
    },
    render: function () {
        var _this = this;
        var _res = LOG.inv.ajuste.View.superclass.render.call(this);

        this.formularioSur.on({
            'collapse': function () {
                this.hide();
                this.pContainer.doLayout();
            },
            'beforeexpand': function () {
                this.show();
                this.pContainer.doLayout();
            }
        }, this.formularioSur);
    },
    initVentanaGestion: function (d, tipoVentana) {
        var init = this.winGestionarDocumento.isInit();
        var _this = this;

        LOG.inv.ajuste.View.superclass.initVentanaGestion.createDelegate(this, [d, tipoVentana]).call();

        this.cmbMotivoAjuste.fireEvent('select', this.cmbMotivoAjuste, this.cmbMotivoAjuste.getStore().getById(this.cmbMotivoAjuste.getValue()));

        if (!init) {
            LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.btnNuevo, 'handler', function () {
                _this.winGestionarDocumento.tipoVentana = 1;
                _this.habilitarElementosWinVentana();
            });

            LOG.util.UIManager.encadenaFn(_this.winGestionarDocumento.smGridDetalles, 'fireEvent', function (e) {
                if (e == 'selectionchange') {
                    if (this.getCount() == 1 && this.getSelected().json.tienelote == '1') {
                        _this.initLote();
                    } else {
                        _this.formularioSur.collapse();
                    }
                }
            }, 'selection');
        }
    },
    initDefaultColumns: function () {
        var _this = this;
        LOG.inv.ajuste.View.superclass.initDefaultColumns.call(this);

        this.insertGridColumn({
            header: this.idioma.cgMotivoAjuste,
            width: 120,
            dataIndex: 'idoperacion',
            default: true,
            renderer: function (_value) {
                for (var i = 0; i < _this.listaAjustes.length; i++) {
                    if (_this.listaAjustes[i].idoperacion == _value) {
                        return _this.listaAjustes[i].descripcion;
                    }
                }
                return '-';
            }
        }, 3);

        var pos = this.listaColumnas.getPosByField('dataIndex', 'cantproductos', 'header');
        this.insertGridColumn({
            header: this.idioma.cgDocumentoInventario,
            width: 120,
            dataIndex: 'docinventario',
            renderer: function (_v) {
                return _v || '-';
            },
            default: true
        }, pos);
        this.insertGridColumn({
            header: 'Importe',
            width: 180,
            align: 'right',       
            dataIndex: 'importecontable',
            default: true
        }, pos+2);
        this.insertGridColumn({
            // header: 'Nro. Comprobante',
            // width: 120,
            // align: 'right',       
            dataIndex: 'nrocomprobante',
            default: true
        }, pos+3);
        this.addGridColumn({
            header: this.idioma.cgContabilizadoPor,
            width: 150,
            dataIndex: 'contabilizadopor',
            renderer: function (v) {
                return _this.getUsuarioById(v);
            },
            default: true
        });

        this.addGridColumn({dataIndex: 'idoperacion'});
        this.addGridColumn({dataIndex: 'signo'});
        this.addGridColumn({dataIndex: 'idinventario'});
        this.addGridColumn({dataIndex: 'controlfirma'});
        this.addGridColumn({dataIndex: 'idnodo'});
        this.addGridColumn({dataIndex: 'iddoc'});

        Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'importe'), LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgImporte + (alternativa ? ' ' + codigoContable : ''),
            width: 100,
            editor: LOG.util.Prototipos.inputDecimal({})
        }));
		Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'preciocontable'), LOG.util.Prototipos.columnaImporte({
            editor: LOG.util.Prototipos.inputDecimal({})
        }));

        this.addGridColumnProductos({dataIndex: 'diferencia'});
        this.addGridColumnProductos({dataIndex: 'signo'});
        pos = this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'importe', 'header');
        this.insertGridColumnProductos(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgImporteTotal + (alternativa ? ' ' + codigoContable : ''),
            width: 110,
            hidden: true,
            dataIndex: 'importetotal',
            align: 'right',
            default: true
        }), pos + 1);

        if (alternativa) {
            Ext.apply(this.winGestionarDocumento.listaGridColumnsProductos.getBy('dataIndex', 'preciocontable'), LOG.util.Prototipos.columnaPrecio({
                header: this.idioma.cgPrecio + ' ' + codigoContable
            }));
            pos = this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'importetotal', 'header');
            this.insertGridColumnProductos(LOG.util.Prototipos.columnaPrecio({
                header: this.idioma.cgPrecio + ' ' + codigoAlternativa,
                width: 100,
                dataIndex: 'precioalternativo',
				editor: LOG.util.Prototipos.inputDecimal({}),
                align: 'right',
                default: true
            }), pos + 1);
            this.insertGridColumnProductos(LOG.util.Prototipos.columnaImporte({
                header: this.idioma.cgImporte + ' ' + codigoAlternativa,
                width: 100,
                dataIndex: 'importealternativo',
                align: 'right',
                editor: LOG.util.Prototipos.inputDecimal({}),
                default: true
            }), pos + 2);

            this.insertGridColumnProductos(LOG.util.Prototipos.columnaImporte({
                header: this.idioma.cgImporteTotal + ' ' + codigoAlternativa,
                width: 110,
                hidden: true,
                dataIndex: 'importetotalalt',
                align: 'right',
                default: true
            }), pos + 3);
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
              header: 'Desubicar',
              gasto: true,
              width: 100,
              dataIndex: 'ubicacionunica',
              renderer: function(_v, _mD, _r) {
                  if (_r.json.ubicacionunica == false)
                      _mD.css = 'icondistra-aceptar verde';
                  else
                      _mD.css = 'icondistra-aceptar rojo';
              },
              default: true
          });
        }
    },
    initDefaultButtons: function () {
        LOG.inv.ajuste.View.superclass.initDefaultButtons.call(this);
        var _this = this;

        this.listaBotones.getItem(0).handler = this.listaBotones.getItem(0).handler.createSequence(function (e) {
            _this.habilitarElementosWinVentana();
        });

        this.listaBotones.getItem(0).tooltip = this.idioma.ttBtnAdicionar;

        this.listaBotones.getItem(1).handler = this.listaBotones.getItem(1).handler.createSequence(function (e) {
            _this.habilitarElementosWinVentana();
        });

        this.listaBotones.getItem(1).tooltip = this.idioma.ttBtnVerDetalles;

        this.listaBotones.getItem(2).tooltip = this.idioma.ttBtnEliminarDoc;

        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(
                        function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && this.getSelected().data.estado == 1 && !this.getSelected().data.idinventario) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }
                    )
                }

            }
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
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() && _caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 1) {
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
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() && _caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 2) {
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
                _this.habilitarElementosWinVentana();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() && _caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 2) {
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
        }), 5);

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
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(
                                (this.getCount() == 1 && this.getSelected().data.estado == 3) && //first
                                ((window.useSign && typeof pki == 'object') ? (_caller.getSmPrincipal().getSelected().get('controlfirma') == 2) : true)
                            ));
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }), 6);

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
                if (_caller.grantedAction('CT') || _caller.grantedAction('RContabilizar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(
                            (this.getCount() == 1 && this.getSelected().data.estado == 4) && //first
                            ((window.useSign && typeof pki == 'object') ? (_caller.getSmPrincipal().getSelected().get('controlfirma') == 2) : true)
                            ));
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }), 7);
        this.insertToolbarButton(this.__comprobante.btnGenerar, 8);

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'ajustar',
            text: 'Ajustar a cero',
            tooltip: 'Ajusta a cero productos sin existencia con submayor diferente a cero',
            handler: function () {
                _this.modelo.ajustarcero(_this.idDeposito);
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RAjustarCero')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }), 9);

        this.listaBotones.getItem(10).id = 'idajuste';

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarDoc,
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
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1' && !_this.winGestionarDocumento.record.data.idinventario) {
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
        //LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0),{tooltip: this.idioma.ttBtnEliminarDoc});

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(1), {
            tooltip: this.idioma.ttBtnConfirmar,
            disabled: true,
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
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWinVentana();
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
                    _this.winGestionarDocumento.record.data.estado = "1";
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWinVentana();
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
                    _this.winGestionarDocumento.cargarProductos();
                    _this.winGestionarDocumento.record.data.estado = "3";
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWinVentana();
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

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), LOG.util.Prototipos.botonContabilizar({
            tooltip: this.idioma.ttBtnContabilizar,
            disabled: true,
            key: null,
            handler: function () {
                _this.modelo.contabilizar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    _this.winGestionarDocumento.record.data.estado = "4";
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWinVentana();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RContabilizar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == "3") {
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

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(5), {
            controlFn: function (b, _caller) {
                b.hide();
            }
        });

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(6), {
            controlFn: function (b, _caller) {
                b.hide();
            }
        });

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesProductos.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarProducto,
            disabled: true,
            handler: _this.handlerEliminarMov,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() > 0 && _this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1'
                                    && !_this.winGestionarDocumento.record.data.idinventario) {
                                    b.enable();
                                }
                                else {
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
        this.btnProductoAjuste = LOG.util.UIManager.createBtn({
            iconCls: 'producto',
            text: this.idioma.lbBtnProducto,
            tooltip: this.idioma.ttBtnProducto,
            disabled: true,
            handler: function () {
                var codigo = _this.cmbMotivoAjuste.getStore().getById(_this.cmbMotivoAjuste.getValue()).json.codigo;
                var _p = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    parametros: {
                        idestructura: _this.idDeposito,
                        iddocumento: _this.modelo.iddocumento,
                        tipoproducto: codigo == 'OPER_INV_BAJA' ? "[3, 4]" : null,
                        comprometida: (codigo == 'OPER_INV_BAJA' || codigo == 'OPER_INV_FALTANTE'
                        || codigo == 'OPER_INV_MERMA' || codigo == 'OPER_INV_ROTURA') ? true : null
                    },
                    doAction: function (r) {
                        var _t = _p;
                        if (_t._parent != undefined) {
                            var _productos = new Array();
                            Ext.each(r, function (rec) {
                                _productos.push(rec.get('idproducto'));
                            });

                            if (_this.modelo.iddocumento == null) {
                                _this.modelo.salvar({
                                    idestructuracomun: _this.idDeposito,
                                    idproductos: Ext.encode(_productos)
                                }, function (resp) {
                                    _t.postSalvar.createDelegate(_t, [resp]).call();
                                });
                            } else {
                                _this.modelo.adicionarMovimientos({
                                    idproductos: Ext.encode(_productos),
                                    idoperacion: _this.cmbMotivoAjuste.getValue()
                                }, function (resp) {
                                    _t.postSalvar.createDelegate(_t, [resp]).call();
                                });
                            }
                        }
                    },
                    postSalvar: function (r) {
                        var _self = this._parent.winGestionarDocumento;
                        _self.cargarProductos();
                        if (_self.record == null) {
                            _self.record = {};
                            Ext.apply(_self.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    signo: r.signo,
                                    estado: "1",
                                    fechacontable: r.fechacontable,
                                    numeroref: r.numeroref,
                                    nrodoc: r.nrodoc,
                                    cantproductos: r.cantproductos
                                }
                            });

                        } else {
                            _self.record.data.estado = "1";
                            _self.record.data.signo = r.signo;
                            _self.record.data.cantproductos = r.cantproductos;
                        }
                        _this.habilitarElementosWinVentana();
                        _self.getTitleDocumento(_self.record.data.iddocumento);
                        _self.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _self);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_self, [b, _self]).call();
                            }
                        }, _self);
                        _p.getStorePrincipal().initBaseParams.iddocumento = _this.modelo.iddocumento;
                        _p.reiniciarBusqueda();
                        _self.modelo.getStore().reload();
                    }
                });
                _p.init();
                _p.tipoProducto.setDisabled(_this.cmbMotivoAjuste.getStore().getById(_this.cmbMotivoAjuste.getValue()).json.codigo == 'OPER_INV_BAJA');
                _this.vistaProductos = _p.view();
                _this.vistaProductos.show();
            },
            fnEspecialCondition: function () {
                if ((!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record &&
                    _this.winGestionarDocumento.record.data.estado == '1' && !_this.winGestionarDocumento.record.data.idinventario))
                    && (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) {
                    return false;
                }
                return true;
            },
            controlFn: function (b) {
                if (_this.grantedAction('RCRUD') || _this.grantedAction('CT')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.setVisible(true);
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1'
                            && !_this.winGestionarDocumento.record.data.idinventario) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }
            }
        });

        this.modelo.addActionButton(this.btnProductoAjuste, true);
        this.insertToolbarButtonProductos(this.btnProductoAjuste, 0);
		
		var btnTarjeta = LOG.util.UIManager.createBtn({
            btnTarg: true,
            iconCls: 'adicionar',
            text: 'Crear tarjeta',
            tooltip: 'Crear tarjeta',
            handler: function () {
                var winCrearTarjeta = new LOG.lb.producto.Tarjeta({
                    idioma: _this.idioma,
                    _parent: _this,
                    idestructura: _this.idDeposito,
                    postSalvar: function (r) {
                        _this.winGestionarDocumento.cargarProductos();
                        if (_this.winGestionarDocumento.record == null) {
                            _this.winGestionarDocumento.record = {};
                            Ext.apply(_this.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: _this.porfactura ? "13" : "1",
                                    cantproductos: r.cantproductos,
                                    idpadre: r.idpadre
                                }
                            });
                        }
                        _this.winGestionarDocumento.getTitleDocumento(r.iddocumento);
                        _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                            }
                        }, _this.winGestionarDocumento);
                    }
                });
                winCrearTarjeta.show();
            },
            fnEspecialCondition: function () {
                if ((!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record &&
                    _this.winGestionarDocumento.record.data.estado == '1' && !_this.winGestionarDocumento.record.data.idinventario))
                    && (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) {
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
        this.winGestionarDocumento.addToolbarButtonProductos(btnTarjeta, 1);
        this.modelo.addActionButton(btnTarjeta, true);

        this.btnUbicaciones = LOG.util.UIManager.createBtn({
            iconCls: 'ubicarproducto',
            text: this.idioma.lbBtnUbicar,
            tooltip: this.idioma.ttBtnUbicarProductos,
            disabled: true,
            handler: function () {
                if (_this.winGestionarDocumento.smGridDetalles.getSelected().json.signo == '+') {
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
                } else {
                    LOG.inv.ubicacion.Loader.init(function () {
                        var winUbicaciones = new LOG.lb.ubicacion.proceso({
                            cantidadAlternativa: true,
                            idioma: _this.idioma,
                            record: _this.winGestionarDocumento.smGridDetalles.getSelected().json,
                            desubicar: true
                        });
                        winUbicaciones.init();
                        winUbicaciones.view();
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1) {
                                    var codigo = _this.cmbMotivoAjuste.getStore().getById(_this.cmbMotivoAjuste.getValue()).json.codigo;
                                    if (_this.winGestionarDocumento.record &&
                                        _this.winGestionarDocumento.record.data.estado == '1' &&
                                        this.getSelected().json.tienelote != 1 &&
                                        this.getSelected().json.equipo != 1 &&
                                        this.getSelected().json.municion != 1 &&
                                        this.getSelected().json.cantidad > 0 &&
                                        codigo != 'OPER_INV_IMPORTE_MAS' && codigo != 'OPER_INV_IMPORTE_MEN' &&
                                        (
                                        (!this.getSelected().json.ubicacionunica && this.getSelected().json.signo == '-') ||
                                        this.getSelected().json.signo == '+')
                                    ) {
                                        b.enable();
                                    }
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'ubicarProd');
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.winGestionarDocumento.addToolbarButtonProductos(this.btnUbicaciones);

        this.winGestionarDocumento.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'lote',
            text: this.idioma.lbBtnLote,
            tooltip: this.idioma.ttBtnLote,
            disabled: true,
            handler: function () {
                _this.formularioSur.expand();
                _this.formularioSur.doLayout();
                if (_this.lotes.getStorePrincipal()) {
                    _this.lotes.getStorePrincipal().removeAll();
                    _this.lotes.getStorePrincipal().load();
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RB') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 &&
                                    this.getSelected().json.tienelote == 1 &&
                                    _this.cmbMotivoAjuste.lastSelectionText != 'Importe(-)' &&
                                    _this.cmbMotivoAjuste.lastSelectionText != 'Importe(+)') {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'loteProd');
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.winGestionarDocumento.addToolbarButtonProductos(LOG.util.UIManager.createBtn({
            iconCls: 'numeroserie',
            text: this.idioma.lbBtnNroSerie,
            tooltip: this.idioma.ttBtnNroSerie,
            disabled: true,
            handler: function () {
                if (_this.winGestionarDocumento.record.data.signo == '+') {
                    LOG.lb.numeroserie.Loader.init(function () {
                        this.winSerie = new LOG.lb.numeroserie.Entrada({
                            producto: _this.winGestionarDocumento.smGridDetalles.getSelected().data,
                            documento: _this.winGestionarDocumento.record.data,
                            idestructura: _this.idDeposito,
                            ajuste: _this.cmbMotivoAjuste.lastSelectionText,
                            fecha: fecha,
                            confubicacion: confubicacion,
                            cerrarFn: function () {
                                _this.winGestionarDocumento.stGridDetalles.reload();
                            }
                        });
                        this.winSerie.init();
                        this.winSerie.view();
                    });
                } else {
                    var codigo = _this.cmbMotivoAjuste.getStore().getById(_this.cmbMotivoAjuste.getValue()).json.codigo;
                    LOG.lb.numeroserie.Loader.init(function () {
                        this.winSerie = new LOG.lb.numeroserie.Salida({
                            producto: _this.winGestionarDocumento.smGridDetalles.getSelected().data,
                            documento: _this.winGestionarDocumento.record.data,
                            idestructura: _this.idDeposito,
                            fecha: fecha,
                            confubicacion: confubicacion,
                            ajuste: _this.cmbMotivoAjuste.lastSelectionText,
                            afecta: (codigo == 'OPER_INV_BAJA' || codigo == 'OPER_INV_FALTANTE'
                            || codigo == 'OPER_INV_MERMA' || codigo == 'OPER_INV_ROTURA') ? true : null,
                            cerrarFn: function () {
                                _this.winGestionarDocumento.stGridDetalles.reload();
                            }
                        });
                        this.winSerie.init();
                        this.winSerie.view();
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RB') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && _this.winGestionarDocumento.record &&
//                                    _this.winGestionarDocumento.record.data.estado == '1' &&
                                    this.getSelected().json.equipo == 1 &&
                                    _this.cmbMotivoAjuste.lastSelectionText != 'Importe(-)' &&
                                    _this.cmbMotivoAjuste.lastSelectionText != 'Importe(+)') {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'nroserieProd');
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
                    var codigo = _this.cmbMotivoAjuste.getStore().getById(_this.cmbMotivoAjuste.getValue()).json.codigo;
                    var municiones = new LOG.inv.municiones.View({
                        idestructura: _this.idDeposito,
                        ajuste: true,
                        producto: _this.winGestionarDocumento.smGridDetalles.getSelected().data,
                        documento: _this.winGestionarDocumento.record.data,
                        salida: true,
                        afecta: (codigo == 'OPER_INV_BAJA' || codigo == 'OPER_INV_FALTANTE'
                        || codigo == 'OPER_INV_MERMA' || codigo == 'OPER_INV_ROTURA') ? true : false,
                        confubicacion: confubicacion,
                        fecha: fecha,
                        baseParams: {estado: 2},
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
                    if (_this.grantedAction('RB')) {
                        b.setVisible(true);
                        if (_this.winGestionarDocumento.tipoVentana == 3) {
                            b.hide();
                        } else {
                            b.show();
                            LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                                if (e == 'selectionchange') {
                                    if (this.getCount() == 1 && _this.winGestionarDocumento.record &&
//                                        _this.winGestionarDocumento.record.data.estado == '1' &&
                                        this.getSelected().json.municion == 1 &&
                                        _this.cmbMotivoAjuste.lastSelectionText != 'Importe(-)' &&
                                        _this.cmbMotivoAjuste.lastSelectionText != 'Importe(+)') {
                                        b.enable();
                                    } else {
                                        b.disable();
                                    }
                                }
                            }, 'partidaProd');
                        }
                    } else {
                        b.setVisible(false);
                    }
                }
            }));
        }

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

       /* this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonAnularEstado({
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
                        }
                    }
                }
            }
        }));*/
    },
    panelSuperior: function () {
        var _this = this;

        this.cmbMotivoAjuste = new LOG.util.ComboBox({
            fieldLabel: this.idioma.cmbMotivoAjuste,
            url: 'cargaMotivoAjuste',
            hiddenName: 'idoperacion',
            valueField: 'idoperacion',
            displayField: 'descripcion',
            editable: false,
            allowBlank: false,
            combo: true,
            campo: true,
            listeners: {
                select: function (cb, r) {
                    var pos = _this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'importe', 'header');
                    var posAlt = _this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'importealternativo', 'header');
                    if (r && (r.json.codigo == 'OPER_INV_IMPORTE_MAS' || r.json.codigo == 'OPER_INV_IMPORTE_MEN')) {
                        _this.winGestionarDocumento.ocultarColumna('cantidad');
                        _this.winGestionarDocumento.ocultarColumna('importetotal', false);
                        _this.winGestionarDocumento.ocultarColumna('importetotalalt', false);
                        var nombre = (cb.getValue() == 990000000253 ? _this.idioma.cgImporteMas : _this.idioma.cgImporteMenos);
                        _this.winGestionarDocumento.gridDetalles.getColumnModel().setColumnHeader(pos + 1, nombre + (alternativa ? ' ' + codigoContable : ''));
                        if (alternativa) {
                            _this.winGestionarDocumento.gridDetalles.getColumnModel().setColumnHeader(posAlt + 1, nombre + ' ' + codigoAlternativa);
                        }
                    } else {
                        _this.winGestionarDocumento.ocultarColumna('cantidad', false);
                        _this.winGestionarDocumento.ocultarColumna('importetotal');
                        _this.winGestionarDocumento.ocultarColumna('importetotalalt');
                        _this.winGestionarDocumento.gridDetalles.getColumnModel().setColumnHeader(pos + 1, _this.idioma.cgImporte + (alternativa ? ' ' + codigoContable : ''));
                        if (alternativa) {
                            _this.winGestionarDocumento.gridDetalles.getColumnModel().setColumnHeader(posAlt + 1, _this.idioma.cgImporte + ' ' + codigoAlternativa);
                        }
                    }
                    _this.winGestionarDocumento.doLayout();
                }
            }
        });

        this.taObservaciones = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbObservaciones,
            name: 'observaciones',
            maxLength: 255,
            minLength: 2,
            minLengthText: this.idioma.msjMinLengthText,
            maxLengthText: this.idioma.msjMaxLengthText,
            allowBlank: false,
            tabular: true,
            campo: true
        });

        this.panelSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        this.panelSuperior.addComponent(this.cmbMotivoAjuste);

        this.panelSuperior.addComponent(this.taObservaciones);

        this.formularioGeneral = LOG.util.UIManager.initPanel({
            layout: 'form',
            labelAlign: 'top',
            items: [this.panelSuperior]
        });
    },
    habilitarElementosWinVentana: function () {
        Ext.each(this.winGestionarDocumento.panelSuperior.find('campo', true), function (item) {
            var deshbilitar = this.record && (this.record.data.estado != '1' || this.record.data.idinventario);
            if (item.combo) {
                deshbilitar = deshbilitar || (this.record && this.record.data.cantproductos > 0);
            }
            item.setDisabled(deshbilitar);
        }, this.winGestionarDocumento);
        if (this.winGestionarDocumento.record) {
            if (this.winGestionarDocumento.record.data.signo == '+') {
                this.btnUbicaciones.setText(this.idioma.lbBtnUbicar);
                this.btnUbicaciones.setTooltip(this.idioma.ttBtnUbicarProductos);
            } else {
                this.btnUbicaciones.setText(this.idioma.lbBtnDesubicar);
                this.btnUbicaciones.setTooltip(this.idioma.ttBtnDesubicarProductos);
            }
        }
        this.winGestionarDocumento.buttons[1].setVisible(!this.winGestionarDocumento.record || (this.winGestionarDocumento.record && this.winGestionarDocumento.record.data.estado != '3'));
        this.winGestionarDocumento.buttons[2].setVisible(!this.winGestionarDocumento.record || (this.winGestionarDocumento.record && this.winGestionarDocumento.record.data.estado == '1'));
    },
    cargarAjustes: function () {
        var _this = this;
        _this.modelo.cargarAjustes({}, function (r) {
            _this.listaAjustes = r[0];
        });
    },
    initLote: function () {
        var _this = this;
        var codigo = _this.cmbMotivoAjuste.getStore().getById(_this.cmbMotivoAjuste.getValue()).json.codigo;
        if (this.lotes == undefined) {
            LOG.lb.lote.Loader.init(function () {
                _this.lotes = new LOG.lb.lote.View({
                    formaVisualizacion: 'panel',
                    panelSuperior: false,
                    contabilizado: true,
                    gridEditable: true,
                    afectaLote: (codigo == 'OPER_INV_BAJA' || codigo == 'OPER_INV_FALTANTE'
                    || codigo == 'OPER_INV_MERMA' || codigo == 'OPER_INV_ROTURA') ? true : false,
                    afectaProducto: (codigo == 'OPER_INV_BAJA' || codigo == 'OPER_INV_FALTANTE'
                    || codigo == 'OPER_INV_MERMA' || codigo == 'OPER_INV_ROTURA') ? true : false,
                    btnEliminar: true,
                    ubicacion: true,
                    iddeposito: _this.idDeposito,
                    datos: {iddocumento: _this.winGestionarDocumento.record.data.iddocumento},
                    sm: _this.winGestionarDocumento.smGridDetalles,
                    dirController: '/logistica/inventario/movimiento/index.php/ajuste',
                    urlBusquedaGridPrincipal: 'cargarLotes',
                    grantedAction: function (_p) {
                        return (_this.grantedAction(_p) && _this.winGestionarDocumento.record.data.estado == '1' && !_this.winGestionarDocumento.record.data.idinventario);
                    },
                    _postEliminarFn: function () {
                        _this.winGestionarDocumento.stGridDetalles.reload();
                    },
                    getSumaCantidadVieja: function () {
                        var suma = 0;
                        _this.lotes.getStorePrincipal().each(function (l) {
                            suma += parseFloat(l.data.cantidadVieja);
                        });
                        return suma;
                    }
                });
                _this.lotes.init();

                _this.lotes.insertToolbarButton(LOG.util.UIManager.createBtn({
                    iconCls: 'lote',
                    text: _this.idioma.lbBtnLote,
                    tooltip: _this.idioma.ttBtnLote,
                    handler: function () {
                        var codigo = _this.cmbMotivoAjuste.getStore().getById(_this.cmbMotivoAjuste.getValue()).json.codigo;
                        var winLote = new LOG.lb.lote.adicionarLote({
                            contabilizado: 1,
                            idproducto: _this.winGestionarDocumento.smGridDetalles.getSelected().data.idproducto,
                            idmovimiento:  _this.winGestionarDocumento.smGridDetalles.getSelected().data.idmovimiento,
                            iddocumento: _this.winGestionarDocumento.record.data.iddocumento,
                            signo: _this.winGestionarDocumento.smGridDetalles.getSelected().json.signo,
                            afectaLote: (codigo == 'OPER_INV_BAJA' || codigo == 'OPER_INV_FALTANTE'
                            || codigo == 'OPER_INV_MERMA' || codigo == 'OPER_INV_ROTURA') ? true : false,
                            afectaProducto: (codigo == 'OPER_INV_BAJA' || codigo == 'OPER_INV_FALTANTE'
                            || codigo == 'OPER_INV_MERMA' || codigo == 'OPER_INV_ROTURA') ? true : false,
                            gridEditable: false,
                            _postSalvarFn: function () {
                                if (_this.lotes.getStorePrincipal()) {
                                    _this.lotes.getStorePrincipal().reload();
                                }        
                            }
                        });
                        winLote.init();
                        winLote.view();
                    },
                    controlFn: function (b) {
                        if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                            && _this.winGestionarDocumento.record.data.estado == '1' && !_this.winGestionarDocumento.record.data.idinventario) {
                            b.show();
                        } else {
                            b.hide();
                        }
                    }
                }), 0);   

                Ext.apply(_this.lotes.listaColumnas.getBy('dataIndex', 'descripcion'), {
                    hidden: true,
                    agrupador: true
                });

                LOG.util.UIManager.apply(_this.lotes.listaColumnas.getBy('dataIndex', 'cantidad'), LOG.util.Prototipos.columnaCantidad({
                    editor: LOG.util.Prototipos.inputDecimal({})
                }));
                _this.lotes.addGridColumn({dataIndex: 'cantidadVieja'});
                _this.lotes.addGridColumn({dataIndex: 'cantubicada'});
                _this.lotes.addGridColumn({dataIndex: 'total'});

                _this.formularioSur.add(_this.lotes.view());

                LOG.util.UIManager.encadenaFn(_this.lotes.getGridPrincipal(), 'fireEvent', function (e, o) {
                    if (e == 'afteredit') {
                        var record = _this.winGestionarDocumento.smGridDetalles.getSelected();
                        if ((_this.lotes.modelo.getSumaCantidad() + (parseFloat(o.record.data.total) - _this.lotes.getSumaCantidadVieja())) > parseFloat(record.data.cantidad) && _this.winGestionarDocumento.record.data.idinventario) {
                            o.record.data.cantidad = parseFloat(record.data.cantidad) - ((_this.lotes.modelo.getSumaCantidad() + (parseFloat(o.record.data.total) - _this.lotes.getSumaCantidadVieja())) - parseFloat(o.record.data.cantidad));
                            mostrarMensaje(3, _this.idioma.msgErrorCantAjustar);
                        } else if (parseFloat(o.record.data.cantidad) > parseFloat(o.record.data.cantubicada) && record.json.signo == '-') {
                            if (_this.winGestionarDocumento.record.data.idinventario) {
                                o.record.data.cantidad = Math.min(parseFloat(o.record.data.cantubicada), (parseFloat(record.data.cantidad) - (_this.lotes.modelo.getSumaCantidad() - parseFloat(o.record.data.cantidad))));
                            } else {
                                o.record.data.cantidad = parseFloat(o.record.data.cantubicada);
                            }
                            mostrarMensaje(3, _this.idioma.msgErrorCantUbicada);
                        }
                        o.grid.view.refresh();
                        _this.modelo.editarLote(o.record.data);
                    }
                }, 'gridLote');
                LOG.util.UIManager.encadenaFn(_this.lotes.getStorePrincipal(), 'fireEvent', function (e) {
                    if (e == 'beforeload') {
                        _this.modelo.listaLotes.deleteAll();
                        _this.modelo.habilitarBotones(!_this.modelo.isValid());
                    }
                }, 'cargarL');
            });
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
            _parent.habilitarElementosWinVentana();
        });
    },
    getParamsReport: function (record, btn) {
	     var _this = this;
        return btn.isList ? {
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
            contabilizadopor: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null,
            creadopor: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
            fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d-m-Y') : null,
            fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d-m-Y') : null,
            motivoajuste: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null

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
