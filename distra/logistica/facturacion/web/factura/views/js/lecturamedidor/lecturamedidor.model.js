Ext.ns('LOG.fac.lecturamedidor');
LOG.fac.lecturamedidor.Model = Ext.extend(LOG.lb.documento.Model, {
    /**
     * @param {Object} config
     */
    constructor: function(config) {
        this.urlAccionContabilizar = 'contabilizarDocumento';
        
        config.fields = [
            {name: 'iddocumento'},
            {name: 'nrodoc'},
            {name: 'servicio'},
            {name: 'idservicio'},
            {name: 'codigocontrato'},
            {name: 'titular'},
            {name: 'clientes'},
            {name: 'producto'},
            {name: 'anno'},
            {name: 'fechacontable', type: 'date', dateFormat: 'd/m/Y'},
            {name: 'rutas'},
            {name: 'estado'},
            {name: 'precio'},
            {name: 'idestado'},
            {name: 'observaciones'},
            {name: 'nofactura'}
        ];
        LOG.fac.lecturamedidor.Model.superclass.constructor.call(this, config);
    },
    /**
     * Contabiliza el documento seleccionado.
     * @param {Object} parametros
     * @param {function} _fn
     * @returns {undefined}
     */
    contabilizar: function(parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgContabilizarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgEspere, _this.idioma.msgContabilizandoObjeto || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                //objSubmit.data = Ext.encode(_this.encode());
                Ext.Ajax.request({
                    url: _this.urlAccionContabilizar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        if (s) {
                            mostrarMensaje(1, _this.idioma.msgDocumentoContabilizado);
                            _this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(_this, [o, s, r]).call();
                        }
                    }.createDelegate(_this)
                });
            }
        });
    },
    /**
     * Adiciona un documento a partir del tipo de documento seleccionado.
     * @param {Object} parametros
     * @param {function} _fnProd
     * @param {function} _fn
     * @param {function} _fnFail
     * @returns {undefined}
     */
    salvarDocumento: function(parametros, _fnProd, _fn, _fnFail) {
        if (this.isValid()) {
            var idestructura = parametros.idestructuracomun;
            parametros.idestructuracomun = null;
            this.cargaInicial(parametros, function(r) {
                var _productos = _fnProd.createDelegate(this, [r]).call();
                this.salvar({
                    idestructuracomun: idestructura,
                    idproductos: Ext.encode(_productos)
                }, _fn, _fnFail);
            });
        } else {
            mostrarMensaje(1, this.idioma.msgDatosIncorrectos);
            _fnFail.createDelegate(this).call();
        }
    }
});