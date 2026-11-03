// Definimos el espacio de nombres para LOG.inv.Existenciaspublicas.Idioma
Ext.namespace('LOG.inv');
if (!LOG.inv.Existenciaspublicas) {
    LOG.inv.Existenciaspublicas = {
        Idioma: {
            ttBtnConcepto: 'Concepto',
            tlConcepto: 'Concepto',
            cgCodigo: 'Código',
            cgDenominacion: 'Denominación',
            cgCantidad: 'Cantidad',
            cgUm: 'UM',
            lbNaturaleza: 'Naturaleza',
            lbNaturalezas: 'Naturalezas',
            lbSubordinacion: 'Subordinación',
            lbSubordinaciones: 'Subordinaciones',
            tlBtnExportar: 'Vista Reporte', // Cambiado de "Exportar" a "Vista Reporte"
            tlPanelDetalles: 'Detalles',
            cgEntidad: 'Entidad',
            cgAlmacen: 'Almacén',
            lbMinisterio: 'Ministerio',
            lbMinisterios: 'Ministerios'
        }
    };
}

// Define la clase existenciaspublicas
Ext.namespace('Ext.erp');

Ext.erp.existenciaspublicas = Ext.extend(LOG.util.UITemplate, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {console.log(1);
        config = config || {};
        config.dirController = '/logistica/inventario/recuperaciones/index.php/existenciaspublicas';
        config.urlBusquedaGridPrincipal = 'cargarExistencia';
        config.idGridPrincipal = 'idindicador';
        config.autoSelect = false;
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.busquedaBasica = true;
        config.busquedaAvanzada = false;
        config.idioma = LOG.inv.Existenciaspublicas.Idioma;
        config.concepto = config.idioma.ttBtnConcepto;
        config.textBusquedaSimple = config.idioma.tlConcepto;
        config.baseParams = {idusuario: idUsuario, /*identidad: idEntidad*/};
        Ext.erp.existenciaspublicas.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({dataIndex: 'idindicador'});
        
        this.addGridColumn({
            header:'Codigo',
            width: 120,
            dataIndex: 'codigo',
            default: true,
             filter : {
                type : 'string',
                //url : _this.dirController + '/obtenerCodigo',
                valueField : 'codigo',
                displayField: 'codigo',
                dataIndex : 'codigo',
            }
        });
        
        this.addGridColumn({
            header: 'Denominacion',
            autoExpand: true,
            dataIndex: 'denominacion',
            default: true,
             filter : {
                type : 'string',
                //url : _this.dirController + '/obtenerDenominacion',
                valueField : 'iddenominacion',
                displayField: 'denominacion',
                dataIndex : 'denominacion',
            }
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
         this.addGridColumn({
            header: 'Umedida',
            width: 100,
            align: 'right',
            dataIndex: 'umedida',
            default: true,
            filter : {
                type : 'combo',
                url : _this.dirController + '/obtenerUmedida',
                valueField : 'abreviaturaunidadmedida',
                displayField: 'umedida',
                dataIndex : 'umedida',
            }
        });
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: 'Disponible',
            width: 100,
            align: 'right',
            dataIndex: 'disponible',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: 'Existencia',
            width: 100,
            align: 'right',
            dataIndex: 'existencia',
            default: true
        }));
        this.addGridColumn(({
            header: 'Marca',
            width: 100,
            align: 'right',
            dataIndex: 'marca',
            default: true,
             filter : {
                type : 'string',
                //url : _this.dirController + '/obtenerMarca',
                valueField : 'denominacion',
                displayField: 'marca',
                dataIndex : 'marca',
            }
        }));
        this.addGridColumn(({
            header: 'Modelo',
            width: 100,
            align: 'right',
            dataIndex: 'modelo',
            default: true,
             filter : {
                type : 'string',
                //url : _this.dirController + '/obtenerModelo',
                valueField : 'denominacion',
                displayField: 'modelo',
                dataIndex : 'modelo',
            }
        }));
         
        
        this.addGridColumn({
            header: this.idioma.cgAlmacen,
            width: 100,
            align: 'right',
            dataIndex: 'almacen',
            default: true,
            filter : {
                type : 'combo',
                url : _this.dirController + '/obtenerAlmacen',
                valueField : 'almacen',
                displayField: 'almacen',
                dataIndex : 'almacen',
            }
        });
        
    },
    initDefaultButtons: function() {
        var _this = this;

        // Implementación del botón Vista Reporte siguiendo el patrón que funciona en indicadordeinventario
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({  // Usamos el mismo constructor del botón
            text: "Vista Reporte",
            tooltip: "Vista Reporte",
            disabled: false,  // Comenzamos con el botón habilitado
            handler: function() {
                try {
                    console.log("Iniciando Vista Reporte para existenciaspublicas");

                    // Obtener los filtros aplicados
                    var filters = {detalles: true};
                    try {
                        Ext.each(_this.getGridPrincipal().filters.getFilterData(), function(r){
                            filters[r.field] = r.data.value;
                        });
                    } catch(err) {
                        console.log("Error al obtener filtros, continuando sin filtros:", err);
                    }

                    // Crear y mostrar el reporte usando LOG.util.Report como en indicadordeinventario
                    var tipoReportes = new LOG.util.Report({
                        reports: [
                            {
                                dirReport: '/distra/logistica/inventario/recuperaciones/ExistenciasPublicas',
                                isList: true,
                                params: Ext.apply({}, filters, _this.getStorePrincipal().baseParams || {})
                            }
                        ]
                    });

                    console.log("Mostrando vista del reporte...");
                    tipoReportes.view();
                } catch (e) {
                    console.error("Error al crear reporte:", e);

                    // Método alternativo si LOG.util.Report falla
                    try {
                        console.log("Intentando método alternativo...");
                        var reportUrl = '/distra/logistica/inventario/recuperaciones/ExistenciasPublicas';
                        var queryString = '';

                        var params = {};
                        Ext.apply(params, _this.getStorePrincipal().baseParams || {});
                        Ext.apply(params, filters);

                        for (var key in params) {
                            if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null) {
                                queryString += (queryString ? '&' : '?') + key + '=' + encodeURIComponent(params[key]);
                            }
                        }

                        var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=yes,menubar=yes';
                        window.open(reportUrl + queryString, 'vistaReporte', wCfg);
                    } catch (e2) {
                        console.error("También falló el método alternativo:", e2);
                        Ext.MessageBox.alert('Error', 'No se pudo generar el reporte: ' + e.message);
                    }
                }
            }
        }));
    },
    init: function() {
        var _this = this;
        Ext.erp.existenciaspublicas.superclass.init.call(this);
        /*this.getPanelBusqueda().setColumns(1);

        // Campos de búsqueda avanzada
        this.addFilterComponent(new Ext.form.TextField({
            fieldLabel: 'Código',
            name: 'codigo_search',  // Usa un nombre diferente para diferenciarlo de la columna
             width: 150
        }));

        // ... (otros campos)

        if (typeof idsubordinacion !== 'undefined') {
            this.getPanelBusqueda().setColumns(2);
            this.addFilterComponent(new LOG.util.TreeCombo({
                fieldLabel: this.idioma.lbSubordinacion,
                idNode: idEntidad,
                textRootNode: this.idioma.lbSubordinaciones,
                name: 'idsubordinacion',
                url: '/logistica/inventario/recuperaciones/index.php/existenciaspublicas/cargarSubordinacion',
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
        }*/

        // Use afterrender to ensure buttons are available
        this.getPanelPrincipal().on('afterrender', function() {
            _this.panelDetalles = new Ext.erp.existenciaspublicasdetalles({});
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
            

             

            // Add event to advanced search button here, after panel is rendered
            /*var searchButton = _this.getPanelBusqueda().buttons[0]; // Assuming the search button is the first
            if (searchButton) {
                searchButton.on('click', function() {
                    var filters = {};
                    _this.getPanelBusqueda().items.each(function(item) {
                        if (item.name) {
                            filters[item.name] = item.getValue();
                        }
                    });

                     // Limpiar filtros vacíos
                    for (var key in filters) {
                        if (filters.hasOwnProperty(key) && (filters[key] === null || filters[key] === undefined || filters[key] === '')) {
                            delete filters[key];
                        }
                    }

                    console.log("Filtros de búsqueda:", filters);

                    // Apply filters to store and reload
                    _this.getStorePrincipal().baseParams = Ext.apply(_this.getStorePrincipal().baseParams || {}, filters);
                    _this.getStorePrincipal().load({params: {start: 0, limit: 50}}); // Reset pagination
                }, _this); // Use _this to keep correct scope
            }*/
        }, this); // Correct scope 'this' for the main panel's 'afterrender' event

    },
    // In the main class's render method
    render: function(config) {
        var render = Ext.erp.existenciaspublicas.superclass.render.call(this, config);
        var _this = this;

      this.cmbentidad = new LOG.util.ComboBox({
    fieldLabel: 'Entidades',
    id: 'identidad',
    url: 'getEstructuras',
    name: 'idestructura',
    displayField: 'denominacion',
    valueField: 'idestructura',
    resizable: true,
    listeners: {
        select: function(combo, record, index) {
            // Actualiza el parámetro de identidad
            _this.getStorePrincipal().baseParams.identidad = combo.getValue();
            
            // Recarga la grid con los nuevos parámetros
            _this.getStorePrincipal().load({
                params: {
                    start: 0,
                    limit: 50,
                    identidad: combo.getValue()
                }
            });
            
            // Opcional: colapsa el panel de detalles al cambiar la entidad
            if (_this.panelSur && _this.panelSur.collapsed === false) {
                _this.panelSur.collapse();
            }
        }
    }
});

        this.gpPrincipal.getTopToolbar().add(
            new Ext.form.Label({text: 'Entidad:'}),
            _this.cmbentidad,
            '-',
           
           
        );

        _this.getStorePrincipal().on('beforeload', function(st, options) {
            
            options.params = options.params || {};
            options.params.identidadd = _this.cmbentidad.getValue();
            if (_this.cmbentidad.getValue()) {
                options.params.identidad = _this.cmbentidad.getValue();
            } else {
                options.params.identidad = idEntidad;

            }
        

        });

        _this.getStorePrincipal().load();        

        // Improve event handling when selecting an item
        _this.getSmPrincipal().on('selectionchange', function(sm) {
            if (sm.getCount() == 1) {
                try {
                    var selectedRecord = sm.getSelected();
                    var idindicador = selectedRecord.get('idindicador');

                    console.log("Selected record:", selectedRecord.data);
                    console.log("selected idindicador:", idindicador);

                    if (idindicador) {
                        _this.panelSur.expand();
                        _this.panelDetalles.idindicador = idindicador;
                        _this.panelDetalles.idsubordinacion = _this.getStorePrincipal().baseParams.idsubordinacion;
                        _this.panelDetalles.idministerio = _this.getStorePrincipal().baseParams.idministerio;

                        // Set idindicador in the base parameters before loading
                        _this.panelDetalles.getStorePrincipal().baseParams = {
                            idindicador: idindicador,
                            detalles: true,
                            idsubordinacion: _this.panelDetalles.idsubordinacion,
                            idministerio: _this.panelDetalles.idministerio
                        };

                        // Load the store with a small delay to ensure parameters are set
                        setTimeout(function() {
                            _this.panelDetalles.getStorePrincipal().load({
                                params: {
                                    idindicador: idindicador,
                                    detalles: true,
                                    start: 0,
                                    limit: 50
                                }
                            });
                        }, 100);
                    }
                } catch (e) {
                  console.error("Error loading details:", e);
                  Ext.MessageBox.alert("Error", "Could not load details: " + e.message);
                }
            } else {
                _this.panelSur.collapse();
                _this.panelDetalles.getStorePrincipal().removeAll();
            }
        });

        // Rest of the code remains unchanged

        return render;
    }
});

// Register the class for ExtJS to recognize
Ext.reg('existenciaspublicas', Ext.erp.existenciaspublicas);

// Create an alias to access directly from Ext.erp["existenciaspublicas"]
if (!Ext.erp["existenciaspublicas"]) {
    Ext.erp["existenciaspublicas"] = Ext.erp.existenciaspublicas;
}

// Define the namespace for LOG.inv.existenciaspublicas.Idioma
if (!LOG.inv.existenciaspublicas) {
    LOG.inv.existenciaspublicas = {
        Idioma: LOG.inv.Existenciaspublicas.Idioma  // Reuse the language object
    };
}

// Updates existenciaspublicasdetalles class
Ext.erp.existenciaspublicasdetalles = Ext.extend(LOG.util.UITemplate, {
    idindicador: null,
    idsubordinacion: null,
    idministerio: null,
    constructor: function(config) {
        console.log("Details constructor");
        config = config || {};
        config.dirController = '/logistica/inventario/recuperaciones/index.php/existenciaspublicas';
        config.urlBusquedaGridPrincipal = 'cargarExistencia'; // Keep the same endpoint
        config.idGridPrincipal = 'idproducto';
        config.autoLoad = false;
        config.autoSelect = false;
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.idioma = LOG.inv.existenciaspublicas.Idioma;
        config.baseParams = {idusuario: idUsuario, identidad: idEntidad, detalles: true};
        Ext.erp.existenciaspublicasdetalles.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function() {
        // No changes in the columns
        this.addGridColumn({dataIndex: 'idproducto'});
        this.addGridColumn({dataIndex: 'idestructura'});
        this.addGridColumn({
            header: this.idioma.cgEntidad,
            autoExpand: true,
            dataIndex: 'entidad',
            default: true
        });
        // The rest of the columns do not change
    },
    render: function(config) {
        var render = Ext.erp.existenciaspublicasdetalles.superclass.render.call(this, config);
        var _this = this;

        // Modify the behavior when loading details
        this.getStorePrincipal().on('beforeload', function(st, options) {
            console.log("Loading details for idindicador:", _this.idindicador);

            // Make sure the parameters are passed correctly
            st.baseParams = st.baseParams || {};
            st.baseParams.idindicador = _this.idindicador;
            st.baseParams.detalles = true;

            // Register parameters for debugging
            console.log("Load parameters:", st.baseParams);
        });

        // Add exception handler
        this.getStorePrincipal().on('loadexception', function(proxy, options, response, error) {
            console.error("Error loading details:", response.responseText);
            Ext.MessageBox.alert('Error', 'Could not load details. Please try again.');
        });

        return render;
    }
});

// We also register the details class
Ext.reg('existenciaspublicasdetalles', Ext.erp.existenciaspublicasdetalles);

// Create an alias to access directly from Ext.erp["existenciaspublicasdetalles"]
if (!Ext.erp["existenciaspublicasdetalles"]) {
    Ext.erp["existenciaspublicasdetalles"] = Ext.erp.existenciaspublicasdetalles;
}

// Definition of the LOG.inv.Recuperaciones.Vista class
Ext.namespace('LOG.inv.Recuperaciones');

LOG.inv.Recuperaciones.Vista = Ext.extend(Ext.Viewport, {
    sufijoTab: 'tab',
    layout: 'border',
    constructor: function(config) {
        var _this = this;
        var idioma = config.idioma;
        /**
         * Navigation tree
         */
        this.treeMenu = new Ext.tree.TreePanel({
            title: idioma.tlPanel,
            region: 'west',
            id: 'idvpnomencladores',
            width: 280,
            minSize: 175,
            maxSize: 500,
            collapsible: true,
            margins: '0 0 0 0',
            cmargins: '0 0 0 0',
            rootVisible: false,
            lines: false,
            autoScroll: true,
            titleCollapse: true,
            root: new Ext.tree.TreeNode({
                text: '',
                draggable: false,
                expanded: true,
                id: '0'
            })
        });

        /**
         * Central panel where the corresponding nomenclatures will be
         * the elements selected in the interface menu
         */
        this.panelContenedor = new Ext.TabPanel({
            region: 'center',
            frame: true,
            minTabWidth: 135,
            tabWidth: 210,
            enableTabScroll: true,
            layoutOnTabChange: true,
            id: 'tabPanelCentral'
        });
        this.items = [_this.treeMenu, _this.panelContenedor];
        LOG.inv.Recuperaciones.Vista.superclass.constructor.call(this, arguments);
    },
    /**
     *
     * @param text        Text that will show the node in the menu tree
     * @param id          Node identifier
     * @param urlController    Address of the controller corresponding to the component
     *                            corresponding to the node Example:
     *                            '/configuracion/nomencladores/index.php/naturaleza/'
     */
    addNodoTree: function (text, id, urlController, deposito, isTemplate) {
        var _this = this;

        this.treeMenu.getRootNode().appendChild(new Ext.tree.TreeNode({
            text: text,
            id: id,
            iconCls: 'historial',
            urlController: urlController,
            deposito: deposito,
            isTemplate: (isTemplate != undefined) ? isTemplate : true,
            listeners: {
                'click': function (nodo, evento) {
                    _this.selectTab(nodo);
                }
            }
        }));
    },
    /**
     * @param nodo Menu element
     */
    selectTab: function (nodo) {
        var _this = this;
        var idTab = this.sufijoTab + nodo.id;
        var neededTab = this.panelContenedor.getItem(idTab);
        if (neededTab) {
            this.panelContenedor.activate(neededTab);
        } else {
            _this.addTab(nodo, idTab);
        }
    },
    /*
     * Creates a component corresponding to a menu item
     *
     * @param nodo      Selected menu item
     * @param idTab     Identifier of the new component to create (sufijoTab + idnodo)
     */
    addTab: function (nodo, idTab) {
        var _this = this;

        try {
            // For all components, use the original method
            var tabContenido = new Ext.erp[nodo.id]({});

            if (nodo.attributes.deposito == true) {
                //tabContenido.attachPlugin(new LOG.lb.plugin.ComboDepositos());
            }

            if (nodo.attributes.isTemplate == true) {
                tabContenido.init();
                var vista = tabContenido.view();
                vista.setTitle(nodo.text);
                vista.id = idTab;
                vista.closable = true;
                _this.panelContenedor.add(vista).show();
            } else {
                tabContenido.setTitle(nodo.text);
                tabContenido.id = idTab;
                tabContenido.closable = true;
                _this.panelContenedor.add(tabContenido).show();
            }

            // If it is existenciaspublicas, load data later
            // if (nodo.id === 'existenciaspublicas' && tabContenido.getStorePrincipal) {
            //     setTimeout(function() {
            //         console.log("Trying to load data...");
            //         var store = tabContenido.getStorePrincipal();
            //         if (store) {
            //             store.load();
            //             console.log("Store loaded");
            //         }
            //     }, 500);
            // }

            _this.doLayout();
        } catch (e) {
            console.error('Error creating the component:', e);
            Ext.MessageBox.alert('Error', 'Could not load the component: ' + nodo.text + '\n' + e.message);
        }
    }
});