Ext.ns('Pvd.Nomina.Configuracion.PeriodosDePagos');

//Controlador de la vista del componente Configurar periodos de pagos.
Pvd.Nomina.Configuracion.PeriodosDePagos.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Configurar Periodos De Pagos (Tipo: Pvd.Nomina.Configuracion.PeriodosDePagos.Vista)
     * @param modelo Modelo de la vista del componente Configurar Periodos De Pagos (Tipo: Pvd.Nomina.Configuracion.PeriodosDePagos.Modelo)
     */
    init: function (idioma, vista, modelo) {
        var variables = {
            identidad: null,
            denominacionentidad: '',
            idtipopago: new Array(),
            idperiodopago: 0,
            accion: '',
            cambio: 0
        };

        //Mostrar interfaz para selecionar entidad.
        vista.winEstEntidades.show();

        //Evento de la ventana de adicionar/modificar tipos de nómina.
        vista.ventanaPeriodos.on('beforeshow', function (ventana) {
            //vista.formularioPeriodos.getForm().reset();
            //vista.dfInicioPeriodo.focus(true, 500);
        });

        //Eventos del objeto del ábol de entidades.
        vista.pEstEntidades.on('estructuraselecionada', function (o, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
            variables.identidad = nodo.id;
            variables.denominacionentidad = nodo.text;
            vista.btnAceptarEntidades.enable();
            /*} else {
                variables.identidad = null;
                variables.denominacionentidad = '';
                vista.btnAceptarEntidades.disable();
            }*/
        });

        vista.btnAceptarEntidades.setHandler(function () {
            if (variables.identidad != null) {
                vista.winPeriodosPagosPrincipal.show();
                vista.winPeriodosPagosPrincipal.maximize();
                modelo.stTiposPagos.load();
            }
        });

        //Row selections
        vista.gpTiposPagos.getSelectionModel().on('rowselect', function (sm, index, record) {
            variables.idtipopago = sm.selections.keys;
            modelo.stPeriodosPago.load();
            modelo.stFechasInicioFin.removeAll();
        });

        vista.gpTiposPagos.getSelectionModel().on('rowdeselect', function (sm, index, record) {
            modelo.stFechasInicioFin.removeAll();
            if (sm.selections.length > 0) {
                variables.idtipopago = sm.selections.keys;
                modelo.stPeriodosPago.load();
            } else {
                modelo.stPeriodosPago.removeAll();
            }
        });

        vista.gpPeriodos.getSelectionModel().on('rowselect', function (sm, index, record) {
            variables.idperiodopago = record.data.idperiodopago;
            modelo.stFechasInicioFin.load({
                params: {
                    identidad: variables.identidad,
                    idtipopago: Ext.encode(variables.idtipopago),
                    idperiodopago: variables.idperiodopago
                }
            });
            vista.btnAdicionarFechas.enable();
        });

        vista.gpFechasInicioFin.getSelectionModel().on('rowselect', function (sm, index, record) {
            var cantidadseleccionados = vista.gpFechasInicioFin.getSelectionModel().getSelections().length;
            (cantidadseleccionados == 0) ? vista.btnEliminarFechas.disable() : vista.btnEliminarFechas.enable();
            (cantidadseleccionados != 1) ? vista.btnModificarFechas.disable() : vista.btnModificarFechas.enable();
        });

        vista.gpFechasInicioFin.getSelectionModel().on('rowdeselect', function (sm, index, record) {
            var cantidadseleccionados = vista.gpFechasInicioFin.getSelectionModel().getSelections().length;
            (cantidadseleccionados == 0) ? vista.btnEliminarFechas.disable() : vista.btnEliminarFechas.enable();
            (cantidadseleccionados != 1) ? vista.btnModificarFechas.disable() : vista.btnModificarFechas.enable();
        });

        //Change en los campos de fechas
        vista.dfInicioPeriodo.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        vista.dfFinPeriodo.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        //Acciones de botones
        //vista.btnAdicionarFechas.on('click', function () {
        vista.btnRecargarPeriodosP.setHandler(function () {
            modelo.stPeriodosPago.load();
            vista.gpPeriodos.getSelectionModel().clearSelections();
            modelo.stFechasInicioFin.removeAll();
        });

        vista.btnAdicionarFechas.setHandler(function () {
            variables.accion = 'ADD';
            vista.btnAplicarPeriodo.setVisible(true);
            vista.ventanaPeriodos.setTitle('Adicionar rango de fechas');
            vista.dfInicioPeriodo.setValue("");
            vista.dfFinPeriodo.setValue("");
            vista.formularioPeriodos.getForm().reset();
            vista.dfInicioPeriodo.focus(true, 500);
            vista.ventanaPeriodos.show();
        });

        //vista.btnModificarFechas.on('click', function () {
        vista.btnModificarFechas.setHandler(function () {
            variables.accion = 'MOD';
            vista.btnAplicarPeriodo.setVisible(false);
            vista.ventanaPeriodos.setTitle('Modificar rango de fechas');
            vista.dfInicioPeriodo.setValue(vista.smFechasInicioFin.getSelected().get('fechainicio'));
            vista.dfFinPeriodo.setValue(vista.smFechasInicioFin.getSelected().data.fechafin);
            vista.dfInicioPeriodo.focus(true, 500);
            vista.ventanaPeriodos.show();
        });

        //vista.btnEliminarFechas.on('click', function () {
        vista.btnEliminarFechas.setHandler(function () {
            var array_seleccionados = vista.gpFechasInicioFin.getSelectionModel().getSelections();
            var arrayiddesgloseperiodos = new Array();
            for (var i = 0; i < array_seleccionados.length; i++) {
                arrayiddesgloseperiodos[i] = array_seleccionados[i].data.iddesgloseperiodos;
            }
            var pf_msg_interrogacion = (array_seleccionados.length > 1) ? ' los rangos de fechas seleccionados?' : ' el rango de fechas seleccionado?';
            var pi_msg_afirmacion = (array_seleccionados.length > 1) ? 'Los rangos de fechas seleccionados fueron eliminados ' : 'El rango de fechas seleccionado fue eliminado ';
            mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar' + pf_msg_interrogacion, function (btn) {
                if (btn == 'ok') {
                    //Se muestra la m�scara de espera.
                    PVD.mostrarMascara('idmaskdelperiodo', 'Por favor espere...', 'Eliminando datos');
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarPeriodosPagos',
                        method: 'POST',
                        params: {
                            idperiodostipospago: vista.smFechasInicioFin.getSelected().data.idperiodostipospago,
                            arrayiddesgloseperiodos: Ext.encode(arrayiddesgloseperiodos)
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando m�scara de enviar datos.
                            PVD.ocultarMascara('idmaskdelperiodo');
                            if (responseData.respuesta == 'DEL') {
                                variables.cambio == 0;
                                vista.btnModificarFechas.disable();
                                vista.btnEliminarFechas.disable();
                                mostrarMensaje(1, pi_msg_afirmacion + 'satisfactoriamente.', function (btn) {
                                    if (btn == 'ok') {
                                        modelo.stFechasInicioFin.load({
                                            params: {
                                                identidad: variables.identidad,
                                                idtipopago: Ext.encode(variables.idtipopago),
                                                idperiodopago: variables.idperiodopago
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });

        //Botones de la ventana
        //vista.btnCancelarPeriodo.on('click', function () {
        vista.btnCancelarPeriodo.setHandler(function () {
            vista.ventanaPeriodos.hide();
        });

        //vista.btnAplicarPeriodo.on('click', function () {
        vista.btnAplicarPeriodo.setHandler(function () {
            //Se verifica si el formulario es v�lido y si el campo sueldo contiene un valor
            if (vista.formularioPeriodos.getForm().isValid()) {
                adicionarModificarFechasPeriodosPagos();
            } else {
                mostrarMensaje(3, 'Por favor verifique los campos incorrectos');
            }
            vista.btnModificarFechas.disable();
            vista.btnEliminarFechas.disable();
            vista.dfInicioPeriodo.setValue("");
            vista.dfFinPeriodo.setValue("");
            vista.formularioPeriodos.getForm().reset();
            vista.dfInicioPeriodo.focus(true, 500);
        });

        //vista.btnAceptarPeriodo.on('click', function () {
        vista.btnAceptarPeriodo.setHandler(function () {
            //Se verifica si el formulario es v�lido y si el campo sueldo contiene un valor
            if (vista.formularioPeriodos.getForm().isValid()) {
                adicionarModificarFechasPeriodosPagos();
            } else {
                mostrarMensaje(3, 'Por favor verifique los campos incorrectos');
            }
            vista.btnModificarFechas.disable();
            vista.btnEliminarFechas.disable();
            vista.dfInicioPeriodo.setValue("");
            vista.dfFinPeriodo.setValue("");
            vista.formularioPeriodos.getForm().reset();
            vista.dfInicioPeriodo.focus(true, 500);
            vista.ventanaPeriodos.hide();
        });

        function adicionarModificarFechasPeriodosPagos() {
            var url = (variables.accion == 'ADD') ? 'adicionarPeriodosPagos' : 'modificarPeriodosPagos';
            PVD.mostrarMascara('idmaskaddmodfechas', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: url,
                method: 'POST',
                params: {
                    identidad: variables.identidad,
                    idtipopago: Ext.encode(variables.idtipopago),
                    idperiodopago: variables.idperiodopago,
                    fechainicio: vista.dfInicioPeriodo.getRawValue(),
                    fechafin: vista.dfFinPeriodo.getRawValue(),
                    iddesgloseperiodos: (variables.accion == 'MOD') ? vista.smFechasInicioFin.getSelected().data.iddesgloseperiodos : -1,
                    idperiodostipospago: (variables.accion == 'MOD') ? vista.smFechasInicioFin.getSelected().data.idperiodostipospago : -1
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('idmaskaddmodfechas');
                    var msg = '';
                    var tipomsg = 1;
                    switch (responseData.respuesta) {
                        case "ADD":
                            var msg_afirmacion = ((responseData.cantperiodos) > 1) ? 'Los rangos de fechas fueron adicionados ' : 'El rango de fechas fue adicionado ';
                            msg = msg_afirmacion + 'satisfactoriamente.';
                            break;

                        case "NO-CONFIG-PERIODO":
                            msg = 'No existe el per&iacute;odo de pago seleccionado, por favor configure el per&iacute;odo ' +
                                'de pago en <b>Nomencladores/Nomencladores de n&oacute;mina/Per&iacute;odos de pago</b>. ';
                            tipomsg = 3;
                            break;

                        case "MOD":
                            msg = 'El rango de fechas fue modificado satisfactoriamente.';
                            break;

                        case "EXISTE":
                            msg = 'El rango de fechas especificado ya existe para este per&iacute;odo de pago.';
                            tipomsg = 3;
                            break;
                    }

                    /*if ((responseData.respuesta).split("-")[0] == 'ADD') {
                        var msg_afirmacion = ((responseData.respuesta).split("-")[1] > 1) ? 'Los rangos de fechas fueron adicionados ' : 'El rango de fechas fue adicionado ';
                        msg = msg_afirmacion + 'satisfactoriamente.';

                    }
                    else if (responseData.respuesta == 'MOD')
                        msg = 'El rango de fechas fue modificado satisfactoriamente.';
                    else if (responseData.respuesta == 'EXISTE') {
                        msg = 'El rango de fechas especificado ya existe para este per&iacute;odo de pago.';
                        tipomsg = 3;
                    }
                    else if (responseData.respuesta == 'NO-CONFIG-PERIODO') {
                        msg = 'No existe el per&iacute;odo de pago seleccionado, por favor configure el per&iacute;odo ' +
                            'de pago en <b>Nomencladores/Nomencladores de n&oacute;mina/Per&iacute;odos de pago</b>. ';
                        tipomsg = 3;
                    }*/

                    mostrarMensaje(tipomsg, msg, function (btn) {
                        if (btn == 'ok' && tipomsg == 1) {
                            modelo.stFechasInicioFin.load({
                                params: {
                                    identidad: variables.identidad,
                                    idtipopago: Ext.encode(variables.idtipopago),
                                    idperiodopago: variables.idperiodopago
                                }
                            });
                        }
                    });
                }
            })
            ;
        }
    }
};