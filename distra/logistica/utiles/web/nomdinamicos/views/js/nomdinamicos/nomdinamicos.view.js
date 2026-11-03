Ext.ns('LOG.lb.nomdinamicos');

LOG.lb.nomdinamicos.View = Ext.extend(LOG.util.UITemplate, {
    idGridPrincipal: 'idtiponomenclador',
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.busquedaBasica = true;
        this.modoSeleccion = 3;
        this.dirController = '/logistica/utiles/nomdinamicos/index.php/nomdinamicos';
        config.urlBusquedaGridPrincipal = 'cargarNomDinamicos';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.lb.nomdinamicos.Idioma);
        this.concepto = this.idioma.tlBtnBuscar;
        this.textBusquedaSimple = this.idioma.cgDenominacion;
        //*********************
        this.tablameta = {esquema: '', tabla: '', columnaref: '', datoref: ''};
        this.idatribagrupacion = null;
        //***********************
        LOG.lb.nomdinamicos.View.superclass.constructor.call(this, config);
        this.modelo = new LOG.lb.nomdinamicos.Model({
            idioma: config.idioma
        });
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({dataIndex: 'idtiponomenclador'});
        this.addGridColumn({dataIndex: 'propiedades'});
        this.addGridColumn({dataIndex: 'activo'});
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            tooltip: this.idioma.ttBtnAdicionar,
            scope: _this,
            handler: function() {
                _this.modelo.reset();
                _this.winAddNomDinamicos = new LOG.lb.nomdinamicos.VentanaAddNomDinamicos({
                    idioma: _this.idioma,
                    modelo: _this.modelo
                });
                _this.winAddNomDinamicos.show();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonModificar({
            tooltip: this.idioma.ttBtnModificar,
            scope: _this,
            handler: function() {
                _this.winAddNomDinamicos = new LOG.lb.nomdinamicos.VentanaAddNomDinamicos({
                    idioma: _this.idioma,
                    modelo: _this.modelo,
                    usarAplicar: false
                });
                _this.winAddNomDinamicos.cargarDatos(_this.getSmPrincipal().getSelected());
                _this.winAddNomDinamicos.show();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    b.disable();
                    _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
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
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: this.idioma.ttBtnEliminar,
            scope: _this,
            handler: function() {
                _this.modelo.eliminar();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) {
                    b.setVisible(true);
                    b.disable();
                    _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() >= 1) {
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
        }));
        //*******plugin******
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Plugin atributos',
            tooltip: 'Plugin atributos',
            iconCls: 'indicadores',
            scope: _this,
            handler: function() {
                _this.winPluginAtributos = new LOG.lb.plugin.VistaAgrupaciones({
                    idioma: _this.idioma,
                    tablameta: _this.tablameta,
                    formaVisualizacion: 'ventana',
                    width: 600
                });
                _this.winPluginAtributos.show();
            }
        }));
        //************
    },
    init: function() {
        this.tablameta.esquema = 'mod_logmetadata';
        this.tablameta.tabla = 'nom_tiponomenclador';
        this.tablameta.columnaref = 'idtiponomenclador';
        LOG.lb.nomdinamicos.View.superclass.init.call(this);
        // ******** plugin ***************
        this.treeAgrupacion = new LOG.lb.plugin.TreeAgrupaciones({
            idioma: this.idioma,
            tablameta: this.tablameta,
            hidden: true
        });
        this.getPanelPrincipal().add(this.treeAgrupacion);
        //****************************************
        this.gridNomenclador = new LOG.lb.nomdinamicos.GridDatos({
            formaVisualizacion: 'panel',
            idioma: this.idioma,
            region: 'center',
            acciones: acciones_reportes
        });
        this.gridNomenclador.init();
        this.panelInferior = new LOG.util.Panel({
            title: this.idioma.tlPanelDatos,
            frame: true,
            doFocus: true,
            region: 'south',
            layout: 'border',
            height: 400,
            collapsible: true,
            split: true,
            hidden: true,
            items: [this.gridNomenclador.view()]
        });
        this.getPanelGrid().add(this.panelInferior);
    },
    render: function() {
        var _this = this;
        var vista = LOG.lb.nomdinamicos.View.superclass.render.call(this);
        //********************** plugin ******************
        this.getSmPrincipal().on({
            selectionchange: function() {
                if (this.getCount() == 1) {
                    _this.panelInferior.show();
                    _this.treeAgrupacion.show();
                    _this.tablameta.datoref = this.getSelected().id;
                    _this.treeAgrupacion.recargarTree(_this.tablameta);
                    _this.gridNomenclador.setIdTipoNomenclador(this.getSelected().id);
                    _this.gridNomenclador.getStorePrincipal().load();
                    _this.gridNomenclador.ocultarColumna('color', !this.getSelected().get('propiedades'));
                } else {
                    _this.panelInferior.hide();
                    _this.treeAgrupacion.hide();
                }
                _this.getVistaPrincipal().doLayout();
            }
        });
        //******************* plugin **************************
        return vista;
    },
    onGridDobleClick: function() {
        this.winAddNomDinamicos = new LOG.lb.nomdinamicos.VentanaAddNomDinamicos({
            idioma: this.idioma,
            modelo: this.modelo,
            usarAplicar: false
        });
        this.winAddNomDinamicos.cargarDatos(this.getSmPrincipal().getSelected());
        this.winAddNomDinamicos.show();
    }
});



LOG.lb.nomdinamicos.GridDatos = Ext.extend(LOG.util.UITemplate, {
    idGridPrincipal: 'idnomenclador',
    idtemp: 0,
    limit: 30,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.busquedaBasica = true;
        this.modoSeleccion = 2;
        this.gridEditable = true;
        this.dirController = '/logistica/utiles/nomdinamicos/index.php/nomdinamicos';
        config.urlBusquedaGridPrincipal = 'cargarDatosNom';
        this.tablameta = (config.tablameta) ? config.tablameta : {esquema: '', tabla: '', columnaref: '', datoref: ''};
        this.idtiponomenclador = null;
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.lb.nomdinamicos.Idioma);
        this.concepto = this.idioma.tlBtnBuscarDatosNom;
        this.textBusquedaSimple = this.idioma.cgDenominacion;
        LOG.lb.nomdinamicos.GridDatos.superclass.constructor.call(this, config);
        this.modelo = new LOG.lb.nomdinamicos.ModelDatos({
            idioma: config.idioma
        });
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            autoExpand: true,
            editor: new Ext.form.TextField({
                maxLength: 100,
                allowBlank: false
            }),
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            dataIndex: 'referencia',
            width: 80,
            editor: new Ext.form.TextField({maxLength: 100}),
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaIni,
            dataIndex: 'fechaini',
            width: 80,
            editor: new Ext.form.DateField({format: 'd/m/Y'}),
            renderer: function(_v) {
                if (_v) {
                    return _v.format('d/m/Y');
                }
                return _v;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaFin,
            dataIndex: 'fechafin',
            width: 80,
            editor: new Ext.form.DateField({format: 'd/m/Y'}),
            renderer: function(_v) {
                if (_v) {
                    return _v.format('d/m/Y');
                }
                return _v;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgColor,
            width: 80,
            dataIndex: 'color',
            renderer: function(_v, _mD, _r) {
                if (_r.data.referencia) {
                    var codigo = _r.data.referencia.split('-');
                    codigo = codigo[0] + ',' + codigo[1] + ',' + codigo[2];
                    _mD.style += " background-color:rgb(" + codigo + ");"
                }
                return _v;
            }
        });
        this.addGridColumn({dataIndex: 'idnomenclador'});
        this.addGridColumn({dataIndex: 'idtiponomenclador'});
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            tooltip: this.idioma.ttBtnAddDatos,
            handler: function() {
                if (_this.getSmPrincipal().getCount() >= 1) {
                    _this.getStorePrincipal().insert(_this.getStorePrincipal().indexOf(_this.getSmPrincipal().getSelected()) + 1, new Ext.data.Record({idtemp: ++_this.idtemp, idtiponomenclador: _this.idtiponomenclador}));
                }
                else {
                    _this.getStorePrincipal().add(new Ext.data.Record({idtemp: ++_this.idtemp, idtiponomenclador: _this.idtiponomenclador}));
                }
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: this.idioma.ttBtnDelDatos,
            scope: _this,
            handler: function() {
                var eliminar = false;
                _this.getSmPrincipal().each(function(item) {
                    if (!item.get('idnomenclador')) {
                        _this.getStorePrincipal().remove(item);
                    } else {
                        eliminar = true;
                    }
                });
                if (eliminar) {
                    _this.modelo.eliminar();
                }
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) {
                    b.setVisible(true);
                    b.disable();
                    _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() >= 1) {
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
        }));
        this.addToolbarButton('-');
        this.btnGuardar = LOG.util.Prototipos.botonGuardar({
            tooltip: this.idioma.ttBtnGuardar,
            scope: _this,
            handler: function() {
                _this.modelo.salvar();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.addToolbarButton(this.btnGuardar);
        this.modelo.addActionButton(this.btnGuardar);
    },
    /**
     *
     * @param {Object} config
     * @returns {Array.render.render}
     */
    render: function(config) {
        var _this = this;
        var render = LOG.lb.nomdinamicos.GridDatos.superclass.render.call(this, config);
        this.limit = this.getGridPrincipal().getBottomToolbar() ? this.getGridPrincipal().getBottomToolbar().pageSize : 30;
        this.getStorePrincipal().on({
            beforeload: function() {
                _this.modelo.reset();
                this.baseParams.limit = this.initBaseParams.limit = _this.limit;
            },
            load: function() {
                _this.idtemp = 0;
                _this.limit = _this.getGridPrincipal().getBottomToolbar() ? _this.getGridPrincipal().getBottomToolbar().pageSize : 30;
            }
        });
        this.getGridPrincipal().on({
            afteredit: function(e) {
                _this.modelo.adicionarNomenclador(e.record.data);
            }
        });
        return render;
    },
    /**
     * Actualiza el identificador del tipo de nomenclador.
     * @param {Numeric} id
     * @returns {undefined}
     */
    setIdTipoNomenclador: function(id) {
        this.idtiponomenclador = id;
        this.getStorePrincipal().baseParams.idtiponomenclador = id;
        this.getStorePrincipal().initBaseParams.idtiponomenclador = id;
    }
});
