Ext.ns('LOG.inv.receta');
LOG.inv.receta.VentanaRecetas = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        var _this = this;
        this.urlBusquedaGridPrincipal = 'cargarProductos';
        this.gridEditable = true;
        this.autoLoad = false;
        this.autoSelect = false;
        this.modoSeleccion = 1;
        this.idGridPrincipal = 'idindicador';
        this.formaVisualizacion = 'ventana';
        this.plugincheckcolumn = true;
        LOG.inv.receta.VentanaRecetas.superclass.constructor.call(this, config);

        this.getVistaPrincipal().title = this.idioma.tlAdicionar;
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 500;
        this.getVistaPrincipal().resizable = false;
    },
    initDefaultButtons: function() {
        var _this = this;

        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), LOG.util.Prototipos.botonGuardar({
            handler: _this.salvarHandler,
            tooltip:this.idioma.ttBtnGuardar ,
            scope: _this
        }));
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(1), LOG.util.Prototipos.botonNuevo({
            handler: _this.onResetHandler,
            tooltip:this.idioma.ttBtnNuevoAbajo ,
            scope: _this
        }));
       
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({
            text: this.idioma.lbBtnCerrar
        }, true));
       
        this.modelo.addActionButton(this.getVistaPrincipal().listaBotones.getItem(2));

    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 150,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 200,
            autoExpand: true,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantidad,
            align:'right',
            dataIndex: 'cantidad',
            width: 120,
            default: true,
            editor: LOG.util.Prototipos.inputDecimal()
        }));
        this.addGridColumn({
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            dataIndex: 'idproductoreceta'
        });
        this.addGridColumn({
            dataIndex: 'idunidadmedida'
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 120,
            dataIndex: 'umedida'
        });
        var cmimpresindible = new LOG.grid.CheckColumn({
            header: this.idioma.cgImprescindible,
            dataIndex: 'imprescindible',
            width: 90,
            align: 'center'
        });
        this.addGridColumn(cmimpresindible);
        this.addGridPlugin(cmimpresindible);
        var cmaceptalternativo = new LOG.grid.CheckColumn({
            header: this.idioma.cgAlternativo,
            dataIndex: 'aceptalternativo',
            width: 90,
            align: 'center'
        });
        this.addGridColumn(cmaceptalternativo);
        this.addGridPlugin(cmaceptalternativo);


    },
    init: function() {
        LOG.inv.receta.VentanaRecetas.superclass.init.call(this);
        this.panelSuperior();
    },
    render: function(config) {
        var view = LOG.inv.receta.VentanaRecetas.superclass.render.call(this, config);
        var _this = this;
        this.btnProducto = LOG.util.UIManager.createBtn({
            iconCls: 'producto',
            text: _this.idioma.Producto,
            tooltip: _this.idioma.ttipProducto,
            handler: function() {
                _this.showWindowProducto();
            },
            controlFn: function(b, _caller) {
                if (_this.scope.grantedAction('CT') || _this.scope.grantedAction('RCRUD') || _this.scope.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            },
            fnEspecialCondition: function() {
                if ((_this.modelo.basicForm && !_this.modelo.basicForm.isValid())) {
                    return true;//para que desahabilite el boton
                }
                else if(_this.idreceta){
                    return false;
                }
                
            }
        });
        this.gpPrincipal.getTopToolbar().add(this.btnProducto);
        this.gpPrincipal.getTopToolbar().add(LOG.util.Prototipos.botonEliminar({
            disabled: true,
            tooltip: _this.idioma.ttipEliminarProd,
            handler: function() {
                _this.eliminarProductoReceta();
            },
            controlFn: function(b, _caller) {
                if (_this.scope.grantedAction('CT') || _this.scope.grantedAction('RCRUD') || _this.scope.grantedAction('REliminar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                        if (_caller.storePrincipal.getTotalCount() == 0) {
                            b.disable();
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.getStorePrincipal().on({
            beforeload: function() {
                this.initBaseParams.idreceta = _this.idreceta || -1;
            },
            'update':function(store, record, operacion){
                 _this.activarBoton();
             }
        });
        this.getGridPrincipal().on({
            beforeedit: function(e) {
                if(e.field == 'cantidad') {
                    if (e.record.json.decimales == "0") {
                        e.grid.getColumnModel().setEditor(e.column, LOG.util.Prototipos.inputEntero({}));
                    } else {
                        e.grid.getColumnModel().setEditor(e.column, LOG.util.Prototipos.inputDecimal({}));
                    }
                }
            }
        });

        view.on({
            'show': function() {
                var botones = _this.gpPrincipal.getTopToolbar().items.items;
                Ext.each(botones, function(b) {
                    if (typeof b.controlFn == 'function') {
                        b.controlFn.createDelegate(this, [b, this]).call();
                    }
                }.createDelegate(_this));
                if (_this.idreceta) {
                    _this.getStorePrincipal().load();
                } else {
                    _this.storePrincipal.removeAll();
                }
            }
        });
        this.modelo.addActionButton(this.btnProducto,true);
        return view;
    },
    panelSuperior: function() {
        var _this = this;
        this.getPanelSuperior().onRender = this.getPanelSuperior().onRender.createSequence(function() {
            var clsRecetas = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });
            clsRecetas.addComponent(new Ext.form.TextArea({
                fieldLabel: _this.idioma.lbDenominacion,
                name: 'denominacion',
                regex: LOG.util.Regex.cadena,
                minLength: 2,
                maxLength: 255,
                allowBlank: false,
                height: 118
            }));
            var clsRecetas2 = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });

            _this.cantRotacion = new LOG.util.Prototipos.inputDecimal({
                fieldLabel: _this.idioma.lbCantRacion,
                regex: LOG.util.Regex.importe,
                maxLength: 13,
                name: 'cantracion',
                allowBlank: false
            });

            _this.cbUM =new LOG.util.TreeCombo({
                url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarArlboUM',
                valueField: 'idum',
                name: 'idunidadmedida',
                selectOnlyLeaf: true,
                displayField: 'abreviaturaunidadmedida',
                fieldLabel:  _this.idioma.lbUM,
                allowBlank: false,
                selectFn: function(node) {
                    var elementos = node.attributes;
                    if (elementos) {
                        Ext.each(elementos, function (r) {
                            _this.modificarDatos(r);
                        });
                    }
                }
            });
            clsRecetas2.addComponent(_this.cantRotacion);
            clsRecetas2.addComponent(_this.cbUM);
            clsRecetas2.addComponent(new LOG.util.Prototipos.inputDecimal({
                fieldLabel: _this.idioma.lbCantProteinas,
                decimalPrecision: 1,
                name: 'proteinas',
                allowBlank: false
            }));
            clsRecetas2.addComponent(new LOG.util.Prototipos.inputDecimal({
                fieldLabel: _this.idioma.lbCantCalorias,
                decimalPrecision: 1,
                name: 'calorias',
                allowBlank: false
            }));
            var inicio = new Ext.form.DateField({
                fieldLabel: _this.idioma.lbFechaInicio,
                name: 'fechainicio',
                vtype: 'daterange',
                editable: false,
                allowBlank: false
            });
            var fin = new Ext.form.DateField({
                fieldLabel: _this.idioma.lbFechaFin,
                name: 'fechafin',
                vtype: 'daterange',
                editable: false,
                allowBlank: true
            });
            inicio.endDateField = fin.id;
            fin.startDateField = inicio.id;
            clsRecetas2.addComponent(inicio);
            clsRecetas2.addComponent(fin);
            clsRecetas.addComponent(clsRecetas2);
            _this.fPanel = LOG.util.UIManager.initForm({
                frame: true,
                labelAlign: 'top',
                items: [clsRecetas,
                    new Ext.form.TextArea({
                        fieldLabel: _this.idioma.lbObservacion,
                        name: 'observacion',
                        allowBlank: true,
                        anchor: '98%'
                    })
                ],
                region: 'center'
            });
            _this.modelo.bindForm(_this.fPanel);
            _this.getPanelSuperior().add(_this.fPanel);
            _this.getPanelSuperior().autoHeight = true;
        });
    },
    salvarDocumento: function(_productos){
        var _this = this;

        if (_this.idreceta) {
            _this.modelo.recetaRealizada = true;
        } else {
            _this.modelo.recetaRealizada = false;
        }

        _this.modelo.salvar({
            idproductos: Ext.encode(_productos),
            idreceta: (_this.idreceta) ? _this.idreceta : null
        }, function(resp) {
            _this.postSalvar.createDelegate(_this, [resp]).call();
            _this.getStorePrincipal().rejectChanges();
        });
    },
    salvarHandler: function() {
        var _this = this.scope;
        var productos = new Array();
            Ext.each(_this.getStorePrincipal().getModifiedRecords(), function(rec) {
                productos.push(rec.data);
            });

        if (_this.idreceta) {
            _this.modelo.recetaRealizada = true;
        } else {
            _this.modelo.recetaRealizada = false;
        }

        _this.modelo.salvar({
            idproductos: Ext.encode(productos),
            idreceta: (_this.idreceta) ? _this.idreceta : null
        }, function(resp) {
            _this.postSalvar.createDelegate(_this, [resp]).call();
            _this.getStorePrincipal().rejectChanges();
        });
    },
    onResetHandler: function() {
        var _this = this.scope || this;
        if (_this.fPanel) {
            _this.model.reset();
            _this.fPanel.getForm()._record = null;
            _this.fPanel.getForm().reset();
            _this.record = null;
            _this.storePrincipal.removeAll();
            _this.gpPrincipal.getView().refresh();
        }
    },
    showWindowProducto: function() {
        var _this = this;
        LOG.inv.maestroproductos.Loader.init(function() {
            var v = new LOG.lb.maestroproductos.UIProductos({
                tipo: 1,
                usarAplicar: true,
                parametros: {
                     idseleccionados: Ext.encode(_this.storePrincipal.collect('idindicador'))
                },
                doAction: function(r) {
                    var _productos = new Array();
                    var _idindicador = [];
                    Ext.each(r, function(rec) {
                        _productos.push(rec.json);
                        _idindicador.push(rec.json.idindicador)
                    });
                    _this.salvarDocumento(_productos);

                    if (v.isVisible()) {
                        v.panelProductos.getStorePrincipal().reload(
                            v.parametros.idseleccionados = Ext.encode(Ext.decode(v.panelProductos.getStorePrincipal().baseParams.idseleccionados).concat(_idindicador))
                        );
                    }
                }
            });
            v.show();
        });
    },
    postSalvar: function(r) {
        var _scope = this;
        _scope.idreceta = r.idreceta;
        _scope.record = {};
        Ext.apply(_scope.record, {
            data: {
                idreceta: r.idreceta
            }
        });

        this.cargarProductos({
            params: {idreceta: r.idreceta}
        });
    },
    cargarProductos: function(parametros) {
        var objParams = parametros || {};
        this.getStorePrincipal().load(objParams);
    },
    onCloseHandler: function() {
        var _this = this;
        if (_this.fPanel) {
            _this.record = null;
            _this.fPanel.getForm()._record = null;
            _this.fPanel.getForm().reset();
            _this.modelo.reset();
            if (_this.storePrincipal) {
                _this.storePrincipal.removeAll();
                _this.gpPrincipal.getView().refresh();
            }
        }
        _this.close;
    },
    eliminarProductoReceta: function() {
        var _this = this;
        var idproductos = new Array();
        Ext.each(_this.smGridPrincipal.getSelections(), function(rec) {
            idproductos.push(rec.json.idproductoreceta);
        });
        _this.modelo.eliminarProductoReceta(idproductos, function() {
            _this.cargarProductos({
                params: {idreceta: _this.idreceta}
            });
        });
    },
    activarBoton: function() {
        var _this=this;
        if (this.fPanel.getForm().isValid()) {
            _this.modelo.gridModificado = true;
            _this.getVistaPrincipal().listaBotones.getItem(2).setDisabled(false);
        }
    },
    modificarDatos: function(r) {
        var _this = this;
        if (r.decimales == "0") {
            Ext.apply(_this.cantRotacion, {
                allowDecimals:false,
                decimalPrecision: '',
                minValue: '',
                regex:LOG.util.Regex.digito,
                regexText:_this.idioma.ttnanTextEntero
            });
            _this.cantRotacion.render();
        } else {
            Ext.apply(_this.cantRotacion, {
                allowDecimals:true,
                decimalPrecision: 2,
                minValue: 0.1,
                regex: LOG.util.Regex.importe,
                regexText: _this.idioma.ttregexText
            });
            _this.cantRotacion.render();
        }
    }
});