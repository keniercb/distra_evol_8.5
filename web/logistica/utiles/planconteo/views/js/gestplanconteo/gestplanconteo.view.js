Ext.ns('LOG.lb.gestplanconteo');

LOG.lb.gestplanconteo.View = Ext.extend(LOG.util.UITemplate, {
    seleccion: undefined,
    subsistema: undefined,
    constructor: function(config) {
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.lb.gestplanconteo.Idioma);
        this.dirController = '/logistica/utiles/planconteo/index.php/planconteo';
        this.urlBusquedaGridPrincipal = 'cargarPlanesConteo';
        this.modoSeleccion = 1;
        this.busquedaBasica = true;
        this.autoLoad = false;
        this.gridEditable = true;
        this.modelo = new LOG.lb.gestplanconteo.Modelo({
            idioma: config.idioma
        });
        LOG.lb.gestplanconteo.View.superclass.constructor.call(this, config);
    },
    render: function() {
        var _this = this;
        var vis = LOG.lb.gestplanconteo.View.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function() {
                this.initBaseParams.subsistema = _this.subsistema;
            }
        });
       
        this.getStorePrincipal().on('load', function(st, records, options) {
            if (records.length > 0) {
                this.listaBotones.getItem(0).disable();
                if (records[0].data.estadoplan == 1) {
                    this.listaBotones.getItem(2).enable();
                }
                else
                    this.listaBotones.getItem(2).disable();
            }
            else {
                this.listaBotones.getItem(1).disable();
                this.listaBotones.getItem(2).disable();
                this.listaBotones.getItem(3).disable();
                this.listaBotones.getItem(4).disable();
                this.listaBotones.getItem(5).disable();
                this.listaBotones.getItem(0).enable();
            }
        }, _this);
        this.getSmPrincipal().moveEditorOnEnter = false;
        this.getSmPrincipal().on('rowselect', function(sm, rowIndex, record) {
            if (record.data.estado == 'Elaboración') {
                this.listaBotones.getItem(1).enable();
                this.listaBotones.getItem(3).enable();
                this.listaBotones.getItem(4).disable();
                this.listaBotones.getItem(5).disable();
            }
            else if (record.data.estado == 'Preparado') {
                this.listaBotones.getItem(1).disable();
                this.listaBotones.getItem(3).disable();
                this.listaBotones.getItem(4).enable();
                this.listaBotones.getItem(5).enable();
            }
            else {
                this.listaBotones.getItem(1).disable();
                this.listaBotones.getItem(3).disable();
                this.listaBotones.getItem(4).disable();
                this.listaBotones.getItem(5).disable();
            }
        }, _this);
        _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function(e,obj) {
            if(e == 'beforeedit'){
                if(obj.record.data.estadoplan != 1){
                    obj.cancel = true;
                }
            }
        });
        this.getGridPrincipal().on({
            'keypress': function(eventoObject) {
                if (eventoObject.getCharCode() == 13) {
                    _this.actualizarPorciento(this.getStore().getModifiedRecords());
                }
            }
        });
        return vis;
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            dataIndex: 'idplan',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idplanconteom',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'estadoplan',
            hidden: true
        });
        this.addGridColumn({header: this.idioma.cgEjercicio,
            width: 80,
            dataIndex: 'nbejercicio',
            default: true,
            agrupador: true
        });
        this.addGridColumn({
            header: this.idioma.cgPeriodo,
            width: 120,
            dataIndex: 'idperiodo',
            default: true,
            renderer: function(v) {
                return LOG.lb.meses.Periodos[v];
            }
        });
        this.addGridColumn({
            header: this.idioma.cgEstado,
            width: 90,
            dataIndex: 'estado',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgPorciento,
            width: 120,
            dataIndex: 'porciento',
            default: true,
            editor: new LOG.util.Prototipos.inputEntero({
                allowBlank: false,
                maxValue: 100,
                minValue: 1,
                invalidText: this.idioma.porcietoNoPermitido,
                validator: function(v) {
                    if (this.gridEditor.record.data.estadoplan != 1)
                        return false;
                    else
                        return true;
                }
            })
        });
        this.addGridColumn({
            header: this.idioma.cgCreadoPor,
            width: 120,
            dataIndex: 'usuario',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgAprobadoPor, width: 120,
            dataIndex: 'usuarioaprobado', default: true
        });
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonNuevo({
            tooltip: this.idioma.ttBtnAdicionar,
            handler: function() {
                var ventanaAdicionar = new LOG.lb.gestplanconteo.VentanaAdicionar({
                    grid: _this.getGridPrincipal(),
                    idestructura: _this.idDeposito,
                    subsistema: _this.subsistema
                });
                ventanaAdicionar.show();
            }}));
        this.addToolbarButton(new LOG.util.Prototipos.botonAplicar({
            tooltip: this.idioma.ttBtnAplicarPorciento,
            text: this.idioma.lbBtnAplicarPorciento,
            isContextual: true,
            disabled: true,
            handler: function() {
                _this.modelo.aplicarPorciento();
            },
            controlFn: function (b, _caller) {
                // if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                //    b.setVisible(true);
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.estadoplan == 1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                })
                //   } else {
                //  b.setVisible(false);
                // }
            }
        }));
        this.addToolbarButton(new LOG.util.Prototipos.botonEliminar({
            tooltip: this.idioma.ttBtnEliminar,
            isContextual: true,
            disabled: true,
            handler: function() {
                _this.modelo.eliminar();
            },
            controlFn: function (b, _caller) {
                // if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                //    b.setVisible(true);
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.estadoplan == 1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                })
                //   } else {
                //  b.setVisible(false);
                // }
            }
        }));
        this.addToolbarButton(new LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            isContextual: true,
            disabled: true,
            handler: function() {
                _this.modelo.confirmarPeriodo({
                    idplanconteom: _this.smGridPrincipal.getSelected().get('idplanconteom'),
                    idplan: _this.smGridPrincipal.getSelected().get('idplan'),
                    idperiodo: _this.smGridPrincipal.getSelected().get('idperiodo')
                });
            },
            controlFn: function (b, _caller) {
               // if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                //    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estadoplan == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    })
             //   } else {
                  //  b.setVisible(false);
               // }
            }
        }));
        this.addToolbarButton(new LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnularEstado,
            isContextual: true,
            disabled: true,
            handler: function() {
                _this.modelo.anularPeriodo({
                    idplanconteom: _this.smGridPrincipal.getSelected().get('idplanconteom'),
                    idplan: _this.smGridPrincipal.getSelected().get('idplan'),
                    idperiodo: _this.smGridPrincipal.getSelected().get('idperiodo')
                });
            },
            controlFn: function (b, _caller) {
                // if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                //    b.setVisible(true);
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.estadoplan == 2) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                })
                //   } else {
                //  b.setVisible(false);
                // }
            }
        }));
        this.addToolbarButton(new LOG.util.Prototipos.botonAprobar({
            tooltip: this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            handler: function() { console.log(_this.smGridPrincipal.getSelected())
                _this.modelo.aprobarPeriodo({
                    
                   
                    idplanconteom: _this.smGridPrincipal.getSelected().get('idplanconteom'),
                    idplan: _this.smGridPrincipal.getSelected().get('idplan'),
                    idperiodo: _this.smGridPrincipal.getSelected().get('idperiodo')
                });
            },
            controlFn: function (b, _caller) {
                // if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                //    b.setVisible(true);
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.estadoplan == 2) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                })
                //   } else {
                //  b.setVisible(false);
                // }
            }
        }));
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttBtnImprimirList,
            isContextual: true,
            text: this.idioma.lbBtnImprimirList,
            handler: function() {
                    this.tipoReportes = new LOG.util.Report({
                        reports: [
                            {
                                isList: true,
                                dirReport: '/distra/logistica/inventario/planesconteo/PlanesConteoListado',
                                name: 'PlanesConteoListado',
                                params: {
                                    idestructura:  true,
                                    iddeposito:  _this.idDeposito,
                                    idsubsistema:  _this.subsistema
                                }
                            }
                        ]
                    }).view();
               
            },
            controlFn: function (b, _caller) {
                // if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                //    b.setVisible(true);
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.estadoplan == 5) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                })
                //   } else {
                //  b.setVisible(false);
                // }
            }
        }));
        this.addToolbarButton("->");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({
            tooltip: this.idioma.ttAyuda,
            id: _this.idayuda
        }));
    },
    actualizarPorciento: function(datos) {
        var idsPlanconteom = new Array();
        var porcientos = new Array();

        for (var i = 0; i < datos.length; i++) {
            idsPlanconteom[i] = datos[i].data.idplanconteom;
            porcientos[i] = datos[i].data.porciento;
        }
        var param = {};
        param['idplanconteom'] = idsPlanconteom;
        param['porciento'] = porcientos;
        this.modelo.modificarPeriodoPlan(param);
    }
}
);

LOG.lb.gestplanconteo.VentanaAdicionar = Ext.extend(LOG.util.Window, {
    width: 400,
    height: 150,
    resizable: false,
    usarAplicar: false,
    modelo: undefined,
    basicForm: undefined,
    idestructura: undefined,
    constructor: function(config) {
        this.idioma = {};
        LOG.util.UIManager.apply(this.idioma, LOG.lb.gestplanconteo.Idioma);
        this.modelo = new LOG.lb.gestplanconteo.Modelo({
            idioma: this.idioma,
            urlController: '/logistica/utiles/planconteo/index.php/planconteo',
            urlAccionGuardar: '/adicionarPlanConteo'
        });
        this.title = this.idioma.tlAdicionarPlan;
        this.basicForm = this.initFormPanel();
        this.items = [this.basicForm];
        this.aceptarFn = function() {
        };
        this.modelo.bindForm(this.basicForm);
        this.modelo.bindGridPanel(config.grid);
        this.buttons = [this.btnCancelar, this.btnAceptar];
        LOG.lb.gestplanconteo.VentanaAdicionar.superclass.constructor.call(this, config);
    },
    initFormPanel: function() {
        var _this = this;
        this.cls = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.tfPorciento = new LOG.util.Prototipos.inputEntero(
                {
                    name: 'adicionarporciento',
                    fieldLabel: 'Porciento por defecto',
                    allowBlank: false,
                    minValue: 1,
                    maxValue: 100,
                    maxLength: 3
                }
        );
        this.cls.addComponent(this.tfPorciento);
        this.btnAceptar = new LOG.util.Prototipos.botonAceptar({
            handler: function() {
                var resultado = _this.modelo.adicionar({idestructura: _this.idestructura, adicionarporciento: _this.tfPorciento.value, subsistema: _this.subsistema});
                if (resultado == true) {
                    _this.close();
                }
            }
        });
        this.btnCancelar = new LOG.util.Prototipos.botonCancelar({
            handler: function() {
                _this.close();
            }
        });
        var formPanel = LOG.util.UIManager.initForm({
            frame: true,
            items: [this.cls],
            region: 'center',
        });
        return formPanel;
    },
    onShowHandler: function() {
        var _this = this;
        LOG.util.UIManager.applyKey(_this.btnAceptar, _this);
        LOG.util.UIManager.applyKey(_this.btnCancelar, _this);
        _this.modelo.addActionButton(_this.btnAceptar);

    }
});
