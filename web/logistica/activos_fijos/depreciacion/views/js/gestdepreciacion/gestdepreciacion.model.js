Ext.ns('Ext.LOG');

Ext.LOG.Model = Ext.extend(LOG.util.Model, {
    constructor: function (config) {
        Ext.LOG.Model.superclass.constructor.call(this, config);
    },
    getDepreciar: function (arrData, idmetodo, todos,getStorePrincipal) {

        var _this = this;
        Ext.MessageBox.wait(_this.idioma.lbDepreciando, _this.idioma.msgEspere || '...');

        var params = (!todos) ? {
            arrData: Ext.encode(arrData),
            idmetodo: idmetodo
        } : {
            todos: true,
            idmetodo: idmetodo
        };

        Ext.Ajax.request({
            timeout: '3000000',
            url: 'getdepreciarmedio',
            method: 'POST',
            params: params,
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var rd = Ext.decode(response.responseText);
                if (rd.msg == 1) {
                    Ext.getBody().unmask();
                    mostrarMensaje(2, _this.idioma.lbMsgDepreciacion);
                    getStorePrincipal.load();
                }
                if(rd.msg == 4){
                    mostrarMensaje(3, 'La entidad no se encuentra configurada para depreciar sus medios en uso.');
                }
                Ext.getBody().unmask();
            }
        });
    },
    depreciarTodos: function (stores) {

        var _this = this;
        Ext.MessageBox.wait(_this.idioma.lbDepreciando, _this.idioma.msgEspere || '...');

        Ext.Ajax.request({
            timeout: '3000000',
            url: 'depreciartodos',
            method: 'POST',
            params: {},
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var rd = Ext.decode(response.responseText);
                if (rd.codMsg == 1) {
                    Ext.getBody().unmask();
                    mostrarMensaje(2, _this.idioma.lbMsgDepreciacion);
                    //getStorePrincipal.load();
                    for(var i = 0; i < stores.length; i++){
                        stores[i].load();
                    }
                } else if(rd.errorCode == 'VAL_AFT_PENDIENTES'){
                    mostrarMensaje(3, 'No se puede efectuar la depreciación con activos pendientes por recepcionar de los traslados externos y las devoluciones.');
                } else if(rd.errorCode == 'VAL_ULTIMO_DIA'){
                    mostrarMensaje(3, 'Solo puede depreciar el último día del mes.');
                } else if(rd.errorCode == 'VAL_DEP_EXIST'){
                    mostrarMensaje(3, 'Este mes ya se ha realizado la depreciación.');
                } else if(rd.errorCode == 'VAL_NO_CONF'){
                    mostrarMensaje(3, 'La entidad no se encuentra configurada para depreciar sus medios en uso.');
                }
                Ext.getBody().unmask();
            }
        });
    },
    cargarConfiguracion: function (tfFechaDepreciacion, _fn) {
        var _this = this;
        Ext.getBody().mask('Cargando', 'x-mask-loading');
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