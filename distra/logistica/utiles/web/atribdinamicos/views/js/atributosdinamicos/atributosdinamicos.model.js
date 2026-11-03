Ext.ns('LOG.lb.atributosdinamicos');
LOG.lb.atributosdinamicos.Model = Ext.extend(LOG.util.Model, {
    urlAccionAsociar: 'asociarAtributo',
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.urlAccionGuardar = 'adicionarAtributo';
        config.urlAccionEliminar = 'eliminarAtributo';
        config.urlController = '/logistica/utiles/atribdinamicos/index.php/atributosdinamicos/';
        config.fields = [{
                primary: true, name: 'idatributo'
            },
            {name: 'nombre'},
            {name: 'tipodato'},
            {name: 'longitud'},
            {name: 'longitud1'},
            {name: 'obligatorio'},
            {name: 'idtiponomenclador'},
            {name: 'multilinea'},
            {name: 'idexpresionregular'},
            {name: 'precision'},
            {name: 'decimal'},
            {name: 'limitesup'},
            {name: 'limiteinf'}
        ];
        LOG.lb.atributosdinamicos.Model.superclass.constructor.call(this, config);
    },
    /**
     * 
     * @param {Numeric} idagrupacion
     * @param {Numeric} asociar Determina si asocia o no los atributos a la agrupacion
     * @returns {undefined}
     */
    asociarAtributos: function(idagrupacion, asociar, _asociarFn) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgAsociarAtributo, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAsociandoAtributo, _this.idioma.msjLoadMask || '...');
                var idatributos = new Array();
                Ext.each(_this.sm.getSelections(), function(item) {
                    idatributos.push(item.id);
                });
                var objSubmit = {
                    idagrupacion: idagrupacion,
                    idatributos: Ext.encode(idatributos),
                    asociar: asociar
                };
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAsociar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, _this.idioma.msgAributoAsociado);
                            _this.st.reload();
                            if (typeof _asociarFn == 'function') {
                                _asociarFn.createDelegate(this).call();
                            }
                        }
                    }
                });
            }
        });
    }
});


