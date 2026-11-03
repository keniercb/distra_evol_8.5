Ext.ns('LOG.inv.transferenciarea');

LOG.inv.transferenciarea.Model = Ext.extend(LOG.lb.documento.Model, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.urlAccionAdicionarMovTransferencia = 'adicionarMovTransferencia';
        config.fields = [
            {name: 'idareaorigen'},
            {name: 'idareadestino'},
            {name: 'idtipotransferencia'},
            {name: 'tranferencias'}
        ];
        LOG.inv.transferenciarea.Model.superclass.constructor.call(this, config);
    },
    /**
     * 
     * @param {Object} parametros
     * @param {Function} _fn
     * @returns {undefined}
     */
    adicionarMovTransferencia: function (parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: _this.urlAccionAdicionarMovTransferencia,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    mostrarMensaje(1, _this.idioma.msgCantidadSalvada);
                    _this.st.reload();
                }
                if (typeof _fn == 'function') {
                    _fn.createDelegate(this, [o, s, r]).call();
                }
            }.createDelegate(this)
        });
    }
});
