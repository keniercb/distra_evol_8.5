Ext.ns('LOG.produccion');

LOG.produccion.documento.Model = Ext.extend(LOG.lb.documento.Model, {
    /**
     *
     * @param {type} config
     * @returns {undefined}
     */
    tableName:'',
    constructor: function (config) {
        config.fields = [];
        LOG.produccion.documento.Model.superclass.constructor.call(this, config);
        this.urlAccionAprobar = 'aprobarDocumento';
    }
});