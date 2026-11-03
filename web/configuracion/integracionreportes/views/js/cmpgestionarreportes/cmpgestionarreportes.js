Utilidades.Cmp.objCmpGestionarReportes = function (opcionesConfig) {
    Ext.QuickTips.init();
    var _this = this;
    var html = '';
    var btnaplicar = false;
    var change = false;
    _this.start = 0;
    _this.posteliminar = false;
    _this.arrayidreportes = [];
    _this.idreporte = null;
    _this.urlCmp = 'configuracion/integracionreportes/index.php/cmpintegracionreportes/cmpintegracionreportes';

    _this.barraProgreso = new BarraEstado();
    //componente para el manejo de los mensajes de errores de texto regido
    _this.objValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    _this.objConfiguracion = new Utilidades.Cmp.CmpConfiguracion();

    _this.objClasificacion = new Utilidades.Cmp.CmpClasificacionReporte();

    _this.objCrudReportes = new Utilidades.Cmp.objCmpCrudReportes();

    _this.objFiltro = new Utilidades.Cmp.CmpFiltro({
        integracion: true,
        autoloadstore: false
    });
    //Reportes existentes
    _this.btnAdicionarReporte = new Ext.Button({
        iconCls: 'adicionar',
        disabled: false,
        id: 'btnAdicionarReporte',
        tooltip: 'Adicionar reporte',
        hidden: true,
        handler: function () {
            var parametros = ({
                st: _this.stGpReportesExistentes,
                sm: _this.smGReportesExistentes,
                accion: 'Adicionar'
            });
            _this.gestionarReportes(parametros, _this.postAccionesGestionar);
        },
        key: {
            alt: true,
            key: 'I'
        },
        scope: _this
    });

    _this.btnModificarReporte = new Ext.Button({
        iconCls: 'modificar',
        disabled: true,
        id: 'btnModificarReporte',
        tooltip: 'Modificar reporte',
        hidden: true,
        handler: function () {
            var parametros = ({
                st: _this.stGpReportesExistentes,
                sm: _this.smGReportesExistentes,
                accion: 'Modificar'
            });
            _this.gestionarReportes(parametros, _this.postAccionesGestionar);
        },
        key: {
            alt: true,
            key: 'M'
        },
        scope: _this
    });

    _this.btnEliminarReporte = new Ext.Button({
        id: 'btnEliminarReporte',
        handler: function () {
            var parametros = ({
                st: _this.stGpReportesExistentes,
                sm: _this.smGReportesExistentes,
                accion: 'Eliminar'
            });
            _this.gestionarReportes(parametros, _this.postAccionesGestionar);
        },
        iconCls: 'eliminar',
        disabled: true,
        tooltip: 'Eliminar reporte',
        hidden: true,
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });

    _this.menuItemPDF = new Ext.menu.Item({
        text: 'Generar reporte en PDF',
        handler: function () {
            var formatoreporte = 'pdf';
            _this.generarReporte(formatoreporte);
        },
        iconCls: 'reportes',
        tooltip: 'Generar reporte en PDF'
    });

    _this.menuItemHTML = new Ext.menu.Item({
        text: 'Generar reporte en HTML',
        handler: function () {
            var formatoreporte = 'html';
            _this.generarReporte(formatoreporte);
        },
        iconCls: 'reportes',
        tooltip: 'Generar reporte en HTML'
    });

    _this.menuItemExcel = new Ext.menu.Item({
        text: 'Generar reporte en Excel',
        handler: function () {
            var formatoreporte = 'excel';
            _this.generarReporte(formatoreporte);
        },
        iconCls: 'reportes',
        tooltip: 'Generar reporte en Excel'
    });

    _this.menuItemCSV = new Ext.menu.Item({
        text: 'Generar reporte en CSV',
        handler: function () {
            var formatoreporte = 'csv';
            _this.generarReporte(formatoreporte);
        },
        iconCls: 'reportes',
        tooltip: 'Generar reporte en CSV'
    });

    _this.menuItemVistaPrevia = new Ext.menu.Item({
        text: 'Vista previa',
        handler: function () {
            var formatoreporte = 'preview';
            _this.generarReporte(formatoreporte);
        },
        iconCls: 'reportes',
        tooltip: 'Generar reporte en Excel'
    });

    _this.menuReportes = new Ext.Toolbar.MenuButton({
        id: 'menuReportes',
        tooltip: 'Generar reportes',
        disabled: true,
        iconCls: 'reportegrafico',
        hidden: true,
        menu: {
            items: [_this.menuItemPDF, _this.menuItemExcel, _this.menuItemHTML, _this.menuItemCSV]
        }
    });

    _this.btnConfiguracion = new Ext.Button({
        iconCls: 'configuracion',
        disabled: false,
        id: 'btnConfiguracion',
        tooltip: 'Configuración',
        hidden: true,
        handler: function () {
            return _this.objConfiguracion.crearWinConfiguracion();
        },
        key: {
            alt: true,
            key: 'C'
        },
        scope: _this
    });

    _this.btnFiltro = new Ext.Button({
        iconCls: 'filtrar',
        disabled: false,
        id: 'btnFiltro',
        tooltip: 'Filtros de los reportes',
        hidden: true,
        handler: function () {
            _this.objFiltro = new Utilidades.Cmp.CmpFiltro({
                idreporte: _this.arrayidreportes[0],
                integracion: true
            });
            return _this.objFiltro.crearWinFiltro();
        },
        key: {
            alt: true,
            key: 'F'
        },
        scope: _this
    });

    _this.btnClasificacionReporte = new Ext.Button({
        iconCls: 'gestionarclasificador',
        disabled: false,
        id: 'btnClasificacion',
        tooltip: 'Gestionar clasificación de los reportes',
        hidden: false,
        handler: function () {
            return _this.objClasificacion.crearWinClasificacion(_this.postAccionesGestionar);
        },
        key: {
            alt: true,
            key: 'F'
        },
        scope: _this
    });

    _this.btnVistaPrevia = new Ext.Button({
        iconCls: 'vistareporte',
        disabled: true,
        id: 'btnVistaPrevia',
        tooltip: 'Vista previa del reporte',
        hidden: true,
        handler: function () {
            _this.generarReporte('preview');
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'G'
        },
        scope: _this
    });

    _this.btnDashboards = new Ext.Button({
        iconCls: 'configurarconceptos',
        disabled: true,
        id: 'btnDashboards',
        tooltip: 'Mostrar Dashboards',
        hidden: true,
        handler: function () {
            _this.generarReporte('dashboards');
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'G'
        },
        scope: _this
    });

    _this.btnLimpiarFiltro = new Ext.Button({
        disabled: false,
        handler: function () {
            _this.smGReportesExistentes.clearSelections();
            _this.gfReportes.clearFilters();
            if (_this.gfReportes.getFiltrosActivos() == undefined || _this.gfReportes.getFiltrosActivos().length == 0) {
                _this.stGpReportesExistentes.reload({});
            }
        },
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s)',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });

    _this.stGpReportesExistentes = new Ext.data.GroupingStore({
        id: 'stGpReportesExistentes',
        autoLoad: true,
        url: '/configuracion/integracionreportes/index.php/cmpintegracionreportes/listarReportes',
        groupField: 'denclasificacion',
        sortInfo: {
            field: 'idclasificacion',
            direction: "ASC"
        },
        reader: new Ext.data.JsonReader(
            {
                totalProperty: 'total',
                root: 'data',
                id: 'idreporte'
            },
            [{
                name: 'idreporte'
            }, {
                name: 'denreporte'
            }, {
                name: 'descreporte'
            }, {
                name: 'idconfiguracion'
            }, {
                name: 'idreportereportserver'
            }, {
                name: 'denconfiguracion'
            }, {
                name: 'urlservidor'
            }, {
                name: 'autenticarapikey'
            }, {
                name: 'idclasificacion'
            }, {
                name: 'denclasificacion'
            }]
        ),
        listeners: {
            beforeload: function (st) {
                _this.stGpReportesExistentes.removeAll();
                st.baseParams.start = _this.start;
                st.baseParams.limit = _this.pgReportesExistentes.pageSize;

            },
            'load': function (store) {
                if (_this.stGpReportesExistentes.getCount() == 0 && !_this.posteliminar) {
                    if ((_this.gfReportes.getFiltrosActivos() == undefined || _this.gfReportes.getFiltrosActivos().length == 0)) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                } else _this.smGReportesExistentes.selectFirstRow();
                _this.posteliminar = false;
                _this.actualizarEstadoBarraHerramientas();
            }
        },
    });

    _this.stGpReportesExistentesOld = new Ext.data.Store({
        id: 'stGpReportesExistentesOld',
        autoLoad: false,
        url: '/configuracion/integracionreportes/index.php/cmpintegracionreportes/listarReportes',
        reader: new Ext.data.JsonReader(
            {
                totalProperty: 'total',
                root: 'data',
                id: 'idreporte'
            },
            [{
                name: 'idreporte'
            }, {
                name: 'denreporte'
            }, {
                name: 'descreporte'
            }, {
                name: 'idconfiguracion'
            }, {
                name: 'idreportereportserver'
            }, {
                name: 'denconfiguracion'
            }, {
                name: 'urlservidor'
            }, {
                name: 'autenticarapikey'
            }]
        ),
        listeners: {
            beforeload: function (st) {
                _this.stGpReportesExistentes.removeAll();
                st.baseParams.start = _this.start;
                st.baseParams.limit = _this.pgReportesExistentes.pageSize;

            },
            'load': function (store) {
                if (_this.stGpReportesExistentes.getCount() == 0 && !_this.posteliminar) {
                    if ((_this.gfReportes.getFiltrosActivos() == undefined || _this.gfReportes.getFiltrosActivos().length == 0)) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                } else _this.smGReportesExistentes.selectFirstRow();
                _this.posteliminar = false;
                _this.actualizarEstadoBarraHerramientas();
            }
        },
    });
    //modo de seleccion del grid donde cargo los reportes existentes
    _this.smGReportesExistentes = new Ext.grid.RowSelectionModel({
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                _this.actualizarEstadoBarraHerramientas();
            },
            rowdeselect: function (sm, indiceFila, record) {
                _this.actualizarEstadoBarraHerramientas();
            }
        }
    });

    _this.pgReportesExistentes = new Ext.PagingToolbar({
        pageSize: 100,
        store: _this.stGpReportesExistentes,
        displayInfo: true,
        items: ['-', _this.btnLimpiarFiltro, '-'],
        listeners: {
            beforechange: function (paginado, evento) {
                _this.start = evento.start
            }
        }
    });
    //plugins para los filtros del grid
    _this.gfReportes = new Ext.grid.GridFilters({
        filters: [{
            type: 'string_adaptado',
            dataIndex: 'idreportereportserver',
            xtype: 'numberfield',
            maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
            maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
        }, {
            type: 'string',
            dataIndex: 'denreporte'
        }, {
            type: 'string',
            dataIndex: 'denconfiguracion'
        }, {
            type: 'string',
            dataIndex: 'urlservidor'
        }]
    });
    //grid donde cargo los reportes existentes
    _this.gpReportesExistentes = new Ext.grid.GridPanel({
        id: 'gpReportesExistentes',
        margins: '3 3 3 3',
        width: 300,
        sm: _this.smGReportesExistentes,
        region: 'west',
        title: 'Reportes existentes',
        autoScroll: true,
        collapsible: true,
        columns: [{
            dataIndex: 'idreportereportserver',
            width: 70,
            header: 'Id reporte'
        }, {
            dataIndex: 'denreporte',
            width: 300,
            header: 'Denominación'
        }, {
            dataIndex: 'denconfiguracion',
            width: 200,
            header: 'Servidor ServerReport'
        }, {
            dataIndex: 'urlservidor',
            width: 200,
            header: 'URL ServerReport'
        }, {
            dataIndex: 'denclasificacion',
            width: 200,
            header: 'Clasificación'
        }],
        store: _this.stGpReportesExistentes,
        plugins: _this.gfReportes,
        view: new Ext.grid.GroupingView({
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Reportes" : "Reporte"]})'
        }),
        tbar: [_this.btnAdicionarReporte, _this.btnModificarReporte, _this.btnEliminarReporte, _this.menuReportes,
            _this.btnVistaPrevia, _this.btnDashboards, '-', _this.btnFiltro, _this.btnClasificacionReporte, _this.btnConfiguracion],
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionarReporte, _this.btnModificarReporte, _this.btnEliminarReporte, _this.btnFiltro, _this.menuReportes,
            _this.btnVistaPrevia, _this.btnConfiguracion, _this.btnClasificacionReporte],
        bbar: _this.pgReportesExistentes,
        loadMask: {
            msg: 'Cargando reportes'
        },
        listeners: {
            rowdblclick: function () {
                if (_this.btnModificarReporte.enable() && _this.btnModificarReporte.isVisible())
                    _this.btnModificarReporte.handler.call(this);
            }
        }
    });
    //Vista previa
    _this.pVistaPrevia = new Ext.Panel({
        id: 'pVistaPreviaPrincipal',
        region: 'center',
        title: 'Vista previa/Dashboards',
        frame: false,
        listeners: {
            render: function () {
            }
        }
    });

    _this.vpPrincipal = new Ext.Viewport({
        layout: 'border',
        items: [_this.gpReportesExistentes, _this.pVistaPrevia]
    });

    _this.pPrincipal = new Ext.Panel({
        layout: 'border',
        items: [_this.gpReportesExistentes, _this.pVistaPrevia]
    });


    _this.cargarCmpGestionarReportes = function () {
        _this.objFiltro.cargarAccionesXUri();
        _this.objConfiguracion.cargarAccionesXUri();
        _this.objClasificacion.cargarAccionesXUri();
        _this.cargarAccionesXUri();
        //_this.cargarAcciones();
        _this.pPrincipal.show();
    }

    _this.cargarAccionesXUri = function () {
        var url = _this.urlCmp;
        UCID.portal.cargarAccionesXUri(url, function () {
            for (var i in acciones_reportes) {
                var id = acciones_reportes[i].abreviatura,
                    cmp = Ext.getCmp(id);
                if (cmp) {
                    cmp.show();
                }
            }
        });
    }

    _this.cargarAcciones = function () {
        function showGrantedActions() {
            for (var k in _this.grantedActions) {
                var id = _this.grantedActions[k].abreviatura,
                    cmp = Ext.getCmp(id);
                if (cmp) {
                    cmp.show();
                }
            }
        }

        Ext.Ajax.request({
            url: 'cargaracciones',
            method: 'POST',
            params: {
                idfuncionalidad: window.frameElement.id
            },
            callback: function (opts, success, response) {
                if (success) {
                    _this.grantedActions = Ext.decode(response.responseText);
                    var codMsg = _this.grantedActions.codMsg;
                    if (!codMsg) {
                        showGrantedActions();
                    }
                }
            }
        });
    }

    _this.actualizarEstadoBarraHerramientas = function () {
        _this.btnModificarReporte.disable();
        _this.btnEliminarReporte.disable();
        _this.btnVistaPrevia.disable();
        _this.menuReportes.disable();
        _this.btnFiltro.disable();
        _this.btnDashboards.disable();
        _this.arrayidreportes = [];
        if (_this.smGReportesExistentes.hasSelection()) {
            _this.btnEliminarReporte.enable();
            var arrayrecords = _this.smGReportesExistentes.getSelections();
            var totalrecords = arrayrecords.length;
            if (totalrecords == 1) {
                _this.btnModificarReporte.enable();
                _this.btnVistaPrevia.enable();
                _this.menuReportes.enable();
                _this.btnFiltro.enable();
                _this.btnDashboards.enable();
                var idreporte = arrayrecords[0].id;
                if (_this.idreporte != idreporte) {
                    var pvistaprevia = Ext.getCmp('pvistaprevia');
                    if (pvistaprevia) {
                        _this.pVistaPrevia.remove(pvistaprevia);
                        _this.pVistaPrevia.doLayout();
                    }
                    _this.idreporte = idreporte;
                }
            } else {
                _this.idreporte = null;
                var pvistaprevia = Ext.getCmp('pvistaprevia');
                if (pvistaprevia) {
                    _this.pVistaPrevia.remove(pvistaprevia);
                    _this.pVistaPrevia.doLayout();
                }
            }
            for (var i = 0; i < totalrecords; i++) {
                _this.arrayidreportes[i] = arrayrecords[i].data.idreporte;
            }
        } else {
            _this.idreporte = null;
            var pvistaprevia = Ext.getCmp('pvistaprevia');
            if (pvistaprevia) {
                _this.pVistaPrevia.remove(pvistaprevia);
                _this.pVistaPrevia.doLayout();
            }
        }
    }
    //funcion donde se procede a disparar post-aciones luego de adicionar/modificar/eliminar
    _this.postAccionesGestionar = function (mensaje, accion) {
        switch (mensaje) {
            case 0:
                _this.stGpReportesExistentes.reload({
                    params: {
                        start: _this.start
                    }
                });
                break;
            case 1:
                if (accion == 'Adicionar' || accion == 'Cancelar-Cerrar')
                    _this.ultimaPagina();
                else if (accion == 'Modificar' || accion == 'Eliminar') {
                    if (accion == 'Eliminar' && _this.start != 0)
                        _this.posteliminar = true;
                    _this.paginaActual(null);
                }
                break;
            default:
                _this.paginaActual(null);
        }
    };
    //Funcion que recarga la pagina actual. Si no hay elementos listados regarga la pagina anterior.
    _this.paginaActual = function (anode) {
        _this.smGReportesExistentes.clearSelections();
        _this.start = (_this.pgReportesExistentes.getPageData().activePage - 1) * (_this.pgReportesExistentes.cbPageSize.getValue());
        _this.stGpReportesExistentes.reload({
            params: {
                start: _this.start
            },
            callback: function () {
                if (_this.stGpReportesExistentes.getCount() == 0 && _this.start != 0) {
                    _this.start = _this.start - _this.pgReportesExistentes.cbPageSize.getValue();
                    _this.stGpReportesExistentes.reload({
                        params: {
                            start: _this.start
                        }
                    });
                }
            }
        });
    };

    _this.ultimaPagina = function () {
        _this.smGReportesExistentes.clearSelections();
        var numentero = Math.floor(_this.stGpReportesExistentes.getTotalCount() / _this.pgReportesExistentes.cbPageSize.getValue());
        _this.start = numentero * _this.pgReportesExistentes.cbPageSize.getValue();
        _this.stGpReportesExistentes.reload({
            params: {
                start: _this.start
            }
        });
    };

    _this.gestionarReportes = function (parametros) {
        var accion = parametros.accion;
        if (accion == 'Modificar' || accion == 'Eliminar') {
            if (_this.smGReportesExistentes.hasSelection()) {
                var arrayrecords = _this.smGReportesExistentes.getSelections();
                var totalrecords = arrayrecords.length;
                parametros.arrayidreportes = _this.arrayidreportes;
                if (accion == 'Modificar') {
                    if (totalrecords == 1) {
                        _this.objCrudReportes.crearWinCrudReportes(parametros, _this.postAccionesGestionar); //Modificar
                    } else {
                        mostrarMensaje(1, 'Debe seleccionar un reporte para modificarlo.');
                    }
                } else _this.objCrudReportes.eliminarReporte(parametros, _this.postAccionesGestionar); //Eliminar
            } else {
                mostrarMensaje(1, 'Debe seleccionar al menos un reporte.');
            }
        } else {
            _this.objCrudReportes.crearWinCrudReportes(parametros, _this.postAccionesGestionar); //Adicionar
        }
    }

    _this.generarReporte = function (formatoreporte) {
        if (_this.smGReportesExistentes.hasSelection() && _this.smGReportesExistentes.getSelections().length == 1) {
            if (formatoreporte == 'dashboards') {
                var record = _this.smGReportesExistentes.getSelections()[0];
                if (record.data.autenticarapikey == '0')
                    _this.obtenerUrlReporte(formatoreporte);
                else mostrarMensaje(1, 'La configuración del servidor ReportServer del reporte debe ser mediante autenticación usuario/contraseña.');
            } else {
                _this.objFiltro = new Utilidades.Cmp.CmpFiltro({
                    idreporte: _this.arrayidreportes[0],
                    autoloadstore: false,
                    integracion: true
                });
                var parametros = ({
                    accion: 'ParametrosReporte',
                    formatoreporte: formatoreporte
                })
                return _this.objFiltro.mostrarWinParametros(parametros, _this.obtenerUrlReporte);
            }
        } else {
            mostrarMensaje(1, 'Debe seleccionar un reporte.');
        }
    }

    _this.obtenerUrlReporte = function (formatoreporte, datosfiltros, idestructura) {
        _this.barraProgreso.show('Cargando datos');
        Ext.Ajax.request({
            url: '/configuracion/integracionreportes/index.php/cmpintegracionreportes/obtenerUrlReporte',
            params: {
                formatoreporte: formatoreporte,
                idreporte: _this.arrayidreportes[0],
                datosfiltros: Ext.encode(datosfiltros),
                idestructura: idestructura
            },
            callback: function (opcions, success, response) {
                var responseData = Ext.decode(response.responseText);
                var load = false;
                frameLoaded = function () {
                    load = true;
                    _this.barraProgreso.hide();
                }
                if (responseData.mensaje == 1 && responseData.hasOwnProperty('formatoreporte') && (responseData.formatoreporte == 'preview' || responseData.formatoreporte == 'dashboards')) {
                    var pvistaprevia = Ext.getCmp('pvistaprevia');
                    if (pvistaprevia) {
                        _this.pVistaPrevia.remove(pvistaprevia);
                    }
                    var html = '<iframe id="iframevistaprevia" onload="frameLoaded();" frameborder="0" allowfullscreen width="100%" height="100%" transparency>El navegador no soporta iFrames o el mismo se encuentra deshabilitado.</iframe>';
                    pvistaprevia = new Ext.Panel({
                        id: 'pvistaprevia',
                        frame: false,
                        layout: 'fit',
                        html: html
                    });
                    _this.pVistaPrevia.add(pvistaprevia);
                    if (responseData.formatoreporte == 'dashboards')
                        _this.pVistaPrevia.setTitle('Dashboards');
                    else _this.pVistaPrevia.setTitle('Vista previa');
                    _this.pVistaPrevia.doLayout();
                    document.getElementById('iframevistaprevia').src = responseData.url;
                    if (!load) _this.barraProgreso.hide();
                } else {
                    if (responseData.mensaje == 0)
                        mostrarMensaje(1, 'No existe el reporte en los registos.');
                    else if (responseData.mensaje == 1)
                        window.open(responseData.url);
                    else if (responseData.mensaje == 2)
                        mostrarMensaje(1, 'No existe el identificador del reporte.');
                    else if (responseData.hasOwnProperty('codMsg') && responseData.codMsg == 3)
                        mostrarMensaje(1, responseData.mensaje);
                    else mostrarMensaje(1, 'Ha ocurrido un error. Contacte al administrador.');
                    _this.barraProgreso.hide();
                }
            }
        });
    }


}