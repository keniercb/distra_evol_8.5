Ext.ns('LOG.inv.alimento');
LOG.inv.alimento.Model = Ext.extend(LOG.lb.documento.Model, {
    listaProductos: null,
    constructor: function(config) {
        this.urlAccionConDoc = 'condicionarDoc';
        this.urlAccionEliminarReceta = 'eliminaRecetas';
        this.urlAccionEliminarProducto = 'eliminarProductoMenu';
        this.urlAccionAprobar = 'aprobarDocumento';
        this.urlAccionRevisar = 'revisarDocumento';
        this.urlAccionAnularRevisar = 'anularRevisarDocumento';
        this.urlAccionSalvarCategorias = 'salvarCategorias';
        this.urlAccionGuardarConclusionMedica = 'salvarConclusionMedica';
        this.urlAccionGuardarAutorizacionEntrega = 'autorizarEntregarAlimentos';
        this.urlAccionSalvarAlternativo = 'alternarProductoMenu';
        this.urlAccionCargarCategorias = 'cargarCategorias';
        this.urlAccionSalvarCalProt = 'salvarCaloriasProteinas';

        config.fields = [
            {name: 'fechaconsumo'},
            {name: 'descripcioncentrogrupo'},
            {name: 'denominacionnorma'},
            {name: 'denominacion'},
            {name: 'denominacionproducto'},
            {name: 'deposito'},
            {name: 'tipoactividad'},
            {name: 'actividadmenu'},
            {name: 'tipoactividadetalle'},
            {name: 'dactividades'},
            {name: 'idreceta'},
            {name: 'idordenar'},
            {name: 'idindicador'},
            {name: 'idnorma'},
            {name: 'idproducto'},
            {name: 'categoria'},
            {name: 'cantidad'},
            {name: 'denominacionreceta'},
            {name: 'idrecetaactividad'},
            {name: 'denominacionrevisado'},
            {name: 'idactividad'},
            {name: 'cantraciones'},
            {name: 'orden'},
            {name: 'idestructuracomun'},
            {name: 'iddeposito'},
            {name: 'idcentrogrupo'},
            {name: 'umedida'},
            {name: 'desumedida'},
            {name: 'codigoauxiliar'},
            {name: 'aceptalternativo'},
            {name: 'imprescindible'},
            {name: 'observaciones'}
        ];
        LOG.inv.alimento.Model.superclass.constructor.call(this, config);
        this.listaProductos = new LOG.util.List();
    },
    salvarRecetas: function(parametros, tipoVentana, _fn, _fnfail) {
        if (this.isValid() && tipoVentana == 1) {
            this.enviarDatosRecetas(parametros, _fn, _fnfail);
        } else if (tipoVentana == 2) {
            this.enviarDatosRecetas(parametros, _fn, _fnfail);
        } else {

            mostrarMensaje(1, this.idioma.msgDatosIncorrectos);
        }
    },
    enviarDatosRecetas: function(parametros, _fn, _fnfail) {
        Ext.MessageBox.wait(this.idioma.msgSalvandoReceta, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        objSubmit.data = Ext.encode(this.encode());
        Ext.Ajax.request({
            url: '/logistica/inventario/alimento/index.php/menualimento/adicionarDocumento',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.lbMsgRecetaSalvado);
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
    },
    eliminarRecetas: function(recetas, iddocumento, tipoactividad, _fn) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgDeleteMovObjeto, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoObjetoReceta, this.idioma.msgEspere || '...');
                var objSubmit = {
                    idrecetas: Ext.encode(recetas),
                    iddocumento: iddocumento,
                    tipoactividad: tipoactividad
                };
                Ext.Ajax.request({
                    url: this.urlAccionEliminarReceta,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        _this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgObjetoEliminadoMovRec);
                                //_this.st.reload();
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [o, s, r]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    },
    aprobar: function(iddocumento, idestructuracomun, _fn) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgAprobarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAprobando, _this.idioma.msgEspere || '...');
                var objSubmit = {
                    iddocumento: iddocumento,
                    idestructuracomun: idestructuracomun
                } || {};
                Ext.Ajax.request({
                    url: _this.urlAccionAprobar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        if (s) {
                            mostrarMensaje(1, _this.idioma.msgDocumentoAprobado);
                            _this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [o, s, r]).call();
                        }
                    }.createDelegate(this)
                });
            }
        });
    },
    salvarCategorias: function(parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgSalvando, this.idioma.msgEspere || '...');
        var objSubmit = {
            data: Ext.encode(parametros)
        } || {};
        Ext.Ajax.request({
            url: this.urlAccionSalvarCategorias,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                if (s) {
                    mostrarMensaje(1, this.idioma.msgSalvandoCat);
                    _this.st.reload();
                }
                if (typeof _fn == 'function') {
                    _fn.createDelegate(this, [o, s, r]).call();
                }
            }.createDelegate(this)
        }
        );

    },
    guardarConclusionMedica: function(parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgSalvandoConclusion, this.idioma.msgEspere || '...');
        var objSubmit = {
            data: Ext.encode(parametros)
        } || {};
        Ext.Ajax.request({
            url: this.urlAccionGuardarConclusionMedica,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                if (s) {
                    mostrarMensaje(1, this.idioma.msgSalvadoConclusionM);
                    // _this.st.reload();
                }
                if (typeof _fn == 'function') {
                    _fn.createDelegate(this, [o, s, r]).call();
                }
            }.createDelegate(this)
        }
        );

    },
    guardarAutorizacionEntrega: function(parametros, _fn) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgAutorizarObjeto, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgSalvandoAutorizo, this.idioma.msgEspere || '...');
                var objSubmit = {data: Ext.encode(parametros)} || {};
                Ext.Ajax.request({
                    url: this.urlAccionGuardarAutorizacionEntrega,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        _this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgObjetoSalEntr);
                                _this.st.reload();
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
    eliminarProductoMenu: function(iddocumento, idindicador, _fn) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgDeleteProdObjeto, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoObjetoProd, this.idioma.msgEspere || '...');
                var objSubmit = {
                    iddocumento: iddocumento,
                    idindicador: idindicador
                };
                Ext.Ajax.request({
                    url: this.urlAccionEliminarProducto,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        _this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgObjetoEliminadoMovProd);
                                _this.st.reload();
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
    alternarProductoMenu: function(parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgSalvando, this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: this.urlAccionSalvarAlternativo,
            method: 'POST',
            params: parametros,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                if (s) {
                    mostrarMensaje(1, this.idioma.msgSalvandoProd);
                    _this.st.reload();
                }
                if (typeof _fn == 'function') {
                    _fn.createDelegate(this, [o, s, r]).call();
                }
            }.createDelegate(this)
        });
    },
    cargarCategorias: function(iddocumento, _fn) {
        var _this = this;
        var objSubmit = {
            iddocumento: iddocumento
        };
        Ext.Ajax.request({
            url: this.urlAccionCargarCategorias,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                if (s) {
                    mostrarMensaje(1, this.idioma.msgSalvandoProd);
                    _this.st.reload();
                }
                if (typeof _fn == 'function') {
                    _fn.createDelegate(this, [o, s, r]).call();
                }
            }.createDelegate(this)
        });
    },
    revisadoPor: function(iddocumento, _fn) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgRevisarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgRevisando, _this.idioma.msgEspere || '...');
                var objSubmit = {
                    iddocumento: iddocumento
                } || {};
                Ext.Ajax.request({
                    url: _this.urlAccionRevisar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        if (s) {
                            mostrarMensaje(1, _this.idioma.msgDocumentoRevisado);
                            _this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [o, s, r]).call();
                        }
                    }.createDelegate(this)
                });
            }
        });
    },
    anularRevisado: function(iddocumento, _fn) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgARevisarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgARevisando, _this.idioma.msgEspere || '...');
                var objSubmit = {
                    iddocumento: iddocumento
                } || {};
                Ext.Ajax.request({
                    url: _this.urlAccionAnularRevisar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        if (s) {
                            mostrarMensaje(1, _this.idioma.msgEstadoDocumentoAnulado);
                            _this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [o, s, r]).call();
                        }
                    }.createDelegate(this)
                });
            }
        });
    }
});