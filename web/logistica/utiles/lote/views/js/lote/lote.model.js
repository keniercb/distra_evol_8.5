Ext.ns('LOG.lb.lote');
/**
 * Componente para la gestión de lotes.
 */
LOG.lb.lote.Model = Ext.extend(LOG.util.Model, {
    /**
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.urlController = config.urlController || '/logistica/utiles/lote/index.php/lote/';
        config.urlAccionGuardar = 'adicionarLote';
        config.urlAccionEliminar = 'eliminarLote';
        this.urlAccionSalvarMovimiento = 'salvarMovimiento';
        config.fields = [
            {
                name: 'idlote',
                primary: true
            },
            {name: 'idmovlote'},
            {name: 'idproducto'},
            {name: 'idmovimiento'},
            {name: 'numero'},
            {name: 'fechafabricacion'},
            {name: 'fechavencimiento'},
            {name: 'cantidad'},
            {name: 'idfabricante'},
            {name: 'idpais'},
            {name: 'idubicacion'},
            {name: 'idubicacionproducto'},
            {name: 'idubicacionlote'},
            {name: 'idarea'},
            {name: 'idareaproducto'},
            {name: 'idarealote'},
            {name: 'esarea'}
        ];
        LOG.lb.lote.Model.superclass.constructor.call(this, config);
    },
    /**
     * Elimina los lotes seleccionados.
     * @param {Object} parametros
     * @param {function} _fn
     * @param {Boolean} loadStore
     * @returns {undefined}
     */
    eliminar: function(parametros, _fn, loadStore) {
        var _this = this;
        if (!this.sm.hasSelection() && !parametros.id) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgDeleteObjeto, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoObjeto, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.data = Ext.encode(_this.getSelectedData(parametros.datos));
                objSubmit.datos = Ext.encode(parametros.datos);
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
                                mostrarMensaje(1, this.idioma.msgObjetoEliminado);
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
    /**
     * Crea objetos de DatMovlote con cantidad 0.
     * @param {Object} _params
     * @param {function} _fn
     * @param {function} _fnFail
     * @returns {undefined}
     */
    salvarMovimiento: function(_params, _fn, _fnFail) {
        var _this = this;
        if (!this.sm.hasSelection() && !_params.id) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
        var objSubmit = _params || {};
        objSubmit.data = Ext.encode(this.getSelectedData(_params.datos, _params.editable));
        objSubmit.datos = Ext.encode(_params.datos);
        Ext.Ajax.request({
            url: _this.urlController + _this.urlAccionSalvarMovimiento,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, _this.idioma.lbMsgObjetoSalvado);
                        this.st.reload();
                        this.st.commitChanges();
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnFail == 'function') {
                        _fnFail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    /**
     * Devuelve un arreglo con los datos de los lotes seleccionados o modificados para adicionarlos.
     * @param {Object} datos
     * @param {Boolean} editable
     * @returns {Array}
     */
    getSelectedData: function(datos, editable) {
        var _this = this;
        var _selected = [];
        var collection = editable ? this.st.getModifiedRecords() : this.sm.getSelections();
        if (collection.length > 0) {
            Ext.each(collection, function(r) {
                _selected.push({
                    idlote: r.get(_this.primaryKeyField),
                    idmovlote: r.get('idmovlote'),
                    idlotecomprometido: r.get('idlotecomprometido'),
                    idubicacioncomprometida: r.get('idubicacioncomprometida'),
                    idproducto: r.get('idproducto'),
                    idmovimiento: datos.idmovimiento,
                    iddocumento: datos.iddocumento,
                    idubicacion: r.get('idubicacion'),
                    cantidad: r.get('cantidad') || 0
                });
            });
        }
        return _selected;
    },
    /**
     * Determina si son válidos los campos a guardar.
     * @returns {Boolean}
     */
    isValid: function() {
        if (this.basicForm) {
            return LOG.lb.lote.Model.superclass.isValid.call(this);
        }
        return true;
    },
    /**
     * Devuelve la suma de las cantidades de los lotes.
     * @param {Numeric} id [Opcional] Valor por el se filtrará.
     * @param {String} campo [Opcional] Columna por la que se filtrará.
     * @returns {Integer}
     */
    getSumaCantidad: function(id, campo) {
        var suma = 0;
        this.st.each(function(_r) {
            if (id != null && id != undefined && campo) {
                if (id == _r.data[campo]) {
                    suma += parseFloat(_r.data.cantidad) || 0;
                }
            } else {
                suma += parseFloat(_r.data.cantidad) || 0;
            }
        });
        return suma;
    }
});
