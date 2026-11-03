Ext.namespace('Banco.Cierre');

Banco.Cierre.Controller = {
    inicio: function(idioma, view, modelo) {
        var scope = this;
        view.lMaskk.show();
        //Chequea el cierre diario y carga el store de cuentas
        Ext.Ajax.request({
            url: 'loadDataIni',
            method: 'post',
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.aperturado == 0) {//0=ci, 1=aperturado
                    mostrarMensaje(1, 'Banco no ha cerrado las operaciones de la carga inicial.', function(btn) {
                        if (btn == 'ok' || btn == 'cancel') {
                            view.panel.disable();
                            view.viewPort.disable();
                        }
                    });
                }
                else {
                    scope.updateLabelPeriodo(responseData.cierre.periodo.nombre, responseData.cierre.periodo.inicio, responseData.cierre.periodo.fin, responseData.cierre.periodo.fechacontable, responseData.cierre.tipocierre /*3*/, responseData.cierre.cierrediario);
                }
                view.lMaskk.hide();
            }
        });

        //accion del boton del cierre de cuenta bancaria
        view.btnCCB.on('click', function() {
            this.accion = 'cerrarcuentabancaria';
            this.mensaje = 'de cuenta bancaria.';
            this.pregunta = ' la cuenta bancaria';
            view.lMaskk.show();
            modelo.stlistadocuentas.reload({callback: function() {
                    view.lMaskk.hide();
                    if (modelo.stlistadocuentas.getCount()) {
                        view.winAbrir.show();
                        view.winAbrir.center();
                    } else {
                        mostrarMensaje(1, idioma.mensajebtnCCB);
                    }
                }});

        }, this);

        view.smlistadocuentas.on('rowselect', function() {
            this.cuentaseleccionada = view.smlistadocuentas.getSelected().data.idcuentabancaria;
            this.nrocuenta = view.smlistadocuentas.getSelected().data.nrocuenta;
            view.winAbrir.buttons[0].enable();
            view.winAbrir.buttons[1].enable();
        }, this);

        view.smlistadocuentas.on('rowdeselect', function() {
            view.winAbrir.buttons[1].disable();
        }, this);

        view.winAbrir.on('beforeshow', function() {
            view.smlistadocuentas.clearSelections();
        }, this);

        //accion del boton de cerrar de la ventana winAbrir
        view.winAbrir.buttons[0].on('click', function() {
            view.winAbrir.hide();
        }, this);

        //accion del boton de realizar cierre de la ventana winAbrir
        view.winAbrir.buttons[1].on('click', function() {
            this.RealizarCierre(this.cuentaseleccionada);
        }, this);


        //accion del boton del cierre del periodo
        view.btnCPC.on('click', function() {
            this.accion = 'cerrarperiodo';
            this.mensaje = 'de per&iacute;odo.';
            this.pregunta = 'l per&iacute;odo contable';
            this.RealizarCierre();
        }, this);

        //accion del boton del cierre de jercicio
        view.btnCEC.on('click', function() {
            this.accion = 'cerrarejercicio';
            this.mensaje = 'de ejercicio.';
            this.pregunta = 'l ejercicio contable';
            this.RealizarCierre();
        }, this);

        //accion del boton del cierre diario
        view.btnCD.on('click', function() {
            this.accion = 'cerrardiario';
            this.mensaje = 'diario.';
            this.pregunta = 'l d&iacute;a';
            this.RealizarCierre();
        }, this);

        //accion del boton de view previa
        view.btnVP.on('click', function() {
            this.reportesubsbanco();
        }, this);

        //accion de btn ayuda
        view.btnAyuda.on('click', function() {
            //help.show(idioma.lbtextTitleHelp, 'confin/banco/cierre');
        });
        
        view.btnBorrarbanco.on({
            scope: this,
            click: function() {
                var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Por favor espere..."});
                myMask.show();

                Ext.Ajax.request({
                    method: 'POST',
                    url: 'borrarBanco',
                    scope: this,
                    callback: function(options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        myMask.hide();
                        if (responseData.error == 'no') {
                            mostrarMensaje(1, 'Los datos que tienen que ver con Banco en mod_finanzas y en mod_banco se han eliminado satisfactoriamente.');
                        }
                        else {
                            mostrarMensaje(3, 'Ocurri&oacute; alg&uacute;n error al eliminar los datos.');
                        }
                    }
                });
            }
        });

        //teclas de acceso rapido
        view.globalKeyMap.accessKey({
            key: 'h',
            alt: true
        }, function() {
            help.show(idioma.lbtextTitleHelp, 'confin/banco/cierre');
        }, Ext.getBody());

        //funcion Realizar Cierre
        this.RealizarCierre = function(cuentaseleccionada) {
            Ext.Msg.show({
                title: idioma.lbConfirmacion,
                msg: 'Este proceso da por terminadas las operaciones de' + this.pregunta + '. <br> &iquest;Est&aacute; seguro que quiere efectuar el cierre?',
                buttons: Ext.Msg.OKCANCEL,
                icon: Ext.MessageBox.QUESTION,
                scope: this,
                fn: function(btn, text) {
                    if (btn == 'ok') {
                        view.area.setValue("");
                        view.MaskRealCierre.msg = 'Realizando cierre ' + this.mensaje + '...';
                        view.MaskRealCierre.show();

                        Ext.Ajax.request({
                            url: this.accion,
                            scope: this,
                            params: (cuentaseleccionada) ? {
                                idcuenta: cuentaseleccionada
                            } : {},
                            callback: function(options, success, response) {
                                view.MaskRealCierre.hide();
                                responseData = Ext.decode(response.responseText);
                                if (success) {
                                    if (responseData.codmsg == 1) {
                                        var confirm = 'El cierre ha sido realizado satisfactoriamente.<br>';
                                        if (this.accion == 'cerrarcuentabancaria') {
                                            modelo.stlistadocuentas.reload({
                                                callback: function() {
                                                    if (modelo.stlistadocuentas.getCount() === 0) {
                                                        view.btnCPC.setDisabled(false);
                                                        view.winAbrir.hide();
                                                    }
                                                    else {
                                                        view.btnCPC.setDisabled(true);
                                                    }
                                                }
                                            });
                                            confirm += 'No se podr&aacute;n realizar m&aacute;s acciones sobre la cuenta bancaria en el per&iacute;odo.</b>';
                                        }
                                        else if (this.accion == 'cerrardiario') {
                                            confirm += 'La nueva fecha contable es: <b>' + responseData.nuevafecha + '</b>';
                                        }
                                        else if (this.accion == 'cerrarperiodo') {
                                            confirm += 'Se ha cerrado el per&iacute;odo con fecha de inicio: <b>' + responseData.periodoviejo.inicio + '</b> y fecha de fin: <b>' + responseData.periodoviejo.fin + '</b>.<br>';
                                            confirm += 'El nuevo per&iacute;odo (<b>' + responseData.nuevoperiodo.nombre + '</b>) comienza el: <b>' + responseData.nuevoperiodo.inicio + '</b> y termina el: <b>' + responseData.nuevoperiodo.fin + '.</b><br>';
                                            scope.updateLabelPeriodo(responseData.nuevoperiodo.nombre, responseData.nuevoperiodo.inicio, responseData.nuevoperiodo.fin, responseData.nuevoperiodo.inicio, responseData.tipocierre, responseData.cierrediario);
                                        }
                                        else {
                                            confirm += 'Se ha cerrado el ejercicio con fecha de inicio: ' + responseData.ejercicioviejo[0].inicio + ' y fecha de fin: ' + responseData.ejercicioviejo[0].fin + '.<br>';
                                            confirm += 'El nuevo ejercicio comienza el: <b>' + responseData.nuevoejercicio[0].inicio + '</b> y termina el: <b>' + responseData.nuevoejercicio[0].fin + '.</b><br>';
                                            scope.updateLabelPeriodo(responseData.periodo.nombre, responseData.periodo.inicio, responseData.periodo.fin, responseData.periodo.inicio, responseData.tipocierre, responseData.cierrediario);
                                        }
                                        mostrarMensaje(1, confirm);
                                    }
                                    else if (responseData.codmsg == -1 || responseData.codmsg == -2) {
//                                        var mensaje = "No se ha podido efectuar el cierre. <br> Por favor revise las causas.";
                                        var mensaje = "No se ha podido efectuar el cierre. <br> Por favor revise las causas.";
                                        if (this.accion == 'cerrardiario') {
//                                            var textocausas = "No se ha podido efectuar el cierre diario por las siguientes causas: \n\n";
                                            var textocausas = "No se ha podido efectuar el cierre por las siguientes causas: \n\n";
                                            var result = (responseData.result) ? responseData.result : new Array();
                                            for (var a = 0; a < result.length; a++) {
                                                textocausas += "La cuenta bancaria " + result[a].cuenta.nrocuenta + " " + result[a].cuenta.nombrecuentabancaria + "\n";
                                                var docsNC = (result[a].docsNC) ? result[a].docsNC : new Array();
                                                if (docsNC.length) {
                                                    textocausas += "- Tiene instrumentos asociados con operaciones no posteadas: \n";
                                                    for (var i = 0; i < docsNC.length; i++) {
                                                        textocausas += "  " + docsNC[i];
                                                        textocausas += (i < docsNC.length - 1) ? ", " : ".\n";
                                                    }
                                                }
                                                if (!result[a].cuentaConciliada) {
                                                    //var cuenta = stComboCuenta.getById(idcuenta);
                                                    cuenta = result[a].cuenta;
                                                    textocausas += "- No est\xe1 conciliada.\n";
                                                }
                                                textocausas += "\n\n\n";
                                            }
                                            mostrarMensaje(1, mensaje);
                                            view.area.setValue(textocausas);
                                        }
                                        else if (this.accion == 'cerrarcuentabancaria') {
                                            var docsNC = (responseData.docsNC) ? responseData.docsNC : new Array();
                                            var instNoCanceladosMayorQueFecha = (responseData.instNoCanceladosMayorQueFecha) ? responseData.instNoCanceladosMayorQueFecha : new Array();
//                                            var textocausas = "No se ha podido efectuar el cierre por las siguientes causas: \n\n";
                                            var textocausas = "No se ha podido efectuar el cierre por las siguientes causas: \n\n";
                                            if (docsNC.length) {
                                                textocausas += "- Los siguientes documentos tienen operaciones no posteadas: \n";
                                                for (var i = 0; i < docsNC.length; i++) {
                                                    textocausas += ' ' + docsNC[i].nodocu + ' ' + docsNC[i].denomdocu;
                                                    textocausas += (i < docsNC.length - 1) ? "\n" : "\n\n";
                                                }
                                            }
                                            if(instNoCanceladosMayorQueFecha.length) {
                                                textocausas += "- Es necesario conciliar nuevamente la cuenta bancaria seleccionada. Los siguientes documentos tienen operaciones con fecha posterior a la última conciliación: \n";
                                                for (var i = 0; i < instNoCanceladosMayorQueFecha.length; i++) {
                                                    textocausas += '  ' + instNoCanceladosMayorQueFecha[i].nodocu + ' ' + instNoCanceladosMayorQueFecha[i].denomdocu;
                                                    textocausas += (i < instNoCanceladosMayorQueFecha.length - 1) ? "\n" : "\n\n";
                                                }
                                            }
                                            if (!responseData.cuentaConciliada) {
                                                cuenta = view.smlistadocuentas.getSelected().data;
                                                textocausas += "- La cuenta bancaria " + cuenta.nrocuenta + " no est\xe1 conciliada.";
                                            }
                                            mostrarMensaje(1, mensaje);
                                            view.area.setValue(textocausas);
                                        }
                                        else if (this.accion == 'cerrarperiodo') {
                                            var mensajeC = "No se ha podido efectuar el cierre del per&iacute;odo contable.<br>";
                                            mensajeC += "Existen cuentas bancarias sin cerrar.";
                                            mostrarMensaje(1, mensajeC);
                                        }
                                        else if (this.accion == 'cerrarejercicio') {
                                            var mensajeC = "No se ha podido efectuar el cierre del ejercicio contable.<br>";
                                            mensajeC += "Existen cuentas bancarias sin cerrar.";
                                            mostrarMensaje(1, mensajeC);
                                        }
                                    }
                                    else if (responseData.codmsg == 3)
                                        mostrarMensaje(responseData.codmsg, responseData.mensaje);
                                }
                                else {
                                    Ext.Msg.alert('Cierre', 'La operaci&oacute;n no ha podido ser efectuada por demoras del servidor. <br> Por favor repita la acci&oacute;n en unos minutos.');
                                }
                            }
                        });
                    }
                }
            });
        };

        this.updateLabelPeriodo = function(name, initDate, endDate, contDate, tipocierre, cierrediario) {
            var text = 'Per\xEDodo actual: ' + name + ' desde ' + initDate + ' hasta ' + endDate + ' | Fecha contable: ' + contDate + ' ';
            view.lfdPeriodo.setText(text);
            scope.periodoactualvp = name + ' desde ' + initDate + ' hasta ' + endDate;
            scope.fechacontablevp = contDate;
            scope.activateCierres(tipocierre, cierrediario);
        };

        this.activateCierres = function(tipocierre, cierrediario) {
            //1 cierra periodo, 0 cierra ejercicio, 3 cierra cuentas bancarias
            if (tipocierre === 0) {
                view.btnCPC.setDisabled(true);
                view.btnCEC.setDisabled(false);
            }
            else if(tipocierre === 3) {
                // view.btnCPC.setDisabled(true);
                view.btnCEC.setDisabled(true);
            }
            else {
                view.btnCPC.setDisabled(false);
                view.btnCEC.setDisabled(true);
            }

            //1 cierrr diario, 2 cierre automatico
            if (cierrediario === 1) {
                view.btnCD.setDisabled(false);
            } else {
                view.btnCD.setDisabled(true);
            }
        };

        //funcion para mostrar el reporte del cierre contable del subsistema banco*********
        // para entender algo de esto ver cierre.phtml(formulario(formreporte))
        this.reportesubsbanco = function() {
            var f = document.getElementById('formreporte');
            var estMask = new Ext.LoadMask(Ext.getBody(), {
                msg: 'Obteniendo estructura...'
            });

            var nuevaventrep = 'titlebar=yes,status=no,location=no,resizable=no,scrollbars=yes,width=' + screen.width + ',height=' + screen.height;//se obtiene el tamanno de la pantalla
            estMask.show();
            Ext.Ajax.request({
                url: 'obtenerestructura',
                method: 'post',
                scope: this,
                callback: function(options, success, response) {
                    if (success) {
                        f.periodo.value = ' ' + this.periodoactualvp;
                        f.fecha.value = this.fechacontablevp;
                        f.textarea.value = view.area.getValue();
                        f.estructura.value = Ext.decode(response.responseText);
                        ventana = window.open('reportecierre', 'Reportecierre', nuevaventrep);
                        ventana.focus();//Le doy el focus a la ventana de trabajo	
                        f.submit();
                        estMask.hide();
                    }
                }
            });
        };

    }
};