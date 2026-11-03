Ext.ns('LOG.lb.gestplanconteo');
LOG.lb.gestplanconteo.Modelo = Ext.extend(LOG.util.Model, {
    urlAccionModificarMesPlan: undefined,
    urlAccionModificarPeriodos: undefined,
    idplanconteom: undefined,
    constructor: function(config) {
        this.urlPlan = "/logistica/utiles/planconteo/index.php/planconteo";
        config.urlAccionEliminar = this.urlPlan + '/eliminarPlanConteo';
        this.urlAccionModificarMesPlan = this.urlPlan + '/modificarPlanConteo';
        this.urlAccionModificarPeriodos = this.urlPlan + '/modificarPeriodosPlan';
        this.idplanconteom = config.idplanconteom;
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({name: 'adicionarporciento'});
        config.fields.push({name: 'modificarporciento'});
        config.fields.push({name: 'modificarperiodo'});
        config.fields.push({name: 'idplan', primary: true});
        LOG.lb.gestplanconteo.Modelo.superclass.constructor.call(this, config);
    },
    adicionar: function(parametros, _fn) {
        if (this.isValid()) {
            Ext.MessageBox.wait(this.idioma.msgAdicionandoPlan, this.idioma.msgEspere || '...');
            var objSubmit = parametros || {};
            objSubmit.data = Ext.encode(this.encode());
            Ext.Ajax.request({
                url: this.urlController + this.urlAccionGuardar,
                method: 'POST',
                params: objSubmit,
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, this.idioma.msgPlanAdicionadoSatisfactorio);
                            this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    }
                    else {
                        mostrarMensaje(1, this.idioma.msgPlanConteoExiste);
                    }
                }.createDelegate(this)
            });
        } else {
            mostrarMensaje(3, this.idioma.msgDatosIncorrectos)
            return false;
        }
        return true;
    },
    modificarPeriodoPlan: function(parametros) {
        var objSubmit = {};
        objSubmit.idplanconteom = Ext.encode(parametros['idplanconteom']);
        objSubmit.porciento = Ext.encode(parametros['porciento']);
        Ext.Ajax.request({
            url: this.urlController + this.urlAccionModificarMesPlan,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.msgModificarPlanConteo);
                        this.st.reload();
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    aplicarPorciento: function(parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgConfirmarAplicar(_this.sm.getSelections()[0].data.porciento), function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgAplicandoPlan, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                var objTemp = this.encode();
                objTemp['idplan'] = _this.getSelectedId();
                objTemp['porciento'] = _this.sm.getSelections()[0].data.porciento;
                objSubmit.data = Ext.encode(objTemp);
                Ext.Ajax.request({
                    url: _this.urlPlan + '/aplicarPorcientoPeriodos',
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgAplicarPeriodo);
                                this.st.reload();
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        }.createDelegate(this));
    },
    confirmarPeriodo: function(parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        var nbPeriodo = LOG.lb.meses.Periodos[_this.sm.getSelections()[0].data.idperiodo];
        mostrarMensaje(2, this.idioma.msgConfirmarConfirmar(nbPeriodo), function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgConfirmandoPeriodo, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.data = Ext.encode(this.encode());
                Ext.Ajax.request({
                    url: _this.urlPlan + '/confirmarPeriodoPlan',
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgPeriodoConfirmado(nbPeriodo));
                                this.st.reload();
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        }.createDelegate(this));
    },
    anularPeriodo: function(parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        var nbPeriodo = LOG.lb.meses.Periodos[_this.sm.getSelections()[0].data.idperiodo];
        mostrarMensaje(2, this.idioma.msgConfirmarAnular(nbPeriodo), function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgAnulandoPeriodo, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.data = Ext.encode(this.encode());
                Ext.Ajax.request({
                    url: _this.urlPlan + '/anularPeriodoPlan',
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgPeriodoAnulado(nbPeriodo));
                                this.st.reload();
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        }.createDelegate(this));
    },
    aprobarPeriodo: function(parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        var nbPeriodo = LOG.lb.meses.Periodos[_this.sm.getSelections()[0].data.idperiodo];
        mostrarMensaje(2, this.idioma.msgConfirmarAprobar(nbPeriodo), function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgAprobandoPeriodo, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.data = Ext.encode(this.encode());
                Ext.Ajax.request({
                    url: _this.urlPlan + '/aprobarPeriodoPlan',
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgPeriodoAprobado(nbPeriodo));
                                this.st.reload();
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        }.createDelegate(this));
    }
});