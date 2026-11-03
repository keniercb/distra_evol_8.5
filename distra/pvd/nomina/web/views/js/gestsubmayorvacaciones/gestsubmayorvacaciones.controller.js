Ext.ns('Pvd.Nomina.Submayor.Vacaciones');

//Controlador de la vista del componente Gestionar retenciones. 
Pvd.Nomina.Submayor.Vacaciones.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma            Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista             Vista general del componente Gestionar retenciones (Tipo: Pvd.Nomina.Pago.Retencion.Vista)
     * @param modelo            Modelo de la vista del componente Gestionar retenciones (Tipo: Pvd.Nomina.Pago.Retencion.Modelo)
     */
    init: function (idioma, vista, modelo) {

        var variablesGenerales = {
            identidad: 0,
            idpersona: 0,
            idpersonabaja: 0,
            accion: 'Add',
            cambio: 0,
            cambiobajas: 0,
            flagaddmod: 0,
            cambioHis: 0,
            accionHis: 'Add',
            arrayidpersonas: new Array(),
            idmes: null,
            anno: null,
            datos: null,
            datosbajas: null,
            periodos: new Array(),
            modocuadre: 1,
            camposdias: new Array(),
            camposimporte: new Array(),
            formato: 1,
            esbaja: 0
        };

        vista.gpHistVac.getSelectionModel().on('rowselect', function (sm, rowIdx, r) {
            variablesGenerales.datos = r.data;
        }.createDelegate(this));

        //bajas
        vista.gpHistVacBajas.getSelectionModel().on('rowselect', function (sm, rowIdx, r) {
            variablesGenerales.datosbajas = r.data;
        }.createDelegate(this));

        vista.btnDatos.setHandler(function () {
            vista.datosgeneralesub.CompletarDatos(variablesGenerales.datos, variablesGenerales.idpersona);
            vista.datosgeneralesub.show();
        }.createDelegate(this));

        //bajas
        vista.btnDatosBajas.setHandler(function () {
            vista.datosgeneralesubbajas.CompletarDatos(variablesGenerales.datosbajas, variablesGenerales.idpersonabaja);
            vista.datosgeneralesubbajas.show();
        }.createDelegate(this));

        vista.winGestVacaciones.show();
        //vista.winEstructura.show();
        modelo.storeFormula.load();
        //Se deshabilitan los botones de gestionar retenciones.
        vista.btnAdicionarVac.disable();
        vista.btnModificarVac.disable();
        vista.btnEliminarVac.disable();

        //vista del btnLimpiar boton limpiar personas derechos
        vista.btnLimpiar.setHandler(function () {
            modelo.storePersonasDerechoSubmayor.load(
                {
                    params: {
                        identidad: vista.idestructura,
                        start: 0,
                        limit: 5000,
                        texto: vista.tfbuscar.setValue('')
                    }
                });
        });
        //vista del btnLimpiarBajas boton limpiar personas bajas
        vista.btnLimpiarBajas.setHandler(function () {
            modelo.storePersonasDerechoSubmayorBajas.load(
                {
                    params: {
                        identidad: vista.idestructura,
                        start: 0,
                        limit: 5000,
                        texto: vista.tfbuscarBajas.setValue('')
                    }
                });
        });


        //Evento del componente de entidades
        vista.pobjestructura.on('estructuraselecionada', function (sm, nodo) {

            //if (nodo.attributes.tipoestructura == 3 || nodo.attributes.tipoestructura == 5) {
                vista.btnAceptarEntidad.enable();
                vista.btnEliminarPersonas.disable();
                variablesGenerales.identidad = nodo.id;
                vista.idestructura = nodo.id;
                vista.gpPersonas.CambiarEntidad(vista.idestructura);
                modelo.storePersonasDerechoSubmayor.load({
                    params: {
                        idestructura: vista.idestructura,
                        start: 0,
                        limit: 15
                    }
                });

                modelo.storePersonasDerechoSubmayorBajas.load({
                    params: {
                        idestructura: vista.idestructura,
                        start: 0,
                        limit: 15
                    }
                });
                //Habilitando el boton de exportar
                vista.btnNotificarVac.enable();
                vista.btnAdicionarPersonas.enable();
                vista.btnEliminarPersonas.enable();
                vista.btnEliminarPersonas.enable();
                vista.btnBuscar.enable();
                //vista.btnLimpiar.enable();
                vista.btnCargaInicial.enable();
                vista.btnMenuCuadrar.enable();

            /*} else {
                vista.btnNotificarVac.disable();
                vista.btnAdicionarPersonas.disable();
                vista.btnEliminarPersonas.disable();
                vista.btnBuscar.disable();
                vista.btnLimpiar.disable();
                vista.btnCargaInicial.disable();
                vista.btnMenuCuadrar.disable();
            }*/
            modelo.storePersonasDerechoSubmayor.removeAll();
            modelo.storePersonasDerechoSubmayorBajas.removeAll();
            modelo.storeVacHist.removeAll();
            modelo.storeVacHistBajas.removeAll();
            modelo.storeVac.removeAll();
            modelo.storeVacBajas.removeAll();
        }.createDelegate(this));

        vista.btnAdicionarPersonas.on('click', function () {
            vista.gpPersonas.Buscar();
            vista.winPersonas.show();
        });

        vista.btnAceptarPersonas.on('click', function () {
            vista.winPersonas.show();
            var selections = vista.gpPersonas.getSelectedRows();
            adicionarPersonasSubmayor(selections);
        });

        //Eventos del grid de persona.
        vista.gpPersonas.on('personaselecionada', function (sel) {
            vista.btnAceptarPersonas.enable();
        });

        vista.btnEliminarPersonas.on('click', function () {
            //Validando que la persona que se va a eliminar no tenga operaciones
            mostrarMensaje(2, 'Esta seguro que desea eliminar a <b>las personas seleccionadas</b> del Submayor de Vacaciones', function (btn) {
                if (btn == 'ok') {
                    var arrypersonass = Array();
                    var arrdatos = vista.gpPersonasDerecho.getSelectionModel().getSelections();
                    Ext.each(arrdatos, function (v) {
                        arrypersonass.push(v.data.idpersona);
                    });
                    PVD.mostrarMascara('idmaskval', 'Por favor espere...', 'Enviando datos');
                    Ext.Ajax.request({
                        url: 'validarEliminarPersonasDerecho',
                        params: {
                            identidad: variablesGenerales.identidad,
                            arrypersonas: Ext.encode(arrypersonass)
                        },
                        callback: function (options, succes, response) {
                            PVD.ocultarMascara('idmaskval');
                            var respuesta = Ext.decode(response.responseText);
                            if (respuesta.codigo == 'noexistenpersonasoperaciones') {
                                eliminarPersonasDerecho();
                            } else {
                                mostrarMensaje(3, 'No se pueden eliminar las personas personas: <b>' + respuesta.nombrespersona + '</b> del submayor de vacaciones ya que tienen hist&oacute;ricos de vacaciones acumuladas');
                            }
                        }
                    });
                }
            });
        });

        //altas
        vista.smPersonasDerecho.on('rowselect', function (sm, index, store) {


            //Se obtiene el id de la persona.
            variablesGenerales.idpersona = sm.getSelected().data.idpersona;
            vista.pfichadelapersona.resetIdEstructura(variablesGenerales.identidad);
            vista.pfichadelapersona.mostrarFicha(sm.getSelected().data.idpersona, variablesGenerales.identidad);

            //Se habilita el adicionar y se carga el store de vacaciones.
            vista.btnAdicionarVac.enable();

            //Desabilitando los botones de add, mod, del(historico)
            vista.btnAdicionarHisVac.disable();
            vista.btnAjustar.disable();
            vista.btnEliminarPersonas.enable();

            modelo.storeVac.load({params: {idpersona: variablesGenerales.idpersona}});

        });

        vista.smPersonasDerecho.on('rowdeselect', function (sm, index, store) {
            vista.btnAdicionarVac.disable();
            vista.btnModificarVac.disable();
            vista.btnEliminarVac.disable();
            modelo.storeVac.removeAll();
            modelo.storeVacHist.removeAll();
        });

        //Bajas
        vista.smPersonasDerechoBajas.on('rowselect', function (sm, index, store) {
            //Se obtiene el id de la persona.
            variablesGenerales.idpersonabaja = sm.getSelected().data.idpersona;
            vista.pfichadelapersonaBajas.resetIdEstructura(variablesGenerales.identidad);
            vista.pfichadelapersonaBajas.mostrarFicha(sm.getSelected().data.idpersona, variablesGenerales.identidad);
            modelo.storeVacBajas.load({
                params: {
                    identidad: variablesGenerales.identidad,
                    idpersona: variablesGenerales.idpersonabaja
                }
            });
            modelo.storeVacHistBajas.removeAll();
        });

        vista.smPersonasDerechoBajas.on('rowdeselect', function (sm, index, store) {
            modelo.storeVacBajas.removeAll();
            modelo.storeVacHistBajas.removeAll();
            (sm.selections.length == 1) ? vista.btnModificarVacBajas.enable() : vista.btnModificarVacBajas.disable();
        });

        vista.gpPersonas.on('personanoselecionada', function (sel) {
            if (vista.gpPersonas.getSelectedRows().length > 0) {
                vista.btnAceptarPersonas.enable();
            } else {
                vista.btnAceptarPersonas.disable();
            }
        });

        //Eventos del store de vacaciones de una persona.
        modelo.storeVac.on('beforeload', function (store) {
            store.baseParams.identidad = variablesGenerales.identidad;
            store.baseParams.idpersona = variablesGenerales.idpersona;

            //Se deshabilitan los botones y se limpia el store de retenciones.
            vista.btnModificarVac.disable();
            vista.btnEliminarVac.disable();
            store.removeAll();
        });

        //Eventos del store de submayor de vacaciones
        modelo.storePersonasDerechoSubmayor.on('beforeload', function (store) {
            store.baseParams.idestructura = vista.idestructura;
            // store.baseParams.idpersona = variablesGenerales.idpersona;
        });

        modelo.storePersonasDerechoSubmayorBajas.on('beforeload', function (store) {
            store.baseParams.idestructura = vista.idestructura;
            // store.baseParams.idpersona = variablesGenerales.idpersona;
        });

        modelo.storeVac.on('load', function (store) {
            vista.btnAdicionarVac.disable();
            if (store.getCount() == 0) {
                vista.btnAdicionarVac.enable();
            }
        });

        //Eventos del grid carga inicial vacaciones
        /*vista.gpVac.on('rowselect', function (e) {
            //mostrarVentanaModificarVac();
        });*/

        //altas
        vista.smVac.on('rowselect', function (sm, index, store) {
            modelo.CargarHistoricoSubMayor(store.data.idvacacionespersona);
            //Validando si la persona tiene o no operaciones para habilitar y desabilitar los Botones Mod y Elim
            PVD.mostrarMascara('idmaskop', idioma.lbMsgEsperaEnviarDatos, 'Por favor espere...');
            Ext.Ajax.request({
                url: 'buscarCantidadOperacionesPersonas',
                method: 'POST',
                params: {
                    idvacacionespersona: vista.smVac.getSelected().get('idvacacionespersona'),
                    identidad: variablesGenerales.identidad
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('idmaskop');
                    var responseData = Ext.decode(response.responseText);
                    //Si tiene operaciones en el Submayor
                    if (responseData.cantidad > 0) {
                        vista.btnModificarVac.disable();
                        vista.btnEliminarVac.disable();
                    }else{
                        vista.btnModificarVac.enable();
                        vista.btnEliminarVac.enable();
                    }
                }
            });
        });

        //bajas
        vista.smVacBajas.on('rowselect', function (sm, index, store) {
            vista.btnModificarVacBajas.enable();
            modelo.storeVacHistBajas.load({
                params: {
                    limit: 15,
                    start: 0,
                    idpersonabaja: store.data.idpersonabaja
                }
            });
        });

        vista.smHistVac.on('rowselect', function (sm, index, store) {
            vista.btnAjustar.enable();

            //Activando boton borrarAjustes
            var ajustetiempo = sm.selections.items[0].data.ajustetiempo;
            var ajusteimporte = sm.selections.items[0].data.ajusteimporte;
            (ajustetiempo > 0 || ajusteimporte > 0) ? vista.btnBorrarAjuste.enable() : vista.btnBorrarAjuste.disable();
        });

        vista.smHistVac.on('rowdeselect', function (sm, index, store) {
            vista.btnAjustar.disable();
        });

        //bajas
        vista.smHistVacBajas.on('rowselect', function (sm, index, store) {
            vista.btnAjustarBajas.enable();

            //Activando boton borrarAjustes
            var ajustetiempo = sm.selections.items[0].data.ajustetiempo;
            var ajusteimporte = sm.selections.items[0].data.ajusteimporte;
            (ajustetiempo > 0 || ajusteimporte > 0) ? vista.btnBorrarAjusteBajas.enable() : vista.btnBorrarAjusteBajas.disable();
        });

        vista.smHistVacBajas.on('rowdeselect', function (sm, index, store) {
            vista.btnAjustarBajas.disable();
        });

        //Eventos de los campos de gestionar vacaciones de persona. 
        vista.tfTiempoAcumInc.on('change', function (tf, n, o) {
            variablesGenerales.cambio = 1;
        });

        vista.tfImporteAcumInc.on('change', function (tf, n, o) {
            variablesGenerales.cambio = 1;
        });

        vista.dfFInicioVac.on('change', function (tf, n, o) {
            variablesGenerales.cambio = 1;
        });

        vista.dfFFinVac.on('change', function (tf, n, o) {
            variablesGenerales.cambio = 1;
        });

        //Bajas
        vista.tfTiempoAcumIncBajas.on('change', function (tf, n, o) {
            variablesGenerales.cambiobajas = 1;
        });

        vista.tfImporteAcumIncBajas.on('change', function (tf, n, o) {
            variablesGenerales.cambiobajas = 1;
        });

        vista.dfFInicioVacBajas.on('change', function (tf, n, o) {
            variablesGenerales.cambiobajas = 1;
        });

        vista.dfFFinVacBajas.on('change', function (tf, n, o) {
            variablesGenerales.cambiobajas = 1;
        });

        //Eventos de los botones de add/mod/elim vacaciones.
        vista.btnAdicionarVac.on('click', function () {
            mostrarVentanaAdicionarVac();
        });

        //altas
        vista.btnModificarVac.on('click', function () {
            mostrarVentanaModificarVac();
        });

        //bajas
        vista.btnModificarVacBajas.on('click', function () {
            mostrarVentanaModificarVacBajas();
        });

        vista.btnEliminarVac.on('click', function () {
            eliminarVacaciones();
        });

        vista.btnNotificarVac.menu.items.items[1].setHandler(function () {

            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();

            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/gestsubmayorvacaciones/exportarSubMayorGeneral?identidad=' + vista.idestructura);
            //PVD.ocultarMascara('rep01');
            winload.hideMask();
        });

        vista.btnNotificarVac.menu.items.items[2].setHandler(function () {
            var flag = 2;
            var params = 1;
            if (vista.smPersonasDerecho.getSelections().length > 0) {

                var personasseleccionadas = vista.smPersonasDerecho.getSelections();
                var arrayidpersonas = new Array();

                Ext.each(personasseleccionadas, function (rec) {
                    arrayidpersonas.push({
                        idpersona: rec.data.idpersona,
                    });
                });
                variablesGenerales.arrayidpersonas = arrayidpersonas;
                // console.info(variablesGenerales.arrayidpersonas);
            } else variablesGenerales.idpersona = variablesGenerales.idpersona;

            if (arrayidpersonas == null || arrayidpersonas.length == 0) {
                mostrarMensaje(3, 'No se pudo generar el reporte del submayor de vacaciones de individual debido a que no hay personas seleccionadas', function (btn) {
                })
            }
            else {
                var winload = new Ext.PVD.comun.window.winLoad({
                    title: 'Por favor espere...',
                    mensaje: 'Generando reporte'
                });

                winload.showMask();


                window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/gestsubmayorvacaciones/exportarSubMayorPorTrabajador?fechainicio=' + vista.dfFInicioFechas.getRawValue() + '&fechafin=' + vista.dfFFinFechas.getRawValue() + '&idpersona=' + variablesGenerales.idpersona + '&params=' + params + '&arrayidpersonas=' + Ext.encode(arrayidpersonas) + '&identidad=' + vista.idestructura);
                winload.hideMask();
                Ext.Ajax.request({
                    url: 'exportarSubMayorPorTrabajador',
                    method: 'POST',
                    params: {
                        fechainicio: vista.dfFInicioFechas.getRawValue(),
                        fechafin: vista.dfFFinFechas.getRawValue(),
                        idpersona: variablesGenerales.idpersona,
                        params: vista.params,
                        arrayidpersonas: Ext.encode(arrayidpersonas),
                        identidad: vista.idestructura

                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);

                    }
                });
            }

        });

        vista.btnNotificarVac.menu.items.items[3].setHandler(function () {
            var flag = 2;
            var params = 2;
            if (vista.smPersonasDerecho.getSelections().length > 0) {

                var personasseleccionadas = vista.smPersonasDerecho.getSelections();
                var arrayidpersonas = new Array();

                Ext.each(personasseleccionadas, function (rec) {
                    arrayidpersonas.push({
                        idpersona: rec.data.idpersona,
                    });
                });
                variablesGenerales.arrayidpersonas = arrayidpersonas;
                //  console.info(variablesGenerales.arrayidpersonas);
            } else variablesGenerales.idpersona = variablesGenerales.idpersona;

            if (vista.smPersonasDerecho.getSelections().length > 0) {

                var personasseleccionadas = vista.smPersonasDerecho.getSelections();
                var arrayidpersonas = new Array();

                Ext.each(personasseleccionadas, function (rec) {
                    arrayidpersonas.push({
                        idpersona: rec.data.idpersona,
                    });
                });
                variablesGenerales.arrayidpersonas = arrayidpersonas;
                //  console.info(variablesGenerales.arrayidpersonas);
            } else variablesGenerales.idpersona = variablesGenerales.idpersona;

            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });

            winload.showMask();


            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/gestsubmayorvacaciones/exportarSubMayorPorTrabajador?fechainicio=' + vista.dfFInicioFechas.getRawValue() + '&fechafin=' + vista.dfFFinFechas.getRawValue() + '&idpersona=' + variablesGenerales.idpersona + '&params=' + params + '&arrayidpersonas=' + Ext.encode(arrayidpersonas) + '&identidad=' + vista.idestructura);
            winload.hideMask();
            Ext.Ajax.request({
                url: 'exportarSubMayorPorTrabajador',
                method: 'POST',
                params: {
                    fechainicio: vista.dfFInicioFechas.getRawValue(),
                    fechafin: vista.dfFFinFechas.getRawValue(),
                    idpersona: variablesGenerales.idpersona,
                    params: vista.params,
                    identidad: vista.idestructura,
                    arrayidpersonas: Ext.encode(arrayidpersonas)

                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);

                }
            });


        });

        vista.btnAceptarSubMayor.on('click', function () {            
            var flag = 3;
            var params = 2;
            var limitetiempo = 1;

            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/gestsubmayorvacaciones/exportarSubMayorPorTrabajador?params=' + params + '&limitetiempo=' + limitetiempo + '&identidad=' + vista.idestructura + '&formato=' + variablesGenerales.formato);
            winload.hideMask();
            vista.ventanaSubMayor.hide();
        });

        vista.btnNotificarVac.menu.items.items[4].setHandler(function () {
            vista.ventanaSubMayor.show();
        });

        //exportarSubMayorPorTrabajador
        vista.radioPdfSubMayor.on('check', function (ch, checked) {
            if (checked == true)
                variablesGenerales.formato = 1;
        });

        vista.radioExcelSubMayor.on('check', function (ch, checked) {
            if (checked == true)
                variablesGenerales.formato = 2;
        });

        vista.btnNotificarVac.menu.items.items[5].setHandler(function () {
            vista.ventanaPeriodosPagos.show();
            variablesGenerales.fechainicioperiodo = null;
            variablesGenerales.fechafinperiodo = null;
            vista.btnAceptarPeriodosPagosSA.disable();
            vista.smPeriodosPago.clearSelections();
            modelo.stPeriodosPago.load({params: {idestructura: vista.idestructura}});
        });

        vista.btnCuadrarSub.setHandler(function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Cuadrando los datos de submayor de vacaciones...'
            });
            mostrarMensaje(2,
                '<b style="color: red">Con esta acci&oacute;n se cuadrar&aacute;n el submayor de vacaciones, de todas las personas de la entidad.</b>' +
                ' ¿Est&aacute; seguro que desea cuadrar el submayor de vacaciones?  ',
            function (btn) {
                if (btn == 'ok') {
                    winload.showMask();
                    Ext.Ajax.request({
                        url: 'cuadrarSubmayorDeserializacion',
                        method: 'POST',
                        autoAbort : true,
                        params: {
                            identidad: vista.idestructura
                        },
                        callback: function (options, success, response) {
                            
                            var responseData = Ext.decode(response.responseText);

                            if (responseData.status == 'success') {
                                Ext.Ajax.request({
                                    url: 'cuadrarHistoricoSubmayor',
                                    method: 'POST',
                                    params: {
                                        identidad: vista.idestructura
                                    },
                                    callback: function (options, success, response) {
                                        winload.close();
                                        var responseData = Ext.decode(response.responseText);
                                        if (responseData == 'ok') {                                            
                                            mostrarMensaje(1, idioma.lbMsgCorrectoCuadreVac, function (btn) {
                                                modelo.storePersonasDerechoSubmayor.load({params: {
                                                    idestructura: vista.idestructura,
                                                    start: 0,
                                                    limit: 15
                                                }});
                                                modelo.storeVac.load();
                                                modelo.storeVacHist.load();
                                            });
                                        }else if (responseData.status == 'error') {
                                            mostrarMensaje(3, responseData.message);
                                        }
                                    }
                                });

                                mostrarMensaje(1, idioma.lbMsgCorrectoCuadreVac, function (btn) {
                                    modelo.storePersonasDerechoSubmayor.load({params: {
                                        idestructura: vista.idestructura,
                                        start: 0,
                                        limit: 15
                                    }});
                                    modelo.storeVac.load();
                                    modelo.storeVacHist.load();
                                });

                            }else if (responseData.status == 'error') {
                                mostrarMensaje(3, responseData.message);
                            }
                        }
                    });
                }
            });
        });

        //Cuadrar submayor altas
        vista.btnMenuCuadrar.menu.items.items[0].setHandler(function () {
            mostrarMensaje(2,
                '<b style="color: red">Con esta acci&oacute;n se cuadrar&aacute;n todas las operaciones del submayor de vacaciones, de todas las personas de la entidad.</b>' +
                ' ¿Est&aacute; seguro que desea cuadrar las operaciones?  ',
                function (btn) {
                    if (btn == 'ok') {
                        PVD.mostrarMascara('idmaskcuadrarvac', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgCuadrarVac);
                        Ext.Ajax.request({
                            url: 'cuadrarSubMayorVacaciones',
                            method: 'POST',
                            params: {
                                identidad: vista.idestructura,
                                tipo: 1,
                                esbaja: 0
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('idmaskcuadrarvac');
                                var responseData = Ext.decode(response.responseText);
                                if (responseData == 'ok') {
                                    mostrarMensaje(1, idioma.lbMsgCorrectoCuadreVac, function (btn) {
                                        modelo.storePersonasDerechoSubmayor.load({params: {
                                            idestructura: vista.idestructura,
                                            start: 0,
                                            limit: 15
                                        }});
                                        modelo.storeVac.load();
                                        modelo.storeVacHist.load();
                                    });
                                }
                            }
                        });
                    }
                });
        });

        vista.btnMenuCuadrar.menu.items.items[1].setHandler(function () {
            variablesGenerales.esbaja = 0;
            modelo.stPeriodosPagoCuadrarSubmayor.load({params: {idestructura: vista.idestructura}});
            vista.ventanaPeriodosPagosCuadrarSubmayor.show();
        });

        vista.btnMenuCuadrar.menu.items.items[2].setHandler(function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/gestsubmayorvacaciones/cuadrarSubMayorVacaciones?identidad=' + vista.idestructura + '&tipo=3');
            winload.close();
        });

        vista.btnMenuCuadrar.menu.items.items[3].setHandler(function () {
            importarOperacionesPersonas();
        });

        vista.btnMenuCuadrar.menu.items.items[4].setHandler(function () {//Descuadres cargas iniciales y finales submayor
            vista.winPeriodosPagosDescCargasIyF.show();
            vista.smPeriodosPagoDescCargasIyF.clearSelections();
            modelo.stPeriodosPagoDescCargasIyF.load({params: {idestructura: vista.idestructura}});
        });

        vista.btnMenuCuadrar.menu.items.items[5].setHandler(function () {//Personas faltantes submayor
            vista.winPeriodosPagosDescSubmayor.show();
            vista.smPeriodosPagoDescSubmayor.clearSelections();
            modelo.stPeriodosPagoDescSubmayor.load(
                {
                    params: {
                        idestructura: vista.idestructura
                    }
                });
        });

        vista.btnMenuCuadrar.menu.items.items[6].setHandler(function () {//Personas faltantes nominas
            vista.winPeriodosPagosDescNomina.show();
            vista.smPeriodosPagoDescNomina.clearSelections();
            modelo.stPeriodosPagoDescNomina.load(
                {
                    params: {
                        idestructura: vista.idestructura
                    }
                });
        });

        //Cuadrar submayor bajas
        vista.btnMenuCuadrarBajas.menu.items.items[0].setHandler(function () {
            mostrarMensaje(2,
                '<b style="color: red">Con esta acci&oacute;n se cuadrar&aacute;n todas las operaciones del submayor de vacaciones, de las personas que causaron baja en la entidad.</b>' +
                ' ¿Est&aacute seguro que desea cuadrar las operaciones?  ',
                function (btn) {
                    if (btn == 'ok') {
                        PVD.mostrarMascara('idmaskcuadrarvac', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgCuadrarVac);
                        Ext.Ajax.request({
                            url: 'cuadrarSubMayorVacaciones',
                            method: 'POST',
                            params: {
                                identidad: vista.idestructura,
                                tipo: 1,
                                esbaja: 1
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('idmaskcuadrarvac');
                                var responseData = Ext.decode(response.responseText);
                                if (responseData == 'ok') {
                                    mostrarMensaje(1, idioma.lbMsgCorrectoCuadreVac, function (btn) {
                                        modelo.storePersonasDerechoSubmayorBajas.load({
                                            params: {
                                                idestructura: vista.idestructura,
                                                start: 0,
                                                limit: 15
                                            }
                                        });
                                        modelo.storeVacBajas.load();
                                        modelo.storeVacHistBajas.load();
                                    });
                                }
                            }
                        });
                    }
                });
        });

        vista.btnMenuCuadrarBajas.menu.items.items[1].setHandler(function () {
            variablesGenerales.esbaja = 1;
            modelo.stPeriodosPagoCuadrarSubmayor.load({params: {idestructura: vista.idestructura}});
            vista.ventanaPeriodosPagosCuadrarSubmayor.show();
        });



        //periodos pagos
        vista.smPeriodosPagoCuadrarSubmayor.on('rowselect', function (sm, rn, dataRecord) {
            var seleccion = sm.selections;
            (seleccion.length > 0) ? vista.btnAceptarPeriodosPagosCuadrarSubmayor.enable() : vista.btnAceptarPeriodosPagosCuadrarSubmayor.disable();
            variablesGenerales.periodos = seleccion.keys;
        });
        vista.smPeriodosPagoCuadrarSubmayor.on('rowdeselect', function (sm, rn, dataRecord) {
            var seleccion = sm.selections.keys;
            variablesGenerales.periodos = seleccion;
        });
        //campos dias
        vista.smCamposDias.on('rowselect', function (sm, rn, dataRecord) {
            var seleccion = sm.selections;
            variablesGenerales.camposdias = seleccion.keys;
        });
        vista.smCamposDias.on('rowdeselect', function (sm, rn, dataRecord) {
            var seleccion = sm.selections.keys;
            variablesGenerales.camposdias = seleccion;
        });
        //campos importe
        vista.smCamposImporte.on('rowselect', function (sm, rn, dataRecord) {
            var seleccion = sm.selections;
            variablesGenerales.camposimporte = seleccion.keys;
        });
        vista.smCamposImporte.on('rowdeselect', function (sm, rn, dataRecord) {
            var seleccion = sm.selections.keys;
            variablesGenerales.camposimporte = seleccion;
        });
        //checkbox modo cuadrar
        vista.chbModoCuadre.on('check', function (checkbox, checked) {
            variablesGenerales.modocuadre = checked ? 2 : 1;
        });

        //Cuadrar por nominas
        vista.btnAceptarPeriodosPagosCuadrarSubmayor.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Cuadrando los datos de submayor de vacaciones...'
            });
            mostrarMensaje(2,
                '<b style="color: red">Con esta acci&oacute;n se restaurar&aacute;n todas las operaciones ' +
                'del submayor de vacaciones, por las n&oacute;minas correspondientes a cada per&iacute;odo.</b>' +
                '¿Est&aacute seguro que desea cuadrar las operaciones de todas las persona en la entidad.?  ',
                function (btn) {
                    if (btn == 'ok') {
                        winload.showMask();
                        Ext.Ajax.request({
                            url: 'cuadrarSubMayorVacaciones',
                            method: 'POST',
                            params: {
                                identidad: vista.idestructura,
                                tipo: 2,
                                periodos: Ext.encode(variablesGenerales.periodos),
                                camposdias: Ext.encode(variablesGenerales.camposdias),
                                camposimporte: Ext.encode(variablesGenerales.camposimporte),
                                modocuadrar: variablesGenerales.modocuadre,
                                esbaja: variablesGenerales.esbaja
                            },
                            callback: function (options, success, response) {
                                winload.close();
                                var responseData = Ext.decode(response.responseText);
                                if (responseData == 'ok') {
                                    mostrarMensaje(1, idioma.lbMsgCorrectoCuadreVac, function (btn) {
                                    });

                                    if (variablesGenerales.esbaja == 0) { //altas
                                        modelo.storePersonasDerechoSubmayor.load({
                                            params: {
                                                idestructura: vista.idestructura,
                                                start: 0,
                                                limit: 15
                                            }
                                        });
                                        modelo.storeVac.load();
                                        modelo.storeVacHist.load();
                                    } else {//bajas
                                        modelo.storePersonasDerechoSubmayorBajas.load({
                                            params: {
                                                idestructura: vista.idestructura,
                                                start: 0,
                                                limit: 15
                                            }
                                        });
                                        modelo.storeVacBajas.load();
                                        modelo.storeVacHistBajas.load();
                                    }
                                    vista.ventanaPeriodosPagosCuadrarSubmayor.hide();
                                }
                            }
                        });
                    }
                });
        });

        vista.smPeriodosPago.on('rowselect', function (sm, index, store) {
            var seleccion = sm.selections;
            (seleccion.length > 0) ? vista.btnAceptarPeriodosPagosSA.enable() : vista.btnAceptarPeriodosPagosSA.disable();

            variablesGenerales.idmes = store.data.idmes;
            variablesGenerales.anno = store.data.anno;
        });

        vista.smPeriodosPago.on('rowdeselect', function (sm, rn, dataRecord) {
            var seleccion = sm.selections.keys;
            (seleccion.length > 0) ? vista.btnAceptarPeriodosPagosSA.enable() : vista.btnAceptarPeriodosPagosSA.disable();
        });

        //exportarListadoSaldosAcumuladosVacaciones
        vista.radioPdf.on('check', function (ch, checked) {
            if (checked == true)
                variablesGenerales.formato = 1;
        });

        vista.radioExcel.on('check', function (ch, checked) {
            if (checked == true)
                variablesGenerales.formato = 2;
        });

        vista.btnAceptarPeriodosPagosSA.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/gestsubmayorvacaciones/exportarListadoSaldosAcumuladosVacaciones?' +
                'identidad=' + vista.idestructura + '&mes=' + variablesGenerales.idmes + '&anno=' + variablesGenerales.anno + '&formato=' + variablesGenerales.formato);
            winload.hideMask();
            vista.ventanaPeriodosPagos.hide();
        });

        //exportarListadoSaldosInicialesFinalesPeriodosSubmayor
        vista.btnNotificarVac.menu.items.items[6].setHandler(function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/gestsubmayorvacaciones/exportarListadoSaldosInicialesFinalesPeridos?identidad=' + variablesGenerales.identidad);
            winload.hideMask();
        });

        vista.btnFormula.on('click', function () {
            //console.info(vista.btnNotificarVac);
            mostrarVentanaFormVac();
        });

        vista.btnCerrar.on('click', function () {
            vista.ventanaForm.hide();
        });

        vista.btnCargaInicial.on('click', function () {
            importarFileUploadField();
        });

        //Eventos del botón cancelar.
        vista.btnCancelarVac.on('click', function () {
            vista.ventanaVac.hide();
        });

        //Eventos del botón aceptar.
        vista.btnAceptarVac.on('click', function () {
            salvarFormularioVacaciones(false);
        });

        vista.btnAceptarVacBajas.on('click', function () {
            salvarFormularioVacacionesBajas(false);
        });

        vista.ventanaVac.on('beforeshow', function (ventana) {
            vista.tfTiempoAcumInc.focus(true, 500);
        });

        //Eventos de los campos de gestionar historico del submayor de vacaciones.
        vista.dfFechaOperacion.on('change', function (tf, n, o) {
            variablesGenerales.cambioHis = 1;
        });

        vista.nfTiempoAcumulado.on('change', function (tf, n, o) {
            variablesGenerales.cambioHis = 1;
        });

        vista.nfImporteAcumulado.on('change', function (tf, n, o) {
            variablesGenerales.cambioHis = 1;
        });

        vista.nfSaldoTiempo.on('change', function (tf, n, o) {
            variablesGenerales.cambioHis = 1;
        });

        vista.nfSaldoImporte.on('change', function (tf, n, o) {
            variablesGenerales.cambioHis = 1;
        });

        vista.nfPromedioImporte.on('change', function (tf, n, o) {
            variablesGenerales.cambioHis = 1;
        });

        vista.btnAjustar.on('click', function () {
            variablesGenerales.flagaddmod = 1;
            vista.ventanaHisVac.setTitle(idioma.lbTitleVentModificarHisVac);
            vista.ventanaHisVac.show();
            variablesGenerales.accionHis = 'Mod';
            //vista.formularioHisVac.getForm().loadRecord(vista.smHistVac.getSelected());
        });

        vista.btnAjustarBajas.on('click', function () {
            variablesGenerales.flagaddmod = 1;
            vista.ventanaHisVacBajas.setTitle(idioma.lbTitleVentModificarHisVac + " personas bajas");
            vista.ventanaHisVacBajas.show();
            variablesGenerales.accionHis = 'Mod';
        });

        vista.btnBorrarAjuste.on('click', function () {
            borrarAjustesOperacion(0);
        });

        vista.btnBorrarAjusteBajas.on('click', function () {
            borrarAjustesOperacion(1);
        });


        //Eventos del boton eliminar
        vista.btnEliminarHisVac.on('click', function () {
            delHistoricoVacaciones();
        });
        //Eventos del boton cancelar
        vista.btnCancelarHisVac.on('click', function () {
            vista.ventanaHisVac.hide();
        });
        //Eventos del boton aceptar
        vista.btnAceptarHisVac.on('click', function () {
            addModifyHistorico();
        });
        //Eventos de la ventana de historico
        vista.ventanaHisVac.on('beforeshow', function (ventana) {
            vista.formularioHisVac.getForm().reset();
            vista.dfFechaOperacion.focus(true, 500);
        });
        //Bajas
        vista.btnCancelarHisVacBajas.on('click', function () {
            vista.ventanaHisVacBajas.hide();
        });
        vista.btnAceptarHisVacBajas.on('click', function () {
            addModifyHistoricoBaja();
        });
        //Eventos de la ventana de historico
        vista.ventanaHisVacBajas.on('beforeshow', function (ventana) {
            vista.formularioHisVacBajas.getForm().reset();
            vista.dfFechaOperacion.focus(true, 500);
        });

        this.idexpresionmatematica = -1;

        vista.cbVarSubVac.on('select', function (combo, record, index) {
            this.idexpresionmatematica = record.data.idexpresionmatematica;
            vista.tfFormulaVar.setValue(record.data.expresionmatematica);
            vista.tfFormulaVar.enable();
        }.createDelegate(this));

        vista.tfFormulaVar.on('focus', function () {

            var objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: this.idexpresionmatematica,
                indicadores: modelo.indicadoresExpMat,
                agrupado: 1,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                operadoresMostrar: ['+', '-', '*', '/', 'pa', 'pc', 's', 'p'],
                mostrarDenominacion: false
            });
            objExpMat.on('expresionsalvada', function (arr) {
                objExpMat.close();
            });
            objExpMat.show();
        }.createDelegate(this));

        //Evento del Boton Buscar personas en el submayor
        vista.btnBuscar.setHandler(function () {

            modelo.storePersonasDerechoSubmayor.load(
                {
                    params: {
                        idestructura: vista.idestructura,
                        start: 0,
                        limit: 15,
                        texto: vista.tfbuscar.getValue()
                    }
                });

        });

        vista.tfbuscar.on('specialkey', function (btn, e) {
            if (e.getKey() == 13) {
                modelo.storePersonasDerechoSubmayor.load({
                    params: {
                        idestructura: vista.idestructura,
                        start: 0,
                        limit: 15,
                        texto: vista.tfbuscar.getValue()
                    }
                });
            }
            
        });

        //Evento del Boton Buscar personas bajas en el submayor
        vista.btnBuscarBajas.setHandler(function () {

            modelo.storePersonasDerechoSubmayorBajas.load(
                {
                    params: {
                        idestructura: vista.idestructura,
                        start: 0,
                        limit: 15,
                        texto: vista.tfbuscarBajas.getValue()
                    }
                });

        });

        vista.tfbuscarBajas.on('specialkey', function (btn, e) {
            if (e.getKey() == 13) {
                modelo.storePersonasDerechoSubmayorBajas.load({
                    params: {
                        idestructura: vista.idestructura,
                        start: 0,
                        limit: 15,
                        texto: vista.tfbuscarBajas.getValue()
                    }
                });
            }
            
        });


        //Evento del los botones exportar descuadres
        vista.btnAceptarPeriodosDescCargasIyF.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var fechaperiodo = vista.smPeriodosPagoDescCargasIyF.getSelected().get('idperiodo');
            var modocomp = (vista.radioSaldoFinalDescCargasIyF.getValue()) ? 1 : 2;
            modocomp = 1;

            window.open(document.location.protocol + '//' + window.location.host +
                '/pvd/nomina/index.php/gestsubmayorvacaciones/exportarDescuadreCargasInicialesFinales?identidad=' +
                variablesGenerales.identidad + '&fechaperiodo=' + fechaperiodo + '&modocomparacion=' + modocomp);
            winload.close();
        });

        vista.btnAceptarPeriodosDescSubmayor.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var fechaperiodo = vista.smPeriodosPagoDescSubmayor.getSelected().get('idperiodo');

            window.open(document.location.protocol + '//' + window.location.host +
                '/pvd/nomina/index.php/gestsubmayorvacaciones/exportarDescuadreNominaSubmayor?identidad=' +
                variablesGenerales.identidad + '&fechaperiodo=' + fechaperiodo + '&tipofaltante=' + 1);
            winload.close();
        });

        vista.btnAceptarPeriodosDescNomina.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var fechaperiodo = vista.smPeriodosPagoDescNomina.getSelected().get('idperiodo');

            window.open(document.location.protocol + '//' + window.location.host +
                '/pvd/nomina/index.php/gestsubmayorvacaciones/exportarDescuadreNominaSubmayor?identidad=' +
                variablesGenerales.identidad + '&fechaperiodo=' + fechaperiodo + '&tipofaltante=' + 2);
            winload.close();
        });

        function adicionarPersonasSubmayor(selections) {
            var arrayidpersonas = new Array();
            Ext.each(selections, function (s) {
                arrayidpersonas.push(s.data.idpersona);
            });
            PVD.mostrarMascara('idmasaddpers', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: 'adicionarpersonasSubmayorVacaciones',
                params: {
                    idestructura: vista.idestructura,
                    ridpersonas: Ext.encode(arrayidpersonas)
                },
                callback: function (options, succes, response) {
                    PVD.ocultarMascara('idmasaddpers');
                    mostrarMensaje(1, 'Las personas han sido adicionadas satisfactoriamente');
                    modelo.storePersonasDerechoSubmayor.load({
                        params: {
                            idestructura: vista.idestructura,
                            start: 0,
                            limit: 15
                        }
                    });
                    vista.winPersonas.hide();
                }
            });

        }

        function eliminarPersonasDerecho() {
            mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar a la persona del submayor de vacaciones?', function (btn) {
                if (btn == 'ok') {
                    var arrelementos = Array();
                    var arrypersonas = Array();
                    var arrdatos = vista.gpPersonasDerecho.getSelectionModel().getSelections();
                    Ext.each(arrdatos, function (v) {
                        arrelementos.push(v.data.idvacacionespersona);
                        arrypersonas.push(v.data.idpersona);
                    });
                    PVD.mostrarMascara('idmaskdelete', 'Por favor espere...', 'Enviando datos');
                    Ext.Ajax.request({
                        url: 'eliminarPersonasDerecho',
                        params: {
                            identidad: variablesGenerales.identidad,
                            arrelementos: Ext.encode(arrelementos),
                            arrypersonas: Ext.encode(arrypersonas)
                        },
                        callback: function (options, succes, response) {
                            PVD.ocultarMascara('idmaskdelete');
                            var respuesta = Ext.decode(response.responseText);
                            if (respuesta == 'ok') {
                                mostrarMensaje(1, 'La persona ha sido eliminada satisfactoriamente del submayor de vacaciones');
                            } else {
                                mostrarMensaje(1, 'No puede eliminar personas que ocupan cargo en la entidad');
                            }
                            vista.btnEliminarPersonas.disable();
                            modelo.storePersonasDerechoSubmayor.load({
                                params: {
                                    idestructura: vista.idestructura,
                                    start: 0,
                                    limit: 15
                                }
                            })
                        }
                    });
                }
            });
        }

        function mostrarVentanaAdicionarVac() {

            vista.ventanaVac.setTitle(idioma.lbTitleVentAdicionarVac);
            vista.ventanaVac.show();

            variablesGenerales.accion = 'Add';
        }

        function mostrarVentanaModificarVac() {

            vista.ventanaVac.setTitle(idioma.lbTitleVentModificarVac);
            vista.ventanaVac.show();

            vista.formularioVac.getForm().loadRecord(vista.smVac.getSelected());
            variablesGenerales.accion = 'Mod';
        }

        function mostrarVentanaModificarVacBajas() {
            vista.ventanaVacBajas.setTitle('Modificar datos de vacaciones bajas');
            vista.ventanaVacBajas.show();
            vista.formularioVacBajas.getForm().loadRecord(vista.smVacBajas.getSelected());
            variablesGenerales.accion = 'Mod';
        }

        function mostrarVentanaFormVac() {
            vista.ventanaForm.show();
            modelo.storeVariable.removeAll();
            modelo.storeVariable.load();
        }

        function addModifyHistorico() {
            var idpervac = vista.smVac.getSelected().get('idvacacionespersona');
            var idhisvacacionespersona =
                vista.gpHistVac.getSelectionModel().getSelected().get('idhisvacacionespersona');

            if (variablesGenerales.cambioHis == 0) {
                //Se oculta la ventana si no ha sido modificado ningún valor.
                vista.ventanaHisVac.hide();
            }
            //Se verifica si el formulario es válido.
            if (vista.formularioHisVac.getForm().isValid()) {
                //Se muestra la máscara de espera.
                PVD.mostrarMascara('idmaskaddmodhisvac', idioma.lbMsgEsperaEnviarDatos, 'Realizando ajustes a los saldos acumulados');

                //Enviando datos al servidor.
                Ext.Ajax.request({
                    url: 'actualizarDatosGeneralesHistoricoVacaciones',
                    method: 'POST',
                    params: {
                        idpervac: idpervac,
                        identidad: variablesGenerales.identidad,
                        idhisvacacionespersona: idhisvacacionespersona,

                        ajustetiempo: vista.nfSaldoTiempo.getValue(),
                        ajusteimporte: vista.nfSaldoImporte.getValue(),
                        tipoajuste: vista.cmboxTipoAjuste.getValue(),
                        observaciones: vista.tfDescripAreas.getValue()
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);

                        //Ocultando máscara de enviar datos.
                        PVD.ocultarMascara('idmaskaddmodhisvac');

                        if (responseData.codMsg == 1) {
                            mostrarMensaje(1, "Los datos del submayor han sido ajustados satisfactoriamente.", function () {
                                vista.ventanaHisVac.hide();
                                vista.formularioHisVac.getForm().reset();
                                modelo.storeVacHist.removeAll();
                                vista.btnAjustar.disable();
                                modelo.storeVacHist.load({params: {idvacacionespersona: vista.smVac.getSelected().get('idvacacionespersona')}});///////////////
                                variablesGenerales.cambioHis = 0;
                            });

                        } else {
                            mostrarMensaje(3, "El ajuste en días e importe no debe ser mayor al saldo final en días e importe de la operación seleccionada.");
                        }
                    }
                });
            } else {
                mostrarMensaje(3, idioma.lbErrorFormulario);
            }

        }

        function addModifyHistoricoBaja() {
            var idpervac = vista.smVacBajas.getSelected().get('idpersonabaja');
            var idhisvacacionespersonabaja =
                vista.gpHistVacBajas.getSelectionModel().getSelected().get('idhisvacacionespersonabaja');

            if (vista.formularioHisVacBajas.getForm().isValid()) {
                PVD.mostrarMascara('idmaskaddmodhisvac',
                    idioma.lbMsgEsperaEnviarDatos, 'Realizando ajustes a los saldos acumulados');
                Ext.Ajax.request({
                    url: 'actualizarDatosGeneralesHistoricoVacacionesBajas',
                    method: 'POST',
                    params: {
                        idpersonabaja: idpervac,
                        identidad: variablesGenerales.identidad,
                        idhisvacacionespersonabaja: idhisvacacionespersonabaja,

                        ajustetiempo: vista.nfSaldoTiempoBajas.getValue(),
                        ajusteimporte: vista.nfSaldoImporteBajas.getValue(),
                        tipoajuste: vista.cmboxTipoAjusteBajas.getValue(),
                        observaciones: vista.tfDescripAjusteBajas.getValue()
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('idmaskaddmodhisvac');
                        if (responseData.codMsg == 1) {
                            mostrarMensaje(1,
                                "Los datos del submayor han sido ajustados satisfactoriamente.", function () {
                                    vista.ventanaHisVacBajas.hide();
                                    vista.formularioHisVacBajas.getForm().reset();
                                    modelo.storeVacHistBajas.removeAll();
                                    vista.btnAjustarBajas.disable();
                                    modelo.storeVacHistBajas.load({
                                        params: {
                                            limit: 15,
                                            start: 0,
                                            idpersonabaja: vista.smVacBajas.getSelected().get('idpersonabaja')
                                        }
                                    });
                                });

                        } else {
                            mostrarMensaje(3, "El ajuste en días e importe no debe ser mayor al saldo final en días e importe de la operación seleccionada.");
                        }
                    }
                });
            } else {
                mostrarMensaje(3, idioma.lbErrorFormulario);
            }

        }

        function delHistoricoVacaciones() {
            //Mostrando el mensaje para aceptar la eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarHisVac, function (btn) {
                if (btn == "ok") {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarhisvac', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarVac);

                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarDatosGeneralesHisVacaciones',
                        method: 'POST',
                        //params: {idhisvacacionespersona : vista.gpHistVac.getSelectionModel().getSelected().get('idhisvacacionespersona')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarhisvac');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg) {
                                //Mostrando el mensaje de que se ha eliminado.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoHisVac, function (btn) {
                                    //Recargando el grid de vacaciones.
                                    modelo.storeVacHist.load({params: {idvacacionespersona: vista.smVac.getSelected().get('idvacacionespersona')}});
                                });
                            }
                        }
                    });
                }
            });
        }

        function salvarFormularioVacaciones(boton) {

            var urlAction = 'adicionarDatosGeneralesSubVacaciones';
            var idpervac = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarVac;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionarVac;
            var idvacacionespersona = vista.smPersonasDerecho.getSelected().get('iddatvacacionespersona');

            if (variablesGenerales.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarVac;
                lbMsgExito = idioma.lbMsgCorrectoModificadoVac;
                urlAction = 'modificarDatosGeneralesSubVacaciones';
                idpervac = vista.smVac.getSelected().get('idvacacionespersona');
            }
            if (variablesGenerales.cambio == 0) {
                if (variablesGenerales.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaVac.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfTiempoAcumInc.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tfImporteAcumInc.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido.
                if (vista.formularioVac.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodvac', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idpervac: idpervac,
                            tiempo: vista.tfTiempoAcumInc.getValue(),
                            importe: vista.tfImporteAcumInc.getValue(),
                            fechainicio: vista.dfFInicioVac.getRawValue(),
                            fechafin: vista.dfFFinVac.getRawValue(),
                            idpersona: variablesGenerales.idpersona,
                            identidad: variablesGenerales.identidad,
                            idvacacionespersona: idvacacionespersona,
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodvac');

                            if (responseData.codMsg == 1) {
                                mostrarMensaje(1, lbMsgExito, function () {
                                    vista.ventanaVac.hide();
                                    vista.formularioVac.getForm().reset();
                                    modelo.storeVac.removeAll();
                                    modelo.storeVac.load();
                                    variablesGenerales.cambio = 0;
                                });

                            } else if(responseData.codMsg == 2){
                                vista.ventanaVac.hide();
                                mostrarMensaje(3, "La persona ya tiene carga inicial asociada a este cargo en el submayor de vacaciones.")
                            } else {
                                if (responseData.codMsg)
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        function salvarFormularioVacacionesBajas(boton) {
            lbMsgEspera = idioma.lbMsgModificarVac;
            lbMsgExito = idioma.lbMsgCorrectoModificadoVac;
            urlAction = 'modificarDatosGeneralesSubVacacionesBajas';
            idpervac = vista.smVacBajas.getSelected().get('idpersonabaja');

            if (variablesGenerales.cambiobajas == 0) {
                //Se oculta la ventana si no ha sido modificado ningún valor.
                vista.ventanaVacBajas.hide();
            } else {
                //Se verifica si el formulario es válido.
                if (vista.formularioVacBajas.getForm().isValid()) {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodvacbajas', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idpervac: idpervac,
                            tiempo: vista.tfTiempoAcumIncBajas.getValue(),
                            importe: vista.tfImporteAcumIncBajas.getValue(),
                            fechainicio: vista.dfFInicioVacBajas.getRawValue(),
                            fechafin: vista.dfFFinVacBajas.getRawValue(),
                            idpersona: variablesGenerales.idpersonabaja,
                            identidad: variablesGenerales.identidad,
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodvacbajas');

                            if (responseData.codMsg == 1) {
                                mostrarMensaje(1, lbMsgExito, function () {
                                    vista.ventanaVacBajas.hide();
                                    vista.formularioVacBajas.getForm().reset();
                                    modelo.storeVacBajas.removeAll();
                                    modelo.storeVacBajas.load({
                                        params: {
                                            identidad: variablesGenerales.identidad,
                                            idpersona: variablesGenerales.idpersonabaja
                                        }
                                    });
                                    variablesGenerales.cambiobajas = 0;
                                });
                            } else {
                                if (responseData.codMsg)
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        function eliminarVacaciones() {
            //Mostrando el mensaje para aceptar la eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarVac, function (btn) {
                if (btn == "ok") {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarvac', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarVac);

                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarDatosGeneralesSubVacaciones',
                        method: 'POST',
                        params: {idpervac: vista.smVac.getSelected().get('idvacacionespersona')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarvac');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg) {
                                //Mostrando el mensaje de que se ha eliminado.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoVac, function (btn) {
                                    //Recargando el grid de vacaciones.
                                    modelo.storeVac.load();
                                });
                            }
                        }
                    });
                }
            });
        }

        function exportarNotificacionVacaciones() {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });

            winload.showMask();

            var iframecont = document.createElement("iframe");
            iframecont.src = document.location.protocol + '//' + document.location.host + '/pvd/nomina/index.php/gestsubmayorvacaciones/exportarNotificacionVacaciones?identidad=' + variablesGenerales.identidad;
            iframecont.style.display = 'none';
            that = this;
            iframecont.onload = function () {
                //PVD.ocultarMascara('rep01');
                winload.hideMask();
                //that.destroy();
            }
            document.body.appendChild(iframecont);

            //Enviando los datos al servidor.
            //window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/gestsubmayorvacaciones/exportarNotificacionVacaciones?identidad=' + variablesGenerales.identidad);
        }

        function importarFileUploadField() {
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

            var plantillaFotoImpCI = new Ext.XTemplate(
                '<div align="left">',
                '<img src="data:image/jpeg;base64,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"' +
                ' height=40 width="100%" style="border:1px transparent" />',
                '</div>'
            );
            plantillaFotoImpCI.compile();

            var panel = new Ext.FormPanel({
                fileUpload: true,
                width: 200,
                autoHeight: true,
                frame: true,
                bodyStyle: 'padding: 2px 2px 2px 2px;',
                labelWidth: 50,
                defaults: {
                    anchor: '100%',
                    allowBlank: false,
                    msgTarget: 'side'
                },
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Estructura del Excel',
                        height: 80,
                        width: '100%',
                        items: {
                            layout: 'column',
                            items: [
                                {columnWidth: 1, layout: 'form', items: [plantillaFotoImpCI]}
                            ]
                        }
                    },
                    {
                        xtype: 'fileuploadfield',
                        id: 'subir',
                        name: 'fileUpload',
                        width: 100,
                        fieldLabel: 'Archivo',
                        emptyText: 'Seleccione el archivo'
                    }]
            });

            function funcionaceptar() {
                if (panel.getForm().isValid()) {
                    PVD.mostrarMascara('impotarvac', 'Por favor espere...', 'Enviando datos');
                    panel.getForm().submit({
                        url: '/pvd/nomina/index.php/gestsubmayorvacaciones/importarCargaInicial',
                        success: function (fp, response) {
                            PVD.ocultarMascara('impotarvac');
                            var responseText = Ext.decode(response.response.responseText);
                            
                            if (responseText.texto == 'NO-PERSONA-DATOS-EXCEL') {
                                mostrarMensaje(3, 'A la persona:<b>' + responseText.nombre + '</b> le faltan datos para la carga inicial. Revise por favor el Excel, y si no la encuentra verifique que no es&eacute oculta');
                            } else if(responseText.personas.mach == -2){
                                mostrarMensaje(3, 'La(s) persona(s):<b> ' + responseText.personas.texto + '</b> ya tiene carga inicial en el submayor.');
                                importar.close();
                            } else {
                                if (responseText.mach == 1) {
                                    mostrarMensaje(1, 'La carga inicial fue actualizada correctamente', function (btn) {

                                    }.createDelegate(this));
                                } else {
                                    mostrarMensaje(3, 'No se pudo actualizar la carga inicial del submayor de vacaciones de las siguientes personas:<b>' + responseText.personas.texto + '</b>', function (btn) {
                                    });
                                }
                            }


                            modelo.storePersonasDerechoSubmayor.load({
                                params: {
                                    idestructura: vista.idestructura,
                                    start: 0,
                                    limit: 15
                                }
                            });
                        }.createDelegate(this),
                        params: {identidad: variablesGenerales.identidad},
                        failure: function (fp, response) {


                        }
                    });
                } else {
                    mostrarMensaje(2, 'Datos vacios');
                }
            }

            var importar = new Ext.Window({
                title: 'Importar Carga Inicial',
                width: 500,
                layout: 'fit',
                constrain: true,
                modal: true,
                items: [panel],

                buttons: [{
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    handler: function () {
                        importar.close();
                    }
                }, {
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    handler: function () {
                        funcionaceptar();
                    }
                }],
                keys: [
                    {
                        key: Ext.EventObject.ENTER,
                        stopEvent: true,
                        fn: function () {

                            funcionaceptar()
                        }
                    }, {
                        key: 'x',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            importar.close();
                        }
                    }
                ]
            });

            importar.show();
        }

        function importarOperacionesPersonas() {
            var panelOp = new Ext.FormPanel({
                fileUpload: true,
                width: 200,
                autoHeight: true,
                frame: true,
                bodyStyle: 'padding: 2px 2px 2px 2px;',
                labelWidth: 50,
                defaults: {
                    anchor: '100%',
                    allowBlank: false,
                    msgTarget: 'side'
                },
                items: [
                    {
                        xtype: 'fileuploadfield',
                        id: 'subir',
                        name: 'fileUpload',
                        width: 100,
                        fieldLabel: 'Archivo',
                        emptyText: 'Seleccione el archivo'
                    }]
            });

            function funcionaceptar() {
                if (panelOp.getForm().isValid()) {
                    panelOp.getForm().submit({
                        url: '/pvd/nomina/index.php/gestsubmayorvacaciones/importarOperacionesPersona?identidad=' + variablesGenerales.identidad + '&idpersona=' + variablesGenerales.idpersona,
                        success: function (fp, response) {
                            var responseText = Ext.decode(response.response.responseText);
                            importarOp.close();
                            if (responseText == 'ok') {
                                mostrarMensaje(1, 'Los datos fueron actualizados correctamente', function (btn) {
                                }.createDelegate(this));
                            } else {
                                mostrarMensaje(3, 'No se pudo realizar la importaci&oacute;n del submayor de vacaciones.');
                            }
                            modelo.storePersonasDerechoSubmayor.load({
                                params: {
                                    idestructura: vista.idestructura,
                                    start: 0,
                                    limit: 15
                                }
                            });
                        }.createDelegate(this),
                        params: {identidad: variablesGenerales.identidad},
                        failure: function (fp, response) {
                        }
                    });
                } else {
                    mostrarMensaje(2, 'Datos vacios');
                }
            }

            var importarOp = new Ext.Window({
                title: 'Importar Operaciones Persona',
                width: 500,
                layout: 'fit',
                constrain: true,
                modal: true,
                items: [panelOp],

                buttons: [{
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    handler: function () {
                        importarOp.close();
                    }
                }, {
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    handler: function () {
                        funcionaceptar();
                    }
                }],
                keys: [
                    {
                        key: Ext.EventObject.ENTER,
                        stopEvent: true,
                        fn: function () {

                            funcionaceptar()
                        }
                    }, {
                        key: 'x',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            importarOp.close();
                        }
                    }
                ]
            });

            importarOp.show();
        }

        function borrarAjustesOperacion(esbaja) {
            mostrarMensaje(2,
                '<b style="color: red">Con esta acci&oacute;n se borrar&aacute;n los ajustes realizados a la persona.</b>' +
                ' ¿Est&aacute; seguro que desea continuar?  ',
                function (btn) {
                    if (btn == 'ok') {

                        PVD.mostrarMascara('idmaskborrarajuste',
                            idioma.lbMsgEsperaEnviarDatos, 'Borrando ajustes a la persona...');
                        Ext.Ajax.request({
                            url: 'borrarAjustesOperacion',
                            method: 'POST',
                            params: {
                                esbaja: esbaja,
                                identidad: variablesGenerales.identidad,
                                idvacacionespersona: (esbaja == 0) ?
                                    vista.smVac.getSelected().get('idvacacionespersona') :
                                    vista.smVacBajas.getSelected().get('idpersonabaja'),
                                idhisvacacionespersona: (esbaja == 0) ?
                                    vista.gpHistVac.getSelectionModel().getSelected().get('idhisvacacionespersona') :
                                    vista.gpHistVacBajas.getSelectionModel().getSelected().get('idhisvacacionespersonabaja')
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                PVD.ocultarMascara('idmaskborrarajuste');
                                var responseData = Ext.decode(response.responseText);
                                if (responseData == 'ok') {//console.log(vista.smVac.getSelected().get('idvacacionespersona'))
                                    mostrarMensaje(1,
                                        "Los ajustes han sido borrados satisfactoriamente.", function () {
                                            if (esbaja == 0) {
                                                vista.btnBorrarAjuste.disable();
                                                modelo.storePersonasDerechoSubmayor.load(
                                                //    {
                                                //    params: {
                                                //        identidad: vista.idestructura,
                                                //        start: 0,
                                                //        limit: 5000
                                                //    }
                                                //});
                                                //modelo.storeVac.load({
                                                //    params: {
                                                //        idestructura: vista.smVac.getSelected().get('idvacacionespersona')
                                                //    }
                                                //}
                                                );
                                                modelo.storeVacHist.load();
                                            } else {
                                                vista.btnBorrarAjusteBajas.disable();
                                                modelo.storePersonasDerechoSubmayorBajas.load(
                                                //{
                                                //    params: {
                                                //        identidad: vista.idestructura,
                                                //        start: 0,
                                                //        limit: 5000
                                                //    }
                                                //}
                                                );
                                                modelo.storeVacBajas.load();
                                                modelo.storeVacHistBajas.load();
                                            }
                                        });
                                }
                            }
                        })
                    }
                });
        }
    }
};
