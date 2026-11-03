Ext.ns('LOG.aft.autotizacion');
LOG.aft.autotizacion.Model = Ext.extend(LOG.util.Model, {
    constructor: function(config) {
        Ext.apply(this, config);
        LOG.aft.autotizacion.Model.superclass.constructor.call(this, config);
    },
    getGuardarAreaEntidadDestino: function(arrayIdDeposito, iddocumento) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.lbMsgGuardando, _this.idioma.lbEspere);

        Ext.Ajax.request({
            url: 'getGuardarAreaEntidadDestino',
            method: 'POST',
            params: {
                arrayIdDeposito: Ext.encode(arrayIdDeposito),
                iddocumento: iddocumento
                        //arrayIdDepositoNotIn: Ext.encode(arrayIdDepositoNotIn),
                        //idoperacion: idoperacion
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                mostrarMensaje(1, _this.idioma.lbMsgGuardado);
                _this.scope.getStorePrincipal().reload();
                Ext.MessageBox.hide();
                /* if (rd.data = 1) {
                 _this.eliminarDocumento();
                 } else if (rd.data == 0) {
                 mostrarMensaje(3, 'El documento no puede ser eliminado, ha sido generado a partir de un inventario parcial.');
                 }*/
            }
        });
    },
    getAddRegNumerico: function(arrayregNumerico, iddocumentocliente) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.lbMsgGuardando, _this.idioma.lbEspere);
        Ext.Ajax.request({
            url: 'getAddRegNumerico',
            method: 'POST',
            params: {
                arrayregNumerico: Ext.encode(arrayregNumerico),
                iddocumentocliente: iddocumentocliente
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                if (rd.codigoMsg == 1) {
                    mostrarMensaje(1, _this.idioma.lbMsgGuardado);
                }
                _this.scope.getStorePrincipal().reload();

                Ext.MessageBox.hide();
                /* if (rd.data = 1) {
                 _this.eliminarDocumento();
                 } else if (rd.data == 0) {
                 mostrarMensaje(3, 'El documento no puede ser eliminado, ha sido generado a partir de un inventario parcial.');
                 }*/
            }
        });
    },
    getEliminarAreaEntidadDestino: function(arrayid, id, clas, regnum, iddocumento, scoperegnum) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.lbMsgEliminando, _this.idioma.lbEspere);
        Ext.Ajax.request({
            url: 'getEliminarAreaEntidadDestino',
            method: 'POST',
            params: {
                arrayid: Ext.encode(arrayid),
                id: id,
                clas: clas,
                regnum: (regnum) ? regnum : null,
                iddocumento: (iddocumento) ? iddocumento : null,
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.scope.getStorePrincipal().reload();               
                if (_this.scope.getStorePrincipal().data.items.length == 1) {
                    if(scoperegnum){
                        scoperegnum.getStorePrincipal().load();
                    }else{
                         _this.scope.scope.regnumerico.getStorePrincipal().load();
                    }                   
                }
                Ext.MessageBox.hide();
            }
        });
    },
    getAdicionarDoc: function(observaciones, arrayIddestino, fn) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.lbMsgAdd, _this.idioma.lbEspere);

        var params = {};
        if (observaciones) {
            params.observaciones = observaciones;
        }
        if (arrayIddestino) {
            params.arrayIddestino = Ext.encode(arrayIddestino);
        }

        Ext.Ajax.request({
            url: 'getAdicionarDoc',
            method: 'POST',
            params: params,
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                fn(rd.iddocumento);
                Ext.MessageBox.hide();
            }
        });
    },
    getAceptarDoc: function(observaciones, arrayIddestino, iddocumento, scopeprincipal, modificar) {
        var _this = this;
        Ext.MessageBox.wait((!modificar) ? _this.idioma.lbMsgAdd : _this.idioma.lbMsgMod, _this.idioma.lbEspere);

        var params = {};
        if (observaciones) {
            params.observaciones = observaciones;
        }
        if (iddocumento) {
            params.iddocumento = iddocumento;
        }

        /* if(arrayIddestino){
         params.arrayIddestino = Ext.encode(arrayIddestino);
         }*/

        Ext.Ajax.request({
            url: 'getAceptarDoc',
            method: 'POST',
            params: params,
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                if (rd.msg == 1) {
                    mostrarMensaje(1, (!modificar) ? _this.idioma.lbMsgDatosUpdate : _this.idioma.lbMsgDatosUpdateMod);
                }
                scopeprincipal.getStorePrincipal().load();
                Ext.MessageBox.hide();
                /* if (rd.data = 1) {
                 _this.eliminarDocumento();
                 } else if (rd.data == 0) {
                 mostrarMensaje(3, 'El documento no puede ser eliminado, ha sido generado a partir de un inventario parcial.');
                 }*/
            }
        });
    },
    eliminarDoc: function(iddocumentos, fn, action, modificar) {
        var _this = this;
        if (!action) {
            Ext.MessageBox.wait(_this.idioma.lbMsgDell, _this.idioma.lbEspere);
        }

        Ext.Ajax.request({
            url: 'getEliminarDoc',
            method: 'POST',
            params: {
                iddocumento: Ext.encode(iddocumentos),
                modificar: (modificar == "modificar") ? modificar : null
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                fn(rd);
                Ext.MessageBox.hide();
            }
        });
    },
    confirmarDoc: function(iddocumentos, scopeprincipal) {
        var _this = this;
        var msgArray = Array(_this.idioma.lbMsgConfirmando, _this.idioma.lbEspere, false, _this.idioma.ldMsgErrorConfirmar, _this.idioma.lbMsgConfirmandoOk);
        var url = "getConfirmarDoc";
        var params = {};
        params = {
            iddocumento: Ext.encode(iddocumentos)
        }
        _this.getExtAjax(msgArray, url, params, scopeprincipal);

    },
    getAprobarDoc: function(iddocumentos, scopeprincipal) {
        var _this = this;
        var msgArray = Array(_this.idioma.lbMsgAprobando, _this.idioma.lbEspere, false, false, _this.idioma.lbMsgAprobandoOk);
        var url = "getAprobarDoc";
        var params = {};
        params = {
            iddocumento: Ext.encode(iddocumentos)
        }
        Ext.Ajax.timeout = 999999999;
        _this.getExtAjax(msgArray, url, params, scopeprincipal);
    },
    getAnularDoc: function(iddocumentos, scopeprincipal) {
        var _this = this;
        var msgArray = Array(_this.idioma.lbMsgAnulando, _this.idioma.lbEspere, false, false, _this.idioma.lbMsgAnulandoOk);
        var url = "getAnularDoc";
        var params = {};
        params = {
            iddocumento: Ext.encode(iddocumentos)
        };
        _this.getExtAjax(msgArray, url, params, scopeprincipal);
    },
    getExtAjax: function(msgArray, url, params, scopeprincipal, accion) {

        Ext.MessageBox.wait(msgArray[0], msgArray[1]);
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: params,
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);

                if (rd.msg == 1) {
                    mostrarMensaje(1, msgArray[4]);
                    scopeprincipal.getStorePrincipal().load();
                }
                if (rd.msg == 2) {
                    mostrarMensaje(1, msgArray[2]);
                }
                if (rd.msg == 3) {
                    mostrarMensaje(2, msgArray[3]);
                }

                Ext.MessageBox.hide();
            }
        });
    }


});
