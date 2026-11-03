Ext.ns('Pvd.Nomina.Pagos.ElaborarPagos');

Pvd.Nomina.Pagos.ElaborarPagos.Controlador = {
    init: function (idioma, vista, modelo) {
        var _this = this;
        var variables = {
            identidad: 0,
            idtipopago: -1,
            modoseleccionpersonas: -1,
            modopago: -1,
            periodopagocombo: null,
            periodopagogrid: null,
            idelaborarpagos: null,
            idperiodopago: null,
            fechapago: null,
            fechainicioperiodo: null,
            fechafinperiodo: null,
            mesanyopago: null,
            mes: null,
            estado: null,
            fuente: 1,
            personasperiodospagos: null,
            tipopago: null,
            cargosocupados: null,
            arrtipospagoref: new Array(),
            arrdenomtipospagoref: ''
        };

        //Mostrar interfaz para selecionar entidad.
        vista.winEstEntidades.show();

        //Eventos del objeto del ábol de entidades.
        vista.pEstEntidades.on('estructuraselecionada', function (o, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
            variables.identidad = nodo.attributes.id;
            vista.btnAceptarEntidades.enable();
            /*} else {
                variables.identidad = null;
                vista.btnAceptarEntidades.disable();
            }*/
        });

        vista.btnAceptarEntidades.setHandler(function () {
            vista.winElaborarPago.show();
            vista.winElaborarPago.maximize();
            modelo.stTipoPago.load();
            vista.btnAdicionarPeriodosReferenciados.disable();
            vista.objListarPeriodosPagos.CambiarEntidad(variables.identidad);
        });

        vista.btnAdicionarPeriodosReferenciados.on('click', function () {
            vista.winPeriodosPagos.setTitle('Listado de periodos de pagos');
            vista.winPeriodosPagos.show();
        });

        vista.winPeriodosPagos.on('hide', function () {
            vista.objListarPeriodosPagos.stPeriodosPago.removeAll();
            vista.objListarPeriodosPagos.stPeriodosPagoExportar.removeAll();
        });

        vista.objListarPeriodosPagos.on('periodopagoseleccionado', function (record) {
            vista.objListarPeriodosPagos.btnAddGridExportarVarios.enable();
            vista.objListarPeriodosPagos.btnDelGridExportarVarios.disable();
            vista.recordperiodopagoseleccionado = record;
        });

        vista.objListarPeriodosPagos.btnAddGridExportarVarios.setHandler(function (btn) {
            //Validando que no existan dos periodos de la misma nomina
            var arrayidelaborarpagos = new Array();
            var contador = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
            var range = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0, contador);
            var flagtp = 0;
            for (var i = 0; i < contador; i++) {
                // arrayidelaborarpagos[i] = range[i].data.idelaborarpagos;
                if (range[i].data.idtipopago == vista.recordperiodopagoseleccionado.data.idtipopago) {
                    flagtp = 1;
                }
            }
            if (flagtp == 1) {
                mostrarMensaje(3, 'No puede asociar dos periodos de pago del mismo tipo de pago');
            } else {
                vista.objListarPeriodosPagos.stPeriodosPagoExportar.add(vista.recordperiodopagoseleccionado);
                vista.objListarPeriodosPagos.stPeriodosPago.remove(vista.recordperiodopagoseleccionado);
                btn.disable();
            }

        });

        vista.btnAceptarPeriodosPagosReferenciados.on('click', function () {
            var arrayidep = new Array();
            var cont = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
            var todos = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0, cont - 1);
            for (var i = 0; i < cont; i++) {
                arrayidep[i] = todos[i].data.idelaborarpagos;
            }
            PVD.mostrarMascara('idmaskperiodosref', 'Por favor espere...', 'Enviando datos');
            //Actualizando automaticamente las cuentas de cup cuc
            Ext.Ajax.request({
                url: 'adicionarPeriodosReferenciados',
                method: 'POST',
                params: {
                    idelaborarpago: variables.periodopagogrid.data.idelaborarpagos,
                    arrayidep: Ext.encode(arrayidep)
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmaskperiodosref')
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'ok') {
                        mostrarMensaje(1, 'Los periodos de pago referenciados fueron adicionados satisfactoriamente');
                    }
                    modelo.stPeriodosPagoReferenciados.load({params: {idelaborarpago: variables.periodopagogrid.data.idelaborarpagos}});
                    vista.winPeriodosPagos.hide();
                }.createDelegate(this)
            });
        });

        vista.objListarPeriodosPagos.btnDelGridExportarVarios.setHandler(function (btn) {
            if (vista.objListarPeriodosPagos.modoview == 2) {
                vista.objListarPeriodosPagos.stPeriodosPagoExportar.remove(vista.recordperiodopagoexportarseleccionado);
                vista.objListarPeriodosPagos.stPeriodosPago.add(vista.recordperiodopagoexportarseleccionado);
                btn.disable();
            }
        })

        vista.objListarPeriodosPagos.on('periodopagoexportarseleccionado', function (record) {
            if (vista.objListarPeriodosPagos.modoview == 2) {
                vista.objListarPeriodosPagos.btnAddGridExportarVarios.disable();
                vista.objListarPeriodosPagos.btnDelGridExportarVarios.enable();
                vista.recordperiodopagoexportarseleccionado = record;
            }
        });

        modelo.stTipoPago.on('beforeload', function () {
            modelo.stTipoPago.removeAll();
            vista.cbTipoPago.disable();
        });

        modelo.stTipoPago.on('load', function () {
            vista.cbTipoPago.enable();
        });

        vista.cbTipoPago.on('select', function (combo, record, index) {
            //Validando si este periodo de pago tiene referecias por periodos especificos con otras nomina
            Ext.Ajax.request({
                url: 'validarReferenciasPeriodosPago',
                method: 'POST',
                params: {
                    idtipopago: vista.cbTipoPago.getValue(),
                    identidad: variables.identidad
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    //Si hay tipos de pagos referenciados por periodos
                    variables.arrtipospagoref = respuesta['tipospago'];
                    variables.arrdenomtipospagoref = respuesta['denominacion'];
                    //Si el tipo de pago tiene periodos de referencias
                    if (respuesta['tipospago'].length > 0) {
                        vista.btnAdicionarPeriodosReferenciados.enable();
                        vista.pPeriodospagoReferenciados.enable();
                        vista.objListarPeriodosPagos.cargarComboTiposPagoEspecificos(respuesta['tipospago']);
                    } else {
                        vista.btnAdicionarPeriodosReferenciados.disable();
                        vista.pPeriodospagoReferenciados.disable();
                        modelo.stPeriodosPagoReferenciados.removeAll();
                    }
                    modelo.CargarPeriodosPago(variables.identidad, variables.idtipopago, variables.modopago);
                }.createDelegate(this)
            });
            modelo.stPeriodosPago.removeAll();
            var cm = vista.gpPeriodosPagos.getColumnModel();
            if (record.data.modopago == 1) {
                cm.setHidden(9, false);
                cm.setHidden(11, true);
                vista.cbMes.disable();
                vista.dfFInicioPeriodo.enable();
                vista.dfFFinPeriodo.enable();
            } else if (record.data.modopago == 2) {
                cm.setHidden(9, true);
                cm.setHidden(11, false);
                vista.cbMes.enable();
                vista.dfFInicioPeriodo.disable();
                vista.dfFFinPeriodo.disable();
            }

            vista.btnAdicionarPeriodo.enable();
            vista.btnModificarPeriodo.disable();
            vista.btnEliminarPeriodo.disable();

            variables.idtipopago = record.data.idtipopago;
            variables.modopago = record.data.modopago;
            variables.tipopago = record;
            variables.modoseleccionpersonas = record.data.modoseleccionpersonas;
            modelo.stPersonasPeriodosPago.removeAll();
            modelo.stCargos.removeAll();
            modelo.stVariablesPersona.removeAll();
            vista.gpPersonasPeriodosPagos.disable();
            vista.gpCargos.disable();
            vista.gpVariablesPersonas.disable();
            //vista.gpConfigPeriodosPagos.getSelectionModel().clearSelections();

        });

        this.limpiarFormPeriodoPago = function () {
            vista.cbPeriodoPago.setValue('');
            vista.cbMes.setValue('');
            vista.dfFechaPago.setValue('');
            vista.dfFInicioPeriodo.setValue('');
            vista.dfFFinPeriodo.setValue('');
        }

        this.mostrarVentanaPeriodosPago = function (accion) {
            var titulo = 'Adicionar per&iacute;odo de pago';
            this.limpiarFormPeriodoPago();

            vista.btnAplicarPeriodo.setVisible(true);
            vista.cbPeriodoPago.enable();

            if (accion == 'ADD') {
                titulo = 'Adicionar per&iacute;odo de pago';
                if (variables.modopago == 2) {
                    var mes = new Date().format('m');
                    var indpp = modelo.stPeriodoPago.find('esmensual', '1');
                    if (indpp != -1) {
                        var rc = modelo.stPeriodoPago.getAt(indpp);
                        vista.cbPeriodoPago.setValue(rc.data.idperiodopago);
                        vista.cbPeriodoPago.disable();
                    }
                    vista.cbMes.setValue(mes);
                } else {
                    vista.cbPeriodoPago.enable();
                }
            } else {
                titulo = 'Modificar per&iacute;odo de pago';
                vista.btnAplicarPeriodo.setVisible(false);

                if (variables.modopago == 2) {
                    vista.cbPeriodoPago.disable();
                }
                vista.cbPeriodoPago.setValue(variables.periodopagogrid.data.idperiodopago);
                vista.dfFechaPago.setValue(variables.periodopagogrid.data.fechapago);
                vista.dfFInicioPeriodo.setValue(variables.periodopagogrid.data.fechainicioperiodo);
                vista.dfFFinPeriodo.setValue(variables.periodopagogrid.data.fechafinperiodo);
            }
            vista.winPeriodo.setTitle(titulo);
            vista.winPeriodo.show();
        }

        vista.cbPeriodoPago.on('select', function (combo, record, index) {
            variables.periodopagocombo = record;
            modelo.stConfigPeriodosPago.load({
                params: {
                    idperiodopago: record.id,
                    idtipopago: variables.idtipopago,
                    identidad: variables.identidad
                }
            });
            vista.winConfigPeriodosPago.show();
        });

        vista.btnAdicionarPeriodo.setHandler(function () {
            variables.accion = 'ADD';
            this.mostrarVentanaPeriodosPago(variables.accion);
        }.createDelegate(this));

        vista.btnModificarPeriodo.setHandler(function () {
            if (variables.estado == 1) {
                variables.accion = 'MOD';
                this.mostrarVentanaPeriodosPago(variables.accion);
            } else {
                mostrarMensaje(1, 'No se puede modificar un per&iacute;odo de pago concluido.');
            }
        }.createDelegate(this));

        vista.btnEliminarPeriodo.setHandler(function () {
            if (variables.estado == 1) {
                variables.accion = 'DEL';
                mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar el per&iacute;odo de pago seleccionado?', function (btn) {
                    if (btn == "ok") {
                        ADDMODDELPeriodoPagos(variables.accion, 'ACEPTAR');
                    }
                }.createDelegate(this));
            } else {
                mostrarMensaje(1, 'No se puede eliminar un per&iacute;odo de pago concluido.');
            }
        }.createDelegate(this));

        this.ConcluirPeriodoPago = function (idelaborarpagos) {
            Ext.Ajax.request({
                url: 'concluirperiodopago',
                method: 'POST',
                params: {
                    idelaborarpagos: idelaborarpagos,
                    identidad: variables.identidad,
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codigo == 'OK') {
                        var msg = 'El per&iacute;odo de pago concluy&oacute; satisfactoriamente.';
                        mostrarMensaje(1, msg);
                        modelo.CargarPeriodosPago(variables.identidad, variables.idtipopago, variables.modopago);
                        vista.btnModificarPeriodo.disable();
                        vista.btnEliminarPeriodo.disable();
                        vista.btnConcluirPeriodo.disable();
                        modelo.CargarPersonasElaborarPago(0, 0, 0, 2);
                        vista.gpPersonasPeriodosPagos.disable();
                        vista.gpCargos.disable();
                    } else {
                        var msg = 'Por favor apruebe las n&oacute;minas.';
                        mostrarMensaje(3, msg);
                    }

                }
            });
        };

        vista.btnConcluirPeriodo.setHandler(function () {
            if (variables.estado == 1) {
                variables.accion = 'DEL';
                mostrarMensaje(2, '¿Est&aacute; seguro que desea <b>concluir</b> el per&iacute;odo de pago seleccionado?', function (btn) {
                    if (btn == "ok") {
                        this.ConcluirPeriodoPago(variables.periodopagogrid.data.idelaborarpagos);
                    }
                }.createDelegate(this));
            } else {
                mostrarMensaje(1, 'Solo se puede concluir un per&iacute;odo de pago en elaboraci&oacute;n.');
            }
        }.createDelegate(this));

        vista.btnAceptarPeriodo.setHandler(function () {
            ADDMODDELPeriodoPagos(variables.accion, 'ACEPTAR');
        }.createDelegate(this));

        vista.btnAplicarPeriodo.setHandler(function () {
            //vista.fpPeriodosPago..getForm().reset();
            ADDMODDELPeriodoPagos(variables.accion, 'APLICAR');
        }.createDelegate(this));

        vista.btnCancelarPeriodo.setHandler(function () {
            vista.winPeriodo.hide();
        });

        vista.btnAdicionarPersona.setHandler(function () {
            if (variables.estado == 1) {
                var datos = {
                    idelaborarpagos: -1,
                    identidad: -1,
                    modoseleccionpersonas: -1,
                    arrpersonas: null,
                    idreportescertificaciones: null,
                    arridpersonaelaborarpagos: new Array()
                }

                if (variables.modoseleccionpersonas != 2) {
                    datos.idelaborarpagos = variables.periodopagogrid.data.idelaborarpagos;
                    datos.identidad = variables.identidad;
                    datos.modoseleccionpersonas = variables.modoseleccionpersonas;
                    datos.arrpersonas = null;
                    ADDDELPersonasPeriodoPagos('ADD', datos);
                } else {
                    vista.winSelecFuentePersona.show();
                }
            } else {
                mostrarMensaje(1, 'No puede adicionar personas de un per&iacute;odo de pago concluido.');
            }
        }.createDelegate(this));

        vista.btnExcluirPersona.setHandler(function () {
            if (variables.estado == 1) {
                if (vista.smPersonasPeriodosPagos.hasSelection()) {
                    vista.cbCausaExclusion.setValue(variables.personasperiodospagos.data.idcausaexclusion);
                    vista.winCausaExclusion.show();
                } else {
                    mostrarMensaje(1, 'Debe seleccionar una persona.');
                }
            } else {
                mostrarMensaje(1, 'No puede excluir personas de un per&iacute;odo de pago concluido.');
            }
        });

        //Incluir persona a la nomina
        vista.btnIncluirPersona.setHandler(function () {

            modelo.stPersonasExcluidas.load({params: {idelaborarpagos: variables.periodopagogrid.data.idelaborarpagos}});
            vista.winIncluirPersona.show();

        });

        vista.btnCancelarIncluirPersona.setHandler(function () {

            vista.winIncluirPersona.hide();

        });

        vista.gpPersonasExcluidas.getSelectionModel().on('selectionchange', function (sm, index, record) {

            vista.filasSeleccionadas = sm.getSelections();

            var seleccion = vista.gpPersonasExcluidas.getSelectionModel().getSelections();

            if (seleccion.length > 0) {
                vista.btnAceptarIncluirPersona.enable();
            }
            else {
                vista.btnAceptarIncluirPersona.disable();
            }
        });

        vista.btnAceptarIncluirPersona.setHandler(function () {

            var seleccion = vista.gpPersonasExcluidas.getSelectionModel().getSelections();


            var a = new Array();
            for (var i = 0; i < seleccion.length; i++) {
                a.push(seleccion[i].data.idpersonaelaborarpagos);
            }

            Ext.Ajax.request({
                url: 'incluirpersonanomina',
                method: 'POST',
                params: {
                    arreglo: Ext.encode(a)

                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codigo == 'INCLUIDOS') {
                        var msg = 'La(s) persona(s) ha(n) sido incluida(s) en la n&oacute;mina satisfactoriamente.';
                        mostrarMensaje(1, msg);
                    }
                    vista.winIncluirPersona.hide();
                    //modelo.stPersonasPeriodosPago.removeAll();
                    modelo.stPersonasPeriodosPago.load();
                    //vista.gpPersonasExcluidas.load();
                }
            });
        });

        modelo.stPersonasPeriodosPago.on('load', function (st, rec) {
            var excluidos = 0;
            Ext.each(rec, function (v) {
                if (v.data.excluido == 1) {
                    excluidos = 1;
                }
            });
            if (excluidos == 1) {
                vista.btnIncluirPersona.enable();
            } else {
                vista.btnIncluirPersona.disable();
            }
        });

        vista.btnEliminarPersona.setHandler(function () {
            if (variables.estado == 1) {
                if (vista.smPersonasPeriodosPagos.hasSelection()) {
                    var a = ObtenerPersonasSeleccionadasExcluirEliminar();
                    var genero = (a.length > 1) ? 'las personas seleccionadas' : 'la persona seleccionada';
                    var msg = '¿Est&aacute; seguro que desea <b>eliminar</b> ' + genero + ' del per&iacute;odo de pago?';
                    mostrarMensaje(2, msg, function (btn) {
                        if (btn == "ok") {
                            var datos = {
                                idelaborarpagos: -1,
                                identidad: -1,
                                modoseleccionpersonas: -1,
                                arrpersonas: null,
                                idreportescertificaciones: null,
                                arridpersonaelaborarpagos: new Array()
                            };
                            datos.arridpersonaelaborarpagos = ObtenerPersonasSeleccionadasExcluirEliminar();
                            ADDDELPersonasPeriodoPagos('DEL', datos);
                        }
                    }.createDelegate(this));
                } else {
                    mostrarMensaje(1, 'Debe seleccionar una persona.');
                }
            } else {
                mostrarMensaje(1, 'No puede eliminar personas de un per&iacute;odo de pago concluido.');
            }
        }.createDelegate(this));

        function ObtenerPersonasSeleccionadasExcluirEliminar() {
            var seleccion = vista.smPersonasPeriodosPagos.getSelections();
            var a = new Array();
            for (var i = 0; i < seleccion.length; i++) {
                a.push(seleccion[i].data.idpersonaelaborarpagos);
            }
            return a;
        }

        vista.btnAceptarCausaExclusion.setHandler(function () {
            if (vista.fpCausaExclusion.getForm().isValid()) {
                var a = ObtenerPersonasSeleccionadasExcluirEliminar();
                Ext.Ajax.request({
                    url: 'excluirdenomina',
                    method: 'POST',
                    params: {
                        arridpersonaelaborarpagos: Ext.encode(a),
                        idcausaexclusion: vista.cbCausaExclusion.getValue(),
                        excluir: 1
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);
                        if (respuesta.codigo == 'EXCLUIDOS') {
                            var msg = (a.length > 1 ? 'Las personas han sido excluidas de la n&oacute;mina satisfactoriamente.' : 'La persona ha sido excluida de la n&oacute;mina satisfactoriamente.');
                            mostrarMensaje(1, msg);
                        }
                        vista.winCausaExclusion.hide();
                        modelo.CargarPersonasElaborarPago(variables.periodopagogrid.data.idelaborarpagos, variables.identidad, variables.modoseleccionpersonas);
                        modelo.stPersonasPeriodosPago.load();
                        vista.gpCargos.disable();
                        vista.btnExcluirPersona.disable();
                        vista.btnEliminarPersona.disable();

                    }
                });
            }
        }.createDelegate(this));

        this.btnAceptarBuscarPersona = new Ext.Button({
            id: 'btnAceptarBuscarPersona',
            iconCls: 'aceptar',
            text: 'Aceptar',
            disabled: true,
            tooltip: 'Aceptar',
            handler: function () {
                var arrPerSelec = this.objbuscarpersona.getSelectedRows();
                var datos = {
                    idelaborarpagos: -1,
                    identidad: -1,
                    modoseleccionpersonas: -1,
                    arrpersonas: null,
                    idreportescertificaciones: null
                }
                datos.idelaborarpagos = variables.periodopagogrid.data.idelaborarpagos;
                datos.identidad = variables.identidad;
                datos.modoseleccionpersonas = variables.modoseleccionpersonas;
                datos.arrpersonas = new Array();
                for (var i = 0; i < arrPerSelec.length; i++) {
                    datos.arrpersonas.push(arrPerSelec[i].data.idpersona);
                }
                ADDDELPersonasPeriodoPagos('ADD', datos);

                this.winBuscarPersona.hide();
            }.createDelegate(this)
        });

        this.objbuscarpersona = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            heigth: '50%',
            width: '100%',
            region: 'center',
            modulo: 'NOMINA',
            singleSelect: false,
            funcionalidad: 'CESP',
            identidad: variables.identidad,
            cantidadPorPaginas: 5000
        });

        this.objbuscarpersona.on('personaselecionada', function (sel) {
            this.btnAceptarBuscarPersona.enable();
        }.createDelegate(this));

        this.winBuscarPersona = new Ext.Window({
            title: 'Buscar personas',
            modal: true,
            height: 400,
            width: 600,
            constrain: true,
            resizable: false,
            layout: 'border',
            closeAction: 'hide',
            items: [this.objbuscarpersona],
            buttons: [this.btnAceptarBuscarPersona]
        });

        this.btnAceptarListarReportesCertificaciones = new Ext.Button({
            id: 'btnAceptarListarReportesCertificaciones',
            iconCls: 'aceptar',
            text: 'Aceptar',
            disabled: true,
            tooltip: 'Aceptar',
            handler: function () {
                var arrPerSelec = this.objlistarreportescertificaciones.getSelectedRows();
                var datos = {
                    idelaborarpagos: -1,
                    identidad: -1,
                    modoseleccionpersonas: -1,
                    arrpersonas: null,
                    idreportescertificaciones: null
                }
                datos.idelaborarpagos = variables.periodopagogrid.data.idelaborarpagos;
                datos.identidad = variables.identidad;
                datos.modoseleccionpersonas = variables.modoseleccionpersonas;
                datos.idreportescertificaciones = arrPerSelec[0].data.idreportescertificaciones;
                datos.arrpersonas = new Array();
                ;
                for (var i = 0; i < arrPerSelec.length; i++) {
                    datos.arrpersonas.push(arrPerSelec[i].data.idelemento);
                }
                ADDDELPersonasPeriodoPagos('ADD', datos);

                this.winListarReportesCertificaciones.hide();
            }.createDelegate(this)
        });

        this.objlistarreportescertificaciones = new Pvd.Nomina.ReportesyCertificaciones.panelListarReportesCertificacionesPersonasComp({
            modoVisualizacion: 1,
            modoMostrar: 1

        });

        this.objlistarreportescertificaciones.on('personareporteycertificacionseleccionado', function (fila) {
            this.btnAceptarListarReportesCertificaciones.enable();
        }.createDelegate(this));

        this.winListarReportesCertificaciones = new Ext.Window({
            title: 'Reportes y certificaciones',
            modal: true,
            height: 400,
            width: 600,
            constrain: true,
            resizable: false,
            layout: 'border',
            closeAction: 'hide',
            items: [this.objlistarreportescertificaciones],
            buttons: [this.btnAceptarListarReportesCertificaciones]
        });

        vista.rbEntidad.on('check', function (Checkbox, checked) {
            variables.fuente = (checked ? 1 : 2);
        });

        vista.rbReporte.on('check', function (Checkbox, checked) {
            variables.fuente = (checked ? 2 : 1);
        });

        vista.tfbuscar.on('specialkey', function (t, e) {
            if (e.keyCode == 13) {
                Buscador(t.getValue());
            }
        }, this)

        vista.btnBuscar.setHandler(function () {
            Buscador(vista.tfbuscar.getValue());
        }.createDelegate(this));

        vista.btnAceptarFuentePersona.setHandler(function () {
            vista.winSelecFuentePersona.hide();
            if (variables.fuente == 1) {
                this.objbuscarpersona.CambiarEntidad(variables.identidad);
                this.objbuscarpersona.Buscar();
                this.winBuscarPersona.show();
            } else {
                this.objlistarreportescertificaciones.CambiarEntidad(variables.identidad);
                this.winListarReportesCertificaciones.show();
                this.objlistarreportescertificaciones.CargarReportesCertificaciones();
            }
        }.createDelegate(this));

        vista.btnEliminarPeriodosReferenciados.on('click', function () {
            var arrayelim = new Array();
            var arraysel = vista.gpPeriodosPagosReferenciados.getSelectionModel().getSelections();
            for (var i = 0; i < arraysel.length; i++) {
                arrayelim[i] = arraysel[i].data.idelaborarpagosreferencia;
            }
            console.info(arrayelim);
            mostrarMensaje(2, 'Est&aacute; seguro que desea eliminar los per&iacute;odos de las referencias de n&oacute;minas', function (btn) {
                if (btn == 'ok') {
                    PVD.mostrarMascara('delperef', 'Por favor espere...', 'Eliminando datos');
                    //Validando si este periodo de pago tiene referecias por periodos especificos con otras nomina
                    Ext.Ajax.request({
                        url: 'eliminarReferenciasPeriodosPago',
                        method: 'POST',
                        params: {
                            arrayidelaborarpagosreferencia: Ext.encode(arrayelim)
                        },
                        callback: function (options, success, response) {
                            var respuesta = Ext.decode(response.responseText);
                            PVD.ocultarMascara('delperef');
                            modelo.stPeriodosPagoReferenciados.load({params: {idelaborarpago: variables.periodopagogrid.data.idelaborarpagos}});
                            vista.btnEliminarPeriodosReferenciados.disable();
                        }.createDelegate(this)
                    });
                }
            })
        });

        vista.gpPeriodosPagosReferenciados.getSelectionModel().on('rowselect', function (sm, index, record) {
            vista.btnEliminarPeriodosReferenciados.enable();
        });

        vista.gpPeriodosPagosReferenciados.getSelectionModel().on('rowdeselect', function (sm, index, record) {
            if (vista.gpPeriodosPagosReferenciados.getSelectionModel().hasSelection()) {
                vista.btnEliminarPeriodosReferenciados.enable();
            } else {
                vista.btnEliminarPeriodosReferenciados.disable();
            }

        });

        vista.gpPeriodosPagos.getSelectionModel().on('rowselect', function (sm, index, record) {
            variables.periodopagogrid = record;
            variables.estado = record.data.estado;
            if (variables.estado == 1) {
                vista.btnConcluirPeriodo.enable();
                vista.btnModificarPeriodo.enable();
                vista.btnEliminarPeriodo.enable();
                vista.btnAdicionarPersona.enable();
            } else {
                vista.btnConcluirPeriodo.disable();
                vista.btnModificarPeriodo.disable();
                vista.btnEliminarPeriodo.disable();
                vista.btnAdicionarPersona.disable();
                vista.btnIncluirPersona.disable();
            }
            vista.gpPersonasPeriodosPagos.enable();
            vista.gpVariablesPersonas.disable();
            modelo.stVariablesPersona.removeAll();
            vista.gpCargos.disable();
            modelo.stCargos.removeAll();
            modelo.CargarPersonasElaborarPago(variables.periodopagogrid.data.idelaborarpagos, variables.identidad, variables.modoseleccionpersonas, 1);
            vista.btnEliminarPersona.disable();
            vista.btnExcluirPersona.disable();
            //Si el tipo de pago tiene periodos de referencias
            if (variables.arrtipospagoref.length > 0) {
                modelo.stPeriodosPagoReferenciados.load({params: {idelaborarpago: variables.periodopagogrid.data.idelaborarpagos}});
                mostrarMensaje(2, 'Por favor adicione los periodos de pago que seran refenciados en las nominas de los tipos de pago: <b>' + variables.arrdenomtipospagoref + '</b>');
            } else {
                modelo.stPeriodosPagoReferenciados.removeAll();
            }
        });

        vista.gpPersonasPeriodosPagos.getSelectionModel().on('rowselect', function (sm, index, record) {
            vista.filasSeleccionadas = sm.getSelections();
            vista.pfichadelapersona.mostrarFicha(record.data.idpersona);
            variables.personasperiodospagos = record;
            if (variables.estado == 1) {
                vista.btnEliminarPersona.enable();
                vista.btnExcluirPersona.enable();
            } else {
                vista.btnEliminarPersona.disable();
                vista.btnExcluirPersona.disable();
                vista.btnAdicionarPersona.disable();
            }
            if (record.data.excluido != 1) {
                vista.gpVariablesPersonas.disable();
                modelo.stVariablesPersona.removeAll();
                vista.gpCargos.enable();
                modelo.CargarCargosOcupadosPersona(variables.identidad, variables.personasperiodospagos.data.idpersona, variables.periodopagogrid.data.idperiodopago, record.data.idpersonaelaborarpagos);
            } else {
                //vista.btnIncluirPersona.enable();
                vista.gpVariablesPersonas.disable();
            }
        });

        vista.gpCargos.getSelectionModel().on('rowselect', function (sm, index, record) {
            variables.cargosocupados = record;
            VerificarVariablesPersona(variables.tipopago.data.idtipopago, variables.tipopago.data.sedesglosa, variables.periodopagogrid.data.idperiodopago, record.data.idcargosocupados);
        }.createDelegate(this));

        function CargarDatosPeriodosPago(accion) {
            if (accion == 'ADD') {
                variables.idelaborarpagos = null;
                variables.idperiodopago = vista.cbPeriodoPago.getValue();
                variables.fechapago = vista.dfFechaPago.getValue().format('Y-m-d');
                if (variables.modopago == 2) {
                    variables.mesanyopago = new Date().format('Y') + '-' + vista.cbMes.getValue();
                    variables.mes = vista.cbMes.getValue();
                    variables.fechainicioperiodo = null;
                    variables.fechafinperiodo = null;
                }
                else {
                    variables.mesanyopago = null;
                    variables.fechainicioperiodo = vista.dfFInicioPeriodo.getValue().format('Y-m-d');
                    variables.fechafinperiodo = vista.dfFFinPeriodo.getValue().format('Y-m-d');
                }
            }
            else if (accion == 'MOD') {
                variables.idelaborarpagos = variables.periodopagogrid.data.idelaborarpagos;
                variables.idperiodopago = vista.cbPeriodoPago.getValue();
                variables.fechapago = vista.dfFechaPago.getValue().format('Y-m-d');
                if (variables.modopago == 2) {
                    variables.mesanyopago = new Date().format('Y') + '-' + vista.cbMes.getValue();
                    variables.fechainicioperiodo = null;
                    variables.fechafinperiodo = null;
                }
                else {
                    variables.mesanyopago = null;
                    variables.fechainicioperiodo = vista.dfFInicioPeriodo.getValue().format('Y-m-d');
                    variables.fechafinperiodo = vista.dfFFinPeriodo.getValue().format('Y-m-d');
                }
            }
            else if (accion == 'DEL') {
                variables.idelaborarpagos = variables.periodopagogrid.data.idelaborarpagos;
            }
        }

        function ADDMODDELPeriodoPagos(accion, boton) {
            var url = 'adicionarperiodopago';
            var msgEstado = 'No se puede modificar un per&iacute;odo de pago que ya est&aacute; concluido.';
            if (accion == 'ADD') {
                PVD.mostrarMascara('idmaskaddperiodo', 'Por favor espere...', 'Adicionando el per&iacute;odo de pago');
                url = 'adicionarperiodopago';
            } else if (accion == 'MOD') {
                PVD.mostrarMascara('idmaskaddperiodo', 'Por favor espere...', 'Modificando el per&iacute;odo de pago');
                url = 'modificarperiodopago';
                msgEstado = 'No se puede modificar un per&iacute;odo de pago que ya est&aacute; concluido.';
            }
            else if (accion == 'DEL') {
                PVD.mostrarMascara('idmaskdelperiodo', 'Por favor espere...', 'Eliminando el per&iacute;odo de pago');
                url = 'eliminarperiodopago';
                msgEstado = 'No se puede eliminar un per&iacute;odo de pago que ya est&aacute; concluido.';
            }

            if ((accion == 'MOD' || accion == 'DEL') && variables.periodopagogrid.data.estado == 2) {
                mostrarMensaje(1, msgEstado);
                return;
            }

            if (accion == 'MOD' || accion == 'DEL') {
                if (variables.periodopagogrid && variables.periodopagogrid.data.estado == 2) {
                    mostrarMensaje(3, 'El per&iacute;odo de pago est&aacute; concluido.');
                    return;
                }
            }

            CargarDatosPeriodosPago(accion);

            Ext.Ajax.request({
                url: url,
                timeout: 500000000000,
                method: 'POST',
                params: {
                    idelaborarpagos: variables.idelaborarpagos,
                    identidad: variables.identidad,
                    idperiodopago: variables.idperiodopago,
                    modoseleccionpersonas: variables.modoseleccionpersonas,

                    idtipopago: variables.idtipopago,
                    fechapago: variables.fechapago,
                    fechainicioperiodo: variables.fechainicioperiodo,
                    fechafinperiodo: variables.fechafinperiodo,
                    mesanyopago: variables.mesanyopago,
                    mes: variables.mes,
                    modopago: variables.modopago
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);

                    switch (respuesta.codigo) {
                        case 'NO-RANGO': {
                            PVD.ocultarMascara('idmaskaddperiodo');
                            mostrarMensaje(3, 'El per&iacute;odo de pago no se puede añadir ya que las fechas no se encuentran en el periodo de pago actual.');
                            vista.cbPeriodoPago.setValue('');
                            vista.cbMes.setValue('');
                            vista.dfFechaPago.setValue('');
                            vista.dfFInicioPeriodo.setValue('');
                            vista.dfFFinPeriodo.setValue('');
                            //vista.winPeriodo.hide();
                            break;
                        }
                        case 'NO-APERTURADO': {
                            PVD.ocultarMascara('idmaskaddperiodo');
                            mostrarMensaje(3, 'El per&iacute;odo de pago no se puede añadir ya que no existen operaciones contables.');
                            vista.cbPeriodoPago.setValue('');
                            vista.cbMes.setValue('');
                            vista.dfFechaPago.setValue('');
                            vista.dfFInicioPeriodo.setValue('');
                            vista.dfFFinPeriodo.setValue('');
                            //vista.winPeriodo.hide();
                            break;
                        }
                        case 'PER-ABIERTOS': {
                            PVD.ocultarMascara('idmaskaddperiodo');
                            mostrarMensaje(3, 'El per&iacute;odo de pago no se puede añadir ya existen per&iacute;odos abiertos.');
                            vista.cbPeriodoPago.setValue('');
                            vista.cbMes.setValue('');
                            vista.dfFechaPago.setValue('');
                            vista.dfFInicioPeriodo.setValue('');
                            vista.dfFFinPeriodo.setValue('');
                            //vista.winPeriodo.hide();
                            break;
                        }
                        case 'EXISTE': {
                            PVD.ocultarMascara('idmaskaddperiodo');
                            mostrarMensaje(3, 'El per&iacute;odo de pago ya existe para este tipo de pago.');
                            break;
                        }
                        case 'NO-EXISTE-CONFIGURACION': {
                            PVD.ocultarMascara('idmaskaddperiodo');
                            mostrarMensaje(3, 'EL  per&iacute;odo de pago no es v&aacute;lido. Por favor configure el rango de fechas en <b>Configurar per&iacute;odos de pagos.</b>');
                            break;
                        }
                        case 'NO-COINCIDENCIA-FECHAS': {
                            PVD.ocultarMascara('idmaskaddperiodo');
                            mostrarMensaje(3, 'Las fechas especificadas no coinciden con las fechas de la configuraci&oacute;n del periodo de pago.');
                            break;
                        }
                        case 'NO-DEPENDENCIAS': {
                            PVD.ocultarMascara('idmaskaddperiodo');
                            var part = (respuesta.cantdependencias > 1) ? 'los tipos' : 'el tipo';
                            mostrarMensaje(3, 'No existe un  per&iacute;odo de pago con el mismo rango de fechas para ' + part + ' de pago <b>' + respuesta.dependencias + '</b>.');
                            break;
                        }
                        case 'NO-FECHA-PAGO-ADELANTADA': {
                            PVD.ocultarMascara('idmaskaddperiodo');
                            mostrarMensaje(3, 'La <b>fecha de pago</b> debe estar incluida en el <b>rango de fechas</b> del per&iacute;odo, para este tipo de pago.');
                            break;
                        }
                        case 'NO-FECHA-PAGO-VENCIDO': {
                            PVD.ocultarMascara('idmaskaddperiodo');
                            mostrarMensaje(3, 'La <b>fecha de pago</b> debe ser posterior a la <b>fecha fin</b> del per&iacute;odo, para este tipo de pago.');
                            break;
                        }
                        case 'PERIODO-EN-USO': {
                            PVD.ocultarMascara('idmaskdelperiodo');
                            mostrarMensaje(3, 'EL  per&iacute;odo de pago no se puede eliminar debido a que las n&oacute;minas, correspondientes al mismo, est&aacute;n  <b>' + respuesta.estadonomina + '.</b>');
                            break;
                        }
                        case 'ADD-1': {
                            PVD.ocultarMascara('idmaskaddperiodo');
                            mostrarMensaje(1, 'El per&iacute;odo de pago se adicion&oacute; satisfactoriamente.');
                            break;
                        }
                        case 'MOD-1': {
                            PVD.ocultarMascara('idmaskaddperiodo');
                            mostrarMensaje(1, 'El per&iacute;odo de pago se modific&oacute; satisfactoriamente.');
                            break;
                        }
                        case 'DEL-1': {
                            PVD.ocultarMascara('idmaskdelperiodo');
                            mostrarMensaje(1, 'El per&iacute;odo de pago se elimin&oacute; satisfactoriamente.');
                            break;
                        }
                    }


                    if (boton == 'APLICAR' && accion == 'ADD') {
                        _this.limpiarFormPeriodoPago();
                    } else if (boton == 'ACEPTAR' && accion != 'DEL') {
                        if(boton != 'APLICAR') {
                            vista.winPeriodo.hide();
                        }
                    }


                    if (accion == 'MOD' || accion == 'DEL') {
                        vista.btnModificarPeriodo.disable();
                        vista.btnEliminarPeriodo.disable();
                    }

                    modelo.stPersonasPeriodosPago.reload();
                    vista.btnConcluirPeriodo.disable();
                    vista.gpPersonasPeriodosPagos.disable();
                    vista.gpCargos.disable();
                    modelo.CargarPeriodosPago(variables.identidad, variables.idtipopago, variables.modopago);

                }.createDelegate(this)
            });

        }

        function ADDDELPersonasPeriodoPagos(accion, datos) {
            if (accion == 'ADD')
                url = 'adicionarpersonasperiodopago';
            else if (accion == 'DEL') {
                url = 'eliminarpersonasperiodopago';
            }

            var a = ObtenerPersonasSeleccionadasExcluirEliminar();
            if (accion == 'ADD') {
                PVD.mostrarMascara('idmaskaddpersona', 'Por favor espere...', 'Adicionando los datos de las personas');
            }
            else if (accion == 'DEL') {
                PVD.mostrarMascara('idmaskdelpersona', 'Por favor espere...', 'Eliminando los datos de las personas');
            }
            Ext.Ajax.request({
                url: url,
                timeout: 500000000000,
                method: 'POST',
                params: {
                    idelaborarpagos: datos.idelaborarpagos,
                    modoseleccionpersonas: datos.modoseleccionpersonas,
                    identidad: datos.identidad,
                    arrpersonas: Ext.encode(datos.arrpersonas),
                    idreportescertificaciones: datos.idreportescertificaciones,
                    arridpersonaelaborarpagos: Ext.encode(a),
                    idperiodopago: variables.periodopagogrid.data.idperiodopago
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (accion == 'ADD')
                        PVD.ocultarMascara('idmaskaddpersona');
                    else if (accion == 'DEL') {
                        PVD.ocultarMascara('idmaskdelpersona');
                    }
                    if (respuesta.codigo == 'ADD-1') {
                        var msg = (a.length > 1 ? 'Las personas han sido adicionadas satisfactoriamente.' : 'La persona ha sido adicionada satisfactoriamente.');
                        mostrarMensaje(1, msg, function () {
                            modelo.CargarPersonasElaborarPago(variables.periodopagogrid.data.idelaborarpagos, variables.identidad, variables.modoseleccionpersonas, 1);
                        });

                    } else if (respuesta.codigo == 'DEL-1') {
                        var msg = (a.length > 1 ? 'Las personas han sido eliminadas satisfactoriamente.' : 'La persona ha sido eliminada satisfactoriamente.');
                        mostrarMensaje(1, msg, function () {
                            modelo.CargarPersonasElaborarPago(variables.periodopagogrid.data.idelaborarpagos, variables.identidad, variables.modoseleccionpersonas, 1);
                        });
                    } else if (respuesta.codigo == 'NO-DEPENDENCIAS') {
                        var part = (respuesta.cantdependencias > 1) ? 'los tipos' : 'el tipo';
                        mostrarMensaje(3, 'No existe un  per&iacute;odo de pago con el mismo rango de fechas para ' + part + ' de pago <b>' + respuesta.dependencias + '</b>.');
                    }
                    vista.gpCargos.disable();
                    vista.btnExcluirPersona.disable();
                    vista.btnEliminarPersona.disable();
                }.createDelegate(this)
            });
        }

        function VerificarVariablesPersona(idtipopago, sedesglosa, idperiodopago, idcargosocupados) {
            Ext.Ajax.request({
                url: 'verificarvariablespersona',
                method: 'POST',
                params: {
                    identidad: variables.identidad,
                    idtipopago: idtipopago,
                    sedesglosa: sedesglosa,
                    idcargosocupados: idcargosocupados,
                    idperiodopago: idperiodopago,
                    idpersonaelaborarpagos: variables.personasperiodospagos.data.idpersonaelaborarpagos
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codigo == 'NOCONCEPTOSPD') {
                        mostrarMensaje(3, 'La persona no tiene conceptos de percepci&oacute;n y descuento configurados.');
                        return;
                    }
                    if (respuesta.codigo == 'NOSISTEMAPAGO') {
                        mostrarMensaje(3, 'La persona no tiene un sistema de pago configurado.');
                        return;
                    }

                    vista.gpVariablesPersonas.enable();
                    modelo.CargarVariablesPersona(variables.personasperiodospagos.data.idpersonaelaborarpagos, idcargosocupados);
                }
            });
        }

        vista.btnGuardarVariables.setHandler(function () {
            if (variables.estado == 1) {
                var m = modelo.stVariablesPersona.getModifiedRecords();
                if (m.length > 0) {
                    var a = new Array();
                    for (var i = 0; i < m.length; i++) {
                        var v = {
                            idvariablespersonaelaborarpagos: m[i].data.idvariablespersonaelaborarpagos,
                            valor: m[i].data.valor
                        };

                        a.push(v);
                    }
                    GuardarVariablesPersona(a);
                }
            } else {
                mostrarMensaje(1, 'El per&iacute;odo de pago est&aacute; concluido.');
            }
        }.createDelegate(this));

        function GuardarVariablesPersona(arrvariablesvalor) {
            Ext.Ajax.request({
                url: 'guardarvariablespersona',
                method: 'POST',
                params: {
                    arrvariablesvalor: Ext.encode(arrvariablesvalor),
                    idpersonaelaborarpagos: variables.personasperiodospagos.data.idpersonaelaborarpagos,
                    idcargosocupados: variables.cargosocupados.data.idcargosocupados
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codigo == 'GUARDO') {
                        mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente.');
                    }
                }
            });
        }

        function Buscador(txt) {
            if (txt != '') {
                if (vista.tfbuscar.isValid()) {
                    modelo.stPersonasPeriodosPago.baseParams.critbusq = txt;
                    modelo.stPersonasPeriodosPago.load(
                        {
                            params: {
                                limit: 15,
                                start: 0
                            },
                            callback: function (r, options, success) {
                                if (r.length == 0) {
                                    mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                                }
                            }
                        });
                }
            } else {
                modelo.stPersonasPeriodosPago.baseParams.critbusq = '';
                modelo.stPersonasPeriodosPago.load({
                    params: {limit: 15, start: 0},
                    callback: function (r, options, success) {
                        if (r.length == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                        }
                    }
                });
            }
        }

        //Config periodos de pagos
        //Store del grid
        var fechainiciopp = null;
        var fechafinpp = null;
        vista.gpConfigPeriodosPagos.getSelectionModel().on('rowselect', function (sm, index, record) {
            vista.btnAceptarConfigPeriodos.enable();
            fechainiciopp = record.data.fechainicioperiodo;
            fechafinpp = record.data.fechafinperiodo;
        });

        vista.gpConfigPeriodosPagos.getSelectionModel().on('rowdeselect', function () {
            vista.btnAceptarConfigPeriodos.disable();
            fechainiciopp = "";
            fechafinpp = "";
        });

        //Botones
        vista.btnCancelarConfigPeriodos.setHandler(function () {
            vista.winConfigPeriodosPago.hide();
            vista.dfFInicioPeriodo.setValue("");
            vista.dfFFinPeriodo.setValue("");
        });

        vista.btnAceptarConfigPeriodos.setHandler(function () {
            vista.winConfigPeriodosPago.hide();
            vista.dfFInicioPeriodo.setValue(fechainiciopp);
            vista.dfFFinPeriodo.setValue(fechafinpp);
        });

    }
}
