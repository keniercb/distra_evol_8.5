Ext.ns('Pvd.Nomina.ReportesyCertificaciones.ConfigCausasInasistencias');

//Controlador de la vista del componente Configurar conceptos contables.
Pvd.Nomina.ReportesyCertificaciones.ConfigCausasInasistencias.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Configurar modelo nomina (Tipo: Pvd.Nomina.Configuracion.ConceptosContables.Vista)
     * @param modelo Modelo de la vista del componente Configurar modelo nomina (Tipo: Pvd.Nomina.Configuracion.ConceptosContables.Modelo)
     */
    init: function (idioma, vista, modelo) {
        /**
         *Variables generales.
         */
        var variables = {
            contSMReportes: 0,
            contSMCausas: 0,
            contSMEvaluaciones: 0,
            contSMTalleres: 0,
            accion: '',
            idvariabletiporeportecertifviejo: -1
        };

        vista.winPrincipal.show();
        vista.winPrincipal.maximize();
        vista.cbHorasDias.setValue(1);

        //Cargando los datos de las causas
        modelo.storeConfigCausasInasistencias.load();

        //Evento del btn add
        vista.btnAdicionarCampo.on('click', function () {
            variables.accion = 'ADD';
            mostrarVentanaAdicionarCausasInasistencias();
        });

        //Evento del btn mod
        vista.btnModificarCampo.on('click', function () {
            variables.accion = 'MOD';
            var idvariabletiporeportecertifviejo = vista.smConfigCampos.getSelected().get('idvariablesconfreportescertificaciones');
            var tiporeporte = vista.smConfigCampos.getSelected().get('tiporeporte');
            mostrarVentanaModificarCausasInasistencias(idvariabletiporeportecertifviejo, tiporeporte);
        });

        //Evento del btn eliminar
        vista.btnEliminarCampo.on('click', function () {
            var arrayvariablesconfreportescertificaciones = vista.gpConfigCamposReportes.getSelectionModel().getSelections();
            var arrayidvariables = new Array();
            Ext.each(arrayvariablesconfreportescertificaciones, function (seleccionado) {
                //console.info(seleccionado);
                arrayidvariables.push({
                    idvariablesconf: seleccionado.data.idvariablesconfreportescertificaciones,

                })
            });
            //console.info(arrayidvariables);
            mostrarMensaje(2, 'Esta seguro que desea eliminar el campo seleccionado', function (btn) {
                if (btn == 'ok') {
                    //Se muestra la m�scara de espera.
                    PVD.mostrarMascara('idmaskdelcausa', 'Por favor espere...', 'Eliminando datos');
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarCausasInasistencias',
                        method: 'POST',
                        params: {
                            datos: Ext.encode(arrayidvariables)
                            // idvariablesconfreportescertificaciones: idvariablesconfreportescertificaciones
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            //Ocultando m�scara de enviar datos.
                            PVD.ocultarMascara('idmaskdelcausa');
                            if (responseData == 'DEL') {
                                vista.btnEliminarCampo.disable();
                                vista.btnModificarCampo.disable();
                                mostrarMensaje(1, 'El campo fue eliminado satisfactoriamente', function (btn) {
                                    if (btn == 'ok') {
                                        modelo.storeConfigCausasInasistencias.load();
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });

        

        //Selection Model principal
        vista.smConfigCampos.on('rowselect', function (sm, index, record) {
            var cantidadseleccionados = vista.gpConfigCamposReportes.getSelectionModel().getSelections().length;
            (cantidadseleccionados == 0) ? vista.btnEliminarCampo.disable() : vista.btnEliminarCampo.enable();
            (cantidadseleccionados != 1) ? vista.btnModificarCampo.disable() : vista.btnModificarCampo.enable();
        });

        vista.smConfigCampos.on('rowdeselect', function (sm, index, record) {
            var cantidadseleccionados = vista.gpConfigCamposReportes.getSelectionModel().getSelections().length;
            (cantidadseleccionados != 1) ? vista.btnEliminarCampo.disable() : vista.btnEliminarCampo.enable();
            (cantidadseleccionados != 1) ? vista.btnModificarCampo.disable() : vista.btnModificarCampo.enable();
        });

        //Selection Model causas inasistencias
        vista.smCausasAusencias.on('rowselect', function (sm, index, record) {
            var cantidadseleccionadoscausas = vista.gpCausasAsistencia.getSelectionModel().getSelections().length;
            variables.contSMCausas = cantidadseleccionadoscausas;
            habilitarBtnsAplicarAceptar();
        });

        vista.smCausasAusencias.on('rowdeselect', function (sm, index, record) {
            var cantidadseleccionadoscausas = vista.gpCausasAsistencia.getSelectionModel().getSelections().length;
            variables.contSMCausas = cantidadseleccionadoscausas;
            habilitarBtnsAplicarAceptar();
        });

        //Selection Model evaluaciones
        vista.smIndicadoresEvaluaciones.on('rowselect', function (sm, index, record) {
            var cantidadseleccionadoseval = vista.gpIndicadoresEvaluaciones.getSelectionModel().getSelections().length;
            variables.contSMEvaluaciones = cantidadseleccionadoseval;
            habilitarBtnsAplicarAceptar();
        });

        vista.smIndicadoresEvaluaciones.on('rowdeselect', function (sm, index, record) {
            var cantidadseleccionadoseval = vista.gpIndicadoresEvaluaciones.getSelectionModel().getSelections().length;
            variables.contSMEvaluaciones = cantidadseleccionadoseval;
            habilitarBtnsAplicarAceptar();
        });

        //Selection Model reportes ausencias
        vista.smReportes.on('rowselect', function (sm, index, record) {
            console.log('fffffffff')
            //vista.smIndicadoresTalleres.clearSelections();
            //vista.smIndicadoresEvaluaciones.clearSelections();
            var cantidadseleccionados = vista.gpReportes.getSelectionModel().getSelections().length;
            variables.contSMReportes = cantidadseleccionados;
            habilitarBtnsAplicarAceptar();
        });

        vista.smReportes.on('rowdeselect', function (sm, index, record) {
            var cantidadseleccionados = vista.gpReportes.getSelectionModel().getSelections().length;
            variables.contSMReportes = cantidadseleccionados;
            habilitarBtnsAplicarAceptar();
        });

        //Selection Model reportes talleres
        vista.smIndicadoresTalleres.on('rowselect', function (sm, index, record){
            
            var cantidadseleccionadosind = vista.gpIndicadoresTalleres.getSelectionModel().getSelections().length;
            variables.contSMTalleres = cantidadseleccionadosind;
            habilitarBtnsAplicarAceptar();
        });

        vista.smIndicadoresTalleres.on('rowdeselect', function (sm, index, record) {
            var cantidadseleccionadosind = vista.gpIndicadoresTalleres.getSelectionModel().getSelections().length;
            variables.contSMTalleres = cantidadseleccionadosind;
            habilitarBtnsAplicarAceptar();
        });

        vista.tpReportesCertificaciones.on('tabchange', function(){
            if((variables.contSMCausas > 0) ||(variables.contSMEvaluaciones > 0) ||(variables.contSMTalleres > 0)){
                vista.smCausasAusencias.clearSelections();
                vista.smIndicadoresEvaluaciones.clearSelections();
                vista.smIndicadoresTalleres.clearSelections();
            }
            
        });

        

        //Evento del btn cancelar add causas
        vista.btnCancelarCampo.on('click', function () {
            vista.winCausasInasistencias.hide();
        });

        //Evento del btn aplicar add causas
        vista.btnAplicarCampo.on('click', function () {
            adicionarCausasCamposReportes();
        });

        //Evento del btn aceptar add causas
        vista.btnAceptarCampo.on('click', function () {
            adicionarCausasCamposReportes();
            vista.winCausasInasistencias.hide();
        });

        //Functions
        function mostrarVentanaAdicionarCausasInasistencias() {
            modelo.storeReportes.load({params:{start:0,limit:1000}});
            modelo.storeCausasAusencias.load({params:{start:0,limit:1000}});
            modelo.storeIndicadoresEvaluaciones.load({params:{start:0,limit:1000}});
            modelo.storeIndicadoresTalleres.load();
            vista.winCausasInasistencias.setTitle('Adicionar campo');
            vista.winCausasInasistencias.show();
        }

        function mostrarVentanaModificarCausasInasistencias(idvariabletiporeportecertifviejo, tiporeporte) {
            Ext.Ajax.request({
                url: 'checksSeleccionadosWidowsModificar',
                params: {
                    idvariabletiporeportecertifviejo: idvariabletiporeportecertifviejo
                },
                callback: function (options, succes, response) {
                    //Para seleccionar el reporte que viene de la base dato
                    var cantidadDeVarReportes = vista.gpReportes.getStore().data.items.length;
                    for (var i = 0; i < cantidadDeVarReportes; i++) {
                        if (vista.gpReportes.getStore().data.items[i].data['idvariablesconfreportescertificaciones'] == idvariabletiporeportecertifviejo) {
                            vista.gpReportes.getSelectionModel().selectRow(i);
                        }
                    }
                    //Para seleccionar el campo del modulo correspondiente
                    var arraySeleccionados = Ext.decode(response.responseText);
                    var cantidadCamposModulo = 0;
                    if (tiporeporte == 4) {
                        cantidadCamposModulo = vista.gpCausasAsistencia.getStore().data.items.length;
                        vista.tpReportesCertificaciones.setActiveTab(0)
                    } else if (tiporeporte == 5) {
                        cantidadCamposModulo = vista.gpIndicadoresEvaluaciones.getStore().data.items.length;
                        vista.tpReportesCertificaciones.setActiveTab(1)
                    }

                    var rasistencia = new Array();
                    var revaluacion = new Array();
                    for (var k = 0; k < arraySeleccionados.length; k++) {
                        for (var j = 0; j < cantidadCamposModulo; j++) {
                            if (tiporeporte == 4) {
                                if (vista.gpCausasAsistencia.getStore().data.items[j].data['idcausaausencia'] == arraySeleccionados[k]) {
                                    //vista.gpCausasAsistencia.getSelectionModel().selectRow(j);
                                    rasistencia.push(j);
                                    break;
                                }
                                revaluacion = new Array();
                            } else if (tiporeporte == 5) {
                                var id = vista.gpIndicadoresEvaluaciones.getStore().data.items[j].data['idindicador'] +
                                    "_" + vista.gpIndicadoresEvaluaciones.getStore().data.items[j].data['idplanilla'];
                                if (id == arraySeleccionados[k]) {
                                    //vista.gpIndicadoresEvaluaciones.getSelectionModel().selectRow(j);
                                    revaluacion.push(j);
                                    break;
                                }
                                rasistencia = new Array();
                            }
                        }
                    }
                    vista.gpCausasAsistencia.getSelectionModel().selectRows(rasistencia);
                    vista.gpIndicadoresEvaluaciones.getSelectionModel().selectRows(revaluacion);
                }.createDelegate(this)
            });

            //Modificar la configuracion de causas de inasitencias
            variables.accion = 'MOD';
            variables.idvariabletiporeportecertifviejo = idvariabletiporeportecertifviejo;
            modelo.storeReportes.load({params:{start:0,limit:1000}});
            modelo.storeCausasAusencias.load({params:{start:0,limit:1000}});
            modelo.storeIndicadoresEvaluaciones.load({params:{start:0,limit:1000}});
            modelo.storeIndicadoresTalleres.load();
            vista.winCausasInasistencias.setTitle('Modificar campo');
            vista.winCausasInasistencias.show();
        }

        function habilitarBtnsAplicarAceptar() {
            console.log(variables.contSMTalleres)
            if (((variables.contSMCausas > 0 && variables.contSMEvaluaciones == 0 && variables.contSMTalleres == 0) || (variables.contSMCausas == 0 && variables.contSMTalleres == 0 && variables.contSMEvaluaciones > 0) || (variables.contSMTalleres > 0 && variables.contSMCausas == 0 && variables.contSMEvaluaciones == 0))
                && variables.contSMReportes == 1) {
                vista.btnAceptarCampo.enable();
                vista.btnAplicarCampo.enable();
            } else {
                vista.btnAceptarCampo.disable();
                vista.btnAplicarCampo.disable();
            }
        }

        function adicionarCausasCamposReportes() {
            var tipodereporte = vista.smReportes.getSelected().get('idconfreportescertificaciones');
            var idvariabletiporeportecertif = vista.smReportes.getSelected().get('idvariablesconfreportescertificaciones');
            var horasdias = vista.cbHorasDias.getValue();
            console.info(vista.smCausasAusencias.getSelected());
            var modulo = 1;
            var arraySeleccionados = new Array();
            console.info(vista.tpReportesCertificaciones.getActiveTab().id);
            if (vista.tpReportesCertificaciones.getActiveTab().id == "tabEvaluacion") {
                modulo = 2;
                arraySeleccionados = vista.gpIndicadoresEvaluaciones.getSelectionModel().getSelections();
            }
            else if(vista.tpReportesCertificaciones.getActiveTab().id == "tabTalleres"){
                modulo = 3;
                arraySeleccionados = vista.gpIndicadoresTalleres.getSelectionModel().getSelections();
            }
            else {
                modulo = 1;
                arraySeleccionados = vista.gpCausasAsistencia.getSelectionModel().getSelections();
            }

            var arrayidcampos = new Array();
            for (var i = 0; i < arraySeleccionados.length; i++) {
                arrayidcampos[i] = (modulo == 1) ? arraySeleccionados[i].data.idcausaausencia :
                    arraySeleccionados[i].data.idindicador + "_" + arraySeleccionados[i].data.idplanilla;
            }

            //Mask
            PVD.mostrarMascara('idmaskcausasinasistenciasadd', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: 'adicionarCausasInasistencias',
                params: {
                    idvariabletiporeportecertif: idvariabletiporeportecertif,
                    idvariabletiporeportecertifviejo: variables.idvariabletiporeportecertifviejo,
                    idtiporeporte: tipodereporte,
                    arrayidcampos: Ext.encode(arrayidcampos),
                    accion: variables.accion,
                    modulo:modulo,
                    horasdias: horasdias

                },
                callback: function (options, succes, response) {
                    PVD.ocultarMascara('idmaskcausasinasistenciasadd');
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'ADD') {
                        mostrarMensaje(1, 'El campo se adicion&oacute; satisfactoriamente');
                    } else if (respuesta == 'MOD') {
                        mostrarMensaje(1, 'El campo se modific&oacute; satisfactoriamente');
                    } else if (respuesta == 'REPETIDO') {
                        mostrarMensaje(3, 'La variable del reporte que desea adicionar ya existe');
                    } else {
                        mostrarMensaje(3, 'No se pudo adicionar el campo');
                    }
                    modelo.storeConfigCausasInasistencias.load();
                }.createDelegate(this)
            });
        }
    }
};
