Utilidades.Cmp.Cmphistorial = function (opciones) {
    var _this = this;
    this.BarraProgreso = new BarraEstado();
    var pgactual = 0;
    //ayuda del sistema
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudHistorial',
        text: 'Ayuda',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });
    this.btnPlanes = new Ext.Button({
        id: 'btnPlanes',
        iconCls: 'folder',
        tooltip: 'Consultar historial de planes',
        handler: function () {
            onClickPlanes();
        },
        /*key: {
         alt: true ,
         key: 'H'
         },*/
        scope: this
    });
    this.btnActividades = new Ext.Button({
        id: 'btnActividades',
        iconCls: 'actividades',
        tooltip: 'Consultar historial de actividades',
        handler: function () {
            onClickActividades();
        },
        /*key: {
         alt: true ,
         key: 'H'
         },*/
        scope: this
    });
    this.btnObjetivos = new Ext.Button({
        id: 'btnObjetivos',
        iconCls: 'archivo',
        tooltip: 'Consultar historial de objetivos',
        handler: function () {
            onClickObjetivos();
        },
        /*key: {
         alt: true ,
         key: 'H'
         },*/
        scope: this
    });
    this.btnFIP = new Ext.Button({
        id: 'btnFIP',
        iconCls: 'ficha',
        tooltip: 'Consultar historial de FIP',
        handler: function () {
            onClickFIP();
        },
        /*key: {
         alt: true ,
         key: 'H'
         },*/
        scope: this
    });

    //************ INTERFAZ DE PLANES ******************
    this.btnVerDetallesPlanes = new Ext.Button({
        disabled: true,
        iconCls: 'ver',
        id: 'id_btnVerDetallesPlanes',
        netxTab: 'btnVersionActual',
        prevTab: 'btnCerrarWinVerHistorial', //aqui va el id del btn cerrar
        tooltip: 'Ver detalles del historial',
        handler: function () {
            _this.VerDetalles(_this.smPlanes);
        },
        key: {
            alt: true,
            key: 'D'
        },
        scope: this
    });
    this.btnVersionActual = new Ext.Button({
        disabled: true,
        id: 'btnVersionActual',
        netxTab: 'id_btnVersionAnterior',
        prevTab: 'id_btnVerDetallesPlanes',
        iconCls: 'icondistra-comparar sipac-verde',
        tooltip: 'Comparar con versión actual',
        handler: function () {
            _this.CompararActualPlan();
        },
        key: {
            ctrl: true,
            key: 'C'
        },
        scope: this
    });
    this.btnVersionAnterior = new Ext.Button({
        disabled: true,
        id: 'id_btnVersionAnterior',
        netxTab: 'btnEliminarPlanes',
        prevTab: 'btnVersionActual',
        iconCls: 'icondistra-comparar',
        tooltip: 'Comparar con versión anterior',
        handler: function () {
            _this.CompararAnterior(_this.smPlanes);
        },
        key: {
            shift: true,
            key: 'C'
        },
        scope: this
    });
    this.btnEliminarPlanes = new Ext.Button({
        disabled: true,
        iconCls: 'eliminar',
        id: 'btnEliminarPlanes',
        prevTab: 'id_btnVersionAnterior',
        nextTab: 'btnLimpiarPlanes',
        tooltip: 'Eliminar historial(es)',
        handler: function () {
            _this.EliminarPlanes();
        },
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    this.btnLimpiarPlanes = new Ext.Button({
        disabled: true,
        id: 'btnLimpiarPlanes',
        prevTab: 'btnEliminarPlanes',
        nextTab: 'btnCerrarWinVerHistorial',
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar',
        handler: function () {
            _this.filtrosPlanes.clearFilters();
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    this.filtrosPlanes = new Ext.grid.GridFilters({
        filters: [{
            type: 'string_adaptado',
            dataIndex: 'car',
            xtype: 'numberfield',
            maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
            maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
        }, {
            type: 'string',
            dataIndex: 'denominacion'
        }, {
            type: 'list',
            dataIndex: 'accion',
            options: ['Creado', 'Modificado', 'Eliminado', 'Cambiado de estado', 'Alarma']
        }, {
            type: 'date',
            dataIndex: 'fecha'
        }]
    });
    this.stPlanes = new Ext.data.GroupingStore({
        autoLoad: false,
        remoteSort: true,
        url: '/planificacion/pdo/plan/index.php/cmphistorial/listarPlanes',
        listeners: {
            beforeload: function (s) {
                _this.BarraProgreso.show('Cargando historial de planes');
                s.baseParams.start = pgactual;
            },
            load: function (st) {
                _this.gdPlanes.getColumnModel().setColumnHeader(0, '');
                _this.gdPlanes.getColumnModel().setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                _this.BarraProgreso.hide();
                if (_this.smPlanes.getSelected() == undefined) {
                    _this.btnVersionAnterior.disable();
                    _this.btnVersionActual.disable();
                    _this.btnVerDetallesPlanes.disable();
                    _this.btnEliminarPlanes.disable();
                }
                if (st.getCount() == 0) {
                    if (pgactual != 0) {
                        pgactual = 0;
                        st.reload();
                    } else {
                        if (_this.filtrosPlanes.getFiltrosActivos() == undefined || _this.filtrosPlanes.getFiltrosActivos().length == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                            _this.btnLimpiarPlanes.disable();
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                            _this.btnLimpiarPlanes.enable();
                        }
                    }
                } else {
                    if (_this.filtrosPlanes.getFiltrosActivos() == undefined || _this.filtrosPlanes.getFiltrosActivos().length == 0) {
                        _this.btnLimpiarPlanes.disable();
                    } else {
                        _this.btnLimpiarPlanes.enable();
                    }
                }
                _this.changeTitle(_this.filtrosPlanes, st, _this.PanelPlanesCentro, 'Historial de planes');
            }
        },
        reader: new Ext.data.JsonReader({
                id: 'id',
                root: 'data',
                totalProperty: 'total'
            },
            [{
                name: 'idhistorial'
            }, {
                name: 'idtipoelemento'
            }, {
                name: 'car'
            }, {
                name: 'denominacion'
            }, {
                name: 'accion'
            }, {
                name: 'gradocumplimiento'
            }, {
                name: 'descelemento'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'autor'
            }, {
                name: 'fecha'
            }]
        ),
        sortInfo: {
            field: 'idhistorial',
            direction: "ASC"
        },
        groupField: 'car'
    });
    this.smPlanes = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, ri, record) {
                if (sm.getSelections().length == 1) {
                    _this.btnVersionAnterior.enable();
                    _this.btnVersionActual.enable();
                    _this.btnVerDetallesPlanes.enable();
                    _this.btnEliminarPlanes.enable();
                } else if (sm.getSelections().length > 1) {
                    _this.btnVersionAnterior.disable();
                    _this.btnVersionActual.disable();
                    _this.btnVerDetallesPlanes.disable();
                }
            },
            rowdeselect: function (sm, ri, record) {
                _this.gdPlanes.getColumnModel().setColumnHeader(0, '');
                _this.gdPlanes.getColumnModel().setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                if (sm.getSelections().length == 0) {
                    _this.btnVersionAnterior.disable();
                    _this.btnVersionActual.disable();
                    _this.btnVerDetallesPlanes.disable();
                    _this.btnEliminarPlanes.disable();
                } else if (sm.getSelections().length == 1) {
                    _this.btnVersionAnterior.enable();
                    _this.btnVersionActual.enable();
                    _this.btnVerDetallesPlanes.enable();
                }
            }
        }
    });
    this.cmPlanes = [
        _this.smPlanes,
        {
            header: "CAR",
            width: 50,
            sortable: true,
            dataIndex: 'car',
            tooltip: 'Código de Acceso Rápido'
        }, {
            id: 'expandir',
            header: "Denominación",
            sortable: true,
            dataIndex: 'denominacion',
            tooltip: 'Denominaci&oacute;n',
            renderer: MostrarImagenPlan
        }, {
            header: "Acción",
            width: 50,
            dataIndex: 'accion',
            tooltip: 'Acción',
            sortable: true,
            renderer: MostrarImagenAccion
        }, {
            header: "Autor",
            tooltip: 'Autor',
            width: 50,
            dataIndex: 'autor',
            sortable: true
        }, {
            header: "Fecha",
            tooltip: 'Fecha',
            width: 50,
            dataIndex: 'fecha',
            sortable: true
        }
    ];
    this.paginadoPlanes = new Ext.PagingToolbar({
        id: "paginadoPlanes",
        pageSize: 1000,
        store: _this.stPlanes,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                pgactual = evento.start;
            }
        }
    });
    this.gdPlanes = new Ext.grid.GridPanel({
        id: 'gdPlanes',
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        plugins: _this.filtrosPlanes,
        autoExpandColumn: 'expandir',
        store: _this.stPlanes,
        sm: _this.smPlanes,
        columns: _this.cmPlanes,
        view: new Ext.grid.GroupingView({
            forceFit: true,
            groupTextTpl: '<center>{text} ({[values.rs.length]} {[values.rs.length > 1 ? "acciones ejecutadas" : "acción ejecutada"]})</center>'
        }),
        bbar: _this.paginadoPlanes,
        loadMask: {
            msg: 'Cargando historial...'
        },
        listeners: {
            rowcontextmenu: function (t, ri, event) {
                _this.smPlanes.selectRow(ri);
                var menunom = new Ext.menu.Menu({
                    id: 'menunom',
                    items: [{
                        text: 'Ver detalles del historial',
                        itemCls: 'x-menu-item icondistra-ver',
                        iconCls: 'imagen-none',
                        tooltip: 'Ver detalles del historial',
                        handler: function () {
                            _this.VerDetalles(_this.smPlanes);
                        }
                    }, {
                        text: 'Comparar con versión actual',
                        itemCls: 'x-menu-item icondistra-comparar sipac-verde',
                        iconCls: 'imagen-none',
                        tooltip: 'Comparar con versión actual',
                        handler: function () {
                            _this.CompararActualPlan();
                        }
                    }, {
                        text: 'Comparar con versión anterior',
                        itemCls: 'x-menu-item icondistra-comparar',
                        iconCls: 'imagen-none',
                        tooltip: 'Comparar con versión anterior',
                        handler: function () {
                            _this.CompararAnterior(_this.smPlanes);
                        }
                    }/*, {
                        text: 'Eliminar historial',
                        itemCls: 'x-menu-item icondistra-eliminar',
                        iconCls: 'imagen-none',
                        tooltip: 'Eliminar historial',
                        handler: function () {
                            _this.EliminarPlanes();
                        }
                    }*/]
                });
                //*** Mostrar menu ***
                if (_this.smPlanes.getSelections().length == 1) {
                    event.stopEvent();
                    var xy = event.getXY();
                    _this.gdPlanes.contextMenu = menunom;
                    _this.gdPlanes.contextMenu.showAt(xy);
                }
            },
            rowdblclick: function (t, ri, event) {
                _this.VerDetalles(_this.smPlanes);
            }
        }
    });
    _this.gdPlanes.getView().getRowClass = function (ri, n) {
        if (ri.data.idhistorial == opciones.idhistorial)
            return "superior";
        else
            return "";
    };
    this.PanelPlanesCentro = new Ext.Panel({
        layout: 'fit',
        tbar: [_this.btnVerDetallesPlanes, ' ', _this.btnVersionActual, ' ',
            _this.btnVersionAnterior, ' ', /*_this.btnEliminarPlanes, ' ',*/
            _this.btnLimpiarPlanes],
        usarKeymap: true,
        botonesKeymap: [
            _this.btnVerDetallesPlanes, _this.btnVersionActual, _this.btnVersionAnterior, _this.btnEliminarPlanes,
            _this.btnLimpiarPlanes],
        id: 'PanelPlanesCentro',
        title: (opciones.mostrarVentana) ? 'Historial de planes' : '',
        items: _this.gdPlanes
    });

    //*************** INTERFAZ DE ACTIVIDADES *******************
    this.btnVerDetallesActividades = new Ext.Button({
        disabled: true,
        iconCls: 'ver',
        tooltip: 'Ver detalles del historial',
        handler: function () {
            _this.VerDetalles(_this.smActividades);
        },
        key: {
            alt: true,
            key: 'D'
        },
        scope: this
    });
    this.btnEliminarActividades = new Ext.Button({
        tooltip: 'Eliminar historial(es)',
        iconCls: 'eliminar',
        handler: function () {
            _this.EliminarActividades();
        },
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    this.btnLimpiarActividades = new Ext.Button({
        text: '',
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar',
        handler: function () {
            _this.filtrosActividades.clearFilters();
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this

    });
    this.btnVersionActualAct = new Ext.Button({
        disabled: true,
        id: 'btnVersionActualAct',
        iconCls: 'icondistra-comparar sipac-verde',
        tooltip: 'Comparar con versión actual',
        handler: function () {
            _this.CompararActualAct();
        },
        key: {
            ctrl: true,
            key: 'C'
        },
        scope: this
    });
    this.btnVersionAnteriorAct = new Ext.Button({
        disabled: true,
        id: 'btnVersionAnteriorAct',
        iconCls: 'icondistra-comparar',
        tooltip: 'Comparar con versión anterior',
        handler: function () {
            _this.CompararAnterior(_this.smActividades);
        },
        key: {
            shift: true,
            key: 'C'
        },
        scope: this
    });

    this.filtrosActividades = new Ext.grid.GridFilters({
        filters: [{
            type: 'string_adaptado',
            dataIndex: 'car',
            xtype: 'numberfield',
            maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
            maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
        }, {
            type: 'string',
            dataIndex: 'denominacion'
        }, {
            type: 'list',
            dataIndex: 'accion',
            options: ['Creado', 'Modificado', 'Eliminado', 'Cambiado de estado']
        }, {
            type: 'date',
            dataIndex: 'fecha'
        }]
    });
    this.stActividades = new Ext.data.GroupingStore({
        remoteSort: true,
        url: '/planificacion/pdo/plan/index.php/cmphistorial/listarActividades',
        reader: new Ext.data.JsonReader({
                id: 'id',
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'idhistorial'
            }, {
                name: 'idtipoelemento'
            }, {
                name: 'car'
            }, {
                name: 'denominacion'
            }, {
                name: 'accion'
            }, {
                name: 'autor'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'horainicio'
            }, {
                name: 'horafin'
            }, {
                name: 'descelemento'
            }, {
                name: 'gradocumplimiento'
            }, {
                name: 'participante'
            }, {
                name: 'dirigente'
            }, {
                name: 'involucrados'
            }, {
                name: 'fecha'
            }, {
                name: 'hora'
            }, {
				        name: 'estado'
		        }]
        ),
        sortInfo: {
            field: 'idhistorial',
            direction: "ASC"
        },
        groupField: 'car',
        listeners: {
            beforeload: function (s) {
                _this.BarraProgreso.show('Cargando historial de actividades');
                s.baseParams.start = pgactual;
            },
            load: function (st) {
                _this.BarraProgreso.hide();
                if (_this.smActividades.getSelected() == undefined) {
                    _this.btnVersionActualAct.disable();
                    _this.btnVersionAnteriorAct.disable();
                    _this.btnVerDetallesActividades.disable();
                    _this.btnEliminarActividades.disable();
                }
                if (st.getCount() == 0) {
                    if (pgactual != 0) {
                        pgactual = 0;
                        st.reload();
                    } else {
                        if (_this.filtrosActividades.getFiltrosActivos() == undefined
                            || _this.filtrosActividades.getFiltrosActivos().length == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                            _this.btnLimpiarActividades.disable();
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                            _this.btnLimpiarActividades.enable();
                        }
                    }
                } else {
                    if (_this.filtrosActividades.getFiltrosActivos() == undefined || _this.filtrosActividades.getFiltrosActivos().length == 0) {
                        _this.btnLimpiarActividades.disable();
                    } else {
                        _this.btnLimpiarActividades.enable();
                    }
                }
                _this.changeTitle(_this.filtrosActividades, st, _this.PanelActividadesCentro, 'Historial de actividades');
            }
        }
    });
    this.smActividades = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, ri, record) {
                if (sm.getSelections().length == 1) {
                    _this.btnVersionActualAct.enable();
                    _this.btnVersionAnteriorAct.enable();
                    _this.btnVerDetallesActividades.enable();
                    _this.btnEliminarActividades.enable();
                } else if (sm.getSelections().length > 1) {
                    _this.btnVersionActualAct.disable();
                    _this.btnVersionAnteriorAct.disable();
                    _this.btnVerDetallesActividades.disable();
                }
            },
            rowdeselect: function (sm, ri, record) {
                _this.gdActividades.getColumnModel().setColumnHeader(0, '');
                _this.gdActividades.getColumnModel().setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                if (sm.getSelections().length == 0) {
                    _this.btnVersionActualAct.disable();
                    _this.btnVersionAnteriorAct.disable();
                    _this.btnVerDetallesActividades.disable();
                    _this.btnEliminarActividades.disable();
                } else if (sm.getSelections().length == 1) {
                    _this.btnVersionActualAct.enable();
                    _this.btnVersionAnteriorAct.enable();
                    _this.btnVerDetallesActividades.enable();
                }
            }
        }
    });
    this.cmActividades = [
        _this.smActividades,
        {
            header: "CAR",
            width: 50,
            sortable: true,
            dataIndex: 'car',
            tooltip: 'Código de Acceso Rápido'
        }, {
            id: 'expandir',
            header: "Denominación",
            width: 200,
            sortable: true,
            tooltip: 'Denominación',
            dataIndex: 'denominacion',
            renderer: MostrarImagenAct
        }, {
            header: "Acción",
            width: 50,
            tooltip: 'Acción',
            dataIndex: 'accion',
            sortable: true,
            renderer: MostrarImagenAccion
        }, {
            header: "Autor",
            width: 50,
            tooltip: 'Autor',
            dataIndex: 'autor',
            sortable: true
        }, {
            header: "Fecha",
            tooltip: 'Fecha',
            width: 50,
            dataIndex: 'fecha',
            sortable: true
        }, {
            header: "Hora",
            tooltip: 'Hora',
            width: 50,
            dataIndex: 'hora',
            sortable: true
        }, {
            header: "Estado",
            tooltip: 'Estado',
            width: 80,
            dataIndex: 'estado',
            sortable: true
        }
    ];
    this.paginadoActividades = new Ext.PagingToolbar({
        id: "paginadoActividades",
        pageSize: 1000,
        store: _this.stActividades,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                pgactual = evento.start;
            }
        }
    });
    this.gdActividades = new Ext.grid.GridPanel({
        id: 'gdActividades',
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        plugins: _this.filtrosActividades,
        autoExpandColumn: 'expandir',
        store: _this.stActividades,
        sm: _this.smActividades,
        columns: _this.cmActividades,
        view: new Ext.grid.GroupingView({
            forceFit: true,
            groupTextTpl: '<center>{text} ({[values.rs.length]} {[values.rs.length > 1 ? "acciones ejecutadas" : "acción ejecutada"]})</center>'
        }),
        bbar: _this.paginadoActividades,
        loadMask: {
            msg: 'Cargando historial...'
        },
        listeners: {
            rowcontextmenu: function (t, ri, event) {
                _this.smActividades.selectRow(ri);
                var menunom = new Ext.menu.Menu({
                    id: 'menunom',
                    items: [{
                        text: 'Ver detalles del historial',
                        itemCls: 'x-menu-item icondistra-ver',
                        iconCls: 'imagen-none',
                        tooltip: 'Ver detalles del historial',
                        handler: function () {
                            _this.VerDetalles(_this.smActividades);
                        }
                    }, {
                        text: 'Comparar con versión actual',
                        itemCls: 'x-menu-item icondistra-comparar sipac-verde',
                        iconCls: 'imagen-none',
                        tooltip: 'Comparar con versión actual',
                        handler: function () {
                            _this.CompararActualAct();
                        }
                    }, {
                        text: 'Comparar con versión anterior',
                        itemCls: 'x-menu-item icondistra-comparar',
                        iconCls: 'imagen-none',
                        tooltip: 'Comparar con versión anterior',
                        handler: function () {
                            _this.CompararAnterior(_this.smActividades);
                        }
                    }, {
                        text: 'Eliminar historial',
                        itemCls: 'x-menu-item icondistra-eliminar',
                        iconCls: 'imagen-none',
                        tooltip: 'Eliminar historial',
                        handler: function () {
                            _this.EliminarActividades();
                        }
                    }]
                });
                //*** Mostrar menu ***
                if (_this.smActividades.getSelections().length == 1) {
                    event.stopEvent();
                    var xy = event.getXY();
                    _this.gdActividades.contextMenu = menunom;
                    _this.gdActividades.contextMenu.showAt(xy);
                }
            },
            rowdblclick: function (t, ri, event) {
                _this.VerDetalles(_this.smActividades);
            }
        }
    });
    _this.gdActividades.getView().getRowClass = function (ri, n) {
        if (ri.data.idhistorial == opciones.idhistorial)
            return "superior";
        else
            return "";
    };
    this.PanelActividadesCentro = new Ext.Panel({
        layout: 'fit',
        usarKeymap: true,
        botonesKeymap: [_this.btnVerDetallesActividades, _this.btnVersionActualAct,
            _this.btnVersionAnteriorAct, _this.btnEliminarActividades,
            _this.btnLimpiarActividades],
        tbar: [_this.btnVerDetallesActividades, ' ', _this.btnVersionActualAct, ' ',
            _this.btnVersionAnteriorAct, ' ', /* _this.btnEliminarActividades, ' ',*/
            _this.btnLimpiarActividades],
        id: 'PanelActividadesCentro',
        title: (opciones.mostrarVentana) ? 'Historial de actividades' : '',
        items: _this.gdActividades
    });

    //*********** INTERFAZ DE OBJETIVOS *************************
    this.btnVerDetallesObjetivos = new Ext.Button({
        disabled: true,
        iconCls: 'ver',
        tooltip: 'Ver detalles del historial',
        handler: function () {
            _this.VerDetalles(_this.smObjetivos);
        },
        key: {
            alt: true,
            key: 'D'
        },
        scope: this
    });
    this.btnEliminarObjetivos = new Ext.Button({
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar historial(es)',
        handler: function () {
            _this.EliminarObjetivos(_this.smObjetivos.getSelections(), 3);
        },
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this

    });
    this.btnLimpiarObjetivos = new Ext.Button({
        text: '',
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar',
        handler: function () {
            _this.filtrosObjetivos.clearFilters();
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    this.btnVersionActualObj = new Ext.Button({
        disabled: true,
        id: 'btnVersionActualObj',
        iconCls: 'icondistra-comparar sipac-verde',
        tooltip: 'Comparar con versión actual',
        handler: function () {
            _this.CompararActualObj();
        },
        key: {
            ctrl: true,
            key: 'C'
        },
        scope: this
    });
    this.btnVersionAnteriorObj = new Ext.Button({
        disabled: true,
        id: 'btnVersionAnteriorObj',
        iconCls: 'icondistra-comparar',
        tooltip: 'Comparar con versión anterior',
        handler: function () {
            _this.CompararAnterior(_this.smObjetivos);
        },
        key: {
            shift: true,
            key: 'C'
        },
        scope: this
    });

    this.filtrosObjetivos = new Ext.grid.GridFilters({
        filters: [{
            type: 'string_adaptado',
            dataIndex: 'car',
            xtype: 'numberfield',
            maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
            maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
        }, {
            type: 'string',
            dataIndex: 'denominacion'
        }, {
            type: 'list',
            dataIndex: 'accion',
            options: ['Creado', 'Modificado', 'Eliminado', 'Cambiado de estado']
        }, {
            type: 'date',
            dataIndex: 'fecha'
        }]
    });
    this.stObjetivos = new Ext.data.GroupingStore({
        remoteSort: true,
        url: '/planificacion/pdo/plan/index.php/cmphistorial/listarObjetivos',
        reader: new Ext.data.JsonReader({
                id: 'id',
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'car'
            }, {
                name: 'idtipoelemento'
            }, {
                name: 'denominacion'
            }, {
                name: 'accion'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'gradocumplimiento'
            }, {
                name: 'dirigente'
            }, {
                name: 'participante'
            }, {
                name: 'involucrados'
            }, {
                name: 'idhistorial'
            }, {
                name: 'autor'
            }, {
                name: 'fecha'
            }]
        ),
        sortInfo: {
            field: 'idhistorial',
            direction: "ASC"
        },
        groupField: 'car',
        listeners: {
            beforeload: function (s) {
                _this.BarraProgreso.show('Cargando historial de objetivos');
                s.baseParams.start = pgactual;
            },
            load: function (st) {
                _this.BarraProgreso.hide();
                if (_this.smObjetivos.getSelected() == undefined) {
                    _this.btnVersionActualObj.disable();
                    _this.btnVersionAnteriorObj.disable();
                    _this.btnVerDetallesObjetivos.disable();
                    _this.btnEliminarObjetivos.disable();
                }
                if (st.getCount() == 0) {
                    if (pgactual != 0) {
                        pgactual = 0;
                        st.reload();
                    } else {
                        if (_this.filtrosObjetivos.getFiltrosActivos() == undefined || _this.filtrosObjetivos.getFiltrosActivos().length == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                            _this.btnLimpiarObjetivos.disable();
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                            _this.btnLimpiarObjetivos.enable();
                        }
                    }
                } else {
                    if (_this.filtrosObjetivos.getFiltrosActivos() == undefined || _this.filtrosObjetivos.getFiltrosActivos().length == 0) {
                        _this.btnLimpiarObjetivos.disable();
                    } else {
                        _this.btnLimpiarObjetivos.enable();
                    }
                }
                _this.changeTitle(_this.filtrosObjetivos, st, _this.PanelObjetivosCentro, 'Historial de objetivos');
            }
        }
    });
    this.smObjetivos = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, ri, record) {
                if (sm.getSelections().length == 1) {
                    _this.btnVersionActualObj.enable();
                    _this.btnVersionAnteriorObj.enable();
                    _this.btnVerDetallesObjetivos.enable();
                    _this.btnEliminarObjetivos.enable();
                } else if (sm.getSelections().length > 1) {
                    _this.btnVersionActualObj.disable();
                    _this.btnVersionAnteriorObj.disable();
                    _this.btnVerDetallesObjetivos.disable();
                }
            },
            rowdeselect: function (sm, ri, record) {
                _this.gdObjetivos.getColumnModel().setColumnHeader(0, '');
                _this.gdObjetivos.getColumnModel().setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                if (sm.getSelections().length == 0) {
                    _this.btnVersionActualObj.disable();
                    _this.btnVersionAnteriorObj.disable();
                    _this.btnVerDetallesObjetivos.disable();
                    _this.btnEliminarObjetivos.disable();
                } else if (sm.getSelections().length == 1) {
                    _this.btnVersionActualObj.enable();
                    _this.btnVersionAnteriorObj.enable();
                    _this.btnVerDetallesObjetivos.enable();
                }
            }
        }
    });
    this.cmObjetivos = [
        _this.smObjetivos,
        {
            header: "CAR",
            width: 50,
            sortable: true,
            dataIndex: 'car',
            tooltip: 'Código de Acceso Rápido'
        }, {
            id: 'expandir',
            header: "Denominación",
            tooltip: 'Denominación',
            width: 200,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: MostrarImagenObj
        }, {
            header: "Acción",
            tooltip: 'Acción',
            width: 50,
            dataIndex: 'accion',
            sortable: true,
            renderer: MostrarImagenAccion
        }, {
            header: "Autor",
            tooltip: 'Autor',
            width: 50,
            dataIndex: 'autor',
            sortable: true
        }, {
            header: "Fecha",
            tooltip: 'Fecha',
            width: 50,
            dataIndex: 'fecha',
            sortable: true
        }
    ];
    this.paginadoObjetivos = new Ext.PagingToolbar({
        id: "paginadoObjetivos",
        pageSize: 1000,
        store: _this.stObjetivos,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                pgactual = evento.start;
            }
        }
    });
    this.gdObjetivos = new Ext.grid.GridPanel({
        id: 'gdObjetivos',
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        plugins: _this.filtrosObjetivos,
        autoExpandColumn: 'expandir',
        store: _this.stObjetivos,
        sm: _this.smObjetivos,
        columns: _this.cmObjetivos,
        loadMask: {
            msg: 'Cargando historial...'
        },
        view: new Ext.grid.GroupingView({
            forceFit: true,
            groupTextTpl: '<center>{text} ({[values.rs.length]} {[values.rs.length > 1 ? "acciones ejecutadas" : "acción ejecutada"]})</center>'
        }),
        bbar: _this.paginadoObjetivos,
        listeners: {
            rowcontextmenu: function (t, ri, event) {
                _this.smObjetivos.selectRow(ri);
                var menunom = new Ext.menu.Menu({
                    id: 'menunom',
                    items: [{
                        text: 'Ver detalles del historial',
                        itemCls: 'x-menu-item icondistra-ver',
                        iconCls: 'imagen-none',
                        tooltip: 'Ver detalles del historial',
                        handler: function () {
                            _this.VerDetalles(_this.smObjetivos);
                        }
                    }, {
                        text: 'Comparar con versión actual',
                        itemCls: 'x-menu-item icondistra-comparar sipac-verde',
                        iconCls: 'imagen-none',
                        tooltip: 'Comparar con versión actual',
                        handler: function () {
                            _this.CompararActualObj();
                        }
                    }, {
                        text: 'Comparar con versión anterior',
                        itemCls: 'x-menu-item icondistra-comparar',
                        iconCls: 'imagen-none',
                        tooltip: 'Comparar con versión anterior',
                        handler: function () {
                            _this.CompararAnterior(_this.smObjetivos);
                        }
                    }, {
                        text: 'Eliminar historial',
                        itemCls: 'x-menu-item icondistra-eliminar',
                        iconCls: 'imagen-none',
                        tooltip: 'Eliminar historial',
                        handler: function () {
                            _this.EliminarObjetivos();
                        }
                    }]
                });
                //*** Mostrar menu ***
                if (_this.smObjetivos.getSelections().length == 1) {
                    event.stopEvent();
                    var xy = event.getXY();
                    _this.gdObjetivos.contextMenu = menunom;
                    _this.gdObjetivos.contextMenu.showAt(xy);
                }
            },
            rowdblclick: function (t, ri, event) {
                _this.VerDetalles(_this.smObjetivos);
            }
        }
    });
    this.gdObjetivos.getView().getRowClass = function (ri, n) {
        if (ri.data.idhistorial == opciones.idhistorial)
            return "superior";
        else
            return "";
    };
    this.PanelObjetivosCentro = new Ext.Panel({
        layout: 'fit',
        usarKeymap: true,
        botonesKeymap: [_this.btnVerDetallesObjetivos, _this.btnVersionActualObj,
            _this.btnVersionAnteriorObj, _this.btnEliminarObjetivos, _this.btnLimpiarObjetivos],
        tbar: [_this.btnVerDetallesObjetivos, ' ', _this.btnVersionActualObj, ' ',
            _this.btnVersionAnteriorObj, ' ', /* _this.btnEliminarObjetivos, ' ',*/ _this.btnLimpiarObjetivos],
        id: 'PanelObjetivosCentro',
        title: (opciones.mostrarVentana) ? 'Historial de objetivos' : '',
        items: _this.gdObjetivos
    });

    //*********** INTERFAZ DE OBJETIVOS *************************
    this.btnVerDetallesFIP = new Ext.Button({
        disabled: true,
        iconCls: 'ver',
        tooltip: 'Ver detalles de FIP',
        handler: function () {
            _this.VerDetalles(_this.smFIP);
        },
        key: {
            alt: true,
            key: 'D'
        },
        scope: this
    });
    this.btnEliminarFIP = new Ext.Button({
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar historial(es)',
        handler: function () {
            _this.EliminarFIP(_this.smFIP.getSelections(), 3);
        },
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this

    });
    this.btnLimpiarFIP = new Ext.Button({
        text: '',
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar',
        handler: function () {
            _this.filtrosFIP.clearFilters();
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    this.btnVersionActualFIP = new Ext.Button({
        disabled: true,
        id: 'btnVersionActualFIP',
        iconCls: 'icondistra-comparar sipac-verde',
        tooltip: 'Comparar con versión actual',
        handler: function () {
            _this.CompararActualFIP();
        },
        key: {
            ctrl: true,
            key: 'C'
        },
        scope: this
    });
    this.btnVersionAnteriorFIP = new Ext.Button({
        disabled: true,
        id: 'btnVersionAnteriorFIP',
        iconCls: 'icondistra-comparar',
        tooltip: 'Comparar con versión anterior',
        handler: function () {
            _this.CompararAnterior(_this.smFIP);
        },
        key: {
            shift: true,
            key: 'C'
        },
        scope: this
    });

    this.filtrosFIP = new Ext.grid.GridFilters({
        filters: [{
            type: 'string_adaptado',
            dataIndex: 'car',
            xtype: 'numberfield',
            maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
            maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
        }, {
            type: 'string',
            dataIndex: 'denominacion'
        }, {
            type: 'list',
            dataIndex: 'accion',
            options: ['Creado', 'Modificado', 'Eliminado', 'Cambiado de estado']
        }, {
            type: 'date',
            dataIndex: 'fecha'
        }]
    });
    this.stFIP = new Ext.data.GroupingStore({
        remoteSort: true,
        url: '/planificacion/pdo/plan/index.php/cmphistorial/listarFIP',
        reader: new Ext.data.JsonReader({
                id: 'id',
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'car'
            }, {
                name: 'idtipoelemento'
            }, {
                name: 'denominacion'
            }, {
                name: 'accion'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'gradocumplimiento'
            }, {
                name: 'dirigente'
            }, {
                name: 'participante'
            }, {
                name: 'involucrados'
            }, {
                name: 'idhistorial'
            }, {
                name: 'autor'
            }, {
                name: 'fecha'
            }]
        ),
        sortInfo: {
            field: 'idhistorial',
            direction: "ASC"
        },
        groupField: 'car',
        listeners: {
            beforeload: function (s) {
                _this.BarraProgreso.show('Cargando historial de FIP');
                s.baseParams.start = pgactual;
            },
            load: function (st) {
                _this.BarraProgreso.hide();
                if (_this.smFIP.getSelected() == undefined) {
                    _this.btnVersionActualFIP.disable();
                    _this.btnVersionAnteriorFIP.disable();
                    _this.btnVerDetallesFIP.disable();
                    _this.btnEliminarFIP.disable();
                }
                if (st.getCount() == 0) {
                    if (pgactual != 0) {
                        pgactual = 0;
                        st.reload();
                    } else {
                        if (_this.filtrosFIP.getFiltrosActivos() == undefined || _this.filtrosFIP.getFiltrosActivos().length == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                            _this.btnLimpiarFIP.disable();
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                            _this.btnLimpiarFIP.enable();
                        }
                    }
                } else {
                    if (_this.filtrosFIP.getFiltrosActivos() == undefined || _this.filtrosFIP.getFiltrosActivos().length == 0) {
                        _this.btnLimpiarFIP.disable();
                    } else {
                        _this.btnLimpiarFIP.enable();
                    }
                }
                _this.changeTitle(_this.filtrosFIP, st, _this.PanelFIPCentro, 'Historial de FIP');
            }
        }
    });
    this.smFIP = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, ri, record) {
                if (sm.getSelections().length == 1) {
                    _this.btnVersionActualFIP.enable();
                    _this.btnVersionAnteriorFIP.enable();
                    _this.btnVerDetallesFIP.enable();
                    _this.btnEliminarFIP.enable();
                } else if (sm.getSelections().length > 1) {
                    _this.btnVersionActualFIP.disable();
                    _this.btnVersionAnteriorFIP.disable();
                    _this.btnVerDetallesFIP.disable();
                }
            },
            rowdeselect: function (sm, ri, record) {
                _this.gdFIP.getColumnModel().setColumnHeader(0, '');
                _this.gdFIP.getColumnModel().setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                if (sm.getSelections().length == 0) {
                    _this.btnVersionActualFIP.disable();
                    _this.btnVersionAnteriorFIP.disable();
                    _this.btnVerDetallesFIP.disable();
                    _this.btnEliminarFIP.disable();
                } else if (sm.getSelections().length == 1) {
                    _this.btnVersionActualFIP.enable();
                    _this.btnVersionAnteriorFIP.enable();
                    _this.btnVerDetallesFIP.enable();
                }
            }
        }
    });
    this.cmFIP = [
        _this.smFIP,
        {
            header: "CAR",
            width: 50,
            sortable: true,
            dataIndex: 'car',
            tooltip: 'Código de Acceso Rápido'
        }, {
            id: 'expandir',
            header: "Denominación",
            tooltip: 'Denominación',
            width: 200,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: MostrarImagenFIP
        }, {
            header: "Acción",
            tooltip: 'Acción',
            width: 70,
            dataIndex: 'accion',
            sortable: true,
            renderer: MostrarImagenAccion
        }, {
            header: "Autor",
            tooltip: 'Autor',
            width: 50,
            dataIndex: 'autor',
            sortable: true
        }, {
            header: "Fecha",
            tooltip: 'Fecha',
            width: 50,
            dataIndex: 'fecha',
            sortable: true
        }
    ];
    this.paginadoFIP = new Ext.PagingToolbar({
        id: "paginadoFIP",
        pageSize: 1000,
        store: _this.stFIP,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                pgactual = evento.start;
            }
        }
    });
    this.gdFIP = new Ext.grid.GridPanel({
        id: 'gdFIP',
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        plugins: _this.filtrosFIP,
        autoExpandColumn: 'expandir',
        store: _this.stFIP,
        sm: _this.smFIP,
        columns: _this.cmFIP,
        loadMask: {
            msg: 'Cargando historial...'
        },
        view: new Ext.grid.GroupingView({
            forceFit: true,
            groupTextTpl: '<center>{text} ({[values.rs.length]} {[values.rs.length > 1 ? "acciones ejecutadas" : "acción ejecutada"]})</center>'
        }),
        bbar: _this.paginadoFIP,
        listeners: {
            rowcontextmenu: function (t, ri, event) {
                _this.smFIP.selectRow(ri);
                var menunom = new Ext.menu.Menu({
                    id: 'menunom',
                    items: [{
                        text: 'Ver detalles del historial',
                        itemCls: 'x-menu-item icondistra-ver',
                        iconCls: 'imagen-none',
                        tooltip: 'Ver detalles del historial',
                        handler: function () {
                            _this.VerDetalles(_this.smFIP);
                        }
                    }, {
                        text: 'Comparar con versión actual',
                        itemCls: 'x-menu-item icondistra-comparar sipac-verde',
                        iconCls: 'imagen-none',
                        tooltip: 'Comparar con versión actual',
                        handler: function () {
                            _this.CompararActualFIP();
                        }
                    }, {
                        text: 'Comparar con versión anterior',
                        itemCls: 'x-menu-item icondistra-comparar',
                        iconCls: 'imagen-none',
                        tooltip: 'Comparar con versión anterior',
                        handler: function () {
                            _this.CompararAnterior(_this.smFIP);
                        }
                    }, {
                        text: 'Eliminar historial',
                        itemCls: 'x-menu-item icondistra-eliminar',
                        iconCls: 'imagen-none',
                        tooltip: 'Eliminar historial',
                        handler: function () {
                            _this.EliminarFIP();
                        }
                    }]
                });
                //*** Mostrar menu ***
                if (_this.smFIP.getSelections().length == 1) {
                    event.stopEvent();
                    var xy = event.getXY();
                    _this.gdFIP.contextMenu = menunom;
                    _this.gdFIP.contextMenu.showAt(xy);
                }
            },
            rowdblclick: function (t, ri, event) {
                _this.VerDetalles(_this.smFIP);
            }
        }
    });
    this.gdFIP.getView().getRowClass = function (ri, n) {
        if (ri.data.idhistorial == opciones.idhistorial)
            return "superior";
        else
            return "";
    };
    this.PanelFIPCentro = new Ext.Panel({
        layout: 'fit',
        usarKeymap: true,
        botonesKeymap: [_this.btnVerDetallesFIP, _this.btnVersionActualFIP,
            _this.btnVersionAnteriorFIP, _this.btnEliminarFIP, _this.btnLimpiarFIP],
        tbar: [_this.btnVerDetallesFIP, ' ', _this.btnVersionActualFIP, ' ',
            _this.btnVersionAnteriorFIP, ' ', /* _this.btnEliminarFIP, ' ',*/ _this.btnLimpiarFIP],
        id: 'PanelFIPCentro',
        title: (opciones.mostrarVentana) ? 'Historial de FIP' : '',
        items: _this.gdFIP
    });

    //****** FUNCIONES GENERALES *********

    this.PanelCards = new Ext.Panel({
        layout: 'card',
        region: 'center',
        activeItem: 0,
        items: [_this.PanelPlanesCentro, _this.PanelObjetivosCentro, _this.PanelActividadesCentro, _this.PanelFIPCentro]
    });

    this.WinPrincipal = new Ext.Window({
        layout: 'border',
        closable: false,
        graggable: false,
        maximized: true,
        noTitle: true,
        modal: true,
        width: 1000,
        height: 510,
        //usarKeymap: true,
        //botonesKeymap: [_this.btnAyuda],
        tbar: [_this.btnPlanes, ' ', _this.btnActividades, ' ', _this.btnObjetivos, ' ', _this.btnFIP, '->', _this.btnAyuda],
        items: _this.PanelCards
    });
    this.Inicializar = function (idelemento) {
        if (opciones.mostrarVentana) {
            _this.WinPrincipal.show();
            pgactual = 0;
            _this.BarraProgreso.show('Cargando historial');
            _this.stPlanes.load();
            _this.PanelCards.layout.setActiveItem('PanelPlanesCentro');
        } else {
            return _this.devolverpaneles(opciones.panel, idelemento);
        }
    };

    this.verHistorial = function (panel, idelemento) {
        panel = _this.devolverpaneles(panel, idelemento);
        Winhistorial = new Ext.Window({
            layout: 'fit',
            title: 'Historial',
            closable: true,
            graggable: false,
            maximized: false,
            constrain: true,
            modal: true,
            closeAction: 'hide',
            width: 940,
            height: 450,
            items: panel,
            defaultButton: _this.btnLimpiarPlanes,
            buttons: [{
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                iconCls: 'cerrar',
                id: 'btnCerrarWinVerHistorial',
                netxTab: 'id_btnVerDetallesPlanes',
                prevTab: 'btnLimpiarPlanes',
                handler: function () {
                    Winhistorial.hide();
                }
            }]
        });
        //Winhistorial.doLayout();
        Winhistorial.show();
        Winhistorial.on('beforeshow', function () {
            Ext.getCmp('btnLimpiarPlanes').focus(true, 700);
        });
        Ext.getCmp('btnLimpiarPlanes').focus(false, 1024);
    };

    function onClickPlanes(event, elx, obx) {
        _this.stPlanes.load();
        _this.PanelCards.layout.setActiveItem('PanelPlanesCentro');
    }

    function onClickActividades(event, elx, obx) {
        _this.stActividades.load();
        _this.PanelCards.layout.setActiveItem('PanelActividadesCentro');
    }

    function onClickObjetivos(event, elx, obx) {
        _this.stObjetivos.load();
        _this.PanelCards.layout.setActiveItem('PanelObjetivosCentro');
    }

    function onClickFIP(event, elx, obx) {
        _this.stFIP.load();
        _this.PanelCards.layout.setActiveItem('PanelFIPCentro');
    }

    //funcion para mostrar el icono "accion"
    function MostrarImagenAccion(valor, m) {
        if (valor == 2) {
            valor = '<center><span class="icondistra-registro sipac-amarilla">Modificado</span></center>';
            m.attr = 'ext:qtip="' + 'Modificado' + '"';
            return valor;
        } else if (valor == 3) {
            valor = '<center><span class="icondistra-desintalar sipac-roja">Eliminado</span></center>';
            m.attr = 'ext:qtip="' + 'Eliminado' + '"';
            return valor;
        } else if (valor == 1) {
            valor = '<center><span class="icondistra-nuevo sipac-verde">Creado</span></center>';
            m.attr = 'ext:qtip="' + 'Creado' + '"';
            return valor;
        } else if (valor == 4) {
            valor = '<center><span class="icondistra-cambiodestado sipac-naranja">Cambiado de estado</span></center>';
            m.attr = 'ext:qtip="' + 'Cambiado de estado' + '"';
            return valor;
        } else if (valor == 6) {
            valor = '<center><span class="icondistra-gestionarasistencia sipac-azul">Alarma</span></center>';
            m.attr = 'ext:qtip="' + 'Alarma' + '"';
            return valor;
        }
    }

    //*** PANELES DE COMPACION CON VERSION ANTERIOR *** ****
    this.panelselectAnt = new Ext.Panel({
        width: 270,
        height: 300,
        autoScroll: true,
        bodyStyle: {
            background: '#ffffff',
            padding: '7px'
        }
    });
    this.panelAnterior = new Ext.Panel({
        width: 270,
        height: 300,
        autoScroll: true,
        bodyStyle: {
            background: '#ffffff',
            padding: '7px'
        }
    });
    //*** **** VENTANA COMPARAR CON VERSION ANTERIOR **** **** ****
    this.WinVersionAnterior = new Ext.Window({
        modal: true,
        frame: true,
        shadow: false,
        constrain: true,
        closeAction: 'hide',
        resizable: false,
        layout: 'column',
        title: 'Comparar con versión anterior',
        width: 570,
        height: 385,
        border: false,
        bodyStyle: {
            padding: '2px'
        },
        monitorResize: true,
        items: [{
            columnWidth: .50,
            height: 315,
            items: [{
                xtype: 'label',
                html: '<b>Versión seleccionada</b><br/>'
            }, _this.panelselectAnt]
        }, {
            columnWidth: .50,
            height: 315,
            items: [{
                xtype: 'label',
                html: '<b>Versión anterior</b><br/>'
            }, _this.panelAnterior]
        }],
        buttons: [{
            id: 'btnCerrarAnterior',
            nextTab: 'btnCerrarAnterior',
            prevTab: 'btnCerrarAnterior',
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            handler: function () {
                _this.WinVersionAnterior.hide();
            }
        }]
    });
    //*** DIBUJAR DATOS DE COMPARACION CON VERSION ANTERIOR ***
    this.showTemplatesAnt = function (tipo, seletAnt, anterior) {
        var tplMarkup = [
            '<b>Denominación:</b> {denelemento} <br/>',
            '<b>Fecha de ocurrencia:</b> {fecha}<br/>',
            '<b>Hora de ocurrencia:</b> {hora}<br/>',
            '<b>Lugar:</b> {lugar}<br/>',
            '<b>Fecha de inicio:</b> {fechainicio}<br/>',
            '<b>Hora de inicio:</b> {horainicio}<br/>',
            '<b>Fecha de fin:</b> {fechafin}<br/>',
            '<b>Hora de fin:</b> {horafin}<br/>',
            '<b>% de cumplimiento:</b> {gradocumplimiento}<br/>',
		        '<b>Estado:</b> {estado}<br/>',
            '<b>Autor:</b> {idautor}<br/>',
            '<b>Participantes:</b> {participante}<br/>',
            '<b>Dirigentes:</b> {dirigente}<br/>',
            '<b>Involucrados:</b> {involucrados}<br/>',
            '<b>Descripción:</b> {descelemento}<br/>'
        ];
        if (seletAnt.denelemento != anterior.denelemento) {
            tplMarkup[0] = ('<b><font color = "red">Denominación:</b> {denelemento} </font><br/>');
        }
        if (seletAnt.fecha != anterior.fecha) {
            tplMarkup[1] = ('<b><font color = "red">Fecha de ocurrencia:</b> {fecha} </font><br/>');
        }
        if (seletAnt.hora != anterior.hora) {
            tplMarkup[2] = ('<b><font color = "red">Hora de ocurrencia:</b> {hora} </font><br/>');
        }
        if (seletAnt.lugar != anterior.lugar) {
            tplMarkup[3] = ('<b><font color = "red">Lugar:</b> {lugar} </font><br/>');
        }
        if (seletAnt.fechainicio != anterior.fechainicio) {
            tplMarkup[4] = ('<b><font color = "red">Fecha de inicio:</b> {fechainicio} </font><br/>');
        }
        if (seletAnt.horainicio != anterior.horainicio) {
            tplMarkup[5] = ('<b><font color = "red">Hora de inicio:</b> {horainicio} </font><br/>');
        }
        if (seletAnt.fechafin != anterior.fechafin) {
            tplMarkup[6] = ('<b><font color = "red">Fecha de fin:</b> {fechafin} </font><br/>');
        }
        if (seletAnt.horafin != anterior.horafin) {
            tplMarkup[7] = ('<b><font color = "red">Hora de fin:</b> {horafin} </font><br/>');
        }
        if (seletAnt.gradocumplimiento != anterior.gradocumplimiento) {
            tplMarkup[8] = ('<b><font color = "red">% de cumplimiento:</b> {gradocumplimiento} </font><br/>');
        }
        if (seletAnt.estado != anterior.estado) {
            tplMarkup[9] = ('<b><font color = "red">Estado:</b> {estado} </font><br/>');
        }
        if (seletAnt.idautor != anterior.idautor) {
            tplMarkup[10] = '<b><font color = "red">Autor:</b> {idautor} </font><br/>';
        }
        if (seletAnt.participante != anterior.participante) {
            tplMarkup[11] = ('<b><font color = "red">Participantes:</b> {participante} </font><br/>');
        }
        if (seletAnt.dirigente != anterior.dirigente) {
            tplMarkup[12] = ('<b><font color = "red">Dirigentes:</b> {dirigente} </font><br/>');
        }
        if (seletAnt.involucrados != anterior.involucrados) {
            tplMarkup[13] = ('<b><font color = "red">Involucrados:</b> {involucrados} </font><br/>');
        }
        if (seletAnt.descelemento != anterior.descelemento) {
            tplMarkup[14] = '<b><font color = "red">Descripción:</b> {descelemento} </font><br/>';
        }

        if (tipo != 3) {
            /*tplMarkup.splice(3, 1); //Lugar
            tplMarkup.splice(5, 1); //Hora inicio
            tplMarkup.splice(7, 1); //Hora fin*/
            delete tplMarkup[3];
            delete tplMarkup[5];
            delete tplMarkup[7];
        }
        if (tipo == 0) {
            //tplMarkup.splice(10, 3); //participante, dirigente, involucrados
            delete tplMarkup[11];
            delete tplMarkup[12];
            delete tplMarkup[13];
        }

        var tplElem = new Ext.Template(tplMarkup);
        tplElem.overwrite(_this.panelselectAnt.body, seletAnt);
        tplElem.overwrite(_this.panelAnterior.body, anterior);
    };

    this.showTemplatesAntOld = function (tipo, seletAnt, anterior) {
        var tplMarkup = [
            '<b>Denominación:</b> {denelemento} <br/>',
            '<b>Fecha:</b> {fecha}<br/>',
            '<b>Hora:</b> {hora}<br/>',
            '<b>Fecha de inicio:</b> {fechainicio}<br/>',
            '<b>Fecha de fin:</b> {fechafin}<br/>',
            '<b>% de cumplimiento:</b> {gradocumplimiento}<br/>',
            '<b>Autor:</b> {idautor}<br/>',
            '<b>Participantes:</b> {participante}<br/>',
            '<b>Dirigentes:</b> {dirigente}<br/>',
            '<b>Involucrados:</b> {involucrados}<br/>',
            '<b>Descripción:</b> {descelemento}<br/>'
        ];
        if (tipo == 3) {
            if (seletAnt.horainicio != anterior.horainicio) {
                tplMarkup.push('<b><font color = "red">Hora de inicio:</b> {horainicio} </font><br/>');
            } else {
                tplMarkup.push('<b>Hora de inicio:</b> {horainicio}<br/>');
            }
            if (seletAnt.horafin != anterior.horafin) {
                tplMarkup.push('<b><font color = "red">Hora de fin:</b> {horafin} </font><br/>');
            } else {
                tplMarkup.push('<b>Hora de fin:</b> {horafin}<br/>');
            }
        }
        if (tipo == 0) {
            tplMarkup.remove('<b>Participantes:</b> {participante}<br/>');
            tplMarkup.remove('<b>Dirigentes:</b> {dirigente}<br/>');
            tplMarkup.remove('<b>Involucrados:</b> {involucrados}<br/>');
        }
        if (seletAnt.denelemento != anterior.denelemento) {
            tplMarkup.remove('<b>Denominación:</b> {denelemento} <br/>');
            tplMarkup.push('<b><font color = "red">Denominación:</b> {denelemento} </font><br/>');
        }
        if (seletAnt.descelemento != anterior.descelemento) {
            tplMarkup.remove('<b>Descripción:</b> {descelemento}<br/>');
            tplMarkup.push('<b><font color = "red">Descripción:</b> {descelemento} </font><br/>');
        }
        if (seletAnt.idautor != anterior.idautor) {
            tplMarkup.remove('<b>Autor:</b> {idautor}<br/>');
            tplMarkup.push('<b><font color = "red">Autor:</b> {idautor} </font><br/>');
        }
        if (seletAnt.fecha != anterior.fecha) {
            tplMarkup.remove('<b>Fecha:</b> {fecha}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha:</b> {fecha} </font><br/>');
        }
        if (seletAnt.fechainicio != anterior.fechainicio) {
            tplMarkup.remove('<b>Fecha de inicio:</b> {fechainicio}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha de inicio:</b> {fechainicio} </font><br/>');
        }
        if (seletAnt.fechafin != anterior.fechafin) {
            tplMarkup.remove('<b>Fecha de fin:</b> {fechafin}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha de fin:</b> {fechafin} </font><br/>');
        }
        if (seletAnt.gradocumplimiento != anterior.gradocumplimiento) {
            tplMarkup.remove('<b>% de cumplimiento:</b> {gradocumplimiento}<br/>');
            tplMarkup.push('<b><font color = "red">% de cumplimiento:</b> {gradocumplimiento} </font><br/>');
        }
        if (seletAnt.participante != anterior.participante) {
            tplMarkup.remove('<b>Participantes:</b> {participante}<br/>');
            tplMarkup.push('<b><font color = "red">Participantes:</b> {participante} </font><br/>');
        }
        if (seletAnt.dirigente != anterior.dirigente) {
            tplMarkup.remove('<b>Dirigentes:</b> {dirigente}<br/>');
            tplMarkup.push('<b><font color = "red">Dirigentes:</b> {dirigente} </font><br/>');
        }
        if (seletAnt.involucrados != anterior.involucrados) {
            tplMarkup.remove('<b>Involucrados:</b> {involucrados}<br/>');
            tplMarkup.push('<b><font color = "red">Involucrados:</b> {involucrados} </font><br/>');
        }
        var tplElem = new Ext.Template(tplMarkup);
        tplElem.overwrite(_this.panelselectAnt.body, seletAnt);
        tplElem.overwrite(_this.panelAnterior.body, anterior);
    };
    //*** FUNCION COMPARAR CON VERSION ANTERIOR *** *** *** 
    this.CompararAnterior = function (sm) {
        var idhistorial = sm.getSelections()[0].data.idhistorial;
        // la variable si viene de notificaciones toma data.idelemento y si viene de historial lo hace con data.car
        var idelemento = sm.getSelections()[0].data.car == undefined ?
            sm.getSelections()[0].data.idelemento : sm.getSelections()[0].data.car;
        var tipo = sm.getSelections()[0].data.idtipoelemento;
        var mensajeMascara = 'Cargando comparación';
        _this.BarraProgreso.show(mensajeMascara);
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmphistorial/comphistorialanterior',
            params: {
                idelemento: idelemento,
                idhistorial: idhistorial
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.anterior == null) {
                    mostrarMensaje(2, 'No existe una versión anterior.');
                } else {
                    _this.WinVersionAnterior.show();
                    setTimeout(function () {
                        Ext.getCmp('btnCerrarAnterior').focus(true);
                    }, 500);
                    _this.showTemplatesAnt(tipo, responseData.seleccionada, responseData.anterior);
                }
            }
        });
    };
    //*** PANEL DETALLES *** *** *** ****
    this.paneldetalles = new Ext.Panel({
        width: 270,
        height: 300,
        autoScroll: true,
        bodyStyle: {
            background: '#ffffff',
            padding: '7px'
        }
    });
    // *** *** VENTANA DETALLES *** *** *** **** *** 
    this.WinVerDetalles = new Ext.Window({
        modal: true,
        frame: true,
        shadow: false,
        constrain: true,
        closeAction: 'hide',
        resizable: true,
        layout: 'column',
        title: 'Ver detalles',
        width: 287,
        height: 370,
        border: false,
        bodyStyle: {
            padding: '2px'
        },
        monitorResize: true,
        items: _this.paneldetalles,
        buttons: [{
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            handler: function () {
                _this.WinVerDetalles.hide();
            }
        }]
    });
    //*** DIBUJAR DETALLES ***
    this.showTemplatesVer = function (detalles, tipo) {
        var tplMarkup = [
            '<b>Denominación:</b> {denelemento} <br/>',
            '<b>Descripción:</b> {descelemento}<br/>',
            '<b>Autor:</b> {idautor}<br/>',
            '<b>Fecha:</b> {fecha}<br/>',
            '<b>Fecha de inicio:</b> {fechainicio}<br/>',
            '<b>Fecha de fin:</b> {fechafin}<br/>',
            '<b>% de cumplimiento:</b> {gradocumplimiento}<br/>',
            '<b>Estado:</b> {estado}<br/>',
            '<b>Participantes:</b> {participante}<br/>',
            '<b>Dirigentes:</b> {dirigente}<br/>',
            '<b>Involucrados:</b> {involucrados}<br/>'
        ];
        if (tipo == 3) {
            tplMarkup.push('<b>Hora de inicio:</b> {horainicio}<br/>',
                '<b>Hora de fin:</b> {horafin}<br/>');
        }
        if (tipo == 0) {
            tplMarkup.remove('<b>Participantes:</b> {participante}<br/>');
            tplMarkup.remove('<b>Dirigentes:</b> {dirigente}<br/>');
            tplMarkup.remove('<b>Involucrados:</b> {involucrados}<br/>');
        }
        var tplElem = new Ext.Template(tplMarkup);
        tplElem.overwrite(_this.paneldetalles.body, detalles);
    };

    //*** FUNCION VER DETALLES *** *** *** *** ***
    this.VerDetalles = function (sm) {
        var idhistorial = sm.getSelections()[0].data.idhistorial;
        var tipo = sm.getSelections()[0].data.idtipoelemento;
        var mensajeMascara = 'Cargando detalles';
        _this.BarraProgreso.show(mensajeMascara);
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmphistorial/seleccionada',
            params: {
                idhistorial: idhistorial
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                _this.WinVerDetalles.show();
                _this.showTemplatesVer(responseData, tipo);
            }
        });
    };
    //*** FUNCION PARA CAMBIARLE EL TITULO AL PANEL HISTORIAL *** ***    
    this.changeTitle = function (filtros, st, panel, titulo) {
        var filtrado_por = "";
        var sep = " / ";
        if ((filtros.getFiltrosActivos() == undefined || filtros.getFiltrosActivos().length == 0) && st.getSortState() == undefined) {
            panel.setTitle(titulo);
        } else if (st.getSortState() != undefined && (filtros.getFiltrosActivos() == undefined || filtros.getFiltrosActivos().length == 0)) {
            _this.field = st.getSortState().field;
            _this.dir = st.getSortState().direction;
            var atributo = '';
            var direccion = '';
            if (_this.dir == 'DESC') {
                direccion = 'descendentemente';
            } else {
                direccion = 'acendentemente';
            }
            if (_this.field == 'car') {
                atributo = 'CAR';
            } else if (_this.field == 'denominacion') {
                atributo = 'Denominación';
            } else if (_this.field == 'accion') {
                atributo = 'Acción';
            } else if (_this.field == 'autor') {
                atributo = 'Autor';
            } else if (_this.field == 'fecha') {
                atributo = 'Fecha';
            } else
                atributo = false;
            if (atributo)
                panel.setTitle(titulo + '<i> - Ordenado ' + direccion + ' por: ' + atributo + '</i>');
            else
                panel.setTitle(titulo);
        } else {
            for (i = 0; i < filtros.getFiltrosActivos().length; i++) {
                var aux = "";
                if (filtros.getFiltrosActivos()[i].dataIndex == "denominacion") {
                    aux = 'Denominaci&oacute;n';
                } else if (filtros.getFiltrosActivos()[i].dataIndex == "car") {
                    aux = 'CAR';
                } else if (filtros.getFiltrosActivos()[i].dataIndex == "fecha") {
                    aux = 'Fecha';
                } else if (filtros.getFiltrosActivos()[i].dataIndex == "accion") {
                    aux = 'Acción';
                } else if (filtros.getFiltrosActivos()[i].dataIndex == "autor") {
                    aux = 'Autor';
                } else {
                    aux = 'Observ.';
                }
                if (i == filtros.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += aux + sep;
            }
            panel.setTitle(titulo + '<i> - Filtrado por: ' + filtrado_por + '</i>');
            filtrado_por = "";
        }
    };
    //*** **** FUNCIONES DE PLANES *** *** *** *** ****
    //*** PANELES DE COMPARACION CON VERSION ACTUAL DE PLANES *** ***
    this.panelactualPlan = new Ext.Panel({
        width: 270,
        height: 300,
        autoScroll: true,
        bodyStyle: {
            background: '#ffffff',
            padding: '7px'
        }
    });
    this.panelselectPlan = new Ext.Panel({
        width: 270,
        height: 300,
        autoScroll: true,
        bodyStyle: {
            background: '#ffffff',
            padding: '7px'
        }
    });
    //*** VENTANA COMPARAR VERSION ACTUAL DE PLANES ***
    this.WinActualPlan = new Ext.Window({
        modal: true,
        frame: true,
        constrain: true,
        shadow: false,
        closeAction: 'hide',
        resizable: false,
        layout: 'column',
        title: 'Comparar con versión actual',
        width: 570,
        height: 385,
        border: false,
        bodyStyle: {
            padding: '2px'
        },
        monitorResize: true,
        items: [{
            columnWidth: .50,
            height: 315,
            items: [{
                xtype: 'label',
                html: '<b>Versión seleccionada</b><br/>'
            }, _this.panelselectPlan]
        }, {
            columnWidth: .50,
            height: 315,
            items: [{
                xtype: 'label',
                html: '<b>Versión actual</b><br/>'
            }, _this.panelactualPlan]
        }],
        buttons: [/*{
            id: 'btnSobrescribirPlan',
            nextTab:'btnCerrarCmpPlan',
            prevTab:'btnCerrarCmpPlan',
            iconCls: 'buscaryremplazar',
            text: 'Sobrescribir',
            tooltip: 'Sobrescribir toda la información actual',
            handler: function () {
                _this.sobrescribirPlan(_this.smPlanes)
            }
        },*/ {
            id: 'btnCerrarCmpPlan',
            nextTab: 'btnCerrarCmpPlan',
            prevTab: 'btnCerrarCmpPlan',
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            handler: function () {
                _this.WinActualPlan.hide();
            }
        }]
    });
    //*** DIBUJAR VERSION ACTUAL DE PLANES ***
    this.showTplPlan = function (seleccionadaA, actualA) {
        var tplMarkup = [
            '<b>Denominación:</b> {denelemento} <br/>',
            '<b>Descripción:</b> {descelemento}<br/>',
            '<b>Autor:</b> {idautor}<br/>',
            '<b>Fecha:</b> {fecha}<br/>',
            '<b>Fecha de inicio:</b> {fechainicio}<br/>',
            '<b>Fecha de fin:</b> {fechafin}<br/>',
            '<b>% de cumplimiento:</b> {gradocumplimiento}<br/>'
        ];
        if (seleccionadaA.denelemento != actualA.denelemento) {
            tplMarkup.remove('<b>Denominación:</b> {denelemento} <br/>');
            tplMarkup.push('<b><font color = "red">Denominación:</b> {denelemento} </font><br/>');
        }
        if (seleccionadaA.descelemento != actualA.descelemento) {
            tplMarkup.remove('<b>Descripción:</b> {descelemento}<br/>');
            tplMarkup.push('<b><font color = "red">Descripción:</b> {descelemento} </font><br/>');
        }
        if (seleccionadaA.idautor != actualA.idautor) {
            tplMarkup.remove('<b>Autor:</b> {idautor}<br/>');
            tplMarkup.push('<b><font color = "red">Autor:</b> {idautor} </font><br/>');
        }
        if (seleccionadaA.fecha != actualA.fecha) {
            tplMarkup.remove('<b>Fecha:</b> {fecha}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha:</b> {fecha} </font><br/>');
        }
        if (seleccionadaA.fechainicio != actualA.fechainicio) {
            tplMarkup.remove('<b>Fecha de inicio:</b> {fechainicio}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha de inicio:</b> {fechainicio} </font><br/>');
        }
        if (seleccionadaA.fechafin != actualA.fechafin) {
            tplMarkup.remove('<b>Fecha de fin:</b> {fechafin}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha de fin:</b> {fechafin} </font><br/>');
        }
        if (seleccionadaA.gradocumplimiento != actualA.gradocumplimiento) {
            tplMarkup.remove('<b>% de cumplimiento:</b> {gradocumplimiento}<br/>');
            tplMarkup.push('<b><font color = "red">% de cumplimiento:</b> {gradocumplimiento} </font><br/>');
        }
        var tplElem = new Ext.Template(tplMarkup);
        tplElem.overwrite(_this.panelselectPlan.body, seleccionadaA);
        tplElem.overwrite(_this.panelactualPlan.body, actualA);
    };

    //*** FUNCION COMPARAR VERSION ACTUAL DE PLANES ***
    this.CompararActualPlan = function () {
        var idhistorial = _this.smPlanes.getSelections()[0].data.idhistorial;
        var idelemento = _this.smPlanes.getSelections()[0].data.car;
        var mensajeMascara = 'Cargando comparación';
        _this.BarraProgreso.show(mensajeMascara);
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmphistorial/compactualplan',
            params: {
                idelemento: idelemento,
                idhistorial: idhistorial
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.actual == null) {
                    mostrarMensaje(2, 'No existe una versión actual.');
                } else {
                    _this.WinActualPlan.show();
                    setTimeout(function () {
                        Ext.getCmp('btnCerrarCmpPlan').focus(true);
                    }, 500);
                    _this.showTplPlan(responseData.seleccionada, responseData.actual);
                }
            }
        });
    };
    //*** FUNCION SOBRESCRIBIR PLAN ACTUAL *** ***
    this.sobrescribirPlan = function (sm) {
        mostrarMensaje(2, '¿Est&aacute; seguro que quiere sobrescribir la información actual?', function (btnoprimido) {
            if (btnoprimido == 'ok') {
                var mensajeMascara = 'Sobrescribiendo';
                _this.BarraProgreso.show(mensajeMascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/modificarplan',
                    params: {
                        idplan: sm.getSelections()[0].data.car,
                        tfdenominacion: sm.getSelections()[0].data.denominacion,
                        hedescripcion: sm.getSelections()[0].data.descelemento,
                        porcientocump: sm.getSelections()[0].data.gradocumplimiento,
                        fini: sm.getSelections()[0].data.fechainicio,
                        ffin: sm.getSelections()[0].data.fechafin
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            _this.CompararActualPlan();
                            mostrarMensaje(1, 'La información actual ha sido actualizada satisfactoriamente.');
                            _this.stPlanes.reload();
                            //Ext.getCmp('btnSobrescribirPlan').disable();
                        }
                    }
                });
            }
        });
    };
    //*** FUNCION ELIMINAR PLANES ****
    this.EliminarPlanes = function () {
        var arrayPlanesAEliminar = [];
        var arrayPlanesSeleccionados = _this.smPlanes.getSelections();
        if (arrayPlanesSeleccionados.length > 0) {
            for (var i = 0; i < arrayPlanesSeleccionados.length; i++) {
                arrayPlanesAEliminar[i] = arrayPlanesSeleccionados[i].data.idhistorial;
            }
        }
        if (arrayPlanesSeleccionados.length == 1) {
            var mesageEliminar = '¿Est&aacute; seguro que quiere eliminar el histórico seleccionado?';
            var meageEliminado = 'El histórico ha sido eliminado satisfactoriamente.';
        } else {
            mesageEliminar = '¿Est&aacute; seguro que quiere eliminar los históricos seleccionados?';
            meageEliminado = 'Los históricos han sido eliminados satisfactoriamente.';
        }
        mostrarMensaje(2, mesageEliminar, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                var mensajeMascara = 'Eliminando';
                _this.BarraProgreso.show(mensajeMascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmphistorial/eliminarhistorial',
                    params: {
                        array_idhistorial: Ext.encode(arrayPlanesAEliminar)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(2, meageEliminado);
                            _this.stPlanes.reload();
                        }
                    }
                });
            }
        });
    };
    //***** **** FUNCIONES DE ACTIVIDADES ***** ***** *****
    // *** PANELES DE COMPARACION CON VERSION ACTUAL DE ACTIVIDADES ***
    this.panelselectAct = new Ext.Panel({
        width: 270,
        height: 300,
        autoScroll: true,
        bodyStyle: {
            background: '#ffffff',
            padding: '7px'
        }
    });
    this.panelactualAct = new Ext.Panel({
        width: 270,
        height: 300,
        autoScroll: true,
        bodyStyle: {
            background: '#ffffff',
            padding: '7px'
        }
    });
    //*** VENTANA COMPARAR VERSION ACTUAL DE ACTIVIDADES *** ***
    this.WinActualActividad = new Ext.Window({
        modal: true,
        constrain: true,
        frame: true,
        shadow: false,
        closeAction: 'hide',
        resizable: false,
        layout: 'column',
        title: 'Comparar con versión actual',
        width: 570,
        height: 385,
        border: false,
        bodyStyle: {
            padding: '2px'
        },
        monitorResize: true,
        items: [{
            columnWidth: .50,
            height: 315,
            items: [{
                xtype: 'label',
                html: '<b>Versión seleccionada</b><br/>'
            }, _this.panelselectAct]
        }, {
            columnWidth: .50,
            height: 315,
            items: [{
                xtype: 'label',
                html: '<b>Versión actual</b><br/>'
            }, _this.panelactualAct]
        }],
        buttons: [/*{
            id:'idSobreescribirAct',
            nextTab:'idCerrarCmpActAct',
            prevTab:'idCerrarCmpActAct',
            iconCls: 'buscaryremplazar',
            text: 'Sobrescribir',
            tooltip: 'Sobrescribir toda la información actual',
            handler: function () {
                _this.sobrescribirActividad(_this.smActividades)
            }
        },*/ {
            id: 'idCerrarCmpActAct',
            nextTab: 'idCerrarCmpActAct',
            prevTab: 'idCerrarCmpActAct',
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            handler: function () {
                _this.WinActualActividad.hide();
            }
        }]
    });

    /// FIP

    this.panelselectFIP = new Ext.Panel({
        width: 270,
        height: 300,
        autoScroll: true,
        bodyStyle: {
            background: '#ffffff',
            padding: '7px'
        }
    });
    this.panelactualFIP = new Ext.Panel({
        width: 270,
        height: 300,
        autoScroll: true,
        bodyStyle: {
            background: '#ffffff',
            padding: '7px'
        }
    });
    this.WinActualFIP = new Ext.Window({
        modal: true,
        constrain: true,
        frame: true,
        shadow: false,
        closeAction: 'hide',
        resizable: false,
        layout: 'column',
        title: 'Comparar con versión actual',
        width: 570,
        height: 385,
        border: false,
        bodyStyle: {
            padding: '2px'
        },
        monitorResize: true,
        items: [{
            columnWidth: .50,
            height: 315,
            items: [{
                xtype: 'label',
                html: '<b>Versión seleccionada</b><br/>'
            }, _this.panelselectFIP]
        }, {
            columnWidth: .50,
            height: 315,
            items: [{
                xtype: 'label',
                html: '<b>Versión actual</b><br/>'
            }, _this.panelactualFIP]
        }],
        buttons: [/*{
         id:'idSobreescribirAct',
         nextTab:'idCerrarCmpActAct',
         prevTab:'idCerrarCmpActAct',
         iconCls: 'buscaryremplazar',
         text: 'Sobrescribir',
         tooltip: 'Sobrescribir toda la información actual',
         handler: function () {
         _this.sobrescribirActividad(_this.smActividades)
         }
         },*/ {
            id: 'idCerrarCmpFIP',
            nextTab: 'idCerrarCmpFIP',
            prevTab: 'idCerrarCmpFIP',
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            handler: function () {
                _this.WinActualFIP.hide();
            }
        }]
    });

    //*** DIBUJAR VERSION ACTUAL DE ACTIVIDADES ***
    this.showTplActualAct = function (seleccionadaA, actualA) {
        var tplMarkup = [
            '<b>Denominación:</b> {denelemento} <br/>',
            '<b>Descripción:</b> {descelemento}<br/>',
            '<b>Autor:</b> {idautor}<br/>',
            '<b>Fecha:</b> {fecha}<br/>',
            '<b>Fecha de inicio:</b> {fechainicio}<br/>',
            '<b>Fecha de fin:</b> {fechafin}<br/>',
            '<b>Hora de inicio:</b> {horainicio}<br/>',
            '<b>Hora de fin:</b> {horafin}<br/>',
            '<b>% de cumplimiento:</b> {gradocumplimiento}<br/>',
            '<b>Estado:</b> {estado}<br/>',
            '<b>Participantes:</b> {participante}<br/>',
            '<b>Dirigentes:</b> {dirigente}<br/>',
            '<b>Involucrados:</b> {involucrados}<br/>'
        ];
        if (seleccionadaA.horainicio != actualA.horainicio) {
            tplMarkup.remove('<b>Hora de inicio:</b> {horainicio}<br/>');
            tplMarkup.push('<b><font color = "red">Hora de inicio:</b> {horainicio} </font><br/>');
        }
        if (seleccionadaA.horafin != actualA.horafin) {
            tplMarkup.remove('<b>Hora de fin:</b> {horafin}<br/>');
            tplMarkup.push('<b><font color = "red">Hora de fin:</b> {horafin} </font><br/>');
        }
        if (seleccionadaA.denelemento != actualA.denelemento) {
            tplMarkup.remove('<b>Denominación:</b> {denelemento} <br/>');
            tplMarkup.push('<b><font color = "red">Denominación:</b> {denelemento} </font><br/>');
        }
        if (seleccionadaA.descelemento != actualA.descelemento) {
            tplMarkup.remove('<b>Descripción:</b> {descelemento}<br/>');
            tplMarkup.push('<b><font color = "red">Descripción:</b> {descelemento} </font><br/>');
        }
        if (seleccionadaA.idautor != actualA.idautor) {
            tplMarkup.remove('<b>Autor:</b> {idautor}<br/>');
            tplMarkup.push('<b><font color = "red">Autor:</b> {idautor} </font><br/>');
        }
        if (seleccionadaA.fecha != actualA.fecha) {
            tplMarkup.remove('<b>Fecha:</b> {fecha}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha:</b> {fecha} </font><br/>');
        }
        if (seleccionadaA.fechainicio != actualA.fechainicio) {
            tplMarkup.remove('<b>Fecha de inicio:</b> {fechainicio}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha de inicio:</b> {fechainicio} </font><br/>');
        }
        if (seleccionadaA.fechafin != actualA.fechafin) {
            tplMarkup.remove('<b>Fecha de fin:</b> {fechafin}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha de fin:</b> {fechafin} </font><br/>');
        }
        if (seleccionadaA.gradocumplimiento != actualA.gradocumplimiento) {
            tplMarkup.remove('<b>% de cumplimiento:</b> {gradocumplimiento}<br/>');
            tplMarkup.push('<b><font color = "red">% de cumplimiento:</b> {gradocumplimiento} </font><br/>');
        }
        if (seleccionadaA.estado != actualA.estado) {
            tplMarkup.remove('<b>Estado:</b> {estado}<br/>');
            tplMarkup.push('<b><font color = "red">Estado:</b> {estado} </font><br/>');
        }
        if (seleccionadaA.participante != actualA.participante) {
            tplMarkup.remove('<b>Participantes:</b> {participante}<br/>');
            tplMarkup.push('<b><font color = "red">Participantes:</b> {participante} </font><br/>');
        }
        if (seleccionadaA.dirigente != actualA.dirigente) {
            tplMarkup.remove('<b>Dirigentes:</b> {dirigente}<br/>');
            tplMarkup.push('<b><font color = "red">Dirigentes:</b> {dirigente} </font><br/>');
        }
        if (seleccionadaA.involucrados != actualA.involucrados) {
            tplMarkup.remove('<b>Involucrados:</b> {involucrados}<br/>');
            tplMarkup.push('<b><font color = "red">Involucrados:</b> {involucrados} </font><br/>');
        }
        var tplElem = new Ext.Template(tplMarkup);
        tplElem.overwrite(_this.panelselectAct.body, seleccionadaA);
        tplElem.overwrite(_this.panelactualAct.body, actualA);
    };

    /// FIP

    this.showTplActualFIP = function (seleccionadaA, actualA) {
        var tplMarkup = [
            '<b>Denominación:</b> {denelemento} <br/>',
            '<b>Descripción:</b> {descelemento}<br/>',
            '<b>Autor:</b> {idautor}<br/>',
            '<b>Fecha:</b> {fecha}<br/>',
            '<b>Fecha de inicio:</b> {fechainicio}<br/>',
            '<b>Fecha de fin:</b> {fechafin}<br/>',
            '<b>% de cumplimiento:</b> {gradocumplimiento}<br/>',
            '<b>Participantes:</b> {participante}<br/>',
            '<b>Dirigentes:</b> {dirigente}<br/>',
            '<b>Involucrados:</b> {involucrados}<br/>'
        ];
        /*if (seleccionadaA.horainicio != actualA.horainicio) {
            tplMarkup.remove('<b>Hora de inicio:</b> {horainicio}<br/>');
            tplMarkup.push('<b><font color = "red">Hora de inicio:</b> {horainicio} </font><br/>');
        }
        if (seleccionadaA.horafin != actualA.horafin) {
            tplMarkup.remove('<b>Hora de fin:</b> {horafin}<br/>');
            tplMarkup.push('<b><font color = "red">Hora de fin:</b> {horafin} </font><br/>');
        }*/
        if (seleccionadaA.denelemento != actualA.denelemento) {
            tplMarkup.remove('<b>Denominación:</b> {denelemento} <br/>');
            tplMarkup.push('<b><font color = "red">Denominación:</b> {denelemento} </font><br/>');
        }
        if (seleccionadaA.descelemento != actualA.descelemento) {
            tplMarkup.remove('<b>Descripción:</b> {descelemento}<br/>');
            tplMarkup.push('<b><font color = "red">Descripción:</b> {descelemento} </font><br/>');
        }
        if (seleccionadaA.idautor != actualA.idautor) {
            tplMarkup.remove('<b>Autor:</b> {idautor}<br/>');
            tplMarkup.push('<b><font color = "red">Autor:</b> {idautor} </font><br/>');
        }
        if (seleccionadaA.fecha != actualA.fecha) {
            tplMarkup.remove('<b>Fecha:</b> {fecha}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha:</b> {fecha} </font><br/>');
        }
        if (seleccionadaA.fechainicio != actualA.fechainicio) {
            tplMarkup.remove('<b>Fecha de inicio:</b> {fechainicio}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha de inicio:</b> {fechainicio} </font><br/>');
        }
        if (seleccionadaA.fechafin != actualA.fechafin) {
            tplMarkup.remove('<b>Fecha de fin:</b> {fechafin}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha de fin:</b> {fechafin} </font><br/>');
        }
        if (seleccionadaA.gradocumplimiento != actualA.gradocumplimiento) {
            tplMarkup.remove('<b>% de cumplimiento:</b> {gradocumplimiento}<br/>');
            tplMarkup.push('<b><font color = "red">% de cumplimiento:</b> {gradocumplimiento} </font><br/>');
        }
        if (seleccionadaA.participante != actualA.participante) {
            tplMarkup.remove('<b>Participantes:</b> {participante}<br/>');
            tplMarkup.push('<b><font color = "red">Participantes:</b> {participante} </font><br/>');
        }
        if (seleccionadaA.dirigente != actualA.dirigente) {
            tplMarkup.remove('<b>Dirigentes:</b> {dirigente}<br/>');
            tplMarkup.push('<b><font color = "red">Dirigentes:</b> {dirigente} </font><br/>');
        }
        if (seleccionadaA.involucrados != actualA.involucrados) {
            tplMarkup.remove('<b>Involucrados:</b> {involucrados}<br/>');
            tplMarkup.push('<b><font color = "red">Involucrados:</b> {involucrados} </font><br/>');
        }
        var tplElem = new Ext.Template(tplMarkup);
        tplElem.overwrite(_this.panelselectFIP.body, seleccionadaA);
        tplElem.overwrite(_this.panelactualFIP.body, actualA);
    };

    this.CompararActualFIP = function () {
        var idhistorial = _this.smFIP.getSelections()[0].data.idhistorial;
        var idelemento = _this.smFIP.getSelections()[0].data.car;
        var mensajeMascara = 'Cargando comparación';
        _this.BarraProgreso.show(mensajeMascara);
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmphistorial/compactualfip',
            params: {
                idelemento: idelemento,
                idhistorial: idhistorial
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);

                if (responseData.actual == null) {
                    mostrarMensaje(2, 'No existe una versión actual.');
                } else {
                    _this.WinActualFIP.show();
                    setTimeout(function () {
                        Ext.getCmp('idCerrarCmpFIP').focus(true);
                    }, 500);
                    _this.showTplActualFIP(responseData.seleccionada, responseData.actual);
                }
            }
        });
    };

    //*** FUNCION COMPARAR VERSION ACTUAL DE ACTIVIDADES *** ***
    this.CompararActualAct = function () {
        var idhistorial = _this.smActividades.getSelections()[0].data.idhistorial;
        var idelemento = _this.smActividades.getSelections()[0].data.car;
        var mensajeMascara = 'Cargando comparación';
        _this.BarraProgreso.show(mensajeMascara);
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmphistorial/compactualactividad',
            params: {
                idelemento: idelemento,
                idhistorial: idhistorial
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);

                if (responseData.actual == null) {
                    mostrarMensaje(2, 'No existe una versión actual.');
                } else {
                    _this.WinActualActividad.show();
                    setTimeout(function () {
                        Ext.getCmp('idCerrarCmpActAct').focus(true);
                    }, 500);
                    _this.showTplActualAct(responseData.seleccionada, responseData.actual);
                }
            }
        });
    };
    //**** **** FUNCION SOBRESCRIBIR ACTIVIDAD ACTUAL *** ***
    this.sobrescribirActividad = function (sm) {
        var denelemento = sm.getSelections()[0].data.denominacion;
        var involucrados = sm.getSelections()[0].data.involucrados;
        mostrarMensaje(2, '¿Est&aacute; seguro que quiere sobrescribir la información actual?', function (btnoprimido) {
            if (btnoprimido == 'ok') {
                var mensajeMascara = 'Sobrescribiendo';
                _this.BarraProgreso.show(mensajeMascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/modificaractividad',
                    params: {
                        idactividad: sm.getSelections()[0].data.car,
                        denominactividad: Ext.encode(denelemento),
                        hedescripcionact: sm.getSelections()[0].data.descelemento,
                        porcientocumpact: sm.getSelections()[0].data.gradocumplimiento,
                        finiact: sm.getSelections()[0].data.fechainicio,
                        ffinact: sm.getSelections()[0].data.fechafin,
                        tmfhoraact: sm.getSelections()[0].data.horainicio,
                        tmfhorafinact: sm.getSelections()[0].data.horafin,
                        hedirigentesact: sm.getSelections()[0].data.dirigente,
                        heparticipantesact: sm.getSelections()[0].data.participante,
                        arrayinvolucrados: Ext.encode(involucrados)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            _this.CompararActualAct();
                            mostrarMensaje(1, 'La información actual ha sido actualizada satisfactoriamente.');
                            _this.stActividades.reload();
                            //Ext.getCmp('idSobreescribirAct').disable();
                        }
                    }
                });
            }
        });
    };
    //*** ELIMINAR ACTIVIDADES *** *** *** ***
    this.EliminarActividades = function () {
        var arrayActividadesAEliminar = [];
        var arrayActividadesSeleccionados = _this.smActividades.getSelections();
        if (arrayActividadesSeleccionados.length > 0) {
            for (var i = 0; i < arrayActividadesSeleccionados.length; i++) {
                arrayActividadesAEliminar[i] = arrayActividadesSeleccionados[i].data.idhistorial;
            }
        }
        if (arrayActividadesSeleccionados.length == 1) {
            var mesageEliminar = '¿Est&aacute; seguro que quiere eliminar el histórico seleccionado?';
            var meageEliminado = 'El histórico ha sido eliminado satisfactoriamente.';
        } else {
            mesageEliminar = '¿Est&aacute; seguro que quiere eliminar los históricos seleccionados?';
            meageEliminado = 'Los históricos han sido eliminados satisfactoriamente.';
        }
        mostrarMensaje(2, mesageEliminar, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                var mensajeMascara = 'Eliminando';
                _this.BarraProgreso.show(mensajeMascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmphistorial/eliminarhistorial',
                    params: {
                        array_idhistorial: Ext.encode(arrayActividadesAEliminar)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(2, meageEliminado);
                            _this.stActividades.reload();
                        }
                    }
                });
            }
        });
    };

    /// FIP

    this.EliminarFIP = function () {
        var arrayFIPAEliminar = [];
        var arrayFIPSeleccionados = _this.smFIP.getSelections();
        if (arrayFIPSeleccionados.length > 0) {
            for (var i = 0; i < arrayFIPSeleccionados.length; i++) {
                arrayFIPAEliminar[i] = arrayFIPSeleccionados[i].data.idhistorial;
            }
        }
        if (arrayFIPSeleccionados.length == 1) {
            var mesageEliminar = '¿Est&aacute; seguro que quiere eliminar el histórico seleccionado?';
            var meageEliminado = 'El histórico ha sido eliminado satisfactoriamente.';
        } else {
            mesageEliminar = '¿Est&aacute; seguro que quiere eliminar los históricos seleccionados?';
            meageEliminado = 'Los históricos han sido eliminados satisfactoriamente.';
        }
        mostrarMensaje(2, mesageEliminar, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                var mensajeMascara = 'Eliminando';
                _this.BarraProgreso.show(mensajeMascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmphistorial/eliminarhistorial',
                    params: {
                        array_idhistorial: Ext.encode(arrayFIPAEliminar)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(2, meageEliminado);
                            _this.stFIP.reload();
                        }
                    }
                });
            }
        });
    };

    //******  FUNCIONES DE OBJETIVOS ***********
    // *** *** PANELES PARA COMPARAR VERSION ACTUAL DE OBJETIVOS ***
    this.panelselectObj = new Ext.Panel({
        width: 270,
        height: 300,
        autoScroll: true,
        bodyStyle: {
            background: '#ffffff',
            padding: '7px'
        }
    });
    this.panelactualObj = new Ext.Panel({
        width: 270,
        height: 300,
        autoScroll: true,
        bodyStyle: {
            background: '#ffffff',
            padding: '7px'
        }
    });
    //*** VENTANA COMPARAR VERSION ACTUAL DE OBJETIVOS *** ***
    this.WinActualObjetivo = new Ext.Window({
        modal: true,
        frame: true,
        constrain: true,
        shadow: false,
        closeAction: 'hide',
        resizable: false,
        layout: 'column',
        title: 'Comparar con versión actual',
        width: 570,
        height: 385,
        border: false,
        bodyStyle: {
            padding: '2px'
        },
        monitorResize: true,
        items: [{
            columnWidth: .50,
            height: 315,
            items: [{
                xtype: 'label',
                html: '<b>Versión seleccionada</b><br/>'
            }, _this.panelselectObj]
        }, {
            columnWidth: .50,
            height: 315,
            items: [{
                xtype: 'label',
                html: '<b>Versión actual</b><br/>'
            }, _this.panelactualObj]
        }],
        buttons: [/*{
            id:'idSobreEscrObj',
            nextTab:'idCerrarCmpActObj',
            prevTab:'idCerrarCmpActObj',
            iconCls: 'buscaryremplazar',
            text: 'Sobrescribir',
            tooltip: 'Sobrescribir toda la información actual',
            handler: function () {
                _this.sobrescribirObjetivo(_this.smObjetivos);
            }
        }, */{
            id: 'idCerrarCmpActObj',
            nextTab: 'idCerrarCmpActObj',
            prevTab: 'idCerrarCmpActObj',
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            handler: function () {
                _this.WinActualObjetivo.hide();
            }
        }]
    });
    //***DIBUJAR VERSION ACTUAL OBJETIVOS ***
    this.showTplActualObj = function (seleccionadaA, actualA) {
        var tplMarkup = [
            '<b>Denominación:</b> {denelemento} <br/>',
            '<b>Descripción:</b> {descelemento}<br/>',
            '<b>Autor:</b> {idautor}<br/>',
            '<b>Fecha:</b> {fecha}<br/>',
            '<b>Fecha de inicio:</b> {fechainicio}<br/>',
            '<b>Fecha de fin:</b> {fechafin}<br/>',
            '<b>% de cumplimiento:</b> {gradocumplimiento}<br/>',
            '<b>Participantes:</b> {participante}<br/>',
            '<b>Dirigentes:</b> {dirigente}<br/>',
            '<b>Involucrados:</b> {involucrados}<br/>'
        ];
        if (seleccionadaA.denelemento != actualA.denelemento) {
            tplMarkup.remove('<b>Denominación:</b> {denelemento} <br/>');
            tplMarkup.push('<b><font color = "red">Denominación:</b> {denelemento} </font><br/>');
        }
        if (seleccionadaA.descelemento != actualA.descelemento) {
            tplMarkup.remove('<b>Descripción:</b> {descelemento}<br/>');
            tplMarkup.push('<b><font color = "red">Descripción:</b> {descelemento} </font><br/>');
        }
        if (seleccionadaA.idautor != actualA.idautor) {
            tplMarkup.remove('<b>Autor:</b> {idautor}<br/>');
            tplMarkup.push('<b><font color = "red">Autor:</b> {idautor} </font><br/>');
        }
        if (seleccionadaA.fecha != actualA.fecha) {
            tplMarkup.remove('<b>Fecha:</b> {fecha}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha:</b> {fecha} </font><br/>');
        }
        if (seleccionadaA.fechainicio != actualA.fechainicio) {
            tplMarkup.remove('<b>Fecha de inicio:</b> {fechainicio}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha de inicio:</b> {fechainicio} </font><br/>');
        }
        if (seleccionadaA.fechafin != actualA.fechafin) {
            tplMarkup.remove('<b>Fecha de fin:</b> {fechafin}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha de fin:</b> {fechafin} </font><br/>');
        }
        if (seleccionadaA.gradocumplimiento != actualA.gradocumplimiento) {
            tplMarkup.remove('<b>% de cumplimiento:</b> {gradocumplimiento}<br/>');
            tplMarkup.push('<b><font color = "red">% de cumplimiento:</b> {gradocumplimiento} </font><br/>');
        }
        if (seleccionadaA.participante != actualA.participante) {
            tplMarkup.remove('<b>Participantes:</b> {participante}<br/>');
            tplMarkup.push('<b><font color = "red">Participantes:</b> {participante} </font><br/>');
        }
        if (seleccionadaA.dirigente != actualA.dirigente) {
            tplMarkup.remove('<b>Dirigentes:</b> {dirigente}<br/>');
            tplMarkup.push('<b><font color = "red">Dirigentes:</b> {dirigente} </font><br/>');
        }
        if (seleccionadaA.involucrados != actualA.involucrados) {
            tplMarkup.remove('<b>Involucrados:</b> {involucrados}<br/>');
            tplMarkup.push('<b><font color = "red">Involucrados:</b> {involucrados} </font><br/>');
        }
        var tplElem = new Ext.Template(tplMarkup);
        tplElem.overwrite(_this.panelselectObj.body, seleccionadaA);
        tplElem.overwrite(_this.panelactualObj.body, actualA);
    };

    //*** FUNCION COMPARAR VERSION ACTUAL DE OBJETIVOS *** ***
    this.CompararActualObj = function () {
        var idhistorial = _this.smObjetivos.getSelections()[0].data.idhistorial;
        var idelemento = _this.smObjetivos.getSelections()[0].data.car;
        var mensajeMascara = 'Cargando comparación';
        _this.BarraProgreso.show(mensajeMascara);
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmphistorial/compactualobjetivo',
            params: {
                idelemento: idelemento,
                idhistorial: idhistorial
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.actual == null) {
                    mostrarMensaje(2, 'No existe una versión actual.');
                } else {
                    _this.WinActualObjetivo.show();
                    setTimeout(function () {
                        Ext.getCmp('idCerrarCmpActObj').focus(true);
                    }, 500);
                    _this.showTplActualObj(responseData.seleccionada, responseData.actual);
                }
            }
        });
    };
    //*** FUNCION SOBRESCRIBIR OBJETIVO ACTUAL *** ***
    this.sobrescribirObjetivo = function (sm) {
        //var denelemento = sm.getSelections()[0].data.denominacion;		
        var involucrados = sm.getSelections()[0].data.involucrados;
        mostrarMensaje(2, '¿Est&aacute; seguro que quiere sobrescribir la información actual?', function (btnoprimido) {
            if (btnoprimido == 'ok') {
                var mensajeMascara = 'Sobrescribiendo';
                _this.BarraProgreso.show(mensajeMascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/modificarobjetivo',
                    params: {
                        idobjetivo: sm.getSelections()[0].data.car,
                        tfdenominacionobj: sm.getSelections()[0].data.denominacion,
                        hedescripcionobj: sm.getSelections()[0].data.descelemento,
                        porcientocumpobj: sm.getSelections()[0].data.gradocumplimiento,
                        finiobj: sm.getSelections()[0].data.fechainicio,
                        ffinobj: sm.getSelections()[0].data.fechafin,
                        hedirigentesobj: sm.getSelections()[0].data.dirigente,
                        heparticipantesobj: sm.getSelections()[0].data.participante,
                        arrayinvolucrados: Ext.encode(involucrados)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            _this.CompararActualObj();
                            mostrarMensaje(1, 'La información actual ha sido actualizada satisfactoriamente.');
                            _this.stObjetivos.reload();
                            //Ext.getCmp('idSobreEscrObj').disable();

                        }
                    }
                });
            }
        });
    };
    //*** FUNCION ELIMINAR OBJETIVO *** ***
    this.EliminarObjetivos = function () {
        var arrayObjetivosAEliminar = [];
        var arrayObjetivosSeleccionados = _this.smObjetivos.getSelections();
        if (arrayObjetivosSeleccionados.length > 0) {
            for (var i = 0; i < arrayObjetivosSeleccionados.length; i++) {
                arrayObjetivosAEliminar[i] = arrayObjetivosSeleccionados[i].data.idhistorial;
            }
        }
        if (arrayObjetivosSeleccionados.length == 1) {
            var mesageEliminar = '¿Est&aacute; seguro que quiere eliminar el histórico seleccionado?';
            var meageEliminado = 'El histórico ha sido eliminado satisfactoriamente.';
        } else {
            mesageEliminar = '¿Est&aacute; seguro que quiere eliminar los históricos seleccionados?';
            meageEliminado = 'Los históricos han sido eliminados satisfactoriamente.';
        }
        mostrarMensaje(2, mesageEliminar, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                var mensajeMascara = 'Eliminando';
                _this.BarraProgreso.show(mensajeMascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmphistorial/eliminarhistorial',
                    params: {
                        array_idhistorial: Ext.encode(arrayObjetivosAEliminar)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(2, meageEliminado);
                            _this.stObjetivos.reload();
                        }
                    }
                });
            }
        });
    };
    //Dado un elemento devuelve un panel con el historial del mismo
    this.devolverpaneles = function (panel, idelemento) {
        _this.BarraProgreso.show('Cargando historial');
        if (panel == 'obj') {
            _this.stObjetivos.baseParams.idelemento = idelemento;
            _this.stObjetivos.load({
                params: {
                    idelemento: idelemento
                }
            });
            return _this.PanelObjetivosCentro;
        } else if (panel == 'act') {
            _this.stActividades.baseParams.idelemento = idelemento;
            _this.stActividades.load({
                params: {
                    idelemento: idelemento
                }
            });
            return _this.PanelActividadesCentro;
        } else {
            _this.stPlanes.baseParams.idelemento = idelemento;
            _this.stPlanes.load({
                params: {
                    idelemento: idelemento
                }
            });
            return _this.PanelPlanesCentro;
        }
    };

//funciones para mostrar el icono "tipo de elemento"
    function MostrarImagenPlan(valor, m) {
        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
        return '<span class="icondistra-folder sipac-azul">' + ' ' + valor + '</span>';
    }

    function MostrarImagenAct(valor, m) {
        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
        return '<span class="icondistra-actividades sipac-azul">' + ' ' + valor + '</span>';
    }

    function MostrarImagenObj(valor, m) {
        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
        return '<span class="icondistra-archivo sipac-azul">' + ' ' + valor + '</span>';
    }

    function MostrarImagenFIP(valor, m) {
        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
        return '<span class="icondistra-ficha sipac-azul">' + ' ' + valor + '</span>';
    }


};