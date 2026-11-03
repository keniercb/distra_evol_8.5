Ext.ns('LOG.inv.receta');
LOG.inv.receta.View = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.idioma = LOG.util.UIManager.apply(LOG.util.Idioma.init(), LOG.inv.receta.Idioma);
        this.dirController = '/logistica/inventario/alimento/index.php/receta';
        this.urlBusquedaGridPrincipal = 'cargarRecetas';
        this.modoSeleccion = 2;
        this.busquedaBasica = true;
        this.autoShow = true;
        this.textBusquedaSimple = this.idioma.lbDenominacion;
        this.concepto = this.idioma.ttBuscar;
        this.modelo = config.model || new LOG.inv.receta.Model({
            idioma: this.idioma
        });
        LOG.inv.receta.View.superclass.constructor.call(this, config);
        this.ventanaAdd = new LOG.inv.receta.VentanaRecetas({
            idioma: this.idioma,
            modelo: this.modelo,
            scope: this,
            autoShow: false
        });
        this.ventanaAdd.getVistaPrincipal().maximized = true;
        this.ventanaAdd.init();
        this.ventanaAdd.view();
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idreceta'

        });
        this.addGridColumn({
            dataIndex: 'observacion'

        });
        this.addGridColumn({
            header: this.idioma.cgProteina,
            width: 200,
            dataIndex: 'proteinas',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCaloria,
            width: 200,
            dataIndex: 'calorias',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaInicio,
            width: 150,
            dataIndex: 'fechainicio',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaFin,
            width: 150,
            dataIndex: 'fechafin',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'cantracion',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idunidadmedida',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'abreviaturaunidadmedida'
        });
        this.addGridColumn({
            dataIndex: 'decimales'
        });
        this.addGridColumn({
            header: this.idioma.lbEntidad,
            width: 65,
            dataIndex: 'estado',
            renderer: function(value, metaData) {
                if (value == 2) {
                    metaData.css = 'icondistra-usarentidad verde';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmUsarEntidad + '"';
                } else {
                    metaData.css = 'icondistra-usarentidad rojo';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmNoUsarEntidad + '"';
                }
            }

        });
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonNuevo({
            tooltip: this.idioma.ttBtnNuevo,
            handler: function() {
                _this.ventanaAdd.idreceta = null;
               _this.ventanaAdd.getVistaPrincipal().show();
                _this.ventanaAdd.getVistaPrincipal().setTitle(_this.idioma.tlAdicionar);
                _this.modelo.reset();
                _this.ventanaAdd.fPanel.getForm().loadRecord({data: {}});

            }, controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }));

        this.onGridDobleClick = function () {
            var b = _this.listaBotones.getItem(1);
            b.handler.call(b, b);
        };

        this.addToolbarButton(LOG.util.Prototipos.botonAbrir({
            disabled: true,
            tooltip: this.idioma.ttBtnAbrir,
            handler: function() {
                _this.ventanaAdd.idreceta = _this.getSmPrincipal().getSelected().data.idreceta;
                _this.ventanaAdd.getVistaPrincipal().show();
                _this.ventanaAdd.getVistaPrincipal().setTitle(_this.idioma.ttReceta);
                _this.ventanaAdd.modificarDatos(_this.getSmPrincipal().getSelected().data);
                _this.ventanaAdd.fPanel.getForm().loadRecord(_this.getSmPrincipal().getSelected());
                _this.ventanaAdd.cbUM.setValue(_this.getSmPrincipal().getSelected().data.abreviaturaunidadmedida);
                _this.modelo.loadRecord();
            },
            controlFn: function(b, _caller) {
                 if ((_this.grantedAction('CT') || _this.grantedAction('RAbrir'))) {
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'abrirRes');
               } else {
                    b.hide();
                }
            }
        }));
        this.listaBotones.getItem(0).handler = this.listaBotones.getItem(0).handler.createSequence(function(e) {
            _this.habilitarElementos(_this.ventanaAdd, false);
        });
        this.listaBotones.getItem(1).handler = this.listaBotones.getItem(1).handler.createSequence(function(e) {
            _this.habilitarElementos(_this.ventanaAdd, true);
        });
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            disabled: true,
            tooltip: this.idioma.ttBtnEliminar,
            handler: function() {
                _this.modelo.eliminar({}, function() {

                }, true);
            },
            controlFn: function(b, _caller) {
                 if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar'))) {
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() >0) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'eliminarRes');
                } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonDuplicar({
            disabled: true,
            tooltip: this.idioma.ttBtnDuplicar,
            handler: function() {
                _this.modelo.duplicar();
            },
            controlFn: function(b, _caller) {
                 if ((_this.grantedAction('CT') || _this.grantedAction('RDuplicar'))) {
                 //   b.show();
                 //   b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'duplicaraRes');
                } else {
                    b.hide();
                }
                 
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            disabled: true,
            iconCls: 'usarentidad verde',
            text: this.idioma.lbBtnUsar,
            tooltip: this.idioma.ttUsarentidad,
            handler: function() {
                _this.modelo.usarEntidad(2, function() {

                });
            },
             controlFn: function(b, _caller) {
                if ((_this.grantedAction('CT') || _this.grantedAction('REntidad'))) {
                 //   b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && _caller.getSmPrincipal().getSelected().data.estado == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'habilitarRec');
                } else {
                    b.hide();
                }
            }
             
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            disabled: true,
            iconCls: 'usarentidad rojo',
            text: this.idioma.lbBtnNoUsar,
            tooltip: this.idioma.ttNoUsarentidad,
            handler: function() {
                _this.modelo.usarEntidad(1, function() {

                });
            },
            controlFn: function(b, _caller) {
                 if ((_this.grantedAction('CT') || _this.grantedAction('REntidad'))) {
                 //   b.show();
                 //   b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && _caller.getSmPrincipal().getSelected().data.estado == 2) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'desahabilitarRes');
               } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton("->");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({
            tooltip: this.idioma.ttAyuda,
            id: 'idReceta'
        }));
    },
    habilitarElementos: function(wind, ver) {
        (ver) ? wind.getVistaPrincipal().listaBotones.getItem(1).hide() : wind.getVistaPrincipal().listaBotones.getItem(1).setVisible(true);
    }
});

