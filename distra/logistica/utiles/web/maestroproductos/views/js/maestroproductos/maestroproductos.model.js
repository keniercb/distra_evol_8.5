Ext.ns('LOG.lb.maestroproductos');
LOG.lb.maestroproductos.Model = Ext.extend(LOG.util.Model, {
    arrayImagenes: null,
    arrayImagenesEliminadas: null,
    arrayConjuntos: null,
    stTGreed:undefined,
    smTGreed:undefined,
    vistaActiva:undefined,
    constructor: function(config) {
        config.urlAccionGuardar = 'adicionarClasificador';
        config.urlAccionEliminar = 'eliminarClasificador';
        this.urlAccionHabilitar = 'habilitarClasificador';
        this.urlAccionAprobar = 'aprobarClasificador';
        this.urlAccionNivelPlan = 'setNivelPlanificacion';
        this.urlAccionCargarIndicador = 'devolverIndicador';
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'idindicador',
            primary: true,
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'denominacion',
            type: LOG.util.DataTypes.TYPE_STRING
        });
        config.fields.push({
            name: 'descripcion',
            type: LOG.util.DataTypes.TYPE_STRING
        });
        config.fields.push({
            name: 'codigo',
            type: LOG.util.DataTypes.TYPE_STRING
        });
        config.fields.push({
            name: 'fechainicio',
            type: LOG.util.DataTypes.TYPE_DATE
        });
        config.fields.push({
            name: 'fechafin',
            type: LOG.util.DataTypes.TYPE_DATE
        });
        config.fields.push({
            name: 'idpais',
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'idnaturaleza',
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'idmarca',
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'idmodelo',
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'idgruposubgrupo',
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'idespecialidad',
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'idformato',
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'idfabricante',
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'idelementogasto',
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'idelementogastoalt',
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'idpadre',
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'codigoPadre',
            type: LOG.util.DataTypes.TYPE_STRING
        });
        config.fields.push({
            name: 'codigoproveedor',
            type: LOG.util.DataTypes.TYPE_STRING
        });
        config.fields.push({
            name: 'nivel',
            type: LOG.util.DataTypes.TYPE_INT
        });
        config.fields.push({
            name: 'tipo',
            type: LOG.util.DataTypes.TYPE_INT
        });
        config.fields.push({
            name: 'almacenado',
            type: LOG.util.DataTypes.TYPE_BOOLEAN
        });
        config.fields.push({
            name: 'explotacion',
            type: LOG.util.DataTypes.TYPE_BOOLEAN
        });
        config.fields.push({
            name: 'isuh',
            type: LOG.util.DataTypes.TYPE_BOOLEAN
        });
        config.fields.push({
            name: 'numeropieza',
            type: LOG.util.DataTypes.TYPE_STRING
        });
        config.fields.push({
            name: 'codigoauxiliar',
            type: LOG.util.DataTypes.TYPE_STRING
        });
        config.fields.push({
            name: 'ancho',
            type: LOG.util.DataTypes.TYPE_FLOAT
        });
        config.fields.push({
            name: 'alto',
            type: LOG.util.DataTypes.TYPE_FLOAT
        });
        config.fields.push({
            name: 'largo',
            type: LOG.util.DataTypes.TYPE_FLOAT
        });
        config.fields.push({
            name: 'peso',
            type: LOG.util.DataTypes.TYPE_FLOAT
        });
        config.fields.push({
            name: 'tipocontrol',
            type: LOG.util.DataTypes.TYPE_INT
        });
        config.fields.push({
            name: 'nivelsurtido',
            type: LOG.util.DataTypes.TYPE_INT
        });
        config.fields.push({
            name: 'idviaadquisicion',
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'idorganosatisface',
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'idcentrobalance',
            type: LOG.util.DataTypes.TYPE_ID
        });
        config.fields.push({
            name: 'flete',
            type: LOG.util.DataTypes.TYPE_FLOAT
        });
        config.fields.push({
            name: 'contingencia',
            type: LOG.util.DataTypes.TYPE_FLOAT
        });
        config.fields.push({
            name: 'precioventa',
            type: LOG.util.DataTypes.TYPE_FLOAT
        });
        config.fields.push({
            name: 'preciodivisa',
            type: LOG.util.DataTypes.TYPE_FLOAT
        });
        config.fields.push({
            name: 'cobertura',
            type: LOG.util.DataTypes.TYPE_FLOAT
        });
        config.fields.push({
            name: 'margencomercial',
            type: LOG.util.DataTypes.TYPE_FLOAT
        });
        config.fields.push({
            name: 'plandirecto',
            type: LOG.util.DataTypes.TYPE_ID
        });
        this.arrayImagenes = new LOG.util.List();
        this.arrayImagenesEliminadas = new LOG.util.List();
        this.arrayConjuntos = new Array();

        LOG.lb.maestroproductos.Model.superclass.constructor.call(this, config);
    },
    cargarFormatos: function(idfomato, fn) {
        this.cargaInicial({
            url: 'cargarPartesFormato',
            idformato: idfomato
        }, fn);
    },
    habilitar: function(parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection() && !parametros.id) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        var seleccionado = this.sm.getSelected();
        var seleccionado1 = _this.smTGreed.getSelected();
        var pos = _this.st.indexOf(seleccionado);
        //var pos1 = _this.stTGreed.indexOf(seleccionado1);
        mostrarMensaje(2, (parametros.deshabilitar) ? this.idioma.msgDeshabilitarObjeto : this.idioma.msgHabilitarObjeto, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait((parametros.deshabilitar) ? _this.idioma.msgDeshabilitandoObjeto : _this.idioma.msgHabilitandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                //
                if( _this.vistaActiva!=1){
                    objSubmit.id=null;
                    objSubmit.id = (objSubmit.id) ? Ext.encode([objSubmit.id]) : Ext.encode(_this.getSelectedId());
                }else{
                    objSubmit.id = _this.smTGreed.getSelected().id;
                }
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionHabilitar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        _this.sm.clearSelections();
                        _this.smTGreed.clearSelections();
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        _this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, (parametros.deshabilitar) ? _this.idioma.msgObjetoDeshabilitado : _this.idioma.msgObjetoHabilitado);
                                _this.st.reload({
                                    callback: function() {
                                        _this.sm.selectRow(pos);
                                    }
                                });
                                /*_this.stTGreed.reload({
                                    callback: function() {
                                        _this.smTGreed.selectRow(pos1);
                                    }
                                });*/
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(_this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        })
    },
    addImagen: function(idImagen) {
        var existe = false;
        this.arrayImagenes.each(function(i) {
            if (i == idImagen) {
                existe = true;
                return;
            }
        });
        if (!existe) {
            this.arrayImagenes.add(idImagen);
            this.habilitarBotones(false);
        }
    },
    deleteImagen: function(idImagen,idIndicador,parent) {
        var existe = false;
        this.arrayImagenesEliminadas.each(function(i) {
            if (i[0]['id'] == idImagen[0]['id']) {
                existe = true;
                return;
            }
        });
        if (!existe) {
            this.arrayImagenesEliminadas.add(idImagen[0]['id']);
            this.habilitarBotones(false);
        }
        this.cargaInicial({
            url: '/logistica/utiles/plugin/index.php/imagen/eliminarImagen',
            arrayImagenesEliminadas: Ext.encode(this.arrayImagenesEliminadas),
            idindicador: idIndicador
        },function (datos, resp) {
            if(resp.success){
                parent.close();
                console.info(parent);
                parent.parentUI.getStorePrincipal().reload();
                parent.dvImagenes.getStore().removeAll();
            }
        },'Eliminando imagen.');
                                
    },
    encode: function(obj) {
        var o = LOG.lb.maestroproductos.Model.superclass.encode.call(this, obj);
        o.idImagenes = this.arrayImagenes.getArray();
        return o;
    },
    isValid: function() {
        var valid = LOG.lb.maestroproductos.Model.superclass.isValid.call(this);
        var imValid = this.arrayImagenes.count() != 0 || this.arrayImagenesEliminadas.count() != 0;
        var conjValid = this.arrayConjuntos.length != 0;
        
        return (valid || imValid || conjValid);
    },
    aprobarIndicador: function(parametros) {
        var _this = this;
        var objSubmit = parametros || {nivel: 1};
        parametros.fn = parametros.fn;
        objSubmit.url = this.urlAccionAprobar;
        //objSubmit.fn = null;
        //objSubmit.id=null;
         if( _this.vistaActiva!=1){
         //objSubmit.id=null;
         objSubmit.id = Ext.encode(objSubmit.id ? [objSubmit.id] : this.getSelectedId());
             //console.info(objSubmit.id);
         //objSubmit.id = Ext.encode(objSubmit.id ? [objSubmit.id] : JSON.parse("[" + _this.smTGreed.getSelected().id + "]"));
         }else{
         objSubmit.id = _this.smTGreed.getSelected().id;
         }
        mostrarMensaje(2, (parametros.nivel == 1) ? this.idioma.msgDesaprobarObjeto : this.idioma.msgAprobarObjeto, function(btn) {
            if (btn == 'ok') {
                _this.cargaInicial(objSubmit, function(r) {

                    mostrarMensaje(1, (parametros.nivel == 1) ? _this.idioma.msgObjetoDesaprobado : _this.idioma.msgObjetoAprobadoEspecJefe);
                    _this.st.reload({
                        callback: function() {
                            _this.sm.clearSelections();
                            _this.sm.selectRow(parametros.filaAnterior);
                        }
                    });
                    /*_this.stTGreed.reload({
                        callback: function() {
                            _this.smTGreed.clearSelections();
                            _this.smTGreed.selectRow(parametros.filaAnterior);
                        }
                    });*/
                }, _this.idioma.msgAprobandoIndicador);
            }
        });
    },
    setNivelPlanificacion: function(parametros) {
        parametros = parametros || {};
        var _this = this;
        var objSubmit = parametros;
        objSubmit.url = this.urlAccionNivelPlan;
        objSubmit.fn = null;
        //objSubmit.id=null;
        if( _this.vistaActiva!=1){
            //objSubmit.id=null;
            objSubmit.id = Ext.encode(objSubmit.id ? [objSubmit.id] : this.getSelectedId());
            //objSubmit.id = Ext.encode(objSubmit.id ? [objSubmit.id] : JSON.parse("[" + _this.smTGreed.getSelected().id + "]"));
        }else{
            objSubmit.id = _this.smTGreed.getSelected().id;
        }
        var seleccionado = _this.sm.getSelected();
        var seleccionado1 = null;
        var pos = _this.st.indexOf(seleccionado);
        //var pos1 = _this.stTGreed.indexOf(seleccionado1);
        this.cargaInicial(objSubmit, function(r) {
            if (r[0].cambio == false) {
                mostrarMensaje(1, _this.idioma.msgNoCambiarNivel);
            } else {
                _this.sm.clearSelections();
                _this.st.reload({
                    callback: function() {
                        _this.sm.selectRow(pos);
                    }
                });
            }
        }, this.idioma.msgPlanificarIndicador);

    },
    cargarIndicadorById: function(id, fn) {
        var objSubmit = {};
        objSubmit.id = Ext.encode(id ? [id] : this.getSelectedId());
        objSubmit.url = this.urlAccionCargarIndicador;
        this.cargaInicial(objSubmit, fn);
    },
    reset: function() {
        var surtido = this.nivelsurtido;
        LOG.lb.maestroproductos.Model.superclass.reset.call(this);
        this.arrayImagenes = new LOG.util.List();
        this.arrayImagenesEliminadas = new LOG.util.List();
        this.nivelsurtido = surtido;
    },
    //metodo echo para el recargo del grid del btnaprobar
    setStTreeGrid:function(stTGreed){
        this.stTGreed = stTGreed;
    },
    //metodo echo para el recargo del grid del btnnivelPlanificacion
    setSMTreeGrid:function(smTGreed){
        this.smTGreed=smTGreed;
    },
     //metodo para ver el tipo de vista
    setVista:function(vista){
        this.vistaActiva=vista;
    },
    setConjunto: function(conjunto) {
        this.arrayConjuntos = conjunto;
    }
});