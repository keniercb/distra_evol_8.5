Ext.ns('Pvd.Nomina.Banco.ExportarBanco');

Pvd.Nomina.Banco.ExportarBanco.Controlador = {

    init: function (idioma, vista, modelo) {

        var variables = {
            identidad: -1,
            idperiodopago: -1,
            idtipopago: -1,
            denominacionentidad: '',
            idelaborarpagos: -1,
            tipo: -1,
            auxid: new Array(),
            idfechacierre: null,
            arridelaborarpagos: new Array()
            //nuevo
            ,totalpersonasnotificar: -1            
        };

        //Mostrar interfaz para selecionar entidad.
        vista.winEstEntidades.show();

        //Eventos del objeto del ábol de entidades.
        vista.pEstEntidades.on('estructuraselecionada', function (o, nodo) {
            variables.identidad = nodo.id;
            variables.denominacionentidad = nodo.text;
            vista.btnAceptarEntidades.enable();
        });

        vista.btnNotificarCorreo.on('click', function () {
            notificarCorreoSalario();
        });

        vista.btnTalonPagoBanco.on('click', function () {
            var winTalonPago = new Pvd.Nomina.Banco.winTalonPago({
                identidad: variables.identidad,
                idelaborarpagos: variables.auxid,
                estado: 1
            });
            winTalonPago.cbTipoSeleccion.focus(true, 500);
            winTalonPago.show();
        });

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

        vista.objListarPeriodosPagos.btnAddGridExportarVarios.setHandler(function (btn) {
            if (vista.objListarPeriodosPagos.modoview == 2) {
                vista.objListarPeriodosPagos.stPeriodosPagoExportar.add(vista.recordperiodopagoseleccionado);
                vista.objListarPeriodosPagos.stPeriodosPago.remove(vista.recordperiodopagoseleccionado);
                btn.disable();

            }
        });

        vista.objListarPeriodosPagos.btnDelGridExportarVarios.setHandler(function (btn) {
            if (vista.objListarPeriodosPagos.modoview == 2) {
                vista.objListarPeriodosPagos.stPeriodosPagoExportar.remove(vista.recordperiodopagoexportarseleccionado);
                vista.objListarPeriodosPagos.stPeriodosPago.add(vista.recordperiodopagoexportarseleccionado);
                btn.disable();
            }
        })

        vista.btnAceptarEntidades.setHandler(function () {
            if (variables.identidad != null) {
                vista.ventanaTipoBusqueda.show();
            }
        });

        vista.btnCancelarTipoBusqueda.on('click', function () {
            vista.ventanaTipoBusqueda.hide();
        });

        vista.winPeriodosPagos.on('hide', function () {
            vista.objListarPeriodosPagos.stPeriodosPago.removeAll();
            vista.objListarPeriodosPagos.stPeriodosPagoExportar.removeAll();
        });

        vista.btnAceptarTipoBusqueda.on('click', function () {
            vista.objListarPeriodosPagos.CambiarEntidad(variables.identidad);
            var titulo = vista.winPeriodosPagos.title + ' -  ' + variables.denominacionentidad;
            vista.winPeriodosPagos.setTitle(titulo);
            if (vista.rbSimpleEntidad.getGroupValue() == 1) {
                vista.tipoentidad = 1;
            } else {
                vista.tipoentidad = 2;
            }

            if (vista.rbActual.getGroupValue() == 1) {
                vista.objListarPeriodosPagos.HabilitarCombo();
                vista.winPeriodosPagos.show();
                vista.tipobusqueda = 1;
                vista.estado = 0;
                variables.idfechacierre = null;
            } else {
                vista.ventanaResumenPeriodos.show();
                vista.objListarPeriodosPagos.DesabilitarCombo();
                modelo.stFechasCierre.load({params: {identidad: variables.identidad, tipoentidad: vista.tipoentidad}});
                vista.tipobusqueda = 2;
                vista.estado = 1;
            }
            vista.ventanaTipoBusqueda.hide();
        });

        vista.rbActual.on('check', function () {
            vista.btnAceptarTipoBusqueda.enable();
        });

        vista.rbHistorico.on('check', function (ch, checked) {
            vista.btnAceptarTipoBusqueda.enable();
            if (checked == true) {
                vista.rbSimpleEntidad.enable();
                vista.rbEntidadesSubordinadas.enable();
            } else {
                vista.rbSimpleEntidad.disable();
                vista.rbEntidadesSubordinadas.disable();
            }
        });

        vista.gpFechasCierre.getSelectionModel().on('rowselect', function (sm, index, record) {
            vista.btnAceptarResumenPeriodos.enable();
        });

        modelo.stFechasCierre.on('load', function () {
            vista.btnAceptarResumenPeriodos.disable();
        });

        vista.btnCancelarResumenPeriodos.on('click', function () {
            vista.ventanaResumenPeriodos.hide();
        });

        vista.btnAceptarResumenPeriodos.on('click', function () {
            PVD.mostrarMascara('idmaskresumen', 'Por favor espere...', 'Enviando datos');
            var arraydatosfcierre = vista.gpFechasCierre.getSelectionModel().getSelections();
            var arrayidfcierre = new Array();
            var arrayidentidad = new Array();
            for (var i = 0; i < arraydatosfcierre.length; i++) {
                arrayidfcierre[i] = arraydatosfcierre[i].data.idfechascierre;
                arrayidentidad[i] = arraydatosfcierre[i].data.identidad;
            }
            variables.idfechacierre = arrayidfcierre;
            Ext.Ajax.request({
                url: 'obtenerPeriodosPagoFechaCierre',
                params: {
                    arrayidfcierre: Ext.encode(arrayidfcierre),
                    arrayidentidad: Ext.encode(arrayidentidad)
                },
                method: 'POST',
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmaskresumen');
                    var respuesta = Ext.decode(response.responseText);
                    vista.objListarPeriodosPagos.stPeriodosPagoExportar.loadData(respuesta);
                    vista.winPeriodosPagos.show();
                    vista.ventanaResumenPeriodos.hide();
                }
            });
        });

        vista.btnCerrarResumen.on('click', function () {
            var contador = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
            var range = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0, contador);
            for (var i = 0; i < contador; i++) {
                vista.arrayidelaborarpagos[i] = range[i].data.idelaborarpagos;
            }
            PVD.mostrarMascara('idmaskconcluirresumen', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: 'concluirCierrePeriodos',
                params: {
                    idelaborarpagos: Ext.encode(vista.arrayidelaborarpagos),
                    totalcupcajero: vista.nfAcumulado.getValue(),
                    totalcuccajero: vista.nfAcumuladoCUC.getValue(),
                    totalcupcaja: vista.nfAcumuladoCajaCup.getValue(),
                    totalcuccaja: vista.nfAcumuladoCajaCUC.getValue(),
                    identidad: variables.identidad
                },
                method: 'POST',
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmaskconcluirresumen');
                    var respuesta = Ext.decode(response.responseText);
                    vista.objListarPeriodosPagos.stPeriodosPago.removeAll();
                    vista.objListarPeriodosPagos.stPeriodosPagoExportar.removeAll();
                    if (respuesta == 'ok') {
                        vista.btnCerrarResumen.disable();
                        vista.btnActualizarResumen.disable();
                        mostrarMensaje(2, 'El resumen general fue concluido satisfactoriamente');
                    }

                }
            });
        });

        vista.objListarPeriodosPagos.on('periodopagoseleccionado', function (fila) {
            vista.btnAceptarPeriodosPagos.enable();
            variables.idtipopago = fila.data.idtipopago;
            variables.idperiodopago = fila.data.idperiodopago;
            variables.idelaborarpagos = fila.data.idelaborarpagos;
        });

        vista.btnActualizarResumen.setHandler(function () {console.log(vista.estado);
            
            var idfechascierre = new Array();
            if (vista.estado == 1) {
                var arraydatfcierre = vista.gpFechasCierre.getSelectionModel().getSelections();
                for (var i = 0; i < arraydatfcierre.length; i++) {
                    idfechascierre[i] = arraydatfcierre[i].data.idfechascierre;
                }
            } console.log(idfechascierre)

            PVD.mostrarMascara('idmaskvaln', 'Por favor espere...', 'Actualizando periodo.');  
            Ext.Ajax.request({
                url: 'validarEstadoElaborarPago',
                method: 'POST',
                params: {
                    identidad: variables.identidad,
                    arrayidelaborarpagos: Ext.encode(variables.auxid)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if(respuesta == 0){
                        Ext.Ajax.request({
                            url: 'actualizarListadoDatosNomina',
                            method: 'POST',
                            params: {
                                identidad: variables.identidad,
                                arrayidelaborarpagos: Ext.encode(variables.auxid)
                            },
                            callback: function (options, success, response) {
                                var respuesta = Ext.decode(response.responseText);
                                // respuesta ahora es un objeto { result: 1|2, idnomina, idNominaDestino, cisConNuevaCuenta }
                                if (respuesta && respuesta.result == 1) {
                                    PVD.ocultarMascara('idmaskvaln');
                                    // Ejecutar la acción que actualiza listados de nómina en servidor
                                    PVD.mostrarMascara('idmaskvaln2', 'Por favor espere...', 'Actualizando listado de nómina');
                                    Ext.Ajax.request({
                                        url: 'actualizarlistadonomina',
                                        method: 'POST',
                                        params: {
                                            idNominaOrigen: respuesta.idnomina,
                                            idNominaDestino: respuesta.idNominaDestino,
                                            cis: Ext.encode(respuesta.cisConNuevaCuenta)
                                        },
                                        callback: function (opts2, succ2, resp2) {
                                            var respuesta = Ext.decode(resp2.responseText);console.log(respuesta);
                                            PVD.ocultarMascara('idmaskvaln2');
                                            mostrarMensaje(1, 'Se han actualizado los datos correctamente.');
                                            // No se espera cuerpo específico; recargar datos de exportación
                                            modelo.CargarParaExportarBanco(variables.auxid, variables.identidad, vista.estado, idfechascierre);
                                            if (respuesta == true) {
                                                mostrarMensaje(1, 'Se han actualizado los datos correctamente.');                                                
                                            }else{
                                                mostrarMensaje(2, 'No se pudieron actualizar los datos de nómina.');
                                            }
                                        }
                                    });
                                } else if (respuesta && respuesta.result == 2) {
                                    PVD.ocultarMascara('idmaskvaln');
                                    mostrarMensaje(2, 'No se encontraron nuevas cuentas para actualizar.');
                                }

                            }.createDelegate(this)
                        });
                    }else{
                        PVD.ocultarMascara('idmaskvaln');
                        mostrarMensaje(3, 'Existen periodos de pagos cerrados, no pueden ser modificados.');
                    }
                }.createDelegate(this)
            });
        });

        vista.btnAceptarPeriodosPagos.setHandler(function () {
            //Limpiando los grid de las personas de cajero y caja y los montos
            modelo.stExportarBanco.removeAll();
            modelo.stBilletesCUP.removeAll();
            modelo.stBilletesCUC.removeAll();
            modelo.stPersonasCaja.removeAll();
            vista.nfAcumulado.setValue('');
            vista.nfAcumuladoCUC.setValue('');
            vista.nfAcumuladoCajaCup.setValue('');
            vista.nfAcumuladoCajaCUC.setValue('');

            if (variables.identidad != null) {
                variables.auxid = new Array();
                if (vista.tipobusqueda == 1) {
                    vista.btnCerrarResumen.enable();
                    vista.btnActualizarResumen.enable();
                } else {
                    vista.btnCerrarResumen.disable();
                    vista.btnActualizarResumen.disable();
                }

                var cont = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
                var todos = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0, cont - 1);

                var contarraux = 0;
                for (var i = 0; i < cont; i++) {
                    variables.auxid[contarraux] = todos[i].data.idelaborarpagos;
                    contarraux++;
                }

                var idfechascierre = new Array();
                if (vista.estado == 1) {
                    var arraydatfcierre = vista.gpFechasCierre.getSelectionModel().getSelections();
                    for (var i = 0; i < arraydatfcierre.length; i++) {
                        idfechascierre[i] = arraydatfcierre[i].data.idfechascierre;
                    }
                }

                //Validando que las nominas esten aprobadas para poder acceder a depositar salario
                console.info(variables.auxid);
                PVD.mostrarMascara('idmaskvaln', 'Por favor espere...', 'Validando el estado de las n&oacute;minas.');
                Ext.Ajax.request({
                    url: 'validarEstadoNominas',
                    method: 'POST',
                    params: {
                        arrayidelaborarpagos: Ext.encode(variables.auxid)
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('idmaskvaln');
                        var respuesta = Ext.decode(response.responseText);
                        if(respuesta == 'ok' || vista.estado == 1){
                            vista.winExportarBanco.show();
                            vista.winExportarBanco.maximize();
                            //Actualizando automaticamente las cuentas de cup cuc
                            Ext.Ajax.request({
                                url: 'actualizarCuentasBancariasPersonas',
                                method: 'POST',
                                params: {
                                    identidad: variables.identidad,
                                    arridelaborarpagos: Ext.encode(variables.auxid)
                                },
                                callback: function (options, success, response) {
                                    var respuesta = Ext.decode(response.responseText);
                                    if(respuesta == 'ok'){
                                        modelo.CargarParaExportarBanco(variables.auxid, variables.identidad, vista.estado, idfechascierre);
                                    }
                                }.createDelegate(this)
                            });
                            //Poniendo en cero los contadores de filas cup y cuc en la vista
                            vista.contdesglosecup = 0;
                            vista.contdesglosecuc = 0;

                            //Validando el cuadre del desglose
                            Ext.Ajax.request({
                                url: 'validarCuadreDesglose',
                                method: 'POST',
                                params: {
                                    idelaborarpagos: Ext.encode(variables.auxid),
                                    identidad: variables.identidad,
                                    estado: vista.estado,
                                    idfechascierre: (vista.estado == 1) ? Ext.encode(idfechascierre) : new Array()
                                },
                                callback: function (options, success, response) {
                                    var respuesta = Ext.decode(response.responseText);
                                    if (respuesta == 'BILLETES-CUP-INSUFICIENTES-DESGLOSE') {
                                        mostrarMensaje(3, 'Los billetes del tipo de moneda <b>CUP</b> son insuficientes para realizar el desglose.');
                                        vista.btnExportarDesglose.disable();
                                        vista.btnExportarDesglosePersonas.disable();
                                    } else if (respuesta == 'BILLETES-CUC-INSUFICIENTES-DESGLOSE') {
                                        mostrarMensaje(3, 'Los billetes del tipo de moneda <b>CUC</b> son insuficientes para realizar el desglose.');
                                        vista.btnExportarDesglose.disable();
                                        vista.btnExportarDesglosePersonas.disable();
                                    }
                                }.createDelegate(this)
                            });
                        }else{
                            mostrarMensaje(3, 'Por favor apruebe las nominas de:<b>' + respuesta + '</b>');
                        }
                    }.createDelegate(this)
                });
            }
        });

        modelo.stBilletesCUC.on('beforeload', function (st, o) {
            if (vista.estado == 1) {
                //st.baseParams.idfechascierre = vista.gpFechasCierre.getSelectionModel().getSelected().get('idfechascierre');
            }
            st.baseParams.estado = vista.estado;
        });

        modelo.stBilletesCUP.on('beforeload', function (st, o) {
            if (vista.estado == 1) {
                // st.baseParams.idfechascierre = vista.gpFechasCierre.getSelectionModel().getSelected().get('idfechascierre');
            }
            st.baseParams.estado = vista.estado;
        });
        
        modelo.stExportarBanco.on('load', function (st, record) {
            var montocup = 0.00;
            var montocuc = 0.00;
            Ext.each(record, function (val) {
                montocup += parseFloat(val.data.importe_n > 0 ? val.data.importe_n : 0);
                montocuc += parseFloat(val.data.importe_d > 0 ? val.data.importe_d : 0);
            });
            vista.nfAcumulado.setValue((montocup > 0) ? Math.round(montocup * 100) / 100 : 0.00);
            vista.nfAcumuladoCUC.setValue((montocuc > 0) ? Math.round(montocuc * 100) / 100 : 0.00);
        });

        modelo.stPersonasCaja.on('load', function (st, record) {
            var montocup = 0.00;
            var montocuc = 0.00;
            Ext.each(record, function (val) {
                montocup += parseFloat(val.data.importe_n > 0 ? val.data.importe_n : 0);
                montocuc += parseFloat(val.data.importe_d > 0 ? val.data.importe_d : 0);
            });
            vista.nfAcumuladoCajaCup.setValue((montocup > 0) ? Math.round(montocup * 100) / 100 : 0.00);
            vista.nfAcumuladoCajaCUC.setValue((montocuc > 0) ? Math.round(montocuc * 100) / 100 : 0.00);

        });

        //Menu button del exportar .dbf al banco
        vista.btnExportarBanco.on('click',function () {
            exportarExelDbf(); 
        });

        function exportarExelDbf(){
            var _this = this;
            var msg = function (title, msg) {
                Ext.Msg.show({
                    title: title,
                    msg: msg,
                    minWidth: 200,
                    modal: true,
                    icon: Ext.Msg.INFO,
                    buttons: Ext.Msg.OK
                });
            };
    
            var combobanco = new Ext.form.ComboBox({
                id:'combobanco',
                xtype: 'combo',
                fieldLabel: 'Banco',
                store: modelo.stBanco,
                allowBlank: false,
                forceSelection: true,
                displayField: 'nombre',
                mode:'local',
                valueField:'idbanco',
                triggerAction:'all',
                hiddenName:'idbanco'
            })
    
            var panel = new Ext.FormPanel({
                fileUpload: true,
                width: 500,
                frame: true,
                autoHeight: true,
                bodyStyle: 'padding: 10px 10px 0 10px;',
                labelWidth: 50,
                defaults: {
                    anchor: '95%',
                    allowBlank: false,
                    msgTarget: 'side'
                },
                items: [combobanco]
            });

            function exportarBancoDBF(moneda = 1) {
                //Buscarndo el tipo de formato a Exportar
                PVD.mostrarMascara('idmaskformato', 'Por favor espere…', 'Generando DBF');
                Ext.Ajax.request({
                    url: 'buscarFormatoExportacionBanco',
                    method: 'POST',
                    params: {
                        identidad: variables.identidad,
                        idbanco: combobanco.getValue()
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);                        
                        var idbanco = combobanco.getValue();
                        if (respuesta.codigo == 'OK') {
                            //Exportar un Txt
                            if(respuesta.tipoformato == 2){
                                window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/exportarbanco/exportarperiododepagoalbancoTxt?idelaborarpagos=' + Ext.encode(variables.auxid) + '&identidad=' + variables.identidad
                                    + '&estado=' + vista.estado+ '&moneda=' + moneda+ '&idfechascierre=' + Ext.encode(variables.idfechacierre) + '&idbanco=' + idbanco);
                            }
                            //Exportar un DBF
                            else{
                                PVD.mostrarMascara('idmaskexportardbf', 'Por favor espere…', 'Generando DBF');
                                Ext.Ajax.request({
                                    url: 'exportarperiododepagoalbanco',
                                    method: 'POST',
                                    params: {
                                        //idelaborarpagos: variables.idelaborarpagos,
                                        idelaborarpagos: Ext.encode(variables.auxid),
                                        identidad: variables.identidad,
                                        estado: vista.estado,
                                        moneda: moneda,
                                        idfechascierre: Ext.encode(variables.idfechacierre),
                                        idbanco: combobanco.getValue(),
                                        tipoentidad: vista.tipoentidad
                                    },
                                    callback: function (options, success, response) {
                                        var respuesta = Ext.decode(response.responseText);
                                        exportar.close();
                                        if (respuesta.codigo == 'OK') {
                                            window.open(respuesta.url);
                                        } else if (respuesta.codigo == 'NOCREADBF') {
                                            mostrarMensaje(2, 'No se pudo exportar a formato DBF.');
                                        } else {
                                            mostrarMensaje(2, 'Error a la hora de exportar a formato DBF.');
                                        }
                                        PVD.ocultarMascara('idmaskexportardbf');
                                        exportar.close();
                                    }.createDelegate(this)
                                });
                            }
                        } else if (respuesta.codigo == 'NOCONFIG') {
                            mostrarMensaje(2, 'Por favor configure el fichero a exportar');
                        }
                        PVD.ocultarMascara('idmaskformato');
                    }.createDelegate(this)
                });
            };
    
            var exportar = new Ext.Window({
                title: 'Seleccionar Banco',
                width: 500,
                layout: 'fit',
                modal: true,
                items: [panel],
                buttons: [{
                    iconCls: 'Cancelar',
                    text: 'Cancelar',
                    handler: function () {
                        exportar.close();
                    }
                }, {
                    iconCls: 'Aceptar',
                    text: 'Aceptar',
                    handler: function(){
                        exportarBancoDBF();
                        exportar.close();
                    }
                }],
                keys: [{
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {                
                        exportarBancoDBF();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        exportar.close();
                    }
                }]
            });
            exportar.show();
        }

        vista.btnDescAplicados.setHandler(function () {
            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/exportarbanco/exportardescuentosaplicados?identidad=' + variables.identidad + '&idelaborarpagos=' + Ext.encode(variables.auxid));
        });

        vista.btnExportarCajero.menu.items.items[0].setHandler(function () {
            exportarPersonasCajero(0);
            
        });

        function exportarPersonasCajero(tipexpor){

            var arraydatosfcierre = vista.gpFechasCierre.getSelectionModel().getSelections();
            var arrayidfcierre = new Array();
            for (var i = 0; i < arraydatosfcierre.length; i++) {
                arrayidfcierre[i] = arraydatosfcierre[i].data.idfechascierre;
            }
            variables.idfechacierre = arrayidfcierre;

            if (vista.estado == 0) {
                window.open(
                    document.location.protocol +
                    '//' + window.location.host +
                    '/pvd/nomina/index.php/exportarbanco/exportarperiododepagoexcel?identidad=' + variables.identidad + '&idelaborarpagos=' + Ext.encode(variables.auxid) + '&estado=' + vista.estado + '&tipexpor='+ tipexpor);
            
            } else {
                window.open(
                    document.location.protocol +
                    '//' + window.location.host +
                    '/pvd/nomina/index.php/exportarbanco/exportarperiododepagoexcel?identidad=' + variables.identidad + '&idelaborarpagos=' + Ext.encode(variables.auxid) + '&estado=' + vista.estado + '&arrayidfcierre=' + Ext.encode(arrayidfcierre) + '&tipexpor='+ tipexpor);
                        
            }
        }

        vista.btnExportarCaja.setHandler(function () {
            var personacaja = new Array();
            var cont = modelo.stPersonasCaja.getCount();
            var caja = modelo.stPersonasCaja.getRange(0, cont - 1);

            for (var i = 0; i < cont; i++) {
                personacaja[i] = caja[i].data;
            }
            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/exportarbanco/exportartirillas?identidad='
                + variables.identidad + '&idelaborarpagos=' + Ext.encode(variables.auxid));

        });

        vista.btnExportarDesglose.setHandler(function () {
            var contador = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
            var range = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0, contador);
            for (var i = 0; i < contador; i++) {
                vista.arrayidelaborarpagos[i] = range[i].data.idelaborarpagos;
            }
            PVD.mostrarMascara('idmaskexportardesglose', 'Por favor espere…', 'Generando reporte');
            Ext.Ajax.request({
                url: 'exportarDesgloseNominas',
                method: 'POST',
                params: {
                    arridelaborarpagos: Ext.encode(vista.arrayidelaborarpagos),
                    identidad: variables.identidad,
                    validar: 1,
                    cierre: vista.estado,
                    idfechacierre: Ext.encode(variables.idfechacierre),
                    tiporeporte:1
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    switch (respuesta.codigo) {
                        case '1': {
                            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/exportarbanco/exportarDesgloseNominas?arridelaborarpagos='
                                + Ext.encode(vista.arrayidelaborarpagos) + '&identidad=' + variables.identidad +
                                '&validar=0' + '&tiporeporte=1' + '&cierre=' + vista.estado + '&idfechacierre=' + Ext.encode(variables.idfechacierre));
                            break;
                        }
                        case '2': {
                            mostrarMensaje(3, 'No existe el desglose de billetes para el tipo de moneda <b>CUP</b>.');
                            break;
                        }
                        case '3': {
                            mostrarMensaje(3, 'No existen billetes activos para el tipo de moneda <b>CUP</b>.');
                            break;
                        }
                        case '4': {
                            mostrarMensaje(3, 'No existe el desglose de billetes para el tipo de moneda <b>CUC</b>.');
                            break;
                        }
                        case '5': {
                            mostrarMensaje(3, 'No existen billetes activos para el tipo de moneda <b>CUC</b>.');
                            break;
                        }
                    }
                    PVD.ocultarMascara('idmaskexportardesglose');
                }.createDelegate(this)
            });
        });

        vista.btnExportarDesglosePersonas.setHandler(function () {
            var contador = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
            var range = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0, contador);

            for (var i = 0; i < contador; i++) {
                vista.arrayidelaborarpagos[i] = range[i].data.idelaborarpagos;
            }

            var arraydatos = modelo.stPersonasCaja;
            var arraypersonas = new Object();
            for (var j = 0; j < arraydatos.getCount(); j++) {
                arraypersonas[j] = new Object();
                arraypersonas[j].id = arraydatos.data.items[j].data.idpersona;
                arraypersonas[j].n = (arraydatos.data.items[j].data.importe_n !== null ? arraydatos.data.items[j].data.importe_n : '0');
                arraypersonas[j].d = (arraydatos.data.items[j].data.importe_d !== null ? arraydatos.data.items[j].data.importe_d : '0');
            }
            PVD.mostrarMascara('idmaskexportardesglose', 'Por favor espere…', 'Generando reporte');
            Ext.Ajax.request({
                url: 'exportarDesgloseNominas',
                method: 'POST',
                params: {
                    arridelaborarpagos: Ext.encode(vista.arrayidelaborarpagos),
                    identidad: variables.identidad,
                    validar: 1,
                    cierre: vista.estado,
                    idfechacierre: Ext.encode(variables.idfechacierre),
                    tiporeporte:2
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);

                    switch (respuesta.codigo) {
                        case '1': {
                            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/exportarbanco/exportarDesgloseNominas?arridelaborarpagos='
                                + Ext.encode(vista.arrayidelaborarpagos) + '&identidad=' + variables.identidad + '&validar=0' + '&tiporeporte=2' +
                                '&cierre=' + vista.estado + '&idfechacierre=' + Ext.encode(variables.idfechacierre));
                            break;
                        }
                        case '2': {
                            mostrarMensaje(3, 'No existe el desglose de billetes para el tipo de moneda <b>CUP</b>.');
                            break;
                        }
                        case '3': {
                            mostrarMensaje(3, 'No existen billetes activos para el tipo de moneda <b>CUP</b>.');
                            break;
                        }
                        case '4': {
                            mostrarMensaje(3, 'No existe el desglose de billetes para el tipo de moneda <b>CUC</b>.');
                            break;
                        }
                        case '5': {
                            mostrarMensaje(3, 'No existen billetes activos para el tipo de moneda <b>CUC</b>.');
                            break;
                        }
                    }
                    PVD.ocultarMascara('idmaskexportardesglose');
                }.createDelegate(this)
            });
        });
        vista.btnResumenGeneral.setHandler(function () {
            var contador = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
            var range = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0, contador);
            for (var i = 0; i < contador; i++) {
                vista.arrayidelaborarpagos[i] = range[i].data.idelaborarpagos;
            }
            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/exportarbanco/exportarResumenGeneral?arridelaborarpagos='
                + Ext.encode(/*vista.arrayidelaborarpagos*/variables.auxid) +
                '&identidad=' + variables.identidad + '&cierre=' + vista.estado +
                '&idfechacierre=' + Ext.encode(variables.idfechacierre));
        });

        function notificarCorreoSalario() {
            var cantperscajero = vista.smExportarBanco.selections.length;
            var cantperscaja = vista.smPersonasCaja.selections.length
            var personas = new Array();
            var total = cantperscajero + cantperscaja;
            const msg = total === 0 ? '¿Est&aacute; seguro que desea notificar por correo a <b>todas las personas</b> de la entidad?'
                  : total === 1 ? '¿Est&aacute; seguro que desea notificar por correo a <b>la persona seleccionada</b>?'
                  : '¿Est&aacute; seguro que desea notificar por correo a <b>las '+total+' personas seleccionadas</b>?';
            mostrarMensaje(1, msg, function (param) {
                if (param == 'ok') {
                    Ext.each(vista.smExportarBanco.selections.items, function (valores) {
                        personas.push(valores.get('idpersona'));
                    });
                    Ext.each(vista.smPersonasCaja.selections.items, function (valores) {
                        personas.push(valores.get('idpersona'));
                    });
                    total = total === 0 ? personas.length : total;
                    var cont = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
                    var todos = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0, cont - 1);

                    var arrayidelaborarpagos = new Array();
                    var contarraux = 0;
                    for (var i = 0; i < cont; i++) {
                        arrayidelaborarpagos[contarraux] = {
                            idelaborarpagos: todos[i].data.idelaborarpagos,
                            fechapago: todos[i].data.fechapago,
                            fechainicio: todos[i].data.fechainicioperiodo
                        };
                        contarraux++;
                    }
                    PVD.mostrarMascara('idmaskemail', 'Por favor espere...', 'Enviando datos');
                    Ext.Ajax.request({
                        timeout: 500000000000000,
                        url: 'notificarCorreo',
                        params: {
                            identidad: variables.identidad,
                            arrayidelaborarpagos: Ext.encode(arrayidelaborarpagos),
                            personas: Ext.encode(personas)
                            //nuevo
                            , totalpersonasnotificar: total
                        },
                        callback: function (options, success, response) {

                            var respuesta = Ext.decode(response.responseText);

                            if (respuesta == true) {
                                PVD.ocultarMascara('idmaskemail');
                                mostrarMensaje(1, 'Los trabajadores de la empresa fueron notificados satisfactoriamente');
                            }
                            else if (respuesta == false) {
                                PVD.ocultarMascara('idmaskemail');
                                mostrarMensaje(2, 'No se pudo realizar la notificación');
                            }
                        }
                    });

                } else return;
            });
        }

    }
};
