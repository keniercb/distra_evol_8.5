Ext.ns('Pvd.Nomina.Pagos.GestionarCargosOcupados');

//Controlador de la vista del componente Gestionar cargos ocupados.
Pvd.Nomina.Pagos.GestionarCargosOcupados.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Configurar variables globales (Tipo: Pvd.Nomina.Pagos.GestionarCargosOcupados.Vista)
     * @param modelo Modelo de la vista del componente Gestionar cargos ocupados (Tipo: Pvd.Nomina.Pagos.GestionarCargosOcupados.Modelo)
     */
    init: function (idioma, vista, modelo) {
        /**
         *Variables generales.
         */
        var variables = {
            identidad: 0,
            idcargo: 0,
            idpersona: 0,
            persona: 0,
            numerocontable: 0,
            idpersonacdgocontable: 0,
            accion: '',
            url: '',
            boton: '',
            path: null,
            cambio: 0,
            asociadoalcargo: 0,
            idplantillanominal: null,
            boolpersonas: 0,
            idcentrocosto: 0
        };
        modelo.storeCodTipoId.load();
        //Mostrar interfaz para selecionar entidad.
        vista.winEstEntidades.show();

        //Eventos del objeto del ábol de entidades.
        vista.pEstEntidades.on('estructuraselecionada', function (o, nodo) {
            //if(nodo.attributes.tipoestructura == 3){
            variables.identidad = nodo.id;
            vista.identidad = nodo.id;
            vista.identidad = nodo.id;
            vista.btnCargarPersonas.enable();
            // modelo.stcbCajaCajero.load();
            //vista.pPersonas.CambiarEntidad(variables.identidad);
            /*}else{
             variables.identidad = null;
             vista.btnCargarPersonas.disable();
             }*/
        });

        //Eventos del botón cargar personas a partir de la entidad selecionada.
        vista.btnCargarPersonas.setHandler(function () {
            modelo.CargarPlantillasNominal(variables.identidad);
            modelo.CargarCentrocosto(variables.identidad);
            vista.pPersonas.CambiarEntidad(vista.identidad);
            vista.pPersonas.Buscar();
            vista.winCargosOcupados.show();
            vista.winCargosOcupados.maximize();
			//Validar si de las personas que estan de alta alguna no tiene asociado un Centro de Costo para Contabilizar
			Ext.Ajax.request({
                url: 'validarCentrosCostoCargos',
                method: 'POST',
                timeout: 99999999,
                params: {
                    identidad: variables.identidad
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('synccentroscosto');
                    if(responseData.codigo == 2){
                        mostrarMensaje(3, 'Las siguientes personas <b>' +responseData.personas+ '</b> no tienen asociado un Centro de Costo que exista en Contabilidad.')
                    }

                }
            });
        });

        vista.winAdicionarCargos.on('show', function (w, t) {
            //if(vista.cbCajaCajero.getValue()==2){
            //vista.cbCuenta.enable();
            //}
        });

        //Eventos del componente Buscar persona.
        vista.pPersonas.smpersonas.on('rowselect', function (sm, indiceFila, record) {
            //(record.data.idcargosocupados != 0 && record.data.idcargosocupados != null) ? vista.btnAdicionar.disable() : vista.btnAdicionar.enable();
            // vista.btnAdicionar.enable()
            vista.btnModificar.disable();
            vista.btnEliminar.disable();
            vista.btnAdicionarNC.enable();
            vista.btnModificarNC.disable();

            vista.btnEliminarNC.disable();
            vista.btnExportaSNC.enable();
            vista.btnActualizar.disable();
            variables.idpersona = record.data.idpersona;
            variables.persona = record.data.nombre + ' ' + record.data.papel + ' ' + record.data.sapel;

            //Si es la primera persona que se marca porque sino todas esas peticiones parten el servidor
            var arrselmodelpersonas = vista.pPersonas.smpersonas.getSelections();
            if(arrselmodelpersonas.length == 1){
                vista.pfichadelapersona.mostrarFicha(variables.idpersona);

                modelo.stCargosOcupados.baseParams.idpersona = variables.idpersona;
                modelo.stCargosOcupados.baseParams.identidad = variables.identidad;
                modelo.stCargosOcupados.baseParams.sistema = 'minfar';

                modelo.stCargosOcupadosHistorico.baseParams.idpersona = variables.idpersona;
                modelo.stCargosOcupadosHistorico.baseParams.identidad = variables.identidad;

                modelo.stNumerocontable.baseParams.idpersona = variables.idpersona;
                modelo.stNumerocontable.baseParams.identidad = variables.identidad;

                modelo.stCargosOcupados.load({params: {limit: 15, start: 0, sistema: 'minfsr'}});
                //modelo.stCargosOcupadosHistorico.load({params:{limit:15, start:0}});

                modelo.stNumerocontable.load();
                /*
                modelo.stCuentaBanc.load({params: {
                    idcargosocupados: vista.gpCargosPersona.getSelectionModel().getSelected().data.idcargosocupados, identidad: variables.identidad
                }});*/
                //modelo.storeTipoPago.load();
                //Validando el boton de altas automaticas
                var flagocupados = 1;
                var flagbajasocupados = 1;
                var arrayseleccionados = vista.pPersonas.smpersonas.getSelections();
                
                for (var i = 0; i < arrayseleccionados.length; i++) {
                    if (arrayseleccionados[i].data.idcargosocupados != null) {
                        flagocupados = 0;
                        break;
                    } else {
                        continue;
                    }
                }
                if (flagocupados == 1) {
                    vista.pPersonas.btnDarAlta.enable();
                } else {
                    vista.pPersonas.btnDarAlta.disable();
                }
                for (var i = 0; i < arrayseleccionados.length; i++) {
                    if (arrayseleccionados[i].data.idcargosocupados == null) {
                        flagbajasocupados = 0;
                        break;
                    } else {
                        continue;
                    }
                }
                if (flagbajasocupados == 1) {
                    vista.pPersonas.btnDarBaja.enable();
                } else {
                    vista.pPersonas.btnDarBaja.disable();
                }
                if(vista.pPersonas.smpersonas.hasSelection()){
                    vista.btnActualizarMovimientosPersonasCargos.enable();
                }else{
                    vista.btnActualizarMovimientosPersonasCargos.disable();
                }
            }
        })

        vista.pPersonas.smpersonas.on('selectionchange', function (sm) {
            if(sm.getSelections().length > 0) {console.log(sm.getSelections())                
                if(sm.getSelections()[0].data.activa == 1){
                    vista.pPersonas.btnHavilitar.disable();
                    vista.pPersonas.btnNoHavilitar.enable();
                } else{
                    vista.pPersonas.btnHavilitar.enable();
                    vista.pPersonas.btnNoHavilitar.disable();
                }

                if(sm.getSelections()[0].data.idcargosocupados != null){
                    vista.btnAdicionar.disable();
                } else {
                    vista.btnAdicionar.enable();
                }
            }
        });

        vista.smNumerocontable.on('rowselect', function (sm, indiceFila, record) {

            variables.numerocontable = record.data.cdgocontable;
            variables.idpersonacdgocontable = record.data.idpersonacdgocontable;
            vista.btnModificarNC.enable();
            vista.btnEliminarNC.enable();

        })


        modelo.stCargosOcupados.on('load', function () {
            vista.gpCargosPersona.getSelectionModel().selectFirstRow();
            if (modelo.stCargosOcupados.data.length == 0) {
                vista.btnAdicionar.enable();
            } else {
                // vista.btnAdicionar.disable()
            }
            //vista.pPersonas.Buscar();
        });

        //Eventos componente Buscar persona.
        vista.pPersonas.smpersonas.on('rowdeselect', function (sm, indiceFila, record) {
            // (record.data.idcargosocupados != 0 && record.data.idcargosocupados != null) ? vista.btnAdicionar.disable() : vista.btnAdicionar.enable();
            vista.btnModificar.disable();
            vista.btnEliminar.disable();

            vista.btnAdicionarNC.disable();
            vista.btnModificarNC.disable();
            vista.btnEliminarNC.disable();
            vista.btnExportaSNC.disable();
            if(vista.pPersonas.smpersonas.hasSelection()){
                 vista.pPersonas.btnHavilitar.disable();
                 //vista.pPersonas.btnNoHavilitar.disable();
                vista.btnActualizarMovimientosPersonasCargos.enable();
            }else{
                 vista.pPersonas.btnNoHavilitar.disable();
                 vista.pPersonas.btnHavilitar.disable();
                vista.btnActualizarMovimientosPersonasCargos.disable();
            }
        })

        //Eventos componente TabPanel.
        vista.tpCargosOcupados.on('tabchange', function (obj, tab) {
            if (tab.id == 'idtphistorico') {
                modelo.stCargosOcupadosHistorico.baseParams.idpersona = variables.idpersona;
                modelo.stCargosOcupadosHistorico.baseParams.identidad = variables.identidad;
                modelo.stCargosOcupadosHistorico.load({params: {limit: 15, start: 0}});
            }
        });

        //Eventos del grid Cargos ocupados por persona.
        vista.smCargosPersona.on('rowdeselect', function (sm, indiceFila, record) {
            vista.btnModificar.disable();
            vista.btnEliminar.disable();
        })

        //Eventos del grid Cargos ocupados por persona.
        vista.smCargosPersona.on('rowselect', function (sm, indiceFila, record) {
            // vista.btnAdicionar.enable();
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
            // var idpersonacuentabancariamn = vista.gpCargosPersona.getSelectionModel().getSelected().get('idpersonacuentabancariamn');
            // var idpersonacuentabancariacuc = vista.gpCargosPersona.getSelectionModel().getSelected().get('idpersonacuentabancariacuc');
            var idcargosocupados = vista.gpCargosPersona.getSelectionModel().getSelected().get('idcargosocupados');
            
            modelo.stCuentaBanc.load({
                params: {
                    idcargosocupados: idcargosocupados,
                    identidad: variables.identidad
                    // idcuentamn: idpersonacuentabancariamn,
                    // idcuentacuc: idpersonacuentabancariacuc
                }
            });
            /*modelo.stcbCuenta.removeAll();
             modelo.stcbCuenta.load({params:{idpersona:variables.idpersona, cuentamn:idpersonacuentabancariamn,cuentacuc:idpersonacuentabancariacuc}});*/
            //modelo.storeTipoPago.load(); guardar tipo moneda
            vista.btnActualizar.enable();
        })

        vista.smCuentaBanc.on('rowselect', function (sm, indiceFila, record) {
            var tipomoneda = vista.gpCuentaBanc.getSelectionModel().getSelected().get('tipomoneda');
            modelo.storeTipoPago.load({params: {tipomoneda: tipomoneda}});
        })

        vista.pPersonas.stpersonabuscar.on('load', function (st) {
            /*Ext.Ajax.request({
             url: 'validarMovimientos',
             method:'POST',
             params:{identidad: variables.identidad
             },
             callback: function (options,success,response){
             PVD.ocultarMascara('idalta');
             var respuesta = Ext.decode(response.responseText);
             if(respuesta.cod == 2){
             mostrarMensaje(2, 'A las personas:<b>' + respuesta.texto + '</b>no les coincide el cargo de fuerza de trabajo con el cargo de n&oacute;mina. Por favor realice una Nominilla de Cambios de Cargo y sincronice los movimientos.')
             vista.pPersonas.btnSincMovimientos.enable();
             }else{
             vista.pPersonas.btnSincMovimientos.disable();
             }

             }.createDelegate(this)
             });*/
        });

        /*vista.pPersonas.btnSincMovimientos.on('click', function(){
         Ext.Ajax.request({
         url: 'sincronizarMovimientos',
         method:'POST',
         params:{identidad: variables.identidad
         },
         callback: function (options,success,response){
         PVD.ocultarMascara('idalta');
         var respuesta = Ext.decode(response.responseText);
         if(respuesta == 'ok'){
         mostrarMensaje(1, 'Los movimientos fueron sincronizados satisfactoriamente');
         vista.pPersonas.Buscar();
         }

         }.createDelegate(this)
         });
         });*/

        vista.pPersonas.btnDarAlta.on('click', function () {
            var arrselmodelpersonas = vista.pPersonas.smpersonas.getSelections();
            var arrayidpersonasalta = new Array();
            var contaltas = 0;
            var flagocupados = 0;
            for (var i = 0; i < arrselmodelpersonas.length; i++) {
                arrayidpersonasalta[contaltas] = arrselmodelpersonas[i].data.idpersona;
                contaltas++;
                if (arrselmodelpersonas[i].data.idcargosocupados != null) {
                    flagocupados = 1;
                    break;
                }
            }
            if (flagocupados == 0) {
                if (arrayidpersonasalta.length > 0) {
                    mostrarMensaje(2, 'Esta seguro que desea darle alta en la entidad a la(s) persona(s) seleccionada(s).', function (btn) {
                        if (btn == 'ok') {
                            PVD.mostrarMascara('idalta', 'Por favor espere', 'Enviando datos');
                            Ext.Ajax.request({
                                url: 'darAltaPago',
                                method: 'POST',
                                params: {
                                    arridpersona: Ext.encode(arrayidpersonasalta),
                                    identidad: variables.identidad
                                },
                                callback: function (options, success, response) {
                                    PVD.ocultarMascara('idalta');
                                    var respuesta = Ext.decode(response.responseText);
                                    if (respuesta.codigo == 1) {
                                        mostrarMensaje(2, 'Las personas fueron dadas de alta sarisfactoriamente en la entidad.');
                                        vista.pPersonas.Buscar();
                                    }
                                }.createDelegate(this)
                            });
                        }
                    });
                } else {
                    mostrarMensaje(3, 'Por favor seleccione a las personas que no son altas en n&oacute;mina para darles alta.');
                }
            } else {
                mostrarMensaje(3, 'Por favor seleccione a las personas que no son altas en n&oacute;mina (<b>Color rojo</b>)');
            }

        });

        vista.pPersonas.btnDarBaja.on('click', function () {
            /*var arrselmodelpersonas = vista.pPersonas.smpersonas.getSelections();
            var arrayidpersonasbaja = new Array();
            var contbajas = 0;
            for (var i = 0; i < arrselmodelpersonas.length; i++) {
                arrayidpersonasbaja[contbajas] = arrselmodelpersonas[i].data.idcargosocupados;
                contbajas++;
            }
            mostrarMensaje(2, 'Esta seguro que desea darle baja en la entidad a las personas seleccionadas', function (btn) {
                if (btn == 'ok') {
                    PVD.mostrarMascara('idalta', 'Por favor espere', 'Enviando datos');
                    Ext.Ajax.request({
                        url: 'darBajaPago',
                        method: 'POST',
                        params: {
                            arridcargosocupados: Ext.encode(arrayidpersonasbaja),
                            identidad: variables.identidad
                        },
                        callback: function (options, success, response) {
                            PVD.ocultarMascara('idalta');
                            var respuesta = Ext.decode(response.responseText);
                            if (respuesta == 'ok') {
                                mostrarMensaje(2, 'Las personas fueron dadas de baja sarisfactoriamente en la entidad');
                                vista.pPersonas.Buscar();
                            }

                        }.createDelegate(this)
                    });
                }
            });*/
        });       

        vista.pPersonas.btnHavilitar.setHandler(function () {
            modificarActivoPersona(1);
        });

        vista.pPersonas.btnNoHavilitar.setHandler(function () {
            modificarActivoPersona(0);
        });

        function modificarActivoPersona(activo) {
            var msg;
            if (activo == 1) {
                msg = 'habilitar';
            } else {
                msg = 'deshabilitar';
            }
            mostrarMensaje(2, '¿Desea ' + msg + ' la persona seleccionada?', function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartipopago', 'Por favor espere…', 'Actualizando estado...');
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : 'modificarActivoPersona',
                        method  : 'POST',
                        params  : {
                            idpersona: vista.pPersonas.smpersonas.getSelected().get('idpersona'),
                            activo: activo
                        },
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartipopago');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el tipo de nómina.
                                mostrarMensaje(1, 'La acci&oacute;n se a ejecutado');
                                vista.pPersonas.Buscar();

                            }
                        }
                    });
                }
            });
        }

        vista.btnActualizarMovimientosPersonasCargos.on('click', function (btn) {
            var arrselmodelpersonas = vista.pPersonas.smpersonas.getSelections();
            var arrayidcargosocupados = new Array();
            var contaltas = 0;
            for (var i = 0; i < arrselmodelpersonas.length; i++) {
                if (arrselmodelpersonas[i].data.idcargosocupados != null) {
                    arrayidcargosocupados[contaltas] = arrselmodelpersonas[i].data.idcargosocupados;
                    contaltas++;
                }
            }
            if (arrayidcargosocupados.length > 0) {
                mostrarMensaje(2, 'Esta seguro que desea actualizarle los Cargos desde Gesti&oacute;n de Movimientos Laborales a las Personas seleccionadas.', function (btn) {
                    if (btn == 'ok') {
                        PVD.mostrarMascara('idactualizarcargos', 'Por favor espere', 'Enviando datos');
                        Ext.Ajax.request({
                            url: 'actualizarCargosMovimientosLaborales',
                            method: 'POST',
                            params: {
                                arryidcargosocupados: Ext.encode(arrayidcargosocupados),
                                identidad: variables.identidad
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('idactualizarcargos');
                                var respuesta = Ext.decode(response.responseText);
                                if (respuesta.codigo == 1) {
                                    mostrarMensaje(2, 'Los Cargos fueron actualizados sarisfactoriamente.');
                                    vista.pPersonas.Buscar();
                                    modelo.stCargosOcupados.reload();
                                }else{
                                    mostrarMensaje(3, 'Por favor seleccione Personas que sean altas en Nomina para actualizarle los Cargos desde Gesti&oacute;n de Movimientos Laborales.');
                                }
                            }.createDelegate(this)
                        });
                    }
                });
            } else {
                mostrarMensaje(3, 'Por favor seleccione Personas que sean altas en Nomina para actualizarle los Cargos desde Gesti&oacute;n de Movimientos Laborales.');
            }
        });


        vista.btnCancelarCuenta.setHandler(function () {
            vista.winAdicionarCuenta.hide();
        });


        vista.btnAceptarCuenta.setHandler(function () {
            var value = "";
            var textcb = vista.cbCuenta.getValue();
            var seleccionados = vista.gpCuentasBancarias.getSelectionModel().getSelections();
            if (textcb != "") {
                value = textcb;
            }
            for (var i = 0; i < seleccionados.length; i++) {
                value = value + "," + seleccionados[i].data.descripcion;
            }
            if (seleccionados.length == 0) {
                value = "";
            }
            vista.cbCuenta.setValue(value);
            //}
            vista.winAdicionarCuenta.hide();
        });

        vista.btnCancelarPlantilla.setHandler(function () {
            vista.winAdicionarPlantilla.hide();
        });

        vista.btnAceptarPlantilla.setHandler(function () {
            //variables.cambio = 1;
            //variables.boton = 'ACP';
            enviarDatos('all');
        });

        modelo.stcbCuenta.on('load', function (obj, rec, opc) {
            /* seleccion = new Array();
             otros=rec.data;
             var i = 0;
             Ext.each(rec,function(Record){
             if (Record.data.checked) {
             seleccion.push(Record)
             }
             });
             vista.smCuentasBancarias.selectAll();*/
            //vista.smCuentasBancarias.selectRecords(seleccion);
        }, this);

        //Eventos del botón adicionar cargo.
        vista.btnAdicionar.setHandler(function () {
            vista.winAdicionarCargos.setTitle('Adicionar cargo');
            vista.btnAplicar.enable();
            vista.winAdicionarCargos.show();
            resetearFormulario();
            variables.idcargo = null;
            variables.idplantillanominal = null;
            variables.cambio = 1;
            variables.accion = 'ADD';
            vista.checkPersonasPlantillas.enable();
            //vista.cbCajaCajero.setValue(1);
            vista.cbCuenta.setValue('');
            //vista.cbCuenta.enable();
            vista.cbPlantillaNominal.setValue('');
            vista.cbCentroCosto.setValue('');
            vista.cbPlantillaNominal.disable();
            vista.dfFechaRegistro.setMaxValue(new Date());
        });
        //acciones de adicionar numero contable
        vista.btnCalcularNC.setHandler(function () {
            // vista.nfNumeroContable.setValue(' ');
            PVD.mostrarMascara('calcular', idioma.lbMsgEspera, 'Espere por favor...calculando n&uacute;mero contable');
            Ext.Ajax.request({
                url: 'calcularNumeroContable',
                method: 'POST',
                // timeout:99999999,
                params: {
                    identidad: variables.identidad
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('calcular');

                    if (responseData.Mensaje == "ok") {
                        vista.nfNumeroContable.setValue(responseData.datos);
                    }
//
                }
            });

        });

        //acciones de adicionar numero contable
        vista.btnAdicionarNC.setHandler(function () {
            vista.nfNumeroContable.setValue('');
            vista.winAdicionarNumerocontable.setTitle('Adicionar n&uacute;mero contable');
            vista.btnAplicarNC.enable();
            variables.accion = 'ADD';
            vista.winAdicionarNumerocontable.show();
            // resetearFormulario();
            // variables.idcargo = null;
            // variables.idplantillanominal = null;
            // variables.cambio = 1;
            // variables.accion = 'ADD';
            //  vista.checkPersonasPlantillas.enable();
            //vista.cbCajaCajero.setValue(1);
            // vista.cbCuenta.setValue('');
            //vista.cbCuenta.enable();
            // vista.cbPlantillaNominal.setValue('');
        });
        //acciones de modificar numero contable
        vista.btnModificarNC.setHandler(function () {
            vista.winAdicionarNumerocontable.setTitle('Modificar n&uacute;mero contable');
            vista.btnAplicarNC.hide();
            variables.accion = 'MOD';
            vista.nfNumeroContable.setValue(' ');
            vista.nfNumeroContable.setValue(variables.numerocontable);
            vista.winAdicionarNumerocontable.show();

            /*  vista.winAdicionarCargos.setTitle('Adicionar cargo');
             vista.btnAplicar.enable();
             vista.winAdicionarCargos.show();
             resetearFormulario();
             variables.idcargo = null;
             variables.idplantillanominal = null;
             variables.cambio = 1;
             variables.accion = 'ADD';
             vista.checkPersonasPlantillas.enable();
             //vista.cbCajaCajero.setValue(1);
             vista.cbCuenta.setValue('');
             //vista.cbCuenta.enable();
             vista.cbPlantillaNominal.setValue('');*/
        });
        //acciones de eliminar numero contable
        vista.btnEliminarNC.setHandler(function () {
            eliminarNumerocontable();
        });
        /*vista.btnActualizarApt.setHandler(function () {
            actualizarapertura();
        });*/

        vista.btnSyncCentrosCostoPersonas.on('click', function () {
            btnSyncCentrosCostoPersonas();
        });

        //Evento del boton modificar cargo ocupado.
        vista.btnModificar.setHandler(function () {

            variables.accion = 'MOD';
            variables.cambio = 0;
            vista.checkPersonasPlantillas.disable();
            vista.winAdicionarCargos.show();
            //vista.cbCuenta.setValue('');   
            vista.fpAsignarCargo.getForm().loadRecord(vista.gpCargosPersona.getSelectionModel().getSelected());
            vista.trfCargo.setValue(vista.gpCargosPersona.getSelectionModel().getSelected().get('denomcargo'));
            variables.idcargo = vista.gpCargosPersona.getSelectionModel().getSelected().get('idcargo');
            vista.cbSituacionLaboral.setValue(vista.gpCargosPersona.getSelectionModel().getSelected().get('idsituacionlaboral'));
            vista.cbCentroCosto.setValue(vista.gpCargosPersona.getSelectionModel().getSelected().get('idcentrocosto'));
            vista.nfNumeroContable.setValue(vista.gpCargosPersona.getSelectionModel().getSelected().get('numerocontable'));
            vista.dfFechaRegistro.setValue(vista.gpCargosPersona.getSelectionModel().getSelected().get('fecharegistro'));
            vista.dfFechaAplicacion.setValue(vista.gpCargosPersona.getSelectionModel().getSelected().get('fechaaplicacion'));
            vista.dfFechaVencimiento.setValue(vista.gpCargosPersona.getSelectionModel().getSelected().get('fechavencimiento'));
            vista.taObservaciones.setValue(vista.gpCargosPersona.getSelectionModel().getSelected().get('observaciones'));
            //vista.cbCajaCajero.setValue(vista.gpCargosPersona.getSelectionModel().getSelected().get('idcajacajero')); 
            var idcajacajero = vista.gpCargosPersona.getSelectionModel().getSelected().get('idcajacajero');
            var cuentamn = vista.gpCargosPersona.getSelectionModel().getSelected().get('idpersonacuentabancariamn');
            var textcuentamn = vista.gpCargosPersona.getSelectionModel().getSelected().get('cuentabancariamn');
            var textcuentacuc = vista.gpCargosPersona.getSelectionModel().getSelected().get('cuentabancariacuc');
            var cuentacuc = vista.gpCargosPersona.getSelectionModel().getSelected().get('idpersonacuentabancariacuc');

            vista.cbCuenta.setValue(textcuentamn + "," + textcuentacuc);
            if (vista.gpCargosPersona.getSelectionModel().getSelected().get('idplantillanominal')) {
                vista.cbPlantillaNominal.setValue(vista.gpCargosPersona.getSelectionModel().getSelected().get('idplantillanominal'));
            }

            variables.path = vista.gpCargosPersona.getSelectionModel().getSelected().get('path');
            if (variables.idcargo == null) {
                vista.cbPlantillaNominal.enable();
                vista.cbPlantillaNominal.setValue(vista.gpCargosPersona.getSelectionModel().getSelected().get('idplantillanominal'));
                variables.idplantillanominal = vista.gpCargosPersona.getSelectionModel().getSelected().get('idplantillanominal');
            } else {
                vista.cbPlantillaNominal.disable();
                vista.cbPlantillaNominal.setValue('');
                variables.idplantillanominal = null;
            }
            vista.winAdicionarCargos.setTitle('Modificar cargo ocupado');
            vista.btnAplicar.hide();
            vista.dfFechaRegistro.setMaxValue(new Date());

        })

        //Eventos del botón eliminar cargo.
        vista.btnEliminar.setHandler(function () {
            eliminarCargoOcupado();
        });

        //Eventos del botón exportar snc.
        vista.btnExportaSNC.setHandler(function () {
            exportarSNC225();
        });

        //Evento del boton aceptar de la ventana adicionar o modificar cargo ocupado.
        vista.btnAceptar.setHandler(function () {
            variables.boton = 'ACP';
            enviarDatos('');
        });

        //Evento del boton aplicar de la ventana adicionar cargo ocupado.
        vista.btnAplicar.setHandler(function () {
            variables.boton = 'APL';
            enviarDatos('');
        });
        /* vista.btnExportar.setHandler(function(){
         var winload = new Ext.PVD.comun.window.winLoad({
         title:'Por favor espere...',
         mensaje:'Generando reporte'
         });
         winload.showMask();

         window.open(document.location.protocol + '//' +window.location.host + '/pvd/nomina/index.php/gestionarcargosocupados/exportarPdf?identidad=' + variables.identidad );
         winload.close();
         });*/

        //Evento del boton cancelar de la ventana adicionar o modificar cargo ocupado.
        vista.btnCancelar.setHandler(function () {
            vista.winAdicionarCargos.hide();
        });
        //Evento del boton aceptar de la ventana adicionar o modificar numero contable.
        vista.btnAceptarNC.setHandler(function () {
            // variables.boton = 'ACP';
            enviarDatosNC('');
        });

        //Evento del boton aplicar de la ventana adicionar numero contable.
        vista.btnAplicarNC.setHandler(function () {
            //variables.boton = 'APL';
            enviarDatosNC('');
        });

        //Evento del boton cancelar de la ventana adicionar o modificar numero contable.
        vista.btnCancelarNC.setHandler(function () {
            vista.winAdicionarNumerocontable.hide();
        });

        this.MostrarArbolEstructurayComposicion = function () {
            vista.winEstCargo.show();
            vista.pEstCargo.smArbol.clearSelections();
            vista.btnAceptarCargo.disable();
            if (variables.accion == 'MOD') {
                var path = '/idraiz';
                for (var i = 1; i < variables.path.length; i++) {
                    if (variables.path[i] != '') {
                        path = path + '/' + variables.path[i].toString();
                    }
                }
                vista.pEstCargo.arbol.expandPath(path);
            }
        }

        this.MostrarGridCargosOcupacionActual = function (arrCargos) {
            var st = new Ext.data.SimpleStore({
                fields: [
                    {name: 'idocupacionactual'},
                    {name: 'idcargo'},
                    {name: 'cargo'}
                ]
            });
            st.loadData(arrCargos);

            var g = new Ext.grid.GridPanel({
                region: 'center',
                store: st,
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect: true,
                    listeners: {
                        rowselect: function (sm, ind, rec) {
                            variables.idcargo = rec.data.idcargo;
                            vista.trfCargo.setRawValue(rec.data.cargo);
                            //vista.cbPlantillaNominal.disable();
                            if (variables.idcargo) {
                                vista.cbPlantillaNominal.disable();
                                vista.cbPlantillaNominal.setValue('');
                                variables.idplantillanominal = null;
                            } else {
                                vista.cbPlantillaNominal.enable();
                            }

                            win.close();
                        }
                    }
                }),
                columns: [
                    {id: 'idocupacionactual', width: 160, dataIndex: 'idocupacionactual', hidden: true},
                    {dataIndex: 'idocupacionactual', hidden: true},
                    {header: "Cargo", width: 250, sortable: true, dataIndex: 'cargo'}
                ],
                stripeRows: true,
                autoExpandColumn: 'idocupacionactual',
                height: 250,
                width: 300
            });

            var win = new Ext.Window({
                title: 'Ocupaci&oacute;n actual de la persona',
                modal: true,
                resizable: false,
                constrain: true,
                layout: 'border',
                height: 200,
                width: 300,
                items: [g]
            });

            win.show();

        }


        //Evento que ejecuta la ventana de estructura de cargos.
        vista.trfCargo.onTriggerClick = function (e) {
            Ext.Ajax.request({
                url: 'verificarocupacionactual',
                method: 'POST',
                params: {
                    idpersona: variables.idpersona,
                    identidad: variables.identidad
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.length > 0) {
                        var a = new Array();
                        for (var i = 0; i < respuesta.length; i++) {
                            var l = new Array()
                            l[0] = respuesta[i].idocupacionactual;
                            l[1] = respuesta[i].idcargo;
                            l[2] = respuesta[i].cargo;
                            a.push(l);
                        }
                        this.MostrarGridCargosOcupacionActual(a);
                    } else {
                        mostrarMensaje(3, 'Por favor asociele al menos una situaci&oacute;n a la persona en el m&oacute;dulo de movimiento de la fuerza de trabajo')
                        //this.MostrarArbolEstructurayComposicion();
                    }

                }.createDelegate(this)
            });

        }.createDelegate(this)

        //Evento del boton cancelar de la ventana de estructura de cargos.
        vista.btnCancelarCargo.setHandler(function () {
            if (variables.accion == 'MOD') {
                vista.trfCargo.setValue(vista.gpCargosPersona.getSelectionModel().getSelected().get('denomcargo'));
                variables.idcargo = vista.gpCargosPersona.getSelectionModel().getSelected().get('idcargo');
            } else {
                vista.trfCargo.setValue('');
                variables.idcargo = null;
            }
            vista.winEstCargo.hide();
        });

        //Eventos del objeto del ábol de cargos.
        vista.pEstCargo.on('estructuraselecionada', function (o, nodo) {
            if (nodo.attributes.tipoestructura == 4 || nodo.attributes.tipoestructura == 5) {
                variables.idcargo = nodo.id;
                vista.trfCargo.setRawValue(nodo.attributes.denominacion);
                vista.btnAceptarCargo.enable();
                //vista.cbPlantillaNominal.disable();
                vista.cbPlantillaNominal.setValue('');
                variables.idplantillanominal = null;
            } else {
                vista.btnAceptarCargo.disable();
            }
        });

        //Evento del boton cancelar de la ventana de estructura de cargos.
        vista.btnAceptarCargo.setHandler(function () {
            variables.cambio = 1;
            vista.winEstCargo.hide();
        });

        /*vista.btnActualizar.on('click', function(){
         actualizarCuentasBancarias();
         });*/

        vista.btnEliminarCuentasBancarias.setHandler(function () {
            eliminarCuentasBancarias();
        });

        vista.smCuentaBanc.on('rowselect', function (sm, index, rowselect) {
            vista.btnEliminarCuentasBancarias.enable();
        });

        //Funcion para resetear los valores del formulario.
        function resetearFormulario() {
            vista.trfCargo.setValue('');
            vista.nfNumeroContable.setValue('');
            vista.dfFechaVencimiento.reset();
            vista.taObservaciones.setValue('');
            variables.cambio = 0;
        }

        //Evento limpiar trigger Field cargo.
        vista.trfCargo.on('keyup', function (t, e) {
            if (e.keyCode == 46 || e.keyCode == 8) {
                vista.trfCargo.setValue('');
                variables.idcargo = null;
                vista.cbPlantillaNominal.enable();
                variables.idplantillanominal = null;
            }
            consolo.info('sa');
        })

        //Evento de cambio del trigger Field cargo.
        vista.trfCargo.on('change', function (cb, nvalue) {
            variables.cambio = 1;
        })
        vista.cbCentroCosto.on('change', function (cb, nvalue) {
            variables.cambio = 1;
        })

        //Evento de cambio del ComboBox situacion laboral.
        vista.cbSituacionLaboral.on('change', function () {
            variables.cambio = 1;
        })

        //Evento de cambio del ComboBox situacion laboral.
        vista.nfNumeroContable.on('change', function () {
            variables.cambio = 1;
        })

        /*vista.cbCajaCajero.on('change', function(c, b){
         variables.cambio = 1;
         });*/

        /*vista.cbCajaCajero.on('select', function(cb, n, o){
         if(n.data.idcajacajero == 2){
         vista.cbCuenta.enable();
         }else{
         vista.cbCuenta.disable();
         vista.cbCuenta.setValue("");
         vista.cbCuenta.setRawValue("");
         }
         });*/

        vista.cbCuenta.on('change', function (c, b) {
            variables.cambio = 1;
        });

        vista.cbPlantillaNominal.on('select', function (cb, record, index) {
            variables.idplantillanominal = record.data.idplantillanominal;
        });
        vista.cbPlantillaNominal.on('change', function (c, b) {
            variables.cambio = 1;
        })

        vista.cbSituacionLaboral.on('select', function (cb, n, o) {
            variables.asociadoalcargo = n.data.asociadoalcargo;
            if (vista.trfCargo.getValue() == '' || variables.idcargo == null) {
                vista.cbPlantillaNominal.enable();

            } else {
                //vista.cbPlantillaNominal.disable();
                vista.cbPlantillaNominal.setValue('');
                variables.idplantillanominal = null;
                //vista.cbCentroCosto.setValue('');
                //variables.idcentrocosto = null;
            }
        });

        //Evento de cambio del dateField fecha de aplicacion.
        vista.dfFechaAplicacion.on('change', function () {
            variables.cambio = 1;
        });

        //Evento de cambio del dateField fecha de vencimiento.
        vista.dfFechaVencimiento.on('change', function () {
            variables.cambio = 1;
        })

        //Evento de cambio del dateField fecha de registro.
        vista.dfFechaRegistro.on('change', function () {
            variables.cambio = 1;
        })

        //Evento de cambio del TextArea descripcion.
        vista.taObservaciones.on('change', function () {
            variables.cambio = 1;
        })

        vista.cbCuenta.on('change', function (obj) {
            variables.cambio = 1;
        });

        vista.checkPersonasPlantillas.on('check', function (ch, checked) {
            if (checked == true) {
                vista.winAdicionarPlantilla.show();
                modelo.stcbPlantillasNominales.load({params: {idestructura: variables.identidad}});
            }
        });

        vista.smPlantillasNominales.on('rowselect', function (sm, indiceFila, record) {
            var contplantillas = 0;
            var arrplantillas = new Array();
            var selections = vista.gplantillasNominales.getSelectionModel().getSelections();
            for (var i = 0; i < selections.length; i++) {
                arrplantillas[contplantillas] = selections[i].data.idplantillanominal;
                contplantillas++;
            }
            modelo.stcbPersonasPlantillasNominales.load({
                params: {
                    idplantillas: Ext.encode(arrplantillas),
                    idestructura: variables.identidad
                }
            });
        });

        vista.smPlantillasNominales.on('rowdeselect', function (sm, indiceFila, record) {
            var contplantillas = 0;
            var arrplantillas = new Array();
            var selections = vista.gplantillasNominales.getSelectionModel().getSelections();
            for (var i = 0; i < selections.length; i++) {
                arrplantillas[contplantillas] = selections[i].data.idplantillanominal;
                contplantillas++;
            }
            modelo.stcbPersonasPlantillasNominales.load({
                params: {
                    idplantillas: Ext.encode(arrplantillas),
                    idestructura: variables.identidad
                }
            });
        });


        vista.btnActualizarCargos.on('click', function (btn) {
            var arrselmodelpersonas = vista.pPersonas.smpersonas.getSelections();
            var arrayidcargosocupados = new Array();
            var contaltas = 0;
            for (var i = 0; i < arrselmodelpersonas.length; i++) {
                if (arrselmodelpersonas[i].data.idcargosocupados != null) {
                    arrayidcargosocupados[contaltas] = arrselmodelpersonas[i].data.idcargosocupados;
                    contaltas++;
                }
            }
            if (arrayidcargosocupados.length > 0) {
                mostrarMensaje(2, 'Esta seguro que desea actualizarle los Cargos desde Gesti&oacute;n de Movimientos Laborales a las Personas seleccionadas.', function (btn) {
                    if (btn == 'ok') {
                        PVD.mostrarMascara('idactualizarcargos', 'Por favor espere', 'Enviando datos');
                        Ext.Ajax.request({
                            url: 'actualizarCargosMovimientosLaborales',
                            method: 'POST',
                            params: {
                                arryidcargosocupados: Ext.encode(arrayidcargosocupados),
                                identidad: variables.identidad
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('idactualizarcargos');
                                var respuesta = Ext.decode(response.responseText);
                                if (respuesta.codigo == 1) {
                                    mostrarMensaje(2, 'Los Cargos fueron actualizados sarisfactoriamente.');
                                    vista.pPersonas.Buscar();
                                }else{
                                    mostrarMensaje(3, 'Por favor seleccione Personas que sean altas en Nomina para actualizarle los Cargos desde Gesti&oacute;n de Movimientos Laborales.');
                                }
                            }.createDelegate(this)
                        });
                    }
                });
            } else {
                mostrarMensaje(3, 'Por favor seleccione Personas que sean altas en Nomina para actualizarle los Cargos desde Gesti&oacute;n de Movimientos Laborales.');
            }
        });

        function eliminarCuentasBancarias() {
            PVD.mostrarMascara('idmaskdelcuenta', 'Enviando datos', 'Por favor espere...');
            Ext.Ajax.request({
                url: 'eliminarCuentasBancarias',
                method: 'POST',
                params: {
                    idcargosocupados: vista.gpCargosPersona.getSelectionModel().getSelected().get('idcargosocupados'),
                    tipo: vista.gpCuentaBanc.getSelectionModel().getSelected().get('denomtipomoneda')
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('idmaskdelcuenta');
                    if (responseData == 'ok') {
                        mostrarMensaje(1, 'La cuenta fue eliminada satisfactoriamente');
                        //var idpersonacuentabancariamn = vista.gpCargosPersona.getSelectionModel().getSelected().get('idpersonacuentabancariamn');
                        //var idpersonacuentabancariacuc = vista.gpCargosPersona.getSelectionModel().getSelected().get('idpersonacuentabancariacuc');
                        modelo.stCargosOcupados.reload();
                        modelo.stCuentaBanc.load({params: {
                            idcargosocupados: vista.gpCargosPersona.getSelectionModel().getSelected().data.idcargosocupados, identidad: variables.identidad
                        }});
                    }
                }
            });
            vista.btnActualizar.disable();
            vista.btnEliminarCuentasBancarias.enable();
        }

        function exportarSNC225() {
            //PVD.mostrarMascara('idexportando','Por favor espere...','Exportando datos');
            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/gestionarcargosocupados/exportarSNC225?idpersona=' + variables.idpersona);
            /*Ext.Ajax.request({
             url: 'exportarSNC225',
             method:'POST',
             params:{
             idpersona: variables.idpersona
             },
             callback: function (options,success,response){
             responseData = Ext.decode(response.responseText);
             PVD.ocultarMascara('idexportando');
             }
             });*/
        }

        //Funcion para enviar los datos a la controladora.
        function enviarDatos(multiadd) {
            if (variables.cambio == 1) {
                //Obteniendo los # de cuenta
                var flag = 0;
                var contidpersonas = 0;
                var contnumeroscontables = 0;
                var contarrayidnumeroscuenta = 0;
                var arrayidnumeroscuenta = new Array();
                var arrayidspersonas = new Array();
                var arraynumeroscontables = new Array();
                var arrnodes = new Array();
                vista.cbCuenta.setValue("");
                arrnodes = vista.gpCuentasBancarias.getSelectionModel().getSelections();
                for (var i = 0; i < arrnodes.length; i++) {
                    arrayidnumeroscuenta[contarrayidnumeroscuenta] = arrnodes[i].data.idpersonacuentabancaria;
                    contarrayidnumeroscuenta++;
                }
                /*if(vista.cbCajaCajero.getValue() == 2){
                 if(arrnodes.length == 0){
                 mostrarMensaje(3, 'Por favor escoja los n&uacute;meros de cuenta');
                 return;
                 }
                 }*/

                if (multiadd == 'all') {
                    var cantidadpersonasadd = modelo.stcbPersonasPlantillasNominales.getTotalCount();
                    var todoselementos = modelo.stcbPersonasPlantillasNominales.getRange(0, cantidadpersonasadd - 1);
                    for (var i = 0; i < cantidadpersonasadd; i++) {
                        arrayidspersonas[contidpersonas] = todoselementos[i].data.idpersona;
                        arrayidnumeroscuenta[contnumeroscontables] = todoselementos[i].data.numerocontablepersona;
                        if (todoselementos[i].data.numerocontablepersona == '') {
                            flag++;
                        }
                        contidpersonas++;
                        contnumeroscontables++;
                    }

                }
                if (variables.accion == 'ADD') {
                    variables.url = 'adicionarCargoOcupado';
                    var parametros = {
                        idpersona: variables.idpersona,
                        arrayidpersona: Ext.encode(arrayidspersonas),
                        identidad: variables.identidad,
                        idcargo: variables.idcargo,
                        arrayidnumeroscuenta: Ext.encode(arrayidnumeroscuenta),
                        multiadd: multiadd,
                        idcentrocosto: vista.cbCentroCosto.getValue()

                    };
                } else if (variables.accion == 'MOD') {
                    variables.url = 'ModificarCargoOcupado';
                    var parametros = {
                        idpersona: vista.gpCargosPersona.getSelectionModel().getSelected().get('idpersona'),
                        arrayidpersona: Ext.encode(arrayidspersonas),
                        identidad: vista.gpCargosPersona.getSelectionModel().getSelected().get('identidad'),
                        idcargo: variables.idcargo,
                        idcargosocupados: vista.gpCargosPersona.getSelectionModel().getSelected().get('idcargosocupados'),
                        arrayidnumeroscuenta: Ext.encode(arrayidnumeroscuenta),
                        idcentrocosto: vista.gpCargosPersona.getSelectionModel().getSelected().get('idcentrocosto'),
                    };
                }
                if (vista.cbSituacionLaboral.getValue() == '' && vista.trfCargo.getValue() == '') {
                    if (multiadd == '') {
                        mostrarMensaje(1, 'La persona debe tener al menos un cargo o una situaci&oacute;n seleccionada.');
                        if (variables.idcargo == null && (variables.idplantillanominal == null || vista.cbPlantillaNominal.getValue() == '')) {
                            mostrarMensaje(1, 'Debe seleccionar una plantilla nominal.');
                            vista.cbPlantillaNominal.markInvalid(idioma.lbErrorCampoVacio);
                            return;
                        }
                        return;
                    }

                }


                if (vista.fpAsignarCargo.getForm().isValid()) {

                    /*if(variables.asociadoalcargo == 1 && vista.trfCargo.getRawValue() == ""){
                     vista.trfCargo.markInvalid(idioma.lbErrorCampoVacio);
                     mostrarMensaje(2,idioma.lbErrorCargoVacio);
                     }else{*/
                    flag = 0;
                    if ((multiadd == 'all' && flag == 0) || multiadd == '') {
                        vista.fpAsignarCargo.getForm().submit({
                            url: variables.url,
                            waitMsg: (variables.accion == 'ADD') ? idioma.lbMsgEsperaAddCargos : idioma.lbMsgEsperaUpdCargos,
                            params: parametros,
                            succes: function () {
                                vista.cbPlantillaNominal.disable();
                            },
                            failure: function (form, o) {
                                if (o.result.Mensaje == 1) {
                                    var msgOk = (variables.accion == 'ADD') ? idioma.lbMsgAdicionarCargo : idioma.lbMsgModificarCargo;
                                    mostrarMensaje(1, msgOk, function (btn) {
                                        if (btn == 'ok') {
                                            modelo.stCargosOcupados.load({
                                                params: {
                                                    limit: 15,
                                                    start: 0,
                                                    sistema: 'minfar'
                                                }
                                            });
                                            if (variables.boton == 'APL') {
                                                resetearFormulario();
                                            } else {
                                                vista.winAdicionarCargos.hide();
                                                vista.winAdicionarPlantilla.hide();
                                            }
                                        }
                                    })
                                } else if (o.result.Mensaje == 3) {
                                    if (o.result.tipo == 'cargo') {
                                        if (variables.accion == 'ADD') {
                                            mostrarMensaje(3, idioma.lbMsgErrorCargo);
                                        } else {
                                            mostrarMensaje(3, idioma.lbMsgErrorCargoMod);
                                        }
                                    } else if (o.result.tipo == 'situacion') {
                                        if (variables.accion == 'ADD') {
                                            mostrarMensaje(3, idioma.lbMsgErrorSituacion);
                                        } else {
                                            mostrarMensaje(3, idioma.lbMsgErrorSituacionMod);
                                        }
                                    } else {
                                        mostrarMensaje(3, idioma.lbMsgE3);
                                    }
                                }
                                vista.checkPersonasPlantillas.enable();
                                vista.cbPlantillaNominal.disable();
                            }
                        });
                        variables.cambio == 0;
                    } else {
                        mostrarMensaje(3, 'Por favor asociele a las personas los n&uacute;meros contables')
                    }
                    // }

                }
            } else {
                vista.winAdicionarCargos.hide();
            }
        }

        function enviarDatosNC(multiadd) {
            // if(variables.cambio == 1){
            //Obteniendo los # de cuenta
            if (variables.accion == 'ADD') {
                variables.url = 'adicionarNumeroContable';
                var parametros = {
                    idpersona: variables.idpersona,
                    identidad: variables.identidad,
                    persona: variables.persona

                };
            } else if (variables.accion == 'MOD') {
                variables.url = 'modificarNumeroContable';
                var parametros = {
                    idpersona: variables.idpersona,
                    identidad: variables.identidad,
                    idpersonacdgocontable: variables.idpersonacdgocontable
                };
            }


            if (vista.fpNumerocontable.getForm().isValid()) {
                /*if(variables.asociadoalcargo == 1 && vista.trfCargo.getRawValue() == ""){
                 vista.trfCargo.markInvalid(idioma.lbErrorCampoVacio);
                 mostrarMensaje(2,idioma.lbErrorCargoVacio);
                 }else{
                 if((multiadd == 'all' && flag == 0) || multiadd == ''){*/
                vista.fpNumerocontable.getForm().submit({
                    url: variables.url,
                    timeout: 500000000000,
                    waitMsg: (variables.accion == 'ADD') ? idioma.lbMsgEsperaAddCargos : idioma.lbMsgEsperaUpdCargos,
                    params: parametros,
                    failure: function (form, o) {
                        if (o.result.Mensaje == 1) {
                            if (variables.accion == 'ADD') {
                                mostrarMensaje(1, ' Se adicion&oacute; satisfactoriamente');
                                modelo.stNumerocontable.baseParams.idpersona = variables.idpersona;
                                modelo.stNumerocontable.baseParams.identidad = variables.identidad;
                                modelo.stNumerocontable.load();
                            } else {
                                mostrarMensaje(1, ' Se modific&oacute; satisfactoriamente');
                                modelo.stNumerocontable.baseParams.idpersona = variables.idpersona;
                                modelo.stNumerocontable.baseParams.identidad = variables.identidad;
                                modelo.stNumerocontable.load();
                            }


                            vista.winAdicionarNumerocontable.hide();
                            vista.nfNumeroContable.setValue(' ');

                        } else if (o.result.Mensaje == 3) {
                            if (variables.accion == 'ADD') {
                                if (o.result.Text == 1) {
                                    mostrarMensaje(3, ' Existe en la entidad una persona con este n&uacute;mero contable');
                                } else if (o.result.Text == 2) {
                                    mostrarMensaje(3, ' El n&uacute;mero contable que quiere adicionar ya existe');
                                }
                            } else {
                                mostrarMensaje(3, ' El n&uacute;mero contable ya existe');
                            }
                        }


                    }
                });

            }
        }

        //Funcion para eliminar un cargo de la persona.
        function eliminarCargoOcupado() {
            var cantidadcargos = modelo.stCargosOcupados.getTotalCount();
            mostrarMensaje(2/*(cantidadcargos==1)?3:2*/, (cantidadcargos == 1) ? '<b style="color: red">Con esta acci&oacute;n la persona pierde el alta en el Submayor de Vacaciones.</b>¿Est&aacute seguro que desea eliminar el &uacute;ltimo cargo de la persona en la entidad.?  ' : idioma.lbMsgVerificarEliminar, function elimina(btnPresionado) {
                if (btnPresionado == 'ok') {

                    PVD.mostrarMascara('ideliminarcargoocupado', idioma.lbMsgEspera, idioma.lbMsgEliminarDatos);
                    Ext.Ajax.request({
                        url: 'EliminarCargoOcupado',
                        method: 'POST',
                        params: {
                            idcargosocupados: vista.gpCargosPersona.getSelectionModel().getSelected().get('idcargosocupados'),
                            idpersona: vista.gpCargosPersona.getSelectionModel().getSelected().get('idpersona'),
                            identidad: variables.identidad
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('ideliminarcargoocupado');
                            if (responseData.succes == 'Ok') {
                                //vista.winAdicionarCargos.hide();
                                mostrarMensaje(1, 'El cargo ha sido eliminado satisfactoriamente', function (btn) {
                                    if (btn == 'ok') {
                                        modelo.stCargosOcupados.load({
                                            params: {
                                                limit: 15,
                                                start: 0,
                                                sistema: 'minfar'
                                            }
                                        });
                                        modelo.stNumerocontable.baseParams.idpersona = variables.idpersona;
                                        modelo.stNumerocontable.baseParams.identidad = variables.identidad;
                                        modelo.stNumerocontable.load();
                                    }
                                })
                            } else if (responseData.error == 'Uso') {
                                mostrarMensaje(3, idioma.lbMsgEliminarCargoE3);
                            } else if (responseData.error == 'DATOSSUBMAYOR') {
                                mostrarMensaje(3, 'La persona a eliminar posee saldo en el submayor de vacaciones. Por favor liquide las vacaciones');
                            } else if (responseData.error == 'PERIODOSABIERTOS') {
                                mostrarMensaje(3, 'El cargo no puede ser eliminado ya que la persona se encuentra con el mismo en per&iacute;odos de pago abiertos: <b>' + responseData.textoperiodos + '</b>>. Por favor cierre estos per&iacute;odos de pago en <b>Depositar Salarios</b> o en <b>Elaborar pagos.</b>');
                            }else {
                                mostrarMensaje(3, idioma.lbMsgEliminarCargoMov);
                            }
                        }
                    });
                }
            });
        }

        function eliminarNumerocontable() {
            mostrarMensaje(2, '¿Está seguro que quiere eliminar el n&uacute;mero contable?', function elimina(btnPresionado) {
                if (btnPresionado == 'ok') {
                    /* var filas= vista.gpCargosPersona.getSelectionModel().getSelections();*/
                    PVD.mostrarMascara('ideliminar', idioma.lbMsgEspera, idioma.lbMsgEliminarDatos);
                    Ext.Ajax.request({
                        url: 'eliminarNumerocontable',
                        method: 'POST',
                        params: {
                            idpersonacdgocontable: variables.idpersonacdgocontable
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('ideliminar');
                            if (responseData.Mensaje == 1) {
                                //vista.winAdicionarCargos.hide();
                                mostrarMensaje(1, 'El n&uacute;mero contable ha sido eliminado satisfactoriamente', function (btn) {
                                    if (btn == 'ok') {
                                        modelo.stNumerocontable.baseParams.idpersona = variables.idpersona;
                                        modelo.stNumerocontable.baseParams.identidad = variables.identidad;
                                        modelo.stNumerocontable.load();
                                    }
                                })
                            } else {
                                mostrarMensaje(3, 'El n&uacute;mero contable esta en uso');
                            }
                        }
                    });
                }
            });
        }

        function actualizarapertura() {

            PVD.mostrarMascara('actualizar', idioma.lbMsgEspera, 'Actualizando aperturas de las cuentas');
            Ext.Ajax.request({
                url: 'actualizarAperturas',
                method: 'POST',
                timeout: 99999999,
                params: {
                    identidad: variables.identidad
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('actualizar');
                    mostrarMensaje(1, 'Las aperturas de las cuentas han sido actualizadas');
//                            if(responseData.Mensaje == 1){
//                                //vista.winAdicionarCargos.hide();
//                                mostrarMensaje(1,'El n&uacute;mero contable ha sido eliminado satisfactoriamente', function(btn){
//                                    if (btn == 'ok'){
//                                        modelo.stNumerocontable.baseParams.idpersona = variables.idpersona;
//                                        modelo.stNumerocontable.load();
//                                    }
//                                })
//                            }else {
//                                mostrarMensaje(3,'El n&uacute;mero contable esta en uso');
//                            }
                }
            });
        }

        function btnSyncCentrosCostoPersonas() {
			 mostrarMensaje(2, '¿Est&aacute; seguro que desea actualizar los centros de costo de las personas?',
			 function (btn) {
                    if (btn == 'ok') {
						PVD.mostrarMascara('synccentroscosto', 'Por favor espere...', 'Sincronizando los centros de costo de las personas.');
						Ext.Ajax.request({
							url: 'sincronizarCentrosCostoCargos',
							method: 'POST',
							timeout: 99999999,
							params: {
								identidad: variables.identidad
							},
							callback: function (options, success, response) {
								responseData = Ext.decode(response.responseText);
								PVD.ocultarMascara('synccentroscosto');
								if(responseData.codigo == 1){
									mostrarMensaje(1, 'Los centros de costo de las personas se actualizaron satisfactoriamente');
								}else{
									mostrarMensaje(3, 'Las Plantillas Nominales de las Personas: <b>' +responseData.personas+ '</b> no tienen asociados Centros de Costo.')
								}

							}
						});
                        vista.pPersonas.Buscar();
                    }
             });
            
        }
    }
};
