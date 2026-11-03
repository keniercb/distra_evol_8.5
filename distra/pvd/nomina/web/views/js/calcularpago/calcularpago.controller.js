Ext.ns('Pvd.Nomina.CalculoPagoResultado');
Pvd.Nomina.CalculoPagoResultado.Controlador = {
    areasmontos: new Array(),
    init: function (vista, modelo) {
        var scope = this;
        this.vista = vista;
        this.modelo = modelo;
        this.variables = {};
        this.pagoxresultadosdestajo = 1;
        this.addmoddestajo = 'ADD';
        //this.variables.idestructura = perfil.idestructura
        //
        // comun;
        this.variables.idestructura;
        this.variables.referencia = '';
        this.variables.composicionn = 1;
        this.variables.denominacionentidad = perfil.denomestructuracomun;
        var finicio = '';
        var ffin = '';
        vista.panelestructura.on('checkchange', function (node, check) {
            if (check) {
                scope.variables.denominacionentidad = node.text;
                var arrayCheck = vista.panelestructura.getChecked();
                Ext.each(arrayCheck, function (valnode) {
                    if (valnode.id != node.id)
                        valnode.ui.toggleCheck(false);
                });
                scope.variables.idestructura = node.id;
                modelo.stPagosResultados.baseParams.identidad = scope.variables.idestructura;
                modelo.stPagosResultados.baseParams.tipo = 1;
                modelo.stPagosResultados.baseParams.idpagoporresultado = -1;
                modelo.stPagosResultados.reload();

            } else {
                //estructuras = perfil.idestructuracomun;
                scope.variables.idestructura = -1;
                modelo.stPagosResultados.removeAll();
                vista.panelDerecho.stPeriodosPagoExportar.removeAll();
            }
        });

        /*Eventos para ir alante o atras en el Wizard*/
        vista.BtnCalcular.on('click', function () {
            scope.calcularPago(finicio, ffin, 1, null, this.pagoxresultadosdestajo);
            vista.BtnAnterior.enable();
            vista.Btnsiguiente.setDisabled(true);
            vista.BtnGuardar.setVisible(true);
        }.createDelegate(this));

        this.vista.segundoPanel.btnReCalcular.enable();

        this.vista.segundoPanel.btnReCalcular.on('click', function () {
            Ext.each(scope.areasmontos, function (area) {
                area.data.monto = 0;
            });
            modelo.stPlantillaNAreas.removeAll();
            modelo.stPlantillaNAreas.add(scope.areasmontos);
            vista.winMontosAreasRecalcular.show();
        });

        this.vista.segundoPanel.btnExportar.on('click', function () {
            exportarResultadoCalculo();
        });

        function exportarResultadoCalculo() {
            // PVD.mostrarMascara('idmaskexportarrescalculo', 'Por favor espere...', 'Guardando datos');
            window.open(document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/calcularpago/exportarResultadoCalculo?' +
                'identidad=' + scope.variables.idestructura +
                '&idpagoporresultado=' + scope.vista.gridPagosResultados.getSelectionModel().getSelected().data.idpagoporresultado +
                '&referencia=' + scope.variables.referencia);

            Ext.Ajax.request({
                url: 'exportarResultadoCalculo',
                method: 'POST',
                params: {
                    identidad: scope.variables.idestructura,
                    idpagoresultado: scope.vista.gridPagosResultados.getSelectionModel().getSelected().data.idpagoporresultado,
                    referencia: scope.variables.referencia
                },
                callback: function (options, success, response) {
                    //  PVD.ocultarMascara('idmaskexportarrescalculo');
                }.createDelegate(this)
            });
        }

        vista.btnAceptarMontosAreas.on('click', function () {
            //console.info(vista.gpAreasRecalculo.store.data);
            var rmontosareas = new Array();
            Ext.each(vista.gpAreasRecalculo.store.data.items, function (item) {
                var area = {};
                if (item.data.monto > 0) {
                    area.idarea = item.data.idarea;
                    area.monto = item.data.monto;
                    rmontosareas.push(area);
                }
            });
            scope.calcularPago(finicio, ffin, 2, rmontosareas, this.pagoxresultadosdestajo);
            vista.winMontosAreasRecalcular.hide();
        }.createDelegate(this));

        vista.BtnAnterior.on('click', function () {
            var layout = vista.panelPrincipal.getLayout();
            layout.setActiveItem(0);
            vista.BtnAnterior.setDisabled(true);
            vista.Btnsiguiente.setDisabled(false);
            vista.BtnGuardar.setVisible(false);
        });

        vista.Btnsiguiente.on('click', function () {
            var layout = vista.panelPrincipal.getLayout();
            layout.setActiveItem(1);
            vista.BtnAnterior.enable();
            vista.Btnsiguiente.setDisabled(true);
        });

        vista.btnCancelarTipoBusqueda.on('click', function () {
            vista.ventanaTipoBusqueda.hide();
        });

        //Radios y ventana para calcular el monto (automatico o manual)
        vista.rbAutomatica.on('check', function () {
            vista.btnAceptarTipoBusqueda.enable();
        });

        vista.rbManual.on('check', function () {
            vista.btnAceptarTipoBusqueda.enable();
        });

        vista.BtnSBC.on('click', function () {
            vista.ventanaTipoBusqueda.show();
        });

        vista.btnAceptarTipoBusqueda.on('click', function () {
            var tipo = 1;
            //Si el calculo es automatico
            if (vista.rbAutomatica.getGroupValue() == 1) {//Calculo automatico
                vista.nfMontoDistribuir.enable();
                tipo = 1;
            } else {//Calculo manual
                // vista.nfMontoDistribuir.disable();
                tipo = 2;
            }
            mostrarVentanaEntradasGenerales(tipo);
        });

        function mostrarVentanaEntradasGenerales(tipo) {
            var pagoSeleccionado = vista.gridPagosResultados.getSelectionModel().getSelected();
            if (scope.variables.idestructura != null) {
                vista.objListarPeriodosPagos.stPeriodosPagoExportar.removeAll();
                vista.objListarPeriodosPagos.stPeriodosPago.removeAll();
                modelo.stPlantillaNAreas.removeAll();
                var objRecord = scope.setValoresElementosVentana(vista, modelo);
                modelo.stPlantillaNAreas.add(objRecord.areas);
                if (vista.composicion == 1) {
                    vista.objListarPeriodosPagos.CambiarEntidad(scope.variables.idestructura);
                } else {
                    vista.objListarPeriodosPagos.CambiarEntidad(scope.variables.idestructura);
                    //Buscando las entidades
                    vista.objListarPeriodosPagos.CambiarEntidadesBuscar(vista.identidades);
                }

                if (tipo == 1) {
                    vista.winPeriodosPagos.items.get('tabentradas').items.get('gpAreas').store.removeAll();
                    vista.winPeriodosPagos.items.get('tabentradas').items.get('gpAreas').disable();
                } else {
                    vista.winPeriodosPagos.items.get('tabentradas').items.get('gpAreas').enable();
                }
                vista.winPeriodosPagos.show();
            }
        }

        vista.gridPagosResultados.getSelectionModel().on('selectionchange', function (obj) {
            if (obj.hasSelection()) {
                vista.BtnSBC.enable();
                var valores = scope.setValoresElementosVentana(vista, modelo);
                finicio = valores.fechainicio;
                ffin = valores.fechafin;
                vista.panelDerecho.setDetalles(valores.pagos, valores.areas);//console.info(this.pagoxresultadosdestajo);
                //Si es un pago x resultados con monto y periodos de pago
                if (this.pagoxresultadosdestajo == 1) {
                    vista.panelDerecho.stPeriodosPagoDestajo.load();
            if (valores.pagos.length || valores.areas.length)
                        vista.BtnCalcular.setDisabled(false);
                    else
                        vista.BtnCalcular.setDisabled(true);
                    //Si es un destajo
                } else {
                    vista.BtnCalcular.enable();
                }
            } else {
                vista.BtnSBC.setDisabled(true);
            }
        }.createDelegate(this));

        vista.gridPagosResultados.getSelectionModel().on('rowselect', function (obj, c, r) {
            //console.info(r.data);
            if (r.data.areas[0]) {
                vista.composicion = r.data.areas[0]['composicion'];
                this.variables.composicionn = r.data.areas[0]['composicion'];
                vista.idarea = r.data.areas[0]['idarea'];
                vista.identidades = r.data.areas[0]['entidades'];
            }
            if (r.data.pagoxresultadosdestajo == 2) {
                vista.panelDerecho.btnAdicionarFechasDestajo.enable();
                vista.panelDerecho.stPeriodosPagoDestajo.load({
                    params: {
                        identidad: scope.variables.idestructura,
                        idpagoresultado: r.data.idpagoporresultado
                    }
                });
            } else {
                vista.panelDerecho.btnAdicionarFechasDestajo.disable();
            }
            this.pagoxresultadosdestajo = r.data.pagoxresultadosdestajo;
        }.createDelegate(this));

        vista.panelDerecho.btnAceptarDestajo.on('click', function () {
            if (vista.panelDerecho.formularioDestajo.getForm().isValid()) {
                adicionarPeriodosDestajo();
            }
        });

        vista.panelDerecho.gpPeriodosPagoDestajo.getSelectionModel().on('rowselect', function (obj, c, r) {
            vista.panelDerecho.btnEliminarFechasDestajo.enable();
        });

        vista.panelDerecho.btnAdicionarFechasDestajo.on('click', function () {
            vista.panelDerecho.ventanaDestajo.show();
            vista.panelDerecho.radioRangoDias.setValue(true);
            vista.panelDerecho.radioDiaaDia.setValue(false);
        }.createDelegate(this));

        vista.panelDerecho.btnCancelarDestajo.on('click', function () {
            vista.panelDerecho.ventanaDestajo.hide();
        }.createDelegate(this));

        vista.panelDerecho.btnEliminarFechasDestajo.on('click', function () {
            eliminarPeriodoDestajo();
        });

        vista.panelDerecho.ventanaDestajo.on('show', function () {
            vista.panelDerecho.formularioDestajo.getForm().reset();
            //Fechas
            var finicdestajo = vista.gridPagosResultados.getSelectionModel().getSelected().get('fechainicio');
            var ffindestajo = vista.gridPagosResultados.getSelectionModel().getSelected().get('fechafin');
            vista.panelDerecho.dfFInicioDestajo.setMinValue(finicdestajo);
            vista.panelDerecho.dfFInicioDestajo.setMaxValue(ffindestajo);
            vista.panelDerecho.dfFinDestajo.setMinValue(ffindestajo);
            vista.panelDerecho.dfFinDestajo.setMaxValue(ffindestajo);
        }.createDelegate(this));

        function adicionarPeriodosDestajo() {
            var tipofecha = 1;
            if (vista.panelDerecho.radioRangoDias.getValue() == false) {
                tipofecha = 2;
            }
            PVD.mostrarMascara('idmaskaddfechad', 'Por favor espere...', 'Guardando datos');
            Ext.Ajax.request({
                url: 'adicionarperiodosdestajo',
                method: 'POST',
                params: {
                    identidad: scope.variables.idestructura,
                    tipofecha: tipofecha,
                    idpagoresultado: vista.gridPagosResultados.getSelectionModel().getSelected().data.idpagoporresultado,
                    fechainicio: vista.panelDerecho.dfFInicioDestajo.getRawValue(),
                    fechafin: vista.panelDerecho.dfFinDestajo.getRawValue()
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmaskaddfechad');
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'COD1') {
                        mostrarMensaje(1, 'Las fechas fueron adicionadas satisfactoriamente');
                        vista.panelDerecho.ventanaDestajo.hide();
                        vista.panelDerecho.stPeriodosPagoDestajo.load({
                            params: {
                                identidad: scope.variables.idestructura,
                                idpagoresultado: vista.gridPagosResultados.getSelectionModel().getSelected().data.idpagoporresultado
                            }
                        });
                    }

                }.createDelegate(this)
            });
        }

        function eliminarPeriodoDestajo() {
            mostrarMensaje(2, 'Esta seguro que desea eliminar el per&iacute;odo del destajo', function (btn) {
                if (btn == 'ok') {
                    var arridfechadestajo = new Array();
                    var datos = vista.panelDerecho.gpPeriodosPagoDestajo.getSelectionModel().getSelections();
                    Ext.each(datos, function (rec) {
                        arridfechadestajo.push(rec.get('idperiodosdestajo'));
                    });
                    if (arridfechadestajo.length > 0) {
                        PVD.mostrarMascara('idmaskdelfechad', 'Por favor espere...', 'Eliminando datos');
                        Ext.Ajax.request({
                            url: 'eliminardestajo',
                            method: 'POST',
                            params: {
                                arridfechadestajo: Ext.encode(arridfechadestajo)
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('idmaskdelfechad');
                                var respuesta = Ext.decode(response.responseText);
                                if (respuesta == 'COD1') {
                                    mostrarMensaje(1, 'Las fechas fueron eliminadas satisfactoriamente');
                                    vista.panelDerecho.stPeriodosPagoDestajo.load({
                                        params: {
                                            identidad: scope.variables.idestructura,
                                            idpagoresultado: vista.gridPagosResultados.getSelectionModel().getSelected().data.idpagoporresultado
                                        }
                                    });
                                }

                            }.createDelegate(this)
                        });
                    } else {
                        mostrarMensaje(3, 'Por favor escoja un per&iacute;odo de destajo');
                    }
                }
            });
        }

        /*Eventos para el Cmp Periodos de Pagos*/
        vista.objListarPeriodosPagos.on('periodopagoseleccionado', function (record) {
            if (vista.objListarPeriodosPagos.modoview == 2) {
                vista.objListarPeriodosPagos.btnAddGridExportarVarios.enable();
                vista.objListarPeriodosPagos.btnDelGridExportarVarios.disable();
                vista.recordperiodopagoseleccionado = record;
            }
        });

        vista.objListarPeriodosPagos.on('periodopagoexportarseleccionado', function (record) {
            if (vista.objListarPeriodosPagos.modoview == 2) {
                vista.objListarPeriodosPagos.btnAddGridExportarVarios.disable();
                vista.objListarPeriodosPagos.btnDelGridExportarVarios.enable();
                vista.recordperiodopagoexportarseleccionado = record;
            }
        });

        vista.objListarPeriodosPagos.btnAddGridExportarVarios.on('click', function (btn) {

            if (vista.objListarPeriodosPagos.modoview == 2) {
                if (vista.objListarPeriodosPagos.stPeriodosPagoExportar.find('idelaborarpagos', vista.recordperiodopagoseleccionado.data.idelaborarpagos) == -1) {
                    vista.objListarPeriodosPagos.stPeriodosPagoExportar.add(vista.recordperiodopagoseleccionado);
                    vista.objListarPeriodosPagos.stPeriodosPago.remove(vista.recordperiodopagoseleccionado);
                    btn.disable();
                } else
                    mostrarMensaje(1, Pvd.Nomina.CalculoPagoResultado.Idioma.lbMsgExistePeriodoPago);

            }
        });

        vista.objListarPeriodosPagos.btnDelGridExportarVarios.on('click', function (btn) {
            //console.info(vista.recordperiodopagoexportarseleccionado);
            if (vista.objListarPeriodosPagos.modoview == 2) {
                vista.objListarPeriodosPagos.stPeriodosPagoExportar.remove(vista.recordperiodopagoexportarseleccionado);
                btn.disable();
            }
        });

        vista.objListarPeriodosPagos.on('periodopagoseleccionado', function (fila) {
            vista.btnAceptarPeriodosPagos.enable();
        });

        vista.btnAceptarPeriodosPagos.on('click', function () {
            if (vista.rbAutomatica.getGroupValue() == 1) {//automatico
                var validacion = scope.validarMontosAreas();
                validacion.cantPagos = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
                if (validacion.cantPagos) {
                    if (vista.nfMontoDistribuir.getValue() <= 0) {
                        mostrarMensaje(3, 'Debe insertar un monto v&aacute;lido');
                    } else {
                        scope.guardarValoresPagoyAreas(null, vista.dfFInicioPeriodo.getRawValue(), vista.dfFFinPeriopdo.getRawValue());
                    }
                } else {
                    mostrarMensaje(3, Pvd.Nomina.CalculoPagoResultado.Idioma.msgPagoVacio);
                }

            } else {//manual
                //Si es un pago x resultados q lleva monto y periodos de pago
                if (scope.pagoxresultadosdestajo == 1) {//console.info('a');return;
                    var validacion = scope.validarMontosAreas();console.log(validacion);
                    validacion.cantPagos = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
                    //if (validacion.cantPagos) {
                        if (validacion.encontrado) {
                            if (validacion.todosDatos) {
                                //manual
                                scope.guardarValoresPagoyAreas(validacion.arrayAreas, vista.dfFInicioPeriodo.getRawValue(), vista.dfFFinPeriopdo.getRawValue());
                            } else {
                                mostrarMensaje(2, Pvd.Nomina.CalculoPagoResultado.Idioma.msgNoTodasAreas, function (boton) {
                                    if (boton == 'ok') {
                                        scope.guardarValoresPagoyAreas(validacion.arrayAreas, vista.dfFInicioPeriodo.getRawValue(), vista.dfFFinPeriopdo.getRawValue());
                                        //vista.panelDerecho.setDetalles()
                                    }
                                })
                            }
                        }
                        else {
                            mostrarMensaje(3, Pvd.Nomina.CalculoPagoResultado.Idioma.msgAreaVacio);
                        }
                    /*} else {
                        mostrarMensaje(3, Pvd.Nomina.CalculoPagoResultado.Idioma.msgPagoVacio);
                    }*/
                } else {//console.info('b');return;
                    //manual
                    scope.guardarValoresPagoyAreas(null, vista.dfFInicioPeriodo.getRawValue(), vista.dfFFinPeriopdo.getRawValue());
                }
            }
        }.createDelegate(this));

        vista.btnLimpiarAreas.on('click', function () {
            scope.limpiarMontosAreas();
        });

        vista.BtnGuardar.on('click', function () {
            scope.guardarPago(finicio, ffin);
        });
    },
    setValoresElementosVentana: function (vista, modelo) {

        //Obteniendo el pago seleccionado en el grid
        var pagoSeleccionado = vista.gridPagosResultados.getSelectionModel().getSelected();
        var arrayPagos = pagoSeleccionado.data.pagos;
        var arrayAreas = pagoSeleccionado.data.areas;
        var finicio = pagoSeleccionado.data.fechainicio;
        var ffin = pagoSeleccionado.data.fechafin;
        var canElementosRecorrer = (arrayPagos.length > pagoSeleccionado.data.areas.length) ? arrayPagos.length : arrayAreas.length;
        var RecordPago = Ext.data.Record.create({
                name: 'idelaborarpagos'
            }, {
                name: 'periodopago'
            }, {
                name: 'fechapago'
            }, {
                name: 'idperiodopago'
            },
            {name: 'denperiodopago'},
            {name: 'idtipopago'}
        );

        var RecorArea = Ext.data.Record.create({
            name: 'idarea'
        }, {
            name: 'area'
        }, {
            name: 'valor'
        }, {
            name: 'idpagoporresultadoarea'
        }, {
            name: 'idpagoporresultado'
        });
        var arrayRecordPagos = new Array();
        var arrayRecordArea = new Array();
        for (i = 0; i < canElementosRecorrer; i++) {
            if (arrayPagos[i]) {
                var objRecordPago = new RecordPago(arrayPagos[i]);
                arrayRecordPagos.push(objRecordPago);
            }
            if (arrayAreas[i]) {
                var objRecordArea = new RecorArea(arrayAreas[i]);
                arrayRecordArea.push(objRecordArea);
            }

        }
        var objRecord = {
            pagos: arrayRecordPagos,
            areas: arrayRecordArea,
            fechainicio: finicio,
            fechafin: ffin
        };
        this.areasmontos = arrayRecordArea;
        //console.info(objRecord);
        return objRecord;
    },
    guardarValoresPagoyAreas: function (arrayAreas, fechainicio, fechafin) {
        var scope = this;
        var arrayPagos = new Array();
        Ext.each(this.vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(), function (rec) {
            arrayPagos.push(rec.data.idelaborarpagos);
        });
        PVD.mostrarMascara('idmasksbc', 'Por favor espere...', 'Guardando datos');
        Ext.Ajax.request({
            url: 'guardarpagosareas',
            method: 'POST',
            params: {
                pagos: arrayPagos.join(','),
                areas: Ext.encode(arrayAreas),
                fechainicio: fechainicio,
                fechafin: fechafin,
                identidad: this.variables.idestructura,
                pagoxresultadosdestajo: this.pagoxresultadosdestajo,
                idpagoresultado: this.vista.gridPagosResultados.getSelectionModel().getSelected().data.idpagoporresultado
            },
            callback: function (options, success, response) {
                PVD.ocultarMascara('idmasksbc');
                var respuesta = Ext.decode(response.responseText);
                if (respuesta.codMsg == -1) {
                    mostrarMensaje(3, 'Por favor debe seleccionar un rango de fechas v&aacute;lido.');
                } else {
                    mostrarMensaje(1, Pvd.Nomina.CalculoPagoResultado.Idioma.msgAddAreasPagos);
                    scope.modelo.stPagosResultados.reload();
                    scope.vista.panelDerecho.limpiarStores();
                    scope.vista.winPeriodosPagos.hide();
                    scope.vista.ventanaTipoBusqueda.hide();
                }
                if (this.vista.rbAutomatica.getGroupValue() == 1) {
                    scope.calcularMontosDistribuirAreas();
                }

            }.createDelegate(this)
        });
    },
    validarMontosAreas: function () {
        var encontrado = false;
        var contador = 0;
        var validacion = {};
        var arrayAreas = new Array();
        Ext.each(this.modelo.stPlantillaNAreas.getRange(), function (rec) {
            if (rec.data.monto) {//Si es un record que se adiciono nuevo
                encontrado = true;
                var objAreas = {};
                objAreas.idarea = rec.data.idarea;
                objAreas.monto = rec.data.monto;
                arrayAreas.push(objAreas);
                contador++;
            }
        });
        var todosDatos = (contador == this.modelo.stPlantillaNAreas.getCount()) ? true : false;
        validacion.todosDatos = todosDatos;
        validacion.encontrado = encontrado;
        validacion.arrayAreas = arrayAreas;
        return validacion;
    },
    calcularPago: function (finicio, ffin, tipocalculo, rmontosareas, pagoxresultadosdestajo) {
        var datos = this.vista.panelDerecho.devDatosAreasPagos();
        var datosfechadestajo = new Array();
        if (this.vista.panelDerecho.gpPeriodosPagoDestajo.getSelectionModel().hasSelection() == true) {
            var rfechadestajo = this.vista.panelDerecho.gpPeriodosPagoDestajo.getSelectionModel().getSelections();
            var cont = 0;
            for (var i = 0; i < rfechadestajo.length; i++) {
                datosfechadestajo[cont] = rfechadestajo[i].data.idperiodosdestajo;
                cont++;
            }
        }
        if(pagoxresultadosdestajo == 2 && this.vista.panelDerecho.gpPeriodosPagoDestajo.getSelectionModel().hasSelection() == false){
            mostrarMensaje(3, 'Por favor escoja rangos de fecha validos para el c&aacute;lculo del destajo')
            return;
        }else{
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Calculando el pago por resultados'
            });
            winload.showMask();
            Ext.Ajax.request({
                timeout: 300000,
                url: 'calcularpagos',
                method: 'POST',
                params: {
                    pagos: Ext.encode(datos.pagos),
                    areas: Ext.encode(datos.areas),
                    finicio: finicio,
                    ffin: ffin,
                    pagoxresultadosdestajo: this.pagoxresultadosdestajo,
                    datosfechadestajo: Ext.encode(datosfechadestajo),
                    identidad: this.variables.idestructura,
                    idpagoresultado: this.vista.gridPagosResultados.getSelectionModel().getSelected().data.idpagoporresultado,
                    referencia: this.vista.gridPagosResultados.getSelectionModel().getSelected().data.referencia,
                    composicion: this.variables.composicionn,
                    tipocalculo: tipocalculo,
                    areasmontos: Ext.encode(rmontosareas),
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    winload.hideMask();
                    if (respuesta == 'NO-COINCIDEN-CAMPOCONFIG-CAMPONOMINA') {
                        mostrarMensaje(3, 'Los campos de la configuraci&oacute;n del pago por resultado no coinciden con los campos de la n&oacute;mina seleccionada. Por favor seleccione una n&oacute;mina mas actual.');
                    }
                    if (respuesta == 'NOMINAS-DESAPROBADAS') {
                        PVD.ocultarMascara('idmasksbc');
                        mostrarMensaje(3, 'Las n&oacute;minas de los per&iacute;odos seleccionados deben estar certificadas.');
                    } else {
                        console.info(respuesta);
                        this.variables.referencia = respuesta['referencia'];
                        this.vista.segundoPanel.crearGridDinamico(respuesta);
                        this.vista.segundoPanel.gridMostarPagosResultados.doLayout();
                        var layout = this.vista.panelPrincipal.getLayout();
                        layout.setActiveItem(1);
                        mostrarMensaje(1, Pvd.Nomina.CalculoPagoResultado.Idioma.msgCalculoPago);
                    }

                }.createDelegate(this)
            });
        }

    },
    guardarPago: function (finicio, ffin) {
        var datos = this.vista.panelDerecho.devDatosAreasPagos();
        PVD.mostrarMascara('idmasksbc', Pvd.Nomina.CalculoPagoResultado.Idioma.lbMsgCargMask, Pvd.Nomina.CalculoPagoResultado.Idioma.lbMsgMaskGuardarReporteSalida);
        Ext.Ajax.request({
            timeout: 300000,
            url: 'guardarpagos',
            method: 'POST',
            params: {
                identidad: this.variables.idestructura,
                idpagoresultado: this.vista.gridPagosResultados.getSelectionModel().getSelected().data.idpagoporresultado,
                referencia: this.variables.referencia,
                finicio: finicio,
                ffin: ffin,
                composicion: this.vista.composicion,
                pagoxresultadosdestajo: this.pagoxresultadosdestajo,
                pagos: Ext.encode(datos.pagos)
                //referencia: this.vista.gridPagosResultados.getSelectionModel().getSelected().data.referencia
            },
            callback: function (options, success, response) {
                mostrarMensaje(1, Pvd.Nomina.CalculoPagoResultado.Idioma.msgGuardarReporte);
                PVD.ocultarMascara('idmasksbc');

            }.createDelegate(this)
        });
    },
    limpiarMontosAreas: function () {
        /*
         var arrayAreas = new Array();
         Ext.each(this.modelo.stPlantillaNAreas.getRange(), function (rec) {
         if (rec.data.monto) {//Si es un record que se adiciono nuevo
         var objAreas = {};
         objAreas.idarea = rec.data.idarea;
         objAreas.monto = rec.data.monto;
         arrayAreas.push(objAreas);
         }
         });*/

        PVD.mostrarMascara('idmasklimpiarmontos', Pvd.Nomina.CalculoPagoResultado.Idioma.lbMsgCargMask, Pvd.Nomina.CalculoPagoResultado.Idioma.lbMsgMaskLimpiarMontos);
        Ext.Ajax.request({
            url: 'limpiarmontosareas',
            method: 'POST',
            params: {
                identidad: this.variables.idestructura,
                idpagoporresultado: this.vista.gridPagosResultados.getSelectionModel().getSelected().data.idpagoporresultado
                //areas: Ext.encode(arrayAreas)
            },
            callback: function (options, success, response) {
                mostrarMensaje(1, Pvd.Nomina.CalculoPagoResultado.Idioma.msgLimpiarMontos);
                PVD.ocultarMascara('idmasklimpiarmontos');
                this.modelo.stPlantillaNAreas.reload();
            }.createDelegate(this)
        });

    },
    calcularMontosDistribuirAreas: function () {
        PVD.mostrarMascara('idmaskdistmontos', 'Por favor espere...', 'Guardando datos');
        Ext.Ajax.request({
            url: 'calcularMontosDistribuirAreas',
            method: 'POST',
            params: {
                identidad: this.variables.idestructura,
                idpagoresultado: this.vista.gridPagosResultados.getSelectionModel().getSelected().data.idpagoporresultado,
                monto: this.vista.nfMontoDistribuir.getValue()
            },
            callback: function (options, success, response) {
                PVD.ocultarMascara('idmaskdistmontos');
                var respuesta = Ext.decode(response.responseText);
                if (respuesta.failed == 'NO-AGRUP-AREAS') {
                    mostrarMensaje(3, 'Por favor configure los agrupadores de las &aacute;reas')
                } else if (respuesta.failed == 'NO-AREAS-FORMULAS-CONFIGURADAS') {
                    mostrarMensaje(3, 'Faltan por configurar las siguientes &aacute;reas: <b>' + respuesta.areassinformulamonto + '</b> en la Configuraci&oacute;n de los montos')
                } else if (respuesta.failed == 'NO-EXPRESION-MATEMATICA-AGRUPADOR') {
                    mostrarMensaje(3, 'Por favor configure las f&oacute;rmulas del agrupador: <b>' + respuesta.agrupador)
                } else if (respuesta.failed == 'NO-EXPRESION-MATEMATICA-AREA') {
                    mostrarMensaje(3, 'Por favor configure las f&oacute;rmulas de las &aacute;reas');
                } else if (respuesta.failed == 'NO-AREAS-CONFIG') {
                    mostrarMensaje(3, 'No existen &aacute;reas en la configuraci&oacute;n de las f&oacute;rmulas de la distribuci&oacute;n');
                } else {
                    //Exportando el excel
                    window.open(document.location.protocol + '//' + document.location.host +
                        '/pvd/nomina/index.php/calcularpago/exportarMontosAreas?' +
                        'identidad=' + this.variables.idestructura +
                        '&idpagoporresultado=' + this.vista.gridPagosResultados.getSelectionModel().getSelected().data.idpagoporresultado +
                        '&monto=' + this.vista.nfMontoDistribuir.getValue());
                    mostrarMensaje(1, 'Los montos fueron repartidos satisfactoriamente entre las &aacute;reas');

                }
                this.vista.nfMontoDistribuir.setValue('');
                this.vista.winPeriodosPagos.hide();
                this.vista.ventanaTipoBusqueda.hide();
                this.modelo.stPagosResultados.reload();

            }.createDelegate(this)
        });

    }
};
