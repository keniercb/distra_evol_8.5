Ext.ns('LOG.lb.agrupaciones');

LOG.lb.agrupaciones.View = Ext.extend(LOG.util.UITemplate, {
    idGridPrincipal: 'idagrupacion',
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.busquedaBasica = true;
        this.modoSeleccion = 3;
        this.dirController = '/logistica/utiles/atribdinamicos/index.php/agrupaciones';
        config.urlBusquedaGridPrincipal = 'cargarAgrupaciones';
        this.idioma = Ext.apply(config.idioma, LOG.lb.agrupaciones.Idioma);
        this.idiomaAtributo = Ext.apply(config.idiomaAtributo, LOG.lb.atributosdinamicos.Idioma);
        this.concepto = this.idioma.tlBtnBuscar;
        this.textBusquedaSimple = this.idioma.cgDenominacion;
        LOG.lb.agrupaciones.View.superclass.constructor.call(this, config);
        this.modelo = new LOG.lb.agrupaciones.Model({
            idioma: this.idioma
        });
    },
    /**
     * Inicializa las columnas de la interfaz.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        this.addGridColumn({dataIndex: 'idagrupacion'});
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true
        });
    },
    /**
     * Inicializa los botones de la interfaz.
     * @returns {undefined}
     */
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            tooltip: this.idioma.ttBtnAdicionar,
            scope: this,
            handler: function() {
                var winAddAgrupaciones = new LOG.lb.agrupaciones.ventanaAddAgrupaciones({
                    idioma: _this.idioma,
                    modelo: _this.modelo
                });
                winAddAgrupaciones.show();
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
            scope: this,
            handler: function() {
                var winAddAgrupaciones = new LOG.lb.agrupaciones.ventanaAddAgrupaciones({
                    idioma: _this.idioma,
                    modelo: _this.modelo,
                    usarAplicar: false
                });
                winAddAgrupaciones.prepareForm(_this.getSmPrincipal().getSelected());
                winAddAgrupaciones.show();
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
            scope: this,
            handler: function() {
                _this.modelo.eliminar();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) {
                    b.setVisible(true);
                    b.disable();
                    _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0) {
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
    },
    init: function() {
        LOG.lb.agrupaciones.View.superclass.init.call(this);
        this.panelInferior = new LOG.lb.agrupaciones.Atributos({
            idioma: this.idioma,
            idiomaAtributo: this.idiomaAtributo,
            hidden: true
        });
        this.getPanelPrincipal().add(this.panelInferior);
    },
    render: function(config) {
        var _this = this;
        var vista = LOG.lb.agrupaciones.View.superclass.render.call(this, config);
        this.getSmPrincipal().on({
            selectionchange: function() {
                if (this.getCount() == 1) {
                    _this.panelInferior.show();
                    _this.cargarAtributos(this.getSelected().id);
                } else {
                    _this.panelInferior.hide();
                }
                _this.getVistaPrincipal().doLayout();
            }
        });
        return vista;
    },
    onGridDobleClick: function() {
        this.winAddAgrupaciones = new LOG.lb.agrupaciones.ventanaAddAgrupaciones({
            idioma: this.idioma,
            modelo: this.modelo,
            usarAplicar: false
        });
        this.winAddAgrupaciones.prepareForm(this.getSmPrincipal().getSelected());
        this.winAddAgrupaciones.show();
    },
    cargarAtributos: function(idagrupacion) {
        var _this = this;
        // Grid de atributos asociados.
        this.panelInferior.grid.asociarAgrupacion(idagrupacion, false, function() {
            _this.panelInferior.gridD.getStorePrincipal().load();
        });
        // Grid de atributos sin asociar.
        this.panelInferior.gridD.asociarAgrupacion(idagrupacion, true, function() {
            _this.panelInferior.grid.getStorePrincipal().load();
        });
        this.panelInferior.grid.getStorePrincipal().load();
        this.panelInferior.gridD.getStorePrincipal().load();
    }
});

LOG.lb.agrupaciones.Atributos = Ext.extend(LOG.util.Panel, {
    constructor: function(config) {
        config.frame = true;
        config.doFocus = true;
        config.region = 'south';
        config.layout = 'border';
        config.height = 400;
        config.collapsible = true;
        this.idioma = {};
        Ext.apply(this.idioma, LOG.lb.atributosdinamicos.Idioma);
        this.idiomaAtributo = {};
        Ext.apply(this.idiomaAtributo, LOG.lb.atributosdinamicos.Idioma);
        LOG.lb.agrupaciones.Atributos.superclass.constructor.call(this, config);
        this.grid = new LOG.lb.atributosdinamicos.View({
            formaVisualizacion: 'panel',
            idioma: this.idiomaAtributo,
            region: 'center',
            acciones: acciones_reportes,
            btnDesasociar: true
        });
        this.grid.init();
        var gridAtributos = this.grid.view();
        this.gridD = new LOG.lb.atributosdinamicos.View({
            formaVisualizacion: 'panel',
            idioma: this.idiomaAtributo,
            region: 'east',
            acciones: acciones_reportes,
            btnCRUD: false,
            btnAsociar: true
        });
        this.gridD.init();
        var gridAtributosD = this.gridD.view();
        // Panel de atributos asociados.
        this.panelCenter = new LOG.util.Panel({
            title: this.idioma.tlPanelAsociados,
            region: 'center',
            layout: 'fit',
            width: '50%',
            frame: true,
            items: [gridAtributos]
        });
        // Panel de atributos sin asociar.
        this.panelEast = new LOG.util.Panel({
            title: this.idioma.tlPanelDesasociados,
            region: 'east',
            frame: true,
            width: '50%',
            layout: 'fit',
            items: [gridAtributosD]
        });
        this.add(this.panelCenter);
        this.add(this.panelEast);
    }
});
