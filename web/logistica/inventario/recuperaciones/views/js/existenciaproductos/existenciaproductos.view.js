Ext.ns('Ext.erp.existenciaproductos');

Ext.erp.existenciaproductos = Ext.extend(LOG.util.UITemplate, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.dirController = '/logistica/inventario/recuperaciones/index.php/existenciaproductos';
        config.urlBusquedaGridPrincipal = 'cargarProductos';
        config.idGridPrincipal = 'idindicador';
        config.autoSelect = false;
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.busquedaBasica = true;
        config.busquedaAvanzada = true;
        config.idioma = LOG.inv.Existenciaproductos.Idioma;
        config.concepto = config.idioma.ttBtnConcepto;
        config.textBusquedaSimple = config.idioma.tlConcepto;
        config.baseParams = {idusuario: idUsuario, identidad: idEntidad};
        Ext.erp.existenciaproductos.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({dataIndex: 'idindicador'});
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            autoExpand: true,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            header: 'Naturaleza',
            width: 100,
            dataIndex: 'naturaleza',
            default: true,
            filter : {
                type : 'combo',
                url : _this.dirController + '/obtenerNaturaleza',
                valueField : 'idnaturaleza',
                displayField: 'codigo',
                dataIndex : 'naturaleza',
            }
        });
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: 'Precio',
            width: 100,
            align: 'right',
            dataIndex: 'preciocentral',
            default: true
        }));
        /*this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: 'Precio CUC',
            width: 100,
            align: 'right',
            dataIndex: 'preciocentralalt',
            default: true
        }));*/
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantidad,
            width: 100,
            align: 'right',
            dataIndex: 'cantidad',
            default: true
        }));
        /*this.addGridColumn({
            header: this.idioma.cgUm,
            width: 60,
            dataIndex: 'um',
            default: true
        });*/
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            text: this.idioma.tlBtnExportar,
            disabled: true,
            url: '/logistica/inventario/recuperaciones/index.php/existenciaproductos/exportarExcel',
            btn: 'exportar',
            handler: function() {
                var filters = {detalles: true};
                Ext.each(_this.getGridPrincipal().filters.getFilterData(), function(r){
                  filters[r.field] = r.data.value;
                });
                var scope = this;
                Ext.MessageBox.wait(LOG.util.Idioma.msgExportando, LOG.util.Idioma.msgEspere);
                Ext.Ajax.request({
                    url: scope.url,
                    method: 'POST',
                    params: Ext.apply(filters, _this.getStorePrincipal().baseParams),
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
                        window.open(resp.dirFichero, 'ventana', wCfg);
                    }.createDelegate(scope)
                });
            },
            controlFn: function(b, _caller) {
                LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function(e) {
                    if (e == 'load') {
                        b.setDisabled(this.getCount() == 0);
                    }
                }, 'exportarExcel');
            }
        }));
    },
    init: function() {
        var _this = this;
        Ext.erp.existenciaproductos.superclass.init.call(this);
        this.getPanelBusqueda().setColumns(1);
//        this.addFilterComponent(new LOG.util.TreeCombo({
//            fieldLabel: this.idioma.lbMinisterio,
//            textRootNode: this.idioma.lbMinisterios,
//            name: 'idministerio',
//            url: '/logistica/inventario/recuperaciones/index.php/existenciaproductos/cargarMinisterios',
//            mode: 'remote',
//            //selectOnlyLeaf: true,
//            listWidth: '250px',
//            resizable: true,
//            selectFn: function(_v) {
//                this.displayedText = _v.text;
//                this.idSeleccionado = _v.attributes.id;
//                this.setRawValue(_v.text);
//                this.setValue(_v.attributes.id);
//            }
//        }));
        if (typeof idsubordinacion !== 'undefined') {
            this.getPanelBusqueda().setColumns(2);
            this.addFilterComponent(new LOG.util.TreeCombo({
                fieldLabel: this.idioma.lbSubordinacion,
                idNode: idEntidad,
                textRootNode: this.idioma.lbSubordinaciones,
                name: 'idsubordinacion',
                url: '/logistica/inventario/recuperaciones/index.php/existenciaproductos/cargarSubordinacion',
                mode: 'remote',
                listWidth: '250px',
                resizable: true,
                setBaseNode: function(params, _fn) {
                    this.loader.on({
                        beforeload: function(l, node) {
                            this.baseParams.idestructura = node.attributes.id;
                            this.baseParams.idsubordinacion =  idsubordinacion;
                        }
                    });
                },
                selectFn: function(_v) {
                    this.displayedText = _v.text;
                    this.idSeleccionado = _v.attributes.id;
                    this.setRawValue(_v.text);
                    this.setValue(_v.attributes.id);
                }
            }));
        }

        this.addFilterComponent(new LOG.util.TreeCombo({
            fieldLabel: this.idioma.lbNaturaleza,
            textRootNode: this.idioma.lbNaturalezas,
            name: 'idnaturaleza',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/getNaturalezas',
            listWidth: '250px',
            resizable: true,
            selectOnlyLeaf: false,
            selectFn: function(_v) {
                this.displayedText = _v.text;
                this.idSeleccionado = _v.attributes.id;
                this.setRawValue(_v.text);
                this.setValue(_v.attributes.id);
            }
        }));
        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function() {
            _this.panelDetalles = new Ext.erp.existenciaproductosdetalles({});
            _this.panelDetalles.init();
            _this.panelSur = LOG.util.UIManager.initPanel({
                title: _this.idioma.tlPanelDetalles,
                titleCollapse: true,
                animCollapse: false,
                collapsible: true,
                collapsed: true,
                region: 'south',
                layout: 'fit',
                height: 300,
                minSize: 200,
                maxSize: 500,
                split: true,
                collapseMode: 'mini',
                scope: _this
            });
            _this.panelSur.add(_this.panelDetalles.view());
            _this.getPanelPrincipal().add(_this.panelSur);
            
        });
    },
    render: function(config) {
        var render = Ext.erp.existenciaproductos.superclass.render.call(this, config);
        var _this = this;
        _this.getSmPrincipal().on('selectionchange', function(sm) {
            if (sm.getCount() == 1) {
                _this.panelSur.expand();
                _this.panelDetalles.idindicador = sm.getSelected().get('idindicador');
                _this.panelDetalles.idsubordinacion = _this.getStorePrincipal().baseParams.idsubordinacion;
                _this.panelDetalles.idministerio = _this.getStorePrincipal().baseParams.idministerio;
                _this.panelDetalles.getStorePrincipal().load();
            } else {
                _this.panelSur.collapse();
                _this.panelDetalles.getStorePrincipal().removeAll();
            }
        });
        _this.getStorePrincipal().on('beforeload', function(sm) {
            _this.panelSur.collapse();
            _this.panelDetalles.getStorePrincipal().removeAll();
            _this.getSmPrincipal().clearSelections();
        });
        
        return render;
    }
});

Ext.erp.existenciaproductosdetalles = Ext.extend(LOG.util.UITemplate, {
    idindicador: null,
    idsubordinacion: null,
    idministerio: null,
    constructor: function(config) {
        config.dirController = '/logistica/inventario/recuperaciones/index.php/existenciaproductos';
        config.urlBusquedaGridPrincipal = 'cargarProductos';
        config.idGridPrincipal = 'idproducto';
        config.autoLoad = false;
        config.autoSelect = false;
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.idioma = LOG.inv.Existenciaproductos.Idioma;
        config.baseParams = {idusuario: idUsuario, identidad: idEntidad, detalles: true};
        Ext.erp.existenciaproductosdetalles.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function() {
        this.addGridColumn({dataIndex: 'idproducto'});
        this.addGridColumn({dataIndex: 'idestructura'});
        /*this.addGridColumn({
            header: this.idioma.cgMinisterio,
            width: 150,
            dataIndex: 'ministerio',
            default: true
        });*/
        /*this.addGridColumn({
            header: this.idioma.cgDelegacion,
            width: 250,
            dataIndex: 'delegacion',
            default: true
        });*/
        this.addGridColumn({
            header: this.idioma.cgEntidad,
            autoExpand: true,
            dataIndex: 'entidad',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgAlmacen,
            width: 300,
            dataIndex: 'almacen',
            default: true
        });
		this.addGridColumn({
            header: this.idioma.cgUm,
            width: 80,
            dataIndex: 'umop',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: 'Precio',
            width: 100,
            align: 'right',
            dataIndex: 'preciocontable',
            default: true
        }));
        /*this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: 'Precio CUC',
            width: 100,
            align: 'right',
            dataIndex: 'precioalternativo',
            default: true
        }));*/
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantidad,
            width: 100,
            align: 'right',
            dataIndex: 'cantidad',
            default: true
        }));
		
		this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'Disponible',
            width: 100,
            align: 'right',
            dataIndex: 'disponible',
            default: true
        }));
    },
    render: function(config) {
        var render = Ext.erp.existenciaproductosdetalles.superclass.render.call(this, config);
        this.getStorePrincipal().on('beforeload', function(st) {
            st.baseParams.idindicador = st.initBaseParams.idindicador = this.idindicador;
            st.baseParams.idsubordinacion = st.initBaseParams.idsubordinacion = this.idsubordinacion;
            st.baseParams.idministerio = st.initBaseParams.idministerio = this.idministerio;
        }, this);
        return render;
    }
});
