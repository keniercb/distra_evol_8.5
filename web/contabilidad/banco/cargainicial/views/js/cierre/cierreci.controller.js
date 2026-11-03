Ext.namespace('Banco.Cierreci');

Banco.Cierreci.Controller = {
    inicio: function(idioma, vista, modelo) {

        //mostrar la mascara para el loadDataini
        vista.lMask.show();

        Ext.Ajax.request({
            url: 'loadDataIni',
            method: 'POST',
            scope: this,
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.aperturado == 1) {//0=ci, 1=aperturado
                    mostrarMensaje(1, idioma.mostrarMensajeloadDataIni, function(btn) {
                        if (btn == 'ok' || btn == 'cancel') {
                            vista.panel.disable();
                            vista.MiView.disable();
                        }
                    });
                }
                else {
                    var text = 'Per\xEDodo actual: ' + responseData.periodo.nombre + ' desde ' + responseData.periodo.inicio + ' hasta ' + responseData.periodo.fin + ' | Fecha contable: ' + responseData.periodo.fechacontable + ' ';
                    vista.lfdPeriodo.setText(text);
                    this.periodoactualvp = responseData.periodo.nombre + ' desde ' + responseData.periodo.inicio + ' hasta ' + responseData.periodo.fin;
                    this.fechacontablevp = responseData.periodo.fechacontable;
                }
                //cerrar la mascara para el loadDataini
                vista.lMask.hide();
            }//callback
        });

        vista.btnCierre.on('click', function() {
            this.accion = 'cerrarcuentabancaria';
            this.pregunta = ' las cuentas bancarias';
            this.RealizarCierre();
        }, this);

        vista.btnVP.on('click', function() {
            this.reportesubsbanco();
        }, this);

        //accion de btn ayuda
        vista.btnAyuda.on('click', function() {
            //help.show(idioma.lbtextTitleHelp, 'confin/banco/carga_inicial/cierre');
        });

        //teclas de acceso rapido
        vista.globalKeyMap.accessKey({
            key: 'h',
            alt: true
        }, function() {
            help.show(idioma.lbtextTitleHelp, 'confin/banco/carga_inicial/cierre');
        }, Ext.getBody());

        //function realizar cierre
        this.RealizarCierre = function() {
            Ext.Msg.show({
                title: idioma.ExtMsgshowtitle,
                msg: 'Este proceso dar&aacute; por terminadas las operaciones de ' + this.pregunta + '. <br> &iquest;Est&aacute; seguro que quiere efectuar el cierre?',
                buttons: Ext.Msg.OKCANCEL,
                icon: Ext.MessageBox.QUESTION,
                scope: this,
                fn: function(btn, text) {
                    if (btn == 'ok') {
                        vista.area.setValue("");
                        //mostrar la mascara para la realizacion del cierre
                        vista.lMaskRelCierre.msg = idioma.lMaskRelCierre;
                        vista.lMaskRelCierre.show();

                        Ext.Ajax.request({
                            url: 'cerrarCargaInicial',
                            method: 'POST',
                            scope: this,
                            callback: function(options, success, response) {
                                vista.lMaskRelCierre.hide();
                                responseData = Ext.decode(response.responseText);

                                if (responseData.n_codmsg == 1) {
                                    var confirm = idioma.mensajeconfirm;
                                    var mess = '';
                                    mess = idioma.mess1;
                                    mess += "\n\n\n";
                                    mess += idioma.mess2;
                                    mostrarMensaje(1, confirm + '<br/>' + idioma.mess1 + '<br/><br/><b>' + idioma.mess2 + responseData.result + '</b>', function(btn) {
                                        window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
                                    });
                                    vista.area.setValue(mess + responseData.result);
                                    return;
                                }

                                if (responseData.n_codmsg == -1) {
                                    var todotecto = '';
                                    var mensaje = idioma.mensaje;
                                    var textocausas = idioma.textocausas;
                                    if (responseData.result != "") {
                                        todotecto += "\n\n\n";
                                        todotecto += idioma.todotecto1;
                                        todotecto += "\n\n\n";
                                        todotecto += responseData.result;
                                    }
                                    if (responseData.sinconciliar != "") {
                                        todotecto += "\n\n\n";
                                        todotecto += idioma.todotecto2;
                                        todotecto += "\n\n\n";
                                        todotecto += responseData.sinconciliar;
                                    }
                                    mostrarMensaje(1, mensaje);
                                    vista.area.setValue(textocausas + todotecto);
                                }
                            }
                        });
                    }
                }
            });
        };

        //funcion para mostrar el reporte del cierre contable de la carga inicial*********
        // para entender algo de esto ver gestionarcierre.phtml(formulario)
        this.reportesubsbanco = function() {
            var f = document.getElementById('formreporte');
            vista.reportMask.msg = idioma.lblMaskmsg;

            var nuevaventrep = 'titlebar=yes,status=no,location=no,resizable=no,scrollbars=yes,width=' + screen.width + ',height=' + screen.height;//se obtiene el tamanno de la pantalla
            vista.reportMask.show();
            Ext.Ajax.request({
                url: 'obtenerestructura',
                method: 'post',
                scope: this,
                callback: function(options, success, response) {
                    if (success) {
                        f.periodo.value = ' ' + this.periodoactualvp;
                        f.fecha.value = this.fechacontablevp;
                        f.textarea.value = vista.area.getValue();
                        f.estructura.value = Ext.decode(response.responseText);
                        ventana = window.open('reportecierre', 'Reportecierrecargainicial', nuevaventrep);
                        ventana.focus();//Le doy el focus a la ventana de trabajo	
                        f.submit();
                        vista.reportMask.hide();
                    }
                }
            });
        };
    }
};