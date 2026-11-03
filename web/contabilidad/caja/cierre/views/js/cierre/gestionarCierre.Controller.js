Ext.ns('Caja.Operaciones.Cierre');
Caja.Operaciones.Cierre.Controller = {
    init: function (perfil, etiquetas, view, model) {
        var scope = this;
        scope.initGlobalsKeys(scope, view);

        // view.btnCierreCaja.on('click', function () {
        //     scope.clickCerrarCaja();
        // });

        view.btnAperturar.on('click', function () {
            var arrayFondos = model.stCajaFondo.query('idcaja', view.grdlistadocajas2.idcaja);
            for (var key in arrayFondos.items) {
                if (key >= 0) {
                    if (arrayFondos.items[key].data.arqueocierre == false || arrayFondos.items[key].data.saldocuenta != arrayFondos.items[key].data.saldofondo) {
                        mostrarMensaje(1, etiquetas.lbMsgCerrarCajasApertura);
                        return;
                    }
                }
            }
            mostrarMensaje(2, etiquetas.lbMsgAperturarCaja, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.aperturarCaja();
                }
            });
        });

        view.btnCierrePeriodo.on('click', function () {
            var arrayFondos = model.stCajaFondo.query('idcaja', view.grdlistadocajas2.idcaja);
            for (var key in arrayFondos.items) {
                if (key >= 0) {
                    if (arrayFondos.items[key].data.arqueocierre == false || arrayFondos.items[key].data.saldocuenta != arrayFondos.items[key].data.saldofondo) {
                        mostrarMensaje(1, etiquetas.lbMsgCerrarCajas);
                        view.grdlistadocajas2.store.reload();
                        return;
                    }
                }
            }
            mostrarMensaje(2, etiquetas.lbMsgCerrarOperPeriodo, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.cerrarPeriodo();
                }
            });
        });

        view.btnCierreEjercicio.on('click', function () {
            mostrarMensaje(2, etiquetas.lbMsgCerrarOperEjercicio, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.cerrarEjercicio();
                }
            });
        });

        view.smCierre.on({
            rowselect: function (smodel, rowIndex, record) {
                view.grdlistadocajas2.getView().addRowClass(rowIndex, "negrita");
                // if(!record.data.cerrado && record.data.arqueocierre)
                // view.btnCierreCaja.enable();
            },
            rowdeselect: function (smodel, rowIndex, record) {
                view.grdlistadocajas2.getView().removeRowClass(rowIndex, "negrita");
                view.smCierre.clearSelections();
                //view.btnCierreCaja.disable();
            }
        });

        model.stCajaFondo.on({
            scope: this,
            load: function () {
                if (model.stCajaFondo.reader.jsonData.periodo) {
                    var respuesta = model.stCajaFondo.reader.jsonData;
                    periodoActual = respuesta.periodo.nombre;
                    fechaInicio = respuesta.periodo.inicio;
                    fechaFin = respuesta.periodo.fin;
                    fechaContable = respuesta.periodo.fechacontable;
                    view.lfdPeriodo.setText('Per\u00EDodo actual: ' + periodoActual + ' desde ' + fechaInicio + ' hasta ' + fechaFin + '|' + 'Fecha contable: ' + fechaContable);
                }
            }
        });

        this.aperturarCaja = function () {
            Ext.Ajax.request({
                url: 'aperturarcaja',
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);

                    if (respuesta.codMg == '-1') {
                        mostrarMensaje(1, etiquetas.lbMsgCerrarCajasApertura);
                    } else if (respuesta.codMg == '1') {
                        view.grdlistadocajas2.disable();
                        mostrarMensaje(1, etiquetas.lbCargaInicialCerrada, function (btn) {
                            if (btn == 'ok' || btn == 'cencel')
                                view.grdlistadocajas2.disable();
                        });
                    }
                }
            });
        };

        this.cerrarPeriodo = function (idCaja) {
            view.btnCierrePeriodo.disable();
            Ext.Msg.wait('Cargando...', 'Espere');
            Ext.Ajax.request({
                url: 'cerrarperiodo',
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);

                    /*if (respuesta.codMg == '-1') {

                        mostrarMensaje(1, etiquetas.lbMsgDocumPendientes);
                        var infoHTML = '';
                        if (respuesta.arrayDocReem.length) {
                            infoHTML += '<div style="padding:10px; background:#E7F1FE"; "font-size: 14px";><p><b>'
                                + etiquetas.lbDocPendReembolsar
                                + '</b></p></div>';
                            respuesta.arrayDocReem.forEach(function (value, index, allItems) {
                                infoHTML += '&nbsp;&nbsp;&nbsp;&nbsp;No. ' + value.numero + ' - ' + value.tipodoc + '&nbsp;&nbsp;&nbsp;&nbsp;$' + value.importe + '&nbsp;&nbsp;&nbsp;&nbsp;(' + value.fondo + ')' + '<br>';
                            });
                        }

                        if (respuesta.arrayDocDep.length) {
                            infoHTML += '<div style="padding:10px; background:#E7F1FE"; "font-size: 14px";><p><b>'
                                + etiquetas.lbDocPendDepositar
                                + '</b></p></div>';
                            respuesta.arrayDocDep.forEach(function (value, index, allItems) {
                                infoHTML += '&nbsp;&nbsp;&nbsp;&nbsp;No. ' + value.numero + ' - ' + value.tipodoc + '&nbsp;&nbsp;&nbsp;&nbsp;$' + value.importe + '&nbsp;&nbsp;&nbsp;&nbsp;(' + value.fondo + ')' + '<br>';
                            });
                        }

                        if (respuesta.arrayReembolsos.length) {
                            infoHTML += '<div style="padding:10px; background:#E7F1FE"; "font-size: 14px";><p><b>'
                                + etiquetas.lbReembolsoPen
                                + '</b></p></div>';
                            respuesta.arrayReembolsos.forEach(function (value, index, allItems) {
                                infoHTML += '&nbsp;&nbsp;&nbsp;&nbsp;No. ' + value.numero + ' - ' + value.tipodoc + '&nbsp;&nbsp;&nbsp;&nbsp;$' + value.importe + '&nbsp;&nbsp;&nbsp;&nbsp;(' + value.fondo + ')' + '<br>';
                            });
                        }

                        if (respuesta.arrayDepositos.length) {
                            infoHTML += '<div style="padding:10px; background:#E7F1FE"; "font-size: 14px";><p><b>'
                                + etiquetas.lbDepositosPen
                                + '</b></p></div>';
                            respuesta.arrayDepositos.forEach(function (value, index, allItems) {
                                infoHTML += '&nbsp;&nbsp;&nbsp;&nbsp;No. ' + value.numero + ' - ' + value.tipodoc + '&nbsp;&nbsp;&nbsp;&nbsp;$' + value.importe + '&nbsp;&nbsp;&nbsp;&nbsp;(' + value.fondo + ')' + '<br>';
                            });
                        }

                        //view.pPreView.html = infoHTML; //se pasa la informacion a mostrar Html
                        view.winVerdetalles.show();
                        view.winVerdetalles.center();
                        var templaterep = new Ext.XTemplate(infoHTML);
                        templaterep.overwrite(view.pPreView.body, {});

                    } else*/
                    if (respuesta.codMg == '1') {
                        var periodoOld = periodoActual;
                        periodoActual = respuesta.periodo.nombre;
                        /*fechaInicio = respuesta.periodo.inicio;
                        fechaFin = respuesta.periodo.fin;
                        fechaContable = respuesta.periodo.fechacontable;*/

                        var ultimoPeriodo = respuesta.ultimoPeriodo;
                        if (ultimoPeriodo) {
                            view.btnCierreEjercicio.enable();
                        }
                        view.grdlistadocajas2.store.reload();

                        mostrarMensaje(1, String.format(etiquetas.lbMsgCierrePeriodo, periodoOld, periodoActual));
                        //view.lfdPeriodo.setText('Per\u00EDodo actual: ' + periodoActual + ' desde ' + fechaInicio + ' hasta ' + fechaFin + '|' + 'Fecha contable: ' + fechaContable);
                        model.stCajaFondo.reload();
                        Ext.MessageBox.hide();
                    } else if (respuesta.subPresedentes.length > 0) {
                        mostrarMensaje(1, 'El subsistema de caja no puede cerrar debido a que los siguentes subsistemas no han cerrado: <br><b>' + respuesta.subPresedentes.toString(), function (btnPress) {
                            if (btnPress === 'ok') {
                                view.btnCierrePeriodo.enable();
                            }
                        });
                    } else {
                        view.btnCierrePeriodo.enable();
                        mostrarMensaje(1, 'Ocurrió un error en el sistema al realizar el cierre de período. Vuelva a intentarlo mas tarde.');
                        Ext.MessageBox.hide();
                    }
                }
            });
        };

        this.cerrarEjercicio = function (idCaja) {
            Ext.Msg.wait('Cargando...', 'Espere');
            Ext.Ajax.request({
                url: 'cerrarejercicio',
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);

                    if (respuesta.codMg == '-1') {
                        mostrarMensaje(1, etiquetas.lbMsgCerrarEjercicio);
                    } else if (respuesta.codMg == '1') {
                        /*periodoActual = respuesta.periodo.nombre;
                        fechaInicio = respuesta.periodo.inicio;
                        fechaFin = respuesta.periodo.fin;*/
                        ejercicioOld = respuesta.ejercicioOld;
                        ejercicioActual = respuesta.ejercicio;
                        //fechaContable = respuesta.fechacontable;

                        var ultimoPeriodo = respuesta.ultimoPeriodo;
                        if (ultimoPeriodo == 0) {
                            view.btnCierrePeriodo.enable();
                            view.btnCierreEjercicio.disable();
                        }
                        view.grdlistadocajas2.store.reload();

                        //mostrarMensaje(1, String.format(etiquetas.lbMsgEjercicioCerrado, ejercicioOld, ejercicioActual));
                        mostrarMensaje(1, String.format(etiquetas.lbMsgEjercicioCerrado, ejercicioOld));
                        //view.lfdPeriodo.setText('Per\u00EDodo actual: ' + periodoActual + ' desde ' + fechaInicio + ' hasta ' + fechaFin + '|' + 'Fecha contable: ' + fechaContable);
                        model.stCajaFondo.reload();
                    } else {
                        mostrarMensaje(1, respuesta.mensaje);
                    }
                    Ext.MessageBox.hide();
                }
            });
        };

        /*this.VistaPrevia = function () {
         var printView = new SCFPrintView();
         printView.show();
         };*/

        /*this.listadoEvents = function () {
         view.smlistadocajas.on({
         rowselect: function (sm, indiceFila, record) {
         view.btnaceptar.enable();
         scope.rec = record;
         scope.datos = indiceFila;
         scope.CajaSeleccionada = model.stlistadocajas.data.items[scope.datos].get('idcaja');
         scope.NombreCaja = model.stlistadocajas.data.items[scope.datos].get('nombre');
         }
         });
         view.btncancelar.on({
         click: function () {
         view.window.hide();
         }
         });
         view.btnaceptar.on({
         click: function () {
         Ext.Msg.confirm('Confirmaci&oacute;n', 'Este proceso da por terminadas las operaciones de cierre de la caja' + '. &iquest;Est&aacute; seguro que quiere efectuar el cierre?', function (btnPress) {
         if (btnPress === 'yes') {
         //scope.Comprobando_con_la_cuenta_de_contabilidad();
         }
         });
         }
         });

         };*/
    },
    //-------------------------------
    initGlobalsKeys: function (scope, view) {
        this.keyMap = new Ext.KeyMap(document, [
            {
                key: "a",
                alt: true,
                scope: this,
                fn: function () {
                    if (!view.btnAperturar.disabled)
                        view.btnAperturar.fireEvent('click');
                }
            }, /*{
             key: "c",
             alt: true,
             scope: this,
             fn: function () {
             if (!view.btnCierreCaja.disabled)
             view.btnCierreCaja.fireEvent('click');
             }
             }, */{
                key: "p",
                alt: true,
                scope: this,
                fn: function () {
                    if (!view.btnCierrePeriodo.disabled)
                        view.btnCierrePeriodo.fireEvent('click');
                }
            }, {
                key: "j",
                alt: true,
                scope: this,
                fn: function () {
                    if (!view.btnCierreEjercicio.disabled)
                        view.btnCierreEjercicio.fireEvent('click');
                }
            }, {
                key: "h",
                alt: true,
                fn: function () {
                    //this.btnAyuda.fireEvent('click');
                }
            }
        ]);
    }
    //-------------------
};