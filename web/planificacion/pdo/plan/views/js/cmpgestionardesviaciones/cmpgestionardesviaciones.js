Utilidades.Cmp.Cmpgestionardesviaciones = function (opcionesConfig) {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    Ext.QuickTips.init();
    this.pgactual = 0;
    var pgultima = 0;
    this.start = 0;
    this.flagDesvAsociadas = true;
    this.flagDesvNoAsociadas = true;
    this.arrayIniDesvAsoc = [];
    this.arrayIniDesvNoAsoc = [];

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto CRUD-DESVIACIONES inicializado
    this.objCrudDesviaciones = new Utilidades.Cmp.Cmpcruddesviaciones();

    //objeto CRUD-ACTIVIDADES inicializado
    //this.objCrudActividad = new Utilidades.Cmp.Cmpcrudactividades();

    //objeto del componente "clasificador de involucrados"
    //this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();
    this.arrayIncidenciasAsociadas = [];
    this.arrayDesvSeleccionadas = [];
    this.paraid = 0;
    //variables     

    this.btnAdicionarDesv = new Ext.Button({
        handler: function () {
            _this.objCrudDesviaciones.CrearWinFormDesviaciones(_this.PostAccionesGestionar, 'adicionar', null);
        },
        disabled: false,
        hidden: opcionesConfig.noUsarAdicionar,
        iconCls: 'adicionar',
        tooltip: 'Adicionar desviaci&oacute;n',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });

    this.btnModificarDesv = new Ext.Button({
        handler: function () {
          // console.log(_this.smDesviaciones.getSelections()[0].data) ;
            _this.objCrudDesviaciones.CrearWinFormDesviaciones(_this.PostAccionesGestionar, 'modificar', _this.smDesviaciones);

        },
        disabled: true,
        hidden: opcionesConfig.noUsarModificar,
        iconCls: 'modificar',
        tooltip: 'Modificar desviaci&oacute;n',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });

    this.btnEliminarDesv = new Ext.Button({
        handler: function () {
            _this.EliminarDesviacion();
        },
        disabled: true,
        hidden: opcionesConfig.noUsarEliminar,
        iconCls: 'eliminar',
        tooltip: 'Eliminar desviaci&oacute;n',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });

    this.btnActivarDesv = new Ext.Button({
        handler: function () {
            _this.DesActivarDesviacion(1);
        },
        iconCls: 'habilitar',
        disabled: true,
        hidden: opcionesConfig.noUsarDesactivar,
        tooltip: 'Activar desviaci&oacute;n',
        key: {
            alt: true,
            key: 'X'
        },
        scope: this
    });

    this.btnDesactivarDesv = new Ext.Button({
        handler: function () {
            _this.DesActivarDesviacion(0);
        },
        iconCls: 'deshabilitar',
        disabled: true,
        hidden: opcionesConfig.noUsarDesactivar,
        tooltip: 'Desactivar desviaci&oacute;n',
        key: {
            alt: true,
            key: 'F'
        },
        scope: this
    });

    this.btnLimpiarDesv = new Ext.Button({
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar',
        hidden: opcionesConfig.noUsarLimpiar,
        key: {
            alt: true,
            key: 'L'
        },
        scope: this,
        handler: function () {
            _this.filtrosDesv.clearFilters();
        }
    });

    this.btnAyudaDesv = new Ext.Button({
        id: 'btnAyudaGestDesviaciones',
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
    this.btnPublicarTodasDesv = new Ext.Button({
        id: 'btnPublicarTodos',
        tooltip: 'Publicar todas las desviaciones',
        hidden: opcionesConfig.noUsarPublicacion,
        iconCls: 'icondistra-publicar sipac-verde',
        handler: function () {
            _this.objCrudDesviaciones.CrearVentanaPublicarDesv(
                true, _this.stDesviaciones, _this.smDesviaciones, _this.PostAccionesGestionar);
        },
        key: {
            ctrl: true,
            key: 'P'
        },
        scope: this
    });
    this.btnDespublicarTodasDesv = new Ext.Button({
        id: 'btnDespublicartodos',
        tooltip: 'Despublicar todas las desviaciones',
        hidden: opcionesConfig.noUsarPublicacion,
        iconCls: 'icondistra-publicar sipac-roja',
        handler: function () {
            _this.objCrudDesviaciones.DespublicarTodos(_this.stDesviaciones, _this.PostAccionesGestionar);
        },
        key: {
            shift: true,
            key: 'P'
        },
        scope: this
    });

    ////*****
    this.btnPublicarDesv = new Ext.Button({
        id: 'btnPublicarDesv',
        tooltip: 'Publicar desviaci&oacuten',
        hidden: opcionesConfig.noUsarPublicacion,
        disabled: true,
        iconCls: 'icondistra-publicar',
        handler: function () {
            _this.objCrudDesviaciones.CrearVentanaPublicarDesv(
                true, _this.stDesviaciones, _this.smDesviaciones, _this.PostAccionesGestionar);
        },
        key: {
            alt: true,
            key: 'Y'
        },
        scope: this
    });
    this.btnDespublicarDesv = new Ext.Button({
        id: 'btnDespublicarDesv',
        tooltip: 'Despublicar desviaci&oacuten',
        hidden: opcionesConfig.noUsarPublicacion,
        iconCls: 'icondistra-publicar sipac-roja',
        disabled: true,
        handler: function () {
            _this.DespublicarDesviacion(_this.PostAccionesGestionar);
        },
        key: {
            ctrl: true,
            key: 'Y'
        },
        scope: this
    });
    this.btnEditarPublicacion = new Ext.Button({
        id: 'btnEditarPublicacion',
        tooltip: 'Editar publicidad de la desviaci&oacuten',
        hidden: true,
        disabled: true,
        iconCls: 'icondistra-editar',
        handler: function () {
            _this.objCrudDesviaciones.CrearVentanaPublicarDesv(
                false, _this.stDesviaciones, _this.smDesviaciones, _this.PostAccionesGestionar);
        },
        key: {
            ctrl: true,
            key: 'E'
        },
        scope: this
    });
    ///*****

    this.btnCancelar = new Ext.Button({
        handler: function () {
            _this.WinPrincipal.destroy();
        },
        disabled: false,
        text: 'Cerrar',
        iconCls: 'cerrar',
        tooltip: 'Cerrar ventana',
        hidden: opcionesConfig.noUsarSeleccionarWinP
    });

    this.btnSeleccionar = new Ext.Button({
        handler: function () {
            _this.RelacionarElementos();
        },
        disabled: true,
        text: 'Seleccionar',
        iconCls: 'seleccion',
        tooltip: 'Relacionar desviación(es) seleccionada(as)',
        hidden: opcionesConfig.noUsarSeleccionarWinP
    });

    /*this.filtrosDesv = new Ext.grid.GridFilters({
     filters: [{
     type: 'string_adaptado',
     dataIndex: 'idelemento',
     xtype: 'numberfield',
     maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
     maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
     }, {
     type: 'string',
     dataIndex: 'denominacion'
     },
     {
     type: 'string',
     dataIndex: 'descripcion'
     },
     {
     type: 'date',
     dataIndex: 'fechacreacion'
     }, {
     type: 'list',
     dataIndex: 'actual',
     options: ['Si', 'No']
     }]
     });*/

    this.stDesviaciones = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/cargardesviaciones',
        autoLoad: opcionesConfig.cargarDatos,
        reader: new Ext.data.JsonReader({
            id: 'id',
            root: "campos",
            totalProperty: "total"
        }, [
            {
                name: 'denominacion'
            }, {
                name: 'tipodesviacion'
            }, {
                name: 'asociados'
            }, {
                name: 'impacto'
            }, {
                name: 'publico'
            }, {
                name: 'activo'
            }, {
                name: 'cantdocafectados'
            }, {
                name: 'autor'
            }, {
                name: 'idelemento'
            }, {
                name: 'idtipoelemento'
            }, {
                name: 'idautor'
            }, {
                name: 'superior'
            }, {
                name: 'subordinado'
            }
        ]),
        listeners: {
            beforeload: function (s) {
                _this.BarraProgreso.show('Cargando...');
                s.baseParams.start = _this.pgactual;
            },
            load: function (st, rd) {
                st.each(function (record) {
                    Ext.get(record.data.idelemento).addListener('click', _this.CrearWinAsociarDesvAIncidencia, this, {
                        stopPropagation: true,
                        normalized: true,
                        preventDefault: true,
                        store: st,
                        record: record
                    });
                    Ext.get(record.data.idelemento + '-doc').addListener('click', _this.MostarDocumentosAfectados, this);
                });
                _this.BarraProgreso.hide();

                if (_this.gdDesviaciones.getStore().getCount() == 0 && !_this.posteliminar) {
                    if (_this.filtrosDesv.getFiltrosActivos() == undefined || _this.filtrosDesv.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
                if (st.lastOptions.params.accion == 'noasociadas' && _this.flagDesvNoAsociadas) {
                    _this.flagDesvNoAsociadas = false;
                    _this.arrayIniDesvNoAsoc = rd;
                }
                if (st.lastOptions.params.accion == 'asociadas' && _this.flagDesvAsociadas) {
                    _this.flagDesvAsociadas = false;
                    _this.arrayIniDesvAsoc = rd;
                }
                _this.posteliminar = false;
                _this.ActualizarEstadoBarraHerramientas();
            }
        }
    });
    this.smDesviaciones = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, ri, record) {
                _this.ActualizarEstadoBarraHerramientas();
            },
            rowdeselect: function (sm, ri, record) {
                _this.ActualizarEstadoBarraHerramientas();
            }
        }
    });
    this.cmDesviaciones = [
        _this.smDesviaciones,
        {
            id: 'expandir',
            header: "Denominación",
            width: 170,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: MostrarImagenTipoElemento
        }, {
            header: "Tipo de desviación",
            width: 150,
            dataIndex: 'tipodesviacion',
            sortable: true
        }, {
            header: "CAR",
            width: 150,
            dataIndex: 'idelemento',
            sortable: true
        }, {
            header: "Incidencias asociadas",
            width: 150,
            dataIndex: 'asociados',
            sortable: true,
            renderer: MostrarIncidenciasAsociadas
        }, {
            header: "Impacto",
            width: 80,
            dataIndex: 'impacto',
            sortable: true,
            renderer: MostrarImpacto
        }, {
            header: "P&uacute;blico",
            dataIndex: 'publico',
            width: 80,
            sortable: true,
            renderer: MostrarImagenT
        }, {
            header: "Activo",
            dataIndex: 'activo',
            width: 80,
            sortable: true,
            renderer: MostrarImagenActivo
        }, {
            header: "Documentos afectados",
            width: 150,
            dataIndex: 'cantdocafectados',
            sortable: true,
            renderer: MostrarDocumentosAfectados
        }, {
            header: "Autor",
            width: 100,
            dataIndex: 'autor',
            sortable: true
        }
    ];

    this.filtrosDesv = new Ext.grid.GridFilters({
        filters: [{
            type: 'numeric',
            dataIndex: 'asociados',
            xtype: 'numberfield',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskReregex: /^([0-9]+ ?[0-9]*)+$/
        }, {
            type: 'numeric',
            dataIndex: 'cantdocafectados',
            xtype: 'numberfield',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskReregex: /^([0-9]+ ?[0-9]*)+$/
        }, {
            type: 'string',
            dataIndex: 'denominacion'
        }, {
            type: 'string',
            dataIndex: 'autor'
        }, {
            type: 'listado',
            dataIndex: 'tipodesviacion',
            idcombo: 'idcbtipodesv',
            urlcb: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/cargartipodesviaciones',
            idstore: 'idstorenomencl',
            valueFieldcb: 'idtipo',
            displayFieldcb: 'denominacion'
        }, {
            type: 'list',
            dataIndex: 'impacto',
            options: ['Bajo', 'Medio', 'Alto']
        }, {
            type: 'list',
            dataIndex: 'publico',
            options: ['Si', 'No']
        }, {
            type: 'list',
            dataIndex: 'activo',
            options: ['Si', 'No']
        }]
    });

    this.paginadoDesv = new Ext.PagingToolbar({
        id: "paginadoDesv",
        pageSize: 1000,
        store: _this.stDesviaciones,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                _this.pgactual = evento.start;
                _this.start = evento.start;
            }
        }
    });

    this.gdDesviaciones = new Ext.grid.GridPanel({
        //region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        plugins: _this.filtrosDesv,
        autoExpandColumn: 'expandir',
        autoExpandMax: 250,
        store: _this.stDesviaciones,
        sm: _this.smDesviaciones,
        columns: _this.cmDesviaciones,
        width: 715,
        bbar: (!opcionesConfig.noUsarPaginado) ?_this.paginadoDesv : null,
        listeners: {
            rowdblclick: function () {
                _this.objCrudDesviaciones.CrearWinFormDesviaciones(
                    _this.PostAccionesGestionar, 'modificar', _this.smDesviaciones);
            },
            rowcontextmenu: function (t, ri, e) {
                _this.smDesviaciones.selectRow(ri);
                var menunom = new Ext.menu.Menu({
                    id: 'menunom',
                    items: [{
                        handler: function () {
                            _this.objCrudDesviaciones.CrearWinFormDesviaciones(
                                _this.PostAccionesGestionar, 'modificar', _this.smDesviaciones);
                        },
                        text: 'Modificar desviaci&oacuten',
                        itemCls: 'x-menu-item icondistra-modificar',
                        iconCls: 'imagen-none',
                        tooltip: 'Modificar desviaci&oacuten'
                    }, {
                        handler: function () {
                            _this.EliminarDesviacion();
                        },
                        text: 'Eliminar desviaci&oacuten',
                        itemCls: 'x-menu-item icondistra-eliminar',
                        iconCls: 'imagen-none',
                        tooltip: 'Eliminar desviaci&oacuten'
                    }]
                });
                if (_this.smDesviaciones.getSelections()[0].data.publico == 0) {
                    menunom.addMenuItem({
                        text: 'Publicar desviaci&oacuten',
                        itemCls: 'x-menu-item icondistra-publicar',
                        iconCls: 'imagen-none',
                        tooltip: 'Publicar desviaci&oacuten',
                        hidden: opcionesConfig.noUsarMenuGrid,
                        handler: function () {
                            _this.objCrudDesviaciones.CrearVentanaPublicarDesv(
                                false, _this.stDesviaciones, _this.smDesviaciones, _this.PostAccionesGestionar);
                        }
                    });
                } else {
                    menunom.addMenuItem({
                        text: 'Despublicar desviaci&oacuten',
                        //itemCls: 'x-menu-item icondistra-ptr',
                        itemCls: 'x-menu-item icondistra-publicar sipac-roja',
                        iconCls: 'imagen-none',
                        tooltip: 'Eliminar publicidad de la desviaci&oacuten',
                        hidden: opcionesConfig.noUsarMenuGrid,
                        handler: function () {
                            _this.DespublicarDesviacion(_this.PostAccionesGestionar);
                        }
                    });
                }
                if (_this.smDesviaciones.getSelections()[0].data.activo == 1) {
                    menunom.addMenuItem({
                        text: 'Desactivar desviaci&oacuten',
                        itemCls: 'x-menu-item icondistra-deshabilitar',
                        iconCls: 'imagen-none',
                        hidden: opcionesConfig.noUsarMenuGrid,
                        tooltip: 'Desactivar desviaci&oacute;n',
                        handler: function () {
                            _this.DesActivarDesviacion(0);
                        }
                    });
                } else {
                    menunom.addMenuItem({
                        text: 'Activar desviaci&oacuten',
                        itemCls: 'x-menu-item icondistra-habilitar',
                        iconCls: 'imagen-none',
                        hidden: opcionesConfig.noUsarMenuGrid,
                        tooltip: 'Activar desviaci&oacute;n',
                        handler: function () {
                            _this.DesActivarDesviacion(1);
                        }
                    });
                }
                if (_this.smDesviaciones.getSelections().length == 1) {
                    //mostrar menu
                    e.stopEvent();
                    var xy = e.getXY();
                    _this.gdDesviaciones.contextMenu = menunom;
                    _this.gdDesviaciones.contextMenu.showAt(xy);
                }
            },
            cellclick: function (grid, rowIndex, columnIndex, e) {
                /*var record = grid.getSelectionModel().getSelections()[0].data;
                 if (columnIndex == 3)
                 _this.CrearWinAsociarDesvAIncidencia(record);*/
            }
        }
    });

    this.PanelGestDesviaciones = new Ext.Panel({
        layout: 'fit',
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionarDesv, _this.btnModificarDesv, _this.btnEliminarDesv,
            _this.btnActivarDesv, _this.btnDesactivarDesv, _this.btnDespublicarDesv,
            _this.btnPublicarDesv, _this.btnEditarPublicacion, /*_this.btnPublicarTodasDesv,
             _this.btnDespublicarTodasDesv,*/ _this.btnLimpiarDesv, _this.btnAyudaDesv],
        tbar: [_this.btnAdicionarDesv, ' ', _this.btnModificarDesv, ' ', _this.btnEliminarDesv, ' ',
            _this.btnActivarDesv, ' ', _this.btnDesactivarDesv, ' ', _this.btnEditarPublicacion, ' ',
            _this.btnPublicarDesv, ' ', _this.btnDespublicarDesv, ' ', /* _this.btnPublicarTodasDesv, ' ',
             _this.btnDespublicarTodasDesv, ' ',*/ _this.btnLimpiarDesv, '->', _this.btnAyudaDesv],
        //id: 'PanelGestDesviaciones',
        //title: 'Registro de desviaciones',
        header: true,
        noTitle: (opcionesConfig.hasOwnProperty('noTitle')) ? opcionesConfig.noTitle : true,
        items: _this.gdDesviaciones
    });

    this.WinPrincipal = new Ext.Window({
        layout: 'fit',
        title: opcionesConfig.titleWinPrincipal,
        closable: opcionesConfig.closableWinPrincipal,
        graggable: false,
        constrain: true,
        maximized: opcionesConfig.maxWinPrincipal,
        noTitle: opcionesConfig.maxWinPrincipal,
        modal: true,
        width: 1000,
        height: 510,
        items: _this.PanelGestDesviaciones,
        buttons: [_this.btnCancelar, _this.btnSeleccionar]
    });

    //funcion donde se procede a cargar la plantilla
    this.CargarCmpDesviaciones = function (idelemento, PostAccionesRelacionar) {
        _this.PostAccionesRelacionar = PostAccionesRelacionar;
        _this.WinPrincipal.show();
    };

    this.ObtenerPanelDesviaciones = function () {
        return _this.PanelGestDesviaciones;
    };
    this.ObtenerStoreDesviaciones = function () {
        return _this.stDesviaciones;
    };
    this.ObtenerSelectionModelDesviaciones = function () {
        return _this.smDesviaciones;
    };
    this.ObtenerGridPanelDesviaciones = function () {
        return _this.gdDesviaciones;
    };

    //funcion donde se procede a disparar post-aciones luego de adicionar/modificar/eliminar
     this.PostAccionesGestionar = function(mensaje, accion) {
          switch (accion) {
             case 0:
                   _this.stDesviaciones.reload();
                   break;
             case 1:
                   _this.stDesviaciones.reload();
                   break;
             case 2:
                   _this.smDesviaciones.clearSelections();
                   _this.stDesviaciones.reload();
                   _this.ActualizarEstadoBarraHerramientas();
                   break;
             case 3:
                   _this.smDesviaciones.clearSelections();
                   _this.stDesviaciones.reload();
                   _this.ActualizarEstadoBarraHerramientas();
                   break;
          }
     };

 /*   this.PostAccionesGestionarrr = function (mensaje, accion) {
        _this.busqueda = 0;
        switch (mensaje) {
            case 0:
                _this.stDesviaciones.reload({
                    params: {
                        anode: null,
                        start: _this.start
                    }
                });
                break;
            case 1:
                var rec = _this.stDesviaciones.getById(_this.arrayiddesviaciones[0]);
                if (accion == 'Adicionar') {
                    if (_this.eshija == 1) {
                        if (rec.data._is_leaf && rec.data._parent == null) {
                            _this.PaginaActual(null);
                        }
                        if (rec.data._is_leaf && rec.data._parent != null) {
                            var recparent = _this.stDesviaciones.getById(rec.data._parent);
                            _this.RecargarNodo(recparent.id, 0, recparent);
                        }
                        if (!rec.data._is_leaf) {
                            _this.RecargarNodo(rec.id, 0, rec);
                        }
                    } else
                        _this.UltimaPagina();
                } else if (accion == 'Modificar' || accion == 'Duplicar') {
                    if (rec.data._parent != null) {
                        var recparent = _this.stDesviaciones.getById(rec.data._parent);
                        _this.RecargarNodo(recparent.id, 0, recparent);
                    } else
                        _this.PaginaActual(null);

                } else if (accion == 'Eliminar') {
                    if (_this.start != 0)
                        _this.posteliminar = true;
                    var totalseleccionados = _this.smDesviaciones.getCount();
                    if (totalseleccionados > 1) {
                        _this.PaginaActual(null);
                    } else {
                        if (rec.data._parent == null) {
                            _this.PaginaActual(null);
                        } else {
                            var recparent = _this.stDesviaciones.getById(rec.data._parent);
                            _this.RecargarNodo(recparent.id, 0, recparent);
                        }
                    }
                } else if (accion == 'Cancelar-Cerrar') {
                    if (_this.eshija == 1) {
                        if (rec.data._is_leaf && rec.data._parent == null) {
                            _this.PaginaActual(null);
                        }
                        if (rec.data._is_leaf && rec.data._parent != null) {
                            var recparent = _this.stDesviaciones.getById(rec.data._parent);
                            _this.RecargarNodo(recparent.id, 0, recparent);
                        }
                        if (!rec.data._is_leaf) {
                            _this.RecargarNodo(rec.id, 0, rec);
                        }
                    } else
                        _this.UltimaPagina();
                } else {
                    //Codigo
                }
                break;
            default:
                _this.PaginaActual(null);
        }
    };*/

    //Funcion que recarga y exande el nodo.
    this.RecargarNodo = function (anode, start, rec) {
        _this.stDesviaciones.reload({
            params: {
                anode: anode,
                start: start
            },
            callback: function () {
                _this.stDesviaciones.collapseNode(rec);
                _this.stDesviaciones.setNodeLoaded(rec, false);
                _this.stDesviaciones.expandNode(rec);
            }
        });
    };

    //Funcion que recarga la pagina actual. Si no hay elementos listados regarga la pagina anterior.
    this.PaginaActual = function (anode) {
        _this.smDesviaciones.clearSelections();
        _this.start = (_this.paginadoDesv.getPageData().activePage - 1) * (_this.paginadoDesv.cbPageSize.getValue());
        _this.stDesviaciones.reload({
            params: {
                anode: anode,
                start: _this.start
            },
            callback: function () {
                if (_this.stDesviaciones.getCount() == 0 && _this.start != 0) {
                    _this.start = _this.start - _this.paginadoDesv.cbPageSize.getValue();
                    _this.stDesviaciones.reload({
                        params: {
                            anode: anode,
                            start: _this.start
                        }
                    });
                }
            }
        });
    };

    this.UltimaPagina = function () {
        _this.smDesviaciones.clearSelections();
        var numentero = Math.floor(_this.stDesviaciones.getTotalCount() / _this.paginadoDesv.cbPageSize.getValue());
        _this.start = numentero * _this.paginadoDesv.cbPageSize.getValue();
        _this.stDesviaciones.reload({
            params: {
                anode: null,
                start: _this.start
            }
        });
    };

    this.AccionesPostEjecutar = function () {
    };

    function MostrarImpacto(val) {
        if (val == 1) {
            return 'Bajo';
        } else if (val == 2) {
            return 'Medio';
        } else
            return 'Alto';
    }

    function MostrarImagenActivo(val) {
        if (val == 0) {
            return '<center><span class="icondistra-jabber sipac-grisclaro"></span></center>';
        } else {
            return '<center><span class="icondistra-jabber sipac-amarilla"></span></center>';
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

    function MostrarIncidenciasAsociadas(valor, o, record) {
        var retorno = '<center><a href="#" id = "' + record.data.idelemento + '" style="text-decoration:none" ><span class="icondistra-adicionar"></span></a>' + ' ' + valor + '</center>';
        return retorno;

    }

    function MostrarDocumentosAfectados(valor, o, record) {
        var retorno = '<center><span><a href="#" id = "' + record.data.idelemento + '-doc' + '" style="text-decoration:none" ><span class="icondistra-adicionar"></span></a>' + ' ' + valor + '</span></center>';
        return retorno;
    }

    this.ActualizarEstadoBarraHerramientas = function () {
        _this.btnModificarDesv.disable();
        _this.btnEliminarDesv.disable();
        _this.btnSeleccionar.disable();
        _this.btnActivarDesv.disable();
        _this.btnDesactivarDesv.disable();
        _this.btnDespublicarDesv.disable();
        _this.btnEditarPublicacion.disable();
        _this.btnPublicarDesv.disable();

        if (_this.smDesviaciones.hasSelection()) {
            var arrayrecords = _this.smDesviaciones.getSelections();
            var totalrecords = arrayrecords.length;
            if (totalrecords > 0 && totalrecords == 1) {
                _this.btnModificarDesv.enable();
                _this.btnEliminarDesv.enable();
                _this.btnSeleccionar.enable();
                if (arrayrecords[0].data.activo == "1") {
                    _this.btnActivarDesv.disable();
                    _this.btnDesactivarDesv.enable();
                } else {
                    _this.btnActivarDesv.enable();
                    _this.btnDesactivarDesv.disable();
                }
                if (_this.smDesviaciones.getSelections()[0].data.publico == 0) {
                    _this.btnPublicarDesv.enable();
                } else {
                    _this.btnEditarPublicacion.enable();
                    _this.btnDespublicarDesv.enable();
                }
            } else if (totalrecords > 1) {
                _this.btnEliminarDesv.enable();
                _this.btnSeleccionar.enable();
                if (arrayrecords[0].data.activo == "1") {
                    for (var i = 0; i < arrayrecords.length - 1; i++) {
                        if (arrayrecords[i].data.activo == arrayrecords[i + 1].data.activo) {
                            _this.btnActivarDesv.disable();
                            _this.btnDesactivarDesv.enable();
                        } else {
                            _this.btnActivarDesv.disable();
                            _this.btnDesactivarDesv.disable();
                            break;
                        }
                    }
                } else {
                    for (var i = 0; i < arrayrecords.length - 1; i++) {
                        if (arrayrecords[i].data.activo == arrayrecords[i + 1].data.activo) {
                            _this.btnActivarDesv.enable();
                            _this.btnDesactivarDesv.disable();
                        } else {
                            _this.btnActivarDesv.disable();
                            _this.btnDesactivarDesv.disable();
                            break;
                        }
                    }
                }

                if (arrayrecords[0].data.publico == 1) {
                    for (var i = 0; i < arrayrecords.length - 1; i++) {
                        if (arrayrecords[i].data.publico == arrayrecords[i + 1].data.publico) {
                            _this.btnPublicarDesv.disable();
                            _this.btnDespublicarDesv.enable();
                        } else {
                            _this.btnPublicarDesv.disable();
                            _this.btnDespublicarDesv.disable();
                            break;
                        }
                    }
                } else {
                    for (var i = 0; i < arrayrecords.length - 1; i++) {
                        if (arrayrecords[i].data.publico == arrayrecords[i + 1].data.publico) {
                            _this.btnPublicarDesv.enable();
                            _this.btnDespublicarDesv.disable();
                        } else {
                            _this.btnPublicarDesv.disable();
                            _this.btnDespublicarDesv.disable();
                            break;
                        }
                    }
                }

            } else {
                _this.btnModificarDesv.disable();
                _this.btnEliminarDesv.disable();
                _this.btnSeleccionar.disable();
            }
        }
    };

    this.EliminarDesviacion = function () {
        var arrayIncidenciaAEliminar = [];
        var arrayIncidenciasSeleccionada = _this.smDesviaciones.getSelections();
        if (arrayIncidenciasSeleccionada.length > 0) {
            for (var i = 0; i < arrayIncidenciasSeleccionada.length; i++) {
                arrayIncidenciaAEliminar[i] = arrayIncidenciasSeleccionada[i].data.idelemento;
            }
        }
        if (arrayIncidenciasSeleccionada.length == 1) {
            msj = '¿Est&aacute; seguro que quiere eliminar la desviación seleccionada?';
            mensajeMascara = 'Eliminando datos de la desviaci&oacuten...';
        } else {
            msj = '¿Est&aacute; seguro que quiere eliminar las desviaciones seleccionadas?';
            mensajeMascara = 'Eliminando datos de las desviaciones...';
        }
        mostrarMensaje(2, msj, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajeMascara);
                Ext.Ajax.request({
                    url: 'eliminardesviacion',
                    params: {
                        array_iddesviaciones: Ext.encode(arrayIncidenciaAEliminar)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            if (arrayIncidenciasSeleccionada.length == 1) {
                                msje = 'La desviaci&oacute;n ha sido eliminada satisfactoriamente.';
                            } else {
                                msje = 'Las desviacioes han sido eliminadas satisfactoriamente.';
                            }
                            mostrarMensaje(1, msje);
                            _this.PostAccionesGestionar('Eliminar', 2);
                        }
                    }
                });
            }
        });
    };

    this.DespublicarDesviacion = function (PostAccionesGestionar) {
        var array_iddesviaciones = [];
        var mensaje = '';
        array_iddesviaciones.push(_this.smDesviaciones.getSelections()[0].data.idelemento);

        var arrayDesviacionesSeleccionados = _this.smDesviaciones.getSelections();
        if (arrayDesviacionesSeleccionados.length > 0) {
            for (var i = 0; i < arrayDesviacionesSeleccionados.length; i++) {
                array_iddesviaciones.push(arrayDesviacionesSeleccionados[i].data.idelemento);
            }
        }
        if (arrayDesviacionesSeleccionados.length == 1) {
            mensaje = '¿Está seguro que quiere eliminar la publicación seleccionada?';
            var mensajeMascara = 'Eliminando publicaci&oacute;n';
        } else {
            mensaje = '¿Está seguro que quiere eliminar las publicaciones seleccionadas?';
            mensajeMascara = 'Eliminando publicaciones';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajeMascara);
                Ext.Ajax.request({
                    url: 'despublicartodasdenominaciones',
                    params: {
                        arrayiddesviaciones: Ext.encode(array_iddesviaciones)
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        _this.BarraProgreso.hide();
                        if (responseData.mensaje == 1) {
                            if (arrayDesviacionesSeleccionados.length == 1) {
                                var mensaje = 'La publicación ha sido eliminada satisfactoriamente.';
                            } else {
                                mensaje = 'Las publicaciones han sido eliminadas satisfactoriamente.';
                            }
                            mostrarMensaje(2, mensaje);
                            PostAccionesGestionar('Despublicar', 3);
                        }
                    }
                });
            }
        });
    };

    this.ObtenerIncidenciasAsociadasDadaIdDesv = function (record, storeAsociados) {
        var arrayIncidenciasAsociadas = [];
        Ext.Ajax.request({
            url: 'verificardesviacion',
            params: {
                idelemento: record.idelemento
            },
            callback: function (options, success, response) {
                var datosdesviacion = [];
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                datosdesviacion = responseData.datosdesviacion;

                if (responseData.mensaje == 1) {
                    arrayIncidenciasAsociadas = datosdesviacion[0].incidenciasasociadas;
                    if (storeAsociados.getCount() > 0) {
                        for (var i = 0; i < arrayIncidenciasAsociadas.length; i++) {
                            for (var j = 0; j < storeAsociados.getCount(); j++) {

                                if (storeAsociados.getAt(j).data.idelemento != arrayIncidenciasAsociadas[i]) {
                                    storeAsociados.add(storeAsociados.getAt(j));
                                }
                            }
                        }
                        this.objCmpGestionarIncidenciasAsociadas.ObtenerGridPanel().getView().refresh();
                    }
                } else {
                    mostrarMensaje(2, 'La desviaci&oacute;n seleccionada ya no se encuentra en la base de datos.');
                }
            }
        });
    };

    this.CrearWinAsociarDesvAIncidencia = function (event, elx, obx) {
        var record = obx.record.data;
        _this.objCmpGestionarIncidenciasNoAsociadas = new Utilidades.Cmp.Cmpgestionarincidencias({
            hiddenAdd: false,
            noUsarModificar: false,
            noUsarEliminar: false,
            noUsarLimpiar: false,
            noUsarAyuda: true,
            noUsarPublicacion: false,
            loadstore: false,
            usarMensaje: false,
            noUsarPaginado: opcionesConfig.noUsarPaginado,
            noTitle: false
        });

        _this.PanelIncidenciasNoAsociadas = _this.objCmpGestionarIncidenciasNoAsociadas.ObtenerPanelIncidencia();
        _this.PanelIncidenciasNoAsociadas.setTitle('Registro de incidencias sin asociar');
        _this.PanelIncidenciasNoAsociadas.region = 'west';
        _this.PanelIncidenciasNoAsociadas.setWidth(482);

        var storeNoAsociados = _this.objCmpGestionarIncidenciasNoAsociadas.ObtenerStore();
        var smNoAsociados = _this.objCmpGestionarIncidenciasNoAsociadas.ObtenerSelectionModel();
        storeNoAsociados.load({
            params: {
                iddesviacion: record.idelemento,
                accion: 'noasociadas'
            }
        });
        smNoAsociados.addListener('rowselect', _this.HablitarBtAsociar, this);
        smNoAsociados.addListener('rowdeselect', _this.HablitarBtAsociar, this);

        _this.objCmpGestionarIncidenciasAsociadas = new Utilidades.Cmp.Cmpgestionarincidencias({
            hiddenAdd: true,
            noUsarModificar: true,
            noUsarEliminar: true,
            noUsarLimpiar: false,
            noUsarAyuda: true,
            noUsarPublicacion: true,
            loadstore: false,
            usarMensaje: false,
            noUsarPaginado: opcionesConfig.noUsarPaginado,
            noTitle: false
        });

        _this.PanelIncidenciasAsociadas = _this.objCmpGestionarIncidenciasAsociadas.ObtenerPanelIncidencia();
        _this.PanelIncidenciasAsociadas.setTitle('Registro de incidencias asociadas');
        _this.PanelIncidenciasAsociadas.region = 'east';
        _this.PanelIncidenciasAsociadas.setWidth(470);

        var arrayIncidenciasAsociadas = [];
        var storeAsociados = _this.objCmpGestionarIncidenciasAsociadas.ObtenerStore();
        var smAsociados = _this.objCmpGestionarIncidenciasAsociadas.ObtenerSelectionModel();
        storeAsociados.load({
            params: {
                iddesviacion: record.idelemento,
                accion: 'asociadas'
            },
            callback: function (options, success, response) {
                if (storeAsociados.getCount() > 0) {
                    //Ext.getCmp('btnGuardar').enable();
                }
            }
        });
        smAsociados.addListener('rowselect', _this.HablitarBtDesasociar, this);
        smAsociados.addListener('rowdeselect', _this.HablitarBtDesasociar, this);

        _this.btnAsociar = new Ext.Button({
            tooltip: 'Asociar incidencia(s)',
            disabled: true,
            iconCls: 'siguiente',
            handler: function () {
                _this.AsociarIncidencia(smNoAsociados, storeNoAsociados, storeAsociados);
            },
            key: {
                alt: true,
                key: 'K'
            },
            scope: this
        });
        _this.btnDesAsociar = new Ext.Button({
            tooltip: 'Desasociar incidencia(s)',
            disabled: true,
            iconCls: 'anterior',
            handler: function () {
                _this.DesasociarIncidencia(smAsociados, storeNoAsociados, storeAsociados);
            },
            key: {
                alt: true,
                key: 'U'
            },
            scope: this
        });
        _this.PanelAsociar = new Ext.Panel({
            region: 'center',
            bodyStyle: 'padding:150px 10px',
            width: 50,
            height: 20,
            usarKeymap: true,
            botonesKeymap: [_this.btnAsociar, _this.btnDesAsociar],
            items: [_this.btnAsociar, _this.btnDesAsociar]
        });

        _this.WinAsociarDesvAIncidencia = new Ext.Window({
            title: '<center>Gestionar asociación incidencia - desviación</center>',
            layout: 'border',
            closable: true,
            draggable: true,
            maximized: false,
            modal: true,
            width: 1010,
            height: 400,
            resizable: false,
            constrain: true,
            items: [_this.PanelIncidenciasNoAsociadas, _this.PanelAsociar, _this.PanelIncidenciasAsociadas],
            buttons: [
                new Ext.Button({
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    handler: function () {
                        _this.WinAsociarDesvAIncidencia.destroy();
                    }
                }),
                new Ext.Button({
                    iconCls: 'aceptar ',
                    text: 'Aceptar ',
                    disabled: true,
                    id: 'btnGuardar',
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function () {
                        _this.AsociarIncidenciasEnBD(storeAsociados, obx.iddesviacion);
                    }
                })
            ],
            listeners: {
                destroy: function (win) {
                    _this.objCrudDesviaciones.flagIncAsociadas = true;
                    _this.objCrudDesviaciones.flagIncNoAsociadas = true;
                }
            }
        });
        _this.WinAsociarDesvAIncidencia.show();
    };

    this.HablitarBtAsociar = function (sm, rowIndex, record) {
        var arrayrecords = sm.getSelections();
        if (arrayrecords.length == 0) {
            _this.btnAsociar.disable();
        } else
            _this.btnAsociar.enable();
    };

    this.HablitarBtDesasociar = function (sm, rowIndex, record) {
        var arrayrecords = sm.getSelections();
        if (arrayrecords.length == 0) {
            _this.btnDesAsociar.disable();
        } else
            _this.btnDesAsociar.enable();
    };

    this.AsociarIncidencia = function (smNoAsociados, storeNoAsociados, storeAsociados) {

        var stAsociadosIni = _this.objCmpGestionarIncidenciasAsociadas.arrayIniIncAsoc;
        var stAsociados = storeAsociados.data.items;

        if (smNoAsociados.hasSelection()) {
            var arrayIncidenciaAsociar = smNoAsociados.getSelections();

            if (arrayIncidenciaAsociar.length > 0) {
                for (var i = 0; i < arrayIncidenciaAsociar.length; i++) {
                    storeNoAsociados.remove(arrayIncidenciaAsociar[i]);
                }
                storeAsociados.add(arrayIncidenciaAsociar);
                if (arrayIncidenciaAsociar.length == 1) {
                    var mensaje = 'La incidencia ha sido asociada satisfactoriamente.';
                } else {
                    mensaje = 'Las incidencias han sido asociadas satisfactoriamente.';
                }
                mostrarMensaje(1, mensaje);
            }
            var compararAsociados = _this.compararArray(stAsociadosIni, stAsociados);
            (compararAsociados) ? Ext.getCmp('btnGuardar').disable() : Ext.getCmp('btnGuardar').enable();
        }
        smNoAsociados.clearSelections();
        _this.btnAsociar.disable();
    };

    this.DesasociarIncidencia = function (smAsociados, storeNoAsociados, storeAsociados) {

        var stNoAsociadosIni = _this.objCmpGestionarIncidenciasNoAsociadas.arrayIniIncNoAsoc;
        var stNoAsociados = storeNoAsociados.data.items;
        if (smAsociados.hasSelection()) {
            var arrayIncidenciaDesasociar = smAsociados.getSelections();
            Ext.getCmp('btnGuardar').enable();
            if (arrayIncidenciaDesasociar.length > 0) {
                for (var i = 0; i < arrayIncidenciaDesasociar.length; i++) {
                    storeAsociados.remove(arrayIncidenciaDesasociar[i]);
                }
                storeNoAsociados.add(arrayIncidenciaDesasociar);
                if (arrayIncidenciaDesasociar.length == 1) {
                    var mensaje = 'La incidencia ha sido desasociada satisfactoriamente.';
                } else {
                    mensaje = 'Las incidencias han sido desasociadas satisfactoriamente.';
                }
                mostrarMensaje(2, mensaje);
            }
            var compararNoAsociados = _this.compararArray(stNoAsociadosIni, stNoAsociados);
            (compararNoAsociados) ? Ext.getCmp('btnGuardar').disable() : Ext.getCmp('btnGuardar').enable();
        }
        smAsociados.clearSelections();
        _this.btnDesAsociar.disable();
    };

    this.AsociarIncidenciasEnBD = function (storeAsociados, iddesviacion) {
        var array_idincidencias = [];
        if (storeAsociados.getCount() != 0) {
            for (var i = 0; i < storeAsociados.getCount(); i++) {
                array_idincidencias.push(storeAsociados.getAt(i).data.idincidencia);
            }
        }
        var mensajeMascara = 'Asociando incidencias a desviaci&oacute;n';
        _this.BarraProgreso.show(mensajeMascara);

        Ext.Ajax.request({
            url: 'asociarincidenciaAdesviacion',
            params: {
                array_idincidencias: Ext.encode(array_idincidencias),
                iddesviacion: _this.smDesviaciones.getSelections()[0].data.idelemento
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                var mensaje = '';
                _this.BarraProgreso.hide();
                if (responseData.mensaje == 1) {
                    if (array_idincidencias.length == 1) {
                        mensaje = 'La asociaci&oacute;n ha sido gestionada satisfactoriamente.';
                    } else {
                        mensaje = 'Las asociaciones han sido gestionadas satisfactoriamente.';
                    }
                    mostrarMensaje(2, mensaje);
                    _this.PostAccionesGestionar('Asociar', 0);
                    _this.WinAsociarDesvAIncidencia.destroy();
                } else if (responseData.mensaje == 2) {
                    if (array_idincidencias.length == 1) {
                        mensaje = 'La incidencia ha sido desasociada satisfactoriamente.';
                    } else {
                        mensaje = 'Las incidencias han sido desasociadas satisfactoriamente.';
                    }
                    mostrarMensaje(2, mensaje);
                    _this.PostAccionesGestionar('Asociar', 0);
                    _this.WinAsociarDesvAIncidencia.destroy();
                }
            }
        });
    };

    this.MostarDocumentosAfectados = function () {
        _this.stDocAfectados = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/cargardocumentosafectados',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idelemento',
                root: "campos",
                totalProperty: "total"
            }, [
                {
                    name: 'denominacion'
                }, {
                    name: 'tipoelemento'
                }, {
                    name: 'idtipoelemento'
                }, {
                    name: 'idelemento'
                }, {
                    name: 'autor'
                }
            ]),
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idelemento = _this.smDesviaciones.getSelections()[0].data.idelemento;
                },
                load: function (st) {
                    if (st.getCount() == 0) {
                        mostrarMensaje(2, 'No existen documentos afectados.');
                    } else {
                        _this.windowDocAfectados.show();
                    }
                }
            }
        });

        _this.smDocAfectados = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.cmDocAfectados = [
            {
                id: 'expandir',
                header: "Denominación",
                width: 250,
                sortable: true,
                dataIndex: 'denominacion',
                renderer: MostrarImagenTipoElemento
            }, {
                header: "Tipo de Documento",
                width: 130,
                dataIndex: 'tipoelemento',
                sortable: true
            }, {
                header: "Autor",
                width: 140,
                dataIndex: 'autor',
                sortable: true
            }];

        _this.paginadoDocAfectados = new Ext.PagingToolbar({
            id: "paginadoDocAfectados",
            pageSize: 1000,
            store: _this.stDocAfectados,
            displayInfo: true,
            listeners: {
                beforechange: function (paginado, evento) {
                    _this.pgactual = evento.start;
                }
            }
        });

        _this.gdDocAfectados = new Ext.grid.GridPanel({
            frame: true,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            autoExpandMax: 250,
            store: _this.stDocAfectados,
            sm: _this.smDocAfectados,
            columns: _this.cmDocAfectados,
            width: 450,
            height: 400,
            bbar: _this.paginadoDocAfectados
        });

        _this.windowDocAfectados = new Ext.Window({
            title: 'Documentos de la planificaci&oacute;n afectados',
            width: 550,
            constrain: true,
            height: 400,
            modal: true,
            layout: 'fit',
            items: [_this.gdDocAfectados],
            buttons: [
                new Ext.Button({
                    iconCls: 'cancelar',
                    text: 'Cerrar',
                    handler: function () {
                        _this.windowDocAfectados.destroy();
                    }
                })
            ]
        });
    };

    function MostrarImagenTipoElemento(valor, m, r) {
        if (r.data.idtipoelemento == 0) {
            return '<span class="icondistra-folder sipac-azul">' + ' ' + valor + '</span>';
        } else if (r.data.idtipoelemento == 1) {
            return '<span class="icondistra-archivo sipac-azul">' + ' ' + valor + '</span>';
        } else if (r.data.idtipoelemento == 3) {
            return '<span class="icondistra-actividades sipac-azul">' + ' ' + valor + '</span>';
        } else {
            return '<span class="icondistra-conflicto sipac-azul">' + ' ' + valor + '</span>';
        }
    }

    this.DesActivarDesviacion = function (valor) {
        var accion = '';
        var msg = '';
        if (valor == 1)
            accion = 'activar';
        else
            accion = 'desactivar';

        if (_this.smDesviaciones.getSelections().length == 1)
            msg = '¿Est&aacute; seguro que quiere ' + accion + ' la desviación seleccionada?';
        else
            msg = '¿Est&aacute; seguro que quiere ' + accion + ' las desviaciones seleccionadas?';

        mostrarMensaje(2, msg, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                var arrayrecords = _this.smDesviaciones.getSelections();
                var arraydesvseleccionada = [];
                if (arrayrecords.length > 0) {
                    for (var i = 0; i < arrayrecords.length; i++) {
                        arraydesvseleccionada[i] = arrayrecords[i].data.idelemento;
                    }
                }
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/desactivardesviacion',
                    params: {
                        arraydesviacion: Ext.encode(arraydesvseleccionada),
                        activo: valor
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            _this.PostAccionesGestionar('DesActivar', 2);
                            if (valor == 0) {
                                if (arrayrecords.length == 1)
                                    mostrarMensaje(1, 'La desviaci&oacute;n ha sido desactivada satisfactoriamente.');
                                else
                                    mostrarMensaje(1, 'Las desviaciones han sido desactivadas satisfactoriamente.');
                            } else {
                                if (arrayrecords.length == 1)
                                    mostrarMensaje(1, 'La desviaci&oacute;n ha sido activada satisfactoriamente.');
                                else
                                    mostrarMensaje(1, 'Las desviaciones han sido activadas satisfactoriamente.');
                            }
                        }
                    }
                });
            }
        });
    };

    this.RelacionarElementos = function () {
        var arraydesvseleccionada = _this.smDesviaciones.getSelections();
        if (arraydesvseleccionada.length > 0) {
            for (var i = 0; i < arraydesvseleccionada.length; i++) {
                var elementoseleccionado = {};
                elementoseleccionado = {
                    idelemento: arraydesvseleccionada[i].data.idelemento,
                    denominacion: arraydesvseleccionada[i].data.denominacion,
                    tipoelemento: arraydesvseleccionada[i].data.idtipoelemento,
                    autorelemento: arraydesvseleccionada[i].data.autor,
                    _parent: null,
                    _is_leaf: true,
                    superior: arraydesvseleccionada[i].data.superior,
                    subordinado: arraydesvseleccionada[i].data.subordinado,
                    idautor: arraydesvseleccionada[i].data.idautor
                };
                _this.arrayDesvSeleccionadas.push(elementoseleccionado);
            }
        }
        _this.PostAccionesRelacionar(_this.arrayDesvSeleccionadas, _this.WinPrincipal);
    };

    this.compararArray = function (arrayIni, arrayTemp) {
        var contador = 0;
        var parada = 0;
        if (arrayIni.length == arrayTemp.length) {
            for (var i = 0; i < arrayIni.length; i++) {
                for (var j = 0; j < arrayTemp.length; j++) {
                    if (arrayIni[i].id == arrayTemp[j].id) {
                        contador++;
                        break;
                    } else
                        parada++;
                }
                if (parada == arrayTemp.length) {
                    return false;
                    break;
                }
                else
                    parada = 0;
            }
            if (contador == arrayIni.length)
                return true;
        } else
            return false;
    };


};
