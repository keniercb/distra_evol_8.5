Utilidades.Cmp.Cmpgestionararc = function(opcionesConfig) {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.prevrow = -1;
    this.eshija = 0;
    var permisoheredar = 0;

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto CRUD-ARC inicializado
    this.objCrudArc = new Utilidades.Cmp.Cmpcrudarc();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //inicializando el objeto menu dinamico 
    this.objcmpmenurelacionesdin = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();

    //objeto del componente "relaciones"
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();

    //objeto del componente "exportarimportar"
    this.cmpexpimp = new Utilidades.Cmp.Cmpexportarimportar();

    //variables 
    this.start = 0;
    this.opcionBusqueda = 2;
    this.eshija = 0;
    this.arrayidarc = [];
    this.arraynombrearc = [];
    this.arrayidautorarc = [];
    this.arrayautores = [];
    this.arrayinvolucrados = [];
    this.arrayarcseleccionadas = [];
    this.permitirmodificar = 0;
    this.permitireliminar = 0;
    this.permitirrelaciones = 0;
    this.permitiractivar = 0;
    this.permitirdesactivar = 0;

    //botones para la gestion de las arc
    this.menuAdicionar = new Ext.Toolbar.MenuButton({
        tooltip: 'Adicionar Capítulo/ARC',
        iconCls: 'adicionar',
        menu: {
            items: [{
                    text: 'Adicionar Capítulo',
                    handler: function() {
                        if (_this.arrayarcseleccionadas.length == 0) {
                            _this.eshija = 0;
                            _this.objCrudArc.CrearWinCrudArc(
                                    'Adicionar', 1, _this.PostAccionesGestionar,
                                    _this.arrayidarc, null, _this.eshija,
                                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                                    _this.smTGCmpArc, _this.stTGCmpArc);
                        } else if (_this.arrayarcseleccionadas.length == 1) {
                            _this.eshija = 1;
                            _this.objCrudArc.CrearWinCrudArc(
                                    'Adicionar', 1, _this.PostAccionesGestionar,
                                    _this.arrayidarc, _this.arrayidautorarc[0], _this.eshija,
                                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                                    _this.smTGCmpArc, _this.stTGCmpArc);
                        }
                    },
                    disabled: false,
                    id: 'adicionarCapitulo',
                    iconCls: 'adicionar',
                    tooltip: 'Adicionar Capítulo'
                }, {
                    text: 'Adicionar ARC',
                    handler: function() {
                        if (_this.arrayarcseleccionadas.length == 0) {
                            _this.eshija = 0;
                            _this.objCrudArc.CrearWinCrudArc(
                                    'Adicionar', 0, _this.PostAccionesGestionar,
                                    _this.arrayidarc, null, _this.eshija,
                                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                                    _this.smTGCmpArc, _this.stTGCmpArc);
                        } else if (_this.arrayarcseleccionadas.length == 1) {
                            _this.eshija = 1;
                            _this.objCrudArc.CrearWinCrudArc(
                                    'Adicionar', 0, _this.PostAccionesGestionar,
                                    _this.arrayidarc, _this.arrayidautorarc[0], _this.eshija,
                                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                                    _this.smTGCmpArc, _this.stTGCmpArc);
                        }
                    },
                    disabled: false,
                    id: 'adicionarARC',
                    iconCls: 'adicionar',
                    tooltip: 'Adicionar ARC',
                    key: {
                        alt: true,
                        key: 'I'
                    },
                    scope: this
                }
            ]
        }
    });

    this.btnModificar = new Ext.Button({
        handler: function() {
            _this.eshija = 0;
            _this.objCrudArc.CrearWinCrudArc(
                    'Modificar', _this.smTGCmpArc.getSelections()[0].data.escapitulo, _this.PostAccionesGestionar,
                    _this.arrayidarc, _this.arrayidautorarc[0],
                    _this.eshija,
                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                    _this.smTGCmpArc);
        },
        hidden: opcionesConfig.noUsarModificar,
        disabled: true,
        iconCls: 'modificar',
        tooltip: 'Modificar elemento',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });
    this.btnEliminar = new Ext.Button({
        handler: function() {
            _this.eshija = 0;
            _this.objCrudArc.EliminarArc(
                _this.arrayarcseleccionadas[0].escapitulo, _this.arrayidarc, _this.PostAccionesGestionar,
                    _this.smTGCmpArc, _this.TGCmpArc);
        },
        hidden: opcionesConfig.noUsarEliminar,
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar elemento',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    this.btnActivar = new Ext.Button({
        handler: function() {
            _this.eshija = 0;
            _this.objCrudArc.ActivarDesactivarArc(
                _this.arrayarcseleccionadas[0].escapitulo, _this.arrayidarc,
                    _this.PostAccionesGestionar,
                    'activar', _this.smTGCmpArc);
        },
        hidden: opcionesConfig.noUsarActivar,
        disabled: true,
        iconCls: 'habilitar',
        tooltip: 'Activar elemento',
        key: {
            alt: true,
            key: 'X'
        },
        scope: this
    });
    this.btnDesactivar = new Ext.Button({
        handler: function() {
            _this.eshija = 0;
            _this.objCrudArc.ActivarDesactivarArc(
                _this.arrayarcseleccionadas[0].escapitulo, _this.arrayidarc, _this.PostAccionesGestionar,
                    'desactivar', _this.smTGCmpArc);
        },
        hidden: opcionesConfig.noUsarDesactivar,
        disabled: true,
        iconCls: 'deshabilitar',
        tooltip: 'Desactivar elemento',
        key: {
            alt: true,
            key: 'F'
        },
        scope: this
    });

    this.btnVerDatos = new Ext.Button({
        handler: function() {
            _this.eshija = 0;
            _this.objCrudArc.CrearWinCrudArc(
                    'Ver datos del', _this.arrayarcseleccionadas[0].escapitulo, _this.PostAccionesGestionar,
                    _this.arrayidarc, _this.arrayidautorarc[0],
                    _this.eshija,
                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                    _this.smTGCmpArc);
        },
        hidden: opcionesConfig.noUsarVer,
        disabled: true,
        iconCls: 'ver',
        tooltip: 'Ver datos del elemento',
        key: {
            alt: true,
            key: 'D'
        },
        scope: this
    });

    this.btnRelaciones = new Ext.Button({
        disabled: true,
        handler: function() {
            _this.CrearRelaciones();
        },
        iconCls: 'gestionarrelaciones',
        tooltip: 'Relacionar elemento',
        key: {
            ctrl: true,
            key: 'R'
        },
        scope: this
    });
    this.btnPanelBusqueda = new Ext.Button({
        disabled: false,
        iconCls: 'buscaravanzada',
        tooltip: 'B&uacute;squeda avanzada de Capítulos/ARCs',
        handler: function() {
            _this.pBuscarArc.toggleCollapse(true);
            _this.tpAutoresInvolucrados.doLayout();
        },
        key: {
            alt: true,
            key: 'B'
        },
        scope: this
    });
    this.btnPanelTributa = new Ext.Button({
        disabled: false,
        hidden: opcionesConfig.noUsarTributar,
        iconCls: 'tributar',
        tooltip: 'Tributar Capítulos/ARCs',
        handler: function() {
            _this.opcionBusqueda = 1;
            _this.pRelacionesIniciales.toggleCollapse(true);
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'B'
        },
        scope: this
    });
    this.btnLimpiar = new Ext.Button({
        disabled: true,
        handler: function() {
            _this.pBuscarArc.collapse(false);
            _this.objclasificadorinvol.ResetearArbolesBusqueda();
            _this.smTGCmpArc.clearSelections();
            _this.stTGCmpArc.baseParams.arrayautores = '';
            _this.stTGCmpArc.baseParams.arrayinvolucrados = '';
            if (_this.ftCmpARC.getFiltrosActivos() == undefined || _this.ftCmpARC.getFiltrosActivos().length == 0) {
                _this.stTGCmpArc.reload({});
            }
            _this.ftCmpARC.clearFilters();
            _this.objclasificadorinvol.verificarAutoresInvolBusqueda = false;
            _this.btnBusquedaSimple.disable();
            //_this.pBuscarArc.toggleCollapse(true);
        },
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s)',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });

    this.btnExportar = new Ext.Button({
        handler: function() {
            if (_this.smTGCmpArc.getSelected) {
                _this.cmpexpimp.ventanaExportarElemento(_this.TGCmpArc, _this.smTGCmpArc, 5);
            }
        },
        disabled: true,
        iconCls: 'exportar',
        tooltip: 'Exportar Capítulos/ARCs',
        key: {
            alt: true,
            key: 'E'
        },
        scope: this
    });
    this.btnImportar = new Ext.Button({
        handler: function() {
            _this.cmpexpimp.showCmpImportar(5, _this.TGCmpArc, _this.WinPrincipal);
        },
        disabled: false,
        iconCls: 'importar',
        tooltip: 'Importar Capítulos/ARCs',
        key: {
            alt: true,
            ctrl: true,
            key: 'I'
        },
        scope: this
    });

    this.btnBusquedaSimple = new Ext.Button({
        handler: function() {
            if (_this.fpBuscarArc.getForm().isValid()) {
                _this.opcionBusqueda = 1;
                _this.stTGCmpArc.start = 0;
                _this.stTGCmpArc.reload({});
            }
        },
        text: 'Buscar',
        iconCls: 'buscar',
        tooltip: 'Buscar Capítulos/ARCs',
        disabled: true,
    });
    this.btnSeleccionar = new Ext.Button({
        handler: function() {
            _this.RelacionarElementos();
        },
        disabled: true,
        text: 'Seleccionar',
        iconCls: 'seleccion',
        tooltip: 'Relacionar los elementos seleccionadas',
        hidden: opcionesConfig.noUsarSeleccionarWinP,
        key: {
            ctrl: true,
            key: 'R'
        },
        scope: this
    });
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaGestionarARC',
        text: 'Ayuda',
        hidden: opcionesConfig.noUsarAyuda,
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });
    this.btnRefresh = {
        text: 'Actualizar registro de ARC',
        hidden: true,
        handler: function() {
            var paginado = _this.TGCmpArc.getBottomToolbar().items;
            _this.smTGCmpArc.clearSelections();
            paginado.items[0].show();
            paginado.items[1].show();
            paginado.items[2].show();
            paginado.items[3].show();
            paginado.items[4].hide();
            _this.stTGCmpArc.reload();
        },
        iconCls: 'x-btn-text x-tbar-loading',
        key: {
            ctrl: true,
            alt: true,
            key: 'Z'
        }
    };
    //boton para limpiar los filtros
    this.btnLimpiarFiltros = new Ext.Button({
        handler: function() {
            _this.ftCmpARC.clearFilters();
        },
        iconCls: 'limpiar',
        text: 'Limpiar',
        tooltip: 'Limpiar filtro(s)',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    //store del treegrid donde se muestran las arc
    this.stTGCmpArc = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: '/planificacion/pdo/plan/index.php/cmpgestionararc/cargararc',
        autoLoad: true,
        listeners: {
            beforeload: function(st) {
                st.baseParams.idarc = _this.arrayidarc[0];
                st.baseParams.eshija = _this.eshija;
                if (_this.opcionBusqueda != 2) {
                    var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
                    var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
                    st.baseParams.arrayautores = Ext.encode(arrayautores);
                    st.baseParams.arrayinvolucrados = Ext.encode(arrayinvolucrados);
                }
                st.baseParams.activas = opcionesConfig.activas;
            },
            beforeexpandnode: function(store, record) {
            },
            load: function(st) {
                if (_this.TGCmpArc.getStore().getCount() == 0) {
                    var arrayautoresbusq = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
                    var arrayinvolucradosbusq = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
                    if ((_this.ftCmpARC.getFiltrosActivos() == undefined || _this.ftCmpARC.getFiltrosActivos().length == 0)
                            && arrayautoresbusq.length == 0 && arrayinvolucradosbusq.length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.');
                    }
                }
                _this.ActualizarEstadoBarraHerramientas();
                if (_this.smTGCmpArc.hasSelection()) {
                    _this.TGCmpArc.getView().refresh(true);
                }
                _this.changeTitleARC();
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idarea',
            totalProperty: "total",
            root: "campos",
            successProperty: 'success'
        }, [{
                name: 'denom'
            }, {
                name: 'idarc'
            }, {
                name: 'fdesde'
            }, {
                name: 'fhasta'
            }, {
                name: 'activo'
            }, {
                name: 'autor'
            }, {
                name: 'idautor'
            }, {
                name: 'idarea'
            }, {
                name: 'descrip'
            }, {
                name: 'superior'
            }, {
                name: 'mod'
            }, {
                name: 'del'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'escapitulo'
            }, {
                name: 'orden'
            }])
    });

    //modo de del treegrid donde se muestran las arc
    this.smTGCmpArc = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(sm, indiceFila, record) {
                if (_this.prevrow >= 0 && _this.prevrow != indiceFila) {
                    Ext.get(_this.TGCmpArc.getView().getRow(_this.prevrow)).removeClass('superior2');
                    Ext.get(_this.TGCmpArc.getView().getRow(_this.prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.TGCmpArc.getView().getRow(indiceFila)).removeClass('superior');
                    Ext.get(_this.TGCmpArc.getView().getRow(indiceFila)).addClass('superior2');
                    _this.prevrow = indiceFila;
                } else
                    _this.prevrow = -1;
                _this.ActualizarEstadoBarraHerramientas();
            },
            rowdeselect: function(sm, indiceFila, record) {
                if (_this.prevrow >= 0 && _this.prevrow != indiceFila) {
                    Ext.get(_this.TGCmpArc.getView().getRow(_this.prevrow)).removeClass('superior2');
                    Ext.get(_this.TGCmpArc.getView().getRow(_this.prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.TGCmpArc.getView().getRow(indiceFila)).removeClass('superior');
                    Ext.get(_this.TGCmpArc.getView().getRow(indiceFila)).addClass('superior2');
                    _this.prevrow = indiceFila;
                } else
                    _this.prevrow = -1;
                _this.ActualizarEstadoBarraHerramientas();
            }
        }
    });

    //barra de paginado del treegrid donde se muestran las arc
    this.ptbTGCmpArc = new Ext.ux.maximgb.treegrid.PagingToolbar({
        pageSize: 1000,
        store: _this.stTGCmpArc,
        displayInfo: true
    });
    //plugins para los filtros del grid
    this.ftCmpARC = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'idarea',
                xtype: 'numberfield',
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
            }, {
                type: 'string',
                dataIndex: 'denom'
            }, {
                type: 'string',
                dataIndex: 'descrip'
            }, {
                type: 'date',
                dataIndex: 'fdesde'
            }, {
                type: 'date',
                dataIndex: 'fhasta'
            }, {
                type: 'list',
                dataIndex: 'activo',
                options: ['Si', 'No']
            }]
    });
    //treegrid donde se muestran las arc
    this.TGCmpArc = new Ext.ux.maximgb.treegrid.GridPanel({
        id: 'TGCmpArc',
        store: _this.stTGCmpArc,
        plugins: _this.ftCmpARC,
        master_column_id: 'expandir',
        //autoExpandColumn:'expandir',
        autoExpandMin: 165,
        stripeRows: true,
        region: 'center',
        sm: _this.smTGCmpArc,
        viewConfig: {
            forcefit: true
        },
        margins: '3 3 3 3',
        loadMask: {
            msg: 'Cargando &Aacute;reas de Resultados Claves'
        },
        root_title: 'Registro de &Aacute;reas de Resultados Claves',
        columns: [_this.smTGCmpArc,
            {
                header: 'CAR',
                dataIndex: 'idarea',
                width: 80,
                sortable: true
            }, {
                id: 'expandir',
                header: 'Denominaci&oacute;n',
                width: 565,
                renderer: MostrarImagenTipoElemento,
                dataIndex: 'denom',
                sortable: true
            }, {
                header: 'Fecha de inicio ',
                width: 120,
                dataIndex: 'fdesde',
                sortable: true
            }, {
                header: 'Fecha de fin',
                width: 120,
                dataIndex: 'fhasta',
                sortable: true
            }, {
                header: 'Activo',
                width: 60,
                dataIndex: 'activo',
                renderer: MostrarImagenActivo,
                sortable: true
            }, {
                header: 'Autor',
                width: 100,
                dataIndex: 'autor',
                renderer: function(val) {
                    return val;
                },
                sortable: true
            }, {
                header: 'Orden',
                width: 100,
                dataIndex: 'orden',
                sortable: true
            }],
        menuderecho: _this.menuderechoTGCmpARC,
        listeners: {
            rowcontextmenu: function(grid, row, e) {
                e.stopEvent();
                _this.TGCmpArc.getSelectionModel().selectRow(row);
                if (_this.midatos) {
                    _this.midatos.destroy();
                }
                var elemento = ' ARC';
                //menu derecho del grid de arc
                _this.menuderechoTGCmpARC = new Ext.menu.Menu({});
                (_this.miadicionar) ? _this.miadicionar.destroy() : null;
                if (_this.arrayarcseleccionadas.length == 1) {

                    _this.miadicionar = new Ext.menu.Item({
                        text: 'Adicionar ARC',
                        itemCls: 'x-menu-item icondistra-adicionar',
                        iconCls: 'imagen-none',
                        hideOnClick: true,
                        handler: function() {
                            _this.eshija = 1;
                            _this.objCrudArc.CrearWinCrudArc(
                                    'Adicionar', ' ARC', _this.PostAccionesGestionar,
                                    _this.arrayidarc, _this.arrayidautorarc[0],
                                    _this.eshija,
                                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                                    _this.smTGCmpArc, _this.stTGCmpArc);
                        }
                    });

                    _this.menuderechoTGCmpARC.add(_this.miadicionar);

                    if (_this.arrayarcseleccionadas[0].escapitulo == 1) {
                        elemento = ' Capítulo';
                        _this.miadicionarCap = new Ext.menu.Item({
                            text: 'Adicionar Capítulo',
                            itemCls: 'x-menu-item icondistra-adicionar',
                            iconCls: 'imagen-none',
                            hideOnClick: true,
                            handler: function() {
                                _this.eshija = 1;
                                _this.objCrudArc.CrearWinCrudArc(
                                        'Adicionar', ' Capítulo', _this.PostAccionesGestionar,
                                        _this.arrayidarc, _this.arrayidautorarc[0],
                                        _this.eshija,
                                        _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                                        _this.smTGCmpArc, _this.stTGCmpArc);
                            }
                        });
                        _this.menuderechoTGCmpARC.add(_this.miadicionarCap);
                    }
                }
                if (_this.mimodificar) {
                    _this.mimodificar.destroy();
                }
                if (_this.permitirmodificar == 1) {
                    _this.mimodificar = new Ext.menu.Item({
                        //text: 'Modificar ARC',
                        text: _this.setTextdeMenus(_this.smTGCmpArc.getCount(), 'Modificar'),
                        itemCls: 'x-menu-item icondistra-modificar',
                        iconCls: 'imagen-none',
                        handler: function() {
                            _this.eshija = 0;
                            _this.objCrudArc.CrearWinCrudArc(
                                    'Modificar', elemento, _this.PostAccionesGestionar,
                                    _this.arrayidarc, _this.arrayidautorarc[0],
                                    _this.eshija,
                                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                                    _this.smTGCmpArc);
                        }
                    });
                    _this.menuderechoTGCmpARC.add(_this.mimodificar);
                }
                if (_this.mieliminar) {
                    _this.mieliminar.destroy();
                }
                if (_this.permitireliminar == 1) {
                    _this.mieliminar = new Ext.menu.Item({
                        text: _this.setTextdeMenus(_this.smTGCmpArc.getCount(), 'Eliminar'),
                        itemCls: 'x-menu-item icondistra-eliminar',
                        iconCls: 'imagen-none',
                        handler: function() {
                            _this.eshija = 0;
                            _this.objCrudArc.EliminarArc(
                                    elemento,
                                    _this.arrayidarc,
                                    _this.PostAccionesGestionar,
                                    _this.smTGCmpArc, _this.TGCmpArc);
                        }
                    });
                    _this.menuderechoTGCmpARC.add(_this.mieliminar);
                }
                if (_this.midatos) {
                    _this.midatos.destroy();
                }
                if (_this.smTGCmpArc.getCount() == 1) {
                    _this.midatos = new Ext.menu.Item({
                        //text: 'Ver datos del ARC',
                        text: _this.setTextdeMenus(_this.smTGCmpArc.getCount(), 'Ver datos'),
                        itemCls: 'x-menu-item icondistra-ver',
                        iconCls: 'imagen-none',
                        handler: function() {
                            _this.eshija = 0;
                            _this.objCrudArc.CrearWinCrudArc(
                                    'Ver datos del', elemento, _this.PostAccionesGestionar,
                                    _this.arrayidarc, _this.arrayidautorarc[0],
                                    _this.eshija,
                                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                                    _this.smTGCmpArc);
                        }
                    });
                    _this.menuderechoTGCmpARC.add(_this.midatos);
                }
                if (_this.mirelacionar) {
                    _this.mirelacionar.destroy();
                }
                if (_this.permitirrelaciones == 1) {
                    _this.mirelacionar = new Ext.menu.Item({
                        text: _this.setTextdeMenus(_this.smTGCmpArc.getCount(), 'Relacionar'),
                        itemCls: 'x-menu-item icondistra-gestionarrelaciones',
                        iconCls: 'imagen-none',
                        handler: function() {
                            _this.CrearRelaciones();
                        }
                    });
                    _this.menuderechoTGCmpARC.add(_this.mirelacionar);
                }
                if (_this.heredar) {
                    _this.heredar.destroy();
                }
                if (permisoheredar == 1) {
                    _this.heredar = new Ext.menu.Item({
                        text: 'Editar rango de publicidad',
                        itemCls: 'x-menu-item icondistra-asignaroles',
                        iconCls: 'imagen-none',
                        handler: function() {
                            _this.objclasificadorinvol.CrearClasificadorHeredarElementos(
                                    _this.arrayidarc[0], tipoelemento = 5, function() {
                            });
                        }
                    });
                    _this.menuderechoTGCmpARC.add(_this.heredar);
                }
                if (_this.miactivar) {
                    _this.miactivar.destroy();
                }
                if (_this.permitiractivar == 1) {
                    _this.miactivar = new Ext.menu.Item({
                        text: _this.setTextdeMenus(_this.smTGCmpArc.getCount(), 'Activar'),
                        itemCls: 'x-menu-item icondistra-habilitar',
                        iconCls: 'imagen-none',
                        handler: function() {
                            _this.eshija = 0;
                            _this.objCrudArc.ActivarDesactivarArc(
                                    elemento, _this.arrayidarc, _this.PostAccionesGestionar,
                                    'activar', _this.smTGCmpArc);
                        }
                    });
                    _this.menuderechoTGCmpARC.add(_this.miactivar);
                }
                if (_this.midesactivar) {
                    _this.midesactivar.destroy();
                }
                if (_this.permitirdesactivar == 1) {
                    _this.midesactivar = new Ext.menu.Item({
                        text: _this.setTextdeMenus(_this.smTGCmpArc.getCount(), 'Desactivar'),
                        itemCls: 'x-menu-item icondistra-deshabilitar',
                        iconCls: 'imagen-none',
                        handler: function() {
                            _this.eshija = 0;
                            _this.objCrudArc.ActivarDesactivarArc(
                                    elemento, _this.arrayidarc, _this.PostAccionesGestionar,
                                    'desactivar', _this.smTGCmpArc);
                        }
                    });
                    _this.menuderechoTGCmpARC.add(_this.midesactivar);
                }
                var xy = e.getXY();
                _this.menuderechoTGCmpARC.showAt(xy);
            },
            rowdblclick: function() {
                _this.eshija = 0;
                var elemento = ' ARC';
                if (_this.arrayarcseleccionadas[0].escapitulo == 1) {
                    elemento = ' Capítulo';
                }
                if (_this.permitirmodificar) {
                    _this.objCrudArc.CrearWinCrudArc(
                            'Modificar', elemento, _this.PostAccionesGestionar,
                            _this.arrayidarc, _this.arrayidautorarc[0],
                            _this.eshija,
                            _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                            _this.smTGCmpArc);
                } else {
                    _this.objCrudArc.CrearWinCrudArc(
                            'Ver datos del', elemento, _this.PostAccionesGestionar,
                            _this.arrayidarc, _this.arrayidautorarc[0], _this.eshija,
                            _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                            _this.smTGCmpArc);
                }
            }
        },
        bbar: (!opcionesConfig.noUsarPaginado) ? _this.ptbTGCmpArc : null
    });
    _this.setTextdeMenus = function(conteo, accion) {
        var elemento = ' ARC';
        if (_this.arrayarcseleccionadas[0].escapitulo == 1) {
            elemento = ' Capítulo';
        }
        if (accion == 'Exportar') {
            if (conteo == 1) {
                return 'Exportar' + elemento;
            } else
                return 'Exportar';
        } else if (accion == 'Eliminar') {
            if (conteo == 1) {
                return 'Eliminar' + elemento;
            } else
                return 'Eliminar';
        } else if (accion == 'Relacionar') {
            if (conteo == 1) {
                return 'Relacionar' + elemento;
            } else
                return 'Relacionar';
        } else if (accion == 'Activar') {
            if (conteo == 1) {
                return 'Activar' + elemento;
            } else
                return 'Activar';
        } else if (accion == 'Desactivar') {
            if (conteo == 1) {
                return 'Desactivar' + elemento;
            } else
                return 'Desactivar';
        } else if (accion == 'Modificar') {
            if (conteo == 1) {
                return 'Modificar' + elemento;
            } else
                return 'Modificar';
        } else if (accion == 'Ver datos') {
            if (conteo == 1) {
                return 'Ver datos del ' + elemento;
            } else
                return 'Ver datos del ARCs';
        }
    };
    _this.TGCmpArc.getView().getRowClass = function(ri, n) {
        if (ri.data.superior == 1)
            return "superior";
        else
            return "";
    };

    this.tpAutoresInvolucrados = _this.objclasificadorinvol.CrearClasificadorInvolBusqueda(tipoelemento = 5, 2);

    this.fpBuscarArc = new Ext.form.FormPanel({
        frame: true,
        layout: 'fit',
        items: [_this.tpAutoresInvolucrados],
        buttons: [_this.btnBusquedaSimple],
        listeners: {
            clientvalidation: function(form, valid) {
                (_this.objclasificadorinvol.verificarAutoresInvolBusqueda) ? _this.btnBusquedaSimple.enable() : _this.btnBusquedaSimple.disable();
            }
        }

    });

    //panel donde se muestran las opciones de busqueda de planes
    this.pBuscarArc = new Ext.Panel({
        title: 'Opciones de b&uacute;squeda',
        layout: 'fit',
        width: 300,
        collapsible: true,
        collapsed: true,
        margins: '3 3 3 3',
        region: 'east',
        usarKeymap: true,
        botonesKeymap: [_this.btnBusquedaSimple],
        items: [_this.fpBuscarArc],
        //buttons: [_this.btnBusquedaSimple],
        listeners: {
            expand: function(p) {
                p.doLayout();
            }
        }
    });

    this.pRelacionesIniciales = _this.objcmprelaciones.CrearCmpRelacionesIniciales(5, function() {
        _this.stTGCmpArc.reload({
            params: {
                arrayelementosrelacionados: Ext.encode(_this.objcmprelaciones.ObtenerElementosRelacionadosIniciales())
            }
        });
    }, true);

    //panel principal de la vista
    this.PanPrincipal = new Ext.Panel({
        layout: 'border',
        region: 'center',
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar,
            _this.btnActivar, _this.btnDesactivar, _this.btnVerDatos, _this.btnRelaciones, _this.btnPanelTributa,
            _this.btnPanelBusqueda, _this.btnLimpiar, _this.btnAyuda],
        tbar: [_this.menuAdicionar, ' ', _this.btnModificar, ' ', _this.btnEliminar, ' ', _this.btnActivar, ' ',
            _this.btnDesactivar, ' ', _this.btnVerDatos, ' ', _this.btnRelaciones, ' ', /*_this.btnExportar,_this.btnImportar,*/
            _this.btnPanelTributa, ' ', _this.btnPanelBusqueda, ' ', _this.btnLimpiar, '->', _this.btnAyuda],
        items: [_this.TGCmpArc, _this.pBuscarArc]
    });

    //ventana principal de la vista
    this.WinPrincipal = new Ext.Window({
        // title: 'Registro de &Aacute;reas de Resultados Claves',
        layout: 'border',
        closable: false,
        graggable: false,
        maximized: opcionesConfig.maxWinPrincipal,
        noTitle: opcionesConfig.maxWinPrincipal,
        modal: true,
        width: 1000,
        height: 510,
        items: [_this.PanPrincipal, _this.pRelacionesIniciales],
        buttons: [
            {
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                hidden: opcionesConfig.noUsarCerrarWinP,
                iconCls: 'cerrar',
                handler: function() {
                    _this.WinPrincipal.hide();
                }
            },
            _this.btnSeleccionar
        ]
    });

    //funcion donde se procede a cargar el treegrid con las arc
    this.CargarArc = function() {
        denom = _this.tfdenominacionBS.getValue();
        fdesde = Ext.encode(_this.fechaInicioBS.getValue());
        fhasta = Ext.encode(_this.fechaFinBS.getValue());
        car = _this.tfCAR.getValue();
        _this.arrayidarc = [];
        if (_this.opcionBusqueda == 1) {
            var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
            var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
            if (_this.tfdenominacionBS.getValue() != ''
                    || _this.fechaInicioBS.getValue() != ''
                    || _this.fechaFinBS.getValue() != ''
                    || _this.tfCAR.getValue() != ''
                    || arrayautores.length > 0
                    || arrayinvolucrados.length > 0) {
                _this.stTGCmpArc.removeAll();
                _this.stTGCmpArc.reload({
                    callback: function() {
                        if (_this.stTGCmpArc.getTotalCount() == 0) {
                            mostrarMensaje(1, 'No existen elementos para el criterio de b&uacute;squeda definido.', function() {
                                _this.opcionBusqueda = 2;
                                _this.CargarArc();
                            });
                            _this.pBuscarArc.collapse(true);
                        }
                    }
                });
            } else {
                mostrarMensaje(1, "Introduzca un criterio de b&uacute;squeda.");
                return;
            }
        }
        if (_this.opcionBusqueda == 2) {
            _this.tfdenominacionBS.reset();
            _this.fechaInicioBS.reset();
            _this.fechaFinBS.reset();
            _this.tfCAR.reset();
            _this.objclasificadorinvol.ResetearArbolesBusqueda();
            _this.stTGCmpArc.reload({});
        }
        if (_this.opcionBusqueda != 2) {
            _this.opcionBusqueda = 2;
        }
    };

    //funcion donde se procede a cargar la plantilla
    this.CargarCmpArc = function(idelementopadre, tipoelementopadre) {
        _this.idelementopadre = idelementopadre;
        _this.tipoelementopadre = tipoelementopadre;
        _this.WinPrincipal.show();
    };

    //funcion donde se procede a cargar la plantilla para relaciones ternarias
    this.CargarCmpArcRelacionesTernarias = function(idelemento, tipoelemento, parentelemento) {
        _this.idelementohijo = idelemento;
        _this.tipoelementohijo = tipoelemento;
        if (parentelemento == 'padre') {
            _this.idelementopadre = idelemento;
            _this.tipoelementopadre = tipoelemento;
        }
        //panel principal de la vista para relaciones ternarias
        if (!this.PanPrincipal2) {
            this.PanPrincipal2 = _this.PanPrincipal.cloneConfig({
                title: 'Registro de &Aacute;reas de Resultados Claves',
                layout: 'border',
                //region: 'east',
                anchor: '100%',
                //autoHeight: true,
                //width: 750,
                height: 700,
                items: [_this.TGCmpArc, _this.pBuscarArc]
            });
            if (!opcionesConfig.noUsarPaginado) {
                _this.TGCmpArc.getBottomToolbar()[2] = 'Resultados por p&aacute;gina :';
            }
            if (opcionesConfig.noUsarActivar && opcionesConfig.noUsarDesactivar) {
                _this.PanPrincipal2.getTopToolbar()[9] = '';
            } else {
                _this.PanPrincipal2.getTopToolbar()[9] = '-';
            }
        }
        return _this.PanPrincipal2;
    };

    //funcion donde se procede a disparar post-aciones luego de adicionar/modificar/eliminar
    this.PostAccionesGestionar = function(mensaje, accion) {
        switch (mensaje) {
            case 0:
                _this.stTGCmpArc.reload({
                    params: {
                        anode: null
                    }
                });
                break;
            case 1:
                if (_this.eshija == 1) {
                    var rec = _this.stTGCmpArc.getById(_this.arrayidarc[0]);
                    if (rec.data._is_leaf == true && rec.data._parent == null) {
                        var start = (_this.ptbTGCmpArc.getPageData().activePage - 1) * (_this.ptbTGCmpArc.cbPageSize.getValue());
                        _this.stTGCmpArc.reload({
                            params: {
                                anode: null,
                                start: start
                            }
                        });
                    }
                    if (rec.data._is_leaf == true && rec.data._parent != null) {
                        var recparent = _this.stTGCmpArc.getById(rec.data._parent);
                        _this.arrayidarc[0] = rec.data._parent;
                        _this.stTGCmpArc.collapseNode(recparent);
                        _this.stTGCmpArc.setNodeLoaded(recparent, false);
                        _this.stTGCmpArc.expandNode(recparent);
                    }
                    if (rec.data._is_leaf == false) {
                        _this.stTGCmpArc.collapseNode(rec);
                        _this.stTGCmpArc.setNodeLoaded(rec, false);
                        _this.stTGCmpArc.expandNode(rec);
                    }
                } else {
                    var rec = _this.stTGCmpArc.getById(_this.arrayidarc[0]);
                    if (accion == 'Adicionar') {
                        _this.stTGCmpArc.reload({
                            params: {
                                anode: null,
                                start: _this.ptbTGCmpArc.getLastStart()
                            }
                        });
                    }
                    if ((accion == 'Modificar' || accion == 'DesAct' || accion == 'Act')
                            && rec.data._parent != null) {
                        var recparent = _this.stTGCmpArc.getById(rec.data._parent);
                        _this.arrayidarc[0] = recparent.data._parent;
                        _this.stTGCmpArc.collapseNode(recparent);
                        _this.stTGCmpArc.setNodeLoaded(recparent, false);
                        _this.stTGCmpArc.expandNode(recparent);
                    }
                    if ((accion == 'Modificar' || accion == 'DesAct' || accion == 'Act')
                            && rec.data._parent == null) {
                        _this.stTGCmpArc.reload({
                            params: {
                                anode: null,
                                start: _this.start
                            }
                        });
                    }
                    if (accion == 'Eliminar' && rec.data._parent != null) {
                        var recparent = _this.stTGCmpArc.getById(rec.data._parent);
                        var totalnodoshijos = _this.stTGCmpArc.getNodeChildrenTotalCount(recparent);
                        if (totalnodoshijos == 1) {
                            if (recparent.data._parent != null) {
                                var recabuparent = _this.stTGCmpArc.getById(recparent.data._parent);
                                _this.arrayidarc[0] = recabuparent.data.idarea;
                                _this.stTGCmpArc.collapseNode(recabuparent);
                                _this.stTGCmpArc.setNodeLoaded(recabuparent, false);
                                _this.stTGCmpArc.expandNode(recabuparent);
                            } else {
                                _this.stTGCmpArc.reload({
                                    params: {
                                        anode: null,
                                        start: _this.start
                                    }
                                });
                            }
                        } else {
                            _this.arrayidarc[0] = recparent.data._parent;
                            _this.stTGCmpArc.collapseNode(recparent);
                            _this.stTGCmpArc.setNodeLoaded(recparent, false);
                            _this.stTGCmpArc.expandNode(recparent);
                        }
                    }
                    if (accion == 'Eliminar' && rec.data._parent == null) {
                        _this.smTGCmpArc.clearSelections();
                        _this.stTGCmpArc.reload({
                            params: {
                                anode: null,
                                start: _this.start
                            }
                        });
                    }
                }
                break;
            default:
                _this.stTGCmpArc.reload({
                    params: {
                        anode: null,
                        start: _this.start
                    }
                });
        }
        _this.objCrudArc.objcmprelaciones.arrayelementosrelacionados = [];
    };

    //funcion donde se procede a activar o desactivar los botones de la barra de herramientas
    this.ActualizarEstadoBarraHerramientas = function() {
        _this.arrayarcseleccionadas = [];
        _this.arrayidautorarc = [];
        _this.arrayidarc = [];
        _this.arraynombrearc = [];
        _this.btnModificar.disable();
        _this.btnVerDatos.disable();
        _this.btnSeleccionar.disable();
        _this.btnExportar.disable();
        _this.btnEliminar.disable();
        _this.btnActivar.disable();
        _this.btnDesactivar.disable();
        _this.btnRelaciones.disable();
        _this.permitirmodificar = 0;
        _this.permitireliminar = 0;
        _this.permitirrelaciones = 0;
        _this.permitiractivar = 0;
        _this.permitirdesactivar = 0;
        permisoheredar = 0;
        var todosnivelsup = 1;
        if (_this.smTGCmpArc.hasSelection()) {
            _this.btnExportar.enable();
            var arrayrecords = _this.smTGCmpArc.getSelections();
            var totalrecords = arrayrecords.length;
            (totalrecords <= 1) ? _this.menuAdicionar.enable() : _this.menuAdicionar.disable();
            if (totalrecords > 0) {
                var puedemodificar = 1;
                var puedeeliminar = 1;
                var todosdesactivados = 0;
                var todosactivados = 1;
                for (var i = 0; i < arrayrecords.length; i++) {
                    if (arrayrecords[i].data.superior == 0) {
                        todosnivelsup = 0;
                    }
                    if (arrayrecords[i].data.mod == 0) {
                        puedemodificar = 0;
                    }
                    if (arrayrecords[i].data.del == 0) {
                        puedeeliminar = 0;
                    }
                    if (arrayrecords[i].data.activo == 1) {
                        todosdesactivados = 1;
                    }
                    if (arrayrecords[i].data.activo == 0) {
                        todosactivados = 0;
                    }
                    _this.arrayidarc[i] = arrayrecords[i].data.idarea;
                    _this.arraynombrearc[i] = arrayrecords[i].data.denom;
                    _this.arrayidautorarc[i] = arrayrecords[i].data.idautor;
                    var arcseleccionada = {};
                    arcseleccionada = {
                        idelemento: arrayrecords[i].data.idarea,
                        denominacion: arrayrecords[i].data.denom,
                        tipoelemento: 5,
                        autorelemento: arrayrecords[i].data.autor,
                        idautorelemento: arrayrecords[i].data.idautor,
                        _parent: arrayrecords[i].data._parent,
                        escapitulo: arrayrecords[i].data.escapitulo,
                        _is_leaf: arrayrecords[i].data._is_leaf
                    };
                    _this.arrayarcseleccionadas.push(arcseleccionada);
                }
                _this.btnRelaciones.enable();
                _this.permitirrelaciones = 1;
                if (puedemodificar == 1 && totalrecords == 1) {
                    _this.btnModificar.enable();
                    _this.permitirmodificar = 1;
                }
                if (puedeeliminar == 1) {
                    _this.btnEliminar.enable();
                    _this.permitireliminar = 1;
                }
                if (todosdesactivados == 0) {
                    _this.btnActivar.enable();
                    _this.permitiractivar = 1;
                }
                if (todosactivados == 1) {
                    _this.btnDesactivar.enable();
                    _this.permitirdesactivar = 1;
                }
                if (totalrecords > 0) {
                    _this.btnSeleccionar.enable();
                }
                if (totalrecords == 1) {
                    if (todosnivelsup == 1) {
                        permisoheredar = 1;
                    }
                    _this.btnVerDatos.enable();

                    if (arrayrecords[0].data.escapitulo == 0) {
                        Ext.getCmp('adicionarCapitulo').disable();
                    } else {
                        Ext.getCmp('adicionarCapitulo').enable();
                    }
                }
            }
        }else{
            Ext.getCmp('adicionarCapitulo').enable();
        }
        var arrayautoresbusq = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
        var arrayinvolucradosbusq = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
        if ((_this.ftCmpARC.getFiltrosActivos() == undefined || _this.ftCmpARC.getFiltrosActivos().length == 0)
                && arrayautoresbusq.length == 0 && arrayinvolucradosbusq.length == 0) {
            _this.btnLimpiar.disable()
        } else
            _this.btnLimpiar.enable();
    };

    //funcion a ejecutarse para relacionar el o los planes seleccionados con otros elementos
    this.RelacionarElementos = function() {
        _this.BarraProgreso.show('Relacionando ARC');
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionararc/relacionararc',
            params: {
                arrayidarc: Ext.encode(arrayidarc),
                idelementopadre: _this.idelementopadre,
                tipoelementopadre: _this.tipoelementopadre
            },
            callback: function(options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    var mensajeconfirmacion = '';
                    if (arrayidarc.length > 1)
                        mensajeconfirmacion = 'Las &aacute;reas han sido relacionadas satisfactoriamente.';
                    else
                        mensajeconfirmacion = 'El &aacute;rea ha sido relacionada satisfactoriamente.';
                    mostrarMensaje(1, mensajeconfirmacion);
                    _this.WinPrincipal.hide();
                }
                if (responseData.mensaje == 3) {
                    mostrarMensaje(1, 'El &aacute;rea que usted quiere relacionar ya no se encuentra en los registros.', function() {
                        _this.WinPrincipal.hide();
                    });
                }
            }
        });
    };

    this.DestruirWinRelacionesMultiples = function() {
        _this.WinRelacionesMultiples.destroy();
    };

    this.CrearRelaciones = function() {
        if (_this.arrayidarc.length == 1) {
            _this.eshija = 0;
            _this.objCrudArc.CrearWinCrudArc('Relacionar elementos al', _this.arrayarcseleccionadas[0].escapitulo, _this.PostAccionesGestionar, _this.arrayidarc, _this.arrayidautorarc[0], _this.eshija, _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(), _this.smTGCmpArc);
        }
        if (_this.arrayidarc.length > 1) {
            if (_this.WinRelacionesMultiples) {
                _this.WinRelacionesMultiples.destroy
            }
            _this.WinRelacionesMultiples = _this.objcmprelaciones.CrearCmpRelacionesMultiples(5, _this.arrayidarc, function() {
            }, _this.DestruirWinRelacionesMultiples);
            _this.WinRelacionesMultiples.show();
        }
    };

    //funcion para mostrar el icono "activo"
    function MostrarImagenActivo(valor) {
        if (valor == 0) {
            //return '<center><span><img src="../../../comun/recursos/images/fam/desactivo.png" ></span></center>';
            return '<center><span class="icondistra-jabber sipac-grisclaro"></span></center>';
        }
        else {
            // return '<center><span><img src="../../../comun/recursos/images/fam/activo.png" ></span></center>';
            return '<center><span class="icondistra-jabber sipac-amarilla"></span></center>';
        }
    }

    //funcion para mostrar el icono "tipo de elemento"
    function MostrarImagenTipoElemento(val, m, p) {
        if (val) {
            m.attr = 'ext:qtip="<b>' + val + '</b>"';
            //return '<span><img src="../../../comun/recursos/images/fam/arc_ejec.png" >' + ' ' + val + '</span>';
            //return '<span class="icondistra-gestionardocumentosporsubsistema sipac-azul">' + ' ' + val + '</span>';
            if (p.data.escapitulo == 1) {
                return '<span class="icondistra-gestionardocumentosporsubsistema sipac-naranja">' + ' ' + val + '</span>';
            } else {
                return '<span class="icondistra-gestionardocumentosporsubsistema sipac-azul">' + ' ' + val + '</span>';
            }

        } else {
            return val;
        }
    }

    //funcion para mostrar el icono "estado de cumplimiento"
    function renderFecha(val) {
        if (val) {
            return (val.substring(8, 10) + ' / ' + val.substring(5, 7) + ' / ' + val.substring(0, 4));
        }
    }

    function MostrarImagenT(val) {
        if (val == 0) {
            return ' ';
        }
        if (val > 0) {
            return '<center><span class="icondistra-validaryaceptar sipac-verde"></span></center>';
        }
    }

    //funcion para cambiarle el titulo al grid de ARC cuando filtre    
    this.changeTitleARC = function() {
        var filtrado_por = "";
        var sep = "/";
        if (_this.ftCmpARC.getFiltrosActivos() == undefined || _this.ftCmpARC.getFiltrosActivos().length == 0) {
            //_this.WinPrincipal.setTitle('Registro de &Aacute;reas de Resultados Claves');
        } else {
            for (i = 0; i < _this.ftCmpARC.getFiltrosActivos().length; i++) {
                var aux = "";
                if (_this.ftCmpARC.getFiltrosActivos()[i].dataIndex == "denom") {
                    aux = 'Denominaci&oacute;n';
                } else if (_this.ftCmpARC.getFiltrosActivos()[i].dataIndex == "idarea") {
                    aux = 'CAR';
                } else if (_this.ftCmpARC.getFiltrosActivos()[i].dataIndex == "fdesde") {
                    aux = 'Fecha de inicio';
                } else if (_this.ftCmpARC.getFiltrosActivos()[i].dataIndex == "fhasta") {
                    aux = 'Fecha fin';
                } else if (_this.ftCmpARC.getFiltrosActivos()[i].dataIndex == "activo") {
                    aux = 'Activo';
                } else {
                    aux = 'Autor';
                }
                if (i == _this.ftCmpARC.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += aux + sep;
            }
            //_this.WinPrincipal.setTitle('Registro de &Aacute;reas de Resultados Claves <i>- Filtrado por: ' + filtrado_por + '</i>');
            filtrado_por = "";
        }
    }

};
