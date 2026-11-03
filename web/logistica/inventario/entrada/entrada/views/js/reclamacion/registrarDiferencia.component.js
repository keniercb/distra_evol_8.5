Ext.ns('LOG.inv.entrada.registrarDiferencia');
LOG.inv.entrada.registrarDiferencia.View = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        this.idioma = LOG.util.UIManager.apply(LOG.util.Idioma, LOG.inv.entrada.registrarDiferencia.Idioma);
        LOG.util.UIManager.apply(this, config);
        config.title = this.idioma.tlVentanaRegistrarDif;
        config.width = 500;
        config.height = config.enfalta ? 220 : (config.alternativa ? 587 : 537);
        config.resizable = false;
        this.usarAplicar = false;
        this.modelo = new LOG.inv.entrada.registrarDiferencia.Model({
            idioma: this.idioma
        });
        this.modelo.idmovimiento = config.idmovimiento;
        this.modelo.dif = this.dif;
        this.modelo.idestructuracomun = config.idestructuracomun;
        LOG.inv.entrada.registrarDiferencia.View.superclass.constructor.call(this, config);
    },
    initComponent: function() {
        var _this = this;

        Ext.apply(this, {
            tbar: [
                '->',
                new LOG.util.Prototipos.botonAyuda({
                    id: 'idDiferencia',
                    referencia: '/logistica/inventario/entrada/entrada/index.php/reclamacion'
                })
            ]
        });

        LOG.util.UIManager.apply(this.listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({}, true));
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), LOG.util.Prototipos.botonGuardar({
            /*hidden: (!(_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) || _this.porfactura),*/
            handler: function() {
                _this.modelo.salvar({}, function() {
                    _this.modelo.resetearLista();
                    if (typeof _this._postSalvar == 'function') {
                        _this._postSalvar.createDelegate(this).call();
                    }
                });
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar') || !_this.porfactura) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }));
        this.modelo.addActionButton(this.listaBotones.getItem(2));

        var precio = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: _this.idioma.lbNfPrecio + (_this.alternativa ? ' ' + _this.codContable : ''),
            name: 'preciodiferencia',
            value: 0,
            disabled: (!(_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))),
            enableKeyEvents: true,
            selectOnFocus: true,
            listeners: {
                keyup: function() {
                    if (precio.getValue()) {
                        importe.setValue(parseFloat(precio.getValue()) * parseFloat(_this.cantDif.getValue()));
                    } else {
                        importe.setValue(0);
                    }
                },
                blur: function() {
                    if (!precio.getValue()) {
                        precio.setValue(0);
                    }
                    importe.fireEvent('keyup');
                    if (precio.getValue() == 0) {
                        _this.modelo.preciodiferencia = 0;
                    }
                }
            }
        });
        var importe = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: _this.idioma.lbNfImporte + (_this.alternativa ? ' ' + _this.codContable : ''),
            name: 'importediferencia',
            value: 0,
            disabled: (!(_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))),
            decimalPrecision: 2,
            enableKeyEvents: true,
            selectOnFocus: true,
            listeners: {
                keyup: function() {
                    if (importe.getValue() > 0) {
                        precio.setValue(parseFloat(importe.getValue()) / parseFloat(_this.cantDif.getValue()));
                    } else {
                        precio.setValue(0);
                    }
                },
                blur: function() {
                    if (!importe.getValue()) {
                        importe.setValue(0);
                    }
                    precio.fireEvent('keyup');
                    if (importe.getValue() == 0) {
                        _this.modelo.importediferencia = 0;
                    }
                }
            }
        });

        if (_this.alternativa) {
            var precioAlt = new LOG.util.Prototipos.inputDecimal({
                fieldLabel: _this.idioma.lbNfPrecio + ' ' + _this.codAlternativa,
                name: 'preciodiferenciaalt',
                value: 0,
                disabled: (!(_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))),
                enableKeyEvents: true,
                selectOnFocus: true,
                listeners: {
                    keyup: function() {
                        if (precioAlt.getValue()) {
                            importeAlt.setValue(parseFloat(precioAlt.getValue()) * parseFloat(_this.cantDif.getValue()));
                        } else {
                            importeAlt.setValue(0);
                        }
                    },
                    blur: function() {
                        if (!precioAlt.getValue()) {
                            precioAlt.setValue(0);
                        }
                        importeAlt.fireEvent('keyup');
                        if (precioAlt.getValue() == 0) {
                            _this.modelo.preciodiferencia = 0;
                        }
                    }
                }
            });
            var importeAlt = new LOG.util.Prototipos.inputDecimal({
                fieldLabel: _this.idioma.lbNfImporte + ' ' + _this.codAlternativa,
                name: 'importediferenciaalt',
                value: 0,
                disabled: (!(_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))),
                decimalPrecision: 2,
                enableKeyEvents: true,
                selectOnFocus: true,
                listeners: {
                    keyup: function() {
                        if (importeAlt.getValue() > 0) {
                            precioAlt.setValue(parseFloat(importeAlt.getValue()) / parseFloat(_this.cantDif.getValue()));
                        } else {
                            precioAlt.setValue(0);
                        }
                    },
                    blur: function() {
                        if (!importeAlt.getValue()) {
                            importeAlt.setValue(0);
                        }
                        precioAlt.fireEvent('keyup');
                        if (importeAlt.getValue() == 0) {
                            _this.modelo.importediferencia = 0;
                        }
                    }
                }
            });
        }

        this.cantDif = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: _this.idioma.lbNfCantidad,
            name: 'cantidaddiferencia',
            value: 0,
            disabled: this.porfactura || this.condiferencia,
            enableKeyEvents: true,
            selectOnFocus: true,
            invalidText: _this.idioma.lbMsgCantMinima,
            validate: Ext.form.NumberField.prototype.validate.createInterceptor(function() {
                if (!this.disabled && this.getValue() == 0 && _this.motivo.getValue()) {
                    this.markInvalid();
                    return false;
                }
                this.clearInvalid();
            }),
            listeners: {
                blur: function(_nf) {
                    if (!_nf.getValue()) {
                        _nf.setValue(0);
                    }
                }
            }
        });

        this.motivo = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCbMotivo,
            valueField: 'idmotivo',
            displayField: 'motivo',
            name: 'signo',
            triggerAction: 'all',
            editable: false,
            disabled: (!(_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) || _this.enfalta || _this.porfactura),
            mode: 'local',
            value: _this.enfalta ? 2 : '',
            store: new Ext.data.SimpleStore({
                fields: ['idmotivo', 'motivo'],
                data: [
                    [1, _this.idioma.lbStSobrante],
                    [2, _this.idioma.lbStFaltante]
                ]
            }),
            listeners: {
                select: function() {
                    if (this.getValue() && !_this.porfactura && (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))) {
                        _this.cantDif.enable();
                        if (_this.btnBorrar) {
                            _this.btnBorrar.enable();
                        }
                    }
                }
            }
        });

        LOG.inv.entrada.registrarDiferencia.View.superclass.initComponent.call(this);

        var clsCantidad = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        clsCantidad.addComponent(this.motivo);
        clsCantidad.addComponent(this.cantDif);
        if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) && !_this.porfactura) {
            this.btnBorrar = LOG.util.UIManager.createBtn({
                text: _this.idioma.lbBtnBorrar,
                tooltip: _this.idioma.ttBtnBorrar,
                iconCls: 'borrar',
                disabled: true,
                handler: function() {
                    if (!_this.enfalta) {
                        _this.motivo.setValue('');
                    }
                    _this.cantDif.setValue(0);
                    _this.cantDif.disable();
                    _this.motivo.fireEvent('select');
                    _this.cantDif.fireEvent('keyup');
                    _this.btnBorrar.setDisabled(!_this.enfalta);
                }
            });
            clsCantidad.addComponent(LOG.util.UIManager.initPanel({
                items: [
                    LOG.util.UIManager.initPanel({height: 19}),
                    _this.btnBorrar
                ]
            }));
            clsCantidad.getColumn(0).columnWidth = 0.43;
            clsCantidad.getColumn(1).columnWidth = 0.43;
            clsCantidad.getColumn(2).columnWidth = 0.14;
        } else {
            clsCantidad.getColumn(0).columnWidth = 0.5;
            clsCantidad.getColumn(1).columnWidth = 0.5;
        }

        var clsPrecioImporte = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        clsPrecioImporte.addComponent(precio);
        clsPrecioImporte.addComponent(importe);
        if (_this.alternativa) {
            clsPrecioImporte.addComponent(precioAlt);
            clsPrecioImporte.addComponent(importeAlt);
        }

        var fsCantidad = new Ext.form.FieldSet({
            title: _this.idioma.lbFsDiferenciaSobFalt,
            style: '-moz-border-radius:5px',
            items: [clsCantidad]
        });
        var fsPrecioImporte = new Ext.form.FieldSet({
            title: _this.idioma.lbFsPrecioImporte,
            style: '-moz-border-radius:5px',
            hidden: this.enfalta,
            items: [clsPrecioImporte]
        });

        var fpCantidad = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            border: false,
            items: [fsCantidad, fsPrecioImporte]
        });

        this.modelo.cargaInicial({
            url: '/logistica/inventario/entrada/entrada/index.php/reclamacion/cargarDiferenciasXCantidad',
            idmovimiento: _this.idmovimiento,
            dif: _this.dif
        }, function(r) {
            r[0].signo = _this.enfalta ? 2 : r[0].signo;
            fpCantidad.getForm().loadRecord({data: r[0]});
            _this.modelo.cantidadmaxima = _this.cantidad = r[0].cantidad;
            _this.modelo.setDefaulFormValues();
            _this.motivo.fireEvent('select');
            _this.cantDif.fireEvent('keyup');
            precio.fireEvent('blur');
            importe.fireEvent('blur');
        });
        
        var panel = LOG.util.UIManager.initPanel({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [fpCantidad]
        });
        
        if (!this.enfalta) {
            var panelCalidad = new LOG.inv.entrada.panelCalidad({
                idioma: this.idioma,
                modelo: this.modelo,
                idmovimiento: this.idmovimiento,
                gridEditable: ((this.grantedAction('CT') || this.grantedAction('RCRUD') || this.grantedAction('RAdicionar')))
            });
            panelCalidad.init();
            var p = panelCalidad.view();

            var fsInferior = new Ext.form.FieldSet({
                title: _this.idioma.lbFsDiferenciaPorCantidad,
                style: '-moz-border-radius:5px',
                hidden: this.enfalta,
                items: [
                    LOG.util.UIManager.initPanel({
                        layout: 'border',
                        region: 'center',
                        height: 185,
                        items: [p]
                    })
                ],
                listeners: {
                    collapse: function() {
                        _this.doLayout();
                    },
                    beforeexpand: function() {
                        _this.doLayout();
                    }
                }
            });
            
            panel.add(fsInferior);
        }

        this.modelo.bindForm(fpCantidad);

        this.add(panel);
    }
});

/**
 * Panel para las diferencias de calidad.
 */
LOG.inv.entrada.panelCalidad = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.urlBusquedaGridPrincipal = 'cargarDiferenciasXCalidad';
        this.modoSeleccion = 1;
        this.autoSelect = false;
        this.showMsgCargar = false;
        this.autoLoad = false;
        this.panelBotonesVisible = config.gridEditable;
        this.formaVisualizacion = 'panel';
        LOG.inv.entrada.panelCalidad.superclass.constructor.call(this, config);
    },
    render: function() {
        var render = LOG.inv.entrada.panelCalidad.superclass.render.call(this);
        var _this = this;
        this.getStorePrincipal().on({
            beforeload: function() {
                this.initBaseParams.idmovimiento = _this.idmovimiento;
            },
            load: function() {
                _this.modelo.resetearLista();
            }
        });
        this.cbCalidad.getStore().on({
            load: function() {
                _this.getStorePrincipal().baseParams.idmovimiento = _this.idmovimiento;
                _this.getStorePrincipal().load();
            }
        });
        this.getGridPrincipal().on({
            afteredit: function(e) {
                e.record.data.cantidaddiferencia = _this.modelo.actualizarListaCalidad(e.record.data, false);
                e.grid.getView().refresh();
            }
        });
        return render;
    },
    initDefaultButtons: function() {
        var _this = this;
        this.btnAdicionar = LOG.util.Prototipos.botonAdicionar({
            tooltip: _this.idioma.ttBtnAdicionar,
            handler: function() {
                _this.getStorePrincipal().add(new Ext.data.Record({cantidaddiferencia: 0}));
            },
            controlFn: function(b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function(e) {
                    if (e == 'add' || e == 'load') {
                        if (_this.gridEditable && this.getCount() < _this.cbCalidad.cantidad) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                    if (e == 'remove') {
                        b.enable();
                    }
                }, 'addDiferencia');
            }
        });
        Ext.apply(this.btnAdicionar, {key: null});
        this.addToolbarButton(this.btnAdicionar);
        this.btnEliminar = LOG.util.Prototipos.botonEliminar({
            disabled: true,
            handler: function() {
                _this.modelo.actualizarListaCalidad(_this.getSmPrincipal().getSelected().data, true);
                _this.getStorePrincipal().remove(_this.getSmPrincipal().getSelected());
            },
            controlFn: function(b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                    if (e == 'selectionchange') {
                        if (_this.gridEditable && this.getCount() == 1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'eliminarDiferencia');
                LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function(e) {
                    if (e == 'load') {
                        b.disable();
                    }
                }, 'eliminarDiferencia2');
            }
        });
        Ext.apply(this.btnEliminar, {key: null});
        this.addToolbarButton(this.btnEliminar);
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({dataIndex: 'idmovdiferenciacalidad'});
        this.addGridColumn({dataIndex: 'idmovimiento'});

        this.cbCalidad = new Ext.erp.comboNomenclador({
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomCalidadmovdiferencia',
            idnom: 'idcalidad',
            name: 'denominacion',
            autoCargar: true,
            allowBlank: false,
            listeners: {
                focus: function(_cb) {
                    _cb.fireEvent('expand', _cb);
                },
                expand: function(_cb) {
                    _cb.getStore().filterBy(function(item) {
                        return _this.getStorePrincipal().find('idcalidad', item.data.idcalidad) == -1;
                    });
                }
            }
        });
        this.cbCalidad.getStore().on({
            load: function(_st) {
                _this.cbCalidad.cantidad = _st.getCount();
            }
        });
        this.addGridColumn({
            header: this.idioma.gcDenominacion,
            autoExpand: true,
            dataIndex: 'idcalidad',
            editor: this.cbCalidad,
            renderer: function(_v, _mD, _r) {
                _r.data.idmovimiento = _this.idmovimiento;
                var calidad = this.editor.getStore().getById(_v);
                if (calidad) {
                    calidad = calidad.data.denominacion;
                }
                return calidad;
            },
            default: true
        });

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.gcCantidad,
            width: 100,
            dataIndex: 'cantidaddiferencia',
            align: 'right',
            editor: new LOG.util.Prototipos.inputDecimal({
                allowBlank: false,
                minValue: 0.01,
                decimalPrecision: 2,
                minText: _this.idioma.lbMsgCantMinima
            }),
            default: true
        }));
    }
});