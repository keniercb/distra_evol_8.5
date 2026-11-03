Ext.ns('Log.aft.submayorpat');

Log.aft.submayorpat.View = Ext.extend(Log.aft.submayor.View, {
    clean: false,
    tipo: 1,//para saber si es de activo o patrimonio(0 == AFT y 1 == Patrimonio)
    constructor: function (config) {
        var _this = this;
        _this.tipoView = 1;
        this.idioma = LOG.util.UIManager.apply(config.idioma, Log.aft.submayor.Idioma);
        config.dirController = '/logistica/activos_fijos/patrimonio/recuperaciones/index.php/submayorpat';
        this.urlBusquedaGridPrincipal = (_this.tipoView == 1) ? 'getconteo' : 'getregistronumerico';
        this.idGridPrincipal = (_this.tipoView == 1) ? 'idindicador' : 'idregnumerico';
        this.modoSeleccion = 1;
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
        this.camposGenerales = LOG.aft.RegOperativo.Campos;

        for (var i in this.camposGenerales) {
            if (this.camposGenerales[i].dataIndex == "annofabricacion") {
                this.camposGenerales[i].fieldLabel = 'Año de construcci&oacute;n';
                this.camposGenerales[i].header = 'Año de construcci&oacute;n';
            }
        }

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

        Log.aft.submayorpat.View.superclass.constructor.call(this, config);
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
            hidden: true,
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
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
                } else  b.setVisible(false);

            }
        };
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral(_this.btnPartesPiezas));

        _this.btnExpedienteTecnico = {
            text: this.idioma.BtnExpTecn,
            //iconCls: '',
            tooltip: this.idioma.BtnTtExpTecn,
            //hidden:true,
            handler: function () {

                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {

                    var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                    var report = new Distra.util.report.ViewController({
                        reports: [
                            {
                                isList: true,
                                name: 'Vista principal',
                                params: {
                                    idregnumerico: record.get('idregnumerico')
                                },
                                dirReport: '/distra/logistica/activofijo/submayor/HistorialTecnicoModelo'
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
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
                } else {
                    console.debug('aas')
                    b.setVisible(false);
                }

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
        _this.btnImprimirReporte = LOG.util.UIManager.createBtn({
            text: _this.idioma.btnReporteImprimir,
            tooltip: _this.idioma.btnTtReporteImprimir,
            iconCls: 'imprimir',
            //hidden:true,
            id: 'btnReporteImprimir',
            handler: function () {
                (_this.tipoView == 1) ? _this.imprimirReporte() : _this.configurarReporte();
            }
        });
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
                            docMask = new Ext.LoadMask(Ext.getBody(), {
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
                                    var report = new Distra.util.JasperClient({
                                        reports: [
                                            {
                                                name: 'Vista principal',
                                                params: {
                                                    idestructura: _this.idNodoSeleccinado,
                                                    fechaini: fechaIni.replace(/\//g, '-'),
                                                    fechafin: fechaFin.replace(/\//g, '-'),
                                                    tipo: 1,
                                                    idespecialidad: Log.aft.submayor.idusuarioespecialidad,
                                                    especialidad: rd.datos
                                                },
                                                dirReport: '/distra/logistica/activofijo/submayor/ReporteSIRM1'
                                            }
                                        ]
                                    }).view();
                                    docMask.hide();
                                }
                            });
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
                    var win = new aft.submayor.WinPrintConfigSIRM({
                        idioma: _this.idioma,
                        nodoPadre: nodoPadre,
                        doAction: function (fechaIni, fechaFin) {
                            var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                            docMask = new Ext.LoadMask(Ext.getBody(), {
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
                                    var report = new Distra.util.JasperClient({
                                        reports: [
                                            {
                                                name: 'Vista principal',
                                                params: {
                                                    idestructura: _this.idNodoSeleccionado,
                                                    fechaini: fechaIni.replace(/\//g, '-'),
                                                    fechafin: fechaFin.replace(/\//g, '-'),
                                                    tipo: 2,
                                                    idespecialidad: Log.aft.submayor.idusuarioespecialidad,
                                                    especialidad: rd.datos
                                                },
                                                dirReport: '/distra/logistica/activofijo/submayor/ReporteSRM2'
                                            }
                                        ]
                                    }).view();
                                    docMask.hide();
                                }
                            });
                        }
                    });
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
                    var win = new aft.submayor.WinPrintConfigSIRM({
                        idioma: _this.idioma,
                        nodoPadre: (_this.cmpAreaRespWin) ? _this.cmpAreaRespWin.dameNodoEntidadPertenece(_this.idNodoSeleccinado) : {
                            attributes: {
                                text: _this.denomSeleccinado,
                                id: _this.idNodoSeleccinado
                            }
                        },
                        doAction: function (fechaIni, fechaFin, nodoPadre) {
                            var report = new Distra.util.JasperClient({
                                reports: [
                                    {
                                        name: 'Vista principal',
                                        params: {
                                            idestructura: _this.idNodoSeleccionado,
                                            fechainicio: fechaIni.replace(/\//g, '-'),
                                            fechafin: fechaFin.replace(/\//g, '-'),
                                            idespecialidad: Log.aft.submayor.idusuarioespecialidad
                                        },
                                        dirReport: '/distra/logistica/activofijo/submayor/ReporteSIRM4'
                                    }
                                ]
                            }).view();
                        }
                    });
                }
            }
        };
        var array_reportes = [];
        array_reportes.push();
        if (Log.aft.submayor.acciones.length > 0) {
            for (var i = 0; i < Log.aft.submayor.acciones.length; i++) {
                switch (Log.aft.submayor.acciones[i].abreviatura) {
                    case 'btnReporteRegNumericoAsociados':
                        array_reportes.push(_this.btnReporteRegNumericoAsociado);
                        break;
                    case 'btnReporteRegNumericos':
                        array_reportes.push(_this.btnReporteRegNumericos);
                        break;
                    case 'btnReporteReporteMaquinasEquiposMedios':
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
                    case 'btnReporteSistemaInformativoSIRM1':
                        array_reportes.push(_this.btnReporteSistemaInformativoSIRM1);
                        break;
                    case 'btnReporteSistemaInformativoSIRM2':
                        array_reportes.push(_this.btnReporteSistemaInformativoSIRM2);
                        break;
                    case 'btnReporteSistemaInformativoSIRM4':
                        array_reportes.push(_this.btnReporteSistemaInformativoSIRM4);
                        break;
                    case 'NoFiltraEspacialidad':
                        this.filtroespecialidad = false;
                        break;
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
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir(_this.btnImprimirReporte/*_this.btnReportes*/));

        _this.btnCumplimientoMantenimiento = {
            text: this.idioma.BtnCumplimientoMantenimiento,
            iconCls: 'cumplimiento',
            tooltip: this.idioma.BtnTtCumplimientoMantenimiento,
            //hidden:true,
            handler: function () {

                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                    var rec = _this.getGridPrincipal().getSelectionModel().getSelected();
                    var ventanaCumplim = new Log.aft.rcp.Plantilla({
                        formaVisualizacion: 'ventana',
                        width: 900,
                        height: 600,
                        title: 'Cumplimiento del mantenimiento'
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
                                    ventanaCumplim.addGridColumn(
                                        {
                                            header: resp.datos[i]['periodo'] + ' / ' + resp.datos[i]['recursoconsumido'],
                                            width: 110,
                                            dataIndex: resp.datos[i]['idplanificacionmantenimiento'],
                                            renderer: function (value, metaData, record) {
                                                var dat = this.dataIndex + 'mantenimiento';
                                                if (value == 1) {
                                                    if (record.json[dat] > 0) {
                                                        metaData.css = 'icondistra-aceptar verde';
                                                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmSi + '"';
                                                    }
                                                    else {
                                                        metaData.css = 'icondistra-aceptar rojo';
                                                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmNo + '"';
                                                    }
                                                }
                                            }
                                        }
                                    )
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
                    b.setVisible(true);
                }
                else  b.setVisible(false);
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
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral(_this.btnCumplimientoMantenimiento));

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
                                    start: 0
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
            hidden: true,
            iconCls: 'limpiar',
            tooltip: _this.idioma.ttBtnLimpiar,
            handler: function () {
                if (_this.busqueda) {
                    _this.busqueda.model.reset();
                    _this.busqueda.fireEvent('limiarcampos');
                    _this.clean = true;
                    Log.aft.submayor.View.busquedaP = false;
                }
                _this.getGridPrincipal().filters.clearFilters();
                _this.getStorePrincipal().load({
                    params: {
                        limit: 30,
                        start: 0
                    }
                });
            }
        });
        this.addToolbarButton(_this.limpiar);

        this.addToolbarButton('->');

        _this.btnConfiguracion = {
            text: _this.idioma.btnConfiguracion,
            tooltip: _this.idioma.btnTtConfiguracion,
            iconCls: 'configuracion',
            menu: [{
                text: _this.idioma.btnConfiguracionAD,
                checked: (_this.atriDinamicos == 'si') ? true : false,
                checkHandler: function (checked) {
                    _this.fireEvent('atributosDinamicos', checked.checked)

                    //Codigo Adrian
                    /*var chequeado = checked.checked;
                     SetCookie('atributosDinamicos', (chequeado) ? 'si' : 'no');

                     if (pEast) {
                     if (chequeado) {
                     pEast.expand(true);
                     if (_this.getGridPrincipal().getSelectionModel().getSelected())
                     _this.getGridPrincipal().getSelectionModel().selectRecords([_this.getGridPrincipal().getSelectionModel().getSelected()]);

                     } else {
                     pEast.collapse(true);
                     }

                     _this.atriDinamicos = (chequeado) ? 'si' : 'no';
                     pEast.setVisible(chequeado);

                     pEast.doLayout(true);
                     }*/
                }
            },
                {
                    text: _this.idioma.btnMostrarPlugins,
                    checked: _this.verplugins,
                    checkHandler: function (checked) {
                        _this.modificarVisibilidadColumnasPlugins(checked.checked);
                    }
                }
            ],
            controlFn: function (b, _caller) {
                b.enable();

            }
        };
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral(_this.btnConfiguracion));

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
            _this.listaBotones.getItem(4).disable();
            //_this.btnCumplimientoMantenimiento.hide();
            _this.listaBotones.getItem(7).hide();
            _this.listaBotones.getItem(8).hide();
            _this.listaBotones.getItem(7).disable();
            ;
            //_this.btnPartesPiezas.disable();
            _this.listaBotones.getItem(5).disable();
            //_this.btnExpedienteTecnico.disable();
        }
        _this.listaBotones.getItem(3).hide();
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
                _this.listaBotones.getItem(3).hide();
                _this.listaBotones.getItem(2).disable();
                //_this.listaBotones.getItem(3).disable();


                _this.listaBotones.getItem(4).hide();
                _this.listaBotones.getItem(5).hide();
                _this.listaBotones.getItem(6).show();
               // _this.listaBotones.getItem(4).disable();
               // _this.listaBotones.getItem(5).disable();
                _this.listaBotones.getItem(6).enable();

                _this.listaBotones.getItem(7).hide();
                _this.listaBotones.getItem(8).hide();

                //_this.listaBotones.getItem(7).disable();

                _this.listaBotones.getItem(12).enable();
                _this.listaBotones.getItem(12).show();

                // _this.listaBotones.getItem(10).hide();
                // _this.listaBotones.getItem(10).disable();

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
                        if (campo.dataIndex == 'valorcontable') {
                            Ext.apply(campo, {
                                renderer: function (_v, _mD, _r) {
                                    if (parseFloat(_r.data.valorcontable) == parseFloat(_r.data.valoradquisicion))
                                        _v = parseFloat(_r.data.valoradquisicion - _r.data.depreciacionacumulada).toFixed(2);
                                    else
                                        _v = parseFloat(_r.data.valorcontable - _r.data.depreciacionacumulada).toFixed(2);
                                    return _v;
                                }
                            });
                        }
                        /*if (campo.dataIndex == 'valoradquisicion') {
                            Ext.apply(campo, {
                                renderer: function (_v, _mD, _r) {
                                    if (parseFloat(_r.data.valoradquisicion) == parseFloat(_r.data.valoradquisicion))
                                        _v = parseFloat(_r.data.valoradquisicion - _r.data.depreciacionacumulada).toFixed(2);
                                    else
                                        _v = parseFloat(_r.data.valoradquisicion - _r.data.depreciacionacumulada).toFixed(2);
                                    return _v;
                                }
                            });
                        }*/


                        if (campo.dataIndex == 'valorcontablealternativo') {
                            Ext.apply(campo, {
                                renderer: function (_v, _mD, _r) {
                                    if (parseFloat(_r.data.valorcontablealternativo) == parseFloat(_r.data.valoradquisicionalternativo))
                                        _v = parseFloat(_r.data.valoradquisicionalternativo - _r.data.depreciacionacumuladaalternativo).toFixed(2);
                                    else
                                        _v = parseFloat(_r.data.valorcontablealternativo - _r.data.depreciacionacumuladaalternativo).toFixed(2);
                                    return _v;
                                }
                            });
                        }

                        /*if (campo.dataIndex == 'valoradquisicionalternativo') {
                            Ext.apply(campo, {
                                renderer: function (_v, _mD, _r) {
                                    if (parseFloat(_r.data.valoradquisicionalternativo) == parseFloat(_r.data.valoradquisicionalternativo))
                                        _v = parseFloat(_r.data.valoradquisicionalternativo - _r.data.depreciacionacumuladaalternativo).toFixed(2);
                                    else
                                        _v = parseFloat(_r.data.valoradquisicionalternativo - _r.data.depreciacionacumuladaalternativo).toFixed(2);
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
                        if (campo.dataIndex == 'valorcontable') {
                            Ext.apply(campo, {
                                renderer: function (_v, _mD, _r) {
                                    if (parseFloat(_r.data.valorcontable) == parseFloat(_r.data.valoradquisicion))
                                        _v = parseFloat(_r.data.valoradquisicion - _r.data.depreciacionacumulada).toFixed(2);
                                    else
                                        _v = parseFloat(_r.data.valorcontable - _r.data.depreciacionacumulada).toFixed(2);
                                    return _v;
                                }
                            });
                        }
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
                _this.listaBotones.getItem(2).hide();
                _this.listaBotones.getItem(3).hide();
                _this.listaBotones.getItem(2).disable();
                _this.listaBotones.getItem(3).disable();

                _this.listaBotones.getItem(4).hide();
                _this.listaBotones.getItem(5).hide();
                _this.listaBotones.getItem(6).hide();
                _this.listaBotones.getItem(4).disable();
                _this.listaBotones.getItem(5).disable();
                _this.listaBotones.getItem(6).disable();

                _this.listaBotones.getItem(12).disable();
                _this.listaBotones.getItem(12).hide();
                if (_this.tipo == 0) {
                    _this.listaBotones.getItem(10).enable();
                    _this.listaBotones.getItem(10).show();
                }


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

            var vista = "";
          /*  if (_this.tipoView == 2) {
                _this.btnBusquedaAvanzada.setVisible(true);
                _this.limpiar.setVisible(true);
                vista = 'submayor_Rn_todos';
            } else if (_this.tipoView == 3) {
                _this.btnBusquedaAvanzada.setVisible(true);
                _this.limpiar.setVisible(true);
                vista = 'submayor_Rn_Producto';
            }
            if (_this.tipoView == 1) {
                _this.btnBusquedaAvanzada.setVisible(false);
                _this.limpiar.setVisible(false);
            }*/

            cmGridPrincipal = AFT.util.ViewConfigCache.cargarConfiguracionInterfaz(vista, /*_this.getGridPrincipal()*/cmGridPrincipal);
            _this.gpPrincipal.reconfigure(store, cmGridPrincipal);

            _this.gpPrincipal.setAutoScroll(true);
            _this.gpPrincipal.getView().refresh();
            _this.gpPrincipal.getBottomToolbar().bindStore(store);
            _this.modelo.bindGridPanel(_this.getGridPrincipal());

            _this.storePrincipal.on({
                beforeload: function (st, obj) {
                    // obj.params.start = _this.getGridPrincipal().initialConfig.bbar.cursor;
                    obj.params.limit = _this.getGridPrincipal().initialConfig.bbar.pageSize;
                    _this.listaBotones.getItem(6).disable();
                    obj.params['idindicador'] = _this.idindicador;
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
                    }
                    _this.clean = false;
                },
                load: function (st, obj) {
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
});
