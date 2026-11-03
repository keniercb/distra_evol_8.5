Ext.ns('Ext.LOG.planes');
Ext.LOG.planes.Model = Ext.extend(LOG.util.Model, {
    constructor: function(config) {
        this.idioma = config.idioma;
        this.scope = config.scope;
        Ext.LOG.planes.Model.superclass.constructor.call(this, config);
    },
    getEntidad: function() {
        var _this = this;
        Ext.Ajax.request({
            url: 'getentidad',
            method: 'POST',
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.scope.idNodoSeleccionado = rd.identidad;
                _this.scope.denomNodoSeleccionado = rd.entidad;
                _this.scope.idPadre = rd.idpadre;
                _this.scope.concepto = rd.concepto;

                _this.scope.comboAreaResp.setValue(_this.scope.idNodoSeleccionado);
                _this.scope.comboAreaResp.setRawValue(_this.scope.denomNodoSeleccionado);

                _this.scope.comboAreaResp.enable();
                /* _this.scope.getStorePrincipal().load({
                 params: {
                 identidad: _this.scope.comboDeposito.getValue(),
                 start: 0,
                 limit: 30
                 }
                 });*/
                // _this.scope.crearArbolEstructura();
            }
        });
    },
    enviarDatos: function(objeto, _thisADD) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.labAdicionando, _this.idioma.msgEspere);
        Ext.Ajax.request({
            url: 'adicionarplan',
            method: 'POST',
            params: {
                datosplan: Ext.encode(objeto)
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                Ext.MessageBox.hide();
                if (rd.msg == 1) {
                    if (objeto.aplicar != 'aplicar')
                        _thisADD.close();
                    else {
                        _thisADD.ano.reset();
                        _thisADD.plan.reset();
                    }
                    _this.scope.getStorePrincipal().load();
                    mostrarMensaje(1, 'El plan ha sido adicionado satisfactoriamente');
                }
                if (rd.msg == 2) {
                    mostrarMensaje(1, 'Ya existe un plan para este año.');
                }
            }
        });
    },
    eliminarPlan: function(arrayIdplan){
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.msgEliminando, _this.idioma.msgEspere);
        Ext.Ajax.request({
            url: 'eliminarplan',
            method: 'POST',
            params: {
                arrayidplan: Ext.encode(arrayIdplan)
            },
            callback: function(options, success, response) {
                Ext.MessageBox.hide();
                var rd = Ext.decode(response.responseText);                
                if (rd.msg == 1) {
                   _this.scope.getStorePrincipal().load();
                    mostrarMensaje(1, 'El plan ha sido eliminado satisfactoriamente.');
                }
                else
                    mostrarMensaje(1, 'El plan no se pudo eliminar');
            }
        });
    },
    onModificarPlan: function(e) {
        var _this = this;          
        Ext.MessageBox.wait(_this.idioma.msgModificar, _this.idioma.msgEspere);
        Ext.Ajax.request({
            url: 'modificarplan',
            method: 'POST',
            params: {
                idplan: _this.scope.smGridPrincipal.selections.items[0].data.idplan,
                plan: e
            },           
            callback: function(options, success, response) {
                Ext.MessageBox.hide();
                response = Ext.decode(response.responseText);
                if (response.msg == 1) {
                    mostrarMensaje(1, 'El plan ha sido modificado satisfactoriamente.');
                    _this.scope.getStorePrincipal().load();
                }
                else {
                    mostrarMensaje(2, 'No se pudo modificar el plan.');
                }
            }
        });
    },
    confirmarAprobarCancelarPlan: function(params, msg){
        var _this = this;        
         Ext.MessageBox.wait(msg, _this.idioma.msgEspere);
         Ext.Ajax.request({
            url: 'confaprobarcancelarplan',
            method: 'POST',
            params: {
                idestado: params.idestado,
                idplan: Ext.encode(params.idplan)
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
               Ext.MessageBox.hide();
                Ext.getBody().unmask();
                if (rd.msg == 2) {
                    _this.scope.getStorePrincipal().load();
                    mostrarMensaje(1, _this.idioma.msgPlanConfirmado);
                }
                if (rd.msg == 5) {
                    _this.scope.getStorePrincipal().load();
                    mostrarMensaje(1, _this.idioma.msgPlanAprobado);
                }
                if (rd.msg == 1) {
                    _this.scope.getStorePrincipal().load();
                    mostrarMensaje(1, _this.idioma.msgPlanCancelado);
                }
                else
                    mostrarMensaje(1, _this.idioma.msgPlanError);
            }
        });
    }
});

