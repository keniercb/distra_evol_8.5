Ext.ns('LOG.tall.ordentrabajo');
LOG.tall.ordentrabajo.Model = Ext.extend(LOG.lb.documento.Model , {
    urlAccionCerrar:undefined,
    urlAccionFacturar:undefined,
    dirtyGrids:false,
    dirtyDinamic:false,
    listaDinamicos: undefined,
    listaDeshabilitadosAValidar:undefined,
    formBasicMedio: undefined,
    parent: undefined,
    constructor: function(config) {
        this.listaDinamicos = new LOG.util.List();
        this.formBasicMedio = new LOG.util.List();
        this.parent = config.parent;
        this.listaDeshabilitadosAValidar = new LOG.util.List();
        config.urlController='/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/';
        config.urlAccionGuardar='adicionarDocumento';
        config.urlAccionAprobar='aprobarDocumento';
        this.urlAccionCerrar='cerrarOrdenTrabajo';
        this.urlAccionFacturar='facturarOrdenTrabajo';
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'fallascliente'
        });
        config.fields.push({
            name: 'dictamentecnico'
        });
        config.fields.push({
            name: 'idtecnico'
        });/*
        config.fields.push({
            name: 'fechacomienzo'
        });
        config.fields.push({
            name: 'fechaterminacion'
        });*/
        config.fields.push({
            name: 'fechainicio'
        });
        config.fields.push({
            name: 'fechafin'
        });
        config.fields.push({
            name: 'idservicio'
        });
        config.fields.push({
            name: 'garantia'
        });
        config.fields.push({
            name: 'idcliente'
        });
        config.fields.push({
            name: 'iddocumentoorigen'
        });
        config.fields.push({
            name: 'documentoorigen'
        });
        config.fields.push({
            name: 'atributoidentificador'
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
        config.fields.push({
            name: 'importetotal'
        });
        config.fields.push({
            name: 'importealternativo'
        });
        config.fields.push({
            name: 'estadoorden'
        });
        config.fields.push({
            name: 'idcentrocosto'
        });
        config.fields.push({
            name: 'tipo'
        });
        config.fields.push({
            name: 'idplanificacionmantenimiento'
        });
		config.fields.push({
            name: 'idagencia'
        });
        config.fields.push({
            name: 'idtipoprecio'
        });
        LOG.tall.ordentrabajo.Model.superclass.constructor.call(this,config);
        this.urlAccionAprobar='aprobarDocumento';
    },
    verificarEntidades: async function(params, _fn) {
        let _this = this;
        Ext.MessageBox.wait(_this.idioma.msgConfirmandoObjeto, _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: _this.urlController + 'verificarEntidades',
            method: 'POST',
            params: params,
            callback: function (o, s, r) {
                let resp = LOG.util.UIManager.decodeAjaxResponse(r);
                Ext.MessageBox.hide();
                if (resp.success) {
                    if (resp.entidadesexternas) {
                        mostrarMensaje(2, 'Existen productos en la orden de otras entidades que ser\xe1n transfereidos. '+
                            '\xbfDesea continuar\x3f', function (btn) {
                            if (btn == 'ok') {
                                if (typeof _fn == 'function') {
                                    _fn.createDelegate(this, [resp]).call();
                                }
                            }
                        });
                    }else if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });
    },
    transfererirProductos: function (iddocumento, _fn, _fnfail) {
        let _this = this;
        mostrarMensaje(2, 'Productos de otras entidades ser\xe1n transfereidos. '+
            '\xbfDesea continuar\x3f', function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait('Transfiriendo productos', _this.idioma.msgEspere || '...');
                Ext.Ajax.request({
                    url: _this.urlController + 'transferirProductos',
                    method: 'POST',
                    params: {
                        iddocumento: iddocumento
                    },
                    callback: function (o, s, r) {
                        let resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        Ext.MessageBox.hide();
                        if (resp.success) {
                            mostrarMensaje(1, 'Los materiales han sido transferidos satisfactoriamente');

                        }
                    }.createDelegate(this)

                });
                if (typeof _fn == 'function') {
                    _fn.createDelegate(this, [resp]).call();
                }
            }
        });
    },
    /**
     *
     * @param {type} parametros
     * @returns {undefined}
     */
    salvar: function(parametros, _fn, _fnfail) {
        var _this = this;
        var valido = (parametros['terceros'])?this.isValidBasico():this.isValid();
        if (valido) {
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
                    if(resp.codMsg == 3){
                        _this.parent.winGestionarDocumento.prepareDocModify(_this.parent.winGestionarDocumento.recordOriginal);
                    } else if(resp.codMsg == 23505){
                        mostrarMensaje(3, 'N.º duplicado, intente guardar los datos nuevamente.');
                    } else {
                        if (resp.success) {
                            this.setDefaulFormValues();
                            this.setDefaulFormDinamicosValues();
                            if (s) {
                                if(resp.existiaactividad){
                                    mostrarMensaje(1, this.idioma.lbMsgExisteAlgunaActividad);
                                }
                                if(resp.datos.estadoorden == 1)
                                    mostrarMensaje(1, this.idioma.lbMsgOrdenEnEspera);
                                else
                                    mostrarMensaje(1, this.idioma.lbMsgObjetoSalvado);
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
                        } else {
                            if(resp.errorAtribIdentificador){
                                mostrarMensaje(3, _this.idioma.msgErrorIdentificador );
                            }
                            if (typeof _fnfail == 'function') {
                                _fnfail.createDelegate(this, [resp]).call();
                            }
                        }
                    }
                }.createDelegate(this)
            });
        } else {
            mostrarMensaje(1, this.idioma.msgDatosIncorrectos);
        }
    },
    cerrarOrdenTrabajo: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgCerrarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgCerrandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                objSubmit.idComprobante = -1;
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionCerrar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (s) {
                                var mensaje = _this.idioma.msgDocumentoCerrado;
                                if (resp.datos.documento) {
                                    mensaje = mensaje +
                                        '<br>Se ha generado la factura Nro. Ref: <b>'+resp.datos.documento.numeroref+'</b>'
                                }
                                if (resp.comprobante) {
                                    if (resp.comprobante.codMsg) {
                                        mensaje = mensaje + "<br>No se ha podido generar el comprobante por descuadre en los importes";
                                    } else {
                                        objSubmit.idComprobante = resp.comprobante.idComprobante;
                                        objSubmit.numComprobante = resp.comprobante.numComprobante;
                                        objSubmit.fechaComprobante = resp.comprobante.fechaComprobante;
                                        mensaje = mensaje + "<br>Se ha generado el comprobante numero: <b>"+resp.comprobante.numComprobante;
                                    }
                                }
                                mostrarMensaje(1, mensaje);
                                if (objSubmit.idComprobante != -1) {
                                    Ext.Ajax.request({
                                        url: '/logistica/utiles/comprobante/index.php/comprobante/postCreateComprobanteAuto',
                                        method: 'POST',
                                        params: objSubmit,
                                        callback: function (o, s, r) {
                                            Ext.MessageBox.hide();
                                            _this.st.reload();
                                        }.createDelegate(_this)
                                    });
                                } else {
                                    Ext.MessageBox.hide();
                                    _this.st.reload();
                                }
                            }

                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        } else {
                            if (resp.codigoMsg == -3) {
                                mostrarMensaje(1, resp.msg + ' ' + resp.datos.join(', '), function () {
                                    
                                });
                            } else {
                                mostrarMensaje(1, resp.msg);
                            }
                        }
                    }.createDelegate(this)

                });
            }
        });
    },
    generarFactura: function (iddocumento, _fn) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgFacturarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgFacturandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = {};
                objSubmit.id = iddocumento;
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionFacturar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (s) {
                                var mensaje = 'La factura ha sido generada satisfactoriamente.<br>Nro. Ref: <b>'+resp.datos.documento.numeroref+'</b>' 
                                mostrarMensaje(1, mensaje);
                                _this.st.reload();
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        } else {
                            if (resp.codigoMsg == -3) {
                                mostrarMensaje(1, resp.msg + ' ' + resp.datos.join(', '), function () {
                                    
                                });
                            } else {
                                mostrarMensaje(1, resp.msg);
                            }
                        }
                    }.createDelegate(this)

                });
            }
        });
    },
    registrarOrdenTrabajo:function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgRegistrarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgRegistrandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionRegistrar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgDocumentoRegistrado);
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
    /**
     *
     * @param {type} basicForm
     * @returns {undefined}
     */
    bindForm: function(basicForm) {
        Ext.apply(basicForm.getForm(), { isValid : function(){
            var valid = true;
            this.items.each(function(f){
                if(f.validarEnFormBasico) {
                    if(!f.validate() ){
                        valid = false;
                    }
                }
            });
            return valid;
        }});
        LOG.tall.ordentrabajo.Model.superclass.bindForm.call(this,basicForm);
    },
    isValid: function() {
        if (this.basicForm) {
            if (this[this.primaryKeyField]) {
                return this.basicForm.isValid() && this.isValidFormMedios() && this.isDirty();
            } else {
                return this.basicForm.isValid() && this.isValidFormMedios();
            }
        }
        return false;
    },
    isDirty:function(){
        var estado = this.obtenerEstadoActual();
        if(estado == 1 || estado == 2) {
            if (this.basicForm.isDirty() || this.dirtyGrids || this.dirtyDinamic) {
                return true;
            }
            else return false;
        }
        else return false;
    },
    isValidBasico:function(){
        return this.basicForm.isValid() && this.isValidFormMedios();
    },
    comprobarExistencia:function(parametros, _fn, _fnfail){
        var objSubmit = {};
        objSubmit.idsindicador = Ext.encode(parametros);
        Ext.Ajax.request({
            url: this.urlController + 'comprobarExistenciaMaterial',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
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
    cargarActividadesExistentes:function(parametros, _fn, _fnfail){
        var objSubmit = {};
        objSubmit.nivel =  parametros['nivel'];
        objSubmit.idservicio = Ext.encode(parametros['idservicio']);
        Ext.Ajax.request({
            url: this.urlController + 'cargarActividadesExistentes',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
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
    cargarAtributosMedios:function(params,_fn,_fnfail, idGrid, idregnumerico = false){
        var objSubmit = {};
        objSubmit.idindicador = Ext.encode(params);
        objSubmit.idw = idGrid;
        if (idregnumerico) {
            objSubmit.idregnumerico = idregnumerico;
        }
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
    isValidFormMedios:function(){
        var result = true;
        if(this.formBasicMedio.count() > 0){
            this.formBasicMedio.each(function(field){
                if(!field.isValid()){
                    result = false;
                }
            })
        }
        return result;
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
    cargarActivoFijo:function(idregnumerico,fn){
        var objSubmit = {};
        objSubmit.idregnumerico = Ext.encode(idregnumerico);
        Ext.Ajax.request({
            url: 'cargarActivo',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
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
    obtenerEstadoActual:function(){
        var _this =  this;
        var estado = 1;
        if(this.iddocumento){
            this.st.each(function(rec, pos){
                if(rec.data.iddocumento == _this.iddocumento){
                    estado = rec.data.estado;
                }
            });
        }
        return estado;
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
            var objSubmit = parametros ||{};
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
    },
    rectificarOrden: function (parametros, _fn, _fnfail) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }

        mostrarMensaje(2, '\xbfEst\xe1 seguro que desea rectificar la orden de trabajo seleccionada\x3f', function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait( 'Anulando el estado par la rectificaci\xf3n', _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                objSubmit.rectificar = true;
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAnularEstado,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, 'El estado del documento ha sido modificado satisfactoriamente' + ' para su rectificaci\xf3n ');
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
    anular: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgAnularDocumento, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAnulandoObjeto, _this.idioma.msgEsperePorFavor || '...');
                var objSubmit = parametros || {};
                objSubmit.id = Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAnular,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.respuesta.cantidad) {
                            mostrarMensaje(1, 'El documento no puede ser cancelado, tiene productos por devolver.');
                        } else if (resp.respuesta.ref) {
                            mostrarMensaje(1, 'El documento no puede ser cancelado, tiene facturas asociadas.<br>Nro. Ref: <b>'+resp.respuesta.ref);
                        } else if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgDocumentoAnulado);
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
    generarOrdenTrabajoCita : function (parametros, _fn, _fnfail) {
        Ext.MessageBox.wait(this.idioma.msgSalvandoOrdenTrabajo, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        objSubmit.data = Ext.encode(objSubmit.data || this.encode());
        Ext.Ajax.request({
            url: this.urlController + 'generarOrdenCita',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        console.info(resp);
                        mostrarMensaje(1, 'La orden de trabajo #'+resp.datos.nrodoc+' con fecha '+resp.datos.fechacontable+' se ha generado satisfactoriamente.');
                        if (this.st) {
                            this.st.reload();
                        }
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

LOG.tall.ordentrabajo.ReclamacionesModel = Ext.extend(LOG.util.Model , {
    constructor: function (config) {
        config.urlController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/';
        config.urlAccionGuardar = 'adicionarReclamacion';
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'idservicio'
        });
        config.fields.push({
            name: 'idcliente'
        });

        config.fields.push({
            name: 'posecionmedio'
        });
        config.fields.push({
            name: 'idordentrabajo'
        });

        LOG.tall.ordentrabajo.ReclamacionesModel.superclass.constructor.call(this, config);
    },
    salvarReclamacion: function(parametros, _fn, _fnfail) {
        if (this.isValid()) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoReclamacion, this.idioma.msgEspere || '...');
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
                            mostrarMensaje(1, this.idioma.lbMsgReclamacionSalvada);
                            if (this.st) {
                                this.st.reload();
                            }
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
        } else {
            mostrarMensaje(1, this.idioma.msgDatosIncorrectos);
        }
    }
});

LOG.tall.ordentrabajo.SolucionModel = Ext.extend(LOG.util.Model , {
    constructor: function (config) {
        config.urlController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/';
        config.urlAccionGuardar = 'adicionarSolucion';
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'idtecnico'
        });
        config.fields.push({
            name: 'solucion'
        });
        config.fields.push({
            name: 'idordentrabajo'
        });

        LOG.tall.ordentrabajo.SolucionModel.superclass.constructor.call(this, config);
    },
    salvarSolucion: function(parametros, _fn, _fnfail) {
        if (this.isValid()) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoSolucion, this.idioma.msgEspere || '...');
            var objSubmit = parametros || {};
            objSubmit.data = Ext.encode(this.encode());

            Ext.Ajax.request({
                url: this.urlController + 'adicionarSolucion',
                method: 'POST',
                params: objSubmit,
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, this.idioma.lbMsgSolucionSalvada);
                            if (this.st) {
                                this.st.reload();
                            }
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
        } else {
            mostrarMensaje(1, this.idioma.msgDatosIncorrectos);
        }
    },
    cargarDatosSolucion:function(parametros, _fn, _fnfail)
    {
        var objSubmit = parametros || {};

        Ext.Ajax.request({
            url: this.urlController + 'cargarSolucion',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
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
    }
});

LOG.tall.ordentrabajo.RecuperarPiezasModel = Ext.extend(LOG.util.Model , {
    idordentrabajo:undefined,
    constructor: function (config) {
        config.urlController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/';
        config.urlAccionGuardar = 'salvarPiezas';
        config.urlAccionEliminar = 'eliminarPiezasRetiradas';
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'idpiezarecuperable',
            primary:true
        });
        this.idordentrabajo = config.idordentrabajo;
        LOG.tall.ordentrabajo.SolucionModel.superclass.constructor.call(this, config);
    },
    salvarPiezas: function(parametros, _fn, _fnfail) {
        if (this.isValid() || parametros[1]) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoPiezas, this.idioma.msgEspere || '...');
            var objSubmit = {};
            objSubmit.idordentrabajo = this.idordentrabajo;
            objSubmit.piezas = Ext.encode(parametros[0]);
            //obj['idpiezarecuperable'] = (!parametros[1])?this.sm.getSelected().data.idpiezarecuperable:null;
            //objSubmit.data = Ext.encode(obj);
            Ext.Ajax.request({
                url: this.urlController + 'adicionarPiezasRetiradas',
                method: 'POST',
                params: objSubmit,
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, (parametros[1])?this.idioma.lbMsgPiezasSalvada:this.idioma.lbMsgDatosSalvados);
                            if (parametros[1] && this.st) {
                                this.st.reload();
                            }
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
        } else {
            mostrarMensaje(1, this.idioma.msgDatosIncorrectos);
        }
    },
    eliminarPiezaRecup: function(parametros, _fn, loadStore) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgEliminarPiezaRec, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoPieza, this.idioma.msgEspere || '...');
                var objSubmit = {};
                objSubmit.idpiezarecuperable =  Ext.encode(parametros['piezas']);
                objSubmit.idordentrabajo = _this.idordentrabajo;
                objSubmit.idregnumerico = parametros['idregnumerico'];
                objSubmit.idindicador = Ext.encode(parametros['idindicador']);
                objSubmit.idpiezaagregado = Ext.encode(parametros['idpiezaagregado']);
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgPiezaEliminada);
                                loadStore = loadStore || true;
                                if (loadStore) {
                                    this.st.reload();
                                }
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
    cargarDatosPieza:function(parametros, _fn, _fnfail)
    {
        var objSubmit = {};
        objSubmit.idindicador = (parametros)?Ext.encode(parametros):null;
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionmediostaller/devolverRecuperables',
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
    devolverPieza:function(idpieza, _fn, _fnfail)
    {
        var objSubmit = {};
        objSubmit.idpiezarecuperable = idpieza;
        objSubmit.idordentrabajo = this.idordentrabajo;
        Ext.Ajax.request({
            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarPiezasRetiradas',
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
    }
});


