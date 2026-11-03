Ext.ns('LOG.tall.citas');
LOG.tall.citas.Model = Ext.extend(LOG.lb.documento.Model , {
    urlAccionCerrar:undefined,
    dirtyGrids:false,
    dirtyDinamic:false,
    listaDinamicos: undefined,
    listaDeshabilitadosAValidar:undefined,
    formBasicMedio: undefined,
    constructor: function(config) {
        this.listaDinamicos = new LOG.util.List();
        this.formBasicMedio = new LOG.util.List();
        this.listaDeshabilitadosAValidar = new LOG.util.List();
        config.urlController='/logistica/talleres/citas/index.php/citastalleres/';
        config.urlAccionGuardar='adicionarDocumento';
        config.urlAccionAprobar='aprobarDocumento';
        this.urlAccionCerrar='cerrarOrdenTrabajo';
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'idcita'
        });
        config.fields.push({
            name: 'idcliente'
        });
        config.fields.push({
            name: 'idindicador'
        });
        config.fields.push({
            name: 'idpadreindicador'
        });
        config.fields.push({
            name: 'idproducto'
        });
        config.fields.push({
            name: 'producto'
        });

        LOG.tall.citas.Model.superclass.constructor.call(this,config);
        this.urlAccionAprobar='aprobarDocumento';
    },
    cargarDatosMedio:function(params,_fn,_fnfail){
        var objSubmit = params || {};
        Ext.Ajax.request({
            url:  this.urlController + 'cargarDatosMedio',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                //Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
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
    cargarActividadesCita:function(params,_fn,_fnfail){
        var objSubmit = params || {};
        Ext.Ajax.request({
            url:  this.urlController + 'cargarActividadesCita',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                //Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
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
    cargarPiezasCita:function(params,_fn,_fnfail){
        var objSubmit = params || {};
        Ext.Ajax.request({
            url:  this.urlController + 'cargarPiezasDisp',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                //Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
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
    cargarAtributosMedios:function(params,_fn,_fnfail){
        var objSubmit = {};
        objSubmit.idindicador = Ext.encode(params);
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionmediostaller/atributosPorIndicador',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                //Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
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
    cargarCitasinicio:function(params,_fn,_fnfail){
        var objSubmit = params || {};
        Ext.Ajax.request({
            url:  this.urlController + 'cargarCitas',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                //Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
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
    salvar: function(parametros, _fn, _fnfail) {
        var _this = this;

       // var valido = (parametros['terceros'])?this.isValidBasico():this.isValid();

      //  if (valido) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
            var objSubmit = {};
            var obj = this;
            objSubmit.data = Ext.encode(this.encode(obj));
            objSubmit.listasactividades = Ext.encode(parametros[0]);
            objSubmit.listasmateriales  = Ext.encode(parametros[1]);
            objSubmit.listasfallas  = Ext.encode(parametros[2]);
            objSubmit.datosdinamicosmedio  = Ext.encode(this.listaDinamicos.getArray());
            objSubmit.idServicioOld = parametros[3];
            Ext.Ajax.request({
                url: this.urlController + this.urlAccionGuardar,
                method: 'POST',
                timeout: '240000',
                params: objSubmit,
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        this.setDefaulFormValues();
                        this.setDefaulFormDinamicosValues();
                        if (s) {
                            if(resp.existiaactividad){
                                mostrarMensaje(1, this.idioma.lbMsgExisteAlgunaActividad);
                            }
                            if (this.st) {
                                var rs = this.sm.getSelected();
                                this.st.reload({callback:function(){
                                    }.createDelegate(this)
                                });
                            }
                        }

                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }

                        //_this.gridActividades.getStorePrincipal().load({params: {idcita: _this.record.data.iddocumento}});
                    } else {
                        if(resp.errorAtribIdentificador){
                            mostrarMensaje(3, _this.idioma.msgErrorIdentificador );
                        }
                        if (typeof _fnfail == 'function') {
                            _fnfail.createDelegate(this, [resp]).call();
                        }
                    }
                }.createDelegate(this)
            });
       // } else {
           // mostrarMensaje(1, this.idioma.msgDatosIncorrectos);
       // }
    },
    /**
     *
     * @param {type} parametros
     * @param {type} _fn
     * @returns {undefined}
     */
    aprobar: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgAprobarDocumento, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAprobandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.correocliente = (objSubmit.correocliente) ? Ext.encode([objSubmit.correocliente]) : Ext.encode(_this.getSelectedId());
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAprobar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgDocumentoAprobado);
                                _this.st.reload();
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        });
    },
    bindFormMedio: function(basicForm) {
        var _scope = this;
        this.listaDinamicos.deleteAll();
        this.formBasicMedio.deleteAll();
        basicForm.getForm().items.each(function(field) {
            if (field.isFormField) {
                if (_scope.xtypesEvtents[field.getXType()]
                    && _scope.xtypesEvtents[field.getXType()]['evt'] == 'keyup'
                    && !field.enableKeyEvents)
                {
                    field.enableKeyEvents = true;
                }
                field.fireEvent = field.fireEvent.createSequence(function(e) {
                    if ((_scope.xtypesEvtents[field.getXType()]
                        && e == _scope.xtypesEvtents[field.getXType()]['evt'])
                        || e == 'blur')
                    {
                        var auxObj = {};
                        var existe = _scope.existeYa(field.getName());
                        auxObj[field.getName()]= field.getValue();
                        auxObj['name']= field.getName();
                        auxObj['identificador']= field.identificador;
                        auxObj['tipo']= field.tipo;
                        auxObj['etiqueta']= field.etiqueta;
                        auxObj['nombretabla']= field.nombretabla;
                        auxObj['dinamico']= field.dinamico;
                        _scope.listaDinamicos.setItem(auxObj, existe);

                        if (_scope.isValid() &&  basicForm.getForm().isValid()) {
                            _scope.habilitarBotones();
                        } else {
                            _scope.habilitarBotones(true);
                        }
                    }
                });
                _scope.formBasicMedio.add(field);
            }
        });
    },
    actualizarValoresDinamicos:function(formulario){
        var _this = this;
        var fildIdent = null;
        formulario.getForm().items.each(function(field) {
            if (field.isFormField) {
                var auxObj = {};
                var existe = _this.existeYa(field.getName());
                auxObj[field.getName()]= field.getValue();
                auxObj['name']= field.getName();
                auxObj['identificador']= field.identificador;
                auxObj['tipo']= field.tipo;
                auxObj['etiqueta']= field.etiqueta;
                auxObj['nombretabla']= field.nombretabla;
                _this.listaDinamicos.setItem(auxObj, existe);
                _this.habilitarBotones(true);
                if (field.identificador == 1) {
                    fildIdent = field;
                }
            }
        });
        return fildIdent;
    },
    existeYa:function(name){
        var result = -1;
        this.listaDinamicos.each(function(it,pos){
            if(it.name == name){
                result = pos;
            }
        });
        return result;
    },
    obtenerValorAtrbIdentificador:function(){
        var _this = this;
        if(_this.atributoidentificador) {
            return _this.atributoidentificador;
        } else {
            var result = null;
            this.listaDinamicos.each(function(it,pos){
                if(it.identificador == 1){
                    result = it[it.name];
                }
            });
            return result;
        }

    },
    setDefaulFormDinamicosValues: function() {
        if (!this.formBasicMedio) {
            return;
        }
        if(this.formBasicMedio.count() > 0){
            this.formBasicMedio.each(function(field){
                if(!field.isValid()){
                    field.originalValue = field.getValue();
                }
            })
        }
        this.dirtyDinamic = false;
        this.habilitarBotones(true);
    },
    generarPedido: function(parametros, _fn, _fnfail) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgSalvandoPedido, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        objSubmit.idcliente = Ext.encode(objSubmit.idcliente);
        objSubmit.idcita = Ext.encode(objSubmit.idcita);
        Ext.Ajax.request({
            url: this.urlController + 'generarPedido',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, 'El pedido #'+resp.datos.numeroref+' con fecha '+resp.datos.fechacontable+' ha sido guardado satisfactoriamente.');
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
    }
});