Ext.ns('Gestionar.gestreportesinversiones');

UCID.portal.cargarEtiquetas('gestreportesinversiones', function(perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;

    var modelo = Gestionar.gestreportesinversiones.Modelo;
    modelo.init();

    var vista = Gestionar.gestreportesinversiones.Vista;
    vista.init(idioma, modelo);
    Ext.Ajax.timeout = 1000000000;

    var acciones, reporte = 0;
    var iddpt = 0;


    Gestionar.gestreportesinversiones.Controlador.init(idioma, vista, modelo);
});

Gestionar.gestreportesinversiones.Controlador = {
    init: function(idioma, vista, modelo) {
        _this = this;
        _this.listaFiltros = [];
        _this.listaPie = [];
        _this.mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando...'
        });

        _this.xtypesEvtents = {
            checkbox: {
                evt: ['check']
            },
            combobox: {
                evt: ['select']
            },
            combousuariosdoc: {
                evt: ['select']
            },
            combo: {
                evt: ['select']
            },
            combotipodoc: {
                evt: ['select']
            },
            combologistica: {
                evt: ['select']
            },
            trigger: {
                evt: ['change']
            },
            combonomenclador: {
                evt: ['select']
            },
            textarea: {
                evt: ['keyup']
            },
            textfield: {
                evt: ['keyup']
            },
            numberfield: {
                evt: ['keyup']
            },
            radio: {
                evt: ['check']
            },
            field: {
                evt: ['keyup']
            },
            datefield: {
                evt: ['select']
            },
            treecombo: {
                evt: ['select']
            }
        };

        modelo.stCbejercicio.on({
            load: function(t, n, e) {
                vista.cmbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio)
            }
        });

        vista.cbxEntidad.on('expand', function() {
            if (vista.cbxEntidad.fIsDirty(vista.cbxOrganismo.fSelect.values)) {
//                    vista.cbxEntidad.fSelect.valuesLoaded = vista.cbxOrganismo.fSelect.values;
                Ext.getCmp('gpEntidad').getStore().load({
                    params: {
                        arrayIdOrganismo: Ext.encode(vista.cbxOrganismo.fSelect.values)
                    }
                });
            }
        });

        vista.gpReportes.on({
            rowcontextmenu: function(g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());
            }
        });

        Ext.getCmp('btnModificarNomRpt').on({
            click: function() {
                _this.mymask.show();
                Ext.Ajax.request({
                    method: "POST",
                    url: "cargarDatosNomReporte",
                    params: {
                        idreporte: vista.gpReportes.getSelectionModel().selections.items[0].data.idreporte

                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        vista.tfDenomRpt.setValue(responseData.data[0].denominacion);
                        vista.taObserModRpt.setValue(responseData.data[0].descripcion);
                        vista.winModRpt.show();
                        _this.mymask.hide();
                    }
                });
            }
        });

        vista.btnAceptarModRpt.on({
            click: function() {
                _this.mymask.show();
                Ext.Ajax.request({
                    method: "POST",
                    url: "guardarPie",
                    params: {
                        idreporte: vista.gpReportes.getSelectionModel().selections.items[0].data.idreporte,
                        denomreporte: vista.tfDenomRpt.getValue(),
                        obserreporte: vista.taObserModRpt.getValue()

                    },
                    callback: function(options, success, response) {
                        vista.winModRpt.hide();
                        modelo.stGReportesExistentes.load();
                        mostrarMensaje(1, 'Se ha modificado correctamente el reporte.');
                        _this.mymask.hide();
                    }
                });
            }
        });

        vista.btnCancelarModRpt.on({
            click: function() {
                vista.winModRpt.hide();
            }
        });

        vista.btnLimpiar.on({
            click: function() {
                vista.fpFiltros.getForm().reset();
            }
        });

        vista.btnGuardarXrpt.on({
            click: function() {
                _this.bindFormMedio(vista.fpFiltros)
                _this.mymask.show();
                Ext.Ajax.request({
                    method: "POST",
                    url: "guardarPie",
                    params: {
                        pie: Ext.encode(_this.listaPie),
                        idreporte: vista.gpReportes.getSelectionModel().getSelected().data.idreporte

                    },
                    callback: function(options, success, response) {
                        mostrarMensaje(1, 'El pie de página se ha guardado correctamente.');
                        _this.mymask.hide();
                    }

                });
            }
        });

        vista.btnPdf.on({
            click: function() {
                _this.exportarPDF();
            }
        });

        vista.btnExcel.on({
            click: function() {
                var currentDate = new Date();
                var codigo = vista.gpReportes.getSelectionModel().getSelected().data.codigo;
                var exportTo = ['EXCEL', 'WORD','PDF'];
                if(codigo == 19 || codigo == 18)
                   exportTo = ['EXCEL', 'WORD','PDF'];


                var params = {
                    exportTo: exportTo,
                    idejercicio: vista.cmbEjercicio.getValue(),
                    ejercicio: vista.cmbEjercicio.getRawValue(),
                    codigo: vista.gpReportes.getSelectionModel().getSelected().data.codigo,
                    filtros: _this.listaFiltros,
                    titulo:vista.gpReportes.getSelectionModel().getSelected().data.denominacion + '-' + currentDate.format('d/m/Y')
                };
                if (vista.gpReportes.getSelectionModel().getSelected().data.codigo == 20 ||vista.gpReportes.getSelectionModel().getSelected().data.codigo == 16 || vista.gpReportes.getSelectionModel().getSelected().data.codigo == 17 || vista.gpReportes.getSelectionModel().getSelected().data.codigo == 1) {
                    _this.comprobarEnviarAcreedorInversion_InversionAcreedor(params)
                }
                else if (vista.gpReportes.getSelectionModel().getSelected().data.codigo == 23)
                    _this.comprobarEnviarDemandaequipos(params);
                else if (vista.gpReportes.getSelectionModel().getSelected().data.codigo == 24)
                    _this.comprobarEnviarEquiposPlanes(params);
                else if (vista.gpReportes.getSelectionModel().getSelected().data.codigo == 25)
                    _this.comprobarEnviarBalanceEquipos(params);
                else {
                    _this.bindFormMedio(vista.fpFiltros);
                    /*var params = {
                     exportTo:['EXCEL','WORD'],
                     idejercicio:vista.cmbEjercicio.getValue(),
                     ejercicio:vista.cmbEjercicio.getRawValue(),
                     codigo:vista.gpReportes.getSelectionModel().getSelected().data.codigo,
                     filtros: _this.listaFiltros
                     };*/
                    _this.obtenerReporte(params);
                }
            }
        });

        Ext.getCmp('btnPDFexportar').on({
            click: function() {
                _this.exportarPDF();
            }
        });

        _this.exportarPDF = function() {
            _this.bindFormMedio(vista.fpFiltros);
            var organismoden;// = vista.CmbOrganismoE.getRawValue();
            if (vista.fpFiltros.getForm().isValid()) {
                var win = window.open('gestionarReportes?filtros=' + Ext.encode(_this.listaFiltros) +
                        '&aprobadopor=' + vista.tfAprobado.getValue() +
                        '&idejercicio=' + vista.cmbEjercicio.getValue() +
                        '&idejercicioden=' + vista.cmbEjercicio.getRawValue() +
                        '&elaboradopor=' + vista.tfElaborado.getValue() +
                        //'&organismoden=' + organismoden +
                        '&observacion=' + vista.taObservacionReporte.getValue() +
                        '&codigo=' + vista.gpReportes.getSelectionModel().getSelected().data.codigo
                        );
                /*Ext.Ajax.request({
                 url: 'gestionarReportes',
                 method:'POST',
                 params: {
                 filtros: Ext.encode(_this.listaFiltros),
                 aprobadopor:vista.tfAprobado.getValue(),
                 idejercicio: vista.cmbEjercicio.getValue(),
                 idejercicioden: vista.cmbEjercicio.getRawValue(),
                 elaboradopor: vista.tfElaborado.getValue(),
                 organismoden: organismoden,
                 observacion: vista.taObservacionReporte.getValue(),
                 codigo: vista.gpReportes.getSelectionModel().getSelected().data.codigo
                 },
                 callback: function (options, success, response) {
                 
                 },
                 failure: function(){
                 mostrarMensaje(1, 'Por favor haga la configuraci&oacute;n del usuario.');
                 }
                 
                 });*/
            }
        };

        vista.smGReportes.on({

            rowselect: function(t, row, record) {
                vista.tfAprobado.reset();
                vista.tfElaborado.reset();
                vista.taObservacionReporte.reset();

                var idreporte = vista.gpReportes.getSelectionModel().getSelected().data.idreporte;
                if (idreporte == 8 || idreporte == 5) {
                    vista.btnPdf.enable();
                    Ext.getCmp('btnPDFexportar').enable();
                    vista.btnExcel.disable();
                } else {
                    vista.btnPdf.disable();
                    Ext.getCmp('btnPDFexportar').disable();
                    vista.btnExcel.enable();
                }
				
				if (idreporte == 26 || idreporte == 27) {
                    vista.btnPdf.enable();
                    Ext.getCmp('btnPDFexportar').enable();
                    vista.btnExcel.enable();
				}
                Ext.Ajax.request({
                    method: "POST",
                    url: "getPie",
                    params: {
                        idreporte: idreporte

                    },
                    callback: function(options, success, response) {
                        var objPie = Ext.decode(response.responseText);

                        if(objPie['aprobado']!= null && objPie['aprobado']!=""){
                            vista.tfAprobado.setValue(objPie['aprobado']);
                            Ext.getCmp('pie').expand();
                        }
                        if(objPie['elaborado']!= null && objPie['elaborado']!=""){
                            vista.tfElaborado.setValue(objPie['elaborado']);
                            Ext.getCmp('pie').expand();
                        }
                        if(objPie['observacion']!= null && objPie['observacion']!=""){
                            vista.taObservacionReporte.setValue(objPie['observacion']);
                            Ext.getCmp('pie').expand();
                        }
                    }
                });
            }
        });

        _this.obtenerReporte = function(params) {
            obj = {
                view: this,
                path: '/planificacion/inversiones/index.php/gestreportesinversiones/obtenerReporte',
                baseParams: {
                    confiltro: true,
                    exportFormat: params.exportTo,
                    codigo: params.codigo,
                    filtros: params.filtros,
                    idejercicio: params.idejercicio,
                    ejercicio: params.ejercicio,
                    titulo: params.titulo
                },
                fnFailure: function() {
                    mostrarMensaje(1, 'Por favor haga la configuraci&oacute;n del usuario.');
                }
            };
            reportes.create(obj);
        };

        _this.comprobarEnviarDemandaequipos = function(params) {
            if ((vista.cbNivel.fSelect.values[0] != null && vista.cbNivel.fSelect.values[0] != "")) {
                _this.bindFormMedio(vista.fpFiltros);
                _this.obtenerReporte(params);
            }
            else
                mostrarMensaje(1, 'Debe seleccionar el nivel de los equipos para generar el reporte.');
        };

        _this.comprobarEnviarBalanceEquipos = function(params) {
            if ((vista.cbOrganoSatisf.fSelect.values[0] != null && vista.cbOrganoSatisf.fSelect.values[0] != "") 
                    && (vista.cbOrganoSatisf.fSelect.values.length == 1)) {
                _this.bindFormMedio(vista.fpFiltros);
                _this.obtenerReporte(params);
            }
            else
                mostrarMensaje(1, 'Debe seleccionar un solo \xF3rgano que satisface para generar el reporte.');
        };

        _this.comprobarEnviarEquiposPlanes = function(params) {
            if ((vista.cbOrganoSatisf.fSelect.values[0] != null && vista.cbOrganoSatisf.fSelect.values[0] != "")) {
                _this.bindFormMedio(vista.fpFiltros);
                _this.obtenerReporte(params);
            }
            else
                mostrarMensaje(1, 'Debe seleccionar el \xF3rgano que satisface para generar el reporte.');
        };

        _this.comprobarEnviarAcreedorInversion_InversionAcreedor = function(params) {
            if ((vista.cbMoneda.fSelect.values[0] != null && vista.cbMoneda.fSelect.values[0] != "") && 
                    (vista.cbMoneda.fSelect.values[1] == null || vista.cbMoneda.fSelect.values[1] == "")) {
                _this.bindFormMedio(vista.fpFiltros);
                _this.obtenerReporte(params);
            }
            else
                mostrarMensaje(1, 'Debe seleccionar una moneda para generar el reporte.');
        };

        _this.bindFormMedio = function(basicForm) {
            //vista.cbFormaPropiedad.fSelect.values;
            var cont = 0;
            var contPie = 0;
            basicForm.getForm().items.each(function(field) {
                var auxObj = {};
                if (field.xtype == 'treecombo')
                    auxObj['id'] = field.fSelect.values;
                else {
                    auxObj['id'] = field.getValue();
                    auxObj['rawValue'] = field.getRawValue();
                }
                auxObj[field.getName()] = field.getValue();
                auxObj['name'] = field.getName();
                auxObj['identificador'] = field.id;

                /*if (field.xtype == 'treecombo' && field.getName() == 'cbxOrganismo')
                console.info(field.selModel.selections.items);*/

                if (field.pie) {
                    _this.listaPie[contPie] = auxObj;
                    contPie++;
                } else {
                    _this.listaFiltros[cont] = auxObj;
                    cont++;
                }
            });
        };

//        _this.verReportesEmisionInv = function() {
//            if (vista.fpFiltros.getForm().isValid()) {
//                var idorganismo = vista.cbxOrganismo.fSelect.values;
//                var idejercicio = vista.cmbEjercicio.getValue();
//                var idejercicioden = vista.cmbEjercicio.getRawValue();
////Datos del pie de pagina
//                var elaboradopor = vista.tfElaborado.getValue();
//                var aprobadopor = vista.tfAprobado.getValue();;
//                var observacion = vista.taObservacionReporte.getValue();
//    console.info(elaboradopor);
//    console.info(aprobadopor);
//    console.info(observacion);
//                var forma; 
//                var formaden;
//                var organismoden;
////                var win = window.open('exportarPDF?idorganismo=' + idorganismo + '&forma=' + forma + 
////                        '&aprobadopor=' + aprobadopor + '&idejercicio=' + idejercicio + 
////                        '&elaboradopor=' + elaboradopor + '&idejercicioden=' + idejercicioden + 
////                        '&organismoden=' + organismoden + '&observacion=' + observacion + 
////                        '&reporte=' + '&forma=' + '&formaden=' + formaden);
//            }
//            else {
//                mostrarMensaje(1, "Existe(n) alg&uacute;n(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");
//
//            }
//        };
    }
};
