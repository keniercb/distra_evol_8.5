LOG.produccion.ordenproduccion.Model = Ext.extend(LOG.produccion.documento.Model, {
    /**
     * 
     * @param {type} config
     * @returns {undefined}
     */
    tipocliente:1, 
    constructor: function(config) {
        config.fields = [
            {name: 'iddocumento'},
            {name: 'idordenproduccion' ,type:'int'},
            {name: 'idcliente'},
            {name: 'idcentrogrupo'},
            {name: 'idnomconcepto'},
            {name: 'idcartatecnologica'},
            {name: 'idalmacendestino'},
            {name: 'nrolote'},
            {name: 'tipocliente'},
            {name: 'cantidad'},
            {name: 'cerrado'},
            {name: 'fechainicio'},
            {name: 'fechafin'}
        ];
        LOG.produccion.ordenproduccion.Model.superclass.constructor.call(this, config);
    },    
    adicionarProducto: function (p) {
        var currentIndex = -1;
        this.listaProductos.each(function (_p, index) {
            if (_p.idindicador == p.idindicador) {
                currentIndex = index;
            }
        });
        var pModel = null;
        if (currentIndex == -1) {
            var pModel = new LOG.util.Model({
                fields: [{
                    name: 'idordenmateriales',
                    primary: true
                },
                    {name: 'idindicador'},
                    {name: 'cantidad'},
                    {name: 'idordenproduccion'},
                    {name: 'iddocumento'},
                    {name: 'cantidadsolicitada'}

                ]
            });
        } else {
            pModel = this.listaProductos.getItem(currentIndex);
        }

        pModel.apply(p);
        this.listaProductos.setItem(pModel, currentIndex);
        this.habilitarBotones();
    },/**
     *
     * @returns {Boolean}
     */
    isValid: function() {
        //return true;
        return this.basicForm.isValid();
    },
    /**
     *
     * @param {type} parametros
     * @param {type} _fn
     * @returns {undefined}
     */
    cerrar: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgCerrarDocumento, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.MsgCerrarDocumento, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + 'cerrarDocumento',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgDocumentoCerrado);
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

    adicionarPersona: function (parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.msgSalvandoObjeto, _this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
        Ext.Ajax.request({
            url: _this.urlController + 'adicionarPersona',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.msgPedidoAdicionado);
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