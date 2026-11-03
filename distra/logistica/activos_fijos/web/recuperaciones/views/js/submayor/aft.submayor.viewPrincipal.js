//Ext.ns('Log.aft.submayor');

Log.aft.submayor.View = Ext.extend(LOG.util.aft.UITemplate, {
    clean: false,
    tipo: 0,//para saber si es de activo o patrimonio(0 == AFT y 1 == Patrimonio)
    constructor: function (config) {

        var _this = this;
        _this.tipoView = 1;
        this.idioma = LOG.util.UIManager.apply(config.idioma, Log.aft.submayor.Idioma);
        this.dirController = '/logistica/activos_fijos/recuperaciones/index.php/submayor';
        this.urlBusquedaGridPrincipal = (_this.tipoView == 1) ? 'getconteo' : 'getregistronumerico';
        this.idGridPrincipal = (_this.tipoView == 1) ? 'idindicador' : 'idregnumerico';
        this.modoSeleccion = 1;
        this.actividad = config.actividad;
        this.autoLoad = false;
        this.autoSelect = false;
        this.busquedaAvanzada = true;
        this.conEstructura = false;
        this.panelBusquedaAvanzada = undefined;
        this.filtroespecialidad = true; //Este campo define si se filtrara por la especialidad de ka entidad o no se filtra por la especialidad
        this.verplugins = false;
        Log.aft.submayor.View.busquedaP = false;
        this.modelo = new Log.aft.submayor.Model({
            idioma: config.idioma
        });
        this.arrIdEstructuras = new Array();
        this.salidas = -1;
        this.listaAftPlugins = new LOG.util.List();
        this.camposGenerales = this.getColsRn();
        
        this.estadosoperacion = config.estados;
        this.grupossubgrupos = config.grupos;
        this.naturalezas = config.naturalezas;
        this.viewConfig = config.viewConfig;
        
        this.primerRender = true;

        config.doActionEstructura = function (nodo) {
            _this.arrIdEstructuras = (_this.idNodoSeleccionado.length > 0) ? _this.idNodoSeleccionado : -1,
                _this.storePrincipal.load({
                    params: {
                        filtroespecialidad: this.filtroespecialidad,
                        arrIdEstructuras: (_this.idNodoSeleccionado.length > 0) ? Ext.encode(_this.idNodoSeleccionado) : (_this.idNodoSeleccionado != null) ? _this.idNodoSeleccionado : -1,
                        salida: _this.salidas
                    },
                    callback: function () {
                        Ext.getBody().unmask();
                    }
                });

        };

        Log.aft.submayor.View.superclass.constructor.call(this, config);
        this.addEvents('atributosDinamicos');
        config.fnEntidad = function () {
            _this.idestructura = (_this.idNodoSeleccionado.length > 0) ?
                Ext.encode(_this.idNodoSeleccionado) : (_this.idNodoSeleccionado != null) ?
                _this.idNodoSeleccionado : -1;
            _this.storePrincipal.load({
                params: {
                    filtroespecialidad: this.filtroespecialidad,
                    arrIdEstructuras: (_this.idNodoSeleccionado.length > 0) ?
                        Ext.encode(_this.idNodoSeleccionado) : (_this.idNodoSeleccionado != null) ?
                        _this.idNodoSeleccionado : -1,
                    salidas: _this.salidas
                }
            });
        };

        if (_this.tipoView == 2 || _this.tipoView == 3) {
            _this.subscribirAftPlugins();
            _this.initAftPlugins();
        }
    },
    initDefaultButtons: function () {
        var _this = this;

        _this.btnNumSerieProducto = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnRegNumerico,
            iconCls: 'numeroserie',
            isList: false,
            handler: function () {

                if (_this.getSmPrincipal().hasSelection()) {
                    _this.idindicador = _this.getSmPrincipal().getSelected().get('idindicador');
                    var filtro = {
                        idindicador: _this.idindicador
                    };
                    _this.cambiarVista(3, filtro);

                } else {
                    mostrarMensaje(1, _this.idioma.validSelecionReporte);
                }
            }
        });
        _this.btnNmSeries = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnTodosRegNumerico,
            iconCls: 'numeroserie',
            isList: false,
            handler: function () {
                _this.cambiarVista(2, null);
            }
        });
        _this.btnProducto = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnVistaGeneral,
            isList: false,
            disabled: true,
            iconCls: 'producto',
            handler: function () {
                _this.cambiarVista(1, null);
            }
        });
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.lbBtnVista,
            iconCls: 'ver',
            tooltip: _this.idioma.btnTtCambiarVista,
            menu: [_this.btnNumSerieProducto, _this.btnNmSeries, _this.btnProducto]
        }));
        _this.btnListado = LOG.util.UIManager.createMenuItem({
            text: 'Listado General Submayor Activo',
            isList: false,
            iconCls: 'imprimir',
            handler: function () {                
                var arrayareas = _this.getStorePrincipal().data.items[0].data.areas;
                var report = new LOG.util.Report({
                    reports: [
                        { 
                            dirReport: '/distra/logistica/activofijo/submayor/ListadoGeneralSubmayor',
                            isList:true,
                            name: 'Vista general',
                            params: {
                                idestructura: _this.idNodoSeleccionado,
                                arrayidestructura: arrayareas.toString(),
                                administrativo: 1000000006,
                                servicio: 1000000008,
                                auxiliar: 1000000007
                            }
                        }
                    ]
                });report.view();
            },
            // configuracion para que el reporte salgo por servicio: btnReporteListar
            controlFn: function (b, _caller) {
                b.disable();
                b.enable = b.enable.createInterceptor(function () {
                    if (!_caller.grantedAction('btnReporteListar')) {
                        return false;
                    }
                });
            }
        });
        _this.btnSalida = {
            text: this.idioma.btnSalidas,
            iconCls: 'salida',
            handler: function () {
                if (_this.salidas == -1) {
                    _this.salidas = 2;
                    _this.listaBotones.getItem(1).setText(_this.idioma.btnSalidasN);
                } else {
                    _this.salidas = -1;
                    _this.listaBotones.getItem(1).setText(_this.idioma.btnSalidas);
                }
                _this.storePrincipal.initBaseParams = {
                    filtroespecialidad: this.filtroespecialidad,
                    arrIdEstructuras: (_this.idNodoSeleccionado.length > 0) ?
                        Ext.encode(_this.idNodoSeleccionado) : (_this.idNodoSeleccionado != null) ?
                        _this.idNodoSeleccionado : -1
                    // salidas: _this.salidas
                };
                _this.storePrincipal.initBaseParams.salidas = _this.salidas;
                _this.storePrincipal.load({
                    params: {
                        salidas: _this.salidas
                    }
                });
            },
            controlFn: function (b, _caller) {
                b.enable();
            },
            listeners: {
                'render': function (p) {
                    var theTip = null;
                    p.getEl().on('mouseover', function () {
                        theTip = new Ext.Tip({
                            margin: '0 0 0 200',
                            shadow: false
                        });

                        var text = (_this.salidas == -1) ? _this.idioma.btnTtSalidas : _this.idioma.btnTtSalidasN;
                        theTip.html = text;
                        theTip.showAt([_this.listaBotones.getItem(1).getEl().getX(), _this.listaBotones.getItem(1).getEl().getY() + 25]);
                    });
                    p.getEl().on('mouseout', function () {
                        if (theTip)
                            theTip.hide();
                    });

                }
            }
        };
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral(_this.btnSalida));

        _this.btnMovimientoSerie = {
            text: this.idioma.lbBtnMovimientos,
            iconCls: 'movimiento',
            tooltip: this.idioma.lbBtnTtMovimientos,
            handler: function () {

                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {

                    var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                    var viewMovRegNumericos = new Log.aft.submayor.ViewMovimiento({
                        idioma: _this.idioma,
                        title: record.data.descripcionmarcamodelo,
                        arrIdEstructura: _this.idNodoSeleccionado,
                        idregistronumerico: record.get('idregnumerico'),
                        recordreg:record,
                        arrayAreas:_this.arregloAreas
                    });

                    viewMovRegNumericos.getVistaPrincipal().maximized = true;
                    viewMovRegNumericos.init();
                    viewMovRegNumericos.view();
                } else {
                    mostrarMensaje(1, _this.idioma.validSelecionReporte);
                }
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        };
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral(_this.btnMovimientoSerie));

        _this.btnGraficaDepreciacion = {
            text: _this.idioma.btnGrafDepreciacion,
            tooltip: _this.idioma.btnTtGrafDepreciacion,
            iconCls: 'chart-bar',
            hidden: true,
            handler: function () {
                alert("Funcionalidad no implementada");
                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                    var record = _this.getGridPrincipal().getSelectionModel().getSelected();

                    var titulo = record.get('denominacion');
                    titulo += (record.get('marca') != null) ? (' ' + record.get('marca')) : '';
                    titulo += (record.get('modelo') != null) ? (' - ' + record.get('modelo')) : '';

                    var grafico = aft.submayor.vRegNumerico.GrafDepreciacion.getGrafica({
                        idregistronumerico: record.get('idregnumerico'),
                        titulo: titulo,
                        etiq: _this.idioma
                    });

                    grafico.show();
                    grafico.maximize();
                } else {
                    mostrarMensaje(1, _this.idioma.validSelecionReporte);
                }
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        };
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral(_this.btnGraficaDepreciacion));

        _this.btnPartesPiezas = {
            text: this.idioma.BtnPartesPieszas,
            //iconCls: '',
            hidden: true,//(_this.tipo == 0) ? true : false,
            tooltip: this.idioma.BtnTtPartesPieszas,
            handler: function () {

                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {

                    var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                    var idregnumerico = record.get('idregnumerico');

                    var partespiezs = new Log.aft.util.partespiezasagregados({
                        idregnumerico: idregnumerico
                    });

                } else {
                    mostrarMensaje(1, _this.idioma.validSelecionReporte);
                }
            },
            controlFn: function (b, _caller) {
                b.disable();
                if (_caller.grantedAction('btnRPPA')) {
                    if (_this.tipoView != 1) {
                        b.setVisible(true);
                    }
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
                }
                else  b.setVisible(false);

            }
        };
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral(_this.btnPartesPiezas));

        _this.btnExpedienteTecnico = {
            text: this.idioma.BtnExpTecn,
            //iconCls: '',
            hidden: true,
            tooltip: this.idioma.BtnTtExpTecn,
            handler: function () {

                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {

                    var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                    var report = new LOG.util.Report({
                        reports: [
                            {
                                isList: true,
                                name: 'Vista principal',
                                params: {
                                    idregnumerico: record.get('idregnumerico')
                                },
                                dirReport: '/distra/logistica/activofijo/submayor/HistorialTecnicoModelo',
                                detailFirma: {}
                            }
                        ]
                    }).view();

                } else {
                    mostrarMensaje(1, _this.idioma.validSelecionReporte);
                }
            },
            controlFn: function (b, _caller) {
                b.disable();
                if (_caller.grantedAction('btnRExpTec')) {
                    if (_this.tipoView != 1) {
                        b.setVisible(true);
                    }
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
                }
                else  b.setVisible(false);
            }
        };
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral(_this.btnExpedienteTecnico));

        _this.btnReporteRegNumericoAsociado = {
            text: _this.idioma.btnReporteRegNumerico,
            tooltip: _this.idioma.btnTtReporteRegNumerico,
            icon: perfil.dirImg + 'crearreporte',
            id: 'btnReporteRegNumerico',
            handler: function () {
                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                    var paramsBuscar = _this.modelo.getParams();
                    Ext.Msg.wait(_this.idioma.lbWaitMsgConf, _this.idioma.lbWaitTitle);
                    Ext.Ajax.request({
                        url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getregistronumericoImprimir',
                        method: 'POST',
                        params: {
                            parametros: Ext.encode(paramsBuscar)
                        },
                        callback: function (options, success, response) {
                            var response = LOG.util.UIManager.decodeAjaxResponse(response);
                            var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                            Ext.Msg.hide();
                            var report = new Distra.util.JasperClient({
                                reports: [
                                    {
                                        name: 'Vista principal',
                                        params: {
                                            idindicador: record.get('idindicador'),
                                            idestructura: _this.idNodoSeleccionado,
                                            idespecialidad: Log.aft.submayor.idusuarioespecialidad,
                                            arrayidregnumerico: (response.datos) ? '{' + response.datos + '}' : '{0}'
                                        },
                                        dirReport: '/distra/logistica/activofijo/submayor/RegistrosAsociados'
                                    }
                                ]
                            }).view();
                        }
                    });


                } else {
                    mostrarMensaje(1, _this.idioma.validSelecionReporte);
                }
            }
        };
        _this.btnReporteRegNumericos = {
            text: _this.idioma.btnReporteRegNumericos,
            tooltip: _this.idioma.btnTtReporteRegNumericos,
            icon: perfil.dirImg + 'crearreporte',
            id: 'btnReporteRegNumericos',
            handler: function () {
                Ext.Msg.wait(_this.idioma.lbWaitMsgConf, _this.idioma.lbWaitTitle);

                var paramsBuscar = _this.modelo.getParams();
                Ext.Ajax.request({
                    url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getregistronumericoImprimir',
                    method: 'POST',
                    params: {
                        parametros: Ext.encode(paramsBuscar)
                    },
                    callback: function (options, success, response) {
                        Ext.Msg.hide();
                        var response = LOG.util.UIManager.decodeAjaxResponse(response);
                        var record = _this.getGridPrincipal().getSelectionModel().getSelected();

                        var report = new LOG.util.Report({
                            reports: [
                                {
                                    name: 'Vista principal',
                                    params: {
                                        idestructura: _this.idNodoSeleccionado,
                                        idespecialidad: Log.aft.submayor.idusuarioespecialidad,
                                        arrayidregnumerico: (response.datos) ? "{" + response.datos + "}" : "{0}"
                                    },
                                    dirReport: '/distra/logistica/activofijo/submayor/RegistrosNumericos',
                                    detailFirma: {}
                                }
                            ]
                        }).view();

                    }
                });


            }
        };
       /* _this.btnImprimirReporte = LOG.util.UIManager.createBtn({
            text: _this.idioma.btnReporteImprimir,
            tooltip: _this.idioma.btnTtReporteImprimir,
            iconCls: 'imprimir',
            //hidden:true,
            id: 'btnReporteImprimir',
            handler: function () {
                (_this.tipoView == 1) ? _this.imprimirReporte() : _this.configurarReporte();
            }
        });*/
        _this.btnImprimirReporte = {
            text: _this.idioma.btnReporteImprimirListado,
            tooltip: _this.idioma.btnTtReporteImprimir,
            iconCls: 'imprimir',
            //hidden:true,
            id: 'btnReporteImprimir',
            handler: function () {
                // Imprimir Listado de activos
                (_this.tipoView == 1) ? _this.imprimirReporte() : _this.configurarReporte();
            }
        };
        _this.btnImprimirReporteUtiles = {
            text: _this.idioma.btnReporteImprimirListadoUtil,
            tooltip: _this.idioma.btnTtReporteImprimir,
            iconCls: 'imprimir',
            //hidden:true,
            id: 'btnReporteImprimirUtil',
            handler: function () {

                _this.imprimirReporte('ListadoUtilesSubmayor')
            }
        };
        _this.btnImprimirReporteActaUtiles = {
            text: _this.idioma.btnReporteImprimirActaUtil,
            // tooltip: _this.idioma.btnTtReporteImprimir,
            iconCls: 'imprimir',
            // disabled:true,
            id: 'btnReporteImprimirActaUtil',
            handler: function () {

                let repMask = new Ext.LoadMask(Ext.getBody(), {
                    msg: "Cargando datos..."
                });
                repMask.show();
                $.post('updateConfigReporte').then(data=>{
                        repMask.hide();
                        let {numero, codigoMsg} = JSON.parse(data);
                        (codigoMsg===1)? _this.imprimirReporte('BajaUtilHerramientas', numero):mostrarMensaje(3, "Error cargando el fichero de configuraci\xf3n.");
                    }
                );
            }
        };
        _this.btnReporteReporteSRM116 = {
            text: "SRM116",
            iconCls: 'crearreporte',
            disabled: (_this.tipoView != 1),
            id: 'btnReporteReporteSRM116',
            handler: function () {
                _this.prepararParamsImprimir();
                var report = new LOG.util.Report({
                    reports: [
                        {
                            name: 'Vista principal',
                            params:_this.paramsBuscar,
                            // params:{arraydeposito : "{" + _this.arregloAreas + "}"},
                            dirReport: '/distra/logistica/activofijo/submayor/ReporteSRM116',
                            detailFirma: {}
                        }
                    ]
                }).view();

            }
        };
        _this.btnReporteReporteSRM132 = {
            text: "SRM132",
            iconCls: 'crearreporte',
            disabled: (_this.tipoView != 1),
            id: 'btnReporteReporteSRM132',
            handler: function () {
                _this.prepararParamsImprimir();
                var report = new LOG.util.Report({
                    reports: [
                        {
                            name: 'Vista principal',
                            params: _this.paramsBuscar,
                            // params: {arraydeposito: "{" + _this.arregloAreas + "}", idestructura:_this.idestructura},
                            dirReport: '/distra/logistica/activofijo/submayor/ReporteSRM132',
                            detailFirma: {}
                        }
                    ]
                }).view();

            }
        };
        _this.btnReporteReporteMaquinasEquiposMedios = {
            text: _this.idioma.btnReporteMaquinasEquiposMedios,
            iconCls: 'crearreporte',
            disabled: (_this.vista == 1),
            id: 'btnReporteReporteMaquinasEquiposMedios',
            handler: function () {
                // Reporte que me falta configurar las acciones o recursos para que salga
                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                    var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                    var report = new Distra.util.JasperClient({
                        reports: [
                            {
                                name: 'Vista principal',
                                params: {
                                    idregnumerico: record.get('idregnumerico'),
                                    //arearesp: "{"+comboDeposito.getRawValue()+"}",
                                    idestructura: _this.idNodoSeleccionado,
                                    idespecialidad: Log.aft.submayor.idusuarioespecialidad
                                },
                                dirReport: '/distra/logistica/activofijo/submayor/MaquinasEquiposMedios'
                            }
                        ]
                    }).view();
                } else {
                    mostrarMensaje(1, _this.idioma.validSelecionReporte);
                }

            }
        };
        _this.btnReporteEquiposInformatica1 = {
            text: _this.idioma.btnReporteEquiposInformatica1,
            iconCls: 'crearreporte',
            disabled: (_this.vista == 1),
            id: 'btnReporteEquiposInformatica1',
            handler: function () {
                // Reporte que me falta configurar las acciones o recursos para que salga
                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                    var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                    var report = new Distra.util.JasperClient({
                        reports: [
                            {
                                name: 'Vista principal',
                                params: {
                                    idregnumerico: record.get('idregnumerico'),
                                    idestructura: _this.idNodoSeleccionado,
                                    idespecialidad: Log.aft.submayor.idusuarioespecialidad
                                },
                                dirReport: '/distra/logistica/activofijo/submayor/SubmayorEquiposInformatica'
                            }
                        ]
                    }).view();
                } else {
                    mostrarMensaje(1, _this.idioma.validSelecionReporte);
                }

            }
        };
        _this.btnReporteRegMuebles = {
            text: _this.idioma.btnReporteRegMuebles,
            tooltip: _this.idioma.btnReporteRegMuebles,
            iconCls: 'crearreporte',
            id: 'btnReporteRegMuebles',
            handler: function () {
                var combo = _this.comboDepositoVerLength();
                if (combo == false) {
                    mostrarMensaje(1, _this.idioma.validSelecionAreaReporte);
                } else {
                    var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                    var report = new Distra.util.JasperClient({
                        reports: [
                            {
                                name: 'Vista principal',
                                params: {
                                    idestructura: _this.idNodoSeleccionado,
                                    idespecialidad: Log.aft.submayor.idusuarioespecialidad
                                },
                                dirReport: '/distra/logistica/activofijo/submayor/ReporteRegistroMuebles'
                            }
                        ]
                    }).view();
                }
            }
        };
        _this.btnReporteLibroControl = {
            text: _this.idioma.btnReporteLibroControl,
            tooltip: _this.idioma.btnReporteLibroControl,
            iconCls: 'crearreporte',
            id: 'btnReporteLibroControl',
            handler: function () {
                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                    var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                    var report = new Distra.util.JasperClient({
                        reports: [
                            {
                                name: 'Vista principal',
                                params: {
                                    idestructura: _this.idNodoSeleccionado,
                                    idindicador: record.get('idindicador'),
                                    idespecialidad: Log.aft.submayor.idusuarioespecialidad
                                },
                                dirReport: '/distra/logistica/activofijo/submayor/ReporteControlExistenciasMediosMateriales'
                            }
                        ]
                    }).view();
                } else {
                    mostrarMensaje(1, _this.idioma.validSelecionReporte);
                }

            }
        };
        _this.btnReporteLibroControl107cantidad = {
            text: _this.idioma.btnReporteLibroControl107cantidad,
            tooltip: _this.idioma.btnReporteLibroControl107cantidad,
            iconCls: 'crearreporte',
            id: 'btnReporteLibroControl107cantidad',
            handler: function () {
                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                    var combo = _this.comboDepositoVerLength();
                    if (combo == false) {
                        mostrarMensaje(1, _this.idioma.validSelecionAreaReporte);
                    } else {
                        var win = new aft.submayor.WinSelecFecha({
                            idioma: _this.idioma,
                            doAction: function (fechaIni) {
                                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                                var report = new Ext.erp.LogisticaReport({});
                                var params = {
                                    reporte: 33,
                                    entidad: _this.denomNodoSeleccionado,
                                    idestructuraop: _this.idNodoSeleccionado,
                                    fecha: fechaIni,
                                    idindicador: record.get('idindicador'),
                                    denominacion: record.get('denominacion'),
                                    codigo: record.get('codigo'),
                                    marca: record.get('marca'),
                                    modelo: record.get('modelo'),
                                    idespecialidad: Log.aft.submayor.idusuarioespecialidad
                                };
                                report.showReport('generarReporte', {parametros: Ext.encode(params)});
                            }
                        });
                    }
                }
                else {
                    mostrarMensaje(1, _this.idioma.validSelecionReporte);
                }
            }
        };
        _this.btnReporteMediosTemporal = {
            text: _this.idioma.btnReporteMediosTemporal,
            tooltip: _this.idioma.btnReporteMediosTemporal,
            iconCls: 'crearreporte',
            id: 'btnReporteMediosTemporal',
            handler: function () {
                var combo = _this.comboDepositoVerLength();
                if (combo == false) {
                    mostrarMensaje(1, _this.idioma.validSelecionAreaReporte);
                } else {
                    var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                    var report = new Ext.erp.LogisticaReport({});
                    var nodoPadre = (_this.cmpAreaRespWin) ? _this.cmpAreaRespWin.dameNodoEntidadPertenece(_this.idNodoSeleccionado) : {
                        attributes: {
                            text: _this.denomNodoSeleccionado,
                            id: _this.idNodoSeleccionado
                        }
                    };
                    var area = (nodoPadre.attributes.id == _this.idNodoSeleccionado) ? '' : _this.denomNodoSeleccionado;
                    var params = {
                        reporte: 24,
                        arearesp: _this.denomNodoSeleccionado,
                        entidad: nodoPadre.attributes.text,
                        idestructuraop: _this.idNodoSeleccionado,
                        idespecialidad: Log.aft.submayor.idusuarioespecialidad,
                        especialidad: Log.aft.submayor.denominacionespecialidad
                    };
                    report.showReport('generarReporte', {parametros: Ext.encode(params)});
                }
            }
        };
        _this.btnReporteSistemaInformativoSIRM1 = {
            text: _this.idioma.btnReporteSistemaInformativoSIRM1,
            tooltip: _this.idioma.btnReporteSistemaInformativoSIRM1,
            iconCls: 'crearreporte',
            id: 'btnReporteSistemaInformativoSIRM1',
            handler: function () {

                var combo = _this.comboDepositoVerLength();
                if (combo == false) {
                    mostrarMensaje(1, _this.idioma.validSelecionAreaReporte);
                } else {
                    var nodoPadre = (_this.cmpAreaRespWin) ? _this.cmpAreaRespWin.dameNodoEntidadPertenece(_this.idNodoSeleccinado) : {
                        attributes: {
                            text: _this.denomNodoSeleccionado,
                            id: _this.idNodoSeleccionado
                        }
                    };

                    var win = new Log.aft.submayor.WinPrintConfigSIRM({
                        idioma: _this.idioma,
                        nodoPadre: nodoPadre,
                        doAction: function (fechaIni, fechaFin) {
                            var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                            _this.prepararParamsImprimir();
                            _this.paramsBuscar.fechaini = fechaIni.replace(/\//g, '-');
                            _this.paramsBuscar.fechafin = fechaFin.replace(/\//g, '-');
                            _this.paramsBuscar.tipo = 1;
                            _this.paramsBuscar.idespecialidad = Log.aft.submayor.idusuarioespecialidad;
                            var report = new LOG.util.Report({
                                reports: [
                                    {
                                        name: 'Vista principal',
                                        description: 'Vista principal',
                                        params: _this.paramsBuscar/*{
                                            idestructura: _this.idestructura,
                                            fechaini: fechaIni.replace(/\//g, '-'),
                                            fechafin: fechaFin.replace(/\//g, '-'),
                                            arraydeposito : "{" + _this.arregloAreas + "}",
                                            tipo: 1,
                                            idespecialidad: Log.aft.submayor.idusuarioespecialidad,
                                            //especialidad: rd.datos
                                        }*/,
                                        dirReport: '/distra/logistica/activofijo/submayor/ReporteSIRM1'
                                    }
                                ]
                            }).view();
                            /*docMask = new Ext.LoadMask(Ext.getBody(), {
                                msg: "Cargando..."
                            });
                            docMask.show();
                            Ext.Ajax.request({
                                url: 'getespecialidad',
                                method: 'POST',
                                params: {
                                    idestructura: nodoPadre.attributes.id,
                                    idespecialidad: Log.aft.submayor.idusuarioespecialidad
                                },
                                callback: function (options, succes, response) {
                                    var rd = Ext.decode(response.responseText);

                                    docMask.hide();
                                }
                            });*/
                        }
                    });
                    win.show();
                }
            }

        };
        _this.btnReporteSistemaInformativoSIRM2 = {
            text: _this.idioma.btnReporteSistemaInformativoSIRM2,
            tooltip: _this.idioma.btnReporteSistemaInformativoSIRM2,
            iconCls: 'crearreporte',
            id: 'btnReporteSistemaInformativoSIRM2',
            handler: function () {
                var combo = _this.comboDepositoVerLength();
                if (combo == false) {
                    mostrarMensaje(1, _this.idioma.validSelecionAreaReporte);
                } else {
                    var nodoPadre = (_this.cmpAreaRespWin) ? _this.cmpAreaRespWin.dameNodoEntidadPertenece(_this.idNodoSeleccinado) : {
                        attributes: {
                            text: _this.denomSeleccinado,
                            id: _this.idNodoSeleccinado
                        }
                    };
                    var win = new Log.aft.submayor.WinPrintConfigSIRM({
                        idioma: _this.idioma,
                        nodoPadre: nodoPadre,
                        doAction: function (fechaIni, fechaFin) {
                            var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                            _this.prepararParamsImprimir();
                            _this.paramsBuscar.fechaini = fechaIni.replace(/\//g, '-');
                            _this.paramsBuscar.fechafin = fechaFin.replace(/\//g, '-');
                            _this.paramsBuscar.tipo = 2;
                            _this.paramsBuscar.idespecialidad = Log.aft.submayor.idusuarioespecialidad;
                            var report = new LOG.util.Report({
                                reports: [
                                    {
                                        name: 'Vista principal',
                                        params: _this.paramsBuscar/*{
                                        params: {
                                            idestructura: _this.idNodoSeleccionado,
                                            fechaini: fechaIni.replace(/\//g, '-'),
                                            fechafin: fechaFin.replace(/\//g, '-'),
                                            arraydeposito : "{" + _this.arregloAreas + "}",
                                            tipo: 2,
                                            idespecialidad: Log.aft.submayor.idusuarioespecialidad,
                                            //especialidad: rd.datos
                                        }*/,
                                        dirReport: '/distra/logistica/activofijo/submayor/ReporteSRM2',
                                        detailFirma: {}
                                    }
                                ]
                            }).view();
                            /*docMask = new Ext.LoadMask(Ext.getBody(), {
                                msg: "Cargando..."
                            });
                            docMask.show();

                            Ext.Ajax.request({
                                url: 'getespecialidad',
                                method: 'POST',
                                params: {
                                    idestructura: _this.idNodoSeleccionado, //nodoPadre.attributes.id
                                    idespecialidad: Log.aft.submayor.idusuarioespecialidad
                                },
                                callback: function (options, succes, response) {
                                    var rd = Ext.decode(response.responseText);

                                    docMask.hide();
                                }
                            });*/
                        }
                    });
                    win.show();
                }
            }
        };
        _this.btnReporteSistemaInformativoSIRM4 = {
            text: _this.idioma.btnReporteSistemaInformativoSIRM4,
            tooltip: _this.idioma.btnReporteSistemaInformativoSIRM4,
            iconCls: 'crearreporte',
            id: 'btnReporteSistemaInformativoSIRM4',
            handler: function () {

                var combo = _this.comboDepositoVerLength();
                if (combo == false) {
                    mostrarMensaje(1, _this.idioma.validSelecionAreaReporte);
                } else {
                    var win = new Log.aft.submayor.WinPrintConfigSIRM({
                        idioma: _this.idioma,
                        nodoPadre: (_this.cmpAreaRespWin) ? _this.cmpAreaRespWin.dameNodoEntidadPertenece(_this.idNodoSeleccinado) : {
                            attributes: {
                                text: _this.denomSeleccinado,
                                id: _this.idNodoSeleccinado
                            }
                        },
                        doAction: function (fechaIni, fechaFin, nodoPadre) {
                            _this.prepararParamsImprimir();
                            _this.paramsBuscar.fechainicio = fechaIni.replace(/\//g, '-');
                            _this.paramsBuscar.fechafin = fechaFin.replace(/\//g, '-');
                            _this.paramsBuscar.idespecialidad = Log.aft.submayor.idusuarioespecialidad;
                            var report = new LOG.util.Report({
                                reports: [
                                    {
                                        name: 'Vista principal',
                                        params: _this.paramsBuscar
                                        /*{
                                            idestructura: _this.idNodoSeleccionado,
                                            fechainicio: fechaIni.replace(/\//g, '-'),
                                            fechafin: fechaFin.replace(/\//g, '-'),
                                            arraydeposito : "{" + _this.arregloAreas + "}",
                                            idespecialidad: Log.aft.submayor.idusuarioespecialidad
                                        }*/,
                                        dirReport: '/distra/logistica/activofijo/submayor/ReporteSIRM4',
                                        detailFirma: {}
                                    }
                                ]
                            }).view();
                        }
                    });
                    win.show();
                }
            }
        };
        var array_reportes = [];
        array_reportes.push();
        if (Log.aft.submayor.acciones.length > 0) {
            array_reportes.push(_this.btnImprimirReporte);
            array_reportes.push(_this.btnImprimirReporteUtiles);
            array_reportes.push(_this.btnListado);
            //array_reportes.push(_this.btnImprimirReporteActaUtiles);
            for (var i = 0; i < Log.aft.submayor.acciones.length; i++) {
                
                switch (Log.aft.submayor.acciones[i].abreviatura) {
                    case 'btnReporteReporteSRM116':
                        //array_reportes.push(_this.btnReporteReporteSRM116);
                        break;
                    case 'btnReporteReporteSRM132':
                        //array_reportes.push(_this.btnReporteReporteSRM132);
                        break;
                    case 'btnReporteSistemaInformativoSIRM1':
                        //array_reportes.push(_this.btnReporteSistemaInformativoSIRM1);
                        break;
                    case 'btnReporteSistemaInformativoSIRM2':
                        //array_reportes.push(_this.btnReporteSistemaInformativoSIRM2);
                        break;
                    case 'btnReporteSistemaInformativoSIRM4':
                        //array_reportes.push(_this.btnReporteSistemaInformativoSIRM4);
                        break;
                   /* case 'btnReporteReporteMaquinasEquiposMedios':
                        array_reportes.push(_this.btnReporteReporteMaquinasEquiposMedios);
                        break;
                    case 'btnReporteEquiposInformatica1':
                        array_reportes.push(_this.btnReporteEquiposInformatica1);
                        break;
                    case 'btnReporteRegMuebles':
                        array_reportes.push(_this.btnReporteRegMuebles);
                        break;
                    case 'btnReporteLibroControl':
                        array_reportes.push(_this.btnReporteLibroControl);
                        break;
                    case 'btnReporteLibroControl107cantidad':
                        array_reportes.push(_this.btnReporteLibroControl107cantidad);
                        break;
                    case 'btnReporteMediosTemporal':
                        array_reportes.push(_this.btnReporteMediosTemporal);
                        break;

                    case 'NoFiltraEspacialidad':
                        this.filtroespecialidad = false;
                        break;
                }*/
            }
        }
        }
        else {
            mostrarMensaje(1, 'Debe configurar los recursos para esta acción.');
        }

        _this.btnReportes = {
            text: _this.idioma.btnReportes,
            tooltip: _this.idioma.btnReportes,
            hidden: (array_reportes.length == 0),
            iconCls: 'crearreporte',
            menu: array_reportes,
            controlFn: function (b, _caller) {
                b.enable();
            }
        };
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir(/*_this.btnImprimirReporte*/_this.btnReportes));

        _this.btnCumplimientoMantenimiento = {
            text: this.idioma.BtnCumplimientoMantenimiento,
            iconCls: 'cumplimiento',
            tooltip: this.idioma.BtnTtCumplimientoMantenimiento,
            hidden: true,//(_this.tipo == 0) ? true : false,
            handler: function () {
                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                    /* var ventana =  new Log.aft.rcp.Ventana({ width: 900, height: 600, title: 'Cumplimiento del mantenimiento',
                     aplicarCumplimiento: false, recordRegSelected:rec});*/
                    var rec = _this.getGridPrincipal().getSelectionModel().getSelected();
                    var ventanaCumplim = new Log.aft.rcp.Plantilla({
                        formaVisualizacion: 'ventana',
                        width: 900,
                        height: 600,
                        title: 'Cumplimiento del mantenimiento',
                        aplicarCumplimiento: _this.grantedAction('RCumplimientoMant'),
                        regNumerico: rec,
                        acciones: _this.listaAcciones.getArray()
                    });
                    ventanaCumplim.init();
                    ventanaCumplim.getVistaPrincipal().listaBotones.getItem(2).hide();
                    ventanaCumplim.getVistaPrincipal().listaBotones.getItem(1).hide();
                    Ext.apply(ventanaCumplim.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({}, true));
                    Ext.Ajax.request({
                        url: '/logistica/activos_fijos/configuracion/index.php/confplanificacionmantenimiento/cargarPlanificaciones',
                        method: 'POST',
                        params: {idindicador: rec.json.idindicador},
                        callback: function (o, s, r) {
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            var idsplanif = new Array();
                            if (resp.success) {
                                for (var i = 0; i < resp.cantidad; i++) {
                                    idsplanif.push(resp.datos[i]['idplanificacionmantenimiento']);
                                    var idPlanf = resp.datos[i]['idplanificacionmantenimiento'];
                                    ventanaCumplim.addGridColumn(
                                        {
                                            header: resp.datos[i]['periodo'] + ' / ' + resp.datos[i]['recursoconsumido'],
                                            width: 110,
                                            hidden: true,
                                            dataIndex: idPlanf,
                                            renderer: function(value, metaData, record) {
                                                var dat = this.dataIndex + 'mantenimiento';
                                                if (value == 1) {
                                                    if (record.json[dat] > 0) {
                                                        metaData.css = 'icondistra-aceptar verde';
                                                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmSi + '"';
                                                    }
                                                    else
                                                    {
                                                        metaData.css = 'icondistra-aceptar rojo';
                                                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmNo + '"';
                                                    }
                                                }
                                            }
                                        }
                                    )
                                    ventanaCumplim.addGridColumn(
                                        {
                                            header: resp.datos[i]['periodo'] + ' / ' + resp.datos[i]['recursoconsumido'],
                                            width: 110,
                                            dataIndex: resp.datos[i]['idplanificacionmantenimiento'] + 'mantenimiento',
                                            //editor: new Ext.form.Checkbox({}), //new Ext.form.TextField({}),
                                            renderer: function (value, metaData, record) {
                                                if (record.data[idPlanf] == 1) {
                                                    if (value > 0) {
                                                        metaData.css = 'icondistra-aceptar verde';
                                                        metaData.attr = 'ext:qtip="' + 'realizado' + '"';
                                                    }
                                                    else {
                                                        metaData.css = 'icondistra-aceptar rojo';
                                                        metaData.attr = 'ext:qtip="' + 'pendiente' + '"';
                                                    }
                                                }
                                            }
                                        }
                                    )
                                    resp.datos[i].denominacion = resp.datos[i]['periodo'] + ' / ' + resp.datos[i]['recursoconsumido'];
                                }
                                if (_this.grantedAction('RCumplimientoMant')) {
                                    ventanaCumplim.comboPlanificacion.store.loadData(resp);
                                }
                                ventanaCumplim.view();
                                ventanaCumplim.getStorePrincipal().on({
                                    'beforeload': function (st, obj) {
                                        Ext.apply(obj.params, {
                                            idplanificacionmantenimiento: Ext.encode(idsplanif),
                                            idregnumerico: rec.data.idregnumerico
                                        });
                                    }
                                });
                                ventanaCumplim.getStorePrincipal().load();
                                if (s) {
                                }
                            } else {
                            }
                        }.createDelegate(this)
                    });

                    ventanaCumplim.getVistaPrincipal().width = 800;
                }
                else
                    mostrarMensaje(1, 'Debe seleccionar un registro num\xe9rico');
            },
            controlFn: function (b, _caller) {
                b.disable();
                if (_caller.grantedAction('btnRCumpMant')) {
                    if (_this.tipoView != 1) {
                        b.setVisible(true);
                    }
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
                }
                else  b.setVisible(false);
            }
        };
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral(_this.btnCumplimientoMantenimiento));
        //console.info(_this)
        _this.btnBusquedaAvanzada = new LOG.util.Prototipos.botonGeneral({
            iconCls: 'buscaravanzada',
            text: _this.idioma.lbBtnBuscarAvz,
            hidden: true,
            tooltip: this.idioma.btnTtBusquedaAvanzada,
            handler: function () {
                var tipo = _this.tipoView;
                //Ventana de busqueda
                Log.aft.submayor.View.busquedaP = true;
                if (!_this.busqueda) {

                    _this.busqueda = new Log.aft.submayor.BusquedaEstatica({
                        idioma: _this.idioma,
                        model: _this.modelo,
                        busquedaP: Log.aft.submayor.View.busquedaP,
                        view: _this,
                        tipo: tipo
                    });

                    //Escucha del evento de limpiar la ventana
                    _this.busqueda.on({
                        'clean': function () {
                            _this.busqueda.model.reset();
                            _this.clean = true;
                            _this.getStorePrincipal().load({
                                params: {
                                    limit: 30,
                                    start: 0,
                                    salidas:(_this.salida) ? _this.salida: null
                                }
                            });
                        },
                        'find': function () {
                            _this.clean = false;
                        }
                    });
                }
                _this.modelo.setIdEstructura(_this.idestructura);
                //Atributo para cargar o no tabs dinamicos
                _this.indicadorEspecif = (_this.indicadorEspecif) ? _this.indicadorEspecif : [];
                _this.busqueda.paramsDin = _this.indicadorEspecif;

                _this.busqueda.show();

                //Cambio de vista
                if (tipo == 1) {
                    _this.busqueda.setVista(0);
                    _this.busqueda.setTipo(1);
                    _this.clean = false;
                } else {
                    _this.busqueda.setVista(1);
                    _this.busqueda.setTipo(2);
                    _this.clean = false;
                }

                if (_this.indicadorEspecif.length > 0 && (tipo == 2 || tipo == 3)) {
                    _this.busqueda.body.mask(_this.idioma.msjLoadMask);
                }
            }
        });
        this.addToolbarButton(_this.btnBusquedaAvanzada);

        _this.limpiar = new LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnLimpiar,
            //hidden: true,
            iconCls: 'limpiar',
            tooltip: _this.idioma.ttBtnLimpiar,
            handler: function () {
                if (_this.busqueda) {
                    _this.busqueda.model.reset();
                    _this.busqueda.fireEvent('limiarcampos');
                    Log.aft.submayor.View.busquedaP = false;
                }
                _this.clean = true;

                _this.getGridPrincipal().filters.clearFilters();
                _this.getGridPrincipal().filters.filters.each(function (i) {
                    i.setValue("");
                });


                _this.getStorePrincipal().load({
                    params: {
                        limit: 30,
                        start: 0,
                        salidas:(_this.salida) ? _this.salida: null

                    }
                });

            }
        });
      
        this.addToolbarButton(_this.limpiar);
        this.btnExportar = LOG.util.Prototipos.botonExportar({
        url: 'imprimirExcel',
        objSubmit: (_this.getGridPrincipal() && _this.getGridPrincipal().filters) ? _this.getGridPrincipal().filters.getFilterData() :  _this.modelo.getParams(),
        /*objSubmit: ({
            datos:  _this.modelo.getParams(),
            filter: (_this.getGridPrincipal() && _this.getGridPrincipal().filters) ? _this.configurarFilters() : null,
        }),  */   
                  //  obj.params.limit = _this.getGridPrincipal().initialConfig.bbar.pageSize;           
        disabled:false,
        hidden: false,
        handler: function (){
            _this.prepararParamsImprimir();
        }
        });
        this.addToolbarButton(_this.btnExportar);
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Exportar CONSO',
            tooltip: 'Exportar CONSO',
            iconCls: 'exportar',
            disabled: false,
            hidden:true,
            handler: function (){     
                Ext.MessageBox.wait(LOG.util.Idioma.msgExportando, LOG.util.Idioma.msgEspere);          
                Ext.Ajax.request({
                    url:'/logistica/activos_fijos/recuperaciones/index.php/submayor/fBalanceExportarConso',
                    method: 'POST',
                    params: {
                        
                    },
                    callback: function (options, success, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        var bolb = new Blob([resp.datos], {type: 'text/plain'});
                        var url = URL.createObjectURL(bolb);
                        var save = document.createElement('a');
                        save.href = url;                    
                        save.target = '_blank';
                        save.download = 'activofijoCONSO.txt';
                        var clickEvent = new MouseEvent('click', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true
                        });
                        save.dispatchEvent(clickEvent);
                        URL.revokeObjectURL(url);
                    }.createDelegate(this)
                });
            }
        }));       

        this.btnExportarExcelVistaGeneral = LOG.util.Prototipos.botonExportar({
            url: 'imprimirExcelVistageneral',
 
            hidden: false,

            controlFn: function (b, _caller) {
                b.disable();
                if (_caller.grantedAction('btnExcelVG')) {
                    if (_this.tipoView == 1) {
                        b.setVisible(true);
                    }
                }
                else  b.setVisible(false);
            }
        });
        this.addToolbarButton(_this.btnExportarExcelVistaGeneral);

       this.addToolbarButton('->');
        _this.btnConfiguracion = new AFT.util.ViewConfigCache.btnGuardarConfiguracionInterfaz({
            guardar: function () {
                var vista = "";
                if (_this.tipoView == 2) {
                    vista = 'submayor_Rn_todos';
                } else if (_this.tipoView == 3) {
                    vista = 'submayor_Rn_Producto';
                }
                _this.viewConfig = this.guardarConfiguracion(vista, _this.getGridPrincipal())
            },
            resetear: function () {
                var vista = "";
                if (_this.tipoView == 2) {
                    vista = 'submayor_Rn_todos';
                } else if (_this.tipoView == 3) {
                    vista = 'submayor_Rn_Producto';
                }
                _this.viewConfig = this.reestablecerValoresPredeterminados(vista, _this.viewConfig);
                _this.cambiarVista(1, null);
            }
        });
        this.addToolbarButton(_this.btnConfiguracion);

        _this.btnAyuda = LOG.util.Prototipos.botonAyuda({id: 'idsubmayoractivos'});
        this.addToolbarButton(_this.btnAyuda);
        

        

      
        if (_this.tipoView == 1) {
            _this.listaBotones.getItem(2).hide();
            //_this.btnMovimientoSerie.hide();
            _this.listaBotones.getItem(3).hide();
            //_this.btnGraficaDepreciacion.hide();
            _this.listaBotones.getItem(2).disable();
            //_this.btnMovimientoSerie.disable();
            _this.listaBotones.getItem(3).disable();
            //_this.btnGraficaDepreciacion.disable();            
           _this.listaBotones.getItem(4).hide();
            //_this.btnPartesPiezas.hide();
           _this.listaBotones.getItem(5).hide();
            //_this.btnExpedienteTecnico.hide();
			//Escondiendo el boton de reporte
			//_this.listaBotones.getItem(6).hide();
            _this.listaBotones.getItem(4).disable();
            
            _this.listaBotones.getItem(6).menu.items.items[0].disable();
            _this.listaBotones.getItem(6).menu.items.items[1].disable();
            _this.listaBotones.getItem(6).menu.items.items[2].enable();
            //_this.btnCumplimientoMantenimiento.hide();
            //_this.listaBotones.getItem(7).hide();
            //_this.listaBotones.getItem(7).disable();

            //_this.btnPartesPiezas.disable();
            _this.listaBotones.getItem(5).disable();
            //_this.btnExpedienteTecnico.disable();

           _this.listaBotones.getItem(12).disable();
            _this.listaBotones.getItem(12).hide();
        }
       _this.listaBotones.getItem(3).hide();
    },
    comboDepositoVerLength: function () {
        return true;
    },
    initDefaultColumns: function () {
        var _this = this;
        var cols = new Array();
        if (_this.tipoView == 1) {
            cols = _this.crearColumnasVistaGenaral();
        } else {
            cols = _this.crearColumnasVistaRegistros();
        }
        for (var i = 0; i < cols.length; i++) {
            this.addGridColumn(cols[i]);
        }
    },
    crearColumnasVistaGenaral: function () {
        var _this = this;

        var array_cols = new Array();
        array_cols.push({
            dataIndex: 'idindicador',
            default: true
        });
        array_cols.push({
            dataIndex: 'areas',
            default: true
        });
        array_cols.push({
            dataIndex: 'arridtablas',
            default: true
        });
        array_cols.push({
            dataIndex: 'idtabla',
            default: true
        });
        array_cols.push({
            header: this.idioma.lbCmCodigo,
            dataIndex: 'codigo',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'codigo'
            }
        }); array_cols.push({
            header: this.idioma.lbCmCodigoprov,
            dataIndex: 'numeropieza',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'numeropieza'
            }
        });
        // array_cols.push({
        //     header: this.idioma.lbCmDenominacion,
        //     dataIndex: 'denominacion',
        //     width: 150,
        //     filter: {
        //         type: 'string',
        //         dataIndex: 'denominacion'
        //     }
        // });
        array_cols.push({
            dataIndex: 'marca',
            default: true
        });
        array_cols.push({
            dataIndex: 'modelo',
            default: true
        });
        array_cols.push({
            header: this.idioma.lbCmMarcaModelo,
            dataIndex: 'marcamodelo',
            default: true,
            sortable: true,
            hidden: (_this.tipo == 1) ? true : false,
            width: 200,
            filter: {
                type: 'string',
                dataIndex: 'marcamodelo'
            },
            renderer: function (v, p, recordActivo) {
                var valor = '';

                if (recordActivo.get('marca') != null) {
                    valor = recordActivo.get('marca');
                } else
                    valor = "";

                if (recordActivo.get('modelo') != null) {
                    valor += ' - ' + recordActivo.get('modelo');
                } else
                    valor += "";

                return valor;
            }
        });
        array_cols.push({
            header: this.idioma.lbCmCantidad,
            dataIndex: 'cantidad',
            default: true,
            align: 'right'/*,
             filter:{
             type:'numeric',
             dataIndex:'cantidad'
             }*/
        });
        array_cols.push({
            header: this.idioma.lbCmDisponibilidad,
            dataIndex: 'disponible',
            default: true,
            align: 'right'/*,
             filter:{
             type:'numeric',
             dataIndex:'disponible'
             }*/
        });
        array_cols.push({
            header: this.idioma.lbNaturaleza,
            dataIndex: 'naturaleza',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'naturaleza'
            }
        });
        var cont = 0;
        this.actividad = _this.actividad;
        Ext.each(_this.actividad, function(actv){
            array_cols.push({
                header: actv.denominacion,
                dataIndex: 'activ' + actv.idactividad,
                default: true
            });
            cont++;
        });

        return array_cols;
    },
    crearColumnasVistaRegistros: function () {

        var _this = this;

        var array_cols = new Array();

        if (!_this.idindicador) {
            array_cols.push({
                header: this.idioma.lbCmCodigo,
                dataIndex: 'codigo',
                sortable: true,
                filter: {
                    type: 'string',
                    dataIndex: 'codigo'
                }
            }); array_cols.push({
                header: this.idioma.lbCmCodigoprov,
                dataIndex: 'numeropieza',
                sortable: true,
                filter: {
                    type: 'string',
                    dataIndex: 'numeropieza'
                }
            });
            // array_cols.push({
            //     header: this.idioma.lbCmDenominacion,
            //     dataIndex: 'denominacion',
            //     width: 150,
            //     autoExpand: true,
            //     sortable: true,
            //     filter: {
            //         type: 'string',
            //         dataIndex: 'denominacion'
            //     }
            // });

            array_cols.push({
                header: this.idioma.lbCmMarca,
                dataIndex: 'marca',
                sortable: true,
                filter: {
                    type: 'combo',
                    dataIndex: 'marca',
                    valueField: 'idmarca',
                    displayField: 'denominacion',
                    url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getmarcasmodelos?tipo=1'
                }
            });
            array_cols.push({
                header: this.idioma.lbCmModelo,
                dataIndex: 'modelo',
                sortable: true,
                filter: {
                    type: 'combo',
                    dataIndex: 'modelo',
                    valueField: 'idmodelo',
                    displayField: 'denominacion',
                    url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getmarcasmodelos?tipo=2'
                }
            });
            
            
            array_cols.push({
                header: "Grupo",
                dataIndex: 'descripciongrupo',
                sortable: false,
                filter: {
                    type: 'list',
                    options: _this.grupossubgrupos,
                    dataIndex: 'idgruposubgrupo'
                }
            });
            
        }

        array_cols.push({
            dataIndex: 'idregnumerico',
            default: true
        });
        array_cols.push({
            dataIndex: 'idindicador',
            default: false
        });

        array_cols.push({
            header: this.idioma.lbOperacion,
            dataIndex: 'estadoperacion',
            sortable: true,
            filter: {
                type: 'list',
                options: _this.estadosoperacion,
                dataIndex: 'idestadoperacion'
            }
        });
        array_cols.push({
            header: this.idioma.lbNaturaleza,
            dataIndex: 'naturaleza',
            sortable: true,
            filter: {
                type: 'list',
                options: _this.naturalezas,
                dataIndex: 'idnaturaleza'
            }
        });
        array_cols.push({
            header: this.idioma.lbCentroCosto,
            dataIndex: 'denomcentrocosto',
            default: true,
            sortable: false,
            width: 100,
            filter: {
                type: 'combo',
                dataIndex: 'text',
                valueField: 'idcentrogrupo',
                url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getcentroscostos',
                displayField: 'text'
            }
        });
        array_cols.push({
            header: "Entidad",
            dataIndex: 'denomentidad',
            default: true,
            sortable: false,
            width: 100,
            filter: {
                type: 'combo',
                dataIndex: 'denomentidad',
                valueField: 'idfila',
                url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getEntidades',
                displayField: 'denomentidad'
            }
        });
        array_cols.push({
            header: 'Área de responsabilidad',
            dataIndex: 'denomarearesp',
            sortable: true,
            filter: {
                type: 'combo',
                dataIndex: 'iddeposito',
                valueField: 'iddeposito',
                url: '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/cargarareas',
                displayField: 'deposito'
            }
        });

        
        return array_cols;
    },
    cambiarVista: function (vista, filtro) {
        var _this = this;
        if (vista != _this.tipoView) {
            _this.tipoView = vista;
            var cols = new Array();
            if (_this.tipoView == 2 || _this.tipoView == 3) {
                if (_this.busqueda) {
                    _this.clean = true;
                    _this.busqueda.LimpiarVGeneral();
                }
                if (vista == 2)
                    _this.idindicador = null;
                else
                    _this.idindicador = _this.getSmPrincipal().getSelected().get('idindicador');
                // _this.propertyGrid.fnCollapse();

                _this.listaBotones.getItem(2).show();
                _this.listaBotones.getItem(3).show();
                _this.listaBotones.getItem(2).disable();
                _this.listaBotones.getItem(3).disable();


                _this.listaBotones.getItem(4).show();
                _this.listaBotones.getItem(5).show();
                _this.listaBotones.getItem(6).show();
                _this.listaBotones.getItem(4).disable();
                _this.listaBotones.getItem(5).disable();
                _this.listaBotones.getItem(6).enable();

                _this.listaBotones.getItem(7).show();
                _this.listaBotones.getItem(7).disable();

                _this.listaBotones.getItem(12).hide();
                // _this.listaBotones.getItem(12).show();

                _this.listaBotones.getItem(10).show();
                _this.listaBotones.getItem(10).enable();

                _this.urlBusquedaGridPrincipal = 'getregistronumerico';
                cols = _this.crearColumnasVistaRegistros();
                _this.modificarVisibilidadColumnasPlugins(false);
                /*
                 * Variables para la dualidad de moneda
                 * VARIABLES                    CONCEPTOS
                 * alternativa                  True o False si existe dualidad
                 * monedacontable               idmonedacontable
                 * nommonedacontable            Nombre moneda contable
                 * monedaalternativa            idmonedaalternativa
                 * nommonedaalternativa         Nombre moneda alternativa
                 * */
                for (var prop in _this.camposGenerales) {
                    var campo = _this.camposGenerales[prop];
                    _this.adicionarFiltros(campo);
                    if (alternativa) {
                        if (campo.contable && campo.header.indexOf(nommonedacontable) == -1)
                            campo.header = campo.header + ' ' + nommonedacontable;
                        if (campo.dataIndex.indexOf('alternativo') != -1 && campo.header.indexOf(nommonedaalternativa) == -1)
                            campo.header = campo.header + ' ' + nommonedaalternativa;
                        /*if (campo.dataIndex == 'valorcontable') {
                            Ext.apply(campo, {
                                renderer: function (_v, _mD, _r) {
                                    if (parseFloat(_r.data.valorcontable) == parseFloat(_r.data.valoradquisicion))
                                        _v = parseFloat(_r.data.valoradquisicion - _r.data.depreciacionacumulada).toFixed(2);
                                    else
                                        _v = parseFloat(_r.data.valorcontable - _r.data.depreciacionacumulada).toFixed(2);
                                    return _v;
                                }
                            });
                        }*/


                        /*if (campo.dataIndex == 'valorcontablealternativo') {
                            Ext.apply(campo, {
                                renderer: function (_v, _mD, _r) {
                                    if (parseFloat(_r.data.valorcontablealternativo) == parseFloat(_r.data.valoradquisicionalternativo))
                                        _v = parseFloat(_r.data.valoradquisicionalternativo - _r.data.depreciacionacumuladaalternativo).toFixed(2);
                                    else
                                        _v = parseFloat(_r.data.valorcontablealternativo - _r.data.depreciacionacumuladaalternativo).toFixed(2);
                                    return _v;
                                }
                            });
                        }*/
                        
                        cols.push({
                            header: campo.header,
                            dataIndex: campo.dataIndex,
                            default: true,
                            sortable: true,
                            renderer: campo.renderer,
                            filter: campo.filter

                        });
                    } else if (campo.dataIndex.indexOf('alternativo') == -1) {
                        /*if (campo.dataIndex == 'valorcontable') {
                            Ext.apply(campo, {
                                renderer: function (_v, _mD, _r) {
                                    if (parseFloat(_r.data.valorcontable) == parseFloat(_r.data.valoradquisicion))
                                        _v = parseFloat(_r.data.valoradquisicion - _r.data.depreciacionacumulada).toFixed(2);
                                    else
                                        _v = parseFloat(_r.data.valorcontable - _r.data.depreciacionacumulada).toFixed(2);
                                    return _v;
                                }
                            });
                        }*/
                        cols.push({
                            header: campo.header,
                            dataIndex: campo.dataIndex,
                            default: true,
                            sortable: true,
                            renderer: campo.renderer,
                            filter: campo.filter

                        });
                    }
                }
                _this.subscribirAftPlugins();
                if (_this.tipo == 0) {
                    this.listaAftPlugins.each(function (plugin) {
                        var c = plugin.getArrCampos();
                        for (var i = 0; i < c.length; i++) {
                            var campo = _this.campos[c[i].dataIndex.toString()];
                            var aux = c[i];
                            if (typeof(campo) != 'undefined') {
                                c[i].xtype = campo.xtype
                                _this.adicionarFiltros(c[i]);
                                aux = {
                                    dataIndex: c[i].dataIndex,
                                    header: c[i].header,
                                    hideable: c[i].hideable,
                                    id: c[i].id,
                                    sortable: true,
                                    width: c[i].width,
                                    filter: c[i].filter
                                }
                            }
                            cols.push(aux);
                        }
                    }, cols);
                }

                if (_this.tipo == 1) {
                    _this.hideColumns(cols);
                }
                this.idGridPrincipal = 'idregnumerico';
                _this.indicadorEspecif = this.getGridPrincipal().getSelectionModel().getSelections();
            } else if (_this.tipoView == 1) {
                if (_this.busqueda) {
                    _this.clean = true;
                    _this.busqueda.LimpiarVRegNume();
                }

                _this.panelDerecho.collapse();
                _this.listaBotones.getItem(7).hide();

                _this.listaBotones.getItem(2).hide();
                _this.listaBotones.getItem(3).hide();
                _this.listaBotones.getItem(2).disable();
                _this.listaBotones.getItem(3).disable();

                _this.listaBotones.getItem(4).hide();
                _this.listaBotones.getItem(5).hide();
                //_this.listaBotones.getItem(6).hide();

                 _this.listaBotones.getItem(10).hide();

                _this.listaBotones.getItem(4).disable();
                _this.listaBotones.getItem(5).disable();
                //_this.listaBotones.getItem(6).disable();
                _this.listaBotones.getItem(6).menu.items.items[0].disable();
                _this.listaBotones.getItem(6).menu.items.items[1].disable();
                _this.listaBotones.getItem(6).menu.items.items[2].enable();
                _this.listaBotones.getItem(11).hide();
                _this.listaBotones.getItem(12).enable();
                _this.listaBotones.getItem(12).show();

              /*  if (_this.tipo == 0) {
                    _this.listaBotones.getItem(10).enable();
                    _this.listaBotones.getItem(10).show();
                }*/


                //   _this.listaBotones.getItem(9).menu.items.items[1].disable();

                _this.urlBusquedaGridPrincipal = 'getconteo';
                _this.listaAftPlugins = new LOG.util.List();
                cols = _this.crearColumnasVistaGenaral();
                _this.idGridPrincipal = 'idindicador';
            }

            _this.listaBotones.getItem(3).hide();

            var ncols = new LOG.util.List();
            for (var i = 0; i < cols.length; i++) {
                ncols.add(cols[i]);
            }

            var columns = LOG.util.UIManager.proccessColumns(ncols);
            var cmGridPrincipal = new Ext.ux.grid.LockingColumnModel(columns.columns);
            var recStGridPrincipal = Ext.data.Record.create(columns.fields);
            var cfgStore = {
                url: _this.urlBusquedaGridPrincipal,
                remoteSort: true,
                reader: new Ext.data.JsonReader({
                    id: _this.idGridPrincipal,
                    totalProperty: 'cantidad',
                    root: 'datos'
                }, recStGridPrincipal)
            };
            var store = new Ext.ux.maximgb.AdjacencyListStore(cfgStore);

            _this.storePrincipal = store;
          //  console.info(_this)
            var vista = "";
            if (_this.tipoView == 2) {
                _this.btnBusquedaAvanzada.setVisible(true);
                _this.limpiar.setVisible(true);
                vista = 'submayor_Rn_todos';
                _this.listaBotones.getItem(6).menu.items.items[2].disable();
                _this.listaBotones.getItem(6).menu.items.items[0].enable();
                _this.listaBotones.getItem(6).menu.items.items[1].enable();
            } else if (_this.tipoView == 3) {
                _this.btnBusquedaAvanzada.setVisible(true);
                _this.limpiar.setVisible(true);
                vista = 'submayor_Rn_Producto';
                _this.listaBotones.getItem(6).menu.items.items[2].disable();
                _this.listaBotones.getItem(6).menu.items.items[0].enable();
                _this.listaBotones.getItem(6).menu.items.items[1].enable();
            }
            if (_this.tipoView == 1) {
                _this.btnBusquedaAvanzada.setVisible(false);
                _this.limpiar.setVisible(true);
            }

            cmGridPrincipal = AFT.util.ViewConfigCache.cargarConfiguracionInterfaz(vista, /*_this.getGridPrincipal()*/cmGridPrincipal, _this.viewConfig);
            _this.gpPrincipal.reconfigure(store, cmGridPrincipal);

            _this.gpPrincipal.setAutoScroll(true);
            _this.gpPrincipal.getView().refresh();
            _this.gpPrincipal.getBottomToolbar().bindStore(store);
            _this.modelo.bindGridPanel(_this.getGridPrincipal());

            _this.storePrincipal.on({
                beforeload: function (st, obj) {
                    // obj.params.start = _this.getGridPrincipal().initialConfig.bbar.cursor;
                    obj.params.limit = _this.getGridPrincipal().initialConfig.bbar.pageSize;
                    obj.params['idindicador'] = _this.idindicador;
                    _this.listaBotones.getItem(6).disable();
                    if (!_this.clean) {
                        _this.modelo.actualizarParams(obj.params.filter);
                        if (_this.busqueda) {
                            Ext.apply(obj.params, _this.modelo.getParams());
                        }

                    } else {
                        _this.modelo.addParametrosAEnviar();
                        obj.params['filtroespecialidad'] = _this.filtroespecialidad;
                        obj.params['arrIdEstructuras'] = (_this.idNodoSeleccionado.length > 0) ?
                            Ext.encode(_this.idNodoSeleccionado) : (_this.idNodoSeleccionado != null) ?
                            _this.idNodoSeleccionado : -1;
                        obj.params['salidas'] = _this.salidas;
                    }
                    if (_this.tipoView == 2 || _this.tipoView == 3) {
                        obj.params['tipo'] = _this.tipo;
                        obj.params['salidas'] = (_this.salidas)? _this.salidas : null;

                    }
                    _this.clean = false;
                },
                load: function (st, obj) {
                    _this.cantidadTotal = st.reader.jsonData.cantidadTotal;
                  /*  params: {
                        salidas: (_this.salidas)? _this.salidas : null
                    }*/


                    (_this.cantidadTotal) ? document.getElementById('idHTMLcantidad').innerHTML = "<b>Cantidad total: </b>" + _this.cantidadTotal : document.getElementById('idHTMLcantidad').innerHTML = "";
                    if (Log.aft.submayor.View.busquedaP) {
                        if (st.data.items.length == 0) {
                            mostrarMensaje(1, _this.idioma.lbSindatosBuscar);
                        }
                    }
                    else {
                        if (st.data.items.length == 0) {
                            mostrarMensaje(1, _this.idioma.lbSindatos);
                        }
                    }
                    switch (_this.tipoView) {
                        case 1:
                            _this.btnNumSerieProducto.enable();
                            _this.btnNmSeries.enable();
                            _this.btnProducto.disable();
                            break;
                        case 2:
                            _this.btnNumSerieProducto.enable();
                            _this.btnNmSeries.disable();
                            _this.btnProducto.enable();
                            break;
                        case 3:
                            _this.btnNumSerieProducto.disable();
                            _this.btnNmSeries.enable();
                            _this.btnProducto.enable();
                            break;
                    }

                    if (st.getCount() == 0) {
                        _this.listaBotones.getItem(6).disable();
                    } else {
                        _this.listaBotones.getItem(6).enable();
                    }
                    _this.listaBotones.getItem(6).enable();
                }
            });
            _this.storePrincipal.load({
                params: {
                    filtroespecialidad: this.filtroespecialidad,
                    arrIdEstructuras: (_this.idNodoSeleccionado.length > 0) ?
                        Ext.encode(_this.idNodoSeleccionado) : (_this.idNodoSeleccionado != null) ?
                        _this.idNodoSeleccionado : -1,
                    salidas: _this.salidas
                }
            });
            _this.listaColumnas.deleteAll();
            for (var i = 0; i < columns.columns.length; i++) {
                if (columns.columns[i].header != "N.°") {
                    _this.listaColumnas.add(columns.columns[i]);
                }
            }
            if (_this.tipoView == 2 || _this.tipoView == 3) {
                _this.modificarVisibilidadColumnasPlugins(false);
            }
        }
    },
    hideColumns: function (cols) {
        var _this = this;
        Ext.each(cols, function (col) {
            if (col.dataIndex == 'nroserie' || col.dataIndex == 'modelo' || col.dataIndex == 'marca' || col.dataIndex == 'fechaadq'
                || col.dataIndex == 'colorprim' || col.dataIndex == 'colorsec' || col.dataIndex == 'recursoconsumidomax' ||
                col.dataIndex == 'recursoconsumido' || col.dataIndex == 'depreciacionacumulada' || col.dataIndex == 'depreciacionacumuladaalternativo'
                || col.dataIndex == 'tasafiscal' || col.dataIndex == 'actividad' || col.dataIndex == 'categoria' || col.dataIndex == 'fechaexpini'
                || col.dataIndex == 'fechaexpfin' || col.dataIndex == 'denomcentrocosto' || col.dataIndex == 'fechainicialgarantia'
                || col.dataIndex == 'fechafingarantia' || col.dataIndex == 'cantidadrecursoconsumido' || col.dataIndex == 'porcientorecuperacion') {

                Ext.apply(col, {
                    hidden: true
                });
            }
        });
    },
    adicionarFiltros: function (campo) {

        if (campo.dataIndex == "denomarearesp") {
            campo.filter = {
                type: 'combo',
                dataIndex: 'iddeposito',
                valueField: 'iddeposito',
                url: '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/cargarareas',
                displayField: 'deposito'
            }
            return;
        }
        if (campo.dataIndex == "colorprim" || campo.dataIndex == "colorsec") {
            campo.filter = {
                type: 'combo',
                dataIndex: 'idcolor',
                valueField: 'idcolor',
                url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getnomencladorfiltro?tipo=1',
                displayField: 'denominacion'
            }
            return;
        }
        if (campo.dataIndex == "actividad") {
            campo.filter = {
                type: 'combo',
                dataIndex: 'idactividad',
                valueField: 'idactividad',
                url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getnomencladorfiltro?tipo=2',
                displayField: 'denominacion'
            }
            return;
        }
        if (campo.dataIndex == "categoria") {
            campo.filter = {
                type: 'combo',
                dataIndex: 'idcategoria',
                valueField: 'idcategoria',
                url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getnomencladorfiltro?tipo=3',
                displayField: 'denominacion'
            }
            return;
        }
        if (campo.dataIndex == "denomestadotecnico") {
            campo.filter = {
                type: 'combo',
                dataIndex: 'denomestadotecnico',
                valueField: 'idestatustecnico',
                url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getnomencladorfiltro?tipo=4',
                displayField: 'denominacion'
            }
            return;
        }
        switch (campo.xtype) {
            case 'numberfield' :
                campo.filter = {
                    type: 'numeric',
                    dataIndex: campo.dataIndex
                }
                break;
            case 'textfield' :
                campo.filter = {
                    type: 'string',
                    dataIndex: campo.dataIndex
                }
                break;
            case 'combobox' :
                campo.filter = {
                    type: 'string',
                    dataIndex: campo.dataIndex
                }
                break;
            case 'win_responsable' :
                campo./*filter = {
                    type: 'string',
                    dataIndex: campo.dataIndex
                }*/
                filter = {
                    type: 'combo',
                    dataIndex: campo.dataIndex,
                    valueField: 'idresponsable',
                    displayField: 'responsable',
                    url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getResponsables'                    
                }
                
                break;
            case 'win_ubicacion' :
                campo.filter = {
                    type: 'string',
                    dataIndex: campo.dataIndex
                }
                break;
            case 'datefield' :
                campo.filter = {
                    type: 'date',
                    dataIndex: campo.dataIndex
                }
                break;
            case 'list' :
                campo.filter = {
                    type: 'string',
                    dataIndex: campo.dataIndex
                }
                break;
        }
    },
    subscribirAftPlugins: function () {
        for (var i = 0; i < arrElementosGridCodigoNew.length; i++) {
            this.attachAftPlugin(arrElementosGridCodigoNew[i]);
        }
    },
    attachAftPlugin: function (plugin) {
        this.listaAftPlugins.add(plugin);
    },
    initAftPlugins: function () {
        this.listaAftPlugins.each(function (plugin) {
            plugin.init(this);
        }, this);
    },
    render: function () {
        var _this = this;
        var vista = Log.aft.submayor.View.superclass.render.call(this);

        _this.storePrincipal.initBaseParams = {
            filtroespecialidad: this.filtroespecialidad,
            salidas: _this.salidas
        };

        this.gpPrincipal.on({
            'rowdblclick': function (grid, rowIndex, eventObject) {
                _this.btnNumSerieProducto.handler();
                _this.panelDerecho.collapse();
            }
        });
        _this.propertyGrid = new Ext.LOG.RegNumOperativo.propertyAtriDinamicos({
            region: 'center',
            idioma: _this.idioma,
            height: 907,
            fnExpand: function () {
                _this.panelDerecho.expand();
            },
            fnCollapse: function () {
                _this.panelDerecho.collapse();
                if (_this.getPanelPrincipal().body.isMasked()) {
                    _this.getPanelPrincipal().body.unmask();
                }
            }
        });

        _this.propertyGridAtribDinamicos = new Ext.erp.PropertyGrid({
            schema: 'mod_datosmaestrosmeta',
            globalDefault: true,
            editable: false
        });
        _this.propertyGridAtribDinamicos.setHeight(800);

        _this.panel = new LOG.util.UIManager.initPanel({
            layout: 'card',
            activeItem: 0,
            height: 847,
            region: 'center',
            frame: true,
            items: [_this.propertyGridAtribDinamicos, _this.propertyGrid]
        });
        _this.panelDerecho.add(_this.panel);
        _this.panelDerecho.setTitle(_this.idioma.lbTitlePanelDatosMedio);
        _this.panelDerecho.setWidth(350);

        _this.on({
            'atributosDinamicos': function (value) {
                if (!value) {
                    _this.trabajarDinamicos = false;
                    _this.panelDerecho.collapse(true);
                    _this.panelDerecho.setVisible(false);
                } else {
                    _this.trabajarDinamicos = true;
                    if (_this.getGridPrincipal().getSelectionModel().getSelected())
                        _this.getGridPrincipal().getSelectionModel().selectRecords([_this.getGridPrincipal().getSelectionModel().getSelected()]);
                }
            }
        });

        _this.getGridPrincipal().getSelectionModel().on('rowselect', function (SelectionModel, rowIndex, record) {
            if (_this.trabajarDinamicos) {
                _this.getPanelPrincipal().body.mask(_this.idioma.msjLoadMask);
                if (_this.tipoView == 1) {
                    _this.propertyGridAtribDinamicos.preOperacion = function () {
                        this.llavesForaneas = Array();
                        this.llavesForaneas.push({
                            key: 'idindicador',
                            value: record.data.idindicador
                        });
                        this.idtabla = record.data.idtabla;
                        this.idtablageneral = record.data.idtablageneral;
                        this.ar_where = 'idindicador = ' + record.data.idindicador;
                        this.id = record.data.idindicador;
                    };
                    _this.propertyGridAtribDinamicos.setContenido(record.json.arridtablasgenerales);
                    _this.panelDerecho.expand();
                    _this.panelDerecho.on({
                        'expand': function () {
                            var record = _this.getGridPrincipal().getSelectionModel().getSelections();
                            _this.propertyGridAtribDinamicos.setContenido(record[0].json.arridtablasgenerales);
                        }
                    });
                    _this.panel.getLayout().setActiveItem(0);
                } else {

                    var idindicador = record.json.idindicador;
                    var idtabla = record.json.idtabla;
                    var arridtablas = record.json.arridtablas;
                    var idregnumerico = record.data.idregnumerico;
                    _this.propertyGrid.setContenido(idindicador, idregnumerico, idtabla, arridtablas);

                    if (_this.panel.getLayout() != "card") {
                        _this.panel.getLayout().setActiveItem(1);
                    } else {
                        _this.panelDerecho.expand();
                        _this.panel.getLayout().setActiveItem(1);
                    }

                }

                _this.propertyGrid.getStore().on({
                    'load': function () {
                        _this.getPanelPrincipal().body.unmask();
                    }
                });

                _this.propertyGridAtribDinamicos.getStore().on({
                    'load': function () {
                        _this.getPanelPrincipal().body.unmask();
                    }
                });
            }
        });
        //this.getGridPrincipal().initialConfig.bbar.pageSize = 15;
        //this.getGridPrincipal().initialConfig.bbar.cursor = 0;
        //this.getGridPrincipal().initialConfig.bbar.cbPageSize.setValue(this.getGridPrincipal().initialConfig.bbar.cbPageSize.store.getAt(2).data.size);

        _this.cantidadTotal = 0;
        _this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                if(_this.primerRender){
                    _this.cambiarVista(2, null);
                }
                _this.primerRender = false;
                obj.params.salidas = (_this.salidas) ? _this.salidas: null;
                obj.params.tipo = _this.tipo;
                if (!_this.clean) {
                    if (_this.busqueda) {
                        Ext.apply(obj.params, _this.modelo.getParams());
                    }
                }
            }
        });

        this.getStorePrincipal().on({
            load: function (st, obj) {
                _this.cantidadTotal = st.reader.jsonData.cantidadTotal;
                document.getElementById('idHTMLcantidad').innerHTML = "<b>Cantidad total: </b>" + _this.cantidadTotal;
                if (Log.aft.submayor.View.busquedaP) {
                    if (st.data.items.length == 0) {
                        mostrarMensaje(1, _this.idioma.lbSindatosBuscar);
                    }
                } else {
                    if (st.data.items.length == 0) {
                        mostrarMensaje(1, _this.idioma.lbSindatos);
                    }
                }
                if (st.getCount() > 0) {
                    _this.arregloAreas = st.getAt(0).data.areas;
                     _this.prepararParamsImprimir()
                }
                // _this.getStorePrincipal().initBaseParams.limit = _this.getGridPrincipal().initialConfig.bbar.pageSize || 15;
                // _this.getStorePrincipal().initBaseParams.start = _this.getGridPrincipal().initialConfig.bbar.cursor; 
            }
        });

        return vista;

    },
    imprimirReporte: function (dir, data) {
        let _this = this, dirRep = "";
        _this.prepararParamsImprimir();
        if (dir === 'ListadoUtilesSubmayor') {//idnaturaleza
            dirRep = dir;
            _this.paramsBuscar.naturaleza = "{-5}";
            _this.paramsBuscar.arrayidnaturaleza = "{" + idNatObjObra + "," + idNatInmueble + "}";
        }else
        if(dir === 'BajaUtilHerramientas')
        {
            dirRep = dir;
            _this.paramsBuscar.numero = data;
        }       
        else if (dir === 'ListadoGeneralSubmayor') {
            dirRep = dir;
        }
        else {
            dirRep = (_this.tipoView == 1) ? 'ReporteProductosCantidadDisponibles' : (_this.paramsBuscar.fvLot || _this.paramsBuscar.fvCirculacion || _this.paramsBuscar.fvFicav) ? 'RegistrosNumericos_1' : 'ListadoAftSubmayor';
        }



        _this.paramsBuscar.idarearesp = _this.paramsBuscar.denomarearesp;
        _this.paramsBuscar.idmarca = _this.paramsBuscar.marca;
        _this.paramsBuscar.idmodelo = _this.paramsBuscar.modelo;
        _this.paramsBuscar.idcolorprim = _this.paramsBuscar.colorprim;
        _this.paramsBuscar.idcolorsec = _this.paramsBuscar.colorsec;
        _this.paramsBuscar.idactividad = _this.paramsBuscar.actividad;
        _this.paramsBuscar.idcategoria = _this.paramsBuscar.categoria;
        _this.paramsBuscar.idestatustecnico = _this.paramsBuscar.denomestadotecnico;
        _this.paramsBuscar.nommonedaalternativa = nommonedaalternativa;
		_this.paramsBuscar.idgruposubgrupo = (_this.paramsBuscar.descripciongrupo) ? "{" + _this.paramsBuscar.descripciongrupo.join(',') + "}" : undefined;
		_this.paramsBuscar.identidad = _this.paramsBuscar.denomentidad;

		if(_this.paramsBuscar.naturaleza && typeof _this.paramsBuscar.naturaleza =='object')
            _this.paramsBuscar.naturaleza = "{" + _this.paramsBuscar.naturaleza.join(',') + "}";




        // _this.paramsBuscar.idarbol = 1000001362;
        // _this.paramsBuscar.idregnumerico = 1000001362;
        //_this.paramsBuscar.idindicador = _this.idindicador;

        var report = new LOG.util.Report({
            reports: [
                {
                    name: 'Vista principal',
                    params: _this.paramsBuscar,
                    //dirMaskReports: (_this.tipoView == 1) ? null : '/distra/logistica/activofijo/submayor/RegistrosNumericos_2',
                    dirReport: '/distra/logistica/activofijo/SubmayorOk/' + dirRep,
                    // dirReport: '/distra/logistica/activofijo/modulo/ReporteSRM131',// + dirRep,
                    detailFirma: {}
                }
            ]
        }).view();
    },
    configurarReporte: function () {
        var _this = this;
        _this.imprimirReporte();
        /* var ventanaReporte = new Log.aft.submayor.WinConfigReporte({
         usarAplicar: false,
         doAction:function(params){
         var objeto = {
         fvFicav:null,
         fvLot:null,
         fvCirculacion:null
         };
         if (params && params.filtro) {
         objeto[(params.campos == 1) ? 'fvFicav' : ((params.campos == 2) ? 'fvLot' : 'fvCirculacion')] = "{" + params.minfecha + "," + params.maxfecha + "}";
         }
         _this.imprimirReporte(objeto);
         }
         });
         ventanaReporte.show();*/


    },
    modificarVisibilidadColumnasPlugins: function (chequeado) {
        var _this = this;

        for (var i = 0; i < arrCampos.length; i++) {
            var plug = arrCampos[i];
            var columnas_plug = {};
            columnas_plug.campos = {};
            plug.init(columnas_plug);
            _this.campos = columnas_plug.campos;
            /*for (var colum_plug in campos) {
             _this.ocultarColumna(campos[colum_plug].dataIndex, !chequeado);


             }*/
        }
    },
    prepararParamsImprimir: function (params ={}) {
        var _this = this;
        _this.paramsBuscar = (_this.modelo.getNotEncodedParams()) ? _this.modelo.getNotEncodedParams() : {idestructura: _this.idNodoSeleccionado};
        if (_this.paramsBuscar) {
            _this.paramsBuscar.idestructura = _this.idNodoSeleccionado;
            (_this.paramsBuscar['Datos generales']) ? _this.paramsBuscar.rnaNulos = _this.paramsBuscar['Datos generales'] : _this.paramsBuscar;
            (_this.paramsBuscar['Datos transporte']) ? _this.paramsBuscar.rnatNulos = _this.paramsBuscar['Datos transporte'] : _this.paramsBuscar;
        }
        //(_this.arregloAreas) ? _this.paramsBuscar.arraydeposito = "{" + _this.arregloAreas + "}" : _this.paramsBuscar;
        _this.paramsBuscar.arrayidnaturaleza = "{" + idNatObjObra + "," + idNatInmueble + ","+idnatUTIHERR+"}";
        (_this.tipoView == 3) ? _this.paramsBuscar.idindicador = _this.idindicador : _this.paramsBuscar.idindicador = null;
        _this.paramsBuscar = Object.assign(_this.paramsBuscar, {idEntiadPadre:idEntiadPadre}, params);
        //_this.paramsBuscar = (params) ? Ext.apply(_this.paramsBuscar, params) : _this.paramsBuscar;

        (_this.btnExportar) ? _this.btnExportar.objSubmit = _this.paramsBuscar : _this.paramsBuscar;
        (_this.getGridPrincipal().filters) ? _this.configurarFilters() : _this.paramsBuscar;
    },
    configurarFilters: function () {
        var _this = this;

        var filtros = _this.getGridPrincipal().filters.getFilterData();
        var objeto = {
            codigo: null,
            numeropieza: null,
            denominacion: null,
            marcamodelo: null,
            idmarca: null,
            marca: null,
            modelo: null,
            idmodelo: null,
            idnaturaleza: null,
            idestadoperacion: null,
            denomarearesp: null,
            naturaleza: null,
            capacidad: null,
            combustibleasignado: null,
            kmasignado: null,
            denomestadotecnico: null,
            fechaadq: null,
            fechaexpfin: null,
            fechaexpini: null,
            fechafingarantia: null,
            fechainicialgarantia: null,
            idactividad: null,
            idarearesp: null,
            idcategoria: null,
            idcolorprim: null,
            idcolorsec: null,
            idestatustecnico: null,
            idmarca: null,
            idmodelo: null,
          //  idnaturaleza: null,
            idresponsable: null,
            idtipocombustible: null,
            indicativo: null,
            indiceconsumo: null,
            estadoperacion: null,
            marca: null,
            marcamodelo: null,
            max_cantidadrecursoconsumido: null,
            max_depreciacionacumulada: null,
            max_expedicioncirculacion: null,
            max_ficav: null,
            max_lot: null,
            max_recursoconsumido: null,
            max_recursoconsumidomax: null,
            max_valoradquisicion: null,
            max_valorcontable: null,
            max_vencimientocirculacion: null,
            max_vencimientoficav: null,
            max_vencimientolot: null,
            min_cantidadrecursoconsumido: null,
            min_depreciacionacumulada: null,
            min_expedicioncirculacion: null,
            min_ficav: null,
            min_lot: null,
            min_recursoconsumido: null,
            min_recursoconsumidomax: null,
            min_valoradquisicion: null,
            valoradquisicion : null,
            min_valorcontable: null,
            min_vencimientocirculacion: null,
            min_vencimientoficav: null,
            min_vencimientolot: null,
            modelo: null,
            naturaleza: null,
            grupo: null,
            descripciongrupo: null,
            idgruposubgrupo: null,
            nollaveencendido: null,
            nrocirculacion: null,
            nroinventario: null,
            nromatricula: null,
            nromotor1: null,
            nromotor2: null,
            nroserie: null,
            responsable: null,
            porcientorecuperacion: null,
            tasafiscal: null,
            vidautil: null,
            vin: null
        };
        filtros.map(f=>{
            if(f['field'] ==='estadoperacion')
            {
                objeto[f['field']] = "{"+f['data']['value'].join(',')+"}";
            }else if(f['field'] == 'fechaadq' || f['field'] == 'fechaexpfin' || f['field'] == 'fechaexpini' || 
                f['field'] == 'fechafingarantia' || f['field'] == 'fechainicialgarantia'){
                    const fecha = new Date(f['data']['value']);
                objeto[f['field']] = fecha.format('d-m-Y');
            }else {
                objeto[f['field']] = f['data']['value'];
            }
        });
        /*for (var i = 0; i < filtros.length; i++) {
            if(filtros[i]['field'] ==='estadosoperacion')
            {
                objeto[filtros[i]['field']] = filtros[i]['data']['value'];
            }else {
            objeto[filtros[i]['field']] = filtros[i]['data']['value'];
            }
        }*/
      
        Ext.apply(_this.paramsBuscar, objeto);

    },
    getColsRn: function(){        
        var camposGenerales = LOG.aft.RegOperativo.Campos;
        delete camposGenerales.diferenciavalor
        delete camposGenerales.diferenciavaloralternativo
        delete camposGenerales.diferenciadepreciacion
        delete camposGenerales.diferenciadepreciacionalternativo
        delete camposGenerales.valorfinal
        delete camposGenerales.depreciacionfinal
        delete camposGenerales.valorresidualfinal
        delete camposGenerales.valorfinalalternativo
        delete camposGenerales.depreciacionfinalalternativo
        delete camposGenerales.valorresidualfinalalternativo
        delete camposGenerales.idgruposubgrupo
        delete camposGenerales.idnaturaleza
        return camposGenerales;
    },
});



