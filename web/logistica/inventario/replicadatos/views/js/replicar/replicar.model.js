Ext.ns('LOG.inv.replicar');

LOG.inv.replicar.Model = Ext.extend(LOG.util.Model, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {        
        this.urlCargarEstructuras = 'obtenerEstructuras';
        LOG.inv.replicar.Model.superclass.constructor.call(this, config);
    },
    /**
     * Constructor de la clase.
     * @param {Object} parametros
     * @param {Function} _fn
     * @returns {undefined}
     */
    cargarEstructuras: function(parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.msgEspere,'');
        var objSubmit = parametros || {};                
        Ext.Ajax.request({
            url: _this.urlCargarEstructuras,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();                
                if (typeof _fn == 'function') {
                    _fn.createDelegate(_this, [o, s, r]).call();
                }
            }.createDelegate(_this)
        });
    }
});