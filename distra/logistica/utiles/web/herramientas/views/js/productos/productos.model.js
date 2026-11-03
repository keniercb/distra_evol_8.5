Ext.ns('LOG.tools.Productos');
LOG.tools.Productos.Model = Ext.extend(LOG.util.Model, {
    primaryKeyField : 'id',
    /**
     *
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.urlAccionGuardar = 'unificar';
        LOG.tools.Productos.Model.superclass.constructor.call(this, config);
    }
});