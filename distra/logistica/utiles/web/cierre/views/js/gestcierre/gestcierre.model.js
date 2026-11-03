Ext.ns('Log.lb.cierre');

Log.lb.cierre.Model = Ext.extend(LOG.util.Model, {
    /**
     *
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function (config) {
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'iddocumento',
            primary: true
        });
        Log.lb.cierre.Model.superclass.constructor.call(this, config);
    },
    cierreDiario: function (_fn) {
        var _this = this;
        mostrarMensaje(2, _this.idioma.msjConfirmar, function (btn) {
            if (btn == 'ok') {
                Ext.getBody().mask(_this.idioma.msjLoadMask);
                Ext.Ajax.request({
                    url: 'cierreDiario',
                    method: 'POST',
                    callback: function (opt, scs, resp) {
                        Ext.getBody().unmask();
                        var data = Ext.decode(resp.responseText);
                        console.info(data)
                        if (data.codigoMsg == 1) {
                            mostrarMensaje(1, _this.idioma.msjOkCierreD);
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [data]).call();
                            }
                        } else if (data.codMsg == 4) {
                            mostrarMensaje(4, data.mensaje);
                        }  else {
                            mostrarMensaje(3, _this.idioma.msjNoCiereD);
                        }
                    }
                });
            }
        });

    },
    cierrePeriodo: function (_fn) {
        var _this = this;
        mostrarMensaje(2, _this.idioma.msjConfirmarP, function (btn) {
            if (btn == 'ok') {
                Ext.getBody().mask(_this.idioma.msjLoadMask);
                Ext.Ajax.request({
                    url: 'cierrePeriodo', 
                    method: 'POST',
                    callback: function (opt, scs, resp) {
                        Ext.getBody().unmask();
                        var data = Ext.decode(resp.responseText);
                        console.log(data);
                        let isArray = Array.isArray(data.success);
                        if(isArray){
                            let description = "";
                            data.success.map((el)=> {
                                description += "- <b>Fecha cierre:</b> "+el.fechacierre+", <b>Depósito:</b> "+
                                el.codigo+" - "+el.denominacion+", <b>Diferencia:</b> "+Ext.util.Format.number(el.diferencia, '0,000.00')+" </br>";
                            });
                            console.info(description);
                            mostrarMensaje(3, "<h4>"+_this.idioma.msjNoCiereP+" existe(n) depósito(s) con diferencia(s): </br> </br>"+description+"</h4>");
                        }else{
                            if (data.codigoMsg == 1) {
                                if (typeof _fn == 'function') {
                                    _fn.createDelegate(this, [data]).call();
                                }
                                mostrarMensaje(1, _this.idioma.msjOkCierreP(data.periodo));
                            } else if (data.codMsg == 4) {
                                mostrarMensaje(4, data.mensaje);
                            }  else {
                                mostrarMensaje(3, _this.idioma.msjNoCiereP);
                            }
                        }
                        /*if (data.diferencia == 1) {
                            mostrarMensaje(2, _this.idioma.msjCierreDiferencia, function (btn) {
                                if (btn == 'ok') {
                                    _this.close();
                                } else {
                                    _this.close();
                                }
                            });
                        }*/
                    }
                });
            }
        })
    },
    cierreEjercicio: function (_fn) {
        var _this = this;
        if (_this.st.data.length == 0) {
            mostrarMensaje(2, _this.idioma.msjConfirmarE, function (btn) {
                if (btn == 'ok') {

                    Ext.getBody().mask(_this.idioma.msjLoadMask);
                    Ext.Ajax.request({
                        url: 'cierreEjercicio',
                        method: 'POST',
                        callback: function (opt, scs, resp) {
                            Ext.getBody().unmask();

                            var data = Ext.decode(resp.responseText);
                            if (data.codigoMsg == 1) {
                                if (typeof _fn == 'function') {
                                    _fn.createDelegate(this, [data]).call();
                                }
                                mostrarMensaje(1, _this.idioma.msjOkCierreE);
                            } else if (data.codMsg == 4) {
                                mostrarMensaje(4, data.mensaje);
                            } else {
                                mostrarMensaje(3, _this.idioma.msjNoCiereE);
                            }


                        }

                    });

                }

            })
        } else {
            mostrarMensaje(3, _this.idioma.msjNoCiereEPendientes);
        }

    },
    cierreApertura: function (scope) {
        var _this = this;
        //if (_this.st.data.length > 0) {
            mostrarMensaje(2, _this.idioma.msjConfirmarCierrApert, function (btn) {
                if (btn == 'ok') {

                    Ext.getBody().mask(_this.idioma.msjLoadMask);
                    Ext.Ajax.request({
                        url: 'cierreApertura',
                        method: 'POST',
                        callback: function (opt, scs, resp) {
                            Ext.getBody().unmask();

                            var data = Ext.decode(resp.responseText);

                            if (data.datos.error == 1) {
                                mostrarMensaje(3, _this.idioma.msjErrorEstadoElaboracion);
                            } else if (data.datos.error == 2) {
                                mostrarMensaje(3, _this.idioma.msjErrorNoCoenciden);
                            } else if (data.datos.error == 3) {
                                mostrarMensaje(3, _this.idioma.msjErrorAprobarAperturas);
                            } else if (data.datos.error == 4) {//El grupo $grupo['denominacion'] no tiene asociado una cuenta de activos.
                                mostrarMensaje(3, _this.idioma.msjNoTieneCuenta(data.datos.msg, 'activos'));
                            } else if (data.datos.error == 5) {//El grupo $grupo['denominacion'] no tiene asociado una cuenta de depreciacion.
                                mostrarMensaje(3, _this.idioma.msjNoTieneCuenta(data.datos.msg, 'depreciaci\xf3n'));
                            } else if (data.datos.error == 6) {
                                mostrarMensaje(3, _this.idioma.msjMedioSinGrupo(data.datos.msg));
                            } else if (data.datos.exito == 1) {                                
                                scope.getStorePrincipal().load();
                                mostrarMensaje(1, _this.idioma.msjCierreApertura);
                            }
                            else if (data.datos.error == 7) {
                                mostrarMensaje(3, 'No existen cuentas por grupos configuradas en la entidad');
                            } else if (data.datos.error == 8) {
                                mostrarMensaje(3, _this.idioma.msjErrorNoCoencidenAft);
                            }
                        }

                    });

                }

            })
        //}

    },
    cargaDatosFecha: function (_params, _fn) {
        this.cargaInicial(_params, _fn);
    }
});
