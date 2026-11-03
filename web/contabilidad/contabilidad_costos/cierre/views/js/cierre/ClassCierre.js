if (!Ext.CONT)
    Ext.namespace('Ext.CONT');
Ext.CONT.ClassCierre = Ext.extend(Ext.Component, {
    perfil: window.parent.perfil,
    constructor: function() {
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        Ext.CONT.Componentes.MessageBox('msgbIniciando', 'Cargando...');
        if (!document.getElementById('UICierre'))
            this.loadJs("../../views/js/cierre/UICierre", 'UICierre');
        this.loadPerfil(this);
    },
    loadJs: function(jsSrc, id) {
        if (jsSrc != null) {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            tagScript.setAttribute("id", id);
            tagScript.setAttribute("src", jsSrc + ".js");
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    loadPerfil: function(scope) {
        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            callback: function(options, success, response)
            {
                scope.etiquetas = Ext.decode(response.responseText);
                scope.initializeClass(scope);
            }
        });
    },
    initializeClass: function(scope) {
        Ext.CONT.UICierre.initializeComponents(scope);
        this.loadDataComponent(scope);
        this.initializeEvents(scope);
        this.initializeFunctions(scope);
    },
    loadDataComponent: function(scope) {
        scope.tbInformacion.disable();
        Ext.Ajax.request({
            method: "POST",
            url: "loadDataComponent",
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                scope.lbInformacionFecha.setText(scope.etiquetas.txtPeriodoActual + ' <b> ' + responseData.periodo.nombre + '</b>, ' + scope.etiquetas.txtDesde + ' <b>' + responseData.periodo.inicio + '</b> ' + scope.etiquetas.txtHasta + ' <b>' + responseData.periodo.fin + '</b>. ' + scope.etiquetas.txtFechaContable + '<b> ' + responseData.fecha + '</b>.', false);
                if (responseData.Dia == true || responseData.Periodo == true || responseData.Ejercicio == true) {
                    scope.tbInformacion.enable();
                    scope.setFechas(responseData.fecha, responseData.fecha, responseData.periodo.fin);
                    scope.btnMenu.focus();
                    scope.btnPasarDia.setVisible(responseData.PasarDia);
                    scope.btnPasarDia.menu.picker.handler.createDelegate();
                    // scope.btnDia.setVisible(responseData.Dia);
                    scope.btnDia.setVisible(false);
                    scope.btnPeriodo.setVisible(responseData.Periodo);
                    // scope.btnComprobantes.setVisible(responseData.Ejercicio);
                    scope.btnComprobantes.setVisible(false);
                    scope.btnEjercicio.setVisible(responseData.Ejercicio);
                }
                Ext.CONT.Componentes.HideBox('msgbIniciando');
                scope.fBuscarCausas();
            }
        });
    },
    initializeEvents: function(scope) {
        new Ext.KeyMap(Ext.getBody(), [ {
                key: 'a',
                alt: true,
                ctrl: true,
                fn: function() {
                    scope.btnDia.fireEvent('click');
                }
            }, {
                key: 'r',
                alt: true,
                fn: function() {
                    if (!scope.btnPreview.hidden)
                        scope.btnPreview.fireEvent('click');
                }
            }]);

        scope.btnDia.on('click', function() {
            function fAcepto(btn) {
                if (btn == 'ok')
                    scope.fPasarDia();
            }
            mostrarMensaje(2, scope.etiquetas.msgSeguroCierreDia, fAcepto);
        });
        scope.btnPeriodo.on('click', function() {
            function fAcepto(btn) {
                if (btn == 'ok')
                    scope.fPasarPeriodo()
            }
            mostrarMensaje(2, scope.etiquetas.msgSeguroCierrePeriodo, fAcepto);
        });

        scope.btnComprobantes.on('click', function() {
            Ext.Msg.wait(scope.etiquetas.lbCargandoDatos, scope.etiquetas.txtEspere);
            Ext.Ajax.request({
                method: "POST",
                url: "cargarconfiguracion",
                callback: function(options, success, response) {
                    Ext.Msg.hide();
                    var result = Ext.decode(response.responseText);
                    if (result['datos'].length <= 0) {
                        mostrarMensaje(1, scope.etiquetas.msgNoExistConfiguracion);
                    } else {
                        scope.winCmp = new Ext.Cont.Comprobantes();
                    }
                }
            });
        });

        scope.btnEjercicio.on('click', function() {
            function fAcepto(btn) {
                if (btn == 'ok')
                    scope.fPasarEjercicio();
            }
            mostrarMensaje(2, scope.etiquetas.msgSeguroCierreEjercContab, fAcepto);
        });

        scope.btnBuscarProblemas.on('click', function() {
            scope.fBuscarCausas();
        });


        scope.btnPreview.on('click', function() {
            scope.fOpenWindowReport(scope.datosCierre, {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            });
        });
        scope.gpInformacion.getStore().on('load', function(store, records, options) {
            if (records.length > 0) {
                scope.btnPreview.show();
                scope.ConstruirObjetoPrint(records);
            } else
                scope.btnPreview.hide();
        });
        scope.btnAbrirComprobante.on('click', function() {
            var record = scope.smInformacion.getSelected();
            if (record.data.idcomprobante) {
                Ext.Cont.Comprobante.Tool.init(record.data.idcomprobante);
            } else {
                mostrarMensaje(1, scope.etiquetas.lbSelCmp);
            }
        });
    },
    initializeFunctions: function(scope) {
        this.fOpenWindowReport = function(responseDataReporte, defaultComponentsValue) {
            printView = new SCFPrintView(responseDataReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            printView.show();
        };
        this.ConstruirObjetoPrint = function(records) {
            Ext.Ajax.request({
                method: "POST",
                url: "obtenerDatosCierreReporte",
                callback: function(options, success, response) {
                    scope.responseDatosGenerales = Ext.decode(response.responseText);
                    ConstruirArrayObjetoPrint(scope.responseDatosGenerales);
                }
            });
            function ConstruirArrayObjetoPrint(data) {
                datosCierre = new Array();
                datos1 = new Array();
                datos2 = new Array();
                datos3 = new Array();
                datos4 = new Array();
                for (i = 0; i < records.length; i++) {
                    if (records[i].data.texto == 1)
                        datos1.push(records[i].data);
                    if (records[i].data.texto == 2)
                        datos2.push(records[i].data);
                    if (records[i].data.texto == 3)
                        datos3.push(records[i].data);
                    if (records[i].data.texto == 4)
                        datos4.push(records[i].data);
                }
                if (datos1.length > 0) {
                    gdata1 = data;
                    datosCierre.push({
                        "datoGeneral": gdata1,
                        "datoCuerpo": datos1,
                        "datoPie": null,
                        "reporte": (gdata1.reporte == null) ? "111" : "111"
                    });
                }
                if (datos2.length > 0) {
                    gdata2 = data;
                    datosCierre.push({
                        "datoGeneral": gdata2,
                        "datoCuerpo": datos2,
                        "datoPie": null,
                        "reporte": (gdata2.reporte == null) ? "112" : "112"
                    });
                }
                if (datos3.length > 0) {
                    gdata3 = data;
                    datosCierre.push({
                        "datoGeneral": gdata3,
                        "datoCuerpo": datos3,
                        "datoPie": null,
                        "reporte": (gdata3.reporte == null) ? "113" : "113"
                    });
                }
                if (datos4.length > 0) {
                    gdata4 = data;
                    datosCierre.push({
                        "datoGeneral": gdata4,
                        "datoCuerpo": datos4,
                        "datoPie": null,
                        "reporte": (gdata4.reporte == null) ? "114" : "114"
                    });
                }
                scope.datosCierre = datosCierre;
            }
        };
        this.fPasarDia = function() {
            stInformacion.removeAll();
            scope.tbInformacion.disable();
            scope.btnPreview.hide();
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando);
            Ext.Ajax.request({
                method: "POST",
                url: "pasarDia",
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.flag == true || responseData.flag == 'true') {
                        function fAcepto() {
                            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando);
                            scope.loadDataComponent(scope);
                        }
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mensaje = scope.etiquetas.msgSubSistContabCloseDia + '<b>' + responseData.fechaActual + '</b>.';
                        mostrarMensaje(1, mensaje, fAcepto);
                    } else {
                        stInformacion.on('load', function(store, records, options) {
                            Ext.CONT.Componentes.HideBox('msgbIniciando');
                            function fAcepto() {
                                scope.tbInformacion.enable();
                            }
                            mostrarMensaje(1, scope.etiquetas.msgNotOperacion, fAcepto);
                        });
                        if (responseData.Data)
                            stInformacion.loadData(responseData.Data);
                        else
                            scope.tbInformacion.enable();
                    }
                }
            });
        };
        this.fPasarPeriodo = function() {
            stInformacion.removeAll();
            scope.tbInformacion.disable();
            scope.btnPreview.hide();
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando);
            Ext.Ajax.request({
                method: "POST",
                url: "pasarPeriodo",
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.flag == true || responseData.flag == 'true') {
                        function fAcepto() {
                            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando);
                            scope.loadDataComponent(scope);
                        }
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mensaje = scope.etiquetas.msgSubSistContabClosePeriodo + '<b>' + responseData.Periodo + '</b>.';
                        mostrarMensaje(1, mensaje, fAcepto);
                    } else {
                        if (responseData.flagSaldo == true || responseData.flagSaldo == 'true') {
                            stInformacion.on('load', function(store, records, options)
                            {
                                Ext.CONT.Componentes.HideBox('msgbIniciando');
                                function fAcepto(btn)
                                {
                                    if (btn == 'ok')
                                        scope.fConfirmadoCerrarPeriodo();
                                    else
                                        scope.tbInformacion.enable();
                                }
                                mostrarMensaje(2, scope.etiquetas.msgErrorCierrePeriodo, fAcepto);
                            });
                        } else {
                            stInformacion.on('load', function(store, records, options) {
                                Ext.CONT.Componentes.HideBox('msgbIniciando');
                                mostrarMensaje(1, scope.etiquetas.msgNotOperacion);
                                scope.tbInformacion.enable();
                            });
                        }
                        if (responseData.Data) {
                            stInformacion.loadData(responseData.Data);
                        } else {
                            scope.tbInformacion.enable();
                        }

                        // Ext.CONT.Componentes.HideBox('msgbIniciando');
                        // mensaje = 'No se puede realizar el cierre del per&iacute;odo por las siguientes causas:' + '<br>' + ' - No se ha realizado el proceso de C&aacutelculo y registro del costo.'
                        // mostrarMensaje(1, mensaje);
                    }
                }
            });
        };

        this.fBuscarCausas = function () {
            stInformacion.removeAll();
            scope.tbInformacion.disable();
            scope.btnPreview.hide();
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando);
            Ext.Ajax.request({
                method: "POST",
                params: {
                    search: 1
                },
                url: "pasarPeriodo",
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    /*if (responseData.flag == true || responseData.flag == 'true') {
                        function fAcepto() {
                            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando);
                            scope.loadDataComponent(scope);
                        }
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mensaje = scope.etiquetas.msgSubSistContabClosePeriodo + '<b>' + responseData.Periodo + '</b>.';
                        mostrarMensaje(1, mensaje, fAcepto);
                    } else {
                        if (responseData.flagSaldo == true || responseData.flagSaldo == 'true') {
                            stInformacion.on('load', function(store, records, options)
                            {
                                Ext.CONT.Componentes.HideBox('msgbIniciando');
                                function fAcepto(btn)
                                {
                                    if (btn == 'ok')
                                        scope.fConfirmadoCerrarPeriodo();
                                    else
                                        scope.tbInformacion.enable();
                                }
                                mostrarMensaje(2, scope.etiquetas.msgErrorCierrePeriodo, fAcepto);
                            });
                        } else {*/
                            stInformacion.on('load', function(store, records, options) {
                                Ext.CONT.Componentes.HideBox('msgbIniciando');
                                // mostrarMensaje(1, scope.etiquetas.msgNotOperacion);
                                scope.tbInformacion.enable();
                            });
                        //}
                        if (responseData.Data) {
                            stInformacion.loadData(responseData.Data);
                        } else {
                            scope.tbInformacion.enable();
                        }

                        // Ext.CONT.Componentes.HideBox('msgbIniciando');
                        // mensaje = 'No se puede realizar el cierre del per&iacute;odo por las siguientes causas:' + '<br>' + ' - No se ha realizado el proceso de C&aacutelculo y registro del costo.'
                        // mostrarMensaje(1, mensaje);
                    //}
                }
            });
        };

        this.fConfirmadoCerrarPeriodo = function() {
            stInformacion.removeAll();
            scope.tbInformacion.disable();
            scope.btnPreview.hide();
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando);
            Ext.Ajax.request({
                method: "POST",
                url: "confirmadoCerrarPeriodo",
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    Ext.CONT.Componentes.HideBox('msgbIniciando');
                    if (responseData.PeriodoActual) {
                        mostrarMensaje(1, scope.etiquetas.msgSubSistContabClosePeriodo + '<b>' + responseData.PeriodoActual + '</b>.');
                        Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando);
                        scope.loadDataComponent(scope);
                    }
                }
            });
        };
        this.fPasarEjercicio = function() {
            stInformacion.removeAll();
            scope.tbInformacion.disable();
            scope.btnPreview.hide();
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando);
            Ext.Ajax.request({
                method: "POST",
                url: "pasarEjercicio",
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    switch (responseData.flag) {
                        case -1:
                            {
                                function fAcepto() {
                                    Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando);
                                    scope.loadDataComponent(scope);
                                }
                                Ext.CONT.Componentes.HideBox('msgbIniciando');
                                mostrarMensaje(1, scope.etiquetas.msgSubSistContabClose + '<b>' + responseData.EjercicioActual + '</b>.', fAcepto);
                            }
                            break;
                        case -2:
                            {
                                stInformacion.on('load', function(store, records, options) {
                                    Ext.CONT.Componentes.HideBox('msgbIniciando');
                                    function fAcepto() {
                                        scope.tbInformacion.enable();
                                    }
                                    mostrarMensaje(1, scope.etiquetas.msgNotOperacion, fAcepto);
                                });
                                if (responseData.Data) {
                                    stInformacion.loadData(responseData.Data);
                                } else {
                                    scope.tbInformacion.enable();
                                }
                            }
                            break;
                        case -3:
                            {
                                Ext.CONT.Componentes.HideBox('msgbIniciando');
                                scope.tbInformacion.enable();
                                mostrarMensaje(1, 'El comprobante de ganancia o p&eacute;rdida no ha sido generado.');
                            }
                            break;
                    }
                }
            });
        };
        
        this.setFechas = function(argFechaActual, argFechaMin, argFechaMax) {
            var fechaActual = new Date();
            fechaActual = Date.parseDate(argFechaActual, "d/m/Y");
            scope.btnPasarDia.menu.picker.setValue(fechaActual);
            var fechaMin = new Date();
            fechaMin = Date.parseDate(argFechaMin, "d/m/Y");
            scope.btnPasarDia.menu.picker.minDate = fechaMin;
            var fechaMax = new Date();
            fechaMax = Date.parseDate(argFechaMax, "d/m/Y");
            scope.btnPasarDia.menu.picker.maxDate = fechaMax;
        };
    }
});
new Ext.CONT.ClassCierre();
