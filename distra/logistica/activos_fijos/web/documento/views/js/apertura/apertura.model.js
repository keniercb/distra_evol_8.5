Ext.ns('LOG.aft.apertura');
LOG.aft.apertura.Model = Ext.extend(LOG.util.Model , {
    urlAccionCerrar:undefined,
    urlController :undefined,
    urlAccionGuardar : undefined,
    urlAccionAprobar : undefined,
    urlAccionConfirmar : undefined,
    urlAccionAnularEstado : undefined,
    urlAccionAprobar  : undefined,
    listaProductos : undefined,
    listaEstructuras : undefined,
    listaEstructurasHijas : undefined,
    constructor: function(config) {
        this.urlController = '/logistica/activos_fijos/documento/index.php/aperturaaft/';
        this.urlAccionGuardar = 'adicionarDocumento';
        this.urlAccionAprobar = 'aprobarDocumento';
        this.urlAccionConfirmar = 'confirmarDocumento';
        this.urlAccionEliminar = 'eliminarDocumento';
        this.urlAccionAnularEstado = 'anularEstadoDocumento';
        this.urlAccionAprobar  = 'aprobarDocumento';
        this.listaProductos = new LOG.util.List();
        this.listaEstructuras = new LOG.util.List();
        this.listaEstructurasHijas = new LOG.util.List();
        LOG.aft.apertura.Model.superclass.constructor.call(this,config);
    },
    /**
     *
     * @param {type} parametros
     * @returns {undefined}
     */
    salvar: function(parametros, _fn, _fnfail) {
        var _this = this;
            Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
            var objSubmit = {};
            var obj = this;
            objSubmit.data = Ext.encode(parametros);
            Ext.Ajax.request({
                url: this.urlController + 'adicionarDocumento',
                method: 'POST',
                params: objSubmit,
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success) {
                        if (s) {
                            if (this.st) {
                                this.st.reload({callback:function(){
                                }.createDelegate(this)
                                });
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
    },
    adicionarMedio: function(data) {
        var index = -1;
        this.listaProductos.each(function(rec, pos){
            if(data.idregnumerico == rec.idregnumerico){
                index = pos;
                return;
            }
        });
        this.listaProductos.setItem(data,index);
    },
    eliminarMedio: function(data) {
        var index = -1;
        this.listaProductos.each(function(rec, pos){
            if(data.idregnumerico == rec.idregnumerico){
                index = pos;
                return;
            }
        });
        this.listaProductos.delete(index);
    },
    confirmar: function(parametros, _fn, _fnfail) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgConfirmarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgConfirmandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
               // objSubmit.id = (objSubmit.id) ? Ext.encode(objSubmit.id) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionConfirmar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgDocumentoConfirmado);
                                _this.st.reload();
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
    },
    anularestado: function(parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }

        mostrarMensaje(2, this.idioma.msgAnularEstadoDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAnulandoEstadoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                //objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAnularEstado,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgEstadoDocumentoAnulado);
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
    aprobar: function(parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgAprobarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAprobandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                //objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.timeout = 999999999;
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAprobar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
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
                        else if(resp.codigoMsg == 3){
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: (resp.message)?resp.message:"Aseg\xfarece de que la configuraci\xf3n de los documentos involucrados est\xe9 correcta.",
                                width: 300,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR,
                            });
                        }
                    }.createDelegate(this)

                });
            }
        });
    },
    cargarEstructuras:function(){
        var _this = this;
        var stEstruc = new Ext.data.Store( {
            url: '/logistica/activos_fijos/documento/index.php/aperturaaft/cargarEstructuras',

            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idfila',
            }, [
                {name: 'text'},
                {name: 'idfila'}
            ])
        });
        stEstruc.on('load',function(st,records){
            if(records.length > 0) {
                Ext.each(records, function(rec){
                    _this.listaEstructuras.add(rec.data);
                });
            }
        });
        stEstruc.load({params:{todas:true, criterio:null}});
    },
    cargarEstructurasHijas:function(){
        var _this = this;
        var stEstruc = new Ext.data.Store( {
            url: '/logistica/activos_fijos/documento/index.php/aperturaaft/cargarEstructurasHijas',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idfila',
            }, [
                {name: 'text'},
                {name: 'idfila'}
            ])
        });
        stEstruc.on('load',function(st,records){
            if(records.length > 0) {
                Ext.each(records, function(rec){
                    _this.listaEstructurasHijas.add(rec.data);
                });
            }
        });
        stEstruc.load({params:{todas:true, criterio:null}});
    },
    getDenomEstruct:function(identificador){
        var denom = "";
        if(this.listaEstructuras.count()) {
            this.listaEstructuras.each(function (estruc) {
                if (estruc.idfila == identificador) {
                    denom = estruc.text;
                    return denom;
                }
            });
        }
        return denom;
    },
    getDenomEstructHijas:function(identificador){
        var denom = "";
        if(this.listaEstructurasHijas.count()) {
            this.listaEstructurasHijas.each(function (estruc) {
                if (estruc.idfila == identificador) {
                    denom = estruc.text;
                    return denom;
                }
            });
        }
        return denom;
    }
});