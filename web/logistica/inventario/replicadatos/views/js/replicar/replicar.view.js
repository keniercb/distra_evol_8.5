Ext.ns('LOG.inv.replicar');
LOG.inv.replicar.View = Ext.extend(LOG.util.UITemplate, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.idioma = LOG.util.UIManager.apply(LOG.inv.replicar.Idioma, LOG.util.Idioma);
        this.busquedaBasica = false;
        this.panelBotonesVisible = false;
        this.autoLoad = false;
        this.modoSeleccion = 3;
        this.bbarVisible = false;
        this.modelo = new LOG.inv.replicar.Model({
            idioma: config.idioma
        });
        LOG.inv.replicar.View.superclass.constructor.call(this, config);
    },
    /**
     * Programa los eventos, renderiza el componente y devuelve la vista.
     * @param {Object} config
     * @returns {Array.render.vista|Anonym$0.render.vista}
     */
    render: function (config) {
        var _this = this;
        var vista = LOG.inv.replicar.View.superclass.render.call(this, config);
        this.listaBotones.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, _this]).call();
            }
        });
        return vista;
    },
    /**
     * Inicializa las columnas de la ventana.
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        this.addGridColumn({dataIndex: 'idindicador'});
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 90,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 100,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 100,
            dataIndex: 'umedida',
            default: true
        });
    },
    buscarProductos: function (concepto) {
        var _this = this;
        var idproductos = new Array();
        var idestructuras = new Array();
        var idareas = new Array();
        var ncols = new LOG.util.List();
        this.viewProductos.listaColumnas.each(function (c) {
            ncols.add(c);
        });
        Ext.each(this.arbolEstructuras.getChecked(), function(n) {
            if (n.attributes.idarea) {
                idareas.push(n.attributes.idarea);
            } else if (!n.loaded && n.attributes.idareas) {
                var areas = n.attributes.idareas.split(',');
                Ext.each(areas, function(id) {
                    idareas.push(id);
                });
            }
            var idantecesor = n.attributes.idantecesor || n.id;
            if (idestructuras.indexOf(idantecesor) == -1) {
                idestructuras.push(idantecesor);
            }
        });
        this.getGridPrincipal().getStore().each(function (rec) {
            idproductos.push(rec.id);
        });
        this.modelo.cargarEstructuras({
            idestructuras: Ext.encode(idestructuras),
            idareas: Ext.encode(idareas),
            idindicadores: Ext.encode(idproductos),
            subordinacion: _this.cbSubordinacion.getValue(),
            concepto: concepto,
            reporte: _this.cbReporte.getValue()
        }, function (o, s, r) {
            _this.panelProducto.show();
            var estructuras = Ext.decode(r.responseText);
            _this.viewProductos.tipo = _this.cbReporte.getValue();
            _this.viewProductos.porentidad = _this.cbReporte.getValue() == 1;
            _this.viewProductos.subordinacion = _this.cbSubordinacion.getValue();
            _this.viewProductos.idestructuras = idestructuras;
            if (estructuras.length > 0) {
                if (typeof _this.winMapa != 'undefined' && _this.winMapa.isVisible()) {
                    _this.cmpGIS.AjaxPlugins.estructura.representarEstructura(estructuras);
                }
                if (!_this.panelProducto.isVisible()) {
                    _this.panelProducto.expand();
                }
                Ext.each(estructuras, function (rec) {
                    ncols.add(LOG.util.Prototipos.columnaCantidad({
                        dataIndex: 'id' + rec.id, //rec.idestructura
                        header: rec.tipo == 0 ? '<b><font color="blue">' + rec.denominacion + '</font></b>' : (rec.tipo == 1 ? '<b>' + rec.denominacion + '</b>' : rec.denominacion),
                        tooltip: rec.denominacion,
                        width: 150,
                        align: 'right',
                        renderer: function (v) {
                            return Ext.util.Format.round(v, 6);
                        }
                    }));
                });
                var columns = LOG.util.UIManager.proccessColumns(ncols);
                var cmGridPrincipal = new Ext.ux.grid.LockingColumnModel(columns.columns);
                var recStGridPrincipal = Ext.data.Record.create(columns.fields);
                var cfgStore = {
                    url: _this.viewProductos.urlBusquedaGridPrincipal,
                    reader: new Ext.data.JsonReader({
                        id: _this.viewProductos.idGridPrincipal,
                        totalProperty: 'cantidad',
                        root: 'datos'
                    }, recStGridPrincipal)
                };
                var store = new Ext.data.Store(cfgStore);
                _this.viewProductos.storePrincipal = store;
                _this.viewProductos.gpPrincipal.reconfigure(store, cmGridPrincipal);
                _this.viewProductos.gpPrincipal.setAutoScroll(true);
                _this.viewProductos.gpPrincipal.getView().refresh();
                _this.viewProductos.gpPrincipal.getBottomToolbar().bindStore(store);
                _this.viewProductos.storePrincipal.initBaseParams.subordinacion = _this.cbSubordinacion.getValue();
                _this.viewProductos.storePrincipal.initBaseParams.idestructuras = Ext.encode(idestructuras);
                _this.viewProductos.storePrincipal.initBaseParams.idareas = Ext.encode(idareas);
                _this.viewProductos.storePrincipal.initBaseParams.idindicadores = Ext.encode(idproductos);
                _this.viewProductos.storePrincipal.on({
                    beforeload: function () {
                        _this.viewProductos.storePrincipal.baseParams.subordinacion = _this.cbSubordinacion.getValue();
                        _this.viewProductos.storePrincipal.baseParams.idestructuras = Ext.encode(idestructuras);
                        _this.viewProductos.storePrincipal.baseParams.idareas = Ext.encode(idareas);
                        _this.viewProductos.storePrincipal.baseParams.idindicadores = Ext.encode(idproductos);
                        _this.viewProductos.storePrincipal.baseParams.concepto = concepto;
                        _this.viewProductos.storePrincipal.baseParams.reporte = _this.cbReporte.getValue();
                    }
                });
                _this.viewProductos.reprogramar(_this.viewProductos.storePrincipal);
                _this.viewProductos.storePrincipal.load();
            } else {
                if (_this.winMapa.isVisible()) {
                    _this.cmpGIS.AjaxPlugins.estructura.representarEstructura([]);
                }
                var columns = LOG.util.UIManager.proccessColumns(ncols);
                var cmGridPrincipal = new Ext.ux.grid.LockingColumnModel(columns.columns);
                var recStGridPrincipal = Ext.data.Record.create(columns.fields);
                var cfgStore = {
                    url: _this.viewProductos.urlBusquedaGridPrincipal,
                    reader: new Ext.data.JsonReader({
                        id: _this.viewProductos.idGridPrincipal,
                        totalProperty: 'cantidad',
                        root: 'datos'
                    }, recStGridPrincipal)
                };
                var store = new Ext.data.Store(cfgStore);
                _this.viewProductos.storePrincipal = store;
                _this.viewProductos.gpPrincipal.reconfigure(store, cmGridPrincipal);
                _this.viewProductos.gpPrincipal.setAutoScroll(true);
                _this.viewProductos.gpPrincipal.getView().refresh();
                _this.viewProductos.gpPrincipal.getBottomToolbar().bindStore(store);
                _this.viewProductos.storePrincipal.on({
                    beforeload: function () {
                        _this.viewProductos.storePrincipal.baseParams.subordinacion = _this.cbSubordinacion.getValue();
                        _this.viewProductos.storePrincipal.baseParams.idestructuras = Ext.encode([-1]);
                        _this.viewProductos.storePrincipal.baseParams.idindicadores = Ext.encode([-1]);
                    }
                });
                _this.viewProductos.storePrincipal.removeAll();
            }
        });

    },
    getPanelContenido: function () {
        var _this = this;
        this.panelInferior();
        this.listaBotones = new LOG.util.List();
        this.listaBotones.add(LOG.util.UIManager.createBtn({
            text: this.idioma.tbtnProducto,
            tooltip: this.idioma.ttProducto,
            iconCls: 'producto',
            handler: function () {
                LOG.inv.maestroproductos.Loader.init(function () {
                    var v = new LOG.lb.maestroproductos.UIProductos({
                        tipo: 1,
                        usarAplicar: true,
                        parametros: {
                            restringir: 0,
                            filtrarentidad: _this.cbReporte.getValue() == 1 ? 0 : 1,
                        },
                        doAction: function (r) {
                            var record = [];
                            Ext.each(r, function (rec) {
                                record.push(rec);
                            });
                            _this.storePrincipal.add(record);
                        }
                    });
                    v.show();
                });
            },
            controlFn: Ext.emptyFn
        }));
        this.listaBotones.add(LOG.util.UIManager.createBtn({
            iconCls: 'eliminar',
            text: this.idioma.lbBtnElim,
            tooltip: this.idioma.ttBtnEliminar,
            handler: function () {
                _this.storePrincipal.remove(_this.getGridPrincipal().getSelectionModel().getSelections());
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function (e) {

                    if (e == 'selectionchange') {
                        b.disable();
                        if (_caller.getGridPrincipal().getSelectionModel().hasSelection())
                            b.enable();
                    }

                });
            }
        }));
        this.listaBotones.add(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnExistencias,
            tooltip: this.idioma.ttBtnExistencias,
            iconCls: 'logistica',
            disabled: true,
            menu: {
                items: [
                    {
                        text: 'En almac\xe9n',
                        handler: function () {
                            _this.buscarProductos(8);
                        }
                    },
                    {
                        text: 'En uso',
                        handler: function () {
                            _this.buscarProductos(5);
                        }
                    },
//                    {
//                        text: 'Todos',
//                        handler: function () {
//                            _this.buscarProductos(0);
//                        }
//                    },
                    {
                        text: 'Visualizar entidades',
                        hidden: !_this.grantedAction('SHOWMAP'),
                        handler: function () {
							try{
								if (typeof _this.panelMapa == 'undefined') {
									_this.panelMapa = _this.inicializarMapa();
									_this.panelMapa.region = 'center';
									_this.winMapa = new LOG.util.Window({
										items : [_this.panelMapa],
										buttons : [],
										modal : false,
										minimizable : true,
										height : 500,
										width :850
									});
									_this.winMapa.modal = false;
								}
								_this.winMapa.show();
							}catch(err){
								_this.winMapa.show();
							}
                            
                        },
                    }
                ]
            },
            controlFn: function (b, _caller) {
                LOG.util.UIManager.encadenaFn(_caller.arbolEstructuras, 'fireEvent', function(e) {
                    if (e == 'checkchange') {
                        b.disable();
                        if (this.getChecked().length > 0) {
                            b.enable();
                        }
                    }
                }, 'existenciaChecked');
                LOG.util.UIManager.encadenaFn(_caller.cbReporte, 'fireEvent', function(e) {
                    if (e == 'select') {
                        b.disable();
                    }
                }, 'seleccionarReporte');
            }
        }));
        this.listaBotones.add('->');
        this.listaBotones.add(LOG.util.Prototipos.botonAyuda({
            id: 'idExistencia'
        }));
        this.panelBot = LOG.util.UIManager.initPanel({
            region: 'north',
            border: true,
            tbar: this.listaBotones.getArray()
        });
        this.panelGrid.add(this.panelBot);
        this.panelEstructura = new Ext.estructura.panel.PanelEstructura({
            width: 350,
            menu: false,
            cargos: true,
            checker: true,
            region: 'west',
            limit: false,
        });
        this.arbolEstructuras = new LOG.inv.replicar.ArbolEstructuras({
            tbar: [
                'Reporte', ' ', _this.cbReporte = new LOG.util.ComboBox({
                    valueField: 'idreporte',
                    displayField: 'denominacion',
                    value: 1,
                    editable: false,
                    store: new Ext.data.ArrayStore({
                        fields: ['idreporte', 'denominacion'],
                        data: [[1, 'Existencias Generales'], [(_this.grantedAction('RDeposito') ? 2 : 3), 'Existencias de la unidad']]
                    }),
                    listeners: {
                        select: function(cb, rec) {
                            _this.panelProducto.hide();
                            _this.arbolEstructuras.unCheckAll();
                            _this.cbSubordinacion.reset();
                            _this.cbSubordinacion.disable();
                            if (rec.data.idreporte == 1) {
                                _this.cbSubordinacion.enable();
                            } else {
                                _this.arbolEstructuras.getLoader().baseParams.tipo = this.getValue();
                                if (_this.arbolEstructuras.getRootNode().isExpanded()) {
                                    _this.arbolEstructuras.getLoader().load(_this.arbolEstructuras.getRootNode());
                                }
                                _this.arbolEstructuras.getRootNode().collapse();
                                _this.arbolEstructuras.getRootNode().expand();
                                _this.arbolEstructuras.removerSeleccion();
                            }
                        }
                    }
                }),
                '-', 'Forma de visualizaci\xf3n', ' ', _this.cbSubordinacion = new LOG.util.ComboBox({
                    url: 'obtenerSubordinaciones',
                    valueField: 'idnomsubordinacion',
                    displayField: 'denominacion',
                    listeners: {
                        select: function(cb, rec) {
                            _this.panelProducto.hide();
                            _this.arbolEstructuras.unCheckAll();
                            _this.arbolEstructuras.getLoader().baseParams.tiposubordinacion = rec.data.idnomsubordinacion;
                            _this.arbolEstructuras.getLoader().baseParams.tipo = 1;
                            if (_this.arbolEstructuras.getRootNode().isExpanded()) {
                                _this.arbolEstructuras.getLoader().load(_this.arbolEstructuras.getRootNode());
                            }
                            _this.arbolEstructuras.getRootNode().collapse();
                            _this.arbolEstructuras.getRootNode().expand();
                            _this.arbolEstructuras.removerSeleccion();
                        }
                    }
                })
            ],
            collapsible: true,
            border: true,
            listeners: {
                beforeload: function(node) {
                    this.getLoader().baseParams.checked = node.getUI().isChecked();
                    if (this.baseParams.tipo == 1) {
                        if (node.id == 0 && _this.cbSubordinacion.getValue() == '') {
                            _this.cbSubordinacion.markInvalid(LOG.util.Idioma.msgCampoObligatorio);
                            return false;
                        }
                    }
                }
            },
            region: 'west',
            width: '50%',
            split: true,
            minSize: 250
        });
        this.panelConetnido = LOG.util.UIManager.initPanel({
            layout: 'border',
            region: 'center',
            border: true,
            items: [this.arbolEstructuras, this.panelGrid, this.panelProducto]
        });
        return this.panelConetnido;
    },
    panelInferior: function () {
        var _this = this;
        this.viewProductos = new LOG.inv.replicar.PanelExistencias({
            idioma: _this.idioma
        });
        this.viewProductos.init();
        this.panelProducto = LOG.util.UIManager.initPanel({
            title: this.idioma.ttExistenciaUnidad,
            frame: false,
            region: 'south',
            layout: 'fit',
            border: true,
            collapsible: true,
            collapsed: true,
            hidden: true,
            height: 300,
            minSize: 250,
            split: true,
            items: [this.viewProductos.view()],
            listeners: {
                hide: function() {
                    _this.getVistaPrincipal().doLayout();
                }
            }
        });
    },
    inicializarMapa: function () {
        var _this = this;
        _this.cmpGIS = new GIS({
            project: 'inre',
            commonDir: 'logistica/inventario/replicadatos/views/js/replicar/',
            iconField: 'imagen',
            isWindow: false,
            defaultIcon: '/configuracion/comun/views/images/ptorojo.png',
            iframeLoadedTime: 5000,
            plugins: [{
                    name: 'estructura',
                    static: ['estructura.ajax.js']
                }
            ],
            ventana: {
                border: false,
                maximized: true,
                buttons: [{
                    iconCls: 'salir',
                    text: 'Salir',
                    handler: function () {
                        _this.cmpGIS.window.close();
                    }
                }],
                listeners: {}
            }
        });
        var panelMapa = _this.cmpGIS.show();
        panelMapa.fbar = null;
        panelMapa.buttons = null;
        panelMapa.tbar = null;
        return panelMapa;
    }
});