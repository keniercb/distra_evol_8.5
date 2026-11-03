Ext.ns('LOG.util');
/**
 * Plantilla para la cracion de IU de gestion de logistica
 * Contiene un panel con los botones, un grid general y panel con busqueda
 * avanzada
 * @type @exp;Ext@call;extend
 */
LOG.util.UITemplate = Ext.extend(Ext.util.Observable, {
    /**
     * Lista de los botones principales de la IU
     */
    listaBotones: undefined,
    /**
     * 
     */
    listaMenu: undefined,
    /**
     * Lista de las columnas del grid principal
     */
    listaColumnas: undefined,
    /**
     * Lista que contiene los plugins del componente
     */
    listaPlugins: undefined,
    /**
     * 
     */
    textBusquedaSimple: undefined,
    /**
     * 
     */
    concepto: '<b><i>concepto de b\xfasqueda</i></b>.',
    /**
     * 
     */
    listaAcciones: undefined,
    /**
     * Lista de los campos de la busqueda avanzada
     */
    listaCamposBusqueda: undefined,
    /**
     * Si el comoponente realiza la busqueda avanzada
     */
    busquedaAvanzada: false,
    /**
     * Panel lateral para la busqueda avanzada
     */
    panelBusquedaAvanzada: undefined,
    /**
     * Si el componente realiza la busqueda basica
     */
    busquedaBasica: false,
    /**
     * Panel principal de la IU
     */
    panelPrincipal: undefined,
    /**
     * Panel de los grid
     */
    panelGrid: undefined,
    /**
     * URL de la que se carga el grid principal de la IU
     */
    urlBusquedaGridPrincipal: undefined,
    /**
     * 
     */
    smGridPrincipal: undefined,
    /**
     * 
     */
    gpPrincipal: undefined,
    /**
     * 
     */
    storePrincipal: undefined,
    /**
     * 
     */
    cmGridPrincipal: undefined,
    /**
     *  Campo de la consulta que se usa como identificador de los resultados    
     */
    idGridPrincipal: undefined,
    /**
     * Forma en la que se vizualiza el componente, 
     * default - Ext.Viewport
     * panel - Ext.Panel
     * ventana - Ext.Window
     */
    formaVisualizacion: 'default',
    /**
     * 
     */
    gridEditable: false,
    /**
     * 1: Seleccion simple
     * 2: Seleccion multliple sin checkbox
     * 3 Seleccion multiple con  checbox
     */
    modoSeleccion: 3,
    /**
     * 
     */
    autoShow: true,
    /**
     * 
     */
    bbarVisible: true,
    /**
     * 
     */
    autoLoad: true,
    /**
     * 
     */
    autoSelect: true,
    /**
     * Mantiene la seleccion de records al actualizar o cambiar de pagina (autoSelect tiene que ser false).
     */
    keepSelected: false,
    /**
     * Vista principal del componente para que pueda ser usado en otros componentes
     */
    vistaPrincipal: undefined,
    /**
     * Direccion del controlador de donde la ventana 
     */
    dirController: '',
    /**
     * Variable que controla si el panel superior esta visble
     */
    panelBotonesVisible: true,
    /**
     * 
     * @param {type} config
     * @returns {void}
     */
    modelo: undefined,
    /**
     * 
     */
    acciones: undefined,
    /**
     * html que tendra la fila expandida
     */
    rowexpander: '',
    /**
     * Lista pra alas colunmas editable con check
     */
    gridPlugins: undefined,
    /**
     * Parametros iniciales para cargar el grid
     */
    baseParams: undefined,

    foreceFitView : true,

    viewConfig : {},
    /**
     * Variable que controla si persisten los records modificados a traves de load y remove
     */
    pruneModifiedRecords: false,
    /**
     * Constructor de la clase
     * @param {Object} config
     * @returns {void}
     */
    constructor: function(config) {
        this.listaBotones = new LOG.util.List();
        this.listaMenu = new LOG.util.List();
        this.listaColumnas = new LOG.util.List();
        this.listaAcciones = new LOG.util.List(config.acciones);
        this.listaPlugins = new LOG.util.List();
        this.gridPlugins = new LOG.util.List();
        this.listaCamposBusqueda = new LOG.util.List();
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma.init());
        LOG.util.UIManager.apply(this, config);
        this.isInit = false;
        switch (this.formaVisualizacion) {
            case 'ventana':
                {
                    this.vistaPrincipal = LOG.util.UIManager.initWindow(config.viewConfig);
                    break;
                }
            case 'panel':
                {
                    this.vistaPrincipal = LOG.util.UIManager.initPanel({
                        region: 'center',
                        border: false,
                        layout: 'border'
                    });
                    break;
                }
        }
    },
    /**
     * Inicializa los componentes principales de la Plantilla
     * @returns {undefined}
     */
    init: function() {
        var _strURL = this.dirController ? "{0}/{1}" : "{0}{1}";
        if(!this.isInit){
            this.urlBusquedaGridPrincipal = String.format(_strURL, this.dirController, this.urlBusquedaGridPrincipal);
        }
        this.isInit = true;
        if (this.initDefaults)
            this.initDefaults();
        this.panelBotones = LOG.util.UIManager.initFocusPanel({
            region: 'north',
            border: true,
            tbar: new LOG.util.Toolbar({
                enableOverflow: true
            })
        });
        this.panelPrincipal = LOG.util.UIManager.initPanel({
            region: 'center',
            border: true,
            layout: 'border'
        });
        if (this.autoLoadPlugins !== false) {
            this.initPlugins();
        }
        if (this.busquedaBasica) {
            this.gridFilter = LOG.util.UIManager.initFilterGrid(null, this.textBusquedaSimple);
        }
        if (this.busquedaAvanzada) {
            this.panelBusquedaAvanzada = LOG.util.UIManager.initPanelBusqueda({
                columnas: 3,
                concepto: this.concepto,
                width: this.widthAvanzada,
                contexto: this
            });
        }

        if (!this.panelBotonesVisible)
            this.getPanelSuperior().setVisible(false);

        this.panelGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border'
        });
    },
    initPlugins: function() {
        this.listaPlugins.each(function(plugin) {
            plugin.init(this);
        }, this);
    },
    /**
     * 
     * @returns {undefined}
     */
    initDefaults: function() {
        if (undefined == this.idioma && typeof this.setIdioma == 'function')
            this.setIdioma();
        if (this.initDefaultColumns)
            this.initDefaultColumns();
        if (this.initDefaultButtons)
            this.initDefaultButtons();
        var i = 1;
        /*this.listaBotones.each(function(b) {
            LOG.util.TabController.push(b);
        });*/
    },
    /**
     * 
     * @returns {void}
     */
    render: function(config) {
        var _this = this;

        if(!this.smGridPrincipal)
            this.smGridPrincipal = LOG.util.UIManager.initSelectionModel(this.modoSeleccion, this.singleSelect || undefined);
        
        var cls = LOG.util.UIManager.proccessColumns(this.listaColumnas, (this.modoSeleccion == 3 ? this.smGridPrincipal : null));

        var objCfg = {
            _plugins: this.gridPlugins.getArray()
        };

        if (this.rowexpander != '') {
            var expander = new Ext.ux.grid.RowExpander({
                tpl: new Ext.Template(_this.rowexpander)
            });
            cls.columns.push(expander);
            objCfg._plugins.push(expander);
        }

        if (cls.filtros.length > 0) {
            var gridFilter = new Ext.ux.grid.GridFilters({
                local: false,
                encode: true,
                filters: cls.filtros
            });
            objCfg._plugins.push(gridFilter);
        }
        this.cmGridPrincipal = new Ext.grid.ColumnModel(cls.columns);
        if (cls.bloquear) {
            this.cmGridPrincipal = new Ext.ux.grid.LockingColumnModel(cls.columns);
            objCfg.view = new Ext.ux.grid.LockingGridView();
        }
        this.recStGridPrincipal = Ext.data.Record.create(cls.fields);
        var cfgStore = {
            url: this.urlBusquedaGridPrincipal,
            remoteSort: true,
            pruneModifiedRecords: this.pruneModifiedRecords,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                idProperty: this.idGridPrincipal
            }, this.recStGridPrincipal)
        };

        if (cls.groupField != false) {
            cfgStore = LOG.util.UIManager.apply(cfgStore, {
                sortInfo: {field: this.orderField || this.idGridPrincipal, direction: "ASC"},
                groupField: cls.groupField,
                remoteSort: true,
                remoteGroup: true
            });

            objCfg.view = new Ext.grid.GroupingView({
                forceFit: this.foreceFitView,
                showGroupName: false,
                enableNoGroups: false,
                enableGroupingMenu: false,
                hideGroupedColumn: true,
                groupTextTpl: '{text} : {[values.rs.length]} ' + LOG.util.Idioma.lbItems
            });
        }

        this.storePrincipal = (cls.groupField === false) ? new Ext.data.Store(cfgStore) : new Ext.data.GroupingStore(cfgStore);
        objCfg.expanded = cls.expanded || false;
        objCfg.nobbar = !this.bbarVisible;
        objCfg.roweditor = this.rowEditor;
        objCfg.showMsgCargar = this.showMsgCargar;
        this.gpPrincipal = (this.gridEditable) ? LOG.util.UIManager.initEditableGridPanel(this.cmGridPrincipal, this.storePrincipal, this.smGridPrincipal, objCfg) : LOG.util.UIManager.initGrid(this.cmGridPrincipal, this.storePrincipal, this.smGridPrincipal, objCfg);
        if (cls.groupField != false) {
            this.agrupado = true;
            var _id = Ext.id();
            this.gpPrincipal.getBottomToolbar().add(['->',
                {
                    iconCls: 'agupar-desagrupar',
                    menu: [
                        {
                            text: LOG.util.Idioma.lbBtnAgrupar,
                            iconCls: 'agrupar-flecha',
                            disabled: true,
                            handler: function() {
                                _this.storePrincipal.groupBy(cls.groupField);
                                if (_this.summary) {
                                    _this.summary.toggleSummaries();
                                }
                                this.disable();
                                Ext.getCmp(_id + '-agrupar').enable();
                            },
                            id: _id + '-desagrupar'
                        }, {
                            text: LOG.util.Idioma.lbBtnDesagrupar,
                            iconCls: 'desagrupar-flecha',
                            handler: function() {
                                if (_this.summary) {
                                    _this.summary.toggleSummaries();
                                    _this.storePrincipal.remoteGroup = false;
                                }
                                _this.storePrincipal.clearGrouping();
                                this.disable();
                                Ext.getCmp(_id + '-desagrupar').enable();
                            },
                            id: _id + '-agrupar'
                        }]
                },
                '-']);
        }
        this.gpPrincipal.on({
            'rowdblclick': function() {
                if (typeof _this.onGridDobleClick == 'function') {
                    _this.onGridDobleClick.call(_this);
                }
            }
        });
        if (typeof this.baseParams == 'object') {
            this.storePrincipal.initBaseParams = this.baseParams;
        }
        if (this.autoLoad) {
            this.storePrincipal.load();
        }
        this.storePrincipal.fireEvent = this.storePrincipal.fireEvent.createSequence(function(e) {
            if (e == 'beforeload') {
                if (_this.agrupado) {
                    this.baseParams.sortfield = this.groupField;
                }
            }
            else if (e == 'load' && _this.autoSelect) {
                if (_this.storePrincipal.getTotalCount() > 0) {
                    if (_this.smGridPrincipal.hasSelection()) {
                        _this.smGridPrincipal.clearSelections();
                        _this.smGridPrincipal.fireEvent('rowdeselect');
                    }
                    if (_this.getPanelGrid().rendered) {
                        _this.smGridPrincipal.selectFirstRow();    
                    }
                }
            }
        });
        if (!this.autoSelect && this.keepSelected === true) {
            this.mantenerSeleccion();
        }
        LOG.util.UIManager.initGridContexMenu(this.gpPrincipal, this.listaMenu);
        if (this.modelo) {
            this.modelo.bindGridPanel(this.gpPrincipal);
        }
        this.gpPrincipal.concepto = this.concepto;
        if (this.busquedaBasica) {
//            this.gridFilter = LOG.util.UIManager.initFilterGrid(this.gpPrincipal, this.textBusquedaSimple);            
            this.gridFilter.init(this.gpPrincipal);
        }
        //Panel de botones principales
        if (this.listaBotones.count()) {
            this.panelBotones.getTopToolbar().add('-');
            this.panelBotones.getTopToolbar().add(this.listaBotones.getArray());
        } else {
            this.panelBotones.getTopToolbar().setVisible(false);
        }
        this.panelPrincipal.add(this.panelBotones);
        this.panelGrid.add(this.gpPrincipal);
        if (typeof this.getPanelContenido == 'function') {
            this.panelPrincipal.add(this.getPanelContenido());
        } else {
            this.panelPrincipal.add(this.panelGrid);
        }
        if (this.busquedaAvanzada) {
            this.panelBusquedaAvanzada.setContainer(this.panelPrincipal);
            this.panelBusquedaAvanzada.setKeyContainer(this.panelGrid);
            this.panelBusquedaAvanzada.setGrid(this.gpPrincipal);
            this.panelBusquedaAvanzada.init();
        }
        this.setTemplateView(config || {});
        this.enableHotKeys(this.panelGrid);
        if (this.autoShow && this.formaVisualizacion == 'ventana') {
            this.vistaPrincipal.show();
            this.vistaPrincipal.doLayout();
        }
        return this.vistaPrincipal;
    },
    /**
     * Devuelve la vista principal del componente en dependencia de la forma de 
     * visualizacion
     * @returns {void}
     */
    setTemplateView: function(config) {
        var _this = this;
        LOG.util.UIManager.apply(this.vistaPrincipal, config || {});
        switch (this.formaVisualizacion) {
            case 'ventana':
                {
                    this.vistaPrincipal.add(this.panelPrincipal);
                    LOG.util.UIManager.apply(this.vistaPrincipal, {
                        getFocusElement: function() {
                            return _this.getPanelGrid();
                        }
                    });
                    break;
                }
            case 'panel':
                {
                    this.vistaPrincipal.add(this.panelPrincipal);
                    this.vistaPrincipal.doLayout();
                    break;
                }
            default:
                {
                    this.vistaPrincipal = LOG.util.UIManager.initViewport([this.panelPrincipal]);
                    LOG.util.WindowMgr.add(this.panelGrid);
                    break;
                }
        }
    },
    /**
     * Funcion para habilitar las telas calientes de la vista
     * @returns {void}
     */
    enableHotKeys: function(p) {
        var _this = this;
        if (this.formaVisualizacion != 'default') {
            p.onRender = p.onRender.createSequence(function() {
                _this.listaBotones.each(function(b) {
                    LOG.util.UIManager.applyKey(b, p);
                    if (typeof b.controlFn == 'function') {
                        b.controlFn.createDelegate(this, [b, _this]).call();
                    }
                }.createDelegate(this));
                this.listaMenu.each(function(m) {
                    if (typeof m.controlFn == 'function') {
                        m.controlFn.createDelegate(this, [m, this]).call();
                    }
                }.createDelegate(this));
                _this.enableClearHotKey(p);
                if (!p.keyMap) {
                    p.getKeyMap();
                }
                p.keyMap.addBinding([{
                        key: 40,
                        stopEvent: true,
                        fn: function() {
                            _this.smGridPrincipal.selectNext();
                        }
                    }, {
                        key: 38,
                        stopEvent: true,
                        fn: function() {
                            _this.smGridPrincipal.selectPrevious();
                        }
                    }]);

            }, this);
        } else {
            this.listaBotones.each(function(b) {
                LOG.util.UIManager.applyKey(b, p);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(this, [b, this]).call();
                }
                if (b.menu) {
                    for (var i in b.menu.items.items) {
                        var m = b.menu.items.items[i];
                        if (typeof m.controlFn == 'function') {
                            m.controlFn.createDelegate(this, [m, _this]).call();
                        }
                    }
                }
            }.createDelegate(this));
            _this.enableClearHotKey(p);

            p.keyMap.addBinding([{
                    key: 40,
                    stopEvent: true,
                    fn: function() {
                        _this.smGridPrincipal.selectNext();
                    }
                }, {
                    key: 38,
                    stopEvent: true,
                    fn: function() {
                        _this.smGridPrincipal.selectPrevious();
                    }
                }]);
        }
        p.focus();
        this.listaMenu.each(function(m) {
            if (typeof m.controlFn == 'function') {
                m.controlFn.createDelegate(this, [m, this]).call();
            }
        }.createDelegate(this));
    },
    /**
     * 
     * @param {type} panel
     * @returns {undefined}
     */
    enableClearHotKey: function(panel) {
        var _this = this;
        panel.getKeyMap().addBinding({
            key: 'L',
            alt: true,
            shift: false,
            control: false,
            fn: function() {
                if (_this.busquedaBasica) {
                    _this.gridFilter.onTriggerClear()
                } else if (typeof _this.customTriggerClear == 'function') {
                    _this.customTriggerClear.createDelegate(_this).call();
                }
            }
        });
        panel.getKeyMap().addBinding({
            key: 'B',
            alt: true,
            shift: false,
            control: false,
            fn: function() {
                if (_this.busquedaBasica) {
                    _this.gridFilter.onTriggerSearch()
                } else if (typeof _this.onTriggerSearch == 'function') {
                    _this.onTriggerSearch.createDelegate(_this).call();
                }
            }
        });
    },
    /**
     * Metodo que ejecuta la visualizacion general del componente, automaticamente
     * elimina la funcion del click derecho sobre la web
     * @returns {void}
     */
    view: function(objCfg) {
        var view;
        if (this.formaVisualizacion == 'default') {
            Ext.onReady(function() {
                //Ext.getBody().on("contextmenu", Ext.emptyFn, null, {preventDefault: true});
                Ext.QuickTips.init();
                view = this.render(objCfg || {});
            }, this);
        } else {
            view = this.render(objCfg || {});
        }
        return view;
    },
    /**
     * 
     * @param {type} p
     * @returns {undefined}
     */
    addGridPlugin: function(p) {
        this.gridPlugins.add(p);
    },
    /**
     * Adiciona un nueva columna al grid
     * @param {{default: boolean, dataIndex: string, width: number, header: (string)}} c
     * @returns {undefined}
     */
    addGridColumn: function(c) {
        this.listaColumnas.add(c);
    },
    /**
     * Inserta una columna en el grid en una posicion especifica
     * @param {type} c
     * @param {type} i
     * @returns {undefined}
     */
    insertGridColumn: function(c, i) {
        this.listaColumnas.insert(c, i);
    },
    /**
     * Adiciona un nuevo boton a la IU
     * @returns {undefined}
     */
    addToolbarButton: function(b) {
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(b));
        if (b.isContextual) {
            var m = LOG.util.UIManager.createMenuItem({
                text: b.text,
                controlFn: b.controlFn || Ext.emptyFn,
                handler: function() {
                    this.handler.call(this, this);
                },
                scope: b,
                iconCls: b.iconCls
            });
            this.addContexMenu(m);
        }
    },
    /**
     * 
     * @param {type} c
     * @returns {undefined}
     */
    addContexMenu: function(c) {
        this.listaMenu.add(c);
    },
    /**
     * Inserta un boton en una posicion especifca del tbar
     * @param {type} b
     * @param {type} i
     * @returns {undefined}
     */
    insertToolbarButton: function(b, i) {
        this.listaBotones.insert(LOG.util.UIManager.reconfigureButton(b), i);
        if (b.isContextual) {
            var m = LOG.util.UIManager.createMenuItem({
                text: b.text,
                //tooltip: b.controlFn || b.tooltip,
                controlFn: b.controlFn || Ext.emptyFn,
                handler: function() {
                    this.handler.call(this, this);
                },
                scope: b,
                iconCls: b.iconCls
            });
            this.addContexMenu(m);
        }
    },
    /**
     * Adiciona un nuevo componente a la busqueda avanzada de la vista
     * @param {type} c
     * @returns {void}
     */
    addFilterComponent: function(c) {
        if (this.busquedaAvanzada && this.panelBusquedaAvanzada) {
            this.panelBusquedaAvanzada.addSearchComponent(c);
        }
    },
    /**
     * Devuelve el panel superio del Template
     * @returns {LOG.util.Panel}
     */
    getPanelSuperior: function() {
        return this.panelBotones;
    },
    /**
     * Adiciona un nuevo plugin al componente
     * @param {type} o
     * @returns {void}
     */
    attachPlugin: function(o) {
        this.listaPlugins.add(o);
    },
    /**
     * Devulve el store principla de la IU
     * @returns {Ext.data.Store}
     */
    getStorePrincipal: function() {
        return this.storePrincipal;
    },
    /**
     * Devulve el grid principla de la IU
     * @returns {Ext.data.Store}
     */
    getGridPrincipal: function() {

        return this.gpPrincipal;
    },
    /**
     * Devulve el sm principla de la IU
     * @returns {Ext.data.Store}
     */
    getSmPrincipal: function() {

        return this.smGridPrincipal;
    },
    /**
     * Devulve el panel principal de la IU
     * @returns {this.panelPrincipal}
     */
    getPanelPrincipal: function() {
        return this.panelPrincipal;
    },
    /**
     * Devuelve el objeto que contiene la vista principal
     * @returns {this.vistaPrincipal}
     */
    getVistaPrincipal: function() {
        return this.vistaPrincipal;
    },
    /**
     * 
     * @returns {undefined}
     */
    getPanelBusqueda: function() {
        return this.panelBusquedaAvanzada;
    },
    /**
     * 
     * @returns {undefined}
     */
    getPanelGrid: function() {
        return this.panelGrid;
    },
    /**
     * 
     * @param {type} params
     * @returns {undefined}
     */
    reiniciarBusqueda: function(params) {
        this.storePrincipal.load(params || {});
    },
    /**
     * 
     */
    onGridDobleClick: undefined,
    /**
     * 
     * @param {type} idAccion
     * @returns {Boolean|Array.grantedAction.existe}
     */
    grantedAction: function(idAccion) {
        var existe = false;
        this.listaAcciones.each(function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    ocultarColumna: function(dataIndex, ocultar) {
        if (typeof ocultar == 'undefined') {
            ocultar = true;
        }
        var suma = 1;
        if (this.modoSeleccion == 3) {
            suma = 2;
        }
        var pos = this.listaColumnas.getPosByField('dataIndex', dataIndex, 'header');
        this.gpPrincipal.getColumnModel().setHidden(pos + suma, ocultar);
    },
    /**
     * Mantiene la seleccion de records al actualizar o cambiar de pagina.
     * @returns {undefined}
     */
    mantenerSeleccion: function() {
        var _this = this;
        this.marcados = new Array();
        this.smGridPrincipal.on({
            rowselect: function(_sm, _index, _r) {
                if (_this.marcados.indexOf(_r.id) == -1) {
                    _this.marcados.push(_r.id);
                }
            },
            rowdeselect: function(_sm, _index, _r) {
                if (_this.marcados.indexOf(_r.id) != -1) {
                    _this.marcados.remove(_r.id);
                }
            }
        });
        LOG.util.UIManager.encadenaFn(this.storePrincipal, 'fireEvent', function(e, st, rec) {
            if (e == 'load') {
                var checked = new Array();
                Ext.each(rec, function(r, index) {
                    Ext.each(_this.marcados, function(id) {
                        if (id == r.id) {
                            checked.push(index);
                        }
                    });
                });
                _this.smGridPrincipal.selectRows(checked);
                _this.smGridPrincipal.fireEvent('rowdeselect');
            }
        }, '_marcar');
    }
});

