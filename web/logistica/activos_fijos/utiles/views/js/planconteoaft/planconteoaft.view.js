Ext.ns('LOG.lb.planconteoaft');

LOG.lb.planconteoaft.View = Ext.extend(LOG.lb.gestplanconteo.View, {
    constructor: function (config) {
        var _this = this;
        this.modoSeleccion = 1;
        this.autoShow = false;
        this.busquedaBasica = true;
        this.idayuda = 'idplanconteoaft';
        _this.identidad = "";
        _this.entidad = "";
        this.subsistema = LOG.util.Subsistemas.activosfijos;
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/utiles/index.php/gestplanconteoaft/getentidad',
            method: 'POST',
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.identidad = rd.datos.identidad;
                _this.entidad = rd.datos.entidad;


            }

        });
        LOG.lb.planconteoaft.View.superclass.constructor.call(this, config);
	this.dirController = '/logistica/activos_fijos/utiles/index.php/gestplanconteoaft';
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idplan',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idejercicio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idplanconteom',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'estadoplan',
            hidden: true
        });
	this.addGridColumn({
            header: 'Área de reponsabilidad',
            dataIndex: 'area',
            default: true
        });
        /*this.addGridColumn({
            header: 'Plan de conteo',
            dataIndex: 'nbejercicio',
            default: true,
            agrupador: true,
            hidden: true
        });*/
        this.addGridColumn({
            header: this.idioma.cgPeriodo,
            width: 120,
            dataIndex: 'idperiodo',
            default: true,
	    agrupador: true,
            hidden: true,
            renderer: function (v, k, j) {
				return j.json.nombreplan + " del mes " + LOG.lb.meses.Periodos[v];
            }
        });
        this.addGridColumn({
            header: this.idioma.cgEstado,
            width: 90,
            dataIndex: 'estado',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPorciento,
            width: 120,
            dataIndex: 'porciento',
            default: true,
            editor: new LOG.util.Prototipos.inputEntero({
                allowBlank: false,
                maxValue: 100,
                minValue: 1,
                invalidText: this.idioma.porcietoNoPermitido,
                validator: function (v) {
                    if (this.gridEditor.record.data.estado != 'Elaboración')
                        return false;
                    else
                        return true;
                }
            })
        });
        this.addGridColumn({
            header: this.idioma.cgCreadoPor,
            width: 120,
            dataIndex: 'usuario',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgAprobadoPor, width: 120,
            dataIndex: 'usuarioaprobado', default: true
        });
    },
    render: function (config) {
        var _this = this;
        this.listaBotones.getItem(6).handler =
            function () {
                if (_this.getStorePrincipal().getCount()>0) {
                    var report = new LOG.util.Report({
                        reports: [
                            {
                                name: 'Vista principal',
                                params: {
                                    idestructuracomun: _this.idDeposito,
                                    idestructura: _this.identidad,
                                    idejercicio: _this.getStorePrincipal().getAt(0).data.idejercicio,
                                    arearesponsabilidad: _this.utf8_encode(_this.nomDeposito)
                                },
                                dirReport: '/distra/logistica/activofijo/planconteo/PlanConteo',
                                detailFirma: {}
                            }
                        ]
                    }).view();
                }else{
                    mostrarMensaje(1, "No hay datos que imprimir.");
                }

            };
        LOG.lb.planconteoaft.View.superclass.render.call(this, config);
	this.getStorePrincipal().load();

    },
    utf8_encode: function (argString) {
        //  discuss at: http://phpjs.org/functions/utf8_encode/
        // original by: Webtoolkit.info (http://www.webtoolkit.info/)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: sowberry
        // improved by: Jack
        // improved by: Yves Sucaet
        // improved by: kirilloid
        // bugfixed by: Onno Marsman
        // bugfixed by: Onno Marsman
        // bugfixed by: Ulrich
        // bugfixed by: Rafal Kukawski
        // bugfixed by: kirilloid
        //   example 1: utf8_encode('Kevin van Zonneveld');
        //   returns 1: 'Kevin van Zonneveld'

        if (argString === null || typeof argString === 'undefined') {
            return '';
        }

        var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        var utftext = '',
            start, end, stringl = 0;

        start = end = 0;
        stringl = string.length;
        for (var n = 0; n < stringl; n++) {
            var c1 = string.charCodeAt(n);
            var enc = null;

            if (c1 < 128) {
                end++;
            } else if (c1 > 127 && c1 < 2048) {
                enc = String.fromCharCode(
                    (c1 >> 6) | 192, (c1 & 63) | 128
                );
            } else if ((c1 & 0xF800) != 0xD800) {
                enc = String.fromCharCode(
                    (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                );
            } else { // surrogate pairs
                if ((c1 & 0xFC00) != 0xD800) {
                    throw new RangeError('Unmatched trail surrogate at ' + n);
                }
                var c2 = string.charCodeAt(++n);
                if ((c2 & 0xFC00) != 0xDC00) {
                    throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
                }
                c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
                enc = String.fromCharCode(
                    (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                );
            }
            if (enc !== null) {
                if (end > start) {
                    utftext += string.slice(start, end);
                }
                utftext += enc;
                start = end = n + 1;
            }
        }

        if (end > start) {
            utftext += string.slice(start, stringl);
        }

        return utftext;
    }


});

LOG.lb.gestplanconteo.VentanaAdicionar = Ext.extend(LOG.util.Window, {
    width: 400,
    height: 150,
    resizable: false,
    usarAplicar: false,
    modelo: undefined,
    basicForm: undefined,
    idestructura: undefined,
    constructor: function(config) {
        this.idioma = {};
        LOG.util.UIManager.apply(this.idioma, LOG.lb.gestplanconteo.Idioma);
        this.modelo = new LOG.lb.gestplanconteo.Modelo({
            idioma: this.idioma,
            urlController: '/logistica/activos_fijos/utiles/index.php/gestplanconteoaft',
            urlAccionGuardar: '/adicionarPlanConteo'
        });
        this.title = this.idioma.tlAdicionarPlan;
        this.basicForm = this.initFormPanel();
        this.items = [this.basicForm];
        this.aceptarFn = function() {
        };
        this.modelo.bindForm(this.basicForm);
        this.modelo.bindGridPanel(config.grid);
        this.buttons = [this.btnCancelar, this.btnAceptar];
        LOG.lb.gestplanconteo.VentanaAdicionar.superclass.constructor.call(this, config);
    },
    initFormPanel: function() {
        var _this = this;
        this.cls = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.tfPorciento = new LOG.util.Prototipos.inputEntero(
                {
                    name: 'adicionarporciento',
                    fieldLabel: 'Porciento por defecto',
                    allowBlank: false,
                    minValue: 1,
                    maxValue: 100,
                    maxLength: 3
                }
        );
        this.cls.addComponent(this.tfPorciento);
        this.btnAceptar = new LOG.util.Prototipos.botonAceptar({
            handler: function() {
                var resultado = _this.modelo.adicionar({idestructura: _this.idestructura, adicionarporciento: _this.tfPorciento.value, subsistema: _this.subsistema});
                if (resultado == true) {
                    _this.close();
                }
            }
        });
        this.btnCancelar = new LOG.util.Prototipos.botonCancelar({
            handler: function() {
                _this.close();
            }
        });
        var formPanel = LOG.util.UIManager.initForm({
            frame: true,
            items: [this.cls],
            region: 'center',
        });
        return formPanel;
    },
    onShowHandler: function() {
        var _this = this;
        LOG.util.UIManager.applyKey(_this.btnAceptar, _this);
        LOG.util.UIManager.applyKey(_this.btnCancelar, _this);
        _this.modelo.addActionButton(_this.btnAceptar);

    }
});


Ext.ns('LOG.lb.gestplanconteo');
LOG.lb.gestplanconteo.Modelo = Ext.extend(LOG.util.Model, {
    urlAccionModificarMesPlan: undefined,
    urlAccionModificarPeriodos: undefined,
    idplanconteom: undefined,
    constructor: function(config) {
        this.urlPlan = "/logistica/activos_fijos/utiles/index.php/gestplanconteoaft";
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