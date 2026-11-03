Ext.ns('LOG.model');

LOG.model.confreporte = Ext.extend(LOG.util.Model, {
    constructor: function (config) {
        this.scope = config.scope;
        LOG.model.confreporte.superclass.constructor.call(this, config);
    },

    getGuardar: function (params, idestructura) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.msgGuardando, _this.idioma.msgEspere || '...');

        Ext.Ajax.request({
            url: 'getGuardarDatos',
            method: 'POST',
            params: {
                guardar: Ext.encode(params),
                idestructura: parseInt(idestructura)
            },
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var rd = Ext.decode(response.responseText);
                if (rd.codigoMsg == 1) {
                    mostrarMensaje(2, _this.idioma.lbMsgGuardando);
                    _this.scope.getStorePrincipal().commitChanges();
                }
            }
        });
    },
    cargarConfiguracion: function (tfFechaDepreciacion, _fn) {
        var _this = this;
        Ext.Ajax.request({
            url: 'cargarconfiguracion',
            method: 'POST',
            callback: function (options, success, response) {
                var resp = Ext.decode(response.responseText);
                if (resp.success) {
                    if(resp.entidadnodeprecia == true){
                        mostrarMensaje(2, idioma.lbMsgEntidadNoDeprecia);
                    }else if (typeof _fn == 'function') {
                        _fn.call(this, [resp]);
                    }
                }
                //  tfFechaDepreciacion.setValue(rd.periodo);                
            }
        });
    },
    getValidarView: function (smTabActivo, tabsGeneral, idioma, depreciarTodo) {
        var cero = 0; //si existen dados en cero se pone 1;
        var nulo = 0;//si existen dados en null se pone 2 
        var arrData = new Array();
        var _this = this;
        if (!tabsGeneral.activeTab.disabled && smTabActivo.length >= 1) {
            for (var i = 0; i < smTabActivo.length; i++) {
                if (smTabActivo[i].data.esta != 'verde') {
                    arrData.push(smTabActivo[i].data.idregnumerico);
                }
            }
            if (tabsGeneral.getActiveTemplate().idmetodo == 1) {

                if (depreciarTodo) {
                    var datTabActivo = tabsGeneral.getActiveTemplate().storePrincipal.data.items;
                    for (var i = 0; i < datTabActivo.length; i++) {
                        if (datTabActivo[i].data.recursoconsumido == null) {
                            nulo = 2;
                        }
                        if (datTabActivo[i].data.recursoconsumido == 0) {
                            cero = 1;
                        }
                    }
                } else {
                    for (var i = 0; i < smTabActivo.length; i++) {
                        if (smTabActivo[i].data.recursoconsumido == null) {
                            nulo = 2;
                        }
                        if (smTabActivo[i].data.recursoconsumido == 0) {
                            cero = 1;
                        }
                    }
                }


                if (nulo == 2 && cero == 1) {
                    mostrarMensaje(2, idioma.lbMsgkmNullCero, function (btn) {
                        if (btn == "ok") {
                            _this.getDepreciar(arrData, tabsGeneral.getActiveTemplate().idmetodo);
                        }
                    })
                }
                else if (nulo == 2) {
                    mostrarMensaje(2, idioma.lbMsgkmNull, function (btn) {
                        if (btn == "ok") {
                            _this.getDepreciar(arrData, tabsGeneral.getActiveTemplate().idmetodo);
                        }
                    })
                }
                else if (cero == 1) {
                    mostrarMensaje(2, idioma.lbMsgkmCero, function (btn) {
                        if (btn == "ok") {
                            _this.getDepreciar(arrData, tabsGeneral.getActiveTemplate().idmetodo);
                        }
                    })
                }
                else {
                    mostrarMensaje(2, idioma.lbMsgkmconfirmacionDepre, function (btn) {
                        if (btn == "ok") {
                            _this.getDepreciar(arrData, tabsGeneral.getActiveTemplate().idmetodo);
                        }
                    });
                }

            }

            else {
                mostrarMensaje(2, idioma.lbMsgkmconfirmacionDepre, function (btn) {
                    if (btn == "ok") {
                        _this.getDepreciar(arrData, tabsGeneral.getActiveTemplate().idmetodo);
                    }
                });
            }
        }
    }
});