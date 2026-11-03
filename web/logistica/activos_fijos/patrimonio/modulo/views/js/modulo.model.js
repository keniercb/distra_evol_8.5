Ext.ns('Ext.LOG.modulo');

Ext.LOG.modulo.Model = Ext.extend(LOG.util.Model, {
    constructor: function(config) {
        this.listaGeneral = new LOG.util.List();
        this.formularios = new LOG.util.List();
        this.ListBotones = new LOG.util.List();
        this.oldRecords = Array();
        this.gridsValidos = false;
        this.dirty = false;
        this.dataregnumerico = config.dataregnumerico;
        this.idioma = config.idioma;
        Ext.LOG.modulo.Model.superclass.constructor.call(this, config);
    },
    inicializarListas: function() {
        this.listaGeneral.add(new LOG.util.List());
    },
    bindFormMedio: function(basicForm, pos) {
        var _scope = this;
        _scope.formularios.add(basicForm.getForm());
        basicForm.getForm().items.each(function(field) {
            if (field.isFormField) {
                if (_scope.xtypesEvtents[field.getXType()]
                        && _scope.xtypesEvtents[field.getXType()]['evt'] == 'keyup'
                        && !field.enableKeyEvents ) {
                    field.enableKeyEvents = true;
                }
                field.fireEvent = field.fireEvent.createSequence(function(e) {
                    if ((_scope.xtypesEvtents[field.getXType()]
                            && e == _scope.xtypesEvtents[field.getXType()]['evt'])
                            || e == 'blur') {
                        var auxObj = {};
                        var existe = _scope.existe(field.getName(), pos);
                        auxObj[field.getName()] = field.getValue();
                        auxObj['name'] = field.getName();
                        _scope.listaGeneral.getItem(pos).setItem(auxObj, existe);
                        _scope.habilitarBtns();
                    }
                });
            }
        });
    },
    existe: function(name, pos) {
        var result = -1;
        this.listaGeneral.getItem(pos).each(function(it, pos) {
            if (it.name == name) {
                result = pos;
            }
        });
        return result;
    },
    obtenerLista: function(pos) {
        return this.listaGeneral.getItem(pos);
    },
    habilitarBtns: function() {
        var _scope = this;
        var hb = Array();
        _scope.formularios.each(function(form) {
            if (form.isValid())
                hb.push(form.isValid());
            if(_scope.esDirty(form.getFieldValues(), form.idComponent))
                _scope.dirty = true;
        });
        _scope.ListBotones.each(function(b) {
            if (hb.length == _scope.formularios.count() && _scope.gridsValidos && _scope.dirty)
                b.enable();
            else
                b.disable();
        });

    },
    esDirty : function(actual, tab) {
        var _scope = this;
        if(_scope.oldRecords.length > 0) {
            var old = _scope.oldRecords[tab];
            for (var prop in old) {
                for (var prop1 in actual) {
                    if (prop == prop1) {
                        actual[prop1] = (actual[prop1] == null) ? "" : actual[prop1];
                        if (old[prop].toString() != actual[prop1].toString() && typeof(old[prop]) == typeof(actual[prop1])) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },
    addListConditions: function(b) {
        this.ListBotones.add(b);
    },
    prepararParamsGrids: function(st) {
        var array = Array();
        st.each(function(o) {
            var obj = {};
            for (var prop in o.data) {
                if (o.data[prop] != "" && o.data[prop] != null)
                    obj[prop] = o.data[prop]
            }
            array.push(obj);
        });

        return array;
    },
    guardarValores: function(stores, _fn, objObra) {
        var _scope = this;

        var param = {};
        param['cod_entidad'] = this.entidad;
        param['espadre'] = _scope.dataregnumerico.data.espadre;
        param['idregnumerico'] = _scope.dataregnumerico.data.idregnumerico;
        this.listaGeneral.each(function(list, p) {
            var aux = {};
            list.each(function(o) {
                if (o[o.name] != "")
                    aux[o.name] = o[o.name];
            });
            stores.each(function(o) {
                if (o.tab == p && o.store.getCount() > 0) {
                    aux['grid'] = _scope.prepararParamsGrids(o.store);
                }
            });
            
            param['tab' + p] = Ext.encode(aux);
        });
        Ext.MessageBox.wait(this.idioma.labAdicionando, this.idioma.msgEspere || '...');

        Ext.Ajax.request({
            url: '/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos/guardarRegistros',
            method: 'POST',
            params: param,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.MsgConformarExpediente);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    setEntidad: function(entidad) {
        this.entidad = entidad;
    },
    setGridValidos: function(validos) {
        this.gridsValidos = validos;
    },
    setDirty : function(dirty) {
        this.dirty = dirty;
    },
    setOldValues: function () {
        var _scope = this;
        _scope.formularios.each(function(form) {
            var old = form.getFieldValues();
                for (var prop in old) {
                    if (typeof(old[prop]) == 'undefined' || old[prop] == null) {
                        old[prop] = "";
                    }
                }
            _scope.oldRecords.push(old);
        });
    },
    cargarStore: function(scope, _fn) {
        var _this = this;
        Ext.MessageBox.wait('Cargando configuración', 'Por favor espere...' || '...');
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos/getModulos',
            method: 'POST',
            params: {
                idarea: scope.idNodoSeleccionado,
                estree: scope.getTreegrid(),
                _id: scope.getTreegrid().getSelectionModel().getSelected().data._id
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.objObra = Array();

                if (rd.datos) {

                    for (var i = 0; i < rd.datos.length; i++) {
                        _this.objObra.push(rd.datos[i].idregnumerico);
                    }
                    //if (_this.objObra.length > 0) {
                    if (typeof _fn == 'function') {
                        _fn.call(this, _this.objObra);
                        // }
                    }
                }
            }
        });
    },
    eliminarDeGrids: function(params, url, _fn, msg) {
        var _this = this;
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: params,
            callback: function(options, success, response) {
                Ext.MessageBox.hide();
                var rd = Ext.decode(response.responseText);
                if (rd.msg == 1) {
                    mostrarMensaje(1, msg);
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [rd]).call();
                    }
                }
            }
        });
    },
    cargarRegistros: function(_fn, objObra) {
        var _scope = this;
        var param = {};
       
        param['idregnumerico'] = _scope.dataregnumerico.data.idregnumerico;       
        param['cod_entidad'] = this.entidad;         
        param['idsaux'] = (objObra && objObra.length > 0)? Ext.encode(objObra): null;       
        Ext.Ajax.request({
            url: 'cargarRegistros',
            method: 'POST',
            params: param,
            callback: function(options, success, response) {
                var resp = Ext.decode(response.responseText);
                if (resp.success) {
                    if (typeof _fn == 'function') {
                        _fn.call(this, resp.datos);
                    }
                }
                
            }
        });
    }
});