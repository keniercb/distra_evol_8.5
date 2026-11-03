/**
 Uso:Componente para listar los periodos por destajo
 * @extends   Ext.Panel
 * @xtype
 * @autor     Linea Capital Humano - Ing. Aroldo L. Hechavarría Hechavarría
 */
Ext.ns('Pvd.Nomina.Pagos.PagoDestajo');

Pvd.Nomina.Pagos.PagoDestajo.Controlador = {
    init: function(idioma, vista, modelo) {
        var _this = this;
        var variablesGenerales = {
            identidad: -1,
            accion: 'add',
            montobrigada: 0,
            coeficiente: 0,
            idformula: -1,
            arrayindicadores: new Array(),
            arrayindicadoresreporte: new Array(),
            orden: -1,
            cambio: 0,
            tiporeporte: null,
            idconfreportescertificaciones: null,
            datosvariable: null,
            finicio: null,
            ffin: null,
            tipobusqueda: null,
            estado: null,
            periodo: null,
            formato: 1,
            tipobusquedaentrar: 1
        };

        //Mostrar interfaz para selecionar entidad.
        vista.winEstEntidades.show();
        modelo.storeTipoReporte.load();

        //Eventos del objeto del ábol de entidades.
        vista.pEstEntidades.on('estructuraselecionada', function(o, nodo) {
            vista.btnAceptarEntidades.enable();
            variablesGenerales.identidad = nodo.attributes.id;
            vista.idestructura = nodo.attributes.id;
            vista.gpPersonas.identidad = nodo.attributes.id;
        });

        vista.btnAceptarEntidades.setHandler(function() {

            if (variablesGenerales.identidad != null) {
                vista.ventanaTipoBusqueda.show();
            }

        });

        vista.rbActual.on('check', function() {
            vista.btnAceptarTipoBusqueda.enable();
        });

        vista.rbHistorico.on('check', function() {
            vista.btnAceptarTipoBusqueda.enable();
        });

        vista.btnCancelarTipoBusqueda.on('click', function() {
            vista.ventanaTipoBusqueda.hide();
        });
                
        vista.rbActual.on('check', function (ch, checked) {
            if (checked == true)
                variablesGenerales.tipobusquedaentrar = 1;
        });

        vista.rbHistorico.on('check', function (ch, checked) {
            if (checked == true)
                variablesGenerales.tipobusquedaentrar = 2;
        });

        vista.btnAceptarTipoBusqueda.on('click', function() {

            if (vista.rbActual.getGroupValue() == 1) {
                vista.winPagoDestajo.show();
                vista.winPagoDestajo.maximize();
                vista.tipobusqueda = 1;
                variablesGenerales.tipobusqueda = vista.tipobusqueda;

                modelo.storeSeleccionBrigada.load({
                    params: {
                        idestructura: vista.idestructura
                    }
                });

                modelo.stVariablesTiposRepCert.baseParams.idconfreportescertificaciones = idconfreportescertificaciones;
                modelo.stVariablesTiposRepCert.load();

                vista.btnAdicionarPersonas.disable();
                vista.btnModificarConvenio.disable();
                vista.btnEliminarConvenio.disable();
                vista.btnEliminarPersona.disable();

                //obtener valor salariocalculado
                // Ext.getCmp('nfSueldoCargo').setValue(vista.gpTipoNomina.getSelectionModel().getSelected().get('importe'))


                vista.gpListadoConvenio.on('rowdblclick', function(e) {
                    mostrarVentanaModConvenio();
                });
                
                vista.radioPdfExpListadoPeriodo.on('check', function (ch, checked) {
                    if (checked == true)
                        variablesGenerales.formato = 1;
                });

                vista.radioExcelExpListadoPeriodo.on('check', function (ch, checked) {
                    if (checked == true)
                        variablesGenerales.formato = 2;
                });
                
                vista.radioPdfExpConvenio.on('check', function (ch, checked) {
                    if (checked == true)
                        variablesGenerales.formato = 1;
                });

                vista.radioExcelExpConvenio.on('check', function (ch, checked) {
                    if (checked == true)
                        variablesGenerales.formato = 2;
                });

                vista.btnAdicionarPersonas.on('click', function() {
                    vista.gpPersonas.Buscar();
                    identidad = vista.idestructura;
                    vista.winPersonas.show();
                });

                vista.btnEliminarPersona.on('click', function() {
                    var selections = vista.gppersonas.getSelectionModel().getSelections();
                    eliminarPersonasByBrigada(selections);

                });

                vista.btnConfiguracion.on('click', function() {
                    variablesGenerales.tipoadd = 0;
                    mostrarVentanaAdicionarCamposConfiguracion(0);
                    modelo.storeConfiguracion.load({
                        params: {
                            identidad: vista.idestructura,
                            start: 0,
                            limit: 15,
                        }
                    });
                });

                vista.btnCancelarConfiguracion.on('click', function() {
                    vista.winConfiguracion.hide();
                });

                vista.btnGuardarConfiguracion.on('click', function() {
                    salvarformCamposConfiguracion();
                    // vista.winConfiguracion.hide();
                });

                //Eventos del grid de persona.
                vista.gpConfiguracion.on('personaselecionada', function(sel) {
                    vista.btnGuardarConfiguracion.enable();
                });

                vista.gpConfiguracion.on('personanoselecionada', function(sel) {
                    if (vista.gpConfiguracion.getSelectedRows().length > 0) {
                        vista.btnGuardarConfiguracion.enable();
                    } else {
                        vista.btnGuardarConfiguracion.disable();
                    }
                });

                vista.taFormula.on('focus', function() {

                    if (variablesGenerales.tiporeporte == 'Tipo de pagos') {
                        variablesGenerales.idformula = (variablesGenerales.accion == "Mod") ?
                            vista.gpConfiguracion.getSelectionModel().getSelected().data.idformula : -1;
                        //Cargando los indicadores
                        Ext.Ajax.request({
                            url: 'obtenerIndicadoresConfiguracion',
                            method: 'POST',
                            params: {
                                identidad: vista.idestructura
                            },
                            callback: function(options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                variablesGenerales.arrayindicadores = responseData.indicadores;
                                mostrarComponenteFormulaCampos();
                            }.createDelegate()
                        });
                    } else if (variablesGenerales.tiporeporte == 'Reportes') {

                        //Cargando los indicadores
                        Ext.Ajax.request({
                            url: 'obtenerIndicadoresFormulas',
                            method: 'POST',
                            params: {
                                idconfreportescertificaciones: idconfreportescertificaciones
                            },
                            callback: function(options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                variablesGenerales.arrayindicadoresreporte = responseData.variables;

                                mostrarComponenteFormulaCamposReporte();
                            }.createDelegate(this)
                        });

                    }
                });

                modelo.storePersonasBrigada.on('load', function() {
                    vista.nfSalarioCalculado.setValue(formatoMoneda(modelo.storePersonasBrigada.reader.jsonData.salariocalculado));
                    // vista.nfSalarioCalculado.disable();          
                });

                modelo.storeConvenios.on('load', function() {

                    vista.nfMontoBrigada.setValue(formatoMoneda(modelo.storeConvenios.reader.jsonData.monto));
                    vista.nfCoeficiente.setValue(modelo.storeConvenios.reader.jsonData.coeficiente);
                    variablesGenerales.montobrigada = vista.nfMontoBrigada.getValue();
                    variablesGenerales.coeficiente = vista.nfCoeficiente.getValue();

                });

                vista.btnAceptarPersonas.on('click', function() {
                    vista.winPersonas.show();
                    var selections = vista.gpPersonas.getSelectedRows();
                    adicionarPersonasByBrigada(selections);
                });

                //Eventos del grid de persona.
                vista.gpPersonas.on('personaselecionada', function(sel) {
                    vista.btnAceptarPersonas.enable();
                });

                vista.gpPersonas.on('personanoselecionada', function(sel) {
                    if (vista.gpPersonas.getSelectedRows().length > 0) {
                        vista.btnAceptarPersonas.enable();
                    } else {
                        vista.btnAceptarPersonas.disable();
                    }
                });

                vista.smpersonas.on('rowselect', function() {
                    vista.btnEliminarPersona.enable();
                });

                vista.cbtipoBrigada.disable();

                //Accion para el combobox de la brigada.
                vista.cbTipoDestajo.on('select', function(cb, vn, vv) {
                    vista.cbtipoBrigada.enable();
                });

                //Accion para el combobox de la brigada.
                vista.cbtipoBrigada.on('select', function(cb, record, index) {
                    vista.btnAdicionarPersonas.enable();
                    vista.btnAdicionarConvenio.enable();
                    vista.btnSyncronizar.enable();

                    // vista.btnGuardarEvaluacion.enable();
                    // vista.btnConfiguracion.enable();
                    // vista.btnCalcular.enable();

                    vista.dfFInicio.enable();
                    vista.dfFFin.enable();
                    modelo.storePersonasBrigada.load({
                        params: {
                            idplantilla: record.data.idplantillanominal,
                            limit: 1000,
                            start: 0,
                            tipobusqueda: variablesGenerales.tipobusqueda
                        }
                    });
                    modelo.storeConvenios.load({
                        params: {
                            idplantilla: record.data.idplantillanominal,
                            limit: 1000,
                            start: 0,
                            tipobusqueda: variablesGenerales.tipobusqueda
                        }
                    });
                });

                //Accion para el combobox Tipo de entrada.
                vista.cbTipoEntrada.on('select', function(cb, record, index) {
                    variablesGenerales.tiporeporte = record.data.denominacion;
                    vista.cbEntrada.enable();
                    vista.cbEntrada.setValue('');
                    modelo.storeEntrada.load({
                        params: {
                            tipoentrada: record.data.denominacion,
                            limit: 1000,
                            start: 0
                        }
                    });
                });

                vista.btnCalcular.setHandler(function() {
                    calcularSalarios();
                });

                vista.btnGuardarEvaluacion.setHandler(function() {
                    guardarEvaluacion();
                });

                vista.btnAplicarMontoCobrar.setHandler(function() {
                    guardarDatos();
                });

                vista.btnSyncronizar.setHandler(function() {
                    syncronisarElementodAosiadosalCargo();
                });

                vista.btnImprimir.menu.items.items[0].setHandler(function() {
                    vista.ventanaExpListadoPeriodo.show();
                });

                vista.btnAceptarExpListadoPeriodo.setHandler(function() {
                    imprimierReporteListadoPersonas(variablesGenerales.formato);
                    vista.ventanaExpListadoPeriodo.hide();
                });

                vista.btnImprimir.menu.items.items[1].setHandler(function() {
                    vista.ventanaExpConvenio.show();
                });

                vista.btnAceptarExpConvenio.setHandler(function() {
                    imprimierReporteListadoConvenios(variablesGenerales.formato);
                    vista.ventanaExpConvenio.hide();
                });

                vista.rowaction.on('action', function(grid, record, action, rowIndex, col, e) {
                    switch (action) {
                        case 'eliminar':
                            EliminandoCamposConfiguracion(grid, record);
                            break;
                    }
                }, this);

                vista.smListadoConvenio.on('rowselect', function() {
                    vista.btnModificarConvenio.enable();
                    vista.btnEliminarConvenio.enable();
                });

                vista.btnAdicionarConvenio.setHandler(function() {
                    mostrarVentanaAddConvenio();
                    modelo.storeObra.load({
                        params: {
                            identidad: vista.idestructura,
                            limit: 1000,
                            start: 0
                        }
                    });
                });

                function mostrarVentanaAddConvenio() {
                    vista.winAdicionarConvenio.setTitle('Adicionar convenio');
                    vista.winAdicionarConvenio.show();
                    vista.btnCancelarConvenio.setNextElement('btnAplicarConvenio');
                    vista.btnAplicarConvenio.setNextElement('idbtnAceptarAddConvenio');
                    vista.btnAceptarConvenio.setPreviousElement('btnAplicarConvenio');
                    variablesGenerales.accion = 'Add';
                }

                vista.btnModificarConvenio.setHandler(function() {
                    mostrarVentanaModConvenio();
                });

                function mostrarVentanaModConvenio() {
                    vista.winAdicionarConvenio.setTitle('Modificar convenio');
                    vista.winAdicionarConvenio.show();
                    vista.btnCancelarConvenio.setNextElement('idbtnAceptarAddConvenio');
                    vista.btnAceptarConvenio.setPreviousElement('idbtnCancelarConvenio');
                    vista.btnAplicarConvenio.hide();
                    vista.formularioConvenio.getForm().loadRecord(vista.smListadoConvenio.getSelected());
                    variablesGenerales.accion = 'Mod';
                }
                //Ventanas
                vista.winConfiguracion.on('beforeshow', function() {
                    vista.formConfiguracion.getForm().reset();
                    vista.tfDenominacion.focus(true, 500);
                });

                function mostrarComponenteFormulaCamposReporte() {

                    /////////////Variables del propio reporte////////////////
                    var ind = new Array();
                    modelo.stVariablesTiposRepCert.data.each(function(r) {
                        var a = new Array();
                        a[0] = 'VAR_' + r.data.idvariablesconfreportescertificaciones;
                        a[1] = r.data.denominacion;
                        a[2] = 'Variables del reporte';
                        ind.push(a);
                    });

                    //Snc225
                    var a = new Array();
                    a[0] = 'CM_0';
                    a[1] = 'Cantidad de meses (SNC - 225)';
                    a[2] = 'SNC - 225';
                    ind.push(a);
                    var c = new Array();
                    c[0] = 'ST_0';
                    c[1] = 'Salario Total (SNC - 225)';
                    c[2] = 'SNC - 225';
                    ind.push(c);
                    var c = new Array();
                    c[0] = 'DA_0';
                    c[1] = 'D&iacute;s habiles';
                    c[2] = 'SNC - 225';
                    ind.push(c);

                    for (var i = 0; i < variablesGenerales.arrayindicadoresreporte.length; i++) {
                        var a = new Array();
                        a[0] = variablesGenerales.arrayindicadoresreporte[i].idindicador;
                        a[1] = variablesGenerales.arrayindicadoresreporte[i].indicador;
                        a[2] = variablesGenerales.arrayindicadoresreporte[i].tipo;
                        ind.push(a);
                    }

                    this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                        title: 'Editor de expresiones matem&aacute;ticas',
                        idexpresionmatematica: (variablesGenerales.idformula != null) ? variablesGenerales.idformula : -1,
                        indicadores: ind,
                        agrupado: 1,
                        campoagrupar: 'Tipo',
                        mostrarFunciones: 2,
                        mostrarCondicionales: true,
                        mostrarDenominacion: false
                    });

                    this.objExpMat.on('expresionsalvada', function(arr) {
                        if (arr) {
                            vista.taFormula.setValue(arr['elementosMostrar']);
                            variablesGenerales.idformula = arr['idexpresionmatematica'];
                            this.objExpMat.close();
                            mostrarMensaje(1, 'La expresi&oacute;n matem&aacute;tica se adicion&oacute; satisfactoriamente');
                        } else {
                            mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica no se pudo adicionar');
                        }
                    }.createDelegate(this));

                    this.objExpMat.show();
                }

                function mostrarComponenteFormulaCampos() {
                    var ind = new Array();
                    var a = new Array();
                    for (var i = 0; i < variablesGenerales.arrayindicadores.length; i++) {
                        a = new Array();
                        if (parseInt(variablesGenerales.arrayindicadores[i].aplicarorden == 1)) {
                            if (parseInt(variablesGenerales.arrayindicadores[i].orden) < parseInt(variablesGenerales.orden)) {
                                a[0] = variablesGenerales.arrayindicadores[i].idindicador;
                                a[1] = variablesGenerales.arrayindicadores[i].indicador;
                                a[2] = variablesGenerales.arrayindicadores[i].tipo;
                                ind.push(a);
                            }
                        } else {
                            a[0] = variablesGenerales.arrayindicadores[i].idindicador;
                            a[1] = variablesGenerales.arrayindicadores[i].indicador;
                            a[2] = variablesGenerales.arrayindicadores[i].tipo;
                            ind.push(a);
                        }
                    }
                    this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                        title: 'Editor de expresiones matem&aacute;ticas',
                        idexpresionmatematica: (variablesGenerales.idformula != null) ? variablesGenerales.idformula : -1,
                        indicadores: ind,
                        agrupado: 1,
                        campoagrupar: 'Tipo',
                        mostrarFunciones: 2,
                        mostrarCondicionales: true,
                        mostrarDenominacion: false
                    });

                    this.objExpMat.on('expresionsalvada', function(arr) {
                        if (arr) {
                            vista.taFormula.setValue(arr['elementosMostrar']);
                            variablesGenerales.idformula = arr['idexpresionmatematica'];
                            this.objExpMat.close();
                            mostrarMensaje(1, 'La expresi&oacute;n matem&aacute;tica se adicion&oacute; satisfactoriamente');
                        } else {
                            mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica no se pudo adicionar');
                        }
                    }.createDelegate(this));

                    this.objExpMat.show();
                }

                function mostrarVentanaAdicionarCamposConfiguracion() {
                    variablesGenerales.accion = 'Add';
                    Ext.Ajax.request({
                        url: 'obtenerOrdenDisponiblePagoDestajo',
                        method: 'POST',
                        params: { identidad: vista.idestructura },
                        callback: function(options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            vista.winConfiguracion.setTitle('Adicionar campos configuraci&oacute;n');
                            vista.winConfiguracion.show();
                            vista.nfOrden.setValue(responseData.orden);
                            vista.tfDenominacion.focus(true, 500);
                            vista.btnGuardarConfiguracion.show();
                        }
                    });
                }

                //Grid
                vista.smConfiguracion.on('rowselect', function(sel) {
                    variablesGenerales.accion = 'Mod';
                    var arrdatos = vista.smConfiguracion.getSelected().data;
                    // vista.tfDenominacion.setValue(arrdatos['denominacion']);
                    vista.cbTipoEntrada.setValue(arrdatos['tipoentrada']);
                    vista.cbEntrada.setValue(arrdatos['entrada']);
                    vista.taFormula.setValue(arrdatos['denomformula']);
                    // vista.nfOrden.setValue(arrdatos['orden']);
                    vista.tfDescripcionConfiguracio.setValue(arrdatos['descripcion']);
                    vista.winConfiguracion.setTitle('Modificar campos configuraci&oacute;n');
                });

                function EliminandoCamposConfiguracion(grid, record) {
                    var idconfpagodestajo = record.data.idconfpagodestajo;
                    PVD.mostrarMascara('idmasaddpers', "Eliminando campo configuraci&oacute;n");
                    Ext.Ajax.request({
                        url: 'eliminandoCamposConfiguracion',
                        params: {
                            idconfpagodestajo: idconfpagodestajo
                        },
                        callback: function(options, succes, response) {
                            var responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmasaddpers');
                            if (responseData.succes == 'ok') {
                                mostrarMensaje(1, 'Se ha eliminado el campo de la configuraci&oacute;n.');
                                modelo.storeConfiguracion.removeAll();
                                modelo.storeConfiguracion.load({
                                    params: {
                                        identidad: vista.idestructura,
                                        start: 0,
                                        limit: 15,
                                    }
                                });

                                vista.tfDenominacion.setValue('');
                                vista.cbTipoEntrada.setValue('');
                                vista.cbEntrada.setValue('');
                                vista.taFormula.setValue('');
                                vista.tfDescripcionConfiguracio.setValue('');
                                vista.nfOrden.setValue(responseData.orden);
                            }
                        }
                    });
                }

                function salvarformCamposConfiguracion() {
                    var urlAction = 'adicionarCamposConfiguracion';
                    var idconfpagodestajo = -1;

                    if (variablesGenerales.accion == 'Mod') {
                        urlAction = 'modificarCamposConfiguracion';
                        idconfpagodestajo = vista.smConfiguracion.getSelected().get('idconfpagodestajo');
                        if (variablesGenerales.cambio == 0)
                            vista.winConfiguracion.hide();

                        var idformulaviejo = vista.smConfiguracion.getSelected().get('idformula');
                        var idformulanuevo = variablesGenerales.idformula;
                        variablesGenerales.idformula = (idformulaviejo == -1 && idformulanuevo != -1) ? idformulanuevo : idformulaviejo;
                    }

                    var form = vista.formConfiguracion;
                    PVD.mostrarMascara('idmaskaddmodcampos', 'Espere por favor', 'Enviando datos...');
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            identidad: vista.idestructura,
                            denominacion: vista.tfDenominacion.getRawValue(),
                            tipoentrada: vista.cbTipoEntrada.getRawValue(),
                            entrada: vista.cbEntrada.getRawValue(),
                            orden: vista.nfOrden.getValue(),
                            idformula: variablesGenerales.idformula,
                            descripcion: vista.tfDescripcionConfiguracio.getRawValue(),
                            identidad: vista.idestructura,
                            idconfpagodestajo: idconfpagodestajo,
                        },
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmaskaddmodcampos');
                            var msgok = (variablesGenerales.tipoadd == 1) ? 'Los campos se han' : 'El campo se ha';
                            var msgerror = (variablesGenerales.tipoadd == 1) ? 'Los campos no se pudieron' : 'El campo no se pudo';
                            switch (responseData.respuesta) {
                                case 'ADD-1':
                                    mostrarMensaje(1, msgok + " adicionado satisfactoriamente.");
                                    break;
                                case 'ADD-2':
                                    mostrarMensaje(3, "El campo que desea adicionar ya existe.");
                                    break;
                                case 'ADD-3':
                                    mostrarMensaje(3, msgerror + " adicionar.");
                                    break;
                                case 'MOD-1':
                                    mostrarMensaje(1, "El campo se ha modificado satisfactoriamente.");
                                    break;
                                case 'MOD-3':
                                    mostrarMensaje(3, "El campo no se pudo modificar.");
                                    break;
                            }
                            //Capturando el orden
                            Ext.Ajax.request({
                                url: 'obtenerOrdenDisponiblePagoDestajo',
                                method: 'POST',
                                params: { identidad: vista.idestructura },
                                callback: function(options, success, response) {
                                    var responseData = Ext.decode(response.responseText);
                                    vista.formConfiguracion.getForm().reset();
                                    vista.nfOrden.setValue(responseData.orden);
                                }
                            });

                            form.getForm().reset();
                            vista.tfDenominacion.focus(true, 500);
                            modelo.storeConfiguracion.removeAll();
                            modelo.storeConfiguracion.load({
                                params: {
                                    identidad: vista.idestructura,
                                    start: 0,
                                    limit: 15,
                                }
                            });
                            variablesGenerales.cambio = 0;
                        }
                    });
                }

                vista.btnCancelarConvenio.setHandler(function() {
                    vista.winAdicionarConvenio.hide();
                });

                vista.btnAceptarConvenio.setHandler(function() {
                    if (variablesGenerales.accion == 'Add') {
                        adicionarConvenioByObra();
                        vista.winAdicionarConvenio.hide();
                    } else if (variablesGenerales.accion == 'Mod') {
                        modificarConvenioByObra()
                    }
                });

                vista.btnAplicarConvenio.setHandler(function(params) {
                    adicionarConvenioByObra();
                });

                vista.btnEliminarConvenio.setHandler(function(params) {
                    eliminarConvenio();
                });


                /*************************funciones de los botones del panel norte************************************************************************ */
                function imprimierReporteListadoPersonas(formato) {

                    //PVD.mostrarMascara('idmaskformato', 'Por favor espere…', 'Generando PDF');
                    Ext.Ajax.request({
                        url: 'buscarEstadoReporte',
                        method: 'POST',
                        params: {
                            fechainicio: vista.dfFInicio.getRawValue(),
                            fechafin: vista.dfFFin.getRawValue(),
                            identidad: variablesGenerales.identidad,
                            idnomtipodestajo: vista.cbTipoDestajo.getValue(),
                        },
                        callback: function(options, success, response) {
                            var respuesta = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmasaddpers');
                            if (respuesta.respuesta == 0 || respuesta.respuesta == 1) {
                                window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/pagodestajo/imprimierReporteListadoPersonas?identidad=' + variablesGenerales.identidad +
                                    '&fechainicio=' + vista.dfFInicio.getRawValue() + '&fechafin=' + vista.dfFFin.getRawValue() + '&tipobusqueda=' + variablesGenerales.tipobusqueda 
                                    + '&idnomtipodestajo=' + vista.cbTipoDestajo.getValue() + '&formato=' + formato);
                            } else if (responseData.respuesta == 'error') {
                                mostrarMensaje(3, 'Fechas de inicio y fin son requeridas.');
                            } else {
                                mostrarMensaje(3, 'El periodo no puede estar desaprobado para imprimir.');
                            }
                        }
                    });

                }

                function imprimierReporteListadoConvenios(formato) {

                    //PVD.mostrarMascara('idmaskformato', 'Por favor espere…', 'Generando PDF');
                    Ext.Ajax.request({
                        url: 'buscarEstadoReporte',
                        method: 'POST',
                        params: {
                            fechainicio: vista.dfFInicio.getRawValue(),
                            fechafin: vista.dfFFin.getRawValue(),
                            identidad: variablesGenerales.identidad,
                            idnomtipodestajo: vista.cbTipoDestajo.getValue(),
                        },
                        callback: function(options, success, response) {
                            var respuesta = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmasaddpers');
                            if (respuesta.respuesta == 0 || respuesta.respuesta == 1) {
                                window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/pagodestajo/imprimierReporteListadoConvenios?identidad=' + variablesGenerales.identidad +
                                    '&fechainicio=' + vista.dfFInicio.getRawValue() + '&fechafin=' + vista.dfFFin.getRawValue() + '&tipobusqueda=' + variablesGenerales.tipobusqueda + 
                                    '&idnomtipodestajo=' + vista.cbTipoDestajo.getValue() + '&formato=' + formato);
                            } else if (responseData.respuesta == 'error') {
                                mostrarMensaje(3, 'Fechas de inicio y fin son requeridas.');
                            } else {
                                mostrarMensaje(3, 'El periodo no puede estar desaprobado para imprimir.');
                            }
                        }
                    });

                }

                /**********************Aprobar periodo destajo********************************** */
                vista.btnAprobar.setHandler(function() {
                    aprobarPeriodoDestajo();
                });

                function aprobarPeriodoDestajo() {
                    //PVD.mostrarMascara('idmasaddpers', "Aprobando periodo destajo");
                    Ext.Ajax.request({
                        url: 'aprobarPeriodoDestajo',
                        params: {
                            idnomtipodestajo: vista.cbTipoDestajo.getValue(),
                            fechainicio: vista.dfFInicio.getRawValue(),
                            fechafin: vista.dfFFin.getRawValue(),
                            identidad: variablesGenerales.identidad,
                        },
                        callback: function(options, succes, response) {
                            var responseData = Ext.decode(response.responseText);
                            //PVD.ocultarMascara('idmasaddpers');
                            if (responseData.respuesta == true) {
                                mostrarMensaje(1, 'Se ha aprobado el periodo destajo.');
                            } else if (responseData.respuesta == false) {
                                mostrarMensaje(3, 'El periodo destajo ya se encuentra en estado aprobado.');
                            } else if (responseData.respuesta == 'error') {
                                mostrarMensaje(3, 'Fechas de inicio y fin son requeridas.');
                            }
                        }
                    });
                }

                /****************************desaprobar periodo destajo******************************************/
                vista.btnDesaprobar.setHandler(function() {
                    desaprobarPeriodoDestajo();
                });

                function desaprobarPeriodoDestajo() {
                    PVD.mostrarMascara('idmasaddpers', "Aprobando periodo destajo");
                    Ext.Ajax.request({
                        url: 'desaprobarPeriodoDestajo',
                        params: {
                            idnomtipodestajo: vista.cbTipoDestajo.getValue(),
                            fechainicio: vista.dfFInicio.getRawValue(),
                            fechafin: vista.dfFFin.getRawValue(),
                            identidad: variablesGenerales.identidad,
                        },
                        callback: function(options, succes, response) {
                            var responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmasaddpers');
                            if (responseData.respuesta == true) {
                                mostrarMensaje(1, 'Se ha desaprobado el periodo destajo.');
                            } else if (responseData.respuesta == false) {
                                mostrarMensaje(3, 'El periodo destajo ya se encuentra en estado desaprobado.');
                            } else if (responseData.respuesta == 'error') {
                                mostrarMensaje(3, 'Fechas de inicio y fin son requeridas.');
                            }
                        }
                    });
                }
                /*************************************************cerrar periodo destajo **************************************************************** */
                vista.btnCerrarResumen.setHandler(function() {
                    cerrarResumenPeriodoDestajo();
                });

                function cerrarResumenPeriodoDestajo() {
                    PVD.mostrarMascara('idmasaddpers', "Aprobando periodo destajo");
                    Ext.Ajax.request({
                        url: 'cerrarResumenPeriodoDestajo',
                        params: {
                            idnomtipodestajo: vista.cbTipoDestajo.getValue(),
                            fechainicio: vista.dfFInicio.getRawValue(),
                            fechafin: vista.dfFFin.getRawValue(),
                            identidad: variablesGenerales.identidad,
                        },
                        callback: function(options, succes, response) {
                            var responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmasaddpers');
                            if (responseData.respuesta == true) {
                                mostrarMensaje(1, 'Se ha cerrado el periodo destajo.');
                                modelo.storeConvenios.load({
                                    params: {
                                        idplantilla: vista.cbtipoBrigada.getValue(),
                                        limit: 1000,
                                        start: 0,
                                        tipobusqueda: variablesGenerales.tipobusqueda
                                    }
                                });

                                modelo.storePersonasBrigada.load({
                                    params: {
                                        idplantilla: vista.cbtipoBrigada.getValue(),
                                        limit: 1000,
                                        start: 0,
                                        tipobusqueda: variablesGenerales.tipobusqueda
                                    }
                                });

                                vista.cbTipoDestajo.setValue('');
                                vista.cbtipoBrigada.setValue('');
                                vista.nfMontoBrigada.setValue('');
                                vista.nfCoeficiente.setValue('');

                            } else if (responseData.respuesta == 'error') {
                                mostrarMensaje(3, 'Fechas de inicio y fin son requeridas.');
                            } else if (responseData.respuesta == 'noaprobado') {
                                mostrarMensaje(3, 'Apruebe el pago a destajo antes de cerrarlo.');
                            } else if (responseData.respuesta == 'cerrado') {
                                mostrarMensaje(3, 'El periodo destajo ya se encuentra en estado cerrado.');
                            }
                        }
                    });
                }

                /******************************************Funsiones de los botones del panel norte**************************************************************************************************************/
                function syncronisarElementodAosiadosalCargo() {

                    PVD.mostrarMascara('idmasaddpers', "Sincronizandodatos de tipo elemento salarial");
                    Ext.Ajax.request({
                        url: 'syncronisarElementosAsosiadosalCargo',
                        params: {
                            idplantilla: vista.cbtipoBrigada.getValue(),
                            finicio: vista.dfFInicio.getRawValue(),
                            ffin: vista.dfFFin.getRawValue(),
                            identidad: variablesGenerales.identidad,
                            idconfreportescertificaciones: idconfreportescertificaciones
                        },
                        callback: function(options, succes, response) {
                            var responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmasaddpers');
                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, 'Los datos se encuentran sincronizados');
                                modelo.storePersonasBrigada.load({
                                    params: {
                                        idplantilla: vista.cbtipoBrigada.getValue(),
                                        limit: 1000,
                                        start: 0,
                                        tipobusqueda: variablesGenerales.tipobusqueda
                                    }
                                });

                                vista.btnGuardarEvaluacion.enable();
                            } else if (responseData.codigo == 2) {
                                mostrarMensaje(3, 'Por favor, seleccione la brigada.');

                            } else if (responseData.codigo == 3) {
                                mostrarMensaje(3, 'Por favor, seleccione mes y año.');
                            } else if (responseData.codigo == 4) {
                                mostrarMensaje(3, 'Por favor, Seleccione el rango de fecha.');
                            }
                        }
                    });

                }

                /******************************************Funsion calcular salario**************************************************************************************************************/
                function calcularSalarios() {

                    PVD.mostrarMascara('idmasaddpers', "Sincronizandodatos de tipo elemento salarial");
                    Ext.Ajax.request({
                        url: 'calcularSalarios',
                        params: {
                            idplantilla: vista.cbtipoBrigada.getValue(),
                            identidad: variablesGenerales.identidad,
                            idconfreportescertificaciones: idconfreportescertificaciones
                        },
                        callback: function(options, succes, response) {
                            var responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmasaddpers');
                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, 'Los datos se han calculado sactifactoriamente');
                                modelo.storePersonasBrigada.load({
                                    params: {
                                        idplantilla: vista.cbtipoBrigada.getValue(),
                                        limit: 1000,
                                        start: 0,
                                        tipobusqueda: variablesGenerales.tipobusqueda
                                    }
                                });
                                vista.btnAplicarMontoCobrar.enable();
                                vista.btnCalcular.disable();
                            }
                        }
                    });

                }

                /******************************************Funsion calcular salario**************************************************************************************************************/
                function guardarEvaluacion() {

                    var records = modelo.storePersonasBrigada.getModifiedRecords();
                    var arreglo = [];

                    while (records.length > 0) {
                        var record = records.pop();
                        var rec = record.getChanges();
                        rec['idpersonabrigada'] = record.data['idpersonabrigada'];
                        arreglo.push(rec);
                    }

                    PVD.mostrarMascara('idmasaddpers', "Guardando Evaluación");
                    Ext.Ajax.request({
                        url: 'guardarEvaluacion',
                        params: {
                            idplantilla: vista.cbtipoBrigada.getValue(),
                            arraydatos: Ext.encode(arreglo),
                        },
                        callback: function(options, succes, response) {
                            var responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmasaddpers');
                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, 'Se han guardado las evaluaciones.');
                                modelo.storePersonasBrigada.load({
                                    params: {
                                        idplantilla: vista.cbtipoBrigada.getValue(),
                                        limit: 1000,
                                        start: 0,
                                        tipobusqueda: variablesGenerales.tipobusqueda
                                    }
                                });
                                vista.btnCalcular.enable();
                                vista.btnGuardarEvaluacion.disable();
                            } else if (responseData.codigo == 2) {
                                mostrarMensaje(2, 'No ha seleccionado ninguna persona para evaluar.');
                            }
                        }
                    });

                }

                /*************************************** Guardar datos**************************************************************************************************** */
                function guardarDatos() {
                    PVD.mostrarMascara('idmasaddpers', "Guardando Evaluación");
                    Ext.Ajax.request({
                        url: 'guardarDatos',
                        params: {
                            idplantilla: vista.cbtipoBrigada.getValue(),
                            coeficiente: vista.nfCoeficiente.getValue(),
                            montobrigada: vista.nfMontoBrigada.getValue(),
                            salariocalculado: vista.nfSalarioCalculado.getValue(),
                        },
                        callback: function(options, succes, response) {
                            var responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmasaddpers');
                            if (responseData.codigo == 1) {
                                vista.nfSalarioCalculado.setValue(formatoMoneda(responseData));
                                mostrarMensaje(1, 'Se han guardado los datos.');
                                modelo.storePersonasBrigada.load({
                                    params: {
                                        idplantilla: vista.cbtipoBrigada.getValue(),
                                        limit: 1000,
                                        start: 0,
                                        tipobusqueda: variablesGenerales.tipobusqueda
                                    }
                                });
                                modelo.storeConvenios.load({
                                    params: {
                                        idplantilla: vista.cbtipoBrigada.getValue(),
                                        limit: 1000,
                                        start: 0,
                                        tipobusqueda: variablesGenerales.tipobusqueda
                                    }
                                });
                                vista.btnAplicarMontoCobrar.disable();
                            } else if (responseData.codigo == 2) {
                                mostrarMensaje(2, 'No ha existe el coeficiente de distribuci&oacute;n.');
                            }
                        }
                    });

                }

                /******************************************Funsiones **************************************************************************************************************/
                function adicionarPersonasByBrigada(selections) {
                    var arrayidpersonas = new Array();
                    Ext.each(selections, function(s) {
                        arrayidpersonas.push([s.data.idpersona, s.data.idcargo]);
                    });

                    PVD.mostrarMascara('idmasaddpers', 'Por favor espere...', 'Enviando datos');
                    Ext.Ajax.request({
                        url: 'adicionarPersonasByBrigada',
                        params: {
                            arrayidpersonas: Ext.encode(arrayidpersonas),
                            idplantilla: vista.cbtipoBrigada.getValue()
                        },
                        callback: function(options, succes, response) {
                            var responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmasaddpers');
                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, 'Las personas han sido adicionadas satisfactoriamente');
                                modelo.storePersonasBrigada.load({
                                    params: {
                                        idplantilla: vista.cbtipoBrigada.getValue(),
                                        limit: 1000,
                                        start: 0,
                                        tipobusqueda: variablesGenerales.tipobusqueda
                                    }
                                });
                                vista.winPersonas.hide();
                            } else if (responseData.codigo == 2) {
                                mostrarMensaje(3, 'Por favor, seleccione la brigada.');
                                vista.winPersonas.hide();
                            } else if (responseData.mensaje) {
                                mostrarMensaje(3, ' La(s) persona(s): ' + responseData.mensaje + ' ya se encuentran registradas en la brigada.', function(btn) {
                                    modelo.storePersonasBrigada.load({
                                        params: {
                                            idplantilla: vista.cbtipoBrigada.getValue(),
                                            limit: 1000,
                                            start: 0,
                                            tipobusqueda: variablesGenerales.tipobusqueda
                                        }
                                    });

                                    winPersonas.hide();

                                });
                            }
                        }
                    });

                }

                function eliminarPersonasByBrigada(selections) {
                    var arrayidpersonabrigada = new Array();
                    Ext.each(selections, function(s) {
                        arrayidpersonabrigada.push(s.data.idpersonabrigada);
                    });

                    PVD.mostrarMascara('idmasaddpers', 'Por favor espere...', 'Enviando datos');


                    Ext.Ajax.request({
                        url: 'eliminarPersonasByBrigada',
                        params: {
                            arrayidpersonabrigada: Ext.encode(arrayidpersonabrigada)
                        },
                        callback: function(options, succes, response) {
                            var responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmasaddpers');
                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, 'Las persona(s) ha(n) sido eliminada(s) satisfactoriamente');
                                vista.btnEliminarPersona.disable();
                                modelo.storePersonasBrigada.load({
                                    params: {
                                        idplantilla: vista.cbtipoBrigada.getValue(),
                                        limit: 1000,
                                        start: 0,
                                        tipobusqueda: variablesGenerales.tipobusqueda
                                    }
                                });

                            } else {
                                mostrarMensaje(3, 'Ha ocurrido un error al eliminar la(s) persona(s) a la brigada');
                            }
                        }
                    });

                }

                /***********************funsiones para el panel de brigada************************************************************************************* */
                function adicionarConvenioByObra() {
                    //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                    if (vista.formularioConvenio.getForm().isValid()) {
                        PVD.mostrarMascara('idmaskaddmodDestajo', 'Por favor espere…', 'Guardando datos...');
                        Ext.Ajax.request({
                            url: '/pvd/nomina/index.php/pagodestajo/adicionarConvenioByObra',
                            method: 'POST',
                            params: {
                                denominacion: vista.tfDenomConvenio.getValue(),
                                obra: vista.cbObra.getValue(),
                                importe: vista.tfImporteConvenio.getValue(),
                                fechainicio: vista.dfFInicioConvenio.getRawValue(),
                                fechafin: vista.dfFFinConvenio.getRawValue(),
                                descripcion: vista.tfDescripConvenio.getValue(),
                                idplantilla: vista.cbtipoBrigada.getValue(),
                                idnomtipodestajo: vista.cbTipoDestajo.getValue(),
                                fechainicioperiodo: vista.dfFInicio.getRawValue(),
                                fechafinperiodo: vista.dfFFin.getRawValue(),
                            },
                            callback: function(options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                PVD.ocultarMascara('idmaskaddmodDestajo');

                                if (responseData.codigo == 1) {
                                    mostrarMensaje(1, 'El convenio ha sido adicionada satisfactoriamente.');
                                    vista.formularioConvenio.getForm().reset();
                                    modelo.storeConvenios.removeAll();
                                    modelo.storeConvenios.load({
                                        params: {
                                            idplantilla: vista.cbtipoBrigada.getValue(),
                                            limit: 1000,
                                            start: 0,
                                            tipobusqueda: variablesGenerales.tipobusqueda
                                        }
                                    });

                                } else if (responseData.codigo == 3) {
                                    mostrarMensaje(3, 'El tipo de convenio que quiere adicionar ya existe.');
                                }
                            }
                        });
                    } else {
                        mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                    }
                }

                function modificarConvenioByObra() {
                    //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                    if (vista.formularioConvenio.getForm().isValid()) {
                        PVD.mostrarMascara('idmaskaddmodtipoconvenio', 'Por favor espere…', 'Guardando datos...');
                        Ext.Ajax.request({
                            url: '/pvd/nomina/index.php/pagodestajo/modificarConvenioByObra',
                            method: 'POST',
                            params: {
                                idconvenio: vista.smListadoConvenio.getSelected().get('idconvenio'),
                                denominacion: vista.tfDenomConvenio.getValue(),
                                obra: vista.cbObra.getValue(),
                                importe: vista.tfImporteConvenio.getValue(),
                                fechainicio: vista.dfFInicioConvenio.getRawValue(),
                                fechafin: vista.dfFFinConvenio.getRawValue(),
                                descripcion: vista.tfDescripConvenio.getValue()
                            },
                            callback: function(options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                PVD.ocultarMascara('idmaskaddmodtipoconvenio');

                                if (responseData.codigo == 1) {
                                    mostrarMensaje(1, 'El convenio ha sido modificado satisfactoriamente.');
                                    vista.winAdicionarConvenio.hide();
                                    vista.formularioConvenio.getForm().reset();
                                    modelo.storeConvenios.removeAll();
                                    modelo.storeConvenios.load({
                                        params: {
                                            idplantilla: vista.cbtipoBrigada.getValue(),
                                            limit: 1000,
                                            start: 0,
                                            tipobusqueda: variablesGenerales.tipobusqueda
                                        }
                                    });
                                } else if (responseData.codigo == 3) {
                                    mostrarMensaje(3, 'No se pudo modificar el convenio.');
                                }
                            }
                        });
                    } else {
                        mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                    }
                }

                function eliminarConvenio() {
                    //Mostrando el mensaje para aceptar el eliminar.
                    mostrarMensaje(2, '¿Está seguro que quiere eliminar el tipo destajo seleccionado?', function(btn) {
                        if (btn == "ok") {
                            //Se muestra la máscara de espera.
                            PVD.mostrarMascara('idmaskeleminartipoconvenio', 'Por favor espere…', 'Eliminando datos...');
                            //Enviando los datos al servidor.
                            Ext.Ajax.request({
                                url: '/pvd/nomina/index.php/pagodestajo/eliminarConvenio',
                                method: 'POST',
                                params: {
                                    idconvenio: vista.smListadoConvenio.getSelected().get('idconvenio'),
                                },
                                callback: function(options, success, response) {
                                    //Se oculta la máscara de espera.
                                    PVD.ocultarMascara('idmaskeleminartipoconvenio');
                                    responseData = Ext.decode(response.responseText);
                                    if (responseData.codigo == 1) {
                                        mostrarMensaje(1, 'El convenio ha sido eliminando satisfactoriamente.');
                                        modelo.storeConvenios.load({
                                            params: {
                                                idplantilla: vista.cbtipoBrigada.getValue(),
                                                limit: 1000,
                                                start: 0,
                                                tipobusqueda: variablesGenerales.tipobusqueda
                                            }
                                        });

                                    } else {
                                        if (responseData.codigo == 3)
                                            mostrarMensaje(responseData.codigo, 'No se pudo eliminar el convenio.');
                                    }
                                }
                            });
                        }
                    });
                }
            } else {
                vista.winPeriodosDestajos.show();
                vista.tipobusqueda = 2;

                vista.cbTipoDestajo2.on('select', function(cb, record, index) {
                    modelo.stPeriodosDestajo.load({
                        params: {
                            idnomtipodestajo: record.data.idnomtipodestajo,
                            limit: 1000,
                            start: 0
                        }
                    });
                });
                
                vista.radioPdfExpListadoPeriodo.on('check', function (ch, checked) {
                    if (checked == true)
                        variablesGenerales.formato = 1;
                });

                vista.radioExcelExpListadoPeriodo.on('check', function (ch, checked) {
                    if (checked == true)
                        variablesGenerales.formato = 2;
                });

                vista.smPeriodoPagoDestajo.on('rowselect', function() {
                    vista.btnAceptarPeriodosDestajos.enable();
                });

                vista.btnAceptarPeriodosDestajos.setHandler(function() {
                    variablesGenerales.tipobusqueda = vista.tipobusqueda;
                    variablesGenerales.estado = vista.gpPeriodoPagoDestajo.getSelectionModel().getSelected().get('estado');
                    variablesGenerales.idnomtipodestajo = vista.cbTipoDestajo2.getValue();

                    vista.cbTipoDestajo.setValue(vista.cbTipoDestajo2.getValue());
                    vista.cbTipoDestajo.disable();

                    vista.dfFInicio.setValue(vista.gpPeriodoPagoDestajo.getSelectionModel().getSelected().json.fechainicio);
                    vista.dfFInicio.disable();

                    vista.dfFFin.setValue(vista.gpPeriodoPagoDestajo.getSelectionModel().getSelected().json.fechafin);
                    vista.dfFFin.disable();

                    vista.winPagoDestajo.show();
                    vista.winPagoDestajo.maximize();

                    //desabilitar 
                    vista.btnAprobar.disable();
                    vista.btnDesaprobar.disable();
                    // vista.btnImprimir.disable();
                    vista.btnCerrarResumen.disable();
                    vista.btnAdicionarPersonas.disable();
                    vista.btnEliminarPersona.disable();
                    vista.btnSyncronizar.disable();
                    vista.btnGuardarEvaluacion.disable();
                    vista.btnCalcular.disable();
                    vista.btnAplicarMontoCobrar.disable();
                    vista.btnAdicionarConvenio.disable();
                    vista.btnEliminarConvenio.disable();
                    vista.btnModificarConvenio.disable();

                    modelo.storeConvenios.on('load', function() {
                        console.log(modelo.storeConvenios)
                        vista.nfSalarioCalculado.setValue(modelo.storeConvenios.reader.jsonData.salariocalculado);
                        vista.nfSalarioCalculado.disable();

                        vista.nfMontoBrigada.setValue(modelo.storeConvenios.reader.jsonData.montobrigada);
                        vista.nfMontoBrigada.disable();

                        vista.nfCoeficiente.setValue(modelo.storeConvenios.reader.jsonData.coeficiente);
                        vista.nfCoeficiente.disable();
                    });

                    modelo.storeSeleccionBrigada.load({
                        params: {
                            idestructura: vista.idestructura
                        }
                    });

                    modelo.storePersonasBrigada.load({
                        params: {
                            idplantilla: null,
                            limite: 1000,
                            inicio: 0,
                            tipobusqueda: variablesGenerales.tipobusqueda,
                            periodo: vista.gpPeriodoPagoDestajo.getSelectionModel().getSelected().get('periodo'),
                            idnomtipodestajo: variablesGenerales.idnomtipodestajo
                        }
                    });

                    vista.cbtipoBrigada.on('select', function(cb, record, index) {

                        modelo.storePersonasBrigada.load({
                            params: {
                                idplantilla: record.data.idplantillanominal,
                                limite: 1000,
                                inicio: 0,
                                tipobusqueda: variablesGenerales.tipobusqueda,
                                periodo: vista.gpPeriodoPagoDestajo.getSelectionModel().getSelected().get('periodo'),
                                idnomtipodestajo: variablesGenerales.idnomtipodestajo
                            }
                        });

                        modelo.storeConvenios.load({
                            params: {
                                idplantilla: record.data.idplantillanominal,
                                limite: 1000,
                                inicio: 0,
                                idnomtipodestajo: variablesGenerales.idnomtipodestajo,
                                tipobusqueda: variablesGenerales.tipobusqueda,
                                periodo: vista.gpPeriodoPagoDestajo.getSelectionModel().getSelected().get('periodo'),
                            }
                        });
                    });                    
                
                    vista.radioPdfExpListadoPeriodo.on('check', function (ch, checked) {
                        if (checked == true)
                            variablesGenerales.formato = 1;
                    });

                    vista.radioExcelExpListadoPeriodo.on('check', function (ch, checked) {
                        if (checked == true)
                            variablesGenerales.formato = 2;
                    });
                    
                    vista.radioPdfExpConvenio.on('check', function (ch, checked) {
                        if (checked == true)
                            variablesGenerales.formato = 1;
                    });

                    vista.radioExcelExpConvenio.on('check', function (ch, checked) {
                        if (checked == true)
                            variablesGenerales.formato = 2;
                    });

                    vista.btnImprimir.menu.items.items[0].setHandler(function() {
                        vista.ventanaExpListadoPeriodo.show();
                    });
    
                    vista.btnAceptarExpListadoPeriodo.setHandler(function() {
                        imprimierReporteListadoPersonas(variablesGenerales.formato);
                        vista.ventanaExpListadoPeriodo.hide();
                    });    

                    vista.btnImprimir.menu.items.items[1].setHandler(function() {
                        vista.ventanaExpConvenio.show();
                    });
    
                    vista.btnAceptarExpConvenio.setHandler(function() {
                        imprimierReporteListadoConvenios(variablesGenerales.formato);
                        vista.ventanaExpConvenio.hide();
                    });

                    /*************************funciones de los botones del panel norte************************************************************************ */
                    function imprimierReporteListadoPersonas(formato) {

                        //PVD.mostrarMascara('idmaskformato', 'Por favor espere…', 'Generando PDF');
                        Ext.Ajax.request({
                            url: 'buscarEstadoReporte',
                            method: 'POST',
                            params: {
                                fechainicio: vista.dfFInicio.getRawValue(),
                                fechafin: vista.dfFFin.getRawValue(),
                                identidad: variablesGenerales.identidad,
                                idnomtipodestajo: vista.cbTipoDestajo.getValue(),
                            },
                            callback: function(options, success, response) {
                                var respuesta = Ext.decode(response.responseText);
                                PVD.ocultarMascara('idmasaddpers');
                                if (respuesta.respuesta == 0 || respuesta.respuesta == 1) {
                                    window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/pagodestajo/imprimierReporteListadoPersonas?identidad=' + variablesGenerales.identidad +
                                        '&fechainicio=' + vista.dfFInicio.getRawValue() + '&fechafin=' + vista.dfFFin.getRawValue() + '&tipobusqueda=' + variablesGenerales.tipobusqueda + '&idnomtipodestajo=' + 
                                        vista.cbTipoDestajo.getValue() + '&formato=' + formato + '&periodo=' + vista.gpPeriodoPagoDestajo.getSelectionModel().getSelected().get('periodo'));
                                } else if (responseData.respuesta == 'error') {
                                    mostrarMensaje(3, 'Fechas de inicio y fin son requeridas.');
                                } else {
                                    mostrarMensaje(3, 'El periodo no puede estar desaprobado para imprimir.');
                                }
                            }
                        });

                    }                    

                    function imprimierReporteListadoConvenios(formato) {

                        //PVD.mostrarMascara('idmaskformato', 'Por favor espere…', 'Generando PDF');
                        Ext.Ajax.request({
                            url: 'buscarEstadoReporte',
                            method: 'POST',
                            params: {
                                fechainicio: vista.dfFInicio.getRawValue(),
                                fechafin: vista.dfFFin.getRawValue(),
                                identidad: variablesGenerales.identidad,
                                idnomtipodestajo: vista.cbTipoDestajo.getValue(),
                            },
                            callback: function(options, success, response) {
                                var respuesta = Ext.decode(response.responseText);
                                PVD.ocultarMascara('idmasaddpers');
                                if (respuesta.respuesta == 0 || respuesta.respuesta == 1) {
                                    window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/pagodestajo/imprimierReporteListadoConvenios?identidad=' + variablesGenerales.identidad +
                                        '&fechainicio=' + vista.dfFInicio.getRawValue() + '&fechafin=' + vista.dfFFin.getRawValue() + '&tipobusqueda=' + variablesGenerales.tipobusqueda + 
                                        '&idnomtipodestajo=' + vista.cbTipoDestajo.getValue() + '&formato=' + formato  + '&periodo=' + vista.gpPeriodoPagoDestajo.getSelectionModel().getSelected().get('periodo'));
                                } else if (responseData.respuesta == 'error') {
                                    mostrarMensaje(3, 'Fechas de inicio y fin son requeridas.');
                                } else {
                                    mostrarMensaje(3, 'El periodo no puede estar desaprobado para imprimir.');
                                }
                            }
                        });

                    }


                });

            }
            vista.ventanaTipoBusqueda.hide();
        });







    }
}