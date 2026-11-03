Ext.ns('LOG.lb.atributosdinamicos');
LOG.lb.atributosdinamicos.View = Ext.extend(LOG.util.UITemplate, {
    idGridPrincipal: 'idatributo',
    btnCRUD: true,
    btnAsociar: false,
    btnDesasociar: false,
    limit: 30,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.busquedaBasica = true;
        this.modoSeleccion = 3;
        this.asociar = config.asociar;
        this.desasociar = config.desasociar;
        this.dirController = '/logistica/utiles/atribdinamicos/index.php/atributosdinamicos';
        this.urlBusquedaGridPrincipal = 'cargarAtributos';
        this.autoLoad = false;
        this.idioma = Ext.apply(config.idioma, LOG.lb.atributosdinamicos.Idioma);
        this.concepto = this.idioma.tlBtnBuscar;
        this.textBusquedaSimple = this.idioma.cgDenominacion;
        LOG.lb.atributosdinamicos.View.superclass.constructor.call(this, config);
        this.modelo = new LOG.lb.atributosdinamicos.Model({
            idioma: this.idioma
        });
    },
    /**
     * Inicializa las columnas de la interfaz.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({dataIndex: 'idatributo'});
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            autoExpand: true,
            dataIndex: 'nombre',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgTipoDato,
            dataIndex: 'tipodato',
            width: 120,
            renderer: function(_v) {
                switch (_v) {
                    case '1':
                        return _this.idioma.lbTipoTexto;
                        break;
                    case '2':
                        return _this.idioma.lbTipoNumerico;
                        break;
                    case '3':
                        return _this.idioma.lbTipoBooleano;
                        break;
                    case '4':
                        return _this.idioma.lbTipoFecha;
                        break;
                    case '5':
                        return _this.idioma.lbTipoNomenclador;
                        break;
                }
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgLongitud,
            dataIndex: 'longitud',
            width: 80,
            align: 'right',
            renderer: function(_v) {
                return _v || '';
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgObligatorio,
            dataIndex: 'obligatorio',
            width: 80,
            align: 'center',
            renderer: function(_v) {
                if (_v == '1') {
                    return _this.idioma.lbSi;
                }
                return _this.idioma.lbNo;
            },
            default: true
        });
        this.addGridColumn({dataIndex: 'longitud1'});
        this.addGridColumn({dataIndex: 'limiteinf'});
        this.addGridColumn({dataIndex: 'limitesup'});
        this.addGridColumn({dataIndex: 'decimal'});
        this.addGridColumn({dataIndex: 'precision'});
        this.addGridColumn({dataIndex: 'multilinea'});
        this.addGridColumn({dataIndex: 'idexpresionregular'});
        this.addGridColumn({dataIndex: 'idtiponomenclador'});
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
                _this.winAddAtributos = new LOG.lb.atributosdinamicos.ventanaAddAtributos({
                    idioma: _this.idioma,
                    modelo: _this.modelo,
                    idagrupacion: _this.idagrupacion
                });
                _this.winAddAtributos.show();
            },
            controlFn: function(b, _caller) {
                if ((_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) && _this.btnCRUD) {
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
                _this.winAddAtributos = new LOG.lb.atributosdinamicos.ventanaAddAtributos({
                    idioma: _this.idioma,
                    modelo: _this.modelo,
                    usarAplicar: false
                });
                _this.winAddAtributos.prepareForm(_this.getSmPrincipal().getSelected());
                _this.winAddAtributos.show();
            },
            controlFn: function(b, _caller) {
                if ((_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) && _this.btnCRUD) {
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
                if ((_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) && _this.btnCRUD) {
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
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnAsociar,
            tooltip: this.idioma.ttBtnAsociar,
            iconCls: 'asociar',
            handler: function() {
                _this.modelo.asociarAtributos(_this.idagrupacion, _this.asociar, _this._asociarFn);
            },
            controlFn: function(b, _caller) {
                if ((_caller.grantedAction('CT') || _caller.grantedAction('RAsociar')) && _this.btnAsociar) {
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
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnDesasociar,
            tooltip: this.idioma.ttBtnDesasociar,
            iconCls: 'deshacer',
            handler: function() {
                _this.modelo.asociarAtributos(_this.idagrupacion, _this.asociar, _this._asociarFn);
            },
            controlFn: function(b, _caller) {
                if ((_caller.grantedAction('CT') || _caller.grantedAction('RDesasociar')) && _this.btnDesasociar) {
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
    render: function(config) {
        var _this = this;
        var vista = LOG.lb.atributosdinamicos.View.superclass.render.call(this, config);
        this.limit = this.getGridPrincipal().getBottomToolbar() ? this.getGridPrincipal().getBottomToolbar().pageSize : 30;
        this.getStorePrincipal().on({
            beforeload: function() {
                // Carga los atributos asociados a la agrupacion.
                this.baseParams.idagrupacion = this.initBaseParams.idagrupacion = _this.idagrupacion;
                this.baseParams.asociados = this.initBaseParams.asociados = _this.asociar ? null : true;
                this.baseParams.limit = this.initBaseParams.limit = _this.limit;
            },
            load: function() {
                _this.limit = _this.getGridPrincipal().getBottomToolbar() ? _this.getGridPrincipal().getBottomToolbar().pageSize : 30;
            }
        });
        this.getStorePrincipal().load();
        return vista;
    },
    onGridDobleClick: function() {
        this.winAddAtributos = new LOG.lb.atributosdinamicos.ventanaAddAtributos({
            idioma: this.idioma,
            title: this.idioma.tlModAtributo,
            modelo: this.modelo,
            usarAplicar: false
        });
        this.winAddAtributos.prepareForm(this.getSmPrincipal().getSelected());
        this.winAddAtributos.show();
    },
    /**
     * 
     * @param {Numeric} idagrupacion
     * @param {Boolean} asociar Determina si asocia o no los atributos a la agrupacion.
     * @param {Function} _asociarFn
     * @returns {undefined}
     */
    asociarAgrupacion: function(idagrupacion, asociar, _asociarFn) {
        this.idagrupacion = idagrupacion;
        this.asociar = asociar || null;
        this._asociarFn = _asociarFn;
    }
});
