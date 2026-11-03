Ext.namespace('LOG.inv.municiones');

/**
 * Componente para la gestion de partidas.
 * @type LOG.util.Model
 */
LOG.inv.municiones.Model = Ext.extend(LOG.util.Model, {
    /**
     * Determina si todos los datos de la lista son validos.
     * @type Boolean
     */
    listaValida: false,
    /**
     * Lista de partidas editados.
     * @type LOG.util.List()
     */
    listaPartidas: null,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.listaPartidas = new LOG.util.List();
        config.fields = [
            {
                primary: true,
                name: 'idmovproductomunic'
            },
            {name: 'indice'}
        ];
        config.urlAccionGuardar = 'adicionarPartida';
        config.urlAccionEliminar = 'eliminarPartida';
        this.urlAccionAprobar = 'aprobarPartida';
        config.urlController = '/logistica/inventario/armamento/index.php/municiones/';
        LOG.inv.municiones.Model.superclass.constructor.call(this, config);
    },
    /**
     * Adiciona una partida a la lista cuando el grid fue editado.
     * @param {Object} p
     * @returns {undefined}
     */
    adicionarPartida: function(p) {
        var _this = this, currentIndex = -1;
        if ((p.salida == undefined && !p.cantidad) || !p.elemembalajes || !p.idestructuraubicacion || !p.estiba || !p.hilera) {
            this.listaValida = false;
        } else {
            this.listaValida = true;
        }
        this.listaPartidas.each(function(_p, index) {
            if ((p.idmovproductomunic && _p.idmovproductomunic == p.idmovproductomunic) || (p.idtemp && _p.idtemp == p.idtemp)) {
                currentIndex = index;
            } else if ((p.salida == undefined && !p.cantidad) || !_p.elemembalajes || !_p.idestructuraubicacion || !_p.estiba || !_p.hilera) {
                _this.listaValida = false;
            }
        });
        var pModel = null;
        if (currentIndex == -1) {
            pModel = new LOG.util.Model({
                fields: [{
                        name: 'idmovproductomunic',
                        primary: true
                    },
                    {name: 'idproductomunic'},
                    {name: 'idtemp'},
                    {name: 'idproducto'},
                    {name: 'idmovimiento'},
                    {name: 'iddocumento'},
                    {name: 'idproductomuniccomprometido'},
                    {name: 'idubicacioncomprometida'},
                    {name: 'idestructuraubicacion'},
                    {name: 'idpartida'},
                    {name: 'idanno'},
                    {name: 'idfab'},
                    {name: 'cantidad'},
                    {name: '_cantidad'},
                    {name: 'elemembalajes'},
                    {name: 'estiba'},
                    {name: 'hilera'},
                    {name: 'idmarcapolvuno'},
                    {name: 'idpartidapolvuno'},
                    {name: 'idannopolvuno'},
                    {name: 'idfabpolvuno'},
                    {name: 'idmarcapolvdos'},
                    {name: 'idpartidapolvdos'},
                    {name: 'idannopolvdos'},
                    {name: 'idfabpolvdos'},
                    {name: 'idmarcaexplosivo'},
                    {name: 'idpartidaexplosivo'},
                    {name: 'idannoexplosivo'},
                    {name: 'idfabexplosivo'},
                    {name: 'idmarcaespoleta'},
                    {name: 'idpartidaespoleta'},
                    {name: 'idannoespoleta'},
                    {name: 'idfabespoleta'},
                    {name: 'idmarcaestopin'},
                    {name: 'idpartidaestopin'},
                    {name: 'idannoestopin'},
                    {name: 'idfabestopin'}
                ]
            });
        } else {
            pModel = this.listaPartidas.getItem(currentIndex);
        }
        pModel.apply(p);
        this.listaPartidas.setItem(pModel, currentIndex);
        this.habilitarBotones(!this.isValid());
    },
    /**
     * Elimina una partida del grid previamente editada de la lista.
     * @param {Object} p
     * @returns {undefined}
     */
    eliminarPartida: function(p) {
        var _this = this, currentIndex = -1;
        this.listaValida = true;
        this.listaPartidas.each(function(_p, index) {
            if (_p.idtemp == p.idtemp) {
                currentIndex = index;
            } else if (!_p.cantidad || !_p.elemembalajes || !_p.idestructuraubicacion || !_p.estiba || !_p.hilera) {
                _this.listaValida = false;
            }
        });
        this.listaPartidas.delete(currentIndex);
        this.habilitarBotones(!this.isValid());
    },
    /**
     * 
     * @param {Object} parametros
     * @param {function} _fn
     * @param {function} _fnFail
     * @param {String} msgMostrar
     * @returns {undefined}
     */
    salvar: function(parametros, _fn, _fnFail, msgMostrar) {
        var _this = this;
        if (this.isValid()) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
            var objSubmit = parametros || {};
            objSubmit.data = Ext.encode(objSubmit.data || this.encode(objSubmit));

            Ext.Ajax.request({
                url: this.urlController + this.urlAccionGuardar,
                method: 'POST',
                params: objSubmit,
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    if (s) {
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success && resp.excepciones.length > 0) {
                            mostrarMensaje(2, this.idioma.msgPartidaExistente, function(btn) {
                                if (btn == 'ok') {
                                    _this.salvar({excepciones: resp.excepciones}, _fnFail, msgMostrar);
                                } else if (_this.st) {
                                    _this.st.reload();
                                }
                            });
                        } else {
                            mostrarMensaje(1, msgMostrar || this.idioma.lbMsgObjetoSalvado);
                            if (this.st) {
                                this.st.reload();
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }
                    this.setDefaulFormValues();
                }.createDelegate(this)
            });
        } else {
            mostrarMensaje(3, this.idioma.msgDatosIncorrectos);
        }
    },
    /**
     * Codifica los datos para enviarlos a la controladora.
     * @param {Object} o
     * @returns {Object}
     */
    encode: function(o) {
        var obj = LOG.inv.municiones.Model.superclass.encode.call(this);
        obj.salida = o.salida;
        obj.afecta = o.afecta;
        obj.desglose = o.desglose;
        obj.partidas = new Array();
        if (o.excepciones) {
            Ext.each(o.excepciones, function(item) {
                obj.partidas.push(item);
            });
        } else {
            this.listaPartidas.each(function(_p) {
                obj.partidas.push(_p.encode());
            });
        }
        return obj;
    },
    /**
     * Resetea los datos del formulario  y la lista de partidas.
     * @returns {undefined}
     */
    reset: function() {
        LOG.inv.municiones.Model.superclass.reset.call(this)
        this.listaPartidas.deleteAll();
        this.listaValida = false;
    },
    /**
     * Verifica si los datos a guardar son correctos.
     * @returns {Boolean}
     */
    isValid: function() {
        if (this.basicForm) {
            return LOG.inv.municiones.Model.superclass.isValid.call(this) && this.isValidList();
        }
        return this.isValidList();
    },
    /**
     * Verifica si todos los datos de la lista son validos.
     * @returns {Boolean}
     */
    isValidList: function() {
        return this.listaPartidas.count() > 0 && this.listaValida;
    },
    /**
     * Aprueba las partidas con cantidades desglozadas
     * @param {Object} p
     * @returns {undefined}
     */
    aprobar: function(parametros) {
        Ext.MessageBox.wait(this.idioma.msgAprobandoObjeto, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        var objSubmit = {
            iddocumento: Ext.encode(parametros)
        };
        Ext.Ajax.request({
            url: this.urlController + this.urlAccionAprobar,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                if (s) {
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        mostrarMensaje(1, this.idioma.lbMsgObjetoAprobado);
                        if (this.st) {
                            this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    }
                }
                this.setDefaulFormValues();
            }.createDelegate(this)
        });
    }
});