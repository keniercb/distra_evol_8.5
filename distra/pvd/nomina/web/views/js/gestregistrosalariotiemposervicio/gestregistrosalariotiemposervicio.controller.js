/*Componente para gestionar el registro de Salarios y tiempo de servicio (SNC - 225)
 *@author 1er Tte. Frank Rodriguez Berroa
 *@email fberroa@xetid.cu
 */
Ext.ns('Pvd.Nomina.Submayor.GestRegistroSalarioTiempoServicio');

//Controlador de la vista del componente Gestionar registro de salarios y tiempo de servicios.
Pvd.Nomina.Submayor.GestRegistroSalarioTiempoServicio.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma            Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista             Vista general del componente Gestionar registro de salarios y tiempo de servicios (Tipo: Pvd.Nomina.Submayor.GestRegistroSalarioTiempoServicio.Vista)
     * @param modelo            Modelo de la vista del componente Gestionar registro de salarios y tiempo de servicios (Tipo: Pvd.Nomina.Submayor.GestRegistroSalarioTiempoServicio.Modelo)
     */
    init: function (idioma, vista, modelo) {
        var accion = 'ADD';
        var variables = {
            identidad: vista.idestructura,
            idelaborarpagosrestformespecifica: null,
            arridelaborarpagos: new Array(),
            idexpresionmatematica: null,
            todosannos: 1
        };
        vista.winEstructura.show();
        modelo.storeCbMeses.load();
        modelo.storeCbTipoNomina.load();

        //Evento del componente de entidades
        vista.pobjestructura.on('estructuraselecionada', function (sm, nodo) {
            vista.btnAceptarEntidad.enable();
            vista.idestructura = nodo.id;
            variables.identidad = nodo.id;
        }.createDelegate(this));

        //Evento del botón de estructuras.
        vista.btnAceptarEntidad.setHandler(function () {
            vista.winRegSalario.show();
            vista.gpPersonas.CambiarEntidad(vista.idestructura);
            vista.gpPersonasHistorico.CambiarEntidad(vista.idestructura);
            vista.btnExportaSNC.disable();
            vista.btnExportaSNC09.disable();
            vista.gpPersonas.Buscar();
            vista.gpPersonasHistorico.Buscar();
        }.createDelegate(this));

        //Eventos del botón exportar SNC-4-08.
        vista.btnExportaSNC.setHandler(function () {
            variables.todosannos = (vista.chbTipoExportModeloSC408.checked) ? 1 : 0;
            (vista.chbTipoExportModeloSC408.checked) ? vista.cbAnnosModeloSC408.disable() : vista.cbAnnosModeloSC408.enable();
            vista.ventanaExportarSC408.show();
        });

        vista.chbTipoExportModeloSC408.on('check', function (Checkbox, checked) {
            variables.todosannos = (checked) ? 1 : 0;
            (checked) ? vista.cbAnnosModeloSC408.disable() : vista.cbAnnosModeloSC408.enable();
        });

        vista.btnAceptarModeloSC408.setHandler(function () {
            exportarSNC225(1);
        });

        //Eventos del botón exportar SNC-4-09.
        vista.btnExportaSNC09.setHandler(function () {
            vista.ventanaExportarSC409.show();
        });

        vista.btnAceptarModeloSC409.setHandler(function () {
            exportarSNC225(2);
        });

        //Evento del selmodel del gris de personas
        vista.gpPersonas.on('personaselecionada', function (sel) {
            vista.idpersona = sel.data.idpersona;
           vista.pfichadelapersona.mostrarFicha(sel.data.idpersona);
            vista.btnExportaSNC.enable();
            vista.btnExportaSNC09.enable();
            modelo.storeRegistroSalario.load({ params: { idpersona: sel.data.idpersona, idestructura: vista.idestructura, start: 0, limit: 20 }});            vista.btnAdicionar.enable();
            vista.btnExportarSNCRango.enable();
        });

        //Evento del selmodel del gris de personas
        vista.gpPersonasHistorico.on('personaselecionada', function (sel) {
            vista.idpersona = sel.data.idpersona;
            vista.pfichadelapersona.mostrarFicha(sel.data.idpersona);
            vista.btnExportaSNC.enable();
            vista.btnExportaSNC09.enable();
            modelo.storeRegistroSalario.load({ params: { idpersona: sel.data.idpersona, idestructura: vista.idestructura, start: 0, limit: 20 } });
            vista.btnAdicionar.enable();
        });

        //Eventos de los botones
        vista.btnAdicionar.setHandler(function () {
            accion = 'ADD';
            vista.cbAnnos.setValue('');
            vista.cbMeses.setValue('');
            vista.cbTiposNomina.setValue('');
            vista.nfDiasAcumulados.setValue('');
            vista.nfSalarioDevengado.setValue('');
            vista.ventanaRegSalario.show();
        });

        vista.btnModificar.setHandler(function () {
            accion = 'MOD';
            vista.cbAnnos.setValue(vista.gpRegSalario.getSelectionModel().getSelected().get('anno'));
            vista.cbMeses.setValue(vista.gpRegSalario.getSelectionModel().getSelected().get('mes'));
            vista.cbTiposNomina.setValue(vista.gpRegSalario.getSelectionModel().getSelected().get('idtiponomina'));
            vista.nfDiasAcumulados.setValue(vista.gpRegSalario.getSelectionModel().getSelected().get('diasacumulados'));
            vista.nfSalarioDevengado.setValue(vista.gpRegSalario.getSelectionModel().getSelected().get('salariodevengado'));
            vista.ventanaRegSalario.show();
        });

        vista.btnCancelar.setHandler(function () {
            vista.ventanaRegSalario.hide();
        });

        //Menu button restaurar snc
        vista.winPeriodosPagos.on('hide', function () {
            vista.objListarPeriodosPagos.stPeriodosPago.removeAll();
            vista.objListarPeriodosPagos.stPeriodosPagoExportar.removeAll();
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
        });

        //Evento del boton aceptar periodos de pago especificos
        vista.btnAceptarPeriodosPagos.setHandler(function () {
            var cont = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
            var todos = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0, cont - 1);
            var contarraux = 0;
            for (var i = 0; i < cont; i++) {
                variables.arridelaborarpagos[contarraux] = todos[i].data.idelaborarpagos;
                contarraux++;
            }
            vista.ventanaTipoConfiguracionFormula.show();
        });

        //Evanto restaurar general
        vista.btnRestaurar.menu.items.items[0].setHandler(function () {
            variables.idexpresionmatematica = null;
            restaurarSNC225(1);
        });

        //Evento restaurar especifico
        vista.btnRestaurar.menu.items.items[1].setHandler(function () {
            vista.ventanaTipoBusqueda.show();
        });

        //Evento cancelar tipo configuracion formula
        vista.btnCancelarTipoConfiguracionFormula.on('click', function () {
            vista.ventanaTipoConfiguracionFormula.hide();
        });

        vista.btnExportarSNCRango.on('click', function () {
            vista.ventanaExportarSNC.show();
        });

        vista.btnCancelarExportarSNC.on('click', function () {
            vista.ventanaExportarSNC.hide();
        });

        vista.btnAceptarExportarSNC.on('click', function () {
            var idpersona = vista.idpersona;
            var idestructura = vista.idestructura;
            var idtiponomina = vista.cbTiposNominaExp.getValue();
            var fechadesde = vista.dfFechaDesde.getRawValue();
            var fechahasta = vista.dfFechaHasta.getRawValue();

            window.open(
                document.location.protocol +
                '//' + window.location.host +
                '/pvd/nomina/index.php/gestregistrosalariotiemposervicio/exportarRegistroSalarioRangoFecha?idestructura=' + idestructura + '&idpersona=' + idpersona + '&idtiponomina=' + idtiponomina + '&fechadesde=' + fechadesde + '&fechahasta=' + fechahasta);

            vista.ventanaExportarSNC.hide();
        });

        //Evento aceptar tipo configuracion formula
        vista.btnAceptarTipoConfiguracionFormula.on('click', function () {
            vista.ventanaTipoConfiguracionFormula.hide();
            var tipoconfiguracionformula = 1;
            //Si se va a restaurar desde una configuracion de formula actual
            if (vista.rbConfiguracionFormulaActual.getGroupValue() == 1) {
                restaurarSNC225(2);
                //Si se va a restaurar desde una configuracion de formula con campos de nominas antiguos
            } else {
                var contep = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
                var todosep = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0, contep - 1);
                var flagep = 1;
                if (contep > 0) {
                    for (var i = 0; i < contep; i++) {
                        //A partir de la 2da iteracion
                        if (i != 0) {
                            var idtipopagoanterior = todosep[i - 1].data.idtipopago;
                            var idtipopagoactual = todosep[i].data.idtipopago;
                            if (idtipopagoactual != idtipopagoanterior) {
                                //Hay tipos de pago diferentes
                                flagep = 0;
                                break;
                            }
                        }
                        variables.idelaborarpagosrestformespecifica = todosep[i].data.idelaborarpagos;
                    }
                    //Si hay tipos de pago diferentes
                    if (flagep == 0) {
                        mostrarMensaje(3, 'Por favor escoja peri&oacute;dos de pago de un mismo tipo para restaurar');
                    } else {
                        cargarIndicadoresExpresionMatematica();
                    }
                } else {
                    mostrarMensaje(3, 'Por favor escoja peri&oacute;dos de pago v&aacute;lidos para restaurar');
                }
            }
        });

        function cargarIndicadoresExpresionMatematica() {
            //Hago la peticion para cargar los datos iniciales
            //PVD.mostrarMascara('idmaskgetindexpmat', 'Por favor espere...', 'Cargando los datos de los indicadores');
            Ext.Ajax.request({
                url: 'obtenerIndicadoresExpresionMatematica',
                method: 'POST',
                params: { idelaborarpagosrestformespecifica: variables.idelaborarpagosrestformespecifica },
                callback: function (options, success, response) {
                    //PVD.ocultarMascara('idmaskgetindexpmat');
                    modelo.datosModelo = Ext.decode(response.responseText);
                    variables.idelaborarpagosrestformespecifica = null;
                    mostrarComponenteExpresionMatematicaRestaurar();
                }.createDelegate(this)
            });
        }

        function mostrarComponenteExpresionMatematicaRestaurar() {
            var ind = modelo.ConvertiraArreglo(modelo.datosModelo.indicadores);

            this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: -1,
                indicadores: ind,
                agrupado: 1,
                mostrarCondicionales: true,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                operadoresMostrar: [],
                mostrarDenominacion: false,
                //Ojo que esta variable se usa solo en esta funcionalidad para obtener un temporal del arreglo de exp matematicas para evaluar en el momento.
                // Las demas funcionalidades si guardan las formulas en la base de datos.
                devolverarregloindicadores: true
            });
            this.objExpMat.on('expresionsalvada', function (arr) {
                variables.idexpresionmatematica = arr.idexpresionmatematica;
                restaurarSNC225(2);
                this.objExpMat.close();
            }.createDelegate(this));

            this.objExpMat.show();
        }

        vista.btnCancelarTipoBusqueda.on('click', function () {
            vista.ventanaTipoBusqueda.hide();
        });

        vista.btnAceptarTipoBusqueda.on('click', function () {
            vista.ventanaTipoBusqueda.hide();
            vista.objListarPeriodosPagos.CambiarEntidad(vista.idestructura);
            vista.winPeriodosPagos.show();
        });

        vista.btnImportarSNC.on('click', function () {
            importarSNC();
        });

        vista.btnAceptar.setHandler(function () {
            var msg = (accion == 'ADD') ? ' adicionada ' : ' modificada ';
            if (vista.formularioRegSalario.getForm().isValid()) {
                PVD.mostrarMascara('idmaskadd', 'Por favo espere...', 'Enviando datos');
                Ext.Ajax.request({
                    url: (accion == 'ADD') ? 'adicionarRegistroSalario' : 'modificarRegistroSalario',
                    params: {
                        idpersona: vista.idpersona,
                        anno: vista.cbAnnos.getRawValue(),
                        mes: isNaN(vista.cbMeses.getValue()) ? vista.gpRegSalario.getSelectionModel().getSelected().get('idmes') : vista.cbMeses.getValue(),
                        idtiponomina: vista.cbTiposNomina.getValue(),
                        diasacum: vista.nfDiasAcumulados.getValue(),
                        salariodev: vista.nfSalarioDevengado.getValue(),
                        idestructura: vista.idestructura,
                        idregistrosalario: (accion == 'ADD') ? '' : vista.gpRegSalario.getSelectionModel().getSelected().get('idregistrosalariotiemposervicio')
                    },
                    callback: function (options, succes, response) {
                        var respuesta = Ext.decode(response.responseText);
                        PVD.ocultarMascara('idmaskadd');
                        if (respuesta == 'ok') {
                            mostrarMensaje(1, 'La certificaci&oacute;n de salarios y tiempo de servicio fue' + msg + 'satisfactoriamente');
                            modelo.storeRegistroSalario.reload();
                        }
                        vista.ventanaRegSalario.hide();
                    }
                });
            }
        });

        vista.btnEliminar.setHandler(function () {
            mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar el registro de salarios y tiempo de servicio seleccionado?', function (btn) {
                if (btn == 'ok') {
                    PVD.mostrarMascara('idmaskdel', 'Por favor espere...', 'Enviando datos');
                    Ext.Ajax.request({
                        url: 'eliminarRegistroSalario',
                        params: { idregistrosalariotiemposervicio: vista.idregistrosalario },
                        callback: function (option, succes, response) {
                            PVD.ocultarMascara('idmaskdel');
                            var respuesta = Ext.decode(response.responseText);
                            if (respuesta == 'ok') {
                                mostrarMensaje(1, 'El registro de salarios y tiempo de servicio se elimin&oacute; satisfactoriamente');
                                modelo.storeRegistroSalario.reload();
                            }
                        }
                    });
                }
            });
        });

        vista.smRegSalario.on('rowselect', function (sm, index, record) {
            if (record.data.idtiponomina && (record.data.registrotiponominamanual == 0 || record.data.registrotiponominamanual == null)) {
                vista.btnModificar.disable();
                vista.btnEliminar.disable();
            } else {
                vista.btnModificar.enable();
                vista.btnEliminar.enable();
            }
            vista.idregistrosalario = record.data.idregistrosalariotiemposervicio;
        });

        function restaurarSNC225(tipo) {
            mostrarMensaje(2, '¿Est&aacute; seguro que desea restaurar el submayor? Todos los datos generados por las n&oacute;minas ser&aacute;n borrados y restaurados.', function (btn) {
                if (btn == 'ok') {
                    //Si se va a restaurar a partir de los reportes sincronizados en dat_datoscertificadoselaborarpagos o se va a restaurar a partir de los reportes de dat_reportesycertificaciones que son los actuales
                    var tiporeportebusqueda = 1;
                    if (tipo == 2) {
                        if (vista.rbReportesGuardadosSincBD.getGroupValue() == 1) {
                            tiporeportebusqueda = 1;
                        } else {
                            tiporeportebusqueda = 2;
                        }
                    }
                    PVD.mostrarMascara('maskrest', 'Por favor espere...', 'Enviando datos');
                    Ext.Ajax.request({
                        url: 'restaurarSNC225',
                        timeout: 999999,
                        params: {
                            idestructura: vista.idestructura,
                            tipo: tipo,
                            tiporeportebusqueda: tiporeportebusqueda,
                            arridelaborarpagos: Ext.encode(variables.arridelaborarpagos),
                            idexpresionmatematica: variables.idexpresionmatematica
                        },
                        callback: function (options, succes, response) {
                            var respuesta = Ext.decode(response.responseText);
                            PVD.ocultarMascara('maskrest');
                            if (respuesta == 'ok') {
                                mostrarMensaje(1, 'El registro de salarios y tiempo de servicio fue restaurado satisfactoriamente');
                                modelo.storeRegistroSalario.reload();
                            }
                            vista.winPeriodosPagos.hide();
                            variables.idexpresionmatematica = null
                        }
                    });
                }
            });

        }

        function exportarSNC225(tiporeporte) {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            
            var annos = -1;
            var ordenannos = -1;
            var reporte_name = '';
            
            if (tiporeporte == 1) {//SNC-04-08
                annos = (vista.chbTipoExportModeloSC408.checked) ? -1 : vista.cbAnnosModeloSC408.getRawValue();
                reporte_name = 'SNC-04-08';
            } else {//SNC-04-09
                ordenannos = (vista.radioDescSNC.checked) ? 2 : 1;
                reporte_name = 'SNC-04-09';
            }
            
            var url = document.location.protocol + '//' + document.location.host + '/pvd/nomina/index.php/gestregistrosalariotiemposervicio/exportarSNC225?idpersona='
                + vista.idpersona + '&idestructura=' + vista.idestructura + '&tiporeporte=' + tiporeporte + '&annos=' + annos + '&ordenannos=' + ordenannos;
            
            // Usar fetch para controlar la respuesta
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    // Crear link de descarga
                    var link = document.createElement('a');
                    var objectUrl = URL.createObjectURL(blob);
                    link.href = objectUrl;
                    link.download = reporte_name + '_' + Date.now() + '.pdf'; // Ej: SNC-04-08_1704067200000.pdf
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(objectUrl);
                    
                    // Ocultar máscara cuando se completa la descarga
                    winload.hideMask();
                })
                .catch(error => {
                    console.error('Error:', error);
                    winload.hideMask();
                    Ext.Msg.alert('Error', 'No se pudo generar el reporte');
                });
            
            (tiporeporte == 1) ? vista.ventanaExportarSC408.hide() : vista.ventanaExportarSC409.hide();
        }

        function importarSNC() {
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
                '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAhIAAABXCAYAAABRN6xJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABQVSURBVHhe7V3bTuxGFuU/5mn+gZfwAfMJ89Qj5YnnkeYDRvwBrxFBQQyIiHA4ISQdFISECAQhIUVKztt5z2/UuGxvd112lS9tuy5eS1pK3LbLtb323rW63fTZ+euvvwQIgiAIguAQwkiAIAiCIDiYMBIgCIIgCA4mjAQIgiAIgoM5iZH4448/2Ne35VTjgmkwtP4x5N/d3V05DzAdSs04LcE8KTXnXs+BrtgmMRK///47+/q2nGpcMA2G1j+G/Pv555+1RQqMn1IzTkswT+a8Trlim8RIvL+/s69vy6nGBdNgaP1jyL/1es0uVmC8lJpxWoJ5Mud1yhXbJEbi7e2NfX1bTjUumAZD6x9D/sFIpEcYiWUx53XKFdsoRuLPP//Utn/77TdteyxONS6YBkPrH0P+/fTTT+xiBcZLqRmnJZgnc16nXLFtbSSkifjxxx+113799Vdt28ez1Y7YWZ2x+0z2GTcfnonVTnGPGu6KgxfuuPy5nf4v4mBXvY8rccYe5+aw65v6SQ7XUNYat1ily/+JL//1hfibxn+K/z5yx6ZJsz/mTzvndw9emOPy5JzrVLl+qvd690C8MMeNRVdsWxkJMhFmoTw+PmrbTr4ciN3dlVgV7NLUO4+bFWVRKgvP2WryZImVw/WvGpvWzIrcOzhTj2nnsOsb+klKDYv5rHpeXzJPI5GXcTC5TCOx3Dc886xTTE8reLbq/wapD12xDTYSqokwC+Xh4UHbdvHlYLe8EfRf7hiVXcfNi0ZRluZrmUZiqP7StY/xjmjY9R1NdaAhvL29ZRerdJm/kZCacVrmy2UbiTnWqbF6Wl+6YhtkJEwTYRqJX375RdvmKT9qrpOt4+LYbdzcqBdlV9OVI4fpL+/fOC59+PW5pjqs2f7www/sYpUu8zcSUjNOy3y5bCMx/ToV7v66YuttJDgTYRqJTn83rZkHxVSYxylc5t9jy6SZ7xlYzBykv8yzkYzEsPwb10jc3Nywi1W65L4j8W9xxB6bJqVmnJb50uhZBYc8xkuVk69TVk9Tv/81rcFwxdbLSLhMhKR6nLnN0Xxn3eWddpdx86Ox4JTP16d9DhYrh+kv798492v49V1Gov+88jQSeX8isUwjMe2CFjOnX6dcvWP6++6KrbOR8JkISfXY9sKRAeuOtaK/sS6vICXN5FhukQ7Tv3LrY7wjGnZ9Xi9pnLv+tZLK77//nl2s0mX+RkJqxmmZL5fboySnX6eqnma/8Z7+vrti62Qk2kyEpHr89fW1tm2R/aJZe8NvHTdLGsmx4E8kBuvP/ZXES/+/2hh2fbu4SxMxsOA/fvzILlbpMn8jITXjtMyXyzYSs6xT5eMNc72c/r67Yms1El1MhKR6znfffadtm3R947TtXVrbuHlSJof6qc1yC3Qr/evCa+7jgO+aDLu+qd+waxPzNBLmdyS+EF9+4I5NkzASy+J865TdW6b+Ir4rNq+R6GoiJNXzvv32W217LE41LpgGQ+sfQ/7JdwTcYgXGy1neoYLRMOd1yhWb00j0MRGS6rnn5+fa9licalwwDYbWP4b8+/DhA7tYgfFSasZpCebJnNcpV2ydv2zZh6enp+zr23KqccE0GFr/GPIPRiI9wkgsizmvU67YJjES33zzDfv6tpxqXDANhtY/hvy7urpiFyswXkrNOC3BPJnzOuWKbRIj8fXXX7Ovb8upxgXTYGj9Y8i/v//nH2CC5LQE82TO65Qrtp339/fy3xh/fX0Vz8/P4unpqfyHOeRvat/f34u7u7vy39OXvxcv/4ZUfnFIOuzLy0txcXFRPjORH3ecnJyI4+NjcXR0JL766isQBCcgt0iB8ZPTEgRz4SSfSMiBxwb9eQuwTITWP4b8i2EOQD9As2UhZ719scFIAEkgtP4x5F8McwD6AZotCznr7YsNRgJIAqH1jyH/YpgD0A/QbFnIWW9fbDASQBIIrX8M+RfDHIB+gGbLQs56+2KDkQCSQGj9Y8i/GOYA9AM0WxZy1tsXG4xEUliLfXkf9g7F5/qVpSC0/jHkXwxzGB2fD8WejCvTnM5SMw2fxeGejHG/6E5DUPe0wefHhZz19sUGIzEIVDxmAWxbVG2AkQiFGPIvhjl0By0QOvcO1cyt62U/hyWEB8WdBMjUsVq5ACOhIim9e8IXG4zEIKhGQi04GImpEFr/0NeXiGEO3WHn6ufDvSqGjI2DiWQ0sz4Zkr2sSx+buuelhbRqtB98scFIDEJdPHt7tYOnIuKKynxntic2vqMq3r3DdX1eRdln1/v6doVNcz7k9jfjHRoun+ZFVObQgI5R98VjXGjuoRD6+hIxzKE7+NyhvK5ylqmX9X4Tp6T6rlitiVTMCM03etB9d91Xpy49NGT7U8+eGTlozjnCFxuMxCDUyV80yXX9LqsqFrMoqCBom/bXhdF8lGhu03jm+ZsC0xuxff6mH9iFWjVktXAr0DvGpvDrhrBpGuEg5yEZCqGvLxHDHLqDNxJ6jhm5KfO3Od7YZ+Ti58P9JBaXZDRTeof1xsGni7ntO7ZTf2rpmZEjGb0HwBcbjMQg1MldFoya+EZRMAux1kipsJxFKoeQ21REdnOm8crCtMYrQK+p7zTqeakvVdDH168dFnK+kqEQ+voSMcyhO3gjodeEne8qtPyrz7PGixxJaaYs9L57rfeFHhpy/ck8v61nRg66dznCFxuMxCDUyU8F0SQ/PaKoioItALVQRjQS2niMaeBoGwn1ekaMgUFzDoXQ15eIYQ7dwRsJvSZc+a6Sct/cxy9csYHmmxQUQ0G9y61LDw25/mSc39ozIwfFnCN8scFIDIK5yG6KYb8sorqoPO66rKURjYQ2HmMkOhchGY/6+x+xFG85p4KhEPr6EjHMoTt4I6HnM7+IUPrqx27ALjaRIi3NFFAfKMTw69JDww5Ggq7r7JmRo7xnBXOELzYYiUGok19tkoqL3xgBs5kaRTPUSBSsioq2jfG0ijOOaQXNQdJu4qEQWv/Q15eIYQ7dYRsJWhA2+anne7XfzPVqW+5rFpe+5jggUtFMu78Fqr5T9RmfLn00LHa2Gwk6x9MTY0Yqeg+BLzYYiUGok1s1EgWo+LSk1wyGY19PI8H9lUcJtlAlqKBVuguzagbFMUZ8IUHzDoXQ15eIYQ7dweWcufg7FpGa+/vSMJgLVk0rx+MEzTd+GPe34OYWd9Glg4adjEQBX8+MHDTnHOGLDUYCsBHhO76t9FcaU9nDZHw9F6Ktrj8SYpgD0A/QbFkYT28yWGTYhoBM3ThGzBdbGCNBz9+IzTtfd+C+IIBxoX6sGQv8+qvvpuzcaT62NQ1FD/DXN9592RdW3lltX8z8HICYAc2WBV5vV39iPo2pUfXgbXtGxkai+dhc6bpNo/cE7gsCGBHN4jdO8o0Fr/71nPf2qtyawgDx16d8LfJXNgTjURA9Ly73jXA/vfcAiBLQbFng9VaNhPpJr9tIxAg+tgozG4k2hwQjAfDw6V8t2EXOkAnSnESVU87vlZSgvCPaHyfSPh2bfD2sTcPmvHrf/iHTLPTGYl5v812bgspE6TUgHUCzZYHXu6732X8J2Ry/Qy80nhaoj7fpNQ7zGgmapN7FFWwas3mELwggf7j1pwVbZoy/MKu0M3PM3KYx9MWdv75yblPk9Ul1ru+vzTnZc9Q+xqzPo3HUX3Dk5wDEDGi2LPB61zW/N/cvIbvGd/RCOZ7ni/98bBVmNRLcYw0d5o3YwBcEkD+c+lsLr1qoEnVOKY8dqoW7LkbjfAl7DNf11XzdNItqWON1tVjlOWoNNKZj8//mYxIJfg5AzIBmywKvt9obmJ5BvaGtF1Hv8Cz2Wm+z9rf0QgPmPj62CvhEAkgCLv2tQrCKzV88nGmgPO1nJGisYty1ahb4ZsGRyqKaH3FTC/QakA6g2bLA660aiQJNf5n6l5D7Gwm99+j76DUO8xoJuhFK4DpgJAAevP6ULxypAFqKhzENVNCq36VxdRj52uS3Mr5ZzMz1XDAbCz8HIGZAs2WB19swEkpPmPaXkPsZCbPvmSaDj63CzF+2pMkVVLt0cQOrmwcjAfBg9XcsyvoC3GIkrP12cUqw17fylc71jefOcQk59yYeIz5+DkDMgGbLAq933QOUHtSYgpJGb3D1jlmMhNEXYzUSEtToGzaBuZusLwggf9j6U5FsEr2B9smXv3hKaEVN5+mwry9h56tuYspXrGLfnKeS9tPxNRXDTa8B6QCaLQu83nVNKz1IonlTrfYGXy+a2EiYfUn/BVN/LgcxEkPgCyJPmEngSAo10TTQ8cxCmyBC6x9D/sUwh/lhN8vuCF8Dy9RsDsTZ33LW2xdbi5E4E6vixN2DF2afmzASY8BsoOY2jMSciCH/xp8D5YjkkIV6Dph53wfha2D+vOE+7bIf/6WPOPsb3e8c4YvNaSReDnaLk1bioPgvjEQImA20b0ONs9CGIrT+MeTf6HOoPyqd8hdBt0ffvFcRvgbmzxv74+vmUXKcAg9EnP1tfr3ngy+21kcb0lDASHhQfyGOuHH+VUH7f1GRioGoFoXZQNu2C6hz2dsX++V+dUzz3YpehJtndgUjazo0r1AIfX2JsedQLTBF/tCzV1Nz43ntZrcnj8icdP31Peva5gLRkucFtXfbkdUAjTUfbCMhQXFtQqL7SjTvt62p/WzePFeiQ98z9CtJY0+o7Ryga+cIX2wwEttAFphVXNTwNkldFYNZoObxsk7UbXN/27bRQJqio+vRfMzz6/318VS46i8qxoDQ+oe+vsS4c6jzoezwdi5a+SS3y/9vyaPGfJjblFvG+X2NRJeai6gGxtWsC4x7UEP/ErB532Tom23rC8PaffGf21y/YCUprzc71pTazoRqTpGtUyPBFxuMxIioCspIbKWgqUCr3m020AJ1cVQvmYXUsm00wc1+vklKaA2DCtNoQLGgnFvBUAh9fYlR52Dkg3/xUNCWR5TXzgVBDiG367y06sDIW+Z8FdpY1tzC10A5XsH5YPedEmrsbb3H0NCvVwH1XOb6tkakLd3/GbSdCfJ6kjnCFxuMxJaokl0lFYnbSGhNi2FVkGYD9W/bRaMXGltURvHpsfDFHQo0r1AIfX2JMeegNWkJY/GgfFHXC4nWPDLGKV4w8ta4trUw6XnrPl+lK8fD1wCNNR94I6HF3qv3GOO1nttiJGq9q/tdX8c6VuV42s4BmneO8MUGI7EFKHmpB2oFwxSUdnxrkpsNtGXbGk8vNO565vwJbFEGhpyPZCiEvr7EeHOoc5OlpzFLtOXRxEbCzFltrAhrQI4hOR94I+G/Tzaa+3KoLvwFWs/tZiTovmx0trWYStspUcUU1zo1FnyxwUhsgSpRqRCoOZvblNy0TQ3V3DZhNuCWbbOB14VlzcfR4GUs3ZvF/Aitf+jrS4w2B4e+1HjL1y1DUORP+f/+PLLPM/NWXl5um3VS77fy1s5TZ81FWAPV9efMGzNGumfFa82KatxzDtqCT/dPou1c+/qq3rp+OqbUdi7Mr/d88MUGI7EVKNkr6r8ERolN3y6uj9GyWj+/IiW+WQht2wWa4ipYFFT1T9YqRas1B+PcZryac9r4DqB5hULo60uMMwfSWckLQpMfdV64FhNfHpkNn8lT3UiUL2zGsvLWPN9Xc3J3XDVAY80HrqdwhsjXeySUe9FoSfCdW+9TzuGNo8o5tJ0HdO0c4Yut1UgM4VK/bKnDLihgOELrH0P+xTAHoB+gmQ7LRNLiH9kbl6HIWW9fbDASkwFGYkyE1j+G/IthDkA/QDMV9qdTzacMMBLRwxcbjMRkgJEYE6H1jyH/YpgD0A/QzATzaCMTEyGRs96+2GAkgCQQWv8Y8i+GOQD9AM2WhZz19sU2mZGgi4IgCIIgmAc57Ly/v4u3tzfx+voqnp+fxdPTk3h8fBQPDw/i/v5e3N3difV6LW5vb8XNzY24vr4WV1dX4vLyUlxcXIjz83NxenoqTk5OxPHxsTg6OoKRAEEQBMEM+enTJ4vJPNqQkEEAy0Vo/WPIP9RAeoBmy0LOertig5EAkkFo/WPIP9RAeoBmy0LOertig5EAkkFo/WPIP9RAeoBmy0LOertig5EAkkFo/WPIP9RAeoBmy0LOertig5EAkkFo/WPIP9RAeoBmy0LOertig5EAkkFo/WPIP9RAeoBmy0LOerticxoJ+Y91yZMqrsQZc4yLMBLAFAitfwz5hxpID9BsWchZb1dsDiNxJlars2a7NBXKdhthJIApEFr/GPIPNZAeoNmykLPerti6Pdp4ORC7uwfihdvHEEYCmAKh9Y8h/1AD6QGaLQs56+2KrZuROFvhEwkgOELrH0P+oQbSAzRbFnLW2xVbu5GQn0bgOxJABAitfwz5hxpID9BsWchZb1dsXiNRfjeixyMNIowEMAVC6x9D/qEG0gM0WxZy1tsVm9NISBOxe/DC7msjjAQwBULrH0P+oQbSAzRbFnLW2xUbbyTk44we34kwCSMBTIHQ+seQf6iB9ADNloWc9XbFxhsJ+eXK4gSdu+LghTmWIYwEMAVC6x9D/qEG0gM0WxZy1tsVW/uXLQcQRgKYAqH1jyH/UAPpAZotCznr7YoNRgJIBqH1jyH/UAPpAZotCznr7YoNRgJIBqH1jyH/UAPpAZotCznr7YoNRgJIBqH1jyH/UAPpAZotCznr7Ypt5/39Xby9vYnX11fx/Pwsnp6exOPjo3h4eBD39/fi7u5OrNdrcXt7K25ubsT19bW4uroSl5eX4uLiQpyfn4vT01NxcnIijo+PxdHRUWkk5AVBEARBEMyHnz59spjUJxJywsByEVr/GPIPNZAeoNmykLPerthgJIBkEFr/GPIPNZAeoNmykLPefGxC/B+borCGk/r5kQAAAABJRU5ErkJggg=="width="430" height="70"/>',
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
                        height: 100,
                        width: '100%',
                        items: {
                            layout: 'column',
                            items: [
                                { columnWidth: 1, layout: 'form', items: [plantillaFotoImpCI] }
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
                    var winload = new Ext.PVD.comun.window.winLoad({
                        title: 'Por favor espere...',
                        mensaje: 'Importando datos'
                    });
                    winload.showMask();
                    panel.getForm().submit({
                        url: '/pvd/nomina/index.php/gestregistrosalariotiemposervicio/importarCargaInicialSNC',
                        params: { identidad: variables.identidad },
                        success: function (fp, response) {
                            importar.close();
                            winload.hideMask();
                            var responseText = Ext.decode(response.response.responseText);
                            if (responseText.personas.mach == 1) {
                                mostrarMensaje(1, 'La carga inicial fue actualizada correctamente', function (btn) {

                                }.createDelegate(this));
                            } else {
                                mostrarMensaje(3, 'No se pudo actualizar la carga inicial de las siguientes personas:<b>' + responseText.personas.texto + '</b>', function (btn) {
                                });
                            }
                            modelo.storeRegistroSalario.reload();
                        }.createDelegate(this),

                        failure: function (fp, response) {
                        }
                    });

                } else {
                    mostrarMensaje(2, 'Datos vacios');
                }
            }

            var importar = new Ext.Window({
                title: 'Importar carga inicial',
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
    }
};